/* CineTracker Android official 1.0/r312 — one authenticated network gate.
 * Root cause verified from Supabase edge logs: Android WebView sent expired
 * access JWTs (expired 2026-10-21) thousands of times on 2026-10-22.
 * Replace only network entrypoints; leave page modules and DB unchanged.
 */
(()=>{
'use strict';
if(window.__ctR312Transport)return;
const normalApi=api;
const normalTmdb=ct168TmdbBase;
const normalEdge=edge;
let renewal=null, blockedUntil=0, blockedError=null;
let proxyBlockedUntil=0, proxyError=null, authRenewals=0, authFails=0;
let running=0,queue=[],tmdbFailures=0,tmdbSuccesses=0;
const pending=new Map(), concurrency=4, maxQueue=160;
const now=()=>Date.now();
const stamp=()=>Math.floor(now()/1000);
const expired=()=>!session?.access_token || !Number(session.expires_at) || Number(session.expires_at)<=stamp()+90;
function stored(){
 try{return JSON.parse(localStorage.getItem('cinetracker_session')||'null')}catch{return null}
}
function adoptValidSaved(){
 const newer=stored();
 if(!newer?.access_token||!newer?.refresh_token||Number(newer.expires_at)<=stamp()+90)return false;
 const liveId=session?.user?.id||user?.id||'';
 const savedId=newer?.user?.id||'';
 if(liveId&&savedId&&String(liveId)!==String(savedId))return false;
 if(!session?.expires_at||Number(newer.expires_at)>Number(session.expires_at)){
  session=newer;user=newer.user||user;
 }
 return !expired();
}
async function authenticated(force=false){
 if(!force&&!expired())return true;
 if(!force&&adoptValidSaved())return true;
 if(renewal)return renewal;
 if(now()<blockedUntil)throw blockedError||Error('Sessão indisponível. Entre novamente.');
 renewal=(async()=>{
  // Never resend expired Authorization to the refresh endpoint. The identity
  // is checked again before installing the returned rotating refresh token.
  const original=session||stored();
  const refresh=original?.refresh_token||stored()?.refresh_token;
  if(!refresh)throw Error('Sessão expirada. Entre novamente no CineTracker.');
  const identity=String(original?.user?.id||user?.id||'');
  const r=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{
   method:'POST',
   headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({refresh_token:refresh})
  });
  const reply=await r.json().catch(()=>({}));
  if(!r.ok||!reply?.access_token||!reply?.refresh_token)
   throw Error('Não foi possível renovar sua sessão ('+r.status+'). Faça login novamente se continuar.');
  const current=String(session?.user?.id||user?.id||'');
  if(identity&&current&&identity!==current)
   throw Error('A conta foi alterada durante a atualização.');
  saveSession(reply);
  authRenewals++;blockedUntil=0;blockedError=null;
  return true;
 })().catch(error=>{
  // A refresh performed by a previously loaded module may have succeeded
  // concurrently. Do not overwrite a newer, account-matched session.
  if(adoptValidSaved()){blockedUntil=0;blockedError=null;return true}
  blockedError=error;blockedUntil=now()+15000;authFails++;
  throw error;
 }).finally(()=>{renewal=null});
 return renewal;
}
function dispatch(){
 while(running<concurrency&&queue.length){
  const job=queue.shift();running++;
  Promise.resolve().then(job.run).then(job.resolve,job.reject)
   .finally(()=>{running--;dispatch()});
 }
}
function enqueue(path,params,work){
 const key=String(path)+'?'+JSON.stringify(Object.entries(params||{}).sort(([a],[b])=>a.localeCompare(b)));
 if(pending.has(key))return pending.get(key);
 const high=/^\/(?:tv|movie)\/\d+(?:\/|$)/.test(path);
 const priority=high||/^\/(?:discover|trending|movie\/popular|tv\/popular)/.test(path);
 if(queue.length>=maxQueue&&!priority)
  return Promise.reject(Error('Muitas consultas antigas em andamento; tente novamente.'));
 let resolveJob,rejectJob;
 const promise=new Promise((resolve,reject)=>{resolveJob=resolve;rejectJob=reject});
 const job={run:work,resolve:resolveJob,reject:rejectJob};
 if(priority)queue.unshift(job);else queue.push(job);
 pending.set(key,promise);
 promise.finally(()=>{if(pending.get(key)===promise)pending.delete(key)}).catch(()=>{});
 dispatch();return promise;
}
api=async function(path,options){
 await authenticated();
 // Existing PostgREST/RPC function reads the token only AFTER refresh.
 try{return await normalApi(path,options)}
 catch(error){
  const msg=String(error?.message||error);
  if(!/\b(?:401|JWT expired|invalid JWT)\b/i.test(msg))throw error;
  await authenticated(true);
  return normalApi(path,options);
 }
};
edge=async function(name,body,timeout){
 await authenticated();
 return normalEdge(name,body,timeout);
};
tmdb=function(path,params={}){
 return enqueue(path,params,async()=>{
  await authenticated();
  if(now()<proxyBlockedUntil)throw proxyError||Error('TMDB indisponível');
  const sent=session?.access_token;
  try{
   const result=await normalTmdb(path,params);tmdbSuccesses++;
   return result;
  }catch(error){
   tmdbFailures++;
   const msg=String(error?.message||error);
   if(!/TMDB (?:401|403)/.test(msg))throw error;
   // Refresh once per failed token, not once per item. Stop upstream 401
   // storms even if the TMDB provider rejects its own server credentials.
   try{await authenticated(true)}
   catch(e){throw e}
   if(!session?.access_token||session.access_token===sent){
    proxyError=Error('TMDB 401: sessão não renovada; confira seu login.');
    proxyBlockedUntil=now()+20000;throw proxyError;
   }
   try{
    const result=await normalTmdb(path,params);tmdbSuccesses++;
    return result;
   }catch(retryError){
    if(/TMDB (?:401|403)/.test(String(retryError?.message||retryError))){
     proxyError=Error('TMDB 401 após renovar a sessão. Verifique o proxy TMDB.');
     proxyBlockedUntil=now()+20000;
     throw proxyError;
    }
    throw retryError;
   }
  }
 });
};
window.addEventListener('pageshow',()=>{if(session?.access_token)void authenticated().catch(()=>{})});
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&session?.access_token)void authenticated().catch(()=>{});
});
window.__ctR312Transport={
 ensure:authenticated,
 stats:()=>({authRenewals,authFails,queue:queue.length,running,tmdbFailures,tmdbSuccesses,
  blockedUntil,proxyBlockedUntil,expiresAt:session?.expires_at||null}),
 scope:'Android authenticated transport only'
};
})();
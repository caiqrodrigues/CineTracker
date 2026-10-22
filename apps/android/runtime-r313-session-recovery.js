/* CineTracker official Android 1.0/r313 — safe recovery from revoked refresh token.
 * The r312 transport gate owns refresh. The old bootstrap must not issue
 * a second refresh or return success after authorization fails.
 */
(()=>{
'use strict';
if(window.__ctR313Session)return;
let forcedLogins=0,restores=0,failures=0,prompted=false,lastError='';
function stored(){
 try{return JSON.parse(localStorage.getItem('cinetracker_session')||'null')}catch{return null}
}
function invalidate(expectedToken,reason='refresh-token-revoked'){
 const live=String(session?.access_token||'');
 const cache=String(stored()?.access_token||'');
 const expected=String(expectedToken||'');
 // Never erase a new session that won the refresh/login race.
 if((live&&live!==expected)||(cache&&cache!==expected))return false;
 if(prompted&&!live)return true;
 lastError=reason;
 prompted=true;forcedLogins++;
 try{localStorage.removeItem('cinetracker_session')}catch{}
 session=null;user=null;
 // Only volatile in-memory snapshots are cleared. Never erase watch
 // history, watchlist or local persisted movie/series preferences.
 homeCache=null;profileCache=null;sportsCache=null;
 try{discoverCache?.clear?.()}catch{}
 navSeq++;
 if(location.pathname!=='/')history.replaceState({},'','/');
 queueMicrotask(()=>{
  if(session?.access_token)return;
  void Promise.resolve(renderAuth()).then(()=>{
   const notice=document.querySelector('.login-card .notice');
   if(notice)notice.textContent='Sua sessão expirou. Entre novamente para sincronizar sua biblioteca.';
  }).catch(()=>{});
 });
 return true;
}
restoreSession=async function restoreSession313(){
 restores++;
 let current=stored();
 if(!current?.access_token){session=null;user=null;return false}
 session=current;
 user=current.user||user;
 try{
  // Do not let the legacy bootstrap and the authenticated transport
  // consume the same rotating refresh token in parallel.
  await window.__ctR312Transport.ensure(false);
  if(!session?.access_token)return false;
  const getUser=()=>fetch(SUPABASE_URL+'/auth/v1/user',{headers:headers()});
  let response=await getUser();
  if(response.status===401){
   await window.__ctR312Transport.ensure(true);
   if(!session?.access_token)return false;
   response=await getUser();
   if(response.status===401){
    invalidate(session.access_token,'auth-user-401');
    return false;
   }
  }
  if(response.ok){
   user=await response.json();
   prompted=false;
   return true;
  }
  // Temporary service outage must not delete a potentially recoverable
  // session. Existing screen-level retry logic remains available.
  lastError='user-request-'+response.status;
  return true;
 }catch(error){
  failures++;lastError=String(error?.message||error);
  // A permanent 400 in the transport revokes only auth state and sends
  // the user to a real login form, rather than a broken Home.
  if(!session?.access_token)return false;
  // Offline/transient errors retain local session, never claim an
  // authenticated server result; transport will reject network actions.
  return true;
 }
};
window.__ctR313Session={
 invalidate,
 stats:()=>({restores,forcedLogins,failures,lastError,prompted,authenticated:!!session?.access_token}),
 scope:'Android session bootstrap and revoked-token recovery only'
};
})();
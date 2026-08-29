(() => {
'use strict';
if(window.__ct0997BootGate141Loaded)return;
window.__ct0997BootGate141Loaded=true;
window.__ct0997BootGate141='r141-boot-quarantine-primary-bypass';
window.__ctPrimaryBootQuarantine=true;
// Os guards introduzidos no v120/v124/v126/r131/r134 consultam este marcador.
// Ligá-lo antes do bootstrap impede uma segunda autoridade de iniciar.
window.__ct0997StablePrimary137Loaded=true;

const nativeFetch=window.fetch.bind(window);
const cache=new Map();
const inflight=new Map();
const queue=[];
let running=0;
const MAX_HEAVY=1;
const TTL=45000;
const OLD_ONLY=new Set([
  'cinetracker_home_live_v0997',
  'cinetracker_profile_home_payload_v0994',
  'cinetracker_profile_home_dashboard_v0992',
  'cinetracker_profile_remaining_v0994',
  'cinetracker_home_live_v0997_r2'
]);
const HEAVY=new Set([
  ...OLD_ONLY,
  'cinetracker_profile_payload_v0997',
  'cinetracker_profile_media_dashboard_v0991',
  'cinetracker_discovery_exclusions_v0994'
]);

function urlOf(input){try{return typeof input==='string'?input:String(input?.url||input)}catch{return''}}
function requestHeaders(input,init){try{return new Headers(init?.headers||input?.headers||{})}catch{return new Headers()}}
// Todo runtime primary versionado (r138, r139, r140, r141...) é autoridade.
// Scripts legados não enviam X-CT-Primary.
function primaryBypass(input,init){const h=requestHeaders(input,init);return /^r\d{3}$/i.test(h.get('X-CT-Primary')||'')}
function rpcName(url){const m=String(url).match(/\/rest\/v1\/rpc\/([^?/#]+)/);return m?decodeURIComponent(m[1]):''}
function jsonResponse(value,status=200){return Promise.resolve(new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','X-CT-Network-Gate':'r141'}}))}
function legacyShape(name){if(name.includes('home'))return{series:[],movie_watchlist:[],history_episodes:[],history_movies:[],_ct138LegacySuppressed:true};if(name.includes('dashboard'))return[];return{} }
function exactLegacyEpisodeQuery(url){const u=String(url);return u.includes('/rest/v1/episode_progress?')&&u.includes('watched=eq.true')&&(u.includes('media%3Amedia%28*%29')||u.includes('media:media(*)'))}
function cloneStored(x){return new Response(x.body,{status:x.status,statusText:x.statusText,headers:x.headers})}
async function storeResponse(key,res){const body=await res.clone().text();const headers={};res.headers.forEach((v,k)=>headers[k]=v);const item={at:Date.now(),status:res.status,statusText:res.statusText,headers,body};if(res.ok)cache.set(key,item);return res}
function pump(){while(running<MAX_HEAVY&&queue.length){const task=queue.shift();running++;nativeFetch(task.input,task.init).then(r=>storeResponse(task.key,r)).then(r=>task.resolve(r)).catch(task.reject).finally(()=>{running--;inflight.delete(task.key);pump()})}}
function heavyFetch(input,init,url,bypass){const method=String(init?.method||input?.method||'GET').toUpperCase();const body=typeof init?.body==='string'?init.body:'';const key=`${method}|${url}|${body}`;const hit=cache.get(key);if(hit&&Date.now()-hit.at<TTL)return Promise.resolve(cloneStored(hit));if(inflight.has(key))return inflight.get(key).then(r=>r.clone());let resolve,reject;const p=new Promise((res,rej)=>{resolve=res;reject=rej});inflight.set(key,p);const task={input,init,key,resolve,reject};if(bypass)queue.unshift(task);else queue.push(task);pump();return p.then(r=>r.clone())}

window.fetch=function ct141Fetch(input,init={}){
  const url=urlOf(input),bypass=primaryBypass(input,init),name=rpcName(url);
  if(url.includes('/functions/v1/ct-enrich-media-user'))return jsonResponse({ok:true,skipped:true,reason:'r141-primary-runtime'});
  if(exactLegacyEpisodeQuery(url)&&!bypass)return jsonResponse([]);
  if(name&&OLD_ONLY.has(name)&&!bypass)return jsonResponse(legacyShape(name));
  if(name&&HEAVY.has(name))return heavyFetch(input,init,url,bypass);
  return nativeFetch(input,init);
};
window.__ct141NativeFetch=nativeFetch;
})();

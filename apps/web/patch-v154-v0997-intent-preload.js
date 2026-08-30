(() => {
'use strict';
if(window.__ct0997IntentPreload154Loaded)return;
window.__ct0997IntentPreload154Loaded=true;
window.__ct0997IntentPreload154='r154-intent-only';

const PROFILE_RPC='cinetracker_profile_payload_v0997';
const DASH_RPC='cinetracker_profile_media_dashboard_v0991';
const EX_RPC='cinetracker_discovery_exclusions_v0994';
const pending=new Map();

function tz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}}
function currentRpc(){const p=window.__ct0997PersistentPreloadRpc;if(typeof p==='function')return p;const s=window.sbRpc;return typeof s==='function'?s:null}
function once(name,body={}){
  const rpc=currentRpc();if(!rpc)return Promise.resolve(null);
  let key='';try{key=name+'|'+JSON.stringify(body||{})}catch{key=name}
  if(pending.has(key))return pending.get(key);
  const p=Promise.resolve(rpc(name,body)).catch(()=>null).finally(()=>pending.delete(key));
  pending.set(key,p);return p;
}
function warmTarget(target){
  const t=String(target||'').replace('history','profile');
  if(t==='home')return once('cinetracker_home_live_v0997_r2',{});
  if(t==='profile')return once(PROFILE_RPC,{p_tz:tz()});
  if(t==='discover')return Promise.allSettled([once(DASH_RPC,{}),once(EX_RPC,{})]);
  return Promise.resolve(null);
}
function navTarget(el){
  const d=String(el?.dataset?.ct120Nav||el?.dataset?.view||el?.dataset?.view991||'').toLowerCase();
  if(['home','discover','profile','settings'].includes(d))return d;
  const s=String(el?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(s.includes('descobrir'))return'discover';if(s.includes('perfil'))return'profile';if(s.includes('home'))return'home';if(s.includes('config'))return'settings';return'';
}
function intent(e){const el=e.target?.closest?.('[data-ct120-nav],[data-view],[data-view991],.sidebar a,.sidebar button,.mobile-nav a,.mobile-nav button');if(!el)return;const t=navTarget(el);if(t)void warmTarget(t)}
document.addEventListener('pointerover',intent,true);
document.addEventListener('touchstart',intent,{capture:true,passive:true});
document.addEventListener('focusin',intent,true);
window.__ct0997PreloadRoute=target=>{void warmTarget(target);return true};
window.__ct0997PreloadDiscoverTab=()=>{void warmTarget('discover');return Promise.resolve(true)};
})();

/* CineTracker Android 1.0.38 / r280 — visible Profile and resilient server-audited Pra Você.
   Scope: Android only. Original Web r541 and sports/Home/watch mutations preserved. */
(()=>{
'use strict';
if(window.__ctR280AndroidV1038)return;
window.__ctR280AndroidV1038='profile-fast-visible+foryou-audit-recovery+no-background-rpc-storm';
const q=(s,root=document)=>root?.querySelector?.(s)||null;
const owner=()=>String(session?.user?.id||user?.id||'');
const profileKey=()=> 'ct280:profile:'+owner();
const profileVisible=()=>Boolean(session&&route()==='profile');
const profileValid=x=>Boolean(x&&typeof x==='object'&&
 (Array.isArray(x.dashboard)&&x.dashboard.length>0||
  Number(x.stats?.episodes_watched||0)>0||Number(x.stats?.movies_watched||0)>0||
  Number(x.stats?.total_minutes||0)>0||
  Number(x.sports_stats?.watched_events||0)>0));
function readProfile(){
 if(!owner())return null;
 try{
  const saved=JSON.parse(localStorage.getItem(profileKey())||'null');
  if(saved?.owner===owner()&&Date.now()-Number(saved.at||0)<7*86400000&&profileValid(saved.data))return saved.data;
 }catch{}
 return null;
}
const profilePaintBase=ct168PaintProfile;
ct168PaintProfile=function(data,note){
 const out=profilePaintBase.apply(this,arguments);
 if(profileVisible()&&owner()&&profileValid(data)){
  try{
   const payload={...data};
   // Save only a bounded copy for a user-scoped first paint. Avoid persisting
   // the entire activity/playback history or unrelated authentication state.
   if(Array.isArray(payload.dashboard))payload.dashboard=payload.dashboard.slice(0,160);
   if(Array.isArray(payload.favorite_actors))payload.favorite_actors=payload.favorite_actors.slice(0,30);
   if(Array.isArray(payload.activity))payload.activity=payload.activity.slice(-32);
   localStorage.setItem(profileKey(),JSON.stringify({owner:owner(),at:Date.now(),data:payload}));
  }catch{}
 }
 return out;
};
const renderProfileBase=renderProfile;
let profileRescue=null,profileRescueKey='';
const isProfilePending=()=>{
 const root=q('[data-profile]');
 return Boolean(root&&(!q('.stats',root)||q('.ct280-profile-status',root)));
};
function profileStatus(message){
 const root=q('[data-profile]');if(!root||q('.stats',root))return;
 root.innerHTML='<section class="panel ct280-profile-status"><div class="panel-head"><h2>Perfil</h2><small>Sincronização protegida</small></div>'+
 '<p>'+String(message).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</p>'+
 '<div class="actions"><button type="button" class="btn" data-ct280-profile-retry>Tentar novamente</button></div></section>';
}
async function rescueProfile(seq,identity){
 if(!profileVisible()||seq!==navSeq||owner()!==identity||!isProfilePending())return;
 profileStatus('Aguardando a sincronização das estatísticas. Seus dados não foram zerados.');
 if(profileRescue&&profileRescueKey===identity)return profileRescue;
 profileRescueKey=identity;
 profileRescue=(async()=>{
  const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('profile-summary-timeout')),8500));
  const d=await Promise.race([rpc('cinetracker_profile_screen_v495',{p_tz:tz()}),timeout]);
  if(!profileVisible()||seq!==navSeq||owner()!==identity||!d?.stats)return;
  const existing=readProfile()||profileCache||{};
  const merged=ct168MergeQuick(existing,{stats:d.stats,series_stats:d.series_stats,remaining:d.remaining,sports_stats:d.sports||d.sports_stats||{}});
  if(Array.isArray(d.activity)&&(!Array.isArray(merged.activity)||merged.activity.length===0))merged.activity=d.activity;
  profileCache=merged;
  ct168PaintProfile(merged,'Biblioteca completa atualizando em segundo plano.');
  return merged;
 })().catch(()=>{
  if(profileVisible()&&seq===navSeq&&owner()===identity&&isProfilePending())
   profileStatus('Não foi possível consultar o servidor agora. Use “Tentar novamente” sem sair desta tela.');
  return null;
 }).finally(()=>{profileRescue=null});
 return profileRescue;
}
renderProfile=function(seq){
 const identity=owner();
 // The r168/r185 owners continue to load full library and activity.
 // Start them normally, but never keep the visible Profile blocked on a slow RPC.
 const operation=Promise.resolve().then(()=>renderProfileBase(seq));
 queueMicrotask(()=>{
  if(!profileVisible()||seq!==navSeq||owner()!==identity)return;
  const cached=readProfile();
  if(cached&&isProfilePending()){
   try{ct168PaintProfile(cached,'Mostrando seus últimos dados enquanto sincroniza.')}catch{}
  }
 });
 setTimeout(()=>{if(profileVisible()&&seq===navSeq&&owner()===identity)void rescueProfile(seq,identity)},3700);
 void operation.catch(error=>{
  if(profileVisible()&&seq===navSeq&&owner()===identity&&isProfilePending())profileStatus('Não foi possível carregar o Perfil: '+String(error?.message||error));
 });
 return operation;
};
document.addEventListener('click',event=>{
 const btn=event.target?.closest?.('[data-ct280-profile-retry]');
 if(!btn||!profileVisible())return;
 event.preventDefault();event.stopImmediatePropagation();
 btn.disabled=true;
 void renderProfile(navSeq);
},true);

/* The r279 server gate remains fail closed: no media item is displayed unless
   v525 explicitly cleared its personal watched/Watchlist state. A failed batch
   must not DELETE the original candidate pool; subsequent retry can audit it. */
function auditBanner(){
 if(route()!=='discover'||discoverState?.tab!=='foryou')return;
 const root=q('[data-discover-content]');if(!root)return;
 const data=ct186ForYouData;
 const partial=Boolean(data?._ct280AuditPartial);
 let banner=q('[data-ct280-audit-banner]',root);
 if(!partial){banner?.remove();return}
 if(!banner){
  banner=document.createElement('div');banner.dataset.ct280AuditBanner='1';
  banner.className='notice ct280-audit-banner';
  root.prepend(banner);
 }
 banner.innerHTML='A verificação das indicações ainda não terminou. Os títulos não validados ficam ocultos. '+
 '<button type="button" class="btn btn-secondary" data-ct280-audit-retry>Verificar novamente</button>';
}
let auditRetryBusy=false;
document.addEventListener('click',event=>{
 const btn=event.target?.closest?.('[data-ct280-audit-retry]');
 if(!btn||auditRetryBusy||route()!=='discover')return;
 event.preventDefault();event.stopImmediatePropagation();
 const data=ct186ForYouData;
 if(!data)return;
 auditRetryBusy=true;btn.disabled=true;
 void window.__ctR279Audit?.auditData(data).then(d=>{
  if(route()==='discover'&&discoverState?.tab==='foryou'){paintDiscover(d);auditBanner()}
 }).catch(()=>{}).finally(()=>{auditRetryBusy=false;if(btn.isConnected)btn.disabled=false});
},true);
const paintBase=paintDiscover;
paintDiscover=function(...args){
 const result=paintBase.apply(this,args);
 if(route()==='discover'&&discoverState?.tab==='foryou')requestAnimationFrame(auditBanner);
 return result;
};
const style=document.createElement('style');style.id='ct280-scope';
style.textContent=[
 '[data-profile] .ct280-profile-status{min-height:160px!important;padding:18px!important}',
 '[data-profile] .ct280-profile-status p{line-height:1.5!important;white-space:normal!important}',
 '[data-discover-content] .ct280-audit-banner{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:8px!important;font-size:12px!important;padding:12px!important;line-height:1.5!important}',
 '[data-discover-content] .ct280-audit-banner button{min-height:30px!important;white-space:normal!important}',
 'html[data-ct279-audit="pending"] [data-discover-content] [data-ct241-section] .discover-card{visibility:hidden!important}'
].join('\n');document.head.appendChild(style);
window.__ctR280Test={profileValid,readProfile,auditBanner,profileStatus};
})();
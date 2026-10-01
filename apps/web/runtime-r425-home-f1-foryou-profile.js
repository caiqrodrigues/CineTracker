/* CineTracker Web 1.0.216 r425 — Home first paint, F1 total, local Pra Você mutations and canonical Profile stats. */
(()=>{
'use strict';
if(window.__ctR425?.version==='1.0.216')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const F1_MEDIA=865,F1_TOTAL=1280;
let rawRpc=null,rpcBound=false,suppressData=false,actionLock=false;
function bindRpc425(){
 if(rpcBound||typeof rpc!=='function')return true;
 rawRpc=rpc;rpc=async function(name,args){
  const n=String(name||'');
  if(n==='cinetracker_sport_stats_v1'||n==='cinetracker_sport_stats_v420')return rawRpc('cinetracker_sport_stats_v421',args);
  return rawRpc(name,args);
 };rpcBound=true;return true;
}
function normalizeF1Home425(){
 if(routeNow()!=='home')return false;
 try{const list=window.__ctR388?.home?.series||[],row=list.find(x=>Number(x?.media_id||0)===F1_MEDIA);if(!row)return false;
  const watched=Math.max(0,Number(row.watched_episodes||0));row.total_episodes=F1_TOTAL;row.released_episodes=Math.max(F1_TOTAL,Number(row.released_episodes||0));row.available_episodes=Math.max(0,F1_TOTAL-watched);row.__ct425_f1_total=true;
  window.__ctR388?.renderSeries?.();return true;
 }catch{return false}
}
function revealHome425(){
 if(routeNow()!=='home')return false;const view=q('[data-home-view="series"]');
 if(view){view.style.visibility='visible';view.style.opacity='1';view.removeAttribute('aria-hidden');view.dataset.ct425HomeReady='1'}
 delete document.documentElement.dataset.ct424HomeEntering;delete document.documentElement.dataset.ct417HomeEntering;normalizeF1Home425();return true;
}
function homeEntry425(){if(routeNow()!=='home')return;try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{};for(const ms of[0,40,120,250,600,1200])setTimeout(revealHome425,ms)}
function current425(st,name){
 if(!st)return null;if(name==='daily'){const p=rows(st.daily);return p[Number(st.dailyIndex||0)%Math.max(1,p.length)]||null}
 const [b,k]=String(name||'').split(':'),p=rows(st?.[b]?.[k]),i=Number(st?.[b+'Index']?.[k]??st?.idx?.[b]?.[k]??0);return p[i%Math.max(1,p.length)]||null;
}
function key425(x){const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);if(!(id>0))return'';return(String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv')+':'+id}
function clone425(st){try{return structuredClone(st)}catch{return JSON.parse(JSON.stringify(st))}}
function remove425(st,action,key){
 if(action==='seen'){st.daily=rows(st.daily).filter(x=>key425(x)!==key);for(const b of['watch','fresh'])for(const k of['movie','series','anime'])st[b][k]=rows(st[b]?.[k]).filter(x=>key425(x)!==key)}
 else if(action==='watchlist'){st.daily=rows(st.daily).filter(x=>key425(x)!==key);for(const k of['movie','series','anime'])st.fresh[k]=rows(st.fresh?.[k]).filter(x=>key425(x)!==key)}
 else return false;
 st.dailyIndex=0;for(const b of['watch','fresh'])for(const k of['movie','series','anime']){if(st[b+'Index'])st[b+'Index'][k]=0;if(st.idx?.[b])st.idx[b][k]=0}return true;
}
async function doAction425(action,name,key){
 if(actionLock)return false;const api=window.__ctR411,st=api?.getForYou?.();if(!st)return false;
 const before=clone425(st),item=current425(st,name),resolved=key||key425(item);if(!resolved)return false;actionLock=true;
 try{
  if(action==='swap')return !!api.swap?.(name);
  if(!remove425(st,action,resolved))return false;
  suppressData=true;
  let replaced=false;try{replaced=!!api.swap?.(name)}catch{}
  if(!replaced)api.renderForYou?.(false);
  await (window.__ctR365?.persistDirect?window.__ctR365.persistDirect(action,resolved):Promise.reject(new Error('Persistência indisponível')));
  return true;
 }catch(e){
  try{const target=api.getForYou?.();if(target&&before){for(const k of Object.keys(target))delete target[k];Object.assign(target,before)}api.renderForYou?.(false)}catch{}
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}return false;
 }finally{suppressData=false;actionLock=false}
}
function handleEarly425(m){if(routeNow()!=='discover'||!m)return false;void doAction425(String(m.action||''),String(m.name||''),String(m.key||''));return true}
function handleR411Action425(action,name){if(routeNow()!=='discover')return false;const st=window.__ctR411?.getForYou?.(),item=current425(st,name);void doAction425(String(action||''),String(name||''),key425(item));return true}
function profileCanonical425(){bindRpc425();if(routeNow()==='profile')void window.__ctR424?.loadProfile?.()}
window.addEventListener('cinetracker:data-changed',e=>{
 if(suppressData&&routeNow()==='discover'){e.stopImmediatePropagation();e.preventDefault();return}
 if(routeNow()==='profile'){e.stopImmediatePropagation();e.preventDefault();profileCanonical425()}
},true);
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;if(t.closest('[data-nav="home"],[data-home-tab]'))setTimeout(homeEntry425,0);if(t.closest('[data-nav="profile"]'))setTimeout(profileCanonical425,0)},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')homeEntry425();if(routeNow()==='profile')profileCanonical425()},0));
bindRpc425();queueMicrotask(()=>{bindRpc425();if(routeNow()==='home')homeEntry425();if(routeNow()==='profile')profileCanonical425()});
window.__ctR425={version:'1.0.216',f1Total:F1_TOTAL,normalizeF1Home:normalizeF1Home425,revealHome:revealHome425,handleEarly:handleEarly425,handleR411Action:handleR411Action425,profileCanonical:profileCanonical425,get suppressData(){return suppressData}};
window.__ctR425Marker='home-no-blank+f1-1280+foryou-single-slot-optimistic+profile-sports-canonical';
})();
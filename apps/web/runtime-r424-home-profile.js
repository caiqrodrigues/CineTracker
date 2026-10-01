/* CineTracker Web 1.0.215 r424 — Home series/F1 entry, Profile time authority and vertical profile lists. */
(()=>{
'use strict';
if(window.__ctR424?.version==='1.0.215')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const activeHome=()=>{try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}};
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?v[0]:v&&typeof v==='object'&&v.data&&typeof v.data==='object'?v.data:v;
function fmtTime424(minutes){
 const total=Math.max(0,Math.floor(num(minutes))),days=Math.floor(total/1440),hours=Math.floor((total%1440)/60),mins=total%60;
 return days>0?String(days)+'D '+String(hours).padStart(2,'0')+'H '+String(mins).padStart(2,'0')+'M':String(hours).padStart(2,'0')+'H '+String(mins).padStart(2,'0')+'M';
}
function patchVisibleProfileStats424(stats,sports){
 if(routeNow()!=='profile')return false;
 const root=q('[data-profile]');if(!root)return false;
 let changed=false;
 for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){
  const label=norm(q('small,label,.stat-label,.label',card)?.textContent||''),value=q('b,strong,.value,.stat-value',card);
  if(!value||!label.includes('tempo'))continue;
  if(label.includes('serie')&&!label.includes('watchlist')){value.textContent=fmtTime424(stats?.series_minutes);changed=true}
  else if(label.includes('filme')&&!label.includes('watchlist')){value.textContent=fmtTime424(stats?.movie_minutes);changed=true}
  else if(label.includes('total')){value.textContent=fmtTime424(stats?.total_minutes);changed=true}
 }
 const main=qa('section.panel,.panel',root).find(p=>/estatisticas/.test(norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'')));
 if(main){
  if(stats?.series_minutes!=null)main.dataset.ct424SeriesMinutes=String(stats.series_minutes);
  if(stats?.movie_minutes!=null)main.dataset.ct424MovieMinutes=String(stats.movie_minutes);
  if(stats?.total_minutes!=null)main.dataset.ct424TotalMinutes=String(stats.total_minutes);
  main.dataset.ct424StatsAuthority='profile_stats';
 }
 if(sports&&typeof sports==='object'){
  const panel=qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'));
  if(panel)for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',panel)){
   const label=norm(q('small,label,.stat-label,.label',card)?.textContent||''),value=q('b,strong,.value,.stat-value',card);
   if(!value)continue;
   if(label==='tempo assistido'){value.textContent=fmtTime424(sports.sports_minutes);changed=true}
   if(label==='eventos assistidos'){value.textContent=num(sports.watched_events).toLocaleString('pt-BR');changed=true}
  }
 }
 try{
  const merged={...(typeof profileCache==='object'&&profileCache?profileCache:{}),stats:{...((typeof profileCache==='object'&&profileCache&&profileCache.stats)||{}),...(stats||{})},sports_stats:{...((typeof profileCache==='object'&&profileCache&&profileCache.sports_stats)||{}),...(sports||{})}};
  if(typeof window.__ctR238ProfileStats==='function')window.__ctR238ProfileStats(merged);
 }catch{}
 return changed;
}
function normalizeProfileLists424(){
 if(routeNow()!=='profile')return false;
 const root=q('[data-profile]');if(!root)return false;
 let changed=false;
 for(const panel of qa('section.panel,.panel',root)){
  const heading=norm(q('.panel-head h2,.panel-head h3,h2,h3',panel)?.textContent||'');
  if(!/(serie|filme)/.test(heading))continue;
  const row=q(':scope>.row',panel);if(!row)continue;
  row.classList.add('ct424-profile-list');
  Object.assign(row.style,{display:'flex',flexFlow:'row wrap',alignItems:'flex-start',alignContent:'flex-start',gap:'16px',width:'100%',maxWidth:'100%',minWidth:'0',height:'auto',maxHeight:'none',overflowX:'visible',overflowY:'visible',padding:'2px 0 12px'});
  const cards=qa(':scope>.card',row);
  cards.forEach(card=>Object.assign(card.style,{boxSizing:'border-box',flex:'0 0 150px',width:'150px',minWidth:'150px',maxWidth:'150px',height:'auto',overflow:'visible'}));
  const old=row.parentElement?.querySelector?.(':scope>[data-ct424-more]');if(old)old.remove();
  if(cards.length>12){
   cards.forEach((card,i)=>{card.hidden=i>=12});
   const more=document.createElement('button');more.type='button';more.dataset.ct424More='1';more.className='ct424-profile-more';more.textContent='Ver mais';
   more.addEventListener('click',()=>{cards.forEach(card=>{card.hidden=false});more.remove()});
   row.insertAdjacentElement('afterend',more);
  }else cards.forEach(card=>{card.hidden=false});
  changed=true;
 }
 return changed;
}
let profileTask424=null,profileRun424=0;
async function loadProfile424(){
 if(routeNow()!=='profile')return null;
 if(profileTask424)return profileTask424;
 const run=++profileRun424;
 profileTask424=(async()=>{
  const [statsRaw,sportsRaw]=await Promise.all([
   timeout(rpc('cinetracker_profile_stats',{}),5000).catch(()=>null),
   timeout(rpc('cinetracker_sport_stats_v421',{}),5000).catch(()=>null)
  ]);
  const stats=unwrap(statsRaw),sports=unwrap(sportsRaw);
  if(run!==profileRun424||routeNow()!=='profile')return{stats,sports};
  patchVisibleProfileStats424(stats,sports);normalizeProfileLists424();return{stats,sports};
 })().finally(()=>{profileTask424=null});
 return profileTask424;
}
let homeGate424=0;
function homeScrollRoots424(target){
 const out=[];let p=target?.parentElement;
 while(p&&p!==document.body&&p!==document.documentElement){
  try{const cs=getComputedStyle(p);if((/auto|scroll/.test(String(cs.overflowY||''))||p.scrollHeight>p.clientHeight+2)&&p.scrollHeight>p.clientHeight+2)out.push(p)}catch{}
  p=p.parentElement;
 }
 return out;
}
function hideHomeSeries424(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 view.dataset.ct424HomeGate='1';view.style.visibility='hidden';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 for(const el of homeScrollRoots424(view))try{el.scrollTop=0}catch{}
 return true;
}
function revealHomeSeries424(token){
 const view=q('[data-home-view="series"]');if(!view||token!==homeGate424)return false;
 view.style.visibility='visible';view.dataset.ct424HomeReady='1';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 const align=window.__ctR399?.alignHome;
 if(typeof align==='function')requestAnimationFrame(()=>{try{align('series',Date.now())}catch{}});
 return true;
}
async function gateHomeSeries424(){
 if(routeNow()!=='home'||activeHome()!=='series')return false;
 const token=++homeGate424;hideHomeSeries424();
 try{await timeout(Promise.resolve(window.__ctR399?.refreshSeries?.(true)),5200)}catch{}
 if(routeNow()==='home'&&activeHome()==='series')revealHomeSeries424(token);
 return true;
}
function injectProfileStyle424(){
 if(q('#ct424-profile-style'))return;
 const style=document.createElement('style');style.id='ct424-profile-style';
 style.textContent='[data-page="profile"] [data-profile] .ct424-profile-list{display:flex!important;flex-flow:row wrap!important;align-items:flex-start!important;align-content:flex-start!important;width:100%!important;max-width:100%!important;min-width:0!important;max-height:none!important;overflow-x:visible!important;overflow-y:visible!important;gap:16px!important;padding:2px 0 12px!important}[data-page="profile"] [data-profile] .ct424-profile-list>.card{flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important;overflow:visible!important}[data-page="profile"] [data-profile] .ct424-profile-more{display:block!important;width:100%!important;margin:4px 0 16px!important;padding:10px 16px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:12px!important;background:rgba(255,255,255,.06)!important;color:inherit!important;cursor:pointer!important}';
 document.head.appendChild(style);
}
function boot424(){injectProfileStyle424();if(routeNow()==='profile')void loadProfile424();if(routeNow()==='home'&&activeHome()==='series')void gateHomeSeries424()}
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 if(t.closest('[data-nav="home"]')){if(activeHome()==='series')setTimeout(()=>void gateHomeSeries424(),0);return}
 if(routeNow()==='home'&&t.closest('[data-home-tab]')){const kind=String(t.closest('[data-home-tab]')?.dataset?.homeTab||'series')==='movies'?'movies':'series';if(kind==='series')setTimeout(()=>void gateHomeSeries424(),0)}
 if(t.closest('[data-nav="profile"]'))setTimeout(()=>void loadProfile424(),0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')void loadProfile424();if(routeNow()==='home'&&activeHome()==='series')void gateHomeSeries424()},0));
window.addEventListener('cinetracker:data-changed',e=>{if(routeNow()==='profile')void loadProfile424();if(routeNow()==='home'&&activeHome()==='series'&&String(e?.detail?.media_id||'')==='865')void gateHomeSeries424()});
window.addEventListener('cinetracker:f1-watched-changed',()=>{if(routeNow()==='profile')void loadProfile424()});
window.__ctR424={version:'1.0.215',scope:'home-series-f1+profile-time-authority+profile-vertical-lists',loadProfile:loadProfile424,normalizeProfileLists:normalizeProfileLists424,gateHomeSeries:gateHomeSeries424};
queueMicrotask(boot424);
})();
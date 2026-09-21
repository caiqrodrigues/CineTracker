/* CineTracker Web 1.0.123 r332 — Home Watchlist truth + stable Discover layout. */
(()=>{
'use strict';
if(window.__ctR332?.version==='1.0.123')return;
window.__ctR332Marker='home-v332-watchlist+natural-history+foryou-compact+top10-ten-grid-no-looke-mubi';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,p,v)=>{try{el?.style?.setProperty(p,v,'important')}catch{}};
let testBridge=null,homeTask=null,anchorSeq=0,fyKind332='all';

async function fetchHome332(){
 if(testBridge?.homePayload)return testBridge.homePayload();
 if(typeof rpc!=='function')throw new Error('Sessão da Home indisponível.');
 const data=await rpc('cinetracker_home_payload_v332',{
  p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10),
  p_history_limit:50,p_series_limit:120,p_movie_limit:120
 });
 return typeof ct274NormalizeHomePayload==='function'?ct274NormalizeHomePayload(data):data;
}
try{ct274FetchHome=fetchHome332}catch{}

function homeTab332(){try{return typeof ct266CurrentHomeTab==='function'&&ct266CurrentHomeTab()==='movies'?'movies':'series'}catch{return'series'}}
function homeView332(){
 const root=q('[data-home]');if(!root)return null;
 const tab=homeTab332();
 return q('[data-home-view="'+tab+'"]',root)||qa('[data-home-view]',root).find(v=>!v.classList.contains('hidden'))||null;
}
function normalizeHomeHistory332(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed','is-open','ct324-history-collapsed','ct324-history-open','ct330-history-scroll');
  sec.dataset.ct332History='natural';
  for(const b of qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct326-history-toggle],[data-ct327-history-toggle],[data-ct330-history-toggle]',sec))b.remove();
  imp(sec,'display','block');imp(sec,'height','auto');imp(sec,'max-height','none');imp(sec,'overflow','visible');
  const shell=q('.ct275-history-shell',sec);
  if(shell){
   shell.setAttribute('aria-hidden','false');imp(shell,'display','block');imp(shell,'height','auto');imp(shell,'max-height','none');
   imp(shell,'overflow','visible');imp(shell,'opacity','1');imp(shell,'transform','none');imp(shell,'pointer-events','auto');
  }
  const stack=q('.ct274-history-stack',sec);
  if(stack){
   stack.setAttribute('aria-hidden','false');imp(stack,'display','block');imp(stack,'height','auto');imp(stack,'max-height','none');
   imp(stack,'overflow','visible');imp(stack,'overflow-x','visible');imp(stack,'overflow-y','visible');imp(stack,'padding-right','0');imp(stack,'scrollbar-gutter','auto');
   try{stack.scrollTop=0}catch{}
  }
 }
 return found;
}
function homeAnchorTarget332(){
 const view=homeView332();if(!view)return null;
 const hist=q(':scope > [data-ct274-history]',view);
 if(hist?.nextElementSibling)return hist.nextElementSibling;
 return qa(':scope > .home-section',view).find(sec=>!sec.matches('[data-ct274-history]'))||null;
}
function anchorHome332(){
 if(routeNow()!=='home')return false;
 normalizeHomeHistory332();
 const target=homeAnchorTarget332();if(!target)return false;
 const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-10);
 try{window.scrollTo({top,left:0,behavior:'auto'})}catch{window.scrollTo(0,top)}
 return true;
}
function scheduleAnchor332(){
 const seq=++anchorSeq,run=()=>{if(seq===anchorSeq&&routeNow()==='home')anchorHome332()};
 requestAnimationFrame(()=>requestAnimationFrame(run));
 for(const ms of [80,240,650])setTimeout(run,ms);
}
try{ct274AutoBottom=function(){normalizeHomeHistory332();return false}}catch{}
async function reloadHome332(){
 if(homeTask)return homeTask;
 homeTask=(async()=>{
  try{
   const data=await fetchHome332();
   try{homeCache=data;window.__ct0997PreloadedHomeLive=null}catch{}
   if(routeNow()==='home'){try{paintHome()}catch{}normalizeHomeHistory332();scheduleAnchor332()}
   return data;
  }finally{homeTask=null}
 })();
 return homeTask;
}
try{ct274ReloadHome=reloadHome332;ct273ReloadHome=reloadHome332}catch{}
try{homeCache=null;window.__ct0997PreloadedHomeLive=null}catch{}
const baseRenderHome332=typeof renderHome==='function'?renderHome:null;
if(baseRenderHome332)renderHome=async function(){
 const out=await baseRenderHome332.apply(this,arguments);normalizeHomeHistory332();scheduleAnchor332();return out;
};
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab]'))setTimeout(()=>{normalizeHomeHistory332();scheduleAnchor332()},0)},false);

function fyState332(){return window.__ctR319Test?.state||null}
function fyData332(){return window.__ctR309Test?.state||null}
function current332(pool,index){return Array.isArray(pool)&&pool.length?pool[Math.abs(Number(index||0))%pool.length]:null}
function category332(x){try{return window.__ctR309Test?.category?.(x)||'series'}catch{return String(x?.media_type)==='movie'?'movie':'series'}}
function filterMarkup332(kind){
 return [['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']]
  .map(([k,l])=>'<button type="button" class="chip ct332-fy-filter '+(kind===k?'active':'')+'" data-ct332-fy-kind="'+k+'" aria-pressed="'+(kind===k?'true':'false')+'">'+l+'</button>').join('');
}
function ensureForYouFilters332(){
 if(routeNow()!=='discover')return false;
 let tab='';try{tab=String(discover?.tab||'')}catch{}if(tab!=='foryou')return false;
 const root=q('[data-ct319-discover]');if(!root)return false;
 const old=fyState332();if(old?.fyKind&&fyKind332==='all')fyKind332=String(old.fyKind||'all');
 const types=q('[data-ct319-types]',root),trigger=q('[data-ct319-filter]',root),kind=fyKind332;
 if(trigger)trigger.hidden=true;
 if(!types)return false;
 types.innerHTML=filterMarkup332(kind);types.hidden=false;types.dataset.ct332FyFilters='1';types.classList.add('open','ct332-fy-types');types.setAttribute('aria-hidden','false');
 return true;
}
function applyForYouFilter332(){
 const root=q('[data-ct309-foryou]');if(!root)return false;
 const kind=fyKind332;root.dataset.ct332FyFilter=kind;
 for(const slot of qa('[data-ct309-slot]',root)){
  const k=String(slot.dataset.ct309Slot||'').split(':').pop(),show=kind==='all'||k===kind;
  slot.hidden=!show;if(show)slot.style.removeProperty('display');else imp(slot,'display','none');
 }
 const fy=fyData332(),daily=q('.ct309-daily',root),dailyItem=current332(fy?.dailyPool,fy?.dailyIndex);
 if(daily){
  const show=kind==='all'||(dailyItem&&category332(dailyItem)===kind);daily.hidden=!show;
  if(show)daily.style.removeProperty('display');else imp(daily,'display','none');
 }
 for(const b of qa('[data-ct332-fy-kind]')){
  const on=String(b.dataset.ct332FyKind)===kind;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));
 }
 return true;
}
function compactForYouActions332(){
 const root=q('[data-ct309-foryou]');if(!root)return false;
 for(const row of qa('.ct309-actions',root)){
  imp(row,'display','flex');imp(row,'flex-flow','row nowrap');imp(row,'align-items','center');imp(row,'gap','3px');
  imp(row,'width','var(--ct-media-card-w,158px)');imp(row,'max-width','var(--ct-media-card-w,158px)');imp(row,'margin-top','5px');
  for(const b of qa(':scope > .chip',row)){
   imp(b,'position','static');imp(b,'inset','auto');imp(b,'grid-column','auto');imp(b,'flex','1 1 0');imp(b,'width','0');imp(b,'min-width','0');
   imp(b,'height','24px');imp(b,'min-height','24px');imp(b,'padding','2px');imp(b,'font-size','7.5px');imp(b,'line-height','1');imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');
  }
 }
 return true;
}
function settleForYou332(){return ensureForYouFilters332()|compactForYouActions332()|applyForYouFilter332()}
try{
 const baseFY=window.__ctR309?.buildForYou;
 if(typeof baseFY==='function')window.__ctR309.buildForYou=async function(){const out=await baseFY.apply(this,arguments);requestAnimationFrame(settleForYou332);return out};
}catch{}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct332-fy-kind]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();const st=fyState332();if(!st)return;
 st.fyKind=String(b.dataset.ct332FyKind||'all');st.filterOpen=true;applyForYouFilter332();ensureForYouFilters332();
},true);

function norm332(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function filterProviders332(list){return rows(list).filter(p=>!['looke','mubi'].includes(norm332(p?.provider_name)))}
try{
 const baseProviders=typeof ct171Providers==='function'?ct171Providers:null;
 if(baseProviders)ct171Providers=async function(){
  const clean=filterProviders332(await baseProviders.apply(this,arguments));
  try{ct171ProviderList=clean}catch{}
  try{if(typeof ct171TopProvider!=='undefined'&&!clean.some(p=>Number(p.provider_id)===Number(ct171TopProvider)))ct171TopProvider=Number(clean[0]?.provider_id||0)}catch{}
  return clean;
 };
}catch{}
function settleTop10332(){
 if(routeNow()!=='discover')return false;
 let tab='';try{tab=String(discover?.tab||'')}catch{}if(tab!=='top10')return false;
 const box=q('[data-ct321-providers]')||q('[data-ct288-providers]');
 if(box)for(const b of qa('[data-ct321-provider],[data-ct288-provider]',box)){
  const name=norm332(q('b',b)?.textContent||'');if(name==='looke'||name==='mubi')b.remove();
 }
 return true;
}

document.addEventListener('click',e=>{
 if(!e.target?.closest?.('[data-ct319-tab]'))return;
 setTimeout(()=>{settleForYou332();settleTop10332()},0);
},false);
window.addEventListener('cinetracker:data-changed',()=>{
 try{homeCache=null}catch{}
 if(routeNow()==='home')setTimeout(()=>void reloadHome332().catch(()=>{}),80);
 if(routeNow()==='discover')setTimeout(()=>{settleForYou332();settleTop10332()},40);
});

const style=document.createElement('style');style.id='ct-web-r332';style.textContent=`
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct326-history-toggle],[data-home] [data-ct327-history-toggle],[data-home] [data-ct330-history-toggle]{display:none!important}
[data-home] [data-ct274-history],[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history] .ct274-history-stack{display:block!important;height:auto!important;max-height:none!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important}
[data-home] [data-ct274-history] .ct274-history-stack{scrollbar-gutter:auto!important;padding-right:0!important}
[data-ct319-types][data-ct332-fy-filters]{display:flex!important;flex-flow:row nowrap!important;gap:5px!important;overflow:visible!important;margin:8px 0 10px!important}
.ct332-fy-filter{flex:0 0 auto!important;height:28px!important;min-height:28px!important;padding:3px 10px!important;font-size:10px!important;white-space:nowrap!important}
[data-ct309-foryou] .ct309-actions{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:3px!important;width:var(--ct-media-card-w,158px)!important;max-width:var(--ct-media-card-w,158px)!important;margin-top:5px!important}
[data-ct309-foryou] .ct309-actions>.chip{position:static!important;inset:auto!important;grid-column:auto!important;flex:1 1 0!important;width:0!important;min-width:0!important;max-width:none!important;height:24px!important;min-height:24px!important;padding:2px!important;font-size:7.5px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-ct309-foryou] .ct309-actions>.ct309-swap{grid-column:auto!important;width:0!important}
.ct319-top-row,.ct288-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:6px!important;width:100%!important;max-width:100%!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important;padding-bottom:0!important}
.ct319-top-row>.ct319-item,.ct288-top-row>*{min-width:0!important;width:auto!important;max-width:none!important}
.ct319-top-row .ct288-card,.ct288-top-row .ct288-card{width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important}
.ct319-top-row .ct288-open,.ct288-top-row .ct288-open{width:100%!important;min-width:0!important;max-width:100%!important}
.ct319-top-row .ct288-poster,.ct288-top-row .ct288-poster{width:100%!important;height:auto!important;aspect-ratio:2/3!important;object-fit:cover!important}
.ct319-top-row .ct319-actions{display:flex!important;flex-flow:row nowrap!important;gap:2px!important;width:100%!important}
.ct319-top-row .ct319-actions>.chip{flex:1 1 0!important;width:0!important;min-width:0!important;height:23px!important;min-height:23px!important;padding:1px!important;font-size:7px!important;white-space:nowrap!important}
@media(max-width:1199px){.ct319-top-row,.ct288-top-row{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
@media(max-width:700px){[data-ct309-foryou] .ct309-actions{width:154px!important;max-width:154px!important}.ct319-top-row,.ct288-top-row{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='home'){normalizeHomeHistory332();scheduleAnchor332()}if(routeNow()==='discover'){settleForYou332();settleTop10332()}},0);
window.__ctR332={
 fetchHome:fetchHome332,reloadHome:reloadHome332,normalizeHomeHistory:normalizeHomeHistory332,homeAnchorTarget:homeAnchorTarget332,anchorHome:anchorHome332,
 ensureForYouFilters:ensureForYouFilters332,applyForYouFilter:applyForYouFilter332,compactForYouActions:compactForYouActions332,settleForYou:settleForYou332,
 filterProviders:filterProviders332,settleTop10:settleTop10332,version:'1.0.123',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR332Test={fetchHome332,normalizeHomeHistory332,homeAnchorTarget332,filterMarkup332,applyForYouFilter332,compactForYouActions332,filterProviders332,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();

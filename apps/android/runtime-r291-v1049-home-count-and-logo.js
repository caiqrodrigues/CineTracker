/* Android 1.0.49/r291 — corrected Home check size, all-season totals and NFL badge. */
(()=>{'use strict';
if(window.__ctR291Home)return;
window.__ctR291Home='fixed-check-36px-all-time-UFC-793-WWE-567-and-NFL-identity';
const nflBadge='https://r2.thesportsdb.com/images/media/league/badge/g85fqz1662057187.png';
const totals={ufc:793,wwe:567},seen=new Map();
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const all=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const active=()=>route()==='home'&&homeActiveTab158==='series';
const owner=()=>String(session?.user?.id||user?.id||'');
let readPending=null,lastRefresh=0,identity='';
function update(){
 if(!active())return;
 const pane=q('[data-home]')||document;
 for(const k of ['ufc','wwe']){
  const item=q('[data-ct290-home-special="'+k+'"]',pane);
  if(!item)continue;
  const details=q('.ct290-home-text small',item);
  if(!details)continue;
  const text=String(details.textContent||'');
  const match=text.match(/^(\d+)\s*\/\s*(\d+)/);
  if(match){
   const current=Number(match[1]),yearTotal=Number(match[2]),allTime=totals[k];
   details.textContent=current+' vistos em '+new Date().getFullYear()+' · '+allTime+' no histórico';
   details.title=current+' de '+yearTotal+' nesta temporada; '+allTime+' episódios na série desde o início';
  }
 }
 for(const card of all('.media-row',pane)){
  const media=String(card.dataset.media||'');
  const label=String(q('b',card)?.textContent||'').trim().toLowerCase();
  if(!media.includes('-1895884984')&&!/^nfl super bowls?$/.test(label))continue;
  card.classList.add('ct291-nfl-logo-card');
  const thumb=q('.thumb',card);
  if(thumb){
   thumb.style.backgroundImage='url("'+nflBadge+'")';
   thumb.style.backgroundRepeat='no-repeat';
   thumb.style.backgroundPosition='center';
   thumb.style.backgroundSize='contain';
   thumb.title='NFL Super Bowl';
  }
 }
}
async function refresh(){
 if(!owner()||readPending||Date.now()-lastRefresh<10*60000)return;
 lastRefresh=Date.now();
 readPending=Promise.resolve().then(()=>api('media?select=tmdb_id,total_episodes&tmdb_id=in.(-510,-520)&media_type=eq.tv&limit=2'))
 .then(rows=>{
  for(const x of Array.isArray(rows)?rows:[]){
   const k=Number(x.tmdb_id)===-510?'ufc':Number(x.tmdb_id)===-520?'wwe':'';
   if(k&&Number(x.total_episodes)>0)totals[k]=Number(x.total_episodes);
  }
  update();
 }).catch(err=>{document.documentElement.dataset.ct291TotalError=String(err?.message||err)})
 .finally(()=>{readPending=null});
 return readPending;
}
const oldPaint=paintHome;
paintHome=function(...args){
 const out=oldPaint.apply(this,args);
 if(active()){
  queueMicrotask(()=>{update();void refresh()});
  setTimeout(update,130);
 }
 return out;
};
document.addEventListener('click',e=>{
 if(!active()||!e.target?.closest?.('[data-ct286-special-quick],[data-home-tab],[data-ct263-special]'))return;
 setTimeout(update,120);
},false);
for(const kind of ['ufc','wwe','f1'])
 window.addEventListener('cinetracker:'+kind+'-watched-changed',()=>setTimeout(update,100),false);
const css=document.createElement('style');css.id='ct291-home-precise';
css.textContent=[
 '[data-home] .ct290-home-special{grid-template-columns:minmax(0,1fr) 38px!important;align-items:center!important}',
 '[data-home] .ct290-home-special>.ct290-home-button{box-sizing:border-box!important;width:36px!important;min-width:36px!important;max-width:36px!important;height:36px!important;min-height:36px!important;max-height:36px!important;align-self:center!important;justify-self:center!important;padding:0!important;margin:0!important;grid-column:2!important;grid-row:1!important;position:static!important;flex:none!important}',
 '[data-home] .ct291-nfl-logo-card .thumb{background-color:#f6f8ff!important;border:1px solid #526c82!important;border-radius:8px!important}',
 '[data-home] .ct290-home-special .ct290-home-text small{display:block!important;white-space:nowrap!important;text-overflow:hidden!important;text-overflow:ellipsis!important}'
].join('\n');
document.head.appendChild(css);
window.__ctR291HomeTest={update,refresh,totals,nflBadge};
})();
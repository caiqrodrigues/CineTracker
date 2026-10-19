/* CineTracker Android r289 / 1.0.47 — Home special rows match ordinary series.
   Inside r263 private module, after r288. */
(()=>{
'use strict';
if(window.__ctR289HomeV1047)return;
window.__ctR289HomeV1047='native-home-action-rows-for-ufc-wwe-f1';
const kinds=['ufc','wwe','f1'],backup={ufc:null,wwe:null,f1:null};
let painting=false;
const visible=()=>route263()==='home'&&homeActiveTab158==='series'&&!!(session?.user?.id||user?.id);
const cur=k=>{
 const data=special263.current[k];
 if(data?.series)backup[k]=data;
 return data?.series?data:backup[k];
};
const when=d=>Date.parse(d?.series?.last_watched_at||d?.last_watched_at||'')||0;
const ready=d=>{
 const events=rows263(d?.events).filter(x=>
  x?.released!==false&&x?.is_watched!==true&&
  Number(x?.episode_number)>0&&(!x.starts_at||Date.parse(x.starts_at)<=Date.now()));
 const next=Number(d?.series?.next_episode_number||d?.series?.next_episode||0);
 return events.find(x=>Number(x.episode_number)===next)||events[0]||null;
};
const fallback=k=>'<div class="media-row ct263-special" data-ct263-special="'+k+'" role="button" tabindex="0">'+
 '<div class="thumb"></div><div><b>'+esc263(specialCfg263[k].title)+'</b>'+
 '<small>Sincronizando episódios…</small></div><span class="badge">›</span></div>';
function view(k,d){
 const card=d?.series?specialCard263(k,d):fallback(k);
 const ev=ready(d);
 const check=ev?'<button class="home-check ct289-special-check" type="button" data-ct286-special-quick="'+
 k+'" title="Marcar próximo episódio como assistido" aria-label="Marcar próximo episódio de '+esc263(specialCfg263[k].title)+
 ' como visto">✓</button>':'';
 return '<div class="home-action-row ct289-special-row" data-ct289-special="'+k+'">'+card+check+'</div>';
}
const previousMount=mountSpecial263;
mountSpecial263=function(){
 if(!visible())return false;
 if(painting)return false;
 const h=homeView263('series');if(!h)return false;
 painting=true;
 try{
  // Never remove ordinary series, including most recently watched.
  for(const row of [...h.querySelectorAll('[data-ct289-special],.ct286-special-holder,[data-ct288-special]')]){
   const element=row.closest?.('.home-action-row')||row;
   const panel=element.closest('section');element.remove();recount263(panel);
  }
  const sorted=kinds.map(k=>({k,d:cur(k)})).sort((a,b)=>when(b.d)-when(a.d));
  let inserted=0;
  for(const {k,d} of sorted){
   removeSpecialDuplicates263(k);
   const requested=d?.series?.home_bucket==='up_to_date'?'up_to_date':'continue';
   const panel=specialPanel263(requested)||specialPanel263('continue')||specialPanel263('up_to_date');
   const stack=q263(':scope > .stack',panel);if(!stack)continue;
   q263(':scope > .empty',stack)?.remove();
   // Same action-row markup, image geometry and button class as normal Home.
   stack.insertAdjacentHTML('beforeend',view(k,d));
   recount263(panel);
   inserted++;
  }
  document.documentElement.dataset.ct289HomeKinds=String(inserted);
  return inserted===3;
 }catch(error){
  document.documentElement.dataset.ct289HomeError=String(error?.message||error);
  return previousMount();
 }finally{painting=false}
};
const beforeLoad=loadCurrentSpecial263;
loadCurrentSpecial263=async function(force=false){
 for(const k of kinds)cur(k);
 try{return await beforeLoad(force)}
 finally{
  for(const k of kinds)if(!special263.current[k]?.series&&backup[k]?.series)
   special263.current[k]=backup[k];
  if(visible())mountSpecial263();
 }
};
const css=document.createElement('style');css.id='ct289-home-series-parity';
css.textContent=[
 '[data-home] .ct289-special-row{display:grid!important;grid-template-columns:minmax(0,1fr) 36px!important;align-items:center!important;gap:7px!important;margin:0!important;padding:0!important;box-sizing:border-box!important;min-width:0!important;width:100%!important}',
 '[data-home] .ct289-special-row>.media-row{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;min-height:74px!important;width:100%!important;max-width:100%!important;padding:7px!important;box-sizing:border-box!important;margin:0!important}',
 '[data-home] .ct289-special-row>.media-row>.thumb{width:48px!important;min-width:48px!important;height:68px!important;min-height:68px!important;max-height:68px!important}',
 '[data-home] .ct289-special-row>.media-row>div:nth-child(2){min-width:0!important;overflow:hidden!important}',
 '[data-home] .ct289-special-row>.media-row>div:nth-child(2)>small{white-space:nowrap!important;text-overflow:ellipsis!important;overflow:hidden!important}',
 '[data-home] .ct289-special-row>.ct289-special-check{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;height:36px!important;max-height:36px!important;min-height:36px!important;width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important;margin:0!important;font:700 15px/1 system-ui!important;border-radius:8px!important;flex:0 0 36px!important;justify-self:center!important;align-self:center!important}',
 '[data-home] .ct289-special-row .media-row>.badge{display:none!important}'
].join('\n');
document.head.appendChild(css);
window.__ctR289HomeTest={view,ready,backup,mount:()=>mountSpecial263()};
})();

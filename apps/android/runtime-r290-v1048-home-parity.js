/* Android 1.0.48/r290: UFC, WWE and F1 inherit the ordinary Home row. */
(()=>{'use strict';
if(window.__ctR290Home)return;
window.__ctR290Home='standard-home-action-row-ufc-wwe-f1';
const types=['ufc','wwe','f1'],fallback={};
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const show=()=>route263()==='home'&&homeActiveTab158==='series';
const get=k=>{if(special263.current[k]?.series)fallback[k]=special263.current[k];return special263.current[k]?.series?special263.current[k]:fallback[k]||null};
function card(k,d){
 const s=d?.series||{},seen=num263(s.watched_episodes),released=num263(s.released_episodes||s.total_episodes),pending=num263(s.available_episodes);
 const label=d?.series?seen+'/'+(released||'?')+' · '+(pending?'Faltam '+pending:'Em dia'):'Sincronização pendente';
 const poster=String(s.poster_url||''),style=poster.startsWith('https://')?' style="background-image:url('+esc263(poster)+')"':'';
 const watch=d?.series&&pending>0;
 return '<div class="home-action-row ct290-home-special" data-ct290-home-special="'+k+'">'+
 '<div class="media-row ct263-special" data-ct263-special="'+k+'" role="button" tabindex="0">'+
 '<div class="thumb"'+style+'></div><div class="ct290-home-text"><b>'+esc263(specialCfg263[k].title)+'</b><small>'+esc263(label)+'</small></div><span class="badge">›</span></div>'+
 (watch?'<button type="button" class="home-check ct290-home-button" data-ct286-special-quick="'+k+'" title="Marcar próximo episódio como assistido">✓</button>':'')+'</div>';
}
let painting=false;
mountSpecial263=function(){
 if(!show()||painting)return false;
 const view=homeView263('series');if(!view)return false;
 painting=true;
 try{
  for(const el of qa('[data-ct290-home-special],[data-ct289-special],.ct286-special-holder',view))el.remove();
  for(const el of qa('[data-ct263-special]',view))if(!el.closest('[data-ct290-home-special]'))el.remove();
  const ordered=types.map(k=>({k,d:get(k)})).sort((a,b)=>
   (Date.parse(b.d?.series?.last_watched_at||'')||0)-(Date.parse(a.d?.series?.last_watched_at||'')||0));
  let count=0;
  for(const {k,d} of ordered){
   const sec=specialPanel263(d?.series?.home_bucket==='up_to_date'?'up_to_date':'continue')||
    specialPanel263('continue')||specialPanel263('up_to_date');
   const stack=q(':scope > .stack',sec);if(!stack)continue;
   q(':scope > .empty',stack)?.remove();
   stack.insertAdjacentHTML('beforeend',card(k,d));
   const badge=q('.panel-head small',sec);
   if(badge)badge.textContent=String(qa(':scope > .media-row,:scope > .home-action-row',stack).length);
   count++;
  }
  document.documentElement.dataset.ct290HomeSpecialCount=String(count);return count===3;
 }finally{painting=false}
};
const priorLoad=loadCurrentSpecial263;
loadCurrentSpecial263=async function(...args){
 for(const k of types)get(k);
 try{return await priorLoad.apply(this,args)}
 finally{
  for(const k of types)if(!special263.current[k]?.series&&fallback[k]?.series)special263.current[k]=fallback[k];
  if(show())mountSpecial263();
 }
};
const css=document.createElement('style');css.id='ct290-home-uniform';
css.textContent=[
 '[data-home] .ct290-home-special{display:grid!important;grid-template-columns:minmax(0,1fr) 38px!important;gap:7px!important;align-items:stretch!important;width:100%!important;max-width:100%!important;min-width:0!important;padding:0!important;margin:0!important;box-sizing:border-box!important}',
 '[data-home] .ct290-home-special>.media-row{display:grid!important;grid-template-columns:48px minmax(0,1fr) auto!important;gap:10px!important;align-items:center!important;min-width:0!important;width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;padding:7px!important;margin:0!important;box-sizing:border-box!important}',
 '[data-home] .ct290-home-special>.media-row>.thumb{width:48px!important;min-width:48px!important;max-width:48px!important;height:68px!important;min-height:68px!important;max-height:68px!important}',
 '[data-home] .ct290-home-text{min-width:0!important;overflow:hidden!important}.ct290-home-text b,.ct290-home-text small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-home] .ct290-home-special>.ct290-home-button{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:100%!important;max-height:100%!important;min-height:0!important;padding:0!important;margin:0!important;position:static!important;grid-column:2!important;grid-row:1!important;font:900 16px/1 system-ui!important;transform:none!important}',
 '[data-home] .ct290-home-special>.media-row{grid-column:1!important;grid-row:1!important}'
].join('\n');document.head.appendChild(css);
window.__ctR290HomeTest={card,mount:()=>mountSpecial263(),get};
})();
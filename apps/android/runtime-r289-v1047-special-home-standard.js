/* CineTracker Android r289 / 1.0.47 — special rows obey the standard Home series contract.
   PRIVATE r263 module scope; only this existing presenter is replaced. */
(()=>{
'use strict';
if(window.__ctR289SpecialHome)return;
window.__ctR289SpecialHome='native-media-row-uniform-UFC-WWE-F1';
const kinds=['ufc','wwe','f1'];
const q=(selector,root=document)=>root?.querySelector?.(selector)||null;
const qa=(selector,root=document)=>Array.from(root?.querySelectorAll?.(selector)||[]);
const routeOk=()=>route263()==='home'&&homeActiveTab158==='series';
const backups=window.__ctR288HomeTest?.snapshots||{};
function entry(kind){
 const value=special263.current[kind];
 return value?.series?value:backups[kind]?.series?backups[kind]:null;
}
function card(kind,record){
 if(!record?.series){
  return '<div class="media-row ct263-special ct289-home-series" data-ct263-special="'+kind+
   '" role="button" tabindex="0"><div class="thumb"></div><div><b>'+esc263(specialCfg263[kind].title)+
   '</b><small>Sincronização pendente · toque para abrir</small></div><span class="badge">›</span></div>';
 }
 const basic=specialCard263(kind,record).replace('class="media-row ct263-special"','class="media-row ct263-special ct289-home-series"');
 const recent=rows263(record.events).find(x=>x?.released!==false&&!x?.is_watched&&num263(x.episode_number)>0&&
  (!x?.starts_at||Date.parse(x.starts_at)<=Date.now()+60000));
 if(!recent)return basic;
 return basic.replace('<span class="badge">›</span></div>',
  '<button type="button" class="ct289-home-mark" data-ct286-special-quick="'+kind+
  '" title="Marcar evento como assistido" aria-label="Marcar evento como assistido">✓</button>'+
  '<span class="badge">›</span></div>');
}
let painting=false;
mountSpecial263=function(){
 if(!routeOk()||painting)return false;
 const view=homeView263('series');
 if(!view)return false;
 painting=true;
 try{
  // Remove only the older three special items and their wrappers.
  for(const node of qa('.ct286-special-holder,[data-ct263-special]',view)){
   const panel=node.closest('section');node.remove();recount263(panel);
  }
  let inserted=0;
  const sorted=[...kinds].sort((a,b)=>{
   const first=entry(a),second=entry(b);
   const t=x=>Date.parse(x?.series?.last_watched_at||x?.last_watched_at||'')||0;
   return t(second)-t(first)||kinds.indexOf(a)-kinds.indexOf(b);
  });
  for(const kind of sorted){
   const data=entry(kind),bucket=data?.series?.home_bucket==='up_to_date'?'up_to_date':'continue';
   const section=specialPanel263(bucket)||specialPanel263('continue')||specialPanel263('up_to_date');
   const stack=q(':scope > .stack',section);
   if(!stack)continue;
   q(':scope > .empty',stack)?.remove();
   stack.insertAdjacentHTML('beforeend',card(kind,data));
   recount263(section);inserted++;
  }
  document.documentElement.dataset.ct289SeriesRows=String(inserted);
  return inserted===3;
 }finally{painting=false}
};
window.__ctR289SpecialTest={card,mount:()=>mountSpecial263(),entry};
const style=document.createElement('style');
style.id='ct289-home-standard-rows';
style.textContent=[
 '[data-home] .ct289-home-series{box-sizing:border-box!important;display:grid!important;grid-template-columns:48px minmax(0,1fr) auto auto!important;gap:7px!important;align-items:center!important;width:100%!important;min-width:0!important;min-height:0!important;height:auto!important;padding:6px!important;margin:0!important;overflow:hidden!important}',
 '[data-home] .ct289-home-series>.thumb{width:46px!important;height:58px!important;min-width:46px!important;max-width:46px!important;min-height:58px!important;max-height:58px!important;flex:none!important;border-radius:8px!important}',
 '[data-home] .ct289-home-series>div:nth-child(2){box-sizing:border-box!important;min-width:0!important;width:auto!important;max-width:100%!important;overflow:hidden!important;flex:1 1 auto!important}',
 '[data-home] .ct289-home-series>div:nth-child(2)>b,[data-home] .ct289-home-series>div:nth-child(2)>small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.25!important;max-width:100%!important}',
 '[data-home] .ct289-home-series>.ct289-home-mark{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:none!important;width:34px!important;height:34px!important;min-width:34px!important;max-width:34px!important;min-height:34px!important;max-height:34px!important;margin:0!important;padding:0!important;border-radius:8px!important;outline:none!important;font:700 15px/1 system-ui!important;white-space:nowrap!important;position:static!important;transform:none!important;overflow:hidden!important}',
 '[data-home] .ct289-home-series>.badge{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:19px!important;min-width:19px!important;max-width:19px!important;flex:none!important;margin:0!important;padding:0!important}',
 '@media(max-width:420px){[data-home] .ct289-home-series{grid-template-columns:43px minmax(0,1fr) auto 15px!important;gap:5px!important;padding:5px!important}[data-home] .ct289-home-series>.thumb{width:41px!important;min-width:41px!important;max-width:41px!important;height:55px!important;min-height:55px!important;max-height:55px!important}}'
].join('\n');
document.head.appendChild(style);
})();
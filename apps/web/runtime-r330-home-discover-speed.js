/* CineTracker Web 1.0.121 r330 — fast Home commit + final Discover geometry. */
(()=>{
'use strict';
if(window.__ctR330?.version==='1.0.121')return;
window.__ctR330Marker='home-immediate-paint+cancel-stale-reconcile+discover-buttons-grid+top10-up-no-provider-duplicate';
window.__ctR330Home='payload-first-paint+background-series-reconcile+route-guard';
window.__ctR330Discover='foryou-three-button-grid+top10-compact-no-duplicate-provider+v326-final-audit';
window.__ctR330Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

function normalizeDiscover330(root=document){
 const fy=q('[data-ct329-foryou]',root)||q('[data-ct328-foryou]',root);
 if(fy){
  for(const row of qa('.ct329-actions,.ct328-actions',fy)){
   row.dataset.ct330Actions='1';
   for(const b of qa('button',row))b.dataset.ct330Action='1';
  }
 }
 const top=q('.ct288-top-shell',root);
 if(top){
  q('.ct288-top-title',top)?.remove();
  q('.ct288-top-name',top)?.remove();
  top.dataset.ct330Compact='1';
 }
 return true;
}
function assertThree330(root=document){
 return qa('[data-ct329-foryou] .ct329-actions',root).every(x=>qa(':scope > button',x).length===3);
}

document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct319-tab],[data-ct328-fy-kind],[data-ct321-provider]')){
  requestAnimationFrame(()=>normalizeDiscover330(document));
 }
},false);

const style=document.createElement('style');style.id='ct-web-r330';style.textContent=`
/* Pra voce: exactly one compact row, three equally-sized controls. */
[data-ct329-foryou] .ct329-actions,
[data-ct328-foryou] .ct328-actions{
 box-sizing:border-box!important;
 display:grid!important;
 grid-template-columns:repeat(3,minmax(0,1fr))!important;
 grid-template-rows:26px!important;
 column-gap:3px!important;
 row-gap:0!important;
 width:100%!important;
 max-width:100%!important;
 min-width:0!important;
 height:26px!important;
 min-height:26px!important;
 margin:5px 0 0!important;
 padding:0!important;
 overflow:visible!important;
 position:static!important;
 transform:none!important;
}
[data-ct329-foryou] .ct329-actions>.ct329-action,
[data-ct328-foryou] .ct328-actions>.ct328-action{
 box-sizing:border-box!important;
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 position:static!important;
 inset:auto!important;
 transform:none!important;
 float:none!important;
 grid-column:auto!important;
 grid-row:1!important;
 width:100%!important;
 min-width:0!important;
 max-width:none!important;
 height:26px!important;
 min-height:26px!important;
 margin:0!important;
 padding:1px 2px!important;
 border-radius:7px!important;
 font-size:7.5px!important;
 line-height:1!important;
 white-space:nowrap!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 visibility:visible!important;
}
[data-ct329-foryou] .ct329-swapbtn,
[data-ct328-foryou] .swap{display:flex!important;visibility:visible!important}

/* Public Discover: two compact buttons, same baseline. */
.ct319-actions{
 display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
 gap:3px!important;width:100%!important;min-width:0!important;margin-top:5px!important
}
.ct319-actions>.chip{
 width:100%!important;min-width:0!important;height:26px!important;min-height:26px!important;
 padding:1px 3px!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important;
 overflow:hidden!important;text-overflow:ellipsis!important
}

/* Top 10: providers are the heading; remove duplicate textual headings and vertical dead space. */
.ct288-top-shell{margin-top:0!important;padding-top:0!important}
.ct288-top-title,.ct288-top-name{display:none!important;margin:0!important;padding:0!important;height:0!important}
.ct288-top-shell .ct288-provider-row{
 margin:0 0 5px!important;padding:0 1px 4px!important;gap:7px!important
}
[data-ct321-top-content]{margin-top:0!important;padding-top:0!important}
.ct288-top-section{margin-top:4px!important;padding-top:8px!important}
.ct288-top-section+.ct288-top-section{margin-top:8px!important}
.ct288-top-section .panel-head{margin-bottom:4px!important}

/* Keep Home history in the approved page-flow behavior; never bring back a toggle. */
[data-home] [data-ct275-history-toggle],
[data-home] [data-ct324-history-toggle],
[data-home] .ct324-history-toggle{display:none!important}
[data-home] [data-ct274-history],
[data-home] [data-ct274-history].is-collapsed,
[data-home] [data-ct274-history].is-open{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,
[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;
 opacity:1!important;transform:none!important;pointer-events:auto!important
}
@media(max-width:620px){
 [data-ct329-foryou] .ct329-actions>.ct329-action,
 [data-ct328-foryou] .ct328-actions>.ct328-action{font-size:7px!important;padding-inline:1px!important}
}
`;
document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='discover')normalizeDiscover330(document)},0);

window.__ctR330={
 normalizeDiscover:normalizeDiscover330,
 actionRowsHaveThree:assertThree330,
 homeMode:'immediate-paint-background-reconcile',
 version:'1.0.121'
};
window.__ctR330Test={normalizeDiscover330,assertThree330};
})();

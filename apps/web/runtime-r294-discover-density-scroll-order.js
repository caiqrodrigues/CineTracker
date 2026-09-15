(()=>{
'use strict';
if(window.__ctR294)return;
window.__ctR294='discover-density-scroll-order-top10-ten-up';
window.__ctR294Cards='158x237-desktop-154x231-mobile';
window.__ctR294Top10='ten-up-at-1920-reference';
window.__ctR294Actions='content-then-actions-then-scrollbar';
window.__ctR294Android='preserved-1.0.20-10062';

const STYLE_ID='ct-web-r294-discover-density-scroll-order';
const css=`
:root{
 --ct-media-card-w:158px!important;
 --ct-media-poster-h:237px!important;
 --ct-media-copy-h:52px!important;
 --ct-media-control-h:289px!important;
 --ct-media-card-h:291px!important;
 --ct-discover-gap:8px;
 --ct-discover-footer-h:28px;
 --ct-discover-scroll-pad:6px;
}
@media(max-width:700px){
 :root{
  --ct-media-card-w:154px!important;
  --ct-media-poster-h:231px!important;
  --ct-media-copy-h:50px!important;
  --ct-media-control-h:281px!important;
  --ct-media-card-h:283px!important;
  --ct-discover-gap:8px;
  --ct-discover-footer-h:28px;
  --ct-discover-scroll-pad:6px;
 }
}
.ct-media-copy-lock,.ct263-media-copy,.ct288-copy{
 gap:2px!important;
 padding:5px 2px 3px!important;
 justify-content:flex-start!important;
}
.ct288-copy b,.ct288-copy small,.ct-media-title-lock,.ct-media-meta-lock{
 line-height:1.2!important;
 margin:0!important;
}
.ct288-copy b,.ct-media-title-lock{
 max-height:1.2em!important;
}
.ct291-card-footer,.ct291-slot-footer{
 gap:4px!important;
 min-height:var(--ct-discover-footer-h)!important;
 height:var(--ct-discover-footer-h)!important;
 max-height:var(--ct-discover-footer-h)!important;
 margin-top:2px!important;
}
.ct291-playlist,.ct291-slot-footer .ct288-swap{
 min-height:var(--ct-discover-footer-h)!important;
 height:var(--ct-discover-footer-h)!important;
 max-height:var(--ct-discover-footer-h)!important;
 padding:3px 6px!important;
 border-radius:8px!important;
 font-size:11px!important;
 line-height:1!important;
}
.ct291-card.ct291-has-footer{
 height:calc(var(--ct-media-card-h) + var(--ct-discover-footer-h) + 2px)!important;
 min-height:calc(var(--ct-media-card-h) + var(--ct-discover-footer-h) + 2px)!important;
 max-height:calc(var(--ct-media-card-h) + var(--ct-discover-footer-h) + 2px)!important;
 overflow:hidden!important;
}
.ct291-card.ct291-no-footer{
 height:var(--ct-media-card-h)!important;
 min-height:var(--ct-media-card-h)!important;
 max-height:var(--ct-media-card-h)!important;
 overflow:hidden!important;
}
[data-ct288-discover] .ct288-rail,
[data-ct288-discover] .ct288-top-row,
[data-ct288-discover] .ct288-slot-grid,
.ct263-media-rail,
.ct291-carousel{
 gap:var(--ct-discover-gap)!important;
 padding:0 0 var(--ct-discover-scroll-pad)!important;
 margin-bottom:0!important;
 align-items:flex-start!important;
 overflow-x:auto!important;
 overflow-y:hidden!important;
 scrollbar-width:thin!important;
}
[data-ct288-discover] .ct288-rail::-webkit-scrollbar,
[data-ct288-discover] .ct288-top-row::-webkit-scrollbar,
[data-ct288-discover] .ct288-slot-grid::-webkit-scrollbar,
.ct263-media-rail::-webkit-scrollbar,
.ct291-carousel::-webkit-scrollbar{height:7px!important}
[data-ct288-discover] .ct288-slot-grid>.ct288-slot{
 flex:0 0 var(--ct-media-card-w)!important;
 width:var(--ct-media-card-w)!important;
 min-width:var(--ct-media-card-w)!important;
 max-width:var(--ct-media-card-w)!important;
}
.ct288-slot-head{margin:0 0 4px!important;padding:0!important;min-height:0!important}
.ct288-slot-head h3{margin:0!important;line-height:1.15!important}
.ct288-foryou-block .panel-head{margin-bottom:6px!important}
.ct288-foryou-block{padding-bottom:8px!important}
.ct293-related-actions{
 gap:4px!important;
 margin-top:4px!important;
 min-height:var(--ct-discover-footer-h)!important;
}
.ct293-related-actions .ct293-related-action{
 min-height:var(--ct-discover-footer-h)!important;
 height:var(--ct-discover-footer-h)!important;
 max-height:var(--ct-discover-footer-h)!important;
 padding:3px 6px!important;
 font-size:11px!important;
}
`;
let style=document.getElementById(STYLE_ID);
if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
style.textContent=css;

function compact(root=document){
 const host=root?.querySelectorAll?root:document;
 for(const rail of host.querySelectorAll('.ct288-rail,.ct288-top-row,.ct288-slot-grid,.ct263-media-rail'))rail.dataset.ct294Compact='1';
 for(const card of host.querySelectorAll('.ct291-card,.ct288-card,.ct263-media-card'))card.dataset.ct294Compact='1';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>compact(document),{once:true});else compact(document);
const mo=new MutationObserver(ms=>{let hit=false;for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1&&(n.matches?.('.ct288-rail,.ct288-top-row,.ct288-slot-grid,.ct291-card,.ct288-card,.ct263-media-card')||n.querySelector?.('.ct288-rail,.ct288-top-row,.ct288-slot-grid,.ct291-card,.ct288-card,.ct263-media-card'))){hit=true;break}if(hit)queueMicrotask(()=>compact(document))});
mo.observe(document.documentElement,{subtree:true,childList:true});
window.__ctR294Test={compact};
})();

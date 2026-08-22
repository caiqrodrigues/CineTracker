(() => {
'use strict';
const VERSION='0.3.7';

// Lightweight final UI/performance layer. Heavy poster/profile work now lives
// in patch-v034; this patch intentionally avoids global MutationObservers.
const style=document.createElement('style');
style.id='ct-v035-style';
style.textContent=`
.ct29-cast{
  display:grid!important;
  grid-auto-flow:column!important;
  grid-auto-columns:clamp(112px,22vw,145px)!important;
  grid-template-columns:none!important;
  gap:10px!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  overscroll-behavior-x:contain;
  scroll-snap-type:x proximity;
  -webkit-overflow-scrolling:touch;
  padding:2px 2px 10px!important;
}
.ct29-cast .ct29-person{scroll-snap-align:start;min-width:0!important;}
.ct29-cast .ct29-person-photo{aspect-ratio:3/4!important;max-height:170px!important;background-size:cover!important;background-position:center 18%!important;}
.ct29-cast .ct29-person-body{padding:7px!important;}
.ct29-cast .ct29-person-body strong{font-size:10.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ct29-cast .ct29-person-body span{font-size:9px!important;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media(max-width:700px){
 .ct29-cast{grid-auto-columns:118px!important;gap:8px!important;}
 .ct29-cast .ct29-person-photo{max-height:158px!important;}
}
`;
document.head.appendChild(style);

// Reduce work while a tab is being switched repeatedly. Multiple taps in a
// short interval collapse into one final render on the web layer.
let lastView='';
let lastAt=0;
window.ct35ViewSettled=()=>{
  try{
    const now=Date.now(),v=String(typeof view==='undefined'?'':view);
    const stable=v===lastView && now-lastAt<180;
    lastView=v;lastAt=now;
    return !stable;
  }catch{return true;}
};

// Give images decoded by the browser priority only when visible. This avoids
// a large decode burst for off-screen cards in Android WebView.
function lazyImages(root=document){
  for(const img of root.querySelectorAll?.('img')||[]){
    if(!img.loading)img.loading='lazy';
    if(!img.decoding)img.decoding='async';
  }
}
function version(){
  document.querySelectorAll('.cloud-bar').forEach(el=>{el.innerHTML=el.innerHTML.replace(/CineTracker Oficial v\d+\.\d+\.\d+/g,'CineTracker Oficial v'+VERSION);});
}
requestAnimationFrame(()=>{lazyImages();version();});
})();

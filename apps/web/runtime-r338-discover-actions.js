/* CineTracker Web 1.0.129 r338 — hard reset da geometria dos botões do Pra Você. */
(()=>{
'use strict';
if(window.__ctR338?.version==='1.0.129')return;
window.__ctR338Marker='discover-foryou-actions-flex-hard-reset-no-overlap';
window.__ctR338Discover='two-or-three-actions-single-row-no-overlap';
window.__ctR338Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');

let raf338=0,timer338=0;
function fixActions338(){
 if(routeNow()!=='discover')return false;
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let fixed=0;
 for(const row of qa('.ct336-actions',root)){
  const buttons=qa(':scope > button.ct336-action',row);
  if(buttons.length<2||buttons.length>3)continue;
  imp(row,'box-sizing','border-box');
  imp(row,'display','flex');
  imp(row,'flex-flow','row nowrap');
  imp(row,'align-items','stretch');
  imp(row,'justify-content','stretch');
  imp(row,'gap','4px');
  imp(row,'width','100%');
  imp(row,'min-width','0');
  imp(row,'max-width','100%');
  imp(row,'height','28px');
  imp(row,'min-height','28px');
  imp(row,'max-height','28px');
  imp(row,'margin','5px 0 0');
  imp(row,'padding','0');
  imp(row,'position','relative');
  imp(row,'inset','auto');
  imp(row,'left','auto');imp(row,'right','auto');imp(row,'top','auto');imp(row,'bottom','auto');
  imp(row,'transform','none');imp(row,'translate','none');imp(row,'rotate','none');imp(row,'scale','none');
  imp(row,'overflow','visible');
  imp(row,'direction','ltr');
  imp(row,'grid-template-columns','none');imp(row,'grid-template-rows','none');
  buttons.forEach((b,index)=>{
   imp(b,'box-sizing','border-box');
   imp(b,'display','flex');
   imp(b,'visibility','visible');
   imp(b,'position','static');
   imp(b,'inset','auto');imp(b,'left','auto');imp(b,'right','auto');imp(b,'top','auto');imp(b,'bottom','auto');
   imp(b,'transform','none');imp(b,'translate','none');imp(b,'rotate','none');imp(b,'scale','none');
   imp(b,'float','none');imp(b,'clear','none');
   imp(b,'flex','1 1 0px');
   imp(b,'flex-basis','0px');
   imp(b,'width','0');
   imp(b,'min-width','0');
   imp(b,'max-width','none');
   imp(b,'height','28px');
   imp(b,'min-height','28px');
   imp(b,'max-height','28px');
   imp(b,'margin','0');
   imp(b,'padding','2px 3px');
   imp(b,'align-items','center');
   imp(b,'justify-content','center');
   imp(b,'align-self','stretch');
   imp(b,'grid-area','auto');
   imp(b,'grid-row','auto');
   imp(b,'grid-column','auto');
   imp(b,'order',String(index));
   imp(b,'z-index','auto');
   imp(b,'font-size','8.5px');
   imp(b,'line-height','1');
   imp(b,'letter-spacing','0');
   imp(b,'white-space','nowrap');
   imp(b,'overflow','hidden');
   imp(b,'text-overflow','ellipsis');
   imp(b,'pointer-events','auto');
  });
  row.dataset.ct338Actions=String(buttons.length);
  fixed++;
 }
 if(fixed)root.dataset.ct338Layout='fixed';
 return fixed>0;
}
function queueFix338(){
 cancelAnimationFrame(raf338);clearTimeout(timer338);
 queueMicrotask(()=>fixActions338());
 raf338=requestAnimationFrame(()=>fixActions338());
 timer338=setTimeout(()=>fixActions338(),90);
}
function wrap336(name){
 const api=window.__ctR336,base=api?.[name];
 if(typeof base!=='function'||base.__ctR338Wrapped)return;
 const wrapped=function(){
  const out=base.apply(this,arguments);queueFix338();
  if(out&&typeof out.finally==='function')out.finally(queueFix338);
  return out;
 };
 wrapped.__ctR338Wrapped=true;wrapped.__ctR338Base=base;api[name]=wrapped;
}
for(const name of ['paintForYou','applyForYouFilter','swapForYou','persistForYou','switchDiscover'])wrap336(name);

const previousEarly338=window.__ctR336EarlyHandle;
function earlyHandle338(target){
 const handled=typeof previousEarly338==='function'?previousEarly338(target):false;
 if(handled)queueFix338();
 return handled;
}
window.__ctR336EarlyHandle=earlyHandle338;

const style=document.createElement('style');style.id='ct-web-r338';style.textContent=`
/* Pra Você: dois ou três botões em uma única faixa horizontal, sem sobreposição. */
[data-ct336-foryou] .ct336-actions{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;justify-content:stretch!important;
 gap:4px!important;width:100%!important;min-width:0!important;max-width:100%!important;height:28px!important;min-height:28px!important;max-height:28px!important;
 margin:5px 0 0!important;padding:0!important;position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
 transform:none!important;translate:none!important;rotate:none!important;scale:none!important;overflow:visible!important;direction:ltr!important;
 grid-template-columns:none!important;grid-template-rows:none!important
}
[data-ct336-foryou] .ct336-actions>button.ct336-action{
 box-sizing:border-box!important;display:flex!important;visibility:visible!important;position:static!important;
 inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
 transform:none!important;translate:none!important;rotate:none!important;scale:none!important;float:none!important;clear:none!important;
 flex:1 1 0px!important;flex-basis:0px!important;width:0!important;min-width:0!important;max-width:none!important;
 height:28px!important;min-height:28px!important;max-height:28px!important;margin:0!important;padding:2px 3px!important;
 align-items:center!important;justify-content:center!important;align-self:stretch!important;grid-area:auto!important;grid-row:auto!important;grid-column:auto!important;
 z-index:auto!important;border-radius:7px!important;font-size:8.5px!important;line-height:1!important;letter-spacing:0!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;pointer-events:auto!important
}
[data-ct336-foryou] .ct336-actions-two>button.ct336-action{flex-grow:1!important}
[data-ct336-foryou] .ct336-actions-three>button.ct336-action{flex-grow:1!important}
`;document.head.appendChild(style);

setTimeout(queueFix338,0);
setTimeout(queueFix338,220);

window.__ctR338={version:'1.0.129',fixActions:fixActions338,queueFix:queueFix338,earlyHandle:earlyHandle338};
window.__ctR338Test={
 fixActions338,
 rects(){return qa('[data-ct336-foryou] .ct336-actions').map(row=>({row,buttons:qa(':scope > button.ct336-action',row).map(b=>b.getBoundingClientRect())}))}
};
})();

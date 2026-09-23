/* CineTracker Web 1.0.133 r342 — single stable Discover action geometry owner, no timer/observer tug-of-war. */
(()=>{
'use strict';
if(window.__ctR342?.version==='1.0.133')return;
window.__ctR342Marker='discover-buttons-single-owner+no-jitter+poster-width-freeze';
window.__ctR342Discover='single-lock-after-dom-paint+no-resize-loop+no-layout-transitions';
window.__ctR342Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');
const ROWS='.ct336-actions,.ct329-actions,.ct328-actions,.ct309-actions,.ct319-actions,.ct315-actions';
const OWNERS='.ct336-slot,[data-ct319-item],[data-ct315-item],.ct329-slot,.ct328-slot,.ct309-slot,.ct329-daily,.ct328-daily,.ct309-daily';
let raf342=0,mo342=null,host342=null,resizeTimer342=0;

function owner342(row){return row?.closest?.(OWNERS)||row?.parentElement||null}
function poster342(row){
 const owner=owner342(row);if(!owner)return null;
 for(const s of ['.ct288-poster','.ct288-empty-poster',':scope > .ct336-cardwrap .ct288-card',':scope > .ct329-cardwrap .ct288-card',':scope > .ct328-cardwrap .ct288-card',':scope > .ct309-cardwrap .ct288-card',':scope > .ct288-card']){
  const el=q(s,owner),r=el?.getBoundingClientRect?.();
  if(n(r?.width)>40&&n(r?.height)>40)return el;
 }
 return null;
}
function buttonWidths342(width,count,gap){
 const total=Math.max(count,Math.round(width)-gap*Math.max(0,count-1));
 const base=Math.floor(total/count),out=Array(count).fill(base);
 let remainder=total-base*count;
 for(let i=count-1;i>=0&&remainder>0;i--,remainder--)out[i]++;
 return out;
}
function lockRow342(row){
 if(!row)return false;
 const buttons=qa(':scope > button',row);if(buttons.length<2||buttons.length>4)return false;
 const poster=poster342(row),pr=poster?.getBoundingClientRect?.();if(!poster||n(pr?.width)<=40)return false;
 const width=Math.round(pr.width),gap=buttons.length>=3?3:4,h=buttons.length>=3?28:30,widths=buttonWidths342(width,buttons.length,gap);
 const owner=owner342(row),or=owner?.getBoundingClientRect?.(),offset=Math.max(0,Math.round(n(pr?.left)-n(or?.left)));

 row.dataset.ct342Locked='1';row.dataset.ct342PosterWidth=String(width);row.dataset.ct342ActionCount=String(buttons.length);
 imp(row,'box-sizing','border-box');imp(row,'display','flex');imp(row,'flex-flow','row nowrap');
 imp(row,'grid-template-columns','none');imp(row,'grid-template-rows','none');
 imp(row,'align-items','stretch');imp(row,'justify-content','flex-start');imp(row,'align-self','flex-start');
 imp(row,'position','relative');imp(row,'inset','auto');imp(row,'left','auto');imp(row,'right','auto');imp(row,'top','auto');imp(row,'bottom','auto');
 imp(row,'transform','none');imp(row,'translate','none');imp(row,'float','none');
 imp(row,'width',width+'px');imp(row,'min-width',width+'px');imp(row,'max-width',width+'px');
 imp(row,'height',h+'px');imp(row,'min-height',h+'px');imp(row,'max-height',h+'px');
 imp(row,'gap',gap+'px');imp(row,'column-gap',gap+'px');imp(row,'row-gap','0');
 imp(row,'margin','5px 0 0 '+offset+'px');imp(row,'padding','0');imp(row,'overflow','hidden');
 imp(row,'contain','layout paint');imp(row,'z-index','4');imp(row,'visibility','visible');
 imp(row,'transition','none');imp(row,'animation','none');imp(row,'will-change','auto');

 buttons.forEach((b,index)=>{
  const w=widths[index]+'px';
  imp(b,'box-sizing','border-box');imp(b,'display','flex');imp(b,'visibility','visible');
  imp(b,'position','relative');imp(b,'inset','auto');imp(b,'left','auto');imp(b,'right','auto');imp(b,'top','auto');imp(b,'bottom','auto');
  imp(b,'transform','none');imp(b,'translate','none');imp(b,'rotate','none');imp(b,'scale','none');imp(b,'float','none');imp(b,'clear','none');
  imp(b,'flex','0 0 '+w);imp(b,'flex-grow','0');imp(b,'flex-shrink','0');imp(b,'flex-basis',w);
  imp(b,'width',w);imp(b,'min-width',w);imp(b,'max-width',w);
  imp(b,'height',h+'px');imp(b,'min-height',h+'px');imp(b,'max-height',h+'px');
  imp(b,'margin','0');imp(b,'padding',buttons.length>=3?'1px':'2px 3px');
  imp(b,'align-items','center');imp(b,'justify-content','center');imp(b,'align-self','stretch');
  imp(b,'grid-area','auto');imp(b,'grid-row','auto');imp(b,'grid-column','auto');imp(b,'order',String(index));
  imp(b,'z-index','1');imp(b,'font-size',buttons.length>=3?'7px':'8.5px');imp(b,'line-height','1');
  imp(b,'letter-spacing','-.08px');imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');
  imp(b,'transition','none');imp(b,'animation','none');imp(b,'will-change','auto');
  imp(b,'pointer-events',b.disabled?'none':'auto');
  b.dataset.ct342Width=String(widths[index]);
 });
 poster.dataset.ct342Authority='poster';
 return true;
}
function lockAll342(){
 if(routeNow()!=='discover')return false;
 const root=q('[data-ct319-discover]')||q('[data-ct315-discover]')||document;
 let fixed=0;for(const row of qa(ROWS,root))if(lockRow342(row))fixed++;
 if(root?.dataset)root.dataset.ct342StableRows=String(fixed);
 return fixed>0;
}
function schedule342(){
 cancelAnimationFrame(raf342);
 raf342=requestAnimationFrame(()=>requestAnimationFrame(()=>lockAll342()));
}
function bind342(){
 if(routeNow()!=='discover'){mo342?.disconnect?.();host342=null;return false}
 const host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!host)return false;
 if(host===host342&&mo342){schedule342();return true}
 mo342?.disconnect?.();host342=host;
 if(window.MutationObserver){
  mo342=new MutationObserver(muts=>{if(muts.some(m=>m.addedNodes.length||m.removedNodes.length))lockAll342()});
  mo342.observe(host,{subtree:true,childList:true});
 }
 schedule342();return true;
}
try{
 const baseRender342=renderDiscover;
 renderDiscover=function(){
  const out=baseRender342.apply(this,arguments);
  requestAnimationFrame(()=>bind342());
  return out;
 };
}catch{}
window.addEventListener('resize',()=>{
 clearTimeout(resizeTimer342);resizeTimer342=setTimeout(()=>{if(routeNow()==='discover')schedule342()},120);
},{passive:true});
window.addEventListener('orientationchange',()=>{if(routeNow()==='discover')schedule342()},{passive:true});

const style=document.createElement('style');style.id='ct-web-r342';style.textContent=`
[data-ct319-discover] .ct336-actions:not([data-ct342-locked="1"]),
[data-ct319-discover] .ct329-actions:not([data-ct342-locked="1"]),
[data-ct319-discover] .ct328-actions:not([data-ct342-locked="1"]),
[data-ct319-discover] .ct309-actions:not([data-ct342-locked="1"]),
[data-ct319-discover] .ct319-actions:not([data-ct342-locked="1"]),
[data-ct319-discover] .ct315-actions:not([data-ct342-locked="1"]),
[data-ct315-discover] .ct336-actions:not([data-ct342-locked="1"]),
[data-ct315-discover] .ct329-actions:not([data-ct342-locked="1"]),
[data-ct315-discover] .ct328-actions:not([data-ct342-locked="1"]),
[data-ct315-discover] .ct309-actions:not([data-ct342-locked="1"]),
[data-ct315-discover] .ct319-actions:not([data-ct342-locked="1"]),
[data-ct315-discover] .ct315-actions:not([data-ct342-locked="1"]){visibility:hidden!important}

[data-ct319-discover] .ct336-actions,[data-ct319-discover] .ct329-actions,[data-ct319-discover] .ct328-actions,
[data-ct319-discover] .ct309-actions,[data-ct319-discover] .ct319-actions,[data-ct319-discover] .ct315-actions,
[data-ct315-discover] .ct336-actions,[data-ct315-discover] .ct329-actions,[data-ct315-discover] .ct328-actions,
[data-ct315-discover] .ct309-actions,[data-ct315-discover] .ct319-actions,[data-ct315-discover] .ct315-actions,
[data-ct319-discover] .ct336-actions>button,[data-ct319-discover] .ct329-actions>button,[data-ct319-discover] .ct328-actions>button,
[data-ct319-discover] .ct309-actions>button,[data-ct319-discover] .ct319-actions>button,[data-ct319-discover] .ct315-actions>button,
[data-ct315-discover] .ct336-actions>button,[data-ct315-discover] .ct329-actions>button,[data-ct315-discover] .ct328-actions>button,
[data-ct315-discover] .ct309-actions>button,[data-ct315-discover] .ct319-actions>button,[data-ct315-discover] .ct315-actions>button{
 transition:none!important;animation:none!important;will-change:auto!important
}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='discover')bind342()},0);

window.__ctR342={version:'1.0.133',lockRow:lockRow342,lockAll:lockAll342,schedule:schedule342,bind:bind342,poster:poster342,buttonWidths:buttonWidths342};
window.__ctR342Test={lockRow342,lockAll342,poster342,buttonWidths342};
})();

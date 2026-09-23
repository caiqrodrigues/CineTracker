/* CineTracker Web 1.0.132 r341 — Discover actions locked to the rendered poster, explicit pixel buttons, legacy layout writers retired. */
(()=>{
'use strict';
if(window.__ctR341?.version==='1.0.132')return;
window.__ctR341Marker='discover-poster-lock+explicit-button-pixels+legacy-layout-writers-retired';
window.__ctR341Discover='poster-rect-is-authority+equal-explicit-px-buttons+resize-observer+late-settle';
window.__ctR341Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');
const ACTION_ROWS_341='.ct336-actions,.ct329-actions,.ct328-actions,.ct309-actions,.ct319-actions,.ct315-actions';
const OWNER_341='.ct336-slot,[data-ct319-item],[data-ct315-item],.ct329-slot,.ct328-slot,.ct309-slot,.ct329-daily,.ct328-daily,.ct309-daily';
let raf341=0,late341=[],mo341=null,moHost341=null,ro341=null,observedPosters341=new WeakSet();

function owner341(row){return row?.closest?.(OWNER_341)||row?.parentElement||null}
function poster341(row){
 const owner=owner341(row);if(!owner)return null;
 const selectors=[
  '.ct288-poster','.ct288-empty-poster',
  ':scope > .ct336-cardwrap .ct288-card',':scope > .ct329-cardwrap .ct288-card',
  ':scope > .ct328-cardwrap .ct288-card',':scope > .ct309-cardwrap .ct288-card',
  ':scope > .ct288-card'
 ];
 for(const s of selectors){
  const el=q(s,owner),r=el?.getBoundingClientRect?.();
  if(n(r?.width)>40&&n(r?.height)>40)return el;
 }
 return null;
}
function round3(v){return Math.round(n(v)*1000)/1000}
function geometry341(row){
 const poster=poster341(row),pr=poster?.getBoundingClientRect?.(),buttons=qa(':scope > button',row);
 if(!poster||n(pr?.width)<=40||buttons.length<1)return null;
 const width=round3(pr.width),gap=buttons.length>=3?3:buttons.length===2?4:0;
 const each=round3(Math.max(1,(width-gap*Math.max(0,buttons.length-1))/Math.max(1,buttons.length)));
 return{poster,pr,buttons,width,gap,each};
}
function fixRow341(row){
 const g=geometry341(row);if(!g||g.buttons.length<2||g.buttons.length>4)return false;
 const {poster,buttons,width,gap,each}=g,px=width+'px',h=buttons.length>=3?28:30;

 imp(row,'box-sizing','border-box');
 imp(row,'display','flex');imp(row,'flex-direction','row');imp(row,'flex-wrap','nowrap');
 imp(row,'grid-template-columns','none');imp(row,'grid-template-rows','none');imp(row,'grid-auto-flow','initial');
 imp(row,'align-items','stretch');imp(row,'justify-content','flex-start');imp(row,'align-self','flex-start');
 imp(row,'position','relative');imp(row,'left','auto');imp(row,'right','auto');imp(row,'top','auto');imp(row,'bottom','auto');
 imp(row,'inset','auto');imp(row,'transform','none');imp(row,'translate','none');imp(row,'float','none');
 imp(row,'width',px);imp(row,'min-width',px);imp(row,'max-width',px);
 imp(row,'height',h+'px');imp(row,'min-height',h+'px');imp(row,'max-height',h+'px');
 imp(row,'gap',gap+'px');imp(row,'column-gap',gap+'px');imp(row,'row-gap','0');
 imp(row,'margin','5px 0 0');imp(row,'padding','0');imp(row,'overflow','hidden');
 imp(row,'contain','layout paint');imp(row,'z-index','4');

 buttons.forEach((b,index)=>{
  const bp=each+'px';
  imp(b,'box-sizing','border-box');imp(b,'display','flex');imp(b,'visibility','visible');
  imp(b,'position','relative');imp(b,'inset','auto');imp(b,'left','auto');imp(b,'right','auto');imp(b,'top','auto');imp(b,'bottom','auto');
  imp(b,'transform','none');imp(b,'translate','none');imp(b,'rotate','none');imp(b,'scale','none');imp(b,'float','none');imp(b,'clear','none');
  imp(b,'flex','0 0 '+bp);imp(b,'flex-grow','0');imp(b,'flex-shrink','0');imp(b,'flex-basis',bp);
  imp(b,'width',bp);imp(b,'min-width',bp);imp(b,'max-width',bp);
  imp(b,'height',h+'px');imp(b,'min-height',h+'px');imp(b,'max-height',h+'px');
  imp(b,'margin','0');imp(b,'padding',buttons.length>=3?'1px 1px':'2px 3px');
  imp(b,'align-items','center');imp(b,'justify-content','center');imp(b,'align-self','stretch');
  imp(b,'grid-area','auto');imp(b,'grid-row','auto');imp(b,'grid-column','auto');imp(b,'order',String(index));
  imp(b,'z-index','1');imp(b,'font-size',buttons.length>=3?'7px':'8.5px');imp(b,'line-height','1');
  imp(b,'letter-spacing','-.08px');imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');
  imp(b,'pointer-events',b.disabled?'none':'auto');
 });
 row.dataset.ct341PosterWidth=String(width);row.dataset.ct341ButtonWidth=String(each);row.dataset.ct341Actions=String(buttons.length);
 poster.dataset.ct341ActionAuthority='poster';
 return true;
}
function fixAll341(){
 if(routeNow()!=='discover')return false;
 const root=q('[data-ct319-discover]')||q('[data-ct315-discover]')||document;
 let fixed=0;for(const row of qa(ACTION_ROWS_341,root))if(fixRow341(row))fixed++;
 if(root?.dataset)root.dataset.ct341Rows=String(fixed);
 bindPosterResize341(root);
 return fixed>0;
}
function clearLate341(){for(const id of late341)clearTimeout(id);late341=[]}
function queue341(){
 cancelAnimationFrame(raf341);
 raf341=requestAnimationFrame(()=>requestAnimationFrame(()=>fixAll341()));
}
function settle341(){
 clearLate341();queue341();
 for(const ms of [40,140,320,560])late341.push(setTimeout(()=>fixAll341(),ms));
}
function bindPosterResize341(root=document){
 if(!window.ResizeObserver)return false;
 if(!ro341)ro341=new ResizeObserver(()=>queue341());
 for(const p of qa('.ct288-poster,.ct288-empty-poster',root)){
  if(observedPosters341.has(p))continue;observedPosters341.add(p);ro341.observe(p);
 }
 return true;
}
function bindMutation341(){
 if(routeNow()!=='discover'){mo341?.disconnect?.();moHost341=null;return false}
 const host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!host)return false;
 if(host===moHost341&&mo341)return true;
 mo341?.disconnect?.();moHost341=host;
 if(window.MutationObserver){
  mo341=new MutationObserver(muts=>{
   if(muts.some(m=>m.addedNodes.length||m.removedNodes.length)){bindPosterResize341(host);settle341()}
  });
  mo341.observe(host,{subtree:true,childList:true});
 }
 bindPosterResize341(host);settle341();return true;
}

/* Remove r338/r339 layout wrappers from the r336 API so future repaints have only one geometry writer. */
function base336_341(fn){
 let cur=fn,guard=0;
 while(typeof cur==='function'&&guard++<8){
  if(typeof cur.__ctR339Base==='function'){cur=cur.__ctR339Base;continue}
  if(typeof cur.__ctR338Base==='function'){cur=cur.__ctR338Base;continue}
  break;
 }
 return cur;
}
function own336_341(name){
 const api=window.__ctR336;if(!api)return false;
 const base=base336_341(api[name]);if(typeof base!=='function')return false;
 const wrapped=function(){
  const out=base.apply(this,arguments);settle341();
  if(out&&typeof out.finally==='function')out.finally(settle341);
  return out;
 };
 wrapped.__ctR341Owned=true;wrapped.__ctR341Base=base;api[name]=wrapped;return true;
}
for(const name of ['paintForYou','applyForYouFilter','swapForYou','persistForYou','switchDiscover'])own336_341(name);

const previousEarly341=window.__ctR336EarlyHandle;
if(typeof previousEarly341==='function'){
 window.__ctR336EarlyHandle=function(target){
  const handled=previousEarly341(target);
  if(handled)settle341();
  return handled;
 };
}

try{
 const baseRender341=renderDiscover;
 renderDiscover=function(){
  const out=baseRender341.apply(this,arguments);
  setTimeout(()=>{bindMutation341();settle341()},0);
  return out;
 };
}catch{}

document.addEventListener('click',e=>{
 if(routeNow()!=='discover'||!e.target?.closest)return;
 if(e.target.closest('[data-ct319-tab],[data-ct319-type],[data-ct334-fy-kind],[data-ct336-fy-kind],[data-ct319-provider],[data-ct315-type],[data-ct315-tab],'+
  '[data-ct319-action],[data-ct315-action],[data-ct336-action],[data-ct336-swap],[data-ct336-swap-only],[data-ct329-action],[data-ct329-swap],[data-ct309-action],[data-ct309-swap]')){
  settle341();
 }
},true);
window.addEventListener('resize',settle341,{passive:true});
window.addEventListener('orientationchange',settle341,{passive:true});

const style=document.createElement('style');style.id='ct-web-r341';style.textContent=`
[data-ct319-discover] .ct336-actions,[data-ct319-discover] .ct329-actions,[data-ct319-discover] .ct328-actions,
[data-ct319-discover] .ct309-actions,[data-ct319-discover] .ct319-actions,[data-ct319-discover] .ct315-actions,
[data-ct315-discover] .ct336-actions,[data-ct315-discover] .ct329-actions,[data-ct315-discover] .ct328-actions,
[data-ct315-discover] .ct309-actions,[data-ct315-discover] .ct319-actions,[data-ct315-discover] .ct315-actions{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;grid-template-columns:none!important;
 align-items:stretch!important;justify-content:flex-start!important;overflow:hidden!important;padding:0!important;transform:none!important
}
[data-ct319-discover] .ct336-actions>button,[data-ct319-discover] .ct329-actions>button,[data-ct319-discover] .ct328-actions>button,
[data-ct319-discover] .ct309-actions>button,[data-ct319-discover] .ct319-actions>button,[data-ct319-discover] .ct315-actions>button,
[data-ct315-discover] .ct336-actions>button,[data-ct315-discover] .ct329-actions>button,[data-ct315-discover] .ct328-actions>button,
[data-ct315-discover] .ct309-actions>button,[data-ct315-discover] .ct319-actions>button,[data-ct315-discover] .ct315-actions>button{
 box-sizing:border-box!important;display:flex!important;visibility:visible!important;position:relative!important;inset:auto!important;
 transform:none!important;float:none!important;margin:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='discover'){bindMutation341();settle341()}},0);
setTimeout(()=>{if(routeNow()==='discover')settle341()},700);

window.__ctR341={
 version:'1.0.132',fixRow:fixRow341,fixAll:fixAll341,settle:settle341,poster:poster341,geometry:geometry341,
 bindMutation:bindMutation341,bindPosterResize:bindPosterResize341,base336:base336_341
};
window.__ctR341Test={fixRow341,fixAll341,poster341,geometry341,base336_341};
})();

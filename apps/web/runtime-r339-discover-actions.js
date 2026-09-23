/* CineTracker Web 1.0.130 r339 — ações do Pra Você limitadas exatamente à largura real do card/capa. */
(()=>{
'use strict';
if(window.__ctR339?.version==='1.0.130')return;
window.__ctR339Marker='discover-actions-exact-card-width-mobile-no-overlap';
window.__ctR339Discover='slot+actions=measured-card-width;three-buttons-contained';
window.__ctR339Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');

let raf339=0,timers339=[];
function clearTimers339(){for(const id of timers339)clearTimeout(id);timers339=[]}
function measuredCardWidth339(slot){
 const candidates=[
  q(':scope > .ct336-cardwrap .ct288-card',slot),
  q(':scope > .ct336-cardwrap .ct288-poster',slot),
  q(':scope > .ct336-cardwrap',slot)
 ];
 for(const el of candidates){
  const w=Number(el?.getBoundingClientRect?.().width||0);
  if(Number.isFinite(w)&&w>40)return Math.round(w*1000)/1000;
 }
 const wrap=q(':scope > .ct336-cardwrap',slot),css=Number.parseFloat(getComputedStyle(wrap||slot).width||'0');
 return Number.isFinite(css)&&css>40?Math.round(css*1000)/1000:154;
}
function fixSlot339(slot){
 const row=q(':scope > .ct336-actions',slot),wrap=q(':scope > .ct336-cardwrap',slot);
 if(!row||!wrap)return false;
 const buttons=qa(':scope > button.ct336-action',row);
 if(buttons.length<2||buttons.length>3)return false;
 const w=measuredCardWidth339(slot),px=w+'px';

 imp(slot,'box-sizing','border-box');
 imp(slot,'flex','0 0 '+px);
 imp(slot,'width',px);imp(slot,'min-width',px);imp(slot,'max-width',px);
 imp(slot,'overflow','visible');

 const head=q(':scope > .ct336-slot-head',slot);
 for(const el of [head,wrap].filter(Boolean)){
  imp(el,'box-sizing','border-box');imp(el,'width',px);imp(el,'min-width',px);imp(el,'max-width',px);
 }
 imp(row,'box-sizing','border-box');
 imp(row,'display','flex');imp(row,'flex-flow','row nowrap');
 imp(row,'align-items','stretch');imp(row,'justify-content','stretch');
 imp(row,'gap',buttons.length===3?'3px':'4px');
 imp(row,'width',px);imp(row,'min-width',px);imp(row,'max-width',px);
 imp(row,'height','28px');imp(row,'min-height','28px');imp(row,'max-height','28px');
 imp(row,'margin','5px 0 0');imp(row,'padding','0');
 imp(row,'position','relative');imp(row,'inset','auto');
 imp(row,'left','auto');imp(row,'right','auto');imp(row,'top','auto');imp(row,'bottom','auto');
 imp(row,'transform','none');imp(row,'translate','none');imp(row,'rotate','none');imp(row,'scale','none');
 imp(row,'overflow','hidden');imp(row,'direction','ltr');
 imp(row,'contain','layout paint');

 const weights=buttons.length===3?[1.25,.9,1]:[1,1];
 buttons.forEach((b,index)=>{
  imp(b,'box-sizing','border-box');imp(b,'display','flex');imp(b,'visibility','visible');
  imp(b,'position','static');imp(b,'inset','auto');
  imp(b,'left','auto');imp(b,'right','auto');imp(b,'top','auto');imp(b,'bottom','auto');
  imp(b,'transform','none');imp(b,'translate','none');imp(b,'rotate','none');imp(b,'scale','none');
  imp(b,'float','none');imp(b,'clear','none');
  imp(b,'flex',String(weights[index]||1)+' 1 0px');imp(b,'flex-basis','0px');
  imp(b,'width','0');imp(b,'min-width','0');imp(b,'max-width','100%');
  imp(b,'height','28px');imp(b,'min-height','28px');imp(b,'max-height','28px');
  imp(b,'margin','0');imp(b,'padding',buttons.length===3?'1px 1px':'2px 3px');
  imp(b,'align-items','center');imp(b,'justify-content','center');imp(b,'align-self','stretch');
  imp(b,'grid-area','auto');imp(b,'grid-row','auto');imp(b,'grid-column','auto');
  imp(b,'order',String(index));imp(b,'z-index','auto');
  imp(b,'font-size',buttons.length===3?'7.25px':'8.5px');imp(b,'line-height','1');
  imp(b,'letter-spacing','-.08px');imp(b,'white-space','nowrap');
  imp(b,'overflow','hidden');imp(b,'text-overflow','clip');imp(b,'pointer-events','auto');
 });
 slot.dataset.ct339CardWidth=String(w);
 row.dataset.ct339CardWidth=String(w);
 row.dataset.ct339Actions=String(buttons.length);
 return true;
}
function fixActions339(){
 if(routeNow()!=='discover')return false;
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let fixed=0;
 for(const slot of qa('.ct336-slot',root))if(fixSlot339(slot))fixed++;
 if(fixed){root.dataset.ct339Layout='exact-card-width';root.dataset.ct339Fixed=String(fixed)}
 return fixed>0;
}
function queueFix339(){
 cancelAnimationFrame(raf339);clearTimers339();
 queueMicrotask(()=>fixActions339());
 raf339=requestAnimationFrame(()=>fixActions339());
 for(const ms of [120,280])timers339.push(setTimeout(()=>fixActions339(),ms));
}
function wrap336(name){
 const api=window.__ctR336,base=api?.[name];
 if(typeof base!=='function'||base.__ctR339Wrapped)return;
 const wrapped=function(){
  const out=base.apply(this,arguments);queueFix339();
  if(out&&typeof out.finally==='function')out.finally(queueFix339);
  return out;
 };
 wrapped.__ctR339Wrapped=true;wrapped.__ctR339Base=base;api[name]=wrapped;
}
for(const name of ['paintForYou','applyForYouFilter','swapForYou','persistForYou','switchDiscover'])wrap336(name);

const previousEarly339=window.__ctR336EarlyHandle;
function earlyHandle339(target){
 const handled=typeof previousEarly339==='function'?previousEarly339(target):false;
 if(handled)queueFix339();
 return handled;
}
window.__ctR336EarlyHandle=earlyHandle339;

const style=document.createElement('style');style.id='ct-web-r339';style.textContent=[
 '/* Pra Você: a faixa de ações nunca pode ser mais larga que o card/capa. */',
 '[data-ct336-foryou] .ct336-slot{box-sizing:border-box!important}',
 '[data-ct336-foryou] .ct336-actions{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;overflow:hidden!important;contain:layout paint!important}',
 '[data-ct336-foryou] .ct336-actions>button.ct336-action{box-sizing:border-box!important;display:flex!important;position:static!important;min-width:0!important;max-width:100%!important;margin:0!important;transform:none!important;translate:none!important;white-space:nowrap!important;overflow:hidden!important}',
 '[data-ct336-foryou] .ct336-actions-three>button.ct336-action{font-size:7.25px!important;padding-left:1px!important;padding-right:1px!important}',
 '[data-ct336-foryou] .ct336-actions-two>button.ct336-action{font-size:8.5px!important}'
].join('\n');document.head.appendChild(style);

window.addEventListener('resize',queueFix339,{passive:true});
window.addEventListener('orientationchange',queueFix339,{passive:true});
setTimeout(queueFix339,0);setTimeout(queueFix339,360);

window.__ctR339={version:'1.0.130',fixActions:fixActions339,fixSlot:fixSlot339,queueFix:queueFix339,measuredCardWidth:measuredCardWidth339,earlyHandle:earlyHandle339};
window.__ctR339Test={
 fixActions339,fixSlot339,measuredCardWidth339,
 geometry(){
  return qa('[data-ct336-foryou] .ct336-slot').map(slot=>({
   slot:slot.getBoundingClientRect(),
   card:(q(':scope > .ct336-cardwrap .ct288-card',slot)||q(':scope > .ct336-cardwrap',slot))?.getBoundingClientRect?.(),
   row:q(':scope > .ct336-actions',slot)?.getBoundingClientRect?.(),
   buttons:qa(':scope > .ct336-actions > button.ct336-action',slot).map(b=>b.getBoundingClientRect())
  }));
 }
};
})();
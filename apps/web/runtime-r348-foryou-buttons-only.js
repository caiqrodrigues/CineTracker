/* CineTracker Web 1.0.139 r348 — buttons-only fix for Descobrir > Pra você. */
(()=>{
'use strict';
if(window.__ctR348?.version==='1.0.139')return;
window.__ctR348Marker='foryou-buttons-only+direct-children+no-stray-swap';
window.__ctR348Scope='discover-foryou-buttons-only';
window.__ctR348Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');
let mo=null,host=null;

function typeOf(x){return String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv'}
function idOf(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf(x){const id=idOf(x);return id>0?(typeOf(x)==='movie'?'movie':'tv')+':'+id:''}
function modelItem(slot,m){
 const name=String(slot?.dataset?.ct336Slot||'');
 if(name==='daily')return m?.daily||null;
 const [bucket,kind]=name.split(':');return m?.[bucket]?.[kind]||null;
}
function poolLength(slot,m){
 const name=String(slot?.dataset?.ct336Slot||'');
 if(name==='daily')return Number(m?.dailyLength||0);
 const [bucket,kind]=name.split(':');return Number(m?.lengths?.[bucket]?.[kind]||0);
}
function buildButton(label,attrs={}){
 const b=document.createElement('button');b.type='button';b.className='chip ct336-action';b.textContent=label;
 for(const [k,v] of Object.entries(attrs))if(v!=null)b.dataset[k]=String(v);
 return b;
}
function styleRow(row,poster,count){
 const pr=poster?.getBoundingClientRect?.(),slot=row.closest('.ct336-slot'),sr=slot?.getBoundingClientRect?.();
 if(!pr||pr.width<40)return false;
 const width=Math.round(pr.width*1000)/1000,gap=4,usable=width-gap*(count-1),each=Math.floor((usable/count)*1000)/1000;
 const widths=Array(count).fill(each);widths[count-1]=Math.round((width-widths.slice(0,-1).reduce((a,v)=>a+v,0)-gap*(count-1))*1000)/1000;
 const off=Math.max(0,Math.round((pr.left-(sr?.left||pr.left))*1000)/1000);
 for(const [k,v] of Object.entries({
  display:'grid','grid-template-columns':widths.map(v=>v+'px').join(' '),'grid-template-rows':'30px',
  position:'static',left:'auto',right:'auto',top:'auto',bottom:'auto',transform:'none',translate:'none',
  width:width+'px','min-width':width+'px','max-width':width+'px',height:'30px','min-height':'30px','max-height':'30px',
  gap:gap+'px','column-gap':gap+'px','row-gap':'0',margin:'6px 0 0 '+off+'px',padding:'0',overflow:'hidden',visibility:'visible'
 }))imp(row,k,v);
 qa(':scope > button.ct336-action',row).forEach((b,i)=>{
  const w=widths[i]+'px';
  for(const [k,v] of Object.entries({
   display:'flex',position:'static',left:'auto',right:'auto',top:'auto',bottom:'auto',inset:'auto',
   transform:'none',translate:'none',float:'none',clear:'none',flex:'none','flex-basis':'auto','flex-grow':'0','flex-shrink':'0',
   width:w,'min-width':w,'max-width':w,height:'30px','min-height':'30px','max-height':'30px',
   margin:'0',padding:'2px','grid-column':'auto','grid-row':'1',order:String(i),
   'align-items':'center','justify-content':'center',visibility:'visible','white-space':'nowrap',overflow:'hidden','text-overflow':'ellipsis',
   'font-size':'8px','line-height':'1',transition:'none',animation:'none'
  }))imp(b,k,v);
  b.hidden=false;b.removeAttribute('hidden');
 });
 row.dataset.ct348Width=String(width);row.dataset.ct348Count=String(count);
 return true;
}
function fixSlot(slot,m){
 const item=modelItem(slot,m);if(!item)return false;
 const name=String(slot.dataset.ct336Slot||''),bucket=name==='daily'?'daily':name.split(':')[0],swap=name==='daily'?'daily':name;
 const key=keyOf(item),canSwap=poolLength(slot,m)>1,expected=bucket==='watch'?2:3;
 let row=q(':scope > .ct336-actions',slot);
 if(!row){row=document.createElement('div');slot.appendChild(row)}
 const stray=qa('[data-ct336-swap-only],.ct336-action',slot).filter(el=>el.parentElement!==row);
 stray.forEach(el=>el.remove());
 row.className='ct336-actions '+(bucket==='watch'?'ct336-actions-two':'ct336-actions-three');
 row.dataset.ct336Bucket=bucket;
 const direct=qa(':scope > button.ct336-action',row),labels=bucket==='watch'?['✓ Visto','↻ Trocar']:['+ Watchlist','✓ Visto','↻ Trocar'];
 const valid=direct.length===expected&&direct.every((b,i)=>{
  if(String(b.textContent||'').trim()!==labels[i])return false;
  if(labels[i]==='↻ Trocar')return String(b.dataset.ct336SwapOnly||'')===swap;
  const action=labels[i]==='+ Watchlist'?'watchlist':'seen';
  return String(b.dataset.ct336Action||'')===action&&String(b.dataset.ct336Media||'')===key&&String(b.dataset.ct336Swap||'')===swap;
 });
 if(!valid){
  const buttons=[];
  if(bucket!=='watch')buttons.push(buildButton('+ Watchlist',{ct336Action:'watchlist',ct336Media:key,ct336Swap:swap}));
  buttons.push(buildButton('✓ Visto',{ct336Action:'seen',ct336Media:key,ct336Swap:swap}));
  buttons.push(buildButton('↻ Trocar',{ct336SwapOnly:swap}));
  row.replaceChildren(...buttons);
 }
 const sw=q(':scope > [data-ct336-swap-only]',row);if(sw)sw.disabled=!canSwap;
 const poster=q('.ct288-poster,.ct288-empty-poster',slot);
 styleRow(row,poster,expected);
 return true;
}
function fixAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 const m=window.__ctR336Test?.fyModel336?.();if(!m)return false;
 let n=0;for(const slot of qa('.ct336-slot',root))if(fixSlot(slot,m))n++;
 root.dataset.ct348Fixed=String(n);return n>0;
}
function schedule(){queueMicrotask(fixAll)}
function bind(){
 const h=q('[data-ct319-content]');if(!h||h===host)return;mo?.disconnect?.();host=h;
 mo=new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes.length||m.removedNodes.length))fixAll()});
 mo.observe(h,{subtree:true,childList:true});
}
const basePaint=window.__ctR336?.paintForYou;
if(typeof basePaint==='function'){
 window.__ctR336.paintForYou=function(){const out=basePaint.apply(this,arguments);queueMicrotask(()=>{fixAll();bind()});return out};
}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct336-action],[data-ct336-swap-only]'))queueMicrotask(schedule)},true);
setTimeout(()=>{fixAll();bind()},0);
window.__ctR348={version:'1.0.139',fixAll,fixSlot,styleRow,bind};
})();

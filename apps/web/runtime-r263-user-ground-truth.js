/* CineTracker Web 1.0.54 r263 — user video ground truth. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR263)return;
window.__ctR263='user-ground-truth-home-list-detail-discover-sports-f1';
window.__ctR263Home='vertical-list-only-no-carousel';
window.__ctR263Detail='local-x-seasons-season-graphs-similar-only';
window.__ctR263Discover='all-tabs-local-x-standard-2x3';
window.__ctR263Sports='canonical-watch-rpc+fresh-f1-jolpica-sync';
window.__ctR263Horizontal='page-fixed-only-approved-local-rails';

const q263=(s,r=document)=>r?.querySelector?.(s)||null;
const qa263=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm263=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function day263(d=new Date()){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
function shift263(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return day263(d)}

function enforceHomeList263(){
 const root=q263('[data-home]');if(!root)return;
 for(const el of qa263('[data-home-view] .home-section .stack,.home-section .stack',root)){
  el.classList.remove('ct262-home-rail','ct262-xrail','ct257-local-x','ct256-local-x');
  el.classList.add('ct263-home-list');
  delete el.dataset.ct262Rail;delete el.dataset.ct262Pointer;delete el.dataset.ct257Drag;
  if(el.scrollLeft)el.scrollLeft=0;
 }
}

function bindLocalX263(el,kind='rail'){
 if(!el)return;el.classList.add('ct263-local-x',`ct263-${kind}-rail`);
 if(el.dataset.ct263Drag==='1')return;el.dataset.ct263Drag='1';let st=null,moved=false;
 el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||(e.button!=null&&e.button!==0)||el.scrollWidth<=el.clientWidth+2)return;st={id:e.pointerId,x:e.clientX,y:e.clientY,left:el.scrollLeft,drag:false};moved=false;try{el.setPointerCapture(e.pointerId)}catch{}});
 el.addEventListener('pointermove',e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.drag){if(Math.abs(dx)<5&&Math.abs(dy)<5)return;if(Math.abs(dy)>=Math.abs(dx)){st=null;return}st.drag=true;moved=true}if(st.drag){e.preventDefault();el.scrollLeft=st.left-dx}});
 const end=e=>{if(!st||e.pointerId!==st.id)return;try{el.releasePointerCapture(e.pointerId)}catch{}st=null};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
}
function firstWide263(section,selectors){
 for(const s of selectors){for(const el of qa263(s,section)){if(el.children?.length>1)return el}}
 for(const el of qa263('div,ul,ol',section)){if(el.children?.length>1&&el.scrollWidth>el.clientWidth+2)return el}
 return null;
}
function armDetail263(){
 if(!/^series(?:\/|$)/.test(String(typeof route==='function'?route():'')))return;
 const root=q263('[data-ct262-series-detail],[data-series-detail],[data-detail],.series-detail,.detail-page')||q263('#app');if(!root)return;
 const direct={
  seasons:['.ct262-season-rail','.ct244-seasons-scroll','.season-tabs','.season-list','.season-row','[data-seasons]','.ct169-season-row'],
  graph:['.ct244-chart-scroll','.ct169-season-chart-carousel','.ct169-chart-scroll','.episode-graph','.graph-shell','.chart-wrap','.chart-scroll','[data-chart]','[data-episode-chart]'],
  similar:['.ct262-related-rail','.related-scroll','.related-grid','.related-row','[data-related]','.similar-scroll','.similar-grid','.similar-row','[data-similar]']
 };
 for(const el of qa263(direct.seasons.join(','),root))bindLocalX263(el,'detail');
 for(const el of qa263(direct.graph.join(','),root))bindLocalX263(el,'detail');
 for(const el of qa263(direct.similar.join(','),root))bindLocalX263(el,'detail');
 for(const section of qa263('section,.panel',root)){
  const h=norm263(q263('h2,h3,h4,.section-title,.eyebrow',section)?.textContent||'');let kind='';
  if(h.includes('temporad'))kind='seasons';
  if(/grafico|avaliacao|notas? por|temporada.*nota/.test(h))kind='graph';
  if(/semelhant|relacionad|recomendad/.test(h))kind='similar';
  if(kind){const el=firstWide263(section,direct[kind]);if(el)bindLocalX263(el,'detail')}
 }
}
function armDiscover263(){
 const root=q263('[data-ct259-discover],[data-ct257-discover],[data-ct255-discover],[data-discover]');if(!root)return;
 for(const el of qa263('.ct259-discover-tabs,.ct259-discover-types,.ct257-discover-tabs,.ct257-discover-types,.ct255-discover-tabs,.ct255-discover-types',root))bindLocalX263(el,'discover-tabs');
 const cards=qa263('.ct259-media-card,.ct257-media-card,.ct255-media-card',root);
 for(const card of cards)card.classList.add('ct263-discover-card');
 const parents=new Set(cards.map(c=>c.parentElement).filter(Boolean));for(const p of parents)if(qa263(':scope > .ct259-media-card,:scope > .ct257-media-card,:scope > .ct255-media-card',p).length>1)bindLocalX263(p,'discover');
 for(const el of qa263('.ct259-media-rail,.ct257-media-rail,.ct255-media-rail',root))bindLocalX263(el,'discover');
}
function clampPage263(){const s=document.scrollingElement||document.documentElement;if(s?.scrollLeft)s.scrollLeft=0;if(document.body?.scrollLeft)document.body.scrollLeft=0}

let f1SyncAt263=0,f1Sync263=null;
async function syncF1263(){
 if(Date.now()-f1SyncAt263<120000)return;if(f1Sync263)return f1Sync263;
 f1Sync263=(async()=>{try{await edge('ct-f1-sports-sync-r263',{date_from:shift263(-1),date_to:shift263(1)},9000);f1SyncAt263=Date.now()}catch(_){}})();
 try{await f1Sync263}finally{f1Sync263=null}
}

const paintHome263Base=typeof paintHome==='function'?paintHome:null;
if(paintHome263Base)paintHome=function(...args){const out=paintHome263Base.apply(this,args);requestAnimationFrame(enforceHomeList263);setTimeout(enforceHomeList263,80);return out};
const renderHome263Base=typeof renderHome==='function'?renderHome:null;
if(renderHome263Base)renderHome=async function(...args){const out=await renderHome263Base.apply(this,args);enforceHomeList263();return out};
const renderDiscover263Base=typeof renderDiscover==='function'?renderDiscover:null;
if(renderDiscover263Base)renderDiscover=async function(...args){const out=await renderDiscover263Base.apply(this,args);requestAnimationFrame(armDiscover263);setTimeout(armDiscover263,80);setTimeout(armDiscover263,500);return out};
const renderSports263Base=typeof renderSports==='function'?renderSports:null;
if(renderSports263Base)renderSports=async function(...args){await syncF1263();return renderSports263Base.apply(this,args)};

let reconTimer263=0;function reconcile263(){enforceHomeList263();armDetail263();armDiscover263();clampPage263()}
function queue263(ms=30){clearTimeout(reconTimer263);reconTimer263=setTimeout(reconcile263,ms)}
try{new MutationObserver(()=>queue263(35)).observe(q263('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('resize',()=>queue263(30));window.addEventListener('popstate',()=>queue263(0));window.addEventListener('pageshow',()=>queue263(0));window.addEventListener('scroll',clampPage263,{passive:true});
document.addEventListener('click',()=>setTimeout(()=>queue263(0),0),true);
window.__ctR263Test={day263,shift263,enforceHomeList263,armDetail263,armDiscover263};
queue263(0);
})();

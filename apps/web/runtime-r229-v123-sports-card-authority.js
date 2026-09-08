/* CineTracker 1.0.23 — final Sports card authority from physical video. */
(()=>{
'use strict';
if(window.__ctR229V123)return;
window.__ctR229V123='sports-card-single-action-zone-no-floating-actions';
window.__ctV123Sports='metadata-zone+single-action-zone';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function actionKind(el){
 const s=norm(el?.textContent||'').replace(/\s+/g,'');
 if(el?.hasAttribute?.('data-ct165-open-favorite')||s==='eventos'||s==='vereventos'||s.includes('vereventos'))return'events';
 if(s.includes('desmarcarcomoassistido')||s.includes('desmarcarassistido'))return'watched-off';
 if(s.includes('marcarcomoassistido')||s.includes('marcarassistido')||s==='assistido'||s.includes('assistido'))return'watched-on';
 return'';
}
function score(el,kind){
 const s=norm(el?.textContent||'').replace(/\s+/g,'');let n=0;
 if(el?.tagName==='BUTTON'||el?.tagName==='A')n+=30;
 if(kind==='events'){
  if(s==='vereventos')n+=100;
  if(el?.hasAttribute?.('data-ct165-open-favorite'))n+=40;
 }else{
  if(s==='marcarcomoassistido'||s==='desmarcarcomoassistido')n+=120;
  else if(s==='assistido')n+=90;
  else if(s.includes('marcarassistido')||s.includes('desmarcarassistido'))n+=50;
 }
 const r=el?.getBoundingClientRect?.();if(r?.width>100)n+=25;if(r?.height>32)n+=15;
 return n;
}
function choose(list,kind){return [...list].sort((a,b)=>score(b,kind)-score(a,kind))[0]||null}
function removeEmptyWrappers(card,bar){
 for(const el of qa('.ct117-event-actions,.ct119-sport-actions,.ct120-sport-actions,.ct121-actions,.ct122-actions,.fav-actions',card)){
  if(el===bar)continue;
  const meaningful=[...el.children].some(x=>actionKind(x)===''&&String(x.textContent||'').trim());
  if(!meaningful&&!el.children.length)el.remove();
 }
}
function canonicalize(card){
 if(!card||card.dataset.ct123Busy==='1')return;
 card.dataset.ct123Busy='1';
 try{
  card.classList.add('ct123-sports-card');
  const controls=qa('button,a,[role="button"],.btn,.chip,[class*="chip"]',card).filter(x=>!x.closest('.ct123-actions'));
  const eventCandidates=controls.filter(x=>actionKind(x)==='events');
  const watchCandidates=controls.filter(x=>/^watched-/.test(actionKind(x)));
  let eventBtn=choose(eventCandidates,'events');
  let watchBtn=choose(watchCandidates,'watched');
  const watchedOff=watchBtn&&actionKind(watchBtn)==='watched-off';
  for(const x of eventCandidates)if(x!==eventBtn)x.remove();
  for(const x of watchCandidates)if(x!==watchBtn)x.remove();
  let oldBar=q(':scope > .ct122-actions',card);if(oldBar){for(const x of [...oldBar.children]){const k=actionKind(x);if(k==='events'&&!eventBtn)eventBtn=x;if(/^watched-/.test(k)&&!watchBtn)watchBtn=x}oldBar.remove()}
  let bar=q(':scope > .ct123-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct123-actions';card.appendChild(bar)}
  for(const pair of [[eventBtn,'events'],[watchBtn,'watched']]){
   let [el,kind]=pair;if(!el)continue;
   if(el.tagName!=='BUTTON'&&el.tagName!=='A'){
    const b=document.createElement('button');b.type='button';for(const a of [...el.attributes])if(a.name!=='class'&&a.name!=='role')b.setAttribute(a.name,a.value);el.replaceWith(b);el=b;
   }
   el.className='ct123-action '+(kind==='watched'?'primary':'secondary');
   el.textContent=kind==='events'?'Eventos':(watchedOff?'↶ Desmarcar':'✓ Assistido');
   if(el.parentElement!==bar)bar.appendChild(el);
  }
  for(const x of qa('button,a,[role="button"],.btn,.chip,[class*="chip"]',card)){
   if(bar.contains(x))continue;
   if(actionKind(x))x.remove();
  }
  removeEmptyWrappers(card,bar);
  if(!bar.children.length)bar.remove();
 }finally{delete card.dataset.ct123Busy}
}
function sports(){
 for(const grid of qa('.event-grid')){
  grid.classList.remove('ct122-grid');grid.classList.add('ct123-grid');
  for(const card of [...grid.children])canonicalize(card);
 }
}
let timer=0;function sync(){clearTimeout(timer);timer=setTimeout(sports,40)}
try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
setInterval(sync,700);sports();
const st=document.createElement('style');st.id='ct-v123-sports-ui';st.textContent=`
.ct123-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;align-items:stretch!important;overflow:visible!important}.ct123-grid>*{min-width:0!important;width:100%!important;max-width:none!important}.ct123-sports-card{display:flex!important;flex-direction:column!important;min-width:0!important;padding:14px!important;gap:8px!important}.ct123-sports-card>.ct122-actions,.ct123-sports-card>.ct117-event-actions,.ct123-sports-card>.ct119-sport-actions,.ct123-sports-card>.ct120-sport-actions,.ct123-sports-card>.ct121-actions{display:none!important}.ct123-sports-card .chip,.ct123-sports-card [class*="chip"]{min-height:28px!important;height:auto!important;padding:5px 9px!important;font-size:10px!important;line-height:1.15!important;white-space:normal!important}.ct123-actions{margin-top:auto!important;padding-top:10px!important;width:100%!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.ct123-action{box-sizing:border-box!important;width:100%!important;min-width:0!important;height:38px!important;min-height:38px!important;padding:0 10px!important;border-radius:10px!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:11px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct123-sports-card [role="button"]:not(.ct123-action){max-width:100%!important}.ct123-sports-card>*{min-width:0!important}.ct123-sports-card small,.ct123-sports-card p,.ct123-sports-card span{overflow-wrap:anywhere}
@media(max-width:1100px){.ct123-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:700px){.ct123-grid{grid-template-columns:1fr!important}.ct123-sports-card{padding:12px!important}.ct123-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctV123SportsNow=sports;
})();
/* CineTracker Web 1.0.205 r414 — Descobrir > Pra Você: repair only missing Trocar buttons. */
(()=>{
'use strict';
if(window.__ctR414?.version==='1.0.205')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const state=()=>window.__ctR288R263?.discover263||null;
const visible=el=>{if(!el?.isConnected)return false;try{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0}catch{return true}};
const isForYou=()=>routeNow()==='discover'&&(String(state()?.tab||'foryou')==='foryou'||!!q('[data-ct411-foryou],[data-ct336-foryou],[data-ct288-foryou]'));
function root(){const all=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return all.find(visible)||all[all.length-1]||q('[data-ct411-foryou],[data-ct336-foryou],[data-ct288-foryou]')?.parentElement||null}
function sectionBy(label){const r=root();if(!r)return null;for(const h of qa('h2',r)){const t=norm(h.textContent);if(label==='daily'&&t.includes('indicacao do dia'))return h.closest('section,.panel')||h.parentElement?.parentElement||h.parentElement;if(label==='watch'&&t.includes('da sua watchlist'))return h.closest('section,.panel')||h.parentElement?.parentElement||h.parentElement;if(label==='fresh'&&t.includes('100 novos'))return h.closest('section,.panel')||h.parentElement?.parentElement||h.parentElement}return null}
function slotNameFrom(el,bucket=''){
 const raw=String(el?.dataset?.ct411Slot||el?.dataset?.ct336Slot||el?.dataset?.ct288Slot||'');
 if(raw==='daily')return'daily';
 if(/^(watch|fresh):(movie|series|anime)$/.test(raw))return raw;
 const m=raw.match(/^(watchIndex|freshIndex):(movie|series|anime)$/);if(m)return(m[1]==='watchIndex'?'watch':'fresh')+':'+m[2];
 const t=norm(q('h3',el)?.textContent||'');const kind=t.includes('filme')?'movie':t.includes('anime')?'anime':t.includes('serie')?'series':'';
 return bucket&&kind?bucket+':'+kind:'';
}
function hasItem(el){return!!q('[data-media],[data-ct288-card],.ct288-card,.ct291-card,article',el)}
function actionButtons(el){return qa('button',el).filter(b=>{const t=norm(b.textContent);return t.includes('watchlist')||t.includes('visto')||t.includes('trocar')})}
function actionRow(el){
 const buttons=actionButtons(el);if(!buttons.length)return null;
 const p=buttons[0].parentElement;if(p&&buttons.every(b=>b.parentElement===p))return p;
 return buttons[0].closest('.ct411-actions,.ct336-actions,.ct291-slot-footer,[class*="actions"]')||p||null;
}
function genericSlots(section,bucket){
 const out=new Map(),explicit=qa('[data-ct411-slot],[data-ct336-slot],[data-ct288-slot],.ct388-slot,.ct288-slot',section);
 for(const el of explicit){const name=slotNameFrom(el,bucket);if(name&&name.startsWith(bucket+':')&&!out.has(name))out.set(name,el)}
 for(const h of qa('h3',section)){
  const t=norm(h.textContent),kind=t.includes('filme')?'movie':t.includes('anime')?'anime':t.includes('serie')?'series':'';if(!kind)continue;
  const name=bucket+':'+kind;if(out.has(name))continue;
  const el=h.closest('[data-ct411-slot],[data-ct336-slot],[data-ct288-slot],.ct388-slot,.ct288-slot')||h.parentElement;if(el)out.set(name,el);
 }
 return [...out.entries()].map(([name,node])=>({name,node}));
}
function slots(){
 const out=[];const daily=sectionBy('daily'),watch=sectionBy('watch'),fresh=sectionBy('fresh');
 if(daily)out.push({name:'daily',node:q('[data-ct411-slot="daily"],[data-ct336-slot="daily"]',daily)||daily});
 if(watch)out.push(...genericSlots(watch,'watch'));
 if(fresh)out.push(...genericSlots(fresh,'fresh'));
 return out;
}
function normalizeButton(b,name){
 if(!b)return false;b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('disabled');b.removeAttribute('inert');b.setAttribute('aria-disabled','false');b.classList.add('chip','ct414-swap');b.dataset.ct414Swap=name;b.textContent='↻ Trocar';return true;
}
function ensureSlot(name,node){
 if(!node||!hasItem(node))return false;
 let existing=qa('button',node).find(b=>norm(b.textContent).includes('trocar'));
 let row=existing?.parentElement||actionRow(node);
 if(!row){row=document.createElement('div');row.className='ct414-actions';node.appendChild(row)}
 if(!existing){existing=document.createElement('button');row.appendChild(existing)}
 normalizeButton(existing,name);
 row.classList.add('ct414-actions');row.dataset.ct414Actions=name.startsWith('watch:')?'2':'3';
 return true;
}
function repair(){
 if(!isForYou())return 0;let n=0;for(const s of slots())if(ensureSlot(s.name,s.node))n++;
 document.documentElement.dataset.ct414SwapCount=String(n);return n;
}
let repairToken=0;
function scheduleRepair(){const token=++repairToken;for(const ms of [0,60,180,420,900,1800,3200,5200,8200,12000])setTimeout(()=>{if(token!==repairToken||!isForYou())return;bindPainters();repair()},ms)}
function afterPaint(){queueMicrotask(()=>repair());requestAnimationFrame(()=>repair())}
function wrapMethod(obj,key){
 const fn=obj?.[key];if(typeof fn!=='function'||fn.__ctR414SwapRepair)return false;
 const wrapped=function(){const out=fn.apply(this,arguments);afterPaint();if(out&&typeof out.then==='function')Promise.resolve(out).finally(afterPaint);return out};
 wrapped.__ctR414SwapRepair=true;wrapped.__ctR414Base=fn;obj[key]=wrapped;return true;
}
function bindPainters(){
 wrapMethod(window,'__ctR288PaintForYou');wrapMethod(window,'paintForYou263');
 for(const n of ['__ctR336','__ctR359','__ctR365','__ctR388','__ctR395','__ctR396','__ctR397','__ctR398','__ctR399','__ctR400','__ctR401','__ctR402','__ctR403','__ctR404','__ctR405','__ctR406','__ctR407','__ctR408','__ctR409','__ctR410','__ctR411','__ctR412','__ctR413']){
  const o=window[n];if(!o||typeof o!=='object')continue;for(const k of ['paintForYou','renderForYou','renderSlot'])wrapMethod(o,k);
 }
 return true;
}
const locks=new Set();
async function swap(name,btn){
 if(!name||locks.has(name))return false;locks.add(name);btn?.setAttribute('aria-busy','true');
 try{
  const owner=window.__ctR411;let ok=false;
  if(typeof owner?.swap==='function')ok=!!owner.swap(name);
  if(!ok&&typeof owner?.loadForYou==='function'){
   try{await Promise.resolve(owner.loadForYou(false))}catch{}
   if(typeof owner?.swap==='function')ok=!!owner.swap(name);
  }
  if(!ok&&typeof window.__ctR363?.handle==='function')ok=!!window.__ctR363.handle({action:'swap',name});
  if(!ok){
   const legacy=name==='daily'?'':name.replace(/^watch:/,'watchIndex:').replace(/^fresh:/,'freshIndex:');
   const b=legacy?q('[data-ct288-swap="'+legacy+'"]'):q('[data-ct263-swap]');if(b&&b!==btn){b.click();ok=true}
  }
  afterPaint();scheduleRepair();return ok;
 }finally{btn?.removeAttribute('aria-busy');locks.delete(name)}
}
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const b=t.closest('[data-ct414-swap]');if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void swap(String(b.dataset.ct414Swap||''),b);return}
 if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct263-discover-tab="foryou"]'))scheduleRepair();
},true);
window.addEventListener('popstate',()=>{if(isForYou())scheduleRepair()});
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())scheduleRepair()});
window.__ctR414={version:'1.0.205',scope:'discover-foryou-swap-only',repair,scheduleRepair,bindPainters,swap};
window.__ctR414Marker='foryou-swap-only-visible-functional-legacy-dom-repair';
bindPainters();queueMicrotask(()=>{repair();scheduleRepair()});
})();
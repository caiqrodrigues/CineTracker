/* CineTracker Web 1.0.86 r295 — single-owner Discover shell, source-level eight tabs and cache-first switching. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR295)return;
window.__ctR295='discover-single-owner-fast-tabs-no-releases';
window.__ctR295Tabs='foryou-top10-trending-popular-new-anticipated-top-calendar';
window.__ctR295Renderer='single-owner-stable-shell-no-mid-session-rebuild';
window.__ctR295Switch='cache-first-no-loading-reset';
window.__ctR295Performance='retire-r293-global-observer-and-click-refetch';
window.__ctR295Android='preserved-1.0.20-10062';

const CANON=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const ALLOWED=new Set(CANON.map(x=>x[0]));
const snapshots=new Map();
let authorityAt=0,authorityTimer=0,authorityRunning=false;
const q295=(s,r=document)=>r?.querySelector?.(s)||null;
const qa295=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const alive295=()=>{try{return String(route())==='discover'}catch{return false}};
const normTab295=v=>ALLOWED.has(String(v||''))?String(v):'foryou';
const type295=()=>String(discover263?.type||'all');
const snapKey295=(tab=discover263?.tab)=>`${type295()}:${normTab295(tab)}`;
const browseKey295=tab=>`${day263()}:${type295()}:${normTab295(tab)}`;

function source295(){
 try{
  if(Array.isArray(DTABS263))DTABS263.splice(0,DTABS263.length,...CANON.map(([a,b])=>[a,b]));
  if(typeof ct288TabLabels==='object'&&ct288TabLabels){delete ct288TabLabels.releases;Object.assign(ct288TabLabels,{trending:'Em alta',popular:'Populares',new:'Novidades',anticipated:'Mais Aguardados',top:'Mais bem avaliados',calendar:'Calendário'})}
  if(!ALLOWED.has(String(discover263.tab||'')))discover263.tab='foryou';
 }catch{}
}
function tabHtml295(){return CANON.map(([k,l])=>`<button type="button" class="chip ${discover263.tab===k?'active':''}" data-ct263-discover-tab="${k}">${l}</button>`).join('')}
function ensureTabs295(root=q295('[data-ct288-discover],[data-ct263-discover]')){
 source295();if(!root)return false;let changed=false;
 for(const rail of qa295('[data-ct288-tabs],.ct263-discover-tabs',root)){
  const ids=qa295('[data-ct263-discover-tab]',rail).map(b=>String(b.dataset.ct263DiscoverTab||''));
  const exact=ids.length===CANON.length&&ids.every((v,i)=>v===CANON[i][0]);
  if(!exact){rail.innerHTML=tabHtml295();changed=true}
 }
 try{syncDiscover263()}catch{}
 return changed;
}
function decorate295(root=document){
 try{window.__ctR290Scan?.(root)}catch{}
 try{window.__ctR291Test?.decorate?.(root)}catch{}
 try{armDiscoverRails263(root)}catch{}
}
function remember295(tab=discover263?.tab){
 if(!alive295())return false;const host=q295('[data-ct263-discover-content]');if(!host)return false;
 const html=host.innerHTML;if(!html||(/^\s*<div class="ct263-loading"/.test(html)&&!host.querySelector('[data-ct288-card],.ct288-top-shell,.ct288-browse-block,[data-ct288-foryou]')))return false;
 snapshots.set(snapKey295(tab),html);return true;
}
function restore295(tab){
 const host=q295('[data-ct263-discover-content]');if(!host)return false;const key=snapKey295(tab),html=snapshots.get(key);
 if(html){host.innerHTML=html;decorate295(host);return true}
 if(tab==='foryou'&&discover263.forYou&&typeof paintForYou263==='function'){paintForYou263();return true}
 if(tab!=='foryou'&&tab!=='top10'){
  const rows=discover263.cache?.get?.(browseKey295(tab));if(rows){paintBrowse263(rows,tab);return true}
 }
 return false;
}
function scheduleAuthority295(){
 if(authorityRunning||authorityTimer||!alive295()||discover263.tab!=='foryou'||Date.now()-authorityAt<300000)return;
 const run=async()=>{authorityTimer=0;if(!alive295()||discover263.tab!=='foryou'||authorityRunning||Date.now()-authorityAt<300000)return;const fn=window.__ctR293Test?.refresh;if(typeof fn!=='function')return;authorityRunning=true;try{const ok=await fn(false);if(ok){authorityAt=Date.now();remember295('foryou')}}finally{authorityRunning=false}};
 if(typeof requestIdleCallback==='function')authorityTimer=requestIdleCallback(()=>void run(),{timeout:900});else authorityTimer=setTimeout(()=>void run(),500);
}

const paintForYou295Base=typeof paintForYou263==='function'?paintForYou263:null;
if(paintForYou295Base)paintForYou263=function(...args){const out=paintForYou295Base.apply(this,args);remember295('foryou');if(!authorityRunning)scheduleAuthority295();return out};
const paintBrowse295Base=typeof paintBrowse263==='function'?paintBrowse263:null;
if(paintBrowse295Base)paintBrowse263=function(rows,tab,...rest){const out=paintBrowse295Base.call(this,rows,tab,...rest);remember295(tab);return out};
const paintTop295Base=typeof ct288PaintTop==='function'?ct288PaintTop:null;
if(paintTop295Base)ct288PaintTop=async function(...args){const out=await paintTop295Base.apply(this,args);if(alive295()&&discover263.tab==='top10')remember295('top10');return out};

const forYou295Base=typeof forYou263==='function'?forYou263:null;
const browse295Base=typeof loadBrowse263==='function'?loadBrowse263:null;
const top295Base=typeof ct288LoadTop10==='function'?ct288LoadTop10:null;
loadDiscover263=function(tab=discover263.tab,force=false){
 source295();tab=normTab295(tab);const previous=normTab295(discover263.tab);if(alive295()&&previous!==tab)remember295(previous);
 discover263.tab=tab;if(tab==='foryou'||tab==='top10')discover263.type='all';const gen=++discover263.gen;
 try{syncDiscover263();ct288SyncShell?.()}catch{}
 ensureTabs295();const painted=restore295(tab),host=q295('[data-ct263-discover-content]');
 if(!painted&&host)host.innerHTML='<div class="ct263-loading">Carregando títulos…</div>';
 if(tab==='foryou'){
  if(painted&&!force){scheduleAuthority295();return}
  if(forYou295Base)void forYou295Base(gen,force);return;
 }
 if(tab==='top10'){
  if(painted&&!force)return;
  if(top295Base)void top295Base(gen);return;
 }
 if(painted&&!force)return;
 if(browse295Base)void browse295Base(tab,gen,force);
};

renderDiscover=async function(seq){
 source295();const existing=q295('[data-ct288-discover],[data-ct263-discover]');
 if(alive295()&&existing){ensureTabs295(existing);try{ct288SyncShell?.()}catch{}decorate295(existing);return}
 const types=[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${discover263.type===k?'active':''}" data-ct263-discover-type="${k}">${l}</button>`).join('');
 setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover data-ct263-discover data-ct288-discover><div class="ct288-tab-shell"><button type="button" class="ct288-tab-arrow" data-ct288-tab-prev aria-label="Abas anteriores">‹</button><div class="tabs ct263-discover-tabs ct288-tabs" data-ct288-tabs>${tabHtml295()}</div><button type="button" class="ct288-tab-arrow" data-ct288-tab-next aria-label="Próximas abas">›</button><button type="button" class="ct288-filter-btn" data-ct288-filter aria-label="Filtrar por tipo" aria-expanded="false">☷<i></i></button></div><div class="filters ct263-discover-types ct288-types" data-ct288-types hidden>${types}</div><div data-ct263-discover-content></div></div>`));
 if((seq!=null&&typeof navSeq!=='undefined'&&seq!==navSeq)||!alive295())return;const root=q295('[data-ct288-discover]');ensureTabs295(root);decorate295(root);loadDiscover263(discover263.tab,false);
 for(const ms of[0,80,300,900,1800])setTimeout(()=>{if(alive295())ensureTabs295()},ms);
};

function switch295(tab,force=false){tab=normTab295(tab);if(tab===discover263.tab&&!force){ensureTabs295();return}loadDiscover263(tab,force)}
window.addEventListener('pointerdown',e=>{if(!alive295())return;const btn=e.target?.closest?.('[data-ct263-discover-tab]');if(!btn)return;const tab=normTab295(btn.dataset.ct263DiscoverTab);for(const b of qa295('[data-ct263-discover-tab]'))b.classList.toggle('active',String(b.dataset.ct263DiscoverTab)===tab)},true);
window.addEventListener('click',e=>{
 if(!alive295())return;const tab=e.target?.closest?.('[data-ct263-discover-tab]');if(tab){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();switch295(tab.dataset.ct263DiscoverTab,false);return}
 const type=e.target?.closest?.('[data-ct263-discover-type]');if(type){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const next=['all','movie','tv'].includes(String(type.dataset.ct263DiscoverType))?String(type.dataset.ct263DiscoverType):'all';if(discover263.type===next)return;remember295(discover263.tab);discover263.type=next;snapshots.delete(snapKey295(discover263.tab));loadDiscover263(discover263.tab,false)}
},true);
window.addEventListener('cinetracker:data-changed',()=>{snapshots.clear();authorityAt=0});
window.addEventListener('pageshow',()=>{source295();if(alive295())ensureTabs295()});
source295();
window.__ctR295Test={canon:CANON.map(x=>x[0]),ensureTabs:ensureTabs295,remember:remember295,restore:restore295,switchTab:switch295,snapshots,get authorityAt(){return authorityAt}};
})();

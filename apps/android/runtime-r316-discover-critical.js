/* CineTracker Android 1.0/r316 — critical Discover route recovery.
   Restore the existing Top 10 and keep the r314 seven-slot recommendations.
   Prevent stale non-ForYou renderers from replacing confirmed cards with a
   permanent loader. No edits to Home, Sports, Profile, Web or the database. */
(()=>{
'use strict';
if(window.__ctR316Discover)return;
const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],
 ['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],
 ['top','Mais bem avaliados'],['calendar','Calendário']];
const tabs=new Set(TABS.map(x=>x[0]));
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const here=()=>route()==='discover';
const getTab=()=>tabs.has(discoverState?.tab)?discoverState.tab:'foryou';
const valid=()=>here()&&getTab()!=='foryou';
let seq=0,protectedTab='',lastRows=null,lastTab='',loading=false,loads=0,restores=0,failures=0,details=0;
const goodRows=new Map(),detailCache=new Map(),detailJobs=new Set();
const oldSetApp=setApp,oldRender=renderDiscover,oldPaint=paintDiscover;
function navHtml(tab){
 return '<div class="tabs ct316-tabs" data-ct316-tabs>'+
 TABS.map(([key,label])=>'<button type="button" class="chip '+(tab===key?'active':'')+
 '" data-discover-tab="'+key+'">'+label+'</button>').join('')+'</div>';
}
function ensureTop10(){
 if(!here())return;
 const rail=q('[data-discover] .tabs');
 if(!rail||q('[data-discover-tab="top10"]',rail))return;
 const button=document.createElement('button');
 button.type='button';button.className='chip';button.dataset.discoverTab='top10';
 button.textContent='Top 10';
 const first=q('[data-discover-tab="foryou"]',rail);
 if(first)first.insertAdjacentElement('afterend',button);
 else rail.insertBefore(button,rail.firstChild);
}
function filtersHtml(){
 if(getTab()==='foryou'||getTab()==='top10')return '';
 const options=[['all','Todos'],['movie','Filmes'],['tv','Séries']];
 return '<div class="filters ct316-filters">'+options.map(([key,label])=>
  '<button type="button" class="chip '+(discoverState.type===key?'active':'')+
  '" data-discover-type="'+key+'">'+label+'</button>').join('')+'</div>';
}
function putShell(tab){
 protectedTab='';
 const markup='<div class="page" data-discover data-ct316-discover="'+tab+'">'+
 navHtml(tab)+filtersHtml()+
 '<div data-discover-content><div class="loader">Carregando títulos...</div></div></div>';
 oldSetApp(shell('Descobrir','','discover',markup));
 protectedTab=tab;
 ensureTop10();
}
function present(rows,tab){
 if(!valid()||getTab()!==tab||!q('[data-ct316-discover="'+tab+'"]'))return;
 const root=q('[data-discover-content]');
 if(!root)return;
 const filtered=(Array.isArray(rows)?rows:[]).filter(x=>discoverState.type==='all'||
 mediaType(x)===discoverState.type);
 const capped=filtered.slice(0,tab==='calendar'?120:24);
 const label=TABS.find(([key])=>key===tab)?.[1]||'Descobrir';
 let body='';
 if(tab==='calendar'){
  const groups=new Map();
  for(const item of capped){
   const when=String(item.calendar_date||item.release_date||item.first_air_date||'').slice(0,10);
   const key=when||'Sem data';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);
  }
  body=[...groups].map(([day,items])=>'<section class="panel discover-section">'+
   '<div class="panel-head"><h2>'+esc(day)+'</h2></div>'+
   discoverCarousel158(items)+'</section>').join('')||'<div class="empty">Nenhum lançamento neste filtro.</div>';
 }else{
  body='<section class="panel discover-section"><div class="panel-head"><h2>'+esc(label)+
  '</h2></div>'+discoverCarousel158(capped)+'</section>';
 }
 root.innerHTML='<div data-ct316-results="'+tab+'">'+body+'</div>';
 lastRows=rows;lastTab=tab;loads++;
 window.__ctR315DiscoverCards?.setRows?.(capped);
 window.__ctR315DiscoverCards?.schedule?.();
 scheduleDetails();
}
function restore(){
 if(!valid()||!lastRows||getTab()!==lastTab)return;
 const root=q('[data-discover-content]');
 if(!root||q('[data-ct316-results="'+lastTab+'"]',root))return;
 present(lastRows,lastTab);restores++;
}
function signalError(error,tab){
 if(!valid()||getTab()!==tab||lastRows)return;
 const root=q('[data-discover-content]');if(!root)return;
 const msg=String(error?.message||error||'Dados indisponíveis');
 root.innerHTML='<div class="panel"><div class="empty">Não foi possível carregar '+esc(tab)+
  ': '+esc(msg)+' <button type="button" class="chip" data-ct316-retry>Tentar novamente</button></div></div>';
}
async function loadTab(tab,expected){
 loading=true;
 let timer;
 try{
  const key=tab+':'+localDay();
  const promise=discoverRows(tab);
  const result=await Promise.race([promise,new Promise((_,reject)=>{
   timer=setTimeout(()=>reject(Error('Tempo limite ao carregar Descobrir')),14000);
  })]);
  if(expected!==seq||!here()||getTab()!==tab)return;
  if(!Array.isArray(result))throw Error('Resposta de Descobrir inválida');
  goodRows.set(tab,{rows:result,at:Date.now()});
  present(result,tab);
 }catch(error){
  if(expected!==seq||!here()||getTab()!==tab)return;
  failures++;
  const saved=goodRows.get(tab);
  if(saved&&Array.isArray(saved.rows))present(saved.rows,tab);
  else signalError(error,tab);
  try{discoverCache.delete(tab+':'+localDay())}catch{}
 }finally{clearTimeout(timer);if(expected===seq)loading=false}
}
async function show(tab){
 const wanted=tabs.has(tab)?tab:'foryou';
 const token=++seq;
 discoverState.tab=wanted;
 if(wanted==='foryou'){
  protectedTab='';lastRows=null;lastTab='';
  const result=await oldRender.call(this,navSeq);
  ensureTop10();scheduleDetails();
  return result;
 }
 if(wanted==='top10'){
  protectedTab='';lastRows=null;lastTab='';
  try{
   if(typeof window.ctR217RenderTop10!=='function')throw Error('Top 10 indisponível');
   await window.ctR217RenderTop10(navSeq);
   if(token===seq&&here()&&getTab()==='top10'){
    protectedTab='top10';ensureTop10();scheduleDetails();
   }
  }catch(error){failures++;if(token===seq&&here()){
    putShell('top10');signalError(error,'top10');
  }}
  return true;
 }
 if(lastTab!==wanted){lastRows=null;lastTab=''}
 putShell(wanted);
 const saved=goodRows.get(wanted);
 if(saved?.rows?.length)present(saved.rows,wanted);
 void loadTab(wanted,token);
 return true;
}
// An outdated r180/r214 response must not replace a newer Discover viewport.
setApp=function(html){
 if(here()&&protectedTab&&getTab()===protectedTab&&
 typeof html==='string'&&html.includes('data-discover')&&
 !html.includes('data-ct316-discover')&&!html.includes('data-ct217-top10')&&
 !html.includes('ct171-top10-shell'))return;
 return oldSetApp.apply(this,arguments);
};
paintDiscover=function(...args){
 if(valid()&&protectedTab&&getTab()===protectedTab)return false;
 return oldPaint.apply(this,args);
};
renderDiscover=async function(){
 if(!here())return oldRender.apply(this,arguments);
 return show(getTab());
};
// Capture at window level BEFORE legacy document listeners. Retain the
// original seven-slot Trocar/Visto handlers and the official Top10 renderer.
window.addEventListener('click',event=>{
 if(!here())return;
 const target=event.target?.closest?.('[data-discover-tab],[data-discover-type],[data-ct316-retry]');
 if(!target||!target.closest('[data-discover]'))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(target.hasAttribute('data-ct316-retry')){
  if(getTab()==='top10'){void show('top10');return}
  lastRows=null;lastTab='';void show(getTab());return;
 }
 if(target.hasAttribute('data-discover-type')){
  if(getTab()==='top10'||getTab()==='foryou')return;
  const type=String(target.dataset.discoverType||'all');
  discoverState.type=['all','movie','tv'].includes(type)?type:'all';
  ++navSeq;void show(getTab());return;
 }
 const tab=String(target.dataset.discoverTab||'');
 if(!tabs.has(tab))return;
 if(tab==='foryou')discoverState.type='all';
 ++navSeq;void show(tab);
},true);
const detailSelector='.ct315-card,.ct314-card,.ct171-top-card';
let detailTimer=0;
function scheduleDetails(){clearTimeout(detailTimer);detailTimer=setTimeout(()=>{detailTimer=0;void detailVisible()},180)}
function runtimeText(data,type){
 const raw=Number(type==='movie'?data?.runtime:(data?.episode_run_time?.[0]||data?.last_episode_to_air?.runtime||data?.episode_run_time));
 return Number.isFinite(raw)&&raw>=1&&raw<=1440?Math.round(raw)+' min':'Duração indisponível';
}
async function fillDetail(card,key,type,id){
 if(detailJobs.has(key))return;
 detailJobs.add(key);
 try{
  let cached=detailCache.get(key);
  if(!cached||Date.now()-cached.at>86400000){
   const data=await Promise.race([
    safeTmdb('/'+type+'/'+id,{language:'pt-BR'}),
    new Promise((_,reject)=>setTimeout(()=>reject(Error('Detalhes indisponíveis')),9500))
   ]);
   cached={at:Date.now(),value:data};
   detailCache.set(key,cached);
   if(detailCache.size>180)detailCache.delete(detailCache.keys().next().value);
  }
  for(const target of qa(detailSelector)){
   const button=q('button[data-media]',target);
   const currentKey=button?.dataset.media||target.dataset.ct315Id;
   if(currentKey!==key)continue;
   const label=q('[data-ct316-duration]',target)||q('[data-ct315-runtime]',target);
   if(!label)continue;
   const value=runtimeText(cached.value,type);
   if(label.hasAttribute('data-ct315-runtime')){
    const prior=String(label.textContent||'');
    const tail=prior.includes('★')?prior.slice(prior.indexOf('★')):'';
    label.textContent=value+(tail?' · '+tail:'');
   }else label.textContent=value;
   details++;
  }
 }catch{
  failures++;
 }finally{detailJobs.delete(key)}
}
async function detailVisible(){
 if(!here()||document.hidden)return;
 let started=0;
 for(const card of qa(detailSelector).slice(0,35)){
  const button=q('button[data-media]',card);
  const key=button?.dataset.media||card.dataset.ct315Id||'';
  const match=/^(movie|tv):([1-9]\d*)$/.exec(key);
  if(!match)continue;
  const [,type,numberId]=match,id=Number(numberId);
  const body=q('.card-body',card);if(!body)continue;
  let label=q('[data-ct316-duration]',card)||q('[data-ct315-runtime]',card);
  if(!label){label=document.createElement('small');label.dataset.ct316Duration='1';
   label.textContent='Consultando duração…';body.appendChild(label)}
  const current=String(label.textContent||'');
  if(/\b\d{1,4}\s*min\b/.test(current))continue;
  const cached=detailCache.get(key);
  if(cached&&Date.now()-cached.at<86400000){
   const runtime=runtimeText(cached.value,type);
   if(!label.hasAttribute('data-ct315-runtime'))label.textContent=runtime;
   else label.textContent=runtime+(current.includes('★')?' · '+current.slice(current.indexOf('★')):'');
   continue;
  }
  if(started>=5)break;
  if(detailJobs.has(key))continue;
  started++;
  void fillDetail(card,key,type,id);
 }
}
const observer=new MutationObserver(()=>{
 if(!here())return;
 if(valid()&&protectedTab&&lastRows&&!q('[data-ct316-results="'+lastTab+'"]'))queueMicrotask(restore);
 if(!q('[data-discover-tab="top10"]'))queueMicrotask(ensureTop10);
 if(!detailTimer)scheduleDetails();
});
observer.observe(q('#app')||document.documentElement,{subtree:true,childList:true});
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&here())scheduleDetails();
});
const style=document.createElement('style');style.id='ct316-discover-critical';
style.textContent=[
 '[data-discover] .ct316-tabs{display:flex!important;gap:6px!important;overflow-x:auto!important;scrollbar-width:thin!important;flex-wrap:nowrap!important;padding-bottom:6px!important}',
 '[data-discover] .ct316-tabs>.chip{flex:0 0 auto!important;white-space:nowrap!important;min-height:36px!important}',
 '[data-discover] .ct316-filters{display:flex!important;gap:7px!important}',
 '[data-discover] .ct316-filters>.chip{flex:1 1 0!important;min-height:38px!important}',
 '[data-discover] .ct315-card .poster,[data-discover] .ct314-card .poster,[data-discover] .ct171-top-card .poster{aspect-ratio:2/3!important;height:auto!important;object-fit:cover!important}',
 '[data-discover] .ct315-card .card-body,[data-discover] .ct314-card .card-body,[data-discover] .ct171-top-card .card-body{min-width:0!important;overflow:hidden!important}',
 '[data-discover] .ct315-card .card-body b,[data-discover] .ct314-card .card-body b,[data-discover] .ct171-top-card .card-body b{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}',
 '[data-discover] [data-ct316-duration]{display:block!important;font-size:10px!important;line-height:1.3!important;color:#b6c7d6!important;padding-top:3px!important}'
].join('\n');
document.head.appendChild(style);
window.__ctR316Discover={show,ensureTop10,restore,detailVisible,
 stats:()=>({loads,restores,failures,details,tab:getTab(),loading,protectedTab,cache:goodRows.size}),
 scope:'Discover only; original Top10 and r314 ForYou preserved'};
})();
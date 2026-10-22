/* CineTracker official Android 1.0/r315.
   Scoped: Home UFC row geometry; Discover tabs except Pra Voce rich cards.
   The certified r314 recommendation owner remains byte-for-byte unchanged. */
(()=>{
'use strict';
if(window.__ctR315DiscoverCards)return;
const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const current=()=>route()==='discover'&&discoverState?.tab!=='foryou';
const genres={
 12:'Aventura',14:'Fantasia',16:'Animação',18:'Drama',27:'Terror',28:'Ação',35:'Comédia',
 36:'História',37:'Faroeste',53:'Suspense',80:'Crime',99:'Documentário',878:'Ficção científica',
 9648:'Mistério',10402:'Música',10749:'Romance',10751:'Família',10752:'Guerra',10759:'Ação e aventura',
 10762:'Infantil',10763:'Notícias',10764:'Reality',10765:'Ficção e fantasia',
 10766:'Novela',10767:'Talk show',10768:'Guerra e política'
};
const escapeValue=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=x=>Number.isSafeInteger(Number(x))&&Number(x)>0?Number(x):0;
const idOf=x=>number(mediaTmdb(x));
const typeOf=x=>mediaType(x)==='movie'?'movie':'tv';
const detailCache=new Map(),inflight=new Set(),busy=new Set();
let delivered=0,enriched=0,taps=0,failures=0,scheduled=false,remaining=0;
function data(x,extra=null){
 const type=typeOf(x),raw=x?.raw_tmdb||{},r=extra||{};
 const day=String(x?.release_date||x?.first_air_date||x?.release_year||raw.release_date||raw.first_air_date||r.release_date||r.first_air_date||'');
 const year=/^(?:19|20)\d{2}/.test(day)?day.slice(0,4):'Ano indisponível';
 const minute=number(x?.runtime_minutes)||number(x?.runtime)||number(raw.runtime)||
  number(x?.episode_run_time?.[0])||number(raw.episode_run_time?.[0])||
  number(r.runtime)||number(r.episode_run_time?.[0]);
 const ids=Array.isArray(x?.genre_ids)?x.genre_ids:Array.isArray(raw?.genre_ids)?raw.genre_ids:[];
 const names=Array.isArray(x?.genres)?x.genres.map(g=>typeof g==='string'?g:g?.name):
  (ids.map(g=>genres[number(g)]).filter(Boolean));
 if(!names.length&&Array.isArray(r.genres))names.push(...r.genres.map(g=>g?.name).filter(Boolean));
 const genre=names.filter(Boolean).slice(0,2).join(' / ')||'Gênero não informado';
 const score=Number(x?.vote_average??raw.vote_average??r.vote_average??0);
 const scoreText=Number.isFinite(score)&&score>0?'★ '+score.toFixed(1):'Sem nota';
 return {year,minute:minute?minute+' min':'Duração não informada',genre,scoreText,
  kind:type==='movie'?'Filme':(String(x?.media_kind||'')==='anime'?'Anime':'Série')};
}
function metaText(d){return d.year+' · '+d.kind+' · '+d.genre}
function watchButton(x,type,id){
 return x?._ct_watchlist?
  '<button type="button" class="ct315-chip" disabled>Na Watchlist</button>':
  '<button type="button" class="ct315-chip" data-discover-watch="'+type+':'+id+'">+ Watchlist</button>';
}
function card(x){
 const id=idOf(x),type=typeOf(x);
 if(!id)return priorCard(x);
 const poster=mediaPoster(x),d=data(x);
 return '<article class="card discover-card ct315-card" data-ct315-id="'+type+':'+id+'">'+
  '<button type="button" class="ct315-open" data-media="'+type+':'+id+'" aria-label="Abrir '+escapeValue(mediaTitle(x))+'">'+
  '<div class="poster"'+(poster?' style="background-image:url(\''+escapeValue(img(poster,'w342'))+'\')"':'')+'></div>'+
  '<div class="card-body"><b>'+escapeValue(mediaTitle(x))+'</b>'+
  '<small data-ct315-meta>'+escapeValue(metaText(d))+'</small>'+
  '<small data-ct315-runtime>'+escapeValue(d.minute)+' · '+escapeValue(d.scoreText)+'</small>'+
  '</div></button><div class="ct315-actions">'+
  watchButton(x,type,id)+
  '<button type="button" class="ct315-chip ct315-seen" data-ct315-seen="'+type+':'+id+'">✓ Visto</button>'+
  '</div></article>';
}
const priorCard=discoverCard158;
discoverCard158=function(x){return current()?card(x):priorCard(x)};
function paintDetails(item,detail){
 const d=data(item,detail),id=typeOf(item)+':'+idOf(item);
 for(const el of qa('.ct315-card[data-ct315-id="'+id+'"]',q('[data-discover-content]'))){
  const main=q('[data-ct315-meta]',el),duration=q('[data-ct315-runtime]',el);
  if(main)main.textContent=metaText(d);
  if(duration)duration.textContent=d.minute+' · '+d.scoreText;
  enriched++;
 }
}
const itemData=new Map();
const prevPaint=paintDiscover;
paintDiscover=function(rows){
 const activeBefore=current();
 if(activeBefore&&Array.isArray(rows)){
  itemData.clear();
  for(const x of rows){const id=idOf(x);if(id)itemData.set(typeOf(x)+':'+id,x)}
 }
 const result=prevPaint.apply(this,arguments);
 if(activeBefore&&current())schedule();
 return result;
};
async function details(key,item){
 if(inflight.has(key))return;
 inflight.add(key);
 try{
  let row=detailCache.get(key);
  if(!row||Date.now()-row.at>86400000){
   const type=typeOf(item),id=idOf(item);
   const returned=await safeTmdb('/'+(type==='movie'?'movie':'tv')+'/'+id,{language:'pt-BR'});
   if(!returned||typeof returned!=='object'||!('id' in returned))return;
   row={at:Date.now(),value:returned};
   detailCache.set(key,row);
   if(detailCache.size>160)detailCache.delete(detailCache.keys().next().value);
  }
  if(current())paintDetails(item,row.value);
 }catch{failures++}
 finally{inflight.delete(key)}
}
async function enrichVisible(){
 if(!current()||document.hidden)return;
 const root=q('[data-discover-content]');if(!root)return;
 const list=qa('.ct315-card',root).filter(el=>{
  const r=el.getBoundingClientRect?.();
  return !r||r.left<innerWidth+200&&r.right>-120;
 }).slice(0,6);
 const tasks=[];
 for(const el of list){
  const key=el.dataset.ct315Id,item=itemData.get(key);
  if(!item||inflight.has(key))continue;
  const cached=detailCache.get(key);
  if(cached&&Date.now()-cached.at<86400000){paintDetails(item,cached.value);continue}
  // Avoid a TMDB request when the list already includes both real runtime
  // and genre. Cards show release year/genre immediately, before detail load.
  const d=data(item);
  if(d.minute!=='Duração não informada'&&d.genre!=='Gênero não informado')continue;
  tasks.push([key,item]);if(tasks.length>=3)break;
 }
 if(!tasks.length)return;
 remaining+=tasks.length;
 const requestedTab=discoverState.tab;
 await Promise.allSettled(tasks.map(async([key,item])=>{
  if(route()==='discover'&&discoverState.tab===requestedTab)await details(key,item);
 }));
 remaining-=tasks.length;
}
function schedule(){
 if(scheduled)return;scheduled=true;
 setTimeout(()=>{scheduled=false;void enrichVisible()},120);
}
document.addEventListener('scroll',event=>{
 if(current()&&event.target?.closest?.('.discover-carousel'))schedule();
},true);
window.addEventListener('click',event=>{
 if(!current())return;
 const button=event.target?.closest?.('[data-ct315-seen]');
 if(!button||!q('[data-discover-content]')?.contains(button))return;
 event.preventDefault();event.stopImmediatePropagation();
 const idKey=String(button.dataset.ct315Seen||'');
 const [type,numberId]=idKey.split(':'),id=number(numberId);
 if(!id||!['movie','tv'].includes(type)||busy.has(idKey))return;
 if(!session?.access_token){toast('Faça login para marcar como visto.');return}
 busy.add(idKey);taps++;button.disabled=true;button.textContent='Salvando…';
 const who=String(session?.user?.id||user?.id||'');
 Promise.resolve().then(()=>markSeen(type,id)).then(()=>{
  if(who!==String(session?.user?.id||user?.id||''))return;
  q('.ct315-card[data-ct315-id="'+idKey+'"]',q('[data-discover-content]'))?.remove();
  itemData.delete(idKey);
 }).catch(err=>{
  failures++;
  toast('Não foi possível marcar como visto: '+String(err?.message||err));
  if(button.isConnected){button.disabled=false;button.textContent='✓ Visto'}
 }).finally(()=>busy.delete(idKey));
},true);
const style=document.createElement('style');style.id='ct315-discover-home-only';
style.textContent=[
 // UFC must use the exact action-cell dimensions used by other Home series.
 '[data-home-viewport="series"] .home-section .stack>.home-action-row:has([data-ct263-special="ufc"]){display:grid!important;grid-template-columns:minmax(0,1fr) 52px!important;gap:8px!important;align-items:stretch!important;box-sizing:border-box!important;width:100%!important;min-height:78px!important}',
 '[data-home-viewport="series"] .home-section .stack>.home-action-row:has([data-ct263-special="ufc"])>.media-row{width:100%!important;max-width:100%!important;min-width:0!important;min-height:76px!important;box-sizing:border-box!important;overflow:hidden!important}',
 '[data-home-viewport="series"] .home-section .stack>.home-action-row:has([data-ct263-special="ufc"])>.home-check{width:52px!important;min-width:52px!important;max-width:52px!important;margin:0!important;align-self:stretch!important;border-radius:10px!important;box-sizing:border-box!important;min-height:76px!important;font-size:18px!important}',
 '[data-home-viewport="series"] .home-section .stack>.home-action-row:has([data-ct263-special="ufc"]) .media-row small{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:100%!important}',
 // Rich Discover cards in other tabs; does not affect the seven r314 slots.
 '[data-discover]:not(:has([data-ct314-foryou])) .ct315-card{display:flex!important;flex-direction:column!important;box-sizing:border-box!important;flex:0 0 clamp(145px,40vw,190px)!important;width:clamp(145px,40vw,190px)!important;min-width:145px!important;min-height:0!important;overflow:hidden!important}',
 '[data-discover]:not(:has([data-ct314-foryou])) .discover-carousel:has(.ct315-card){display:flex!important;gap:10px!important;overflow-x:auto!important;scroll-snap-type:x proximity!important;align-items:stretch!important}',
 '[data-discover] .ct315-card>.ct315-open{display:block!important;min-width:0!important;width:100%!important;text-align:left!important;padding:0!important;flex:1 1 auto!important}',
 '[data-discover] .ct315-card .poster{aspect-ratio:2/3!important;height:auto!important;width:100%!important;background-size:cover!important}',
 '[data-discover] .ct315-card .card-body{box-sizing:border-box!important;padding:8px 7px!important;min-height:80px!important;height:auto!important;overflow:hidden!important}',
 '[data-discover] .ct315-card .card-body>b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11px!important}',
 '[data-discover] .ct315-card .card-body>small{display:block!important;white-space:normal!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:10px!important;line-height:1.35!important;margin-top:3px!important}',
 '[data-discover] .ct315-card .ct315-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important;box-sizing:border-box!important;width:100%!important;padding:6px!important;margin-top:auto!important}',
 '[data-discover] .ct315-card .ct315-chip{display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;min-height:37px!important;height:37px!important;border:1px solid #345771!important;border-radius:9px!important;background:#123147!important;color:#e4edf8!important;font-size:10px!important;line-height:1.1!important;white-space:normal!important;text-align:center!important;padding:0 3px!important}',
 '[data-discover] .ct315-card .ct315-chip:disabled{opacity:.55!important}',
 '@media(max-width:450px){[data-discover] .ct315-card .ct315-chip{font-size:9px!important}}'
].join('\n');
document.head.appendChild(style);
window.__ctR315DiscoverCards={card,data,details,enrichVisible,schedule,stats:()=>({
 rendered:delivered,enriched,taps,failures,pending:remaining,detailCache:detailCache.size,
 scope:'Only Home UFC geometry + Discover non-ForYou metadata and actions'
})};
})();
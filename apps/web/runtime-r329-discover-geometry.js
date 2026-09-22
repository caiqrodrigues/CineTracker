/* CineTracker Web 1.0.120 r329 — Discover geometry reset, fixed cards, one-line actions. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR329?.version==='1.0.120')return;
window.__ctR329Marker='discover-fixed-card-rail+one-line-actions+no-page-overflow';
window.__ctR329Discover='foryou-154-mobile-176-desktop+rail-scroll+unique-actions';
window.__ctR329Rules='v326-authority-preserved';
window.__ctR329Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const R=window.__ctR288R263||{};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>x?.title||x?.name||x?.media_title||'');
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||'');
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4));
const scoreOf=typeof R.score263==='function'?R.score263:(x=>Number(x?.vote_average||x?.raw_tmdb?.vote_average||0));
let guardRaf=0;

function key329(x){
 const type=typeOf(x)==='movie'?'movie':'tv',id=Number(idOf(x)||0);
 return id>0?type+':'+id:'';
}
function cat329(x){
 try{return window.__ctR309Test?.category?.(x)|| (typeOf(x)==='movie'?'movie':'series')}catch{return typeOf(x)==='movie'?'movie':'series'}
}
function current329(pool,index){
 const list=rows(pool);return list.length?list[Math.abs(Number(index||0))%list.length]:null;
}
function model329(){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const watch={},fresh={},lengths={watch:{},fresh:{}};
 for(const kind of ['movie','series','anime']){
  const w=rows(st.watchPools?.[kind]),f=rows(st.freshPools?.[kind]);
  watch[kind]=current329(w,st.watchIndex?.[kind]);fresh[kind]=current329(f,st.freshIndex?.[kind]);
  lengths.watch[kind]=w.length;lengths.fresh[kind]=f.length;
 }
 const used=new Set([...Object.values(watch),...Object.values(fresh)].filter(Boolean).map(key329));
 const dailyPool=rows(st.dailyPool);
 let daily=current329(dailyPool,st.dailyIndex);
 if(daily&&used.has(key329(daily)))daily=dailyPool.find(x=>!used.has(key329(x)))||daily;
 return{watch,fresh,daily,lengths,dailyLength:dailyPool.length};
}
function card329(x){
 if(!x)return'';
 try{return typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{return''}
}
function actions329(x,{saved=false,swap='',canSwap=false}={}){
 if(!x)return'';
 const k=key329(x);if(!k)return'';
 return '<div class="ct329-actions" data-ct329-actions>'+
  '<button type="button" class="chip ct329-action ct329-watchlist'+(saved?' active':'')+'" data-ct329-action="watchlist" data-ct329-media="'+esc(k)+'"'+(saved?' disabled':'')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button>'+
  '<button type="button" class="chip ct329-action ct329-seen" data-ct329-action="seen" data-ct329-media="'+esc(k)+'">✓ Visto</button>'+
  '<button type="button" class="chip ct329-action ct329-swapbtn" data-ct329-swap="'+esc(swap)+'"'+(canSwap?'':' disabled')+'>↻ Trocar</button>'+
 '</div>';
}
function slot329(label,kind,item,saved,bucket,length){
 if(!item)return'';
 return '<section class="ct329-slot" data-ct329-kind="'+kind+'" data-ct328-kind="'+kind+'" data-ct329-slot="'+bucket+':'+kind+'">'+
  '<div class="ct329-slot-head"><h3>'+label+'</h3></div>'+
  '<div class="ct329-cardwrap">'+card329(item)+'</div>'+
  actions329(item,{saved,swap:bucket+':'+kind,canSwap:Number(length||0)>1})+
 '</section>';
}
function rail329(title,items,saved,bucket,lengths){
 const html=[
  slot329('Filme','movie',items.movie,saved,bucket,lengths.movie),
  slot329('Série','series',items.series,saved,bucket,lengths.series),
  slot329('Anime','anime',items.anime,saved,bucket,lengths.anime)
 ].join('');
 if(!html)return'';
 return '<section class="panel ct329-block" data-ct329-bucket="'+bucket+'">'+
  '<div class="panel-head"><h2>'+title+'</h2></div>'+
  '<div class="ct329-rail">'+html+'</div>'+
 '</section>';
}
function daily329(item,length){
 if(!item)return'';
 const kind=cat329(item);
 return '<section class="panel ct329-block ct329-daily" data-ct329-kind="'+kind+'" data-ct328-kind="'+kind+'">'+
  '<div class="panel-head"><h2>Indicação do Dia</h2></div>'+
  '<div class="ct329-daily-inner"><div class="ct329-slot ct329-daily-slot" data-ct329-kind="'+kind+'" data-ct328-kind="'+kind+'">'+
   '<div class="ct329-cardwrap">'+card329(item)+'</div>'+
   actions329(item,{saved:false,swap:'daily',canSwap:Number(length||0)>1})+
  '</div></div>'+
 '</section>';
}
function paintForYou329(){
 if(routeNow()!=='discover')return false;
 const d=window.__ctR288R263?.discover263;if(d&&String(d.tab||'')!=='foryou')return false;
 const m=model329(),host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!m||!host)return false;
 host.innerHTML='<div data-ct328-foryou data-ct329-foryou>'+
  daily329(m.daily,m.dailyLength)+
  rail329('Da sua Watchlist',m.watch,true,'watch',m.lengths.watch)+
  rail329('100% novos',m.fresh,false,'fresh',m.lengths.fresh)+
  '<div class="ct329-filter-empty" hidden>Nenhum item elegível para este filtro.</div>'+
 '</div>';
 host.dataset.ct329Owned='foryou';
 try{window.__ctR328?.ensureFilters?.()}catch{}
 applyFilter329();
 return true;
}
function kindState329(){
 const st=window.__ctR319Test?.state,k=String(st?.fyKind||'all');
 return ['movie','series','anime'].includes(k)?k:'all';
}
function applyFilter329(){
 const root=q('[data-ct329-foryou]');if(!root)return false;
 const kind=kindState329();root.dataset.ct329Filter=kind;
 let shown=0;
 for(const node of qa('[data-ct329-kind]',root)){
  if(node.closest('[data-ct329-kind]')!==node)continue;
  const show=kind==='all'||String(node.dataset.ct329Kind)===kind;
  node.hidden=!show;if(show)shown++;
 }
 for(const block of qa('[data-ct329-bucket]',root)){
  const visible=qa(':scope .ct329-slot',block).some(x=>!x.hidden);
  block.hidden=!visible;
 }
 const daily=q('.ct329-daily',root);if(daily){
  const show=kind==='all'||String(daily.dataset.ct329Kind)===kind;
  daily.hidden=!show;
 }
 const empty=q('.ct329-filter-empty',root);if(empty)empty.hidden=shown>0;
 qa('[data-ct328-fy-kind]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct328FyKind||'')===kind));
 return true;
}
function swap329(name){
 const st=window.__ctR309Test?.state;if(!st)return false;
 if(name==='daily'){
  const pool=rows(st.dailyPool);if(pool.length<2)return false;
  st.dailyIndex=(Number(st.dailyIndex||0)+1)%pool.length;
 }else{
  const [bucket,kind]=String(name||'').split(':');
  if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const pools=st[bucket+'Pools'],indexes=st[bucket+'Index'],pool=rows(pools?.[kind]);
  if(pool.length<2)return false;
  indexes[kind]=(Number(indexes[kind]||0)+1)%pool.length;
 }
 window.__ctR309Test?.setForYouState?.(st);
 paintForYou329();return true;
}
async function persist329(btn){
 if(!btn||btn.disabled)return false;
 const action=String(btn.dataset.ct329Action||''),[type,idRaw]=String(btn.dataset.ct329Media||'').split(':'),id=Number(idRaw||0);
 if(!id||!['movie','tv'].includes(type))return false;
 const old=btn.textContent;btn.disabled=true;btn.textContent='…';
 try{
  if(action==='watchlist'){
   if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');
   await addWatchlist(type,id);
  }else if(action==='seen'){
   if(typeof markSeen!=='function')throw new Error('Visto indisponível');
   await markSeen(type,id);
  }else return false;
  window.__ctR309Test?.setForYouState?.(null);
  await window.__ctR321?.loadForYou?.(true);
  return true;
 }catch(e){
  btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}return false;
 }
}
document.addEventListener('click',e=>{
 const swap=e.target?.closest?.('[data-ct329-swap]');
 if(swap){e.preventDefault();e.stopImmediatePropagation();swap329(String(swap.dataset.ct329Swap||''));return}
 const action=e.target?.closest?.('[data-ct329-action]');
 if(action){e.preventDefault();e.stopImmediatePropagation();void persist329(action);return}
 const filter=e.target?.closest?.('[data-ct328-fy-kind]');
 if(filter){setTimeout(applyFilter329,0)}
},true);

/* Replace the public hooks used by r328's loader. */
if(window.__ctR328){
 window.__ctR328.paintForYou=paintForYou329;
 window.__ctR328.applyForYouFilter=applyFilter329;
 window.__ctR328.swapForYou=swap329;
}
try{paintForYou263=paintForYou329}catch{}

/* If any older renderer tries to paint after r329, restore the final owned DOM once. */
try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(ms=>{
  if(routeNow()!=='discover'||String(window.__ctR288R263?.discover263?.tab||'')!=='foryou')return;
  if(!ms.some(m=>m.addedNodes.length))return;
  cancelAnimationFrame(guardRaf);
  guardRaf=requestAnimationFrame(()=>{
   if(routeNow()!=='discover')return;
   if(window.__ctR309Test?.state&&!q('[data-ct329-foryou]'))paintForYou329();
   else applyFilter329();
  });
 }).observe(app,{subtree:true,childList:true});
}catch{}

const style=document.createElement('style');style.id='ct-web-r329';style.textContent=`
[data-ct329-foryou]{--ct329-card-w:154px;box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important}
@media(min-width:1100px){[data-ct329-foryou]{--ct329-card-w:176px}}

/* The section owns the overflow; the page itself must never grow horizontally. */
[data-ct329-foryou] .ct329-block{
 box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;
 overflow:hidden!important;padding-bottom:8px!important;margin-bottom:10px!important
}
[data-ct329-foryou] .ct329-rail{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;
 gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;
 overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 8px!important;margin:0!important;
 scroll-snap-type:x proximity!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important;
 scrollbar-width:thin!important
}
[data-ct329-foryou] .ct329-slot{
 box-sizing:border-box!important;position:relative!important;inset:auto!important;transform:none!important;
 display:flex!important;flex:0 0 var(--ct329-card-w)!important;flex-direction:column!important;align-items:stretch!important;
 width:var(--ct329-card-w)!important;min-width:var(--ct329-card-w)!important;max-width:var(--ct329-card-w)!important;
 margin:0!important;padding:0!important;scroll-snap-align:start!important;overflow:visible!important
}
[data-ct329-foryou] .ct329-slot[hidden],[data-ct329-foryou] .ct329-block[hidden],[data-ct329-foryou] .ct329-daily[hidden]{display:none!important}
[data-ct329-foryou] .ct329-slot-head{box-sizing:border-box!important;width:100%!important;margin:0 0 5px!important;padding:0!important;min-height:14px!important}
[data-ct329-foryou] .ct329-slot-head h3{margin:0!important;font-size:11px!important;line-height:1.2!important}
[data-ct329-foryou] .ct329-cardwrap{
 box-sizing:border-box!important;width:var(--ct329-card-w)!important;min-width:var(--ct329-card-w)!important;max-width:var(--ct329-card-w)!important;
 position:relative!important;overflow:visible!important
}
[data-ct329-foryou] .ct329-cardwrap>.ct288-card,
[data-ct329-foryou] .ct329-cardwrap>.ct288-empty-card{
 box-sizing:border-box!important;width:100%!important;min-width:100%!important;max-width:100%!important;margin:0!important
}
[data-ct329-foryou] .ct329-cardwrap .ct288-open{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important}
[data-ct329-foryou] .ct329-cardwrap .ct288-poster,[data-ct329-foryou] .ct329-cardwrap .ct288-empty-poster{
 box-sizing:border-box!important;width:100%!important;max-width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important
}
[data-ct329-foryou] .ct288-copy,[data-ct329-foryou] .ct-media-copy-lock{min-width:0!important;max-width:100%!important}
[data-ct329-foryou] .ct288-copy b,[data-ct329-foryou] .ct288-copy small{
 display:block!important;width:100%!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}

/* Unique action classes: no legacy .swap/.watch/.seen selector can move these buttons. */
[data-ct329-foryou] .ct329-actions{
 box-sizing:border-box!important;position:relative!important;inset:auto!important;transform:none!important;
 display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;justify-content:stretch!important;
 gap:3px!important;width:var(--ct329-card-w)!important;min-width:var(--ct329-card-w)!important;max-width:var(--ct329-card-w)!important;
 min-height:26px!important;height:26px!important;margin:5px 0 0!important;padding:0!important;overflow:visible!important;z-index:2!important
}
[data-ct329-foryou] .ct329-actions>.ct329-action{
 box-sizing:border-box!important;position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
 transform:none!important;float:none!important;clear:none!important;display:flex!important;align-items:center!important;justify-content:center!important;
 flex:1 1 0!important;width:0!important;min-width:0!important;max-width:none!important;height:26px!important;min-height:26px!important;max-height:26px!important;
 margin:0!important;padding:2px 2px!important;border-radius:7px!important;font-size:8px!important;line-height:1!important;letter-spacing:-.08px!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
[data-ct329-foryou] .ct329-actions>.ct329-action[disabled]{opacity:.72!important}

/* Daily uses exactly the same card and action geometry. */
[data-ct329-foryou] .ct329-daily-inner{box-sizing:border-box!important;display:flex!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 8px!important}
[data-ct329-foryou] .ct329-daily-slot{flex:0 0 var(--ct329-card-w)!important}

/* Filters stay visible and compact, without creating page overflow. */
[data-ct319-types][data-ct328-always="1"]{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;gap:5px!important;width:100%!important;max-width:100%!important;
 overflow-x:auto!important;overflow-y:hidden!important;margin:6px 0 8px!important;padding-bottom:2px!important
}
[data-ct319-types][data-ct328-always="1"]>.chip{flex:0 0 auto!important;white-space:nowrap!important;min-height:28px!important;height:28px!important;padding:3px 9px!important;font-size:10px!important}

/* Public tabs and Top 10 return to the established 154/176px card size. */
[data-ct319-content]{min-width:0!important;max-width:100%!important}
[data-ct319-content] .ct319-public,[data-ct319-content] .ct288-top-section{box-sizing:border-box!important;max-width:100%!important;min-width:0!important;overflow:hidden!important}
[data-ct319-content] .ct319-rail,[data-ct319-content] .ct319-top-row{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;
 overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 8px!important;margin:0!important;scroll-snap-type:x proximity!important
}
[data-ct319-content] .ct319-item{
 box-sizing:border-box!important;position:relative!important;display:flex!important;flex:0 0 154px!important;flex-direction:column!important;
 width:154px!important;min-width:154px!important;max-width:154px!important;margin:0!important;scroll-snap-align:start!important;overflow:visible!important
}
@media(min-width:1100px){
 [data-ct319-content] .ct319-item{flex-basis:176px!important;width:176px!important;min-width:176px!important;max-width:176px!important}
}
[data-ct319-content] .ct319-item>.ct288-card{box-sizing:border-box!important;width:100%!important;min-width:100%!important;max-width:100%!important;margin:0!important}
[data-ct319-content] .ct319-actions{
 box-sizing:border-box!important;position:relative!important;inset:auto!important;transform:none!important;display:flex!important;flex-flow:row nowrap!important;
 gap:3px!important;width:100%!important;min-height:26px!important;height:26px!important;margin:5px 0 0!important;padding:0!important;overflow:visible!important
}
[data-ct319-content] .ct319-actions>.chip{
 box-sizing:border-box!important;position:static!important;inset:auto!important;transform:none!important;flex:1 1 0!important;width:0!important;min-width:0!important;
 max-width:none!important;height:26px!important;min-height:26px!important;margin:0!important;padding:2px 3px!important;border-radius:7px!important;
 font-size:8.5px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}

/* Prevent the whole document from getting a horizontal scrollbar from Discover internals. */
[data-ct319-discover],[data-ct319-discover] .page,[data-ct319-content],[data-ct329-foryou]{box-sizing:border-box!important;min-width:0!important;max-width:100%!important}
`;document.head.appendChild(style);

setTimeout(()=>{
 if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'')==='foryou'&&window.__ctR309Test?.state)paintForYou329();
},0);

window.__ctR329={
 paintForYou:paintForYou329,applyFilter:applyFilter329,swap:swap329,model:model329,
 version:'1.0.120'
};
window.__ctR329Test={paintForYou329,applyFilter329,model329,key329,slot329,actions329};
})();

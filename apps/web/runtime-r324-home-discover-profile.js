/* CineTracker Web 1.0.115 r324 — collapsed Home history, compact Discover actions, complete Watchlist modal. */
(()=>{
'use strict';
if(window.__ctR324)return;
window.__ctR324Marker='home-history-collapsed+discover-actions-compact+watchlist-complete+legacy-alias-union';
window.__ctR324Home='series+movies-history-preloaded-collapsed-on-entry';
window.__ctR324Discover='compact-one-row-actions+v324-legacy-seen-union';
window.__ctR324Profile='watchlist-rpc-full-counts+legacy-rows-visible';
window.__ctR324Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let testBridge=null;
let historyOpen324={episodes:false,movies:false};

/* HOME — history is fetched with the Home payload, but both tabs start collapsed. */
function historyKind324(sec){
 const raw=String(sec?.dataset?.ct274History||'').toLowerCase();
 return raw==='movies'?'movies':'episodes';
}
function decorateHomeHistory324(reset=false){
 const root=q('[data-home]');if(!root)return false;
 if(reset)historyOpen324={episodes:false,movies:false};
 let hit=false;
 for(const sec of qa('[data-ct274-history]',root)){
  hit=true;
  const kind=historyKind324(sec),open=!!historyOpen324[kind],head=q('.panel-head',sec),stack=q('.ct274-history-stack',sec);
  sec.dataset.ct324History=open?'open':'collapsed';
  sec.classList.toggle('ct324-history-open',open);
  sec.classList.toggle('ct324-history-collapsed',!open);
  if(stack){stack.setAttribute('aria-hidden',open?'false':'true')}
  if(head){
   let btn=q('[data-ct324-history-toggle]',head);
   if(!btn){
    btn=document.createElement('button');btn.type='button';btn.className='chip ct324-history-toggle';
    btn.dataset.ct324HistoryToggle=kind;head.appendChild(btn);
   }
   btn.setAttribute('aria-expanded',open?'true':'false');
   btn.textContent=open?'Ocultar histórico':'Ver histórico';
  }
 }
 return hit;
}
function setHistoryOpen324(kind,on){
 if(!['episodes','movies'].includes(kind))return false;
 historyOpen324[kind]=!!on;decorateHomeHistory324(false);return true;
}
const baseRenderHome324=typeof renderHome==='function'?renderHome:null;
if(baseRenderHome324)renderHome=async function(){
 historyOpen324={episodes:false,movies:false};
 const out=await baseRenderHome324.apply(this,arguments);
 decorateHomeHistory324(false);return out;
};
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct324-history-toggle]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 const kind=String(b.dataset.ct324HistoryToggle||'episodes');
 setHistoryOpen324(kind,!historyOpen324[kind]);
},true);
try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(()=>{
  if(routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));
 }).observe(app,{subtree:true,childList:true});
}catch{}

/* PROFILE / WATCHLIST — do not discard legacy negative-TMDB rows. */
function type324(x){return String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv'}
function positiveTmdb324(x){
 const ids=[x?.tmdb_id,x?.source_tmdb_id,x?.raw_tmdb?.source_tmdb_id,x?.raw_tmdb?.id];
 for(const v of ids){const id=n(v);if(id>0)return id}return 0;
}
function title324(x){return String(x?.title||x?.name||x?.media_title||'Sem título')}
function year324(x){return n(x?.release_year||String(x?.release_date||x?.first_air_date||'').slice(0,4))}
function added324(x){const t=Date.parse(x?.added_at||x?.updated_at||x?.created_at||0);return Number.isFinite(t)?t:0}
function poster324(x){
 const p=x?.poster_url||x?.poster_path||x?.raw_tmdb?.poster_path||'';
 if(!p)return'';
 if(/^https?:/i.test(String(p)))return String(p);
 try{return typeof img==='function'?img(p,'w154'):String(p)}catch{return String(p)}
}
function sortRows324(list,mode){
 const a=rows(list).slice(),alpha=(x,y)=>title324(x).localeCompare(title324(y),'pt-BR',{sensitivity:'base'});
 if(mode==='alpha-desc')return a.sort((x,y)=>-alpha(x,y));
 if(mode==='alpha-asc')return a.sort(alpha);
 if(mode==='added-asc')return a.sort((x,y)=>added324(x)-added324(y)||alpha(x,y));
 if(mode==='year-desc')return a.sort((x,y)=>year324(y)-year324(x)||alpha(x,y));
 if(mode==='year-asc')return a.sort((x,y)=>year324(x)-year324(y)||alpha(x,y));
 return a.sort((x,y)=>added324(y)-added324(x)||alpha(x,y));
}
function watchCard324(x){
 const type=type324(x),tmdb=positiveTmdb324(x),title=title324(x),year=year324(x),poster=poster324(x);
 const added=added324(x)?new Date(added324(x)).toLocaleDateString('pt-BR'):'';
 const attrs=tmdb>0?' data-ct316-media="'+esc(type+':'+tmdb)+'"':' data-ct324-legacy-media="'+esc(String(x?.media_id||''))+'" aria-disabled="true"';
 const tag=tmdb>0?'button':'div';
 return '<'+tag+(tag==='button'?' type="button"':'')+' class="ct316-watch-row ct324-watch-row'+(tmdb>0?'':' ct324-watch-legacy')+'"'+attrs+'>'+
   (poster?'<img loading="lazy" src="'+esc(poster)+'" alt="">':'<span class="ct316-watch-poster-empty">Sem poster</span>')+
   '<span class="ct316-watch-copy"><b>'+esc(title)+'</b><small>'+esc([year||'',added?'Adicionado '+added:''].filter(Boolean).join(' · '))+'</small></span>'+
   (tmdb>0?'<i aria-hidden="true">›</i>':'<i aria-hidden="true"></i>')+'</'+tag+'>';
}
async function watchPayload324(kind){
 if(testBridge?.watchPayload){
  const d=await testBridge.watchPayload(kind);
  return {list:rows(d?.rows||d),total:n(d?.total)||rows(d?.rows||d).length};
 }
 if(typeof rpc!=='function')return{list:[],total:0};
 const d=await rpc('cinetracker_watchlist_full_v119',{});
 const list=rows(d?.rows||d).filter(x=>type324(x)===(kind==='movie'?'movie':'tv'));
 const total=n(d?.counts?.[kind==='movie'?'movie':'series'])||list.length;
 return{list,total};
}
function renderWatchRows324(back,list,mode){
 const body=q('[data-ct324-watch-list]',back);if(!body)return;
 const sorted=sortRows324(list,mode);
 body.innerHTML=sorted.length?sorted.map(watchCard324).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';
 back.dataset.ct324Sort=mode;
}
async function openWatch324(kind){
 q('[data-ct316-watch-modal]')?.remove();
 const label=kind==='movie'?'Filmes Watchlist':'Séries Watchlist';
 const back=document.createElement('div');back.className='ct316-watch-backdrop';back.dataset.ct316WatchModal=kind;back.dataset.ct324WatchModal=kind;
 back.innerHTML='<section class="ct316-watch-dialog ct323-watch-dialog ct324-watch-dialog" role="dialog" aria-modal="true" aria-labelledby="ct324-watch-title">'+
  '<header><div><small>PERFIL · WATCHLIST</small><h2 id="ct324-watch-title">'+esc(label)+'</h2></div><button type="button" data-ct316-watch-close aria-label="Fechar">×</button></header>'+
  '<div class="ct323-watch-toolbar ct324-watch-toolbar"><label for="ct324-watch-sort">Ordenar por</label><select id="ct324-watch-sort" data-ct324-watch-sort>'+
   '<option value="added-desc">Último adicionado</option><option value="added-asc">Primeiro adicionado</option>'+
   '<option value="alpha-asc">Ordem alfabética (A–Z)</option><option value="alpha-desc">Ordem alfabética (Z–A)</option>'+
   '<option value="year-desc">Ano mais recente</option><option value="year-asc">Ano mais antigo</option>'+
  '</select></div><div class="ct316-watch-body"><div class="loader">Carregando Watchlist...</div></div></section>';
 document.body.appendChild(back);
 try{
  const data=await watchPayload324(kind),h=q('#ct324-watch-title',back),body=q('.ct316-watch-body',back);
  if(!body)return;
  if(h)h.textContent=label+' · '+data.total;
  body.innerHTML='<div class="ct316-watch-list" data-ct324-watch-list></div>';
  renderWatchRows324(back,data.list,'added-desc');
  const select=q('[data-ct324-watch-sort]',back);
  select?.addEventListener('change',()=>renderWatchRows324(back,data.list,String(select.value||'added-desc')));
 }catch(e){
  const body=q('.ct316-watch-body',back);
  if(body)body.innerHTML='<div class="empty">Não foi possível carregar a Watchlist.<br><small>'+esc(e?.message||e)+'</small></div>';
 }
}
if(window.__ctR316)window.__ctR316.openWatchlist=openWatch324;
if(window.__ctR323)window.__ctR323.openWatchlist=openWatch324;
setTimeout(()=>{if(window.__ctR316)window.__ctR316.openWatchlist=openWatch324;if(window.__ctR323)window.__ctR323.openWatchlist=openWatch324},0);

const style=document.createElement('style');style.id='ct-web-r324';style.textContent=`
/* Home history stays loaded in the DOM but starts visually collapsed on both tabs. */
[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct274-history-stack,
[data-home] [data-ct274-history][data-ct324-history="collapsed"] .ct275-history-shell{display:none!important}
[data-home] [data-ct274-history] .panel-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}
[data-home] .ct324-history-toggle{flex:0 0 auto!important;min-height:28px!important;height:28px!important;padding:3px 9px!important;font-size:10px!important;white-space:nowrap!important}

/* Discover actions: all actions of a card share one compact row and never wrap. */
[data-ct309-foryou] .ct309-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;margin-top:5px!important}
[data-ct309-foryou] .ct309-actions .ct309-swap{grid-column:auto!important;width:100%!important;min-width:0!important}
[data-ct309-foryou] .ct309-actions .chip,
.ct319-actions .chip{min-width:0!important;min-height:26px!important;height:26px!important;padding:2px 4px!important;font-size:9px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;width:100%!important;margin-top:5px!important}

/* Full Watchlist population, including imported records without a positive TMDB id. */
.ct324-watch-row{grid-template-columns:58px minmax(0,1fr) 18px!important}
.ct324-watch-legacy{cursor:default!important}
.ct324-watch-legacy i{visibility:hidden!important}
@media(max-width:760px){
 [data-ct309-foryou] .ct309-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}
 .ct319-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 [data-ct309-foryou] .ct309-actions .chip,.ct319-actions .chip{font-size:8.5px!important;padding-inline:2px!important}
}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='home')decorateHomeHistory324(false)},0);

window.__ctR324={
 decorateHomeHistory:decorateHomeHistory324,setHistoryOpen:setHistoryOpen324,
 openWatchlist:openWatch324,watchPayload:watchPayload324,sortWatchlist:sortRows324,
 version:'1.0.115',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR324Test={decorateHomeHistory324,setHistoryOpen324,positiveTmdb324,sortRows324,watchCard324,watchPayload324,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();

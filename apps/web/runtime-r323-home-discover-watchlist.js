/* CineTracker Web 1.0.114 r323 — Home movie history truth + Watchlist sorting. */
(()=>{
'use strict';
if(window.__ctR323)return;
window.__ctR323='home-movie-play-history+watchlist-sort+discover-legacy-alias';
window.__ctR323Home='movie-history-play-events+legacy';
window.__ctR323Watchlist='visible-sort-last-added+alpha+year';
window.__ctR323Discover='legacy-title-alias+top10-fill-ten';
window.__ctR323Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
let testBridge=null;

/* HOME: preserve all existing Home composition, replace only movie history with the same
   play-event + legacy authority that drives the detailed activity history. */
const baseFetchHome323=typeof ct274FetchHome==='function'?ct274FetchHome:null;
function mergeHome323(data,history){
 const out=data&&typeof data==='object'?data:{};
 out.history_movies=rows(history);
 out.__ctHistoryAuthoritative=true;
 out.__ctR323MovieHistory='play-events+legacy';
 return out;
}
if(baseFetchHome323){
 ct274FetchHome=async function(){
  const homeP=baseFetchHome323();
  const histP=testBridge?.homeMovies
    ? Promise.resolve(testBridge.homeMovies())
    : (typeof rpc==='function'
      ? rpc('cinetracker_home_movie_history_v323',{p_limit:50})
      : Promise.resolve([]));
  const [data,history]=await Promise.all([homeP,histP]);
  return mergeHome323(data,history);
 };
}

/* WATCHLIST modal with visible sorting controls. */
function type323(x){return String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv'}
function id323(x){return n(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id)}
function title323(x){return String(x?.title||x?.name||x?.media_title||'Sem título')}
function year323(x){return n(x?.release_year||String(x?.release_date||x?.first_air_date||'').slice(0,4))}
function added323(x){const t=Date.parse(x?.added_at||x?.updated_at||x?.created_at||0);return Number.isFinite(t)?t:0}
function poster323(x){
 const p=x?.poster_url||x?.poster_path||x?.raw_tmdb?.poster_path||'';
 if(!p)return'';
 if(/^https?:/i.test(String(p)))return String(p);
 try{return typeof img==='function'?img(p,'w154'):String(p)}catch{return String(p)}
}
function sortRows323(list,mode){
 const a=rows(list).slice(),alpha=(x,y)=>title323(x).localeCompare(title323(y),'pt-BR',{sensitivity:'base'});
 if(mode==='alpha-desc')return a.sort((x,y)=>-alpha(x,y));
 if(mode==='alpha-asc')return a.sort(alpha);
 if(mode==='added-asc')return a.sort((x,y)=>added323(x)-added323(y)||alpha(x,y));
 if(mode==='year-desc')return a.sort((x,y)=>year323(y)-year323(x)||alpha(x,y));
 if(mode==='year-asc')return a.sort((x,y)=>year323(x)-year323(y)||alpha(x,y));
 return a.sort((x,y)=>added323(y)-added323(x)||alpha(x,y));
}
function watchCard323(x){
 const type=type323(x),id=id323(x),title=title323(x),year=year323(x),poster=poster323(x);
 const added=added323(x)?new Date(added323(x)).toLocaleDateString('pt-BR'):'';
 return '<button type="button" class="ct316-watch-row ct323-watch-row" data-ct316-media="'+esc(type+':'+id)+'">'+
   (poster?'<img loading="lazy" src="'+esc(poster)+'" alt="">':'<span class="ct316-watch-poster-empty">Sem poster</span>')+
   '<span class="ct316-watch-copy"><b>'+esc(title)+'</b><small>'+esc([year||'',added?'Adicionado '+added:''].filter(Boolean).join(' · '))+'</small></span><i aria-hidden="true">›</i></button>';
}
function renderWatchRows323(back,list,mode){
 const body=q('[data-ct323-watch-list]',back);if(!body)return;
 const sorted=sortRows323(list,mode);
 body.innerHTML=sorted.length?sorted.map(watchCard323).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';
 back.dataset.ct323Sort=mode;
}
async function watchRows323(kind){
 if(testBridge?.watchRows)return rows(await testBridge.watchRows(kind));
 const fn=window.__ctR316Test?.watchRows316;
 return typeof fn==='function'?rows(await fn(kind,true)):[];
}
async function openWatch323(kind){
 q('[data-ct316-watch-modal]')?.remove();
 const label=kind==='movie'?'Filmes Watchlist':'Séries Watchlist';
 const back=document.createElement('div');back.className='ct316-watch-backdrop';back.dataset.ct316WatchModal=kind;back.dataset.ct323WatchModal=kind;
 back.innerHTML='<section class="ct316-watch-dialog ct323-watch-dialog" role="dialog" aria-modal="true" aria-labelledby="ct323-watch-title">'+
  '<header><div><small>PERFIL · WATCHLIST</small><h2 id="ct323-watch-title">'+esc(label)+'</h2></div><button type="button" data-ct316-watch-close aria-label="Fechar">×</button></header>'+
  '<div class="ct323-watch-toolbar"><label for="ct323-watch-sort">Ordenar por</label><select id="ct323-watch-sort" data-ct323-watch-sort>'+
   '<option value="added-desc">Último adicionado</option>'+
   '<option value="added-asc">Primeiro adicionado</option>'+
   '<option value="alpha-asc">Ordem alfabética (A–Z)</option>'+
   '<option value="alpha-desc">Ordem alfabética (Z–A)</option>'+
   '<option value="year-desc">Ano mais recente</option>'+
   '<option value="year-asc">Ano mais antigo</option>'+
  '</select></div>'+
  '<div class="ct316-watch-body"><div class="loader">Carregando Watchlist...</div></div></section>';
 document.body.appendChild(back);
 try{
  const list=await watchRows323(kind),h=q('#ct323-watch-title',back),body=q('.ct316-watch-body',back);
  if(!body)return;
  if(h)h.textContent=label+' · '+list.length;
  body.innerHTML='<div class="ct316-watch-list" data-ct323-watch-list></div>';
  renderWatchRows323(back,list,'added-desc');
  const select=q('[data-ct323-watch-sort]',back);
  select?.addEventListener('change',()=>renderWatchRows323(back,list,String(select.value||'added-desc')));
 }catch(e){
  const body=q('.ct316-watch-body',back);
  if(body)body.innerHTML='<div class="empty">Não foi possível carregar a Watchlist.<br><small>'+esc(e?.message||e)+'</small></div>';
 }
}
if(window.__ctR316)window.__ctR316.openWatchlist=openWatch323;

/* Ensure late runtimes cannot restore the old modal opener. */
setTimeout(()=>{if(window.__ctR316)window.__ctR316.openWatchlist=openWatch323},0);

const style=document.createElement('style');style.id='ct-web-r323';style.textContent=`
.ct323-watch-dialog{overflow:hidden!important}
.ct323-watch-toolbar{display:flex!important;align-items:center!important;gap:10px!important;padding:10px 14px!important;border-bottom:1px solid #193946!important;background:#081720!important;flex-wrap:wrap!important}
.ct323-watch-toolbar label{font-size:12px!important;font-weight:700!important;opacity:.78!important}
.ct323-watch-toolbar select{min-height:40px!important;min-width:min(290px,100%)!important;max-width:100%!important;padding:8px 34px 8px 11px!important;border:1px solid #31596b!important;border-radius:10px!important;background:#0b1e27!important;color:inherit!important;font:inherit!important}
.ct323-watch-row .ct316-watch-copy small{white-space:normal!important}
@media(max-width:600px){.ct323-watch-toolbar{align-items:stretch!important;flex-direction:column!important;gap:6px!important}.ct323-watch-toolbar select{width:100%!important;min-width:0!important}}
`;document.head.appendChild(style);

window.__ctR323={openWatchlist:openWatch323,sortWatchlist:sortRows323,mergeHome:mergeHome323,version:'1.0.114',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
window.__ctR323Test={sortRows323,mergeHome323,watchCard323,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();

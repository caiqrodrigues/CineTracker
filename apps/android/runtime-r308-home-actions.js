/* CineTracker official Android 1.0/r308 — Home tap targets, consistent UFC card,
   immediate single-item history undo and movie-history first-paint stability.
   Keep r307 user-taste & source filtering, r306 30-day classification and r304 Sports intact. */
(()=>{
'use strict';
if(window.__ctR308Home)return;
const array=v=>Array.isArray(v)?v:[];
const who=()=>String(session?.user?.id||user?.id||'');
const home=()=>route()==='home'&&!!who();
const movieTab=()=>home()&&homeActiveTab158==='movies';
const number=v=>Number.isSafeInteger(Number(v))&&Number(v)>0?Number(v):0;
const seenAt=x=>Date.parse(x?.watched_at||'')||0;
const movieId=x=>number(x?.tmdb_id)||number(x?.media_id);
const episodeKey=x=>String(number(x?.tmdb_id)||number(x?.media_id))+':'+number(x?.season_number)+':'+number(x?.episode_number);
const removedMovies=new Set(),removedEpisodes=new Set(),actionBusy=new Set(),undoBusy=new Set();
let userId='',savedRows=[],lastVerified=0,lastError='',moviePaints=0,undoCount=0,tapCount=0;
const key=id=>'ct:r308:last-confirmed-movies:'+id;
function reset(){
 const id=who();
 if(userId===id)return;
 userId=id;savedRows=[];lastVerified=0;lastError='';removedMovies.clear();removedEpisodes.clear();
 try{
  const data=JSON.parse(localStorage.getItem(key(id))||'null');
  if(data?.at&&Date.now()-data.at<14*86400000&&Array.isArray(data.rows)){
   savedRows=data.rows.filter(x=>movieId(x)>0&&seenAt(x)>0).slice(0,200);
   lastVerified=Number(data.at);
  }
 }catch{}
}
function blockedMovie(x){reset();return removedMovies.has(movieId(x))}
function blockedEpisode(x){reset();return removedEpisodes.has(episodeKey(x))}
function goodMovie(x){return movieId(x)>0&&seenAt(x)>0&&!blockedMovie(x)}
function mergeMovies(rows){
 reset();
 // v542 rows are authenticated and chronologically sorted; keep older archive
 // rows while preventing old Home responses from becoming the latest card.
 const freshest=window.__ctR305MovieHistory?.latestRows?.()||[];
 const map=new Map();
 for(const x of [...array(rows),...savedRows,...array(freshest)]){
  if(!goodMovie(x))continue;
  const id=movieId(x),prev=map.get(id);
  if(!prev||seenAt(x)>seenAt(prev))map.set(id,x);
  else if(seenAt(x)===seenAt(prev)&&!prev.poster_path&&x.poster_path)map.set(id,x);
 }
 return [...map.values()].sort((a,b)=>seenAt(a)-seenAt(b)||movieId(a)-movieId(b));
}
function confirmedMovies(){
 reset();
 const rows=array(window.__ctR305MovieHistory?.latestRows?.()).filter(goodMovie);
 if(!rows.length)return false;
 const latest=Math.max(...rows.map(seenAt));
 if(latest<=0)return false;
 savedRows=rows;lastVerified=Date.now();
 try{localStorage.setItem(key(userId),JSON.stringify({at:lastVerified,rows:savedRows.slice(0,200)}))}catch{}
 document.documentElement.dataset.ct308MoviesPending='0';
 return true;
}
function stableBeforePaint(){
 if(!home()||!homeCache)return;
 const latest=mergeMovies(homeCache.history_movies);
 if(latest.length)homeCache={...homeCache,history_movies:latest};
 // Do not show the stale Pokémon-only history on first render without
 // a trustworthy recent snapshot. Movie watchlist still paints normally.
 if(movieTab()&&!savedRows.length&&!array(window.__ctR305MovieHistory?.latestRows?.()).length){
  document.documentElement.dataset.ct308MoviesPending='1';
 }
}
const originalPaint=paintHome;
paintHome=function(...args){
 stableBeforePaint();
 const result=originalPaint.apply(this,args);
 if(home())normalize();
 return result;
};
function normalize(){
 const root=document.querySelector('[data-home-viewport="series"]');
 if(!root)return;
 for(const row of root.querySelectorAll('.home-section .stack > .home-action-row')){
  if(row.querySelector('.media-row'))continue;
  if(row.querySelector('.home-check,[data-home-mark-episode]'))row.remove();
 }
}
// Ensure all legacy movie-only painters receive the same newest verified rows
// even when they finish after today's query.
const bridge=window.__ctR271Bridge;
if(bridge?.getPainter&&bridge?.setPainter){
 const previous=bridge.getPainter();
 bridge.setPainter(function(rows){
  const stable=mergeMovies(rows);
  if(homeCache&&home())homeCache={...homeCache,history_movies:stable};
  moviePaints++;
  return previous.call(this,stable);
 });
}
const movieApi=window.__ctR305MovieHistory;
if(movieApi?.refresh){
 const previous=movieApi.refresh;
 movieApi.refresh=async function(...args){
  const previousUser=who();
  const result=await previous.apply(this,args);
  if(who()===previousUser&&confirmedMovies()){
   const stable=mergeMovies(homeCache?.history_movies);
   if(homeCache&&home())homeCache={...homeCache,history_movies:stable};
   if(movieTab()&&bridge?.getPainter)bridge.getPainter()(stable);
  }else if(who()===previousUser&&!savedRows.length){
   // Invalid/offline response: show existing entries rather than a permanent loader.
   document.documentElement.dataset.ct308MoviesPending='0';
  }
  return result;
 };
}
const oldMovieRow=homeMovieRow158,oldEpisodeRow=homeEpisodeHistory158;
function addUndo(html,type,x){
 const id=number(x.media_id),s=number(x.season_number),e=number(x.episode_number);
 if(!id||(type==='episode'&&(!s||!e)))return html;
 const action='<button type="button" class="ct308-undo" data-ct308-undo="'+type+
  '" data-ct308-media-id="'+id+'" data-ct308-tmdb-id="'+number(x.tmdb_id)+
  '" data-ct308-season="'+s+'" data-ct308-episode="'+e+
  '" title="Desmarcar como assistido" aria-label="Desmarcar como assistido">Desmarcar</button>';
 return String(html).replace(/<\/div>\s*$/,action+'</div>');
}
homeMovieRow158=function(x,history=false){
 const result=oldMovieRow.call(this,x,history);
 return history?addUndo(result,'movie',x):result;
};
homeEpisodeHistory158=function(x){
 return addUndo(oldEpisodeRow.call(this,x),'episode',x);
};
function dropLocal(type,id,tmdb,s,e){
 if(type==='movie'){
  removedMovies.add(tmdb||id);
  if(homeCache)homeCache={...homeCache,history_movies:array(homeCache.history_movies).filter(x=>
   movieId(x)!==(tmdb||id)&&number(x.media_id)!==id)};
  window.__ctR305MovieHistory?.drop?.(id,tmdb);
  savedRows=savedRows.filter(x=>movieId(x)!==(tmdb||id)&&number(x.media_id)!==id);
  try{localStorage.setItem(key(userId),JSON.stringify({at:Date.now(),rows:savedRows}))}catch{}
 }else{
  const check=x=>(number(x.tmdb_id)===tmdb&&tmdb>0||number(x.media_id)===id)&&number(x.season_number)===s&&number(x.episode_number)===e;
  removedEpisodes.add(String(tmdb||id)+':'+s+':'+e);
  if(homeCache)homeCache={...homeCache,history_episodes:array(homeCache.history_episodes).filter(x=>!check(x))};
  window.__ctR306Home?.dropEpisode?.(id,tmdb,s,e);
 }
}
function showUndoError(error){
 lastError=String(error?.message||error);
 try{toast('Não foi possível desmarcar: '+lastError)}catch{}
}
async function undo(button){
 if(!button||!home()||!session?.access_token)return;
 const type=button.dataset.ct308Undo,id=number(button.dataset.ct308MediaId),
  tmdb=number(button.dataset.ct308TmdbId),s=number(button.dataset.ct308Season),e=number(button.dataset.ct308Episode);
 if(!id||(type!=='movie'&&type!=='episode')||(type==='episode'&&(!s||!e)))return;
 const tag=type+':'+id+':'+s+':'+e;
 if(undoBusy.has(tag))return;
 undoBusy.add(tag);
 const row=button.closest('.ct111-history-row,.home-action-row');
 const oldHtml=row?.outerHTML||'';
 const parent=row?.parentElement;
 const index=row?[...parent.children].indexOf(row):-1;
 button.disabled=true;button.textContent='Desmarcando…';
 // Optimistic single-row removal, no Home remount and no page reload.
 row?.remove();
 try{
  const params=type==='movie'?{p_media_id:id,p_item_type:'movie',p_season_number:null,p_episode_number:null}:
   {p_media_id:id,p_season_number:s,p_episode_number:e,p_changed_at:new Date().toISOString()};
  const rpcName=type==='movie'?'cinetracker_unmark_history_item_v426':'cinetracker_unmark_episode_v1';
  const result=await rpc(rpcName,params);
  if(number(result?.media_id)!==id||!(result?.seen===false||result?.watched===false))
   throw new Error('O servidor não confirmou a remoção do histórico.');
  dropLocal(type,id,tmdb,s,e);
  undoCount++;
  try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'home-history-unwatch-r308',media_id:id,item_type:type}}))}catch{}
  if(type==='movie')void movieApi?.refresh?.(true);
  else void window.__ctR306Home?.refresh?.(true);
  try{toast('Marcação removida do histórico.')}catch{}
 }catch(err){
  if(parent?.isConnected&&oldHtml){
   const tmpl=document.createElement('template');tmpl.innerHTML=oldHtml;
   const restored=tmpl.content.firstElementChild;
   if(restored)parent.insertBefore(restored,parent.children[index]||null);
  }
  showUndoError(err);
 }finally{undoBusy.delete(tag)}
}
function tap(event){
 const b=event.target?.closest?.('[data-home-mark-episode]');
 if(!b||!home()||homeActiveTab158!=='series')return;
 const id=number(b.dataset.homeMarkEpisode);
 if(!id)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(actionBusy.has(id))return;
 actionBusy.add(id);tapCount++;
 b.disabled=true;b.setAttribute('aria-busy','true');b.classList.add('ct308-watching');
 const previous=b.textContent;b.textContent='…';
 // Synchronous lock prevents repeated taps while the existing episode
 // controller resolves the canonical next episode and persists to Supabase.
 Promise.resolve().then(()=>markNextEpisode158(id)).catch(err=>{
  try{toast('Não foi possível marcar: '+String(err?.message||err))}catch{}
 }).finally(()=>{
  actionBusy.delete(id);
  const current=document.querySelector('[data-home-mark-episode="'+id+'"]');
  if(current){current.disabled=false;current.removeAttribute('aria-busy');current.classList.remove('ct308-watching');if(current===b)current.textContent=previous}
 });
}
document.addEventListener('click',event=>{
 const b=event.target?.closest?.('[data-ct308-undo]');
 if(!b||!home())return;
 event.preventDefault();event.stopImmediatePropagation();void undo(b);
},true);
document.addEventListener('click',tap,true);
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&movieTab())void movieApi?.refresh?.(true);
});
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-home-tab="movies"],[data-home-tab="films"]'))
  queueMicrotask(()=>{if(movieTab())void movieApi?.refresh?.(true)});
},false);
const css=document.createElement('style');css.id='ct308-home-actions';
css.textContent=[
 '.home-viewport[data-home-viewport="series"] .home-section .stack>.home-action-row{box-sizing:border-box!important;width:100%!important;min-height:78px!important;grid-template-columns:minmax(0,1fr) 52px!important;gap:8px!important;align-items:stretch!important}',
 '[data-home-viewport="series"] .home-section .stack>.home-action-row>.media-row{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;min-height:76px!important;overflow:hidden!important}',
 '[data-home-viewport="series"] .home-section .stack>.home-action-row>.home-check{box-sizing:border-box!important;width:52px!important;min-width:52px!important;max-width:52px!important;min-height:52px!important;align-self:stretch!important;touch-action:manipulation!important;pointer-events:auto!important;position:relative!important;z-index:2!important;font-size:18px!important}',
 '[data-home-viewport="series"] .home-section .stack>.home-action-row:not(:has(.media-row)){display:none!important}',
 '[data-home-viewport] .home-history .ct111-history-row{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;align-items:center!important;gap:5px!important;min-width:0!important}',
 '[data-home-viewport] .home-history .ct111-history-row>.media-row{min-width:0!important;width:100%!important}',
 '[data-home-viewport] .home-history .ct111-rewatch{box-sizing:border-box!important;min-width:0!important;max-width:75px!important;white-space:normal!important;overflow-wrap:anywhere!important;font-size:9px!important;padding:5px!important}',
 '[data-home-viewport] .home-history .ct308-undo{background:transparent!important;border:1px solid #375062!important;color:#a6b8c3!important;border-radius:7px!important;min-height:34px!important;max-width:79px!important;padding:4px 6px!important;font-size:9px!important;font-weight:500!important;line-height:1.15!important;white-space:normal!important;touch-action:manipulation!important}',
 '[data-home-viewport] .home-history .ct308-undo:disabled{opacity:.45!important}',
 'html[data-ct308-movies-pending="1"] [data-home-viewport="movies"] .home-history .stack{visibility:hidden!important}',
 'html[data-ct308-movies-pending="1"] [data-home-viewport="movies"] .home-history:after{content:"Atualizando histórico recente…";font-size:11px;color:#9fb4c2;display:block;padding:8px 12px}'
].join('\n');
document.head.appendChild(css);
reset();
if(!savedRows.length)document.documentElement.dataset.ct308MoviesPending='1';
setTimeout(()=>{document.documentElement.dataset.ct308MoviesPending='0'},13000);
window.__ctR308Home={mergeMovies,blockedMovie,blockedEpisode,confirmedMovies,undo,tap,normalize,
 stats:()=>({account:userId,movieRows:savedRows.length,lastVerified,moviePaints,undoCount,tapCount,lastError,busy:actionBusy.size})};
})();
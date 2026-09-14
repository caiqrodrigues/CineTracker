/* CineTracker Web 1.0.70 / r279 — explicit, real watched buttons on active episode and movie cards. */
window.__ctR279='explicit-watched-buttons+canonical-r6-refresh';
window.__ctR279Watch='real-button+episode+movie+finite-reconcile';
window.__ctR279Tabs='r278-fixed-home-tabs-preserved';
window.__ctR279Frozen='r278-fixed-tabs+r277-sidebar+r276-history+episode-meta+dedupe+rewatch+discover+detail+sports+android-preserved';

const ct279BaseRow=ct274Row;
const ct279BaseEpisodeWatchAction=ct274EpisodeWatchAction;
const ct279BaseMovieWatchAction=ct274MovieWatchAction;
const ct279BasePaintHome=ct275PaintHome;
const ct279BaseMarkWatched=ct266MarkWatched;
const ct279BaseWatchAction=ct266WatchAction;
let ct279WatchBusy=false,ct279ReconcileToken=0;

function ct279Attr(v){return String(v??'').replace(/[&<>"']/g,c=>c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c==='"'?'&quot;':'&#39;')}
function ct279Norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function ct279EffectiveTmdb(x){
 try{const n=Number(typeof ct278EffectiveTmdb==='function'?ct278EffectiveTmdb(x):0);if(n>0)return n}catch{}
 try{const n=Number(typeof ct275Tmdb==='function'?ct275Tmdb(x):0);if(n>0)return n}catch{}
 try{const n=Number(typeof mediaTmdb==='function'?mediaTmdb(x):0);if(n>0)return n}catch{}
 for(const v of [x?.effective_tmdb_id,x?.tmdb_id,x?.tmdbId]){const n=Number(v||0);if(n>0)return n}
 return 0
}
function ct279ExplicitWatchAction(kind,tmdb,s=0,e=0,title=''){
 const k=kind==='episode'?'episode':'movie',id=Number(tmdb||0),sn=Number(s||0),en=Number(e||0);
 if(!(id>0)||(k==='episode'&&(!(sn>0)||!(en>0))))return'';
 const aria=k==='episode'?'Marcar episódio como assistido':'Marcar filme como assistido';
 return '<button type="button" class="ct266-watch-action ct279-watch-button" aria-label="'+aria+'" title="'+aria+'" data-ct266-watch="'+k+'" data-tmdb="'+id+'"'+(sn?' data-season="'+sn+'"':'')+(en?' data-episode="'+en+'"':'')+(title?' data-title="'+ct279Attr(title)+'"':'')+'><span class="ct279-watch-check" aria-hidden="true">✓</span><span class="ct279-watch-label">Marcar</span></button>'
}
function ct279EpisodeWatchAction(x){
 const tmdb=ct279EffectiveTmdb(x),s=Number(x?.next_season_number??x?.season_number??0),e=Number(x?.next_episode_number??x?.episode_number??0);
 return ct279ExplicitWatchAction('episode',tmdb,s,e,x?.next_episode_title||x?.episode_title||x?.cached_episode_title||x?.title||x?.media_title||'')
}
function ct279MovieWatchAction(x){return ct279ExplicitWatchAction('movie',ct279EffectiveTmdb(x),0,0,x?.title||x?.media_title||x?.name||'')}

function ct279ContextFromAttrs(attrs){const m=String(attrs||'').match(/data-ct274-context="([^"]+)"/);return m?.[1]||''}
function ct279Row(x,opts={}){
 const next={...opts};let action=String(next.action||''),context=ct279ContextFromAttrs(next.attrs);
 if(!action&&(context==='continue'||context==='dust'))action=ct279ExplicitWatchAction('episode',ct279EffectiveTmdb(x),Number(x?.season_number??x?.next_season_number??0),Number(x?.episode_number??x?.next_episode_number??0),x?.episode_title||x?.next_episode_title||x?.cached_episode_title||'');
 if(!action&&String(x?.media_type||'').toLowerCase()==='movie'&&!x?.watched_at&&!x?.last_watched_at)action=ct279MovieWatchAction(x);
 next.action=action;
 let html=ct279BaseRow(x,next);
 if(action.includes('data-ct266-watch'))html=html.replace('class="media-row ct274-media-card"','class="media-row ct274-media-card ct266-home-watch-host ct279-watch-host"');
 return html
}

function ct279CardTmdb(card){
 const direct=Number(card?.dataset?.ct274Tmdb||card?.dataset?.tmdb||0);if(direct>0)return direct;
 const m=String(card?.dataset?.media||'').match(/^(?:tv|movie):(\d+)$/);return m?Number(m[1]):0
}
function ct279SeriesRows(){
 try{if(Array.isArray(ct275CanonicalSeries))return ct275CanonicalSeries}catch{}
 try{const p=typeof ct274Payload==='function'?ct274Payload():null;if(Array.isArray(p?.series))return p.series}catch{}
 try{if(Array.isArray(homeCache?.series))return homeCache.series}catch{}
 return []
}
function ct279SeriesRow(tmdb){return ct279SeriesRows().find(x=>ct279EffectiveTmdb(x)===Number(tmdb||0))||null}
function ct279EpisodeCoords(card,row){
 let s=Number(card?.dataset?.ct274Season||0),e=Number(card?.dataset?.ct274Episode||0);
 if(!(s>0))s=Number(row?.next_season_number??row?.season_number??0);
 if(!(e>0))e=Number(row?.next_episode_number??row?.episode_number??0);
 if(s>0&&e>0)return{s,e};
 const text=String(card?.querySelector?.('.ct274-meta')?.textContent||card?.textContent||''),m=text.match(/S\s*0*(\d+)\s*E\s*0*(\d+)/i);return m?{s:Number(m[1]),e:Number(m[2])}:null
}
function ct279Mount(card,kind,tmdb,s=0,e=0,title=''){
 if(!card||!(Number(tmdb)>0))return false;const html=ct279ExplicitWatchAction(kind,tmdb,s,e,title);if(!html)return false;
 let action=card.querySelector(':scope > [data-ct266-watch]');
 if(action){if(action.tagName==='BUTTON'&&action.classList.contains('ct279-watch-button')&&Number(action.dataset.tmdb||0)===Number(tmdb)&&Number(action.dataset.season||0)===Number(s||0)&&Number(action.dataset.episode||0)===Number(e||0)){card.classList.add('ct266-home-watch-host','ct279-watch-host');card.dataset.ct279WatchReady='1';return false}action.outerHTML=html}else card.insertAdjacentHTML('beforeend',html);
 card.classList.add('ct266-home-watch-host','ct279-watch-host');card.dataset.ct279WatchReady='1';return true
}
function ct279ReconcileWatchButtons(root=document){
 const home=root?.matches?.('[data-home]')?root:root?.querySelector?.('[data-home]');if(!home)return 0;let changed=0;
 for(const sec of home.querySelectorAll('[data-home-view="series"] .home-section')){
  const head=ct279Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'');if(head!=='assistir a seguir'&&head!=='juntando poeira')continue;
  for(const card of sec.querySelectorAll('.media-row[data-media^="tv:"],.ct274-media-card[data-media^="tv:"]')){
   const tmdb=ct279CardTmdb(card),row=ct279SeriesRow(tmdb),pos=ct279EpisodeCoords(card,row);if(!(tmdb>0)||!pos)continue;
   const title=card.dataset.ct274FallbackTitle||row?.next_episode_title||card.querySelector('.ct274-meta')?.textContent||'';if(ct279Mount(card,'episode',tmdb,pos.s,pos.e,title))changed++
  }
 }
 for(const sec of home.querySelectorAll('[data-home-view="movies"] .home-section')){
  const head=ct279Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent||'');if(!/assistir a seguir|watchlist/.test(head)||/filmes vistos|historico/.test(head))continue;
  for(const card of sec.querySelectorAll('.media-row[data-media^="movie:"],.ct274-media-card[data-media^="movie:"]')){const tmdb=ct279CardTmdb(card);if(!(tmdb>0))continue;if(ct279Mount(card,'movie',tmdb,0,0,card.querySelector('b,strong')?.textContent||''))changed++}
 }
 return changed
}
function ct279ScheduleReconcile(){const token=++ct279ReconcileToken;for(const ms of [0,60,180,520])setTimeout(()=>{if(token===ct279ReconcileToken&&typeof route==='function'&&route()==='home')ct279ReconcileWatchButtons(document)},ms)}
function ct279PaintHome(...args){const out=ct279BasePaintHome.apply(this,args);ct279ReconcileWatchButtons(document);ct279ScheduleReconcile();return out}

async function ct279MarkWatched(action){
 if(!action||ct279WatchBusy)return;const kind=action.dataset.ct266Watch,tmdbId=Number(action.dataset.tmdb||0),s=Number(action.dataset.season||0),e=Number(action.dataset.episode||0);
 if(!(tmdbId>0)||!['movie','episode'].includes(kind)||(kind==='episode'&&(!(s>0)||!(e>0))))return;
 const keep=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'series';ct279WatchBusy=true;action.disabled=true;action.setAttribute('aria-busy','true');action.setAttribute('aria-disabled','true');
 try{
  const media=await ensureMedia(kind==='episode'?'tv':'movie',tmdbId);
  await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(media.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:action.dataset.title||media.title||null,p_runtime_minutes:Number(media.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
  if(typeof ct275ReloadHome==='function')await ct275ReloadHome('r279-watch');else if(typeof ct274FetchHome==='function'){homeCache=await ct274FetchHome();if(typeof paintHome==='function'&&typeof route==='function'&&route()==='home')paintHome()}
  if(typeof ct266ApplyHomeTab==='function')ct266ApplyHomeTab(keep);try{profileCache=null;discoverCache?.clear?.()}catch{};try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r279-watch',at:Date.now()}}))}catch{};try{toast(kind==='episode'?'Episódio marcado como assistido':'Filme marcado como assistido')}catch{}
 }catch(err){action.disabled=false;action.removeAttribute('aria-busy');action.removeAttribute('aria-disabled');try{toast(err?.message||String(err))}catch{}}
 finally{ct279WatchBusy=false}
}

ct266WatchAction=ct279ExplicitWatchAction;
ct274EpisodeWatchAction=ct279EpisodeWatchAction;
ct274MovieWatchAction=ct279MovieWatchAction;
ct274Row=ct279Row;
ct266MarkWatched=ct279MarkWatched;
ct275PaintHome=ct279PaintHome;
paintHome=ct279PaintHome;
window.__ctR279Test={explicitWatchAction:ct279ExplicitWatchAction,effectiveTmdb:ct279EffectiveTmdb,row:ct279Row,cardTmdb:ct279CardTmdb,episodeCoords:ct279EpisodeCoords,reconcile:ct279ReconcileWatchButtons,markWatched:ct279MarkWatched,baseRow:ct279BaseRow,baseEpisodeWatchAction:ct279BaseEpisodeWatchAction,baseMovieWatchAction:ct279BaseMovieWatchAction,basePaintHome:ct279BasePaintHome,baseMarkWatched:ct279BaseMarkWatched,baseWatchAction:ct279BaseWatchAction};

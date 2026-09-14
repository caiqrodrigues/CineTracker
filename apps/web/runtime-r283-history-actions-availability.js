/* CineTracker Web 1.0.74 / r283 — isolate History actions and use fresh released-episode availability without reviving legacy backlog as next. */
window.__ctR283='history-action-isolation+fresh-availability+legacy-frontier-next';
window.__ctR283History='window-capture-rewatch+undo-no-navigation';
window.__ctR283Availability='fresh-released-minus-canonical-watched';
window.__ctR283Legacy='raw+smackdown-frontier-next+backlog-count';
window.__ctR283Frozen='r282-series-order+r281-watch-isolation+r276-history+discover+detail+sports+android-preserved';

const ct283AvailabilityByTmdb=new Map();
const ct283BaseAvailableText=ct274AvailableText;
const ct283BaseFirstReleasedUnseen=ct275FirstReleasedUnseen;
const ct283BaseReconcileOne=ct275ReconcileOne;
const ct283BaseReloadHome=ct275ReloadHome;

function ct283Pos(s,e){return Number(s||0)*100000+Number(e||0)}
function ct283Today(){try{return typeof ct275Today==='function'?ct275Today():localDay()}catch{return new Date().toISOString().slice(0,10)}}
function ct283ReleaseBoundary(show){
 const ep=show?.last_episode_to_air,s=Number(ep?.season_number||0),e=Number(ep?.episode_number||0);
 if(!(s>0&&e>0))return null;
 const d=ep?.air_date?String(ep.air_date):'';if(d&&d>ct283Today())return null;
 return{s,e,air_date:d||null}
}
function ct283SeasonRows(show){return (Array.isArray(show?.seasons)?show.seasons:[]).map(x=>({s:Number(x?.season_number||0),count:Number(x?.episode_count||0)})).filter(x=>x.s>0&&x.count>0).sort((a,b)=>a.s-b.s)}
function ct283FreshReleasedCount(show){
 const b=ct283ReleaseBoundary(show);if(!b)return null;let n=0;
 for(const x of ct283SeasonRows(show)){if(x.s<b.s)n+=x.count;else if(x.s===b.s){n+=Math.min(x.count,b.e);break}else break}
 return n
}
function ct283FreshTotalCount(show){return ct283SeasonRows(show).reduce((n,x)=>n+x.count,0)}
function ct283WatchedKeys(row){
 const seen=new Set(),out=[];
 for(const k of Array.isArray(row?.__ct275WatchedKeys)?row.__ct275WatchedKeys:[]){const s=Number(k?.s||0),e=Number(k?.e||0),key=s+':'+e;if(s>0&&e>0&&!seen.has(key)){seen.add(key);out.push({s,e})}}
 return out
}
function ct283Frontier(row){return ct283WatchedKeys(row).sort((a,b)=>ct283Pos(a.s,a.e)-ct283Pos(b.s,b.e)).at(-1)||null}
function ct283WatchedReleasedCount(row,show){
 const b=ct283ReleaseBoundary(show);if(!b)return null;const seasons=new Map(ct283SeasonRows(show).map(x=>[x.s,x.count]));let n=0;
 for(const k of ct283WatchedKeys(row)){const max=seasons.get(k.s)||0;if(max>0&&k.e<=max&&ct283Pos(k.s,k.e)<=ct283Pos(b.s,b.e))n++}
 return n
}
function ct283ApplyFreshAvailability(row,show){
 const released=ct283FreshReleasedCount(show),watched=ct283WatchedReleasedCount(row,show),tmdbId=ct275Tmdb(row);
 if(released===null||watched===null)return row;
 const available=Math.max(0,released-watched),total=ct283FreshTotalCount(show);
 row.released_episodes=released;row.available_episodes=available;row.history_missing_episodes=available;
 if(total>0)row.total_episodes=Math.max(Number(row.total_episodes||0),total);
 if(tmdbId>0)ct283AvailabilityByTmdb.set(tmdbId,available);
 return row
}
function ct283AvailableText(row){
 const t=ct275Tmdb(row),fresh=t>0?ct283AvailabilityByTmdb.get(t):undefined;
 if(fresh===undefined)return ct283BaseAvailableText(row);
 const n=Math.max(0,Number(fresh||0));return n===1?'1 episódio disponível para ver':n+' episódios disponíveis para ver'
}
function ct283LegacySeries(row){
 const t=ct275Tmdb(row);if(t===4656||t===1549)return true;
 const name=String(row?.title||row?.media_title||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 return /(^|\b)raw(\b|$)/.test(name)||name.includes('smackdown')
}
async function ct283FirstAfterFrontier(row,show){
 const frontier=ct283Frontier(row),boundary=ct283ReleaseBoundary(show);if(!frontier||!boundary)return ct283BaseFirstReleasedUnseen(row,show);
 if(ct283Pos(frontier.s,frontier.e)>=ct283Pos(boundary.s,boundary.e))return null;
 const seasons=ct283SeasonRows(show).filter(x=>x.s>=frontier.s&&x.s<=boundary.s),today=ct283Today(),tmdbId=ct275Tmdb(row);
 for(const info of seasons){
  const start=info.s===frontier.s?frontier.e+1:1,max=info.s===boundary.s?Math.min(info.count,boundary.e):info.count;if(start>max)continue;
  const d=await ct275SeasonDataFresh(tmdbId,info.s),eps=(Array.isArray(d?.episodes)?d.episodes:[]).filter(ep=>{const en=Number(ep?.episode_number||0),air=ep?.air_date?String(ep.air_date):'';return en>=start&&en<=max&&(!air||air<=today)}).sort((a,b)=>Number(a.episode_number)-Number(b.episode_number));
  const ep=eps[0];if(ep)return{season_number:info.s,episode_number:Number(ep.episode_number||start),name:ep.name||('Episódio '+Number(ep.episode_number||start)),air_date:ep.air_date||null,vote_average:ep.vote_average??null};
  return{season_number:info.s,episode_number:start,name:'Episódio '+start,air_date:null,vote_average:null}
 }
 return null
}
ct275FirstReleasedUnseen=async function(row,show){return ct283LegacySeries(row)?ct283FirstAfterFrontier(row,show):ct283BaseFirstReleasedUnseen(row,show)};
ct275ReconcileOne=async function(row){const out=await ct283BaseReconcileOne(row);try{const t=ct275Tmdb(out),show=t>0?await ct275ShowData(t):null;if(show)ct283ApplyFreshAvailability(out,show)}catch{}return out};
ct274AvailableText=ct283AvailableText;

async function ct283ReloadHome(source='r283'){ct283AvailabilityByTmdb.clear();return ct283BaseReloadHome(source)}
ct275ReloadHome=ct283ReloadHome;try{ct274ReloadHome=ct283ReloadHome;ct273ReloadHome=ct283ReloadHome}catch{}

function ct283HistoryAction(target){return target?.closest?.('[data-ct274-rewatch],[data-ct273-history-undo]')||null}
function ct283StopActionEvent(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function ct283CaptureHistoryClick(e){
 const action=ct283HistoryAction(e.target);if(!action)return;ct283StopActionEvent(e);
 if(action.matches('[data-ct274-rewatch]'))void ct275Rewatch(action);else void ct273UndoHistory(action)
}
function ct283CaptureHistoryKey(e){
 const action=ct283HistoryAction(e.target);if(!action||(e.key!=='Enter'&&e.key!==' '))return;ct283StopActionEvent(e);
 if(action.matches('[data-ct274-rewatch]'))void ct275Rewatch(action);else void ct273UndoHistory(action)
}
window.addEventListener('click',ct283CaptureHistoryClick,true);
window.addEventListener('keydown',ct283CaptureHistoryKey,true);

window.__ctR283Test={releaseBoundary:ct283ReleaseBoundary,freshReleasedCount:ct283FreshReleasedCount,freshTotalCount:ct283FreshTotalCount,watchedReleasedCount:ct283WatchedReleasedCount,frontier:ct283Frontier,applyFreshAvailability:ct283ApplyFreshAvailability,availableText:ct283AvailableText,legacySeries:ct283LegacySeries,firstAfterFrontier:ct283FirstAfterFrontier,captureHistoryClick:ct283CaptureHistoryClick,captureHistoryKey:ct283CaptureHistoryKey,reloadHome:ct283ReloadHome,availability:ct283AvailabilityByTmdb};

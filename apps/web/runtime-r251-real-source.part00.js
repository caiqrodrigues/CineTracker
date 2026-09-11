/* CineTracker Web 1.0.42 r251 — real source ownership, no post-DOM authority. */
(()=>{
'use strict';
if(window.__ctR251)return;
window.__ctR251='real-source-ui-authority';
window.__ctR251Scope='web-only';
window.__ctR251Home='progressive-tmdb-frontier-current-release';
window.__ctR251Discover='strict-personal-rules-wwe-weekly-no-duplicates';
window.__ctR251Sports='canonical-four-tabs-source-renderer';
window.__ctR251F1='single-source-hub-six-sections-persistent-collapse';
window.__ctR251Profile='single-collapsible-statistics-source-renderer';
window.__ctR251Horizontal='local-rails-no-page-x';
window.__ctR251Detail='immediate-shell-progressive-metadata';

const ct251Num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const ct251Norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const ct251SafeDate=v=>{const d=v instanceof Date?v:new Date(v||0);return Number.isFinite(d.getTime())?d:null};
const CT251_DAY=86400000;
const CT251_WWE=/(^|\b)(wwe|world wrestling entertainment|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|nxt|summerslam|survivor series)(\b|$)/i;
const CT251_F1_TABS=[['overview','Visão geral'],['calendar','Calendário'],['next','Próximo GP'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP']];
const CT251_SPORT_TABS=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
let ct251DiscoverGeneration=0,ct251DiscoverNonce=0,ct251SportBusy=new Set(),ct251HomeMetaGeneration=0;
let ct251F1Tab='overview',ct251F1DataCache={at:0,data:null};

function ct251MediaKey(x){const type=mediaType(x);const id=Number(x?.tmdb_id??x?.id??x?.raw_tmdb?.source_tmdb_id??0)||0;return `${type}:${id}`}
function ct251Year(x){return Number(String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||0}
function ct251Score(x){for(const v of [x?.vote_average,x?.rating,x?.tmdb_rating,x?.score,x?.raw_tmdb?.vote_average]){const n=Number(v);if(Number.isFinite(n)&&n>0)return n>10?n/10:n}return 0}
function ct251GenreIds(x){return [...(x?.genre_ids||x?.raw_tmdb?.genre_ids||[])].map(Number).filter(Boolean)}
function ct251Text(x){return [x?.title,x?.name,x?.media_title,x?.original_title,x?.original_name,x?.overview,x?.raw_tmdb?.title,x?.raw_tmdb?.name,x?.raw_tmdb?.overview].filter(Boolean).join(' ')}
function ct251IsAnime(x){const ids=ct251GenreIds(x),countries=x?.origin_country||x?.raw_tmdb?.origin_country||[];return mediaType(x)==='tv'&&ids.includes(16)&&countries.map(String).includes('JP')}
function ct251EligibleRecommendation(x){
 if(!x||!mediaTmdb(x)||!mediaPoster(x))return false;
 if(CT251_WWE.test(ct251Text(x)))return false;
 const score=ct251Score(x),year=ct251Year(x),ids=ct251GenreIds(x);
 if(score<7.5||year<=1990||ids.includes(99))return false;
 if(ids.length&&ids.every(id=>id===18))return false;
 return true;
}
function ct251DirectBlocked(x){
 const s=ct251Norm(x?.manual_state||x?.user_state||x?.state||x?.override_state);
 return !!(x?.is_seen||x?.seen||x?.watched||x?.is_watched||x?.is_completed||x?.completed||x?.is_in_progress||x?.in_progress||x?.last_watched_at||x?.watched_at||x?.is_not_interested||x?.not_interested||x?.notInterested||ct251Num(x?.watched_episodes)>0||['alreadyseen','already seen','completed','inprogress','in progress','watching','notinterested','not interested'].includes(s));
}
function ct251Watchlisted(x){const s=ct251Norm(x?.manual_state||x?.user_state||x?.state||x?.override_state);return !!(x?.is_watchlist||x?.watchlist||x?.in_watchlist||x?.is_watchlisted||['addedtowatchlist','watchlater','watch later','watchlist'].includes(s))}
function ct251LocalShown(){try{const raw=JSON.parse(localStorage.getItem('ct:shown_recommendations:v1')||'[]');const since=Date.now()-7*CT251_DAY;return (Array.isArray(raw)?raw:[]).filter(x=>Number(x?.at||x?.shown_at||0)>=since)}catch(_){return[]}}
function ct251StoreLocalShown(items){try{const now=Date.now(),keep=ct251LocalShown(),map=new Map(keep.map(x=>[`${x.media_type}:${x.tmdb_id}`,x]));for(const x of items){const k=ct251MediaKey(x),[media_type,id]=k.split(':');map.set(k,{media_type,tmdb_id:Number(id),title:mediaTitle(x),at:now})}localStorage.setItem('ct:shown_recommendations:v1',JSON.stringify([...map.values()].slice(-240)))}catch(_){}}
async function ct251RecentShown(){const keys=new Set(ct251LocalShown().map(x=>`${x.media_type}:${Number(x.tmdb_id)}`));try{const rows=await rpc('cinetracker_recent_recommendations_v1',{p_days:7});for(const x of Array.isArray(rows)?rows:[])keys.add(`${x.media_type}:${Number(x.tmdb_id)}`)}catch(_){}return keys}
function ct251MarkShown(items){const unique=[...new Map(items.filter(Boolean).map(x=>[ct251MediaKey(x),x])).values()];ct251StoreLocalShown(unique);for(const x of unique)void rpc('cinetracker_mark_recommendation_shown_v1',{p_media_type:mediaType(x),p_tmdb_id:mediaTmdb(x),p_title:mediaTitle(x)}).catch(()=>{})}

/* ---------- HOME: source renderer ---------- */
function ct251EpPos(ep){if(!ep||typeof ep!=='object')return 0;const s=ct251Num(ep.season_number??ep.season??ep.s??ep.seasonNumber),e=ct251Num(ep.episode_number??ep.episode??ep.e??ep.episodeNumber);return s>0&&e>0?s*100000+e:0}
function ct251Frontier(row){const values=[
 {season_number:row?.last_season,episode_number:row?.last_episode},
 {season_number:row?.last_watched_season,episode_number:row?.last_watched_episode},
 {season_number:row?.last_seen_season,episode_number:row?.last_seen_episode},
 row?.last_watched_episode_data,row?.last_seen_episode_data,row?.progress_episode
 ];return values.reduce((m,x)=>Math.max(m,ct251EpPos(x)),0)}
function ct251Released(ep){if(!ep)return false;const raw=ep.air_date??ep.release_date??ep.released_at??ep.date;if(!raw)return true;const d=ct251SafeDate(raw),end=new Date();end.setHours(23,59,59,999);return !!d&&d.getTime()<=end.getTime()}
function ct251EpisodeCandidates(row){const list=[],seen=new Set();const add=ep=>{const p=ct251EpPos(ep);if(!p||seen.has(p)||!ct251Released(ep))return;seen.add(p);list.push(ep)};for(const k of ['_ct251TmdbLast','_ct248CurrentEpisode','current_episode','current','next_episode','last_episode_to_air','released_unwatched','next_released_unwatched'])add(row?.[k]);for(const k of ['released_unwatched_episodes','missing_episodes','episode_queue','episodes'])for(const ep of Array.isArray(row?.[k])?row[k]:[])add(ep);try{const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;if(pair){for(const k of ['current','next','episode','released_unwatched','next_released_unwatched'])add(pair?.[k]);for(const k of ['queue','missing','candidates','episodes','released_unwatched_episodes'])for(const ep of Array.isArray(pair?.[k])?pair[k]:[])add(ep)}}catch(_){}return list.sort((a,b)=>ct251EpPos(a)-ct251EpPos(b))}
function ct251NormalizeSeries(row){const frontier=ct251Frontier(row);if(!frontier)return row;const newer=ct251EpisodeCandidates(row).filter(ep=>ct251EpPos(ep)>frontier);row._ct251CurrentEpisode=newer[0]||null;row._ct251HistoricalBacklogPreserved=true;if(newer.length){row.home_bucket='continue';row.is_caught_up=false}else{row.home_bucket='up_to_date';row.is_caught_up=true}return row}
function ct251EpisodeMeta(row){const ep=row?._ct251CurrentEpisode;if(ep)return `S${String(ct251Num(ep.season_number)).padStart(2,'0')} E${String(ct251Num(ep.episode_number)).padStart(2,'0')}${ep.name?` · ${ep.name}`:''}${ep.air_date?` · ${new Date(ep.air_date+'T12:00:00').toLocaleDateString('pt-BR')}`:''}`;return row?.is_caught_up?'Em dia':`${ct251Num(row?.watched_episodes)}/${Math.max(ct251Num(row?.released_episodes),ct251Num(row?.total_episodes))||'?'} episódios`}
function ct251HomeSeriesRow(row){const id=mediaTmdb(row),p=mediaPoster(row),ep=row?._ct251CurrentEpisode,score=ct251Score(row);return `<article class="ct251-follow-card"><button type="button" class="ct251-follow-main" data-media="tv:${id}"><div class="ct251-follow-poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><div class="ct251-follow-copy"><b>${esc(mediaTitle(row))}</b><small>${esc(ct251EpisodeMeta(row))}${score?` · ★ ${score.toFixed(1)}`:''}</small></div></button>${ep&&row?.media_id?`<button type="button" class="ct251-follow-check" aria-label="Marcar episódio como visto" data-ct251-mark-episode="${Number(row.media_id)}" data-season="${ct251Num(ep.season_number)}" data-episode="${ct251Num(ep.episode_number)}" data-title="${esc(ep.name||mediaTitle(row))}" data-released="${ct251Num(row.released_episodes)}">✓</button>`:''}</article>`}
function ct251HomeMovieRow(x,meta){const score=ct251Score(x),id=mediaTmdb(x),p=mediaPoster(x);return `<article class="ct251-movie-card"><button type="button" data-media="movie:${id}"><div class="ct251-movie-poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><div><b>${esc(mediaTitle(x))}</b><small>${esc(meta||'')}${score?` · ★ ${score.toFixed(1)} · ${Math.round(s
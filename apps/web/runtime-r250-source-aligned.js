/* CineTracker Web 1.0.41 r250 — deterministic source-aligned UI authority. */
(()=>{
'use strict';
if(window.__ctR250)return;
window.__ctR250='source-aligned-deterministic-ui';
window.__ctR250Home='watched-frontier-released-newer-only';
window.__ctR250Discover='owned-tab-generation-and-personal-exclusions';
window.__ctR250Sports='canonical-payload-v1-four-tabs';
window.__ctR250F1='single-hub-persistent-user-collapse';
window.__ctR250Profile='single-merged-statistics';
window.__ctR250Horizontal='local-x-rails-page-y-only';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const DAY=86400000;
const safeDate=v=>{const d=v instanceof Date?v:new Date(v||0);return Number.isFinite(d.getTime())?d:new Date(0)};
const later=fn=>{for(const ms of [0,90,320,980,1950])setTimeout(()=>{try{fn()}catch(e){console.warn('r250 reconcile',e)}},ms)};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* HOME */
function epPos(ep){if(!ep||typeof ep!=='object')return 0;const s=num(ep.season_number??ep.season??ep.s??ep.seasonNumber),e=num(ep.episode_number??ep.episode??ep.e??ep.episodeNumber);return s>0&&e>0?s*100000+e:0}
function watchedFrontier(row,pair){
 const values=[
  {season_number:row?.last_season,episode_number:row?.last_episode},
  {season_number:row?.last_watched_season,episode_number:row?.last_watched_episode},
  {season_number:row?.last_seen_season,episode_number:row?.last_seen_episode},
  row?.last_watched_episode_data,row?.last_seen_episode_data,row?.progress_episode,
  pair?.last_watched,pair?.last_seen
 ];
 for(const x of Array.isArray(pair?.watched)?pair.watched:[])values.push(x);
 return values.reduce((m,x)=>Math.max(m,epPos(x)),0);
}
function released(ep,now=new Date()){const raw=ep?.air_date??ep?.release_date??ep?.released_at??ep?.date;if(!raw)return true;const d=safeDate(raw);const end=new Date(now);end.setHours(23,59,59,999);return d.getTime()>0&&d.getTime()<=end.getTime()}
function episodeCandidates(pair,now=new Date()){
 const out=[],seen=new Set(),add=ep=>{const p=epPos(ep);if(!p||seen.has(p)||!released(ep,now))return;seen.add(p);out.push(ep)};
 for(const k of ['current','next','episode','released_unwatched','releasedUnwatched','next_released_unwatched'])add(pair?.[k]);
 for(const k of ['queue','missing','candidates','episodes','released_unwatched_episodes','releasedUnwatchedEpisodes'])for(const ep of Array.isArray(pair?.[k])?pair[k]:[])add(ep);
 return out.sort((a,b)=>epPos(a)-epPos(b));
}
function reconcileRow250(row,pair,now=new Date()){
 if(!row||!pair)return null;const frontier=watchedFrontier(row,pair),candidates=episodeCandidates(pair,now);if(!frontier)return null;
 const newer=candidates.filter(ep=>epPos(ep)>frontier),next=newer[0]||null;
 if(row._ct250HistoricalMissingEpisodes===undefined)row._ct250HistoricalMissingEpisodes=num(row.history_missing_episodes);
 row.history_missing_episodes=newer.length;
 if(next){row.home_bucket='continue';row.is_caught_up=false;row._ctHomeForceContinue=true;row._ctHomeState='continue';row._ct250CurrentEpisode=next;row._ct248CurrentEpisode=next;delete row._ct250HistoricalBacklogPreserved}
 else{row.home_bucket='caught_up';row.is_caught_up=true;row._ctHomeForceContinue=false;row._ctHomeState='caught_up';row._ct250CurrentEpisode=null;row._ct250HistoricalBacklogPreserved=true}
 try{if(typeof route==='function'&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint()}catch(_){}
 return {frontier,candidates,newer,next,state:next?'continue':'caught_up'};
}
window.__ctR250EpisodeCandidates=episodeCandidates;
window.__ctR250ReconcileRow=reconcileRow250;
window.__ctR248ReconcileFollowing=reconcileRow250;
function reconcileHomeState(){
 try{for(const row of homeCache?.series||[]){const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;if(pair)reconcileRow250(row,pair)}}catch(_){}
}
function homeMediaRows(){try{return [...(homeCache?.movies||homeCache?.films||[]),...(homeCache?.series||[])]}catch(_){return[]}}
function mediaId(x){return num(x?.media_id??x?.mediaId??x?.tmdb_id??x?.tmdbId??x?.id)}
function ratingOf(x){for(const v of [x?.vote_average,x?.rating,x?.tmdb_rating,x?.score,x?.raw_tmdb?.vote_average]){const n=num(v);if(n>0)return n>10?n/10:n}return 0}
function decorateHome(){
 const root=q('[data-home],#p-home,[data-page="home"]');if(!root)return;const rows=homeMediaRows();
 for(const card of qa('.thumbCard,.media-card,.home-card,[data-media-id],[data-tmdb-id]',root)){
  card.classList.add('ct250-home-card');const id=num(card.dataset?.mediaId||card.dataset?.tmdbId||card.dataset?.id);const row=rows.find(x=>mediaId(x)===id);const rating=ratingOf(row||card.dataset||{});if(!rating)continue;
  const pct=Math.round(rating*10),text=`★ ${rating.toFixed(1)} · ${pct}%`;let badge=q('.ct250-rating',card);if(!badge){badge=document.createElement('span');badge.className='ct250-rating';const host=q('.homeMeta,.meta,small,.card-meta',card)||card;host.appendChild(badge)}badge.textContent=text;
 }
}

/* DISCOVER */
const DISC_TAG=Symbol('ct250Discover');let discoverSeq=0;
function discoverSnapshot(){let tab='foryou',type='all';try{tab=String(discoverState?.tab||tab);type=String(discoverState?.type||type)}catch(_){}return{tab,type}}
function dKey(x){let type=norm(x?.media_type||x?.type||x?.content_type);type=type.includes('movie')||type==='filme'?'movie':'tv';const id=num(x?.tmdb_id??x?.media_id??x?.id??x?.raw_tmdb?.source_tmdb_id);const title=norm(x?.title||x?.name||x?.media_title||x?.original_title||x?.original_name);return{type,id,title}}
function directBlocked(x){const s=norm(x?.manual_state||x?.user_state||x?.state||x?.override_state);return !!(x?.is_watched||x?.watched||x?.seen||x?.is_seen||x?.in_progress||x?.is_in_progress||x?.watchlist||x?.in_watchlist||x?.is_watchlisted||x?.is_not_interested||x?.not_interested||x?.notInterested||num(x?.watch_count||x?.play_count)>0||['alreadyseen','already seen','completed','inprogress','in progress','watching','watchlater','watch later','watchlist','notinterested','not interested'].includes(s))}
async function exclusionSets(){
 const ids={movie:new Set(),tv:new Set()},titles={movie:new Set(),tv:new Set()};let ctx=null;
 try{if(typeof exclusionContext==='function')ctx=await exclusionContext();else if(typeof exclusionContext158==='function')ctx=await exclusionContext158()}catch(_){}
 const add=x=>{const k=dKey(x);if(k.id)ids[k.type].add(k.id);if(k.title)titles[k.type].add(k.title)};
 for(const [name,value] of Object.entries(ctx||{})){if(!Array.isArray(value))continue;const authoritative=/(dash|watch|history|seen|progress|library|state|override|not.?interested)/i.test(name);for(const x of value)if(authoritative||directBlocked(x))add(x)}
 return{ids,titles};
}
async function filterDiscover(rows,tab){
 if(!Array.isArray(rows)||tab==='calendar')return Array.isArray(rows)?rows:[];const sets=await exclusionSets();
 return rows.filter(x=>{if(!x||directBlocked(x))return false;const k=dKey(x);return !((k.id&&sets.ids[k.type].has(k.id))||(k.title&&sets.titles[k.type].has(k.title)))});
}
function discoverRoot(){return q('[data-discover],#p-discover,[data-page="discover"]')}
function cleanDiscover(){const root=discoverRoot();if(!root)return;for(const el of qa('.card,.media-card,.discover-card,.foryou-card,.ct166-slot,.foryou-slot',root))if(norm(el.textContent)==='sem item elegivel')el.remove();for(const rail of qa('.rail,.cards-row,.discover-rail,.foryou-grid,[data-discover-rail]',root))rail.classList.add('ct250-xrail');for(const card of qa('.card,.media-card,.discover-card,.foryou-card,[data-media-id],[data-tmdb-id]',root))card.classList.add('ct250-discover-card')}
async function contentOnly250(){
 const root=discoverRoot();if(!root||typeof discoverRows!=='function'||typeof paintDiscover!=='function')return false;const snap=discoverSnapshot(),seq=++discoverSeq;root.dataset.ct250Authority='1';root.setAttribute('aria-busy','true');
 for(const b of qa('[data-discover-tab]',root))b.classList.toggle('active',String(b.dataset.discoverTab)===snap.tab);for(const b of qa('[data-discover-type]',root))b.classList.toggle('active',String(b.dataset.discoverType)===snap.type);
 try{let rows=await discoverRows(snap.tab);rows=await filterDiscover(rows,snap.tab);try{Object.defineProperty(rows,DISC_TAG,{value:{seq,...snap}})}catch(_){}const cur=discoverSnapshot();if(seq!==discoverSeq||cur.tab!==snap.tab||cur.type!==snap.type){window.__ctR250DiscoverDropped=(window.__ctR250DiscoverDropped||0)+1;return true}paintDiscover(rows);cleanDiscover();return true}
 catch(e){console.warn('r250 Discover',e);return true}finally{if(seq===discoverSeq)root.removeAttribute('aria-busy')}
}
window.__ctR250DiscoverContentOnly=contentOnly250;
document.addEventListener('click',e=>{const root=discoverRoot();if(!root)return;const tab=e.target?.closest?.('[data-discover-tab]'),type=e.target?.closest?.('[data-discover-type]');if(!tab&&!type)return;e.preventDefault();e.stopPropagation();try{if(tab)discoverState.tab=String(tab.dataset.discoverTab||'foryou');if(type)discoverState.type=String(type.dataset.discoverType||'all');discoverState.page=0}catch(_){};void contentOnly250()},true);
try{if(typeof renderDiscover==='function'){const legacy=renderDiscover;renderDiscover=async function(){if(discoverRoot())return contentOnly250();return legacy.apply(this,arguments)}}}catch(_){}

/* SPORTS */
const SPORT_TABS=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];let sportCache={at:0,payload:null},watchBusy=new Set();
const eventDate=e=>safeDate(e?.starts_at||e?.start_time||e?.start_at||e?.datetime||e?.event_date||e?.date||e?.utc_date);
const dayStart=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();
const favorite=e=>!!(e?.has_favorite||e?.favorite||e?.is_favorite||e?.team_favorite||e?.home_favorite||e?.away_favorite);
const watched=e=>!!(e?.is_watched||e?.watched||e?.seen||e?.viewed||e?.sport_watched_at||e?.watched_at||num(e?.watch_count||e?.play_count)>0);
function sportMode(){try{const x=String(sportsState?.tab||window.__ctR250SportMode||'next');return SPORT_TABS.some(([k])=>k===x)?x:'next'}catch(_){return'next'}}
function setSportMode(mode){if(!SPORT_TABS.some(([k])=>k===mode))mode='next';window.__ctR250SportMode=mode;try{sportsState.tab=mode;sportsState.page=0}catch(_){}return mode}
function sportFilter250(events,mode=sportMode(),now=new Date()){
 const list=[...(events||[])],today=dayStart(now);
 if(mode==='previous')return list.filter(e=>{const age=Math.round((today-dayStart(eventDate(e)))/DAY);return age>=1&&age<=3}).sort((a,b)=>eventDate(b)-eventDate(a));
 if(mode==='favorites')return list.filter(favorite).sort((a,b)=>eventDate(a)-eventDate(b));
 if(mode==='watched')return list.filter(watched).sort((a,b)=>eventDate(b)-eventDate(a));
 const tomorrow=today+DAY;return list.filter(e=>{const ms=eventDate(e).getTime();return ms>=now.getTime()&&ms<tomorrow&&dayStart(eventDate(e))===today}).sort((a,b)=>eventDate(a)-eventDate(b));
}
window.__ctR250SportFilter=sportFilter250;
function uniqueEvents(rows){const out=[],seen=new Set();for(const e of rows||[]){const key=String(e?.id??e?.event_id??`${e?.provider||''}|${e?.provider_event_id||''}|${e?.starts_at||''}|${e?.title||''}`);if(seen.has(key))continue;seen.add(key);out.push(e)}return out}
async function sportsCanonical(force=false){
 if(!force&&sportCache.payload&&Date.now()-sportCache.at<60000)return sportCache.payload;if(typeof rpc!=='function')return{events:[],watch_history:[]};const now=new Date(),from=new Date(now);from.setDate(from.getDate()-3);from.setHours(0,0,0,0);const to=new Date(now);to.setDate(to.getDate()+45);to.setHours(23,59,59,999);
 const payload=await rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()});sportCache={at:Date.now(),payload:payload&&typeof payload==='object'?payload:{events:[],watch_history:[]}};return sportCache.payload;
}
async function allSportsRows(force=false){const p=await sportsCanonical(force);return uniqueEvents([...(Array.isArray(p?.events)?p.events:[]),...(Array.isArray(p?.watch_history)?p.watch_history:[])])}
window.__ctR250SportsRows=allSportsRows;window.__ctR249SportsRows=allSportsRows;
try{if(typeof sportsPayload==='function')sportsPayload=async function(){return sportFilter250(await allSportsRows(),sportMode(),new Date())}}catch(_){}
function sportsRoot(){return q('#p-sports,[data-page="sports"],[data-sports]')}
function eventIdFromCard(card){return num(card?.dataset?.eventId||card?.dataset?.sportEventId||card?.dataset?.id)}
async function bindSportCards(root){let rows=[];try{rows=await allSportsRows()}catch(_){}for(const card of qa('.event-card,.sport-event,.event-grid > *,[data-sport-event]',root)){let id=eventIdFromCard(card);if(!id){const text=norm(card.textContent),hit=rows.find(e=>{const bits=[e?.title,e?.home_name,e?.away_name,e?.competition_name].map(norm).filter(Boolean);return bits.some(x=>x.length>3&&text.includes(x))});id=num(hit?.id||hit?.event_id);if(id)card.dataset.eventId=String(id)}for(const b of qa('button,[role="button"]',card))if(/assistido|visto|desmarcar/.test(norm(b.textContent)))b.classList.add('ct250-watch-btn')}}
function reconcileSports(){
 const root=sportsRoot();if(!root)return;root.dataset.ct250Authority='1';const mode=setSportMode(sportMode());for(const old of qa('.ct247-sport-tabs,.ct248-sports-tabs,.ct249-sports-tabs',root))old.remove();let bar=q('.ct250-sports-tabs',root);if(!bar){bar=document.createElement('div');bar.className='ct250-sports-tabs ct250-xrail';root.insertBefore(bar,root.firstChild)}bar.innerHTML=SPORT_TABS.map(([k,l])=>`<button type="button" class="pill ${mode===k?'active':''}" data-ct250-sport-tab="${k}">${l}</button>`).join('');
 for(const b of qa('[data-ct250-sport-tab]',bar))b.onclick=()=>{setSportMode(String(b.dataset.ct250SportTab));void renderSports?.()};for(const b of qa('button,a,[role="button"]',root))if(['eventos','agenda','ver eventos','ver agenda'].includes(norm(b.textContent)))b.remove();void bindSportCards(root)
}
document.addEventListener('click',e=>{const tab=e.target?.closest?.('[data-ct250-sport-tab]');if(tab){e.preventDefault();e.stopPropagation();setSportMode(String(tab.dataset.ct250SportTab||'next'));void renderSports?.();later(reconcileSports);return}const btn=e.target?.closest?.('.ct250-watch-btn');if(!btn)return;const card=btn.closest('.event-card,.sport-event,.event-grid > *,[data-sport-event]'),id=eventIdFromCard(card);if(!id||watchBusy.has(id)||typeof rpc!=='function')return;e.preventDefault();e.stopPropagation();watchBusy.add(id);btn.classList.remove('ct250-watch-pop');void btn.offsetWidth;btn.classList.add('ct250-watch-pop');const unwatch=/desmarcar/.test(norm(btn.textContent))||card?.dataset?.watched==='1';void rpc('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:!unwatch,p_duration_minutes:null,p_watched_at:new Date().toISOString()}).then(()=>{sportCache.at=0;card.dataset.watched=unwatch?'0':'1';document.dispatchEvent(new Event('cinetracker:data-changed'));return renderSports?.()}).catch(err=>console.warn('r250 sport watched',err)).finally(()=>{watchBusy.delete(id);setTimeout(()=>btn.classList.remove('ct250-watch-pop'),430)})},true);
try{if(typeof renderSports==='function'){const legacy=renderSports;renderSports=async function(){const out=await legacy.apply(this,arguments);requestAnimationFrame(reconcileSports);return out}}}catch(_){}

/* F1 */
const F1_KEY='ct:f1hub:collapsed:r250',F1_KEYS=['ct:f1hub:collapsed:r249','ct:f1hub:collapsed:r248'];
function f1Stored(){try{let v=localStorage.getItem(F1_KEY);if(v!==null)return v;for(const k of F1_KEYS){v=localStorage.getItem(k);if(v!==null)return v}}catch(_){}return'0'}
function setF1Stored(collapsed){try{localStorage.setItem(F1_KEY,collapsed?'1':'0');for(const k of F1_KEYS)localStorage.setItem(k,collapsed?'1':'0')}catch(_){}}
function f1Hubs(){return qa('.ct248-f1hub,.ct249-f1hub,.ct250-f1hub,[data-f1-hub],[data-ct236-f1-card]').filter((x,i,a)=>!a.some(y=>y!==x&&y.contains(x)))}
function reconcileF1(){const hubs=f1Hubs();if(!hubs.length)return;const canonical=hubs.find(h=>h.classList.contains('ct248-f1hub'))||hubs[0];canonical.classList.add('ct250-f1hub');for(const h of hubs)if(h!==canonical)h.remove();const collapsed=f1Stored()==='1';canonical.classList.toggle('collapsed',collapsed);canonical.dataset.ct250F1=collapsed?'collapsed':'open';const body=q('.ct248-f1body,.ct249-f1body,.ct250-f1body,[data-f1-body]',canonical);if(body)body.hidden=collapsed;const b=q('[data-ct248-f1collapse],[data-ct249-f1collapse],[data-ct250-f1collapse]',canonical);if(b){b.dataset.ct250F1collapse='1';b.setAttribute('aria-expanded',String(!collapsed));b.setAttribute('aria-label',collapsed?'Expandir F1 Hub':'Minimizar F1 Hub');b.textContent=collapsed?'Expandir':'Minimizar'}}
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct250-f1collapse],[data-ct248-f1collapse],[data-ct249-f1collapse]');if(!b)return;const hub=b.closest('.ct250-f1hub,.ct248-f1hub,.ct249-f1hub,[data-f1-hub]');if(!hub)return;e.preventDefault();e.stopPropagation();const body=q('.ct248-f1body,.ct249-f1body,.ct250-f1body,[data-f1-body]',hub),collapsed=body?!body.hidden:!hub.classList.contains('collapsed');setF1Stored(collapsed);reconcileF1()},true);

/* PROFILE */
function panelTitle(panel){return norm(q(':scope > .panel-head h1,:scope > .panel-head h2,:scope > .panel-head h3,:scope > h1,:scope > h2,:scope > h3',panel)?.textContent||'')}
function reconcileProfile(){const root=q('#p-profile,[data-page="profile"],[data-profile]');if(!root)return;const panels=qa('section.panel,.panel,.profile-section',root),main=panels.find(p=>panelTitle(p)==='estatisticas')||q('[data-profile-statistics]',root);if(!main)return;const grid=q('.ct248-profile-grid,.ct247-profile-grid,.ct-r180-stats-grid,.stats,[data-stats-grid]',main)||main;grid.classList.add('ct250-profile-grid');for(const panel of panels.filter(p=>['estatisticas de esporte','estatisticas de esportes','estatistica de esporte','estatistica de esportes'].includes(panelTitle(p)))){for(const stat of qa('.stat,[data-stat]',panel)){stat.classList.add('ct250-sport-stat');grid.appendChild(stat)}panel.remove()}for(const box of qa('.ct-r247-sports-stats,.ct247-sports-stats,[data-separate-sports-stats]',root)){if(main.contains(box))continue;for(const stat of qa('.stat,[data-stat]',box)){stat.classList.add('ct250-sport-stat');grid.appendChild(stat)}box.remove()}root.dataset.ct250Profile='single-statistics'}

/* LOCAL HORIZONTAL OVERFLOW */
const XSEL='.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.seasons,.season-tabs,.episodes-chart,.episode-chart,.related,.similar,.rail,.cards-row,.discover-rail,.ct248-f1rail,.ct248-f1table,[data-horizontal-scroll],[data-seasons],[data-related],[data-similar],[data-episode-chart]';
function reconcileHorizontal(){for(const el of qa(XSEL))if(!el.matches('html,body,#app'))el.classList.add('ct250-xrail')}
function reconcileAll(){reconcileHomeState();decorateHome();cleanDiscover();reconcileSports();reconcileF1();reconcileProfile();reconcileHorizontal()}
window.__ctR250Reconcile=reconcileAll;
window.addEventListener('pageshow',()=>later(reconcileAll));
document.addEventListener('cinetracker:data-changed',()=>later(reconcileAll));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)later(reconcileAll)});
later(reconcileAll);
})();

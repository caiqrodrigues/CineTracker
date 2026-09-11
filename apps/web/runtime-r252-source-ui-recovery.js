/* CineTracker Web 1.0.43 r252 — restore approved source UI, patch logic only. */
(()=>{
'use strict';
if(window.__ctR252)return;
window.__ctR252='source-ui-recovery-logic-only';
window.__ctR252UI='r248-native-structure-preserved';
window.__ctR252Home='native-home+30-day-dust+recent-release-priority+legacy-frontier';
window.__ctR252Discover='native-cards+strict-three-block-rules+seven-day-history';
window.__ctR252Sports='r248-four-tabs+canonical-payload';
window.__ctR252F1='r248-dark-six-tab-hub';
window.__ctR252Profile='r248-established-stat-order';
window.__ctR252Configs='immediate-shell-background-profile';

const DAY=86400000, RECENT_DAYS=30, SHOWN_KEY='ct:shown_recommendations:v1';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const safeDate=v=>{const d=v instanceof Date?v:new Date(v||0);return Number.isFinite(d.getTime())?d:null};
const mediaType=x=>(x?.media_type==='movie'||x?.type==='movie')?'movie':'tv';
const mediaId=x=>n(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id);
const mediaTitle=x=>x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const mediaPoster=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const mediaScore=x=>n(x?.vote_average??x?.raw_tmdb?.vote_average);
const mediaDate=x=>String(mediaType(x)==='movie'?(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||''):(x?.first_air_date||x?.raw_tmdb?.first_air_date||x?.release_year||''));
const mediaYear=x=>n(mediaDate(x).slice(0,4));
const mediaGenres=x=>[...(x?.genre_ids||x?.raw_tmdb?.genre_ids||[])].map(Number).filter(Boolean);
const mediaKey=x=>`${mediaType(x)}:${mediaId(x)}`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* HOME — classify data before the existing Home painter. No Home HTML is replaced here. */
function epPos(ep){if(!ep||typeof ep!=='object')return 0;const s=n(ep.season_number??ep.season??ep.s??ep.seasonNumber),e=n(ep.episode_number??ep.episode??ep.e??ep.episodeNumber);return s>0&&e>0?s*100000+e:0}
function frontier(row){
 try{if(typeof window.__ctR248Frontier==='function')return n(window.__ctR248Frontier(row))}catch(_){}
 return Math.max(
  n(row?.last_season)*100000+n(row?.last_episode),
  n(row?.last_watched_season)*100000+n(row?.last_watched_episode),
  n(row?.last_seen_season)*100000+n(row?.last_seen_episode),
  epPos(row?.last_watched_episode_data),epPos(row?.last_seen_episode_data),epPos(row?.progress_episode)
 );
}
function watchedCount(row){return Math.max(n(row?.watched_episodes),n(row?.episodes_watched),n(row?.watch_count),frontier(row)>0?1:0)}
function lastWatchedAt(row){for(const v of [row?.last_watched_at,row?.last_seen_at,row?.last_episode_watched_at,row?.progress_updated_at,row?.updated_at]){const d=safeDate(v);if(d)return d}return null}
function isLegacySeries(row){const t=norm([row?.title,row?.name,row?.media_title,row?.original_name].filter(Boolean).join(' '));return /(^| )wwe( |$)/.test(t)||t.includes('monday night raw')||t.includes('friday night smackdown')||t==='raw'||t==='smackdown'||t.includes('formula 1')||t.includes('formula one')||/(^| )f1( |$)/.test(t)||t.includes('super bowl')}
function episodeCandidates(pair,now=new Date()){
 const seen=new Set(),out=[],end=new Date(now);end.setHours(23,59,59,999);
 const add=ep=>{const p=epPos(ep);if(!p||seen.has(p))return;const d=safeDate(ep?.air_date??ep?.release_date??ep?.date??ep?.released_at);if(d&&d.getTime()>end.getTime())return;seen.add(p);out.push(ep)};
 if(pair){for(const k of ['current','next','episode','released_unwatched','releasedUnwatched','next_released_unwatched'])add(pair[k]);for(const k of ['queue','missing','candidates','episodes','released_unwatched_episodes','releasedUnwatchedEpisodes'])for(const ep of Array.isArray(pair[k])?pair[k]:[])add(ep)}
 return out.sort((a,b)=>epPos(a)-epPos(b));
}
function recentEpisode(ep,now=new Date()){const d=safeDate(ep?.air_date??ep?.release_date??ep?.date??ep?.released_at);return !d||now.getTime()-d.getTime()<=RECENT_DAYS*DAY}
function bucket(row,state,ep=null){
 if(state==='continue'){row.home_bucket='continue';row.is_caught_up=false;row._ctHomeForceContinue=true;row._ct252CurrentEpisode=ep||null}
 else if(state==='dust'){row.home_bucket='dust';row.is_caught_up=false;row._ctHomeForceContinue=false}
 else if(state==='not_started'){row.home_bucket='not_started';row.is_caught_up=false;row._ctHomeForceContinue=false}
 else if(state==='completed'){row.home_bucket='completed';row.is_caught_up=true;row._ctHomeForceContinue=false}
 else {row.home_bucket='up_to_date';row.is_caught_up=true;row._ctHomeForceContinue=false}
 row._ctHomeState=state;row._ct252State=state;return state;
}
function classifySeries(row,pair,now=new Date()){
 if(!row)return null;
 const explicitCompleted=!!(row?.is_completed||row?.completed||row?.home_bucket==='completed');if(explicitCompleted)return bucket(row,'completed');
 const f=frontier(row),started=watchedCount(row)>0||f>0||!!row?.is_started;
 if(!started)return bucket(row,'not_started');
 const candidates=episodeCandidates(pair,now),newer=candidates.filter(ep=>epPos(ep)>f),recentNew=newer.find(ep=>recentEpisode(ep,now));
 if(recentNew)return bucket(row,'continue',recentNew);
 if(isLegacySeries(row))return bucket(row,'up_to_date');
 const last=lastWatchedAt(row);if(last&&now.getTime()-last.getTime()>=RECENT_DAYS*DAY)return bucket(row,'dust');
 if(!last&&row?.home_bucket==='dust')return bucket(row,'dust');
 if(candidates.length&&f>0&&!newer.length)return bucket(row,'up_to_date');
 return bucket(row,'up_to_date');
}
function pairFor(row){try{return typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):row?._pair||null}catch(_){return row?._pair||null}}
function reconcileHome252(){try{for(const row of homeCache?.series||[])classifySeries(row,pairFor(row),new Date())}catch(_){} }
try{if(typeof ct176SetQueue==='function'){const base=ct176SetQueue;ct176SetQueue=function(mediaId,queue){const pair=base.apply(this,arguments);try{const row=(homeCache?.series||[]).find(x=>n(x?.media_id||x?.mediaId)===n(mediaId));if(row)classifySeries(row,pair||{queue},new Date())}catch(_){}return pair}}}catch(_){}
try{if(typeof paintHome==='function'){const base=paintHome;paintHome=function(){reconcileHome252();return base.apply(this,arguments)}}}catch(_){}
window.__ctR252ClassifySeries=classifySeries;window.__ctR252LegacySeries=isLegacySeries;

/* SPORTS bridge — canonical payload for the r248 Home sports-series helper. */
let sports252={at:0,rows:[],promise:null};
function uniqueEvents(p){const rows=[...(Array.isArray(p?.events)?p.events:[]),...(Array.isArray(p?.watch_history)?p.watch_history:[])],out=[],seen=new Set();for(const e of rows){const k=String(e?.id??e?.event_id??`${e?.provider||''}|${e?.provider_event_id||''}|${e?.starts_at||''}|${e?.title||''}`);if(seen.has(k))continue;seen.add(k);out.push(e)}return out}
window.__ctR252SportsEvents=async function(force=false){if(!force&&sports252.at&&Date.now()-sports252.at<90000)return sports252.rows;if(sports252.promise)return sports252.promise;const now=new Date(),from=new Date(now.getTime()-7*DAY),to=new Date(now.getTime()+370*DAY);sports252.promise=(typeof rpc==='function'?rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()}):Promise.resolve({})).then(uniqueEvents).catch(()=>sports252.rows).then(rows=>{sports252.at=Date.now();sports252.rows=rows;return rows}).finally(()=>{sports252.promise=null});return sports252.promise};

/* DISCOVER — strict rules with native .panel/.row/.card markup and native mediaCard(). */
const WWE=/\b(wwe|wrestlemania|royal rumble|smackdown|monday night raw|friday night raw|nxt|summer ?slam|survivor series|money in the bank|elimination chamber|backlash|clash at the castle|crown jewel)\b/i;
function isWwe(x){return WWE.test(norm([mediaTitle(x),x?.original_title,x?.original_name,x?.overview].filter(Boolean).join(' ')))}
function notInterested(x){const s=norm(x?.manual_state||x?.user_state||x?.state||x?.override_state);return !!(x?.is_not_interested||x?.not_interested||x?.notInterested||s==='notinterested'||s==='not interested'||s==='not_interested')}
function pureDramaDocumentary(x){const g=mediaGenres(x);return g.length>0&&g.every(id=>id===18||id===99)}
function eligiblePublic(x){return !!(mediaId(x)&&mediaPoster(x)&&mediaScore(x)>=7.5&&mediaYear(x)>1990&&!pureDramaDocumentary(x)&&!isWwe(x)&&!notInterested(x))}
function isAnime(x){const g=mediaGenres(x),country=x?.origin_country||x?.raw_tmdb?.origin_country||[],lang=x?.original_language||x?.raw_tmdb?.original_language;return mediaType(x)==='tv'&&(g.includes(16)||country.includes?.('JP')||lang==='ja')}
function knownSets(dash){const seen=new Set(),watch=new Set(),blocked=new Set();for(const x of dash||[]){const k=mediaKey(x);if(k.endsWith(':0'))continue;if(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n(x?.watched_episodes)>0||x?.last_watched_at)seen.add(k);if(x?.is_watchlist||x?.watchlist||x?.watch_later||x?.added_to_watchlist)watch.add(k);if(notInterested(x))blocked.add(k)}return{seen,watch,blocked}}
function readLocalShown(){try{const a=JSON.parse(localStorage.getItem(SHOWN_KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
function pruneShown(rows){const cut=Date.now()-7*DAY;return(rows||[]).filter(x=>safeDate(x?.shown_at)?.getTime()>=cut)}
async function shown7d(){const local=pruneShown(readLocalShown());let remote=[];try{if(typeof api==='function'){const since=new Date(Date.now()-7*DAY).toISOString();remote=await api(`shown_recommendations?select=media_type,tmdb_id,title,shown_at&shown_at=gte.${encodeURIComponent(since)}&order=shown_at.desc&limit=500`)||[]}}catch(_){}const rows=pruneShown([...local,...remote]);return new Set(rows.map(x=>`${x.media_type==='movie'?'movie':'tv'}:${n(x.tmdb_id)}`))}
async function recordShown(items){const at=new Date().toISOString(),rows=(items||[]).filter(Boolean).map(x=>({media_type:mediaType(x),tmdb_id:mediaId(x),title:mediaTitle(x),shown_at:at})).filter(x=>x.tmdb_id);if(!rows.length)return;try{localStorage.setItem(SHOWN_KEY,JSON.stringify(pruneShown([...readLocalShown(),...rows]).slice(-500)))}catch(_){}try{if(typeof api==='function'&&user?.id)await api('shown_recommendations?on_conflict=user_id,media_type,tmdb_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(rows.map(x=>({...x,user_id:user.id})))})}catch(_){} }
function firstPick(rows,pred,used,shown){for(const x of rows||[]){const k=mediaKey(x);if(!eligiblePublic(x)||used.has(k)||shown.has(k)||!pred(x))continue;used.add(k);return x}return null}
async function dashboard252(){try{return typeof rpc==='function'?await rpc('cinetracker_profile_media_dashboard_v0991',{})||[]:[]}catch{return[]}}
async function discoverPool252(){
 const now=new Date(),lo=new Date(now.getTime()-30*DAY),today=typeof localDay==='function'?localDay(now):now.toISOString().slice(0,10),loDay=typeof localDay==='function'?localDay(lo):lo.toISOString().slice(0,10);
 const p=typeof pages==='function'?pages:null;if(!p)return{movies:[],tv:[],anime:[],newRows:[]};
 const [movies,tv,anime,newM,newT]=await Promise.all([
  p('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,include_adult:false},'movie',5),
  p('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,include_adult:false},'tv',5),
  p('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':60},'tv',5),
  p('/discover/movie',{'primary_release_date.gte':loDay,'primary_release_date.lte':today,sort_by:'primary_release_date.desc'},'movie',4),
  p('/discover/tv',{'first_air_date.gte':loDay,'first_air_date.lte':today,sort_by:'first_air_date.desc'},'tv',4)
 ]);
 return{movies,tv,anime,newRows:[...newM,...newT]};
}
async function buildForYou252(){
 const[dash,pool,shown]=await Promise.all([dashboard252(),discoverPool252(),shown7d()]),known=knownSets(dash),used=new Set();
 const publicOk=x=>!known.seen.has(mediaKey(x))&&!known.watch.has(mediaKey(x))&&!known.blocked.has(mediaKey(x));
 const daily=firstPick(pool.movies,x=>publicOk(x),used,shown);
 const watchRows=(dash||[]).filter(x=>known.watch.has(mediaKey(x))&&!known.seen.has(mediaKey(x))&&!known.blocked.has(mediaKey(x))&&eligiblePublic(x));
 const watchMovie=firstPick(watchRows,x=>mediaType(x)==='movie',used,shown),watchSeries=firstPick(watchRows,x=>mediaType(x)==='tv'&&!isAnime(x),used,shown),watchAnime=firstPick(watchRows,isAnime,used,shown);
 const fresh=(pool.newRows||[]).filter(publicOk),freshMovie=firstPick(fresh,x=>mediaType(x)==='movie',used,shown),freshSeries=firstPick(fresh,x=>mediaType(x)==='tv'&&!isAnime(x),used,shown),freshAnime=firstPick(fresh,x=>isAnime(x)&&publicOk(x),used,shown);
 const result={__ctR252ForYou:true,daily:[daily].filter(Boolean),watchlist:[watchMovie,watchSeries,watchAnime].filter(Boolean),fresh:[freshMovie,freshSeries,freshAnime].filter(Boolean)};
 await recordShown([...result.daily,...result.watchlist,...result.fresh]);return result;
}
function nativeCard(x){try{return typeof mediaCard==='function'?mediaCard(x):''}catch{return''}}
function block252(title,rows,refresh=false){return `<section class="panel"><div class="panel-head"><h2>${esc(title)}</h2>${refresh?'<button type="button" class="chip" data-ct252-refresh>Trocar</button>':`<small>${rows.length}</small>`}</div><div class="row">${rows.map(nativeCard).join('')||'<div class="empty">Sem item elegível no momento.</div>'}</div></section>`}
function paintForYou252(data){const h=q('[data-discover-content]');if(!h)return;h.innerHTML=`<div class="page" data-ct252-foryou>${block252('Indicação do Dia',data.daily||[],true)}${block252('Da sua Watchlist',data.watchlist||[])}${block252('100% Novos',data.fresh||[])}</div>`;try{window.__ctR248StabilizeDiscover?.()}catch(_){} }
function ensureDiscoverTabs252(){const root=q('[data-discover],#p-discover,[data-page="discover"]'),bar=q('.tabs',root);if(!bar)return;const add=(key,label,beforeKey)=>{if(q(`[data-discover-tab="${key}"]`,bar))return;const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.discoverTab=key;b.textContent=label;const before=beforeKey?q(`[data-discover-tab="${beforeKey}"]`,bar):null;before?bar.insertBefore(b,before):bar.appendChild(b)};add('top10','Top 10','trending');add('releases','Lançamentos','anticipated')}
let baseDiscoverRows252=null,basePaintDiscover252=null;
try{if(typeof discoverRows==='function'){baseDiscoverRows252=discoverRows;discoverRows=async function(tab,...rest){
 if(tab==='foryou')return buildForYou252();
 const rows=await baseDiscoverRows252.call(this,tab,...rest);if(tab==='calendar')return rows;
 if(Array.isArray(rows)&&rows.length)return rows.filter(eligiblePublic);
 if(tab==='top10'&&typeof safeTmdb==='function'){const d=await safeTmdb('/trending/all/day');return(d?.results||[]).filter(x=>['movie','tv'].includes(x.media_type)).filter(eligiblePublic).slice(0,10)}
 if(tab==='releases'&&typeof pages==='function'){const lo=new Date(Date.now()-7*DAY),hi=new Date(Date.now()+30*DAY),ld=lo.toISOString().slice(0,10),hd=hi.toISOString().slice(0,10);const[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':ld,'primary_release_date.lte':hd,sort_by:'primary_release_date.asc'},'movie',4),pages('/discover/tv',{'first_air_date.gte':ld,'first_air_date.lte':hd,sort_by:'first_air_date.asc'},'tv',4)]);return[...m,...t].filter(eligiblePublic)}
 return Array.isArray(rows)?rows.filter(eligiblePublic):rows;
 }}}catch(_){}
try{if(typeof paintDiscover==='function'){basePaintDiscover252=paintDiscover;paintDiscover=function(rows){ensureDiscoverTabs252();if(rows?.__ctR252ForYou)return paintForYou252(rows);return basePaintDiscover252.apply(this,arguments)}}}catch(_){}
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct252-refresh]');if(!b)return;e.preventDefault();e.stopPropagation();void(async()=>{try{const data=await buildForYou252();if(typeof discoverState==='object')discoverState.tab='foryou';paintForYou252(data)}catch(err){console.warn('r252 refresh',err)}})()},true);
window.__ctR252EligibleRecommendation=eligiblePublic;window.__ctR252IsWwe=isWwe;window.__ctR252BuildForYou=buildForYou252;

/* CONFIGS — same established markup, rendered immediately; optional profile name fills later. */
try{if(typeof renderConfigs==='function')renderConfigs=async function(seq){
 const body=`<div class="page" data-configs><div class="settings-grid"><section class="panel"><div class="panel-head"><h2>Conta e preferências</h2><span class="badge">SINCRONIZADO</span></div><div class="form-grid"><div class="field"><label>E-mail</label><input value="${esc(user?.email||'')}" disabled></div><div class="field"><label>Fuso horário</label><input value="${esc(typeof tz==='function'?tz():'America/Sao_Paulo')}" disabled></div><div class="field"><label>Idioma</label><select data-lang><option value="pt-BR" ${localStorage.getItem('cinetracker_locale')!=='en-US'?'selected':''}>Português (BR)</option><option value="en-US" ${localStorage.getItem('cinetracker_locale')==='en-US'?'selected':''}>English</option></select></div><div class="field"><label>Perfil</label><input data-ct252-profile-name value="${esc(user?.user_metadata?.display_name||'')}" disabled></div></div><div class="actions" style="margin-top:10px"><button class="btn" data-save-prefs>Salvar preferências</button></div></section><section class="panel"><div class="panel-head"><h2>Manutenção e sincronização</h2><span class="badge">WEB</span></div><div class="actions"><button class="btn" data-clear-cache>Limpar Cache</button><button class="btn" data-refresh-metadata>Atualizar metadados</button></div><div class="notice" style="margin-top:10px">O cache limpo não apaga histórico, Watchlist ou progresso do Supabase.</div></section></div><section class="panel"><div class="panel-head"><h2>Sincronização e correção da biblioteca</h2><small>seen + watchlist + progress</small></div><div class="stats" data-reconcile-stats>${[['Processados',0],['IDs corrigidos',0],['Capas recuperadas',0],['Ambíguos preservados',0],['Falhas',0]].map(([a,b])=>`<div class="stat"><small>${a}</small><b>${b}</b></div>`).join('')}</div><div class="actions" style="margin-top:10px"><button class="btn" data-reconcile="pending">Sincronizar pendentes</button><button class="btn" data-reconcile="all">Revalidar tudo</button><button class="btn" data-reconcile-cancel disabled>Cancelar</button></div><div class="notice" data-reconcile-note style="margin-top:8px">Pronto.</div></section><section class="panel"><div class="panel-head"><h2>Dados</h2><small>backup rápido</small></div><div class="actions"><button class="btn" data-export>Exportar snapshot</button></div></section></div>`;
 if(typeof setApp==='function'&&typeof shell==='function')setApp(shell('Configurações','Conta, manutenção, sincronização e dados.','configs',body,{search:false}));
 Promise.resolve().then(async()=>{try{const profile=typeof api==='function'?await api('profiles?select=*&limit=1').then(x=>x?.[0]||{}):{};if(seq!==navSeq||typeof route==='function'&&route()!=='configs')return;const input=q('[data-ct252-profile-name]');if(input)input.value=profile.display_name||profile.name||user?.user_metadata?.display_name||''}catch(_){}});return;
 }}catch(_){}

/* Re-run data normalization on existing lifecycle events without introducing a DOM observer. */
document.addEventListener('cinetracker:data-changed',()=>{reconcileHome252();sports252.at=0});
window.addEventListener('pageshow',reconcileHome252);

window.__ctR252Test={classifySeries,isLegacySeries,episodeCandidates,eligiblePublic,isWwe,pureDramaDocumentary,knownSets,isAnime};
})();

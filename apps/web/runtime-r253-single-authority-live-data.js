/* CineTracker Web 1.0.44 r253 — single authority per critical screen + live data. */
(()=>{
'use strict';
if(window.__ctR253)return;
window.__ctR253='single-authority-live-data';
window.__ctR253Home='live-payload-native-ui-no-age-only-dust';
window.__ctR253Discover='single-renderer-nine-tabs-generation-safe';
window.__ctR253Sports='single-renderer-four-tabs-canonical-history';
window.__ctR253Profile='approved-layout-live-data-patch';
window.__ctR253F1='r248-approved-hub-single-instance';

const DAY=86400000,TZ='America/Sao_Paulo',SHOWN_KEY='ct:shown_recommendations:v1';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc253=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDate=v=>{const d=v instanceof Date?v:new Date(v||0);return Number.isFinite(d.getTime())?d:null};
function day253(d=new Date()){try{return new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
function shift253(days,d=new Date()){return day253(new Date(d.getTime()+days*DAY))}
function endToday253(){const d=new Date();const key=day253(d);const x=new Date(`${key}T23:59:59-03:00`);return Number.isFinite(x.getTime())?x:new Date(d.getTime()+DAY)}
function type253(x){return x?.media_type==='movie'||x?.type==='movie'?'movie':'tv'}
function id253(x){return n(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id)}
function title253(x){return x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título'}
function poster253(x){return x?.poster_path||x?.raw_tmdb?.poster_path||null}
function score253(x){return n(x?.vote_average??x?.raw_tmdb?.vote_average)}
function date253(x){return String(type253(x)==='movie'?(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||''):(x?.first_air_date||x?.raw_tmdb?.first_air_date||x?.release_year||''))}
function year253(x){return n(date253(x).slice(0,4))}
function genres253(x){return [...(x?.genre_ids||x?.raw_tmdb?.genre_ids||[])].map(Number).filter(Boolean)}
function key253(x){return `${type253(x)}:${id253(x)}`}
function anime253(x){const g=genres253(x),country=x?.origin_country||x?.raw_tmdb?.origin_country||[],lang=x?.original_language||x?.raw_tmdb?.original_language;return type253(x)==='tv'&&(g.includes(16)||country.includes?.('JP')||lang==='ja')}
function notInterested253(x){const s=norm(x?.manual_state||x?.user_state||x?.state||x?.override_state);return !!(x?.is_not_interested||x?.not_interested||x?.notInterested||s==='notinterested'||s==='not interested'||s==='not_interested')}
const WWE253=/\b(wwe|wrestlemania|royal rumble|smackdown|monday night raw|friday night smackdown|nxt|summer ?slam|survivor series|money in the bank|elimination chamber|backlash|crown jewel|clash at the castle)\b/i;
function wwe253(x){return WWE253.test(norm([title253(x),x?.original_title,x?.original_name,x?.overview].filter(Boolean).join(' ')))}
function pureDramaDoc253(x){const g=genres253(x);return g.length>0&&g.every(v=>v===18||v===99)}
function publicEligible253(x){return !!(id253(x)&&poster253(x)&&score253(x)>=7.5&&year253(x)>1990&&!pureDramaDoc253(x)&&!wwe253(x)&&!notInterested253(x))}

/* HOME: trust the canonical live payload. Only correct impossible stale buckets; never create dust from age alone. */
function legacySeries253(row){const t=norm([row?.title,row?.name,row?.media_title].filter(Boolean).join(' '));return /(^| )wwe( |$)/.test(t)||t==='raw'||t==='smackdown'||t.includes('monday night raw')||t.includes('friday night smackdown')||t.includes('formula 1')||t.includes('formula one')||/(^| )f1( |$)/.test(t)||t.includes('super bowl')}
function normalizeHomeRow253(row){
 if(!row)return row;
 const watched=n(row.watched_episodes),released=n(row.released_episodes),caught=row.is_caught_up===true,ended=['ended','canceled','cancelled'].includes(norm(row?.raw_tmdb?.status||row?.status));
 if(row.is_completed||ended&&caught){row.home_bucket='completed';row.is_caught_up=true;return row}
 if(watched<=0){if(row.is_watchlist!==false)row.home_bucket='not_started';return row}
 if(caught||released>0&&watched>=released){row.home_bucket=ended?'completed':'up_to_date';row.is_caught_up=true;return row}
 if(row.home_bucket==='dust'&&n(row.history_missing_episodes)<=0){row.home_bucket='up_to_date';row.is_caught_up=true;return row}
 if(legacySeries253(row)&&row.home_bucket==='dust'){
  const ls=n(row.last_season_number),le=n(row.last_episode_number),rs=n(row.latest_released_season_number),re=n(row.latest_released_episode_number);
  if(!rs||ls>rs||ls===rs&&le>=re){row.home_bucket='up_to_date';row.is_caught_up=true}
 }
 return row;
}
function normalizeHome253(payload){const p=payload&&typeof payload==='object'?payload:{};if(Array.isArray(p.series))p.series.forEach(normalizeHomeRow253);return p}
renderHome=async function(seq){
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home>${loading('Sincronizando Home...')}</div>`));
 try{
  const data=await rpc('cinetracker_home_live_v0997_r3',{p_today:day253()});
  if(seq!==navSeq||route()!=='home')return;
  homeCache=normalizeHome253(data||{});
  paintHome();
 }catch(e){if(seq!==navSeq)return;const h=q('[data-home]');if(h)h.innerHTML=fail(`Falha ao sincronizar Home: ${e?.message||e}`,'home')}
};
window.__ctR253NormalizeHome=normalizeHome253;

/* SPORTS: one renderer, one tab state, canonical events/history, unique selectors immune to inherited handlers. */
const SPORT_TABS253=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
let sport253={tab:'next',data:null,at:0,promise:null,generation:0};
async function sportsData253(force=false){
 if(!force&&sport253.data&&Date.now()-sport253.at<30000)return sport253.data;
 if(sport253.promise&&!force)return sport253.promise;
 const now=new Date(),from=new Date(now.getTime()-3*DAY),to=new Date(endToday253().getTime()+DAY);
 sport253.promise=rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()}).then(x=>x||{}).then(x=>{sport253.data=x;sport253.at=Date.now();return x}).finally(()=>{sport253.promise=null});
 return sport253.promise;
}
function eventTime253(e){const d=validDate(e?.starts_at||e?.start_time||e?.date);return d?d.getTime():0}
function sportsRows253(p,tab=sport253.tab,now=new Date()){
 const events=Array.isArray(p?.events)?p.events:[],hist=Array.isArray(p?.watch_history)?p.watch_history:[],nowMs=now.getTime(),today=day253(now);
 if(tab==='watched')return hist;
 if(tab==='favorites')return events.filter(e=>e?.has_favorite);
 if(tab==='previous')return events.filter(e=>{const t=eventTime253(e);return t>0&&t<nowMs&&t>=nowMs-72*60*60*1000});
 return events.filter(e=>{const t=eventTime253(e);return t>=nowMs&&day253(new Date(t))===today});
}
function sportsEvent253(e,p){
 let html='';
 try{if(typeof sportsEvent==='function')html=sportsEvent(e,p||{})}catch(_){}
 if(!html){const when=validDate(e?.starts_at);html=`<article class="event"><div class="event-top"><div class="league"><span>🏆 ${esc253(e?.competition_name||e?.sport_slug||'Esporte')}</span></div></div><div class="event-title">${esc253(e?.title||[e?.home_name,e?.away_name].filter(Boolean).join(' × ')||'Evento')}</div><div class="meta">${when?when.toLocaleString('pt-BR',{timeZone:TZ,weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):''}</div></article>`}
 const watched=!!e?.is_watched,provider=String(e?.provider||''),pid=String(e?.provider_event_id||'');
 const action=`<div class="actions ct253-event-actions"><button type="button" class="btn ${watched?'on':''}" data-ct253-watch="${esc253(provider)}|${esc253(pid)}" data-watched="${watched?'1':'0'}">${watched?'✓ Assistido':'Marcar assistido'}</button></div>`;
 return html.replace(/<\/article>\s*$/i,`${action}</article>`);
}
function paintSports253(p=sport253.data||{}){
 const h=q('[data-ct253-sports]');if(!h)return;
 const rows=sportsRows253(p),stats=p?.stats||{},label=SPORT_TABS253.find(x=>x[0]===sport253.tab)?.[1]||'Esportes';
 h.innerHTML=`<div class="tabs ct253-sports-tabs">${SPORT_TABS253.map(([k,l])=>`<button type="button" class="chip ${sport253.tab===k?'active':''}" data-ct253-sport-tab="${k}">${l}</button>`).join('')}</div><section class="panel"><div class="panel-head"><h2>${label}</h2><small>${rows.length}</small></div><div class="event-grid">${rows.map(e=>sportsEvent253(e,p)).join('')||'<div class="empty">Nenhum evento neste filtro.</div>'}</div></section><section class="panel ct253-sports-live-stats"><div class="panel-head"><h2>Resumo assistido</h2><small>dados atuais</small></div><div class="stats"><div class="stat"><small>Eventos assistidos</small><b>${n(stats.watched_events).toLocaleString('pt-BR')}</b></div><div class="stat"><small>Tempo assistido</small><b>${fmtHM253(n(stats.sports_minutes))}</b></div></div></section>`;
 qa('.ct248-sports-tabs,.sports-summary,[data-sports-tab]',h).forEach(x=>x.remove());
 queueMicrotask(()=>{try{qa('.ct248-f1hub').slice(1).forEach(x=>x.remove());window.__ctR248RenderF1?.()}catch(_){}});
}
renderSports=async function(seq){
 setApp(shell('Esportes','Próximos, anteriores, favoritos e assistidos.','sports',`<div class="page" data-sports data-ct253-sports>${loading('Carregando Esportes...')}</div>`));
 try{const p=await sportsData253();if(seq!==navSeq||route()!=='sports')return;paintSports253(p)}catch(e){if(seq!==navSeq)return;const h=q('[data-ct253-sports]');if(h)h.innerHTML=fail(`Falha ao carregar Esportes: ${e?.message||e}`,'sports')}
};
async function toggleSportWatch253(token,was){
 const [provider,...rest]=String(token||'').split('|'),pid=rest.join('|');if(!provider||!pid)return;
 await rpc('cinetracker_sport_mark_watched_v1',{p_provider:provider,p_provider_event_id:pid,p_watched:!was});
 sport253.data=null;sport253.at=0;const p=await sportsData253(true);if(route()==='sports')paintSports253(p);
}

/* DISCOVER: shell once, unique click targets, generation guard, one-page pools and no global re-render. */
const DTABS253=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
let discover253={tab:'foryou',type:'all',generation:0,cache:new Map()};
function knownSets253(dash){const seen=new Set(),watch=new Set(),blocked=new Set();for(const x of dash||[]){const k=key253(x);if(k.endsWith(':0'))continue;if(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n(x?.watched_episodes)>0||x?.last_watched_at)seen.add(k);if(x?.is_watchlist||x?.watchlist||x?.watch_later||x?.added_to_watchlist)watch.add(k);if(notInterested253(x))blocked.add(k)}return{seen,watch,blocked}}
function localShown253(){try{const x=JSON.parse(localStorage.getItem(SHOWN_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function pruneShown253(rows){const cut=Date.now()-7*DAY;return(rows||[]).filter(x=>(validDate(x?.shown_at)?.getTime()||0)>=cut)}
async function shown253(){let remote=[];try{const since=new Date(Date.now()-7*DAY).toISOString();remote=await api(`shown_recommendations?select=media_type,tmdb_id,title,shown_at&shown_at=gte.${encodeURIComponent(since)}&order=shown_at.desc&limit=500`)||[]}catch(_){}return new Set(pruneShown253([...localShown253(),...remote]).map(x=>`${x.media_type==='movie'?'movie':'tv'}:${n(x.tmdb_id)}`))}
async function recordShown253(items){const at=new Date().toISOString(),rows=(items||[]).filter(Boolean).map(x=>({media_type:type253(x),tmdb_id:id253(x),title:title253(x),shown_at:at})).filter(x=>x.tmdb_id);if(!rows.length)return;try{localStorage.setItem(SHOWN_KEY,JSON.stringify(pruneShown253([...localShown253(),...rows]).slice(-500)))}catch(_){}try{if(user?.id)await api('shown_recommendations?on_conflict=user_id,media_type,tmdb_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(rows.map(x=>({...x,user_id:user.id})))})}catch(_){}}
async function tmdbList253(path,params,type){const d=await safeTmdb(path,{...(params||{}),page:1});return(d?.results||[]).map(x=>({...x,media_type:type||x.media_type})).filter(x=>x.id)}
function first253(rows,pred,used,shown){for(const x of rows||[]){const k=key253(x);if(!publicEligible253(x)||used.has(k)||shown.has(k)||!pred(x))continue;used.add(k);return x}return null}
async function forYou253(){
 const lo=shift253(-30),today=day253(),[dash,shown,dailyPool,freshM,freshT,freshA]=await Promise.all([
  rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),shown253(),
  tmdbList253('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,include_adult:false},'movie'),
  tmdbList253('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':today,sort_by:'vote_average.desc','vote_count.gte':40},'movie'),
  tmdbList253('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':today,sort_by:'vote_average.desc','vote_count.gte':30},'tv'),
  tmdbList253('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':today,with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':20},'tv')
 ]);
 const known=knownSets253(dash),used=new Set(),publicOk=x=>!known.seen.has(key253(x))&&!known.watch.has(key253(x))&&!known.blocked.has(key253(x));
 const daily=first253(dailyPool,publicOk,used,shown),watchRows=(dash||[]).filter(x=>known.watch.has(key253(x))&&!known.seen.has(key253(x))&&!known.blocked.has(key253(x))&&publicEligible253(x));
 const wm=first253(watchRows,x=>type253(x)==='movie',used,shown),ws=first253(watchRows,x=>type253(x)==='tv'&&!anime253(x),used,shown),wa=first253(watchRows,anime253,used,shown);
 const fm=first253(freshM,publicOk,used,shown),fs=first253(freshT,x=>publicOk(x)&&!anime253(x),used,shown),fa=first253(freshA,publicOk,used,shown);
 const out={__ct253ForYou:true,daily:[daily].filter(Boolean),watchlist:[wm,ws,wa].filter(Boolean),fresh:[fm,fs,fa].filter(Boolean)};await recordShown253([...out.daily,...out.watchlist,...out.fresh]);return out;
}
async function exclusion253(){const dash=await rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]);return knownSets253(dash)}
async function discoverRows253(tab,force=false){
 const ck=`${tab}:${day253()}`;if(!force&&tab!=='foryou'&&discover253.cache.has(ck))return discover253.cache.get(ck);
 const task=(async()=>{
  if(tab==='foryou')return forYou253();
  if(tab==='calendar'){const raw=await rpc('cinetracker_calendar_watchlist_v0997',{p_from:day253(),p_to:shift253(75)}).catch(()=>[]);return Array.isArray(raw)?raw.map(x=>({...x,id:n(x.tmdb_id||x.id),media_type:type253(x)})):[]}
  const known=await exclusion253(),ok=x=>publicEligible253(x)&&!known.seen.has(key253(x))&&!known.watch.has(key253(x))&&!known.blocked.has(key253(x));let rows=[];
  if(tab==='top10'){const d=await safeTmdb('/trending/all/day');rows=(d?.results||[]).filter(x=>['movie','tv'].includes(x.media_type)).filter(ok).slice(0,10)}
  else if(tab==='trending'){const d=await safeTmdb('/trending/all/week');rows=(d?.results||[]).filter(x=>['movie','tv'].includes(x.media_type)).filter(ok)}
  else if(tab==='popular'){const[m,t]=await Promise.all([tmdbList253('/movie/popular',{},'movie'),tmdbList253('/tv/popular',{},'tv')]);rows=[...m,...t].filter(ok).sort((a,b)=>n(b.popularity)-n(a.popularity))}
  else if(tab==='new'){const lo=shift253(-30),hi=day253(),[m,t]=await Promise.all([tmdbList253('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.desc'},'movie'),tmdbList253('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.desc'},'tv')]);rows=[...m,...t].filter(ok)}
  else if(tab==='releases'){const lo=shift253(-7),hi=shift253(30),[m,t]=await Promise.all([tmdbList253('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc'},'movie'),tmdbList253('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc'},'tv')]);rows=[...m,...t].filter(ok)}
  else if(tab==='anticipated'){const lo=shift253(1),[m,t]=await Promise.all([tmdbList253('/discover/movie',{'primary_release_date.gte':lo,sort_by:'popularity.desc'},'movie'),tmdbList253('/discover/tv',{'first_air_date.gte':lo,sort_by:'popularity.desc'},'tv')]);rows=[...m,...t].filter(ok)}
  else if(tab==='top'){const[m,t]=await Promise.all([tmdbList253('/movie/top_rated',{},'movie'),tmdbList253('/tv/top_rated',{},'tv')]);rows=[...m,...t].filter(ok).sort((a,b)=>score253(b)-score253(a))}
  return rows;
 })();
 if(tab!=='foryou')discover253.cache.set(ck,task);try{const v=await task;if(tab!=='foryou')discover253.cache.set(ck,v);return v}catch(e){discover253.cache.delete(ck);throw e}
}
function block253(title,rows,refresh=false){return `<section class="panel"><div class="panel-head"><h2>${esc253(title)}</h2>${refresh?'<button type="button" class="chip" data-ct253-refresh>Trocar</button>':`<small>${rows.length}</small>`}</div><div class="row">${rows.map(mediaCard).join('')||'<div class="empty">Sem item elegível no momento.</div>'}</div></section>`}
function paintDiscover253(rows,tab=discover253.tab){const h=q('[data-ct253-discover-content]');if(!h)return;if(rows?.__ct253ForYou){h.innerHTML=`<div class="page" data-ct253-foryou>${block253('Indicação do Dia',rows.daily||[],true)}${block253('Da sua Watchlist',rows.watchlist||[])}${block253('100% Novos',rows.fresh||[])}</div>`;return}let a=Array.isArray(rows)?rows:[];if(discover253.type!=='all')a=a.filter(x=>type253(x)===discover253.type);if(tab==='calendar'){const groups=new Map();for(const x of a){const ds=String(x.calendar_date||x.release_date||x.first_air_date||'').slice(0,10)||'Sem data';if(!groups.has(ds))groups.set(ds,[]);groups.get(ds).push(x)}h.innerHTML=`<div class="page">${[...groups.entries()].map(([d,g])=>`<section class="panel"><div class="panel-head"><h2>${d==='Sem data'?d:new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h2><small>${g.length}</small></div><div class="row">${g.map(mediaCard).join('')}</div></section>`).join('')||'<div class="empty">Nenhum lançamento da sua Watchlist neste período.</div>'}</div>`;return}h.innerHTML=`<div class="row">${a.slice(0,120).map(mediaCard).join('')||'<div class="empty">Nenhum título elegível.</div>'}</div>`}
function syncDiscoverButtons253(){qa('[data-ct253-discover-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ct253DiscoverTab===discover253.tab));qa('[data-ct253-discover-type]').forEach(b=>b.classList.toggle('active',b.dataset.ct253DiscoverType===discover253.type))}
async function loadDiscover253(tab=discover253.tab,force=false){const gen=++discover253.generation;discover253.tab=tab;syncDiscoverButtons253();const h=q('[data-ct253-discover-content]');if(h)h.innerHTML=loading('Carregando títulos...');try{const rows=await discoverRows253(tab,force);if(gen!==discover253.generation||route()!=='discover')return;paintDiscover253(rows,tab)}catch(e){if(gen!==discover253.generation)return;if(h)h.innerHTML=fail(`Falha ao carregar Descobrir: ${e?.message||e}`,'discover')}}
renderDiscover=async function(seq){
 setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover data-ct253-discover><div class="tabs ct253-discover-tabs">${DTABS253.map(([k,l])=>`<button type="button" class="chip ${discover253.tab===k?'active':''}" data-ct253-discover-tab="${k}">${l}</button>`).join('')}</div><div class="filters">${[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${discover253.type===k?'active':''}" data-ct253-discover-type="${k}">${l}</button>`).join('')}</div><div data-ct253-discover-content>${loading('Carregando títulos...')}</div></div>`));
 if(seq!==navSeq||route()!=='discover')return;await loadDiscover253(discover253.tab,false);
};

/* PROFILE: preserve the approved producer/order, then refresh its backing data and patch only values. */
function fmtHM253(minutes){const m=Math.max(0,Math.round(n(minutes))),h=Math.floor(m/60),r=m%60;return `${h}h ${String(r).padStart(2,'0')}min`}
function patchSportsProfile253(stats){const root=q('[data-profile]');if(!root||!stats)return;const panel=qa('section.panel',root).find(p=>norm(q('.panel-head h2,h2',p)?.textContent)==='esportes assistidos');if(!panel)return;for(const card of qa('.stat',panel)){const label=norm(q('small',card)?.textContent),val=q('b',card);if(!val)continue;if(label.includes('eventos assistidos'))val.textContent=n(stats.watched_events).toLocaleString('pt-BR');if(label.includes('tempo assistido'))val.textContent=fmtHM253(stats.sports_minutes)}}
const baseProfile253=renderProfile;
renderProfile=async function(seq){const out=await baseProfile253(seq);if(seq!==navSeq||route()!=='profile')return out;try{const[fresh,sport]=await Promise.all([rpc('cinetracker_profile_payload_v0997_r2',{p_tz:typeof tz==='function'?tz():TZ}).catch(()=>null),rpc('cinetracker_sport_stats_v1',{}).catch(()=>null)]);if(seq!==navSeq||route()!=='profile')return out;if(fresh&&typeof fresh==='object'){profileCache=fresh;try{window.__ctR238ProfileStats?.(fresh)}catch(_){}}patchSportsProfile253(sport)}catch(_){}return out};

/* Unique delegated controls. Capture + stopImmediatePropagation prevents legacy click stacks. */
document.addEventListener('click',e=>{
 const st=e.target?.closest?.('[data-ct253-sport-tab]');if(st){e.preventDefault();e.stopImmediatePropagation();sport253.tab=st.dataset.ct253SportTab;paintSports253();return}
 const sw=e.target?.closest?.('[data-ct253-watch]');if(sw){e.preventDefault();e.stopImmediatePropagation();sw.disabled=true;void toggleSportWatch253(sw.dataset.ct253Watch,sw.dataset.watched==='1').catch(err=>toast(`Esportes: ${err?.message||err}`)).finally(()=>{sw.disabled=false});return}
 const dt=e.target?.closest?.('[data-ct253-discover-tab]');if(dt){e.preventDefault();e.stopImmediatePropagation();discover253.tab=dt.dataset.ct253DiscoverTab;void loadDiscover253(discover253.tab,false);return}
 const ty=e.target?.closest?.('[data-ct253-discover-type]');if(ty){e.preventDefault();e.stopImmediatePropagation();discover253.type=ty.dataset.ct253DiscoverType;syncDiscoverButtons253();if(discover253.tab==='foryou')void loadDiscover253('foryou',true);else{const cached=discover253.cache.get(`${discover253.tab}:${day253()}`);Promise.resolve(cached||discoverRows253(discover253.tab)).then(rows=>{if(route()==='discover')paintDiscover253(rows,discover253.tab)})}return}
 const rf=e.target?.closest?.('[data-ct253-refresh]');if(rf){e.preventDefault();e.stopImmediatePropagation();rf.disabled=true;void loadDiscover253('foryou',true).finally(()=>{rf.disabled=false});return}
},true);

document.addEventListener('cinetracker:data-changed',()=>{sport253.data=null;sport253.at=0;discover253.cache.clear()});
window.__ctR253Test={normalizeHomeRow253,normalizeHome253,legacySeries253,sportsRows253,publicEligible253,wwe253,pureDramaDoc253,knownSets253,anime253,fmtHM253};
})();

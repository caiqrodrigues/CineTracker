/* CineTracker Web 1.0.50 r259 — fast Home/Discover recovery from the latest real-device video. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR259)return;
window.__ctR259='fast-home-discover-no-observers';
window.__ctR259Home='r5-first-paint+weekly-priority-only+no-dom-repair';
window.__ctR259Discover='v108-fast-state+staged-first-page+never-global-blank';
window.__ctR259Horizontal='css-native-pan-x-no-mutation-observer';
window.__ctR259Frozen='sports-profile-configs-r257-unchanged';

const q259=(s,r=document)=>r?.querySelector?.(s)||null;
const qa259=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n259=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const esc259=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm259=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const DAY259=86400000;
function day259(d=new Date()){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
function shift259(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return day259(d)}
const timeout259=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
const type259=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const id259=x=>n259(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const title259=x=>x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const poster259=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const year259=x=>String(x?.release_year||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const score259=x=>n259(x?.vote_average??x?.raw_tmdb?.vote_average);
const key259=x=>`${type259(x)}:${id259(x)}`;
function img259(p,size='w342'){try{return typeof img==='function'?img(p,size):p||''}catch{return p||''}}
function ep259(s,e){return n259(s)>0&&n259(e)>0?n259(s)*100000+n259(e):0}
function rowFrontier259(r){return Math.max(ep259(r?.last_season_number,r?.last_episode_number),ep259(r?.last_watched_season,r?.last_watched_episode),ep259(r?.last_season,r?.last_episode),ep259(r?.progress_season,r?.progress_episode),ep259(r?.last_watched_episode_data?.season_number,r?.last_watched_episode_data?.episode_number))}
function weekly259(r){const t=norm259(title259(r));return /(^| )raw( |$)|smackdown/.test(t)}
function recent259(ds){const t=new Date(ds||0).getTime();return Number.isFinite(t)&&Date.now()-t<=30*DAY259}
function clearNext259(r){r.next_season_number=null;r.next_episode_number=null;r.next_episode_title='';r.next_episode_air_date='';r.next_episode=null;r.next_episode_to_watch=null;r.next_unwatched_episode=null}
function provisionalWeekly259(r){
 const p=rowFrontier259(r),s=Math.floor(p/100000),e=p%100000;
 r._ct259Weekly=true;r.home_bucket='up_to_date';r.is_caught_up=true;r.history_missing_episodes=0;
 r.released_episodes=n259(r.watched_episodes);
 if(s&&e){r.latest_released_season_number=s;r.latest_released_episode_number=e;r.last_released_season_number=s;r.last_released_episode_number=e}
 clearNext259(r);return r;
}
function normalizeNormal259(r){
 if(!r||weekly259(r)||n259(r.watched_episodes)<=0)return r;
 const missing=Math.max(n259(r.history_missing_episodes),Math.max(0,n259(r.released_episodes)-n259(r.watched_episodes)));
 if(missing>0){r.history_missing_episodes=missing;r.is_caught_up=false;r.home_bucket=recent259(r.last_watched_at)?'continue':'dust'}
 return r;
}
function prepareHome259(data){for(const r of data?.series||[]){if(weekly259(r))provisionalWeekly259(r);else normalizeNormal259(r)}return data||{}}

const weeklyState259=new Map(),weeklyDetail259=new Map(),weeklySeason259=new Map();
async function episodeState259(id){const old=weeklyState259.get(id);if(old&&Date.now()-old.at<120000)return old.data;const d=await timeout259(rpc('cinetracker_series_episode_state_v1',{p_tmdb_id:id,p_today:day259()}),4800,null);if(d)weeklyState259.set(id,{at:Date.now(),data:d});return d}
async function tvDetail259(id){const old=weeklyDetail259.get(id);if(old&&Date.now()-old.at<300000)return old.data;const d=await timeout259(tmdb(`/tv/${id}`),4800,null);if(d)weeklyDetail259.set(id,{at:Date.now(),data:d});return d}
async function season259(id,s){const k=`${id}:${s}`,old=weeklySeason259.get(k);if(old&&Date.now()-old.at<300000)return old.data;const d=await timeout259(tmdb(`/tv/${id}/season/${s}`),4800,null);if(d)weeklySeason259.set(k,{at:Date.now(),data:d});return d}
async function auditWeeklyRow259(r){
 const id=id259(r);if(!id)return false;
 const [state,detail]=await Promise.all([episodeState259(id),tvDetail259(id)]);if(!state||!detail)return false;
 const watched=new Set(),eps=Array.isArray(state?.episodes)?state.episodes:[];let frontier=0;
 for(const x of eps){const p=ep259(x?.season_number,x?.episode_number);if(p){watched.add(p);frontier=Math.max(frontier,p)}}
 if(!frontier)return false;
 const first=Math.floor(frontier/100000),last=Math.max(first,n259(detail?.last_episode_to_air?.season_number));
 const seasons=[];for(let s=first;s<=last;s++)seasons.push(s);
 const packs=await Promise.all(seasons.map(s=>season259(id,s)));
 const pending=[];
 for(let i=0;i<packs.length;i++)for(const x of packs[i]?.episodes||[]){const s=n259(x?.season_number||seasons[i]),e=n259(x?.episode_number),p=ep259(s,e),air=String(x?.air_date||'').slice(0,10);if(p>frontier&&air&&air<=day259()&&!watched.has(p))pending.push({...x,season_number:s,episode_number:e,_p:p})}
 pending.sort((a,b)=>a._p-b._p);const next=pending[0]||null;
 r.history_missing_episodes=pending.length;r.released_episodes=n259(r.watched_episodes)+pending.length;r.is_caught_up=!next;
 if(next){r.home_bucket=recent259(next.air_date)||recent259(r.last_watched_at)?'continue':'dust';r.next_season_number=n259(next.season_number);r.next_episode_number=n259(next.episode_number);r.next_episode_title=next.name||'';r.next_episode_air_date=next.air_date||'';r.next_episode={season_number:n259(next.season_number),episode_number:n259(next.episode_number),name:next.name||'',air_date:next.air_date||''};r.next_episode_to_watch=r.next_episode;r.next_unwatched_episode=r.next_episode;r.latest_released_season_number=n259(next.season_number);r.latest_released_episode_number=n259(next.episode_number)}else{r.home_bucket=/ended|canceled|cancelled/.test(norm259(detail?.status))?'completed':'up_to_date';clearNext259(r)}
 return true;
}
let homeFetchedAt259=0,homeRequest259=null,homeAuditToken259=0;
async function refreshHome259(seq){
 if(homeRequest259)return homeRequest259;
 homeRequest259=(async()=>{const d=await rpc('cinetracker_profile_home_payload_v0997_r5',{p_today:day259()});if(seq!==navSeq||route()!=='home')return null;homeCache=prepareHome259(d||{});homeFetchedAt259=Date.now();paintHome();const token=++homeAuditToken259;setTimeout(async()=>{if(token!==homeAuditToken259||route()!=='home')return;const rows=(homeCache?.series||[]).filter(weekly259);await Promise.all(rows.map(r=>auditWeeklyRow259(r).catch(()=>false)));if(token===homeAuditToken259&&route()==='home')paintHome()},80);return homeCache})();
 try{return await homeRequest259}finally{homeRequest259=null}
}
renderHome=async function(seq){
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home>${homeCache?.series?.length?'':loading('Carregando Home…')}</div>`));
 if(seq!==navSeq||route()!=='home')return;
 if(homeCache?.series?.length){prepareHome259(homeCache);paintHome();if(Date.now()-homeFetchedAt259<60000)return;void refreshHome259(seq);return}
 try{await refreshHome259(seq)}catch(e){if(seq!==navSeq||route()!=='home')return;const h=q259('[data-home]');if(h)h.innerHTML=fail(`Falha ao carregar Home: ${e?.message||e}`,'home')}
};

/* DISCOVER — no full profile dashboard, no full Watchlist RPC and no all-or-nothing hydration. */
const GENRES259={28:'Ação',12:'Aventura',16:'Animação',35:'Comédia',80:'Crime',99:'Documentário',18:'Drama',10751:'Família',14:'Fantasia',36:'História',27:'Terror',10402:'Música',9648:'Mistério',10749:'Romance',878:'Ficção científica',10770:'Cinema TV',53:'Thriller',10752:'Guerra',37:'Faroeste',10759:'Ação e aventura',10762:'Infantil',10763:'Notícias',10764:'Reality',10765:'Sci-Fi e fantasia',10766:'Novela',10767:'Talk show',10768:'Guerra e política'};
function genres259(x,limit=3){const named=Array.isArray(x?.genres)?x.genres.map(g=>typeof g==='string'?g:g?.name).filter(Boolean):[];if(named.length)return named.slice(0,limit);let ids=x?.genre_ids||x?.raw_tmdb?.genre_ids||[];if(!Array.isArray(ids))ids=[];return [...new Set(ids.map(v=>GENRES259[n259(v)]).filter(Boolean))].slice(0,limit)}
function card259(x){const type=type259(x),id=id259(x),p=poster259(x),yr=year259(x),gs=genres259(x),sc=score259(x);return `<article class="ct259-media-card"><button type="button" data-media="${type}:${id}">${p?`<img class="ct259-media-poster" src="${esc259(img259(p,'w342'))}" alt="" loading="lazy">`:'<div class="ct259-media-poster ct259-poster-empty">Sem capa</div>'}<div class="ct259-media-copy"><b>${esc259(title259(x))}</b><small>${[yr,gs.join(' · ')].filter(Boolean).join(' · ')||'—'}</small><span>${sc?`★ ${sc.toFixed(1)}`:'Sem nota'}</span></div></button></article>`}
function rail259(rows){return `<div class="ct259-media-rail">${(rows||[]).map(card259).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div>`}
const DTABS259=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const d259={tab:'foryou',type:'all',gen:0,personal:null,personalAt:0,cache:new Map(),forYou:null,swap:0};
function setFrom259(a){return new Set((Array.isArray(a)?a:[]).map(x=>`${String(x?.media_type)==='movie'?'movie':'tv'}:${n259(x?.tmdb_id)}`).filter(k=>!/:(0)$/.test(k)))}
async function personal259(force=false){
 if(!force&&d259.personal&&Date.now()-d259.personalAt<120000)return d259.personal;
 const bad=Symbol.for('ct259-bad');let raw=await timeout259(rpc('cinetracker_recommendation_state_v108',{}),2800,bad);
 if(raw===bad){const v107=await timeout259(rpc('cinetracker_recommendation_state_v107',{}),2800,bad);if(v107===bad)throw new Error('Biblioteca pessoal indisponível');raw={hard_excluded:v107?.fresh_excluded||[],fresh_excluded:v107?.fresh_excluded||[],watchlist:[]}}
 d259.personal={hard:setFrom259(raw?.hard_excluded),fresh:setFrom259(raw?.fresh_excluded),watchlist:Array.isArray(raw?.watchlist)?raw.watchlist:[]};d259.personalAt=Date.now();return d259.personal;
}
function strict259(x,excluded,allowWatch=false){const id=id259(x),yr=n259(year259(x)),sc=score259(x),t=norm259(title259(x));if(!id||!poster259(x)||sc<7.5||yr<=1990||/wwe|raw|smackdown/.test(t))return false;const gs=genres259(x,8).map(norm259);if(gs.length&&gs.every(g=>g==='drama'||g==='documentario'))return false;return !(allowWatch?excluded.hard:excluded.fresh).has(key259(x))}
function browse259(x,personal){if(!id259(x)||!poster259(x)||personal.fresh.has(key259(x)))return false;if(d259.type!=='all'&&type259(x)!==d259.type)return false;return true}
function dedupe259(rows){const seen=new Set(),out=[];for(const x of rows||[]){const k=key259(x);if(!id259(x)||seen.has(k))continue;seen.add(k);out.push(x)}return out}
async function tmdbRows259(path,params={}){try{const d=await timeout259(tmdb(path,{...params,page:1}),4200,null);return Array.isArray(d?.results)?d.results:[]}catch{return[]}}
async function freshPools259(){const base={language:'pt-BR',include_adult:false,sort_by:'popularity.desc'},[trend,mov,tv]=await Promise.all([tmdbRows259('/trending/all/day'),tmdbRows259('/discover/movie',{...base,'primary_release_date.gte':shift259(-30),'primary_release_date.lte':day259()}),tmdbRows259('/discover/tv',{...base,'first_air_date.gte':shift259(-30),'first_air_date.lte':day259()})]);return{trend,daily:dedupe259([...mov.map(x=>({...x,media_type:'movie'})),...tv.map(x=>({...x,media_type:'tv'}))])}}
function forYouSkeleton259(){return `<div data-ct259-foryou><section class="ct259-discover-block"><h2>Indicação do Dia</h2><div class="ct259-block-loading">Preparando recomendação…</div></section><section class="ct259-discover-block"><h2>Da sua Watchlist</h2><div class="ct259-block-loading">Lendo sua Watchlist…</div></section><section class="ct259-discover-block"><h2>100% Novos</h2><div class="ct259-block-loading">Buscando novidades…</div></section></div>`}
function paintForYou259(data){const h=q259('[data-ct259-discover-content]');if(!h)return;d259.forYou=data;const picks=data?.picks||[],pick=picks.length?picks[d259.swap%picks.length]:null;h.innerHTML=`<div data-ct259-foryou><section class="ct259-discover-block"><div class="ct259-block-head"><h2>Indicação do Dia</h2>${picks.length>1?'<button type="button" class="chip" data-ct259-swap>Trocar</button>':''}</div>${rail259(pick?[pick]:[])}</section><section class="ct259-discover-block"><h2>Da sua Watchlist</h2>${rail259(data?.watch||[])}</section><section class="ct259-discover-block"><h2>100% Novos</h2>${rail259(data?.fresh||[])}</section></div>`}
function failForYou259(){const h=q259('[data-ct259-discover-content]');if(!h)return;h.innerHTML=`<div data-ct259-foryou><section class="ct259-discover-block"><h2>Indicação do Dia</h2><div class="empty">Não foi possível validar sua biblioteca agora.</div></section><section class="ct259-discover-block"><h2>Da sua Watchlist</h2><div class="empty">Sua Watchlist continua intacta. Tente novamente.</div></section><section class="ct259-discover-block"><h2>100% Novos</h2><button type="button" class="chip" data-ct259-retry>Recarregar</button></section></div>`}
async function loadForYou259(gen){
 try{const [p,pools]=await Promise.all([personal259(),freshPools259()]);if(gen!==d259.gen||route()!=='discover'||d259.tab!=='foryou')return;const picks=dedupe259(pools.trend).filter(x=>strict259(x,p)).slice(0,12),watch=dedupe259(p.watchlist).filter(x=>strict259(x,p,true)).slice(0,18),fresh=dedupe259(pools.daily).filter(x=>strict259(x,p)).slice(0,30);paintForYou259({picks,watch,fresh})}catch(_){if(gen===d259.gen&&route()==='discover'&&d259.tab==='foryou')failForYou259()}
}
async function source259(tab){
 const type=d259.type,all=type==='all';
 const both=async(mp,tp,params={})=>{if(type==='movie')return (await tmdbRows259(mp,params)).map(x=>({...x,media_type:'movie'}));if(type==='tv')return (await tmdbRows259(tp,params)).map(x=>({...x,media_type:'tv'}));const [m,t]=await Promise.all([tmdbRows259(mp,params),tmdbRows259(tp,params)]);return dedupe259([...m.map(x=>({...x,media_type:'movie'})),...t.map(x=>({...x,media_type:'tv'}))])};
 if(tab==='top10')return (await tmdbRows259('/trending/all/week')).slice(0,10);
 if(tab==='trending')return tmdbRows259('/trending/all/day');
 if(tab==='popular')return both('/movie/popular','/tv/popular');
 if(tab==='top')return both('/movie/top_rated','/tv/top_rated');
 if(tab==='anticipated')return both('/movie/upcoming','/discover/tv',{'first_air_date.gte':day259(),sort_by:'popularity.desc'});
 if(tab==='calendar')return both('/discover/movie','/discover/tv',{'primary_release_date.gte':day259(),'first_air_date.gte':day259(),sort_by:'popularity.desc'});
 if(tab==='new')return both('/discover/movie','/discover/tv',{'primary_release_date.gte':shift259(-30),'primary_release_date.lte':day259(),'first_air_date.gte':shift259(-30),'first_air_date.lte':day259(),sort_by:'popularity.desc'});
 if(tab==='releases')return both('/discover/movie','/discover/tv',{'primary_release_date.gte':shift259(-7),'primary_release_date.lte':shift259(21),'first_air_date.gte':shift259(-7),'first_air_date.lte':shift259(21),sort_by:'popularity.desc'});
 return [];
}
function syncDiscover259(){qa259('[data-ct259-discover-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ct259DiscoverTab===d259.tab));qa259('[data-ct259-discover-type]').forEach(b=>b.classList.toggle('active',b.dataset.ct259DiscoverType===d259.type))}
async function loadBrowse259(tab,gen,force=false){
 const key=`${day259()}:${d259.type}:${tab}`;let rows=!force?d259.cache.get(key):null;
 try{const p=await personal259();if(!rows){rows=await source259(tab);rows=dedupe259(rows).filter(x=>browse259(x,p));d259.cache.set(key,rows)}if(gen!==d259.gen||route()!=='discover'||d259.tab!==tab)return;const h=q259('[data-ct259-discover-content]');if(h)h.innerHTML=rail259(rows)}catch(_){if(gen!==d259.gen)return;const h=q259('[data-ct259-discover-content]');if(h&&!h.querySelector('.ct259-media-card'))h.innerHTML='<div class="empty">Não foi possível atualizar esta aba agora. Tente novamente.</div>'}
}
function loadDiscover259(tab=d259.tab,force=false){d259.tab=tab;const gen=++d259.gen;syncDiscover259();const h=q259('[data-ct259-discover-content]');if(tab==='foryou'){if(h)h.innerHTML=forYouSkeleton259();void loadForYou259(gen);return}if(h&&h.querySelector('.ct259-media-card')){let b=q259('.ct259-updating',h);if(!b){b=document.createElement('div');b.className='ct259-updating';b.textContent='Atualizando…';h.prepend(b)}}else if(h)h.innerHTML='<div class="ct259-block-loading">Carregando títulos…</div>';void loadBrowse259(tab,gen,force)}
renderDiscover=async function(seq){
 setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover data-ct259-discover><div class="tabs ct259-discover-tabs">${DTABS259.map(([k,l])=>`<button type="button" class="chip ${d259.tab===k?'active':''}" data-ct259-discover-tab="${k}">${l}</button>`).join('')}</div><div class="filters ct259-discover-types">${[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${d259.type===k?'active':''}" data-ct259-discover-type="${k}">${l}</button>`).join('')}</div><div data-ct259-discover-content>${d259.tab==='foryou'?forYouSkeleton259():'<div class="ct259-block-loading">Carregando títulos…</div>'}</div></div>`));
 if(seq!==navSeq||route()!=='discover')return;loadDiscover259(d259.tab,false)
};

document.addEventListener('click',e=>{const tab=e.target.closest?.('[data-ct259-discover-tab]');if(tab){e.preventDefault();loadDiscover259(tab.dataset.ct259DiscoverTab,false);return}const type=e.target.closest?.('[data-ct259-discover-type]');if(type){e.preventDefault();d259.type=type.dataset.ct259DiscoverType;loadDiscover259(d259.tab,false);return}if(e.target.closest?.('[data-ct259-swap]')){e.preventDefault();if(d259.forYou?.picks?.length){d259.swap++;paintForYou259(d259.forYou)}return}if(e.target.closest?.('[data-ct259-retry]')){e.preventDefault();d259.personal=null;d259.personalAt=0;loadDiscover259('foryou',true)}},true);

})();

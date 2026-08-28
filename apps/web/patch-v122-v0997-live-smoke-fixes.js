(() => {
'use strict';
if(window.__ct0997Live122Loaded)return;
window.__ct0997Live122Loaded=true;
window.__ct0997Live122='v122-live-smoke-home-discover-profile-layout';
window.__ctWebBuild='0.99.7';

const VERSION122='0.99.7';
const HOME_RPC_122='cinetracker_profile_home_payload_v0994';
const HOME_CACHE_122='ct0994_home_preload_v1';
const $122=(s,r=document)=>r?.querySelector?.(s)||null;
const $$122=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc122=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm122=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const cleanTitle122=v=>String(v||'').replace(/\s*\((?:18|19|20)\d{2}\)\s*$/,'').trim();
const rawRpc122=typeof window.sbRpc==='function'?window.sbRpc.bind(window):null;
const rawSb122=typeof window.sbApi==='function'?window.sbApi.bind(window):null;
const rawQuick122=typeof window.__ct0994QuickAction==='function'?window.__ct0994QuickAction.bind(window):null;
const rawOpen122=typeof window.__ct0994OpenDetail==='function'?window.__ct0994OpenDetail.bind(window):null;
const supabase122=()=>{try{if(typeof SUPABASE_URL!=='undefined'&&SUPABASE_URL)return SUPABASE_URL}catch{}return window.SUPABASE_URL||''};
const auth122=()=>{try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}};
const mediaType122=x=>x?.media_type==='movie'?'movie':'tv';
const year122=x=>Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||Number(x?.release_year||0)||0;
const effectiveId122=x=>Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||0)||0;
const titleKeys122=x=>[x?.title,x?.name,x?.original_title,x?.original_name].map(norm122).filter(Boolean);
const exact122=(row,x)=>{const want=norm122(cleanTitle122(row?.title||''));if(!want||!titleKeys122(x).includes(want))return false;const a=Number(row?.release_year||0),b=year122(x);return !(a>0&&b>0&&a!==b)};

const style122=document.createElement('style');
style122.id='ct0997-live122-style';
style122.textContent=`
html,body,#app{max-width:100%!important;overflow-x:hidden!important;box-sizing:border-box!important}
.app,.content,#ct120-page,.ct120-page,#ct120-profile,.ct120-section,.ct121-discover,.ct121-section{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}
.ct120-row,.ct121-carousel,.ct121-calrow,.ct120-timeline{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}
.ct122-watch{position:absolute;right:7px;bottom:7px;z-index:12;border:1px solid #39708c;background:#06151fe8;color:#e9f8ff;border-radius:9px;padding:6px 8px;font-size:9px;font-weight:800;cursor:pointer;backdrop-filter:blur(8px)}
.ct122-watch:hover{border-color:#68c9fb;background:#0b2635}.ct122-watch.on{border-color:#4ca87e;background:#0b2a20;color:#98ffd1}
.ct122-more-card{min-height:210px;border:1px dashed #39708c;background:linear-gradient(145deg,#07131b,#0b202c);color:#dff7ff;border-radius:13px;padding:14px;display:grid;place-items:center;text-align:center;cursor:pointer;scroll-snap-align:start}.ct122-more-card b{display:block;font-size:13px}.ct122-more-card small{display:block;margin-top:5px;color:#7898aa;font-size:9px}
.ct122-more-overlay{position:fixed;inset:0;z-index:1000500;background:#02070cf3;display:grid;place-items:center;padding:18px;backdrop-filter:blur(8px)}
.ct122-more-box{width:min(1180px,96vw);max-height:92vh;overflow:auto;border:1px solid #315d76;background:#07131b;border-radius:16px;padding:16px;box-shadow:0 28px 90px #000c}.ct122-more-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.ct122-more-head h2{margin:0;font-size:18px}.ct122-close{border:1px solid #315d76;background:#0a1c27;color:#fff;border-radius:9px;padding:8px 11px;cursor:pointer}.ct122-more-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,152px));gap:10px}.ct122-more-grid .ct120-card{display:block!important;min-width:0!important;width:auto!important}
.ct122-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:1000600;border:1px solid #356b85;background:#06151ff2;color:#e8f8ff;border-radius:999px;padding:9px 14px;font-size:10px;box-shadow:0 18px 50px #000a;pointer-events:none}
.ct122-calendar-empty{border:1px dashed #294b60;border-radius:12px;padding:18px;text-align:center;color:#7892a4;background:#07121a}
@media(min-width:851px){
  .content>.mobile-nav,#ct120-page .mobile-nav{display:none!important}
  .app,#ct120-page{width:100%!important;max-width:100vw!important}
  .content,#ct120-page>.content{width:auto!important;max-width:calc(100vw - 180px)!important;overflow-x:hidden!important}
}
@media(max-width:850px){
  #ct120-page{width:100%!important;max-width:100vw!important;display:block!important}
  #ct120-page>.sidebar{display:none!important}
  #ct120-page>.content{width:100%!important;max-width:100vw!important;overflow-x:hidden!important;padding-bottom:78px!important}
  .ct122-more-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`;
document.getElementById(style122.id)?.remove();document.head.appendChild(style122);

let homeFallback122=null;
let known122=null;
let knownAt122=0;
let calendarMine122=false;
let cleanTimer122=null;
let filterBusy122=false;
let observer122=null;

function sessionUser122(){
  try{if(currentUser?.id)return String(currentUser.id)}catch{}
  try{if(ctSession?.user?.id)return String(ctSession.user.id)}catch{}
  try{const raw=localStorage.getItem('cinetracker_session'),s=raw?JSON.parse(raw):null;return s?.user?.id?String(s.user.id):''}catch{return''}
}
function readHomeCache122(){try{const raw=localStorage.getItem(HOME_CACHE_122);if(!raw)return null;const s=JSON.parse(raw),uid=sessionUser122();if(!s?.data)return null;if(uid&&s.uid&&String(s.uid)!==uid)return null;if(Date.now()-Number(s.at||0)>7*86400000)return null;return s.data}catch{return null}}
function saveHomeCache122(data){if(!data||typeof data!=='object')return;window.__ct0994PreloadedHome=data;try{localStorage.setItem(HOME_CACHE_122,JSON.stringify({uid:sessionUser122(),at:Date.now(),data}))}catch{}}
function mapHomeFallback122(dash){
  const rows=Array.isArray(dash)?dash:[];
  const series=rows.filter(x=>mediaType122(x)==='tv'&&(x.is_watchlist||x.is_in_progress||x.is_up_to_date||x.is_completed||Number(x.watched_episodes||0)>0)).map(x=>{
    const watched=Number(x.watched_episodes||0),released=Number(x.released_episodes||x.total_episodes||x?.raw_tmdb?.number_of_episodes||0);let bucket='dust';
    if(x.is_completed)bucket='completed';else if(x.is_up_to_date)bucket='up_to_date';else if(x.is_in_progress||watched>0)bucket='continue';else if(x.is_watchlist)bucket='not_started';
    return{media_id:Number(x.media_id||x.id||0),tmdb_id:effectiveId122(x)||null,media_type:'tv',title:x.title||x?.raw_tmdb?.original_name||x?.raw_tmdb?.name||'Série',poster_path:null,watched_episodes:watched,released_episodes:released,last_watched_at:x.last_watched_at||null,home_bucket:bucket};
  });
  const movie_watchlist=rows.filter(x=>mediaType122(x)==='movie'&&x.is_watchlist&&!x.is_seen).map(x=>({media_id:Number(x.media_id||x.id||0),tmdb_id:effectiveId122(x)||null,media_type:'movie',title:x.title||x?.raw_tmdb?.original_title||x?.raw_tmdb?.title||'Filme',poster_path:null,release_year:Number(x.release_year||year122(x))||null,runtime_minutes:Number(x.runtime_minutes||x?.raw_tmdb?.runtime||0)||null,overview:x?.raw_tmdb?.overview||null}));
  return{series,movie_watchlist,history_episodes:[],history_movies:[],_ct122_fallback:true};
}
async function dashboard122(){if(!rawRpc122)return[];try{return await Promise.race([Promise.resolve(rawRpc122('cinetracker_profile_media_dashboard_v0991',{})),new Promise((_,r)=>setTimeout(()=>r(new Error('dashboard timeout')),4500))])||[]}catch{return[]}}
async function homeFallbackPayload122(){if(homeFallback122)return homeFallback122;const cached=readHomeCache122();if(cached)return(homeFallback122=cached);const dash=await dashboard122();return(homeFallback122=mapHomeFallback122(dash))}
if(rawRpc122){
  const rpc122=async function(name,body={}){
    if(name!==HOME_RPC_122)return rawRpc122(name,body);
    const cached=readHomeCache122();if(cached){homeFallback122=cached;return cached}
    const source=Promise.resolve(rawRpc122(name,body)).then(data=>{if(data)saveHomeCache122(data);return data});
    const fallback=new Promise(resolve=>setTimeout(()=>void homeFallbackPayload122().then(data=>{saveHomeCache122(data);resolve(data)}),1800));
    try{return await Promise.race([source,fallback])}catch{const data=await homeFallbackPayload122();saveHomeCache122(data);return data}
  };
  rpc122.__ct122HomeFast=true;
  try{sbRpc=rpc122}catch{}window.sbRpc=rpc122;
}

function unwrapEx122(v){let x=v;if(typeof x==='string'){try{x=JSON.parse(x)}catch{}}if(x&&typeof x==='object'&&'data'in x&&x.data!=null)x=x.data;if(Array.isArray(x)&&x.length===1)x=x[0];return x&&typeof x==='object'?x:null}
function addAlias122(set,type,title,yr){const n=norm122(title);if(!n)return;set.add(`${type}:${n}:${Number(yr||0)||0}`)}
async function knownContext122(force=false){
  if(!force&&known122&&Date.now()-knownAt122<45000)return known122;
  const [dash,exRaw]=await Promise.all([dashboard122(),rawRpc122?Promise.resolve(rawRpc122('cinetracker_discovery_exclusions_v0994',{})).catch(()=>null):null]);
  const ex=unwrapEx122(exRaw)||{},movieIds=new Set((ex.movie_ids||[]).map(Number)),tvIds=new Set((ex.tv_ids||[]).map(Number)),aliases=new Set();
  for(const a of ex.aliases||[]){const type=a?.media_type==='movie'?'movie':'tv';for(const t of [a?.title,a?.localized_title,a?.localized_name,a?.original_title,a?.original_name])addAlias122(aliases,type,t,0)}
  for(const x of dash||[]){if(!(x?.is_watchlist||x?.is_seen||x?.is_in_progress||x?.is_up_to_date||x?.is_completed||Number(x?.watched_episodes||0)>0||x?.last_watched_at))continue;const type=mediaType122(x),id=effectiveId122(x),yr=Number(x.release_year||year122(x))||0,raw=x.raw_tmdb||{};if(id>0)(type==='movie'?movieIds:tvIds).add(id);for(const t of [x.title,raw.title,raw.name,raw.original_title,raw.original_name]){addAlias122(aliases,type,t,yr);if(!yr)addAlias122(aliases,type,t,0)}}
  known122={movieIds,tvIds,aliases,dashboard:dash||[]};knownAt122=Date.now();return known122;
}
function isKnownCard122(card,ctx){const open=$122('[data-ct121-open]',card);if(!open)return false;const [type0,id0]=String(open.dataset.ct121Open||'').split(':'),type=type0==='movie'?'movie':'tv',id=Number(id0||0);if(id>0&&(type==='movie'?ctx.movieIds:ctx.tvIds).has(id))return true;const title=norm122($122('.ct121-card-body b',card)?.textContent||''),yr=Number(String($122('.ct121-card-body small',card)?.textContent||'').match(/(?:19|20)\d{2}/)?.[0]||0);return Boolean(title&&(ctx.aliases.has(`${type}:${title}:${yr}`)||ctx.aliases.has(`${type}:${title}:0`)))}
async function filterDiscover122(){
  if(filterBusy122||calendarMine122)return;const root=$122('#ct120-page[data-ct120-route="discover"] [data-ct121-results]');if(!root)return;filterBusy122=true;
  try{const ctx=await knownContext122();for(const card of $$122('.ct121-card',root)){if(isKnownCard122(card,ctx))card.remove()}for(const box of $$122('.ct121-carousel,.ct121-grid,.ct121-list,.ct121-calrow',root)){if(!box.querySelector('.ct121-card')&&!box.querySelector('.ct121-empty'))box.innerHTML='<div class="ct121-empty">Nenhum título novo elegível nesta categoria.</div>'}}finally{filterBusy122=false}
}
function toast122(text){document.querySelector('.ct122-toast')?.remove();const t=document.createElement('div');t.className='ct122-toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function decorateWatch122(){
  const discover=$122('#ct120-page[data-ct120-route="discover"]');if(!discover)return;
  for(const card of $$122('.ct121-card',discover)){if(card.querySelector('.ct122-watch'))continue;const open=$122('[data-ct121-open]',card);if(!open)continue;const mine=card.dataset.ct122InWatchlist==='1',b=document.createElement('button');b.type='button';b.className='ct122-watch'+(mine?' on':'');b.dataset.ct122Watch='1';b.textContent=mine?'− Watchlist':'+ Watchlist';b.title=mine?'Remover da Watchlist':'Adicionar à Watchlist';card.appendChild(b)}
}
async function watchAction122(button){
  const card=button.closest('.ct121-card'),open=$122('[data-ct121-open]',card);if(!card||!open||!rawQuick122)return;const [type,id]=String(open.dataset.ct121Open).split(':');button.disabled=true;
  try{const was=card.dataset.ct122InWatchlist==='1',ok=await rawQuick122({action:'watchlist',type:type==='movie'?'movie':'tv',tmdbId:Number(id),button:null});if(ok){known122=null;knownAt122=0;card.remove();toast122(was?'Removido da Watchlist':'Adicionado à Watchlist');if(!calendarMine122)void filterDiscover122()}}finally{button.disabled=false}
}

async function tmdb122(path){const base=supabase122();if(!base)throw new Error('Supabase URL indisponível');const u=new URL(`${base}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');const r=await Promise.race([fetch(u,{headers:auth122()}),new Promise((_,rej)=>setTimeout(()=>rej(new Error('TMDB timeout')),7000))]);if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}
function trustedRaw122(row){const raw=row?.raw_tmdb||{};return exact122(row,raw)?raw:null}
function dateInRange122(ds,start,end){if(!ds)return false;const d=new Date(`${ds}T12:00:00`);return Number.isFinite(d.getTime())&&d>=start&&d<=end}
async function watchlistCalendarItems122(){
  const ctx=await knownContext122(),rows=(ctx.dashboard||[]).filter(x=>x?.is_watchlist),today=new Date();today.setHours(0,0,0,0);const end=new Date(today);end.setDate(end.getDate()+180);const out=[],needs=[];
  for(const row of rows){const type=mediaType122(row),raw=trustedRaw122(row);if(type==='movie'){const ds=raw?.release_date;if(dateInRange122(ds,today,end))out.push({id:effectiveId122(row),media_type:'movie',title:raw.title||raw.original_title||row.title,poster_path:raw.poster_path||row.poster_path||null,release_date:ds,_row:row})}else{const n=raw?.next_episode_to_air,ds=n?.air_date||((Number(row.watched_episodes||0)===0)?raw?.first_air_date:null);if(dateInRange122(ds,today,end))out.push({id:effectiveId122(row),media_type:'tv',name:raw.name||raw.original_name||row.title,poster_path:raw.poster_path||row.poster_path||null,first_air_date:ds,_next:n||null,_row:row});else if(effectiveId122(row)>0&&(row.is_in_progress||row.is_up_to_date))needs.push(row)}}
  for(let i=0;i<Math.min(needs.length,32);i+=8){const chunk=needs.slice(i,i+8),got=await Promise.all(chunk.map(async row=>{try{const d=await tmdb122(`/tv/${effectiveId122(row)}`);if(!exact122(row,d))return null;const n=d.next_episode_to_air;if(!dateInRange122(n?.air_date,today,end))return null;return{id:Number(d.id),media_type:'tv',name:d.name||d.original_name||row.title,poster_path:d.poster_path||null,first_air_date:n.air_date,_next:n,_row:row}}catch{return null}}));out.push(...got.filter(Boolean))}
  const seen=new Set();return out.filter(x=>x.id&&!seen.has(`${x.media_type}:${x.id}`)&&(seen.add(`${x.media_type}:${x.id}`),true)).sort((a,b)=>String(a.release_date||a.first_air_date).localeCompare(String(b.release_date||b.first_air_date)));
}
function calendarCard122(x){const type=mediaType122(x),p=x.poster_path,url=p?`${supabase122()}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=w342`:'';const label=type==='movie'?'Filme':x._next?`S${String(x._next.season_number).padStart(2,'0')}E${String(x._next.episode_number).padStart(2,'0')}`:'Série';return `<article class="ct121-card" data-ct122-in-watchlist="1"><button type="button" class="ct121-open" data-ct121-open="${type}:${Number(x.id)}"><div class="ct121-poster"${url?` style="background-image:url('${url}')"`:''}></div><div class="ct121-card-body"><b>${esc122(x.title||x.name||'Sem título')}</b><small>${esc122(label)}</small></div></button></article>`}
async function renderMineCalendar122(){
  const host=$122('#ct120-page[data-ct120-route="discover"] [data-ct121-results]');if(!host)return;calendarMine122=true;host.innerHTML='<div class="ct121-loading">Carregando lançamentos da sua Watchlist…</div>';
  try{const rows=await watchlistCalendarItems122(),groups={};for(const x of rows){const d=x.release_date||x.first_air_date;if(d)(groups[d]||(groups[d]=[])).push(x)}host.innerHTML=`<div class="ct121-calendar">${Object.entries(groups).map(([d,list])=>`<section class="ct121-calday"><h3>${new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct121-calrow">${list.map(calendarCard122).join('')}</div></section>`).join('')||'<div class="ct122-calendar-empty">Nenhum filme, estreia de série ou próximo episódio da sua Watchlist encontrado nos próximos 180 dias.</div>'}</div>`;decorateWatch122()}catch(e){host.innerHTML=`<div class="ct121-error">Não foi possível carregar o calendário da Watchlist.<br><small>${esc122(e?.message||e)}</small></div>`}
}
function syncCalendarFilter122(){
  const root=$122('#ct120-page[data-ct120-route="discover"] .ct121-discover');if(!root)return;const active=$122('.ct121-tab.active',root)?.dataset?.ct121Tab||'';const typeRow=$122('.ct121-filter-group .ct121-filter-row',root);let mine=$122('[data-ct122-calendar-watch]',root);
  if(active==='calendar'){if(typeRow&&!mine){mine=document.createElement('button');mine.type='button';mine.className='ct121-chip';mine.dataset.ct122CalendarWatch='1';mine.textContent='Minha Watchlist';typeRow.appendChild(mine)}if(mine)mine.classList.toggle('active',calendarMine122)}else{calendarMine122=false;mine?.remove()}
}

function navKey122(el){const d=String(el?.dataset?.ct120Nav||el?.dataset?.view||el?.dataset?.view99||el?.dataset?.view991||'').toLowerCase();if(['home','discover','profile','settings'].includes(d))return d;const t=norm122(el?.textContent||'');if(t.includes('home'))return'home';if(t.includes('descobrir'))return'discover';if(t.includes('perfil'))return'profile';if(t.includes('config'))return'settings';if(t.includes('histor'))return'history';return''}
function cleanNav122(){
  for(const wrap of $$122('.sidebar,.content')){const navs=$$122(':scope>.mobile-nav,:scope>.nav,:scope .sidebar>.nav',wrap);if(wrap.classList.contains('content')&&navs.filter(n=>n.classList.contains('mobile-nav')).length>1){const ms=navs.filter(n=>n.classList.contains('mobile-nav'));ms.slice(0,-1).forEach(n=>n.remove())}}
  for(const nav of $$122('.sidebar .nav,.mobile-nav')){const seen=new Set();for(const el of $$122('button,a',nav)){const k=navKey122(el);if(k==='history'){el.remove();continue}if(!k)continue;if(seen.has(k)){el.remove();continue}seen.add(k)}}
}
function cleanVersion122(){for(const el of $$122('.ct120-version,.ct994-version,.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,[class*="version"],footer')){const t=String(el.textContent||'').trim();if(!/cinetracker/i.test(t)||!/\d+\.\d+\.\d+/.test(t))continue;if(el.classList.contains('ct120-version')){el.textContent=`CineTracker • v${VERSION122}`;continue}if(!t.includes(VERSION122))el.remove()}}
function cleanProfileLegacy122(){
  const page=$122('#ct120-page[data-ct120-route="profile"]'),content=$122('.content',page),host=$122('#ct120-profile',page);if(!page||!content||!host)return;
  for(const child of [...content.children]){if(child===host||child.matches('h1,p,.mobile-nav,.ct120-version'))continue;child.remove()}
  const body=$122(':scope>.ct120-page',host);if(!body)return;const allowed=new Set(['basic','series','movies','series-favorites','movie-favorites','actors','daily','extras']);for(const el of $$122(':scope>[data-ct120-slot]',body))if(!allowed.has(el.dataset.ct120Slot||''))el.remove();
  for(const h of $$122('h2,h3,h4',page)){const t=norm122(h.textContent||'');if(t!=='tempo de tela'&&t!=='historico')continue;const panel=h.closest('section,.ct99-panel,.ct991-panel,.ct115-panel,.ct116-panel,.ct117-panel,.panel');if(panel&&!panel.closest('[data-ct120-slot="series"],[data-ct120-slot="movies"]'))panel.remove()}
  for(const key of ['series','movies']){const section=$122(`[data-ct120-slot="${key}"]`,body),row=$122('.ct120-row',section);if(!section||!row)continue;section.querySelector('.ct121-history-toggle')?.remove();section.querySelector('.ct121-history-note')?.remove();const cards=$$122(':scope>.ct120-card',row);cards.forEach((c,i)=>c.hidden=i>=10);let more=$122(':scope>.ct122-more-card',row);if(cards.length>10){if(!more){more=document.createElement('button');more.type='button';more.className='ct122-more-card';more.dataset.ct122ProfileMore=key;row.appendChild(more)}more.innerHTML=`<span><b>Ver mais</b><small>${(cards.length-10).toLocaleString('pt-BR')} itens restantes</small></span>`}else more?.remove()}
}
function openProfileMore122(button){const section=button.closest('[data-ct120-slot]'),row=$122('.ct120-row',section);if(!section||!row)return;const cards=$$122(':scope>.ct120-card',row),title=$122('.ct120-head h2',section)?.textContent||'Itens';document.querySelector('.ct122-more-overlay')?.remove();const o=document.createElement('div');o.className='ct122-more-overlay';const box=document.createElement('div');box.className='ct122-more-box';box.innerHTML=`<div class="ct122-more-head"><h2>${esc122(title)}</h2><button type="button" class="ct122-close">Fechar</button></div><div class="ct122-more-grid"></div>`;const grid=$122('.ct122-more-grid',box);for(const card of cards){const c=card.cloneNode(true);c.hidden=false;grid.appendChild(c)}o.appendChild(box);document.body.appendChild(o);$122('.ct122-close',o).onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()}}

function fit122(){document.documentElement.style.overflowX='hidden';document.body.style.overflowX='hidden';cleanNav122();cleanVersion122();cleanProfileLegacy122();syncCalendarFilter122();decorateWatch122();void filterDiscover122()}
function schedule122(){clearTimeout(cleanTimer122);cleanTimer122=setTimeout(fit122,45)}

document.addEventListener('click',e=>{
  const w=e.target.closest?.('[data-ct122-watch]');if(w){e.preventDefault();e.stopImmediatePropagation();void watchAction122(w);return}
  const mine=e.target.closest?.('[data-ct122-calendar-watch]');if(mine){e.preventDefault();e.stopImmediatePropagation();calendarMine122=true;$$122('[data-ct121-type]',mine.closest('.ct121-filter-group')).forEach(x=>x.classList.remove('active'));mine.classList.add('active');void renderMineCalendar122();return}
  const type=e.target.closest?.('[data-ct121-type]');if(type){calendarMine122=false;setTimeout(schedule122,0);return}
  const tab=e.target.closest?.('[data-ct121-tab]');if(tab){calendarMine122=false;setTimeout(schedule122,0);return}
  const more=e.target.closest?.('[data-ct122-profile-more]');if(more){e.preventDefault();e.stopImmediatePropagation();openProfileMore122(more);return}
},true);
window.addEventListener('cinetracker:data-changed',()=>{homeFallback122=null;known122=null;knownAt122=0;setTimeout(schedule122,80)});
window.addEventListener('resize',schedule122,{passive:true});
window.addEventListener('focus',schedule122);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule122()});
const app122=$122('#app');if(app122){observer122=new MutationObserver(schedule122);observer122.observe(app122,{childList:true,subtree:true})}
for(const d of [0,120,420,1000,2200])setTimeout(schedule122,d);
})();

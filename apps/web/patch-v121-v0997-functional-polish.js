(() => {
'use strict';
if (window.__ct0997Functional121Loaded) return;
window.__ct0997Functional121Loaded = true;
window.__ct0997Functional121 = 'v121-functional-polish-no-refactor';
window.__ctWebBuild = '0.99.7';

const VERSION121 = '0.99.7';
const PROFILE_ORDER121 = ['basic','series','movies','series-favorites','movie-favorites','actors','daily','extras'];
const DISCOVER_TABS121 = [
  ['foryou','Pra Você'],['trending','Em alta'],['anticipated','Mais aguardados'],
  ['popular','Populares'],['top','Mais bem avaliados'],['calendar','Calendário']
];
const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
const norm = v => String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanTitle = v => String(v||'').replace(/\s*\((?:18|19|20)\d{2}\)\s*$/,'').trim();
const baseNavigate121 = typeof window.__ct0994Navigate === 'function' ? window.__ct0994Navigate.bind(window) : null;
const baseOpenDetail121 = typeof window.__ct0994OpenDetail === 'function' ? window.__ct0994OpenDetail.bind(window) : null;
const baseRpc121 = typeof window.sbRpc === 'function' ? window.sbRpc.bind(window) : null;
const baseSb121 = typeof window.sbApi === 'function' ? window.sbApi.bind(window) : null;
const supabaseUrl121 = () => {
  try { if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) return SUPABASE_URL; } catch {}
  return window.SUPABASE_URL || '';
};
const auth121 = () => { try { return typeof authHeaders === 'function' ? authHeaders() : {}; } catch { return {}; } };
const yearOf = x => Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)) || Number(x?.release_year||0) || 0;
const scoreOf = x => Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);
const posterOf = x => x?.poster_path || x?.raw_tmdb?.poster_path || null;
const img = (p,size='w342') => p ? `${supabaseUrl121()}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${encodeURIComponent(size)}` : '';
const isAnime = x => {
  const raw=x?.raw_tmdb||x||{}, genres=(raw.genre_ids||raw.genres?.map(g=>Number(g.id))||[]).map(Number), countries=raw.origin_country||[];
  return String(x?.media_kind||'').toLowerCase()==='anime' || (genres.includes(16)&&countries.includes('JP'));
};
const mediaType = x => x?.media_type === 'movie' ? 'movie' : 'tv';
const names = x => [x?.title,x?.name,x?.original_title,x?.original_name].map(norm).filter(Boolean);
const exactCandidate = (row,x) => {
  const want=norm(cleanTitle(row?.title||''));
  if (!want || !names(x).includes(want)) return false;
  const a=Number(row?.release_year||0), b=yearOf(x);
  return !(a>0&&b>0&&a!==b);
};

const css=document.createElement('style');
css.id='ct0997-functional121-style';
css.textContent=`
.ct121-fav-badge{position:absolute;top:7px;right:7px;z-index:5;width:24px;height:24px;border-radius:999px;display:grid;place-items:center;background:#090f15dc;border:1px solid #74405a;color:#ff7fae;font-size:15px;pointer-events:none}
.ct121-history-toggle{border:1px solid #2b5369;background:#091b25;color:#dff6ff;border-radius:999px;padding:7px 10px;font-size:9px;cursor:pointer;white-space:nowrap}
.ct121-history-note{font-size:9px;color:#7892a4;margin:-2px 0 8px}
.ct121-discover{display:grid;gap:12px}.ct121-discover-top{display:flex;gap:9px;align-items:flex-start;justify-content:space-between}.ct121-tabs{display:flex;gap:7px;overflow-x:auto;padding-bottom:8px;flex:1}
.ct121-tab,.ct121-chip,.ct121-filter-btn{white-space:nowrap;border:1px solid #284b61;background:#0a161f;color:#d7e7f0;border-radius:999px;padding:8px 11px;cursor:pointer;font-size:10px}.ct121-tab.active,.ct121-chip.active{background:linear-gradient(135deg,#16405d,#23668f);border-color:#58afe0;color:#fff}
.ct121-filter{position:relative}.ct121-filter-btn{border-radius:10px}.ct121-filter-panel{display:none;position:absolute;right:0;top:calc(100% + 6px);z-index:20000;width:min(430px,86vw);border:1px solid #315a72;background:#061018f8;border-radius:13px;padding:12px;box-shadow:0 20px 60px #000b}.ct121-filter-panel.open{display:grid;gap:12px}.ct121-filter-group b{display:block;font-size:10px;margin-bottom:7px}.ct121-filter-row{display:flex;gap:6px;flex-wrap:wrap}
.ct121-section{border:1px solid #1d3c4e;background:linear-gradient(145deg,#071119,#091721);border-radius:15px;padding:13px;min-width:0}.ct121-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.ct121-head h2{margin:0;font-size:16px}.ct121-head small{color:#7892a4;font-size:9px}.ct121-rule{color:#718b9c;font-size:9px;margin:-4px 0 9px}
.ct121-carousel{display:grid;grid-auto-flow:column;grid-auto-columns:142px;gap:10px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}.ct121-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,152px));gap:10px}.ct121-list{display:grid;gap:8px}
.ct121-card{position:relative;border:1px solid #203f52;background:#0a141b;border-radius:13px;overflow:hidden;min-width:0;scroll-snap-align:start;color:#fff}.ct121-open{display:block;width:100%;padding:0;border:0;background:transparent;color:#fff;text-align:left;cursor:pointer}.ct121-poster{aspect-ratio:2/3;background:#101d26 center/cover no-repeat}.ct121-card-body{padding:8px}.ct121-card-body b{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct121-card-body small{display:block;margin-top:4px;color:#7892a4;font-size:9px}.ct121-list .ct121-card{display:grid;grid-template-columns:64px minmax(0,1fr);min-height:92px}.ct121-list .ct121-open{display:contents}.ct121-list .ct121-poster{width:64px;height:92px;aspect-ratio:auto}.ct121-list .ct121-card-body{align-self:center;padding:10px}
.ct121-empty,.ct121-loading,.ct121-error{border:1px dashed #294b60;border-radius:12px;padding:16px;color:#7892a4;background:#07121a;text-align:center}.ct121-error{border-style:solid;border-color:#643447;color:#ffc0d0;background:#1b0d14}.ct121-retry{margin-top:10px;border:1px solid #315f78;background:#0a1b25;color:#fff;border-radius:10px;padding:8px 11px;cursor:pointer}
.ct121-calendar{display:grid;gap:10px}.ct121-calday{border:1px solid #203e51;background:#08151d;border-radius:13px;padding:10px}.ct121-calday h3{font-size:12px;margin:0 0 8px}.ct121-calrow{display:grid;grid-auto-flow:column;grid-auto-columns:135px;gap:9px;overflow-x:auto}.ct121-cal-label{font-size:8px;color:#76c8ed;margin-top:4px}
@media(max-width:800px){.ct121-carousel{grid-auto-columns:132px}.ct121-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:520px){.ct121-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ct121-filter-panel{position:fixed;left:10px;right:10px;top:110px;width:auto}}
`;
document.getElementById(css.id)?.remove();
document.head.appendChild(css);

let discoverTab121='foryou', discoverType121='all', discoverView121='carousel';
let exclusions121=null, dashboard121=null, discoveryLoad121=null;
const tabCache121=new Map();
const reveal121={series:false,movies:false};
let observer121=null, cleanTimer121=null, hydrateTimer121=null, hydrateBusy121=false;

async function withTimeout(p,ms=9000,label='TIMEOUT'){
  return Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error(label)),ms))]);
}
async function rpc121(name,body={}){ if(!baseRpc121) throw new Error('RPC indisponível'); return withTimeout(Promise.resolve(baseRpc121(name,body)),9000,`${name}: timeout`); }
async function sb121(path,options={}){ if(!baseSb121) throw new Error('Supabase indisponível'); return withTimeout(Promise.resolve(baseSb121(path,options)),9000,'Supabase: timeout'); }
async function api121(path,params={}){
  const base=supabaseUrl121(); if(!base) throw new Error('Supabase URL indisponível');
  const u=new URL(`${base}/functions/v1/tmdb-proxy`); u.searchParams.set('path',path); u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');
  Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));
  const r=await withTimeout(fetch(u,{headers:auth121()}),8000,'TMDB: timeout');
  if(!r.ok) throw new Error(`TMDB ${r.status}`); return r.json();
}
async function safeApi121(path,params={}){ try{return await api121(path,params)}catch{return{results:[]}} }
function uniq121(rows){const seen=new Set();return (rows||[]).filter(x=>{const k=`${mediaType(x)}:${Number(x?.id||0)}`;if(!x?.id||seen.has(k))return false;seen.add(k);return true})}
function unwrapExclusions121(v){let x=v;if(typeof x==='string'){try{x=JSON.parse(x)}catch{}}if(x&&typeof x==='object'&&'data'in x&&x.data!=null)x=x.data;if(Array.isArray(x)&&x.length===1)x=x[0];if(!x||!Array.isArray(x.movie_ids)||!Array.isArray(x.tv_ids))return null;return{movie_ids:x.movie_ids.map(Number),tv_ids:x.tv_ids.map(Number),aliases:Array.isArray(x.aliases)?x.aliases:[]}}
function known121(x){return Boolean(x?.is_watchlist||x?.is_seen||x?.is_in_progress||x?.is_up_to_date||x?.is_completed||Number(x?.watched_episodes||0)>0||x?.last_watched_at)}
function exclusionsFromDashboard121(dash){const movie_ids=[],tv_ids=[],aliases=[];for(const x of (dash||[]).filter(known121)){const type=mediaType(x),id=Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||0),raw=x?.raw_tmdb||{};if(id>0)(type==='movie'?movie_ids:tv_ids).push(id);aliases.push({media_type:type,title:x?.title||null,localized_title:raw.title||null,localized_name:raw.name||null,original_title:raw.original_title||null,original_name:raw.original_name||null})}return{movie_ids:[...new Set(movie_ids)],tv_ids:[...new Set(tv_ids)],aliases}}
function blocker121(ex){const movies=new Set((ex?.movie_ids||[]).map(Number)),tv=new Set((ex?.tv_ids||[]).map(Number)),aliases=new Set();for(const a of ex?.aliases||[]){const type=a?.media_type==='movie'?'movie':'tv';for(const v of [a?.title,a?.localized_title,a?.localized_name,a?.original_title,a?.original_name]){const n=norm(v);if(n)aliases.add(`${type}:${n}`)}}return x=>{const type=mediaType(x),id=Number(x?.id||0);if(id>0&&(type==='movie'?movies:tv).has(id))return true;return names(x).some(n=>aliases.has(`${type}:${n}`))}}
async function ensureDiscoveryContext121(){
  if(exclusions121&&dashboard121)return;
  if(discoveryLoad121)return discoveryLoad121;
  discoveryLoad121=(async()=>{
    dashboard121=await rpc121('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]);
    let ex=null; try{ex=unwrapExclusions121(await rpc121('cinetracker_discovery_exclusions_v0994',{}))}catch{}
    exclusions121=ex||exclusionsFromDashboard121(dashboard121||[]);
  })().finally(()=>discoveryLoad121=null);
  return discoveryLoad121;
}
function favoriteGenres121(){const counts=new Map();for(const x of dashboard121||[]){if(!known121(x)&&!x?.is_favorite)continue;const raw=x?.raw_tmdb||{},ids=(raw.genre_ids||raw.genres?.map(g=>g.id)||[]).map(Number).filter(Boolean);for(const id of ids)counts.set(id,(counts.get(id)||0)+(x?.is_favorite?3:1))}return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>id)}
async function paged121(path,baseParams,type,pages=3){const jobs=[];for(let p=1;p<=pages;p++)jobs.push(safeApi121(path,{...baseParams,page:p}));const data=await Promise.all(jobs);return uniq121(data.flatMap(d=>(d?.results||[]).map(x=>({...x,media_type:type}))));}
function eligible121(rows,{anime=null,minYear=0,minScore=0}={}){const blocked=blocker121(exclusions121||{});return uniq121(rows).filter(x=>!blocked(x)&&(minYear?yearOf(x)>=minYear:true)&&(minScore?scoreOf(x)>=minScore:true)&&(anime===true?isAnime(x):anime===false?!isAnime(x):true));}
async function loadTab121(tab){
  await ensureDiscoveryContext121(); if(tabCache121.has(tab))return tabCache121.get(tab);
  const today=new Date(),future=new Date(today);future.setDate(future.getDate()+240);const fmt=d=>d.toISOString().slice(0,10); let value;
  if(tab==='foryou'){
    const genres=favoriteGenres121(), withGenres=genres.length?genres.join('|'):undefined;
    const [m,t,a]=await Promise.all([
      paged121('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':80,with_genres:withGenres,include_adult:false},'movie',4),
      paged121('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':60,with_genres:withGenres,include_adult:false},'tv',4),
      paged121('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':35,include_adult:false},'tv',4)
    ]);
    const movies=eligible121(m,{anime:false,minYear:1990,minScore:7}).slice(0,30), series=eligible121(t,{anime:false,minYear:1990,minScore:7}).slice(0,30), anime=eligible121(a,{anime:true,minYear:1990,minScore:7}).slice(0,30);
    const daily=[...movies,...series,...anime].sort((x,y)=>scoreOf(y)-scoreOf(x)||Number(y.popularity||0)-Number(x.popularity||0))[0]||null;
    value={daily,movies,series,anime,genres};
  } else if(tab==='trending'){
    const [m,t]=await Promise.all([paged121('/trending/movie/week',{},'movie',3),paged121('/trending/tv/week',{},'tv',3)]); value=eligible121([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,100);
  } else if(tab==='popular'){
    const [m,t]=await Promise.all([paged121('/movie/popular',{},'movie',4),paged121('/tv/popular',{},'tv',4)]); value=eligible121([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,100);
  } else if(tab==='top'){
    const [m,t]=await Promise.all([paged121('/movie/top_rated',{},'movie',4),paged121('/tv/top_rated',{},'tv',4)]); value=eligible121([...m,...t],{minYear:1980}).sort((a,b)=>scoreOf(b)-scoreOf(a)||Number(b.vote_count||0)-Number(a.vote_count||0)).slice(0,100);
  } else if(tab==='anticipated'){
    const [m,t]=await Promise.all([
      paged121('/discover/movie',{'primary_release_date.gte':fmt(today),'primary_release_date.lte':fmt(future),sort_by:'popularity.desc',include_adult:false},'movie',4),
      paged121('/discover/tv',{'first_air_date.gte':fmt(today),'first_air_date.lte':fmt(future),sort_by:'popularity.desc',include_adult:false},'tv',4)
    ]); value=eligible121([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,100);
  } else if(tab==='calendar'){
    const near=new Date(today);near.setDate(near.getDate()+60);
    const [m,t]=await Promise.all([
      paged121('/discover/movie',{'primary_release_date.gte':fmt(today),'primary_release_date.lte':fmt(near),sort_by:'primary_release_date.asc',include_adult:false},'movie',3),
      paged121('/discover/tv',{'first_air_date.gte':fmt(today),'first_air_date.lte':fmt(near),sort_by:'first_air_date.asc',include_adult:false},'tv',3)
    ]); value=eligible121([...m,...t]).filter(x=>x.release_date||x.first_air_date).sort((a,b)=>String(a.release_date||a.first_air_date).localeCompare(String(b.release_date||b.first_air_date))).slice(0,120);
  } else value=[];
  tabCache121.set(tab,value); return value;
}
function card121(x,label=''){const type=mediaType(x),p=posterOf(x),meta=[yearOf(x)||null,type==='movie'?'Filme':isAnime(x)?'Anime':'Série',scoreOf(x)>0?`★ ${scoreOf(x).toFixed(1)}`:null].filter(Boolean).join(' · ');return `<article class="ct121-card"><button type="button" class="ct121-open" data-ct121-open="${type}:${Number(x.id)}"><div class="ct121-poster"${p?` style="background-image:url('${img(p)}')"`:''}></div><div class="ct121-card-body"><b>${esc(x.title||x.name||x.original_title||x.original_name||'Sem título')}</b><small>${esc(meta)}</small>${label?`<div class="ct121-cal-label">${esc(label)}</div>`:''}</div></button></article>`}
function filter121(rows){if(discoverType121==='movie')return (rows||[]).filter(x=>mediaType(x)==='movie');if(discoverType121==='tv')return (rows||[]).filter(x=>mediaType(x)==='tv');return rows||[]}
function layout121(rows){const r=filter121(rows),cls=discoverView121==='list'?'ct121-list':discoverView121==='grid'?'ct121-grid':'ct121-carousel';return r.length?`<div class="${cls}">${r.map(x=>card121(x)).join('')}</div>`:'<div class="ct121-empty">Nenhum título novo elegível nesta categoria. Tente outro filtro.</div>'}
function tabs121(){return DISCOVER_TABS121.map(([k,l])=>`<button type="button" class="ct121-tab ${discoverTab121===k?'active':''}" data-ct121-tab="${k}">${l}</button>`).join('')}
function filters121(){return `<div class="ct121-filter"><button type="button" class="ct121-filter-btn" data-ct121-filter-toggle>☰ Filtros</button><div class="ct121-filter-panel" data-ct121-filter-panel><div class="ct121-filter-group"><b>Tipo</b><div class="ct121-filter-row"><button class="ct121-chip ${discoverType121==='all'?'active':''}" data-ct121-type="all">Todos</button><button class="ct121-chip ${discoverType121==='tv'?'active':''}" data-ct121-type="tv">Séries</button><button class="ct121-chip ${discoverType121==='movie'?'active':''}" data-ct121-type="movie">Filmes</button></div></div><div class="ct121-filter-group"><b>Visualização</b><div class="ct121-filter-row"><button class="ct121-chip ${discoverView121==='list'?'active':''}" data-ct121-view="list">Lista</button><button class="ct121-chip ${discoverView121==='carousel'?'active':''}" data-ct121-view="carousel">Carrossel</button><button class="ct121-chip ${discoverView121==='grid'?'active':''}" data-ct121-view="grid">Grade</button></div></div></div></div>`}
async function renderDiscoverResults121(force=false){
  const host=$('[data-ct121-results]'); if(!host)return; if(force)tabCache121.delete(discoverTab121); host.innerHTML='<div class="ct121-loading">Carregando títulos novos…</div>';
  try{
    const data=await loadTab121(discoverTab121); if(!$('[data-ct121-results]'))return;
    if(discoverTab121==='foryou'){
      const r=data||{}, daily=discoverType121==='tv'?'':`<section class="ct121-section"><div class="ct121-head"><h2>Indicação do dia</h2><small>100% nova</small></div><div class="ct121-rule">Nunca visto · fora da Watchlist · sem correspondência no seu histórico</div>${r.daily?`<div class="ct121-carousel">${card121(r.daily)}</div>`:'<div class="ct121-empty">Sem indicação elegível agora.</div>'}</section>`;
      const sections=[];if(discoverType121!=='tv')sections.push(`<section class="ct121-section"><div class="ct121-head"><h2>Filmes para você</h2><small>novos</small></div>${layout121(r.movies||[])}</section>`);if(discoverType121!=='movie'){sections.push(`<section class="ct121-section"><div class="ct121-head"><h2>Séries para você</h2><small>novas</small></div>${layout121(r.series||[])}</section>`);sections.push(`<section class="ct121-section"><div class="ct121-head"><h2>Animes para você</h2><small>novos</small></div>${layout121(r.anime||[])}</section>`)}host.innerHTML=daily+sections.join('');
    } else if(discoverTab121==='calendar'){
      const groups={};for(const x of filter121(data||[])){const ds=x.release_date||x.first_air_date;if(ds)(groups[ds]||(groups[ds]=[])).push(x)}
      host.innerHTML=`<div class="ct121-calendar">${Object.entries(groups).map(([d,list])=>`<section class="ct121-calday"><h3>${new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct121-calrow">${list.map(x=>card121(x,mediaType(x)==='movie'?'Filme':'Série')).join('')}</div></section>`).join('')||'<div class="ct121-empty">Nenhuma estreia nova elegível nos próximos 60 dias.</div>'}</div>`;
    } else host.innerHTML=layout121(data||[]);
  } catch(e){host.innerHTML=`<div class="ct121-error">Não foi possível montar o Descobrir agora.<br><small>${esc(e?.message||e)}</small><br><button class="ct121-retry" data-ct121-retry>Recarregar</button></div>`}
}
function bindDiscover121(root){
  root.onclick=e=>{
    const tab=e.target.closest('[data-ct121-tab]');if(tab){discoverTab121=tab.dataset.ct121Tab;$$('[data-ct121-tab]',root).forEach(x=>x.classList.toggle('active',x===tab));void renderDiscoverResults121(false);return}
    const type=e.target.closest('[data-ct121-type]');if(type){discoverType121=type.dataset.ct121Type;$$('[data-ct121-type]',root).forEach(x=>x.classList.toggle('active',x===type));void renderDiscoverResults121(false);return}
    const view=e.target.closest('[data-ct121-view]');if(view){discoverView121=view.dataset.ct121View;$$('[data-ct121-view]',root).forEach(x=>x.classList.toggle('active',x===view));void renderDiscoverResults121(false);return}
    const toggle=e.target.closest('[data-ct121-filter-toggle]');if(toggle){e.stopPropagation();$('[data-ct121-filter-panel]',root)?.classList.toggle('open');return}
    const open=e.target.closest('[data-ct121-open]');if(open){e.preventDefault();e.stopPropagation();const [type,id]=String(open.dataset.ct121Open).split(':');baseOpenDetail121?.(type,Number(id));return}
    if(e.target.closest('[data-ct121-retry]'))void renderDiscoverResults121(true);
  };
}
function installDiscover121(){
  const page=$('#ct120-page[data-ct120-route="discover"]'),host=$('#ct120-discover',page); if(!page||!host)return false; if(host.dataset.ct121Authority==='1')return true;
  host.dataset.ct121Authority='1';host.innerHTML=`<div class="ct121-discover"><div class="ct121-discover-top"><div class="ct121-tabs">${tabs121()}</div>${filters121()}</div><div data-ct121-results><div class="ct121-loading">Preparando Descobrir…</div></div></div>`;bindDiscover121(host);void renderDiscoverResults121(false);return true;
}

function profilePolish121(){
  const page=$('#ct120-page[data-ct120-route="profile"]'),host=$('#ct120-profile',page);if(!page||!host)return;
  const body=$(':scope>.ct120-page',host);if(!body)return;
  const slots=$$(':scope>[data-ct120-slot]',body);for(const el of slots)if(!PROFILE_ORDER121.includes(el.dataset.ct120Slot||''))el.remove();
  for(const key of PROFILE_ORDER121){const el=$(`[data-ct120-slot="${key}"]`,body);if(el)body.appendChild(el)}
  for(const key of ['series-favorites','movie-favorites']){const section=$(`[data-ct120-slot="${key}"]`,body);if(!section)continue;for(const card of $$('.ct120-card',section)){card.classList.add('ct121-favorite-card');if(!$('.ct121-fav-badge',card)){const h=document.createElement('span');h.className='ct121-fav-badge';h.textContent='♥';card.appendChild(h)}}}
  for(const key of ['series','movies']){
    const section=$(`[data-ct120-slot="${key}"]`,body),row=$('.ct120-row',section);if(!section||!row)continue;const cards=$$(':scope>.ct120-card',row),limit=12,hidden=Math.max(0,cards.length-limit),revealed=reveal121[key];cards.forEach((c,i)=>c.hidden=!revealed&&i>=limit);
    let btn=$('.ct121-history-toggle',section);if(hidden>0){if(!btn){btn=document.createElement('button');btn.type='button';btn.className='ct121-history-toggle';section.querySelector('.ct120-head')?.appendChild(btn)}btn.textContent=revealed?'Mostrar apenas recentes':`Ver histórico (${hidden})`;btn.onclick=()=>{reveal121[key]=!reveal121[key];profilePolish121()}}else btn?.remove();
    let note=$('.ct121-history-note',section);if(hidden>0&&!note){note=document.createElement('div');note.className='ct121-history-note';row.insertAdjacentElement('beforebegin',note)}if(note)note.textContent=revealed?'Histórico completo exibido dentro desta seção.':'Mostrando os mais recentes. O restante do histórico fica revelável aqui, sem bloco separado.';
  }
  const timeline=$('#ct120-timeline',body),today=$('.ct120-day.today',timeline);if(timeline&&today&&!timeline.dataset.ct121Centered){timeline.dataset.ct121Centered='1';requestAnimationFrame(()=>timeline.scrollLeft=Math.max(0,Math.min(timeline.scrollWidth-timeline.clientWidth,today.offsetLeft-(timeline.clientWidth-today.clientWidth)/2)))}
}
function profileRetry121(){const host=$('#ct120-page[data-ct120-route="profile"] #ct120-profile'),loading=$('.ct120-loading',host);if(!host||!loading||loading.dataset.ct121RetryScheduled==='1')return;loading.dataset.ct121RetryScheduled='1';setTimeout(()=>{if(!document.contains(loading)||!loading.matches('.ct120-loading'))return;if(!$('.ct121-retry',loading)){const b=document.createElement('button');b.className='ct121-retry';b.textContent='Tentar carregar novamente';b.onclick=()=>baseNavigate121?.('profile');loading.appendChild(document.createElement('br'));loading.appendChild(b)}},10000)}

function canonicalNavKey(el){const d=String(el?.dataset?.ct120Nav||el?.dataset?.view||'').toLowerCase();if(['home','discover','profile','settings'].includes(d))return d;const t=norm(el?.textContent||'');if(t.includes('home'))return'home';if(t.includes('descobrir'))return'discover';if(t.includes('perfil'))return'profile';if(t.includes('config'))return'settings';if(t.includes('histor'))return'history';return''}
function sanitizeChrome121(){
  for(const nav of $$('.sidebar .nav,.mobile-nav')){const seen=new Set();for(const el of $$('button,a',nav)){const key=canonicalNavKey(el);if(key==='history'){el.remove();continue}if(!key)continue;if(seen.has(key)){el.remove();continue}seen.add(key)}}
  for(const el of $$('small,span,p,footer,div')){if(el.childElementCount>0)continue;const t=String(el.textContent||'').trim();if(t.length>90||!/cinetracker/i.test(t))continue;if(/(?:0\.99\.[0-6]|0\.0\.9[0-8])/.test(t)&&!t.includes(VERSION121))el.remove()}
  const content=$('.content');if(content){const searches=$$('input[type="search"],input[placeholder*="Buscar" i]',content);if(searches.length>1){const keep=$('#ct118-search input',content)||$('#ct111-global-search input',content)||searches[0];for(const input of searches){if(input===keep)continue;const box=input.closest('#ct111-global-search,.ct111-search,.search,[class*="search"]')||input;box.style.display='none'}}}
}

function localId121(el){return Number(el?.dataset?.ct120OpenLocal||el?.dataset?.ct120Local||el?.dataset?.ct994Open||el?.dataset?.card991||el?.dataset?.mediaId||0)}
function holder121(el){return el.closest('.ct120-card,[data-ct120-local],.ct994-card,.ct991-card,article,li')||el.parentElement||el}
function titleTarget121(h){return $('[data-ct120-title],.ct994-title,.ct991-title,.title,.card-title,h3,h4,b',h)}
function posterTarget121(h){return $('.ct120-poster,.ct994-poster,.ct991-poster,.poster,.media-poster,img',h)}
function applyPoster121(el,path){if(!el||!path)return;const url=img(path,'w342');if(el.tagName==='IMG')el.src=url;else{el.style.backgroundImage=`url('${url}')`;el.style.backgroundSize='cover';el.style.backgroundPosition='center'}}
function rawSafe121(row){const raw=row?.raw_tmdb||{};return exactCandidate(row,raw)}
async function resolveRow121(row){
  const type=mediaType(row),id=Number(row?.tmdb_id||row?.raw_tmdb?.source_tmdb_id||row?.raw_tmdb?.id||0);if(id>0){try{const d=await api121(`/${type}/${id}`);if(exactCandidate(row,d))return{...d,media_type:type}}catch{}}
  const q=cleanTitle(row?.title||'');if(!q)return null;const params={query:q,include_adult:false,page:1},yr=Number(row?.release_year||0);if(yr>0)params[type==='movie'?'year':'first_air_date_year']=yr;const d=await safeApi121(`/search/${type}`,params),hits=(d?.results||[]).filter(x=>exactCandidate(row,x)).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));const hit=hits[0];if(!hit)return null;try{return{...(await api121(`/${type}/${Number(hit.id)}`)),media_type:type}}catch{return{...hit,media_type:type}}
}
async function hydrateVisible121(){
  if(hydrateBusy121||!baseSb121||$('#ct120-page[data-ct120-route="discover"]'))return;const nodes=[...new Set($$('[data-ct120-open-local],[data-ct120-local],[data-ct994-open],[data-card991]'))].filter(x=>{const r=x.getBoundingClientRect();return r.bottom>-300&&r.top<innerHeight+700}).slice(0,16),ids=[...new Set(nodes.map(localId121).filter(Boolean))];if(!ids.length)return;hydrateBusy121=true;
  try{const rows=await sb121(`media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb&id=in.(${ids.join(',')})`).catch(()=>[]),map=new Map((rows||[]).map(x=>[Number(x.id),x]));for(const node of nodes){const row=map.get(localId121(node));if(!row)continue;const h=holder121(node),tt=titleTarget121(h),pt=posterTarget121(h);if(tt&&row.title)tt.textContent=row.title;let safe=rawSafe121(row);if(safe&&posterOf(row))applyPoster121(pt,posterOf(row));if(!safe&&pt&&pt.tagName!=='IMG')pt.style.backgroundImage='';if(!safe||!posterOf(row)){let resolved=null;try{const cached=JSON.parse(sessionStorage.getItem(`ct121safe:${row.id}`)||'null');if(cached&&Date.now()-cached.t<86400000)resolved=cached.d}catch{}if(!resolved){resolved=await resolveRow121(row);if(resolved)try{sessionStorage.setItem(`ct121safe:${row.id}`,JSON.stringify({t:Date.now(),d:resolved}))}catch{}}if(resolved){if(tt)tt.textContent=resolved.title||resolved.name||row.title||tt.textContent;if(resolved.poster_path)applyPoster121(pt,resolved.poster_path)}}node.dataset.ct121Hydrated='1'}}finally{hydrateBusy121=false}}
function scheduleHydrate121(delay=120){clearTimeout(hydrateTimer121);hydrateTimer121=setTimeout(()=>void hydrateVisible121(),delay)}

function run121(){clearTimeout(cleanTimer121);cleanTimer121=setTimeout(()=>{sanitizeChrome121();if(!installDiscover121()){profilePolish121();profileRetry121();scheduleHydrate121(80)}},30)}
const app=$('#app');if(app){observer121=new MutationObserver(run121);observer121.observe(app,{childList:true,subtree:true})}
window.addEventListener('scroll',()=>scheduleHydrate121(160),{passive:true});
window.addEventListener('focus',run121);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')run121()});
window.addEventListener('cinetracker:data-changed',()=>{exclusions121=null;dashboard121=null;tabCache121.clear();run121()});
document.addEventListener('click',e=>{const panel=$('[data-ct121-filter-panel]');if(panel?.classList.contains('open')&&!e.target.closest('.ct121-filter'))panel.classList.remove('open')});
for(const d of [0,100,350,900,1800])setTimeout(run121,d);
})();

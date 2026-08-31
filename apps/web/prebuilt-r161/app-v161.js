(() => {
'use strict';
const SUPABASE_URL='https://pjmkxryboypluleuuupp.supabase.co';
const SUPABASE_KEY='sb_publishable_UERbQXkZk4rnnu6Y8XJSgw_vcZd_V_Q';
const REVISION='r161-release-guard';
window.__ctWebBuild='0.99.7';
window.__ctWebRevision=REVISION;
window.__ctRuntimeAuthority='single-clean-runtime';
let session=null,user=null,navSeq=0,homeCache=null,profileCache=null,discoverCache=new Map(),sportsCache=null;
const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const localDay=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const shiftDays=n=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return localDay(d)};
const tz=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}};
const headers=(extra={})=>({apikey:SUPABASE_KEY,...(session?.access_token?{Authorization:`Bearer ${session.access_token}`} : {}),...extra});
const img=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${encodeURIComponent(size)}`:'';
function saveSession(s){if(!s?.access_token)return;const exp=Number(s.expires_at||0)||Math.floor(Date.now()/1000)+Number(s.expires_in||3600);session={...s,expires_at:exp};user=s.user||user;localStorage.setItem('cinetracker_session',JSON.stringify(session))}
async function authRequest(path,body){const r=await fetch(`${SUPABASE_URL}/auth/v1/${path}`,{method:'POST',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(body||{})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.msg||d.message||d.error_description||d.error||`Auth ${r.status}`);return d}
async function restoreSession(){try{session=JSON.parse(localStorage.getItem('cinetracker_session')||'null')}catch{session=null}if(!session?.access_token)return false;try{if(session.expires_at&&session.expires_at<Math.floor(Date.now()/1000)+90&&session.refresh_token){const d=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token});saveSession(d)}const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:headers()});if(r.ok){user=await r.json();return true}if(r.status===401&&session.refresh_token){try{const d=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token});saveSession(d);user=d.user||user;return true}catch{}}if(r.status===401){localStorage.removeItem('cinetracker_session');session=null;user=null;return false}return true}catch{return true}}
async function login(email,password){const d=await authRequest('token?grant_type=password',{email,password});saveSession(d);user=d.user}
async function logout(){try{await authRequest('logout',{})}catch{}localStorage.removeItem('cinetracker_session');session=null;user=null;location.replace('/')}
async function api(path,options={}){if(!session?.access_token)throw new Error('Sessão necessária');const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:headers({'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})})});const text=await r.text();let d=null;if(text)try{d=JSON.parse(text)}catch{d=text}if(!r.ok)throw new Error(d?.message||d?.hint||d?.details||`Banco ${r.status}`);return d}
const rpc=(name,body={})=>api(`rpc/${name}`,{method:'POST',body:JSON.stringify(body||{})});
async function edge(name,body={},timeout=45000){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(`${SUPABASE_URL}/functions/v1/${name}`,{method:'POST',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(body),signal:c.signal});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||d?.message||`${name} ${r.status}`);return d}finally{clearTimeout(t)}}
async function tmdb(path,params={}){const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');for(const[k,v]of Object.entries(params))if(v!==null&&v!==undefined&&v!=='')u.searchParams.set(k,String(v));const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(u,{headers:headers(),signal:c.signal});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}finally{clearTimeout(t)}}
async function safeTmdb(path,params={}){try{return await tmdb(path,params)}catch{return{results:[]}}}
function route(){let p=location.pathname.replace(/\/+$/,'')||'/';if(p==='/')return session?'home':'auth';if(p==='/home')return'home';if(p==='/discover')return'discover';if(p==='/sports')return'sports';if(p==='/profile')return'profile';if(p==='/configs'||p==='/settings')return'configs';if(/^\/movie\/\d+$/.test(p))return'movie';if(/^\/(series|tv)\/\d+$/.test(p))return'series';if(/^\/person\/\d+$/.test(p))return'person';return session?'home':'auth'}
const pathFor=k=>k==='home'?'/home':k==='discover'?'/discover':k==='sports'?'/sports':k==='profile'?'/profile':'/configs';
function navHtml(active){return [['home','⌂ Home'],['discover','✦ Descobrir'],['sports','🏆 Esportes'],['profile','◉ Perfil'],['configs','⚙ Configurações']].map(([k,l])=>`<a href="${pathFor(k)}" data-nav="${k}" class="${active===k?'active':''}"${active===k?' aria-current="page"':''}>${l}</a>`).join('')}
function shell(title,subtitle,active,body,{search=true}={}){return `<div class="app" data-page="${active}"><aside class="sidebar"><div class="logo">CINE<span class="gold">TRACKER</span></div><div class="muted small">Filmes, séries, animes e esportes</div><nav class="nav">${navHtml(active)}</nav><div class="profile"><div class="small muted">${esc(user?.email||'Conta sincronizada')}</div><button class="logout-btn" type="button" data-logout>Sair</button></div></aside><main class="content">${search?`<div class="search-global"><span>⌕</span><input type="search" data-global-search placeholder="Buscar filmes, séries e atores..." autocomplete="off"><span data-search-clear style="cursor:pointer">×</span></div><div data-global-results></div>`:''}<header class="header"><div><div class="eyebrow">CineTracker</div><h1 class="h1">${esc(title)}</h1><p class="subtitle">${esc(subtitle)}</p></div></header>${body}<div class="version">CineTracker • v0.99.7 • ${REVISION}</div><nav class="mobile-nav">${navHtml(active)}</nav></main></div>`}
function setApp(html){const a=$('#app');if(a)a.innerHTML=html}
function go(path,replace=false){const dest=path.startsWith('/')?path:pathFor(path);if(location.pathname!==dest)history[replace?'replaceState':'pushState']({},'',dest);void render()}
function loading(text='Carregando...'){return `<div class="loader">${esc(text)}</div>`}
function fail(message,retryRoute){return `<div class="error">${esc(message)}${retryRoute?`<br><button class="btn retry" type="button" data-retry="${retryRoute}">Tentar novamente</button>`:''}</div>`}
function fmtMinutes(minutes){let h=Math.max(0,Math.floor(Number(minutes||0)/60)),months=Math.floor(h/720);h-=months*720;const days=Math.floor(h/24);h-=days*24;return `${months} ${months===1?'mês':'meses'} ${days} ${days===1?'dia':'dias'} ${h} ${h===1?'hora':'horas'}`}
function mediaTitle(x){return x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título'}
function mediaPoster(x){return x?.poster_path||x?.raw_tmdb?.poster_path||null}
function mediaTmdb(x){return Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0)||0}
function mediaType(x){return x?.media_type==='movie'?'movie':'tv'}
function mediaCard(x){const type=mediaType(x),id=mediaTmdb(x),p=mediaPoster(x),score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0,year=String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);return `<article class="card"><button type="button" data-media="${type}:${id}"><div class="poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><div class="card-body"><b>${esc(mediaTitle(x))}</b><small>${year||'—'} · ${type==='movie'?'Filme':'Série'}${score?` · ★ ${score.toFixed(1)}`:''}</small></div></button></article>`}
function mediaRow(x,meta=''){const type=mediaType(x),id=mediaTmdb(x),p=mediaPoster(x);return `<div class="media-row" data-media="${type}:${id}"><div class="thumb"${p?` style="background-image:url('${img(p,'w154')}')"`:''}></div><div><b>${esc(mediaTitle(x))}</b><small>${esc(meta)}</small></div><span class="badge">›</span></div>`}
async function renderAuth(){setApp(`<div class="login-wrap"><div class="login-card"><div class="logo">CINE<span class="gold">TRACKER</span></div><h1>Entrar</h1><div class="notice">Sua biblioteca, progresso e esportes sincronizados.</div><form data-login-form><input name="email" type="email" placeholder="E-mail" required><input name="password" type="password" placeholder="Senha" required><button class="btn" type="submit">Entrar</button><div class="error hidden" data-auth-error></div></form></div></div>`)}
async function renderHome(seq){setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home>${loading('Sincronizando Home...')}</div>`));try{const data=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});if(seq!==navSeq||route()!=='home')return;homeCache=data||{};paintHome()}catch(e){if(seq!==navSeq)return;const h=$('[data-home]');if(h)h.innerHTML=fail(`Falha ao sincronizar Home: ${e?.message||e}`,'home')}}
function paintHome(){const h=$('[data-home]');if(!h)return;const p=homeCache||{},series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],histM=Array.isArray(p.history_movies)?p.history_movies:[],histE=Array.isArray(p.history_episodes)?p.history_episodes:[];const buckets=[['Assistir a seguir',series.filter(x=>x.home_bucket==='continue')],['Juntando poeira',series.filter(x=>x.home_bucket==='dust')],['Em dia',series.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',series.filter(x=>x.home_bucket==='not_started')],['Concluídas',series.filter(x=>x.home_bucket==='completed')]];h.innerHTML=`<div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div><div data-home-view="series" class="home-list">${buckets.map(([title,rows])=>`<section class="home-section"><div class="panel-head"><h3>${title}</h3><small>${rows.length}</small></div><div class="stack">${rows.length?rows.slice(0,100).map(x=>mediaRow(x,`${Number(x.watched_episodes||0)}/${Math.max(Number(x.total_episodes||0),Number(x.released_episodes||0))||'?'} · ${Math.max(0,Number(x.released_episodes||0)-Number(x.watched_episodes||0))?'Faltam '+Math.max(0,Number(x.released_episodes||0)-Number(x.watched_episodes||0)):'Em dia'}`)).join(''):'<div class="empty">Nenhum item.</div>'}</div></section>`).join('')}<section class="home-section"><div class="panel-head"><h3>Histórico recente</h3><small>${histE.length}</small></div><div class="stack">${histE.slice(0,30).map(x=>mediaRow({...x,media_type:'tv',tmdb_id:x.tmdb_id},`S${String(x.season_number||0).padStart(2,'0')} E${String(x.episode_number||0).padStart(2,'0')}`)).join('')||'<div class="empty">Nenhum episódio recente.</div>'}</div></section></div><div data-home-view="movies" class="home-list hidden"><section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small>${watch.length}</small></div><div class="stack">${watch.slice(0,240).map(x=>mediaRow({...x,media_type:'movie'},[x.release_year,x.runtime_minutes?`${x.runtime_minutes} min`:null].filter(Boolean).join(' · '))).join('')||'<div class="empty">Nenhum filme na Watchlist.</div>'}</div></section><section class="home-section"><div class="panel-head"><h3>Filmes vistos</h3><small>${histM.length}</small></div><div class="stack">${histM.slice(0,100).map(x=>mediaRow({...x,media_type:'movie'},x.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto')).join('')||'<div class="empty">Nenhum filme recente.</div>'}</div></section></div>`}
function profileRows(d){const dash=Array.isArray(d.dashboard)?d.dashboard:[];return{series:dash.filter(x=>x.media_type==='tv'&&(x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0)),movies:dash.filter(x=>x.media_type==='movie'&&x.is_seen),seriesFav:dash.filter(x=>x.media_type==='tv'&&x.is_favorite),movieFav:dash.filter(x=>x.media_type==='movie'&&x.is_favorite)}}
function profileSection(title,rows){return `<section class="panel"><div class="panel-head"><h2>${esc(title)}</h2><small>${rows.length}</small></div><div class="row">${rows.slice(0,10).map(mediaCard).join('')||'<div class="empty">Nenhum item nesta seção.</div>'}</div></section>`}
async function renderProfile(seq){setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile',`<div class="page" data-profile>${loading('Carregando Perfil...')}</div>`));try{const d=await rpc('cinetracker_profile_payload_v0997',{p_tz:tz()});if(seq!==navSeq||route()!=='profile')return;profileCache=d||{};const h=$('[data-profile]'),r=profileRows(d||{}),s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{},days=d?.activity||[],max=Math.max(1,...days.map(x=>Number(x.count||0)));h.innerHTML=`<section class="panel"><div class="panel-head"><h2>Estatísticas</h2><small>sincronizadas</small></div><div class="stats">${[['Tempo total',fmtMinutes(s.total_minutes)],['Episódios vistos',Number(s.episodes_watched||0).toLocaleString('pt-BR')],['Filmes vistos',Number(s.movies_watched||0).toLocaleString('pt-BR')],['Séries concluídas',Number(ss.completed_series||0).toLocaleString('pt-BR')],['Em andamento',Number(ss.in_progress_series||0).toLocaleString('pt-BR')]].map(([a,b])=>`<div class="stat"><small>${a}</small><b>${b}</b></div>`).join('')}</div></section>${profileSection('Séries',r.series)}${profileSection('Filmes',r.movies)}${profileSection('Séries Favoritas',r.seriesFav)}${profileSection('Filmes Favoritos',r.movieFav)}<section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><small>${(d.favorite_actors||[]).length}</small></div><div class="row">${(d.favorite_actors||[]).slice(0,10).map(a=>`<article class="card"><button type="button" data-person="${Number(a.tmdb_person_id||0)}"><div class="poster"${a.profile_path?` style="background-image:url('${img(a.profile_path,'w185')}')"`:''}></div><div class="card-body"><b>${esc(a.actor_name||'Ator')}</b><small>Ator favorito</small></div></button></article>`).join('')||'<div class="empty">Nenhum ator favorito.</div>'}</div></section><section class="panel"><div class="panel-head"><h2>Episódios por dia</h2><small>${tz()}</small></div><div class="timeline">${days.map(x=>{const n=Number(x.count||0),today=String(x.day).slice(0,10)===localDay();return `<div class="day ${today?'today':''}"><b>${n}</b><div class="barwrap"><div class="bar" style="height:${Math.max(4,Math.round(n/max*96))}px"></div></div><small>${today?'Hoje':new Date(`${String(x.day).slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'})}</small></div>`}).join('')}</div></section><section class="panel"><div class="panel-head"><h2>Biblioteca</h2><small>estado atual</small></div><div class="stats">${[['Séries Watchlist',rem.watchlist_series??ss.not_started_series],['Filmes Watchlist',rem.watchlist_movies??ss.watchlist_movies],['Em dia',ss.up_to_date_series],['Tempo séries',fmtMinutes(s.series_minutes)],['Tempo filmes',fmtMinutes(s.movie_minutes)]].map(([a,b])=>`<div class="stat"><small>${a}</small><b>${typeof b==='string'?b:Number(b||0).toLocaleString('pt-BR')}</b></div>`).join('')}</div></section>`}catch(e){if(seq!==navSeq)return;const h=$('[data-profile]');if(h)h.innerHTML=fail(`Falha ao carregar Perfil: ${e?.message||e}`,'profile')}}
async function exclusionContext(){const[dash,exRaw]=await Promise.all([rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rpc('cinetracker_discovery_exclusions_v0994',{}).catch(()=>({}))]);const ex=Array.isArray(exRaw)&&exRaw.length===1?exRaw[0]:exRaw||{},movieIds=new Set((ex.movie_ids||[]).map(Number)),tvIds=new Set((ex.tv_ids||[]).map(Number)),aliases=new Set();const add=(t,v)=>{const n=norm(v);if(n)aliases.add(`${t}:${n}`)};for(const x of dash||[]){const t=mediaType(x),id=Number(x.tmdb_id||x.raw_tmdb?.source_tmdb_id||0),known=Boolean(x.is_watchlist||x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);if(!known)continue;if(id)(t==='movie'?movieIds:tvIds).add(id);for(const v of[x.title,x.raw_tmdb?.title,x.raw_tmdb?.name,x.raw_tmdb?.original_title,x.raw_tmdb?.original_name])add(t,v)}return{dash:dash||[],movieIds,tvIds,aliases}}
function known(x,c){const t=mediaType(x),id=Number(x.id||0);if(id&&(t==='movie'?c.movieIds:c.tvIds).has(id))return true;return[x.title,x.name,x.original_title,x.original_name].map(norm).filter(Boolean).some(n=>c.aliases.has(`${t}:${n}`))}
async function pages(path,params,type,count=3){const all=await Promise.all(Array.from({length:count},(_,i)=>safeTmdb(path,{...params,page:i+1})));const seen=new Set(),out=[];for(const d of all)for(const x of d.results||[]){const k=`${type}:${x.id}`;if(!x.id||seen.has(k))continue;seen.add(k);out.push({...x,media_type:type})}return out}
async function discoverRows(tab){const cacheKey=`${tab}:${localDay()}`;if(discoverCache.has(cacheKey))return discoverCache.get(cacheKey);const p=(async()=>{const c=await exclusionContext(),clean=rows=>rows.filter(x=>x.id&&mediaPoster(x)&&!known(x,c));if(tab==='foryou'){const genres=new Map();for(const x of c.dash){if(!(x.is_favorite||x.is_seen||x.is_in_progress))continue;for(const g of x.genre_ids||x.raw_tmdb?.genre_ids||[])genres.set(Number(g),(genres.get(Number(g))||0)+(x.is_favorite?3:1))}const wg=[...genres.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]).join('|')||undefined;const[m,t,a]=await Promise.all([pages('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,with_genres:wg,include_adult:false},'movie',4),pages('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,with_genres:wg,include_adult:false},'tv',4),pages('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':60},'tv',4)]);return clean([m[0],t[0],a[0]].filter(Boolean))}if(tab==='trending'){const d=await safeTmdb('/trending/all/week');return clean((d.results||[]).filter(x=>['movie','tv'].includes(x.media_type)))}if(tab==='popular'){const[m,t]=await Promise.all([pages('/movie/popular',{},'movie',3),pages('/tv/popular',{},'tv',3)]);return clean([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0))}if(tab==='new'){const lo=shiftDays(-30),hi=localDay(),[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.desc'},'movie',4),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.desc'},'tv',4)]);return clean([...m,...t])}if(tab==='anticipated'){const lo=shiftDays(1),[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,sort_by:'primary_release_date.asc'},'movie',4),pages('/discover/tv',{'first_air_date.gte':lo,sort_by:'first_air_date.asc'},'tv',4)]);return clean([...m,...t])}if(tab==='top'){const[m,t]=await Promise.all([pages('/movie/top_rated',{},'movie',3),pages('/tv/top_rated',{},'tv',3)]);return clean([...m,...t]).sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0))}if(tab==='calendar'){const raw=await rpc('cinetracker_calendar_watchlist_v0997',{p_from:localDay(),p_to:shiftDays(75)}).catch(()=>[]);return Array.isArray(raw)?raw.map(x=>({...x,id:Number(x.tmdb_id||x.id||0),media_type:mediaType(x)})):[]}return[]})();discoverCache.set(cacheKey,p);try{const v=await p;discoverCache.set(cacheKey,v);return v}catch(e){discoverCache.delete(cacheKey);throw e}}
let discoverState={tab:'foryou',type:'all'};
async function renderDiscover(seq){setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover><div class="tabs">${[['foryou','Pra você'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']].map(([k,l])=>`<button class="chip ${discoverState.tab===k?'active':''}" data-discover-tab="${k}">${l}</button>`).join('')}</div><div class="filters">${[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button class="chip ${discoverState.type===k?'active':''}" data-discover-type="${k}">${l}</button>`).join('')}</div><div data-discover-content>${loading('Carregando títulos...')}</div></div>`));try{const rows=await discoverRows(discoverState.tab);if(seq!==navSeq||route()!=='discover')return;paintDiscover(rows)}catch(e){if(seq!==navSeq)return;const h=$('[data-discover-content]');if(h)h.innerHTML=fail(`Falha ao carregar Descobrir: ${e?.message||e}`,'discover')}}
function paintDiscover(rows){const h=$('[data-discover-content]');if(!h)return;let a=rows||[];if(discoverState.type!=='all')a=a.filter(x=>mediaType(x)===discoverState.type);if(discoverState.tab==='calendar'){const groups=new Map();for(const x of a){const ds=String(x.calendar_date||x.release_date||x.first_air_date||'').slice(0,10)||'Sem data';if(!groups.has(ds))groups.set(ds,[]);groups.get(ds).push(x)}h.innerHTML=`<div class="page">${[...groups.entries()].map(([d,g])=>`<section class="panel"><div class="panel-head"><h2>${d==='Sem data'?d:new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h2><small>${g.length}</small></div><div class="row">${g.map(mediaCard).join('')}</div></section>`).join('')||'<div class="empty">Nenhum lançamento da sua Watchlist neste período.</div>'}</div>`;return}h.innerHTML=`<div class="row">${a.slice(0,120).map(mediaCard).join('')||'<div class="empty">Nenhum título elegível.</div>'}</div>`}
let sportsState={tab:'today',sport:'all',syncing:false,provider:null};
async function sportsPayload(force=false){if(!force&&sportsCache)return sportsCache;const from=new Date(`${localDay()}T00:00:00`),to=new Date(`${shiftDays(8)}T00:00:00`);sportsCache=await rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()});return sportsCache||{sports:[],events:[],favorites:[],preferences:{}}}
function sportLabelMap(p){return new Map((p.sports||[]).map(x=>[x.slug,x]))}
function sportsFiltered(p){let a=Array.isArray(p.events)?p.events:[];if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);if(sportsState.tab==='today')a=a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay());if(sportsState.tab==='live')a=a.filter(x=>x.status==='live');if(sportsState.tab==='favorites')a=a.filter(x=>x.has_favorite);return a}
function sportsEvent(e,p){const sm=sportLabelMap(p),s=sm.get(e.sport_slug)||{},fav=new Set((p.favorites||[]).map(x=>Number(x.entity_id))),match=e.home_name||e.away_name,score=e.home_score!=null||e.away_score!=null?`${esc(e.home_score??'–')} : ${esc(e.away_score??'–')}`:'×',status=e.status==='live'?'AO VIVO':e.status==='finished'?'ENCERRADO':new Date(e.starts_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});const f=(id,label)=>id?`<button class="fav ${fav.has(Number(id))?'on':''}" data-sport-fav="${Number(id)}" data-on="${fav.has(Number(id))?'1':'0'}">${fav.has(Number(id))?'★':'☆'} ${esc(label)}</button>`:'';return `<article class="event ${e.status==='live'?'live':''}"><div class="event-top"><div class="league">${e.competition_logo?`<img src="${esc(e.competition_logo)}" alt="">`:''}<span>${esc(s.icon||'🏆')} ${esc(e.competition_name||s.name||'Esporte')}</span></div><span class="status ${e.status==='live'?'live':''}">${status}</span></div>${match?`<div class="match"><div class="side">${e.home_logo?`<img src="${esc(e.home_logo)}" alt="">`:''}<b>${esc(e.home_name||'')}</b></div><div class="score">${score}</div><div class="side">${e.away_logo?`<img src="${esc(e.away_logo)}" alt="">`:''}<b>${esc(e.away_name||'')}</b></div></div>`:`<div class="event-title">${esc(e.title)}</div>`}<div class="meta">${new Date(e.starts_at).toLocaleString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}${e.round?` · ${esc(e.round)}`:''}${e.venue?`<br>${esc(e.venue)}`:''}</div><div class="fav-actions">${f(e.competition_id,e.competition_name||'Competição')}${f(e.home_id,e.home_name||'Time')}${f(e.away_id,e.away_name||'Time')}</div></article>`}
async function renderSports(seq){setApp(shell('Esportes','Agenda, ao vivo, favoritos e competições em uma central própria.','sports',`<div class="page" data-sports>${loading('Carregando central de Esportes...')}</div>`));try{const p=await sportsPayload();if(seq!==navSeq||route()!=='sports')return;void edge('ct-sports-sync',{action:'status'},12000).then(x=>{sportsState.provider=x;paintSports(p)}).catch(()=>{});paintSports(p);if(!(p.events||[]).length)void syncSports(false)}catch(e){if(seq!==navSeq)return;const h=$('[data-sports]');if(h)h.innerHTML=fail(`Falha ao carregar Esportes: ${e?.message||e}`,'sports')}}
function paintSports(p=sportsCache||{}){const h=$('[data-sports]');if(!h)return;const events=sportsFiltered(p),sports=p.sports||[],favorites=p.favorites||[],live=(p.events||[]).filter(x=>x.status==='live').length,today=(p.events||[]).filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay()).length;h.innerHTML=`<div class="panel"><div class="panel-head"><h2>Central esportiva</h2><div class="actions"><span class="badge">${sportsState.provider?.api_sports_configured?'API-Sports + fallback':'TheSportsDB fallback'}</span><button class="btn" data-sports-sync ${sportsState.syncing?'disabled':''}>${sportsState.syncing?'Atualizando...':'Atualizar agenda'}</button></div></div><div class="sports-summary">${[['Hoje',today],['Ao vivo',live],['Eventos',Number((p.events||[]).length)],['Favoritos',favorites.length]].map(([a,b])=>`<div class="stat"><small>${a}</small><b>${b}</b></div>`).join('')}</div></div><div class="tabs">${[['today','Hoje'],['live','Ao vivo'],['calendar','Calendário'],['favorites','Favoritos']].map(([k,l])=>`<button class="chip ${sportsState.tab===k?'active':''}" data-sports-tab="${k}">${l}</button>`).join('')}</div><div class="filters"><button class="chip ${sportsState.sport==='all'?'active':''}" data-sport="all">Todos</button>${sports.map(s=>`<button class="chip ${sportsState.sport===s.slug?'active':''}" data-sport="${esc(s.slug)}">${esc(s.icon)} ${esc(s.name)}</button>`).join('')}</div>${sportsState.tab==='favorites'?`<section class="panel"><div class="panel-head"><h2>Favoritos</h2><small>${favorites.length}</small></div><div class="favorites-grid">${favorites.map(f=>`<div class="favorite-card">${f.logo_url||f.image_url?`<img src="${esc(f.logo_url||f.image_url)}" alt="">`:'<span>🏆</span>'}<div><b>${esc(f.name)}</b><small>${esc(f.entity_type)} · ${esc(f.sport_slug)}</small></div><button class="fav on" data-sport-fav="${Number(f.entity_id)}" data-on="1">★</button></div>`).join('')||'<div class="empty">Marque times, ligas ou entidades como favoritas nos eventos.</div>'}</div></section>`:''}<section class="panel"><div class="panel-head"><h2>${sportsState.tab==='live'?'Ao vivo':sportsState.tab==='today'?'Eventos de hoje':sportsState.tab==='favorites'?'Eventos dos favoritos':'Próximos eventos'}</h2><small>${events.length}</small></div><div class="event-grid">${events.map(e=>sportsEvent(e,p)).join('')||'<div class="empty">Nenhum evento disponível neste filtro. Use “Atualizar agenda” para sincronizar os provedores.</div>'}</div></section>`}
async function syncSports(force){if(sportsState.syncing)return;sportsState.syncing=true;paintSports();try{const p=sportsCache||{},fav=p.preferences?.favorite_sports||['soccer','formula_1','mma','basketball','american_football','ice_hockey'];await edge('ct-sports-sync',{action:'sync',date_from:localDay(),date_to:shiftDays(2),sports:fav,force},50000);sportsCache=null;await sportsPayload(true);paintSports()}catch(e){toast(`Esportes: ${e?.message||e}`)}finally{sportsState.syncing=false;paintSports()}}
async function renderConfigs(seq){setApp(shell('Configurações','Conta, manutenção, sincronização e dados.','configs',`<div class="page" data-configs>${loading('Carregando Configurações...')}</div>`,{search:false}));const h=$('[data-configs]');try{const profile=await api('profiles?select=*&limit=1').then(x=>x?.[0]||{}).catch(()=>({}));if(seq!==navSeq)return;h.innerHTML=`<div class="settings-grid"><section class="panel"><div class="panel-head"><h2>Conta e preferências</h2><span class="badge">SINCRONIZADO</span></div><div class="form-grid"><div class="field"><label>E-mail</label><input value="${esc(user?.email||'')}" disabled></div><div class="field"><label>Fuso horário</label><input value="${esc(tz())}" disabled></div><div class="field"><label>Idioma</label><select data-lang><option value="pt-BR" ${localStorage.getItem('cinetracker_locale')!=='en-US'?'selected':''}>Português (BR)</option><option value="en-US" ${localStorage.getItem('cinetracker_locale')==='en-US'?'selected':''}>English</option></select></div><div class="field"><label>Perfil</label><input value="${esc(profile.display_name||profile.name||user?.user_metadata?.display_name||'')}" disabled></div></div><div class="actions" style="margin-top:10px"><button class="btn" data-save-prefs>Salvar preferências</button></div></section><section class="panel"><div class="panel-head"><h2>Manutenção e sincronização</h2><span class="badge">WEB</span></div><div class="actions"><button class="btn" data-clear-cache>Limpar Cache</button><button class="btn" data-refresh-metadata>Atualizar metadados</button></div><div class="notice" style="margin-top:10px">O cache limpo não apaga histórico, Watchlist ou progresso do Supabase.</div></section></div><section class="panel"><div class="panel-head"><h2>Sincronização e correção da biblioteca</h2><small>seen + watchlist + progress</small></div><div class="stats" data-reconcile-stats>${[['Processados',0],['IDs corrigidos',0],['Capas recuperadas',0],['Ambíguos preservados',0],['Falhas',0]].map(([a,b])=>`<div class="stat"><small>${a}</small><b>${b}</b></div>`).join('')}</div><div class="actions" style="margin-top:10px"><button class="btn" data-reconcile="pending">Sincronizar pendentes</button><button class="btn" data-reconcile="all">Revalidar tudo</button><button class="btn" data-reconcile-cancel disabled>Cancelar</button></div><div class="notice" data-reconcile-note style="margin-top:8px">Pronto.</div></section><section class="panel"><div class="panel-head"><h2>Dados</h2><small>backup rápido</small></div><div class="actions"><button class="btn" data-export>Exportar snapshot</button></div></section>`}catch(e){h.innerHTML=fail(`Falha em Configurações: ${e?.message||e}`,'configs')}}
let reconcileCancel=false;
async function reconcile(force){reconcileCancel=false;const buttons=$$('[data-reconcile]'),cancel=$('[data-reconcile-cancel]'),note=$('[data-reconcile-note]');buttons.forEach(b=>b.disabled=true);if(cancel)cancel.disabled=false;let cursor=0,total={processed:0,corrected_identity:0,covers_fixed:0,ambiguous:0,failed:0};try{while(!reconcileCancel){const d=await edge('ct-reconcile-library-user',{cursor,limit:30,force},60000);for(const k of Object.keys(total))total[k]+=Number(d[k]||0);cursor=Number(d.next_cursor||cursor);const stats=$('[data-reconcile-stats]');if(stats)stats.innerHTML=[['Processados',total.processed],['IDs corrigidos',total.corrected_identity],['Capas recuperadas',total.covers_fixed],['Ambíguos preservados',total.ambiguous],['Falhas',total.failed]].map(([a,b])=>`<div class="stat"><small>${a}</small><b>${b}</b></div>`).join('');if(note)note.textContent=d.has_more?`Processando... cursor ${cursor}`:'Concluído.';if(!d.has_more)break}}catch(e){if(note)note.textContent=`Falha: ${e?.message||e}`}finally{buttons.forEach(b=>b.disabled=false);if(cancel)cancel.disabled=true;homeCache=null;profileCache=null;discoverCache.clear()}}
async function renderDetail(kind,id,seq){const tmdbKind=kind==='series'?'tv':kind;setApp(shell('Detalhes','Informações completas e ações da sua biblioteca.',route(),`<div class="page" data-detail>${loading('Carregando detalhes...')}</div>`));try{const d=await tmdb(`/${tmdbKind}/${id}`,tmdbKind==='tv'?{append_to_response:'credits,content_ratings'}:{append_to_response:'credits,release_dates'});if(seq!==navSeq)return;const h=$('[data-detail]'),p=d.poster_path?img(d.poster_path,'w500'):'',back=d.backdrop_path?img(d.backdrop_path,'w1280'):'',title=d.title||d.name||'Sem título',date=d.release_date||d.first_air_date||'',genres=(d.genres||[]).map(g=>g.name).join(' · '),cast=(d.credits?.cast||[]).slice(0,12);h.innerHTML=`${back?`<div class="backdrop" style="background-image:linear-gradient(180deg,#0000,#02080dcc),url('${back}')"></div>`:''}<section class="panel"><div class="detail-hero"><div class="detail-poster"${p?` style="background-image:url('${p}')"`:''}></div><div class="detail-copy"><div class="eyebrow">${tmdbKind==='movie'?'Filme':'Série'}</div><h1>${esc(title)}</h1><div class="meta">${esc(String(date).slice(0,4)||'—')} · ${esc(genres)}${d.vote_average?` · ★ ${Number(d.vote_average).toFixed(1)}`:''}</div><p>${esc(d.overview||'Sem sinopse disponível.')}</p><div class="actions"><button class="btn" data-detail-watchlist="${tmdbKind}:${id}">+ Watchlist</button><button class="btn" data-detail-seen="${tmdbKind}:${id}">✓ Marcar como visto</button></div></div></div></section><section class="panel"><div class="panel-head"><h2>Elenco</h2><small>${cast.length}</small></div><div class="row">${cast.map(a=>`<article class="card"><button data-person="${Number(a.id)}"><div class="poster"${a.profile_path?` style="background-image:url('${img(a.profile_path,'w185')}')"`:''}></div><div class="card-body"><b>${esc(a.name)}</b><small>${esc(a.character||'')}</small></div></button></article>`).join('')||'<div class="empty">Sem elenco disponível.</div>'}</div></section>${tmdbKind==='tv'?`<section class="panel"><div class="panel-head"><h2>Temporadas</h2><small>${d.number_of_seasons||0}</small></div><div class="row">${(d.seasons||[]).filter(s=>s.season_number>0).map(s=>`<article class="card"><button data-season="${id}:${s.season_number}"><div class="poster"${s.poster_path?` style="background-image:url('${img(s.poster_path,'w342')}')"`:''}></div><div class="card-body"><b>${esc(s.name)}</b><small>${s.episode_count||0} episódios</small></div></button></article>`).join('')}</div></section>`:''}` }catch(e){if(seq!==navSeq)return;const h=$('[data-detail]');if(h)h.innerHTML=fail(`Falha ao abrir detalhes: ${e?.message||e}`,kind==='movie'?'home':'discover')}}
async function ensureMedia(type,id){let rows=await api(`media?select=id,tmdb_id,media_type,title,raw_tmdb&media_type=eq.${type}&tmdb_id=eq.${id}&limit=1`).catch(()=>[]);if(rows?.[0])return rows[0];const d=await tmdb(`/${type}/${id}`);const body={tmdb_id:id,media_type:type,title:d.title||d.name||`TMDB #${id}`,poster_path:d.poster_path||null,release_year:Number(String(d.release_date||d.first_air_date||'').slice(0,4))||null,runtime_minutes:type==='movie'?(Number(d.runtime)||null):(Number((d.episode_run_time||[])[0])||null),total_seasons:type==='tv'?(Number(d.number_of_seasons)||null):null,total_episodes:type==='tv'?(Number(d.number_of_episodes)||null):null,raw_tmdb:d};rows=await api('media',{method:'POST',body:JSON.stringify(body)});return rows?.[0]}
async function addWatchlist(type,id){const m=await ensureMedia(type,id);const ex=await api(`media_overrides?select=id&media_id=eq.${m.id}&state=eq.AddedToWatchlist&limit=1`).catch(()=>[]);if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:m.id,state:'AddedToWatchlist',origin:'manual'})});homeCache=null;profileCache=null;discoverCache.clear();toast('Adicionado à Watchlist.')}
async function markSeen(type,id){const m=await ensureMedia(type,id);if(type==='movie')await rpc('cinetracker_mark_watch_v0994',{p_media_id:m.id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:m.title||null,p_runtime_minutes:null,p_released_episodes:null,p_watched_at:new Date().toISOString()});else{const ex=await api(`media_overrides?select=id&media_id=eq.${m.id}&state=eq.AlreadySeen&limit=1`).catch(()=>[]);if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:m.id,state:'AlreadySeen',origin:'manual'})})}homeCache=null;profileCache=null;discoverCache.clear();toast('Biblioteca atualizada.')}
async function renderPerson(id,seq){setApp(shell('Pessoa','Filmografia e informações do TMDB.','discover',`<div class="page" data-detail>${loading('Carregando pessoa...')}</div>`));try{const[d,c]=await Promise.all([tmdb(`/person/${id}`),tmdb(`/person/${id}/combined_credits`)]);if(seq!==navSeq)return;const credits=(c.cast||[]).filter(x=>['movie','tv'].includes(x.media_type)).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));$('[data-detail]').innerHTML=`<section class="panel"><div class="detail-hero"><div class="detail-poster"${d.profile_path?` style="background-image:url('${img(d.profile_path,'w500')}')"`:''}></div><div class="detail-copy"><h1>${esc(d.name)}</h1><div class="meta">${esc(d.known_for_department||'')}</div><p>${esc(d.biography||'Biografia não disponível.')}</p></div></div></section><section class="panel"><div class="panel-head"><h2>Filmografia</h2><small>${credits.length}</small></div><div class="row">${credits.slice(0,80).map(mediaCard).join('')}</div></section>`}catch(e){if(seq!==navSeq)return;$('[data-detail]').innerHTML=fail(`Falha ao carregar pessoa: ${e?.message||e}`,'discover')}}
/* r158 requested adjustments — same single clean runtime, no legacy patch authority */
let homeActiveTab158='series';

function discoverDate158(x){return String(x?.calendar_date||(mediaType(x)==='movie'?(x?.release_date||x?.raw_tmdb?.release_date||''):(x?.first_air_date||x?.raw_tmdb?.first_air_date||''))).slice(0,10)}
function genreIds158(x){return[...new Set((x?.genre_ids||x?.genres?.map(g=>g?.id)||x?.raw_tmdb?.genre_ids||x?.raw_tmdb?.genres?.map(g=>g?.id)||[]).map(Number).filter(Boolean))]}
function isAnime158(x){const g=genreIds158(x),countries=x?.origin_country||x?.raw_tmdb?.origin_country||[];return g.includes(16)&&countries.includes('JP')}
function validDiscover158(x){const g=genreIds158(x);return Boolean(x?.id&&norm(mediaTitle(x))&&mediaPoster(x)&&!(g.length===1&&(g[0]===18||g[0]===99)))}
function uniqueMedia158(rows){const seen=new Set();return(rows||[]).filter(x=>{const k=mediaType(x)+':'+Number(x?.id||0);if(!x?.id||seen.has(k))return false;seen.add(k);return true})}
function uniqueCalendar158(rows){const seen=new Set();return(rows||[]).filter(x=>{const k=mediaType(x)+':'+Number(x?.id||0)+':'+discoverDate158(x)+':'+Number(x?.season_number||0)+':'+Number(x?.episode_number||0);if(!x?.id||!discoverDate158(x)||seen.has(k))return false;seen.add(k);return true})}
function score158(x){return Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0}
function formatRelease158(ds){if(!ds)return'Data não informada';const d=new Date(String(ds).slice(0,10)+'T12:00:00');return Number.isNaN(d.getTime())?String(ds):d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}
function favoriteGenres158(dash){const m=new Map();for(const x of dash||[]){if(!(x?.is_favorite||x?.is_seen||x?.is_in_progress||Number(x?.watched_episodes||0)>0))continue;for(const id of genreIds158(x))m.set(id,(m.get(id)||0)+(x?.is_favorite?3:1))}return[...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>id)}

async function exclusionContext158(){
  const[dash,rawEx]=await Promise.all([rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rpc('cinetracker_discovery_exclusions_v0994',{}).catch(()=>({}))]);
  const ex=Array.isArray(rawEx)&&rawEx.length===1?rawEx[0]:(rawEx||{}),movieIds=new Set((ex.movie_ids||[]).map(Number)),tvIds=new Set((ex.tv_ids||[]).map(Number)),aliases=new Set();
  const add=(t,v)=>{const n=norm(v);if(n)aliases.add(t+':'+n)};
  for(const a of ex.aliases||[]){const t=a?.media_type==='movie'?'movie':'tv';for(const v of[a?.title,a?.localized_title,a?.localized_name,a?.original_title,a?.original_name])add(t,v)}
  for(const x of dash||[]){const t=mediaType(x),raw=x?.raw_tmdb||{},id=Number(x?.tmdb_id||raw?.source_tmdb_id||raw?.id||0),known=Boolean(x?.is_watchlist||x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||Number(x?.watched_episodes||0)>0||x?.last_watched_at);if(!known)continue;if(id)(t==='movie'?movieIds:tvIds).add(id);for(const v of[x?.title,raw?.title,raw?.name,raw?.original_title,raw?.original_name])add(t,v)}
  return{dash:dash||[],movieIds,tvIds,aliases};
}
function known158(x,c){const t=mediaType(x),id=Number(x?.id||0);if(id&&(t==='movie'?c.movieIds:c.tvIds).has(id))return true;return[x?.title,x?.name,x?.original_title,x?.original_name].map(norm).filter(Boolean).some(n=>c.aliases.has(t+':'+n))}

function homeSeriesRow158(x){
  const id=mediaTmdb(x),p=mediaPoster(x),seen=Math.max(0,Number(x.watched_episodes||0)),released=Math.max(0,Number(x.released_episodes||0)),total=Math.max(released,Number(x.total_episodes||0)),missing=Math.max(0,released-seen);
  return '<div class="home-action-row"><div class="media-row" data-media="tv:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div><b>'+esc(mediaTitle(x))+'</b><small>'+seen+'/'+(total||'?')+' · '+(missing?'Faltam '+missing:'Em dia')+'</small></div><span class="badge">›</span></div>'+(missing>0?'<button class="home-check" type="button" title="Marcar próximo episódio como assistido" data-home-mark-episode="'+Number(x.media_id||0)+'">✓</button>':'')+'</div>';
}
function homeMovieRow158(x,history=false){
  const id=mediaTmdb(x),p=mediaPoster(x),meta=history?(x.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto'):[x.release_year,x.runtime_minutes?x.runtime_minutes+' min':null].filter(Boolean).join(' · ');
  return '<div class="home-action-row"><div class="media-row" data-media="movie:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div><b>'+esc(mediaTitle(x))+'</b><small>'+esc(meta)+'</small></div><span class="badge">'+(history?'✓':'›')+'</span></div>'+(history?'':'<button class="home-check" type="button" title="Marcar filme como assistido" data-home-mark-movie="'+Number(x.media_id||0)+'">✓</button>')+'</div>';
}
function homeEpisodeHistory158(x){
  const p=mediaPoster(x),id=mediaTmdb(x),meta='S'+String(x.season_number||0).padStart(2,'0')+' E'+String(x.episode_number||0).padStart(2,'0')+(x.watched_at?' · '+new Date(x.watched_at).toLocaleString('pt-BR'):'');
  return '<div class="media-row" data-media="tv:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div><b>'+esc(mediaTitle(x))+'</b><small>'+esc(meta)+'</small></div><span class="badge">✓</span></div>';
}
function homeSection158(title,rows,renderer){return '<section class="home-section"><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+rows.length+'</small></div><div class="stack">'+(rows.length?rows.slice(0,240).map(renderer).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'}
function primeHomeHistory158(kind=homeActiveTab158){const vp=document.querySelector('[data-home-viewport="'+kind+'"]'),hist=vp?.querySelector('.home-history');if(vp&&hist)vp.scrollTop=hist.offsetHeight}
function paintHome(){
  const h=$('[data-home]');if(!h)return;const p=homeCache||{},series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],histM=Array.isArray(p.history_movies)?p.history_movies:[],histE=Array.isArray(p.history_episodes)?p.history_episodes:[];
  const buckets=[['Assistir a seguir',series.filter(x=>x.home_bucket==='continue')],['Juntando poeira',series.filter(x=>x.home_bucket==='dust')],['Em dia',series.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',series.filter(x=>x.home_bucket==='not_started')],['Concluídas',series.filter(x=>x.home_bucket==='completed')]];
  const seriesHistory='<div class="home-history"><div class="home-history-hint">Histórico de séries · role para cima para revelar</div><div class="stack">'+(histE.length?histE.map(x=>homeEpisodeHistory158({...x,media_type:'tv',tmdb_id:x.tmdb_id})).join(''):'<div class="empty">Nenhum episódio no histórico.</div>')+'</div></div>';
  const movieHistory='<div class="home-history"><div class="home-history-hint">Histórico de filmes · role para cima para revelar</div><div class="stack">'+(histM.length?histM.map(x=>homeMovieRow158({...x,media_type:'movie'},true)).join(''):'<div class="empty">Nenhum filme no histórico.</div>')+'</div></div>';
  const seriesBody=buckets.map(([title,rows])=>homeSection158(title,rows,homeSeriesRow158)).join('');
  const moviesBody=homeSection158('Assistir a seguir / Watchlist',watch,x=>homeMovieRow158({...x,media_type:'movie'},false));
  h.innerHTML='<div class="home-tabs"><button class="chip '+(homeActiveTab158==='series'?'active':'')+'" data-home-tab="series">Séries</button><button class="chip '+(homeActiveTab158==='movies'?'active':'')+'" data-home-tab="movies">Filmes</button></div><div data-home-view="series" class="'+(homeActiveTab158==='series'?'':'hidden')+'"><div class="home-viewport" data-home-viewport="series">'+seriesHistory+'<div class="home-start"><div class="home-pull-label">↑ Histórico acima</div>'+seriesBody+'</div></div></div><div data-home-view="movies" class="'+(homeActiveTab158==='movies'?'':'hidden')+'"><div class="home-viewport" data-home-viewport="movies">'+movieHistory+'<div class="home-start"><div class="home-pull-label">↑ Vistos acima</div>'+moviesBody+'</div></div></div>';
  requestAnimationFrame(()=>primeHomeHistory158(homeActiveTab158));
}

async function findNextReleasedEpisode158(x){
  const tmdbId=mediaTmdb(x),mediaId=Number(x?.media_id||0);if(!(tmdbId>0&&mediaId>0))throw new Error('Série sem identidade válida');
  const[prog,hist,show]=await Promise.all([api('episode_progress?select=season_number,episode_number&media_id=eq.'+mediaId+'&watched=eq.true').catch(()=>[]),api('watch_history?select=season_number,episode_number&media_id=eq.'+mediaId+'&item_type=eq.episode').catch(()=>[]),tmdb('/tv/'+tmdbId)]);
  const watched=new Set([...prog,...hist].map(e=>Number(e.season_number||0)+':'+Number(e.episode_number||0))),lastS=Math.max(1,Number(x?.last_season_number||1)),lastE=Math.max(0,Number(x?.last_episode_number||0));
  const seasons=(show.seasons||[]).filter(s=>Number(s.season_number)>0&&Number(s.season_number)>=lastS).sort((a,b)=>Number(a.season_number)-Number(b.season_number));
  for(const s of seasons){const sn=Number(s.season_number),sd=await tmdb('/tv/'+tmdbId+'/season/'+sn),eps=(sd.episodes||[]).filter(ep=>Number(ep.episode_number)>0&&ep.air_date&&String(ep.air_date).slice(0,10)<=localDay()).sort((a,b)=>Number(a.episode_number)-Number(b.episode_number));for(const ep of eps){const en=Number(ep.episode_number);if(sn===lastS&&lastE>0&&en<=lastE)continue;if(!watched.has(sn+':'+en))return{season:sn,episode:en,title:ep.name||null,runtime:Number(ep.runtime||0)||Number(x.runtime_minutes||0)||null,status:show.status||null}}}
  return null;
}
async function markNextEpisode158(mediaId){
  const x=(homeCache?.series||[]).find(v=>Number(v.media_id)===Number(mediaId));if(!x)return;const b=document.querySelector('[data-home-mark-episode="'+Number(mediaId)+'"]');if(b)b.disabled=true;
  try{const ep=await findNextReleasedEpisode158(x);if(!ep){toast('Nenhum episódio lançado pendente para marcar.');return}await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(x.media_id),p_season_number:ep.season,p_episode_number:ep.episode,p_title:ep.title,p_runtime_minutes:ep.runtime,p_released_episodes:Number(x.released_episodes||0)||null,p_series_status:ep.status,p_watched_at:new Date().toISOString()});homeCache=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});profileCache=null;paintHome();toast('S'+String(ep.season).padStart(2,'0')+' E'+String(ep.episode).padStart(2,'0')+' marcado como assistido.')}catch(e){toast('Falha ao marcar episódio: '+(e?.message||e))}finally{if(b)b.disabled=false}
}
async function markHomeMovie158(mediaId){
  const x=(homeCache?.movie_watchlist||[]).find(v=>Number(v.media_id)===Number(mediaId));if(!x)return;const b=document.querySelector('[data-home-mark-movie="'+Number(mediaId)+'"]');if(b)b.disabled=true;
  try{await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(x.media_id),p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:x.title||null,p_runtime_minutes:Number(x.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});homeCache=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});profileCache=null;paintHome();toast('Filme marcado como assistido.')}catch(e){toast('Falha ao marcar filme: '+(e?.message||e))}finally{if(b)b.disabled=false}
}

function profileSection(title,rows,action=''){return '<section class="panel"><div class="panel-head"><h2>'+esc(title)+'</h2><div class="panel-actions"><small>'+rows.length+'</small>'+action+'</div></div><div class="row">'+(rows.slice(0,10).map(mediaCard).join('')||'<div class="empty">Nenhum item nesta seção.</div>')+'</div></section>'}
async function renderProfile(seq){
  setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
  try{const d=await rpc('cinetracker_profile_payload_v0997',{p_tz:tz()});if(seq!==navSeq||route()!=='profile')return;profileCache=d||{};const h=$('[data-profile]'),r=profileRows(d||{}),s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{},days=d?.activity||[],max=Math.max(1,...days.map(x=>Number(x.count||0)));const addSeries='<button class="mini-add" type="button" data-add-favorite="tv">＋ Série</button>',addMovie='<button class="mini-add" type="button" data-add-favorite="movie">＋ Filme</button>',addActor='<button class="mini-add" type="button" data-add-favorite="person">＋ Ator</button>';
    const statHtml=[['Tempo total',fmtMinutes(s.total_minutes)],['Episódios vistos',Number(s.episodes_watched||0).toLocaleString('pt-BR')],['Filmes vistos',Number(s.movies_watched||0).toLocaleString('pt-BR')],['Séries concluídas',Number(ss.completed_series||0).toLocaleString('pt-BR')],['Em andamento',Number(ss.in_progress_series||0).toLocaleString('pt-BR')]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+b+'</b></div>').join('');
    const actors=(d.favorite_actors||[]).slice(0,10).map(a=>'<article class="card"><button type="button" data-person="'+Number(a.tmdb_person_id||0)+'"><div class="poster"'+(a.profile_path?' style="background-image:url(\''+img(a.profile_path,'w185')+'\')"':'')+'></div><div class="card-body"><b>'+esc(a.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>').join('')||'<div class="empty">Nenhum ator favorito.</div>';
    const timeline=days.map(x=>{const n=Number(x.count||0),today=String(x.day).slice(0,10)===localDay();return '<div class="day '+(today?'today':'')+'"><b>'+n+'</b><div class="barwrap"><div class="bar" style="height:'+Math.max(4,Math.round(n/max*96))+'px"></div></div><small>'+(today?'Hoje':new Date(String(x.day).slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'}))+'</small></div>'}).join('');
    const lib=[['Séries Watchlist',rem.watchlist_series??ss.not_started_series],['Filmes Watchlist',rem.watchlist_movies??ss.watchlist_movies],['Em dia',ss.up_to_date_series],['Tempo séries',fmtMinutes(s.series_minutes)],['Tempo filmes',fmtMinutes(s.movie_minutes)]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+(typeof b==='string'?b:Number(b||0).toLocaleString('pt-BR'))+'</b></div>').join('');
    h.innerHTML='<section class="panel"><div class="panel-head"><h2>Estatísticas</h2><small>sincronizadas</small></div><div class="stats">'+statHtml+'</div></section>'+profileSection('Séries',r.series)+profileSection('Filmes',r.movies)+profileSection('Séries Favoritas',r.seriesFav,addSeries)+profileSection('Filmes Favoritos',r.movieFav,addMovie)+'<section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><div class="panel-actions"><small>'+(d.favorite_actors||[]).length+'</small>'+addActor+'</div></div><div class="row">'+actors+'</div></section><section class="panel"><div class="panel-head"><h2>Episódios por dia</h2><small>'+esc(tz())+'</small></div><div class="timeline">'+timeline+'</div></section><section class="panel"><div class="panel-head"><h2>Biblioteca</h2><small>estado atual</small></div><div class="stats">'+lib+'</div></section>';
  }catch(e){if(seq!==navSeq)return;const h=$('[data-profile]');if(h)h.innerHTML=fail('Falha ao carregar Perfil: '+(e?.message||e),'profile')}
}

function openFavoriteSearch158(kind){
  document.querySelector('.favorite-overlay')?.remove();const label=kind==='movie'?'filme':kind==='tv'?'série':'ator',ov=document.createElement('div');ov.className='favorite-overlay';ov.innerHTML='<div class="favorite-box"><div class="panel-head"><h2>Adicionar '+label+' aos favoritos</h2><button class="mini-add" type="button" data-favorite-close>✕ Fechar</button></div><input class="favorite-search" type="search" placeholder="Buscar '+label+'…" autocomplete="off"><div class="favorite-results"><div class="empty">Digite pelo menos 2 caracteres.</div></div></div>';document.body.appendChild(ov);
  const input=$('.favorite-search',ov),out=$('.favorite-results',ov);let timer=0,rows=[];
  ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('[data-favorite-close]')){ov.remove();return}const b=e.target.closest('[data-favorite-result]');if(!b)return;const item=rows[Number(b.dataset.favoriteResult)];if(!item)return;b.disabled=true;void(async()=>{try{if(kind==='person'){const ex=await api('favorite_actors?select=id&tmdb_person_id=eq.'+Number(item.id)+'&limit=1').catch(()=>[]);if(!ex?.length)await api('favorite_actors',{method:'POST',body:JSON.stringify({tmdb_person_id:Number(item.id),actor_name:item.name||'TMDB #'+item.id,profile_path:item.profile_path||null})})}else{const m=await ensureMedia(kind,Number(item.id)),ex=await api('media_overrides?select=id&media_id=eq.'+Number(m.id)+'&state=eq.Liked&limit=1').catch(()=>[]);if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:Number(m.id),state:'Liked',origin:'manual'})})}profileCache=null;ov.remove();toast('Favorito adicionado.');await render()}catch(err){b.disabled=false;toast(err?.message||err)}})()});
  input.addEventListener('input',()=>{clearTimeout(timer);const q=input.value.trim();if(q.length<2){out.innerHTML='<div class="empty">Digite pelo menos 2 caracteres.</div>';return}timer=setTimeout(async()=>{out.innerHTML='<div class="loader">Buscando...</div>';try{const d=await tmdb(kind==='person'?'/search/person':'/search/'+kind,{query:q,include_adult:false,page:1});rows=(d.results||[]).slice(0,18);out.innerHTML=rows.map((x,i)=>{const p=kind==='person'?x.profile_path:x.poster_path,year=String(x.release_date||x.first_air_date||'').slice(0,4);return '<button class="favorite-result" type="button" data-favorite-result="'+i+'"><span class="favorite-thumb"'+(p?' style="background-image:url(\''+img(p,kind==='person'?'w185':'w154')+'\')"':'')+'></span><span><b>'+esc(x.title||x.name||'Sem título')+'</b><small>'+(kind==='person'?esc(x.known_for_department||'Pessoa'):(year||'—'))+'</small></span><span>＋</span></button>'}).join('')||'<div class="empty">Nenhum resultado.</div>'}catch(e){out.innerHTML='<div class="error">'+esc(e?.message||e)+'</div>'}},250)});setTimeout(()=>input.focus(),20);
}

async function watchlistCalendar158(lo,hi){const raw=await rpc('cinetracker_calendar_watchlist_v0997',{p_from:lo,p_to:hi}).catch(()=>[]);return(Array.isArray(raw)?raw:[]).map(x=>({...x,id:Number(x?.tmdb_id||x?.id||0),media_type:mediaType(x),_ct_watchlist:true})).filter(validDiscover158)}
async function discoverRows(tab){
  const cacheKey=tab+':'+localDay();if(discoverCache.has(cacheKey))return discoverCache.get(cacheKey);
  const p=(async()=>{const c=await exclusionContext158(),clean=rows=>uniqueMedia158(rows).filter(x=>validDiscover158(x)&&!known158(x,c));
    if(tab==='foryou'){const genres=favoriteGenres158(c.dash),wg=genres.length?genres.join('|'):undefined,[m,t,a]=await Promise.all([pages('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,with_genres:wg,include_adult:false},'movie',5),pages('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,with_genres:wg,include_adult:false},'tv',5),pages('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':60,include_adult:false},'tv',5)]),movies=clean(m).filter(x=>!isAnime158(x)),series=clean(t).filter(x=>!isAnime158(x)),animes=clean(a).filter(isAnime158),daily=movies.find(x=>score158(x)>=8&&Number(discoverDate158(x).slice(0,4))>=1990)||null;return{daily,movie:movies.find(x=>!daily||Number(x.id)!==Number(daily.id))||null,series:series[0]||null,anime:animes[0]||null}}
    if(tab==='new'){const lo=shiftDays(-30),hi=localDay(),[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.desc',include_adult:false},'movie',5),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.desc',include_adult:false},'tv',5)]);return clean([...m,...t]).filter(x=>discoverDate158(x)>=lo&&discoverDate158(x)<=hi).sort((a,b)=>discoverDate158(b).localeCompare(discoverDate158(a))).slice(0,100)}
    if(tab==='releases'){const lo=shiftDays(-7),hi=shiftDays(30),[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc',include_adult:false},'movie',5),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc',include_adult:false},'tv',5)]);return clean([...m,...t]).filter(x=>discoverDate158(x)>=lo&&discoverDate158(x)<=hi).sort((a,b)=>discoverDate158(a).localeCompare(discoverDate158(b))).slice(0,110)}
    if(tab==='anticipated'){const tomorrow=shiftDays(1),[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':tomorrow,sort_by:'primary_release_date.asc',include_adult:false},'movie',6),pages('/discover/tv',{'first_air_date.gte':tomorrow,sort_by:'first_air_date.asc',include_adult:false},'tv',6)]);return clean([...m,...t]).filter(x=>discoverDate158(x)>localDay()).sort((a,b)=>discoverDate158(a).localeCompare(discoverDate158(b))).slice(0,110)}
    if(tab==='calendar'){const lo=localDay(),hi=shiftDays(75),[m,t,w]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc',include_adult:false},'movie',4),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc',include_adult:false},'tv',4),watchlistCalendar158(lo,hi)]),all=uniqueCalendar158([...uniqueMedia158([...m,...t]).filter(validDiscover158),...w]);return all.filter(x=>discoverDate158(x)>=lo&&discoverDate158(x)<=hi).sort((a,b)=>discoverDate158(a).localeCompare(discoverDate158(b))||mediaTitle(a).localeCompare(mediaTitle(b)))}
    if(tab==='trending'){const[m,t]=await Promise.all([pages('/trending/movie/week',{},'movie',4),pages('/trending/tv/week',{},'tv',4)]);return clean([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,90)}
    if(tab==='popular'){const[m,t]=await Promise.all([pages('/movie/popular',{},'movie',4),pages('/tv/popular',{},'tv',4)]);return clean([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,90)}
    const[m,t]=await Promise.all([pages('/movie/top_rated',{},'movie',4),pages('/tv/top_rated',{},'tv',4)]);return clean([...m,...t]).filter(x=>score158(x)>=7).sort((a,b)=>score158(b)-score158(a)||Number(b.vote_count||0)-Number(a.vote_count||0)).slice(0,90);
  })();discoverCache.set(cacheKey,p);try{const v=await p;discoverCache.set(cacheKey,v);return v}catch(e){discoverCache.delete(cacheKey);throw e}
}
function discoverCard158(x){
  const type=mediaType(x),id=mediaTmdb(x),p=mediaPoster(x),score=score158(x),date=discoverDate158(x),kind=type==='movie'?'Filme':isAnime158(x)?'Anime':'Série',ep=type==='tv'&&Number(x.season_number)>0&&Number(x.episode_number)>0?'T'+Number(x.season_number)+'E'+Number(x.episode_number):'';
  const meta=[kind,ep||null,score?'★ '+score.toFixed(1):null].filter(Boolean).join(' · '),release=['new','releases','anticipated','calendar'].includes(discoverState.tab)&&date?'<small class="release-date">'+esc(formatRelease158(date))+'</small>':'';
  return '<article class="card discover-card"><button type="button" data-media="'+type+':'+id+'"><div class="poster"'+(p?' style="background-image:url(\''+img(p,'w342')+'\')"':'')+'></div><div class="card-body"><b>'+esc(mediaTitle(x))+'</b><small>'+esc(meta)+'</small>'+release+'</div></button>'+(x?._ct_watchlist?'<button class="discover-watch" type="button" disabled>Na Watchlist</button>':'<button class="discover-watch" type="button" data-discover-watch="'+type+':'+id+'">+ Watchlist</button>')+'</article>';
}
function discoverCarousel158(rows){return(rows||[]).length?'<div class="discover-carousel">'+rows.map(discoverCard158).join('')+'</div>':'<div class="empty">Nenhum título neste filtro.</div>'}
function renderForYou158(data){const slots=[['Filme',data?.movie],['Série',data?.series],['Anime',data?.anime]].filter(([,x])=>x),fresh=slots.length?'<div class="foryou-grid">'+slots.map(([label,x])=>'<div class="foryou-slot"><small>'+label+'</small>'+discoverCard158(x)+'</div>').join('')+'</div>':'<div class="empty">Nenhum título novo elegível agora.</div>';return '<section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2><small>fora da Watchlist e histórico</small></div>'+(data?.daily?discoverCarousel158([data.daily]):'<div class="empty">Nenhuma indicação elegível agora.</div>')+'</section><section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2><small>1 Filme · 1 Série · 1 Anime</small></div>'+fresh+'</section>'}
async function renderDiscover(seq){
  if(discoverState.tab==='foryou')discoverState.type='all';else if(discoverState.type==='watchlist'&&discoverState.tab!=='calendar')discoverState.type='all';
  const tabs=[['foryou','Pra você'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']],filters=discoverState.tab==='foryou'?[]:(discoverState.tab==='calendar'?[['all','Todos'],['movie','Filmes'],['tv','Séries'],['watchlist','Minha Watchlist']]:[['all','Todos'],['movie','Filmes'],['tv','Séries']]);
  const tabsHtml=tabs.map(([k,l])=>'<button class="chip '+(discoverState.tab===k?'active':'')+'" data-discover-tab="'+k+'">'+l+'</button>').join(''),filterHtml=filters.length?'<div class="filters">'+filters.map(([k,l])=>'<button class="chip '+(discoverState.type===k?'active':'')+'" data-discover-type="'+k+'">'+l+'</button>').join('')+'</div>':'';
  setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover','<div class="page" data-discover><div class="tabs">'+tabsHtml+'</div>'+filterHtml+'<div data-discover-content>'+loading('Carregando títulos...')+'</div></div>'));
  try{const rows=await discoverRows(discoverState.tab);if(seq!==navSeq||route()!=='discover')return;paintDiscover(rows)}catch(e){if(seq!==navSeq)return;const h=$('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover')}
}
function paintDiscover(rows){
  const h=$('[data-discover-content]');if(!h)return;if(discoverState.tab==='foryou'){h.innerHTML=renderForYou158(rows||{});return}let a=Array.isArray(rows)?rows:[];if(discoverState.type==='movie')a=a.filter(x=>mediaType(x)==='movie');else if(discoverState.type==='tv')a=a.filter(x=>mediaType(x)==='tv');else if(discoverState.type==='watchlist')a=a.filter(x=>x?._ct_watchlist===true);
  if(discoverState.tab==='calendar'){const groups=new Map();for(const x of a){const ds=discoverDate158(x);if(!ds)continue;if(!groups.has(ds))groups.set(ds,[]);groups.get(ds).push(x)}h.innerHTML='<div class="calendar-list">'+([...groups.entries()].map(([d,g])=>'<section class="panel calendar-day"><div class="panel-head"><h2>'+esc(formatRelease158(d))+'</h2><small>'+g.length+'</small></div>'+discoverCarousel158(g)+'</section>').join('')||'<div class="empty">'+(discoverState.type==='watchlist'?'Nenhum lançamento da sua Watchlist neste período.':'Nenhum lançamento neste filtro.')+'</div>')+'</div>';return}
  h.innerHTML=discoverCarousel158(a.slice(0,120));
}

/* r159 sports watched history/time — same single runtime */
function sportMinutes159(minutes){
  const n=Math.max(0,Math.round(Number(minutes||0)));if(!n)return'0 min';
  const h=Math.floor(n/60),m=n%60;return h?(h+'h'+(m?' '+m+'min':'')):(m+' min');
}

const renderProfile158For159=renderProfile;
renderProfile=async function(seq){
  const sportsStatsPromise=rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  await renderProfile158For159(seq);
  const sportStats=await sportsStatsPromise;
  if(seq!==navSeq||route()!=='profile')return;
  const root=$('[data-profile]');if(!root)return;
  const minutes=Math.max(0,Number(sportStats?.sports_minutes||0));
  const watched=Math.max(0,Number(sportStats?.watched_events||0));
  if(profileCache&&typeof profileCache==='object')profileCache.sports_stats=sportStats;
  const firstStats=root.querySelector('.panel .stats');
  if(firstStats){
    const totalCard=[...firstStats.querySelectorAll('.stat')].find(x=>x.querySelector('small')?.textContent?.trim()==='Tempo total');
    if(totalCard){const b=totalCard.querySelector('b');if(b)b.textContent=fmtMinutes(Math.max(0,Number(profileCache?.stats?.total_minutes||0))+minutes)}
    if(!firstStats.querySelector('[data-profile-sports-minutes]')){
      const time=document.createElement('div');time.className='stat';time.dataset.profileSportsMinutes='1';time.innerHTML='<small>Tempo em esportes</small><b>'+fmtMinutes(minutes)+'</b>';firstStats.appendChild(time);
      const count=document.createElement('div');count.className='stat';count.dataset.profileSportsWatched='1';count.innerHTML='<small>Eventos esportivos</small><b>'+watched.toLocaleString('pt-BR')+'</b>';firstStats.appendChild(count);
    }
  }
};

const sportsPayload158For159=sportsPayload;
sportsPayload=async function(force=false){
  const p=await sportsPayload158For159(force);
  if(!p.stats)p.stats=await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  if(!Array.isArray(p.watch_history))p.watch_history=[];
  return p;
};

sportsFiltered=function(p){
  let a=sportsState.tab==='watched'?(Array.isArray(p.watch_history)?p.watch_history:[]):(Array.isArray(p.events)?p.events:[]);
  if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);
  if(sportsState.tab==='today')a=a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay());
  if(sportsState.tab==='live')a=a.filter(x=>x.status==='live');
  if(sportsState.tab==='favorites')a=a.filter(x=>x.has_favorite);
  return a;
};

sportsEvent=function(e,p){
  const sm=sportLabelMap(p),s=sm.get(e.sport_slug)||{},fav=new Set((p.favorites||[]).map(x=>Number(x.entity_id))),match=e.home_name||e.away_name;
  const score=e.home_score!=null||e.away_score!=null?esc(e.home_score??'–')+' : '+esc(e.away_score??'–'):'×';
  const status=e.status==='live'?'AO VIVO':e.status==='finished'?'ENCERRADO':new Date(e.starts_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  const watched=Boolean(e.is_watched),duration=Math.max(0,Number(e.watched_duration_minutes||0));
  const f=(id,label)=>id?'<button class="fav '+(fav.has(Number(id))?'on':'')+'" data-sport-fav="'+Number(id)+'" data-on="'+(fav.has(Number(id))?'1':'0')+'">'+(fav.has(Number(id))?'★':'☆')+' '+esc(label)+'</button>':'';
  const watch='<button class="sport-watch '+(watched?'on':'')+'" type="button" data-sport-watch="'+Number(e.id||0)+'" data-watched="'+(watched?'1':'0')+'">'+(watched?'✓ Assistido'+(duration?' · '+sportMinutes159(duration):''):'✓ Marcar assistido')+'</button>';
  const watchedMeta=watched&&e.sport_watched_at?'<br><span class="sport-watched-meta">Assistido em '+new Date(e.sport_watched_at).toLocaleString('pt-BR')+(duration?' · '+sportMinutes159(duration):'')+'</span>':'';
  return '<article class="event '+(e.status==='live'?'live':'')+(watched?' watched':'')+'"><div class="event-top"><div class="league">'+(e.competition_logo?'<img src="'+esc(e.competition_logo)+'" alt="">':'')+'<span>'+esc(s.icon||'🏆')+' '+esc(e.competition_name||s.name||'Esporte')+'</span></div><span class="status '+(e.status==='live'?'live':'')+'">'+status+'</span></div>'+(match?'<div class="match"><div class="side">'+(e.home_logo?'<img src="'+esc(e.home_logo)+'" alt="">':'')+'<b>'+esc(e.home_name||'')+'</b></div><div class="score">'+score+'</div><div class="side">'+(e.away_logo?'<img src="'+esc(e.away_logo)+'" alt="">':'')+'<b>'+esc(e.away_name||'')+'</b></div></div>':'<div class="event-title">'+esc(e.title)+'</div>')+'<div class="meta">'+new Date(e.starts_at).toLocaleString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+(e.round?' · '+esc(e.round):'')+(e.venue?'<br>'+esc(e.venue):'')+watchedMeta+'</div><div class="fav-actions">'+f(e.competition_id,e.competition_name||'Competição')+f(e.home_id,e.home_name||'Time')+f(e.away_id,e.away_name||'Time')+watch+'</div></article>';
};

paintSports=function(p=sportsCache||{}){
  const h=$('[data-sports]');if(!h)return;
  const events=sportsFiltered(p),sports=p.sports||[],favorites=p.favorites||[],stats=p.stats||{},live=(p.events||[]).filter(x=>x.status==='live').length,today=(p.events||[]).filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay()).length;
  const watched=Math.max(0,Number(stats.watched_events||0)),sportMinutes=Math.max(0,Number(stats.sports_minutes||0));
  const title=sportsState.tab==='live'?'Ao vivo':sportsState.tab==='today'?'Eventos de hoje':sportsState.tab==='favorites'?'Eventos dos favoritos':sportsState.tab==='watched'?'Histórico assistido':'Próximos eventos';
  h.innerHTML='<div class="panel"><div class="panel-head"><h2>Central esportiva</h2><div class="actions"><span class="badge">'+(sportsState.provider?.api_sports_configured?'API-Sports + fallback':'TheSportsDB fallback')+'</span><button class="btn" data-sports-sync '+(sportsState.syncing?'disabled':'')+'>'+(sportsState.syncing?'Atualizando...':'Atualizar agenda')+'</button></div></div><div class="sports-summary sports-summary-r159">'+[['Hoje',today],['Ao vivo',live],['Assistidos',watched],['Tempo esportes',sportMinutes159(sportMinutes)],['Favoritos',favorites.length]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+b+'</b></div>').join('')+'</div></div><div class="tabs">'+[['today','Hoje'],['live','Ao vivo'],['calendar','Calendário'],['favorites','Favoritos'],['watched','Assistidos']].map(([k,l])=>'<button class="chip '+(sportsState.tab===k?'active':'')+'" data-sports-tab="'+k+'">'+l+'</button>').join('')+'</div><div class="filters"><button class="chip '+(sportsState.sport==='all'?'active':'')+'" data-sport="all">Todos</button>'+sports.map(s=>'<button class="chip '+(sportsState.sport===s.slug?'active':'')+'" data-sport="'+esc(s.slug)+'">'+esc(s.icon)+' '+esc(s.name)+'</button>').join('')+'</div>'+(sportsState.tab==='favorites'?'<section class="panel"><div class="panel-head"><h2>Favoritos</h2><small>'+favorites.length+'</small></div><div class="favorites-grid">'+(favorites.map(f=>'<div class="favorite-card">'+(f.logo_url||f.image_url?'<img src="'+esc(f.logo_url||f.image_url)+'" alt="">':'<span>🏆</span>')+'<div><b>'+esc(f.name)+'</b><small>'+esc(f.entity_type)+' · '+esc(f.sport_slug)+'</small></div><button class="fav on" data-sport-fav="'+Number(f.entity_id)+'" data-on="1">★</button></div>').join('')||'<div class="empty">Marque times, ligas ou entidades como favoritas nos eventos.</div>')+'</div></section>':'')+'<section class="panel"><div class="panel-head"><h2>'+title+'</h2><small>'+events.length+'</small></div><div class="event-grid">'+(events.map(e=>sportsEvent(e,p)).join('')||'<div class="empty">'+(sportsState.tab==='watched'?'Nenhum evento esportivo foi marcado como assistido ainda.':'Nenhum evento disponível neste filtro. Use “Atualizar agenda” para sincronizar os provedores.')+'</div>')+'</div></section>';
};

async function markSportWatched159(eventId,currentlyWatched){
  const b=document.querySelector('[data-sport-watch="'+Number(eventId)+'"]');if(b)b.disabled=true;
  try{
    const result=await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:Number(eventId),p_watched:!currentlyWatched,p_duration_minutes:null,p_watched_at:new Date().toISOString()});
    sportsCache=null;profileCache=null;await sportsPayload(true);if(route()==='sports')paintSports();
    const minutes=Number(result?.duration_minutes||0);
    toast(result?.is_watched?'Evento marcado como assistido'+(minutes?' · '+sportMinutes159(minutes):'')+'.':'Evento removido do histórico esportivo.');
  }catch(e){toast('Esportes: '+(e?.message||e))}finally{if(b)b.disabled=false}
}

document.addEventListener('click',function r159SportsWatchClick(e){
  const b=e.target.closest?.('[data-sport-watch]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  void markSportWatched159(Number(b.dataset.sportWatch),b.dataset.watched==='1');
},true);

/* r160 recent sports + explicit watched time + hidden Home history newest-first */
const paintHome159For160=paintHome;
paintHome=function(){
  const p=homeCache;
  if(!p||typeof p!=='object')return paintHome159For160();
  const episodes=p.history_episodes,movies=p.history_movies;
  if(Array.isArray(episodes))p.history_episodes=[...episodes].reverse();
  if(Array.isArray(movies))p.history_movies=[...movies].reverse();
  try{return paintHome159For160()}finally{
    if(Array.isArray(episodes))p.history_episodes=episodes;
    if(Array.isArray(movies))p.history_movies=movies;
  }
};

sportsPayload=async function(force=false){
  if(!force&&sportsCache)return sportsCache;
  const from=new Date(shiftDays(-7)+'T00:00:00'),to=new Date(shiftDays(9)+'T00:00:00');
  sportsCache=await rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()});
  if(!sportsCache||typeof sportsCache!=='object')sportsCache={sports:[],events:[],favorites:[],watch_history:[],stats:{watched_events:0,sports_minutes:0},preferences:{}};
  if(!sportsCache.stats)sportsCache.stats=await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  if(!Array.isArray(sportsCache.watch_history))sportsCache.watch_history=[];
  return sportsCache;
};

sportsFiltered=function(p){
  let a=sportsState.tab==='watched'?(Array.isArray(p.watch_history)?p.watch_history:[]):(Array.isArray(p.events)?p.events:[]);
  if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);
  if(sportsState.tab==='today')a=a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay());
  if(sportsState.tab==='recent'){
    const lo=shiftDays(-7),hi=localDay();
    a=a.filter(x=>{const d=new Date(x.starts_at).toLocaleDateString('sv-SE');return d>=lo&&d<hi})
      .sort((x,y)=>new Date(y.starts_at)-new Date(x.starts_at));
  }
  if(sportsState.tab==='live')a=a.filter(x=>x.status==='live');
  if(sportsState.tab==='favorites')a=a.filter(x=>x.has_favorite);
  if(sportsState.tab==='watched')a=[...a].sort((x,y)=>new Date(y.sport_watched_at||0)-new Date(x.sport_watched_at||0));
  return a;
};

const paintSports159For160=paintSports;
paintSports=function(p=sportsCache||{}){
  paintSports159For160(p);
  const h=$('[data-sports]');if(!h)return;
  const stats=p.stats||{},minutes=Math.max(0,Number(stats.sports_minutes||0)),watched=Math.max(0,Number(stats.watched_events||0));
  const summary=[...h.querySelectorAll('.sports-summary .stat')];
  const timeCard=summary.find(x=>x.querySelector('small')?.textContent?.trim()==='Tempo esportes');
  if(timeCard){const s=timeCard.querySelector('small');if(s)s.textContent='Tempo assistido'}
  const tabs=h.querySelector('.tabs');
  if(tabs&&!tabs.querySelector('[data-sports-tab="recent"]')){
    const today=tabs.querySelector('[data-sports-tab="today"]');
    const b=document.createElement('button');b.className='chip '+(sportsState.tab==='recent'?'active':'');b.dataset.sportsTab='recent';b.textContent='Recentes';
    today?.insertAdjacentElement('afterend',b);
  }
  if(sportsState.tab==='recent'){
    const sections=[...h.querySelectorAll('section.panel')],last=sections.at(-1),title=last?.querySelector('.panel-head h2');
    if(title)title.textContent='Últimos 7 dias';
  }
  const first=h.querySelector(':scope > .panel');
  if(first&&!h.querySelector('[data-sports-time-banner]')){
    const banner=document.createElement('div');banner.className='sports-time-banner';banner.dataset.sportsTimeBanner='1';
    banner.innerHTML='<span>⏱ Tempo esportivo assistido</span><b>'+sportMinutes159(minutes)+'</b><small>'+watched+' evento'+(watched===1?'':'s')+' marcado'+(watched===1?'':'s')+' · este tempo já entra no Tempo total do Perfil</small>';
    first.insertAdjacentElement('afterend',banner);
  }
};

syncSports=async function(force){
  if(sportsState.syncing)return;
  sportsState.syncing=true;paintSports();
  try{
    const p=sportsCache||{},fav=p.preferences?.favorite_sports||['soccer','formula_1','mma','basketball','american_football','ice_hockey'];
    await edge('ct-sports-sync',{action:'sync',date_from:shiftDays(-7),date_to:shiftDays(-1),sports:fav,force},50000);
    await edge('ct-sports-sync',{action:'sync',date_from:localDay(),date_to:shiftDays(2),sports:fav,force},50000);
    sportsCache=null;await sportsPayload(true);paintSports();
  }catch(e){toast('Esportes: '+(e?.message||e))}finally{sportsState.syncing=false;paintSports()}
};

const renderProfile159For160=renderProfile;
renderProfile=async function(seq){
  await renderProfile159For160(seq);
  if(seq!==navSeq||route()!=='profile')return;
  const root=$('[data-profile]');if(!root)return;
  const ss=profileCache?.sports_stats||await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0}));
  const minutes=Math.max(0,Number(ss?.sports_minutes||0)),watched=Math.max(0,Number(ss?.watched_events||0));
  const existing=[...root.querySelectorAll('.stat small')].find(x=>x.textContent?.trim()==='Tempo em esportes');
  if(existing)existing.textContent='Tempo esportivo assistido';
  if(!root.querySelector('[data-profile-sports-panel]')){
    const panel=document.createElement('section');panel.className='panel sports-profile-panel';panel.dataset.profileSportsPanel='1';
    panel.innerHTML='<div class="panel-head"><h2>Esportes assistidos</h2><small>só conta quando você marca ✓ Assistido</small></div><div class="sports-profile-time"><div><small>Tempo assistido</small><b>'+fmtMinutes(minutes)+'</b></div><div><small>Eventos assistidos</small><b>'+watched.toLocaleString('pt-BR')+'</b></div><p>O Tempo total acima já inclui filmes + séries + esportes assistidos.</p></div>';
    const first=root.querySelector('.panel');first?.insertAdjacentElement('afterend',panel);
  }
};

/* r161 production release guard + yesterday sports + deterministic hidden Home history */
window.__ctReleaseGuard='r161-release-guard';

function watchedAt161(x){
  const raw=x?.watched_at||x?.last_watched_at||x?.updated_at||x?.created_at||0;
  const ms=new Date(raw).getTime();return Number.isFinite(ms)?ms:0;
}
paintHome=function(){
  const p=homeCache;
  if(!p||typeof p!=='object')return paintHome159For160();
  const episodes=p.history_episodes,movies=p.history_movies;
  if(Array.isArray(episodes))p.history_episodes=[...episodes].sort((a,b)=>watchedAt161(a)-watchedAt161(b));
  if(Array.isArray(movies))p.history_movies=[...movies].sort((a,b)=>watchedAt161(a)-watchedAt161(b));
  try{return paintHome159For160()}finally{
    if(Array.isArray(episodes))p.history_episodes=episodes;
    if(Array.isArray(movies))p.history_movies=movies;
  }
};

const sportsFiltered160For161=sportsFiltered;
sportsFiltered=function(p){
  if(sportsState.tab==='yesterday'){
    let a=Array.isArray(p?.events)?p.events:[];
    if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);
    const day=shiftDays(-1);
    return a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===day)
      .sort((x,y)=>new Date(y.starts_at)-new Date(x.starts_at));
  }
  return sportsFiltered160For161(p);
};

const paintSports160For161=paintSports;
paintSports=function(p=sportsCache||{}){
  paintSports160For161(p);
  const h=$('[data-sports]');if(!h)return;
  const tabs=h.querySelector('.tabs');
  if(tabs&&!tabs.querySelector('[data-sports-tab="yesterday"]')){
    const today=tabs.querySelector('[data-sports-tab="today"]');
    const b=document.createElement('button');
    b.className='chip '+(sportsState.tab==='yesterday'?'active':'');
    b.dataset.sportsTab='yesterday';b.textContent='Ontem';
    today?.insertAdjacentElement('afterend',b);
  }
  if(sportsState.tab==='yesterday'){
    const sections=[...h.querySelectorAll('section.panel')],last=sections.at(-1),title=last?.querySelector('.panel-head h2');
    if(title)title.textContent='Jogos de ontem';
  }
};

let releaseCheckBusy161=false,releaseMismatch161=false;
async function checkRelease161(reason='manual'){
  if(releaseMismatch161)return true;
  if(releaseCheckBusy161)return false;
  releaseCheckBusy161=true;
  try{
    const r=await fetch('/release.json?ct='+Date.now(),{cache:'no-store',headers:{'cache-control':'no-cache'}});
    if(!r.ok)return false;
    const d=await r.json().catch(()=>null);
    if(d?.revision&&d.revision!==REVISION){
      releaseMismatch161=true;
      const u=new URL(location.href);
      u.searchParams.set('ct_refresh',String(d.revision));
      location.replace(u.toString());
      return true;
    }
  }catch{}
  finally{releaseCheckBusy161=false}
  return false;
}
window.__ctCheckRelease=checkRelease161;
window.addEventListener('focus',()=>void checkRelease161('focus'));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void checkRelease161('visible')});
document.addEventListener('click',e=>{if(e.target.closest?.('[data-nav]'))void checkRelease161('navigation')},true);
setInterval(()=>{if(!document.hidden)void checkRelease161('interval')},60000);
setTimeout(()=>void checkRelease161('boot'),2500);

async function globalSearch(q){const out=$('[data-global-results]');if(!out)return;if(q.trim().length<2){out.innerHTML='';return}out.innerHTML='<div class="global-results"><div class="loader">Buscando...</div></div>';try{const[m,t,p]=await Promise.all([safeTmdb('/search/movie',{query:q,page:1}),safeTmdb('/search/tv',{query:q,page:1}),safeTmdb('/search/person',{query:q,page:1})]);const rows=[...(m.results||[]).slice(0,5).map(x=>({...x,media_type:'movie'})),...(t.results||[]).slice(0,5).map(x=>({...x,media_type:'tv'})),...(p.results||[]).slice(0,5).map(x=>({...x,media_type:'person'}))];out.innerHTML=`<div class="global-results">${rows.map(x=>x.media_type==='person'?`<div class="global-result person" data-person="${x.id}"><div class="thumb"${x.profile_path?` style="background-image:url('${img(x.profile_path,'w185')}')"`:''}></div><div><b>${esc(x.name)}</b><small class="muted">Pessoa</small></div></div>`:`<div class="global-result" data-media="${x.media_type}:${x.id}"><div class="thumb"${x.poster_path?` style="background-image:url('${img(x.poster_path,'w154')}')"`:''}></div><div><b>${esc(x.title||x.name)}</b><small class="muted">${x.media_type==='movie'?'Filme':'Série'}</small></div></div>`).join('')||'<div class="empty">Nenhum resultado.</div>'}</div>`}catch(e){out.innerHTML=`<div class="global-results">${fail(e?.message||e)}</div>`}}
function toast(msg){document.querySelector('[data-toast]')?.remove();const d=document.createElement('div');d.dataset.toast='1';d.className='panel';d.style.cssText='position:fixed;right:16px;bottom:16px;z-index:9999;max-width:360px';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),3500)}
async function render(){const seq=++navSeq;const r=route();if(r==='auth'){await renderAuth();return}if(!session){history.replaceState({},'','/');await renderAuth();return}if(r==='home')return renderHome(seq);if(r==='discover')return renderDiscover(seq);if(r==='sports')return renderSports(seq);if(r==='profile')return renderProfile(seq);if(r==='configs')return renderConfigs(seq);const id=Number(location.pathname.match(/\d+/)?.[0]||0);if(r==='movie'||r==='series')return renderDetail(r,id,seq);if(r==='person')return renderPerson(id,seq);go('/home',true)}
let searchTimer=0;
document.addEventListener('input',e=>{if(e.target.matches('[data-global-search]')){clearTimeout(searchTimer);const q=e.target.value;searchTimer=setTimeout(()=>void globalSearch(q),250)}});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-login-form]');if(!f)return;e.preventDefault();const err=$('[data-auth-error]',f);err?.classList.add('hidden');void(async()=>{try{await login(f.email.value.trim(),f.password.value);history.replaceState({},'','/home');await render()}catch(x){if(err){err.textContent=x?.message||x;err.classList.remove('hidden')}}})()});
document.addEventListener('click',e=>{const nav=e.target.closest('[data-nav]');if(nav){e.preventDefault();go(pathFor(nav.dataset.nav));return}if(e.target.closest('[data-logout]')){e.preventDefault();void logout();return}const retry=e.target.closest('[data-retry]');if(retry){void render();return}const m=e.target.closest('[data-media]');if(m){const[t,id]=String(m.dataset.media).split(':');if(Number(id)>0)go(`/${t==='movie'?'movie':'series'}/${id}`);return}const person=e.target.closest('[data-person]');if(person){go(`/person/${Number(person.dataset.person)}`);return}const ht=e.target.closest('[data-home-tab]');if(ht){$$('[data-home-tab]').forEach(x=>x.classList.toggle('active',x===ht));$$('[data-home-view]').forEach(x=>x.classList.toggle('hidden',x.dataset.homeView!==ht.dataset.homeTab));return}const dt=e.target.closest('[data-discover-tab]');if(dt){discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){discoverState.type=ty.dataset.discoverType;void render();return}const st=e.target.closest('[data-sports-tab]');if(st){sportsState.tab=st.dataset.sportsTab;paintSports();return}const sp=e.target.closest('[data-sport]');if(sp){sportsState.sport=sp.dataset.sport;paintSports();return}if(e.target.closest('[data-sports-sync]')){void syncSports(true);return}const sf=e.target.closest('[data-sport-fav]');if(sf){void(async()=>{try{await rpc('cinetracker_sport_toggle_favorite_v1',{p_entity_id:Number(sf.dataset.sportFav),p_enabled:sf.dataset.on!=='1'});sportsCache=null;await sportsPayload(true);paintSports();toast('Favoritos esportivos atualizados.')}catch(x){toast(x?.message||x)}})();return}if(e.target.closest('[data-save-prefs]')){const lang=$('[data-lang]')?.value||'pt-BR';localStorage.setItem('cinetracker_locale',lang);toast('Preferências salvas.');return}if(e.target.closest('[data-clear-cache]')){try{sessionStorage.clear();for(const k of Object.keys(localStorage))if(/^ct\d|^ct:|cinetracker:runtime/.test(k))localStorage.removeItem(k);if('caches'in window)caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))}catch{}homeCache=null;profileCache=null;discoverCache.clear();sportsCache=null;toast('Cache temporário limpo.');return}if(e.target.closest('[data-refresh-metadata]')){void reconcile(false);return}const rec=e.target.closest('[data-reconcile]');if(rec){void reconcile(rec.dataset.reconcile==='all');return}if(e.target.closest('[data-reconcile-cancel]')){reconcileCancel=true;return}if(e.target.closest('[data-export]')){void(async()=>{try{const[d,p,s]=await Promise.all([rpc('cinetracker_profile_media_dashboard_v0991',{}),rpc('cinetracker_profile_payload_v0997',{p_tz:tz()}),sportsPayload()]);const blob=new Blob([JSON.stringify({version:'0.99.7',revision:REVISION,exported_at:new Date().toISOString(),dashboard:d,profile:p,sports:s},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`cinetracker-snapshot-${localDay()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}catch(x){toast(x?.message||x)}})();return}const wl=e.target.closest('[data-detail-watchlist]');if(wl){const[t,id]=wl.dataset.detailWatchlist.split(':');void addWatchlist(t,Number(id));return}const seen=e.target.closest('[data-detail-seen]');if(seen){const[t,id]=seen.dataset.detailSeen.split(':');void markSeen(t,Number(id));return}if(e.target.closest('[data-search-clear]')){const i=$('[data-global-search]'),o=$('[data-global-results]');if(i)i.value='';if(o)o.innerHTML='';return}},true);
document.addEventListener('click',e=>{
  const hep=e.target.closest?.('[data-home-mark-episode]');if(hep){e.preventDefault();e.stopPropagation();void markNextEpisode158(Number(hep.dataset.homeMarkEpisode));return}
  const hmv=e.target.closest?.('[data-home-mark-movie]');if(hmv){e.preventDefault();e.stopPropagation();void markHomeMovie158(Number(hmv.dataset.homeMarkMovie));return}
  const add=e.target.closest?.('[data-add-favorite]');if(add){e.preventDefault();openFavoriteSearch158(add.dataset.addFavorite);return}
  const dw=e.target.closest?.('[data-discover-watch]');if(dw){e.preventDefault();e.stopPropagation();const parts=String(dw.dataset.discoverWatch).split(':');void addWatchlist(parts[0],Number(parts[1])).then(()=>{discoverCache.clear();void render()}).catch(x=>toast(x?.message||x));return}
  const ht=e.target.closest?.('[data-home-tab]');if(ht){homeActiveTab158=ht.dataset.homeTab;requestAnimationFrame(()=>primeHomeHistory158(homeActiveTab158))}
},false);

window.addEventListener('popstate',()=>void render());
window.addEventListener('online',()=>{if(session)void render()});
async function boot(){try{if('serviceWorker'in navigator){navigator.serviceWorker.register('/service-worker.js').catch(()=>{});navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update().catch(()=>{}))).catch(()=>{})}if('caches'in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ct-web-')&&!k.includes(REVISION)).map(k=>caches.delete(k)))).catch(()=>{});for(const n of['cinetracker-preload-v1','cinetracker-preload-r153','cinetracker-preload-r154'])try{indexedDB.deleteDatabase(n)}catch{}const ok=await restoreSession();if(ok&&route()==='auth')history.replaceState({},'','/home');await render()}catch(e){setApp(`<div class="login-wrap">${fail(`Falha ao iniciar CineTracker: ${e?.message||e}`)}</div>`)}}
boot();
})();

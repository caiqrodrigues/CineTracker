import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const distDirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const fluidName='patch-v113-v0994-fluidity.js';
const fluidSource=resolve(root,'apps/web',fluidName);
const homeScrollOld="requestAnimationFrame(()=>{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist)vp.scrollTop=hist.offsetHeight});";
const homeScrollNew="{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist){vp.style.visibility='hidden';vp.style.scrollBehavior='auto';const h=hist.offsetHeight;vp.scrollTop=h;void vp.offsetHeight;vp.style.visibility='visible';vp.dataset.ct994Anchored='1'}}";

function replaceRange(source,startMarker,endMarker,replacement,label){const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);if(start<0||end<0||end<=start)throw new Error(`0.99.4 fluidity: ${label} markers not found`);return source.slice(0,start)+replacement+'\n'+source.slice(end)}

async function discoveryBlocker991(){
  if(!dashboard991.length)await fetchDashboard991();
  const ids=new Set(),aliases=new Set();
  const add=(type,id,year,values)=>{
    const t=type==='movie'?'movie':'tv',nId=Number(id||0),y=Number(year||0);
    if(nId>0)ids.add(`${t}:${nId}`);
    for(const value of values||[]){const n=normBlocked991(value);if(!n)continue;aliases.add(`${t}:*:${n}`);if(y)aliases.add(`${t}:${y}:${n}`)}
  };
  const hasHistory=x=>Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
  for(const x of dashboard991.filter(x=>x.is_watchlist||hasHistory(x)))add(x.media_type,x.tmdb_id,x.release_year,[x.title,x.raw_tmdb?.title,x.raw_tmdb?.name,x.raw_tmdb?.original_title,x.raw_tmdb?.original_name]);
  try{
    const ex=await sbRpc('cinetracker_discovery_exclusions_v0994',{})||{};
    for(const id of ex.movie_ids||[])ids.add(`movie:${Number(id)}`);for(const id of ex.tv_ids||[])ids.add(`tv:${Number(id)}`);
    for(const a of ex.aliases||[])add(a.media_type,0,a.release_year,[a.title,a.localized_title,a.localized_name,a.original_title,a.original_name]);
  }catch(e){console.warn('[CineTracker 0.99.4] exclusões remotas indisponíveis; usando bloqueio local',e)}
  const isBlocked=x=>{const type=x.media_type==='movie'?'movie':'tv',id=Number(x.id||x.tmdb_id||0);if(id>0&&ids.has(`${type}:${id}`))return true;const year=year991(x);for(const value of [x.title,x.name,x.original_title,x.original_name,x.raw_tmdb?.title,x.raw_tmdb?.name,x.raw_tmdb?.original_title,x.raw_tmdb?.original_name]){const n=normBlocked991(value);if(n&&(aliases.has(`${type}:*:${n}`)||aliases.has(`${type}:${year}:${n}`)))return true}return false};
  return{isBlocked,ids,aliases};
}

async function recommendationData991(){
  if(!dashboard991.length)await fetchDashboard991();
  const blocker=await discoveryBlocker991();
  const hasAnyHistory=x=>Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
  const toCard=x=>{const raw=x.raw_tmdb||{},type=x.media_type==='movie'?'movie':'tv',year=Number(x.release_year||year991(x)||0);return {...raw,id:Number(x.tmdb_id),tmdb_id:Number(x.tmdb_id),media_type:type,title:type==='movie'?x.title:undefined,name:type==='tv'?x.title:undefined,poster_path:x.poster_path||raw.poster_path||null,release_date:type==='movie'&&year?`${year}-01-01`:raw.release_date,first_air_date:type==='tv'&&year?`${year}-01-01`:raw.first_air_date,vote_average:score991(x)}};
  const personal=dashboard991.filter(x=>x.is_watchlist&&!hasAnyHistory(x)&&Number(x.tmdb_id)>0).map(toCard);
  const movieSeed=personal.filter(x=>x.media_type==='movie').sort((a,b)=>score991(b)-score991(a));
  const seriesSeed=personal.filter(x=>x.media_type==='tv'&&!isAnime991(x)).sort((a,b)=>score991(b)-score991(a));
  const animeSeed=personal.filter(x=>x.media_type==='tv'&&isAnime991(x)).sort((a,b)=>score991(b)-score991(a));
  const [mp1,mp2,tp1,tp2,ap1,ap2]=await Promise.all([
    api991('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':160,include_adult:false,page:1}),
    api991('/discover/movie',{sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,include_adult:false,page:1}),
    api991('/discover/tv',{sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':50,include_adult:false,page:1}),
    api991('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'popularity.desc',include_adult:false,page:1})
  ]);
  const unique=rows=>rows.filter((x,i,a)=>Number(x.id)>0&&a.findIndex(y=>Number(y.id)===Number(x.id))===i);
  const fresh={
    movie:unique([...(mp1.results||[]),...(mp2.results||[])].map(x=>({...x,media_type:'movie'}))),
    tv:unique([...(tp1.results||[]),...(tp2.results||[])].map(x=>({...x,media_type:'tv'})).filter(x=>!isAnime991(x))),
    anime:unique([...(ap1.results||[]),...(ap2.results||[])].map(x=>({...x,media_type:'tv'})).filter(isAnime991))
  };
  for(const k of Object.keys(fresh))fresh[k]=fresh[k].filter(x=>year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x));
  const used=new Set(),takeFresh=rows=>{const x=(rows||[]).find(y=>!used.has(`${y.media_type}:${Number(y.id)}`));if(x)used.add(`${x.media_type}:${Number(x.id)}`);return x||null};
  const daily=takeFresh(fresh.movie.filter(x=>year991(x)>1990&&score991(x)>=8));
  const fm=takeFresh(fresh.movie),ft=takeFresh(fresh.tv),fa=takeFresh(fresh.anime);
  return{daily,wm:movieSeed[0]||null,wt:seriesSeed[0]||null,wa:animeSeed[0]||null,fm,ft,fa};
}

async function mixedRows991(kind){
  if(!dashboard991.length)await fetchDashboard991();
  const blocker=await discoveryBlocker991(),f=discover991.filter,j=[];
  if(kind==='trending'){
    if(f!=='tv')j.push(api991('/trending/movie/week').then(d=>(d.results||[]).map(x=>({...x,media_type:'movie'}))));
    if(f!=='movie')j.push(api991('/trending/tv/week').then(d=>(d.results||[]).map(x=>({...x,media_type:'tv'}))));
  }else if(kind==='anticipated'){
    if(f!=='tv')j.push(api991('/movie/upcoming').then(d=>(d.results||[]).map(x=>({...x,media_type:'movie'}))));
    if(f!=='movie')j.push(api991('/tv/on_the_air').then(d=>(d.results||[]).map(x=>({...x,media_type:'tv'}))));
  }else if(kind==='top'){
    if(f!=='tv')j.push(api991('/movie/top_rated').then(d=>(d.results||[]).map(x=>({...x,media_type:'movie'}))));
    if(f!=='movie')j.push(api991('/tv/top_rated').then(d=>(d.results||[]).map(x=>({...x,media_type:'tv'}))));
  }else return[];
  const clean=(await Promise.all(j)).flat().filter(x=>Number(x.id)>0&&!blocker.isBlocked(x)).filter((x,i,a)=>a.findIndex(y=>Number(y.id)===Number(x.id)&&y.media_type===x.media_type)===i);
  if(kind==='trending')return clean.sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));
  if(kind==='anticipated')return clean.sort((a,b)=>String(a.release_date||a.first_air_date||'9999').localeCompare(String(b.release_date||b.first_air_date||'9999')));
  return clean.sort((a,b)=>score991(b)-score991(a));
}

async function loadForYou991(){
  const host=$991('#ct991-discover-results');if(!host)return;
  if(!window.__ct991HasForYouCache?.())host.innerHTML='<div class="ct991-empty">Carregando recomendações…</div>';
  try{
    const r=await recommendationData991(),f=discover991.filter||'all';
    const slot=(label,x)=>`<div class="ct114-rec-slot"><small>${label}</small>${recSlot991(x)}</div>`;
    const daily=f==='tv'?'':`<section class="ct991-rec-section"><h3>Indicação do dia</h3><p class="ct114-rec-rule">Filme lançado após 1990 · nota TMDB 8,0 ou maior · nunca visto</p><div class="ct991-rec-grid one">${slot('Filme',r.daily)}</div></section>`;
    const watch=f==='movie'?[['Filme',r.wm]]:f==='tv'?[['Série',r.wt],['Anime',r.wa]]:[['Filme',r.wm],['Série',r.wt],['Anime',r.wa]];
    const fresh=f==='movie'?[['Filme',r.fm]]:f==='tv'?[['Série',r.ft],['Anime',r.fa]]:[['Filme',r.fm],['Série',r.ft],['Anime',r.fa]];
    host.innerHTML=`<div class="ct991-rec">${daily}<section class="ct991-rec-section"><h3>Da sua Watchlist</h3><div class="ct991-rec-grid">${watch.map(([l,x])=>slot(l,x)).join('')}</div></section><section class="ct991-rec-section"><h3>100% novos</h3><div class="ct991-rec-grid">${fresh.map(([l,x])=>slot(l,x)).join('')}</div></section></div>`;bindMedia991(host)
  }catch(e){host.innerHTML=`<div class="ct991-empty">Falha ao carregar Pra Você: ${esc991(e?.message||e)}</div>`}
}

async function loadDiscover991(){
  const host=$991('#ct991-discover-results'),controls=$991('#ct991-discover-controls');if(!host)return;
  $$991('[data-dtab991]').forEach(b=>b.classList.toggle('active',b.dataset.dtab991===discover991.tab));
  if(discover991.tab==='foryou'){controls.innerHTML=discoverFilters991();bindDiscoverFilters991();return loadForYou991()}
  if(discover991.tab==='calendar')return loadCalendar991();
  controls.innerHTML=discoverFilters991();bindDiscoverFilters991();
  if(!window.__ct991HasMixedCache?.(discover991.tab))host.innerHTML='<div class="ct991-empty">Carregando…</div>';
  try{const rows=await mixedRows991(discover991.tab);host.innerHTML=rows.length?`<div class="ct991-media-grid">${rows.slice(0,40).map(mediaCard991).join('')}</div>`:'<div class="ct991-empty">Nenhum título novo encontrado.</div>';bindMedia991(host)}catch(e){host.innerHTML=`<div class="ct991-empty">Falha ao carregar Descobrir: ${esc991(e?.message||e)}</div>`}
}

function renderDiscover991(){
  setView991('discover');
  if(!['foryou','trending','anticipated','top','calendar'].includes(discover991.tab))discover991.tab='foryou';
  if(!['all','tv','movie'].includes(discover991.filter))discover991.filter='all';
  const app=$991('#app');if(!app)return false;
  app.innerHTML=shell991('Descobrir','Recomendações e lançamentos com Pra Você como entrada padrão.',`<div class="ct991-discover-tabs">${discoverTabs991.map(([k,l])=>`<button class="ct991-tab ${k===discover991.tab?'active':''}" data-dtab991="${k}">${l}</button>`).join('')}</div><div id="ct991-discover-controls"></div><div id="ct991-discover-results"></div>`,'discover');
  $$991('[data-dtab991]',app).forEach(b=>b.onclick=()=>{discover991.tab=b.dataset.dtab991;discover991.filter='all';void loadDiscover991()});
  footer991();
  if(dashboard991.length){void loadDiscover991();void fetchDashboard991(true).then(()=>window.__ct991PersistProfile?.()).catch(e=>console.warn('[CineTracker 0.99.4] refresh Descobrir',e))}
  else void fetchDashboard991().then(()=>{window.__ct991PersistProfile?.();return loadDiscover991()});
  return true;
}

async function renderProfile991(){
  setView991('profile');const app=$991('#app');if(!app)return false;
  app.innerHTML=shell991('Perfil','Estatísticas, filtros, favoritos e atividade sincronizada.','<div id="ct991-profile"></div>','profile');footer991();
  if(dashboard991.length){renderProfileBody991();void fetchDashboard991(true).then(()=>{window.__ct991PersistProfile?.();let v='';try{v=String(view||'')}catch{}if(v==='profile'||v==='history')renderProfileBody991()}).catch(e=>console.warn('[CineTracker 0.99.4] refresh Perfil',e));return true}
  const h=$991('#ct991-profile');if(h)h.innerHTML='<div class="ct991-empty">Sincronizando Perfil…</div>';
  try{await fetchDashboard991(true);window.__ct991PersistProfile?.();renderProfileBody991()}catch(e){if(h)h.innerHTML=`<div class="ct991-empty">Falha ao sincronizar Perfil: ${esc991(e?.message||e)}</div>`}return true;
}

function timeline991(){
  const today=new Date();today.setHours(0,0,0,0),days=[];
  for(let i=-10;i<=3;i++){
    const d=new Date(today);d.setDate(d.getDate()+i);const k=localKey991(d),rows=history991.filter(x=>x.item_type==='episode'&&x.watched_at&&localKey991(x.watched_at)===k),unique=new Set(rows.map(x=>`${x.media_id||x.title}:${x.season_number}:${x.episode_number}`));days.push({d,k,i,episodes:unique.size})
  }
  const max=Math.max(1,...days.map(x=>x.episodes));
  return `<div class="ct991-timeline" id="ct991-timeline"><div class="ct991-track">${days.map(x=>`<button class="ct991-day ${x.i===0?'today':''}" data-day991="${x.k}"><div class="count">${x.episodes}</div><div class="ct991-barwrap"><div class="ct991-bar" style="height:${Math.max(4,Math.round((x.episodes/max)*145))}px"></div></div><small>${x.i===0?'Hoje':x.d.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'})}</small></button>`).join('')}</div></div>`
}

for(const dir of distDirs){
  const homePath=resolve(dir,'patch-v099-v0994-web.js');let home=await readFile(homePath,'utf8');
  if(!home.includes(homeScrollOld))throw new Error(`0.99.4 fluidity: Home scroll marker not found in ${homePath}`);home=home.replace(homeScrollOld,homeScrollNew);await writeFile(homePath,home,'utf8');

  const legacyPath=resolve(dir,'patch-v092-v0991.js');let legacy=await readFile(legacyPath,'utf8');
  legacy=replaceRange(legacy,'async function discoveryBlocker991(){','async function recommendationData991',discoveryBlocker991.toString(),'Discover blocker');
  legacy=replaceRange(legacy,'async function recommendationData991(){','function recSlot991',recommendationData991.toString(),'recommendations');
  legacy=replaceRange(legacy,'async function mixedRows991(kind){','function discoverFilters991',mixedRows991.toString(),'global Discover');
  legacy=replaceRange(legacy,'function timeline991(){','function openDay991',timeline991.toString(),'timeline');
  legacy=replaceRange(legacy,'async function renderProfile991(){','async function favoriteByMediaId991',renderProfile991.toString(),'profile render');
  legacy=replaceRange(legacy,'async function loadForYou991(){','async function mixedRows991',loadForYou991.toString(),'Pra Voce');
  legacy=replaceRange(legacy,'async function loadDiscover991(){','function renderDiscover991',loadDiscover991.toString(),'Discover loader');
  legacy=replaceRange(legacy,'function renderDiscover991(){','function organizeSettings991',renderDiscover991.toString(),'Discover render');
  legacy=legacy.replace('Nenhum título elegível com ano &gt; 1990 e nota ≥ 7,8.','Nenhum título elegível para esta categoria.');
  legacy=legacy.replace('Hoje centralizado · 15 dias anteriores + 3 futuros','Hoje centralizado · 3 dias antes e 3 depois visíveis · role até 10 dias para trás');
  await writeFile(legacyPath,legacy,'utf8');

  await copyFile(fluidSource,resolve(dir,fluidName));
  const indexPath=resolve(dir,'index.html');let html=await readFile(indexPath,'utf8');html=html.replace(new RegExp(`<script src="/${fluidName.replaceAll('.','\\.')}"></script>`,'g'),'');const warmTag='<script src="/patch-v112-v0994-warm-boot.js"></script>';if(!html.includes(warmTag))throw new Error(`0.99.4 fluidity: v112 tag missing in ${indexPath}`);html=html.replace(warmTag,`${warmTag}<script src="/${fluidName}"></script>`);await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.4: Pra Você exato, exclusões fail-closed, Home ancorada e gráfico ±3/10 dias aplicados.');

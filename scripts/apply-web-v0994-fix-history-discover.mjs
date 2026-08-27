import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const layer='patch-v107-v0994-data-ui-fix.js';
const layerTag=`<script src="/${layer}"></script>`;
const afterTag='<script src="/patch-v106-v0994-refactor.js"></script>';
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

function replaceRange(source,startMarker,endMarker,replacement,label){
  const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);
  if(start<0||end<0||end<=start)throw new Error(`0.99.4 data fix: ${label} markers not found`);
  return source.slice(0,start)+replacement+'\n'+source.slice(end);
}

const recommendation=`function normBlocked991(x){return String(x||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
async function discoveryBlocker991(){
  let ex={};try{ex=await sbRpc('cinetracker_discovery_exclusions_v0994',{})||{}}catch{}
  const ids=new Set();for(const id of ex.movie_ids||[])ids.add(\`movie:\${Number(id)}\`);for(const id of ex.tv_ids||[])ids.add(\`tv:\${Number(id)}\`);
  const aliases=new Set();for(const a of ex.aliases||[]){const type=a.media_type==='movie'?'movie':'tv',year=Number(a.release_year||0);for(const value of [a.title,a.localized_title,a.localized_name,a.original_title,a.original_name]){const n=normBlocked991(value);if(n)aliases.add(\`\${type}:\${year}:\${n}\`)}}
  const isBlocked=x=>{const type=x.media_type==='movie'?'movie':'tv',id=Number(x.id||x.tmdb_id||0);if(id>0&&ids.has(\`\${type}:\${id}\`))return true;const year=year991(x);for(const value of [x.title,x.name,x.original_title,x.original_name,x.raw_tmdb?.title,x.raw_tmdb?.name,x.raw_tmdb?.original_title,x.raw_tmdb?.original_name]){const n=normBlocked991(value);if(n&&aliases.has(\`\${type}:\${year}:\${n}\`))return true}return false};
  return{isBlocked,ids,aliases};
}
async function recommendationData991(){
  /* v107-strict-discovery-exclusion */
  if(!dashboard991.length)await fetchDashboard991();
  const blocker=await discoveryBlocker991();
  const hasAnyHistory=x=>Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
  const personal=dashboard991.filter(x=>x.is_watchlist&&!hasAnyHistory(x)&&Number(x.tmdb_id)>0&&validRec991(x));
  const movieSeed=personal.filter(x=>x.media_type==='movie').slice(0,64);
  const seriesSeed=personal.filter(x=>x.media_type==='tv'&&!isAnime991(x)).slice(0,64);
  const animeSeed=personal.filter(x=>x.media_type==='tv'&&isAnime991(x)).slice(0,64);
  const hydrated={movie:await hydrateWatch991(movieSeed,8),tv:await hydrateWatch991(seriesSeed,8),anime:await hydrateWatch991(animeSeed,8)};
  const used=new Set(),take=rows=>{const x=(rows||[]).find(y=>Number(y.id)>0&&!used.has(\`\${y.media_type}:\${Number(y.id)}\`)&&!blocker.isBlocked(y));if(x)used.add(\`\${x.media_type}:\${Number(x.id)}\`);return x||null};
  const takePersonal=rows=>{const x=(rows||[]).find(y=>Number(y.id)>0&&!used.has(\`\${y.media_type}:\${Number(y.id)}\`));if(x)used.add(\`\${x.media_type}:\${Number(x.id)}\`);return x||null};
  const fresh={movie:[],tv:[],anime:[]};
  const [mp1,mp2,tp1,tp2,ap1,ap2]=await Promise.all([
    api991('/discover/movie',{sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,include_adult:false,page:2}),
    api991('/discover/tv',{sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':80,include_adult:false,page:2}),
    api991('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':40,include_adult:false,page:2})
  ]);
  fresh.movie=[...(mp1.results||[]),...(mp2.results||[])].map(x=>({...x,media_type:'movie'}));
  fresh.tv=[...(tp1.results||[]),...(tp2.results||[])].map(x=>({...x,media_type:'tv'})).filter(x=>!isAnime991(x));
  fresh.anime=[...(ap1.results||[]),...(ap2.results||[])].map(x=>({...x,media_type:'tv'})).filter(isAnime991);
  const fallbackOk=x=>year991(x)>1990&&score991(x)>=7;
  for(const k of Object.keys(fresh))fresh[k]=fresh[k].filter(x=>validRec991(x)||fallbackOk(x)).filter(x=>!blocker.isBlocked(x)).filter((x,i,a)=>a.findIndex(y=>Number(y.id)===Number(x.id))===i);
  let wm=takePersonal(hydrated.movie),wt=takePersonal(hydrated.tv),wa=takePersonal(hydrated.anime);
  let daily=takePersonal([...hydrated.movie,...hydrated.tv,...hydrated.anime]);
  let fm=take(fresh.movie),ft=take(fresh.tv),fa=take(fresh.anime);
  if(!wm)wm=take(fresh.movie);if(!wt)wt=take(fresh.tv);if(!wa)wa=take(fresh.anime);
  if(!daily)daily=take([...fresh.movie,...fresh.tv,...fresh.anime]);
  if(!fm)fm=take(fresh.movie);if(!ft)ft=take(fresh.tv);if(!fa)fa=take(fresh.anime);
  return{daily,wm,wt,wa,fm,ft,fa};
}`;

const mixed=`async function mixedRows991(kind){
  /* v107-strict-global-discovery */
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
}`;

const calendar=`async function loadCalendar991(){
  /* v107-calendar-fast-stable */
  const host=$991('#ct991-discover-results'),controls=$991('#ct991-discover-controls');if(!host||!controls)return;
  controls.innerHTML=discoverFilters991(true);bindDiscoverFilters991();host.innerHTML='<div class="ct991-empty">Sincronizando calendário oficial…</div>';
  const a=new Date(),b=new Date(a);b.setDate(b.getDate()+45),fmt=d=>d.toISOString().slice(0,10),from=fmt(a),to=fmt(b);
  try{
    if(!dashboard991.length)await fetchDashboard991();
    const jobs=[];
    if(discover991.filter!=='tv')jobs.push(api991('/discover/movie',{'primary_release_date.gte':from,'primary_release_date.lte':to,sort_by:'primary_release_date.asc',include_adult:false}).then(d=>(d.results||[]).map(x=>({...x,media_type:'movie',d:x.release_date})).filter(x=>x.d)));
    else jobs.push(Promise.resolve([]));
    const tracked=[];
    if(discover991.filter!=='movie')for(const row of dashboard991.filter(x=>x.media_type==='tv'&&(x.is_watchlist||x.is_in_progress||x.is_up_to_date||x.watched_episodes>0))){const ep=row.raw_tmdb?.next_episode_to_air,day=ep?.air_date;if(day&&day>=from&&day<=to)tracked.push({id:Number(row.tmdb_id),media_type:'tv',name:`${row.title} · S${String(ep.season_number||0).padStart(2,'0')}E${String(ep.episode_number||0).padStart(2,'0')}`,poster_path:row.poster_path,first_air_date:day,vote_average:Number(row.raw_tmdb?.vote_average||0),d:day})}
    jobs.push(Promise.resolve(tracked));
    if(discover991.filter!=='movie'&&!tracked.length)jobs.push(api991('/tv/on_the_air').then(d=>(d.results||[]).map(x=>({...x,media_type:'tv',d:x.first_air_date})).filter(x=>x.d&&x.d>=from&&x.d<=to)).catch(()=>[]));
    const rows=(await Promise.all(jobs)).flat().filter(x=>x.d),groups={};rows.forEach(x=>(groups[x.d]||(groups[x.d]=[])).push(x));
    if(discover991.tab!=='calendar')return;
    host.innerHTML=`<div class="ct991-calendar">${Object.entries(groups).sort(([da],[db])=>da.localeCompare(db)).map(([day,list])=>`<section class="ct991-calday"><h3>${new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct991-calrow">${list.map(mediaCard991).join('')}</div></section>`).join('')||'<div class="ct991-empty">Nenhum lançamento ou próximo episódio encontrado nos próximos 45 dias.</div>'}</div>`;bindMedia991(host);
  }catch(e){if(discover991.tab==='calendar')host.innerHTML=`<div class="ct991-empty">Falha ao carregar calendário: ${esc991(e?.message||e)}</div>`}
}`;

const renderDiscover=`function renderDiscover991(){
  /* v107-preserve-discover-state */
  setView991('discover');
  if(!['foryou','trending','anticipated','top','calendar'].includes(discover991.tab))discover991.tab='foryou';
  if(!['all','tv','movie'].includes(discover991.filter))discover991.filter='all';
  const app=$991('#app');if(!app)return false;
  app.innerHTML=shell991('Descobrir','Recomendações e lançamentos com Pra Você como entrada padrão.',`<div class="ct991-discover-tabs">${discoverTabs991.map(([k,l])=>`<button class="ct991-tab ${k===discover991.tab?'active':''}" data-dtab991="${k}">${l}</button>`).join('')}</div><div id="ct991-discover-controls"></div><div id="ct991-discover-results"></div>`,'discover');
  $$991('[data-dtab991]',app).forEach(b=>b.onclick=()=>{discover991.tab=b.dataset.dtab991;discover991.filter='all';void loadDiscover991()});
  footer991();void fetchDashboard991().then(()=>loadDiscover991());return true;
}`;

for(const target of targets){
  const indexPath=resolve(target,'index.html');let html=await readFile(indexPath,'utf8');html=html.split(layerTag).join('');
  if(!html.includes(afterTag))throw new Error(`0.99.4 data fix: refactor layer missing in ${indexPath}`);
  html=html.replace(afterTag,`${afterTag}${layerTag}`);await writeFile(indexPath,html,'utf8');await copyFile(resolve(root,'apps/web',layer),resolve(target,layer));
  const legacyPath=resolve(target,'patch-v092-v0991.js');let legacy=await readFile(legacyPath,'utf8');
  legacy=replaceRange(legacy,'async function recommendationData991(){','function recSlot991',recommendation,'recommendation exclusions');
  legacy=replaceRange(legacy,'async function mixedRows991(kind){','function discoverFilters991',mixed,'global discovery exclusions');
  legacy=replaceRange(legacy,'async function loadCalendar991(){','function bindDiscoverFilters991',calendar,'calendar');
  legacy=replaceRange(legacy,'function renderDiscover991(){','function organizeSettings991',renderDiscover,'discover state');
  await writeFile(legacyPath,legacy,'utf8');
}
console.log('CineTracker Web 0.99.4: histórico recente, exclusões de Descobrir, calendário estável e Configurações finalizados.');

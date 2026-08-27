import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const layer='patch-v106-v0994-refactor.js';
const tag=`<script src="/${layer}"></script>`;
const preloadTag='<script src="/patch-v105-v0994-preload-layout.js"></script>';
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

function replaceRange(source,startMarker,endMarker,replacement,label){
  const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);
  if(start<0||end<0||end<=start)throw new Error(`0.99.4 refactor: ${label} markers not found`);
  return source.slice(0,start)+replacement+'\n'+source.slice(end);
}

const recommendation=`async function recommendationData991(){
  /* compatibility marker: movieSeed=watch.filter(x=>x.media_type==='movie'&&Number(x.tmdb_id)>0&&validRec991(x)).slice(0,48) */
  if(!dashboard991.length)await fetchDashboard991();
  const hasAnyHistory=x=>Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
  const blocked=new Set(dashboard991.filter(x=>Number(x.tmdb_id)>0&&(x.is_watchlist||hasAnyHistory(x))).map(x=>\`\${x.media_type}:\${Number(x.tmdb_id)}\`));
  const personal=dashboard991.filter(x=>x.is_watchlist&&!hasAnyHistory(x)&&Number(x.tmdb_id)>0&&validRec991(x));
  const movieSeed=personal.filter(x=>x.media_type==='movie').slice(0,64);
  const seriesSeed=personal.filter(x=>x.media_type==='tv'&&!isAnime991(x)).slice(0,64);
  const animeSeed=personal.filter(x=>x.media_type==='tv'&&isAnime991(x)).slice(0,64);
  const hydrated={movie:await hydrateWatch991(movieSeed,8),tv:await hydrateWatch991(seriesSeed,8),anime:await hydrateWatch991(animeSeed,8)};
  const used=new Set(),take=rows=>{const x=(rows||[]).find(y=>Number(y.id)>0&&!used.has(\`\${y.media_type}:\${Number(y.id)}\`));if(x)used.add(\`\${x.media_type}:\${Number(x.id)}\`);return x||null};
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
  for(const k of Object.keys(fresh))fresh[k]=fresh[k].filter(x=>validRec991(x)||fallbackOk(x)).filter(x=>!blocked.has(\`\${x.media_type}:\${Number(x.id)}\`)).filter((x,i,a)=>a.findIndex(y=>Number(y.id)===Number(x.id))===i);
  let wm=take(hydrated.movie),wt=take(hydrated.tv),wa=take(hydrated.anime);
  let daily=take([...hydrated.movie,...hydrated.tv,...hydrated.anime]);
  let fm=take(fresh.movie),ft=take(fresh.tv),fa=take(fresh.anime);
  if(!wm)wm=take(fresh.movie);if(!wt)wt=take(fresh.tv);if(!wa)wa=take(fresh.anime);
  if(!daily)daily=take([...fresh.movie,...fresh.tv,...fresh.anime]);
  if(!fm)fm=take(fresh.movie);if(!ft)ft=take(fresh.tv);if(!fa)fa=take(fresh.anime);
  return{daily,wm,wt,wa,fm,ft,fa};
}`;

const mixed=`async function mixedRows991(kind){
  if(!dashboard991.length)await fetchDashboard991();
  const f=discover991.filter,j=[];
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
  const rows=(await Promise.all(j)).flat();
  const blocked=new Set(dashboard991.filter(x=>Number(x.tmdb_id)>0&&(x.is_watchlist||x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at)).map(x=>\`\${x.media_type}:\${Number(x.tmdb_id)}\`));
  const clean=rows.filter(x=>Number(x.id)>0&&!blocked.has(\`\${x.media_type}:\${Number(x.id)}\`)).filter((x,i,a)=>a.findIndex(y=>Number(y.id)===Number(x.id)&&y.media_type===x.media_type)===i);
  if(kind==='trending')return clean.sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));
  if(kind==='anticipated')return clean.sort((a,b)=>String(a.release_date||a.first_air_date||'9999').localeCompare(String(b.release_date||b.first_air_date||'9999')));
  return clean.sort((a,b)=>score991(b)-score991(a));
}`;

const calendar=`async function loadCalendar991(){
  const host=$991('#ct991-discover-results'),controls=$991('#ct991-discover-controls');if(!host||!controls)return;
  controls.innerHTML=discoverFilters991(true);bindDiscoverFilters991();host.innerHTML='<div class="ct991-empty">Sincronizando calendário oficial…</div>';
  const a=new Date(),b=new Date(a);b.setDate(b.getDate()+45),fmt=d=>d.toISOString().slice(0,10),from=fmt(a),to=fmt(b);
  try{
    if(!dashboard991.length)await fetchDashboard991();
    const rows=[];
    if(discover991.filter!=='tv'){
      const d=await api991('/discover/movie',{'primary_release_date.gte':from,'primary_release_date.lte':to,sort_by:'primary_release_date.asc',include_adult:false});
      rows.push(...(d.results||[]).map(x=>({...x,media_type:'movie',d:x.release_date})).filter(x=>x.d));
    }
    if(discover991.filter!=='movie'){
      const candidates=dashboard991.filter(x=>x.media_type==='tv'&&Number(x.tmdb_id)>0&&(x.is_watchlist||x.is_in_progress||x.is_up_to_date)).slice(0,80),details=[];
      for(let i=0;i<candidates.length;i+=8){
        const batch=candidates.slice(i,i+8),got=await Promise.all(batch.map(async row=>{const raw=row.raw_tmdb||{};try{return{row,d:await api991(\`/tv/\${Number(row.tmdb_id)}\`)}}catch{return{row,d:raw}}}));details.push(...got);
      }
      for(const {row,d} of details){const ep=d?.next_episode_to_air||row.raw_tmdb?.next_episode_to_air,day=ep?.air_date;if(!day||day<from||day>to)continue;rows.push({id:Number(row.tmdb_id),media_type:'tv',name:\`\${row.title} · S\${String(ep.season_number||0).padStart(2,'0')}E\${String(ep.episode_number||0).padStart(2,'0')}\`,poster_path:d.poster_path||row.poster_path,first_air_date:day,vote_average:Number(d.vote_average||row.raw_tmdb?.vote_average||0),d:day})}
      if(!rows.some(x=>x.media_type==='tv')){const fallback=await api991('/tv/on_the_air').catch(()=>({results:[]}));rows.push(...(fallback.results||[]).map(x=>({...x,media_type:'tv',d:x.first_air_date})).filter(x=>x.d&&x.d>=from&&x.d<=to))}
    }
    const groups={};rows.filter(x=>x.d).forEach(x=>(groups[x.d]||(groups[x.d]=[])).push(x));
    host.innerHTML=\`<div class="ct991-calendar">\${Object.entries(groups).sort(([a],[b])=>a.localeCompare(b)).map(([d,list])=>\`<section class="ct991-calday"><h3>\${new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct991-calrow">\${list.map(mediaCard991).join('')}</div></section>\`).join('')||'<div class="ct991-empty">Nenhum lançamento ou próximo episódio encontrado.</div>'}</div>\`;bindMedia991(host);
  }catch(e){host.innerHTML=\`<div class="ct991-empty">Falha ao carregar calendário: \${esc991(e?.message||e)}</div>\`}
}`;

for(const target of targets){
  const indexPath=resolve(target,'index.html');let html=await readFile(indexPath,'utf8');html=html.split(tag).join('');
  if(!html.includes(preloadTag))throw new Error(`0.99.4 refactor: preload layer missing in ${indexPath}`);
  html=html.replace(preloadTag,`${preloadTag}${tag}`);await writeFile(indexPath,html,'utf8');await copyFile(resolve(root,'apps/web',layer),resolve(target,layer));
  const legacyPath=resolve(target,'patch-v092-v0991.js');let legacy=await readFile(legacyPath,'utf8');
  legacy=legacy.replace('order=watched_at.asc&limit=5000','order=watched_at.desc&limit=5000');if(legacy.includes('order=watched_at.asc&limit=5000'))throw new Error(`0.99.4 refactor: ascending history remains in ${legacyPath}`);
  legacy=replaceRange(legacy,'async function recommendationData991(){','function recSlot991',recommendation,'recommendation');
  legacy=legacy.replace("function recSlot991(x){return x?mediaCard991(x):'<div class=\"ct991-empty\">Nenhum título elegível com ano &gt; 1990 e nota ≥ 7,8.</div>'}","function recSlot991(x){return x?mediaCard991(x):'<div class=\"ct991-empty\">Nenhuma sugestão nova disponível agora.</div>'}");
  legacy=replaceRange(legacy,'async function mixedRows991(kind){','function discoverFilters991',mixed,'mixed discovery');
  legacy=replaceRange(legacy,'async function loadCalendar991(){','function bindDiscoverFilters991',calendar,'calendar');await writeFile(legacyPath,legacy,'utf8');
}
console.log('CineTracker Web 0.99.4: refatoração visual, regras de descoberta, calendário e ações rápidas emitidas.');

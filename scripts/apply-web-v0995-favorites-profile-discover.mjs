import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patchName='patch-v115-v0995-favorites-profile-discover.js';
const patchSource=resolve(root,'apps/web',patchName);

function replaceRange(source,startMarker,endMarker,replacement,label){
  const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);
  if(start<0||end<0||end<=start)throw new Error(`0.99.5 v115: ${label} markers not found`);
  return source.slice(0,start)+replacement+'\n'+source.slice(end);
}

async function recommendationData991(){
  if(!dashboard991.length)await fetchDashboard991();
  const blocker=await discoveryBlocker991();
  const hasAnyHistory=x=>Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
  const effectiveId=x=>{const a=Number(x.tmdb_id||0);if(a>0)return a;const b=Number(x.raw_tmdb?.source_tmdb_id||x.raw_tmdb?.id||0);return b>0?b:0};
  const toCard=x=>{const raw=x.raw_tmdb||{},type=x.media_type==='movie'?'movie':'tv',id=effectiveId(x),year=Number(x.release_year||year991(x)||0);return {...raw,id,tmdb_id:id,media_type:type,title:type==='movie'?x.title:undefined,name:type==='tv'?x.title:undefined,poster_path:x.poster_path||raw.poster_path||null,release_date:type==='movie'&&year?`${year}-01-01`:raw.release_date,first_air_date:type==='tv'&&year?`${year}-01-01`:raw.first_air_date,vote_average:score991(x),_db:x}};
  const personal=dashboard991.filter(x=>x.is_watchlist&&!hasAnyHistory(x));
  const pickLocal=kind=>personal.map(toCard).filter(x=>Number(x.id)>0).filter(x=>kind==='movie'?x.media_type==='movie':kind==='anime'?x.media_type==='tv'&&isAnime991(x):x.media_type==='tv'&&!isAnime991(x)).sort((a,b)=>score991(b)-score991(a)||year991(b)-year991(a))[0]||null;
  async function resolveMissing(kind){
    const already=pickLocal(kind);if(already)return already;
    const rows=personal.filter(x=>kind==='movie'?x.media_type==='movie':x.media_type==='tv').slice(0,8);
    for(const x of rows){
      try{
        const query=String(x.title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();if(!query)continue;
        const type=x.media_type==='movie'?'movie':'tv',params={query,include_adult:false,page:1};if(Number(x.release_year)>0)params[type==='movie'?'year':'first_air_date_year']=Number(x.release_year);
        const s=await api991(`/search/${type}`,params),want=normBlocked991(query),yr=Number(x.release_year||0);
        const candidates=(s.results||[]).map(v=>({...v,media_type:type})).filter(v=>{const n=normBlocked991(v.title||v.name),y=year991(v);return (n===want||n.includes(want)||want.includes(n))&&(!yr||!y||Math.abs(y-yr)<=1)});
        candidates.sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));const hit=candidates[0];if(!hit)continue;
        if(kind==='anime'&&!isAnime991(hit))continue;if(kind==='tv'&&isAnime991(hit))continue;return hit;
      }catch{}
    }
    return null;
  }
  const timeout=(promise,ms=5500)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('TMDB_TIMEOUT')),ms))]);
  const safe=(path,params)=>timeout(api991(path,params)).catch(()=>({results:[]}));
  const personalJob=Promise.all([resolveMissing('movie'),resolveMissing('tv'),resolveMissing('anime')]);
  const freshJob=Promise.all([
    safe('/discover/movie',{sort_by:'vote_average.desc','vote_average.gte':8,'vote_count.gte':120,'primary_release_date.gte':'1991-01-01',include_adult:false,page:1}),
    safe('/discover/tv',{sort_by:'vote_average.desc','vote_average.gte':7.8,'vote_count.gte':90,'first_air_date.gte':'1991-01-01',include_adult:false,page:1}),
    safe('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_average.gte':7.8,'vote_count.gte':40,'first_air_date.gte':'1991-01-01',include_adult:false,page:1})
  ]);
  const [[wm,wt,wa],[mRes,tRes,aRes]]=await Promise.all([personalJob,freshJob]);
  const unique=rows=>rows.filter((x,i,a)=>Number(x.id)>0&&a.findIndex(y=>Number(y.id)===Number(x.id)&&y.media_type===x.media_type)===i);
  let movie=unique((mRes.results||[]).map(x=>({...x,media_type:'movie'}))).filter(x=>year991(x)>1990&&score991(x)>=8&&!blocker.isBlocked(x));
  let tv=unique((tRes.results||[]).map(x=>({...x,media_type:'tv'}))).filter(x=>!isAnime991(x)&&year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x));
  let anime=unique((aRes.results||[]).map(x=>({...x,media_type:'tv'}))).filter(x=>isAnime991(x)&&year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x));
  if(movie.length<2){const d=await safe('/movie/top_rated',{page:1});movie=unique([...movie,...(d.results||[]).map(x=>({...x,media_type:'movie'}))]).filter(x=>year991(x)>1990&&score991(x)>=8&&!blocker.isBlocked(x))}
  if(!tv.length){const d=await safe('/tv/top_rated',{page:1});tv=unique([...(d.results||[]).map(x=>({...x,media_type:'tv'}))]).filter(x=>!isAnime991(x)&&year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x))}
  if(!anime.length){const d=await safe('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'popularity.desc',include_adult:false,page:1});anime=unique([...(d.results||[]).map(x=>({...x,media_type:'tv'}))]).filter(x=>isAnime991(x)&&year991(x)>1990&&!blocker.isBlocked(x))}
  const used=new Set(),take=rows=>{const x=(rows||[]).find(v=>!used.has(`${v.media_type}:${Number(v.id)}`));if(x)used.add(`${x.media_type}:${Number(x.id)}`);return x||null};
  const daily=take(movie.filter(x=>year991(x)>1990&&score991(x)>=8)),fm=take(movie),ft=take(tv),fa=take(anime);
  return{daily,wm,wt,wa,fm,ft,fa};
}

async function loadForYou991(){
  const host=$991('#ct991-discover-results');if(!host)return;
  const empty=label=>`<div class="ct991-empty">${label}</div>`;
  const slot=(label,x)=>`<div class="ct114-rec-slot"><small>${label}</small>${x?mediaCard991(x):empty('Nenhuma opção elegível neste momento.')}</div>`;
  host.innerHTML=`<div class="ct991-rec"><section class="ct991-rec-section"><h3>Indicação do dia</h3><p class="ct114-rec-rule">Filme lançado após 1990 · nota TMDB 8,0 ou maior · nunca visto</p><div class="ct991-rec-grid one">${empty('Carregando indicação…')}</div></section><section class="ct991-rec-section"><h3>Da sua Watchlist</h3><div class="ct991-rec-grid">${empty('Filme')}${empty('Série')}${empty('Anime')}</div></section><section class="ct991-rec-section"><h3>100% novos</h3><div class="ct991-rec-grid">${empty('Filme')}${empty('Série')}${empty('Anime')}</div></section></div>`;
  try{
    const r=await recommendationData991(),f=discover991.filter||'all';
    const daily=f==='tv'?'':`<section class="ct991-rec-section"><h3>Indicação do dia</h3><p class="ct114-rec-rule">Filme lançado após 1990 · nota TMDB 8,0 ou maior · nunca visto</p><div class="ct991-rec-grid one">${slot('Filme',r.daily)}</div></section>`;
    const watch=f==='movie'?[['Filme',r.wm]]:f==='tv'?[['Série',r.wt],['Anime',r.wa]]:[['Filme',r.wm],['Série',r.wt],['Anime',r.wa]];
    const fresh=f==='movie'?[['Filme',r.fm]]:f==='tv'?[['Série',r.ft],['Anime',r.fa]]:[['Filme',r.fm],['Série',r.ft],['Anime',r.fa]];
    host.innerHTML=`<div class="ct991-rec">${daily}<section class="ct991-rec-section"><h3>Da sua Watchlist</h3><div class="ct991-rec-grid">${watch.map(([l,x])=>slot(l,x)).join('')}</div></section><section class="ct991-rec-section"><h3>100% novos</h3><div class="ct991-rec-grid">${fresh.map(([l,x])=>slot(l,x)).join('')}</div></section></div>`;
    bindMedia991(host);
  }catch(e){host.innerHTML='<div class="ct991-empty">Não foi possível montar o Pra Você agora. Use Em alta, Mais aguardados ou Mais bem avaliados e tente novamente.</div>'}
}

async function loadSeason114(ctx,seasonNo,box){
  const body=$114('.ct114-season-body',box);if(!body||body.dataset.loaded==='1')return;
  body.innerHTML='<div class="ct114-loading">Carregando episódios e notas…</div>';
  try{
    const sd=await api114(`/tv/${ctx.tmdbId}/season/${seasonNo}`),eps=(sd.episodes||[]).filter(e=>Number(e.episode_number)>0);
    body.dataset.loaded='1';body.innerHTML=`${chart114(seasonNo,eps)}<div class="ct114-episodes">${eps.map(ep=>episodeHtml114(ctx,ep,seasonNo,ctx.progress)).join('')||'<div class="ct114-error">Sem episódios nesta temporada.</div>'}</div>`;
    bindEpisodeButtons114(ctx,seasonNo,box,eps);
  }catch(err){body.innerHTML=`<div class="ct114-error">Falha ao carregar temporada: ${esc114(err?.message||err)}</div>`}
}

for(const dir of dirs){
  await copyFile(patchSource,resolve(dir,patchName));
  const legacyPath=resolve(dir,'patch-v092-v0991.js');let legacy=await readFile(legacyPath,'utf8');
  legacy=replaceRange(legacy,'async function recommendationData991(){','function recSlot991',recommendationData991.toString(),'fast recommendationData991');
  legacy=replaceRange(legacy,'async function loadForYou991(){','async function mixedRows991',loadForYou991.toString(),'fast loadForYou991');
  await writeFile(legacyPath,legacy,'utf8');
  const detailPath=resolve(dir,'patch-v114-v0994-universal-detail.js');let detail=await readFile(detailPath,'utf8');
  detail=replaceRange(detail,'async function loadSeason114(ctx,seasonNo,box){','function hero114(ctx)',loadSeason114.toString(),'season chart placement');
  await writeFile(detailPath,detail,'utf8');
  const indexPath=resolve(dir,'index.html');let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patchName.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v114-v0994-universal-detail.js"></script>';if(!html.includes(anchor))throw new Error(`0.99.5 v115: v114 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patchName}"></script>`);await writeFile(indexPath,html,'utf8');
  const swPath=resolve(dir,'service-worker.js');try{let sw=await readFile(swPath,'utf8');sw=sw.replaceAll('ct-web-0.99.4','ct-web-0.99.5');await writeFile(swPath,sw,'utf8')}catch{}
}
console.log('CineTracker Web 0.99.5: favoritos, perfil, Descobrir e gráficos de temporada corrigidos.');

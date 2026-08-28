import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patchName='patch-v114-v0994-universal-detail.js';
const patchSource=resolve(root,'apps/web',patchName);

function replaceRange(source,startMarker,endMarker,replacement,label){
  const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);
  if(start<0||end<0||end<=start)throw new Error(`0.99.4 v114: ${label} markers not found`);
  return source.slice(0,start)+replacement+'\n'+source.slice(end);
}

async function recommendationData991(){
  if(!dashboard991.length)await fetchDashboard991();
  const blocker=await discoveryBlocker991();
  const hasAnyHistory=x=>Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at);
  const personal=dashboard991.filter(x=>x.is_watchlist&&!hasAnyHistory(x));
  const effectiveId=x=>{const a=Number(x.tmdb_id||0);if(a>0)return a;const b=Number(x.raw_tmdb?.source_tmdb_id||x.raw_tmdb?.id||0);return b>0?b:0};
  const dbKind=x=>x.media_type==='movie'?'movie':isAnime991(x)?'anime':'tv';
  async function hydratePersonal(kind){
    const rows=personal.filter(x=>dbKind(x)===kind).sort((a,b)=>score991(b)-score991(a)||Number(b.release_year||0)-Number(a.release_year||0)).slice(0,12);
    for(const x of rows){
      try{
        const type=x.media_type==='movie'?'movie':'tv';let id=effectiveId(x);
        if(id<=0){
          const query=String(x.title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();if(!query)continue;
          const params={query,include_adult:false,page:1};if(Number(x.release_year)>0)params[type==='movie'?'year':'first_air_date_year']=Number(x.release_year);
          const s=await api991(`/search/${type}`,params),want=normBlocked991(query),yr=Number(x.release_year||0);
          const choices=(s.results||[]).map(v=>({v,n:normBlocked991(v.title||v.name),y:year991(v)})).filter(z=>z.n===want||z.n.includes(want)||want.includes(z.n));
          choices.sort((a,b)=>{const ay=yr&&a.y===yr?1:0,by=yr&&b.y===yr?1:0;if(by!==ay)return by-ay;return Number(b.v.popularity||0)-Number(a.v.popularity||0)});
          id=Number(choices[0]?.v?.id||(s.results||[])[0]?.id||0);
        }
        if(id<=0)continue;
        const d=await api991(`/${type}/${id}`),card={...d,id,tmdb_id:id,media_type:type,_db:x};
        if(kind==='anime'&&!isAnime991(card))continue;if(kind==='tv'&&isAnime991(card))continue;
        return card;
      }catch{}
    }
    return null;
  }
  const personalJob=Promise.all([hydratePersonal('movie'),hydratePersonal('tv'),hydratePersonal('anime')]);
  const freshJob=Promise.allSettled([
    api991('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':160,include_adult:false,page:1}),
    api991('/discover/movie',{sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,include_adult:false,page:1}),
    api991('/discover/tv',{sort_by:'popularity.desc',include_adult:false,page:1}),
    api991('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':50,include_adult:false,page:1}),
    api991('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'popularity.desc',include_adult:false,page:1})
  ]);
  const [[wm,wt,wa],settled]=await Promise.all([personalJob,freshJob]);
  const val=i=>settled[i]?.status==='fulfilled'?settled[i].value:{results:[]};
  const unique=rows=>rows.filter((x,i,a)=>Number(x.id)>0&&a.findIndex(y=>Number(y.id)===Number(x.id)&&y.media_type===x.media_type)===i);
  const movie=unique([...(val(0).results||[]),...(val(1).results||[])].map(x=>({...x,media_type:'movie'}))).filter(x=>year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x));
  const tv=unique([...(val(2).results||[]),...(val(3).results||[])].map(x=>({...x,media_type:'tv'}))).filter(x=>!isAnime991(x)&&year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x));
  const anime=unique([...(val(4).results||[]),...(val(5).results||[])].map(x=>({...x,media_type:'tv'}))).filter(x=>isAnime991(x)&&year991(x)>1990&&score991(x)>=7.8&&!blocker.isBlocked(x));
  const used=new Set(),take=rows=>{const x=(rows||[]).find(v=>!used.has(`${v.media_type}:${Number(v.id)}`));if(x)used.add(`${x.media_type}:${Number(x.id)}`);return x||null};
  const daily=take(movie.filter(x=>year991(x)>1990&&score991(x)>=8));
  const fm=take(movie),ft=take(tv),fa=take(anime);
  return{daily,wm,wt,wa,fm,ft,fa};
}

async function loadForYou991(){
  const host=$991('#ct991-discover-results');if(!host)return;
  const empty=label=>`<div class="ct991-empty">${label}</div>`;
  const slot=(label,x)=>`<div class="ct114-rec-slot"><small>${label}</small>${x?mediaCard991(x):empty('Nenhuma opção elegível neste momento.')}</div>`;
  if(!window.__ct991HasForYouCache?.()){
    host.innerHTML=`<div class="ct991-rec"><section class="ct991-rec-section"><h3>Indicação do dia</h3><p class="ct114-rec-rule">Filme lançado após 1990 · nota TMDB 8,0 ou maior · nunca visto</p><div class="ct991-rec-grid one">${empty('Buscando indicação…')}</div></section><section class="ct991-rec-section"><h3>Da sua Watchlist</h3><div class="ct991-rec-grid">${empty('Buscando filme…')}${empty('Buscando série…')}${empty('Buscando anime…')}</div></section><section class="ct991-rec-section"><h3>100% novos</h3><div class="ct991-rec-grid">${empty('Buscando filme…')}${empty('Buscando série…')}${empty('Buscando anime…')}</div></section></div>`;
  }
  try{
    const r=await recommendationData991(),f=discover991.filter||'all';
    const daily=f==='tv'?'':`<section class="ct991-rec-section"><h3>Indicação do dia</h3><p class="ct114-rec-rule">Filme lançado após 1990 · nota TMDB 8,0 ou maior · nunca visto</p><div class="ct991-rec-grid one">${slot('Filme',r.daily)}</div></section>`;
    const watch=f==='movie'?[['Filme',r.wm]]:f==='tv'?[['Série',r.wt],['Anime',r.wa]]:[['Filme',r.wm],['Série',r.wt],['Anime',r.wa]];
    const fresh=f==='movie'?[['Filme',r.fm]]:f==='tv'?[['Série',r.ft],['Anime',r.fa]]:[['Filme',r.fm],['Série',r.ft],['Anime',r.fa]];
    host.innerHTML=`<div class="ct991-rec">${daily}<section class="ct991-rec-section"><h3>Da sua Watchlist</h3><div class="ct991-rec-grid">${watch.map(([l,x])=>slot(l,x)).join('')}</div></section><section class="ct991-rec-section"><h3>100% novos</h3><div class="ct991-rec-grid">${fresh.map(([l,x])=>slot(l,x)).join('')}</div></section></div>`;bindMedia991(host);
  }catch(e){host.innerHTML=`<div class="ct991-empty">Falha ao carregar Pra Você: ${esc991(e?.message||e)}. As outras abas continuam disponíveis.</div>`}
}

for(const dir of dirs){
  await copyFile(patchSource,resolve(dir,patchName));

  const legacyPath=resolve(dir,'patch-v092-v0991.js');
  let legacy=await readFile(legacyPath,'utf8');
  legacy=replaceRange(legacy,'async function recommendationData991(){','function recSlot991',recommendationData991.toString(),'recommendationData991');
  legacy=replaceRange(legacy,'async function loadForYou991(){','async function mixedRows991',loadForYou991.toString(),'loadForYou991');
  await writeFile(legacyPath,legacy,'utf8');

  const homePath=resolve(dir,'patch-v099-v0994-web.js');
  let home=await readFile(homePath,'utf8');
  home=home.replace('function histEpisode994(h){\n  return `<div class="ct992-row">','function histEpisode994(h){\n  return `<div class="ct992-row" data-ct994-open="${Number(h.media_id||0)}">');
  home=home.replace('function histMovie994(h){\n  return `<div class="ct992-row">','function histMovie994(h){\n  return `<div class="ct992-row" data-ct994-open="${Number(h.media_id||0)}">');
  await writeFile(homePath,home,'utf8');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patchName.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v113-v0994-fluidity.js"></script>';
  if(!html.includes(anchor))throw new Error(`0.99.4 v114: v113 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patchName}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.4: Pra Você resiliente + detalhe universal de mídia/pessoa aplicados.');

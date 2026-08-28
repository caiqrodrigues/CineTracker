import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const finalPatch='patch-v117-v0996-final.js';
const finalSource=resolve(root,'apps/web',finalPatch);

function replaceRange(source,startMarker,endMarker,replacement,label){
  const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);
  if(start<0||end<0||end<=start)throw new Error(`0.99.6 finalize: ${label} markers not found`);
  return source.slice(0,start)+replacement+'\n'+source.slice(end);
}

function tmdbCard116(x){
  const type=x.media_type==='movie'?'movie':'tv',episode=x._calendar_episode||null,episodeCode=episode?`S${String(episode.season_number||0).padStart(2,'0')}E${String(episode.episode_number||0).padStart(2,'0')}`:null,meta=[episodeCode||year116(x)||null,type==='movie'?'Filme':isAnime116(x)?'Anime':'Série',score116(x)>0?`★ ${score116(x).toFixed(1)}`:null].filter(Boolean).join(' · ');
  return `<article class="ct116-card" data-ct115-heart-bound="1" data-open-media991="${type}:${Number(x.id)}"><button type="button" class="ct116-card-open"><div class="ct116-poster"${x.poster_path?` style="background-image:url('${img116(x.poster_path)}')"`:''}></div><div class="ct116-body"><b>${esc116(x.title||x.name||'Sem título')}</b><small>${esc116(meta)}</small></div></button><button type="button" class="ct116-heart" data-ct116-tmdb-heart="${type}:${Number(x.id)}" aria-label="Favoritar">♡</button></article>`;
}

async function fetchDiscover116(force=false){
  if(discover116&&!force)return discover116;if(discoverBusy116&&!force)return discoverBusy116;
  discoverBusy116=(async()=>{
    const [dash,ex]=await Promise.all([rpc116('cinetracker_profile_media_dashboard_v0991',{}),rpc116('cinetracker_discovery_exclusions_v0994',{})]);
    if(!Array.isArray(dash)||!ex||!Array.isArray(ex.movie_ids)||!Array.isArray(ex.tv_ids))throw new Error('Exclusões pessoais indisponíveis');
    const block=blocker116(ex),personal=dash.filter(x=>x.is_watchlist&&!hasHistory116(x));
    const personalType=kind=>personal.filter(x=>kind==='movie'?x.media_type==='movie':x.media_type==='tv');
    async function resolvePersonal(kind){
      const local=personalType(kind).map(toTmdb116).filter(x=>Number(x.id)>0).filter(x=>kind==='anime'?isAnime116(x):kind==='tv'?!isAnime116(x):true).sort((a,b)=>score116(b)-score116(a)||year116(b)-year116(a))[0];
      if(local)return local;
      for(const x of personalType(kind).slice(0,24)){
        const q=String(x.title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();if(!q)continue;
        try{
          const type=x.media_type==='movie'?'movie':'tv',params={query:q,include_adult:false,page:1};if(Number(x.release_year)>0)params[type==='movie'?'year':'first_air_date_year']=Number(x.release_year);
          const s=await api116(`/${'search'}/${type}`,params),want=norm116(q),yr=Number(x.release_year||0);
          const hits=(s.results||[]).map(v=>({...v,media_type:type})).filter(v=>{const n=norm116(v.title||v.name),y=year116(v);return (n===want||n.includes(want)||want.includes(n))&&(!yr||!y||Math.abs(y-yr)<=1)}).filter(v=>kind==='anime'?isAnime116(v):kind==='tv'?!isAnime116(v):true).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));
          if(hits[0])return hits[0];
        }catch{}
      }
      return null;
    }
    const today=new Date();today.setHours(0,0,0,0);const future180=new Date(today);future180.setDate(future180.getDate()+180);const future45=new Date(today);future45.setDate(future45.getDate()+45);const fmt=d=>d.toISOString().slice(0,10),pages=[1,2],jobs=[];
    for(const page of pages){jobs.push(safeApi116('/movie/top_rated',{page}),safeApi116('/tv/top_rated',{page}),safeApi116('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':40,include_adult:false,page}),safeApi116('/trending/movie/week',{page}),safeApi116('/trending/tv/week',{page}),safeApi116('/discover/movie',{'primary_release_date.gte':fmt(today),'primary_release_date.lte':fmt(future180),sort_by:'primary_release_date.asc',include_adult:false,page}),safeApi116('/discover/tv',{'first_air_date.gte':fmt(today),'first_air_date.lte':fmt(future180),sort_by:'first_air_date.asc',include_adult:false,page}));}
    const [wm,wt,wa,raw]=await Promise.all([resolvePersonal('movie'),resolvePersonal('tv'),resolvePersonal('anime'),Promise.all(jobs)]);
    const takeKind=(offset,type)=>uniq116(pages.flatMap((_,i)=>(raw[i*7+offset]?.results||[]).map(x=>({...x,media_type:type}))));
    const movieTop=takeKind(0,'movie').filter(x=>year116(x)>1990&&score116(x)>=8&&!block.isBlocked(x));
    const tvTop=takeKind(1,'tv').filter(x=>!isAnime116(x)&&year116(x)>1990&&score116(x)>=7.8&&!block.isBlocked(x));
    const animeTop=takeKind(2,'tv').filter(x=>isAnime116(x)&&year116(x)>1990&&score116(x)>=7.8&&!block.isBlocked(x));
    const trending=uniq116([...takeKind(3,'movie'),...takeKind(4,'tv')]).filter(x=>!block.isBlocked(x)).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,60);
    const upcomingMovies=takeKind(5,'movie').filter(x=>!block.isBlocked(x)),upcomingTv=takeKind(6,'tv').filter(x=>!block.isBlocked(x));
    const anticipated=uniq116([...upcomingMovies,...upcomingTv]).sort((a,b)=>String(a.release_date||a.first_air_date||'9999').localeCompare(String(b.release_date||b.first_air_date||'9999'))).slice(0,70);
    const top=uniq116([...movieTop,...tvTop]).sort((a,b)=>score116(b)-score116(a)).slice(0,60),used=new Set(),take=rows=>{const x=(rows||[]).find(v=>!used.has(`${v.media_type}:${Number(v.id)}`));if(x)used.add(`${x.media_type}:${Number(x.id)}`);return x||null};
    const daily=take(movieTop),fm=take(movieTop),ft=take(tvTop),fa=take(animeTop);
    const followedIds=[...new Set(dash.filter(x=>x.media_type==='tv'&&(x.is_watchlist||x.is_in_progress||x.is_up_to_date)).map(effectiveId116).filter(x=>x>0))].slice(0,72),tvCalendar=[];
    for(let i=0;i<followedIds.length;i+=8){const details=await Promise.all(followedIds.slice(i,i+8).map(id=>safeApi116(`/tv/${id}`,{})));for(const d of details){const n=d?.next_episode_to_air,air=n?.air_date;if(!d?.id||!air)continue;const dt=new Date(air+'T12:00:00');if(dt<today||dt>future45)continue;tvCalendar.push({...d,media_type:'tv',first_air_date:air,_calendar_episode:{season_number:Number(n.season_number||0),episode_number:Number(n.episode_number||0),name:n.name||''}})}}
    const movieCalendar=upcomingMovies.filter(x=>{const d=x.release_date;if(!d)return false;const dt=new Date(d+'T12:00:00');return dt>=today&&dt<=future45});
    const calendar=uniq116([...movieCalendar,...tvCalendar]).sort((a,b)=>String(a.release_date||a.first_air_date||'9999').localeCompare(String(b.release_date||b.first_air_date||'9999'))).slice(0,80);
    discover116={foryou:{daily,wm,wt,wa,fm,ft,fa},trending,anticipated,top,calendar,generated_at:new Date().toISOString(),strict_exclusions:true};cacheWrite116(DISCOVER_KEY116,discover116);return discover116;
  })().finally(()=>discoverBusy116=null);return discoverBusy116;
}

for(const dir of dirs){
  await copyFile(finalSource,resolve(dir,finalPatch));
  const p=resolve(dir,'patch-v116-v0996-authoritative.js');let src=await readFile(p,'utf8');
  src=src.replace("const PROFILE_KEY116='ct0996_profile_snapshot_v1';","const PROFILE_KEY116='ct0996_profile_snapshot_v2';").replace("const DISCOVER_KEY116='ct0996_discover_snapshot_v1';","const DISCOVER_KEY116='ct0996_discover_snapshot_v2';");
  src=replaceRange(src,'function tmdbCard116(x){','async function ensureMedia116',tmdbCard116.toString(),'calendar episode card');
  src=replaceRange(src,'async function fetchDiscover116(force=false){','function discoverTabs116()',fetchDiscover116.toString(),'strict discover');
  await writeFile(p,src,'utf8');
  const indexPath=resolve(dir,'index.html');let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${finalPatch.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v116-v0996-authoritative.js"></script>';if(!html.includes(anchor))throw new Error(`0.99.6 finalize: v116 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${finalPatch}"></script>`);await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker 0.99.6 final: strict Discover in v116 + v117 poster/actor/season repairs emitted.');

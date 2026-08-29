import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const source=resolve(root,'dist','patch-v138-v0997-resilient-primary.js');
const name='patch-v139-v0997-cache-buttons.js';
let runtime=await readFile(source,'utf8');

runtime=runtime
  .replaceAll('__ct0997StablePrimary138Loaded','__ct0997StablePrimary139Loaded')
  .replaceAll('__ct0997StablePrimary138','__ct0997StablePrimary139')
  .replaceAll('r138-resilient-single-primary','r139-cache-buttons-primary')
  .replaceAll("'X-CT-Primary':'r138'","'X-CT-Primary':'r139'")
  .replaceAll('ct138:','ct139:');

const cacheAnchor="function writePrimaryCache(key,value){try{if(value)sessionStorage.setItem('ct139:'+key,JSON.stringify({at:Date.now(),value}))}catch{}}";
if(!runtime.includes(cacheAnchor))throw new Error('r139: cache helper anchor missing');
runtime=runtime.replace(cacheAnchor,cacheAnchor+"\nfunction validHomePayload(v){return Boolean(v&&Array.isArray(v.series)&&Array.isArray(v.movie_watchlist)&&Array.isArray(v.history_episodes)&&Array.isArray(v.history_movies)&&!v._ct138LegacySuppressed)}");

const homeCacheOld="if(!homeData){homeData=readPrimaryCache('home');if(homeData)homeAt=Date.now()}";
const homeCacheNew="if(!homeData){const cached=readPrimaryCache('home');if(validHomePayload(cached)){homeData=cached;homeAt=0}else if(cached){try{sessionStorage.removeItem('ct139:home')}catch{}}}";
if(!runtime.includes(homeCacheOld))throw new Error('r139: home cache anchor missing');
runtime=runtime.replace(homeCacheOld,homeCacheNew);

const profileCacheOld="if(!profileData){profileData=readPrimaryCache('profile');if(profileData)profileAt=Date.now()}";
const profileCacheNew="if(!profileData){profileData=readPrimaryCache('profile');if(profileData)profileAt=0}";
if(!runtime.includes(profileCacheOld))throw new Error('r139: profile cache anchor missing');
runtime=runtime.replace(profileCacheOld,profileCacheNew);

const homeFetchOld="homeData=await rpcDirect('cinetracker_home_live_v0997_r2',{});homeAt=Date.now();writePrimaryCache('home',homeData)";
const homeFetchNew="const nextHome=await rpcDirect('cinetracker_home_live_v0997_r2',{});if(!validHomePayload(nextHome))throw new Error('Home retornou payload incompleto');homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)";
if(!runtime.includes(homeFetchOld))throw new Error('r139: home fetch anchor missing');
runtime=runtime.replace(homeFetchOld,homeFetchNew);

const oldMark="const mark=e.target.closest?.('[data-ct136-mark-movie]');if(mark){e.preventDefault();e.stopPropagation();void(async()=>{mark.disabled=true;try{const id=Number(mark.dataset.ct136MarkMovie),x=(homeData?.movie_watchlist||[]).find(v=>Number(v.media_id)===id);await window.sbRpc?.('cinetracker_mark_watch_v0994',{p_media_id:id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:x?.title||null,p_runtime_minutes:Number(x?.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});homeData=null;homeAt=0;await renderHome(true)}finally{mark.disabled=false}})();return}";
if(!runtime.includes(oldMark))throw new Error('r139: old mark handler missing');
runtime=runtime.replace(oldMark,'');

const mediaAnchor="const media=e.target.closest?.('[data-ct136-media]');";
if(!runtime.includes(mediaAnchor))throw new Error('r139: media handler anchor missing');
const newMark="const mark=e.target.closest?.('[data-ct136-mark-movie]');if(mark){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(mark.dataset.ct139Busy==='1')return;const id=Number(mark.dataset.ct136MarkMovie),x=(homeData?.movie_watchlist||[]).find(v=>Number(v.media_id)===id);if(!id)return;mark.dataset.ct139Busy='1';mark.disabled=true;const oldText=mark.textContent||'✓';mark.textContent='…';void(async()=>{try{const now=new Date().toISOString();await rpcDirect('cinetracker_mark_watch_v0994',{p_media_id:id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:x?.title||null,p_runtime_minutes:Number(x?.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:now});if(homeData){homeData={...homeData,movie_watchlist:(homeData.movie_watchlist||[]).filter(v=>Number(v.media_id)!==id),history_movies:[{id:0,media_id:id,tmdb_id:Number(x?.tmdb_id||0),media_title:x?.title||'Filme',poster_path:x?.poster_path||null,title:x?.title||null,watched_at:now,plays:1},...(homeData.history_movies||[])].slice(0,80)};homeAt=Date.now();writePrimaryCache('home',homeData);const row=mark.closest?.('[data-ct136-media]');if(row){const section=row.closest?.('.ct992-section');row.remove();const count=$('.ct992-count',section);if(count)count.textContent=Number(homeData.movie_watchlist.length).toLocaleString('pt-BR')}else paintHome()}}catch(err){mark.textContent='!';setTimeout(()=>{if(mark.isConnected)mark.textContent=oldText},1200)}finally{delete mark.dataset.ct139Busy;if(mark.isConnected){mark.disabled=false;if(mark.textContent==='…')mark.textContent=oldText}}})();return}";
runtime=runtime.replace(mediaAnchor,newMark+mediaAnchor);

if(runtime.indexOf("data-ct136-mark-movie")>runtime.indexOf(mediaAnchor))throw new Error('r139: mark handler must precede media handler');
if(runtime.includes('await window.sbRpc?.(\'cinetracker_mark_watch_v0994\''))throw new Error('r139: old mark RPC survived');

for(const dir of dirs){
  const runtimePath=resolve(dir,name);
  await writeFile(runtimePath,runtime,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const oldTag='<script src="/patch-v138-v0997-resilient-primary.js"></script>';
  const tag=`<script src="/${name}"></script>`;
  html=html.replaceAll(tag,'').replaceAll(oldTag,'').replace('</body>',tag+'</body>');
  await writeFile(indexPath,html,'utf8');
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});
}

console.log('WEB_R139_APPLIED cache=validated+revalidate buttons=action-first tmdb-proxy=token-cache-ready');
await import('./test-web-v0997-r139-cache-buttons.mjs');

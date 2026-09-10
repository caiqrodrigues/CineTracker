import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),web=resolve(root,'apps/web'),dist=resolve(web,'dist');
const [bundle,runtime]=await Promise.all([
  readFile(resolve(dist,'app-v243.js'),'utf8'),
  readFile(resolve(web,'runtime-r243-home-interaction-catchup.js'),'utf8')
]);
const dir='/tmp/ct-r243-browser-proof';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable')}
const safe=s=>s.replaceAll('</script>','<\\/script>');
function dump(url,budget=1800,profile='p'){
  return execFileSync(bin,[
    '--headless','--no-sandbox','--disable-gpu','--disable-background-networking',
    '--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',
    `--user-data-dir=${resolve(dir,profile)}`,`--virtual-time-budget=${budget}`,'--dump-dom',url
  ],{encoding:'utf8',timeout:18000,stdio:['ignore','pipe','pipe']});
}
try{
  const exactApp=resolve(dir,'app-v243.js'),exactHtml=resolve(dir,'exact.html');
  await writeFile(exactApp,bundle,'utf8');
  await writeFile(exactHtml,`<!doctype html><html><body><div id="app"></div><script>
  window.__probeErrors=[];addEventListener('error',e=>window.__probeErrors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>window.__probeErrors.push(String(e.reason||e)));
  try{localStorage.clear();sessionStorage.clear()}catch{};window.fetch=async()=>new Response(JSON.stringify({}),{status:401,headers:{'Content-Type':'application/json'}});
  </script><script src="./app-v243.js"></script><script>
  setTimeout(()=>{const a=document.getElementById('app');document.body.dataset.done='1';document.body.dataset.build=String(window.__ctWebBuild||'');document.body.dataset.marker=String(window.__ctR243||'');document.body.dataset.chars=String(a?.textContent?.trim().length||0);document.body.dataset.errors=window.__probeErrors.join('|')},700);
  </script></body></html>`,'utf8');
  const exact=dump('file://'+exactHtml,1500,'exact');
  for(const x of ['data-done="1"','data-build="1.0.34"','data-marker="home-interaction-bounded-metadata-canonical-catchup"'])if(!exact.includes(x))throw new Error('R243 exact bundle missing '+x);
  const chars=Number((exact.match(/data-chars="(\d+)"/)||[])[1]||0);if(!(chars>0))throw new Error('R243 exact bundle blank');
  const exactErrors=(exact.match(/data-errors="([^"]*)"/)||[])[1]||'';if(exactErrors)throw new Error('R243 exact bundle errors '+exactErrors);

  const movies=Array.from({length:120},(_,i)=>({tmdb_id:1000+i,title:'Movie '+i}));
  const fixture=resolve(dir,'behavior.html');
  await writeFile(fixture,`<!doctype html><html><body>
  <button id="seriesTab">Séries</button><button id="movieCard">Filme</button><div id="app"><div data-home></div></div>
  <script>
  let navSeq=1;let paintCount=0;let scheduledPaint=0;window.__clickSeries=false;window.__clickMovie=false;window.__auditCalls=0;window.__fetchActive=0;window.__fetchMax=0;window.__errors=[];
  addEventListener('error',e=>window.__errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>window.__errors.push(String(e.reason||e)));
  const route=()=> 'home';const mediaTmdb=x=>Number(x?.tmdb_id||0);
  let homeCache={series:[{media_id:7,tmdb_id:7007,title:'Generic Series',home_bucket:'up_to_date',is_caught_up:true,watched_episodes:5,last_watched_at:'2026-09-06T10:00:00Z'}],movie_watchlist:${JSON.stringify(Array.from({length:120},(_,i)=>({tmdb_id:1000+i,title:'Movie '+i})))},history_movies:[]};
  let ct176SetQueue=function(mediaId,queue){return {current:(queue||[])[0]||null,next:(queue||[])[1]||null}};
  async function ct176PrimeCanonical(x,force){window.__auditCalls++;await new Promise(r=>setTimeout(r,120));return ct176SetQueue(x.media_id,[{season:3,episode:6,title:'Released'}])}
  function ct175SchedulePaint(){scheduledPaint++;setTimeout(()=>paintHome(),10)}
  function paintHome(){paintCount++;return null}
  window.__ctR243FetchMovieMeta=async function(x){window.__fetchActive++;window.__fetchMax=Math.max(window.__fetchMax,window.__fetchActive);await new Promise(r=>setTimeout(r,140));x.release_year=2024;x.runtime_minutes=100;x.genres=[{name:'Drama'}];window.__fetchActive--;return x};
  document.getElementById('seriesTab').addEventListener('click',()=>window.__clickSeries=true);
  document.getElementById('movieCard').addEventListener('click',()=>window.__clickMovie=true);
  </script><script>${safe(runtime)}</script><script>
  paintHome();window.__ctR243QueueMovieMeta(homeCache.movie_watchlist);
  setTimeout(()=>document.getElementById('seriesTab').click(),80);
  setTimeout(()=>document.getElementById('movieCard').click(),160);
  setTimeout(()=>{const d=window.__ctR243Debug();const s=homeCache.series[0];document.body.dataset.done='1';document.body.dataset.seriesClick=String(window.__clickSeries);document.body.dataset.movieClick=String(window.__clickMovie);document.body.dataset.maxActive=String(window.__fetchMax);document.body.dataset.movieActive=String(d.movieActive);document.body.dataset.movieQueued=String(d.movieQueued);document.body.dataset.auditCalls=String(window.__auditCalls);document.body.dataset.bucket=String(s.home_bucket);document.body.dataset.caught=String(s.is_caught_up);document.body.dataset.missing=String(s.history_missing_episodes||0);document.body.dataset.errors=window.__errors.join('|')},900);
  </script></body></html>`,'utf8');
  const out=dump('file://'+fixture,1800,'behavior');
  for(const x of ['data-done="1"','data-series-click="true"','data-movie-click="true"','data-bucket="continue"','data-caught="false"','data-missing="1"'])if(!out.includes(x))throw new Error('R243 behavior missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));
  const max=Number((out.match(/data-max-active="(\d+)"/)||[])[1]||99);if(max>3||max<1)throw new Error('R243 movie concurrency invalid '+max);
  const queued=Number((out.match(/data-movie-queued="(\d+)"/)||[])[1]||0);if(!(queued>0))throw new Error('R243 movie queue unexpectedly fanned out');
  const audits=Number((out.match(/data-audit-calls="(\d+)"/)||[])[1]||0);if(!(audits>=1))throw new Error('R243 series canonical audit did not run');
  const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R243 behavior errors '+errors);
  console.log('R243_BROWSER_OK exact-bundle=booted clicks=responsive movie-concurrency<=3 series-up-to-date=>continue-canonical');
}finally{await rm(dir,{recursive:true,force:true})}

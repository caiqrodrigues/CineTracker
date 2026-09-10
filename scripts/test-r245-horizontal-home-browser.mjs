import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),web=resolve(root,'apps/web'),dist=resolve(web,'dist');
const [bundle,css,runtime]=await Promise.all([
  readFile(resolve(dist,'app-v245.js'),'utf8'),readFile(resolve(dist,'app-v245.css'),'utf8'),readFile(resolve(web,'runtime-r245-horizontal-home-authority.js'),'utf8')
]);
const dir='/tmp/ct-r245-browser-proof';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable')}
const safe=s=>s.replaceAll('</script>','<\\/script>');
function dump(url,budget=2500,profile='p'){
  return execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check','--window-size=390,800',`--user-data-dir=${resolve(dir,profile)}`,`--virtual-time-budget=${budget}`,'--dump-dom',url],{encoding:'utf8',timeout:22000,stdio:['ignore','pipe','pipe']});
}
try{
  await writeFile(resolve(dir,'app-v245.js'),bundle,'utf8');await writeFile(resolve(dir,'app-v245.css'),css,'utf8');
  const exact=resolve(dir,'exact.html');
  await writeFile(exact,`<!doctype html><html><body><div id="app"></div><script>window.fetch=async()=>new Response('{}',{status:401});try{localStorage.clear();sessionStorage.clear()}catch{}</script><script src="./app-v245.js"></script><script>setTimeout(()=>{document.body.dataset.done='1';document.body.dataset.build=String(window.__ctWebBuild||'');document.body.dataset.marker=String(window.__ctR245||'')},700)</script></body></html>`,'utf8');
  const exactOut=dump('file://'+exact,1600,'exact');
  for(const x of ['data-done="1"','data-build="1.0.36"','data-marker="real-horizontal-drag-and-started-series-authority"'])if(!exactOut.includes(x))throw new Error('R245 exact bundle missing '+x);

  const horizontal=resolve(dir,'horizontal.html');
  await writeFile(horizontal,`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="./app-v245.css"><style>body{margin:0}.fixture{width:360px}.ct169-season-card,.ct169-related-card{height:70px;border:1px solid}.ct169-season-chart-svg{display:block;height:120px}</style></head><body><div style="height:900px;width:1px"></div><main data-detail class="fixture">
  <div class="ct169-season-row" id="seasons">${Array.from({length:7},(_,i)=>`<button class="ct169-season-card">Temporada ${i+1}</button>`).join('')}</div>
  <div class="ct169-related-row" id="related">${Array.from({length:8},(_,i)=>`<button class="ct169-related-card">Título ${i+1}</button>`).join('')}</div>
  <div class="ct169-chart-scroll" id="chart"><svg class="ct169-season-chart-svg" style="width:1200px" viewBox="0 0 1200 120"></svg></div>
  </main><div style="height:900px;width:1px"></div>
  <script>
  const route=()=> 'detail';let homeCache=null;function paintHome(){}function ct175PrimeHome(){}function ct176SetQueue(){return null}function ct176PrimeCanonical(){return null}function mediaTmdb(x){return Number(x?.tmdb_id||0)}
  window.__ctR243QueueMovieMeta=()=>{};
  </script><script>${safe(runtime)}</script><script>
  function drag(el){const before=el.scrollLeft;el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:7,pointerType:'touch',clientX:310,clientY:100}));const ev=new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerId:7,pointerType:'touch',clientX:70,clientY:104});const allowed=el.dispatchEvent(ev);el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:7,pointerType:'touch',clientX:70,clientY:104}));return {before,after:el.scrollLeft,prevented:!allowed}}
  setTimeout(()=>{window.__ctR245WireHorizontal(document);const s=document.getElementById('seasons'),r=document.getElementById('related'),c=document.getElementById('chart');const ds=drag(s),dr=drag(r),dc=drag(c);window.scrollTo(0,500);const doc=document.documentElement;document.body.dataset.done='1';document.body.dataset.sOverflow=String(s.scrollWidth>s.clientWidth+1);document.body.dataset.rOverflow=String(r.scrollWidth>r.clientWidth+1);document.body.dataset.cOverflow=String(c.scrollWidth>c.clientWidth+1);document.body.dataset.sDrag=String(ds.after>ds.before&&ds.prevented);document.body.dataset.rDrag=String(dr.after>dr.before&&dr.prevented);document.body.dataset.cDrag=String(dc.after>dc.before&&dc.prevented);document.body.dataset.touchS=getComputedStyle(s).touchAction;document.body.dataset.touchR=getComputedStyle(r).touchAction;document.body.dataset.touchC=getComputedStyle(c).touchAction;document.body.dataset.globalX=String(doc.scrollWidth<=doc.clientWidth+1);document.body.dataset.vertical=String(doc.scrollHeight>innerHeight&&scrollY>0)},250);
  </script></body></html>`,'utf8');
  const h=dump('file://'+horizontal,1300,'horizontal');
  for(const x of ['data-done="1"','data-s-overflow="true"','data-r-overflow="true"','data-c-overflow="true"','data-s-drag="true"','data-r-drag="true"','data-c-drag="true"','data-global-x="true"','data-vertical="true"'])if(!h.includes(x))throw new Error('R245 horizontal behavior missing '+x+' '+(h.match(/<body[^>]*>/)?.[0]||''));
  for(const k of ['touch-s','touch-r','touch-c']){const v=(h.match(new RegExp(`data-${k}="([^"]*)"`))||[])[1]||'';if(!v.includes('pan-y'))throw new Error('R245 '+k+' blocks vertical gesture '+v)}

  const home=resolve(dir,'home.html');
  await writeFile(home,`<!doctype html><html><body><div data-home></div><script>
  const route=()=> 'home';const mediaTmdb=x=>Number(x?.tmdb_id||0);let paints=0,movieCalls=0,movieCallAt=0;const startedAt=performance.now();
  let homeCache={series:[
    {media_id:11,tmdb_id:1011,title:'Lioness',home_bucket:'completed',watched_episodes:5,is_caught_up:true,last_watched_at:'2026-09-10T10:00:00Z'},
    {media_id:12,tmdb_id:1012,title:'Stuart',home_bucket:'not_started',watched_episodes:2,is_caught_up:true,last_watched_at:'2026-09-09T10:00:00Z'},
    {media_id:13,tmdb_id:1013,title:'Another wrong series',home_bucket:'up_to_date',watched_episodes:8,is_caught_up:true,last_watched_at:'2026-09-08T10:00:00Z'}
  ]};
  function paintHome(){paints++}function ct175PrimeHome(){}function ct175SchedulePaint(){paints++}
  function ct176SetQueue(mid,q){return {current:q?.[0]||null,next:q?.[1]||null}}
  async function ct176PrimeCanonical(x){await new Promise(r=>setTimeout(r,90));return ct176SetQueue(x.media_id,[{season:2,episode:Number(x.media_id-9),title:'Released unwatched'}])}
  window.__ctR243QueueMovieMeta=rows=>{movieCalls+=(rows||[]).length;movieCallAt=performance.now()-startedAt};
  </script><script>${safe(runtime)}</script><script>
  window.__ctR243QueueMovieMeta([{tmdb_id:9001,title:'Secondary movie'}]);
  setTimeout(()=>{const rows=homeCache.series;const d=window.__ctR245Debug();document.body.dataset.done='1';document.body.dataset.lioness=rows[0].home_bucket;document.body.dataset.stuart=rows[1].home_bucket;document.body.dataset.other=rows[2].home_bucket;document.body.dataset.lCaught=String(rows[0].is_caught_up);document.body.dataset.sCaught=String(rows[1].is_caught_up);document.body.dataset.oCaught=String(rows[2].is_caught_up);document.body.dataset.movieCalls=String(movieCalls);document.body.dataset.movieDelayed=String(movieCallAt>=70);document.body.dataset.auditActive=String(d.auditActive)},420);
  </script></body></html>`,'utf8');
  const ho=dump('file://'+home,1300,'home');
  for(const x of ['data-done="1"','data-lioness="continue"','data-stuart="continue"','data-other="continue"','data-l-caught="false"','data-s-caught="false"','data-o-caught="false"','data-movie-calls="1"','data-movie-delayed="true"','data-audit-active="0"'])if(!ho.includes(x))throw new Error('R245 Home authority missing '+x+' '+(ho.match(/<body[^>]*>/)?.[0]||''));
  console.log('R245_BROWSER_OK real-drag=seasons+related+chart global-x=none vertical=preserved home=Lioness+Stuart+generic-started=>continue series-first=true');
}finally{await rm(dir,{recursive:true,force:true})}

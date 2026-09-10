import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),web=resolve(root,'apps/web'),dist=resolve(web,'dist');
const [bundle,css,runtime]=await Promise.all([
  readFile(resolve(dist,'app-v246.js'),'utf8'),
  readFile(resolve(dist,'app-v246.css'),'utf8'),
  readFile(resolve(web,'runtime-r246-horizontal-track-home-priority.js'),'utf8')
]);
const dir='/tmp/ct-r246-browser-proof';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable')}
const safe=s=>s.replaceAll('</script>','<\\/script>');
function dump(url,budget=3500,profile='p'){
  return execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check','--window-size=390,800',`--user-data-dir=${resolve(dir,profile)}`,`--virtual-time-budget=${budget}`,'--dump-dom',url],{encoding:'utf8',timeout:26000,stdio:['ignore','pipe','pipe']});
}
try{
  await writeFile(resolve(dir,'app-v246.js'),bundle,'utf8');await writeFile(resolve(dir,'app-v246.css'),css,'utf8');
  const exact=resolve(dir,'exact.html');
  await writeFile(exact,`<!doctype html><html><body><div id="app"></div><script>window.fetch=async()=>new Response('{}',{status:401});try{localStorage.clear();sessionStorage.clear()}catch{}</script><script src="./app-v246.js"></script><script>setTimeout(()=>{document.body.dataset.done='1';document.body.dataset.build=String(window.__ctWebBuild||'');document.body.dataset.marker=String(window.__ctR246||'')},700)</script></body></html>`,'utf8');
  const exactOut=dump('file://'+exact,1700,'exact');
  for(const x of ['data-done="1"','data-build="1.0.37"','data-marker="horizontal-track-home-priority"'])if(!exactOut.includes(x))throw new Error('R246 exact bundle missing '+x);

  const horizontal=resolve(dir,'horizontal.html');
  await writeFile(horizontal,`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="./app-v246.css"><style>
    body{margin:0}.fixture{width:320px;max-width:320px}.wraprow{display:flex;flex-wrap:wrap;overflow:hidden;width:320px;gap:8px}.card{box-sizing:border-box;width:148px;height:70px;border:1px solid}
    #graphHost{width:320px;max-width:320px;overflow:hidden}#graph{display:block;width:100%;max-width:100%;height:120px}
  </style></head><body><div style="height:900px;width:1px"></div><main class="fixture">
    <h2>Temporadas</h2><div id="seasons" class="ct169-season-row wraprow">${Array.from({length:6},(_,i)=>`<button class="card">Temporada ${i+1}</button>`).join('')}</div>
    <h2>Títulos semelhantes</h2><div id="related" class="wraprow">${Array.from({length:7},(_,i)=>`<button class="card">Título ${i+1}</button>`).join('')}</div>
    <h2>Melhores e piores episódios</h2><div id="graphHost"><svg id="graph" width="1200" height="120" viewBox="0 0 1200 120"></svg></div>
  </main><div style="height:900px;width:1px"></div>
  <script>
    const route=()=> 'detail';let homeCache={series:[]};function paintHome(){}function ct175PrimeHome(){}function ct175SchedulePaint(){}
    function ct176PrimeCanonical(){return Promise.resolve(null)}function mediaTmdb(x){return Number(x?.tmdb_id||0)}
    window.__ctR243QueueMovieMeta=()=>{};
    const s0=document.getElementById('seasons'),r0=document.getElementById('related');
    document.body.dataset.preS=String(s0.scrollWidth<=s0.clientWidth+1);document.body.dataset.preR=String(r0.scrollWidth<=r0.clientWidth+1);
  </script><script>${safe(runtime)}</script><script>
    function mouseDrag(el){const before=el.scrollLeft;el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:17,pointerType:'mouse',button:0,clientX:290,clientY:100}));const ev=new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerId:17,pointerType:'mouse',button:0,clientX:60,clientY:103});const allowed=el.dispatchEvent(ev);el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:17,pointerType:'mouse',button:0,clientX:60,clientY:103}));return {before,after:el.scrollLeft,prevented:!allowed}}
    setTimeout(()=>{window.__ctR246PrepareHorizontal(document);const s=document.getElementById('seasons'),r=document.getElementById('related'),g=document.querySelector('.ct246-wide-visual-scroll');const ds=mouseDrag(s),dr=mouseDrag(r),dg=mouseDrag(g);window.scrollTo(0,500);const doc=document.documentElement;
      document.body.dataset.done='1';document.body.dataset.sTrack=String(!!s.querySelector(':scope>.ct246-x-track'));document.body.dataset.rTrack=String(!!r.querySelector(':scope>.ct246-x-track'));
      document.body.dataset.sOverflow=String(s.scrollWidth>s.clientWidth+1);document.body.dataset.rOverflow=String(r.scrollWidth>r.clientWidth+1);document.body.dataset.gOverflow=String(!!g&&g.scrollWidth>g.clientWidth+1);
      document.body.dataset.sDrag=String(ds.after>ds.before&&ds.prevented);document.body.dataset.rDrag=String(dr.after>dr.before&&dr.prevented);document.body.dataset.gDrag=String(dg.after>dg.before&&dg.prevented);
      document.body.dataset.globalX=String(doc.scrollWidth<=doc.clientWidth+1);document.body.dataset.vertical=String(doc.scrollHeight>innerHeight&&scrollY>0);
      document.body.dataset.touchS=getComputedStyle(s).touchAction;document.body.dataset.touchR=getComputedStyle(r).touchAction;document.body.dataset.touchG=getComputedStyle(g).touchAction;
    },300);
  </script></body></html>`,'utf8');
  const h=dump('file://'+horizontal,1800,'horizontal');
  for(const x of ['data-pre-s="true"','data-pre-r="true"','data-done="1"','data-s-track="true"','data-r-track="true"','data-s-overflow="true"','data-r-overflow="true"','data-g-overflow="true"','data-s-drag="true"','data-r-drag="true"','data-g-drag="true"','data-global-x="true"','data-vertical="true"'])if(!h.includes(x))throw new Error('R246 horizontal behavior missing '+x+' '+(h.match(/<body[^>]*>/)?.[0]||''));
  for(const k of ['touch-s','touch-r','touch-g']){const v=(h.match(new RegExp(`data-${k}="([^"]*)"`))||[])[1]||'';if(!v.includes('pan-x')||!v.includes('pan-y'))throw new Error('R246 '+k+' gesture contract invalid '+v)}

  const home=resolve(dir,'home.html');
  await writeFile(home,`<!doctype html><html><body><div data-home></div><script>
    const route=()=> 'home';const mediaTmdb=x=>Number(x?.tmdb_id||0);let paints=0,movieCalls=0,movieAt=0;const startedAt=performance.now(),starts=[],ends=[];let active=0,maxActive=0;
    const mk=(id,title,bucket,watched,total)=>({media_id:id,tmdb_id:1000+id,title,home_bucket:bucket,queue:bucket,recommendation_bucket:bucket,watched_episodes:watched,total_episodes:total,is_caught_up:true,last_watched_at:'2026-09-10T10:00:00Z'});
    const lioness=mk(11,'Lioness','next',5,16),lionessClone={...lioness},stuart=mk(12,'Stuart','up_to_date',2,10),stuartClone={...stuart},other=mk(13,'Generic started','next',8,20),otherClone={...other},fresh=mk(14,'Fresh','next',0,10);fresh.last_watched_at='';
    let homeCache={series:[lioness,stuart,other,fresh],next:[lionessClone,stuartClone,otherClone],continue:[]};window.homeCache=homeCache;
    window.ctHomeRows={next:[lionessClone,stuartClone,otherClone],continue:[]};
    function paintHome(){paints++}function ct175PrimeHome(){}function ct175SchedulePaint(){paints++}
    function ct176SetQueue(mid,q){const current=q?.[0]||null;return {current,next:q?.[1]||null}}
    async function ct176PrimeCanonical(x){const id=x.media_id;starts.push({id,t:performance.now()-startedAt});active++;maxActive=Math.max(maxActive,active);await new Promise(r=>setTimeout(r,id===11?130:id===12?170:110));active--;ends.push({id,t:performance.now()-startedAt});return {current:{season:2,episode:id-9,title:'Released unwatched '+id},next:null}}
    window.__ctR243QueueMovieMeta=rows=>{movieCalls+=(rows||[]).length;movieAt=performance.now()-startedAt};
  </script><script>${safe(runtime)}</script><script>
    window.__ctR243QueueMovieMeta([{tmdb_id:9001,title:'Secondary movie'}]);
    setTimeout(()=>{const late=mk(15,'Late started','next',1,8),lateClone={...late};homeCache.series.push(late);window.ctHomeRows.next.push(lateClone);paintHome();window.__late=[late,lateClone]},360);
    setTimeout(()=>{const d=window.__ctR246Debug(),rows=[lioness,lionessClone,stuart,stuartClone,other,otherClone],allEnd=Math.max(...ends.filter(x=>x.id<=13).map(x=>x.t));
      document.body.dataset.done='1';document.body.dataset.initialContinue=String(rows.every(x=>x.home_bucket==='continue'&&x.queue==='continue'&&x.recommendation_bucket==='continue'&&x.is_caught_up===false));
      document.body.dataset.fresh=String(fresh.home_bucket);document.body.dataset.late=String(window.__late.every(x=>x.home_bucket==='continue'));
      document.body.dataset.maxActive=String(maxActive);document.body.dataset.movieCalls=String(movieCalls);document.body.dataset.movieAfterSeries=String(movieAt>=allEnd&&allEnd>0);
      document.body.dataset.initialDone=String(d.initialDone);document.body.dataset.pending=String(d.initialPending);
    },950);
  </script></body></html>`,'utf8');
  const ho=dump('file://'+home,2200,'home');
  for(const x of ['data-done="1"','data-initial-continue="true"','data-fresh="next"','data-late="true"','data-movie-calls="1"','data-movie-after-series="true"','data-initial-done="true"','data-pending="0"'])if(!ho.includes(x))throw new Error('R246 Home authority missing '+x+' '+(ho.match(/<body[^>]*>/)?.[0]||''));
  const max=(ho.match(/data-max-active="(\d+)"/)||[])[1];if(!(Number(max)>0&&Number(max)<=3))throw new Error('R246 canonical concurrency invalid '+max);
  console.log('R246_BROWSER_OK no-initial-overflow=>real-local-tracks seasons+related+graph global-x=none vertical=preserved all-started-refs=>continue movies-after-initial-series late-series=continue concurrency<=3');
}finally{await rm(dir,{recursive:true,force:true})}

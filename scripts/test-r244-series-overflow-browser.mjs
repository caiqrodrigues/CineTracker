import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),web=resolve(root,'apps/web'),dist=resolve(web,'dist');
const [bundle,css]=await Promise.all([
  readFile(resolve(dist,'app-v244.js'),'utf8'),
  readFile(resolve(dist,'app-v244.css'),'utf8')
]);
const dir='/tmp/ct-r244-browser-proof';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable')}
function dump(url,budget=2400){
  return execFileSync(bin,[
    '--headless','--no-sandbox','--disable-gpu','--disable-background-networking',
    '--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',
    '--window-size=390,800',`--user-data-dir=${resolve(dir,'profile')}`,`--virtual-time-budget=${budget}`,'--dump-dom',url
  ],{encoding:'utf8',timeout:20000,stdio:['ignore','pipe','pipe']});
}
try{
  const jsPath=resolve(dir,'app-v244.js'),cssPath=resolve(dir,'app-v244.css'),htmlPath=resolve(dir,'proof.html');
  await writeFile(jsPath,bundle,'utf8');await writeFile(cssPath,css,'utf8');
  await writeFile(htmlPath,`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="./app-v244.css"></head><body><div id="app"></div><script>
  window.__probeErrors=[];addEventListener('error',e=>window.__probeErrors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>window.__probeErrors.push(String(e.reason||e)));
  try{localStorage.clear();sessionStorage.clear()}catch{};window.fetch=async()=>new Response(JSON.stringify({}),{status:401,headers:{'Content-Type':'application/json'}});
  </script><script src="./app-v244.js"></script><script>
  setTimeout(()=>{
    const proof=document.createElement('div');proof.id='r244Proof';proof.innerHTML=\`
      <div style="height:900px;width:1px"></div>
      <main data-detail style="width:100%;max-width:100%">
        <section class="panel">
          <div class="panel-head"><h2>Temporadas</h2><small>18</small></div>
          <div class="row" id="seasonStrip">\${Array.from({length:18},(_,i)=>\`<article class="card"><button><div style="width:150px;height:80px">Temporada \${i+1}</div></button></article>\`).join('')}</div>
        </section>
        <section class="panel">
          <h2>Avaliações dos episódios</h2>
          <div data-episode-chart id="episodeChart" style="width:100%;max-width:100%"><div style="width:1500px;height:120px">gráfico largo</div></div>
        </section>
      </main>
      <div style="height:900px;width:1px"></div>\`;
    document.body.appendChild(proof);
  },350);
  setTimeout(()=>{
    const seasons=document.getElementById('seasonStrip'),chart=document.getElementById('episodeChart');
    seasons.scrollLeft=160;chart.scrollLeft=220;window.scrollTo(0,420);
    const doc=document.documentElement;
    document.body.dataset.done='1';
    document.body.dataset.build=String(window.__ctWebBuild||'');
    document.body.dataset.marker=String(window.__ctR244||'');
    document.body.dataset.seasonsMarked=String(seasons?.classList.contains('ct-r244-seasons-scroll'));
    document.body.dataset.chartMarked=String(chart?.classList.contains('ct-r244-chart-scroll'));
    document.body.dataset.seasonsOverflow=String((seasons?.scrollWidth||0)>(seasons?.clientWidth||0));
    document.body.dataset.chartOverflow=String((chart?.scrollWidth||0)>(chart?.clientWidth||0));
    document.body.dataset.seasonsScrolled=String((seasons?.scrollLeft||0)>0);
    document.body.dataset.chartScrolled=String((chart?.scrollLeft||0)>0);
    document.body.dataset.globalX=String(doc.scrollWidth<=doc.clientWidth+1);
    document.body.dataset.verticalScrollable=String(doc.scrollHeight>window.innerHeight);
    document.body.dataset.verticalScrolled=String(window.scrollY>0);
    document.body.dataset.touchSeasons=getComputedStyle(seasons).touchAction;
    document.body.dataset.touchChart=getComputedStyle(chart).touchAction;
    document.body.dataset.htmlOverflowX=getComputedStyle(doc).overflowX;
    document.body.dataset.errors=window.__probeErrors.join('|');
  },850);
  </script></body></html>`,'utf8');
  const out=dump('file://'+htmlPath,2600);
  for(const x of [
    'data-done="1"','data-build="1.0.35"','data-marker="series-detail-local-horizontal-overflow"',
    'data-seasons-marked="true"','data-chart-marked="true"','data-seasons-overflow="true"','data-chart-overflow="true"',
    'data-seasons-scrolled="true"','data-chart-scrolled="true"','data-global-x="true"',
    'data-vertical-scrollable="true"','data-vertical-scrolled="true"','data-html-overflow-x="hidden"'
  ])if(!out.includes(x))throw new Error('R244 browser invariant missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));
  const ts=(out.match(/data-touch-seasons="([^"]*)"/)||[])[1]||'',tc=(out.match(/data-touch-chart="([^"]*)"/)||[])[1]||'';
  if(!(ts.includes('pan-y')||ts==='auto'))throw new Error('R244 seasons blocks vertical gesture: '+ts);
  if(!(tc.includes('pan-y')||tc==='auto'))throw new Error('R244 chart blocks vertical gesture: '+tc);
  const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R244 browser errors '+errors);
  console.log('R244_BROWSER_OK global-x=none seasons-x=local chart-x=local vertical-scroll=preserved touch=pan-x+pan-y');
}finally{await rm(dir,{recursive:true,force:true})}

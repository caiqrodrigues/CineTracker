import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/web/runtime-r216-v110-real-regressions.js'),'utf8');
const safe=patch.replaceAll('</script>','<\\/script>');
const dir=resolve('/tmp','cinetracker-v110-visible');await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const pre=`<script>
const rpc=async(name,body)=>name==='cinetracker_rewatch_counts_v104'?[]:name==='cinetracker_mark_watch_v0994'?{plays:2}:{};
const ensureMedia=async(type,tmdb)=>({id:tmdb,title:'Fixture',runtime_minutes:42});
const edge=async(name,body,timeout)=>({season:2026,races:[{round:'1',raceName:'Fixture GP'}],next:{raceName:'Fixture GP'}});
const toast=()=>{};const discoverCache=new Map();const localDay=()=> '2026-09-07';
function mkHistory(){return '<section class="panel"><h2>Histórico recente</h2><div class="media-row" data-media="movie:101"><b>Filme visto</b><small>Visto</small></div><div class="media-row" data-media="tv:202"><b>Série vista</b><small>S02 E03</small></div></section>'}
</script>`;
const post=`<script>(async()=>{try{
 document.querySelector('#hist').innerHTML=mkHistory();
 await new Promise(r=>setTimeout(r,900));
 document.body.dataset.rewatch=String(document.querySelectorAll('[data-ct216-rewatch]').length);
 const row=document.querySelector('.row'),cards=[...row.children],rr=row.getBoundingClientRect(),cr=cards[2].getBoundingClientRect();
 document.body.dataset.thirdFull=String(cr.right<=rr.right+1 && cr.left>=rr.left-1);
 const grid=getComputedStyle(document.querySelector('.event-grid')).gridTemplateColumns.trim();document.body.dataset.sportsOne=String(!grid.includes(' '));
 const f=await window.__ctV110GetF1(true);document.body.dataset.f1=String(f?.races?.[0]?.raceName||'');
 const b=document.querySelector('[data-ct216-rewatch]');b.click();await new Promise(r=>setTimeout(r,50));document.body.dataset.rewatchLabel=b.textContent;
 }catch(e){document.body.dataset.err=String(e?.message||e)}finally{document.body.dataset.done='1'}})();</script>`;
const html=`<!doctype html><html><head><meta name="viewport" content="width=device-width"></head><body style="margin:0;width:390px"><div id="hist"></div><div class="row" style="display:flex;width:360px;overflow:auto"><article class="card">1</article><article class="card">2</article><article class="card">3</article></div><div data-page="sports"><div class="event-grid" style="display:grid;width:360px;grid-template-columns:1fr 1fr"><div class="event">A</div><div class="event">B</div></div></div>${pre}<script>${safe}</script>${post}</body></html>`;
await writeFile(file,html,'utf8');let out='',stderr='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--window-size=390,900','--virtual-time-budget=2500','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch(e){stderr=String(e?.stderr||'')}}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable '+stderr.slice(-500));
if(out.includes('data-err='))throw new Error('V110 runtime error '+out.match(/data-err="([^"]*)"/)?.[1]);
for(const must of ['data-done="1"','data-rewatch="2"','data-third-full="true"','data-sports-one="true"','data-f1="Fixture GP"','data-rewatch-label="↻ Reassistir 2x"'])if(!out.includes(must))throw new Error('V110 visible regression missing '+must+'\n'+out.slice(-3000));
console.log('V110_VISIBLE_BROWSER_OK rewatch=2 third-card=full sports=single-column f1=fixture');

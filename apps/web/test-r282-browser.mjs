import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
await import('./build-r282-official.mjs');
const runtime=await readFile(resolve('runtime-r282-series-recency-order.js'),'utf8');
let bin='';for(const x of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r282-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><body><div id="out"></div><script>
function esc(v){return String(v??'')}
function ct275SeriesSection(title,rows){return '<section data-title="'+title+'">'+rows.map(x=>'<div data-title-row="'+x.title+'">'+x.title+'</div>').join('')+'</section>'}
</script><script>${safe(runtime)}</script><script>
const source=[
 {title:'SmackDown',home_bucket:'continue',last_watched_at:'2026-09-14T01:41:31Z'},
 {title:'Lanternas',home_bucket:'continue',last_watched_at:'2026-09-14T01:38:42Z'},
 {title:'Reacher',home_bucket:'continue',last_watched_at:'2026-09-14T01:08:59Z'},
 {title:'Lioness',home_bucket:'continue',last_watched_at:'2026-09-14T20:40:00Z'},
 {title:'Old',home_bucket:'continue',last_watched_at:'2026-08-01T10:00:00Z'}
];
const html=ct275SeriesSection('Assistir a seguir',source);document.querySelector('#out').innerHTML=html;
const order=[...document.querySelectorAll('[data-title-row]')].map(x=>x.dataset.titleRow);
document.body.dataset.first=order[0]||'';document.body.dataset.order=order.join('|');
const up=[{title:'Em Dia Novo',home_bucket:'up_to_date',last_watched_at:'2026-09-14T21:00:00Z'},{title:'Em Dia Antigo',home_bucket:'up_to_date',last_watched_at:'2026-09-01T10:00:00Z'}];
const cont=[{title:'Continue Antigo',home_bucket:'continue',last_watched_at:'2026-09-13T10:00:00Z'}];
document.body.dataset.cont=ct275SeriesSection('Assistir a seguir',cont).includes('Continue Antigo')&&!ct275SeriesSection('Assistir a seguir',cont).includes('Em Dia Novo')?'true':'false';
document.body.dataset.up=ct275SeriesSection('Em dia',up).indexOf('Em Dia Novo')<ct275SeriesSection('Em dia',up).indexOf('Em Dia Antigo')?'true':'false';
const tie=[{title:'A',last_watched_at:null},{title:'B',last_watched_at:null}];document.body.dataset.stable=ct282SortSeriesRows(tie).map(x=>x.title).join('|')==='A|B'?'true':'false';
</script></body></html>`,'utf8');
try{for(const width of [420,1200]){const profile=resolve(dir,'profile-'+width);const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${profile}`,`--window-size=${width},900`,'--virtual-time-budget=1000','--dump-dom','file://'+page],{encoding:'utf8',timeout:40000,maxBuffer:10*1024*1024,stdio:['ignore','pipe','pipe']});for(const x of['data-first="Lioness"','data-order="Lioness|SmackDown|Lanternas|Reacher|Old"','data-cont="true"','data-up="true"','data-stable="true"'])if(!out.includes(x))throw new Error('R282 browser '+width+' missing '+x)}console.log('R282_BROWSER_OK latest watched series first inside final bucket, bucket transitions preserved mobile+desktop')}finally{await rm(dir,{recursive:true,force:true})}

import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Start from .69 so its immutable slot keys + natural-height containment stay intact. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099769.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r241-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.70: r241 base missing');
let js=html.slice(a+marker.length,b);
for(const required of [
  "const REVISION='r241-android-watchlist-owner-layout';",
  'function ct186RenderForYou(data){',
  'ct166RenderForYou=ct186RenderForYou;renderForYou158=ct186RenderForYou;',
  'function ct186Slot(label,x,key,count){try{return ct166Slot(label,x,key,count)}',
  'data-ct241-slot-key=',
  "window.__ctR241Events='none-r237-single-authority'"
])if(!js.includes(required))throw new Error('Android 0.99.7.70 requires active-renderer base '+required);

/* .69 patched ct166RenderForYou, but ct186RenderForYou replaces it later and is the real runtime renderer.
   Patch the final renderer itself so the same containment rules apply to what Android actually displays. */
{
  const start=js.indexOf('function ct186RenderForYou(data){');
  const end=js.indexOf('\nct166RenderForYou=ct186RenderForYou;renderForYou158=ct186RenderForYou;',start);
  if(start<0||end<start)throw new Error('Android 0.99.7.70 ct186RenderForYou range missing');
  let fn=js.slice(start,end);
  const pairs=[
    [`<section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2>`,`<section class="panel discover-section" data-ct241-section="daily"><div class="panel-head"><h2>Indicação do dia</h2>`],
    [`<section class="panel discover-section"><div class="panel-head"><h2>Da sua Watchlist</h2>`,`<section class="panel discover-section" data-ct241-section="watchlist"><div class="panel-head"><h2>Da sua Watchlist</h2>`],
    [`<section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2>`,`<section class="panel discover-section" data-ct241-section="fresh"><div class="panel-head"><h2>100% novos</h2>`]
  ];
  for(const [from,to] of pairs){
    if(fn.split(from).length-1!==1)throw new Error('Android 0.99.7.70 expected one active ct186 section '+from);
    fn=fn.replace(from,to);
  }
  for(const section of ['daily','watchlist','fresh'])if(!fn.includes(`data-ct241-section="${section}"`))throw new Error('Android 0.99.7.70 active ct186 renderer missing '+section);
  js=js.slice(0,start)+fn+js.slice(end);
}

/* Preserve the exact final alias and make it explicit for CI/runtime diagnostics. */
{
  const from='ct166RenderForYou=ct186RenderForYou;renderForYou158=ct186RenderForYou;';
  const to='ct166RenderForYou=ct186RenderForYou;renderForYou158=ct186RenderForYou;window.__ctR242ActiveForYouRenderer=ct186RenderForYou;';
  if(js.split(from).length-1!==1)throw new Error('Android 0.99.7.70 active renderer alias missing');
  js=js.replace(from,to);
}

const patch=await readFile(resolve(root,'apps/android/runtime-r242-active-foryou-renderer.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.70-r242-active-foryou-renderer';",
  "window.__ctR242Fix='ct186-final-renderer-section-ownership';",
  "window.__ctR242Events='none-r237-remains-single-swap-authority';",
  'ct166RenderForYou===ct186RenderForYou',
  'renderForYou158===ct186RenderForYou'
])if(!patch.includes(required))throw new Error('Android 0.99.7.70 r242 patch missing '+required);
for(const forbidden of ["addEventListener('pointerup'","addEventListener('click'","addEventListener('touchstart'","addEventListener('touchmove'",'clientX','clientY','elementFromPoint'])
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.70 r242 must not add competing event logic '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.70 boot point missing');
js=js.replace("const REVISION='r241-android-watchlist-owner-layout';","const REVISION='r242-android-active-foryou-renderer';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r242-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099769" content="r241-watchlist-owner-layout"','name="ct-android-v099770" content="r242-active-foryou-renderer"');

for(const good of [
  'android-v0.99.7.70-r242-active-foryou-renderer','ct186-final-renderer-section-ownership','none-r237-remains-single-swap-authority',
  'window.__ctR242ActiveForYouRenderer=ct186RenderForYou','data-ct241-section="watchlist"','data-ct241-section="fresh"','data-ct241-slot-key=',
  'grid-auto-rows:auto!important','contain:layout paint!important','native-webview-horizontal-no-manual-touch'
])if(!html.includes(good))throw new Error('Android 0.99.7.70 missing '+good);
for(const bad of ['android-v0.99.7.66-r238-watchlist-swap-only','android-v0.99.7.67-r239-watchlist-direct-dashboard','android-v0.99.7.68-r240-watchlist-hit-route'])
  if(html.includes(bad))throw new Error('Android 0.99.7.70 leaked rejected Watchlist experiment '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099770_READY active-renderer=ct186 watchlist=contained-keyed events=r237-only top10=unchanged web=untouched');

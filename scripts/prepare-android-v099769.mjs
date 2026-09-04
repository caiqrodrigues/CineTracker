import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Rebuild from .65. Do not inherit the rejected .66-.68 Watchlist event experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099765.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r237-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.69: clean r237 base missing');
let js=html.slice(a+marker.length,b);
for(const required of [
  "const REVISION='r237-android-two-fixes-only';",
  "window.__ctR237Swap='merge-ct166-ct186-watchlist-direct-slot';",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';",
  "const SWAP237='[data-ct237-swap]'",
  'function ct166Slot(label,x,key,count){',
  'function ct166RenderForYou(data){',
  "window.addEventListener('pointerup',activateSwap237",
  'grid-auto-rows:1fr!important',
  'height:100%!important'
])if(!js.includes(required))throw new Error('Android 0.99.7.69 requires r237 source '+required);

/* 1) Give every generated For You slot an immutable semantic owner at creation time. */
{
  const start=js.indexOf('function ct166Slot(label,x,key,count){');
  const end=js.indexOf('\nfunction ct166RenderForYou(data){',start);
  if(start<0||end<start)throw new Error('Android 0.99.7.69 ct166Slot range missing');
  let fn=js.slice(start,end);
  const from=`return '<div class="foryou-slot ct166-slot"><div class="ct166-slot-head">`;
  const to=`return '<div class="foryou-slot ct166-slot" data-ct241-slot-key="'+esc(key)+'"><div class="ct166-slot-head">`;
  if(fn.split(from).length-1!==1)throw new Error('Android 0.99.7.69 expected one ct166Slot root');
  fn=fn.replace(from,to);
  js=js.slice(0,start)+fn+js.slice(end);
}

/* 2) Mark the three real sections in the renderer itself; no heading/coordinate inference at tap time. */
{
  const start=js.indexOf('function ct166RenderForYou(data){');
  const end=js.indexOf('\nrenderForYou158=ct166RenderForYou;',start);
  if(start<0||end<start)throw new Error('Android 0.99.7.69 ct166RenderForYou range missing');
  let fn=js.slice(start,end);
  const pairs=[
    [`<section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2>`,`<section class="panel discover-section" data-ct241-section="daily"><div class="panel-head"><h2>Indicação do dia</h2>`],
    [`<section class="panel discover-section"><div class="panel-head"><h2>Da sua Watchlist</h2>`,`<section class="panel discover-section" data-ct241-section="watchlist"><div class="panel-head"><h2>Da sua Watchlist</h2>`],
    [`<section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2>`,`<section class="panel discover-section" data-ct241-section="fresh"><div class="panel-head"><h2>100% novos</h2>`]
  ];
  for(const [from,to] of pairs){
    if(fn.split(from).length-1!==1)throw new Error('Android 0.99.7.69 expected one renderer section '+from);
    fn=fn.replace(from,to);
  }
  js=js.slice(0,start)+fn+js.slice(end);
}

/* 3) r237 stays the sole event authority, but its button is always stamped from the owning slot. */
{
  const from="const swap=slot.querySelector?.(SWAP237);if(!swap)return;\n  swap.classList?.add?.('ct166-swap','ct237-swap');";
  const to="const swap=slot.querySelector?.(SWAP237);if(!swap)return;\n  const ownerKey237=String(slot?.dataset?.ct241SlotKey||'');if(ownerKey237)swap.dataset.ct237Swap=ownerKey237;\n  swap.classList?.add?.('ct166-swap','ct237-swap');";
  if(js.split(from).length-1!==1)throw new Error('Android 0.99.7.69 expected one r237 placeSwap authority');
  js=js.replace(from,to);
}
{
  const from="function swapNow237(button){\n  const key=String(button?.dataset?.ct237Swap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');";
  const to="function swapNow237(button){\n  const slot=button?.closest?.('.ct166-slot,.foryou-slot'),key=String(slot?.dataset?.ct241SlotKey||button?.dataset?.ct237Swap||'');";
  if(js.split(from).length-1!==1)throw new Error('Android 0.99.7.69 expected one r237 swapNow authority');
  js=js.replace(from,to);
}
{
  const from="const b=e?.target?.closest?.(SWAP237);if(!b)return;\n  const key=String(b.dataset?.ct237Swap||'');if(!key)return;";
  const to="const b=e?.target?.closest?.(SWAP237);if(!b)return;\n  const slot237=b.closest?.('.ct166-slot,.foryou-slot'),key=String(slot237?.dataset?.ct241SlotKey||b.dataset?.ct237Swap||'');if(!key)return;";
  if(js.split(from).length-1!==1)throw new Error('Android 0.99.7.69 expected one r237 activate authority');
  js=js.replace(from,to);
}

const patch=await readFile(resolve(root,'apps/android/runtime-r241-watchlist-owner-layout.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.69-r241-watchlist-owner-layout';",
  "window.__ctR241Fix='immutable-slot-key-plus-natural-grid-height';",
  "window.__ctR241Events='none-r237-single-authority';",
  "window.__ctR241Hitboxes='section-contained-no-cross-section-overlap';",
  'grid-auto-rows:auto!important',
  'height:auto!important',
  'contain:layout paint!important',
  '[data-ct241-section="watchlist"]{z-index:2!important}'
])if(!patch.includes(required))throw new Error('Android 0.99.7.69 r241 patch missing '+required);
for(const forbidden of ["addEventListener('pointerup'","addEventListener('click'","addEventListener('touchstart'","addEventListener('touchmove'",'clientX','clientY','getBoundingClientRect','elementFromPoint'])
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.69 r241 reintroduced tap inference/competing event behavior '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.69 boot point missing');
js=js.replace("const REVISION='r237-android-two-fixes-only';","const REVISION='r241-android-watchlist-owner-layout';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r241-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099765" content="r237-two-fixes-only"','name="ct-android-v099769" content="r241-watchlist-owner-layout"');

for(const good of [
  'android-v0.99.7.69-r241-watchlist-owner-layout','immutable-slot-key-plus-natural-grid-height','none-r237-single-authority','section-contained-no-cross-section-overlap',
  'data-ct241-slot-key="\'+esc(key)+\'"','data-ct241-section="daily"','data-ct241-section="watchlist"','data-ct241-section="fresh"',
  "ownerKey237=String(slot?.dataset?.ct241SlotKey||'')","slot237?.dataset?.ct241SlotKey||b.dataset?.ct237Swap",
  'grid-auto-rows:auto!important','contain:layout paint!important','native-webview-horizontal-no-manual-touch','touch-action:pan-x pan-y!important','overflow-x:scroll!important',
  'optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc','persistent-2x-3x-4x-no-disable'
])if(!html.includes(good))throw new Error('Android 0.99.7.69 missing '+good);
for(const bad of [
  'android-v0.99.7.66-r238-watchlist-swap-only','android-v0.99.7.67-r239-watchlist-direct-dashboard','android-v0.99.7.68-r240-watchlist-hit-route',
  'data-ct238-watch-swap','data-ct239-watch-swap','first-handler-routes-watchlist-slot-by-section-and-column'
])if(html.includes(bad))throw new Error('Android 0.99.7.69 leaked rejected Watchlist experiment '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099769_READY watchlist=immutable-slot-owner layout=natural-contained hitboxes=no-cross-section events=r237-only top10=r237 web=untouched');

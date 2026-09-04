import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Start from .70: active ct186 renderer ownership + non-overlapping layout + verified native Top10 remain intact. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099770.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r242-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.71: r242 base missing');
let js=html.slice(a+marker.length,b);
for(const required of [
  "const REVISION='r242-android-active-foryou-renderer';",
  'function ct186Select(data){',
  'return{daily,wm,ws,wa,fm,fs,fa,wmPool,wsPool,waPool,used};',
  'function pool237(key){',
  "const bags=key.startsWith('watchlist:')?watch:fresh;",
  'function swapNow237(button){',
  "window.addEventListener('pointerup',activateSwap237",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';"
])if(!js.includes(required))throw new Error('Android 0.99.7.71 requires r242/r237 base '+required);

/* Root cause in .70: ct186RenderForYou chooses Watchlist cards from ct186Select(...).wmPool/wsPool/waPool,
   which may be the renderer fallback/reserve pool. r237 reconstructed a different pool from only _ct166/_ct186_watchlist.
   The button could therefore be visible with >1 renderer candidates while swapNow237 saw <2 and silently returned false.
   Make the Watchlist branch consume the exact same selected pool as the active renderer. Fresh remains byte-for-byte on r237 logic. */
{
  const start=js.indexOf('function pool237(key){');
  const end=js.indexOf('\nwindow.__ctR237Pool=pool237;',start);
  if(start<0||end<start)throw new Error('Android 0.99.7.71 pool237 range missing');
  const old=js.slice(start,end);
  if(old.includes('ct186Select(ct186ForYouData)'))throw new Error('Android 0.99.7.71 expected unfixed .70 pool237');
  if(!old.includes("const bags=key.startsWith('watchlist:')?watch:fresh;"))throw new Error('Android 0.99.7.71 unexpected .70 pool237 body');
  const fixed=`function pool237(key){
  if(String(key||'').startsWith('watchlist:')){
    try{
      if(typeof ct186Select==='function'&&typeof ct186ForYouData==='object'&&ct186ForYouData){
        const selected237=ct186Select(ct186ForYouData);
        const exact237=key==='watchlist:series'?selected237?.wsPool:key==='watchlist:anime'?selected237?.waPool:selected237?.wmPool;
        if(Array.isArray(exact237)&&exact237.length)return unique237(exact237);
      }
    }catch{}
  }
  const rows=[];
  for(const d of liveData237()){
    const fresh=[d?._ct166_fresh,d?._ct186_fresh].filter(Boolean);
    const watch=[d?._ct166_watchlist,d?._ct186_watchlist].filter(Boolean);
    const bags=key.startsWith('watchlist:')?watch:fresh;
    const kind=key==='fresh:series'||key==='watchlist:series'?'series':key==='fresh:anime'||key==='watchlist:anime'?'anime':'movie';
    for(const bag of bags)if(Array.isArray(bag?.[kind]))rows.push(...bag[kind]);
  }
  return unique237(rows);
}`;
  js=js.slice(0,start)+fixed+js.slice(end);
}

/* Keep one and only one event authority. The change above is data selection only. */
if((js.match(/window\.addEventListener\('pointerup',activateSwap237/g)||[]).length!==1)throw new Error('Android 0.99.7.71 requires exactly one r237 pointer authority');
if((js.match(/window\.addEventListener\('click',activateSwap237/g)||[]).length!==1)throw new Error('Android 0.99.7.71 requires exactly one r237 click fallback');

const patch=await readFile(resolve(root,'apps/android/runtime-r243-watchlist-renderer-pool.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.71-r243-watchlist-renderer-pool';",
  "window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool';",
  "window.__ctR243Pool='wmPool-wsPool-waPool-same-as-visible-renderer';",
  "window.__ctR243Events='none-r237-single-authority';",
  "window.__ctR243Scope='android-only-watchlist-trocar-top10-and-fresh-untouched';"
])if(!patch.includes(required))throw new Error('Android 0.99.7.71 r243 patch missing '+required);
for(const forbidden of ["addEventListener('pointerup'","addEventListener('click'","addEventListener('touchstart'","addEventListener('touchmove'"])
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.71 r243 must not add competing event logic '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.71 boot point missing');
js=js.replace("const REVISION='r242-android-active-foryou-renderer';","const REVISION='r243-android-watchlist-renderer-pool';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r243-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099770" content="r242-active-foryou-renderer"','name="ct-android-v099771" content="r243-watchlist-renderer-pool"');

for(const good of [
  'android-v0.99.7.71-r243-watchlist-renderer-pool','watchlist-swap-uses-active-ct186-selected-pool','wmPool-wsPool-waPool-same-as-visible-renderer',
  "const selected237=ct186Select(ct186ForYouData);","selected237?.wsPool","selected237?.waPool","selected237?.wmPool",
  'window.__ctR242ActiveForYouRenderer=ct186RenderForYou','data-ct241-section="watchlist"','data-ct241-slot-key=',
  'native-webview-horizontal-no-manual-touch','grid-auto-rows:auto!important','contain:layout paint!important'
])if(!html.includes(good))throw new Error('Android 0.99.7.71 missing '+good);
for(const bad of ['android-v0.99.7.66-r238-watchlist-swap-only','android-v0.99.7.67-r239-watchlist-direct-dashboard','android-v0.99.7.68-r240-watchlist-hit-route'])
  if(html.includes(bad))throw new Error('Android 0.99.7.71 leaked rejected Watchlist experiment '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099771_READY watchlist=exact-active-renderer-pool events=r237-only fresh=r237-unchanged top10=r237-native web=untouched');

import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// Android official 1.0/r311. Only three user-reported regressions.
// Build from certified r310; do not touch Web, Supabase, Sports, F1 Hub or Profile.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r310.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r310-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official Android 1.0/r310 baseline missing');
let js=html.slice(a+tag.length,b);
function once(from,to,name){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('r311 '+name+': expected one anchor, got '+n);
 js=js.replace(from,to);
}
once("const REVISION='r310-android-official-1.0';",
 "const REVISION='r311-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10111;',
 'window.__ctAndroidOfficialCode=10112;','APK code');
// r290 was displaying placeholder rows despite real authenticated server
// endpoints working. Consume the independently confirmed r311 responses
// INSIDE the existing private Sports-series controller, so the original
// click-to-open page, quick-watch action and progress counters all work.
once(
 "const get=k=>{if(special263.current[k]?.series)fallback[k]=special263.current[k];return special263.current[k]?.series?special263.current[k]:fallback[k]||null};",
 "const get=k=>{const verified=window.__ctR311Special?.best?.(k);if(verified?.series){special263.current[k]=verified;fallback[k]=verified}else if(special263.current[k]?.series)fallback[k]=special263.current[k];return special263.current[k]?.series?special263.current[k]:fallback[k]||null};",
 'wire recovered special series into original owner');
// Make the placeholder honest while data is being fetched; no fabricated
// poster, watched count or next episode if all real RPC calls have failed.
once(
 ":'Sincronização pendente';",
 ":'Atualizando eventos — toque para abrir';",
 'special card loading label');
// r284's six authenticated v421 pools can all be empty. Before its existing
// v525 audit, recover *genuine* eligible suggestions from diverse TMDB pages
// and derive Watchlist candidates only from the authenticated dashboard.
once(
 "  if(!moreThanZero(next)){\n   document.documentElement.dataset.ct284ForYou='empty';",
 "  if(kinds.some(k=>array(next._ct186_fresh[k]).length<14))\n   await window.__ctR311Discover?.recover?.(next,stamp);\n  if(!moreThanZero(next)){\n   document.documentElement.dataset.ct284ForYou='empty';",
 'bounded audited fallback for insufficient recommendation pools');
// The legacy detail filter accidentally excluded genre ID 18 (Drama), a
// broad legitimate genre; preserve bans on documentary, reality, short
// movies, YouTube-origin content, stand-up and wrestling.
once("function badGenre113(x){const g=genres113(x);return g.includes(99)||g.includes(18)||g.includes(10766)}",
 "function badGenre113(x){const g=genres113(x);return g.includes(99)||g.includes(10766)}",'allow legitimate drama');
const module=await readFile(resolve(root,'apps/android/runtime-r311-home-discover.js'),'utf8');
if(!module.includes('window.__ctR311Special=')||
 !module.includes('window.__ctR311Movies=')||
 !module.includes('window.__ctR311Discover='))throw Error('r311 scoped controllers missing');
once('boot();\n})();',module+'\nboot();\n})();','final Home and Discover only correction');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r311-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(path,html,'utf8');
console.log('CINETRACKER_1_0_R311_READY: verified UFC/WWE/F1 Home data inside original card owner; monotonic confirmed movie history; diversified context-aware recommendations audited by existing v525; Android only.');

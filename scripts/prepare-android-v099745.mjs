import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099744.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r216-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.45: embedded r216 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r216-android-top10-person-season';"))throw new Error('Android 0.99.7.45 requires 0.99.7.44 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.45 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r217-f1-top10-person-profile.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.45 must not add gesture listener: '+forbidden);
}

/* Top 10: r214 now delegates to the fully independent r217 renderer. */
const oldTopCond="if(selected==='top10'&&typeof window.ctR216RenderTop10==='function'){";
const oldTopCall='await window.ctR216RenderTop10(seq);';
if(!js.includes(oldTopCond)||!js.includes(oldTopCall))throw new Error('Android 0.99.7.45 r216 Top 10 delegation not found');
js=js.replace(oldTopCond,"if(selected==='top10'&&typeof window.ctR217RenderTop10==='function'){");
js=js.replace(oldTopCall,'await window.ctR217RenderTop10(seq);');

/* Profile: remove only the redundant Series count card; keep Episodes and Movies. */
const oldStats="row214(3,[card214('Séries',fmt214(seriesCount)),card214('Episódios',fmt214(s.episodes_watched)),card214('Filmes',fmt214(s.movies_watched))])";
const newStats="row214(2,[card214('Episódios',fmt214(s.episodes_watched)),card214('Filmes',fmt214(s.movies_watched))])";
if(!js.includes(oldStats))throw new Error('Android 0.99.7.45 profile Series card source not found');
js=js.replace(oldStats,newStats);

/* Person: do not ask shell to render a page title. r217 also removes the residual brand/title wrapper. */
const oldPersonShell="setApp(shell('Pessoa','','discover'";
if(!js.includes(oldPersonShell))throw new Error('Android 0.99.7.45 person title shell not found');
js=js.replace(oldPersonShell,"setApp(shell('','','discover'");

js=js.replace("const REVISION='r216-android-top10-person-season';","const REVISION='r217-android-f1-top10-person-profile';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r217-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099744" content="r216-top10-person-season"','name="ct-android-v099745" content="r217-f1-top10-person-profile"');

for(const m of [
  'android-v0.99.7.45-r217-f1-top10-person-profile',
  "const REVISION='r217-android-f1-top10-person-profile';",
  'synchronous-own-shell-tokenized-provider-flow',
  'invalid-id-unique-exact-title-fallback-positive-id',
  'remove-cinetracker-person-header-direct-photo-bio',
  'remove-series-count-card-only',
  "typeof window.ctR217RenderTop10==='function'",
  'await window.ctR217RenderTop10(seq);',
  'data-ct217-top10',
  "row214(2,[card214('Episódios'",
  "host.dataset.media=j.type+':'+Number(r.id)",
  'ct217Recovered',
  'cleanPersonHeader217',
  'grid-template-columns:repeat(3,minmax(0,1fr))',
  'main-and-sports-collapse-together-tight-gap',
  'whole-season-one-screen-swipe-season-only'
])if(!html.includes(m))throw new Error('Android 0.99.7.45 missing '+m);

if(html.includes(oldTopCall))throw new Error('Android 0.99.7.45 still delegates r214 Top 10 to r216');
if(html.includes(oldStats))throw new Error('Android 0.99.7.45 still renders Series count card');
if(html.includes(oldPersonShell))throw new Error('Android 0.99.7.45 still renders Person shell title');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099745_READY base=.44 top10=r217 imported-media=retry profile=no-series-card person=direct-hero web=unchanged');

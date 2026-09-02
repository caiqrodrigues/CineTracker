import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099743.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r215-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.44: embedded r215 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r215-android-profile-posters-discover';"))throw new Error('Android 0.99.7.44 requires 0.99.7.43 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.44 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r216-top10-person-season.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.44 must not add gesture listener: '+forbidden);
}

const oldTopCond="if(selected==='top10'&&typeof ctR180RenderTop10==='function'){";
const oldTopCall='await ctR180RenderTop10(seq);';
if(!js.includes(oldTopCond)||!js.includes(oldTopCall))throw new Error('Android 0.99.7.44 Top 10 legacy delegation not found');
js=js.replace(oldTopCond,"if(selected==='top10'&&typeof window.ctR216RenderTop10==='function'){");
js=js.replace(oldTopCall,'await window.ctR216RenderTop10(seq);');
js=js.replace("const REVISION='r215-android-profile-posters-discover';","const REVISION='r216-android-top10-person-season';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r216-android-js">${js}</script>`+html.slice(b+'</script>'.length);

const personShell="setApp(shell('Pessoa','Biografia e filmografia completa.','discover'";
if(!html.includes(personShell))throw new Error('Android 0.99.7.44 person shell not found');
html=html.replace(personShell,"setApp(shell('Pessoa','','discover'");
const personKicker='<div class="ct169-kicker">PESSOA</div>';
if(!html.includes(personKicker))throw new Error('Android 0.99.7.44 person kicker not found');
html=html.replace(personKicker,'');
const oldBio="${esc(biography||'Biografia não disponível no TMDB.')}";
const newBio="${esc((typeof ctR216ShortBio==='function'?ctR216ShortBio(biography):biography)||'Biografia não disponível no TMDB.')}";
if(!html.includes(oldBio))throw new Error('Android 0.99.7.44 person biography renderer not found');
html=html.replace(oldBio,newBio);

html=html.replace('name="ct-android-v099743" content="r215-profile-posters-discover"','name="ct-android-v099744" content="r216-top10-person-season"');

for(const m of [
  'android-v0.99.7.44-r216-top10-person-season',"const REVISION='r216-android-top10-person-season';",
  'top10-current-state-person-summary-season-one-screen','current-dom-token-no-legacy-nav-guard',
  'photo-name-short-biography-no-intro','whole-season-one-screen-swipe-season-only',
  "typeof window.ctR216RenderTop10==='function'",'await window.ctR216RenderTop10(seq);',
  'data-ct216-top10','ctR216ShortBio','max=420','ct170-person-page .ct169-kicker',
  'flex:0 0 100%!important','overflow-x:hidden!important','scroll-snap-type:x mandatory!important',
  'grid-template-columns:repeat(3,minmax(0,1fr))','main-and-sports-collapse-together-tight-gap',
  'safe-title-type-tmdb-fallback-cache'
])if(!html.includes(m))throw new Error('Android 0.99.7.44 missing '+m);

if(html.includes("setApp(shell('Pessoa','Biografia e filmografia completa.','discover'"))throw new Error('Android 0.99.7.44 person intro still present');
if(html.includes(oldTopCall))throw new Error('Android 0.99.7.44 still calls legacy Top 10 renderer from r214');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099744_READY base=.43 top10=current-state person=short-bio season=one-screen web=unchanged');

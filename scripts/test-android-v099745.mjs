import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const runtime=await readFile(resolve(root,'apps/android/runtime-r217-f1-top10-person-profile.js'),'utf8');
function must(v,msg){if(!v)throw new Error('Android 0.99.7.45 test failed: '+msg)}
function has(s){return html.includes(s)}

must(has('android-v0.99.7.45-r217-f1-top10-person-profile'),'r217 bundle missing');
must(has("typeof window.ctR217RenderTop10==='function'"),'r214 does not call r217 Top10');
must(has('await window.ctR217RenderTop10(seq);'),'r217 Top10 await missing');
must(!has('await window.ctR216RenderTop10(seq);'),'r214 still delegates Top10 to r216');
must(has('data-ct217-top10'),'Top10 own synchronous shell missing');
must(has("setApp(shell('Descobrir','','discover'"),'Top10 does not repaint Discover shell');
must(has('synchronous-own-shell-tokenized-provider-flow'),'Top10 runtime authority marker missing');

must(has("row214(2,[card214('Episódios',fmt214(s.episodes_watched)),card214('Filmes',fmt214(s.movies_watched))])"),'Profile Episodes/Movies row missing');
must(!has("row214(3,[card214('Séries',fmt214(seriesCount))"),'Profile Series count card still present');
must(has('main-and-sports-collapse-together-tight-gap'),'approved unified stats collapse lost');

must(has('invalid-id-unique-exact-title-fallback-positive-id'),'imported-media fallback missing');
must(has("host.dataset.media=j.type+':'+Number(r.id)"),'recovered TMDB positive id is not applied');
must(has('ct217Recovered'),'recovered poster marker missing');
must(runtime.includes("if(oldId>0)return null"),'fallback must target invalid imported ids only');
must(runtime.includes("safeTmdb('/search/'+j.type"),'title/type TMDB search missing');

must(!has("setApp(shell('Pessoa','','discover'"),'Person title still requested from shell');
must(has('cleanPersonHeader217'),'Person residual header cleanup missing');
must(has('remove-cinetracker-person-header-direct-photo-bio'),'Person direct-hero marker missing');
must(has('max=420'),'short biography from .44 lost');

must(has('grid-template-columns:repeat(3,minmax(0,1fr))'),'Discover 3x3 layout lost');
must(has('whole-season-one-screen-swipe-season-only'),'season one-screen behavior lost');
must(has('overflow-x:hidden!important'),'season internal horizontal scroll returned');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  must(!runtime.includes(forbidden),'r217 adds forbidden gesture listener '+forbidden);
}

console.log('ANDROID_099745_TESTS_OK top10=independent profile=no-series imported-media=positive-id person=no-header preserved=.44');

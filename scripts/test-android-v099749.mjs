import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const runtime=await readFile(resolve(root,'apps/android/runtime-r221-rewatch-favorites-sports.js'),'utf8');
function must(v,msg){if(!v)throw new Error('Android 0.99.7.49 test failed: '+msg)}
function has(s){return html.includes(s)}

must(has('android-v0.99.7.49-r221-rewatch-favorites-sports'),'r221 bundle missing');
must(has("const REVISION='r221-android-rewatch-favorites-sports';"),'r221 revision missing');
must(has('r214-selector-ticket-r217-authoritative-render'),'Top10 r214/r217 authority lost');
must(has('r217-library-behavior-no-r219-synthetic-fallback'),'manual media r217 behavior lost');
must(has('display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important'),'Discover horizontal rail lost');
must(has('overflow-x:auto!important'),'Discover horizontal scroll lost');

must(runtime.includes("window.__ctR221Rewatch='persistent-2x-3x-4x-no-disable';"),'rewatch contract missing');
must(runtime.includes('btn.textContent=playLabel221(plays);btn.disabled=false;'),'rewatch button does not stay active');
must(runtime.includes("rpc('cinetracker_mark_watch_v0994'"),'movie canonical play RPC missing');
must(runtime.includes("rpc('cinetracker_mark_episode_v0994'"),'episode canonical play RPC missing');
must(runtime.includes('data-ct221-open-media'),'favorite movie/series detail navigation missing');
must(runtime.includes('data-ct221-open-person'),'favorite person detail navigation missing');
must(runtime.includes("go('/'+(t==='movie'?'movie':'series')+'/'+id)"),'favorite media route missing');
must(runtime.includes("window.__ctR221Sports='remove-status-statistics-summary-card';"),'sports cleanup contract missing');
must(runtime.includes('cleanSports221'),'sports status card cleanup missing');

for(const bad of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia']){
  must(!runtime.includes(bad),'r221 contains rejected .47 behavior '+bad);
  must(!has(bad),'generated app contains rejected .47 behavior '+bad);
}
console.log('ANDROID_099749_TESTS_OK rewatch=unbounded favorites=navigate sports=summary-removed discover=r220-preserved');

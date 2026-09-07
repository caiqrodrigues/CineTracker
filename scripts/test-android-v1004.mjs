import fs from 'node:fs';
const file='apps/android/app/src/main/assets/hotfix5/index.html';
const html=fs.readFileSync(file,'utf8');
const marker='<script data-ct-android="r246-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.4 r246 main script missing');
const js=html.slice(a+marker.length,b);
for(const x of [
 "const REVISION='r246-android-official-1.0.4';",
 "window.__ctR208='v104-authoritative-internal-runtime'",
 'const CT104_ANDROID=true;',
 'cinetracker_rewatch_counts_v104','cinetracker_mark_watch_v0994','cinetracker_mark_episode_v0994',
 'ct104DecorateHistory','ct104DecorateEpisodeCounts','ct104EpisodeRewatch',
 'cinetracker_recommendation_memory_v101','cinetracker_recommendation_record_v101','ct104ScanShown',
 'cinetracker-f1-v1','ct104EnsureF1','current/last/pitstops','current/last/laps',
 'ct104-android','--ct104-card-w','repeat(3,minmax(0,1fr))',
 'watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch',
 'CineTracker • v1.0.4 • ${REVISION}'
])if(!js.includes(x))throw new Error('Android 1.0.4 missing '+x);
const core=js.indexOf("window.__ctR208='v104-authoritative-internal-runtime'"),boot=js.lastIndexOf('\nboot();');
if(!(core>0&&boot>core))throw new Error('Android 1.0.4 core is not inside main runtime before boot');
for(const bad of ["window.__ctR244='f1-hub-rewatch-functional-sports-cleanup-android'","window.__ctR245='v103-rewatch-navigation-recommendations-f1-android'"])if(html.includes(bad))throw new Error('Rejected external overlay leaked: '+bad);
if(!html.includes('name="ct-official-version" content="1.0.4"'))throw new Error('Android official meta version missing');
console.log('ANDROID_1_0_4_INTERNAL_RUNTIME_TEST_OK r246-before-boot no-r244-r245-overlays cards=3 rewatch=history+episodes recommendations=persistent f1=hub');

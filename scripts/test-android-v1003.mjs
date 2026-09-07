import fs from 'node:fs';
const file='apps/android/app/src/main/assets/hotfix5/index.html';
const html=fs.readFileSync(file,'utf8');
const must=[
 'name="ct-official-version" content="1.0.3"',
 "window.__ctR245='v103-rewatch-navigation-recommendations-f1-android'",
 "window.__ctAndroidOfficialVersion='1.0.3'",
 'window.__ctAndroidOfficialCode=10045',
 'cinetracker_mark_watch_v0994',
 'p_media_id:x.mediaId','p_item_type:x.itemType','p_season_number:x.itemType','p_episode_number:x.itemType',
 'cinetracker_recommendation_memory_v101','cinetracker_recommendation_record_v101',
 'instant-global-nav-closes-details','closeDetails','pointerdown',
 'current/last/pitstops','current/last/laps','current/last/sprint','Sprint Shootout',
 'watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch'
];
for(const x of must) if(!html.includes(x)) throw new Error(`Android 1.0.3 assertion failed: ${x}`);
const r207=html.lastIndexOf("window.__ctR245='v103-rewatch-navigation-recommendations-f1-android'");
const r206=html.lastIndexOf("window.__ctR244='f1-hub-rewatch-functional-sports-cleanup-android'");
if(r207<r206) throw new Error('1.0.3 runtime is not after 1.0.2 runtime');
if(html.includes("p_item_id:String(id),p_mode:mode") && r207<0) throw new Error('Legacy wrong RPC signature is still authoritative');
console.log('Android 1.0.3 functional runtime test passed.');
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');

assert.match(gradle,/versionCode 9972/,'Android versionCode must be 9972');
assert.match(gradle,/versionName '0\.99\.7\.2'/,'Android versionName must be 0.99.7.2');
assert.match(html,/android-v0\.99\.7\.2-ui-polish-r3/,'Android R3 bundle marker missing');
assert.match(html,/window\.__ctAndroidBuild='0\.99\.7\.2'/,'Android build marker missing');
assert.match(html,/window\.__ctAndroidWebBuild='0\.99\.7'/,'embedded Web parity marker missing');
assert.match(html,/v09972-android-ui-polish-r3/,'Android UI polish marker missing');
assert.match(html,/ct-android-09972-polish/,'Android R3 responsive CSS missing');
assert.ok(!html.includes('<script src="/'),'embedded APK must not depend on root JS assets');
assert.match(html,/void preloadRoute994\(target\);/,'Android startup preload must remain non-blocking');
assert.match(html,/window\.ct15Navigate=navigate997/,'native navigation must target current 0.99.7 authority');
assert.match(layout,/android:id="@\+id\/nav_history"[\s\S]*?android:visibility="gone"/,'native Histórico item must remain hidden');

for(const name of [
  'patch-v118-v0997-authoritative.js','patch-v119-v0997-real-smoke-hotfix.js','patch-v1195-v0997-route-preload-core.js',
  'patch-v1196-v0997-persistent-preload.js','patch-v120-v0997-structural-authority.js','patch-v121-v0997-functional-polish.js',
  'patch-v122-v0997-live-smoke-fixes.js','patch-v124-v0997-video-smoke-authority.js','patch-v125-v0997-restore-foryou-contract.js',
  'patch-v126-v0997-video3124-recovery.js','patch-v127-v0997-settings-unified-data-hub.js','patch-v128-v0997-settings-minimal-transfer.js',
  'patch-v129-v0997-settings-real-metadata-refresh.js','patch-v130-v0997-nav-footer-stability.js'
]) assert.ok(html.includes(`data-ct-inline="${name}"`),`Android parity missing ${name}`);

for(const marker of [
  'v118-single-authority-profile-discover-detail','v119-real-device-smoke-hotfix','v1196-persistent-rpc-stale-while-revalidate','v120-structural-profile-discover-media-authority',
  'v121-functional-polish-no-refactor','v124-video-smoke-production-authority','v125-restore-foryou-only-no-other-tabs','v126-video3124-surgical-recovery',
  'v128-settings-minimal-import-export-only','v129-settings-real-metadata-refresh-only','v130-nav-footer-stability-only',
  'cinetracker_profile_payload_v0997','Episódios por Dia','Atores Favoritos','Avaliações dos episódios por temporada',
  'Populares','Todos','Séries','Filmes','Lista','Carrossel','Grade','next_episode_to_air',
  "applyFourMore('Séries')","applyFourMore('Filmes')","applyFourMore('Séries Favoritas')","applyFourMore('Filmes Favoritos')","applyFourMore('Atores Favoritos')",
  'window.ct99RenderProfile=()=>false',"cont:s.filter(x=>x.home_bucket==='continue'&&!caught(x))",'ct128-main-btn',
  'Ignorados com segurança','media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb','matches(x)&&(!yr||cy(x)===yr)',
  'ct-android-cast-more','ct-android-actors-more','ct-android-action-grid','last-child:nth-child(odd)',
  'watch_history?select=watched_at,item_type','episode_progress?select=watched_at,watched','__ctAndroid9972RepairDaily',
  "w.onclick=()=>void toggleWatchlist118(ctx,w)","m.onclick=()=>void markMovie118(ctx,m)","toggleMediaFav118(ctx.row?.id?{mediaId:Number(ctx.row.id)}:{type:ctx.type,tmdbId:ctx.tmdbId},f)",
  "m[1]+' '+m[2]+', '+m[3]+' '+m[4]+' e '+m[5]+' H'"
]) assert.ok(html.includes(marker),`Android 0.99.7.2 missing ${marker}`);

for(const forbidden of [
  'patch-v111-v0994-global-search.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js',
  'patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js',
  "if(t==='profile')return renderProfile99()","if(v==='profile'||v==='history')renderProfile99()",
  "function run(){if(!currentUser)return;insertProfileBlocks();","function run(){if(!currentUser)return;enhanceProfile();",
  'priority=visible-posters'
]) assert.ok(!html.includes(forbidden),`Android 0.99.7.2 must not contain ${forbidden}`);

console.log('ANDROID_09972_OK code=9972 web=0.99.7 cast=3-visible+5+more actions=preserved activity=history-fallback actors=carousel stats=wide-last+single-line-H');

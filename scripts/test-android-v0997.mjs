import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');

assert.match(gradle,/versionCode 9970/,'Android versionCode must be 9970');
assert.match(gradle,/versionName '0\.99\.7'/,'Android versionName must be 0.99.7');
assert.match(html,/android-v0\.99\.7-single-authority/,'Android 0.99.7 bundle marker missing');
assert.match(html,/window\.__ctAndroidBuild='0\.99\.7'/,'Android build marker missing');
assert.match(html,/data-ct-inline="patch-v118-v0997-authoritative\.js"/,'v118 authority must be embedded');
for(const old of ['patch-v111-v0994-global-search.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'])assert.ok(!html.includes(`data-ct-inline="${old}"`),`${old} must not execute inside Android 0.99.7`);
assert.ok(!html.includes('<script src="/'),'embedded APK must not depend on root JS assets');
assert.match(html,/void preloadRoute994\(target\);/,'Android startup preload must remain non-blocking');
assert.match(html,/window\.ct15Navigate=navigate997/,'native navigation must target 0.99.7 authority');
assert.match(html,/cinetracker_profile_payload_v0997/,'timezone-correct profile RPC missing');
assert.match(html,/v118-single-authority-profile-discover-detail/,'single authority marker missing');
for(const marker of ['Populares','Todos','Séries','Filmes','Lista','Carrossel','Grade','Avaliações dos episódios por temporada','favorite_actors','priority=visible-posters','next_episode_to_air'])assert.ok(html.includes(marker),`Android 0.99.7 missing ${marker}`);
assert.match(layout,/android:id="@\+id\/nav_history"[\s\S]*?android:visibility="gone"/,'native Histórico item must remain hidden');
console.log('ANDROID_0997_OK identity=9970 runtime=v118 profile=local-chart discover=filters actors=favorites season-chart=external posters=visible-repair');

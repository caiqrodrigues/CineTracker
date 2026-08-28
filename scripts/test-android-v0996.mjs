import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');

assert.match(gradle,/versionCode 9960/,'Android versionCode must be 9960');
assert.match(gradle,/versionName '0\.99\.6'/,'Android versionName must be 0.99.6');
assert.match(html,/android-v0\.99\.6-authoritative-preload/,'Android 0.99.6 bundle marker missing');
assert.match(html,/window\.__ctAndroidBuild='0\.99\.6'/,'Android build marker missing');
for(const name of [
  'patch-v099-v0994-web.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js','patch-v110-v0994-episode-check.js',
  'patch-v111-v0994-global-search.js','patch-v112-v0994-warm-boot.js','patch-v113-v0994-fluidity.js','patch-v114-v0994-universal-detail.js',
  'patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'
])assert.ok(html.includes(`data-ct-inline="${name}"`),`${name} must be embedded`);
assert.ok(!html.includes('<script src="/'),'embedded APK must not depend on root JS assets');
assert.match(html,/void preloadRoute994\(target\);/,'Android startup preload must remain non-blocking');
assert.match(html,/v116-profile-discover-single-authority/,'0.99.6 single Profile/Discover authority missing');
assert.match(html,/v117-posters-actors-season-ratings/,'0.99.6 final repair layer missing');
assert.match(html,/cinetracker_profile_payload_v0996/,'0.99.6 Profile payload missing');
assert.match(html,/ct0996_profile_snapshot_v2/,'0.99.6 Profile cache v2 missing');
assert.match(html,/ct0996_discover_snapshot_v2/,'0.99.6 Discover cache v2 missing');
assert.match(html,/window\.__ct0996WarmAll/,'shared preload/warmup missing');
assert.match(html,/cinetracker_discovery_exclusions_v0994/,'strict Discover exclusions missing');
assert.match(html,/strict_exclusions:true/,'strict Discover fail-closed marker missing');
assert.match(html,/priority=visible-posters/,'targeted missing-cover enrichment missing');
assert.match(html,/requested_media_ids/,'targeted poster IDs missing');
assert.match(html,/ct117-cast-heart/,'actor favorite control missing');
assert.match(html,/Avaliações dos episódios por temporada/,'season chart carousel missing');
assert.match(html,/ct117-season-ratings-strip/,'horizontal season scroll missing');
assert.match(html,/data-ct114-rewatch/,'episode rewatch missing');
assert.match(html,/combined_credits/,'actor filmography missing');
assert.match(html,/window\.ct15Navigate=navigate996/,'native navigation must target final 0.99.6 router');
assert.match(layout,/android:id="@\+id\/nav_history"[\s\S]*?android:visibility="gone"/,'native Histórico item must remain hidden');
console.log('ANDROID_0996_OK identity=9960 web=exact-authoritative-v117 posters=targeted actors=favorites season-charts=external discover=strict history=hidden');

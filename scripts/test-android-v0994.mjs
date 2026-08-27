import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const gradle = await readFile('apps/android/app/build.gradle','utf8');
const layout = await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');

assert.match(gradle,/versionCode 9940/,'Android versionCode must be 9940');
assert.match(gradle,/versionName '0\.99\.4'/,'Android versionName must be 0.99.4');
assert.match(html,/android-v0\.99\.4-startup-resilient/,'Android 0.99.4 bundle marker missing');
assert.match(html,/window\.__ctAndroidBuild='0\.99\.4'/,'Android build marker missing');
for (const name of [
  'patch-v099-v0994-web.js','patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js',
  'patch-v104-v0994-authority.js','patch-v105-v0994-preload-layout.js','patch-v106-v0994-refactor.js','patch-v107-v0994-data-ui-fix.js'
]) assert.ok(html.includes(`data-ct-inline="${name}"`),`${name} must be embedded`);
assert.ok(!html.includes('<script src="/'),'embedded APK must not depend on root JS assets');
assert.match(html,/void preloadRoute994\(target\);/,'Android startup preload must be non-blocking');
assert.match(html,/Tempo limite ao sincronizar Home/,'Home RPC timeout guard missing');
assert.match(html,/window\.ct15Navigate = navigate994/,'native navigation must target 0.99.4 router');
assert.match(html,/cinetracker_profile_home_payload_v0994/,'0.99.4 Home RPC missing');
assert.match(html,/cinetracker_discovery_exclusions_v0994/,'strict Discover exclusions missing');
assert.match(layout,/android:id="@\+id\/nav_history"[\s\S]*?android:visibility="gone"/,'native Histórico item must remain hidden');
console.log('ANDROID_0994_OK identity=9940 embedded=current preload=nonblocking home-timeout=15s nav=v0994 history=hidden');

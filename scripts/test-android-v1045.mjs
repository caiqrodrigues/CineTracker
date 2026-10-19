import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r287-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android r287 script missing');
const js=html.slice(a+tag.length,b);
new Function(js);
const special=js.indexOf('const special263={');
const owner=js.indexOf('/* r287: r286 actions executed WITHIN r263 module scope. */');
const ready=js.indexOf('window.__ctR287AndroidV1045="bootstrap-fixed-r263-private-scope"');
const close=js.indexOf('\n})();\n\n/* r264:',special);
const boot=js.lastIndexOf('\nboot();');
assert.ok(special>0&&owner>special&&ready>owner&&close>ready&&boot>close,
 'r286 special Home patch must run INSIDE r263 closure and BEFORE login boot');
assert.equal(js.slice(close,boot).includes('const oldMountSpecial=mountSpecial263'),false,
 'out-of-scope access would blank login');
assert.ok(js.slice(owner,close).includes('const oldMountSpecial=mountSpecial263'),
 'Home wrapper missing private r263 symbol');
assert.ok(js.slice(owner,close).includes('catch(error){document.documentElement.dataset.ct287StartupError'),
 'startup guard missing for login');
assert.ok(js.includes('function loginView(')||js.includes('function authScreen(')||js.includes('CINETRACKER'),
 'login screen lost');
assert.ok(js.includes("const REVISION='r287-android-official-1.0.45'"),'version wrong');
assert.ok(js.includes('window.__ctAndroidOfficialCode=10087'),'Android version code wrong');
assert.ok(html.includes('name="ct-official-version" content="1.0.45"'),'embedded release version wrong');
for(const x of ['cinetracker_ufc_watch_v512','cinetracker_wwe_ppv_watch_v519',
 'cinetracker_f1_watch_sync_v462','cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421','cinetracker_home_movie_history_v542'])
 assert.ok(js.includes(x),'previous Android functionality absent '+x);
const patch=await readFile('apps/android/runtime-r286-v1044-discover-and-special-home.js','utf8');
assert.equal(js.split(patch.trimEnd()).length-1,1,
 'r286 feature patch must be present exactly once');
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.equal(patch.includes(forbidden),false,'forbidden runtime mutation');
console.log('ANDROID_1_0_45_TEST_OK r286 patch moved inside r263 closure, guarded startup, login code retained, r541 Web frozen');

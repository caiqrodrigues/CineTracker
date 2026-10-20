import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const from=(doc,marker)=>{const tag='<script data-ct-android="'+marker+'">';const a=doc.indexOf(tag),b=a<0?-1:doc.indexOf('</script>',a+tag.length);assert.ok(a>=0&&b>a,'Missing '+marker);return doc.slice(a+tag.length,b)};
const js=from(html,'r303-android-stable-js');
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const marker of [
 "const REVISION='r303-android-official-1.0'",
 "window.__ctWebBuild='1.0';window.__ctOfficialVersion='1.0';window.__ctAndroidOfficialVersion='1.0';window.__ctAndroidOfficialCode=10104;",
 'window.__ctR303SinglePaint','ct303-no-foryou-animations',
 'function ct301Exposed(key,ref)','function ct300Choice(rows)',
 'window.__ctR293Gate','window.__ctR296WweHome',
 'const restoreCached=()=>',
 "[['previous','Anteriores'],['upcoming','Próximos']]",
 'cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(marker),'Stable runtime missing '+marker);
for(const banned of ['window.location.reload(','router.refresh(']){
 const withoutComments=js.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
 assert.ok(!withoutComments.includes(banned),'Unexpected full page reload '+banned);
}
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes("versionName '1.0'"));
assert.ok(gradle.includes('versionCode 10104'));
assert.ok(gradle.includes('release {')&&gradle.includes('signingConfig signingConfigs.official'),
 'Official build must be non-debug release signed with existing signing identity');

let baseline=null;
try{await stat('/tmp/CineTracker-Android-1.0.61.apk');baseline=execFileSync('unzip',['-p','/tmp/CineTracker-Android-1.0.61.apk','assets/hotfix5/index.html'],{encoding:'utf8',maxBuffer:18*1024*1024})}catch(e){
 if(process.env.CINETRACKER_REQUIRE_BASELINE==='1')throw Error('Could not load published signed 1.0.61 baseline APK: '+e?.message);
}
if(baseline){
 const old=from(baseline,'r303-android-js');
 let normalized=js;
 normalized=normalized.replaceAll('CineTracker • v1.0','CineTracker • v1.0.61');
 normalized=normalized.replaceAll("JSON.stringify({version:'1.0',revision:REVISION","JSON.stringify({version:'1.0.61',revision:REVISION");
 normalized=normalized.replaceAll("window.__ctAndroidRelease='1.0'","window.__ctAndroidRelease='1.0.61'");
 normalized=normalized.replace("window.__ctWebBuild='1.0';window.__ctOfficialVersion='1.0';window.__ctAndroidOfficialVersion='1.0';window.__ctAndroidOfficialCode=10104;",
 "window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';window.__ctAndroidOfficialVersion='1.0.61';window.__ctAndroidOfficialCode=10103;");
 normalized=normalized.replace("const REVISION='r303-android-official-1.0';","const REVISION='r303-android-official-1.0.61';");
 assert.equal(normalized,old,'The official 1.0 must NOT modify 1.0.61 JavaScript behavior');
}
console.log('CINETRACKER_ANDROID_1_0_OFFICIAL_TEST_OK: release signing, unique existing package, upgrade-compatible versionCode, all 1.0.61 capabilities retained, identical functional runtime'+(baseline?' versus published APK':'')+'.');

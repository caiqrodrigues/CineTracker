import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),must=(v,m)=>{if(!v)throw new Error('Android 0.99.7.14 test: '+m)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
for(const marker of[
  'android-v0.99.7.14-r179-immersive-detail-nav',
  'web-r179-frozen-android-ui-parity',
  'persistent-five-tab-nav-immersive-poster-compact-where',
  'always-visible-five-tabs',
  'poster-first-no-detail-header',
  'compact-provider-icons',
  'ct180-immersive-detail',
  'ct180-detail-back',
  'ct180-mobile-nav',
  'home-target-card-by-media-id',
  'history-duplicate-safe-next-episode-card',
  'stable-home-dom-no-repaint-loop',
  'first-released-unwatched-gap-authority'
])must(html.includes(marker),'missing '+marker);
must(gradle.includes('versionCode 9984'),'versionCode');
must(gradle.includes("versionName '0.99.7.14'"),'versionName');
must(html.includes('display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important'),'bottom nav forced visible');
must(html.includes('body.ct180-immersive-detail .search-global,body.ct180-immersive-detail .header'),'detail preamble hidden');
must(html.includes('aspect-ratio:2/3!important'),'poster-first ratio');
must(html.includes('body.ct180-immersive-detail .ct171-provider-card{display:block!important;flex:0 0 48px!important'),'compact providers');
must(!html.includes('android-v0.99.7.13-r179-home-target-card'),'.13 bundle marker still present');
const marker='<script data-ct-android="r179-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);must(a>=0&&b>a,'embedded r179 JS');
const js=html.slice(a+marker.length,b);
must(js.includes("const REVISION='r179-home-target-card';"),'frozen Web r179');
must(js.includes("window.__ctAndroidBundle='android-v0.99.7.14-r179-immersive-detail-nav';"),'Android .14 runtime');
must(js.includes('function ct180EnsureBottomNav'),'bottom nav runtime');
must(js.includes('function ct180AndroidCompose'),'composition runtime');
must(js.includes('const ct180AndroidSetAppBase=setApp;'),'setApp composition hook');
must(js.includes('const $$=(s,r=document)=>'),'$$ helper');
must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');
const tmp=resolve(root,'scripts/.tmp-android-v099714.js');await writeFile(tmp,js,'utf8');try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}
console.log('ANDROID_099714_TEST_OK web=r179-frozen nav=always detail=immersive where=compact');

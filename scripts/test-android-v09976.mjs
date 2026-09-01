import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Android 0.99.7.6 test: '+msg)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');

for(const marker of[
  'android-v0.99.7.6-r173-mobile-frame','web-r173-full-functional-parity','r173-detail-left-window',
  'phone-framed-carousels-scroll-snap','scroll-snap-type:x proximity','overflow-x:auto',
  'ct169-cast-row','ct169-related-row','ct169-season-row','ct171-provider-row','ct171-top-row',
  'ct169-season-chart-carousel','ct169-activity-scroll','foryou-grid','mobile-nav'
])must(html.includes(marker),`missing ${marker}`);

must(html.includes('html,body{width:100%!important;max-width:100%!important;min-width:0!important'), 'page framing rule missing');
must(html.includes('.ct169-detail-hero.ct173-detail-window{width:100%!important;max-width:100%!important'), 'detail hero phone framing missing');
must(html.includes('.row>.card{flex:0 0 clamp(112px,36vw,148px)!important'), 'generic carousel card sizing missing');
must(html.includes('.ct169-season-chart-card{flex:0 0 calc(100vw - 28px)!important'), 'season chart local viewport missing');
must(html.includes('versionCode 9976'),'versionCode 9976 missing');
must(html.includes("versionName '0.99.7.6'"),'versionName 0.99.7.6 missing');

const marker='<script data-ct-android="r173-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
must(a>=0&&b>a,'embedded JS missing');
const js=html.slice(a+marker.length,b);
must(js.includes('const $$=(s,r=document)=>'),'$$ helper corrupted');
must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');
const tmp=resolve(root,'scripts/.tmp-android-v09976.js');
await writeFile(tmp,js,'utf8');
try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}

console.log('ANDROID_09976_TEST_OK baseline=r173 phone=framed carousels=swipe+scroll detail=responsive charts=local-horizontal');

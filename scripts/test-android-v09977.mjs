import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Android 0.99.7.7 test: '+msg)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');

for(const marker of[
  'android-v0.99.7.7-r173-mobile-composition','web-r173-full-functional-parity','r173-detail-left-window',
  'stacked-hero-readable-carousels-phone-panels','phone-framed-carousels-scroll-snap',
  'ct169-related-card','ct169-cast-card','ct171-provider-card','ct169-drawer-ep','ct169-season-chart-card'
])must(html.includes(marker),`missing ${marker}`);

must(html.includes('.ct169-detail-hero.ct173-detail-window{display:block!important'),'stacked detail hero missing');
must(html.includes('.ct169-main-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))'),'detail action grid missing');
must(html.includes('.ct169-related-card{flex:0 0 min(43vw,164px)!important'),'readable related carousel sizing missing');
must(html.includes('.ct171-provider-card{flex:0 0 132px!important'),'provider carousel sizing missing');
must(html.includes('.ct169-drawer-ep{grid-template-columns:110px minmax(0,1fr)!important'),'drawer episode mobile layout missing');
must(gradle.includes('versionCode 9977'),'versionCode 9977 missing');
must(gradle.includes("versionName '0.99.7.7'"),'versionName 0.99.7.7 missing');

const marker='<script data-ct-android="r173-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
must(a>=0&&b>a,'embedded JS missing');
const js=html.slice(a+marker.length,b);
must(js.includes('const $$=(s,r=document)=>'),'$$ helper corrupted');
must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');
const tmp=resolve(root,'scripts/.tmp-android-v09977.js');
await writeFile(tmp,js,'utf8');
try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}

console.log('ANDROID_09977_TEST_OK baseline=r173 hero=stacked carousels=readable drawer=phone panels=balanced');

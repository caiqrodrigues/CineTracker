import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Android 0.99.7.5 test: '+msg)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const layout=await readFile(resolve(root,'apps/android/app/src/main/res/layout/activity_main.xml'),'utf8');

for(const marker of[
  'android-v0.99.7.5-r173-parity-bootfix','web-r173-full-functional-parity','r173-detail-left-window',
  'Top 10','Onde Assistir','Títulos Relacionados','Assistido por dia','Produção:',
  'cinetracker_series_episode_state_v1','only-10-canonical-services-no-plan-or-channel-duplicates',
  'data-ct171-activity-day','data-ct169-season','ct-sports-search','global-entity-search',
  'window.__ctAndroidNavigate','window.ct48Back','mobile-nav'
])must(html.includes(marker),`embedded runtime missing ${marker}`);

const open='<script data-ct-android="r173-js">';
const start=html.indexOf(open),end=start<0?-1:html.indexOf('</script>',start+open.length);
must(start>=0&&end>start,'embedded script boundaries missing');
const js=html.slice(start+open.length,end);
must(js.includes('const $$=(s,r=document)=>'),'$$ helper not preserved');
must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'$ helper duplicated/corrupted');
const temp=resolve(root,'scripts/.tmp-test-v09975-embedded.js');
await writeFile(temp,js,'utf8');
try{execFileSync(process.execPath,['--check',temp],{stdio:'inherit'});}finally{await rm(temp,{force:true});}

must(!html.includes('<script defer src="/app-v173.js'),'embedded runtime still depends on root JS asset');
must(!html.includes('<link rel="stylesheet" href="/app-v173.css'),'embedded runtime still depends on root CSS asset');
must(gradle.includes('versionCode 9975'),'versionCode 9975 missing');
must(gradle.includes("versionName '0.99.7.5'"),'versionName 0.99.7.5 missing');
must(layout.includes('android:id="@+id/android_bottom_nav"'),'native nav container missing');
must(layout.includes('android:visibility="gone"'),'native nav must stay hidden in favor of r173 web mobile nav');
console.log('ANDROID_09975_TEST_OK baseline=r173 boot=syntax-valid parity=preserved');

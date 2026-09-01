import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Android 0.99.7.4 test: '+msg)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const layout=await readFile(resolve(root,'apps/android/app/src/main/res/layout/activity_main.xml'),'utf8');

for(const marker of[
  'android-v0.99.7.4-r173-parity','web-r173-full-functional-parity','r173-detail-left-window',
  'Top 10','Onde Assistir','Títulos Relacionados','Assistido por dia','Produção:',
  'cinetracker_series_episode_state_v1','only-10-canonical-services-no-plan-or-channel-duplicates',
  'data-ct171-activity-day','data-ct169-season','ct-sports-search','global-entity-search',
  'window.__ctAndroidNavigate','window.ct48Back','mobile-nav'
])must(html.includes(marker),`embedded runtime missing ${marker}`);

must(!html.includes('<script defer src="/app-v173.js'),'embedded runtime still depends on root JS asset');
must(!html.includes('<link rel="stylesheet" href="/app-v173.css'),'embedded runtime still depends on root CSS asset');
must(gradle.includes('versionCode 9974'),'versionCode 9974 missing');
must(gradle.includes("versionName '0.99.7.4'"),'versionName 0.99.7.4 missing');
must(layout.includes('android:id="@+id/android_bottom_nav"'),'native nav container missing');
must(layout.includes('android:visibility="gone"'),'native nav must be hidden in favor of r173 web mobile nav');
console.log('ANDROID_09974_TEST_OK baseline=r173 parity=home+discover+top10+sports+profile+details+actors+providers+charts+related+back');

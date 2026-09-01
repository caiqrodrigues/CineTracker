import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const must=(v,m)=>{if(!v)throw new Error('Android 0.99.7.8 test: '+m)};
for(const marker of['android-v0.99.7.8-r174-instant-motion','r174-instant-optimistic-motion','optimistic-instant-motion-episode-toggle','cinetracker_unmark_episode_v1','ct174-flash','ct174-watch-toggle','stacked-hero-readable-carousels-phone-panels'])must(html.includes(marker),'missing '+marker);
must(gradle.includes('versionCode 9978'),'versionCode');must(gradle.includes("versionName '0.99.7.8'"),'versionName');
const marker='<script data-ct-android="r174-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);must(a>=0&&b>a,'embedded r174 JS');const js=html.slice(a+marker.length,b);must(js.includes('const $$=(s,r=document)=>'),'$$ helper');must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');
const tmp=resolve(root,'scripts/.tmp-android-v09978.js');await writeFile(tmp,js,'utf8');try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}
console.log('ANDROID_09978_TEST_OK r174=instant optimistic=true unwatch=true mobile=09977');

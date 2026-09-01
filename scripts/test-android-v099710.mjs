import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),must=(v,m)=>{if(!v)throw new Error('Android 0.99.7.10 test: '+m)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
for(const marker of['android-v0.99.7.10-r176-gap-rewind','r176-first-unwatched-gap','first-released-unwatched-gap-authority','next=lowest-released-episode-not-watched-never-last-pointer-plus-one','cinetracker_unmark_episode_v1','ct174-flash','ct175-next-episode','stacked-hero-readable-carousels-phone-panels'])must(html.includes(marker),'missing '+marker);
must(gradle.includes('versionCode 9980'),'versionCode');must(gradle.includes("versionName '0.99.7.10'"),'versionName');
const marker='<script data-ct-android="r176-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);must(a>=0&&b>a,'embedded r176 JS');const js=html.slice(a+marker.length,b);must(js.includes('const $$=(s,r=document)=>'),'$$ helper');must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');
const tmp=resolve(root,'scripts/.tmp-android-v099710.js');await writeFile(tmp,js,'utf8');try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}
console.log('ANDROID_099710_TEST_OK r176=first-unwatched-gap rewind=true mobile=09977');

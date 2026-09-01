import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),must=(v,m)=>{if(!v)throw new Error('Android 0.99.7.11 test: '+m)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
for(const marker of['android-v0.99.7.11-r177-canonical-next-repaint','r177-canonical-next-repaint','canonical-next-episode-repaint','drawer-and-home-share-first-unwatched-immediate-repaint','first-released-unwatched-gap-authority','cinetracker_unmark_episode_v1','ct174-flash','ct175-next-episode','stacked-hero-readable-carousels-phone-panels'])must(html.includes(marker),'missing '+marker);
must(gradle.includes('versionCode 9981'),'versionCode');must(gradle.includes("versionName '0.99.7.11'"),'versionName');
const marker='<script data-ct-android="r177-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);must(a>=0&&b>a,'embedded r177 JS');const js=html.slice(a+marker.length,b);must(js.includes('const $$=(s,r=document)=>'),'$$ helper');must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');must(js.includes('ct175SchedulePaint'),'canonical queue repaint hook');
const tmp=resolve(root,'scripts/.tmp-android-v099711.js');await writeFile(tmp,js,'utf8');try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}
console.log('ANDROID_099711_TEST_OK r177=canonical-next-repaint drawer-home=shared mobile=09977');

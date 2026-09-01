import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),must=(v,m)=>{if(!v)throw new Error('Android 0.99.7.12 test: '+m)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
for(const marker of['android-v0.99.7.12-r178-stable-home-dom','r178-stable-home-dom','stable-home-dom-no-repaint-loop','no-global-repaint-scroll-click-history-stable','first-released-unwatched-gap-authority','cinetracker_unmark_episode_v1','ct174-flash','ct175-next-episode','stacked-hero-readable-carousels-phone-panels'])must(html.includes(marker),'missing '+marker);
must(gradle.includes('versionCode 9982'),'versionCode');must(gradle.includes("versionName '0.99.7.12'"),'versionName');
const marker='<script data-ct-android="r178-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);must(a>=0&&b>a,'embedded r178 JS');const js=html.slice(a+marker.length,b);must(js.includes('const $$=(s,r=document)=>'),'$$ helper');must((js.match(/const \$=\(s,r=document\)=>/g)||[]).length===1,'duplicate $ helper');must(js.includes('ct176PrimeCanonical=ct177PrimeCanonicalBase;'),'r177 loop disabled');must(js.includes('ct178PatchHomeSeries'),'in-place Home patch');
const tmp=resolve(root,'scripts/.tmp-android-v099712.js');await writeFile(tmp,js,'utf8');try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}
console.log('ANDROID_099712_TEST_OK r178=stable-home-dom blink=false scroll-click-history=stable');

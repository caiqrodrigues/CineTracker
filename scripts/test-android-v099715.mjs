import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099715.mjs')],{cwd:root,stdio:'inherit'});
const p=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const h=await readFile(p,'utf8');
for(const m of ['android-v0.99.7.15-r179-fast-clean-tabs','cache-first-view-snapshots-background-refresh','no-redundant-route-header','safe-inside-poster-no-transform','transform:none!important','ct181-cache-restored','home-target-card-by-media-id'])if(!h.includes(m))throw new Error('missing '+m);
if(!h.includes('body[data-ct-android-route="home"] .content>.header'))throw new Error('top route header is not hidden');
if(!h.includes('body.ct180-immersive-detail .ct169-poster-state'))throw new Error('seen badge safe-area override missing');
const marker='<script data-ct-android="r179-js">';const a=h.indexOf(marker)+marker.length,b=h.indexOf('</script>',a);if(a<marker.length||b<a)throw new Error('embedded JS missing');
const js=h.slice(a,b);if(!js.includes("const REVISION='r179-home-target-card';"))throw new Error('Web r179 lost');
const tmp=resolve(root,'scripts/.tmp-v099715.js');await writeFile(tmp,js,'utf8');try{execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'})}finally{await rm(tmp,{force:true})}
console.log('ANDROID_099715_TEST_OK r179=frozen seen=safe cache=first top-headers=hidden');

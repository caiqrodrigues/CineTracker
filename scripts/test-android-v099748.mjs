import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const runtime=await readFile(resolve(root,'apps/android/runtime-r220-top10-authority-horizontal-discover.js'),'utf8');
function must(v,msg){if(!v)throw new Error('Android 0.99.7.48 test failed: '+msg)}
function has(s){return html.includes(s)}

must(has('android-v0.99.7.48-r220-top10-authority-horizontal-discover'),'r220 bundle missing');
must(has('window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0})'),'all Discover tabs are not using the r214 authority');
must(!has("tab==='top10'&&typeof window.ctR217RenderTop10==='function'?window.ctR217RenderTop10()"),'Top 10 .47 direct bypass returned');
must(runtime.includes("window.ctR180RenderTop10=function(...args){return render.apply(this,args)};"),'r180 Top10 hook is not delegated to r217');
must(runtime.includes("window.__ctAndroidTop10='r214-selector-ticket-r217-authoritative-render';"),'Top10 authority contract missing');

must(runtime.includes('display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important'),'Discover rail is not one horizontal flex row');
must(runtime.includes('overflow-x:auto!important'),'Discover rail cannot scroll horizontally');
must(runtime.includes('flex:0 0 auto!important;width:auto!important;min-width:max-content!important'),'Discover pills are still stackable/stretchable');
for(const bad of ['grid-template-columns:repeat(3','ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia','manualArtworkR219']){
  must(!runtime.includes(bad),'r220 contains rejected .47 behavior '+bad);
  must(!has(bad),'generated app contains rejected .47 behavior '+bad);
}

must(has('synchronous-own-shell-tokenized-provider-flow'),'r217 Top10 renderer missing');
must(has('ctR217FindManualMedia'),'r217 library/manual-media behavior missing');
must(has('remove-cinetracker-person-header-direct-photo-bio'),'actor/profile fix lost');
must(!has("row214(3,[card214('Séries',fmt214(seriesCount))"),'removed Series profile card returned');
must(has('whole-season-one-screen-swipe-season-only'),'season graph behavior lost');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"])must(!runtime.includes(forbidden),'forbidden gesture listener '+forbidden);
console.log('ANDROID_099748_TESTS_OK top10=r214-ticket-r217 discover=horizontal-one-row manual-media=r217-library');

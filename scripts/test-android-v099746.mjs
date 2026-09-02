import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const runtime=await readFile(resolve(root,'apps/android/runtime-r218-discover-click-minimal-filters.js'),'utf8');
function must(v,msg){if(!v)throw new Error('Android 0.99.7.46 test failed: '+msg)}
function has(s){return html.includes(s)}
must(has('android-v0.99.7.46-r218-discover-click-minimal-filters'),'r218 bundle missing');
must(has('document-click-capture-ct214-authority-all-nine-tabs'),'Discover click authority missing');
must(has("e.target?.closest?.('[data-discover-tab]')"),'delegated Discover selector missing');
must(has('window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0})'),'Discover does not call ct214 single authority');
for(const tab of ['foryou','top10','trending','popular','new','releases','anticipated','top','calendar'])must(runtime.includes("'"+tab+"'"),'tab not covered: '+tab);
must(has('minimal-tune-button-existing-filters-only'),'minimal filter marker missing');
must(has('ct-mini-filter-trigger'),'minimal filter trigger missing');
must(has('data-ct-mini-filter'),'filter panel state missing');
must(has('synchronous-own-shell-tokenized-provider-flow'),'Top10 .45 behavior lost');
must(has('remove-cinetracker-person-header-direct-photo-bio'),'actor .45 fix lost');
must(!has("row214(3,[card214('Séries',fmt214(seriesCount))"),'removed Series card returned');
must(has('whole-season-one-screen-swipe-season-only'),'season graph behavior lost');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"])must(!runtime.includes(forbidden),'forbidden gesture listener '+forbidden);
must(!runtime.includes("statsMode"),'future stats mode was added even though user deferred it');
console.log('ANDROID_099746_TESTS_OK discover=9-tabs filters=minimal actor=.45 stats-future=not-added');

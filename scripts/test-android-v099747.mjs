import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const runtime=await readFile(resolve(root,'apps/android/runtime-r219-top10-filters-manual-media.js'),'utf8');
function must(v,msg){if(!v)throw new Error('Android 0.99.7.47 test failed: '+msg)}
function has(s){return html.includes(s)}
must(has('android-v0.99.7.47-r219-top10-filters-manual-media'),'r219 bundle missing');
must(has("tab==='top10'&&typeof window.ctR217RenderTop10==='function'?window.ctR217RenderTop10()"),'Top 10 does not bypass generic selector');
must(has('synchronous-own-shell-tokenized-provider-flow'),'r217 synchronous Top10 renderer missing');
must(runtime.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'unscoped 3x3 Discover grid missing');
must(runtime.includes('.ct-r180-tab-arrow{display:none!important}'),'Discover arrows are not forced hidden');
for(const m of ['.ct-r180-type-filters','[data-discover-type]','[data-sport]','data-ct219-filter','data-ct-mini-open','ct219-filter-trigger'])must(runtime.includes(m),'real minimal filter contract missing '+m);
must(runtime.includes('[data-ct219-filter="1"][data-ct-mini-open="0"]{display:none!important}'),'closed real filters are not forced hidden');
for(const m of ['negative-id-resolve-or-local-detail','ct219-manual-cover','ctLocalMedia','tmdb_id=eq.${j.oldId}','go(`/${j.type===\'movie\'?\'movie\':\'series\'}/${r.id}`)'])must(runtime.includes(m),'manual media recovery missing '+m);
must(has('remove-cinetracker-person-header-direct-photo-bio'),'actor fix lost');
must(!has("row214(3,[card214('Séries',fmt214(seriesCount))"),'removed Series card returned');
must(has('whole-season-one-screen-swipe-season-only'),'season graph behavior lost');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"])must(!runtime.includes(forbidden),'forbidden gesture listener '+forbidden);
must(!runtime.includes('statsMode'),'deferred Profile stats mode was added');
console.log('ANDROID_099747_TESTS_OK top10=direct-r217 discover=3x3 filters=real-minimal manual-media=usable stats-mode=not-added');

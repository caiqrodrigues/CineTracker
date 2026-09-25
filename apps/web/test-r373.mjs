import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R373_SKIP_BUILD!=='1')await import('./build-r373.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v373.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r373-home-watchlist-sort.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR373Marker='home-watchlist-full-v119+exact-count+compact-six-sort+dom-paging'","rpc('cinetracker_watchlist_full_v119',{})","PAGE_SIZE=80","added_desc","added_asc","release_desc","release_asc","'az'","'za'"])ok(src.includes(x),'missing '+x);
ok(!src.includes('.limit(120)')&&!src.includes('slice(0,120)'),'120 limit present in r373 source');
ok(html.includes('app-v373.js')&&sw.includes('ct-web-1.0.164-r373'),'asset identity');
ok(r.version==='1.0.164'&&r.revision==='r373-official-1.0.164','release identity');
console.log('WEB_R373_TEST_OK');
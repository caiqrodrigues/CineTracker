import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [runtime,build,official,js,css,release,html,sw]=await Promise.all([
 readFile(resolve(root,'runtime-r263-home-list-discover-f1-watched.js'),'utf8'),
 readFile(resolve(root,'build-r263.mjs'),'utf8'),
 readFile(resolve(root,'build-r263-official.mjs'),'utf8'),
 readFile(resolve(dist,'app-v263.js'),'utf8'),readFile(resolve(dist,'app-v263.css'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R263_STATIC_MISSING '+x)};
for(const x of[
 "window.__ctR263='approved-home-list-discover-intelligence-f1-watched'",
 "window.__ctR263Home='vertical-list+hidden-history+no-home-carousel'",
 "window.__ctR263Discover='nine-tabs-local-rails+personal-exclusions+top10-streaming'",
 "window.__ctR263Sports='f1-db-events+mark-unmark-watched'",
 "const DTABS263=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']]",
 "tmdb(`/${type263(x)}/${id263(x)}/watch/providers`)",
 "p.excluded.has(key263(x))",
 "cinetracker_sport_mark_watched_v1",
 "sport_slug||'')!=='formula_1'"
])must(runtime,x);
for(const x of['const armHome262=/function armHome262','function armHome262(){return;}','r263-official-1.0.54'])must(build,x);
for(const x of["function armHome262(){return;}","window.__ctR263='approved-home-list-discover-intelligence-f1-watched'","watch/providers","cinetracker_sport_mark_watched_v1"])must(js,x);
for(const x of['[data-home] .home-section .stack','.ct263-discover-tabs','.ct263-media-rail','.ct263-streaming','.ct263-f1-watch-panel','.ct263-f1-watch-btn'])must(css,x);
for(const x of['app-v263.js','app-v263.css'])must(html,x);
must(release,'"version": "1.0.54"');must(release,'"revision": "r263-official-1.0.54"');must(sw,"const CACHE='ct-web-1.0.54-r263';");
if(/function armHome262\(\)\{[\s\S]{0,500}markRail262\(row,'home'\)/.test(js))throw new Error('R263_STATIC r262 Home carousel authority still active');
if(!official.includes('WEB_1_0_54_OFFICIAL_OK r263'))throw new Error('R263_STATIC official verifier missing');
console.log('R263_STATIC_OK Home vertical Discover complete F1 watched');

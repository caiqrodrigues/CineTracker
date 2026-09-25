import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R376_SKIP_BUILD!=='1')await import('./build-r376.mjs');
const [html,js,sw,rel,src,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v376.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r376-home-watchlist-foryou-final.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260925201500_r376_watchlist_full_media_id_authority.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR376Marker='watchlist-media-id-authority+sort-no-rebuild+foryou-final-owner+fresh-never-empty'","rpc('cinetracker_watchlist_full_v376',{})","media_id-no-tmdb-dedupe","fyEnsureSlot","fallbackFresh","setHomeSort"])ok(js.includes(x)||rel.includes(x),'missing '+x);
ok(mig.includes("group by mo.media_id")&&!mig.includes("distinct on"),'migration still TMDB-dedupes');
ok(!js.includes("for(const ms of [0,50,250,900,1800])setTimeout(()=>{layoutAll();if(ms===0)void ensureFreshValidated(true)},ms);"),'r372 delayed writer active');
ok(html.includes('app-v376.js')&&sw.includes('ct-web-1.0.167-r376'),'asset identity');
ok(r.version==='1.0.167'&&r.revision==='r376-official-1.0.167','release identity');
console.log('WEB_R376_TEST_OK');
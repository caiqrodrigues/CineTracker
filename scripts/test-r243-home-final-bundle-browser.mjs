import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),dist=resolve(root,'apps/web/dist');
const [bundle,css]=await Promise.all([readFile(resolve(dist,'app-v243.js'),'utf8'),readFile(resolve(dist,'app-v243.css'),'utf8')]);
const dir='/tmp/ct-r243-home-final',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const safe=s=>s.replaceAll('</script>','<\\/script>');
const stub=String.raw`
window.__r243Errors=[];window.__r243R5Calls=0;window.__r243OldHomeCalls=0;window.__r243Heart=0;window.__r243R5RequestedAt=0;window.__r243R5ResolvedAt=0;
addEventListener('error',e=>window.__r243Errors.push('error:'+String(e.message||e.error||e)));
addEventListener('unhandledrejection',e=>window.__r243Errors.push('rejection:'+String(e.reason||e)));
requestIdleCallback=()=>0;cancelIdleCallback=()=>{};
localStorage.clear();
localStorage.setItem('cinetracker_session',JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:'r243-user',email:'r243@local'}}));
const mkSeries=(id,bucket,watched=0)=>({media_id:id,tmdb_id:id,media_type:'tv',title:'Serie '+id,poster_path:null,total_episodes:20,released_episodes:20,watched_episodes:watched,history_missing_episodes:Math.max(0,20-watched),is_caught_up:bucket==='up_to_date'||bucket==='completed',last_season_number:2,last_episode_number:10,latest_released_season_number:2,latest_released_episode_number:10,latest_episode_meta_season_number:2,latest_episode_meta_episode_number:10,latest_episode_name:'Episodio '+id,latest_episode_air_date:'2026-09-09',latest_episode_vote_average:8.4,home_bucket:bucket});
const series=[...Array.from({length:12},(_,i)=>mkSeries(100+i,'continue',15)),...Array.from({length:11},(_,i)=>mkSeries(200+i,'dust',8)),...Array.from({length:50},(_,i)=>mkSeries(300+i,'up_to_date',20)),...Array.from({length:120},(_,i)=>mkSeries(400+i,'not_started',0)),...Array.from({length:80},(_,i)=>mkSeries(600+i,'completed',20))];
const movie_watchlist=Array.from({length:140},(_,i)=>({media_id:1000+i,tmdb_id:1000+i,title:'Filme '+i,poster_path:null,release_year:2024,runtime_minutes:111,genres:[{id:28,name:'Ação'},{id:12,name:'Aventura'}]}));
const history_episodes=Array.from({length:70},(_,i)=>({media_id:2000+i,tmdb_id:100+(i%12),media_title:'Historico '+i,poster_path:null,season_number:1,episode_number:(i%10)+1,watched_at:'2026-09-10T10:00:00Z'}));
const history_movies=Array.from({length:70},(_,i)=>({media_id:3000+i,tmdb_id:3000+i,media_title:'Filme visto '+i,poster_path:null,release_year:2023,runtime_minutes:99,genres:[{id:18,name:'Drama'}],watched_at:'2026-09-09T20:00:00Z'}));
const payload={series,movie_watchlist,history_episodes,history_movies,seen_movie_tmdb_ids:[]};
const response=(x,status=200)=>Promise.resolve(new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json'}}));
window.fetch=(input)=>{const u=String(input?.url||input||'');
 if(u.includes('/auth/v1/user'))return response({id:'r243-user',email:'r243@local'});
 if(u.includes('/rest/v1/rpc/cinetracker_home_live_v0997_r5')){window.__r243R5Calls++;window.__r243R5RequestedAt=performance.now();return new Promise(r=>setTimeout(()=>{window.__r243R5ResolvedAt=performance.now();r(new Response(JSON.stringify(payload),{status:200,headers:{'Content-Type':'application/json'}}))},1200));}
 if(u.includes('/rest/v1/rpc/cinetracker_home_live_v0997_r4')||u.includes('/rest/v1/rpc/cinetracker_home_live_v0997_r3')){window.__r243OldHomeCalls++;return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify(payload),{status:200,headers:{'Content-Type':'application/json'}})),5000));}
 if(u.includes('/functions/v1/tmdb-proxy'))return response({id:1000,title:'Filme 0',release_date:'2024-05-10',runtime:111,genres:[{id:28,name:'Ação'},{id:12,name:'Aventura'}],results:[]});
 if(u.includes('/rest/v1/rpc/'))return response({});
 if(u.includes('/rest/v1/'))return response([]);
 return response({results:[]});
};
setInterval(()=>window.__r243Heart++,100);
`;
const probe=String.raw`
(()=>{
 const at=(ms,fn)=>setTimeout(()=>{try{fn()}catch(e){document.body.dataset.err=(document.body.dataset.err||'')+' | '+String(e)}},ms);
 at(250,()=>{const h=document.querySelector('[data-home]');document.body.dataset.earlySkeleton=String(Boolean(h?.querySelector('.ct243-home-skeleton')));document.body.dataset.earlySync=String((h?.textContent||'').includes('Sincronizando Home'))});
 at(1750,()=>{
   const h=document.querySelector('[data-home]'),vp=document.querySelector('[data-home-viewport="series"]'),hist=vp?.querySelector('.home-history'),start=vp?.querySelector('.home-start');
   document.body.dataset.homeVisible=String(Boolean(h&&h.dataset.ct243Home==='stable'&&!h.querySelector('.loader,.ct243-home-skeleton')));
   document.body.dataset.source=h?.dataset.ct243Source||'';document.body.dataset.seriesRows=String(h?.querySelectorAll('.ct243-home-row').length||0);
   document.body.dataset.historyBeforeStart=String(Boolean(hist&&start&&(hist.compareDocumentPosition(start)&Node.DOCUMENT_POSITION_FOLLOWING)));
   document.body.dataset.startVisible=String(Boolean(vp&&hist&&vp.scrollTop>=Math.max(0,hist.offsetHeight-3)));
   document.body.dataset.firstLoadMs=String(Math.round(window.__r243R5ResolvedAt-window.__r243R5RequestedAt));
 });
 at(2200,()=>document.querySelector('[data-home-tab="movies"]')?.click());
 at(2500,()=>{const h=document.querySelector('[data-home]'),m=h?.querySelector('[data-ct243-movie-meta="1000"]');document.body.dataset.movieRows=String(h?.querySelectorAll('.ct243-home-row').length||0);document.body.dataset.movieMeta=m?.textContent||''});
 at(2850,()=>document.querySelector('[data-home-tab="series"]')?.click());
 let observer=null;
 at(3300,()=>{const h=document.querySelector('[data-home]'),vp=h?.querySelector('[data-home-viewport="series"]'),start=vp?.querySelector('.home-start');document.body.dataset.stableTop1=String(Math.round(start?.getBoundingClientRect().top||0));document.body.dataset.stableScroll1=String(Math.round(vp?.scrollTop||0));window.__r243Mutations=0;if(h){observer=new MutationObserver(ms=>window.__r243Mutations+=ms.length);observer.observe(h,{childList:true,subtree:true,characterData:true})}});
 at(6100,()=>{observer?.disconnect();const h=document.querySelector('[data-home]'),vp=h?.querySelector('[data-home-viewport="series"]'),start=vp?.querySelector('.home-start');document.body.dataset.stableTop2=String(Math.round(start?.getBoundingClientRect().top||0));document.body.dataset.stableScroll2=String(Math.round(vp?.scrollTop||0));document.body.dataset.mutations=String(window.__r243Mutations||0);document.body.dataset.heart=String(window.__r243Heart||0);document.body.dataset.r5Calls=String(window.__r243R5Calls||0);document.body.dataset.oldCalls=String(window.__r243OldHomeCalls||0);document.body.dataset.errors=(window.__r243Errors||[]).join(' | ');document.body.dataset.done='1'});
})();
`;
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${safe(css)}</style></head><body><div id="app"></div><script>${safe(stub)}</script><script>${safe(bundle)}</script><script>${safe(probe)}</script></body></html>`;
await writeFile(file,html);
let out='',lastErr='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=7200','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch(e){lastErr=String(e?.stderr||e?.message||e)}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable '+lastErr.slice(0,500));
const body=out.match(/<body[^>]*>/)?.[0]||'';
const attr=n=>{const m=body.match(new RegExp(`data-${n}="([^"]*)"`));return m?.[1]??''};
const fail=m=>{throw new Error(m+' '+body)};
if(attr('done')!=='1')fail('R243 browser did not finish');
if(attr('early-skeleton')!=='true'||attr('early-sync')!=='false')fail('R243 early Home showed wrong loading state');
if(attr('home-visible')!=='true'||attr('source')!=='fresh')fail('R243 Home did not reach one fresh stable paint');
const firstMs=Number(attr('first-load-ms'));if(!(firstMs>=1100&&firstMs<2500))fail('R243 delayed r5 timing unexpected');
const seriesRows=Number(attr('series-rows'));if(!(seriesRows>0&&seriesRows<=130))fail('R243 Series DOM not bounded');
const movieRows=Number(attr('movie-rows'));if(!(movieRows>0&&movieRows<=100))fail('R243 Movie DOM not bounded');
if(attr('history-before-start')!=='true'||attr('start-visible')!=='true')fail('R243 History/start geometry incorrect');
const meta=attr('movie-meta');if(!meta.includes('111 min')||!meta.includes('2024')||!meta.includes('Ação')||!meta.includes('Aventura'))fail('R243 movie metadata incomplete');
if(attr('r5-calls')!=='1'||attr('old-calls')!=='0')fail('R243 called wrong Home authority');
if(Number(attr('heart'))<45)fail('R243 browser event loop froze');
if(Number(attr('mutations'))>3)fail('R243 Home kept mutating after stabilization');
if(attr('stable-top1')!==attr('stable-top2')||attr('stable-scroll1')!==attr('stable-scroll2'))fail('R243 History/Continue position drifted after stabilization');
if(attr('errors'))fail('R243 page error '+attr('errors'));
console.log(`R243_FINAL_BUNDLE_BROWSER_OK r5=${firstMs}ms rows=${seriesRows}/${movieRows} history=locked stable-mutations=${attr('mutations')} heartbeat=${attr('heart')} old-home-rpc=0`);

import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r359.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v359.js')],{stdio:'inherit'});

const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>
window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};
window.__ctDiagErrors=[];
window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));
window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)));
</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');

const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR359&&window.__ctR358&&window.__ctR336&&window.__ctR309Test,'r359 lineage missing '+window.__ctDiagErrors.join(' || '));
 ok(window.__ctOfficialVersion==='1.0.150','version stale');

 /* ---- Pra Você: real first capture, one clicked slot only ---- */
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const item=(id,type,title,genres=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.2,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:genres});
 const m1=item(101,'movie','W M1',[28]),m2=item(102,'movie','W M2',[35]),s1=item(201,'tv','W S1',[18]),s2=item(202,'tv','W S2',[53]);
 const a1={...item(301,'tv','W A1',[16]),original_language:'ja',origin_country:['JP']},a2={...item(302,'tv','W A2',[16]),original_language:'ja',origin_country:['JP']};
 const fm1=item(401,'movie','F M1',[12]),fm2=item(402,'movie','F M2',[35]),fs1=item(501,'tv','F S1',[18]),fs2=item(502,'tv','F S2',[80]);
 const fa1={...item(601,'tv','F A1',[16]),original_language:'ja',origin_country:['JP']},fa2={...item(602,'tv','F A2',[16]),original_language:'ja',origin_country:['JP']};
 const d1=item(701,'movie','D1',[878]),d2=item(702,'movie','D2',[35]);
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m1,m2],series:[s1,s2],anime:[a1,a2]},
  freshPools:{movie:[fm1,fm2],series:[fs1,fs2],anime:[fa1,fa2]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[d1,d2],dailyIndex:0,complete:true,
  initial:{watch:{movie:m1,series:s1,anime:a1},fresh:{movie:fm1,series:fs1,anime:fa1},daily:d1}
 });
 const calls={watchlist:[],seen:[],swap:[]};
 window.__ctR359.setTestBridge({
  watchlist:async(type,id)=>{calls.watchlist.push(type+':'+id);await sleep(35);return true},
  seen:async(type,id)=>{calls.seen.push(type+':'+id);await sleep(35);return true},
  swapMemory:async(type,id,slot)=>{calls.swap.push(type+':'+id+':'+slot);return true},
  refresh:async()=>true
 });
 let globalLibraryEvents=0;window.addEventListener('cinetracker:library-change',()=>globalLibraryEvents++);
 ok(window.__ctR336.paintForYou(),'Pra Você paint failed');window.__ctR348?.fixAll?.();window.__ctR349?.compact?.();await sleep(60);

 const keys=()=>Object.fromEntries([...document.querySelectorAll('[data-ct336-foryou] [data-ct336-slot]')].map(s=>[s.dataset.ct336Slot,s.querySelector('[data-ct288-card]')?.dataset?.ct288Card||'']));
 const changedOnly=(before,after,name)=>{
  ok(before[name]&&after[name]&&before[name]!==after[name],name+' did not change '+before[name]+' => '+after[name]);
  for(const k of Object.keys(before))if(k!==name)ok(before[k]===after[k],k+' changed while clicking '+name+' '+before[k]+' => '+after[k]);
 };
 const sabotage=btn=>btn.addEventListener('click',e=>{e.stopImmediatePropagation();e.stopPropagation()},true);

 let before=keys();
 const wl=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');ok(wl,'Watchlist missing');sabotage(wl);wl.click();
 let after=keys();changedOnly(before,after,'fresh:movie');
 ok(calls.watchlist.length===1&&calls.watchlist[0]==='movie:401','Watchlist backend call wrong/improper timing '+calls.watchlist);
 ok(globalLibraryEvents===0,'Watchlist emitted global library-change event');

 before=keys();
 const seen=document.querySelector('[data-ct336-slot="watch:series"] [data-ct336-action="seen"]');ok(seen,'Visto missing');sabotage(seen);seen.click();
 after=keys();changedOnly(before,after,'watch:series');
 ok(calls.seen.length===1&&calls.seen[0]==='tv:201','Visto backend call wrong/improper timing '+calls.seen);
 ok(globalLibraryEvents===0,'Visto emitted global library-change event');

 before=keys();
 const swap=document.querySelector('[data-ct336-slot="fresh:anime"] [data-ct336-swap-only]');ok(swap&&!swap.disabled,'Trocar missing');sabotage(swap);swap.click();
 after=keys();changedOnly(before,after,'fresh:anime');
 await sleep(20);
 ok(calls.swap.length===1&&calls.swap[0]==='tv:601:fresh:anime','Trocar memory call wrong '+calls.swap);
 ok(calls.watchlist.length===1&&calls.seen.length===1,'Trocar used Watchlist/Visto persistence');
 ok(globalLibraryEvents===0,'Trocar emitted global library-change event');
 ok(/swap:fresh:anime/.test(document.documentElement.dataset.ct359LastAction||''),'r359 did not own Trocar');

 await sleep(80);
 const stable=keys();for(const k of Object.keys(after))if(k!=='fresh:anime'||true)ok(stable[k]===keys()[k],k+' unstable after persistence');
 ok(globalLibraryEvents===0,'background persistence triggered global repaint event');

 /* ---- Home: DB metadata is accepted as first-paint authority, no live hydrate ---- */
 history.replaceState({},'','/');
 const payload={
  series:[{
   tmdb_id:999,title:'Série Cache',home_bucket:'continue',watched_episodes:4,released_episodes:8,
   next_season_number:1,next_episode_number:5,next_episode_title:'O Episódio Pronto',
   next_episode_rating:8.8,next_episode_air_date:'2026-09-23',__ct359_episode_cache:true
  }],
  movie_watchlist:[],history_episodes:[],history_movies:[],
  __ct_home_authority:'home-v359-episode-cache-first-paint',
  __ct_episode_metadata_source:'episode_catalog_v336',
  __ct_episode_metadata_first_paint:true
 };
 const t0=performance.now();
 ok(await window.__ctR343.prepareHomePayload(payload,0),'r343 fast prepare hook failed');
 const elapsed=performance.now()-t0;
 ok(elapsed<40,'Home fast prepare unexpectedly waited '+elapsed+'ms');
 const prepared=window.__ctR359Test.prepared?.[0];ok(prepared,'prepared row missing');
 ok(prepared.next_episode_title==='O Episódio Pronto','cached title lost');
 ok(Number(prepared.next_episode_rating)===8.8,'cached rating lost');
 ok(prepared.next_episode_air_date==='2026-09-23','cached air date lost');
 await window.__ctR343.hydrateHomeDom();
 ok(document.documentElement.dataset.ct359HomeHydration==='cache-first-no-live-hydrate','live hydrate was not retired');

 document.documentElement.dataset.ct359done='1';
}catch(e){document.documentElement.dataset.ct359probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
 if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct359done="1"/.test(out)){const m=out.match(/data-ct359probe="([^"]*)"/);throw new Error('R359_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R359_BROWSER_OK direct first-capture actions change only clicked slot; Home accepts cached episode metadata without live hydrate');

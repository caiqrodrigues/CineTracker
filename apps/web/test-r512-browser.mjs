import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r512.mjs');
const runtime=await readFile(resolve('runtime-r512-special-series.js'),'utf8');
const css=await readFile(resolve('dist/app-v512.css'),'utf8');
const fixtures={
 currentUfc:{series:{series_key:'ufc',title:'UFC',season:2026,poster_url:'',watched_episodes:11,released_episodes:11,available_episodes:0,home_bucket:'up_to_date'},seasons:[2026,1993],events:[]},
 currentF1:{series:{series_key:'formula_1',title:'Fórmula 1',season:2026,poster_url:'',watched_episodes:84,released_episodes:85,available_episodes:1,home_bucket:'continue',next_episode_title:'Singapore GP'},seasons:[2026,1950],events:[]},
 f11950:{series:{series_key:'formula_1',title:'Fórmula 1',season:1950,mapped:false,watched_episodes:1,released_episodes:0,available_episodes:0,home_bucket:'up_to_date'},seasons:[2026,1950],historical_watched_rounds:[1],events:[]},
 ufc1993:{series:{series_key:'ufc',title:'UFC',season:1993,watched_episodes:1,released_episodes:1,total_episodes:1,home_bucket:'up_to_date'},seasons:[2026,1993],events:[{source:'movie',legacy_media_id:790,tmdb_id:375876,title:'UFC 1: The Beginning',season:1993,episode_number:100790,event_kind:'PPV',starts_at:'1993-11-12T02:00:00Z',runtime_minutes:88,released:true,is_watched:true}]}
};
const prelude=[
 "let currentRoute='home';window.__writes=[];window.__fx="+JSON.stringify(fixtures)+";",
 "window.__ctCoreR471={",
 "route:()=>currentRoute,",
 "rpc:async(name,args={})=>{",
 " if(name==='cinetracker_ufc_series_v512')return Number(args.p_season)===1993?window.__fx.ufc1993:window.__fx.currentUfc;",
 " if(name==='cinetracker_f1_series_v512')return Number(args.p_season)===1950?window.__fx.f11950:window.__fx.currentF1;",
 " if(name==='cinetracker_ufc_tmdb_status_v512')return [{tmdb_id:375876,legacy_media_id:790,episode_number:100790,is_watched:true},{tmdb_id:999002,legacy_media_id:null,episode_number:2999002,is_watched:false}];",
 " if(name.includes('watch_v512')||name==='cinetracker_f1_watch_sync_v462'){window.__writes.push({name,args});return {ok:true}}",
 " throw new Error('unexpected '+name)",
 "},",
 "tmdb:async(path,args)=>({page:1,total_pages:1,results:Number(args.primary_release_year)===1993?[{id:375876,title:'UFC 1: The Beginning',release_date:'1993-11-12',poster_path:'/u1.jpg'},{id:999002,title:'UFC 2: No Way Out',release_date:'1994-03-11',poster_path:'/u2.jpg'}]:[]}),",
 "edge:async(slug,body)=>({season:Number(body.season),races:[{round:'1',raceName:'British Grand Prix',date:'1950-05-13',time:'14:00:00Z'},{round:'2',raceName:'Monaco Grand Prix',date:'1950-05-21',time:'14:00:00Z'}]})",
 "};"
].join('\n');
const probe=[
 "(async()=>{",
 " const ok=(v,m)=>{if(!v)throw new Error(m)},wait=ms=>new Promise(r=>setTimeout(r,ms));",
 " try{",
 "  await wait(100);",
 "  ok(document.querySelector('[data-ct512-special=\"f1\"]'),'F1 missing initial');",
 "  ok(document.querySelector('[data-ct512-special=\"ufc\"]'),'UFC missing initial');",
 "  document.querySelectorAll('[data-ct512-special]').forEach(x=>x.remove());",
 "  document.querySelector('[data-home-tab=\"series\"]').click();await wait(50);",
 "  ok(document.querySelector('[data-ct512-special=\"f1\"]')&&document.querySelector('[data-ct512-special=\"ufc\"]'),'special rows did not remount');",
 "  const list=document.querySelector('.ct512-movie-list'),row=list.querySelector('.ct512-movie-watch-row'),lr=list.getBoundingClientRect(),rr=row.getBoundingClientRect();",
 "  ok(getComputedStyle(list).flexDirection==='column','movie list not column');",
 "  ok(rr.width>500&&rr.height<120&&Math.abs(lr.width-rr.width)<2,'movie Watchlist still poster-card geometry '+rr.width+'x'+rr.height);",
 "  document.querySelector('[data-ct512-open=\"f1\"]').click();await wait(20);",
 "  const fs=document.querySelector('[data-ct512-season]');fs.value='1950';fs.dispatchEvent(new Event('change',{bubbles:true}));await wait(120);",
 "  ok(document.querySelectorAll('[data-ct512-watch=\"f1\"]').length===2,'F1 1950 races not loaded');",
 "  ok(document.querySelector('.ct512-dialog').textContent.includes('British Grand Prix'),'F1 first historical season missing');",
 "  const fbtn=[...document.querySelectorAll('[data-ct512-watch=\"f1\"]')].find(x=>x.dataset.round==='2');fbtn.click();await wait(40);",
 "  ok(window.__writes.some(x=>x.name==='cinetracker_f1_historical_watch_v512'),'historical F1 writer not used');",
 "  document.querySelector('[data-ct512-close]').click();document.querySelector('[data-ct512-open=\"ufc\"]').click();await wait(20);",
 "  const us=document.querySelector('[data-ct512-season]');us.value='1993';us.dispatchEvent(new Event('change',{bubbles:true}));await wait(120);",
 "  ok(document.querySelector('.ct512-dialog').textContent.includes('UFC 1: The Beginning'),'UFC 1 missing');",
 "  ok(document.querySelector('[data-ct512-watch=\"ufc\"][data-watched=\"1\"]'),'legacy UFC 1 not recognized watched');",
 "  document.documentElement.dataset.ct512browser='ok';",
 " }catch(e){document.documentElement.dataset.ct512browser='fail:'+String(e?.stack||e)}",
 "})();"
].join('\n');
const html='<!doctype html><html><head><style>'+css+'</style></head><body><div data-home><div class="home-tabs"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="series"><section class="home-section"><div class="panel-head"><h3>Continuar assistindo</h3><small>0</small></div><div class="stack"><div class="empty">Nenhum item.</div></div></section><section class="home-section"><div class="panel-head"><h3>Em dia</h3><small>0</small></div><div class="stack"><div class="empty">Nenhum item.</div></div></section></div><div data-home-view="movies"><section data-ct388-movie-watch><div class="ct388-movie-stack ct512-movie-list"><div class="media-row ct274-media-card ct512-movie-watch-row"><div class="thumb"></div><div><b>Filme</b><small>2026 · 100 min</small></div><span class="badge">›</span></div></div></section></div></div><script src="/prelude.js"></script><script src="/runtime.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/runtime.js',{type:'application/javascript',body:runtime}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const a=assets.get(new URL(req.url,'http://x').pathname);if(!a){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':a.type,'cache-control':'no-store'});res.end(a.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=3000','--window-size=1280,900','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const kill=setTimeout(()=>child.kill('SIGTERM'),30000);const code=await new Promise(r=>child.on('close',r));clearTimeout(kill);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));const m=out.match(/data-ct512browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R512_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R512_BROWSER_OK movie rows + stable UFC/F1 historical seasons');

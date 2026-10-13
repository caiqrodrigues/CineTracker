import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r511.mjs');
const runtime=await readFile(resolve('runtime-r511-f1-series.js'),'utf8');
const now=Date.now();
const payload={series:{series_key:'formula_1',media_id:865,title:'Fórmula 1',season:2026,poster_url:'https://example.test/f1.png',total_episodes:4,released_episodes:3,watched_episodes:1,available_episodes:2,home_bucket:'continue',next_episode_number:84,next_episode_title:'Singapore Grand Prix (Qualifying)',next_episode_air_date:new Date(now-2*3600000).toISOString(),upcoming_episode_number:86,upcoming_episode_title:'United States Grand Prix (Practice 1)',upcoming_episode_air_date:new Date(now+86400000).toISOString()},events:[
 {event_id:41980,provider_event_id:'f1:2026:17:race',title:'Singapore Grand Prix (Race)',season:2026,episode_number:85,round:17,session_kind:'race',starts_at:new Date(now-3600000).toISOString(),runtime_minutes:120,released:true,is_watched:false},
 {event_id:42173,provider_event_id:'f1:2026:17:qualifying',title:'Singapore Grand Prix (Qualifying)',season:2026,episode_number:84,round:17,session_kind:'qualifying',starts_at:new Date(now-2*3600000).toISOString(),runtime_minutes:60,released:true,is_watched:false},
 {event_id:42259,provider_event_id:'f1:2026:17:sprint',title:'Singapore Grand Prix (Sprint Race)',season:2026,episode_number:83,round:17,session_kind:'sprint',starts_at:new Date(now-3*3600000).toISOString(),runtime_minutes:60,released:true,is_watched:true},
 {event_id:null,provider_event_id:'f1:2026:18:fp1',title:'United States Grand Prix (Practice 1)',season:2026,episode_number:86,round:18,session_kind:'fp1',starts_at:new Date(now+86400000).toISOString(),runtime_minutes:60,released:false,is_watched:false}
]};
const prelude=[
 "let currentRoute='home';const calls=[];",
 "window.__ctCoreR471={route:()=>currentRoute,rpc:async(name,args)=>{calls.push([name,args]);if(name==='cinetracker_f1_series_v511')return "+JSON.stringify(payload)+";if(name==='cinetracker_f1_watch_sync_v462')return {ok:true};throw new Error(name)}};",
 "window.__calls=calls;"
].join('\n');
const probe=[
 "(async()=>{",
 "const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));",
 "try{",
 "await sleep(150);let card=document.querySelector('[data-ct511-f1-series]');ok(card,'F1 card missing');ok(card.closest('section').querySelector('h3').textContent==='Continuar assistindo','wrong bucket');",
 "const home=document.querySelector('[data-home-view=\"series\"]');ok([...home.querySelectorAll('.media-row')].filter(x=>x.querySelector('b')?.textContent.trim()==='Formula 1').length===0,'legacy F1 row survived');",
 "ok([...home.querySelectorAll('.media-row')].filter(x=>x.querySelector('b')?.textContent.trim()==='Fórmula 1').length===1,'duplicate F1 row');",
 "card.click();await sleep(20);ok(document.querySelectorAll('.ct511-f1-event').length===4,'event list');ok(document.body.textContent.includes('Classificação'),'qualifying label');ok(document.body.textContent.includes('Corrida'),'race label');",
 "document.querySelector('[data-ct511-f1-watch=\"2026:84\"]').click();await sleep(40);ok(window.__calls.some(x=>x[0]==='cinetracker_f1_watch_sync_v462'&&x[1]?.p_season===2026&&x[1]?.p_episode===84&&x[1]?.p_watched===true),'episode 84 write');",
 "document.querySelector('[data-ct511-f1-watch=\"2026:85\"]').click();await sleep(40);ok(window.__calls.some(x=>x[0]==='cinetracker_f1_watch_sync_v462'&&x[1]?.p_episode===85&&x[1]?.p_source==='series-r511'),'episode 85 write');",
 "card=document.querySelector('[data-ct511-f1-series]');ok(card.closest('section').querySelector('h3').textContent==='Em dia','did not move to Em dia');",
 "ok(!window.__calls.some(x=>x[0]==='cinetracker_sport_mark_watched_v1'),'wrong direct sports writer');document.documentElement.dataset.ct511browser='ok';",
 "}catch(e){document.documentElement.dataset.ct511browser='fail:'+String(e?.stack||e)}})();"
].join('\n');
const html='<!doctype html><html><head><style>.media-row{display:flex}.hidden{display:none}</style></head><body><div data-home><div data-home-view="series"><section class="home-section" data-ct388-series-section><div class="panel-head"><h3>Continuar assistindo</h3><small>2</small></div><div class="stack"></div></section><section class="home-section" data-ct388-series-section><div class="panel-head"><h3>Em dia</h3><small>5</small></div><div class="stack"><div class="media-row ct274-media-card"><div class="ct274-row-left"><div class="ct274-row-copy"><b>Formula 1</b><small>legacy</small></div></div></div></div></section></div></div><script src="/prelude.js"></script><script src="/runtime.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/runtime.js',{type:'application/javascript',body:runtime}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type,'cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';
for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=2500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},30000),code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const state=out.match(/data-ct511browser="([^"]*)"/)?.[1]||'';if(state!=='ok')throw new Error('R511_BROWSER '+state+' DOM='+out.slice(-6000));
console.log('R511_BROWSER_OK F1 special series + r462 sync');
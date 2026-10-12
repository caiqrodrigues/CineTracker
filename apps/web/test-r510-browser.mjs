import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r510.mjs');
const runtime=await readFile(resolve('runtime-r510-ufc-series.js'),'utf8');
const payload={series:{series_key:'ufc',title:'UFC',season:2026,poster_url:'https://example.test/ufc.png',total_episodes:4,released_episodes:3,watched_episodes:1,available_episodes:2,home_bucket:'continue',next_episode_number:3,next_episode_title:'UFC Fight Night 290',next_episode_air_date:new Date(Date.now()-3600000).toISOString(),upcoming_episode_number:4,upcoming_episode_title:'UFC Fight Night 291',upcoming_episode_air_date:new Date(Date.now()+86400000).toISOString()},events:[
 {event_id:3,title:'UFC Fight Night 290',season:2026,episode_number:3,event_kind:'Fight Night',starts_at:new Date(Date.now()-3600000).toISOString(),released:true,is_watched:false},
 {event_id:2,title:'UFC 332 Silva vs Wang',season:2026,episode_number:2,event_kind:'PPV',starts_at:new Date(Date.now()-2*86400000).toISOString(),released:true,is_watched:false},
 {event_id:1,title:'UFC Fight Night 289',season:2026,episode_number:1,event_kind:'Fight Night',starts_at:new Date(Date.now()-8*86400000).toISOString(),released:true,is_watched:true},
 {event_id:4,title:'UFC Fight Night 291',season:2026,episode_number:4,event_kind:'Fight Night',starts_at:new Date(Date.now()+86400000).toISOString(),released:false,is_watched:false}
]};
const prelude=[
 "let currentRoute='home';const calls=[];",
 "window.__ctCoreR471={route:()=>currentRoute,rpc:async(name,args)=>{calls.push([name,args]);if(name==='cinetracker_ufc_series_v510')return "+JSON.stringify(payload)+";if(name==='cinetracker_sport_mark_watched_v1')return {ok:true};throw new Error(name)}};",
 "window.__calls=calls;"
].join('\n');
const probe=[
 "(async()=>{",
 "const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));",
 "try{",
 "await sleep(120);let card=document.querySelector('[data-ct510-ufc-series]');ok(card,'UFC card missing');ok(card.closest('section').querySelector('h3').textContent==='Continuar assistindo','wrong bucket');",
 "card.click();await sleep(20);ok(document.querySelectorAll('.ct510-ufc-event').length===4,'event list');ok(document.body.textContent.includes('UFC 332 Silva vs Wang'),'PPV missing');ok(document.body.textContent.includes('UFC Fight Night 290'),'Fight Night missing');",
 "document.querySelector('[data-ct510-ufc-watch=\"3\"]').click();await sleep(30);ok(window.__calls.some(x=>x[0]==='cinetracker_sport_mark_watched_v1'&&Number(x[1]?.p_event_id)===3&&x[1]?.p_watched===true),'event 3 write');",
 "document.querySelector('[data-ct510-ufc-watch=\"2\"]').click();await sleep(30);ok(window.__calls.some(x=>x[0]==='cinetracker_sport_mark_watched_v1'&&Number(x[1]?.p_event_id)===2&&x[1]?.p_watched===true),'event 2 write');",
 "card=document.querySelector('[data-ct510-ufc-series]');ok(card.closest('section').querySelector('h3').textContent==='Em dia','did not move to Em dia');",
 "ok(window.__calls.filter(x=>x[0]==='cinetracker_sport_mark_watched_v1').every(x=>!('p_media_id' in x[1])),'duplicate media write');document.documentElement.dataset.ct510browser='ok';",
 "}catch(e){document.documentElement.dataset.ct510browser='fail:'+String(e?.stack||e)}})();"
].join('\n');
const html='<!doctype html><html><head><style>.media-row{display:flex}.hidden{display:none}</style></head><body><div data-home><div data-home-view="series"><section class="home-section" data-ct388-series-section><div class="panel-head"><h3>Continuar assistindo</h3><small>2</small></div><div class="stack"></div></section><section class="home-section" data-ct388-series-section><div class="panel-head"><h3>Em dia</h3><small>4</small></div><div class="stack"></div></section></div></div><script src="/prelude.js"></script><script src="/runtime.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/runtime.js',{type:'application/javascript',body:runtime}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type,'cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';
for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=2000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},30000),code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const state=out.match(/data-ct510browser="([^"]*)"/)?.[1]||'';if(state!=='ok')throw new Error('R510_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R510_BROWSER_OK UFC series + optimistic Sports sync');

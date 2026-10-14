import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r524.mjs');
const [js,css]=await Promise.all([readFile(resolve('dist/app-v524.js'),'utf8'),readFile(resolve('dist/app-v524.css'),'utf8')]);
const header='/* CineTracker Web 0.3.51 r524 — final direct opener for F1/UFC/WWE special series. */';
const marker="window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate';",hs=js.indexOf(header),mi=js.indexOf(marker,hs),me=js.indexOf('\n})();',mi);
if(hs<0||mi<0||me<0)throw new Error('r524 opener missing');const opener=js.slice(hs,me+6);
const prelude=`
let opened=[];
window.__ctCoreR471={route:()=> 'series'};
window.__ctR513SeriesScreen={open:async(type)=>{opened.push(type);document.documentElement.dataset.opened=type;return true}};
`;
const probe=`
(async()=>{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 try{
  const search=document.querySelector('.search-global'),tabs=document.querySelector('.home-tabs'),ss=getComputedStyle(search),ts=getComputedStyle(tabs);
  ok(ss.position==='sticky','search not sticky '+ss.position);ok(ts.position==='fixed','tabs not fixed '+ts.position);
  const sr=search.getBoundingClientRect(),tr=tabs.getBoundingClientRect();ok(Math.abs(sr.top-tr.top)<3,'controls not same row '+sr.top+'/'+tr.top);ok(sr.left>=tr.right+4,'search not beside tabs '+sr.left+'/'+tr.right);
  const card=document.querySelector('[data-ct512-special="ufc"]');card.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'mouse'}));await sleep(30);
  ok(document.documentElement.dataset.opened==='ufc','special did not open');ok(opened.length===1,'special opened duplicate '+opened.length);
  document.documentElement.dataset.ct524browser='ok';
 }catch(e){document.documentElement.dataset.ct524browser='fail:'+String(e?.stack||e)}
})();
`;
const html='<!doctype html><html><head><style>'+css+'.app{margin-left:164px;width:1000px}.search-global{height:42px}.home-tabs{height:42px}.home-tabs button{height:36px;width:50px}</style></head><body><div class="app" data-page="home"><main><div class="search-global"><input></div><div data-home><div class="home-tabs"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="series"><div class="media-row ct512-special-card" data-ct512-special="ufc" role="button">UFC</div></div></div></main></div><script src="/prelude.js"></script><script src="/opener.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/opener.js',{type:'application/javascript',body:opener}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type+'; charset=utf-8','cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=800','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},30000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));const m=out.match(/data-ct524browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R524_BROWSER '+state+' DOM='+out.slice(-4500));console.log('R524_BROWSER_OK same-row-sticky+direct-special-open');

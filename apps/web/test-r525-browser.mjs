import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r525.mjs');
const [js,css,runtime]=await Promise.all([readFile(resolve('dist/app-v525.js'),'utf8'),readFile(resolve('dist/app-v525.css'),'utf8'),readFile(resolve('runtime-r525-final.js'),'utf8')]);
const marker="window.__ctR525Marker='one-shot-home-anchor+fixed-toolbar+movies-2x3+filter-v525+top10-10x10+special-db-first+sports-team-canonical'";
if(!js.includes(marker))throw new Error('r525 bundle marker missing');
const prelude=`
window.onerror=(m,s,l,c)=>{document.documentElement.dataset.ct525browser='error:'+String(m)+'@'+l+':'+c};\nwindow.__ctCoreR471={route:()=> 'home'};
window.__ctR464={load:async(force)=>{document.documentElement.dataset.retry=String(!!force);return true}};
window.__ctR388={renderMoviesAll:()=>{document.documentElement.dataset.movieRender='1';return true}};
`;
const probe=`
(async()=>{const ok=(v,m)=>{if(!v)throw new Error(m)};try{
 window.__ctR525.layoutHome();
 const search=document.querySelector('.search-global'),tabs=document.querySelector('.home-tabs'),home=document.querySelector('[data-home]'),ss=getComputedStyle(search),ts=getComputedStyle(tabs),sr=search.getBoundingClientRect(),tr=tabs.getBoundingClientRect();
 ok(ss.position==='fixed','search '+ss.position);ok(ts.position==='fixed','tabs '+ts.position);ok(Math.abs(sr.top-tr.top)<3,'row top');ok(sr.left>=tr.right+4,'search beside tabs');ok(parseFloat(getComputedStyle(home).paddingTop)>=50,'reserved toolbar');
 const rail=document.querySelector('.ct525-movie-rail'),card=rail.querySelector('.ct514-movie-card'),poster=card.querySelector('.poster'),rs=getComputedStyle(rail),cr=card.getBoundingClientRect(),pr=poster.getBoundingClientRect();
 ok(rs.display==='flex'&&rs.flexDirection==='row'&&rs.flexWrap==='nowrap','movie rail');ok(Math.abs(cr.height/cr.width-1.5)<.03,'card 2:3 '+cr.width+'x'+cr.height);ok(Math.abs(pr.height/pr.width-1.5)<.03,'poster 2:3');
 document.querySelector('[data-ct490-foryou-retry]').click();ok(document.documentElement.dataset.retry==='true','retry');
 document.querySelector('[data-home-tab="movies"]').click();ok(document.documentElement.dataset.movieRender==='1','movie owner after tab');
 document.documentElement.dataset.ct525browser='ok';
 }catch(e){document.documentElement.dataset.ct525browser='fail:'+String(e?.stack||e)}})();
`;
const html='<!doctype html><html><head><style>'+css+'.app{margin-left:164px;width:1000px}.content{width:1000px}.search-global{height:42px}.home-tabs{height:42px}.home-tabs button{height:36px;width:50px}.ct514-movie-card{width:176px;height:264px}.poster{display:block;width:176px;height:264px}</style></head><body><div class="app" data-page="home"><main class="content"><div class="search-global"><input></div><div data-global-results></div><div data-home><div class="home-tabs"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="movies"><div class="ct388-movie-stack ct514-movie-rail ct525-movie-rail"><article class="ct514-movie-card"><div class="poster"></div></article></div></div></div></main></div><button data-ct490-foryou-retry>retry</button><script src="/prelude.js"></script><script src="/runtime.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/runtime.js',{type:'application/javascript',body:runtime}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type+'; charset=utf-8','cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';for(const x of['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1200','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},30000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct525browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R525_BROWSER '+state+' DOM='+out.slice(-5000));console.log('R525_BROWSER_OK toolbar+movie-2x3+retry');

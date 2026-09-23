import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r346.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v346.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar" style="width:136px"></aside><main class="content ct345-search-row" style="display:grid;grid-template-columns:34px minmax(0,1fr);column-gap:8px;width:100%"><div class="search-global"><span>⌕</span><input type="search" data-global-search placeholder="Buscar filmes, séries, episódios e atores..."><span>×</span></div><header class="header"><div><h1>Descobrir</h1></div></header><div class="page" data-discover><div data-ct318-filter>☷</div><div data-ct318-types><button>Todos</button></div><div data-ct336-filters><button>Filmes</button></div><div data-ct319-content></div></div></main></div>';
 window.__ctR346.settle();await sleep(80);
 const content=document.querySelector('.content'),row=document.querySelector('.ct346-search-row'),search=document.querySelector('.search-global'),back=document.querySelector('[data-ct346-back]');
 ok(content&&row&&search&&back,'header pieces missing');
 ok(!content.classList.contains('ct345-search-row'),'broken r345 class remains on content');
 ok(getComputedStyle(content).display==='block','content still grid: '+getComputedStyle(content).display);
 ok(row.parentElement===content,'search row not direct content child');
 ok(search.parentElement===row,'search not isolated inside dedicated row');
 const rr=row.getBoundingClientRect(),sr=search.getBoundingClientRect(),br=back.getBoundingClientRect();
 ok(br.right<=sr.left+1,'back is not left of search');
 ok(Math.abs(br.top-sr.top)<=4,'back/search not same row');
 ok(rr.width>700,'search row collapsed '+rr.width);
 ok(!document.querySelector('[data-ct318-filter],[data-ct318-types],[data-ct336-filters]'),'filters remain');
 ok(![...document.querySelectorAll('button,a')].some(x=>/voltar/i.test(x.textContent)),'textual Voltar remains');

 /* A Home-like page must keep its body full-width rather than become the second grid column. */
 history.replaceState({},'','/');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar" style="width:136px"></aside><main class="content ct345-search-row" style="display:grid;grid-template-columns:34px minmax(0,1fr)"><div class="search-global"><span>⌕</span><input type="search" placeholder="Buscar filmes, séries, episódios e atores..."></div><div class="page" data-home><section class="panel" style="width:100%">HOME FULL WIDTH</section></div></main></div>';
 window.__ctR346.settle();await sleep(80);
 const hc=document.querySelector('.content'),hp=document.querySelector('[data-home]'),hs=document.querySelector('.search-global');
 ok(getComputedStyle(hc).display==='block','Home content still grid');
 ok(hp.getBoundingClientRect().width>=hc.getBoundingClientRect().width-2,'Home squeezed '+hp.getBoundingClientRect().width+'/'+hc.getBoundingClientRect().width);
 ok(hs.getBoundingClientRect().width>700,'Home search collapsed');
 ok(!document.querySelector('[data-ct346-back]'),'root Home should not show back');

 document.documentElement.dataset.ct346done='1';
}catch(e){document.documentElement.dataset.ct346probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1600)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1365,768','--virtual-time-budget=14000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1500));
if(!/data-ct346done="1"/.test(out)){const m=out.match(/data-ct346probe="([^"]*)"/);throw new Error('R346_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R346_BROWSER_OK content restored full-width; search/back isolated; Discover filters absent');

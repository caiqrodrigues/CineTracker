import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
if(process.env.CT_R366_SKIP_BUILD!=='1')await import('./build-r366.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const runtime=await readFile(resolve('runtime-r366-foryou-authoritative-actions.js'),'utf8');
const html=`<!doctype html><html><body><form id="f"><div data-ct319-content><div data-ct336-foryou>
<div data-ct336-slot="daily"><div class="ct336-cardwrap"><article data-ct288-card="movie:1"></article></div><div class="ct336-actions"><button data-ct336-action="watchlist">+ Watchlist</button><button data-ct336-action="seen">✓ Visto</button></div></div>
<div data-ct336-slot="watch:movie"><div class="ct336-cardwrap"><article data-ct288-card="movie:2"></article></div><div class="ct336-actions"><button data-ct336-action="seen">✓ Visto</button></div></div>
<div data-ct336-slot="fresh:movie"><div class="ct336-cardwrap"><article data-ct288-card="movie:3"></article></div><div class="ct336-actions"><button data-ct336-action="watchlist">+ Watchlist</button><button data-ct336-action="seen">✓ Visto</button></div></div>
</div></div></form><script>
window.route=()=> 'discover';window.__submitCount=0;document.querySelector('#f').addEventListener('submit',e=>{e.preventDefault();window.__submitCount++});
const ids={daily:1,'watch:movie':2,'fresh:movie':3};window.__ctR363={handle(m){ids[m.name]+=10;document.querySelector('[data-ct336-slot="'+m.name+'"] [data-ct288-card]').dataset.ct288Card=(m.name==='watch:movie'||m.name==='daily'||m.name==='fresh:movie'?'movie:':'movie:')+ids[m.name];return true}};
window.__ctR365={handle(m){ids[m.name]+=10;document.querySelector('[data-ct336-slot="'+m.name+'"] [data-ct288-card]').dataset.ct288Card='movie:'+ids[m.name];return true}};
window.addEventListener('click',e=>{try{const h=window.__ctR358Early;if(typeof h==='function'&&h(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true);
</script><script>${runtime.replaceAll('</script>','<\\/script>')}</script><script>(async()=>{try{
const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));window.__ctR366.forceAll();
const daily=document.querySelector('[data-ct336-slot="daily"] .ct336-actions');ok(daily.querySelectorAll(':scope>button').length===3,'daily must have 3 buttons');ok(!!daily.querySelector('[data-ct336-swap-only]'),'daily Trocar missing');ok(!daily.querySelector('[data-ct336-swap-only]').disabled,'daily Trocar disabled');
const watch=document.querySelector('[data-ct336-slot="watch:movie"] .ct336-actions');ok(watch.querySelectorAll(':scope>button').length===2,'watch must have 2 buttons');ok(!!watch.querySelector('[data-ct336-swap-only]'),'watch Trocar missing');
const fresh=document.querySelector('[data-ct336-slot="fresh:movie"] .ct336-actions');ok(fresh.querySelectorAll(':scope>button').length===3,'fresh must have 3 buttons');ok(!!fresh.querySelector('[data-ct336-swap-only]'),'fresh Trocar missing');
const before=document.querySelector('[data-ct336-slot="daily"] [data-ct288-card]').dataset.ct288Card;daily.querySelector('[data-ct336-swap-only]').click();await sleep(20);const after=document.querySelector('[data-ct336-slot="daily"] [data-ct288-card]').dataset.ct288Card;ok(before!==after,'daily Trocar did not swap');ok(window.__submitCount===0,'buttons submitted form');document.documentElement.dataset.ct366done='1';
}catch(e){document.documentElement.dataset.ct366probe='fail:'+String(e?.message||e)}})();</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1200','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGKILL')}catch{}},8000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));if(!/data-ct366done="1"/.test(out)){const m=out.match(/data-ct366probe="([^"]*)"/);throw new Error('R366_BROWSER '+(m?.[1]||'probe did not finish'))}console.log('R366_BROWSER_OK daily/watch/fresh action rows + local Trocar');

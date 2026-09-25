import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

if(process.env.CT_R365_SKIP_BUILD!=='1')await import('./build-r365.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const runtime=await readFile(resolve('runtime-r365-discover-speed-foryou-actions.js'),'utf8');
const html=`<!doctype html><html><body>
<form id="f"><div data-ct336-foryou>
 <div data-ct336-slot="fresh:movie"><div class="ct336-cardwrap"><article data-ct288-card="movie:1"></article></div><div class="ct336-actions"><button data-ct336-action="watchlist">+ Watchlist</button><button data-ct336-action="seen">✓ Visto</button><button data-ct336-swap-only="fresh:movie">↻ Trocar</button></div></div>
 <div data-ct336-slot="fresh:series"><div class="ct336-cardwrap"><article data-ct288-card="tv:2"></article></div><div class="ct336-actions"><button data-ct336-action="watchlist">+ Watchlist</button><button data-ct336-action="seen">✓ Visto</button><button data-ct336-swap-only="fresh:series">↻ Trocar</button></div></div>
</div></form>
<script>
window.route=()=> 'discover';window.__submitCount=0;document.querySelector('#f').addEventListener('submit',e=>{e.preventDefault();window.__submitCount++});
const cards={'fresh:movie':['movie:1','movie:11','movie:12'],'fresh:series':['tv:2','tv:21','tv:22']},idx={'fresh:movie':0,'fresh:series':0};
const paint=name=>{const slot=document.querySelector('[data-ct336-slot="'+name+'"]');slot.querySelector('[data-ct288-card]').dataset.ct288Card=cards[name][idx[name]];return true};
window.__ctR359Test={mutate359(action,key,name){const before={...idx};idx[name]=(idx[name]+1)%cards[name].length;return{before,next:{...idx}}}};
window.__ctR309Test={setForYouState(v){Object.assign(idx,v)}};
window.__ctR359={renderSlot:paint};
window.__ctR363={handle(m){if(m.action!=='swap')return false;idx[m.name]=(idx[m.name]+1)%cards[m.name].length;paint(m.name);return true},refill:async()=>0};
window.__ctR363Test={mutate:()=>({next:true})};window.__ctR319={personal:async()=>true};window.toast=()=>{};
window.addEventListener('click',e=>{try{const h=window.__ctR358Early;if(typeof h==='function'&&h(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true);
</script>
<script>${runtime.replaceAll('</script>','<\\/script>')}</script>
<script>
(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));const calls=[];
 window.__ctR365.setTestBridge({persist:async(a,k)=>{calls.push(a+':'+k);return true}});window.__ctR365.armAll();
 const key=n=>document.querySelector('[data-ct336-slot="'+n+'"] [data-ct288-card]').dataset.ct288Card;
 let a=key('fresh:movie'),b=key('fresh:series');
 document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="seen"]').click();await sleep(20);
 ok(key('fresh:movie')!==a,'seen did not replace clicked card');ok(key('fresh:series')===b,'seen changed other slot');
 a=key('fresh:movie');b=key('fresh:series');
 document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-action="watchlist"]').click();await sleep(20);
 ok(key('fresh:series')!==b,'watchlist did not replace clicked card');ok(key('fresh:movie')===a,'watchlist changed other slot');
 a=key('fresh:movie');b=key('fresh:series');
 document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-swap-only]').click();await sleep(10);
 ok(key('fresh:movie')!==a,'swap did not replace clicked card');ok(key('fresh:series')===b,'swap changed other slot');
 ok(window.__submitCount===0,'action submitted form / navigated');ok(calls.length===2,'persist call count '+calls.length);ok(window.__ctR365.clicks===3,'click count '+window.__ctR365.clicks);
 document.documentElement.dataset.ct365done='1';
}catch(e){document.documentElement.dataset.ct365probe='fail:'+String(e?.stack||e)}})();
</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1200','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGKILL')}catch{}},8000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));if(!/data-ct365done="1"/.test(out)){const m=out.match(/data-ct365probe="([^"]*)"/);throw new Error('R365_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R365_BROWSER_OK seen/watchlist/swap are clicked-slot-only and never submit the page');

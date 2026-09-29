import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

if(process.env.CT_R405_SKIP_BUILD!=='1')await import('./build-r405.mjs');
const app=await readFile(resolve('dist/app-v405.js'),'utf8');
for(const required of [
 "if(window.__ctR405?.loadMovies)return window.__ctR405.loadMovies(force)",
 "if(window.__ctR405?.loadForYou)return window.__ctR405.loadForYou(force)",
 "if(tab==='foryou'&&window.__ctR405?.loadForYou)",
 "if(window.__ctR405?.renderForYou)return window.__ctR405.renderForYou()"
])if(!app.includes(required))throw new Error('assembled closure bridge missing: '+required);

let bin='';
for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const bridge=(await readFile(resolve('runtime-r405-live-authority-bridge.js'),'utf8')).replaceAll('</script>','<\\/script>');

const slots=['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime'];
const html='<!doctype html><html><body><div id="movies"></div><div id="fy"></div><script>'+
'window.movieCalls=0;window.fyCalls=0;window.__ctR404={loadMovies:async()=>{movieCalls++;document.getElementById("movies").textContent="1381";return true},renderMovies:()=>true,enterHome:()=>true,loadForYou:async()=>{fyCalls++;return window.__ctR404.renderForYou()},renderForYou:()=>{const slots='+JSON.stringify(slots)+';document.getElementById("fy").innerHTML=slots.map((s,i)=>"<section data-slot=\\\""+s+"\\\"><button>✓ Visto</button>"+(s.indexOf("watch:")===0?"":"<button>+ Watchlist</button>")+"<button data-swap=\\\""+s+"\\\">↻ Trocar</button></section>").join("");return true},settle:()=>true};'+
'</script><script>'+bridge+'</script><script>'+
'Promise.all([window.__ctR405.loadMovies(false),window.__ctR405.loadForYou(false)]).then(()=>{try{if(movieCalls!==1)throw new Error("movie owner");if(fyCalls!==1)throw new Error("foryou owner");if(document.getElementById("movies").textContent!=="1381")throw new Error("movie render");if(document.querySelectorAll("[data-swap]").length!==7)throw new Error("Trocar count");document.documentElement.dataset.ct405probe="1"}catch(e){document.documentElement.dataset.ct405err=String(e.message||e)}});'+
'</script></body></html>';

const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));
await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));
if(!/data-ct405probe="1"/.test(out))throw new Error((out.match(/data-ct405err="([^"]*)"/)||[])[1]||'r405 probe failed');
console.log('R405_BROWSER_OK');

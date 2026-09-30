import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
if(process.env.CT_R411_SKIP_BUILD!=='1')await import('./build-r411.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const runtime=(await readFile(resolve('runtime-r411-discover-foryou-progressive.js'),'utf8')).replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><head><style>body{margin:0}[data-ct319-content]{min-height:800px}</style></head><body>
<button class="active" data-ct319-tab="foryou">Pra você</button><div data-ct319-content></div>
<script>
var currentRoute='discover',route=()=>currentRoute,session={access_token:'x'};
window.__ctR288R263={discover263:{tab:'foryou'}};
var ct288Card=x=>'<article data-media="'+(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id+'"><b>'+x.title+'</b></article>';
window.__ctR365={persistDirect:async()=>true};
var rpc=async(name,args)=>new Promise((resolve,reject)=>setTimeout(()=>{
 const base=args.p_kind==='movie'?100:args.p_kind==='series'?200:300;
 const type=args.p_kind==='movie'?'movie':'tv',kind=args.p_kind==='anime'?'anime':null;
 const m=(id,suffix)=>({media_type:type,media_kind:kind,tmdb_id:id,title:(name.includes('watch')?'W-':'F-')+args.p_kind+suffix});
 if(name==='cinetracker_discover_watch_unseen_v396'||name==='cinetracker_discover_fresh_v387')resolve([m(base+1,'-1'),m(base+2,'-2'),m(base+3,'-3')]);
 else reject(new Error(name));
},5200));
</script><script>${runtime}</script><script>
setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 await window.__ctR411.loadForYou(true);
 const root=document.querySelector('[data-ct411-foryou]');
 ok(root,'ForYou missing');
 ok(root.querySelectorAll('[data-ct411-action="swap"]').length===7,'Trocar missing after >4.5s responses');
 ok(root.querySelectorAll('[data-ct411-action]').length===18,'actions incomplete');
 ok([...root.querySelectorAll('[data-ct411-action]')].every(x=>!x.disabled&&x.getAttribute('aria-disabled')==='false'),'inactive/gray action state');
 const first=root.querySelector('[data-ct411-slot="fresh:movie"] [data-media]')?.getAttribute('data-media');
 root.querySelector('[data-ct411-slot="fresh:movie"] [data-ct411-action="swap"]')?.click();
 const second=document.querySelector('[data-ct411-slot="fresh:movie"] [data-media]')?.getAttribute('data-media');
 ok(first&&second&&first!==second,'Trocar did not replace the slot');
 ok(!document.body.innerText.includes('Não foi possível carregar as recomendações'),'failure state remained');
 document.documentElement.dataset.ct411probe='1';
}catch(e){document.documentElement.dataset.ct411err=String(e.message||e)}},100);
</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=9000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));
if(!/data-ct411probe="1"/.test(out))throw new Error((out.match(/data-ct411err="([^"]*)"/)||[])[1]||'r411 probe failed');
console.log('R411_BROWSER_OK delayed direct pools + 7 Trocar + 18 active actions');

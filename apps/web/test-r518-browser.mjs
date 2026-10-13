import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r518.mjs');
const [js,css]=await Promise.all([readFile(resolve('dist/app-v518.js'),'utf8'),readFile(resolve('dist/app-v518.css'),'utf8')]);
function functionText(source,name,anchor){
 const ai=source.indexOf(anchor);if(ai<0)throw new Error('anchor '+anchor);
 const start=source.lastIndexOf('(()=>{',ai),close=source.indexOf('\n})();',ai);if(start<0||close<0)throw new Error('bounds '+name);
 const region=source.slice(start,close+6),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('fn '+name);
 const open=region.indexOf('{',m.index+m[0].length);let d=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')d++;else if(c==='}'){d--;if(d===0){i++;break}}
 }
 if(d!==0)throw new Error('unbalanced '+name);return region.slice(m.index,i);
}
const A512="window.__ctR512Marker='r514-stable-historical-seasons+movie-2x3-rail+canonical-f1-sync';";
const cardHtml=functionText(js,'cardHtml',A512);
const prelude=[
 "const q=(s,r=document)=>r.querySelector(s),rows=v=>Array.isArray(v)?v:[],num=v=>Number(v)||0,esc=v=>String(v??'').replace(/[&<>\\\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\\"':'&quot;',\\\"'\\\":'&#39;'}[c]));",
 "const currentYear=()=>2026,fmt=v=>new Date(v).toLocaleString('pt-BR'),timeout=p=>Promise.resolve(p),tz=()=> 'America/Sao_Paulo';",
 "window.__ctR516SpecialSummary={get:key=>key==='f1'?{watched:87}:{watched:17}};",
].join('\n');
const probe=[
 "(async()=>{try{",
 "const ok=(v,m)=>{if(!v)throw new Error(m)};",
 "document.querySelector('#cards').innerHTML=cardHtml('f1',{series:{season:2026,watched_episodes:85,total_episodes:115,available_episodes:0,upcoming_episode_title:'United States Grand Prix (Practice 1)'}})+cardHtml('ufc',{series:{season:2026,watched_episodes:14,total_episodes:41,available_episodes:2,next_episode_title:'UFC Fight Night 290 Allen vs Duncan'}});",
 "const text=document.querySelector('#cards').textContent;",
 "ok(text.includes('87 sessões assistidas no total · T2026 · 85/115 sessões'),'F1 count '+text);",
 "ok(text.includes('17 eventos assistidos no total · T2026 · 14/41 eventos'),'UFC count '+text);",
 "ok(!text.includes('1.436')&&!text.includes('/162'),'bogus denominator '+text);",
 "const related=document.querySelector('.ct169-related-card'),buttons=[...related.querySelectorAll('.ct169-related-actions button')];",
 "ok(Math.round(related.getBoundingClientRect().width)===176,'related width '+related.getBoundingClientRect().width);",
 "for(const b of buttons)ok(b.scrollWidth<=b.clientWidth+1,'button clipped '+b.textContent+' '+b.scrollWidth+'/'+b.clientWidth);",,
 "document.documentElement.dataset.ct518browser='ok';",
 "}catch(e){document.documentElement.dataset.ct518browser='fail:'+String(e?.stack||e)}})();"
].join('\n');
const html='<!doctype html><html><head><link rel="stylesheet" href="/app.css"></head><body><div id="cards"></div><article class="ct169-related-card"><div class="ct169-related-poster"></div><div class="ct169-related-actions"><button>＋ Watchlist</button><button>✓ Visto</button></div></article><script src="/prelude.js"></script><script src="/functions.js"></script><script src="/probe.js"></script></body></html>';
const funcs=cardHtml;
const assets=new Map([['/',{t:'text/html; charset=utf-8',b:html}],['/app.css',{t:'text/css; charset=utf-8',b:css}],['/prelude.js',{t:'application/javascript; charset=utf-8',b:prelude}],['/functions.js',{t:'application/javascript; charset=utf-8',b:funcs}],['/probe.js',{t:'application/javascript; charset=utf-8',b:probe}]]);
const server=createServer((req,res)=>{const x=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!x){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':x.t,'cache-control':'no-store'});res.end(x.b)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1800','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},45000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const state=out.match(/data-ct518browser="([^"]*)"/)?.[1]||'';if(state!=='ok')throw new Error('R518_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R518_BROWSER_OK counts + related buttons');

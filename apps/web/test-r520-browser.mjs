import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r520.mjs');
const js=await readFile(resolve('dist/app-v520.js'),'utf8');
function functionText(source,name,anchor){
 const ai=source.indexOf(anchor);if(ai<0)throw new Error('anchor '+anchor);
 const start=source.lastIndexOf('(()=>{',ai),close=source.indexOf('\n})();',ai);if(start<0||close<0)throw new Error('bounds '+name);
 const region=source.slice(start,close+6),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('fn '+name);
 const open=region.indexOf('{',m.index+m[0].length);let d=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')d++;else if(c==='}'){d--;if(d===0){i++;break}}}
 if(d!==0)throw new Error('unbalanced '+name);return region.slice(m.index,i)
}
const A="window.__ctR512Marker='r520-f1+ufc+wwe-three-special-series'",cardHtml=functionText(js,'cardHtml',A),wweBrandKey=functionText(js,'wweBrandKey',A),dedupeWwe=functionText(js,'dedupeWwe',A);
const prelude=[
 "const esc=v=>String(v??'');",
 "const currentYear=()=>2026;",
 "const rows=v=>Array.isArray(v)?v:[];",
 "const norm=v=>String(v??'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();",
 "const wweBrands=[['greatest-royal-rumble',/greatest royal rumble/],['royal-rumble',/royal rumble/],['wrestlemania',/wrestlemania/]];",
 "window.__ctR516SpecialSummary={get:key=>key==='f1'?{watched:87}:key==='ufc'?{watched:17}:{watched:50}};"
].join('\n');
const probe=[
 "(()=>{try{const ok=(v,m)=>{if(!v)throw new Error(m)};",
 "document.querySelector('#cards').innerHTML=cardHtml('f1',{series:{season:2026,watched_episodes:85,total_episodes:115,available_episodes:0}})+cardHtml('ufc',{series:{season:2026,watched_episodes:14,total_episodes:41,available_episodes:2}})+cardHtml('wwe',{series:{season:2026,watched_episodes:7,total_episodes:12,available_episodes:1}});",
 "const text=document.querySelector('#cards').textContent;ok(text.includes('Fórmula 1'),'F1 missing');ok(text.includes('UFC'),'UFC missing');ok(text.includes('WWE Pay-Per-View'),'WWE missing');",
 "for(const k of ['f1','ufc','wwe'])ok(document.querySelector('[data-ct513-open='+k+']'),'open '+k);",
 "const d=dedupeWwe([{title:'WWE WrestleMania 42 Night 1',tmdb_id:1,starts_at:'2026-04-18T12:00:00Z',is_watched:false},{title:'WrestleMania 42 Night 2',tmdb_id:2,starts_at:'2026-04-19T12:00:00Z',is_watched:true},{title:'WWE Royal Rumble 2026',tmdb_id:3,starts_at:'2026-01-31T12:00:00Z',is_watched:false}]);",
 "ok(d.length===2,'WWE brand dedupe '+d.length);ok(d.some(x=>/WrestleMania/.test(x.title)&&x.is_watched),'watched WrestleMania not preferred');",
 "document.documentElement.dataset.ct520browser='ok'}catch(e){document.documentElement.dataset.ct520browser='fail:'+String(e?.stack||e)}})();"
].join('\n');
const html='<!doctype html><html><body><div id="cards"></div><script src="/prelude.js"></script><script src="/funcs.js"></script><script src="/probe.js"></script></body></html>',funcs=cardHtml+'\n'+wweBrandKey+'\n'+dedupeWwe;
const assets=new Map([['/',{t:'text/html; charset=utf-8',b:html}],['/prelude.js',{t:'application/javascript; charset=utf-8',b:prelude}],['/funcs.js',{t:'application/javascript; charset=utf-8',b:funcs}],['/probe.js',{t:'application/javascript; charset=utf-8',b:probe}]]);
const server=createServer((req,res)=>{const x=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!x){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':x.t,'cache-control':'no-store'});res.end(x.b)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},45000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const state=out.match(/data-ct520browser="([^"]*)"/)?.[1]||'';if(state!=='ok')throw new Error('R520_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R520_BROWSER_OK F1 + UFC + WWE cards and WWE dedupe');

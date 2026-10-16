import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';await import('./build-r540.mjs');
const js=await readFile(resolve('dist/app-v540.js'),'utf8');
function runtimeByHeader(header,anchor){const start=js.indexOf(header),at=js.indexOf(anchor,start),end=js.indexOf('\n})();',at);if(start<0||at<0||end<0)throw new Error('missing runtime '+anchor);return js.slice(start,end+6)}
const summary=runtimeByHeader('/* CineTracker Web 0.3.67 r540 — auth-safe fast special-series counts. */',"window.__ctR540SummaryMarker='auth-wait+fast-db-counts+bounded-retry+no-stuck-loading'");
const special=runtimeByHeader('/* CineTracker Web 0.3.47 r520 — F1 + UFC + WWE Pay-Per-View single Home owner. */',"window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';");
const f1={series:{title:'Fórmula 1',season:2026,total_episodes:23,released_episodes:23,watched_episodes:17,available_episodes:0,home_bucket:'up_to_date',poster_url:''},events:[]};
const ufc={series:{title:'UFC',season:2026,total_episodes:41,released_episodes:35,watched_episodes:14,available_episodes:2,home_bucket:'continue',next_episode_title:'UFC Fight Night 291',poster_url:''},events:[]};
const wwe={series:{title:'WWE Pay-Per-View',season:2026,total_episodes:7,released_episodes:7,watched_episodes:7,available_episodes:0,home_bucket:'up_to_date',poster_url:''},events:[]};
const prelude=`let auth=false,unauthCountCalls=0;const sleep=ms=>new Promise(r=>setTimeout(r,ms));setTimeout(()=>{auth=true},180);
window.__ctCoreR471={route:()=> 'home',authReady:()=>auth,rpc:async(name)=>{
 if(name==='cinetracker_f1_series_v512')return ${JSON.stringify(f1)};
 if(name==='cinetracker_ufc_series_v518')return ${JSON.stringify(ufc)};
 if(name==='cinetracker_wwe_ppv_series_v519')return ${JSON.stringify(wwe)};
 if(name==='cinetracker_special_series_counts_v540'){if(!auth){unauthCountCalls++;throw new Error('Sessão necessária')}await sleep(35);return {f1:{watched:18,total:1166,watched_sessions:87},ufc:{watched:18,total:793},wwe_ppv:{watched:50,total:567}}}
 throw new Error(name)
},edge:async()=>{throw new Error('offline')}};
window.__ctR513SeriesScreen={rerender(){}};
`;
const probe=`(async()=>{const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms)),textOf=k=>document.querySelector('[data-ct512-special="'+k+'"]')?.textContent||'';
try{
 await sleep(90);
 yes(document.querySelector('[data-ct512-special="f1"]'),'F1 card absent before auth');
 yes(document.querySelector('[data-ct512-special="ufc"]'),'UFC card absent before auth');
 yes(document.querySelector('[data-ct512-special="wwe"]'),'WWE card absent before auth');
 await sleep(900);
 const ft=textOf('f1'),ut=textOf('ufc'),wt=textOf('wwe');
 yes(unauthCountCalls===0,'count RPC called before auth '+unauthCountCalls);
 yes(ft.includes('18/1.166 GPs assistidos'),'F1 '+ft);
 yes(ut.includes('18/793 eventos assistidos'),'UFC '+ut);
 yes(wt.includes('50/567 eventos assistidos'),'WWE '+wt);
 yes(!ft.includes('Contagem histórica carregando')&&!ut.includes('Contagem histórica carregando')&&!wt.includes('Contagem histórica carregando'),'loading did not resolve');
 yes(!ft.includes('17/23')&&!ut.includes('14/41')&&!wt.includes('7/7'),'annual denominator leaked');
 yes(document.querySelector('[data-ct512-special="ufc"]')?.closest('section')?.querySelector('h3')?.textContent==='Continuar assistindo','UFC bucket');
 yes(document.querySelector('[data-ct512-special="f1"]')?.closest('section')?.querySelector('h3')?.textContent==='Em dia','F1 bucket');
 yes(document.querySelector('[data-ct512-special="wwe"]')?.closest('section')?.querySelector('h3')?.textContent==='Em dia','WWE bucket');
 document.documentElement.dataset.ct540browser='ok'
}catch(e){document.documentElement.dataset.ct540browser='fail:'+String(e?.stack||e)}})();`;
const html='<!doctype html><html><body><div data-home-view="series"><section><div class="panel-head"><h3>Continuar assistindo</h3><small>0</small></div><div class="stack"></div></section><section><div class="panel-head"><h3>Em dia</h3><small>0</small></div><div class="stack"></div></section></div><script src="/prelude.js"></script><script src="/special.js"></script><script src="/summary.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html; charset=utf-8',body:html}],['/prelude.js',{type:'application/javascript; charset=utf-8',body:prelude}],['/special.js',{type:'application/javascript; charset=utf-8',body:special}],['/summary.js',{type:'application/javascript; charset=utf-8',body:summary}],['/probe.js',{type:'application/javascript; charset=utf-8',body:probe}]]);
const server=createServer((req,res)=>{const item=assets.get(new URL(req.url,'http://127.0.0.1').pathname);if(!item){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':item.type,'cache-control':'no-store'});res.end(item.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=2400','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},45000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));
const state=out.match(/data-ct540browser="([^"]*)"/)?.[1]||'';if(state!=='ok')throw new Error('R540_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R540_BROWSER_OK auth-ready retry + exact historical counts');

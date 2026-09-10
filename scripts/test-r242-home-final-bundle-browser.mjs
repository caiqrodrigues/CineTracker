import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawn,execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),dist=resolve(root,'apps/web/dist');
const [bundle,css]=await Promise.all([readFile(resolve(dist,'app-v242.js'),'utf8'),readFile(resolve(dist,'app-v242.css'),'utf8')]);
const dir='/tmp/ct-r242-home-final',file=resolve(dir,'index.html'),profile=resolve(dir,'chrome-profile');await mkdir(profile,{recursive:true});
const preview={preview:true,series:[],movie_watchlist:[{media_id:1,tmdb_id:101,title:'Filme Teste',poster_path:null,release_year:2024,runtime_minutes:111,genres:[]}],history_episodes:[],history_movies:[],seen_movie_tmdb_ids:[]};
const stub=`
window.__ctR242Errors=[];window.__ctR242FullCalled=false;window.__ctR242FullResolved=false;window.__ctR242PreviewCalled=false;
addEventListener('error',e=>window.__ctR242Errors.push('error:'+String(e.message||e.error||e)));
addEventListener('unhandledrejection',e=>window.__ctR242Errors.push('rejection:'+String(e.reason||e)));
localStorage.clear();
localStorage.setItem('cinetracker_session',JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:'test-user',email:'teste@local'}}));
const __preview=${JSON.stringify(preview)};
const __json=(x,status=200)=>Promise.resolve(new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json'}}));
window.fetch=(input)=>{const u=String(input?.url||input||'');
 if(u.includes('/auth/v1/user'))return __json({id:'test-user',email:'teste@local'});
 if(u.includes('/rest/v1/rpc/cinetracker_home_live_v0997_r3')){window.__ctR242FullCalled=true;return new Promise(()=>{});}
 if(u.includes('/rest/v1/rpc/cinetracker_home_preview_v1')){window.__ctR242PreviewCalled=true;return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify(__preview),{status:200,headers:{'Content-Type':'application/json'}})),80));}
 if(u.includes('/functions/v1/tmdb-proxy'))return __json({id:101,title:'Filme Teste',release_date:'2024-05-10',runtime:111,genres:[{id:28,name:'Ação'},{id:12,name:'Aventura'}]});
 return __json({});
};
`;
const safe=s=>s.replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${safe(css)}</style></head><body><div id="app"></div><script>${safe(stub)}</script><script>${safe(bundle)}</script></body></html>`;
await writeFile(file,html,'utf8');
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable: no browser binary');}
const port=9222;
const chrome=spawn(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'file://'+file],{stdio:['ignore','ignore','pipe']});
let chromeErr='';chrome.stderr.on('data',d=>{chromeErr+=String(d)});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function targets(){for(let i=0;i<80;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/list`);if(r.ok){const a=await r.json();if(Array.isArray(a)&&a.length)return a}}catch{}await sleep(100)}throw new Error('DevTools target unavailable '+chromeErr.slice(0,400))}
function cdp(wsUrl){return new Promise((resolve,reject)=>{const ws=new WebSocket(wsUrl);let next=1;const pending=new Map();const timeout=setTimeout(()=>reject(new Error('CDP open timeout')),5000);ws.addEventListener('open',()=>{clearTimeout(timeout);resolve({call:(method,params={})=>new Promise((res,rej)=>{const id=next++;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method,params}))}),close:()=>ws.close()})});ws.addEventListener('message',e=>{let m;try{m=JSON.parse(String(e.data))}catch{return}if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(JSON.stringify(m.error))):p.res(m.result)}});ws.addEventListener('error',()=>reject(new Error('CDP websocket error')))})}
let client;
try{
 const list=await targets(),target=list.find(x=>x.type==='page'&&String(x.url||'').startsWith('file:'))||list.find(x=>x.type==='page');if(!target?.webSocketDebuggerUrl)throw new Error('No page debugger target');
 client=await cdp(target.webSocketDebuggerUrl);await client.call('Runtime.enable');await sleep(1800);
 const expression=`(()=>{const home=document.querySelector('[data-home]'),row=document.querySelector('[data-media="movie:101"]'),small=row?.querySelector('small');return{marker:window.__ctR242HomeAdditive||'',homeVisible:Boolean(home&&!home.querySelector('.loader')&&home.textContent.trim()),fast:home?.dataset.ct242Fast||'',movieMeta:small?.textContent||'',errors:(window.__ctR242Errors||[]).join(' | '),appChars:document.querySelector('#app')?.textContent?.trim().length||0,fullCalled:Boolean(window.__ctR242FullCalled),fullResolved:Boolean(window.__ctR242FullResolved),previewCalled:Boolean(window.__ctR242PreviewCalled)}})()`;
 const result=await client.call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:false});const v=result?.result?.value;if(!v)throw new Error('No Runtime.evaluate value');
 if(v.marker!=='preview-first-movie-metadata')throw new Error('R242 marker missing '+JSON.stringify(v));
 if(!v.homeVisible||v.fast!=='preview'||!v.previewCalled||!v.fullCalled||v.fullResolved)throw new Error('R242 Home preview/full ordering failed '+JSON.stringify(v));
 if(!(Number(v.appChars)>0))throw new Error('R242 app root blank '+JSON.stringify(v));
 if(!String(v.movieMeta).includes('2024')||!String(v.movieMeta).includes('111 min')||!String(v.movieMeta).includes('Ação')||!String(v.movieMeta).includes('Aventura'))throw new Error('R242 incomplete movie metadata '+JSON.stringify(v));
 if(v.errors)throw new Error('R242 page error '+v.errors);
 console.log('R242_FINAL_BUNDLE_BROWSER_OK full-rpc=stuck preview=visible movie=year+runtime+genres errors=0');
}finally{try{client?.close()}catch{}try{chrome.kill('SIGKILL')}catch{}await sleep(100);await rm(dir,{recursive:true,force:true})}

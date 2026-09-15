import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('apps/web/dist');
const [html,js,css]=await Promise.all(['index.html','app-v288.js','app-v288.css'].map(f=>readFile(resolve(dist,f),'utf8')));
if(!html.includes('app-v288.js')||!html.includes('app-v288.css'))throw new Error('r288 exact assets');
if(!js.includes("window.__ctWebBuild='1.0.79';window.__ctOfficialVersion='1.0.79';")||!js.includes("window.__ctR287='home-interaction-liveness+available-episode-priority'")||!js.includes("window.__ctR288='discover-android-parity-web-only'"))throw new Error('r288 exact identity');
for(const marker of [
 'window.__ctR288R263={q263,qa263,n263,esc263,type263,id263,title263,poster263,year263,score263,image263,discover263,discoverHost263,block263,armDiscoverRails263,syncDiscover263,forYou263,loadBrowse263,DTABS263}',
 "function loadDiscover263(tab=discover263.tab,force=false){if(typeof window.__ctR288LoadDiscover==='function')return window.__ctR288LoadDiscover(tab,force);",
 'window.__ctR288PaintForYou=function(){',
 'window.__ctR288PaintBrowse=function(rows,tab){',
 'window.__ctR288LoadDiscover=function(tab=discover263.tab,force=false){'
])if(!js.includes(marker))throw new Error('r288 exact live-owner marker '+marker.slice(0,45));
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r288-exact';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><head><style>${css.replaceAll('</style>','<\\/style>')}</style></head><body><div>CineTracker</div><script>window.__ctExact=[];addEventListener('error',e=>__ctExact.push(String(e.message||e.error)));const fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});</script><script>${safe(js.replace(/\nboot\(\);\s*$/,'\n'))}</script><script>document.body.dataset.build=window.__ctWebBuild||'';document.body.dataset.r287=window.__ctR287||'';document.body.dataset.r288=window.__ctR288||'';document.body.dataset.bridge=String(!!window.__ctR288R263&&typeof window.__ctR288R263.discoverHost263==='function'&&typeof window.__ctR288R263.forYou263==='function'&&typeof window.__ctR288R263.loadBrowse263==='function'&&typeof window.__ctR288PaintForYou==='function'&&typeof window.__ctR288PaintBrowse==='function'&&typeof window.__ctR288LoadDiscover==='function');document.body.dataset.errors=__ctExact.join('|');</script></body></html>`,'utf8');
try{const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=1200','--dump-dom','file://'+page],{encoding:'utf8',timeout:20000,maxBuffer:24*1024*1024,stdio:['ignore','pipe','pipe']});if(!out.includes('data-build="1.0.79"')||!out.includes('data-r287="home-interaction-liveness+available-episode-priority"')||!out.includes('data-r288="discover-android-parity-web-only"')||!out.includes('data-bridge="true"'))throw new Error('r288 exact markers/bridge '+(out.match(/<body[^>]*>/)?.[0]||''));const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('r288 exact errors '+errors);console.log('R288_EXACT_BUNDLE_OK 1.0.79 r288 live-r263-bridge')}finally{await rm(dir,{recursive:true,force:true})}

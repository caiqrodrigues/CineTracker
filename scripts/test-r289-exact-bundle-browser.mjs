import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('apps/web/dist');
const [html,js,css]=await Promise.all(['index.html','app-v289.js','app-v289.css'].map(f=>readFile(resolve(dist,f),'utf8')));
if(!html.includes('app-v289.js')||!html.includes('app-v289.css'))throw new Error('r289 exact assets');
for(const marker of [
 "window.__ctWebBuild='1.0.80';window.__ctOfficialVersion='1.0.80';",
 "window.__ctR287='home-interaction-liveness+available-episode-priority'",
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR289Cards='standard-154-mobile-176-desktop-2x3'",
 '[data-ct288-discover]{--ct289-card-w:154px}',
 '@media(min-width:1100px){[data-ct288-discover]{--ct289-card-w:176px}}',
 'grid-template-columns:repeat(auto-fill,var(--ct289-card-w))!important',
 'aspect-ratio:2/3!important'
])if(!js.includes(marker))throw new Error('r289 exact marker '+marker.slice(0,55));
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r289-exact';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><head><style>${css.replaceAll('</style>','<\\/style>')}</style></head><body><div>CineTracker</div><script>window.__ctExact=[];addEventListener('error',e=>__ctExact.push(String(e.message||e.error)));const fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});</script><script>${safe(js.replace(/\nboot\(\);\s*$/,'\n'))}</script><script>const st=document.getElementById('ct-web-r289-discover-standard-card-size');document.body.dataset.build=window.__ctWebBuild||'';document.body.dataset.r288=window.__ctR288||'';document.body.dataset.r289=window.__ctR289||'';document.body.dataset.cards=window.__ctR289Cards||'';document.body.dataset.style=String(!!st&&st.textContent.includes('--ct289-card-w:154px')&&st.textContent.includes('--ct289-card-w:176px')&&st.textContent.includes('aspect-ratio:2/3'));document.body.dataset.errors=__ctExact.join('|');</script></body></html>`,'utf8');
try{const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=1200','--dump-dom','file://'+page],{encoding:'utf8',timeout:20000,maxBuffer:24*1024*1024,stdio:['ignore','pipe','pipe']});for(const x of['data-build="1.0.80"','data-r288="discover-android-parity-web-only"','data-r289="discover-standard-card-size"','data-cards="standard-154-mobile-176-desktop-2x3"','data-style="true"'])if(!out.includes(x))throw new Error('r289 exact missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('r289 exact errors '+errors);console.log('R289_EXACT_BUNDLE_OK 1.0.80 r289 mobile=154x231 desktop=176x264')}finally{await rm(dir,{recursive:true,force:true})}

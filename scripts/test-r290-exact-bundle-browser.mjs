import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('apps/web/dist');
const [html,js,css]=await Promise.all(['index.html','app-v290.js','app-v290.css'].map(f=>readFile(resolve(dist,f),'utf8')));
if(!html.includes('app-v290.js')||!html.includes('app-v290.css'))throw new Error('r290 exact assets');
for(const marker of[
 "window.__ctWebBuild='1.0.81';window.__ctOfficialVersion='1.0.81';",
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR290='universal-media-card-lock'",
 "window.__ctR290Cards='indication-of-day-exact-154x231-mobile-176x264-desktop'",
 "--ct-media-card-w:176px",
 "--ct-media-card-w:154px",
 "window.ct171TopCard=standardTopCard"
])if(!js.includes(marker))throw new Error('r290 exact marker '+marker.slice(0,70));
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r290-exact';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><head><style>${css.replaceAll('</style>','<\\/style>')}</style></head><body><div>CineTracker</div><script>window.__ctExact=[];addEventListener('error',e=>__ctExact.push(String(e.message||e.error)));const fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});</script><script>${safe(js.replace(/\nboot\(\);\s*$/,'\n'))}</script><script>const st=document.getElementById('ct-web-r290-universal-media-card-lock');document.body.dataset.build=window.__ctWebBuild||'';document.body.dataset.r290=window.__ctR290||'';document.body.dataset.cards=window.__ctR290Cards||'';document.body.dataset.style=String(!!st&&st.textContent.includes('--ct-media-card-w:176px')&&st.textContent.includes('--ct-media-card-w:154px')&&st.textContent.includes('-webkit-line-clamp:2'));document.body.dataset.errors=__ctExact.join('|');</script></body></html>`,'utf8');
try{const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=1200','--dump-dom','file://'+page],{encoding:'utf8',timeout:20000,maxBuffer:24*1024*1024,stdio:['ignore','pipe','pipe']});for(const x of['data-build="1.0.81"','data-r290="universal-media-card-lock"','data-cards="indication-of-day-exact-154x231-mobile-176x264-desktop"','data-style="true"'])if(!out.includes(x))throw new Error('r290 exact missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('r290 exact errors '+errors);console.log('R290_EXACT_BUNDLE_OK 1.0.81 r290 universal card lock')}finally{await rm(dir,{recursive:true,force:true})}

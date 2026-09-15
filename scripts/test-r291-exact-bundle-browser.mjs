import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('apps/web/dist');
const [html,js,css]=await Promise.all(['index.html','app-v291.js','app-v291.css'].map(f=>readFile(resolve(dist,f),'utf8')));
if(!html.includes('app-v291.js')||!html.includes('app-v291.css'))throw new Error('r291 exact assets');
for(const marker of[
 "window.__ctWebBuild='1.0.82';window.__ctOfficialVersion='1.0.82';",
 "window.__ctR290='universal-media-card-lock'",
 "window.__ctR291='discover-actions-favorites-horizontal-scroll'",
 "window.__ctR291Actions='footer-row-beside-swap-no-text-overlay'",
 "window.__ctR291Favorites='liked-state-optimistic-heart-overlay'",
 "window.__ctR291Scroll='local-drag-horizontal-carousels'",
 "data-ct291-favorite",
 "p_state:'Liked'",
 "flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x"
])if(!js.includes(marker))throw new Error('r291 exact marker '+marker.slice(0,70));
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r291-exact';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><head><style>${css.replaceAll('</style>','<\\/style>')}</style></head><body><div>CineTracker</div><script>window.__ctExact=[];addEventListener('error',e=>__ctExact.push(String(e.message||e.error)));const fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});</script><script>${safe(js.replace(/\nboot\(\);\s*$/,'\n'))}</script><script>const st=document.getElementById('ct-web-r291-discover-actions-favorites-scroll');document.body.dataset.build=window.__ctWebBuild||'';document.body.dataset.r291=window.__ctR291||'';document.body.dataset.style=String(!!st&&st.textContent.includes('.ct291-slot-footer')&&st.textContent.includes('touch-action:pan-x!important')&&st.textContent.includes('-webkit-line-clamp:1!important'));document.body.dataset.errors=__ctExact.join('|');</script></body></html>`,'utf8');
try{const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=1200','--dump-dom','file://'+page],{encoding:'utf8',timeout:20000,maxBuffer:24*1024*1024,stdio:['ignore','pipe','pipe']});for(const x of['data-build="1.0.82"','data-r291="discover-actions-favorites-horizontal-scroll"','data-style="true"'])if(!out.includes(x))throw new Error('r291 exact missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('r291 exact errors '+errors);console.log('R291_EXACT_BUNDLE_OK 1.0.82 r291 discover interactions')}finally{await rm(dir,{recursive:true,force:true})}

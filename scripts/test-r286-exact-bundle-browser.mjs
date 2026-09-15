import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('apps/web/dist');
const [html,js,css]=await Promise.all(['index.html','app-v286.js','app-v286.css'].map(f=>readFile(resolve(dist,f),'utf8')));
if(!html.includes('app-v286.js')||!html.includes('app-v286.css'))throw new Error('r286 exact assets');
if(!js.includes("window.__ctWebBuild='1.0.77';window.__ctOfficialVersion='1.0.77';")||!js.includes("window.__ctR285='atomic-home+real-photo-covers+reliable-imported-actions'")||!js.includes("window.__ctR286='related-open-watchlist-seen-window-capture'"))throw new Error('r286 exact identity');
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r286-exact';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});
const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><head><style>${css.replaceAll('</style>','<\\/style>')}</style></head><body><div>CineTracker</div><script>window.__ctExact=[];addEventListener('error',e=>__ctExact.push(String(e.message||e.error)));const fetch=async()=>({ok:true,json:async()=>({}),text:async()=>''});</script><script>${safe(js.replace(/\nboot\(\);\s*$/,'\n'))}</script><script>document.body.dataset.build=window.__ctWebBuild||'';document.body.dataset.r285=window.__ctR285||'';document.body.dataset.r286=window.__ctR286||'';document.body.dataset.errors=__ctExact.join('|');</script></body></html>`,'utf8');
try{
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=1200','--dump-dom','file://'+page],{encoding:'utf8',timeout:20000,maxBuffer:20*1024*1024,stdio:['ignore','pipe','pipe']});
 if(!out.includes('data-build="1.0.77"')||!out.includes('data-r285="atomic-home+real-photo-covers+reliable-imported-actions"')||!out.includes('data-r286="related-open-watchlist-seen-window-capture"'))throw new Error('r286 exact markers');
 const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('r286 exact errors '+errors);
 console.log('R286_EXACT_BUNDLE_OK 1.0.77 r286');
}finally{await rm(dir,{recursive:true,force:true})}

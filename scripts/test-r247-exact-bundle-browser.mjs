import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),dist=resolve(root,'apps/web/dist');
const bundle=(await readFile(resolve(dist,'app-v247.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r247-exact';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable')}
try{
 const html=resolve(dir,'index.html');
 await writeFile(html,`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="app"></div><script>
 window.__probeErrors=[];addEventListener('error',e=>window.__probeErrors.push('error:'+String(e.message||e.error||e)+'@'+String(e.lineno||0)+':'+String(e.colno||0)));addEventListener('unhandledrejection',e=>window.__probeErrors.push('rejection:'+String(e.reason||e)));
 try{localStorage.clear();sessionStorage.clear()}catch{};window.fetch=async()=>new Response(JSON.stringify({}),{status:401,headers:{'Content-Type':'application/json'}});
 </script><script>${bundle}</script><script>
 setTimeout(()=>{const a=document.getElementById('app'),d=window.__ctR247Debug?.()||{};document.body.dataset.done='1';document.body.dataset.build=String(window.__ctWebBuild||'');document.body.dataset.marker=String(window.__ctR247||'');document.body.dataset.chars=String(a?.textContent?.trim().length||0);document.body.dataset.html=String(a?.innerHTML?.length||0);document.body.dataset.sportsPayload=String(d.sportsPayloadHook);document.body.dataset.sportsFilter=String(d.sportsFilterHook);document.body.dataset.errors=window.__probeErrors.join(' | ')},1200);
 </script></body></html>`,'utf8');
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'profile')}`,'--virtual-time-budget=2200','--dump-dom','file://'+html],{encoding:'utf8',timeout:25000,stdio:['ignore','pipe','pipe']});
 const body=out.match(/<body[^>]*>/)?.[0]||'';
 for(const x of ['data-done="1"','data-build="1.0.38"','data-marker="black-screen-recovery-current-runtime-authority"'])if(!out.includes(x))throw new Error('R247 exact missing '+x+' '+body);
 const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'',chars=Number((out.match(/data-chars="(\d+)"/)||[])[1]||0),htmlLen=Number((out.match(/data-html="(\d+)"/)||[])[1]||0);
 if(errors)throw new Error('R247 exact errors '+errors+' '+body);if(!(chars>0)&&!(htmlLen>20))throw new Error('R247 exact bundle blank '+body);
 console.log('R247_EXACT_OK booted marker=r247 content='+chars+' html='+htmlLen+' sportsPayload='+((out.match(/data-sports-payload="([^"]+)"/)||[])[1]||'')+' sportsFilter='+((out.match(/data-sports-filter="([^"]+)"/)||[])[1]||''));
}finally{await rm(dir,{recursive:true,force:true})}

import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),dist=resolve(root,'apps/web/dist');
const bundle=(await readFile(resolve(dist,'app-v253.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r253-exact';await mkdir(dir,{recursive:true});let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
try{
 const html=resolve(dir,'index.html');
 await writeFile(html,`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="app"></div><script>
 window.__probeErrors=[];
 addEventListener('error',e=>__probeErrors.push('error:'+String(e.message||e.error)));
 addEventListener('unhandledrejection',e=>__probeErrors.push('rejection:'+String(e.reason)));
 try{localStorage.clear();sessionStorage.clear()}catch{};
 window.fetch=async(url)=>{
   const u=String(url||'');
   if(u.includes('/auth/v1/'))return new Response(JSON.stringify({message:'unauthorized'}),{status:401,headers:{'Content-Type':'application/json'}});
   return new Response(JSON.stringify({}),{status:401,headers:{'Content-Type':'application/json'}});
 };
 </script><script>${bundle}</script><script>
 setTimeout(()=>{
   const a=document.getElementById('app');
   document.body.dataset.done='1';
   document.body.dataset.build=String(window.__ctWebBuild||'');
   document.body.dataset.revision=String(typeof REVISION!=='undefined'?REVISION:'');
   document.body.dataset.marker=String(window.__ctR253||'');
   document.body.dataset.home=String(window.__ctR253Home||'');
   document.body.dataset.discover=String(window.__ctR253Discover||'');
   document.body.dataset.sports=String(window.__ctR253Sports||'');
   document.body.dataset.profile=String(window.__ctR253Profile||'');
   document.body.dataset.r239=String(window.__ctR253LegacyR239ObserverDisabled||false);
   document.body.dataset.queue252=String(window.__ctR253R252QueueClassifierDisabled||false);
   document.body.dataset.paint252=String(window.__ctR253R252PaintClassifierDisabled||false);
   document.body.dataset.chars=String(a?.textContent?.trim().length||0);
   document.body.dataset.html=String(a?.innerHTML?.length||0);
   document.body.dataset.errors=__probeErrors.join('|');
 },1400)</script></body></html>`,'utf8');
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'profile')}`,'--virtual-time-budget=2600','--dump-dom','file://'+html],{encoding:'utf8',timeout:25000,stdio:['ignore','pipe','pipe']});
 for(const x of [
   'data-done="1"',
   'data-build="1.0.44"',
   'data-marker="single-authority-live-data"',
   'data-home="live-payload-native-ui-no-age-only-dust"',
   'data-discover="single-renderer-nine-tabs-generation-safe"',
   'data-sports="single-renderer-four-tabs-canonical-history"',
   'data-profile="approved-layout-live-data-patch"',
   'data-r239="true"',
   'data-queue252="true"',
   'data-paint252="true"'
 ])if(!out.includes(x))throw new Error('R253 exact missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));
 const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'',chars=Number((out.match(/data-chars="(\d+)"/)||[])[1]||0),htmlLen=Number((out.match(/data-html="(\d+)"/)||[])[1]||0);
 if(errors)throw new Error('R253 exact errors '+errors);
 if(!(chars>0)&&!(htmlLen>20))throw new Error('R253 exact bundle blank');
 console.log('R253_EXACT_OK single-authority content='+chars+' html='+htmlLen);
}finally{await rm(dir,{recursive:true,force:true})}

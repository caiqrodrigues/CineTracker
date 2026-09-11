import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),web=resolve(root,'apps/web'),dist=resolve(web,'dist');
const bundle=await readFile(resolve(dist,'app-v246.js'),'utf8');
const dir='/tmp/ct-r246-exact';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable')}
try{
  await writeFile(resolve(dir,'app-v246.js'),bundle,'utf8');
  const html=resolve(dir,'index.html');
  await writeFile(html,`<!doctype html><html><head><meta charset="utf-8"><style>body{background:#050b10;color:white}</style></head><body><div id="app"></div><script>
  window.__probeErrors=[];
  addEventListener('error',e=>window.__probeErrors.push('error:'+String(e.message||e.error||e)));
  addEventListener('unhandledrejection',e=>window.__probeErrors.push('rejection:'+String(e.reason||e)));
  try{localStorage.clear();sessionStorage.clear()}catch{}
  window.fetch=async()=>new Response(JSON.stringify({}),{status:401,headers:{'Content-Type':'application/json'}});
  </script><script src="./app-v246.js"></script><script>
  setTimeout(()=>{const a=document.getElementById('app');document.body.dataset.done='1';document.body.dataset.build=String(window.__ctWebBuild||'');document.body.dataset.marker=String(window.__ctR246||'');document.body.dataset.chars=String(a?.textContent?.trim().length||0);document.body.dataset.html=String(a?.innerHTML?.length||0);document.body.dataset.errors=window.__probeErrors.join(' | ')},1200);
  </script></body></html>`,'utf8');
  const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'profile')}`,'--virtual-time-budget=2200','--dump-dom','file://'+html],{encoding:'utf8',timeout:25000,stdio:['ignore','pipe','pipe']});
  const body=out.match(/<body[^>]*>/)?.[0]||'';
  if(!out.includes('data-done="1"'))throw new Error('R246 exact did not finish '+body);
  const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';
  const chars=Number((out.match(/data-chars="(\d+)"/)||[])[1]||0);
  const htmlLen=Number((out.match(/data-html="(\d+)"/)||[])[1]||0);
  if(errors)throw new Error('R246 exact errors '+errors+' '+body);
  if(!(chars>0)&&!(htmlLen>20))throw new Error('R246 exact bundle blank '+body);
  console.log('R246_EXACT_OK booted content='+chars+' html='+htmlLen);
}finally{await rm(dir,{recursive:true,force:true})}

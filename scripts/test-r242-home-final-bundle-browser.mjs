import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),web=resolve(root,'apps/web'),dist=resolve(web,'dist');
const [bundle,runtime]=await Promise.all([readFile(resolve(dist,'app-v242.js'),'utf8'),readFile(resolve(web,'runtime-r242-home-safe-additive.js'),'utf8')]);
const dir='/tmp/ct-r242-browser-proof';await mkdir(dir,{recursive:true});
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable');}
const safe=s=>s.replaceAll('</script>','<\\/script>');
function dump(url,budget=1800,profile='p'){
 return execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,profile)}`,`--virtual-time-budget=${budget}`,'--dump-dom',url],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']});
}
try{
 /* Proof 1: execute the exact generated app-v242.js from a file origin so SW/network cannot hold Chromium open. */
 const exactApp=resolve(dir,'app-v242.js'),exactHtml=resolve(dir,'exact.html');await writeFile(exactApp,bundle,'utf8');
 const bootProbe=`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="app"></div><script>
 window.__ctR242ProbeErrors=[];addEventListener('error',e=>window.__ctR242ProbeErrors.push('error:'+String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>window.__ctR242ProbeErrors.push('rejection:'+String(e.reason||e)));try{localStorage.clear();sessionStorage.clear()}catch{};window.fetch=async()=>new Response(JSON.stringify({}),{status:401,headers:{'Content-Type':'application/json'}});
 </script><script src="./app-v242.js"></script><script>
 setTimeout(()=>{try{const app=document.getElementById('app');document.body.dataset.done='1';document.body.dataset.build=String(window.__ctWebBuild||'');document.body.dataset.marker=String(window.__ctR242HomeAdditive||'');document.body.dataset.appChars=String(app?.textContent?.trim().length||0);document.body.dataset.errors=(window.__ctR242ProbeErrors||[]).join('|')}catch(e){document.body.dataset.probeError=String(e)}},700);
 </script></body></html>`;await writeFile(exactHtml,bootProbe,'utf8');
 const exact=dump('file://'+exactHtml,1400,'exact-profile'),exactBody=exact.match(/<body[^>]*>/)?.[0]||'';
 for(const x of ['data-done="1"','data-build="1.0.33"','data-marker="preview-first-movie-metadata"'])if(!exact.includes(x))throw new Error('R242 exact final bundle missing '+x+' '+exactBody);
 const appChars=Number((exact.match(/data-app-chars="(\d+)"/)||[])[1]||0);if(!(appChars>0))throw new Error('R242 exact final bundle left app root blank '+exactBody);
 const exactErrors=(exact.match(/data-errors="([^"]*)"/)||[])[1]||'';if(exactErrors||exact.includes('data-probe-error='))throw new Error('R242 exact final bundle browser error '+(exactErrors||exactBody));

 /* Proof 2: exercise the same r242 runtime against a deliberately slow canonical Home renderer. */
 const preview={preview:true,series:[],movie_watchlist:[{media_id:1,tmdb_id:101,title:'Filme Teste',poster_path:null,release_year:2024,runtime_minutes:111,genres:[]}],history_episodes:[],history_movies:[],seen_movie_tmdb_ids:[]};
 const fixture=`<!doctype html><html><body><div id="app"></div><script>
 let homeCache=null,navSeq=1;window.__fullCalled=false;window.__fullResolved=false;window.__previewCalled=false;window.__errors=[];
 addEventListener('error',e=>window.__errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>window.__errors.push(String(e.reason||e)));
 const route=()=> 'home';const localDay=()=> '2026-09-10';
 function paintHome(){const h=document.querySelector('[data-home]');if(!h)return;const x=homeCache?.movie_watchlist?.[0];h.innerHTML=x?'<div data-media="movie:'+x.tmdb_id+'"><b>'+x.title+'</b><small>'+(x.release_year||'')+(x.runtime_minutes?' · '+x.runtime_minutes+' min':'')+'</small></div>':'<div class="empty">Sem itens</div>'}
 async function rpc(name){if(name==='cinetracker_home_preview_v1'){window.__previewCalled=true;await new Promise(r=>setTimeout(r,80));return ${JSON.stringify(preview)}}return {}}
 async function safeTmdb(){return {id:101,release_date:'2024-05-10',runtime:111,genres:[{id:28,name:'Ação'},{id:12,name:'Aventura'}]}}
 async function renderHome(seq){document.getElementById('app').innerHTML='<div data-home><div class="loader">Sincronizando Home...</div></div>';window.__fullCalled=true;await new Promise(r=>setTimeout(()=>{window.__fullResolved=true;homeCache=${JSON.stringify({...preview,preview:false})};paintHome();r()},5000))}
 </script><script>${safe(runtime)}</script><script>
 void renderHome(1);
 setTimeout(()=>{try{const h=document.querySelector('[data-home]'),s=document.querySelector('[data-media="movie:101"] small');document.body.dataset.done='1';document.body.dataset.homeVisible=String(Boolean(h&&!h.querySelector('.loader')&&h.textContent.trim()));document.body.dataset.fast=h?.dataset.ct242Fast||'';document.body.dataset.meta=s?.textContent||'';document.body.dataset.fullCalled=String(window.__fullCalled);document.body.dataset.fullResolved=String(window.__fullResolved);document.body.dataset.previewCalled=String(window.__previewCalled);document.body.dataset.errors=window.__errors.join('|')}catch(e){document.body.dataset.probeError=String(e)}},900);
 </script></body></html>`;
 const behaviorFile=resolve(dir,'behavior.html');await writeFile(behaviorFile,fixture,'utf8');
 const behavior=dump('file://'+behaviorFile,1700,'behavior-profile');const body=behavior.match(/<body[^>]*>/)?.[0]||'';
 for(const x of ['data-done="1"','data-home-visible="true"','data-fast="preview"','data-full-called="true"','data-full-resolved="false"','data-preview-called="true"'])if(!behavior.includes(x))throw new Error('R242 Home behavior missing '+x+' '+body);
 const meta=(behavior.match(/data-meta="([^"]*)"/)||[])[1]||'';if(!meta.includes('2024')||!meta.includes('111 min')||!meta.includes('Ação')||!meta.includes('Aventura'))throw new Error('R242 Home movie metadata incomplete '+meta+' '+body);
 const errors=(behavior.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors||behavior.includes('data-probe-error='))throw new Error('R242 browser behavior error '+(errors||body));
 console.log('R242_BROWSER_OK exact-final-bundle=file-boot full-home=still-pending preview=visible movie=year+runtime+genres');
}finally{await rm(dir,{recursive:true,force:true})}

import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/web/runtime-r215-v109-home-composition.js'),'utf8');
for(const must of ["window.__ctR215HomeComposition='no-standalone-history-home'",'__ctCleanHomeHistory'])if(!patch.includes(must))throw new Error('1.0.9 Home patch missing '+must);

const dir=resolve('/tmp','cinetracker-v109-home');await mkdir(dir,{recursive:true});
const file=resolve(dir,'index.html');
const safe=patch.replaceAll('</script>','<\\/script>');
const pre=`<script>
function section(title,id){return '<section class="home-section" data-id="'+id+'"><div class="panel-head"><h3>'+title+'</h3><small>1</small></div><div class="stack"><div class="media-row">'+id+'</div></div></section>'}
function paintHome(){document.querySelector('[data-home-view="series"]').innerHTML=section('Assistir a seguir','next')+section('Juntando poeira','dust')+section('Histórico recente','history')+section('Em dia','current')}
</script>`;
const post=`<script>
(async()=>{
 try{
   paintHome();
   await new Promise(r=>setTimeout(r,50));
   const series=document.querySelector('[data-home-view="series"]');
   document.body.dataset.firstHistory=String(series.textContent.includes('Histórico recente'));
   document.body.dataset.firstNext=String(series.textContent.includes('Assistir a seguir'));
   document.body.dataset.firstDust=String(series.textContent.includes('Juntando poeira'));
   document.body.dataset.hiddenMarker=document.querySelector('[data-home]')?.dataset?.ctHomeHistoryHidden||'';
   series.insertAdjacentHTML('beforeend',section('Histórico recente','late-history'));
   await new Promise(r=>setTimeout(r,80));
   document.body.dataset.lateHistory=String(series.textContent.includes('Histórico recente'));
   document.body.dataset.historySections=String([...series.querySelectorAll('.home-section')].filter(s=>/histórico|historico/i.test(s.querySelector('h3')?.textContent||'')).length);
 }catch(err){document.body.dataset.testError=String(err?.message||err)}finally{document.body.dataset.done='true'}
})();
</script>`;
const html=`<!doctype html><html><head></head><body><div data-home><div data-home-view="series"></div><div data-home-view="movies"></div></div>${pre}<script>${safe}</script>${post}</body></html>`;
await writeFile(file,html,'utf8');
let out='',stderr='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1500','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch(err){stderr=String(err?.stderr||'')}}
await rm(dir,{recursive:true,force:true});
if(!out)throw new Error('Chrome/Chromium unavailable '+stderr.slice(-800));
if(out.includes('data-test-error='))throw new Error('1.0.9 Home runtime error '+out.match(/data-test-error="([^"]*)"/)?.[1]);
for(const must of ['data-done="true"','data-first-history="false"','data-first-next="true"','data-first-dust="true"','data-hidden-marker="1"','data-late-history="false"','data-history-sections="0"'])if(!out.includes(must))throw new Error('1.0.9 Home composition missing '+must+'\n'+out.slice(-2500));
console.log('V109_HOME_BROWSER_OK history=hidden initial+late next=preserved dust=preserved');

import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const runtime=(await readFile(resolve(process.cwd(),'apps/web/runtime-r247-black-screen-recovery.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r247-sports',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const html=`<!doctype html><html><body><div id="app"><div data-sports><div class="tabs"><button data-sport-tab="today">Hoje</button><button data-sport-tab="assisted">Assistidos</button></div><div class="event-grid"><article><button>Eventos</button><button id="watch">Assistido</button></article></div></div></div><script>
const sportsState={tab:'today',page:2,query:''},SPORT_PAGE_SIZE=24;
const sample=[{id:'past',starts_at:'2026-09-11T10:00:00',status:'finished'},{id:'future',starts_at:'2026-09-11T16:00:00',status:'scheduled'},{id:'d1',starts_at:'2026-09-10T12:00:00',status:'finished'},{id:'d2',starts_at:'2026-09-09T12:00:00',status:'finished'},{id:'d3',starts_at:'2026-09-08T12:00:00',status:'finished'},{id:'d4',starts_at:'2026-09-07T12:00:00',status:'finished'}];
function sportStartMs(x){return new Date(x.starts_at).getTime()} function sportEnded(x){return x.status==='finished'}
async function rpc(name,args){if(args.p_favorite_only)return[{id:'fav',starts_at:'2026-09-12T12:00:00',status:'scheduled'}];return sample}
async function sportsPayload(){return sportsState.tab==='assisted'?[{id:'watched',watched:true}]:sample} function sportsFiltered(rows){return sportsState.tab==='assisted'?rows.filter(x=>x.watched):rows}
function paintSports(){} async function renderSports(){paintSports()}
function renderProfile(){} function paintDiscover(){} function route(){return 'sports'}
</script><script>${runtime}</script><script>
(async()=>{try{
 window.__ctR247SportsNormalize();const d=window.__ctR247Debug();document.body.dataset.payloadHook=String(d.sportsPayloadHook);document.body.dataset.filterHook=String(d.sportsFilterHook);document.body.dataset.tabs=[...document.querySelectorAll('[data-ct247-sport-tab]')].map(x=>x.textContent).join('|');document.body.dataset.events=String(!![...document.querySelectorAll('button')].find(x=>x.textContent==='Eventos'));
 document.body.dataset.next=window.__ctR247SportsFilter(sample,'next','2026-09-11T15:00:00').map(x=>x.id).join('|');document.body.dataset.previous=window.__ctR247SportsFilter(sample,'previous','2026-09-11T15:00:00').map(x=>x.id).join('|');
 const b=document.querySelector('[data-sport-tab="previous"]');b.click();await new Promise(r=>setTimeout(r,20));document.body.dataset.state=sportsState.tab;document.body.dataset.page=String(sportsState.page);
 const w=document.getElementById('watch');w.click();document.body.dataset.pop=String(w.classList.contains('ct247-watch-pop'));document.body.dataset.done='1';
}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}})();
</script></body></html>`;await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1500','--dump-dom','file://'+file],{encoding:'utf8',timeout:20000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const x of ['data-done="1"','data-payload-hook="true"','data-filter-hook="true"','data-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-events="false"','data-next="future"','data-previous="d1|d2|d3"','data-state="previous"','data-page="0"','data-pop="true"'])if(!out.includes(x))throw new Error('R247 sports missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));if(out.includes('data-err='))throw new Error('R247 sports runtime '+(out.match(/data-err="[^"]*/)?.[0]||''));console.log('R247_SPORTS_OK hooks=safe tabs=4 next=today previous=3-days events=removed watch=animated');

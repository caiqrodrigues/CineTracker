import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const patch=(await readFile(resolve(process.cwd(),'apps/web/runtime-r240-sports-four-tabs.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r240-sports',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const html=`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="app"><div data-sports></div></div><script>
const sportsState={tab:'today',page:0,query:''};const SPORT_PAGE_SIZE=24;
const rows={
 today:[
  {id:'todayPast',starts_at:'2026-09-09T10:00:00',status:'finished'},
  {id:'todayFuture',starts_at:'2026-09-09T16:00:00',status:'scheduled'},
  {id:'tomorrow',starts_at:'2026-09-10T10:00:00',status:'scheduled'}
 ],
 month:[
  {id:'todayPast',starts_at:'2026-09-09T10:00:00',status:'finished'},
  {id:'d1',starts_at:'2026-09-08T12:00:00',status:'finished'},
  {id:'d2',starts_at:'2026-09-07T12:00:00',status:'finished'},
  {id:'d3',starts_at:'2026-09-06T12:00:00',status:'finished'},
  {id:'d4',starts_at:'2026-09-05T12:00:00',status:'finished'}
 ],
 favorites:[{id:'fav1',starts_at:'2026-09-11T12:00:00',favorite:true}],
 watched:[{id:'watched1',starts_at:'2026-08-01T12:00:00',watched:true},{id:'notWatched',starts_at:'2026-08-02T12:00:00',watched:false}]
};
let rpcCalls=[];
async function rpc(name,args){rpcCalls.push(args);if(args.p_favorite_only)return rows.favorites;if(args.p_scope==='today')return rows.today;if(args.p_scope==='yesterday')return rows.month.filter(x=>x.id==='d1');return rows.month}
function sportStartMs(x){return new Date(x.starts_at).getTime()}
function sportEnded(x){return x.status==='finished'}
function sportsTabs(){return [['today','Hoje'],['yesterday','Ontem'],['recent','Recentes'],['live','Ao vivo'],['calendar','Calendário'],['favorites','Favoritos'],['assisted','Assistidos']].map(([k,l])=>'<button class="chip" data-sport-tab="'+k+'">'+l+'</button>').join('')}
async function sportsPayload(){if(sportsState.tab==='assisted')return rows.watched;if(sportsState.tab==='favorites')return rows.favorites;return rows.today}
function sportsFiltered(a){if(sportsState.tab==='assisted')return a.filter(x=>x.watched);return a}
function paintSports(){}
async function renderSports(){const data=sportsFiltered(await sportsPayload());document.querySelector('[data-sports]').innerHTML='<div class="tabs">'+sportsTabs()+'</div><section class="panel"><h2>Eventos</h2><div class="event-grid">'+data.map(x=>'<article data-id="'+x.id+'">'+x.id+'</article>').join('')+'</div></section>';paintSports(data)}
</script><script>${patch}</script><script>
window.__ctR240Now='2026-09-09T15:00:00';
(async()=>{try{
 await renderSports();
 document.body.dataset.tabs=[...document.querySelectorAll('[data-sport-tab]')].map(x=>x.textContent.trim()).join('|');
 document.body.dataset.defaultTab=sportsState.tab;
 const all=[...rows.today,...rows.month];
 document.body.dataset.next=window.__ctR240Filter(all,'next','2026-09-09T15:00:00').map(x=>x.id).join('|');
 document.body.dataset.previous=window.__ctR240Filter(all,'previous','2026-09-09T15:00:00').map(x=>x.id).join('|');
 sportsState.tab='favorites';rpcCalls=[];const fav=await sportsPayload();document.body.dataset.favoriteIds=fav.map(x=>x.id).join('|');document.body.dataset.favoriteFlag=String(rpcCalls.some(x=>x.p_favorite_only===true));
 sportsState.tab='watched';const watched=sportsFiltered(await sportsPayload());document.body.dataset.watched=watched.map(x=>x.id).join('|');document.body.dataset.legacyKey=window.__ctR240LegacyWatchedKey;
 sportsState.tab='previous';await renderSports();document.body.dataset.renderTabs=[...document.querySelectorAll('[data-sport-tab]')].map(x=>x.textContent.trim()).join('|');document.body.dataset.heading=document.querySelector('.panel h2')?.textContent||'';
 document.body.dataset.done='1';
}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}})();
</script></body></html>`;
await writeFile(file,html);let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=2500','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const x of ['data-done="1"','data-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-default-tab="next"','data-next="todayFuture"','data-previous="d1|d2|d3"','data-favorite-ids="fav1"','data-favorite-flag="true"','data-watched="watched1"','data-legacy-key="assisted"','data-render-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-heading="Anteriores · últimos 3 dias"'])if(!out.includes(x))throw new Error('R240 browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));
if(/>Hoje<|>Ontem<|>Recentes<|>Ao vivo<|>Calendário</.test(out.match(/<div data-sports[\s\S]*?<\/div><\/div>/)?.[0]||''))throw new Error('R240 old Sports tab visible');
if(out.includes('data-err='))throw new Error('R240 browser runtime error '+(out.match(/data-err="[^"]*/)?.[0]||''));
console.log('R240_BROWSER_OK exact-tabs + today-upcoming + previous-3-days + favorites-only + watched-preserved');
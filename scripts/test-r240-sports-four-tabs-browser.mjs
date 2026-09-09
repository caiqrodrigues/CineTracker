import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const patch=(await readFile(resolve(process.cwd(),'apps/web/runtime-r240-sports-four-tabs.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r240-sports',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const html=`<!doctype html><html><head><meta charset="utf-8"><style>.event-grid{display:grid}.hidden{display:none}</style></head><body><div id="app"><div data-sports><div id="legacy" class="tabs"><button class="active">Hoje</button><button>Ontem</button><button>Recentes</button><button>Ao vivo</button><button>Calendário</button><button>Favoritos</button><button>Assistidos</button></div><section class="panel"><h2>Eventos de hoje</h2><div class="event-grid" id="grid"></div></section></div></div><script>
function paintSports(){}
const root=document.querySelector('[data-sports]'),legacy=document.getElementById('legacy'),grid=document.getElementById('grid');
const pad=n=>String(n).padStart(2,'0'),at=(d,h,m)=>{const x=new Date(d);x.setHours(h,m,0,0);return pad(x.getDate())+'/'+pad(x.getMonth()+1)+', '+pad(h)+':'+pad(m)},day=n=>{const x=new Date();x.setHours(0,0,0,0);x.setDate(x.getDate()+n);return x};
const mk=(id,text,status='AGENDADO')=>'<article id="'+id+'"><span>'+text+'</span><b>'+status+'</b></article>';
function renderSource(name){
 [...legacy.children].forEach(b=>b.classList.toggle('active',b.textContent.trim()===name));
 const now=new Date(),futureH=(now.getHours()+2)%24;let todayFuture=new Date(now);todayFuture.setHours(now.getHours()+2,Math.max(now.getMinutes(),1),0,0);if(todayFuture.getDate()!==now.getDate())todayFuture=new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,0);
 if(name==='Calendário') grid.innerHTML=mk('todayPast',at(day(0),0,1),'ENCERRADO')+mk('todayFuture',at(day(0),todayFuture.getHours(),todayFuture.getMinutes()))+mk('tomorrow',at(day(1),12,0));
 else if(name==='Recentes') grid.innerHTML=mk('d1',at(day(-1),12,0),'ENCERRADO')+mk('d2',at(day(-2),12,0),'ENCERRADO')+mk('d3',at(day(-3),12,0),'ENCERRADO')+mk('d4',at(day(-4),12,0),'ENCERRADO');
 else if(name==='Favoritos') grid.innerHTML=mk('fav1',at(day(0),12,0))+mk('fav2',at(day(1),12,0));
 else if(name==='Assistidos') grid.innerHTML=mk('watched1',at(day(-10),12,0),'ENCERRADO')+mk('watched2',at(day(-1),12,0),'ENCERRADO');
 else grid.innerHTML=mk('todayOld',at(day(0),0,1),'ENCERRADO');
}
[...legacy.children].forEach(b=>b.addEventListener('click',()=>renderSource(b.textContent.trim())));renderSource('Hoje');
</script><script>${patch}</script><script>
const visible=()=>[...document.querySelectorAll('#grid>article')].filter(x=>!x.hidden&&getComputedStyle(x).display!=='none').map(x=>x.id).join('|');
const click=k=>document.querySelector('[data-ct240-sports-tab="'+k+'"]').click();
setTimeout(()=>{document.body.dataset.tabs=[...document.querySelectorAll('[data-ct240-sports-tab]')].map(x=>x.textContent.trim()).join('|');document.body.dataset.next=visible();click('previous');setTimeout(()=>{document.body.dataset.previous=visible();click('favorites');setTimeout(()=>{document.body.dataset.favorites=visible();click('watched');setTimeout(()=>{document.body.dataset.watched=visible();document.body.dataset.legacyHidden=String(getComputedStyle(legacy).display==='none');document.body.dataset.done='1'},220)},220)},220)},220)},350);
</script></body></html>`;
await writeFile(file,html);let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=2500','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const x of ['data-done="1"','data-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-next="todayFuture"','data-previous="d1|d2|d3"','data-favorites="fav1|fav2"','data-watched="watched1|watched2"','data-legacy-hidden="true"'])if(!out.includes(x))throw new Error('R240 browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));
console.log('R240_BROWSER_OK tabs=4 next=today-future previous=d1-d3 favorites=source-only watched=source-only');
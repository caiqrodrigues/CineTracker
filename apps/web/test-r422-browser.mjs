import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

if(process.env.CT_R422_SKIP_BUILD!=='1')await import('./build-r422.mjs');
let bin='';for(const x of ['google-chrome','google-chrome-stable','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const runtime=(await readFile(resolve('runtime-r422-audit-performance.js'),'utf8')).replaceAll('</script>','<\\/script>');
const setup=`
var currentRoute='discover',hiddenFlag=false,recentCalls=0,recordCalls=0,fullRenders=0,slotRenders=0;
var route=()=>currentRoute;
Object.defineProperty(document,'hidden',{configurable:true,get:()=>hiddenFlag});
var state={daily:[{media_type:'movie',tmdb_id:1001,title:'Daily',poster_path:'/x',vote_average:8.2,release_date:'2025-01-01',genres:[{id:28,name:'Ação'}]}],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
function item(type,id,kind){return {media_type:type,media_kind:kind||null,tmdb_id:id,title:'T'+id,poster_path:'/x',vote_average:8.1,release_date:'2025-01-01',first_air_date:'2025-01-01',genres:[{id:28,name:'Ação'}]}}
state.watch.movie=[item('movie',1101),item('movie',1102)];state.watch.series=[item('tv',1201),item('tv',1202)];state.watch.anime=[item('tv',1301,'anime'),item('tv',1302,'anime')];state.fresh.movie=[item('movie',2101),item('movie',2102),item('movie',2103)];state.fresh.series=[item('tv',2201),item('tv',2202),item('tv',2203)];state.fresh.anime=[item('tv',2301,'anime'),item('tv',2302,'anime'),item('tv',2303,'anime')];
function key(x){return (x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id}
function slotItem(name){if(name==='daily')return state.daily[0];var a=name.split(':'),g=a[0],k=a[1],list=state[g][k],i=state.idx[g][k]||0;return list[i%list.length]}
function buttons(name,watch){var acts=watch?['seen','swap']:['watchlist','seen','swap'];return '<div class="ct411-actions '+(watch?'two':'three')+'">'+acts.map(a=>'<button data-ct411-action="'+a+'" data-ct411-slot="'+name+'">'+a+'</button>').join('')+'</div>'}
function slot(name,watch){var x=slotItem(name);return '<section data-ct411-slot="'+name+'"><article data-media="'+key(x)+'">'+x.title+'</article>'+buttons(name,watch)+'</section>'}
function paint(){fullRenders++;document.querySelector('[data-ct319-content]').innerHTML='<div data-ct411-foryou>'+slot('daily',false)+slot('watch:movie',true)+slot('watch:series',true)+slot('watch:anime',true)+slot('fresh:movie',false)+slot('fresh:series',false)+slot('fresh:anime',false)+'</div>'}
function renderSlot(name){slotRenders++;var old=document.querySelector('[data-ct411-slot="'+name+'"]');if(!old)return false;var box=document.createElement('div');box.innerHTML=slot(name,name.startsWith('watch:'));old.replaceWith(box.firstElementChild);return true}
window.__ctR412Eligibility={reasonSync:()=>'',eligible:async()=>true,filterRows:async(v,o)=>v.slice(0,o.limit||24),detail:async x=>x};window.__ctR413Eligibility={isReality:()=>false};window.__ctR288R263={discover263:{tab:'foryou'}};window.__ctR244Decorate=()=>true;window.__ctR246Horizontal=()=>true;
window.__ctR411={getForYou:()=>state,loadForYou:async()=>{paint();return true},renderForYou:()=>{paint();return true},swap:name=>{if(name==='daily'){state.daily=[state.fresh.movie[1]];renderSlot(name);return true}var a=name.split(':'),g=a[0],k=a[1];state.idx[g][k]=((state.idx[g][k]||0)+1)%state[g][k].length;renderSlot(name);return true}};
var rpc=async(name,args)=>{if(name==='cinetracker_shown_recommendations_recent_v296'){recentCalls++;return[]}if(name==='cinetracker_shown_recommendations_record_v296'){recordCalls++;return true}return[]};
`;
const probe=`
(async()=>{const ok=(v,m)=>{if(!v)throw new Error(m)};try{
 await window.__ctR411.loadForYou(true);await new Promise(r=>setTimeout(r,80));var root=document.querySelector('[data-ct411-foryou]');ok(root,'Pra Voce missing');ok(root.querySelectorAll('[data-ct411-action="swap"]').length===7,'seven Trocar buttons missing');ok(root.querySelectorAll('[data-ct411-action]').length===18,'action matrix incomplete');
 var before=[...root.querySelectorAll('[data-media]')].map(x=>x.dataset.media),fullBefore=fullRenders,slotBefore=slotRenders;document.querySelector('[data-ct411-slot="fresh:movie"] [data-ct411-action="swap"]').click();await new Promise(r=>setTimeout(r,120));root=document.querySelector('[data-ct411-foryou]');var after=[...root.querySelectorAll('[data-media]')].map(x=>x.dataset.media);ok(before.filter((x,i)=>x!==after[i]).length===1,'Trocar changed more than one slot');ok(fullRenders===fullBefore,'Trocar repainted all slots');ok(slotRenders>slotBefore,'Trocar did not repaint clicked slot');
 hiddenFlag=true;document.dispatchEvent(new Event('visibilitychange'));await new Promise(r=>setTimeout(r,30000));hiddenFlag=false;document.dispatchEvent(new Event('visibilitychange'));document.dispatchEvent(new Event('visibilitychange'));await new Promise(r=>setTimeout(r,500));ok(recentCalls<=3,'foreground refetch storm '+recentCalls);
 for(const rr of ['home','discover','profile','sports','discover','home','profile','discover']){currentRoute=rr;if(rr==='discover')window.__ctR288R263.discover263.tab='foryou';window.dispatchEvent(new PopStateEvent('popstate'))}await new Promise(r=>setTimeout(r,300));var clicked=0,b=document.createElement('button');b.onclick=()=>clicked++;document.body.appendChild(b);b.click();ok(clicked===1,'UI click blocked after rapid navigation');ok(recordCalls>0,'persistent recommendation history not recorded');document.documentElement.dataset.ct422probe='1';
 }catch(e){document.documentElement.dataset.ct422err=String(e.message||e)}})();
`;
const html='<!doctype html><html><body><div id="app"><div data-ct319-content></div></div><script>'+setup+'</script><script>'+runtime+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=32000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));if(!/data-ct422probe="1"/.test(out))throw new Error((out.match(/data-ct422err="([^"]*)"/)||[])[1]||'r422 browser probe failed');
console.log('R422_BROWSER_OK 30s background + rapid navigation + 7 Trocar + one-slot swap + no refetch storm');

import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r269-android-js">';
const at=html.indexOf(tag),end=at<0?-1:html.indexOf('</script>',at+tag.length);
if(at<0||end<at)throw Error('r270 requires r269 verified base');
let js=html.slice(at+tag.length,end);
function one(from,to,label){const n=js.split(from).length-1;if(n!==1)throw Error(label+' anchor count '+n);js=js.replace(from,to)}
function region(from,to,body,label){
 const a=js.indexOf(from),b=a<0?-1:js.indexOf(to,a+from.length);
 if(a<0||b<=a||js.indexOf(from,a+1)>0)throw Error(label+' missing/ambiguous');
 js=js.slice(0,a)+body+'\n'+js.slice(b);
}
region('async function markSportWatched159(eventId,currentlyWatched){',"document.addEventListener('click',function r159SportsWatchClick","const sportLocks270=new Set();\nfunction sportState270(id,on,busy=false){\n document.querySelectorAll('[data-sport-watch=\"'+id+'\"],[data-sport-watched=\"'+id+'\"]').forEach(b=>{\n  b.disabled=busy;b.classList.toggle('on',on);\n  if(b.hasAttribute('data-sport-watch')){b.dataset.watched=on?'1':'0';b.textContent=on?'✓ Assistido':'✓ Marcar assistido'}\n  else{b.dataset.on=on?'1':'0';b.textContent=on?'✓ Assistido':'✓ Marcar como assistido'}\n });\n}\nfunction sportsCached270(id,on){\n if(sportsCache?.events)for(const x of sportsCache.events)if(Number(x.id)===id)x.is_watched=on;\n try{if(sportsCache)ct163Write('sports',sportsCache)}catch{}\n profileCache=null;\n try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}\n}\nasync function markSportWatched159(eventId,currentlyWatched){\n const id=Number(eventId||0);if(!id||sportLocks270.has(id))return;\n sportLocks270.add(id);const next=!currentlyWatched;\n sportState270(id,next,true);sportsCached270(id,next);\n try{\n  const result=await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()});\n  if(typeof result?.is_watched!=='boolean')throw Error('Marcação não confirmada');\n  sportState270(id,result.is_watched,false);sportsCached270(id,result.is_watched);\n  toast(result.is_watched?'Evento marcado como assistido.':'Evento desmarcado.');\n }catch(err){\n  sportState270(id,currentlyWatched,false);sportsCached270(id,currentlyWatched);\n  toast('Esportes: '+String(err?.message||err));\n }finally{sportLocks270.delete(id)}\n}",'r159 sport full repaint');
region("document.addEventListener('click',e=>{\n  const b=e.target.closest?.('[data-sport-watched]');","/* r169: richer details, related media","document.addEventListener('click',e=>{\n const b=e.target.closest?.('[data-sport-watched]');if(!b)return;\n e.preventDefault();e.stopImmediatePropagation();\n void markSportWatched159(Number(b.dataset.sportWatched),b.dataset.on==='1');\n},true);",'r168 separate sports click');
region('async function toggleSports263(btn){',"document.addEventListener('click',e=>{const close=e.target?.closest?.('[data-ct263-sports-close]')","async function toggleSports263(btn){\n const id=num263(btn?.dataset?.ct263SportWatch);\n if(!id||!sportsDetail263||sportsLocks263.has(id))return;\n const ev=rows263(sportsDetail263.events).find(x=>num263(x?.id)===id);if(!ev)return;\n const previous=!!ev.is_watched,next=!previous;\n sportsLocks263.add(id);ev.is_watched=next;btn.disabled=true;btn.textContent=next?'↶ Desmarcar assistido':'✓ Marcar como assistido';\n try{\n  const result=await rpc263('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()});\n  if(typeof result?.is_watched!=='boolean')throw Error('Marcação não confirmada');\n  ev.is_watched=result.is_watched;sportsCached270(id,result.is_watched);\n  btn.textContent=result.is_watched?'↶ Desmarcar assistido':'✓ Marcar como assistido';\n }catch(error){\n  ev.is_watched=previous;sportsCached270(id,previous);btn.textContent=previous?'↶ Desmarcar assistido':'✓ Marcar como assistido';\n  try{toast(error?.message||'Falha ao marcar assistido')}catch{}\n }finally{btn.disabled=false;sportsLocks263.delete(id)}\n}",'r263 sports detail redraw');
const first=js.indexOf('async function ct186FreshPools(c){'),last=js.indexOf('function ct186WatchPools(c){',first);
if(first<0||last<=first)throw Error('fresh source bounds not found');
let fresh=js.slice(first,last);
if((fresh.match(/,'(movie|tv)',6\)/g)||[]).length!==3)throw Error('fresh initial 18-page calls not identified');
fresh=fresh.replaceAll(",'movie',6)",",'movie',3)").replaceAll(",'tv',6)",",'tv',3)");
js=js.slice(0,first)+fresh+js.slice(last);
one("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
one("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
"window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'version');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-history-fast-optimistic.js'),'utf8');
for(const required of ['__ctR270AndroidV1028','cinetracker_home_movie_history_v323','ct186LoadForYou=async','IntersectionObserver'])if(!patch.includes(required))throw Error('missing r270 '+required);
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(denied))throw Error('forbidden '+denied);
if(!js.includes('\nboot();'))throw Error('r270 boot anchor absent');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,at)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY movie history from play events, sports optimistic no scroll, quick recommendations and lazy posters');
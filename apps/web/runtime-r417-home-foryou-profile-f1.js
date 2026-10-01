/* CineTracker Web 1.0.208 r417 — stable Home series entry + guaranteed Pra Voce Trocar + truthful Profile sports metrics + F1 series authority. */
(()=>{
'use strict';
if(window.__ctR417?.version==='1.0.208')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const visible=el=>{if(!el?.isConnected)return false;try{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0}catch{return true}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);

/* HOME SERIES — keep the series canvas hidden until the final geometry is really stable. */
let homeRun=0,homeTimer=0,homeStarted=0,homeStable=0,homeSig='',homeEntering=false;
let homePost=[];
function seriesView(){return q('[data-home-view="series"]')}
function seriesTarget(){
 const view=seriesView();if(!view)return null;
 return q('[data-ct406-bucket="continue"],[data-ct404-bucket="continue"],[data-ct397-bucket="continue"],[data-ct388-bucket="continue"]',view)
  ||qa('section,.home-section,.panel',view).find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))||null;
}
function seriesIsVisible(){const v=seriesView();return !!v&&!v.hidden&&!v.classList?.contains('hidden')&&v.offsetParent!==null}
function seriesBusy(view){
 if(!view)return true;
 if(q('.loader,[aria-busy="true"],[data-ct284-pending="1"],[data-ct275-pending="1"]',view))return true;
 const t=norm(view.textContent||'');return /carregando|sincronizando estado atual|atualizando episodios/.test(t);
}
function absTop(el){const r=el?.getBoundingClientRect?.();return r?Math.round((window.scrollY||document.documentElement.scrollTop||0)+r.top):null}
function clearHomePost(){for(const id of homePost)clearTimeout(id);homePost=[]}
function revealHome417(){homeEntering=false;clearTimeout(homeTimer);homeTimer=0;delete document.documentElement.dataset.ct417HomeEntering;delete document.documentElement.dataset.ct415HomeEntering;delete document.documentElement.dataset.ct413HomeEntering}
function alignSeries417(){
 if(routeNow()!=='home'||!seriesIsVisible())return false;const target=seriesTarget();if(!target?.isConnected)return false;
 const tabs=q('[data-home] .home-tabs'),bottom=tabs?.getBoundingClientRect?.().bottom||0,current=window.scrollY||document.documentElement.scrollTop||0,r=target.getBoundingClientRect();
 const top=Math.max(0,Math.round(current+r.top-Math.max(8,Math.ceil(bottom)+8)));
 try{window.scrollTo({top,left:0,behavior:'auto'})}catch{try{window.scrollTo(0,top)}catch{}}
 document.documentElement.dataset.ct417HomeAligned='series';return true;
}
function postAlign417(token){
 clearHomePost();for(const ms of[50,180,450,900,1600])homePost.push(setTimeout(()=>{if(token!==homeRun||routeNow()!=='home'||!seriesIsVisible())return;alignSeries417()},ms));
}
function finishHome417(token){
 if(token!==homeRun)return false;const ok=alignSeries417();if(!ok){try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}}
 requestAnimationFrame(()=>{if(token!==homeRun)return;alignSeries417();requestAnimationFrame(()=>{if(token!==homeRun)return;alignSeries417();revealHome417();postAlign417(token)})});return true;
}
function probeHome417(token){
 if(token!==homeRun||!homeEntering)return;if(routeNow()!=='home'||!seriesIsVisible()){revealHome417();return}
 const view=seriesView(),target=seriesTarget(),elapsed=Date.now()-homeStarted;
 if(!view||!target){homeStable=0;homeSig='';if(elapsed>=15000){revealHome417();try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{};return}homeTimer=setTimeout(()=>probeHome417(token),90);return}
 const sig=[absTop(target),view.scrollHeight,target.offsetHeight,qa('article,[data-media]',view).length,qa('article,[data-media]',target).length].join(':');
 if(sig===homeSig&&!seriesBusy(view))homeStable++;else homeStable=0;homeSig=sig;
 if(homeStable>=12||elapsed>=15000){finishHome417(token);return}
 homeTimer=setTimeout(()=>probeHome417(token),90);
}
function beginHome417(){
 if(routeNow()!=='home')return false;const token=++homeRun;clearHomePost();clearTimeout(homeTimer);homeEntering=true;homeStarted=Date.now();homeStable=0;homeSig='';document.documentElement.dataset.ct417HomeEntering='series';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{try{window.scrollTo(0,0)}catch{}}
 homeTimer=setTimeout(()=>probeHome417(token),0);return true;
}
function cancelHome417(){homeRun++;clearHomePost();revealHome417();return true}

/* PRA VOCE — repair the action rows that are actually visible, independent of the winning legacy painter. */
const fyLocks=new Set();let fyRepairToken=0;
function discoverState(){return window.__ctR288R263?.discover263||null}
function isForYou(){return routeNow()==='discover'&&(String(discoverState()?.tab||'foryou')==='foryou'||!!q('[data-ct411-foryou],[data-ct336-foryou],[data-ct309-foryou]'))}
function discoverHost(){const all=qa('[data-ct319-content],[data-ct315-content],[data-ct313-content],[data-ct263-discover-content],[data-discover-content]');return all.find(visible)||all[all.length-1]||null}
function sectionBy(kind){
 const root=discoverHost();if(!root)return null;for(const h of qa('h2,h3',root)){const t=norm(h.textContent||'');
  if(kind==='daily'&&t==='indicacao do dia')return h.closest('section,.panel')||h.parentElement;
  if(kind==='watch'&&t==='da sua watchlist')return h.closest('section,.panel')||h.parentElement;
  if(kind==='fresh'&&(t==='100 novos'||t.includes('100 novos')))return h.closest('section,.panel')||h.parentElement;
 }return null;
}
function mediaPresent(node){if(!node)return false;return !!q('[data-media],article,.ct291-card,.ct288-card,.ct309-card,.thumb,img',node)}
function actionRows(section){
 const out=[],seen=new Set();if(!section)return out;
 for(const b of qa('button',section)){
  const t=norm(b.textContent||'');if(!(t.includes('watchlist')||t.includes('visto')||t.includes('trocar')))continue;
  const p=b.parentElement;if(!p||seen.has(p))continue;seen.add(p);out.push(p);
 }
 return out;
}
function slotKind(row){
 let el=row;for(let i=0;i<7&&el;i++,el=el.parentElement){
  const raw=String(el.dataset?.ct411Slot||el.dataset?.ct336Slot||el.dataset?.ct388Slot||el.dataset?.ct309Slot||'');const m=raw.match(/(movie|series|anime)$/);if(m)return m[1];
  const t=norm(q(':scope > h3,:scope > label,h3,label',el)?.textContent||'');if(t.includes('filme'))return'movie';if(t.includes('anime'))return'anime';if(t.includes('serie'))return'series';
 }return'';
}
function ensureSwap417(row,name,cols){
 if(!row||!name||!mediaPresent(row.closest?.('[data-ct411-slot],[data-ct336-slot],[data-ct388-slot],.ct388-slot,.ct309-slot')||row.parentElement||row))return false;
 let b=qa('button',row).find(x=>norm(x.textContent||'').includes('trocar'));
 if(!b){b=document.createElement('button');row.appendChild(b)}
 b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('disabled');b.removeAttribute('inert');b.setAttribute('aria-disabled','false');b.textContent='↻ Trocar';b.classList.add('chip','ct417-swap');b.dataset.ct417Swap=name;
 row.classList.add('ct417-actions');row.dataset.ct417Cols=String(cols);return true;
}
function repairForYou417(){
 if(!isForYou())return 0;const root=discoverHost();if(!root)return 0;let count=0;const used=new Set();
 for(const name of ['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime']){
  const slot=q('[data-ct411-slot="'+name+'"],[data-ct336-slot="'+name+'"],[data-ct388-slot="'+name+'"]',root);if(!slot||!mediaPresent(slot))continue;
  const row=q('.ct411-actions,.ct336-actions,.ct388-actions,.ct309-actions',slot)||actionRows(slot)[0];if(row&&ensureSwap417(row,name,name.startsWith('watch:')?2:3)){count++;used.add(name)}
 }
 const daily=sectionBy('daily');if(daily&&!used.has('daily')){const row=actionRows(daily)[0];if(row&&ensureSwap417(row,'daily',3)){count++;used.add('daily')}}
 for(const bucket of ['watch','fresh']){
  const sec=sectionBy(bucket);if(!sec)continue;const rs=actionRows(sec);const claimed=new Set();
  rs.forEach((row,i)=>{let kind=slotKind(row);if(!kind||claimed.has(kind))kind=['movie','series','anime'].find(k=>!claimed.has(k))||'';if(!kind)return;claimed.add(kind);const name=bucket+':'+kind;if(used.has(name))return;if(ensureSwap417(row,name,bucket==='watch'?2:3)){count++;used.add(name)}});
 }
 document.documentElement.dataset.ct417SwapCount=String(used.size);return used.size;
}
function scheduleForYou417(){const token=++fyRepairToken;for(const ms of[0,60,160,360,750,1400,2600,4500,7000,10500,15000,22000,30000])setTimeout(()=>{if(token!==fyRepairToken||!isForYou())return;repairForYou417()},ms)}
function afterForYou417(){queueMicrotask(()=>repairForYou417());requestAnimationFrame(()=>repairForYou417())}
function wrapPainter417(obj,key){const fn=obj?.[key];if(typeof fn!=='function'||fn.__ctR417Wrapped)return false;const w=function(){const out=fn.apply(this,arguments);afterForYou417();if(out&&typeof out.then==='function')Promise.resolve(out).finally(afterForYou417);return out};w.__ctR417Wrapped=true;w.__ctR417Base=fn;obj[key]=w;return true}
function bindForYou417(){
 for(const o of [window.__ctR411,window.__ctR414,window.__ctR415,window.__ctR416,window.__ctR309,window.__ctR336,window.__ctR359,window.__ctR367]){if(!o||typeof o!=='object')continue;for(const k of['renderForYou','renderSlot','paintForYou','buildForYou','ensureAll'])wrapPainter417(o,k)}
 return true;
}
async function swapForYou417(name,btn){
 if(!name||fyLocks.has(name))return false;fyLocks.add(name);btn?.setAttribute('aria-busy','true');if(btn)btn.disabled=true;
 try{
  let ok=false;try{ok=!!window.__ctR411?.swap?.(name)}catch{}
  if(!ok&&typeof window.__ctR411?.loadForYou==='function'){try{await Promise.resolve(window.__ctR411.loadForYou(false));ok=!!window.__ctR411?.swap?.(name)}catch{}}
  if(!ok&&typeof window.__ctR368?.handle==='function'){try{ok=!!window.__ctR368.handle({action:'swap',name,slot:btn?.closest?.('[data-ct336-slot],[data-ct411-slot],.ct388-slot')||btn?.parentElement,btn,key:''})}catch{}}
  afterForYou417();scheduleForYou417();return ok;
 }finally{fyLocks.delete(name);if(btn?.isConnected){btn.disabled=false;btn.removeAttribute('disabled');btn.removeAttribute('aria-busy')}}
}

/* PROFILE — preserve the approved renderer; only repair the authoritative sports counters. */
let profileSportsTask=null,profileSportsRun=0;
function fmtProfileTime417(minutes){const h=Math.max(0,Math.floor(num(minutes)/60)),m=Math.floor(h/(24*30)),d=Math.floor((h%(24*30))/24),rh=h%24;return m+'M '+String(d).padStart(2,'0')+'D '+String(rh).padStart(2,'0')+'H'}
function patchProfileSports417(stats){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root||!stats)return false;let changed=false;
 for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){
  const label=norm(q('small,label,.label,.stat-label',card)?.textContent||''),val=q('b,strong,.value,.stat-value',card);if(!val)continue;
  if(label==='tempo assistido'||(label.includes('tempo')&&label.includes('assistido')&&card.closest('section,.panel')&&norm(q('h2,h3',card.closest('section,.panel'))?.textContent||'').includes('esportes assistidos'))){val.textContent=fmtProfileTime417(stats.sports_minutes);changed=true}
  if(label==='eventos assistidos'||label==='esportes assistidos'){val.textContent=num(stats.watched_events).toLocaleString('pt-BR');changed=true}
 }
 try{if(typeof profileCache!=='undefined'&&profileCache){profileCache={...profileCache,sports_stats:{...(profileCache.sports_stats||{}),watched_events:num(stats.watched_events),sports_minutes:num(stats.sports_minutes)}};if(typeof ct163Write==='function')ct163Write('profile',profileCache)}}catch{}
 document.documentElement.dataset.ct417ProfileSports=String(num(stats.watched_events))+':'+String(num(stats.sports_minutes));return changed;
}
async function loadProfileSports417(){
 if(profileSportsTask)return profileSportsTask;const run=++profileSportsRun;
 profileSportsTask=(async()=>{let s=null;try{s=await timeout(Promise.resolve(rpc('cinetracker_sport_stats_v1',{})),6000)}catch{};const stats=Array.isArray(s)?s[0]:s;if(!stats)return null;
  if(run!==profileSportsRun||routeNow()!=='profile')return stats;patchProfileSports417(stats);for(const ms of[120,380,900,1800,3200])setTimeout(()=>{if(run===profileSportsRun&&routeNow()==='profile')patchProfileSports417(stats)},ms);return stats;
 })().finally(()=>{profileSportsTask=null});return profileSportsTask;
}
const baseRenderProfile417=typeof renderProfile==='function'?renderProfile:null;
if(baseRenderProfile417)renderProfile=async function(){const out=await baseRenderProfile417.apply(this,arguments);if(routeNow()==='profile')void loadProfileSports417();return out};

/* FORMULA 1 — media_id 865 is the single authority; a session is an episode, never a generic sport watch. */
const F1_MEDIA_ID=865;const f1Locks=new WeakSet();
function f1Progress(){const p=q('[data-ct285-progress],[data-ct284-progress]');const t=String(p?.textContent||'');const m=t.match(/(\d+)\s*\/\s*(\d+)\s*assistidos/i),r=t.match(/(\d+)\s*j[aá]\s*exibidos/i);return{el:p,watched:m?num(m[1]):0,total:m?num(m[2]):0,released:r?num(r[1]):null,text:t}}
function optimisticF1417(btn,on){
 const card=btn?.closest?.('[data-ct285-episode-card],.ct285-episode,.ct284-episode'),em=q('em',card),p=f1Progress();if(!card)return null;
 const snap={card,em,btn,html:btn.outerHTML,status:em?.textContent||'',classes:card.className,progress:p.text};card.classList.toggle('watched',on);card.classList.toggle('ct417-f1-watched',on);if(em)em.textContent=on?'✓ Assistido':'Não assistido';
 if(on){btn.hidden=true;btn.disabled=true;btn.setAttribute('aria-disabled','true');if(p.el&&p.total>0)p.el.textContent=Math.min(p.total,p.watched+1)+'/'+p.total+' assistidos'+(p.released!=null?' · '+p.released+' já exibidos':'')}
 return snap;
}
function rollbackF1417(s){if(!s)return;try{s.card.className=s.classes;if(s.em)s.em.textContent=s.status;if(s.btn?.isConnected){s.btn.hidden=false;s.btn.disabled=false;s.btn.removeAttribute('aria-disabled')}if(f1Progress().el)f1Progress().el.textContent=s.progress}catch{}}
function invalidateF1417(){try{ct284Stable?.clear?.();ct284States?.clear?.();ct285HomePayload=null;ct285CommittedRows=null;homeCache=null;profileCache=null}catch{};document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'f1-series',media_id:F1_MEDIA_ID}}))}
async function mirrorF1417(season,episode,title){
 try{if(typeof ct284Races!=='function'||typeof window.__ctR416?.f1Context!=='function')return;const ctx=window.__ctR416.f1Context(await ct284Races(season),season,episode);if(!ctx?.kind||!ctx?.round||!ctx?.startsAt)return;await rpc('cinetracker_f1_session_watch_set_v314',{p_provider_event_id:'f1:'+season+':'+ctx.round+':'+ctx.kind,p_season:season,p_round:ctx.round,p_session_kind:ctx.kind,p_title:title||ctx.title,p_starts_at:ctx.startsAt,p_watched:true,p_metadata:{source:'series-v417',media_id:F1_MEDIA_ID,episode_number:episode}})}catch{}
}
async function markF1417(btn){
 if(!btn||f1Locks.has(btn))return false;const mid=num(btn.dataset.mediaId),season=num(btn.dataset.season),episode=num(btn.dataset.episode);if(mid!==F1_MEDIA_ID||!season||!episode)return false;
 f1Locks.add(btn);const progress=f1Progress(),snap=optimisticF1417(btn,true),title=btn.dataset.title||q('b',snap?.card)?.textContent||('F1 '+season+' E'+episode);btn.setAttribute('aria-busy','true');
 try{
  await rpc('cinetracker_mark_watch_v0994',{p_media_id:F1_MEDIA_ID,p_item_type:'episode',p_season_number:season,p_episode_number:episode,p_title:title,p_runtime_minutes:null,p_released_episodes:progress.released||null,p_watched_at:new Date().toISOString()});
  invalidateF1417();void mirrorF1417(season,episode,title);try{void ct284State?.('f1',true)}catch{};try{toast('Episódio da Fórmula 1 marcado como assistido')}catch{};return true;
 }catch(e){rollbackF1417(snap);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{};return false}
 finally{f1Locks.delete(btn);if(btn?.isConnected){btn.removeAttribute('aria-busy');if(!btn.hidden)btn.disabled=false}}
}
try{ct285Mark=markF1417}catch{}try{ct284Mark=markF1417}catch{}try{if(window.__ctR285Test)window.__ctR285Test.mark=markF1417}catch{}try{if(window.__ctR416)window.__ctR416.markF1=markF1417}catch{}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const swap=t.closest('[data-ct417-swap]');if(swap){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void swapForYou417(String(swap.dataset.ct417Swap||''),swap);return}
 const home=t.closest('[data-nav="home"]'),tab=t.closest('[data-home-tab]');if(tab&&/filme/i.test(String(tab.textContent||''))){cancelHome417()}else if(home||tab)setTimeout(()=>{if(routeNow()==='home'&&seriesIsVisible())beginHome417()},0);
 if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct263-discover-tab="foryou"]')){bindForYou417();scheduleForYou417()}
 if(t.closest('[data-nav="profile"]'))setTimeout(()=>{if(routeNow()==='profile')void loadProfileSports417()},0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{const r=routeNow();if(r==='home'&&seriesIsVisible())beginHome417();else if(isForYou()){bindForYou417();scheduleForYou417()}else if(r==='profile')void loadProfileSports417()},0));
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())scheduleForYou417();if(routeNow()==='profile')void loadProfileSports417()});
function boot417(n=0){bindForYou417();const r=routeNow();if(r==='home'&&seriesIsVisible()){beginHome417();return}if(isForYou()){scheduleForYou417();return}if(r==='profile'){void loadProfileSports417();return}if(n<50)setTimeout(()=>boot417(n+1),120)}
try{if('scrollRestoration'in history)history.scrollRestoration='manual'}catch{}
window.__ctR417={version:'1.0.208',scope:'home-stable-entry+foryou-visible-swap+profile-sports-truth+f1-series-authority',beginHome:beginHome417,repairForYou:repairForYou417,scheduleForYou:scheduleForYou417,swap:swapForYou417,patchProfileSports:patchProfileSports417,loadProfileSports:loadProfileSports417,markF1:markF1417};
window.__ctR417Marker='final-home-series-anchor+visible-7-swap+profile-sports-rpc+f1-media-865-series';
bindForYou417();queueMicrotask(()=>boot417(0));
})();
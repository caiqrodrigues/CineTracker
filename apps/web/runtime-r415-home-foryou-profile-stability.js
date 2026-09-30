/* CineTracker Web 1.0.206 r415 — stable Home entry + visible Pra Voce Trocar + single-flight Profile. */
(()=>{
'use strict';
if(window.__ctR415?.version==='1.0.206')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const visible=el=>{if(!el?.isConnected)return false;try{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0}catch{return true}};
const authReady=()=>{try{return!!session?.access_token}catch{return false}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);

/* ---------------- HOME SERIES: never paint History as the entry viewport ---------------- */
let homeToken=0,homeTimer=0,homeEntering=false,lastTop=null,stableSamples=0,homeStartedAt=0;
function seriesView(){return q('[data-home-view="series"]')}
function continueSection(){const view=seriesView();if(!view)return null;return q('[data-ct406-bucket="continue"],[data-ct404-bucket="continue"],[data-ct397-bucket="continue"],[data-ct388-bucket="continue"]',view)||qa('section,.home-section,.panel',view).find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))||null}
function historyBusy(){const view=seriesView();if(!view)return true;const h=q('[data-ct274-history="episodes"],[data-ct274-history]',view);if(!h)return false;const text=norm(h.textContent||'');return /carregando|sincronizando|atualizando/.test(text)||!!q('.loader,[aria-busy="true"]',h)}
function targetAbsoluteTop(target){const r=target?.getBoundingClientRect?.();if(!r)return null;return Math.round((window.scrollY||document.documentElement.scrollTop||0)+r.top)}
function revealSeriesEntry(){homeEntering=false;delete document.documentElement.dataset.ct413HomeEntering;delete document.documentElement.dataset.ct415HomeEntering;clearTimeout(homeTimer);homeTimer=0}
function alignSeriesTarget(target){if(!target?.isConnected)return false;const tabs=q('[data-home] .home-tabs'),bottom=tabs?.getBoundingClientRect?.().bottom||0;const current=window.scrollY||document.documentElement.scrollTop||0;const rect=target.getBoundingClientRect();const top=Math.max(0,Math.round(current+rect.top-Math.max(8,Math.ceil(bottom)+8)));try{window.scrollTo({top,left:0,behavior:'auto'})}catch{window.scrollTo(0,top)}target.dataset.ct415HomeStart='1';document.documentElement.dataset.ct415HomeAligned='series';return true}
function homeProbe(token){
 if(token!==homeToken||!homeEntering)return;
 if(routeNow()!=='home'){revealSeriesEntry();return}
 const view=seriesView(),target=continueSection();
 if(view&&(view.hidden||view.classList?.contains('hidden'))){cancelSeriesEntry();return}
 if(!view||!target){homeTimer=setTimeout(()=>homeProbe(token),80);return}
 const top=targetAbsoluteTop(target),busy=historyBusy(),seriesReady=!!document.documentElement.dataset.ct406Series||!!document.documentElement.dataset.ct413HomeAligned||qa('.stack>*',target).length>0;
 if(top!==null&&lastTop!==null&&Math.abs(top-lastTop)<=1&&!busy&&seriesReady)stableSamples++;else stableSamples=0;
 lastTop=top;
 const elapsed=Date.now()-homeStartedAt;
 if(stableSamples>=6||elapsed>=9000){
  alignSeriesTarget(target);
  requestAnimationFrame(()=>{if(token!==homeToken||routeNow()!=='home')return;alignSeriesTarget(target);requestAnimationFrame(()=>{if(token===homeToken){alignSeriesTarget(target);revealSeriesEntry()}})});
  return;
 }
 homeTimer=setTimeout(()=>homeProbe(token),80);
}
function beginSeriesEntry(){
 const token=++homeToken;homeEntering=true;homeStartedAt=Date.now();lastTop=null;stableSamples=0;clearTimeout(homeTimer);delete document.documentElement.dataset.ct413HomeEntering;document.documentElement.dataset.ct415HomeEntering='series';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{try{window.scrollTo(0,0)}catch{}}
 homeTimer=setTimeout(()=>homeProbe(token),0);return token;
}
function cancelSeriesEntry(){homeToken++;revealSeriesEntry();return true}
function onHomePaint415(kind){if(String(kind||'series')==='movies'){if(homeEntering)cancelSeriesEntry();return true}if(routeNow()==='home'&&homeEntering){stableSamples=0;lastTop=null;homeProbe(homeToken)}return true}
try{if(window.__ctR409&&typeof window.__ctR409==='object')window.__ctR409.onHomePaint=onHomePaint415}catch{}
try{if('scrollRestoration'in history)history.scrollRestoration='manual'}catch{}

/* ---------------- PRA VOCE: repair the ACTUAL visible action rows ---------------- */
function discoverState(){return window.__ctR288R263?.discover263||null}
function isForYou(){return routeNow()==='discover'&&(String(discoverState()?.tab||'foryou')==='foryou'||!!q('[data-ct411-foryou],[data-ct336-foryou],[data-ct288-foryou]'))}
function discoverRoot(){const all=qa('[data-ct319-content],[data-ct315-content],[data-ct313-content],[data-ct263-discover-content],[data-discover-content]');return all.find(visible)||all[all.length-1]||null}
function sectionBy(kind){const root=discoverRoot();if(!root)return null;for(const h of qa('h2,h3',root)){const t=norm(h.textContent);if(kind==='daily'&&t==='indicacao do dia')return h.closest('section,.panel')||h.parentElement;if(kind==='watch'&&t==='da sua watchlist')return h.closest('section,.panel')||h.parentElement;if(kind==='fresh'&&(t==='100 novos'||t.includes('100 novos')))return h.closest('section,.panel')||h.parentElement}return null}
function actionButtons(section){return qa('button',section).filter(b=>{const t=norm(b.textContent);return t.includes('watchlist')||t.includes('visto')||t.includes('trocar')})}
function actionGroups(section){const groups=[],seen=new Set();for(const b of actionButtons(section)){const p=b.parentElement;if(!p||seen.has(p))continue;seen.add(p);groups.push(p)}return groups}
function slotKind(row){let el=row;for(let i=0;i<6&&el;i++,el=el.parentElement){const h=q(':scope > h3,:scope > .ct388-cardwrap + h3,h3',el),t=norm(h?.textContent||'');if(t.includes('filme'))return'movie';if(t.includes('anime'))return'anime';if(t.includes('serie'))return'series';const raw=String(el.dataset?.ct411Slot||el.dataset?.ct336Slot||el.dataset?.ct288Slot||el.dataset?.ct382Slot||'');const m=raw.match(/(movie|series|anime)$/);if(m)return m[1]}return''}
function rowHasMedia(row){let el=row;for(let i=0;i<5&&el;i++,el=el.parentElement){if(q('[data-media],article,.ct291-card,.ct288-card',el))return true}return true}
function prepareRow(row,name,cols){if(!row||!rowHasMedia(row))return false;let swap=qa('button',row).find(b=>norm(b.textContent).includes('trocar'));if(!swap){swap=document.createElement('button');row.appendChild(swap)}swap.type='button';swap.hidden=false;swap.removeAttribute('hidden');swap.removeAttribute('disabled');swap.removeAttribute('inert');swap.setAttribute('aria-disabled','false');swap.classList.add('chip','ct415-swap');swap.dataset.ct415Swap=name;swap.textContent='↻ Trocar';row.classList.add('ct415-actions');row.dataset.ct415Cols=String(cols);return true}
function repairForYou(){
 if(!isForYou())return 0;let count=0;
 const daily=sectionBy('daily');if(daily){const g=actionGroups(daily)[0];if(g&&prepareRow(g,'daily',3))count++}
 for(const bucket of ['watch','fresh']){const section=sectionBy(bucket);if(!section)continue;const groups=actionGroups(section).filter(g=>!norm(g.textContent).includes('indicacao do dia'));const used=new Set();groups.forEach((row,i)=>{let kind=slotKind(row);if(!kind||used.has(kind))kind=['movie','series','anime'].find(k=>!used.has(k))||'';if(!kind)return;used.add(kind);if(prepareRow(row,bucket+':'+kind,bucket==='watch'?2:3))count++})}
 document.documentElement.dataset.ct415SwapCount=String(count);return count;
}
let repairToken=0;
function scheduleForYouRepair(){const token=++repairToken;for(const ms of[0,50,140,320,700,1400,2600,4500,7500])setTimeout(()=>{if(token!==repairToken||!isForYou())return;repairForYou()},ms)}
function afterForYouPaint(){queueMicrotask(()=>repairForYou());requestAnimationFrame(()=>repairForYou())}
function wrapPainter(obj,key){const fn=obj?.[key];if(typeof fn!=='function'||fn.__ctR415Wrapped)return false;const w=function(){const out=fn.apply(this,arguments);afterForYouPaint();if(out&&typeof out.then==='function')Promise.resolve(out).finally(afterForYouPaint);return out};w.__ctR415Wrapped=true;w.__ctR415Base=fn;obj[key]=w;return true}
function bindForYouPainters(){for(const o of [window.__ctR411,window.__ctR413,window.__ctR414,window.__ctR410,window.__ctR409,window.__ctR408,window.__ctR407,window.__ctR406,window.__ctR405,window.__ctR404,window.__ctR403,window.__ctR402,window.__ctR401]){if(!o||typeof o!=='object')continue;for(const k of['renderForYou','renderSlot','forceForYou','loadForYou'])wrapPainter(o,k)}return true}
const swapLocks=new Set();
async function swapForYou(name,btn){if(!name||swapLocks.has(name))return false;swapLocks.add(name);btn?.setAttribute('aria-busy','true');try{
 let ok=false;
 for(const call of [
  ()=>window.__ctR411?.swap?.(name),
  ()=>window.__ctR382?.swap?.(name,btn),
  ()=>window.__ctR381?.swap?.(name,btn),
  ()=>window.__ctR363?.handle?.({action:'swap',name})
 ]){try{const v=await Promise.resolve(call());if(v){ok=true;break}}catch{}}
 if(!ok&&typeof window.__ctR411?.loadForYou==='function'){try{await Promise.resolve(window.__ctR411.loadForYou(false));ok=!!window.__ctR411?.swap?.(name)}catch{}}
 afterForYouPaint();scheduleForYouRepair();return ok;
 }finally{btn?.removeAttribute('aria-busy');swapLocks.delete(name)}}

/* ---------------- PROFILE: same renderer, one indexed payload, no legacy fan-out ---------------- */
let profileTask=null,profileRun=0,profileCacheAt=0;
function profileCached(){try{return profileCache||ct163Read('profile')||null}catch{return typeof profileCache!=='undefined'?profileCache:null}}
function profilePaint(data){
 if(!data||routeNow()!=='profile')return false;
 try{profileCache=data}catch{}
 try{ct163Write('profile',data)}catch{}
 try{ct168PaintProfile(data,'')}catch(e){const root=q('[data-profile]');if(root)root.dataset.ct415PaintError=String(e?.message||e)}
 try{window.__ctR312Test?.patchActors312?.(q('[data-profile]'),rows(data.favorite_actors))}catch{}
 decorateProfileDom();return true;
}
function profileStat(root,label){const want=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat',root).find(x=>norm(q('small,label,.stat-label,.label',x)?.textContent||'')===want)||null}
function decorateProfileDom(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;
 try{window.__ctR316?.exactOrder?.()}catch{}
 const panels=qa('section.panel,.panel',root),main=panels.find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'')==='estatisticas'),sports=panels.find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'));if(main&&sports&&main.nextElementSibling!==sports)main.insertAdjacentElement('afterend',sports);
 for(const [label,kind] of [['Séries Watchlist','series'],['Filmes Watchlist','movie']]){const card=profileStat(root,label);if(!card)continue;card.dataset.ct316Watchlist=kind;card.classList.add('ct316-watchlist-stat');card.classList.remove('ct315-watchlist-static');card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-label',kind==='movie'?'Abrir Filmes Watchlist':'Abrir Séries Watchlist');card.setAttribute('title',kind==='movie'?'Abrir Filmes Watchlist':'Abrir Séries Watchlist')}
 root.dataset.ct415Profile='canonical-v380';return true;
}
async function updateSportsProfile(seq){
 const [hist,stadium]=await Promise.all([
  timeout(Promise.resolve(typeof rpc==='function'?rpc('cinetracker_sports_watch_history_v296',{}):[]),4500).catch(()=>[]),
  timeout(Promise.resolve(typeof rpc==='function'?rpc('cinetracker_sports_stadium_summary_v296',{}):null),4500).catch(()=>null)
 ]);
 if(seq!==profileRun||routeNow()!=='profile')return false;
 try{if(Array.isArray(hist)&&profileCache){profileCache={...profileCache,sports_stats:{...(profileCache.sports_stats||{}),watched_events:hist.filter(x=>x?.is_watched!==false).length}};ct163Write('profile',profileCache)}}catch{}
 try{const n=Number(stadium?.stadium_events??stadium?.[0]?.stadium_events??0);window.__ctR313?.canonicalStats?.(q('[data-profile]'),n)}catch{}
 decorateProfileDom();return true;
}
async function renderProfile415(seq){
 const run=++profileRun,cached=profileCached();
 try{setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+(cached?'':loading('Carregando Perfil...'))+'</div>'))}catch{}
 if(cached){profileCacheAt=Date.now();profilePaint(cached)}
 const fetchLive=async()=>{if(typeof rpc!=='function')throw new Error('rpc unavailable');return timeout(Promise.resolve(rpc('cinetracker_profile_v380',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'})),7000)};
 if(!profileTask)profileTask=fetchLive().finally(()=>{profileTask=null});
 let live=null;try{live=await profileTask}catch(e){document.documentElement.dataset.ct415ProfileError=String(e?.message||e)}
 if(run!==profileRun||seq!==navSeq||routeNow()!=='profile')return cached||live||false;
 const data=live||cached;if(!data){const root=q('[data-profile]');if(root)root.innerHTML=typeof fail==='function'?fail('Falha ao carregar Perfil.','profile'):'<div class="empty">Falha ao carregar Perfil.</div>';return false}
 profileCacheAt=Date.now();profilePaint(data);void updateSportsProfile(run);return data;
}
try{renderProfile=renderProfile415}catch{}

/* Event ownership */
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const swap=t.closest('[data-ct415-swap]');if(swap){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void swapForYou(String(swap.dataset.ct415Swap||''),swap);return}
 const navHome=t.closest('[data-nav="home"]'),tab=t.closest('[data-home-tab]');if(tab&&/filme/i.test(String(tab.textContent||''))){cancelSeriesEntry()}else if(navHome||tab)setTimeout(()=>{if(routeNow()==='home')beginSeriesEntry()},0);
 if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct263-discover-tab="foryou"]')){bindForYouPainters();scheduleForYouRepair()}
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')beginSeriesEntry();else if(isForYou()){bindForYouPainters();scheduleForYouRepair()}},0));
window.addEventListener('cinetracker:data-changed',()=>{profileCacheAt=0;if(isForYou())scheduleForYouRepair()});
function bootProbe(n=0){bindForYouPainters();const r=routeNow();if(r==='home'){beginSeriesEntry();return}if(isForYou()){scheduleForYouRepair();return}if(n<50)setTimeout(()=>bootProbe(n+1),120)}
document.documentElement.dataset.ct415HomeEntering='series';
window.__ctR415={version:'1.0.206',scope:'home-series-entry+foryou-swap+profile-load-owner',beginSeriesEntry,onHomePaint:onHomePaint415,repairForYou,scheduleForYouRepair,swap:swapForYou,renderProfile:renderProfile415,decorateProfile:decorateProfileDom};
window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile';
bindForYouPainters();queueMicrotask(()=>bootProbe(0));
})();
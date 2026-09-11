/* CineTracker Web 1.0.38 r247 — WEB ONLY.
   Black-screen recovery and current-runtime-compatible final UI authority. */
(()=>{
'use strict';
if(window.__ctR247)return;
window.__ctR247='black-screen-recovery-current-runtime-authority';
window.__ctR247Scope='web-only';
window.__ctR247Home='eager-canonical-series-refresh';
window.__ctR247Discover='stable-canonical-exclusions';
window.__ctR247Sports='safe-four-tabs-current-runtime';
window.__ctR247F1='persistent-collapse-six-tabs';
window.__ctR247Profile='single-statistics-group';
window.__ctR247Horizontal='local-scrollbars-no-page-x';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route247=()=>String(typeof route==='function'?route():location.pathname||'').replace(/^\//,'');
const raf247=fn=>(window.requestAnimationFrame||((cb)=>setTimeout(cb,0)))(fn);

let homeTimer247=0,lastForcedHome247=0;
function home247(force=false){
 if(route247()!=='home'&&!q('[data-home]'))return;
 const now=Date.now(),shouldForce=force||now-lastForcedHome247>45000;
 if(shouldForce&&typeof window.__ctR245AuditStarted==='function'){lastForcedHome247=now;try{window.__ctR245AuditStarted()}catch(e){console.warn('r247 Home audit',e)}}
 const root=q('[data-home]');if(root){root.dataset.ct247Home='eager-canonical';for(const el of qa('.ct236-home-episode-pending',root))el.dataset.ct247EpisodeVisible='1'}
}

function discover247(){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return;
 const content=q('[data-discover-content]',root)||root;root.dataset.ct247Discover='stable';content.classList.add('ct247-discover-content');
 for(const row of qa('.row,.ct171-top-row,.foryou-grid,[data-top10]',content))row.classList.add('ct247-local-track','ct247-discover-track');
 for(const card of qa('.card,article[data-media],.ct166-slot,.foryou-slot',content))card.classList.add('ct247-discover-card');
}

const SPORT_TABS_247=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
const sportKeys247=new Set(SPORT_TABS_247.map(([k])=>k));
const r247DayStart=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x};
const r247Shift=(d,n)=>{const x=r247DayStart(d);x.setDate(x.getDate()+n);return x};
const r247Limit=()=>Math.max(120,Number(typeof SPORT_PAGE_SIZE!=='undefined'?SPORT_PAGE_SIZE:24)*6);
const r247StartMs=x=>{try{return Number(typeof sportStartMs==='function'?sportStartMs(x):new Date(x?.starts_at||x?.start_time||x?.date||0).getTime())||0}catch{return 0}};
const r247Ended=x=>{try{return typeof sportEnded==='function'?Boolean(sportEnded(x)):['ended','finished','final','encerrado','finalizado'].some(v=>norm(x?.status||'').includes(v))}catch{return false}};
function r247Search(rows){let query='';try{query=norm(typeof sportsState!=='undefined'?sportsState?.query||'':'')}catch{}if(!query)return rows||[];return (rows||[]).filter(x=>norm([x?.title,x?.home_name,x?.away_name,x?.competition_name,x?.league_name,x?.sport_name].filter(Boolean).join(' ')).includes(query))}
function r247Unique(rows){const out=[],seen=new Set();for(const x of rows||[]){const k=String(x?.event_id||x?.id||`${x?.provider||''}|${x?.starts_at||''}|${x?.home_name||''}|${x?.away_name||''}|${x?.title||''}`);if(seen.has(k))continue;seen.add(k);out.push(x)}return out}
let legacyWatchedKey247='watched',sportsPayloadHook247=false,sportsFilterHook247=false;
let legacyPayload247=null,legacyFilter247=null;
try{if(typeof sportsPayload==='function')legacyPayload247=sportsPayload}catch{}
try{if(typeof sportsFiltered==='function')legacyFilter247=sportsFiltered}catch{}
async function withLegacyPayload247(key){if(!legacyPayload247)return[];let old;try{old=sportsState.tab;sportsState.tab=key;return await legacyPayload247()}finally{try{sportsState.tab=old}catch{}}}
function withLegacyFilter247(key,rows){if(!legacyFilter247)return rows||[];let old;try{old=sportsState.tab;sportsState.tab=key;return legacyFilter247(rows)}finally{try{sportsState.tab=old}catch{}}}
async function payload247(){
 let tab='next';try{tab=String(sportsState.tab||'next')}catch{}if(!sportKeys247.has(tab))tab='next';
 if(typeof rpc!=='function'){if(tab==='watched')return withLegacyPayload247(legacyWatchedKey247);return withLegacyPayload247(({next:'today',previous:'recent',favorites:'favorites'})[tab]||tab)}
 if(tab==='next')return rpc('cinetracker_sports_events_v0997',{p_scope:'today',p_limit:r247Limit(),p_offset:0,p_favorite_only:false});
 if(tab==='previous'){const [month,yesterday]=await Promise.all([rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:r247Limit(),p_offset:0,p_favorite_only:false}).catch(()=>[]),rpc('cinetracker_sports_events_v0997',{p_scope:'yesterday',p_limit:r247Limit(),p_offset:0,p_favorite_only:false}).catch(()=>[])]);return r247Unique([...(Array.isArray(month)?month:[]),...(Array.isArray(yesterday)?yesterday:[])])}
 if(tab==='favorites')return rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:r247Limit(),p_offset:0,p_favorite_only:true});
 return withLegacyPayload247(legacyWatchedKey247);
}
function filtered247(rows){
 const list=Array.isArray(rows)?rows:[];let tab='next';try{tab=String(sportsState.tab||'next')}catch{}
 if(tab==='watched')return withLegacyFilter247(legacyWatchedKey247,list);if(tab==='favorites')return r247Search(list);
 const now=window.__ctR247Now?new Date(window.__ctR247Now):new Date(),today=r247DayStart(now),tomorrow=r247Shift(now,1),threeDaysAgo=r247Shift(now,-3);
 if(tab==='next')return r247Search(list.filter(x=>{const ms=r247StartMs(x);return ms>=now.getTime()&&ms<tomorrow.getTime()&&ms>=today.getTime()&&!r247Ended(x)}).sort((a,b)=>r247StartMs(a)-r247StartMs(b)));
 if(tab==='previous')return r247Search(list.filter(x=>{const ms=r247StartMs(x);return ms>=threeDaysAgo.getTime()&&ms<today.getTime()&&(r247Ended(x)||ms<now.getTime())}).sort((a,b)=>r247StartMs(b)-r247StartMs(a)));
 return r247Search(list);
}
try{if(typeof sportsPayload==='function'){sportsPayload=payload247;sportsPayloadHook247=true}}catch{}
try{if(typeof sportsFiltered==='function'){sportsFiltered=filtered247;sportsFilterHook247=true}}catch{}
function isEvent247(el){const t=norm(el?.textContent||'');return t==='eventos'||t==='ver eventos'||t==='agenda'||t==='ver agenda'||el?.hasAttribute?.('data-ct165-open-favorite')}
function isWatch247(el){const t=norm(el?.textContent||'');return t.includes('assistido')||t.includes('marcar como assistido')||t.includes('desmarcar assistido')}
function currentSportTab247(){try{const t=String(sportsState.tab||'');return sportKeys247.has(t)?t:'next'}catch{return'next'}}
function setSportTab247(key){if(!sportKeys247.has(key))return;try{sportsState.tab=key;sportsState.page=0}catch{};try{if(typeof renderSports==='function'){void renderSports();return}if(typeof paintSports==='function')paintSports()}catch(e){console.warn('r247 sports render',e)}setTimeout(sports247,0)}
function sports247(){
 const root=q('[data-sports]');if(!root)return;root.dataset.ct247Sports='four-tabs';const existing=qa('[data-sport-tab]',root);
 for(const b of existing)if(norm(b.textContent||'')==='assistidos')legacyWatchedKey247=String(b.dataset.sportTab||legacyWatchedKey247);
 let host=existing[0]?.parentElement||q('.tabs,.chips,.sport-tabs,[role="tablist"]',root);if(!host){host=document.createElement('div');host.className='tabs ct247-sport-tabs';root.prepend(host)}
 for(const b of qa('[data-sport-tab]',host))b.remove();const active=currentSportTab247();
 for(const [key,label] of SPORT_TABS_247){const b=document.createElement('button');b.type='button';b.className='chip'+(active===key?' active':'');b.dataset.sportTab=key;b.dataset.ct247SportTab='1';b.textContent=label;host.appendChild(b)}
 for(const card of qa('.event-grid > *',root)){for(const el of qa('button,a,[role="button"]',card))if(isEvent247(el))el.remove();const watched=qa('button,a,[role="button"]',card).filter(isWatch247);for(const el of watched.slice(1))el.remove();const w=watched[0];if(!w)continue;const unwatch=norm(w.textContent||'').includes('desmarcar');w.textContent=unwatch?'↶ Desmarcar assistido':'✓ Assistido';w.classList.add('ct247-sport-watch');w.dataset.ct247SportWatch='1'}
}
document.addEventListener('click',e=>{const tab=e.target.closest?.('[data-ct247-sport-tab]');if(tab){e.preventDefault();e.stopImmediatePropagation();setSportTab247(String(tab.dataset.sportTab||'next'));return}const watch=e.target.closest?.('[data-ct247-sport-watch],.ct247-sport-watch');if(watch){watch.classList.remove('ct247-watch-pop');void watch.offsetWidth;watch.classList.add('ct247-watch-pop');setTimeout(()=>watch.classList.remove('ct247-watch-pop'),360)}},true);

const F1_KEY_247='cinetracker:web:f1-hub-open';
const F1_TABS_247=[['overview','Visão geral'],['calendar','Calendário'],['next','Próximo GP'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP']];
let f1Memory247=null;
function readF1Open247(){if(f1Memory247!==null)return f1Memory247;try{const v=localStorage.getItem(F1_KEY_247);f1Memory247=v===null?true:v!=='0'}catch{f1Memory247=true}return f1Memory247}
function persistF1Open247(open){f1Memory247=Boolean(open);try{localStorage.setItem(F1_KEY_247,open?'1':'0')}catch{}}
const legacySetF1Open247=typeof window.__ctR239SetF1Open==='function'?window.__ctR239SetF1Open:null;
function f1Card247(){const direct=q('[data-ct236-f1-card],[data-r235-f1-card],[data-f1-hub],.f1Hub,.f1-hub');if(direct)return direct;const h=qa('h1,h2,h3,h4,b,strong').find(x=>norm(x.textContent)==='f1 hub');return h?.closest?.('.panel,section,article')||null}
function applyF1247(card=f1Card247()){if(!card)return;card=f1Card247()||card;const open=readF1Open247();card.dataset.ct236F1Open=open?'1':'0';card.dataset.ct247F1=open?'open':'collapsed';const toggle=q('[data-ct236-f1-toggle]',card);if(toggle){toggle.textContent=open?'−':'+';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Minimizar F1 Hub':'Expandir F1 Hub')}const body=q('.f1Body,[data-f1-body]',card);if(body)body.hidden=!open;const shell=q('.ct236-f1-shell',card);if(shell)shell.hidden=!open;const tabParent=q('.ct236-f1-tabs',card);if(tabParent){for(const [key,label] of F1_TABS_247){const b=q(`[data-ct236-f1-tab="${key}"]`,tabParent);if(b){b.textContent=label;tabParent.appendChild(b)}}for(const b of qa('[data-ct236-f1-tab]',tabParent))if(!F1_TABS_247.some(([k])=>k===b.dataset.ct236F1Tab))b.remove()}}
function setF1Open247(card,open){persistF1Open247(open);if(card)card.dataset.ct236F1Open=open?'1':'0';if(legacySetF1Open247)legacySetF1Open247(card,open);applyF1247(card)}
window.__ctR239SetF1Open=setF1Open247;

function panelTitle247(panel){return norm(q(':scope > .panel-head h1,:scope > .panel-head h2,:scope > .panel-head h3,:scope > h1,:scope > h2,:scope > h3',panel)?.textContent||'')}
function profile247(){const root=q('[data-profile]');if(!root)return;const panels=qa('section.panel,.panel',root),main=panels.find(p=>panelTitle247(p)==='estatisticas');if(!main)return;const grid=q('.ct-r238-profile-grid,.ct-r180-stats-grid,.ct239-profile-grid,.stats',main);if(!grid)return;grid.classList.add('ct247-profile-grid');for(const panel of panels.filter(p=>['estatisticas de esporte','estatisticas de esportes','estatistica de esporte','estatistica de esportes'].includes(panelTitle247(p)))){for(const stat of qa('.stat',panel)){stat.classList.add('ct247-sport-stat');grid.appendChild(stat)}panel.remove()}main.dataset.ct247Profile='single-statistics-group'}

const DIRECT_X_247='.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,[data-seasons],[data-related],[data-similar],[data-episode-chart]';
const HEADING_X_247=['temporadas','titulos semelhantes','titulos relacionados','relacionados','semelhantes','recomendados','avaliacao dos episodios','avaliacoes dos episodios','notas dos episodios','grafico de episodios'];
function markX247(el){if(el&&el!==document.body&&el!==document.documentElement)el.classList.add('ct247-local-track')}
function horizontal247(){for(const el of qa(DIRECT_X_247))markX247(el);for(const scope of qa('[data-detail],.series-modal,.movie-modal,[data-page="discover"],[data-discover]')){for(const h of qa('h1,h2,h3,h4',scope)){const t=norm(h.textContent||'');if(!HEADING_X_247.some(x=>t===x||t.includes(x)))continue;const panel=h.closest('.panel,section,article')||scope,head=h.closest('.panel-head')||h,candidate=head.nextElementSibling||q('.row,[data-seasons],[data-related],[data-similar],[class*="chart"],[class*="graph"]',panel);if(candidate)markX247(candidate)}for(const row of qa('.row,.carousel,.rail,[class*="related"],[class*="similar"],[class*="season"]',scope))raf247(()=>{if(row.scrollWidth>row.clientWidth+2)markX247(row)})}}

let reconcileTimer247=0,reconciling247=false;
function reconcile247(forceHome=false){if(reconciling247)return;reconciling247=true;try{home247(forceHome);discover247();sports247();applyF1247();profile247();horizontal247()}finally{reconciling247=false}}
function queue247(forceHome=false,delay=20){clearTimeout(reconcileTimer247);reconcileTimer247=setTimeout(()=>reconcile247(forceHome),delay)}
try{new MutationObserver(()=>queue247(false,35)).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>queue247(true,0));window.addEventListener('pageshow',()=>queue247(true,0));document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue247(true,0)});document.addEventListener('cinetracker:data-changed',()=>queue247(true,0));
try{const basePaintSports247=paintSports;paintSports=function(...a){const out=basePaintSports247.apply(this,a);queue247(false,0);return out}}catch{}
try{const baseRenderProfile247=renderProfile;renderProfile=async function(...a){const out=await baseRenderProfile247.apply(this,a);profile247();return out}}catch{}
try{const basePaintDiscover247=paintDiscover;paintDiscover=function(...a){const out=basePaintDiscover247.apply(this,a);discover247();horizontal247();return out}}catch{}
window.__ctR247SetSportTab=setSportTab247;window.__ctR247SportsFilter=(rows,tab,now)=>{let old;try{old=sportsState.tab;sportsState.tab=tab;window.__ctR247Now=now;return filtered247(rows)}finally{try{sportsState.tab=old}catch{};delete window.__ctR247Now}};
window.__ctR247HomeRefresh=home247;window.__ctR247DiscoverStabilize=discover247;window.__ctR247SportsNormalize=sports247;window.__ctR247SetF1Open=setF1Open247;window.__ctR247ApplyF1=applyF1247;window.__ctR247Profile=profile247;window.__ctR247Horizontal=horizontal247;window.__ctR247Reconcile=reconcile247;window.__ctR247Debug=()=>({sportsPayloadHook:sportsPayloadHook247,sportsFilterHook:sportsFilterHook247,legacyWatchedKey:legacyWatchedKey247});
queue247(true,0);
})();

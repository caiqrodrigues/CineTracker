/* CineTracker Web 1.0.185 r394 — Home semantic entry + Pra Voce loader authority. */
(()=>{
'use strict';
if(window.__ctR394?.version==='1.0.185')return;
window.__ctR394Marker='home-after-history-anchor+foryou-entrypoint-authority';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const activeHomeKind=()=>{try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}};
let homeToken=0,homeUserMoved=false,homeGuardUntil=0,forYouLock=false;
function homeAnchor(kind=activeHomeKind()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 const wanted=kind==='movies'?/assistir\s*a\s*seguir\s*\/\s*watchlist/i:/assistir\s*a\s*seguir/i;
 return [...view.children].find(x=>x.nodeType===1&&!/hist/i.test(String(x.dataset?.ct388History||''))&&wanted.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))
  || [...view.children].find(x=>x.nodeType===1&&!/hist/i.test(String(x.dataset?.ct388History||''))&&!/hist[oó]rico/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))||null;
}
function homeTargetTop(){const tabs=q('[data-home] .home-tabs');const r=tabs?.getBoundingClientRect?.();return Math.max(8,Math.ceil(Number.isFinite(r?.bottom)?r.bottom:0)+8)}
function homeScrollRoots(target){const out=[];let p=target?.parentElement;while(p&&p!==document.body&&p!==document.documentElement){try{const cs=getComputedStyle(p),oy=String(cs.overflowY||'');if((/auto|scroll/.test(oy)||p.scrollHeight>p.clientHeight+2)&&p.scrollHeight>p.clientHeight+2)out.push(p)}catch{}p=p.parentElement}return out}
function alignHome394(kind=activeHomeKind(),token=homeToken){
 if(routeNow()!=='home'||token!==homeToken||homeUserMoved)return false;const target=homeAnchor(kind);if(!target)return false;
 const desired=homeTargetTop();for(const el of homeScrollRoots(target)){try{const rr=el.getBoundingClientRect(),localDesired=Math.max(rr.top+8,desired),delta=target.getBoundingClientRect().top-localDesired;if(Math.abs(delta)>1)el.scrollTop+=delta}catch{}}
 try{const delta=target.getBoundingClientRect().top-desired;if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'auto'})}catch{}
 target.dataset.ct394HomeStart='1';document.documentElement.dataset.ct394HomeAligned=kind;return true;
}
function beginHome394(kind=activeHomeKind()){
 const token=++homeToken;homeUserMoved=false;homeGuardUntil=Date.now()+350;alignHome394(kind,token);queueMicrotask(()=>alignHome394(kind,token));requestAnimationFrame(()=>alignHome394(kind,token));return token;
}
function finishHome394(kind,token){
 if(token!==homeToken||homeUserMoved)return false;alignHome394(kind,token);requestAnimationFrame(()=>alignHome394(kind,token));for(const ms of [40,160,420])setTimeout(()=>alignHome394(kind,token),ms);return true;
}
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'&&Date.now()>=homeGuardUntil)homeUserMoved=true},{passive:true,capture:true});
window.addEventListener('keydown',e=>{if(routeNow()==='home'&&Date.now()>=homeGuardUntil&&['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' '].includes(e.key))homeUserMoved=true},true);
const baseRenderHome=window.__ctR388?.renderHome;
async function renderHome394(){
 if(typeof baseRenderHome!=='function')return false;const kind=activeHomeKind(),token=beginHome394(kind);let out=false;
 try{out=await baseRenderHome()}finally{if(routeNow()==='home')finishHome394(activeHomeKind(),token)}return out;
}
if(typeof baseRenderHome==='function'){try{renderHome=renderHome394}catch{}if(window.__ctR388)window.__ctR388.renderHome=renderHome394;if(window.__ctR393)window.__ctR393.renderHome=renderHome394}
function installForYou394(){
 const load=window.__ctR388?.loadForYou,paint=window.__ctR388?.renderForYou,early=window.__ctR388?.early;if(typeof load!=='function')return false;
 for(const name of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[name]=load;
 for(const obj of ['__ctR321','__ctR382','__ctR383','__ctR384','__ctR385','__ctR393'])if(window[obj]&&typeof window[obj]==='object')window[obj].loadForYou=load;
 if(window.__ctR336&&typeof window.__ctR336==='object'&&typeof paint==='function')window.__ctR336.paintForYou=paint;
 if(typeof early==='function')window.__ctR336EarlyHandle=early;
 document.documentElement.dataset.ct394ForYouOwner='r388';return true;
}
async function ensureForYou394(force=false){
 installForYou394();if(routeNow()!=='discover'||String(window.__ctR288R263?.discover263?.tab||'foryou')!=='foryou'||forYouLock)return false;const load=window.__ctR388?.loadForYou;if(typeof load!=='function')return false;
 forYouLock=true;try{return await load(!!force)}finally{forYouLock=false}
}
installForYou394();queueMicrotask(installForYou394);setTimeout(()=>{installForYou394();if(routeNow()==='discover')void ensureForYou394(false)},0);
window.addEventListener('popstate',()=>setTimeout(()=>{installForYou394();if(routeNow()==='discover')void ensureForYou394(false)},0));
window.__ctR394={version:'1.0.185',renderHome:renderHome394,alignHome:alignHome394,beginHome:beginHome394,finishHome:finishHome394,installForYou:installForYou394,loadForYou:ensureForYou394};
})();
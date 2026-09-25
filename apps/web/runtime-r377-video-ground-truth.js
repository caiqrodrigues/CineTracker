/* CineTracker Web 1.0.168 r377 — video-ground-truth Home + Pra Voce interaction hardening. */
(()=>{
'use strict';
if(window.__ctR377?.version==='1.0.168')return;
window.__ctR377Marker='native-watch-sort+rich-movie-meta+home-timeout-cache-fallback+foryou-physical-owner';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let fyRun=0;

function paintForYouNow(){
 if(routeNow()!=='discover')return false;
 let ok=false;try{ok=!!window.__ctR336?.paintForYou?.()}catch{}
 try{window.__ctR376?.fyEnsureAll?.()}catch{}
 return ok;
}
async function refreshForYou(){
 if(routeNow()!=='discover')return false;const run=++fyRun;
 paintForYouNow();
 const load=window.__ctR321?.loadForYou?.(false);
 const quick=()=>{if(run!==fyRun||routeNow()!=='discover')return;paintForYouNow();void window.__ctR376?.ensureFreshAll?.()};
 setTimeout(quick,180);setTimeout(quick,900);
 try{await Promise.resolve(load)}catch{}
 if(run!==fyRun||routeNow()!=='discover')return false;
 paintForYouNow();await Promise.resolve(window.__ctR376?.ensureFreshAll?.()).catch(()=>false);paintForYouNow();return true;
}
window.addEventListener('click',e=>{
 if(routeNow()!=='discover')return;
 const tab=e.target?.closest?.('[data-ct319-tab="foryou"]');if(!tab)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
 try{const d=window.__ctR288R263?.discover263;if(d)d.tab='foryou'}catch{}
 qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',b===tab));
 void refreshForYou();
},true);

setTimeout(()=>{try{const d=window.__ctR288R263?.discover263;if(routeNow()==='discover'&&String(d?.tab||'foryou')==='foryou')void refreshForYou()}catch{}},0);

window.__ctR377={version:'1.0.168',paintForYouNow,refreshForYou,get run(){return fyRun}};
})();
/* CineTracker Web 1.0.225 r434 — Descobrir > Pra Você: first-click owner. */
(()=>{
'use strict';
if(window.__ctR434?.version==='1.0.225')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const discoverState=()=>window.__ctR288R263?.discover263||null;
const owner=()=>window.__ctR309&&typeof window.__ctR309.buildForYou==='function'?window.__ctR309:null;
const isDiscover=()=>routeNow()==='discover';
const isForYou=()=>isDiscover()&&String(discoverState()?.tab||'')==='foryou';
const setForYou=()=>{
 const s=discoverState();if(!s)return false;
 s.tab='foryou';s.type='all';s.gen=Number(s.gen||0)+1;
 try{window.__ctR288R263.discover263=s}catch{}
 try{window.ct288SyncShell?.()}catch{}
 return true;
};
const load=async(force=false)=>{
 if(!isDiscover()||!setForYou())return false;
 const o=owner();if(!o)return false;
 try{return !!(await o.buildForYou(!!force))}catch{return false}
};
const swap=name=>{
 if(!isForYou())return false;
 const o=owner();if(!o||typeof o.swap!=='function')return false;
 try{return !!o.swap(String(name||''))}catch{return false}
};
const tabTarget=t=>t?.closest?.('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
const textual=t=>{
 const b=t?.closest?.('button,a,[role="tab"]');if(!b)return false;
 return /pra\\s*voce/i.test(String(b.textContent||''))&&!!b.closest?.('[data-ct288-discover],[data-ct263-discover],[data-discover],[data-ct288-tabs]');
};
const click=e=>{
 const t=e.target;
 const s=t?.closest?.('[data-ct309-swap]');
 if(s&&isForYou()){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();swap(s.dataset.ct309Swap||'');return}
 const tab=tabTarget(t)||textual(t);
 if(!tab||!isDiscover())return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
 void load(false);
};
window.addEventListener('click',click,true);
window.__ctR434={version:'1.0.225',scope:'discover-foryou-only',setForYou,load,swap};
if(isForYou())queueMicrotask(()=>void load(false));
})();
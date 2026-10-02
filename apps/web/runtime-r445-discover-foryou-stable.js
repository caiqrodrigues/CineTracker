/* CineTracker Web 1.0.236 r445 — Descobrir > Pra Você: single-flight, no page re-entry. */
(()=>{'use strict';
if(window.__ctR445?.version==='1.0.236')return;
const isFY=()=>{try{return String(typeof route==='function'?route():'')==='discover'&&String(window.__ctR288R263?.discover263?.tab||'')==='foryou'}catch{return false}};
const api=window.__ctR309;
if(!api||typeof api.buildForYou!=='function')return;
const original=api.buildForYou.bind(api);
let inFlight=null,lastAt=0,lastResult=false;
const buildForYou=async(force=false)=>{
 if(!isFY())return false;
 if(inFlight)return inFlight;
 if(!force&&lastAt>0&&Date.now()-lastAt<15000)return lastResult;
 inFlight=Promise.resolve().then(()=>original(!!force)).then(v=>{lastAt=Date.now();lastResult=!!v;return !!v}).catch(()=>false).finally(()=>{inFlight=null});
 return inFlight;
};
api.buildForYou=buildForYou;
if(window.__ctR309Api)window.__ctR309Api.buildForYou=buildForYou;
const cleanRefreshQuery=()=>{
 try{
  const u=new URL(location.href);
  if(!u.searchParams.has('ct_refresh'))return;
  u.searchParams.delete('ct_refresh');
  history.replaceState(history.state,'',u.pathname+(u.search?u.search:'')+(u.hash||''));
 }catch{}
};
cleanRefreshQuery();
window.__ctR445={version:'1.0.236',scope:'discover-foryou-only',singleFlight:true,automaticReentryBlocked:true,buildForYou};
})();
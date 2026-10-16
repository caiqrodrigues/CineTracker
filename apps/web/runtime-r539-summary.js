/* CineTracker Web 0.3.66 r539 — all-time special-series progress with matching units. */
(()=>{
'use strict';
if(window.__ctR516SpecialSummary?.version==='0.3.66')return;
const core=()=>window.__ctCoreR471||null;
const sessionKey='ct539:special-summary',localKey='ct539:special-summary:authoritative',DAY=86400000,WEEK=7*DAY;
const floors={f1:1166,ufc:793,wwe:567};
let summary=null,task=null;
const num=v=>Math.max(0,Number(v||0)||0);
const valid=v=>v&&['f1','ufc','wwe'].every(k=>num(v?.[k]?.total)>=floors[k]&&num(v?.[k]?.watched)<=num(v?.[k]?.total));
function readStore(store,key,maxAge){try{const x=JSON.parse(store.getItem(key)||'null');return x&&Date.now()-num(x.at)<maxAge&&valid(x.data)?x.data:null}catch{return null}}
function read(){return readStore(sessionStorage,sessionKey,DAY)||readStore(localStorage,localKey,WEEK)}
function write(v){if(!valid(v))return;const raw=JSON.stringify({at:Date.now(),data:v});try{sessionStorage.setItem(sessionKey,raw);localStorage.setItem(localKey,raw)}catch{}}
function get(k){return summary?.[k]||null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
function shapeDb(raw){
 const r=Array.isArray(raw)&&raw.length===1?raw[0]:raw||{};
 return{
  f1:{watched:num(r?.f1?.watched),total:Math.max(floors.f1,num(r?.f1?.total),num(r?.f1?.watched)),watched_sessions:num(r?.f1?.watched_sessions),source:'db-v539-race-only'},
  ufc:{watched:num(r?.ufc?.watched),total:Math.max(floors.ufc,num(r?.ufc?.total),num(r?.ufc?.watched)),source:'db-v539-events'},
  wwe:{watched:num(r?.wwe_ppv?.watched),total:Math.max(floors.wwe,num(r?.wwe_ppv?.total),num(r?.wwe_ppv?.watched)),source:'db-v539-supercards'}
 }
}
function growFromRemote(base,d){
 if(!base||!d)return base;
 return{
  f1:{...base.f1,total:Math.max(base.f1.total,num(d?.f1?.total))},
  ufc:{...base.ufc,total:Math.max(base.ufc.total,num(d?.ufc?.total))},
  wwe:{...base.wwe,total:Math.max(base.wwe.total,num(d?.wwe?.total))}
 }
}
async function load(force=false){
 if(task)return task;
 if(!summary){summary=read();if(summary)repaint()}
 task=(async()=>{try{
  const raw=await core()?.rpc?.('cinetracker_special_series_counts_v539',{});
  const next=shapeDb(raw);
  if(valid(next)){summary=next;write(next);document.documentElement.dataset.ct539SpecialSummary=[next.f1.watched+'/'+next.f1.total,next.ufc.watched+'/'+next.ufc.total,next.wwe.watched+'/'+next.wwe.total].join('|');repaint()}
  void Promise.resolve(core()?.edge?.('ct-special-series-summary',{})).then(d=>{
   if(!summary||!d)return;
   const grown=growFromRemote(summary,d);
   if(valid(grown)&&(grown.f1.total!==summary.f1.total||grown.ufc.total!==summary.ufc.total||grown.wwe.total!==summary.wwe.total)){summary=grown;write(grown);repaint()}
  }).catch(()=>{});
  return summary
 }catch(e){
  document.documentElement.dataset.ct539SpecialSummaryError=String(e?.message||e);
  if(summary){repaint();return summary}
  return null
 }finally{task=null}})();
 return task
}
const refresh=()=>void load(true);
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:ufc-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,refresh);
document.addEventListener('cinetracker:data-changed',e=>{if(['f1','ufc','wwe'].includes(String(e?.detail?.type||'')))refresh()});
window.__ctR539SummaryMarker='db-first-global-progress+f1-race-only+ufc-wwe-events';
window.__ctR516SpecialSummary={version:'0.3.66',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();
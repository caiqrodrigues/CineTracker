/* CineTracker Web 0.3.43 r516 — final movie owner support + global F1/UFC series progress. */
(()=>{
'use strict';
if(window.__ctR516SpecialSummary?.version==='0.3.43')return;
const core=()=>window.__ctCoreR471||null;
let summary=null,task=null;
const cacheKey='ct516:special-summary';
function normalize(v){const raw=Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?v[0]:v;return raw?.f1||raw?.ufc?raw:null}
function readCache(){try{const x=JSON.parse(sessionStorage.getItem(cacheKey)||'null');return x&&Date.now()-Number(x.at||0)<10*60*1000?x.data:null}catch{return null}}
function writeCache(v){try{sessionStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),data:v}))}catch{}}
function get(key){const x=summary?.[key];return x&&typeof x==='object'?x:null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
async function load(force=false){
 if(task)return task;
 if(!force&&!summary){summary=normalize(readCache());if(summary)repaint()}
 task=(async()=>{let out=null;
  try{out=normalize(await core()?.edge?.('ct-special-series-summary',{}))}catch(e){document.documentElement.dataset.ct516SpecialEdgeError=String(e?.message||e)}
  if(!out)try{const db=normalize(await core()?.rpc?.('cinetracker_special_series_progress_v516',{}));if(db)out={f1:{watched:Number(db?.f1?.watched||0),total:Math.max(Number(db?.f1?.mapped_sessions||0),Number(db?.f1?.watched||0)),source:'db-fallback'},ufc:{watched:Number(db?.ufc?.watched||0),total:Math.max(Number(db?.ufc?.known_events||0),Number(db?.ufc?.watched||0)),source:'db-fallback'}}}catch(e){document.documentElement.dataset.ct516SpecialDbError=String(e?.message||e)}
  if(out){summary=out;writeCache(out);document.documentElement.dataset.ct516SpecialSummary=(out.f1?.watched||0)+':'+(out.f1?.total||0)+'|'+(out.ufc?.watched||0)+':'+(out.ufc?.total||0);repaint()}
  return summary;
 })().finally(()=>{task=null});
 return task;
}
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:sports-watched-changed'])window.addEventListener(ev,()=>{try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)});
document.addEventListener('cinetracker:data-changed',e=>{const t=String(e?.detail?.type||'');if(t==='f1'||t==='ufc'){try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)}});
window.__ctR516SpecialSummary={version:'0.3.43',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();

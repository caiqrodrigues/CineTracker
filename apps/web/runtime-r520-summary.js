/* CineTracker Web 0.3.47 r520 — watched totals for F1 + UFC + WWE PPV. */
(()=>{
'use strict';
const core=()=>window.__ctCoreR471||null;let summary=null,task=null;const cacheKey='ct520:special-summary';
function unwrap(v){return Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?v[0]:v}
function readCache(){try{const x=JSON.parse(sessionStorage.getItem(cacheKey)||'null');return x&&Date.now()-Number(x.at||0)<10*60*1000?x.data:null}catch{return null}}
function writeCache(v){try{sessionStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),data:v}))}catch{}}
function get(key){const x=summary?.[key];return x&&typeof x==='object'?x:null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
async function load(force=false){
 if(task)return task;if(!force&&!summary){summary=readCache();if(summary)repaint()}
 task=(async()=>{try{
  const got=await Promise.allSettled([core()?.rpc?.('cinetracker_special_series_progress_v518',{}),core()?.rpc?.('cinetracker_special_series_progress_v519',{})]),a=got[0].status==='fulfilled'?unwrap(got[0].value):null,b=got[1].status==='fulfilled'?unwrap(got[1].value):null;
  if(a||b){summary={
   f1:{watched:Number(a?.f1?.watched??b?.f1?.watched??0),mapped_sessions:Number(a?.f1?.mapped_sessions??b?.f1?.mapped_sessions??0),source:'db-r520'},
   ufc:{watched:Number(a?.ufc?.watched||0),known_events:Number(a?.ufc?.known_events||0),source:'db-r520'},
   wwe:{watched:Number(b?.wwe_ppv?.watched||0),known_events:Number(b?.wwe_ppv?.known_events||0),source:'db-r520'}
  };writeCache(summary);document.documentElement.dataset.ct520SpecialSummary=[summary.f1.watched,summary.ufc.watched,summary.wwe.watched].join('|');repaint()}
  return summary
 }catch(e){document.documentElement.dataset.ct520SpecialSummaryError=String(e?.message||e);return summary}})().finally(()=>{task=null});return task
}
function invalidate(){try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)}
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:sports-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,invalidate);
document.addEventListener('cinetracker:data-changed',e=>{if(['f1','ufc','wwe'].includes(String(e?.detail?.type||'')))invalidate()});
window.__ctR516SpecialSummary={version:'0.3.47',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();
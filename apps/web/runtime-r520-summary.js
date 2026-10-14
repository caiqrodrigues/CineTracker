/* CineTracker Web 0.3.47 r520 — authoritative all-time totals for F1/UFC/WWE. */
(()=>{
'use strict';
if(window.__ctR516SpecialSummary?.version==='0.3.47')return;
const core=()=>window.__ctCoreR471||null;let summary=null,task=null;const cacheKey='ct520:special-summary';
const read=()=>{try{const x=JSON.parse(sessionStorage.getItem(cacheKey)||'null');return x&&Date.now()-Number(x.at||0)<10*60*1000?x.data:null}catch{return null}},write=v=>{try{sessionStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),data:v}))}catch{}};
function get(key){return summary?.[key]||null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
async function load(force=false){
 if(task)return task;if(!force&&!summary){summary=read();if(summary)repaint()}
 task=(async()=>{try{
  let d=null;
  try{d=await core()?.edge?.('ct-special-series-summary',{})}catch{}
  if(!d?.f1||!d?.ufc||!d?.wwe){
   const p=await core()?.rpc?.('cinetracker_special_series_progress_v520',{}),raw=Array.isArray(p)&&p.length===1?p[0]:p||{};
   d={f1:{watched:Number(raw?.f1?.watched||0),total:Number(raw?.f1?.mapped_races||raw?.f1?.mapped_sessions||0),source:'db-fallback'},ufc:{watched:Number(raw?.ufc?.watched||0),total:Number(raw?.ufc?.known_events||0),source:'db-fallback'},wwe:{watched:Number(raw?.wwe_ppv?.watched||0),total:Number(raw?.wwe_ppv?.known_events||0),source:'db-fallback'}}
  }
  summary={f1:{watched:Number(d?.f1?.watched||0),total:Number(d?.f1?.total||0),source:String(d?.f1?.source||'')},ufc:{watched:Number(d?.ufc?.watched||0),total:Number(d?.ufc?.total||0),source:String(d?.ufc?.source||'')},wwe:{watched:Number(d?.wwe?.watched||0),total:Number(d?.wwe?.total||0),source:String(d?.wwe?.source||'')}};
  write(summary);document.documentElement.dataset.ct520SpecialSummary=[summary.f1.total,summary.ufc.total,summary.wwe.total].join('|');repaint();return summary
 }catch(e){document.documentElement.dataset.ct520SpecialSummaryError=String(e?.message||e);return summary}finally{task=null}})();return task
}
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:ufc-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,()=>{try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)});
document.addEventListener('cinetracker:data-changed',e=>{if(['f1','ufc','wwe'].includes(String(e?.detail?.type||''))){try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)}});
window.__ctR516SpecialSummary={version:'0.3.47',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();
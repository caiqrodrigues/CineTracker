/* CineTracker Web 0.3.65 r538 — stable authoritative totals only. */
(()=>{
'use strict';
if(window.__ctR516SpecialSummary?.version==='0.3.65')return;
const core=()=>window.__ctCoreR471||null;
const sessionKey='ct538:special-summary',localKey='ct538:special-summary:authoritative',DAY=86400000,WEEK=7*DAY;
const floors={f1:1166,ufc:793,wwe:567};
let summary=null,task=null;

const valid=v=>v&&['f1','ufc','wwe'].every(k=>Number(v?.[k]?.total||0)>=floors[k]);
function readStore(store,key,maxAge){try{const x=JSON.parse(store.getItem(key)||'null');return x&&Date.now()-Number(x.at||0)<maxAge&&valid(x.data)?x.data:null}catch{return null}}
function read(){return readStore(sessionStorage,sessionKey,DAY)||readStore(localStorage,localKey,WEEK)}
function write(v){if(!valid(v))return;const raw=JSON.stringify({at:Date.now(),data:v});try{sessionStorage.setItem(sessionKey,raw);localStorage.setItem(localKey,raw)}catch{}}
function get(k){return summary?.[k]||null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
function shape(d){
 return{
  f1:{watched:Number(d?.f1?.watched||0),total:Math.max(floors.f1,Number(d?.f1?.total||0),Number(d?.f1?.watched||0)),source:String(d?.f1?.source||'')},
  ufc:{watched:Number(d?.ufc?.watched||0),total:Math.max(floors.ufc,Number(d?.ufc?.total||0),Number(d?.ufc?.watched||0)),source:String(d?.ufc?.source||'')},
  wwe:{watched:Number(d?.wwe?.watched||0),total:Math.max(floors.wwe,Number(d?.wwe?.total||0),Number(d?.wwe?.watched||0)),source:String(d?.wwe?.source||'')}
 }
}
async function dbFallback(){
 const p=await core()?.rpc?.('cinetracker_special_series_counts_v538',{}),r=Array.isArray(p)&&p.length===1?p[0]:p||{};
 return shape({
  f1:{watched:Number(r?.f1?.watched||0),total:Number(r?.f1?.total||0),source:'db-v538-stable-floor'},
  ufc:{watched:Number(r?.ufc?.watched||0),total:Number(r?.ufc?.total||0),source:'db-v538-stable-floor'},
  wwe:{watched:Number(r?.wwe_ppv?.watched||0),total:Number(r?.wwe_ppv?.total||0),source:'db-v538-stable-floor'}
 })
}
async function load(force=false){
 if(task)return task;
 if(!summary){summary=read();if(summary)repaint()}
 if(summary&&!force&&valid(summary))return summary;
 task=(async()=>{try{
  let next=null;
  try{
   const d=await core()?.edge?.('ct-special-series-summary',{});
   if(d?.f1&&d?.ufc&&d?.wwe)next=shape(d)
  }catch(e){document.documentElement.dataset.ct538SpecialSummaryRemoteError=String(e?.message||e)}
  if(!valid(next))try{next=await dbFallback()}catch(e){document.documentElement.dataset.ct538SpecialSummaryDbError=String(e?.message||e)}
  if(valid(next)){
   summary=next;write(next);
   document.documentElement.dataset.ct538SpecialSummary=[next.f1.total,next.ufc.total,next.wwe.total].join('|');
   repaint();return summary
  }
  if(summary&&valid(summary)){repaint();return summary}
  return summary
 }catch(e){document.documentElement.dataset.ct538SpecialSummaryError=String(e?.message||e);return summary}
 finally{task=null}})();
 return task
}
const refresh=()=>void load(true);
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:ufc-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,refresh);
document.addEventListener('cinetracker:data-changed',e=>{if(['f1','ufc','wwe'].includes(String(e?.detail?.type||'')))refresh()});
window.__ctR538SummaryMarker='stable-counts-v538+public-growth';
window.__ctR516SpecialSummary={version:'0.3.65',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();

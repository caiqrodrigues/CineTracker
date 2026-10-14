/* CineTracker Web 0.3.48 r521 — persistent authoritative totals. */
(()=>{
'use strict';
if(window.__ctR516SpecialSummary?.version==='0.3.48')return;
const core=()=>window.__ctCoreR471||null,sessionKey='ct521:special-summary',localKey='ct521:special-summary:authoritative',DAY=86400000,WEEK=7*DAY;let summary=null,task=null;
const valid=v=>v&&['f1','ufc','wwe'].every(k=>Number(v?.[k]?.total||0)>0)&&!['f1','ufc','wwe'].some(k=>String(v?.[k]?.source||'').includes('db-fallback'));
function readStore(store,key,maxAge){try{const x=JSON.parse(store.getItem(key)||'null');return x&&Date.now()-Number(x.at||0)<maxAge&&valid(x.data)?x.data:null}catch{return null}}
function read(){return readStore(sessionStorage,sessionKey,DAY)||readStore(localStorage,localKey,WEEK)||readStore(sessionStorage,'ct520:special-summary',DAY)}
function write(v){if(!valid(v))return;const raw=JSON.stringify({at:Date.now(),data:v});try{sessionStorage.setItem(sessionKey,raw);localStorage.setItem(localKey,raw)}catch{}}
function get(k){return summary?.[k]||null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
const shape=d=>({f1:{watched:Number(d?.f1?.watched||0),total:Number(d?.f1?.total||0),source:String(d?.f1?.source||''),authoritative:true},ufc:{watched:Number(d?.ufc?.watched||0),total:Number(d?.ufc?.total||0),source:String(d?.ufc?.source||''),authoritative:true},wwe:{watched:Number(d?.wwe?.watched||0),total:Number(d?.wwe?.total||0),source:String(d?.wwe?.source||''),authoritative:true}});
async function progress(){try{const p=await core()?.rpc?.('cinetracker_special_series_progress_v520',{}),r=Array.isArray(p)&&p.length===1?p[0]:p||{};return{f1:Number(r?.f1?.watched||0),ufc:Number(r?.ufc?.watched||0),wwe:Number(r?.wwe_ppv?.watched||0)}}catch{return{f1:0,ufc:0,wwe:0}}}
async function load(force=false){
 if(task)return task;if(!summary){summary=read();if(summary)repaint()}if(summary&&!force&&valid(summary))return summary;
 task=(async()=>{try{
  let d=null;try{d=await core()?.edge?.('ct-special-series-summary',{})}catch(e){document.documentElement.dataset.ct521SpecialSummaryRemoteError=String(e?.message||e)}
  if(d?.f1&&d?.ufc&&d?.wwe){const next=shape(d);if(valid(next)){summary=next;write(next);document.documentElement.dataset.ct521SpecialSummary=[next.f1.total,next.ufc.total,next.wwe.total].join('|');repaint();return summary}}
  const p=await progress();if(summary&&valid(summary)){for(const k of ['f1','ufc','wwe'])summary[k].watched=Math.max(Number(summary[k].watched||0),Number(p[k]||0));repaint();return summary}
  summary={f1:{watched:p.f1,total:0,source:'local-progress-only',authoritative:false},ufc:{watched:p.ufc,total:0,source:'local-progress-only',authoritative:false},wwe:{watched:p.wwe,total:0,source:'local-progress-only',authoritative:false}};repaint();return summary
 }catch(e){document.documentElement.dataset.ct521SpecialSummaryError=String(e?.message||e);return summary}finally{task=null}})();return task
}
const refresh=()=>void load(true);for(const ev of ['cinetracker:f1-watched-changed','cinetracker:ufc-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,refresh);
document.addEventListener('cinetracker:data-changed',e=>{if(['f1','ufc','wwe'].includes(String(e?.detail?.type||'')))refresh()});
window.__ctR521SummaryMarker='authoritative-persistent-no-partial-denominator';
window.__ctR516SpecialSummary={version:'0.3.48',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();
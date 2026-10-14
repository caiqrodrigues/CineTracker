/* CineTracker Web 0.3.47 r520 — public catalog totals + personal progress for all three special series. */
(()=>{
'use strict';
const core=()=>window.__ctCoreR471||null;let summary=null,task=null;const cacheKey='ct520:special-summary';
function normalize(v){const raw=Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?v[0]:v;return raw&&typeof raw==='object'?raw:null}
function readCache(){try{const x=JSON.parse(sessionStorage.getItem(cacheKey)||'null');return x&&Date.now()-Number(x.at||0)<30*60*1000?x.data:null}catch{return null}}
function writeCache(v){try{sessionStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),data:v}))}catch{}}
function get(key){const x=summary?.[key];return x&&typeof x==='object'?x:null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
async function load(force=false){if(task)return task;if(!force&&!summary){summary=normalize(readCache());if(summary)repaint()}task=(async()=>{try{let data=null;try{data=normalize(await core()?.edge?.('ct-special-series-summary',{}))}catch{}if(!data?.f1||!data?.ufc||!data?.wwe){const db=normalize(await core()?.rpc?.('cinetracker_special_series_progress_v520',{}));if(db)data={f1:{watched:Number(db?.f1?.watched||0),total:Number(db?.f1?.mapped_races||0),source:'db-v520'},ufc:{watched:Number(db?.ufc?.watched||0),total:Number(db?.ufc?.known_events||0),source:'db-v520'},wwe:{watched:Number(db?.wwe_ppv?.watched||0),total:Number(db?.wwe_ppv?.known_events||0),source:'db-v520'}}}if(data){summary=data;writeCache(data);document.documentElement.dataset.ct520SpecialSummary=[data?.f1?.total||0,data?.ufc?.total||0,data?.wwe?.total||0].join('|');repaint()}return summary}catch(e){document.documentElement.dataset.ct520SpecialSummaryError=String(e?.message||e);return summary}})().finally(()=>{task=null});return task}
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:sports-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,()=>{try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)});
document.addEventListener('cinetracker:data-changed',e=>{const t=String(e?.detail?.type||'');if(['f1','ufc','wwe'].includes(t)){try{sessionStorage.removeItem(cacheKey)}catch{};void load(true)}});
window.__ctR520SpecialSummary={version:'0.3.47',load,get,repaint,get data(){return summary}};window.__ctR516SpecialSummary=window.__ctR520SpecialSummary;queueMicrotask(()=>void load(false));
})();
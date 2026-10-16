/* CineTracker Web 0.3.67 r540 — auth-safe fast special-series counts. */
(()=>{
'use strict';
if(window.__ctR516SpecialSummary?.version==='0.3.67')return;
const core=()=>window.__ctCoreR471||null;
const sessionKey='ct540:special-summary',localKey='ct540:special-summary:authoritative',DAY=86400000,WEEK=7*DAY;
const floors={f1:1166,ufc:793,wwe:567};
let summary=null,task=null;
const num=v=>Math.max(0,Number(v||0)||0),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const valid=v=>v&&['f1','ufc','wwe'].every(k=>num(v?.[k]?.total)>=floors[k]&&num(v?.[k]?.watched)<=num(v?.[k]?.total));
function readStore(store,key,maxAge){try{const x=JSON.parse(store.getItem(key)||'null');return x&&Date.now()-num(x.at)<maxAge&&valid(x.data)?x.data:null}catch{return null}}
function read(){return readStore(sessionStorage,sessionKey,DAY)||readStore(localStorage,localKey,WEEK)||readStore(sessionStorage,'ct539:special-summary',DAY)||readStore(localStorage,'ct539:special-summary:authoritative',WEEK)}
function write(v){if(!valid(v))return;const raw=JSON.stringify({at:Date.now(),data:v});try{sessionStorage.setItem(sessionKey,raw);localStorage.setItem(localKey,raw)}catch{}}
function get(k){return summary?.[k]||null}
function repaint(){try{window.__ctR512Special?.mountAll?.()}catch{};try{window.__ctR513SeriesScreen?.rerender?.()}catch{}}
function shapeDb(raw){const r=Array.isArray(raw)&&raw.length===1?raw[0]:raw||{};return{f1:{watched:num(r?.f1?.watched),total:Math.max(floors.f1,num(r?.f1?.total),num(r?.f1?.watched)),watched_sessions:num(r?.f1?.watched_sessions),source:'db-v540-fast'},ufc:{watched:num(r?.ufc?.watched),total:Math.max(floors.ufc,num(r?.ufc?.total),num(r?.ufc?.watched)),source:'db-v540-fast'},wwe:{watched:num(r?.wwe_ppv?.watched),total:Math.max(floors.wwe,num(r?.wwe_ppv?.total),num(r?.wwe_ppv?.watched)),source:'db-v540-fast'}}}
function growFromRemote(base,d){if(!base||!d)return base;return{f1:{...base.f1,total:Math.max(base.f1.total,num(d?.f1?.total))},ufc:{...base.ufc,total:Math.max(base.ufc.total,num(d?.ufc?.total))},wwe:{...base.wwe,total:Math.max(base.wwe.total,num(d?.wwe?.total))}}}
async function waitAuth(){if(core()?.authReady?.())return true;for(let i=0;i<96;i++){await sleep(125);if(core()?.authReady?.())return true}return false}
async function dbFetch(){let last=null;for(const delay of [0,250,750]){if(delay)await sleep(delay);try{return shapeDb(await core()?.rpc?.('cinetracker_special_series_counts_v540',{}))}catch(e){last=e}}throw last||new Error('SPECIAL_COUNTS_UNAVAILABLE')}
async function load(force=false){
 if(task)return task;
 if(!summary){summary=read();if(summary)repaint()}
 if(summary&&!force&&valid(summary))return summary;
 task=(async()=>{try{
  if(!(await waitAuth())){document.documentElement.dataset.ct540SpecialAuth='timeout';return summary}
  const next=await dbFetch();
  if(valid(next)){summary=next;write(next);document.documentElement.dataset.ct540SpecialSummary=[next.f1.watched+'/'+next.f1.total,next.ufc.watched+'/'+next.ufc.total,next.wwe.watched+'/'+next.wwe.total].join('|');repaint()}
  void Promise.resolve(core()?.edge?.('ct-special-series-summary',{})).then(d=>{if(!summary||!d)return;const grown=growFromRemote(summary,d);if(valid(grown)&&(grown.f1.total!==summary.f1.total||grown.ufc.total!==summary.ufc.total||grown.wwe.total!==summary.wwe.total)){summary=grown;write(grown);repaint()}}).catch(()=>{});
  return summary
 }catch(e){document.documentElement.dataset.ct540SpecialSummaryError=String(e?.message||e);if(summary)repaint();return summary}finally{task=null}})();
 return task
}
const refresh=()=>void load(true);
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:ufc-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,refresh);
document.addEventListener('cinetracker:data-changed',e=>{if(['f1','ufc','wwe'].includes(String(e?.detail?.type||'')))refresh()});
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="home"],[data-home-tab]'))void load(false)},true);
window.addEventListener('popstate',()=>{if(String(core()?.route?.()||'')==='home')void load(false)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!summary)void load(false)});
window.__ctR540SummaryMarker='auth-wait+fast-db-counts+bounded-retry+no-stuck-loading';
window.__ctR516SpecialSummary={version:'0.3.67',load,get,repaint,get data(){return summary}};
queueMicrotask(()=>void load(false));
})();
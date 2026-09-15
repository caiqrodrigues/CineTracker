/* Web 1.0.88 r297 — reconnect r295/r296 Discover authorities to the real r288 live owners. */
(()=>{
'use strict';
if(window.__ctR297DiscoverBridge)return;
const M=window.__ctR295Test,S=window.__ctR296Test,R=window.__ctR288R263||{};
const discover=R.discover263;
if(!M||!S||!discover){window.__ctR297DiscoverBridge='missing-authority';return}
const TARGET=new Set(['trending','popular','new','anticipated','top']);
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.id||0));
function dedupe(rows){const seen=new Set(),out=[];for(const x of Array.isArray(rows)?rows:[]){const k=`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;if(k.endsWith(':0')||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function host(){try{return R.discoverHost263?.()||document.querySelector('[data-ct263-discover-content]')}catch{return document.querySelector('[data-ct263-discover-content]')}}

const baseBrowse=window.__ctR288PaintBrowse;
if(typeof baseBrowse==='function'&&!baseBrowse.__ctR297R295Browse){
 const liveBrowse=function(rows,tab){
  if(tab==='calendar'&&typeof M.paintCalendar==='function')return M.paintCalendar(rows);
  const clean=TARGET.has(String(tab||''))?dedupe(rows).filter(x=>!M.blocked(x)):rows;
  const out=baseBrowse.call(this,clean,tab);
  if(TARGET.has(String(tab||''))){const h=host();if(h){h.dataset.ct295Browse=String(tab);M.decorateBrowseActions(document)}}
  return out;
 };
 liveBrowse.__ctR297R295Browse=true;
 window.__ctR288PaintBrowse=liveBrowse;
}

const baseForYou=window.__ctR288PaintForYou;
if(typeof baseForYou==='function'&&!baseForYou.__ctR297R295R296ForYou){
 const liveForYou=function(){
  try{M.sanitizeForYou()}catch{}
  try{S.strictCompose()}catch{}
  const out=baseForYou.apply(this,arguments);
  queueMicrotask(()=>{try{M.crispDaily?.()}catch{}try{void S.recordSelection296?.()}catch{}});
  return out;
 };
 liveForYou.__ctR297R295R296ForYou=true;
 window.__ctR288PaintForYou=liveForYou;
}

const baseLoad=window.__ctR288LoadDiscover;
if(typeof baseLoad==='function'&&!baseLoad.__ctR297R295Load){
 const liveLoad=function(tab=discover.tab,force=false){
  const wanted=String(tab||discover.tab||'foryou');
  discover.tab=wanted;
  if(wanted==='calendar'){
   void (async()=>{
    await M.authority(!!force);
    baseLoad.call(this,wanted,force);
    try{const rows=await M.loadCalendarRows?.();if(discover.tab==='calendar'&&Array.isArray(rows))M.paintCalendar(rows)}catch{}
   })();
   return;
  }
  if(TARGET.has(wanted)){
   void M.authority(!!force).then(()=>baseLoad.call(this,wanted,force)).catch(()=>baseLoad.call(this,wanted,force));
   return;
  }
  if(wanted==='foryou'){
   void M.authority(!!force).then(()=>{
    baseLoad.call(this,wanted,force);
    setTimeout(()=>{try{void window.__ctR293Test?.refresh?.(true)}catch{}},220);
   }).catch(()=>baseLoad.call(this,wanted,force));
   return;
  }
  return baseLoad.apply(this,arguments);
 };
 liveLoad.__ctR297R295Load=true;
 window.__ctR288LoadDiscover=liveLoad;
}

window.__ctR297DiscoverBridge='r288-live-owners+r295-personal+r296-strict';
})();

/* CineTracker Web 1.0.144 r353 — smart weighted-random Watchlist recommendations. */
(()=>{
'use strict';
if(window.__ctR353?.version==='1.0.144')return;
window.__ctR353Marker='watchlist-smart-weighted-random+history-affinity+recent-memory';
window.__ctR353Scope='discover-foryou-watchlist-selection-only';
window.__ctR353Android='preserved-1.0.20-10062';

const rows=v=>Array.isArray(v)?v:[];
let rngOverride=null;

function typeOf353(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf353(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf353(x){const id=idOf353(x);return id>0?(typeOf353(x)==='movie'?'movie':'tv')+':'+id:''}
function genreIds353(x){
 const ids=[
  ...rows(x?.genre_ids),
  ...rows(x?.raw_tmdb?.genre_ids),
  ...rows(x?.genres).map(g=>Number(g?.id||g))
 ].map(Number).filter(Boolean);
 return [...new Set(ids)];
}
function vote353(x){return Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0}
function authority353(explicit){
 if(explicit&&typeof explicit==='object')return explicit;
 try{return window.__ctR295Test?.cache||null}catch{return null}
}
function historyRows353(a){
 const raw=a?.raw||{};
 const out=[];
 for(const k of ['history','watched','seen'])out.push(...rows(raw?.[k]));
 return out;
}
function watchRows353(a,pool=[]){
 return [...rows(a?.watchRows),...rows(pool)];
}
function affinity353(a,pool=[]){
 const map=new Map();
 const add=(list,w)=>{
  for(const x of rows(list)){
   for(const id of genreIds353(x))map.set(id,(map.get(id)||0)+w);
  }
 };
 add(historyRows353(a),3.0);
 add(watchRows353(a,pool),1.15);
 return map;
}
function scoreItem353(item,a,pool=[]){
 const profile=affinity353(a,pool),genres=genreIds353(item);
 let score=1;
 for(const id of genres){
  const w=profile.get(id)||0;
  if(w>0)score+=Math.log1p(w)*1.7;
 }
 const v=vote353(item);
 if(v>0)score+=Math.max(0,v-5.5)*0.22;
 if(!genres.length)score*=0.72;
 return Math.max(0.15,score);
}
function uid353(){try{return String(window.user?.id||globalThis.user?.id||'anon')}catch{return'anon'}}
function recentKey353(kind){return 'ct:r353:watch-recent:'+uid353()+':'+String(kind||'all')}
function readRecent353(kind){
 try{return rows(JSON.parse(sessionStorage.getItem(recentKey353(kind))||'[]')).map(String).filter(Boolean).slice(-8)}
 catch{return[]}
}
function writeRecent353(kind,list){
 try{sessionStorage.setItem(recentKey353(kind),JSON.stringify(rows(list).map(String).filter(Boolean).slice(-8)))}catch{}
}
function remember353(kind,key,poolLen){
 if(!key)return;
 const keep=Math.max(1,Math.min(4,Math.max(1,Number(poolLen||1)-1)));
 const next=readRecent353(kind).filter(k=>k!==key);next.push(key);writeRecent353(kind,next.slice(-keep));
}
function random353(){
 if(typeof rngOverride==='function'){
  const v=Number(rngOverride());return Number.isFinite(v)?Math.max(0,Math.min(0.999999999,v)):0.5;
 }
 try{
  if(globalThis.crypto?.getRandomValues){
   const a=new Uint32Array(1);globalThis.crypto.getRandomValues(a);return a[0]/4294967296;
  }
 }catch{}
 return Math.random();
}
function weightedPick353(pool,kind,currentIndex=-1,{record=true,authority=null}={}){
 const list=rows(pool);if(list.length<2)return list.length?0:-1;
 const hasCurrent=Number(currentIndex)>=0;
 const cur=hasCurrent?((Number(currentIndex)%list.length)+list.length)%list.length:-1,curKey=hasCurrent?keyOf353(list[cur]):'',recent=new Set(readRecent353(kind));
 let candidates=list.map((item,index)=>({item,index,key:keyOf353(item)})).filter(x=>(!hasCurrent||x.index!==cur)&&x.key&&(!curKey||x.key!==curKey));
 if(!candidates.length)return cur;
 const nonRecent=candidates.filter(x=>!recent.has(x.key));
 if(nonRecent.length)candidates=nonRecent;
 const a=authority353(authority);
 const weighted=candidates.map(x=>{
  const base=scoreItem353(x.item,a,list);
  return {...x,weight:Math.pow(Math.max(.15,base),1.55)};
 });
 const total=weighted.reduce((s,x)=>s+x.weight,0);
 let needle=random353()*Math.max(total,.0001),chosen=weighted[weighted.length-1];
 for(const x of weighted){needle-=x.weight;if(needle<=0){chosen=x;break}}
 if(record)remember353(kind,chosen.key,list.length);
 return chosen.index;
}
function prepareWatchState353(st,a=null){
 if(!st)return st;
 st.watchIndex={...(st.watchIndex||{movie:0,series:0,anime:0})};
 for(const kind of ['movie','series','anime']){
  const pool=rows(st.watchPools?.[kind]);if(!pool.length){st.watchIndex[kind]=0;continue}
  const idx=weightedPick353(pool,kind,-1,{record:true,authority:a});
  st.watchIndex[kind]=idx<0?0:idx;
  if(st.initial?.watch)st.initial.watch[kind]=pool[st.watchIndex[kind]]||null;
 }
 return st;
}
function smartSwapIndex353(pool,kind,currentIndex,opts={}){
 return weightedPick353(pool,kind,currentIndex,{record:true,...opts});
}
function clearRecent353(kind){
 try{
  if(kind)sessionStorage.removeItem(recentKey353(kind));
  else for(const k of ['movie','series','anime'])sessionStorage.removeItem(recentKey353(k));
 }catch{}
}
window.__ctR353SmartWatchIndex=smartSwapIndex353;
window.__ctR353PrepareWatchState=prepareWatchState353;
window.__ctR353={
 version:'1.0.144',
 pickIndex:smartSwapIndex353,
 prepare:prepareWatchState353,
 score:scoreItem353,
 affinity:affinity353,
 recent:readRecent353,
 clearRecent:clearRecent353
};
window.__ctR353Test={
 genreIds353,affinity353,scoreItem353,weightedPick353,prepareWatchState353,smartSwapIndex353,
 clearRecent353,setRandom(fn){rngOverride=typeof fn==='function'?fn:null}
};
})();
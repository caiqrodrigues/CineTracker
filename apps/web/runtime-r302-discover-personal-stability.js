/* CineTracker Web 1.0.93 r302 — personal Discover authority + finite Sports/Profile lifecycle. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR302)return;
window.__ctR302='discover-watched-watchlist-block+foryou-authority+no-r301-dom-observer';
window.__ctR302Discover='watched+watchlist-excluded+canonical-add';
window.__ctR302ForYou='watchlist-preserved+fresh-personal-filter';
window.__ctR302Stability='finite-hooks-no-global-dom-observer';
window.__ctR302Android='preserved-1.0.20-10062';

const M302=window.__ctR295Test||{},T302=window.__ctR298Test||{},R302=window.__ctR288R263||{};
const baseBlocked302=typeof M302.blocked==='function'?M302.blocked:null;
const baseStrict302=typeof T302.strict==='function'?T302.strict:null;
const type302=x=>String(x?.media_type||x?.type||x?.category||x?.item?.media_type||x?.item?.type||'tv')==='movie'?'movie':'tv';
const id302=x=>{const v=x?.tmdb_id??x?.source_tmdb_id??x?.media_id??x?.item?.tmdb_id??x?.item?.source_tmdb_id??x?.raw_tmdb?.id??x?.id;const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const key302=x=>{const id=id302(x);return id?`${type302(x)}:${id}`:''};
function watchKeys302(){
 const c=M302.cache||{},rows=[...(Array.isArray(c.watchRows)?c.watchRows:[]),...(Array.isArray(c.watchlistRows)?c.watchlistRows:[])],set=new Set();
 for(const row of rows){const k=key302(row);if(k)set.add(k)}
 return set;
}
function inWatchlist302(x){const k=key302(x);return !!k&&watchKeys302().has(k)}
function blocked302(x){try{if(baseBlocked302?.call(M302,x))return true}catch{}return inWatchlist302(x)}
M302.blocked=blocked302;
if(baseStrict302){T302.strict=function(x,opt){let ok=false;try{ok=!!baseStrict302.call(T302,x,opt)}catch{return false}if(!ok)return false;return opt?.watch?true:!inWatchlist302(x)}}

let refreshTimer302=0;
function route302(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function tab302(){return String(R302.discover263?.tab||'foryou')}
async function refreshDiscover302(){
 if(route302()!=='discover')return false;
 try{await Promise.resolve(M302.authority?.(true))}catch{}
 if(route302()!=='discover')return false;
 const load=window.__ctR288LoadDiscover;if(typeof load!=='function')return false;
 try{await Promise.resolve(load(tab302(),true));return true}catch{return false}
}
function scheduleDiscover302(){clearTimeout(refreshTimer302);refreshTimer302=setTimeout(()=>{void refreshDiscover302()},90)}
document.addEventListener('cinetracker:data-changed',scheduleDiscover302,false);
window.addEventListener('popstate',()=>{if(route302()==='discover')scheduleDiscover302()},false);

window.__ctR302Test={blocked302,inWatchlist302,watchKeys302,refreshDiscover302,get baseBlocked(){return baseBlocked302},get hasGlobalObserver(){return false}};
})();

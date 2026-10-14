/* CineTracker Web 0.3.47 r520 — complete special-series catalog bridge. */
(()=>{
'use strict';
if(window.__ctR520Catalog?.version==='0.3.47')return;
const core=()=>window.__ctCoreR471||null,rows=v=>Array.isArray(v)?v:[],rpc=(n,a={})=>core()?.rpc?.(n,a),edge=(n,a={})=>core()?.edge?.(n,a);
const norm=v=>String(v??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const currentYear=()=>new Date().getFullYear(),today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const cache=new Map(),tasks=new Map();
const key=(type,season)=>type+':'+Number(season);
const eventKey=x=>String(x?.event_key||norm(String(x?.title||'')).replace(/^wwe /,'').replace(/ (19|20)d{2}$/,'').trim());
function seasonList(from){return Array.from({length:currentYear()-from+1},(_,i)=>currentYear()-i)}
function cacheGet(type,season){const x=cache.get(key(type,season));return x&&Date.now()-x.at<30*60*1000?x.data:null}
function cacheSet(type,season,data){cache.set(key(type,season),{at:Date.now(),data});return data}
function drop(type,season){cache.delete(key(type,season))}
function f1Historical(raw,base,season){
 const watched=new Set(rows(base?.historical_watched_rounds).map(Number));
 const events=rows(raw?.races).map(r=>{
  const round=Number(r?.round||0),date=String(r?.date||''),time=String(r?.time||'23:59:59Z'),starts=date?new Date(date+'T'+time).toISOString():null;
  return {source:'historical',event_id:null,provider_event_id:'jolpica:'+season+':'+round+':race',title:String(r?.raceName||('Grand Prix '+round)),season,episode_number:1000+round,round,session_kind:'race',starts_at:starts,runtime_minutes:120,released:starts?Date.parse(starts)<=Date.now():true,is_watched:watched.has(round)}
 }).sort((a,b)=>Date.parse(b.starts_at||0)-Date.parse(a.starts_at||0));
 return {...base,events,historical:true,seasons:seasonList(1950),series:{...(base?.series||{}),season,total_episodes:events.length,released_episodes:events.filter(x=>x.released!==false).length,watched_episodes:events.filter(x=>x.is_watched).length}}
}
async function loadF1(season){
 const base=await rpc('cinetracker_f1_series_v512',{p_season:season,p_today:today(),p_recent_days:21});
 if(rows(base?.events).length)return {...base,seasons:rows(base?.seasons).length?base.seasons:seasonList(1950)};
 const hist=await edge('cinetracker-f1-v1',{season,mode:'series'});
 return f1Historical(hist||{},base||{},season)
}
async function loadUfc(season){
 try{await edge('ct-ufc-series-sync',{season})}catch(e){document.documentElement.dataset.ct520UfcSyncError=String(e?.message||e)}
 const base=await rpc('cinetracker_ufc_series_v518',{p_season:season,p_today:today(),p_recent_days:21});
 return {...(base||{}),seasons:rows(base?.seasons).length?base.seasons:seasonList(1993)}
}
async function loadWwe(season){
 const [base,remote]=await Promise.all([
  rpc('cinetracker_wwe_ppv_series_v519',{p_season:season,p_today:today(),p_recent_days:30}).catch(()=>null),
  edge('ct-wwe-ppv-series-sync',{season}).catch(e=>{document.documentElement.dataset.ct520WweSyncError=String(e?.message||e);return null})
 ]);
 const baseEvents=rows(base?.events),remoteEvents=rows(remote?.events),baseMap=new Map();
 for(const x of baseEvents){const k=eventKey(x);if(k&&!baseMap.has(k))baseMap.set(k,x)}
 const nums=remoteEvents.map(x=>Number(x?.episode_number||0)).filter(x=>x>0);
 const statusRows=nums.length?rows(await rpc('cinetracker_wwe_ppv_episode_status_v520',{p_season:season,p_episode_numbers:nums}).catch(()=>[])):[];
 const status=new Map(statusRows.map(x=>[Number(x.episode_number),!!x.is_watched]));
 const merged=[],seen=new Set();
 for(const r of remoteEvents){
  const k=eventKey(r);if(!k||seen.has(k))continue;seen.add(k);
  const b=baseMap.get(k),episode=Number(b?.episode_number||r?.episode_number||0);
  merged.push({...r,...(b||{}),season,episode_number:episode,is_watched:!!(b?.is_watched||status.get(Number(r?.episode_number||0))),released:r?.released!==false,source:b?.source||r?.source||'wikipedia'})
 }
 for(const b of baseEvents){const k=eventKey(b);if(!k||seen.has(k))continue;seen.add(k);merged.push({...b,season})}
 merged.sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0));
 const released=merged.filter(x=>x.released!==false),watched=released.filter(x=>x.is_watched),recentFrom=Date.now()-30*86400000,pending=released.filter(x=>!x.is_watched&&(!x.starts_at||Date.parse(x.starts_at)>=recentFrom));
 const upcoming=merged.filter(x=>x.released===false||Date.parse(x?.starts_at||0)>Date.now()).sort((a,b)=>Date.parse(a?.starts_at||0)-Date.parse(b?.starts_at||0))[0]||null;
 const recent=[...pending].sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0))[0]||null;
 const series={...(base?.series||{}),series_key:'wwe_ppv',title:'WWE Pay-Per-View',season,total_episodes:merged.length,released_episodes:released.length,watched_episodes:watched.length,available_episodes:season===currentYear()?pending.length:0,home_bucket:season===currentYear()&&pending.length?'continue':'up_to_date',next_episode_number:recent?.episode_number,next_episode_title:recent?.title,next_episode_air_date:recent?.starts_at,upcoming_episode_number:upcoming?.episode_number,upcoming_episode_title:upcoming?.title,upcoming_episode_air_date:upcoming?.starts_at};
 return {...(base||{}),series,seasons:seasonList(1985),events:merged,source:'wwe-v520-wikipedia+db'}
}
async function loadSeason(type,season,force=false){
 const t=['f1','ufc','wwe'].includes(type)?type:'f1',y=Number(season)||currentYear(),hit=!force&&cacheGet(t,y);if(hit)return hit;
 const k=key(t,y);if(tasks.has(k))return tasks.get(k);
 const task=(t==='f1'?loadF1(y):t==='ufc'?loadUfc(y):loadWwe(y)).then(d=>cacheSet(t,y,d)).finally(()=>tasks.delete(k));tasks.set(k,task);return task
}
window.__ctR520CatalogMarker='jolpica+ufcstats+wikipedia-three-special-series';
window.__ctR520Catalog={version:'0.3.47',loadSeason,drop,get:(type,season)=>cacheGet(type,season)};
})();
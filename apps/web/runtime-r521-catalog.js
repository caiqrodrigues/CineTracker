/* CineTracker Web 0.3.48 r521 — complete special-series catalog. */
(()=>{
'use strict';
if(window.__ctR520Catalog?.version==='0.3.48')return;
const core=()=>window.__ctCoreR471||null,rows=v=>Array.isArray(v)?v:[],rpc=(n,a={})=>core()?.rpc?.(n,a),edge=(n,a={})=>core()?.edge?.(n,a);
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const currentYear=()=>new Date().getFullYear(),today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),cache=new Map(),tasks=new Map(),key=(t,y)=>t+':'+Number(y);
const eventKey=x=>String(x?.event_key||norm(String(x?.title||'')).replace(/^wwe /,'').replace(/ (19|20)\d{2}$/,'').trim());
function seasonList(from){return Array.from({length:currentYear()-from+1},(_,i)=>currentYear()-i)}
function cacheGet(t,y){const x=cache.get(key(t,y));return x&&Date.now()-x.at<1800000?x.data:null}
function cacheSet(t,y,d){cache.set(key(t,y),{at:Date.now(),data:d});return d}
function drop(t,y){cache.delete(key(t,y))}
function remoteRace(r,season,watched){
 const round=Number(r?.round||0),date=String(r?.date||''),time=String(r?.time||'23:59:59Z');let starts=null;
 try{if(date)starts=new Date(date+'T'+time).toISOString()}catch{}
 return {source:'historical',event_id:null,provider_event_id:'jolpica:'+season+':'+round+':race',title:String(r?.raceName||('Grand Prix '+round)),season,episode_number:900000+season*100+round,round,session_kind:'race',starts_at:starts,runtime_minutes:120,released:starts?Date.parse(starts)<=Date.now():true,is_watched:watched.has(round)}
}
function mergeF1(remote,base,season){
 const local=rows(base?.events).map(x=>({...x,season:Number(x?.season||season)})),historicalWatched=new Set(rows(base?.historical_watched_rounds).map(Number)),raceRounds=new Set(local.filter(x=>String(x?.session_kind||'').toLowerCase()==='race').map(x=>Number(x?.round||0)).filter(Boolean)),events=[...local];
 for(const r of rows(remote?.races)){const round=Number(r?.round||0);if(round&&!raceRounds.has(round)){events.push(remoteRace(r,season,historicalWatched));raceRounds.add(round)}}
 events.sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0));
 const released=events.filter(x=>x.released!==false&&(!x.starts_at||Date.parse(x.starts_at)<=Date.now()+60000)),watched=released.filter(x=>x.is_watched),recentFrom=Date.now()-21*86400000,pending=season===currentYear()?released.filter(x=>!x.is_watched&&(!x.starts_at||Date.parse(x.starts_at)>=recentFrom)):[];
 const upcoming=events.filter(x=>x.released===false||(x.starts_at&&Date.parse(x.starts_at)>Date.now())).sort((a,b)=>Date.parse(a?.starts_at||0)-Date.parse(b?.starts_at||0))[0]||null,recent=[...pending].sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0))[0]||null;
 return {...(base||{}),events,seasons:seasonList(1950),historical:events.some(x=>x.source==='historical'),source:'f1-r521-local-sessions+jolpica-races',series:{...(base?.series||{}),title:'Fórmula 1',series_key:'formula_1',season,total_episodes:events.length,released_episodes:released.length,watched_episodes:watched.length,available_episodes:pending.length,home_bucket:season===currentYear()&&pending.length?'continue':'up_to_date',next_episode_number:recent?.episode_number,next_episode_title:recent?.title,next_episode_air_date:recent?.starts_at,upcoming_episode_number:upcoming?.episode_number,upcoming_episode_title:upcoming?.title,upcoming_episode_air_date:upcoming?.starts_at}}
}
async function loadF1(season){
 const [db,remote]=await Promise.allSettled([rpc('cinetracker_f1_series_v512',{p_season:season,p_today:today(),p_recent_days:21}),edge('cinetracker-f1-v1',{season,mode:'series'})]);
 const base=db.status==='fulfilled'&&db.value?db.value:{events:[],series:{season},historical_watched_rounds:[]},hist=remote.status==='fulfilled'&&remote.value?remote.value:{races:[]};
 if(remote.status==='rejected')document.documentElement.dataset.ct521F1CatalogError=String(remote.reason?.message||remote.reason||'remote');
 return mergeF1(hist,base,season)
}
async function loadUfc(season){
 try{await edge('ct-ufc-series-sync',{season})}catch(e){document.documentElement.dataset.ct521UfcSyncError=String(e?.message||e)}
 const base=await rpc('cinetracker_ufc_series_v518',{p_season:season,p_today:today(),p_recent_days:21});
 return {...(base||{}),seasons:rows(base?.seasons).length?base.seasons:seasonList(1993),source:String(base?.source||'ufc-v518')+'+r521-full-season'}
}
async function loadWwe(season){
 const [base,remote]=await Promise.all([rpc('cinetracker_wwe_ppv_series_v519',{p_season:season,p_today:today(),p_recent_days:30}).catch(()=>null),edge('ct-wwe-ppv-series-sync',{season}).catch(e=>{document.documentElement.dataset.ct521WweSyncError=String(e?.message||e);return null})]),baseEvents=rows(base?.events),remoteEvents=rows(remote?.events),baseMap=new Map();
 for(const x of baseEvents){const k=eventKey(x);if(k&&!baseMap.has(k))baseMap.set(k,x)}
 const nums=remoteEvents.map(x=>Number(x?.episode_number||0)).filter(x=>x>0),statusRows=nums.length?rows(await rpc('cinetracker_wwe_ppv_episode_status_v520',{p_season:season,p_episode_numbers:nums}).catch(()=>[])):[],status=new Map(statusRows.map(x=>[Number(x.episode_number),!!x.is_watched])),events=[],seen=new Set();
 for(const r of remoteEvents){const k=eventKey(r);if(!k||seen.has(k))continue;seen.add(k);const b=baseMap.get(k),episode=Number(b?.episode_number||r?.episode_number||0);events.push({...r,...(b||{}),season,episode_number:episode,is_watched:!!(b?.is_watched||status.get(Number(r?.episode_number||0))),released:r?.released!==false,source:b?.source||r?.source||'wikipedia'})}
 for(const b of baseEvents){const k=eventKey(b);if(!k||seen.has(k))continue;seen.add(k);events.push({...b,season})}
 events.sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0));
 const released=events.filter(x=>x.released!==false),watched=released.filter(x=>x.is_watched),recentFrom=Date.now()-30*86400000,pending=released.filter(x=>!x.is_watched&&(!x.starts_at||Date.parse(x.starts_at)>=recentFrom)),upcoming=events.filter(x=>x.released===false||Date.parse(x?.starts_at||0)>Date.now()).sort((a,b)=>Date.parse(a?.starts_at||0)-Date.parse(b?.starts_at||0))[0]||null,recent=[...pending].sort((a,b)=>Date.parse(b?.starts_at||0)-Date.parse(a?.starts_at||0))[0]||null;
 return {...(base||{}),events,seasons:seasonList(1985),source:'wwe-r521-wikipedia+db',series:{...(base?.series||{}),series_key:'wwe_ppv',title:'WWE Pay-Per-View',season,total_episodes:events.length,released_episodes:released.length,watched_episodes:watched.length,available_episodes:season===currentYear()?pending.length:0,home_bucket:season===currentYear()&&pending.length?'continue':'up_to_date',next_episode_number:recent?.episode_number,next_episode_title:recent?.title,next_episode_air_date:recent?.starts_at,upcoming_episode_number:upcoming?.episode_number,upcoming_episode_title:upcoming?.title,upcoming_episode_air_date:upcoming?.starts_at}}
}
async function loadSeason(type,season,force=false){
 const t=['f1','ufc','wwe'].includes(type)?type:'f1',y=Number(season)||currentYear(),hit=!force&&cacheGet(t,y);if(hit)return hit;const k=key(t,y);if(tasks.has(k))return tasks.get(k);
 const task=(t==='f1'?loadF1(y):t==='ufc'?loadUfc(y):loadWwe(y)).then(d=>cacheSet(t,y,d)).finally(()=>tasks.delete(k));tasks.set(k,task);return task
}
window.__ctR521CatalogMarker='f1-local-sessions+jolpica-all-races+ufc-full+wwe-full';
window.__ctR520Catalog={version:'0.3.48',loadSeason,drop,get:(t,y)=>cacheGet(t,y),mergeF1};
})();
/* CineTracker Web 1.0.211 r420 — stand-up exclusion, F1 pure-series owner and Profile truth. */
(()=>{
'use strict';
if(window.__ctR420?.version==='1.0.211')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);

/* DISCOVER — Stand-up is never eligible. This wraps both active client eligibility owners. */
function rawOf(x){return x?.raw_tmdb&&typeof x.raw_tmdb==='object'?x.raw_tmdb:{}}
function mediaType420(x){return String(x?.media_type||x?.type||rawOf(x)?.media_type||'tv')==='movie'?'movie':'tv'}
function standupText420(x){
 const r=rawOf(x),kw=r?.keywords??x?.keywords,parts=[x?.title,x?.name,x?.original_title,x?.original_name,x?.media_kind,x?.kind,x?.overview,x?.tagline,r?.title,r?.name,r?.original_title,r?.original_name,r?.overview,r?.tagline,r?.type,r?.media_kind];
 const names=v=>rows(v).map(y=>typeof y==='string'?y:(y?.name||y?.title||''));
 if(Array.isArray(kw))parts.push(...names(kw));
 if(Array.isArray(kw?.results))parts.push(...names(kw.results));
 if(Array.isArray(kw?.keywords))parts.push(...names(kw.keywords));
 return norm(parts.filter(Boolean).join(' '));
}
function isStandup420(x){
 if(!x||typeof x!=='object')return false;
 const t=standupText420(x),kind=norm(x?.media_kind||x?.kind||rawOf(x)?.type||rawOf(x)?.media_kind||'');
 if(/\bstand\s*up\b/.test(t)||/\bstandup\b/.test(t)||/\bcomedy\s+special\b/.test(t)||/\bespecial\s+de\s+comedia\b/.test(t)||/\bshow\s+de\s+comedia\b/.test(t))return true;
 const comedian=/\b(comedian|comediante)\b/.test(t),special=/\b(special|especial)\b/.test(t);
 return mediaType420(x)==='movie'&&(comedian&&special||/\b(comedy|comedia)\s+show\b/.test(t)||kind.includes('stand up'));
}
function patchEligibility420(obj){
 if(!obj||typeof obj!=='object'||obj.__ctR420Patched)return false;
 const baseReason=typeof obj.reasonSync==='function'?obj.reasonSync.bind(obj):null;
 const baseEligible=typeof obj.eligible==='function'?obj.eligible.bind(obj):null;
 const baseFilter=typeof obj.filterRows==='function'?obj.filterRows.bind(obj):null;
 obj.reasonSync=function(x,opts={}){if(isStandup420(x))return'stand-up';return baseReason?baseReason(x,opts):''};
 obj.eligible=async function(x,opts={}){if(isStandup420(x))return false;return baseEligible?!!(await baseEligible(x,opts)):true};
 obj.filterRows=async function(input,opts={}){const clean=rows(input).filter(x=>!isStandup420(x));const out=baseFilter?await baseFilter(clean,opts):clean.slice(0,Math.max(0,Number(opts?.limit)||24));return rows(out).filter(x=>!isStandup420(x))};
 obj.__ctR420Patched=true;return true;
}
function bindEligibility420(){patchEligibility420(window.__ctR412Eligibility);patchEligibility420(window.__ctR413Eligibility)}
async function sanitizeForYou420(){
 bindEligibility420();const api=window.__ctR411,state=api?.getForYou?.();if(!state)return false;let changed=false;
 for(const group of['watch','fresh'])for(const kind of['movie','series','anime']){const p=rows(state?.[group]?.[kind]),clean=p.filter(x=>!isStandup420(x));if(clean.length!==p.length){state[group][kind]=clean;state.idx[group][kind]=0;changed=true}}
 const daily=rows(state.daily),dailyClean=daily.filter(x=>!isStandup420(x));if(dailyClean.length!==daily.length){state.daily=dailyClean;changed=true}
 if(changed&&typeof api.renderForYou==='function'&&routeNow()==='discover')api.renderForYou(false);
 return changed;
}
let fyToken420=0;
function scheduleDiscover420(){const token=++fyToken420;for(const ms of[0,120,350,900,1800,3600,7000])setTimeout(()=>{if(token===fyToken420&&routeNow()==='discover')void sanitizeForYou420()},ms)}

/* PROFILE — add watchlist runtime fields to the approved layout and exclude F1 from generic sports time. */
let profileTask420=null,profileRun420=0;
function fmtTime420(minutes){try{return typeof ct166FmtMinutes==='function'?ct166FmtMinutes(num(minutes)):typeof fmtMinutes==='function'?fmtMinutes(num(minutes)):String(num(minutes))}catch{return String(num(minutes))}}
function findStat420(root,label){const want=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat',root).find(c=>norm(q('small,label,.stat-label,.label',c)?.textContent||'')===want)||null}
function setStat420(root,label,value){const c=findStat420(root,label),v=q('b,strong,.value,.stat-value',c);if(v)v.textContent=value;return!!v}
function patchProfile420(wl,sports){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;
 let changed=false;
 if(wl){
  const sw=num(wl.watchlist_series_remaining_minutes),mw=num(wl.watchlist_movie_minutes),tw=num(wl.watchlist_total_minutes||sw+mw);
  changed=setStat420(root,'Tempo de série em Watchlist',fmtTime420(sw))||changed;
  changed=setStat420(root,'Tempo de séries em Watchlist',fmtTime420(sw))||changed;
  changed=setStat420(root,'Tempo de filme em Watchlist',fmtTime420(mw))||changed;
  changed=setStat420(root,'Tempo de filmes em Watchlist',fmtTime420(mw))||changed;
  changed=setStat420(root,'Tempo total em Watchlist',fmtTime420(tw))||changed;
  try{if(typeof profileCache!=='undefined'&&profileCache){profileCache={...profileCache,remaining:{...(profileCache.remaining||{}),watchlist_series_remaining_minutes:sw,series_remaining_minutes:sw,watchlist_movie_minutes:mw,watchlist_total_minutes:tw}};ct163Write?.('profile',profileCache)}}catch{}
 }
 if(sports){
  const sm=num(sports.sports_minutes),se=num(sports.watched_events);
  const panels=qa('section.panel,.panel',root),panel=panels.find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'))||root;
  for(const c of qa('.stat,[data-stat],.stat-card,.profile-stat',panel)){const l=norm(q('small,label,.stat-label,.label',c)?.textContent||''),v=q('b,strong,.value,.stat-value',c);if(!v)continue;if(l==='tempo assistido'){v.textContent=fmtTime420(sm);changed=true}else if(l==='eventos assistidos'){v.textContent=se.toLocaleString('pt-BR');changed=true}}
 }
 document.documentElement.dataset.ct420Profile='truth';return changed;
}
async function loadProfile420(){
 if(profileTask420)return profileTask420;const run=++profileRun420;
 profileTask420=(async()=>{const [wlRaw,sportRaw]=await Promise.all([timeout(rpc('cinetracker_profile_watchlist_runtime_v420',{}),6000).catch(()=>null),timeout(rpc('cinetracker_sport_stats_v420',{}),6000).catch(()=>null)]);const wl=Array.isArray(wlRaw)?wlRaw[0]:wlRaw,sports=Array.isArray(sportRaw)?sportRaw[0]:sportRaw;if(run!==profileRun420||routeNow()!=='profile')return{wl,sports};patchProfile420(wl,sports);for(const ms of[100,350,900,1800])setTimeout(()=>{if(run===profileRun420&&routeNow()==='profile')patchProfile420(wl,sports)},ms);return{wl,sports}})().finally(()=>{profileTask420=null});
 return profileTask420;
}

/* F1 HUB — r311's capture owner delegates here. No generic sports mirror is written. */
const F1_MEDIA_ID=865,f1Locks420=new WeakSet(),f1Maps420=new Map();
function f1Defs420(race){return[['fp1','Practice 1','FirstPractice'],['fp2','Practice 2','SecondPractice'],['fp3','Practice 3','ThirdPractice'],['sprint_qualifying','Sprint Shootout','SprintShootout'],['sprint_qualifying','Sprint Qualifying','SprintQualifying'],['sprint','Sprint Race','Sprint'],['qualifying','Qualifying','Qualifying'],['race','Race',null]].map(([kind,label,key])=>{const x=key?race?.[key]:race;if(!x?.date)return null;const date=new Date(x.date+'T'+(x.time||'00:00:00Z'));return{kind,label,round:num(race?.round)||1,date,ms:date.getTime(),raceName:String(race?.raceName||race?.name||'Fórmula 1')}}).filter(Boolean)}
async function f1Map420(season,force=false){if(!force&&f1Maps420.has(season))return f1Maps420.get(season);const task=(async()=>{const races=await ct284Races(season),all=[];for(const race of races||[])all.push(...f1Defs420(race));all.sort((a,b)=>a.ms-b.ms);return all.map((x,i)=>({...x,season,episode:i+1,released:Number.isFinite(x.ms)&&x.ms<=Date.now(),title:x.raceName+' ('+x.label+')'}))})();f1Maps420.set(season,task);try{return await task}catch(e){f1Maps420.delete(season);throw e}}
function f1Entry420(btn,map){const modal=btn?.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,kind=String(btn?.dataset?.kind||'');if(!race)return null;const choices=map.filter(x=>x.round===num(race.round)&&x.kind===kind);if(choices.length<=1)return choices[0]||null;const label=kind==='sprint_qualifying'?(race.SprintQualifying?'Sprint Qualifying':'Sprint Shootout'):'';return choices.find(x=>x.label===label)||choices[0]||null}
function paintF1Btn420(btn,on){if(!btn)return;btn.dataset.watched=on?'1':'0';btn.classList.toggle('active',on);btn.textContent=on?'↶ Desmarcar assistido':'✓ Marcar como assistido';btn.disabled=false;btn.removeAttribute('aria-busy')}
async function syncF1420(){
 const modal=q('[data-ct311-f1-modal]');if(!modal)return false;const race=modal.__ct311Race,season=num(race?.season);if(!season)return false;
 try{const [map,stateRaw]=await Promise.all([f1Map420(season),rpc('cinetracker_imported_series_state_v1',{p_media_id:F1_MEDIA_ID})]);const state=Array.isArray(stateRaw)?stateRaw[0]:stateRaw,watched=new Set(rows(state?.episodes).filter(x=>num(x.season_number)===season).map(x=>num(x.episode_number)));for(const btn of qa('[data-ct311-f1-watch]',modal)){const ep=f1Entry420(btn,map);if(!ep)continue;btn.dataset.ct420Episode=String(ep.episode);btn.dataset.ct420Series=String(F1_MEDIA_ID);btn.dataset.ct420Title=ep.title;paintF1Btn420(btn,watched.has(ep.episode))}modal.dataset.ct420F1Series=String(F1_MEDIA_ID);return true}catch(e){document.documentElement.dataset.ct420F1SyncError=String(e?.message||e);return false}
}
function scheduleF1Sync420(){for(const ms of[0,80,220,500,1000])setTimeout(()=>void syncF1420(),ms)}
async function toggleF1420(btn){
 if(!btn||f1Locks420.has(btn))return false;const modal=btn.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,season=num(race?.season);if(!season)return false;f1Locks420.add(btn);const old=btn.dataset.watched==='1';paintF1Btn420(btn,!old);btn.disabled=true;btn.setAttribute('aria-busy','true');
 try{const map=await f1Map420(season),ep=f1Entry420(btn,map);if(!ep)throw new Error('F1_EPISODE_NOT_FOUND');await rpc('cinetracker_f1_episode_watch_set_v420',{p_season:season,p_episode:ep.episode,p_title:ep.title,p_runtime_minutes:ep.kind==='race'?120:60,p_released_episodes:map.filter(x=>x.released).length,p_watched:!old,p_watched_at:new Date().toISOString()});try{ct284Stable?.clear?.();ct284States?.clear?.();homeCache=null;profileCache=null}catch{}document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'f1-series-r420',media_id:F1_MEDIA_ID,season_number:season,episode_number:ep.episode,watched:!old}}));await syncF1420();try{toast(!old?'Episódio da Fórmula 1 marcado como assistido':'Episódio da Fórmula 1 desmarcado')}catch{}return true}catch(e){paintF1Btn420(btn,old);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{}return false}finally{f1Locks420.delete(btn);if(btn?.isConnected){btn.disabled=false;btn.removeAttribute('aria-busy')}}
}

const baseRenderProfile420=typeof renderProfile==='function'?renderProfile:null;
if(baseRenderProfile420)renderProfile=async function(){const out=await baseRenderProfile420.apply(this,arguments);if(routeNow()==='profile')void loadProfile420();return out};
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]'))scheduleDiscover420();if(t.closest('[data-nav="profile"]'))setTimeout(()=>void loadProfile420(),0);if(t.closest('[data-ct311-f1-race]'))scheduleF1Sync420()},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='discover')scheduleDiscover420();if(routeNow()==='profile')void loadProfile420();if(q('[data-ct311-f1-modal]'))scheduleF1Sync420()},0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='discover')scheduleDiscover420();if(routeNow()==='profile')void loadProfile420()});
function boot420(n=0){bindEligibility420();const r=routeNow();if(r==='discover')scheduleDiscover420();if(r==='profile')void loadProfile420();if(q('[data-ct311-f1-modal]'))scheduleF1Sync420();if(n<24&&(!window.__ctR412Eligibility||!window.__ctR413Eligibility))setTimeout(()=>boot420(n+1),120)}
window.__ctR420={version:'1.0.211',scope:'standup-exclusion+f1-pure-series+profile-watchlist-time+full-profile-rails',isStandup:isStandup420,bindEligibility:bindEligibility420,sanitizeForYou:sanitizeForYou420,loadProfile:loadProfile420,syncF1:syncF1420,scheduleF1Sync:scheduleF1Sync420,toggleF1:toggleF1420};
window.__ctR420Marker='no-standup+f1-series-865-no-sports-mirror+profile-watchlist-minutes+no-card-slice';
queueMicrotask(()=>boot420(0));
})();
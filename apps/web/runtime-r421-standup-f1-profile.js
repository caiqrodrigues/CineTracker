/* CineTracker Web 1.0.212 r421 — strict stand-up exclusion, F1 series-only state and Profile watchlist truth. */
(()=>{
'use strict';
if(window.__ctR421?.version==='1.0.212')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const rawOf=x=>x?.raw_tmdb&&typeof x.raw_tmdb==='object'?x.raw_tmdb:{};
const mediaType=x=>String(x?.media_type||x?.type||rawOf(x)?.media_type||'tv')==='movie'?'movie':'tv';
const names=v=>rows(v).map(x=>norm(typeof x==='string'?x:(x?.name||x?.title||''))).filter(Boolean);
const ids=v=>rows(v).map(x=>Number(typeof x==='number'?x:(x?.id??x))).filter(Number.isFinite);
function keywordNames421(x){const r=rawOf(x),k=x?.keywords??r?.keywords;return [...names(k?.results),...names(k?.keywords),...names(Array.isArray(k)?k:[])]}
function genreNames421(x){const r=rawOf(x);return [...names(x?.genres),...names(r?.genres)]}
function genreIds421(x){const r=rawOf(x);return [...ids(x?.genre_ids),...ids(x?.genres),...ids(r?.genre_ids),...ids(r?.genres)]}
function standupText421(x){
 const r=rawOf(x),parts=[x?.title,x?.name,x?.original_title,x?.original_name,x?.overview,x?.tagline,x?.media_kind,x?.kind,r?.title,r?.name,r?.original_title,r?.original_name,r?.overview,r?.tagline,r?.media_kind,r?.type];
 parts.push(...keywordNames421(x),...names(x?.production_companies),...names(r?.production_companies),...names(x?.networks),...names(r?.networks));
 return norm(parts.filter(Boolean).join(' '));
}
function isComedy421(x){return genreIds421(x).includes(35)||genreNames421(x).some(g=>g==='comedia'||g==='comedy'||g.includes('stand up'))}
function personColon421(x){
 const title=String(x?.title||x?.name||rawOf(x)?.title||rawOf(x)?.name||'').trim();
 if(!/^[\p{L}.-]+(?:\s+[\p{L}.-]+){1,3}\s*:/u.test(title))return false;
 const r=rawOf(x),runtime=num(x?.runtime_minutes||x?.runtime||r?.runtime),budget=num(r?.budget),revenue=num(r?.revenue);
 return mediaType(x)==='movie'&&isComedy421(x)&&runtime>=40&&runtime<=130&&budget===0&&revenue===0;
}
function isStandup421(x){
 if(!x||typeof x!=='object')return false;
 const t=standupText421(x);
 return /\bstand\s*up\b/.test(t)||/\bstandup\b/.test(t)||/\bcomedy\s+special\b/.test(t)||/\bcomedy\s+concert\b/.test(t)||/\blive\s+comedy\b/.test(t)||/\bespecial\s+de\s+comedia\b/.test(t)||/\bshow\s+de\s+comedia\b/.test(t)||(/\b(comedian|comediante)\b/.test(t)&&/\b(special|especial|stage|palco|live|ao vivo)\b/.test(t))||personColon421(x);
}
async function standupWithDetail421(x){
 if(isStandup421(x))return true;
 if(!isComedy421(x))return false;
 const e=window.__ctR412Eligibility||window.__ctR413Eligibility;
 if(typeof e?.detail!=='function')return false;
 try{
  const d=await timeout(e.detail(x),5500),r=rawOf(x);
  return isStandup421({...x,...d,raw_tmdb:{...r,...d}});
 }catch{return false}
}
const eligibilityBases421=new WeakMap();
async function deepFilter421(input,{limit=24,maxScan=72}={}){
 const source=rows(input).slice(0,Math.max(Number(maxScan)||72,Number(limit)||24)),out=[];
 for(let i=0;i<source.length&&out.length<limit;i+=5){
  const batch=source.slice(i,i+5),checks=await Promise.all(batch.map(async x=>[x,await standupWithDetail421(x)]));
  for(const [x,blocked] of checks){if(!blocked){out.push(x);if(out.length>=limit)break}}
 }
 return out;
}
function patchEligibility421(obj){
 if(!obj||typeof obj!=='object'||eligibilityBases421.has(obj))return false;
 const base={reason:typeof obj.reasonSync==='function'?obj.reasonSync.bind(obj):null,eligible:typeof obj.eligible==='function'?obj.eligible.bind(obj):null,filter:typeof obj.filterRows==='function'?obj.filterRows.bind(obj):null};
 eligibilityBases421.set(obj,base);
 obj.reasonSync=function(x,opts={}){if(isStandup421(x))return'stand-up';return base.reason?base.reason(x,opts):''};
 obj.eligible=async function(x,opts={}){if(await standupWithDetail421(x))return false;return base.eligible?!!(await base.eligible(x,opts)):true};
 obj.filterRows=async function(input,opts={}){
  const limit=Math.max(0,Number(opts?.limit)||24),scan=Math.max(limit,Number(opts?.maxScan)||72);
  const prelim=base.filter?await base.filter(input,{...opts,limit:scan,maxScan:scan}):rows(input).slice(0,scan);
  return deepFilter421(prelim,{limit,maxScan:scan});
 };
 return true;
}
function bindEligibility421(){patchEligibility421(window.__ctR412Eligibility);patchEligibility421(window.__ctR413Eligibility)}
async function filterRecommendations421(input,opts={}){
 bindEligibility421();
 const e=window.__ctR412Eligibility||window.__ctR413Eligibility;
 if(typeof e?.filterRows==='function')return e.filterRows(input,{limit:Number(opts.limit)||24,maxScan:Number(opts.maxScan)||Math.max(72,Number(opts.limit)||24),requireOriginDetail:true,excludeWwe:true});
 return deepFilter421(input,opts);
}
async function sanitizeForYou421(){
 if(routeNow()!=='discover'||!window.__ctR411?.getForYou)return false;
 const fy=window.__ctR411.getForYou();if(!fy||typeof fy!=='object')return false;let changed=false;
 for(const group of ['watch','fresh'])for(const type of ['movie','series','anime']){
  const pool=rows(fy?.[group]?.[type]);if(!pool.length)continue;
  const clean=await filterRecommendations421(pool,{limit:pool.length,maxScan:pool.length});
  if(clean.length!==pool.length){fy[group][type].splice(0,fy[group][type].length,...clean);if(fy.idx?.[group])fy.idx[group][type]=0;changed=true}
 }
 const daily=rows(fy.daily);if(daily.length&&await standupWithDetail421(daily[0])){fy.daily.splice(0,fy.daily.length);changed=true}
 if(changed&&typeof window.__ctR411.renderForYou==='function')window.__ctR411.renderForYou(false);
 return changed;
}
function scheduleForYouSanitize421(){for(const ms of[300,900,1800,3600,6500])setTimeout(()=>void sanitizeForYou421(),ms)}

/* PROFILE — preserve the existing markup; only correct values and make every returned card reachable. */
let profileTask421=null,profileRun421=0;
function fmtCompact421(minutes){
 let h=Math.max(0,Math.floor(num(minutes)/60)),m=Math.floor(h/720);h-=m*720;const d=Math.floor(h/24);h-=d*24;
 return m+'M '+String(d).padStart(2,'0')+'D '+String(h).padStart(2,'0')+'H';
}
function statLabel421(card){return norm(q('small,label,.stat-label,.label',card)?.textContent||'')}
function statValue421(card){return q('b,strong,.value,.stat-value',card)}
function patchProfile421(wl,sports){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;let changed=false;
 if(wl&&typeof wl==='object'){
  const series=num(wl.watchlist_series_remaining_minutes??wl.series_remaining_minutes),movies=num(wl.watchlist_movie_minutes),total=num(wl.watchlist_total_minutes??series+movies);
  for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){
   const label=statLabel421(card),value=statValue421(card);if(!value||!label.includes('tempo')||!label.includes('watchlist'))continue;
   if(label.includes('serie')){value.textContent=fmtCompact421(series);changed=true}
   else if(label.includes('filme')){value.textContent=fmtCompact421(movies);changed=true}
   else if(label.includes('total')){value.textContent=fmtCompact421(total);changed=true}
  }
  try{
   if(typeof profileCache!=='undefined'&&profileCache){
    profileCache={...profileCache,remaining:{...(profileCache.remaining||{}),watchlist_series_remaining_minutes:series,series_remaining_minutes:series,watchlist_movie_minutes:movies,watchlist_total_minutes:total}};
    ct163Write?.('profile',profileCache);
   }
  }catch{}
  root.dataset.ct421WatchlistMinutes=series+':'+movies+':'+total;
 }
 if(sports&&typeof sports==='object'){
  const panels=qa('section.panel,.panel',root),panel=panels.find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'));
  if(panel)for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',panel)){
   const label=statLabel421(card),value=statValue421(card);if(!value)continue;
   if(label==='tempo assistido'){value.textContent=fmtCompact421(sports.sports_minutes);changed=true}
   if(label==='eventos assistidos'){value.textContent=num(sports.watched_events).toLocaleString('pt-BR');changed=true}
  }
 }
 for(const rail of qa('.panel>.row',root)){rail.dataset.ct421FullRail='1'}
 return changed;
}
async function loadProfile421(){
 if(profileTask421)return profileTask421;const run=++profileRun421;
 profileTask421=(async()=>{
  const [wlRaw,sportsRaw]=await Promise.all([
   timeout(rpc('cinetracker_profile_watchlist_runtime_v421',{}),6500).catch(()=>null),
   timeout(rpc('cinetracker_sport_stats_v421',{}),6500).catch(()=>null)
  ]);
  const wl=Array.isArray(wlRaw)?wlRaw[0]:wlRaw,sports=Array.isArray(sportsRaw)?sportsRaw[0]:sportsRaw;
  if(run!==profileRun421||routeNow()!=='profile')return{wl,sports};
  patchProfile421(wl,sports);
  for(const ms of[80,250,600,1200,2500,5000])setTimeout(()=>{if(run===profileRun421&&routeNow()==='profile')patchProfile421(wl,sports)},ms);
  return{wl,sports};
 })().finally(()=>{profileTask421=null});
 return profileTask421;
}

/* F1 — one authority: media_id 865, seasons are years, sessions are episodes. */
const F1_MEDIA_ID_421=865,f1Locks421=new WeakSet(),f1Maps421=new Map();
function f1Defs421(race){
 return [['fp1','Treino Livre 1','FirstPractice'],['fp2','Treino Livre 2','SecondPractice'],['fp3','Treino Livre 3','ThirdPractice'],['sprint_qualifying','Classificação Sprint','SprintQualifying'],['sprint_qualifying','Sprint Shootout','SprintShootout'],['sprint','Sprint','Sprint'],['qualifying','Classificação','Qualifying'],['race','Corrida',null]].map(([kind,label,key])=>{
  const x=key?race?.[key]:race;if(!x?.date)return null;const dt=new Date(x.date+'T'+(x.time||'00:00:00Z'));
  return{kind,label,round:num(race?.round)||1,date:dt,ms:dt.getTime(),raceName:String(race?.raceName||race?.name||race?.title||'Fórmula 1')};
 }).filter(Boolean);
}
async function f1Map421(season,force=false){
 if(!force&&f1Maps421.has(season))return f1Maps421.get(season);
 const task=(async()=>{const races=await ct284Races(season),all=[];for(const race of rows(races))all.push(...f1Defs421(race));all.sort((a,b)=>a.ms-b.ms);return all.map((x,i)=>({...x,season,episode:i+1,released:Number.isFinite(x.ms)&&x.ms<=Date.now(),title:x.raceName+' · '+x.label}))})();
 f1Maps421.set(season,task);try{return await task}catch(e){f1Maps421.delete(season);throw e}
}
function f1Entry421(btn,map){
 const modal=btn?.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,kind=String(btn?.dataset?.kind||'');if(!race)return null;
 const choices=map.filter(x=>x.round===num(race.round)&&x.kind===kind);if(choices.length<=1)return choices[0]||null;
 const want=kind==='sprint_qualifying'?(race.SprintQualifying?'Classificação Sprint':'Sprint Shootout'):'';
 return choices.find(x=>x.label===want)||choices[0]||null;
}
function paintF1Btn421(btn,on){
 if(!btn)return;btn.dataset.watched=on?'1':'0';btn.dataset.ct421Series=String(F1_MEDIA_ID_421);btn.classList.toggle('active',on);btn.textContent=on?'↶ Desmarcar assistido':'✓ Marcar como assistido';btn.disabled=false;btn.removeAttribute('aria-busy');
}
async function syncF1421(){
 const modal=q('[data-ct311-f1-modal]');if(!modal)return false;const race=modal.__ct311Race,season=num(race?.season);if(!season)return false;
 try{
  const [map,stateRaw]=await Promise.all([f1Map421(season),rpc('cinetracker_imported_series_state_v1',{p_media_id:F1_MEDIA_ID_421})]);
  const state=Array.isArray(stateRaw)?stateRaw[0]:stateRaw,watched=new Set(rows(state?.episodes).filter(x=>num(x.season_number)===season).map(x=>num(x.episode_number)));
  for(const btn of qa('[data-ct311-f1-watch]',modal)){const ep=f1Entry421(btn,map);if(!ep)continue;btn.dataset.ct421Episode=String(ep.episode);btn.dataset.ct421Title=ep.title;paintF1Btn421(btn,watched.has(ep.episode))}
  modal.dataset.ct421F1Series=String(F1_MEDIA_ID_421);return true;
 }catch(e){document.documentElement.dataset.ct421F1Error=String(e?.message||e);return false}
}
function scheduleF1Sync421(){for(const ms of[0,80,220,500,1000,1800])setTimeout(()=>void syncF1421(),ms)}
async function toggleF1421(btn){
 if(!btn||f1Locks421.has(btn))return false;const modal=btn.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,season=num(race?.season);if(!season)return false;
 f1Locks421.add(btn);const old=btn.dataset.watched==='1';paintF1Btn421(btn,!old);btn.disabled=true;btn.setAttribute('aria-busy','true');
 try{
  const map=await f1Map421(season),ep=f1Entry421(btn,map);if(!ep)throw new Error('F1_EPISODE_NOT_FOUND');
  await rpc('cinetracker_f1_episode_watch_set_v421',{p_season:season,p_episode:ep.episode,p_title:ep.title,p_runtime_minutes:ep.kind==='race'?120:60,p_released_episodes:map.filter(x=>x.released).length,p_watched:!old,p_watched_at:new Date().toISOString()});
  try{ct284Stable?.clear?.();ct284States?.clear?.();homeCache=null;profileCache=null}catch{}
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'f1-series-r421',media_id:F1_MEDIA_ID_421,season_number:season,episode_number:ep.episode,watched:!old}}));
  await syncF1421();try{toast(!old?'Episódio da Fórmula 1 marcado como assistido':'Episódio da Fórmula 1 desmarcado')}catch{}return true;
 }catch(e){paintF1Btn421(btn,old);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{}return false}
 finally{f1Locks421.delete(btn);if(btn?.isConnected){btn.disabled=false;btn.removeAttribute('aria-busy')}}
}

const baseRenderProfile421=typeof renderProfile==='function'?renderProfile:null;
if(baseRenderProfile421)renderProfile=async function(){const out=await baseRenderProfile421.apply(this,arguments);if(routeNow()==='profile')void loadProfile421();return out};
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;if(t.closest('[data-nav="profile"]'))setTimeout(()=>void loadProfile421(),0);if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]'))scheduleForYouSanitize421();if(t.closest('[data-ct311-f1-race]'))scheduleF1Sync421()},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')void loadProfile421();if(q('[data-ct311-f1-modal]'))scheduleF1Sync421()},0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile')void loadProfile421()});
function boot421(n=0){bindEligibility421();if(routeNow()==='profile')void loadProfile421();if(routeNow()==='discover')scheduleForYouSanitize421();if(q('[data-ct311-f1-modal]'))scheduleF1Sync421();if(n<30&&(!window.__ctR412Eligibility||!window.__ctR411))setTimeout(()=>boot421(n+1),120)}
window.__ctR421={version:'1.0.212',scope:'standup-hard-block+f1-series-only+profile-watchlist-truth+full-rails',isStandup:isStandup421,filterRecommendations:filterRecommendations421,sanitizeForYou:sanitizeForYou421,bindEligibility:bindEligibility421,loadProfile:loadProfile421,patchProfile:patchProfile421,syncF1:syncF1421,scheduleF1Sync:scheduleF1Sync421,toggleF1:toggleF1421};
window.__ctR421Marker='standup-detail-filter+f1-media-865-only+profile-watchlist-nonzero+profile-full-rails';
bindEligibility421();queueMicrotask(()=>boot421(0));
})();
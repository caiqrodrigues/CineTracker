/* CineTracker Web 1.0.214 r423 — hard Formula 1 owner: Series + Sports + F1 Hub are one synchronized state. */
(()=>{
'use strict';
if(window.__ctR423?.version==='1.0.214')return;
const F1_MEDIA_ID_423=865;
const q423=(s,r=document)=>r?.querySelector?.(s)||null;
const qa423=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows423=v=>Array.isArray(v)?v:[];
const num423=v=>Number.isFinite(Number(v))?Number(v):0;
const norm423=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const locks423=new WeakSet();
const maps423=new Map();
const persisted423=new Map();
const reconciled423=new Map();

function kindFromText423(v){
 const t=norm423(v);
 if(/(practice|treino livre) 1\b/.test(t))return'fp1';
 if(/(practice|treino livre) 2\b/.test(t))return'fp2';
 if(/(practice|treino livre) 3\b/.test(t))return'fp3';
 if(/sprint (qualifying|shootout)|qualifying sprint|classificacao sprint/.test(t))return'sprint_qualifying';
 if(/\bsprint\b/.test(t))return'sprint';
 if(/\b(qualifying|classificacao)\b/.test(t))return'qualifying';
 if(/grand prix|corrida|\brace\b/.test(t))return'race';
 return'';
}
function defs423(race){
 const defs=[
  ['fp1','Practice 1','FirstPractice'],['fp2','Practice 2','SecondPractice'],['fp3','Practice 3','ThirdPractice'],
  ['sprint_qualifying','Sprint Shootout','SprintShootout'],['sprint_qualifying','Sprint Qualifying','SprintQualifying'],
  ['sprint','Sprint Race','Sprint'],['qualifying','Qualifying','Qualifying'],['race','Race',null]
 ];
 return defs.map(([kind,label,key])=>{
  const x=key?race?.[key]:race;
  if(!x?.date)return null;
  const date=new Date(`${x.date}T${x.time||'00:00:00Z'}`),ms=date.getTime();
  if(!Number.isFinite(ms))return null;
  return{kind,label,round:num423(race?.round)||1,date,ms,raceName:String(race?.raceName||race?.name||race?.title||'Formula 1')};
 }).filter(Boolean);
}
async function races423(season){
 if(typeof ct284Races==='function')return ct284Races(season);
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8000);
 try{
  const res=await fetch(`https://api.jolpi.ca/ergast/f1/${season}.json`,{headers:{accept:'application/json'},signal:ctl.signal});
  if(!res.ok)throw new Error('F1_SCHEDULE_HTTP_'+res.status);
  const data=await res.json();return rows423(data?.MRData?.RaceTable?.Races);
 }finally{clearTimeout(timer)}
}
async function map423(season,force=false){
 season=num423(season);if(!season)throw new Error('F1_SEASON_REQUIRED');
 if(!force&&maps423.has(season))return maps423.get(season);
 const task=(async()=>{
  const all=[];
  for(const race of rows423(await races423(season)))all.push(...defs423(race));
  all.sort((a,b)=>a.ms-b.ms);
  return all.map((x,i)=>({...x,season,episode:i+1,released:x.ms<=Date.now(),title:`${x.raceName} (${x.label})`}));
 })();
 maps423.set(season,task);
 try{return await task}catch(e){maps423.delete(season);throw e}
}
function runtime423(ep){return ep?.kind==='race'?120:60}
function canonical423(ep){return`f1:${ep.season}:${ep.round}:${ep.kind}`}
function mapPayload423(map){return map.map(ep=>({
 season:ep.season,episode_number:ep.episode,round:ep.round,session_kind:ep.kind,title:ep.title,
 starts_at:ep.date.toISOString(),runtime_minutes:runtime423(ep),canonical_provider_event_id:canonical423(ep)
}))}
async function persistMap423(map,force=false){
 const season=num423(map?.[0]?.season);if(!season||!map?.length)return false;
 if(!force&&persisted423.has(season))return persisted423.get(season);
 const task=rpc('cinetracker_f1_map_replace_v423',{p_rows:mapPayload423(map)}).then(()=>true);
 persisted423.set(season,task);
 try{return await task}catch(e){persisted423.delete(season);throw e}
}
async function reconcile423(season,force=false){
 season=num423(season);if(!season)return null;
 if(!force&&reconciled423.has(season))return reconciled423.get(season);
 const task=(async()=>{const map=await map423(season);await persistMap423(map);return rpc('cinetracker_f1_reconcile_v423',{p_season:season})})();
 reconciled423.set(season,task);
 try{return await task}catch(e){reconciled423.delete(season);throw e}
}
function entryByEpisode423(map,season,episode){return map.find(x=>x.season===num423(season)&&x.episode===num423(episode))||null}
function entryForHub423(btn,map){
 const modal=btn?.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,kind=String(btn?.dataset?.kind||'');if(!race||!kind)return null;
 const choices=map.filter(x=>x.round===num423(race.round)&&x.kind===kind);
 if(choices.length<=1)return choices[0]||null;
 const want=kind==='sprint_qualifying'?(race.SprintQualifying?'Sprint Qualifying':'Sprint Shootout'):'';
 return choices.find(x=>x.label===want)||choices[0]||null;
}
function entryForSport423(btn,map){
 const round=num423(btn?.dataset?.sportRound),kind=kindFromText423(btn?.dataset?.sportTitle||btn?.closest?.('.ct255-sport-card')?.textContent||''),target=new Date(btn?.dataset?.sportStartsAt||0).getTime();
 let candidates=map;
 if(round)candidates=candidates.filter(x=>x.round===round);
 if(kind)candidates=candidates.filter(x=>x.kind===kind);
 if(!candidates.length)return null;
 if(Number.isFinite(target)&&target>0)candidates=[...candidates].sort((a,b)=>Math.abs(a.ms-target)-Math.abs(b.ms-target));
 const ep=candidates[0]||null;
 if(!ep)return null;
 if(Number.isFinite(target)&&target>0&&Math.abs(ep.ms-target)>18*3600000&&!round)return null;
 return ep;
}
function invalidate423(detail={}){
 try{ct284Stable?.clear?.();ct284States?.clear?.();ct284F1?.clear?.()}catch{}
 try{ct285HomePayload=null;ct285CommittedRows=null;homeCache=null;profileCache=null}catch{}
 const payload={source:'f1-hard-r423',media_id:F1_MEDIA_ID_423,...detail};
 try{document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:payload}))}catch{}
 try{window.dispatchEvent(new CustomEvent('cinetracker:f1-watched-changed',{detail:payload}))}catch{}
}
async function syncWrite423(ep,{watched=true,title=null,provider='cinetracker-f1',providerEventId=null,watchedAt=null,attended=false,stadium=null,metadata=null}={}){
 const map=await map423(ep.season);await persistMap423(map);
 const released=map.filter(x=>x.released).length;
 return rpc('cinetracker_f1_watch_sync_v423',{
  p_season:ep.season,p_episode:ep.episode,p_round:ep.round,p_session_kind:ep.kind,
  p_title:title||ep.title,p_starts_at:ep.date.toISOString(),p_runtime_minutes:runtime423(ep),p_released_episodes:released,
  p_watched:!!watched,p_watched_at:watchedAt||new Date().toISOString(),p_provider:provider||'cinetracker-f1',
  p_provider_event_id:providerEventId||canonical423(ep),p_attended_in_person:!!attended,p_stadium_name:stadium||null,
  p_metadata:{source:'web-r423',media_id:F1_MEDIA_ID_423,episode_number:ep.episode,...(metadata||{})}
 });
}
function seriesProgress423(){
 const el=q423('[data-ct285-progress],[data-ct284-progress]'),text=String(el?.textContent||''),m=text.match(/(\d+)\s*\/\s*(\d+)\s*assistidos/i),r=text.match(/(\d+)\s*j[aá]\s*exibidos/i);
 return{el,text,watched:m?num423(m[1]):0,total:m?num423(m[2]):0,released:r?num423(r[1]):null};
}
function optimisticSeries423(btn){
 const card=btn?.closest?.('[data-ct285-episode-card],.ct285-episode,.ct284-episode'),status=q423('em',card),progress=seriesProgress423();if(!card)return null;
 const snap={card,status,btn,cardClass:card.className,statusText:status?.textContent||'',progressText:progress.text,hidden:btn.hidden,disabled:btn.disabled};
 card.classList.add('watched','ct423-f1-watched');if(status)status.textContent='✓ Assistido';btn.hidden=true;btn.disabled=true;btn.setAttribute('aria-disabled','true');
 if(progress.el&&progress.total>0)progress.el.textContent=`${Math.min(progress.total,progress.watched+1)}/${progress.total} assistidos${progress.released!=null?` · ${progress.released} já exibidos`:''}`;
 return snap;
}
function rollbackSeries423(snap){
 if(!snap)return;try{snap.card.className=snap.cardClass;if(snap.status)snap.status.textContent=snap.statusText;if(snap.btn?.isConnected){snap.btn.hidden=snap.hidden;snap.btn.disabled=snap.disabled;snap.btn.removeAttribute('aria-disabled')}const p=seriesProgress423();if(p.el)p.el.textContent=snap.progressText}catch{}
}
async function markSeriesF1423(btn){
 if(!btn||locks423.has(btn))return false;
 const media=num423(btn.dataset.mediaId),season=num423(btn.dataset.season),episode=num423(btn.dataset.episode);if(media!==F1_MEDIA_ID_423||!season||!episode)return false;
 locks423.add(btn);const snap=optimisticSeries423(btn);btn.setAttribute('aria-busy','true');
 try{
  const map=await map423(season),ep=entryByEpisode423(map,season,episode);if(!ep)throw new Error('F1_EPISODE_MAP_NOT_FOUND');
  await syncWrite423(ep,{watched:true,title:btn.dataset.title||ep.title,metadata:{surface:'series'}});
  invalidate423({season_number:season,episode_number:episode,watched:true,surface:'series'});
  try{toast('Fórmula 1 sincronizada em Série e Esportes')}catch{}return true;
 }catch(e){rollbackSeries423(snap);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{}return false}
 finally{locks423.delete(btn);if(btn?.isConnected){btn.removeAttribute('aria-busy');if(!btn.hidden)btn.disabled=false}}
}
function paintHub423(btn,on){
 if(!btn)return;btn.dataset.watched=on?'1':'0';btn.dataset.ct423Series=String(F1_MEDIA_ID_423);btn.classList.toggle('active',on);btn.textContent=on?'↶ Desmarcar assistido':'✓ Marcar como assistido';btn.disabled=false;btn.removeAttribute('aria-busy');
}
async function syncHub423(){
 const modal=q423('[data-ct311-f1-modal]');if(!modal)return false;const race=modal.__ct311Race,season=num423(race?.season)||num423(String(race?.date||'').slice(0,4))||new Date().getFullYear();if(!race||!season)return false;
 try{
  const map=await map423(season);await persistMap423(map);await reconcile423(season).catch(()=>null);
  const stateRaw=await rpc('cinetracker_imported_series_state_v1',{p_media_id:F1_MEDIA_ID_423}),state=Array.isArray(stateRaw)?stateRaw[0]:stateRaw;
  const watched=new Set(rows423(state?.episodes).filter(x=>num423(x.season_number)===season&&x.watched!==false).map(x=>num423(x.episode_number)));
  for(const btn of qa423('[data-ct311-f1-watch]',modal)){const ep=entryForHub423(btn,map);if(!ep)continue;btn.dataset.ct423Episode=String(ep.episode);btn.dataset.ct423Title=ep.title;paintHub423(btn,watched.has(ep.episode))}
  modal.dataset.ct423F1Sync='1';return true;
 }catch(e){document.documentElement.dataset.ct423F1HubError=String(e?.message||e);return false}
}
function scheduleHub423(){for(const ms of[0,80,220,500,1000])setTimeout(()=>void syncHub423(),ms)}
async function toggleHub423(btn){
 if(!btn||locks423.has(btn))return false;const modal=btn.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,season=num423(race?.season)||num423(String(race?.date||'').slice(0,4))||new Date().getFullYear();if(!race||!season)return false;
 locks423.add(btn);const old=btn.dataset.watched==='1';paintHub423(btn,!old);btn.disabled=true;btn.setAttribute('aria-busy','true');
 try{
  const map=await map423(season),ep=entryForHub423(btn,map);if(!ep)throw new Error('F1_EPISODE_MAP_NOT_FOUND');
  await syncWrite423(ep,{watched:!old,title:ep.title,metadata:{surface:'f1hub'}});invalidate423({season_number:season,episode_number:ep.episode,watched:!old,surface:'f1hub'});await syncHub423();
  try{toast(!old?'Fórmula 1 sincronizada em Série e Esportes':'Fórmula 1 desmarcada em Série e Esportes')}catch{}return true;
 }catch(e){paintHub423(btn,old);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{}return false}
 finally{locks423.delete(btn);if(btn?.isConnected){btn.disabled=false;btn.removeAttribute('aria-busy')}}
}
function ownsSport423(btn){return norm423(btn?.dataset?.sportSlug)==='formula 1'||String(btn?.dataset?.sportSlug||'')==='formula_1'}
async function sportRpc423(btn,args){
 if(!ownsSport423(btn))throw new Error('F1_SPORT_OWNER_MISMATCH');
 const starts=String(btn?.dataset?.sportStartsAt||''),season=num423(btn?.dataset?.sportSeason)||num423(starts.slice(0,4))||new Date().getFullYear();
 const map=await map423(season),ep=entryForSport423(btn,map);if(!ep)throw new Error('F1_SPORT_TO_EPISODE_MAP_NOT_FOUND');
 const out=await syncWrite423(ep,{
  watched:args?.p_watched!==false,title:btn?.dataset?.sportTitle||ep.title,provider:String(args?.p_provider||btn?.dataset?.provider||'cinetracker-f1'),
  providerEventId:String(args?.p_provider_event_id||btn?.dataset?.ct255Watch||canonical423(ep)),watchedAt:args?.p_watched_at||new Date().toISOString(),metadata:{surface:'sports'}
 });
 invalidate423({season_number:ep.season,episode_number:ep.episode,watched:args?.p_watched!==false,surface:'sports'});scheduleHub423();return out;
}
window.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct311-f1-race]'))scheduleHub423()},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(q423('[data-ct311-f1-modal]'))scheduleHub423()},0));
window.addEventListener('cinetracker:f1-watched-changed',()=>{if(q423('[data-ct311-f1-modal]'))scheduleHub423()});
window.__ctR423={version:'1.0.214',scope:'f1-hard-three-way-sync',map:map423,persistMap:persistMap423,reconcile:reconcile423,syncWrite:syncWrite423,markSeriesF1:markSeriesF1423,toggleF1Hub:toggleHub423,syncF1Hub:syncHub423,scheduleF1Sync:scheduleHub423,ownsSport:ownsSport423,sportRpc:sportRpc423};
window.__ctR423Test={kindFromText:kindFromText423,defs:defs423,entryByEpisode:entryByEpisode423,entryForSport:entryForSport423,runtime:runtime423,canonical:canonical423};
window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation';
})();

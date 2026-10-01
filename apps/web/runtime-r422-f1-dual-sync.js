/* CineTracker Web 1.0.213 r422 — Formula 1 dual authority: series episode + sports event, synchronized from every Web surface. */
(()=>{
'use strict';
if(window.__ctR422?.version==='1.0.213')return;
const F1_MEDIA_ID_422=865;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const f1Locks422=new WeakSet(),f1Maps422=new Map();
let rawApi422=null,apiWrapped422=false;
function f1KindFromText422(v){
 const t=norm(v);
 if(/(practice|treino livre) 1\b/.test(t))return'fp1';
 if(/(practice|treino livre) 2\b/.test(t))return'fp2';
 if(/(practice|treino livre) 3\b/.test(t))return'fp3';
 if(/sprint (qualifying|shootout)|qualifying sprint|classificacao sprint/.test(t))return'sprint_qualifying';
 if(/\bsprint\b/.test(t))return'sprint';
 if(/\b(qualifying|classificacao)\b/.test(t))return'qualifying';
 if(/grand prix|corrida|\brace\b/.test(t))return'race';
 return'';
}
function f1Defs422(race){
 const defs=[
  ['fp1','Treino Livre 1','FirstPractice'],['fp2','Treino Livre 2','SecondPractice'],['fp3','Treino Livre 3','ThirdPractice'],
  ['sprint_qualifying','Classificação Sprint','SprintQualifying'],['sprint_qualifying','Sprint Shootout','SprintShootout'],
  ['sprint','Sprint','Sprint'],['qualifying','Classificação','Qualifying'],['race','Corrida',null]
 ];
 return defs.map(([kind,label,key])=>{
  const x=key?race?.[key]:race;if(!x?.date)return null;
  const dt=new Date(x.date+'T'+(x.time||'00:00:00Z')),ms=dt.getTime();if(!Number.isFinite(ms))return null;
  return{kind,label,round:num(race?.round)||1,date:dt,ms,raceName:String(race?.raceName||race?.name||race?.title||'Fórmula 1')};
 }).filter(Boolean);
}
async function f1Map422(season,force=false){
 season=num(season);if(!season)throw new Error('F1_SEASON_REQUIRED');
 if(!force&&f1Maps422.has(season))return f1Maps422.get(season);
 const task=(async()=>{
  if(typeof ct284Races!=='function')throw new Error('F1_SCHEDULE_UNAVAILABLE');
  const races=await ct284Races(season),all=[];
  for(const race of rows(races))all.push(...f1Defs422(race));
  all.sort((a,b)=>a.ms-b.ms);
  return all.map((x,i)=>({...x,season,episode:i+1,released:x.ms<=Date.now(),title:x.raceName+' · '+x.label}));
 })();
 f1Maps422.set(season,task);try{return await task}catch(e){f1Maps422.delete(season);throw e}
}
function f1EntryForHub422(btn,map){
 const modal=btn?.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,kind=String(btn?.dataset?.kind||'');if(!race)return null;
 const choices=map.filter(x=>x.round===num(race.round)&&x.kind===kind);if(choices.length<=1)return choices[0]||null;
 const want=kind==='sprint_qualifying'?(race.SprintQualifying?'Classificação Sprint':'Sprint Shootout'):'';
 return choices.find(x=>x.label===want)||choices[0]||null;
}
function f1EntryForEpisode422(season,episode,map){return map.find(x=>x.season===num(season)&&x.episode===num(episode))||null}
function canonicalId422(ep){return 'f1:'+ep.season+':'+ep.round+':'+ep.kind}
function runtime422(ep){return ep?.kind==='race'?120:60}
function invalidateF1422(detail={}){
 try{ct284Stable?.clear?.();ct284States?.clear?.()}catch{}
 try{ct285HomePayload=null;ct285CommittedRows=null;homeCache=null;profileCache=null}catch{}
 try{if(typeof sport255!=='undefined'&&sport255){sport255.payload=null;sport255.at=0}}catch{}
 document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'f1-dual-r422',media_id:F1_MEDIA_ID_422,...detail}}));
}
async function syncWrite422(ep,{watched=true,title=null,provider='jolpica',providerEventId=null,attended=false,stadium=null,metadata=null}={}){
 const map=await f1Map422(ep.season),released=map.filter(x=>x.released).length;
 return rpc('cinetracker_f1_watch_sync_v422',{
  p_season:ep.season,p_episode:ep.episode,p_round:ep.round,p_session_kind:ep.kind,
  p_title:title||ep.title,p_starts_at:ep.date.toISOString(),p_runtime_minutes:runtime422(ep),p_released_episodes:released,
  p_watched:!!watched,p_watched_at:new Date().toISOString(),p_provider:provider||'jolpica',p_provider_event_id:providerEventId||canonicalId422(ep),
  p_attended_in_person:!!attended,p_stadium_name:stadium||null,p_metadata:{source:'web-r422',media_id:F1_MEDIA_ID_422,episode_number:ep.episode,...(metadata||{})}
 });
}
function paintHubBtn422(btn,on){
 if(!btn)return;btn.dataset.watched=on?'1':'0';btn.dataset.ct422Series=String(F1_MEDIA_ID_422);btn.classList.toggle('active',on);
 btn.textContent=on?'↶ Desmarcar assistido':'✓ Marcar como assistido';btn.disabled=false;btn.removeAttribute('aria-busy');
}
async function syncF1Hub422(){
 const modal=q('[data-ct311-f1-modal]');if(!modal)return false;const race=modal.__ct311Race,season=num(race?.season);if(!season)return false;
 try{
  const [map,stateRaw]=await Promise.all([f1Map422(season),rpc('cinetracker_imported_series_state_v1',{p_media_id:F1_MEDIA_ID_422})]);
  const state=Array.isArray(stateRaw)?stateRaw[0]:stateRaw,watched=new Set(rows(state?.episodes).filter(x=>num(x.season_number)===season).map(x=>num(x.episode_number)));
  for(const btn of qa('[data-ct311-f1-watch]',modal)){const ep=f1EntryForHub422(btn,map);if(!ep)continue;btn.dataset.ct422Episode=String(ep.episode);btn.dataset.ct422Title=ep.title;paintHubBtn422(btn,watched.has(ep.episode))}
  modal.dataset.ct422F1Dual='1';return true;
 }catch(e){document.documentElement.dataset.ct422F1HubError=String(e?.message||e);return false}
}
function scheduleF1Hub422(){for(const ms of[0,80,220,500,1000,1800])setTimeout(()=>void syncF1Hub422(),ms)}
async function toggleF1Hub422(btn){
 if(!btn||f1Locks422.has(btn))return false;const modal=btn.closest?.('[data-ct311-f1-modal]'),race=modal?.__ct311Race,season=num(race?.season);if(!season)return false;
 f1Locks422.add(btn);const old=btn.dataset.watched==='1';paintHubBtn422(btn,!old);btn.disabled=true;btn.setAttribute('aria-busy','true');
 try{
  const map=await f1Map422(season),ep=f1EntryForHub422(btn,map);if(!ep)throw new Error('F1_EPISODE_NOT_FOUND');
  await syncWrite422(ep,{watched:!old,title:ep.title,provider:'jolpica',providerEventId:canonicalId422(ep),metadata:{surface:'f1hub'}});
  invalidateF1422({season_number:season,episode_number:ep.episode,watched:!old,surface:'f1hub'});await syncF1Hub422();
  try{toast(!old?'Fórmula 1 marcada como série e esporte':'Fórmula 1 desmarcada em série e esporte')}catch{}return true;
 }catch(e){paintHubBtn422(btn,old);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{}return false}
 finally{f1Locks422.delete(btn);if(btn?.isConnected){btn.disabled=false;btn.removeAttribute('aria-busy')}}
}
function seriesProgress422(){
 const p=q('[data-ct285-progress],[data-ct284-progress]'),t=String(p?.textContent||''),m=t.match(/(\d+)\s*\/\s*(\d+)\s*assistidos/i),r=t.match(/(\d+)\s*j[aá]\s*exibidos/i);
 return{el:p,watched:m?num(m[1]):0,total:m?num(m[2]):0,released:r?num(r[1]):null,text:t};
}
function optimisticSeries422(btn,on){
 const card=btn?.closest?.('[data-ct285-episode-card],.ct285-episode,.ct284-episode'),em=q('em',card),p=seriesProgress422();if(!card)return null;
 const snap={card,em,btn,status:em?.textContent||'',classes:card.className,progress:p.text};card.classList.toggle('watched',on);card.classList.toggle('ct422-f1-watched',on);if(em)em.textContent=on?'✓ Assistido':'Não assistido';
 if(on){btn.hidden=true;btn.disabled=true;btn.setAttribute('aria-disabled','true');if(p.el&&p.total>0)p.el.textContent=Math.min(p.total,p.watched+1)+'/'+p.total+' assistidos'+(p.released!=null?' · '+p.released+' já exibidos':'')}
 return snap;
}
function rollbackSeries422(s){if(!s)return;try{s.card.className=s.classes;if(s.em)s.em.textContent=s.status;if(s.btn?.isConnected){s.btn.hidden=false;s.btn.disabled=false;s.btn.removeAttribute('aria-disabled')}if(seriesProgress422().el)seriesProgress422().el.textContent=s.progress}catch{}}
async function markSeriesF1422(btn){
 if(!btn||f1Locks422.has(btn))return false;const mid=num(btn.dataset.mediaId),season=num(btn.dataset.season),episode=num(btn.dataset.episode);if(mid!==F1_MEDIA_ID_422||!season||!episode)return false;
 f1Locks422.add(btn);const snap=optimisticSeries422(btn,true);btn.setAttribute('aria-busy','true');
 try{
  const map=await f1Map422(season),ep=f1EntryForEpisode422(season,episode,map);if(!ep)throw new Error('F1_EPISODE_MAP_NOT_FOUND');
  const title=btn.dataset.title||q('b',snap?.card)?.textContent||ep.title;
  await syncWrite422(ep,{watched:true,title,provider:'jolpica',providerEventId:canonicalId422(ep),metadata:{surface:'series'}});
  invalidateF1422({season_number:season,episode_number:episode,watched:true,surface:'series'});try{void ct284State?.('f1',true)}catch{};try{toast('Episódio da Fórmula 1 marcado como série e esporte')}catch{}return true;
 }catch(e){rollbackSeries422(snap);try{toast('Fórmula 1: '+(e?.message||String(e)))}catch{}return false}
 finally{f1Locks422.delete(btn);if(btn?.isConnected){btn.removeAttribute('aria-busy');if(!btn.hidden)btn.disabled=false}}
}
function sportsIsF1422(p){return norm(p?.p_sport_slug)==='formula 1'||norm(p?.p_sport_slug)==='formula_1'||/\bformula 1\b|\bf1\b/.test(norm([p?.p_competition_name,p?.p_title].filter(Boolean).join(' ')))}
function providerContext422(p){
 const id=String(p?.p_provider_event_id||''),m=id.match(/^f1:(\d{4}):(\d+):(fp1|fp2|fp3|sprint_qualifying|sprint|qualifying|race)$/i),m2=id.match(/^(\d{4}):(\d+):(fp1|fp2|fp3|sprint_qualifying|sprint|qualifying|race)$/i);
 const meta=p?.p_metadata&&typeof p.p_metadata==='object'?p.p_metadata:{};return{season:num(meta.season||(m?.[1])||(m2?.[1])||(p?.p_starts_at?new Date(p.p_starts_at).getUTCFullYear():0)),round:num(meta.round||m?.[2]||m2?.[2]),kind:String(meta.session_kind||m?.[3]||m2?.[3]||f1KindFromText422(p?.p_title)||'')};
}
async function sportsEntry422(p){
 const c=providerContext422(p);if(!c.season)return null;const map=await f1Map422(c.season),target=new Date(p?.p_starts_at||0).getTime();let candidates=map;
 if(c.round)candidates=candidates.filter(x=>x.round===c.round);if(c.kind)candidates=candidates.filter(x=>x.kind===c.kind);
 if(!candidates.length)candidates=map;if(Number.isFinite(target)&&target>0)candidates=[...candidates].sort((a,b)=>Math.abs(a.ms-target)-Math.abs(b.ms-target));
 const ep=candidates[0]||null;if(!ep)return null;if(Number.isFinite(target)&&target>0&&Math.abs(ep.ms-target)>36*3600000&&!c.round)return null;return ep;
}
async function interceptSportsWatch422(path,options){
 let p=null;try{p=typeof options?.body==='string'?JSON.parse(options.body):options?.body}catch{}
 if(!sportsIsF1422(p))return rawApi422(path,options);
 const ep=await sportsEntry422(p);if(!ep)throw new Error('F1_SPORT_TO_SERIES_MAP_NOT_FOUND');
 const body={p_season:ep.season,p_episode:ep.episode,p_round:ep.round,p_session_kind:ep.kind,p_title:p?.p_title||ep.title,p_starts_at:ep.date.toISOString(),p_runtime_minutes:runtime422(ep),p_released_episodes:(await f1Map422(ep.season)).filter(x=>x.released).length,p_watched:p?.p_watched!==false,p_watched_at:new Date().toISOString(),p_provider:String(p?.p_provider||'unknown'),p_provider_event_id:String(p?.p_provider_event_id||canonicalId422(ep)),p_attended_in_person:!!p?.p_attended_in_person,p_stadium_name:p?.p_stadium_name||null,p_metadata:{...(p?.p_metadata||{}),source:'sports-r422',media_id:F1_MEDIA_ID_422,episode_number:ep.episode}};
 const out=await rawApi422('rpc/cinetracker_f1_watch_sync_v422',{method:'POST',body:JSON.stringify(body)});
 invalidateF1422({season_number:ep.season,episode_number:ep.episode,watched:body.p_watched,surface:'sports'});scheduleF1Hub422();return out;
}
function bindApi422(){
 if(apiWrapped422)return true;
 try{
  if(typeof api!=='function')return false;rawApi422=api;
  api=async function(path,options={}){if(String(path)==='rpc/cinetracker_sports_watch_set_v296')return interceptSportsWatch422(path,options);return rawApi422(path,options)};
  apiWrapped422=true;return true;
 }catch{return false}
}
function bindOwners422(){
 try{if(window.__ctR421){window.__ctR421.toggleF1=toggleF1Hub422;window.__ctR421.syncF1=syncF1Hub422;window.__ctR421.scheduleF1Sync=scheduleF1Hub422}}catch{}
 try{toggleF1Session311=function(btn){return toggleF1Hub422(btn)}}catch{}
 try{if(window.__ctR311Test)window.__ctR311Test.toggleF1Session311=function(btn){return toggleF1Hub422(btn)}}catch{}
 try{ct285Mark=markSeriesF1422}catch{}try{ct284Mark=markSeriesF1422}catch{}
 try{if(window.__ctR285Test)window.__ctR285Test.mark=markSeriesF1422}catch{}
 try{if(window.__ctR416)window.__ctR416.markF1=markSeriesF1422}catch{}
}
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;if(t.closest('[data-ct311-f1-race]'))scheduleF1Hub422()},true);
window.addEventListener('popstate',()=>setTimeout(()=>{bindOwners422();bindApi422();if(q('[data-ct311-f1-modal]'))scheduleF1Hub422()},0));
function boot422(n=0){bindOwners422();bindApi422();if(q('[data-ct311-f1-modal]'))scheduleF1Hub422();if(n<24&&(!apiWrapped422||!window.__ctR421))setTimeout(()=>boot422(n+1),120)}
window.__ctR422={version:'1.0.213',scope:'f1-dual-series+sports-web',map:f1Map422,syncWrite:syncWrite422,toggleF1:toggleF1Hub422,markSeries:markSeriesF1422,syncF1:syncF1Hub422,scheduleF1Sync:scheduleF1Hub422,bindOwners:bindOwners422,bindApi:bindApi422};
window.__ctR422Test={kindFromText:f1KindFromText422,providerContext:providerContext422,sportsIsF1:sportsIsF1422};
window.__ctR422Marker='f1-series-865+sport-history-dual-sync+series-sports-f1hub-three-way';
bindOwners422();bindApi422();queueMicrotask(()=>boot422(0));
})();
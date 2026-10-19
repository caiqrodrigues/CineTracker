/* Android r270 direct repair for sports mutations; no parent repaint, no scroll reset. */
const ct270SportsPending=new Set();
function ct270SetSport(eventId,on,disabled=false){
 for(const b of document.querySelectorAll('[data-sport-watch="'+eventId+'"],[data-sport-watched="'+eventId+'"],[data-ct263-sport-watch="'+eventId+'"]')){
  b.disabled=disabled;
  if(b.matches('[data-sport-watch]')){b.dataset.watched=on?'1':'0';b.classList.toggle('on',on);b.textContent=on?'✓ Assistido':'✓ Marcar assistido'}
  else if(b.matches('[data-sport-watched]')){b.dataset.on=on?'1':'0';b.classList.toggle('on',on);b.textContent=on?'✓ Assistido':'✓ Marcar como assistido'}
  else b.textContent=on?'↶ Desmarcar assistido':'✓ Marcar como assistido';
 }
 for(const ev of sportsCache?.events||[])if(Number(ev.id)===eventId)ev.is_watched=on;
 for(const ev of sportsCache?.watch_history||[])if(Number(ev.id)===eventId)ev.is_watched=on;
 if(typeof sportsDetail263!=='undefined'&&sportsDetail263)for(const ev of sportsDetail263.events||[])if(Number(ev.id)===eventId)ev.is_watched=on;
}
async function ct270CommitSport(eventId,on,previous){
 if(ct270SportsPending.has(eventId))return false;
 ct270SportsPending.add(eventId);ct270SetSport(eventId,on,true);
 try{
  const result=await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:eventId,p_watched:on,p_duration_minutes:null,p_watched_at:new Date().toISOString()});
  const actual=typeof result?.is_watched==='boolean'?result.is_watched:on;
  ct270SetSport(eventId,actual,false);
  try{ct163Write('sports',sportsCache);window.__ctA26PersistSports?.()}catch{}
  try{profileCache=null;localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}
  toast(actual?'Evento marcado como assistido.':'Evento removido do histórico.');
  return true;
 }catch(e){ct270SetSport(eventId,previous,false);toast('Esportes: '+(e?.message||e));return false}
 finally{ct270SportsPending.delete(eventId)}
}
async function markSportWatched159(eventId,currentlyWatched){
 const id=Number(eventId);
 if(!(id>0)||ct270SportsPending.has(id))return;
 await ct270CommitSport(id,!currentlyWatched,currentlyWatched);
}
//__CT270_SPORT_BASE_END__
async function toggleSports263(btn){
 const id=Number(btn?.dataset?.ct263SportWatch||0);
 if(!(id>0)||!sportsDetail263||ct270SportsPending.has(id))return;
 const ev=(sportsDetail263.events||[]).find(x=>Number(x.id)===id);
 if(!ev)return;
 const previous=Boolean(ev.is_watched);
 await ct270CommitSport(id,!previous,previous);
 // Deliberately keep the SAME detail DOM and scroll position; no renderSportsDetail263.
}
//__CT270_SPORT_DETAIL_END__

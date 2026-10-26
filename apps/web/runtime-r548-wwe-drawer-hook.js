/* Inserted in the existing r169 Web detail closure by build-r548; WWE only. */
const ct548WweIds=new Set([4656,1549]);
let ct548RequestedSeason=0,ct548Busy={current:false};
const ct548WweAliases=new Map();
const ct548BaseOpen=ct169OpenSeasonDrawer;
const ct548BaseWatched=ct169WatchedSet;
const ct548BaseEpisode=ct169DrawerEpisode;
const ct548BaseGraphs=ct169LoadSeasonGraphs;
function ct548Wwe(id){return ct548WweIds.has(Number(id))}
function ct548Keys(v){return Array.isArray(v)?v:Array.isArray(v?.rows)?v.rows:[]}
function ct548Timeout(p,ms){return Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo esgotado ao buscar episódios')),ms))])}
ct169OpenSeasonDrawer=async function(showId,seasonNo,jumpEp=0){
 if(ct548Wwe(showId))ct548RequestedSeason=Number(seasonNo);
 return ct548BaseOpen(showId,seasonNo,jumpEp);
};
ct169WatchedSet=async function(showId){
 if(!ct548Wwe(showId))return ct548BaseWatched(showId);
 const wanted=ct548RequestedSeason;
 const raw=await ct548Timeout(rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:[Number(showId)]}),9500);
 const row=ct548Keys(raw).find(x=>Number(x?.tmdb_id)===Number(showId));
 if(!row)throw new Error('Não foi possível confirmar os episódios assistidos.');
 ct548WweAliases.set(Number(showId),ct548Keys(row.media_ids).map(Number).filter(x=>x>0));
 return new Set(ct548Keys(row.watched_keys).filter(x=>Number(x?.s)===wanted).map(x=>Number(x.s)+':'+Number(x.e)));
};
ct169DrawerEpisode=function(ep,sn,watched){
 const html=ct548BaseEpisode(ep,sn,watched),st=ct169DrawerState;
 if(!ct548Wwe(st?.showId))return html;
 const en=Number(ep.episode_number),seen=watched.has(Number(sn)+':'+en);
 const button='<button type="button" data-ct548-episode-toggle="'+Number(sn)+':'+en+'" data-watched="'+(seen?'1':'0')+'">'+(seen?'↶ Desmarcar':'✓ Marcar visto')+'</button>';
 return seen?html.replace('<span>✓ Visto</span>',button):html.replace(/<button type="button" data-ct169-mark-episode="\d+:\d+">✓ Marcar visto<\/button>/,button);
};
ct169LoadSeasonGraphs=async function(showId,seasons,seq){
 if(!ct548Wwe(showId))return ct548BaseGraphs(showId,seasons,seq);
 const root=document.querySelector('[data-ct169-season-charts]');if(!root)return;
 const cards=Array.from(root.querySelectorAll('[data-ct169-chart-season]'));
 let queued=[],inFlight=0,closed=false;
 const fill=()=>{
  while(inFlight<2&&queued.length){
   const card=queued.shift(),sn=Number(card.dataset.ct169ChartSeason);inFlight++;
   Promise.resolve(tmdb('/tv/'+Number(showId)+'/season/'+sn)).then(sd=>{
    if(!closed&&seq===navSeq&&route()==='series'&&card.isConnected){
     const target=card.querySelector('.ct169-chart-body');
     if(target)target.innerHTML=ct169ChartHtml(sn,(sd.episodes||[]).filter(e=>Number(e.episode_number)>0));
    }
   }).catch(()=>{const target=card.querySelector('.ct169-chart-body');if(target&&card.isConnected)target.innerHTML='<div class="ct169-chart-empty">Notas indisponíveis.</div>'}).finally(()=>{inFlight--;fill()});
  }
 };
 const load=card=>{if(!card||card.dataset.ct548ChartQueued)return;card.dataset.ct548ChartQueued='1';queued.push(card);fill()};
 if(typeof IntersectionObserver!=='function'){cards.slice(0,2).forEach(load);return}
 const observer=new IntersectionObserver(entries=>{
  if(seq!==navSeq||route()!=='series'){closed=true;observer.disconnect();queued=[];return}
  for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);load(entry.target)}
 },{rootMargin:'250px'});
 cards.forEach(c=>observer.observe(c));
};
function ct548PaintWweEpisode(st,sn,en,btn,seen){
 btn.dataset.watched=seen?'1':'0';
 btn.textContent=seen?'↶ Desmarcar':'✓ Marcar visto';
 btn.classList.toggle('on',seen);
 const root=btn.closest('.ct169-drawer');
 const label=root?.querySelector('.ct169-drawer-progress small');
 if(label)label.textContent=(st.episodes||[]).filter(ep=>st.watched.has(sn+':'+Number(ep.episode_number))).length+' vistos nesta temporada';
}
async function ct548ToggleWweEpisode(btn){
 if(ct548Busy.current)return;
 const st=ct169DrawerState;if(!ct548Wwe(st?.showId))return;
 const [sn,en]=String(btn.dataset.ct548EpisodeToggle||'').split(':').map(Number);
 if(!(sn>0&&en>0)||sn!==Number(st.seasonNo))return;
 const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===en);if(!ep)return;
 const k=sn+':'+en,was=st.watched.has(k),seen=!was;
 ct548Busy.current=true;st.watched[seen?'add':'delete'](k);
 ct548PaintWweEpisode(st,sn,en,btn,seen);btn.disabled=true;
 try{
  const m=await ensureMedia('tv',Number(st.showId));
  if(seen){
   await rpc('cinetracker_mark_episode_v0994',{
    p_media_id:Number(m.id),p_season_number:sn,p_episode_number:en,
    p_title:ep.name||null,p_runtime_minutes:Number(ep.runtime||0)||null,
    p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,
    p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()
   });
  }else{
   const ids=ct548WweAliases.get(Number(st.showId))||[Number(m.id)];
   const allIds=[...new Set([...ids,Number(m.id)].filter(x=>x>0))];
   const filter='&season_number=eq.'+sn+'&episode_number=eq.'+en;
   const mid='&media_id=in.('+allIds.join(',')+')';
   const [progress,history]=await Promise.all([
    api('episode_progress?select=media_id'+mid+filter+'&watched=eq.true').catch(()=>[]),
    api('watch_history?select=media_id'+mid+filter+'&item_type=eq.episode').catch(()=>[])
   ]);
   const targets=[...new Set([...ct548Keys(progress),...ct548Keys(history)].map(x=>Number(x?.media_id)).filter(x=>x>0))];
   if(!targets.length)targets.push(Number(m.id));
   await Promise.all(targets.map(id=>rpc('cinetracker_unmark_history_item_v426',{p_media_id:id,p_item_type:'episode',p_season_number:sn,p_episode_number:en})));
  }
  homeCache=null;profileCache=null;
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r548-wwe-season',tmdb:Number(st.showId),season:sn,episode:en,watched:seen}}));
  toast(seen?'Episódio marcado como assistido.':'Episódio desmarcado.');
 }catch(err){
  st.watched[was?'add':'delete'](k);
  ct548PaintWweEpisode(st,sn,en,btn,was);
  toast(err?.message||String(err));
 }finally{btn.disabled=false;ct548Busy.current=false}
}
window.addEventListener('click',e=>{
 const btn=e.target?.closest?.('[data-ct548-episode-toggle]');
 if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
 void ct548ToggleWweEpisode(btn);
},true);
window.__ctR548WweDetail={version:'0.3.75',scope:'Raw/SmackDown detail only',get isProcessing(){return ct548Busy.current}};

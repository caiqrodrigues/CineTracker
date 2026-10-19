/* CineTracker Android r285 / 1.0.43 — scoped seven-slot UI and Profile recovery.
   Web r541 unchanged. r284 authoritative pools + watched history preserved. */
(()=>{'use strict';
if(window.__ctR285AndroidV1043)return;
window.__ctR285AndroidV1043='compact-daily+stable-optimistic-actions+verified-swaps+progressive-profile';

const byId=id=>String(id||'');
const account=()=>String(session?.user?.id||user?.id||'');
const live=(seq,id)=>Boolean(id&&account()===id&&session&&route()==='profile'&&navSeq===seq);
const arrays=x=>Array.isArray(x)?x:[];
const cacheKey=id=>'ct285:profile:'+id;
const timeout=(task,ms)=>Promise.race([Promise.resolve(task),new Promise((_,reject)=>setTimeout(()=>reject(new Error('profile-rpc-timeout')),ms))]);
function usable(snapshot){
 return Boolean(snapshot&&typeof snapshot==='object'&&(
  Number(snapshot?.stats?.movies_watched||0)>0||
  Number(snapshot?.stats?.episodes_watched||0)>0||
  Number(snapshot?.stats?.total_minutes||0)>0||
  arrays(snapshot.dashboard).length>0));
}
function cached(id){
 if(!id)return null;
 const local=profileCache||null;
 if(usable(local))return local;
 try{const saved=JSON.parse(localStorage.getItem(cacheKey(id))||'null');if(saved?.id===id&&usable(saved.data))return saved.data}catch{}
 try{const older=JSON.parse(localStorage.getItem('ct280:profile:'+id)||'null');if(older?.owner===id&&usable(older.data))return older.data}catch{}
 try{const from163=ct163Read('profile');if(usable(from163))return from163}catch{}
 return null;
}
function remember(id,snapshot){
 if(!usable(snapshot))return;
 try{const copy={...snapshot,dashboard:arrays(snapshot.dashboard).slice(0,250),
 favorite_actors:arrays(snapshot.favorite_actors).slice(0,30),activity:arrays(snapshot.activity).slice(-60)};
 localStorage.setItem(cacheKey(id),JSON.stringify({id,at:Date.now(),data:copy}))}catch{}
}
function fromSummary(summary,original){
 const byKey=new Map(),existing=arrays(original?.dashboard);
 const add=(list,flags)=>{
  for(const raw of arrays(list)){
   const type=String(raw?.media_type||''),id=Number(raw?.media_id||0),tmdb=Number(raw?.tmdb_id||0);
   if(!(type==='movie'||type==='tv')||!(id>0||tmdb>0))continue;
   const key=type+':'+(tmdb||'id:'+id);
   const prior=byKey.get(key)||{};
   byKey.set(key,{...prior,...raw,...flags,
    is_seen:Boolean(flags.is_seen||raw.is_seen||prior.is_seen),
    is_favorite:Boolean(flags.is_favorite||raw.is_favorite||prior.is_favorite),
    is_in_progress:Boolean(flags.is_in_progress||raw.is_in_progress||prior.is_in_progress),
    watched_episodes:Math.max(Number(prior.watched_episodes||0),Number(raw.watched_episodes||0))});
  }
 };
 add(existing,{});
 add(summary?.series,{is_in_progress:true});
 add(summary?.movies,{is_seen:true});
 add(summary?.series_favorites,{is_favorite:true});
 add(summary?.movie_favorites,{is_favorite:true});
 const actors=arrays(summary?.actors);
 return{dashboard:[...byKey.values()],favorite_actors:actors.length?actors:arrays(original?.favorite_actors)};
}
let profileRun=0;
const previousProfile=renderProfile;
function paint(snapshot,note,seq,id){
 if(!live(seq,id)||!usable(snapshot))return false;
 const page=document.querySelector('[data-profile]');
 if(!page)return false;
 const root=document.scrollingElement||document.documentElement,scroll=Number(root?.scrollTop||0);
 try{ct168PaintProfile(snapshot,note||'')}catch(e){
  document.documentElement.dataset.ct285ProfilePaintError=String(e?.message||e);
  return false;
 }
 remember(id,snapshot);
 requestAnimationFrame(()=>{if(live(seq,id)&&root&&scroll>0)root.scrollTop=scroll});
 document.documentElement.dataset.ct285Profile='ready';
 return true;
}
function notice(message,seq,id){
 if(!live(seq,id))return;
 const p=document.querySelector('[data-profile]');if(!p)return;
 const pending=p.querySelector('[data-ct285-profile-pending]');
 if(pending){pending.textContent=message;return}
 if(p.querySelector('.stats'))return;
 const el=document.createElement('div');el.className='panel';el.dataset.ct285ProfilePending='1';
 el.textContent=message;p.replaceChildren(el);
}
async function profile(seq){
 const id=account(),run=++profileRun;
 if(!id)return previousProfile(seq);
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile',
  '<div class="page" data-profile><section class="panel" data-ct285-profile-pending>Carregando estatísticas e biblioteca…</section></div>'));
 let value=cached(id),loaded=Boolean(value&&paint(value,'Sincronizando seus dados mais recentes…',seq,id));
 // A slow monolithic v0997/v495 must not prevent the first meaningful paint.
 const requests=[
  ['quick',()=>rpc('cinetracker_profile_quick_stats_v1',{})],
  ['library',()=>rpc('cinetracker_profile_summary_v489',{})],
  ['sports',()=>rpc('cinetracker_sports_stadium_summary_v296',{})],
  ['activity',()=>rpc('cinetracker_activity_by_day_v517',{p_days:15,p_tz:tz()})]
 ];
 const settled=await Promise.allSettled(requests.map(async([key,get])=>{
  const data=await timeout(get(),key==='quick'?12000:18000);
  if(run!==profileRun||!live(seq,id))return false;
  if(key==='quick'&&data?.stats){
   value=ct168MergeQuick(value||{},data);
  }else if(key==='library'&&data&&typeof data==='object'&&
   ['series','movies','series_favorites','movie_favorites','actors'].every(x=>Array.isArray(data[x]))){
   value={...(value||{}),...fromSummary(data,value)};
  }else if(key==='sports'&&data&&typeof data==='object'){
   value={...(value||{}),sports_stats:data};
  }else if(key==='activity'&&Array.isArray(data)){
   value={...(value||{}),activity:data};
  }else return false;
  if(usable(value)){loaded=paint(value,loaded?'':'Dados sincronizados.',seq,id)||loaded;}
  return true;
 }));
 if(run!==profileRun||!live(seq,id))return;
 if(!loaded){
  // Lightweight screen fallback only after independent sources were tried.
  try{
   const full=await timeout(rpc('cinetracker_profile_screen_v495',{p_tz:tz()}),14000);
   if(run!==profileRun||!live(seq,id))return;
   if(full?.stats){
    value=ct168MergeQuick(value||{},full);
    loaded=paint(value,'',seq,id)||loaded;
   }
  }catch(e){document.documentElement.dataset.ct285ProfileError=String(e?.message||e)}
 }
 if(!loaded){
  const problems=settled.filter(x=>x.status==='rejected').length;
  notice('Não foi possível sincronizar o Perfil agora ('+problems+' consultas pendentes ou com erro). Tente novamente.',seq,id);
  const pane=document.querySelector('[data-profile]');
  if(pane&&!pane.querySelector('[data-ct285-profile-retry]')){
   const button=document.createElement('button');button.type='button';button.className='btn';button.textContent='Tentar novamente';
   button.dataset.ct285ProfileRetry='1';pane.appendChild(button);
  }
 }
}
renderProfile=function(seq){return profile(seq)};
document.addEventListener('click',e=>{
 const btn=e.target?.closest?.('[data-ct285-profile-retry]');
 if(!btn||route()!=='profile')return;
 e.preventDefault();e.stopImmediatePropagation();
 void profile(navSeq);
},true);
window.addEventListener('cinetracker:data-changed',()=>{
 // Do not repaint the Profile or remove the seven verified cards on a mutation.
 // A future Profile entry fetches fresh quick counts. The current title is
 // already excluded optimistically by r277; no full-page refresh is needed.
 profileRun++;
});
const css=document.createElement('style');css.id='ct285-android-cards';
css.textContent=[
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;width:calc((100% - 12px)/3)!important;max-width:156px!important;min-width:0!important;height:auto!important;min-height:0!important;align-items:start!important;overflow:visible!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid>.ct166-slot{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;flex:none!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .discover-card{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;flex:none!important;align-self:start!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .discover-card>button[data-media]{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-width:0!important;flex:none!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .poster{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;object-fit:cover!important;flex:none!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .card-body{width:100%!important;min-width:0!important;height:38px!important;min-height:38px!important;max-height:38px!important;overflow:hidden!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .ct277-actions{box-sizing:border-box!important;width:100%!important;min-width:0!important;height:45px!important;min-height:45px!important;max-height:45px!important;flex:0 0 45px!important;overflow:hidden!important}',
 '[data-discover-content] [data-ct241-section] .ct277-control{pointer-events:auto!important;touch-action:manipulation!important}',
 '[data-profile] [data-ct285-profile-pending]{min-height:130px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;font-size:13px!important}'
].join('\n');
document.head.appendChild(css);
window.__ctR285Test={usable,fromSummary,cached,profile,paint,live,previousProfile};
})();
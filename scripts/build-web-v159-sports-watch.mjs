import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v158.js'),'utf8'),
  readFile(resolve(dist,'app-v158.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

if(!js.includes("const REVISION='r158-adjustments';"))throw new Error('r159 requires r158 single-runtime base');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime';"))throw new Error('r159 single runtime authority missing');
if(!js.includes('\nasync function globalSearch'))throw new Error('r159 insertion point missing');
if(!html.includes('/app-v158.js?ct=r158-adjustments'))throw new Error('r159 base script tag missing');
if(!html.includes('/app-v158.css?ct=r158-adjustments'))throw new Error('r159 base stylesheet tag missing');

js=js.replace("const REVISION='r158-adjustments';","const REVISION='r159-sports-watch';");

const r159=String.raw`
/* r159 sports watched history/time — same single runtime */
function sportMinutes159(minutes){
  const n=Math.max(0,Math.round(Number(minutes||0)));if(!n)return'0 min';
  const h=Math.floor(n/60),m=n%60;return h?(h+'h'+(m?' '+m+'min':'')):(m+' min');
}

const renderProfile158For159=renderProfile;
renderProfile=async function(seq){
  const sportsStatsPromise=rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  await renderProfile158For159(seq);
  const sportStats=await sportsStatsPromise;
  if(seq!==navSeq||route()!=='profile')return;
  const root=$('[data-profile]');if(!root)return;
  const minutes=Math.max(0,Number(sportStats?.sports_minutes||0));
  const watched=Math.max(0,Number(sportStats?.watched_events||0));
  if(profileCache&&typeof profileCache==='object')profileCache.sports_stats=sportStats;
  const firstStats=root.querySelector('.panel .stats');
  if(firstStats){
    const totalCard=[...firstStats.querySelectorAll('.stat')].find(x=>x.querySelector('small')?.textContent?.trim()==='Tempo total');
    if(totalCard){const b=totalCard.querySelector('b');if(b)b.textContent=fmtMinutes(Math.max(0,Number(profileCache?.stats?.total_minutes||0))+minutes)}
    if(!firstStats.querySelector('[data-profile-sports-minutes]')){
      const time=document.createElement('div');time.className='stat';time.dataset.profileSportsMinutes='1';time.innerHTML='<small>Tempo em esportes</small><b>'+fmtMinutes(minutes)+'</b>';firstStats.appendChild(time);
      const count=document.createElement('div');count.className='stat';count.dataset.profileSportsWatched='1';count.innerHTML='<small>Eventos esportivos</small><b>'+watched.toLocaleString('pt-BR')+'</b>';firstStats.appendChild(count);
    }
  }
};

const sportsPayload158For159=sportsPayload;
sportsPayload=async function(force=false){
  const p=await sportsPayload158For159(force);
  if(!p.stats)p.stats=await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  if(!Array.isArray(p.watch_history))p.watch_history=[];
  return p;
};

sportsFiltered=function(p){
  let a=sportsState.tab==='watched'?(Array.isArray(p.watch_history)?p.watch_history:[]):(Array.isArray(p.events)?p.events:[]);
  if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);
  if(sportsState.tab==='today')a=a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay());
  if(sportsState.tab==='live')a=a.filter(x=>x.status==='live');
  if(sportsState.tab==='favorites')a=a.filter(x=>x.has_favorite);
  return a;
};

sportsEvent=function(e,p){
  const sm=sportLabelMap(p),s=sm.get(e.sport_slug)||{},fav=new Set((p.favorites||[]).map(x=>Number(x.entity_id))),match=e.home_name||e.away_name;
  const score=e.home_score!=null||e.away_score!=null?esc(e.home_score??'–')+' : '+esc(e.away_score??'–'):'×';
  const status=e.status==='live'?'AO VIVO':e.status==='finished'?'ENCERRADO':new Date(e.starts_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  const watched=Boolean(e.is_watched),duration=Math.max(0,Number(e.watched_duration_minutes||0));
  const f=(id,label)=>id?'<button class="fav '+(fav.has(Number(id))?'on':'')+'" data-sport-fav="'+Number(id)+'" data-on="'+(fav.has(Number(id))?'1':'0')+'">'+(fav.has(Number(id))?'★':'☆')+' '+esc(label)+'</button>':'';
  const watch='<button class="sport-watch '+(watched?'on':'')+'" type="button" data-sport-watch="'+Number(e.id||0)+'" data-watched="'+(watched?'1':'0')+'">'+(watched?'✓ Assistido'+(duration?' · '+sportMinutes159(duration):''):'✓ Marcar assistido')+'</button>';
  const watchedMeta=watched&&e.sport_watched_at?'<br><span class="sport-watched-meta">Assistido em '+new Date(e.sport_watched_at).toLocaleString('pt-BR')+(duration?' · '+sportMinutes159(duration):'')+'</span>':'';
  return '<article class="event '+(e.status==='live'?'live':'')+(watched?' watched':'')+'"><div class="event-top"><div class="league">'+(e.competition_logo?'<img src="'+esc(e.competition_logo)+'" alt="">':'')+'<span>'+esc(s.icon||'🏆')+' '+esc(e.competition_name||s.name||'Esporte')+'</span></div><span class="status '+(e.status==='live'?'live':'')+'">'+status+'</span></div>'+(match?'<div class="match"><div class="side">'+(e.home_logo?'<img src="'+esc(e.home_logo)+'" alt="">':'')+'<b>'+esc(e.home_name||'')+'</b></div><div class="score">'+score+'</div><div class="side">'+(e.away_logo?'<img src="'+esc(e.away_logo)+'" alt="">':'')+'<b>'+esc(e.away_name||'')+'</b></div></div>':'<div class="event-title">'+esc(e.title)+'</div>')+'<div class="meta">'+new Date(e.starts_at).toLocaleString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+(e.round?' · '+esc(e.round):'')+(e.venue?'<br>'+esc(e.venue):'')+watchedMeta+'</div><div class="fav-actions">'+f(e.competition_id,e.competition_name||'Competição')+f(e.home_id,e.home_name||'Time')+f(e.away_id,e.away_name||'Time')+watch+'</div></article>';
};

paintSports=function(p=sportsCache||{}){
  const h=$('[data-sports]');if(!h)return;
  const events=sportsFiltered(p),sports=p.sports||[],favorites=p.favorites||[],stats=p.stats||{},live=(p.events||[]).filter(x=>x.status==='live').length,today=(p.events||[]).filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay()).length;
  const watched=Math.max(0,Number(stats.watched_events||0)),sportMinutes=Math.max(0,Number(stats.sports_minutes||0));
  const title=sportsState.tab==='live'?'Ao vivo':sportsState.tab==='today'?'Eventos de hoje':sportsState.tab==='favorites'?'Eventos dos favoritos':sportsState.tab==='watched'?'Histórico assistido':'Próximos eventos';
  h.innerHTML='<div class="panel"><div class="panel-head"><h2>Central esportiva</h2><div class="actions"><span class="badge">'+(sportsState.provider?.api_sports_configured?'API-Sports + fallback':'TheSportsDB fallback')+'</span><button class="btn" data-sports-sync '+(sportsState.syncing?'disabled':'')+'>'+(sportsState.syncing?'Atualizando...':'Atualizar agenda')+'</button></div></div><div class="sports-summary sports-summary-r159">'+[['Hoje',today],['Ao vivo',live],['Assistidos',watched],['Tempo esportes',sportMinutes159(sportMinutes)],['Favoritos',favorites.length]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+b+'</b></div>').join('')+'</div></div><div class="tabs">'+[['today','Hoje'],['live','Ao vivo'],['calendar','Calendário'],['favorites','Favoritos'],['watched','Assistidos']].map(([k,l])=>'<button class="chip '+(sportsState.tab===k?'active':'')+'" data-sports-tab="'+k+'">'+l+'</button>').join('')+'</div><div class="filters"><button class="chip '+(sportsState.sport==='all'?'active':'')+'" data-sport="all">Todos</button>'+sports.map(s=>'<button class="chip '+(sportsState.sport===s.slug?'active':'')+'" data-sport="'+esc(s.slug)+'">'+esc(s.icon)+' '+esc(s.name)+'</button>').join('')+'</div>'+(sportsState.tab==='favorites'?'<section class="panel"><div class="panel-head"><h2>Favoritos</h2><small>'+favorites.length+'</small></div><div class="favorites-grid">'+(favorites.map(f=>'<div class="favorite-card">'+(f.logo_url||f.image_url?'<img src="'+esc(f.logo_url||f.image_url)+'" alt="">':'<span>🏆</span>')+'<div><b>'+esc(f.name)+'</b><small>'+esc(f.entity_type)+' · '+esc(f.sport_slug)+'</small></div><button class="fav on" data-sport-fav="'+Number(f.entity_id)+'" data-on="1">★</button></div>').join('')||'<div class="empty">Marque times, ligas ou entidades como favoritas nos eventos.</div>')+'</div></section>':'')+'<section class="panel"><div class="panel-head"><h2>'+title+'</h2><small>'+events.length+'</small></div><div class="event-grid">'+(events.map(e=>sportsEvent(e,p)).join('')||'<div class="empty">'+(sportsState.tab==='watched'?'Nenhum evento esportivo foi marcado como assistido ainda.':'Nenhum evento disponível neste filtro. Use “Atualizar agenda” para sincronizar os provedores.')+'</div>')+'</div></section>';
};

async function markSportWatched159(eventId,currentlyWatched){
  const b=document.querySelector('[data-sport-watch="'+Number(eventId)+'"]');if(b)b.disabled=true;
  try{
    const result=await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:Number(eventId),p_watched:!currentlyWatched,p_duration_minutes:null,p_watched_at:new Date().toISOString()});
    sportsCache=null;profileCache=null;await sportsPayload(true);if(route()==='sports')paintSports();
    const minutes=Number(result?.duration_minutes||0);
    toast(result?.is_watched?'Evento marcado como assistido'+(minutes?' · '+sportMinutes159(minutes):'')+'.':'Evento removido do histórico esportivo.');
  }catch(e){toast('Esportes: '+(e?.message||e))}finally{if(b)b.disabled=false}
}

document.addEventListener('click',function r159SportsWatchClick(e){
  const b=e.target.closest?.('[data-sport-watch]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  void markSportWatched159(Number(b.dataset.sportWatch),b.dataset.watched==='1');
},true);
`;

js=js.replace('\nasync function globalSearch',r159+'\nasync function globalSearch');

css+=String.raw`
/* r159 sports watched/time */
.sport-watch{border:1px solid #315f78;background:#0a1b25;color:#d9f3ff;border-radius:999px;padding:5px 9px;cursor:pointer;font-size:8px}.sport-watch:hover{border-color:#63b8e6}.sport-watch.on{border-color:#5d9d72;background:#10251a;color:#9ee8b4}.sport-watch:disabled{opacity:.55;cursor:default}.event.watched{box-shadow:inset 0 0 0 1px #5d9d7233}.sport-watched-meta{color:#8dd7a5}.sports-summary-r159{grid-template-columns:repeat(5,minmax(0,1fr))}@media(max-width:900px){.sports-summary-r159{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){.sports-summary-r159{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

html=html.replace('/app-v158.js?ct=r158-adjustments','/app-v159.js?ct=r159-sports-watch').replace('/app-v158.css?ct=r158-adjustments','/app-v159.css?ct=r159-sports-watch');
sw=sw.replace(/ct-web-0\.99\.7-r158-adjustments/g,'ct-web-0.99.7-r159-sports-watch');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v159.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v159.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v158.js'),{force:true}),rm(resolve(dist,'app-v158.css'),{force:true})]);
console.log('WEB_R159_BUILT runtime=single sports=watched+history+time profile=total-plus-sports');

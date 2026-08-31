import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r167.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v167.js'),'utf8'),
  readFile(resolve(dist,'app-v167.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

if(!js.includes("const REVISION='r167-ui-home-sports-complete';"))throw new Error('r168 requires r167 base');
if(!js.includes("window.__ctR167='discover-dom-profile-home-sports';"))throw new Error('r168 requires r167 runtime');
if(!js.includes("function ct166FavoriteBody"))throw new Error('r168 requires favorite event renderer');
if(!js.includes('\nboot();'))throw new Error('r168 final insertion point missing');

js=js.replace("const REVISION='r167-ui-home-sports-complete';","const REVISION='r168-profile-discover-sports-watched';");

const patch=String.raw`
/* r168: resilient Profile + authenticated Discover retry + watched sports everywhere */
window.__ctR168='profile-resilient-discover-auth-sports-watched';
window.__ct168Profile='quick-first-no-red-timeout';
window.__ct168Discover='tmdb-auth-retry-no-empty-cache';
window.__ct168SportsWatched='all-event-lists';
window.__ct168Preload='paced-no-db-storm';

/* Do not resurrect empty Discover payloads cached by the r163 preload after a transient 401. */
try{
  for(const k of Object.keys(localStorage)){
    if(k.indexOf('cinetracker:preload:r163:discover:')===0)localStorage.removeItem(k);
  }
}catch{}

/* TMDB proxy can reject an old access token before restoreSession refreshes it.
   Refresh once, shared by all concurrent page requests, then retry the original request. */
const ct168TmdbBase=tmdb;
let ct168SessionRefreshTask=null;
async function ct168RefreshSession(){
  if(ct168SessionRefreshTask)return ct168SessionRefreshTask;
  ct168SessionRefreshTask=Promise.resolve().then(()=>restoreSession()).finally(()=>{ct168SessionRefreshTask=null});
  return ct168SessionRefreshTask;
}
tmdb=async function(path,params={}){
  try{return await ct168TmdbBase(path,params)}
  catch(e){
    const msg=String(e?.message||e||'');
    if(msg.indexOf('TMDB 401')<0&&msg.indexOf('TMDB 403')<0)throw e;
    await ct168RefreshSession();
    return ct168TmdbBase(path,params);
  }
};

/* One exclusion snapshot is enough for every Discover tab. The old preload could execute
   the expensive dashboard once per tab, all at the same time. */
const ct168ExclusionSource=(typeof exclusionContext158==='function')?exclusionContext158:exclusionContext;
let ct168ExclusionPromise=null,ct168ExclusionAt=0;
function ct168ResetExclusions(){ct168ExclusionPromise=null;ct168ExclusionAt=0}
async function ct168Exclusions(){
  if(ct168ExclusionPromise&&Date.now()-ct168ExclusionAt<45000)return ct168ExclusionPromise;
  ct168ExclusionAt=Date.now();
  ct168ExclusionPromise=Promise.resolve().then(()=>ct168ExclusionSource()).catch(e=>{ct168ResetExclusions();throw e});
  return ct168ExclusionPromise;
}
exclusionContext=ct168Exclusions;

function ct168DiscoverIsEmpty(tab,v){
  if(tab==='calendar')return false;
  if(tab==='foryou'){
    if(!v||Array.isArray(v))return true;
    return ![v.daily,v.movie,v.series,v.anime,v.watchlist_movie,v.watchlist_series,v.watchlist_anime].some(Boolean);
  }
  return !Array.isArray(v)||v.length===0;
}
function ct168DropDiscoverCache(tab){
  discoverCache.clear();
  ct168ResetExclusions();
  try{
    for(const k of Object.keys(localStorage)){
      if(k.indexOf('cinetracker:preload:r163:discover:'+tab)===0)localStorage.removeItem(k);
    }
  }catch{}
}

/* Rebuild Pra você from one exclusion snapshot instead of calling the old base twice. */
async function ct168ForYouRows(){
  const key='foryou-r168:'+localDay();
  if(discoverCache.has(key))return discoverCache.get(key);
  const task=(async()=>{
    const c=await ct168Exclusions();
    const fresh=await ct166FreshPools(c);
    const wl=ct166WatchlistPools(c.dash);
    const daily=fresh.movie.find(x=>Number(x?.vote_average||0)>=8&&Number(String(x?.release_date||'').slice(0,4)||0)>=1990)||fresh.movie[0]||null;
    const movie=fresh.movie.find(x=>!daily||Number(x?.id||0)!==Number(daily?.id||0))||null;
    return {
      daily:daily,
      movie:movie,
      series:fresh.series[0]||null,
      anime:fresh.anime[0]||null,
      watchlist_movie:wl.movie[0]||null,
      watchlist_series:wl.series[0]||null,
      watchlist_anime:wl.anime[0]||null,
      _ct166_fresh:fresh,
      _ct166_watchlist:wl
    };
  })();
  discoverCache.set(key,task);
  try{
    const v=await task;
    discoverCache.set(key,v);
    ct163Write('discover:foryou:all',v);
    return v;
  }catch(e){discoverCache.delete(key);throw e}
}

const ct168DiscoverRowsBase=discoverRows;
discoverRows=async function(tab){
  let v=tab==='foryou'?await ct168ForYouRows():await ct168DiscoverRowsBase(tab);
  if(!ct168DiscoverIsEmpty(tab,v))return v;
  const retryKey='ct:r168:discover-retry:'+tab+':'+localDay();
  if(sessionStorage.getItem(retryKey)!=='1'){
    sessionStorage.setItem(retryKey,'1');
    ct168DropDiscoverCache(tab);
    await ct168RefreshSession();
    v=tab==='foryou'?await ct168ForYouRows():await ct168DiscoverRowsBase(tab);
  }
  return v;
};

/* Keep warm-up useful without hammering Postgres/TMDB with Profile + seven tabs + Sports. */
let ct168PreloadPromise=null,ct168PreloadDone=false;
ct163PreloadAll=async function(){
  if(!session||ct168PreloadDone)return ct168PreloadPromise;
  if(ct168PreloadPromise)return ct168PreloadPromise;
  ct168PreloadDone=true;
  ct168PreloadPromise=(async()=>{
    try{
      const home=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});
      if(home)ct163Write('home',home);
    }catch{}
    await new Promise(r=>setTimeout(r,180));
    try{
      const sports=await sportsPayload(false);
      if(sports)ct163Write('sports',sports);
    }catch{}
    await new Promise(r=>setTimeout(r,220));
    try{
      const d=await discoverRows('foryou');
      if(d)ct163Write('discover:foryou:all',d);
    }catch{}
  })().finally(()=>{ct168PreloadPromise=null});
  return ct168PreloadPromise;
};

/* Profile first paints the fast summary. A full library refresh is secondary and never
   replaces valid data with a red timeout panel. */
function ct168MergeQuick(base,quick){
  const b=base&&typeof base==='object'?base:{};
  const q=quick&&typeof quick==='object'?quick:{};
  return {
    ...b,
    stats:q.stats||b.stats||{},
    series_stats:q.series_stats||b.series_stats||{},
    remaining:q.remaining||b.remaining||{},
    sports_stats:q.sports_stats||b.sports_stats||{},
    dashboard:Array.isArray(b.dashboard)?b.dashboard:[],
    favorite_actors:Array.isArray(b.favorite_actors)?b.favorite_actors:[],
    activity:Array.isArray(b.activity)?b.activity:[]
  };
}
function ct168ProfileNote(text){
  const root=$('[data-profile]');if(!root)return;
  root.querySelector('.ct168-profile-note')?.remove();
  if(!text)return;
  const n=document.createElement('div');
  n.className='notice ct168-profile-note';
  n.textContent=text;
  root.prepend(n);
}
function ct168EnsureSportsPanel(d){
  const root=$('[data-profile]');if(!root)return;
  let panel=root.querySelector('[data-profile-sports-panel]');
  const sports=d?.sports_stats||{};
  if(!panel){
    panel=document.createElement('section');
    panel.className='panel';
    panel.dataset.profileSportsPanel='1';
    const statsPanel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');
    if(statsPanel)statsPanel.insertAdjacentElement('afterend',panel);else root.prepend(panel);
  }
  panel.innerHTML='<div class="panel-head"><h2>Esportes assistidos</h2><small>separado de filmes e séries</small></div>'+ 
    '<div class="stats"><div class="stat"><small>Tempo assistido</small><b>'+ct166FmtMinutes(sports.sports_minutes||0)+'</b></div>'+ 
    '<div class="stat"><small>Eventos assistidos</small><b>'+Number(sports.watched_events||0).toLocaleString('pt-BR')+'</b></div></div>'+ 
    '<p class="muted small">Filmes e séries ficam nas estatísticas acima; esportes são contabilizados separadamente aqui.</p>';
}
function ct168PaintProfile(d,note){
  profileCache=d||{};
  paintProfile163(profileCache);
  ct167FixProfileDom(profileCache);
  ct168EnsureSportsPanel(profileCache);
  try{ct163Decorate()}catch{}
  ct168ProfileNote(note||'');
}
async function ct168RefreshFullProfile(seq){
  try{
    const full=await rpc('cinetracker_profile_payload_v0997',{p_tz:tz()});
    if(seq!==navSeq||route()!=='profile')return;
    const sports=full?.sports_stats||profileCache?.sports_stats||await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({}));
    const merged={...(full||{}),sports_stats:sports||{}};
    ct163Write('profile',merged);
    ct168PaintProfile(merged,'');
  }catch(e){
    if(seq!==navSeq||route()!=='profile')return;
    const msg=String(e?.message||e||'');
    ct168ProfileNote(msg.includes('statement timeout')||msg.includes('canceling statement')?
      'Estatísticas atualizadas. A biblioteca detalhada será atualizada em uma próxima abertura.':
      'Estatísticas atualizadas; não foi possível atualizar agora a biblioteca detalhada.');
  }
}
renderProfile=async function(seq){
  setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
  const cached=profileCache||ct163Read('profile')||null;
  if(cached&&seq===navSeq&&route()==='profile')ct168PaintProfile(cached,'Atualizando estatísticas...');
  try{
    const quick=await rpc('cinetracker_profile_quick_stats_v1',{});
    if(seq!==navSeq||route()!=='profile')return;
    const merged=ct168MergeQuick(cached,quick);
    ct168PaintProfile(merged,'Carregando biblioteca detalhada...');
    setTimeout(()=>{if(seq===navSeq&&route()==='profile')void ct168RefreshFullProfile(seq)},220);
  }catch(e){
    if(seq!==navSeq||route()!=='profile')return;
    if(cached){
      ct168PaintProfile(cached,'Não foi possível atualizar agora; exibindo os últimos dados sincronizados.');
      return;
    }
    try{
      const full=await rpc('cinetracker_profile_payload_v0997',{p_tz:tz()});
      if(seq!==navSeq||route()!=='profile')return;
      ct163Write('profile',full||{});
      ct168PaintProfile(full||{},'');
    }catch(x){
      const root=$('[data-profile]');
      if(root)root.innerHTML=fail('Falha ao carregar Perfil: '+(x?.message||x),'profile');
    }
  }
};

/* The database already stores sports watch history. Expose it on every event card and
   in the league/favorite event modal, with a reversible toggle. */
function ct168WatchedButton(e){
  const id=Number(e?.id||0);if(!(id>0))return '';
  const on=Boolean(e?.is_watched);
  return '<button type="button" class="btn btn-secondary ct168-watch '+(on?'on':'')+'" data-sport-watched="'+id+'" data-on="'+(on?'1':'0')+'">'+
    (on?'✓ Assistido':'✓ Marcar como assistido')+'</button>';
}
const ct168SportsEventBase=sportsEvent;
sportsEvent=function(e,p){
  const html=ct168SportsEventBase(e,p);
  const action='<div class="ct168-watch-action">'+ct168WatchedButton(e)+'</div>';
  return html.replace('</article>',action+'</article>');
};

ct166FavoriteBody=function(d,note){
  const f=d?.favorite||{},ev=Array.isArray(d?.events)?d.events:[];
  const sync=note?'<div class="notice ct166-sync-note">'+esc(note)+'</div>':'';
  const list=ev.length?'<div class="ct165-event-list">'+ev.map(e=>
    '<div class="ct165-event"><div><b>'+esc(e.home_name||e.title||'Evento')+'</b>'+(e.away_name?'<span> × '+esc(e.away_name)+'</span>':'')+'</div>'+ 
    '<small>'+new Date(e.starts_at).toLocaleString('pt-BR')+' · '+esc(e.competition_name||e.sport_slug||'')+(e.round?' · '+esc(e.round):'')+'</small>'+ 
    '<strong>'+esc(e.status||'')+(e.home_score!=null?' · '+esc(e.home_score)+' : '+esc(e.away_score):'')+'</strong>'+ 
    '<div class="ct168-modal-watch">'+ct168WatchedButton(e)+'</div></div>'
  ).join('')+'</div>':'<div class="empty">Nenhum evento relacionado encontrado nesse período.</div>';
  return '<div class="ct165-fav-summary"><span>'+esc(f.entity_type||'Entidade')+'</span><span>'+esc(f.sport_slug||'')+'</span><span>Últimos 30 dias + próximos 14</span><span>'+ev.length+' eventos</span></div>'+sync+list;
};

function ct168SetWatchedButtons(eventId,on){
  document.querySelectorAll('[data-sport-watched="'+Number(eventId)+'"]').forEach(b=>{
    b.dataset.on=on?'1':'0';
    b.classList.toggle('on',on);
    b.disabled=false;
    b.textContent=on?'✓ Assistido':'✓ Marcar como assistido';
  });
}
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-sport-watched]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  const eventId=Number(b.dataset.sportWatched||0);if(!(eventId>0))return;
  const next=b.dataset.on!=='1';
  document.querySelectorAll('[data-sport-watched="'+eventId+'"]').forEach(x=>{x.disabled=true;x.textContent=next?'Marcando...':'Desmarcando...'});
  void rpc('cinetracker_sport_mark_watched_v1',{
    p_event_id:eventId,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()
  }).then(async result=>{
    ct168SetWatchedButtons(eventId,Boolean(result?.is_watched));
    profileCache=null;
    try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}
    sportsCache=null;
    const fresh=await sportsPayload(true).catch(()=>null);
    if(fresh&&route()==='sports')paintSports(fresh);
    toast(result?.is_watched?'Evento marcado como assistido.':'Evento removido dos assistidos.');
  }).catch(x=>{
    ct168SetWatchedButtons(eventId,!next);
    toast('Esportes: '+(x?.message||x));
  });
},true);
`;

js=js.replace('\nboot();',patch+'\nboot();');

css+=String.raw`
/* r168 */
.ct168-profile-note{margin-bottom:10px}
.ct168-watch-action{display:flex;justify-content:flex-end;margin-top:8px}
.ct168-watch.on,.ct168-modal-watch .ct168-watch.on{border-color:#5f9f77;background:#10281a}
.ct168-modal-watch{grid-column:1/-1;display:flex;justify-content:flex-end;margin-top:4px}
@media(max-width:700px){.ct168-watch{width:100%}.ct168-watch-action,.ct168-modal-watch{justify-content:stretch}}
`;

html=html.replaceAll('r167-ui-home-sports-complete','r168-profile-discover-sports-watched').replaceAll('app-v167.js','app-v168.js').replaceAll('app-v167.css','app-v168.css');
sw=sw.replaceAll('r167-ui-home-sports-complete','r168-profile-discover-sports-watched').replaceAll('app-v167.js','app-v168.js').replaceAll('app-v167.css','app-v168.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v168.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v168.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r168-profile-discover-sports-watched',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v167.js'),{force:true}),rm(resolve(dist,'app-v167.css'),{force:true})]);
console.log('WEB_R168_READY profile=quick-resilient discover=auth-retry sports=watched-toggle preload=paced');
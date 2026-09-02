/* Android 0.99.7.36 — stable Discover rail + minimalist Sports + authoritative Sports profile stats */
(() => {
'use strict';
if(window.__ctAndroidR208Loaded)return;
window.__ctAndroidR208Loaded=true;
window.__ctAndroidR208='discover-stable-rail-minimal-sports-authoritative-profile-stats';
window.__ctAndroidDiscoverTabs='fixed-position-no-auto-scroll-after-load';
window.__ctAndroidSportsUI='single-minimal-item-search-no-date-no-summary';
window.__ctAndroidProfileSports='cinetracker_sport_stats_v1-authority';
window.__ctAndroidScope='android-only-no-web-runtime-change';

/* Root cause seen on-device: r180 recenters the active tab after asynchronous content finishes.
   The rail moves under the finger, so a follow-up tap can hit the wrong tab or miss entirely.
   On Android the rail position is now user-controlled only (arrows); content loading never moves it. */
try{
  ctR180ExposeActiveTab=function(){};
  window.__ctAndroidDiscoverAutoScroll='disabled';
}catch{}

function route208(name){try{return String(route())===name}catch{return String(location.pathname||'')==='/'+name}}

function cleanSports208(){
  if(!route208('sports'))return;
  try{
    /* Sports must have exactly one search: entity/event search. */
    document.querySelectorAll('.search-global').forEach(x=>x.remove());
    const tools=document.querySelector('[data-sports-tools]');
    if(tools){
      tools.classList.add('ct208-sports-search-only');
      tools.querySelector('.ct169-sports-tools-head')?.remove();
      tools.querySelectorAll('[data-sports-date]').forEach(x=>x.remove());
      const input=tools.querySelector('[data-sports-search]');
      if(input){input.placeholder='Buscar time, jogo ou competição...';input.setAttribute('aria-label','Buscar time, jogo ou competição')}
    }

    /* Remove the numerical Sports dashboard and the duplicated watched-time banner. */
    const root=document.querySelector('[data-sports]');
    if(root){
      for(const panel of [...root.querySelectorAll(':scope > .panel')]){
        const title=panel.querySelector('.panel-head h2')?.textContent?.trim()||'';
        if(title==='Central esportiva'||panel.querySelector('.sports-summary'))panel.remove();
      }
      root.querySelectorAll('[data-sports-time-banner],.sports-time-banner').forEach(x=>x.remove());
    }
  }catch{}
}

/* Every legacy Sports repaint can rebuild the old summary/date controls; strip them only after
   the existing paint is complete, without changing Sports data/filter behavior. */
try{
  const paintSportsBase208=paintSports;
  paintSports=function(){const out=paintSportsBase208.apply(this,arguments);requestAnimationFrame(cleanSports208);return out};
}catch{}
try{
  const renderSportsBase208=renderSports;
  renderSports=async function(seq){const p=renderSportsBase208.apply(this,arguments);requestAnimationFrame(cleanSports208);try{const out=await p;cleanSports208();return out}catch(e){cleanSports208();throw e}};
}catch{}

function cachedSportsStats208(){
  try{
    const direct=sportsCache?.stats;
    if(direct&&typeof direct==='object'&&(Number(direct.watched_events||0)>0||Number(direct.sports_minutes||0)>0))return direct;
  }catch{}
  try{
    const snap=ct163Read('sports')?.stats;
    if(snap&&typeof snap==='object'&&(Number(snap.watched_events||0)>0||Number(snap.sports_minutes||0)>0))return snap;
  }catch{}
  try{
    const p=profileCache?.sports_stats;
    if(p&&typeof p==='object'&&(Number(p.watched_events||0)>0||Number(p.sports_minutes||0)>0))return p;
  }catch{}
  return null;
}
function applySportsStats208(stats){
  if(!stats||typeof stats!=='object'||!route208('profile'))return;
  try{
    profileCache={...(profileCache||{}),sports_stats:stats};
    try{ct163Write('profile',profileCache)}catch{}
    if(typeof ct168EnsureSportsPanel==='function')ct168EnsureSportsPanel(profileCache);
  }catch{}
}

/* Profile is progressive: cached/quick data paints first; dashboard and full payload follow.
   Sports numbers are always overridden by cinetracker_sport_stats_v1, the same authority used
   by the Sports screen (fixes Profile showing 0 while Sports shows watched events/time). */
try{
  renderProfile=async function(seq){
    if(!document.querySelector('[data-profile]')){
      setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile><div class="loader">Carregando Perfil...</div></div>'));
    }
    let cached=null;try{cached=profileCache||ct163Read('profile')}catch{cached=profileCache||null}
    const cachedSports=cachedSportsStats208();
    if(cached){
      if(cachedSports)cached={...cached,sports_stats:cachedSports};
      profileCache=cached;
      try{ct168PaintProfile(cached,'Atualizando...')}catch{}
    }

    const quickTask=rpc('cinetracker_profile_quick_stats_v1',{}).catch(()=>null);
    const dashTask=rpc('cinetracker_profile_media_dashboard_v0997_fast',{}).catch(()=>null);
    const sportsTask=rpc('cinetracker_sport_stats_v1',{}).catch(()=>cachedSports||null);

    let quick=null;
    try{quick=await quickTask}catch{}
    if(seq!==navSeq||!route208('profile'))return;
    if(quick&&typeof quick==='object'){
      const partial={...(cached||{}),...quick,dashboard:Array.isArray(cached?.dashboard)?cached.dashboard:[],sports_stats:cachedSports||quick.sports_stats||{}};
      profileCache=partial;try{ct168PaintProfile(partial,cached?'Atualizando biblioteca...':'Carregando biblioteca...')}catch{}
    }

    const [dash,sports]=await Promise.all([dashTask,sportsTask]);
    if(seq!==navSeq||!route208('profile'))return;
    const merged={...(profileCache||cached||quick||{}),dashboard:Array.isArray(dash)?dash:(Array.isArray(profileCache?.dashboard)?profileCache.dashboard:[]),sports_stats:sports||cachedSports||profileCache?.sports_stats||{}};
    profileCache=merged;try{ct163Write('profile',merged)}catch{};try{ct168PaintProfile(merged,'')}catch{}

    /* Canonical payload remains background-only. Never let its stale/zero sports_stats replace
       the dedicated Sports authority above. */
    void rpc('cinetracker_profile_payload_v0997_r2',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'}).then(full=>{
      if(!full||seq!==navSeq||!route208('profile')||document.querySelector('.favorite-overlay'))return;
      const final={...full,sports_stats:sports||cachedSports||merged.sports_stats||{}};
      profileCache=final;try{ct163Write('profile',final)}catch{};try{ct168PaintProfile(final,'')}catch{}
    }).catch(()=>{});
  };
}catch{}

const style208=document.createElement('style');
style208.id='ct-android-099736';
style208.textContent=`
/* Discover: buttons stay physically still while requests finish. */
[data-page="discover"] [data-ct-r180-tabs]{scroll-behavior:auto!important;scroll-snap-type:none!important}
[data-page="discover"] [data-ct-r180-tabs]>.chip{position:relative!important;z-index:8!important;min-height:38px!important;pointer-events:auto!important}

/* Sports: one compact search only. */
[data-page="sports"] .search-global{display:none!important}
[data-page="sports"] [data-sports-tools].ct208-sports-search-only{padding:0!important;margin:0 0 9px!important;border:0!important;background:transparent!important;box-shadow:none!important}
[data-page="sports"] [data-sports-tools].ct208-sports-search-only .search{display:grid!important;grid-template-columns:18px minmax(0,1fr)!important;gap:6px!important;align-items:center!important;min-height:38px!important;padding:3px 8px!important;border-radius:10px!important}
[data-page="sports"] [data-sports-tools].ct208-sports-search-only [data-sports-search]{height:32px!important;min-height:32px!important;padding:4px 2px!important;font-size:12px!important}
[data-page="sports"] [data-sports-tools] [data-sports-date],
[data-page="sports"] .ct169-sports-tools-head,
[data-page="sports"] .sports-summary,
[data-page="sports"] [data-sports-time-banner],
[data-page="sports"] .sports-time-banner{display:none!important}
`;
document.head.appendChild(style208);
requestAnimationFrame(cleanSports208);
})();

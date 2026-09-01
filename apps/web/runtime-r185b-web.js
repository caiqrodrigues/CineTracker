/* r185B Web — show cached route before legacy loader and warm next tab without changing authorities */
window.__ctR185B='instant-route-shell-prefetch';
window.__ct185BMode='cached-shell-before-legacy-loading';
window.__ct185BPrefetch='profile-quick-sports-discover-on-idle-and-intent';
window.__ct185BAuthority='renderers-and-rpcs-remain-authority';
window.__ct185BAndroid='unchanged-0.99.7.20';

const ct185BPrefetchTasks=new Map();

function ct185BRouteConfig(kind){
  if(kind==='home')return{slot:'home',selector:'[data-home]',marker:'data-home',title:'Home',subtitle:'Sua biblioteca sincronizada e organizada pelo seu progresso.',active:'home',state:null};
  if(kind==='profile')return{slot:'profile',selector:'[data-profile]',marker:'data-profile',title:'Perfil',subtitle:'Estatísticas, biblioteca, favoritos e atividade.',active:'profile',state:null};
  if(kind==='sports')return{slot:'sports',selector:'[data-sports]',marker:'data-sports',title:'Esportes',subtitle:'Agenda, ao vivo, favoritos e competições em uma central própria.',active:'sports',state:null};
  if(kind==='discover')return{slot:'discover',selector:'[data-discover]',marker:'data-discover',title:'Descobrir',subtitle:'Recomendações, Top 10, tendências, novidades, lançamentos e calendário.',active:'discover',state:ct185ADiscoverState()};
  return null;
}
function ct185BRootMarkup(c,html){
  const attr=c.kind==='discover'?'data-discover':c.kind==='sports'?'data-sports':c.kind==='profile'?'data-profile':'data-home';
  return `<div class="page" ${attr}>${html}</div>`;
}
function ct185BShowBeforeBase(kind){
  const c=ct185BRouteConfig(kind);if(!c)return null;c.kind=kind;
  const rec=ct185ARead(c.slot,c.state);if(!rec)return null;
  setApp(shell(c.title,c.subtitle,c.active,ct185BRootMarkup(c,rec.html)));
  const root=document.querySelector(c.selector);ct185ASetStale(root,true);ct185ASync('Atualizando…');
  return{c,rec};
}
function ct185BCallWithoutLoader(base,kind,seq){
  const shown=ct185BShowBeforeBase(kind);if(!shown)return base(seq);
  const setAppNow=setApp;let swallowed=false;
  setApp=function(markup){
    if(!swallowed&&String(markup||'').includes(shown.c.marker)){swallowed=true;return;}
    return setAppNow(markup);
  };
  try{return base(seq)}finally{setApp=setAppNow}
}

const ct185BRenderHomeBase=renderHome;
renderHome=async function(seq){return await ct185BCallWithoutLoader(ct185BRenderHomeBase,'home',seq)};
const ct185BRenderProfileBase=renderProfile;
renderProfile=async function(seq){return await ct185BCallWithoutLoader(ct185BRenderProfileBase,'profile',seq)};
const ct185BRenderSportsBase=renderSports;
renderSports=async function(seq){return await ct185BCallWithoutLoader(ct185BRenderSportsBase,'sports',seq)};
const ct185BRenderDiscoverBase=renderDiscover;
renderDiscover=async function(seq){return await ct185BCallWithoutLoader(ct185BRenderDiscoverBase,'discover',seq)};

function ct185BRunOnce(key,fn){
  if(ct185BPrefetchTasks.has(key))return ct185BPrefetchTasks.get(key);
  const p=Promise.resolve().then(fn).catch(()=>null).finally(()=>ct185BPrefetchTasks.delete(key));ct185BPrefetchTasks.set(key,p);return p;
}
async function ct185BWarmProfile(){
  return ct185BRunOnce('profile',async()=>{
    const old=profileCache||(typeof ct163Read==='function'?ct163Read('profile'):null)||null;
    if(old)profileCache=old;
    const quick=await rpc('cinetracker_profile_quick_stats_v1',{});
    if(old&&typeof ct168MergeQuick==='function')profileCache=ct168MergeQuick(old,quick);
    return profileCache;
  });
}
function ct185BWarmSports(){return ct185BRunOnce('sports',()=>sportsCache||sportsPayload(false))}
function ct185BWarmDiscover(){return ct185BRunOnce('discover:'+String(discoverState?.tab||'foryou'),()=>discoverRows(String(discoverState?.tab||'foryou')))}
function ct185BWarmHome(){
  if(homeCache)return Promise.resolve(homeCache);
  try{const old=typeof ct163Read==='function'?ct163Read('home'):null;if(old){homeCache=old;return Promise.resolve(old)}}catch{}
  return Promise.resolve(null);
}
function ct185BWarmRoute(kind){
  if(!session)return Promise.resolve(null);
  if(kind==='profile')return ct185BWarmProfile();
  if(kind==='sports')return ct185BWarmSports();
  if(kind==='discover')return ct185BWarmDiscover();
  if(kind==='home')return ct185BWarmHome();
  return Promise.resolve(null);
}
function ct185BIdleWarm(){
  if(!session)return;
  const run=async()=>{
    await ct185BWarmProfile();
    await new Promise(r=>setTimeout(r,120));
    await ct185BWarmSports();
    await new Promise(r=>setTimeout(r,160));
    await ct185BWarmDiscover();
  };
  if('requestIdleCallback'in window)requestIdleCallback(()=>void run(),{timeout:700});else setTimeout(()=>void run(),300);
}

/* Desktop hover and mobile touch start warming before the actual click. */
document.addEventListener('pointerover',e=>{const n=e.target.closest?.('[data-nav]');if(n)void ct185BWarmRoute(String(n.dataset.nav||''))},{passive:true});
document.addEventListener('touchstart',e=>{const n=e.target.closest?.('[data-nav]');if(n)void ct185BWarmRoute(String(n.dataset.nav||''))},{passive:true,capture:true});

const ct185BBootBase=boot;
boot=async function(){const out=await ct185BBootBase();ct185BIdleWarm();return out};
window.addEventListener('pageshow',()=>{if(session)ct185BIdleWarm()});

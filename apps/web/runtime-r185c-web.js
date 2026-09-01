/* r185C Web — short-lived fresh route reuse + deeper safe prefetch for Profile/Discover */
window.__ctR185CWeb='profile-discover-hot-route-reuse';
window.__ct185CProfile='full-profile-idle-prefetch-short-fresh-reuse';
window.__ct185CDiscover='intent-adjacent-prefetch-hot-render';
window.__ct185CAuthority='same-rpcs-renderers-business-rules';
window.__ct185CLayout='no-layout-reorder-no-content-change';

const CT185C_PROFILE_SNAPSHOT_FRESH=45*1000;
const CT185C_DISCOVER_SNAPSHOT_FRESH=2*60*1000;
const CT185C_PROFILE_PREFETCH_TTL=5*60*1000;
const CT185C_DISCOVER_HOT_TTL=10*60*1000;
const ct185CDirty=new Set();
const ct185CDiscoverHot=new Map();
let ct185CProfileFullAt=0;
let ct185CProfileFullTask=null;
let ct185CDeepWarmTask=null;

function ct185CSleep(ms){return new Promise(r=>setTimeout(r,ms))}
function ct185CSaveData(){try{return Boolean(navigator.connection?.saveData)}catch{return false}}
function ct185CFreshSnapshot(kind,maxAge){
  if(ct185CDirty.has(kind))return null;
  const c=ct185BRouteConfig(kind);if(!c)return null;
  const rec=ct185ARead(c.slot,c.state);if(!rec)return null;
  return Date.now()-Number(rec.at||0)<=maxAge?{c,rec}:null;
}
function ct185CShowSnapshot(kind,pair){
  const {c,rec}=pair;c.kind=kind;
  setApp(shell(c.title,c.subtitle,c.active,ct185BRootMarkup(c,rec.html)));
  const root=document.querySelector(c.selector);ct185ASetStale(root,false);
  document.querySelector('.ct185a-sync')?.remove();
  if(kind==='discover')requestAnimationFrame(()=>{try{ctR180ExposeActiveTab()}catch{}});
  return true;
}
function ct185CHealthy(selector){const root=document.querySelector(selector);return Boolean(root&&!root.querySelector('.loader')&&!root.querySelector('.error'))}
function ct185CMarkFresh(kind,selector){if(ct185CHealthy(selector))ct185CDirty.delete(kind)}

async function ct185CWarmProfileFull(){
  if(!session||ct185CSaveData())return profileCache||null;
  if(ct185CProfileFullTask)return ct185CProfileFullTask;
  if(ct185CProfileFullAt&&Date.now()-ct185CProfileFullAt<CT185C_PROFILE_PREFETCH_TTL&&profileCache)return profileCache;
  ct185CProfileFullTask=(async()=>{
    const full=await rpc('cinetracker_profile_payload_v0997',{p_tz:tz()});
    const merged={...(profileCache||{}),...(full||{}),sports_stats:full?.sports_stats||profileCache?.sports_stats||{}};
    profileCache=merged;ct185CProfileFullAt=Date.now();
    try{if(typeof ct163Write==='function')ct163Write('profile',merged)}catch{}
    return merged;
  })().catch(()=>profileCache||null).finally(()=>{ct185CProfileFullTask=null});
  return ct185CProfileFullTask;
}
function ct185CShowHotProfile(){
  if(ct185CDirty.has('profile')||!profileCache||!ct185CProfileFullAt||Date.now()-ct185CProfileFullAt>CT185C_PROFILE_PREFETCH_TTL)return false;
  setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));
  try{ct168PaintProfile(profileCache,'')}catch{return false}
  try{ct185ASave('profile','[data-profile]')}catch{}
  ct185CDirty.delete('profile');return true;
}

async function ct185CWarmDiscoverTab(tab){
  tab=String(tab||'foryou');if(!session||tab==='top10'||ct185CSaveData())return null;
  const hot=ct185CDiscoverHot.get(tab);if(hot&&Date.now()-hot.at<CT185C_DISCOVER_HOT_TTL)return hot.rows;
  const rows=await discoverRows(tab).catch(()=>null);if(rows)ct185CDiscoverHot.set(tab,{at:Date.now(),rows});return rows;
}
function ct185CShowHotDiscover(){
  const tab=String(discoverState?.tab||'foryou'),hot=ct185CDiscoverHot.get(tab);
  if(ct185CDirty.has('discover')||tab==='top10'||!hot||Date.now()-hot.at>CT185C_DISCOVER_HOT_TTL)return false;
  setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',`<div class="page" data-discover>${ctR180TabRail()}<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div><div data-discover-content></div></div>`));
  paintDiscover(hot.rows);requestAnimationFrame(()=>{try{ctR180ExposeActiveTab()}catch{}});
  try{ct185ASave('discover','[data-discover]',ct185ADiscoverState())}catch{}
  ct185CDirty.delete('discover');ct185CScheduleDiscoverNeighbors();return true;
}
function ct185CDiscoverOrder(){
  try{return ctR180Tabs.map(x=>String(x[0])).filter(x=>x!=='top10')}catch{return['foryou','trending','popular','new','releases','anticipated','top','calendar']}
}
function ct185CScheduleDiscoverNeighbors(){
  if(!session||ct185CSaveData())return;
  const current=String(discoverState?.tab||'foryou'),order=ct185CDiscoverOrder(),i=Math.max(0,order.indexOf(current));
  const targets=[order[i+1],order[i-1],order[i+2]].filter(Boolean).filter((v,n,a)=>a.indexOf(v)===n);
  const run=async()=>{for(const tab of targets){await ct185CWarmDiscoverTab(tab);await ct185CSleep(180)}};
  if('requestIdleCallback'in window)requestIdleCallback(()=>void run(),{timeout:850});else setTimeout(()=>void run(),350);
}

const ct185CRenderProfileFastBase=renderProfile;
renderProfile=async function(seq){
  if(ct185CShowHotProfile())return;
  const fresh=ct185CFreshSnapshot('profile',CT185C_PROFILE_SNAPSHOT_FRESH);if(fresh){ct185CShowSnapshot('profile',fresh);return}
  const out=await ct185CRenderProfileFastBase(seq);if(seq===navSeq&&route()==='profile')ct185CMarkFresh('profile','[data-profile]');return out;
};

const ct185CRenderDiscoverFastBase=renderDiscover;
renderDiscover=async function(seq){
  if(ct185CShowHotDiscover())return;
  const fresh=ct185CFreshSnapshot('discover',CT185C_DISCOVER_SNAPSHOT_FRESH);if(fresh){ct185CShowSnapshot('discover',fresh);ct185CScheduleDiscoverNeighbors();return}
  const out=await ct185CRenderDiscoverFastBase(seq);if(seq===navSeq&&route()==='discover'){ct185CMarkFresh('discover','[data-discover]');ct185CScheduleDiscoverNeighbors()}return out;
};

/* Warm a Discover subtab before the click lands. */
document.addEventListener('pointerover',e=>{const b=e.target.closest?.('[data-discover-tab]');if(b)void ct185CWarmDiscoverTab(b.dataset.discoverTab)},{passive:true});
document.addEventListener('touchstart',e=>{const b=e.target.closest?.('[data-discover-tab]');if(b)void ct185CWarmDiscoverTab(b.dataset.discoverTab)},{passive:true,capture:true});

/* Any local mutation invalidates the short fresh window immediately. */
window.addEventListener('cinetracker:data-changed',()=>{
  ct185CDirty.add('profile');ct185CDirty.add('discover');ct185CDiscoverHot.clear();ct185CProfileFullAt=0;
});

function ct185CDeepWarm(){
  if(!session||ct185CSaveData()||ct185CDeepWarmTask)return;
  ct185CDeepWarmTask=(async()=>{
    await ct185CSleep(900);
    await ct185CWarmProfileFull();
    await ct185CSleep(280);
    await ct185CWarmDiscoverTab(String(discoverState?.tab||'foryou'));
    await ct185CSleep(220);
    await ct185CWarmDiscoverTab('trending');
  })().catch(()=>null).finally(()=>{ct185CDeepWarmTask=null});
}
const ct185CBootFastBase=boot;
boot=async function(){const out=await ct185CBootFastBase();ct185CDeepWarm();return out};
window.addEventListener('pageshow',()=>{if(session)ct185CDeepWarm()});

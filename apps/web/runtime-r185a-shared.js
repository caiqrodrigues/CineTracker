/* r185A shared — visual snapshot first, current authorities revalidate in background */
window.__ctR185A='instant-visual-cache-safe-revalidate';
window.__ct185AMode='stale-while-revalidate-visual-only';
window.__ct185AAuthority='cache-never-writes-never-decides-business-state';
window.__ct185AFallback='old-render-path-remains-authority';

const CT185A_SCHEMA='ct:r185a:instant:v1';
const CT185A_MAX_AGE=24*60*60*1000;
const CT185A_MAX_HTML=900000;
const CT185A_MUTATING='[data-home-mark-episode],[data-home-mark-movie],[data-discover-watch],[data-sport-watch],[data-sport-fav],[data-add-favorite]';

function ct185AUserKey(){return String(user?.id||'no-user')}
function ct185AKey(slot){return `${CT185A_SCHEMA}:${ct185AUserKey()}:${slot}`}
function ct185ARead(slot,state=null){
  try{
    const raw=localStorage.getItem(ct185AKey(slot));if(!raw)return null;
    const rec=JSON.parse(raw);if(!rec||typeof rec.html!=='string'||!Number(rec.at)){localStorage.removeItem(ct185AKey(slot));return null}
    if(Date.now()-Number(rec.at)>CT185A_MAX_AGE){localStorage.removeItem(ct185AKey(slot));return null}
    if(state&&JSON.stringify(rec.state||null)!==JSON.stringify(state||null))return null;
    return rec;
  }catch{return null}
}
function ct185ASave(slot,selector,state=null){
  try{
    const root=document.querySelector(selector);if(!root||root.querySelector('.loader')||root.querySelector('.error'))return false;
    const html=root.innerHTML;if(!html||html.length>CT185A_MAX_HTML)return false;
    localStorage.setItem(ct185AKey(slot),JSON.stringify({at:Date.now(),state,html}));return true;
  }catch{return false}
}
function ct185ASetStale(root,on=true){
  if(!root)return;
  if(on){root.dataset.ct185aStale='1';for(const b of root.querySelectorAll(CT185A_MUTATING)){if(!b.disabled){b.disabled=true;b.dataset.ct185aDisabled='1'}}}
  else{delete root.dataset.ct185aStale;for(const b of root.querySelectorAll('[data-ct185a-disabled="1"]')){b.disabled=false;delete b.dataset.ct185aDisabled}}
}
function ct185ARestore(slot,selector,state=null){
  const rec=ct185ARead(slot,state),root=document.querySelector(selector);if(!rec||!root)return null;
  root.innerHTML=rec.html;ct185ASetStale(root,true);return rec;
}
function ct185ASync(text='Atualizando…',tone='sync'){
  let el=document.querySelector('.ct185a-sync');if(!el){el=document.createElement('div');el.className='ct185a-sync';document.body.appendChild(el)}
  el.dataset.tone=tone;el.textContent=text;requestAnimationFrame(()=>el.classList.add('show'));return el;
}
function ct185ASyncDone(ok=true){
  const el=document.querySelector('.ct185a-sync');if(!el)return;
  if(!ok){el.dataset.tone='offline';el.textContent='Sem conexão · mostrando último conteúdo';setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),180)},2600);return}
  el.textContent='Atualizado';el.dataset.tone='ok';setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),180)},420);
}
function ct185AHealthy(root){return Boolean(root&&!root.querySelector('.loader')&&!root.querySelector('.error'))}
function ct185AFallback(rec,selector){const root=document.querySelector(selector);if(!rec||!root)return false;root.innerHTML=rec.html;ct185ASetStale(root,true);return true}

const ct185ARenderHomeBase=renderHome;
renderHome=async function(seq){
  const p=ct185ARenderHomeBase(seq),rec=ct185ARestore('home','[data-home]');if(rec)ct185ASync();
  await p;if(seq!==navSeq||route()!=='home')return;
  const root=document.querySelector('[data-home]');
  if(ct185AHealthy(root)){ct185ASetStale(root,false);ct185ASave('home','[data-home]');if(rec)ct185ASyncDone(true)}
  else if(rec){ct185AFallback(rec,'[data-home]');ct185ASyncDone(false)}
};

const ct185ARenderProfileBase=renderProfile;
renderProfile=async function(seq){
  const p=ct185ARenderProfileBase(seq),rec=ct185ARestore('profile','[data-profile]');if(rec)ct185ASync();
  await p;if(seq!==navSeq||route()!=='profile')return;
  const root=document.querySelector('[data-profile]');
  if(ct185AHealthy(root)){ct185ASetStale(root,false);ct185ASave('profile','[data-profile]');if(rec)ct185ASyncDone(true)}
  else if(rec){ct185AFallback(rec,'[data-profile]');ct185ASyncDone(false)}
};

const ct185ARenderSportsBase=renderSports;
renderSports=async function(seq){
  const p=ct185ARenderSportsBase(seq),rec=ct185ARestore('sports','[data-sports]');if(rec)ct185ASync();
  await p;if(seq!==navSeq||route()!=='sports')return;
  const root=document.querySelector('[data-sports]');
  if(ct185AHealthy(root)){ct185ASetStale(root,false);ct185ASave('sports','[data-sports]');if(rec)ct185ASyncDone(true)}
  else if(rec){ct185AFallback(rec,'[data-sports]');ct185ASyncDone(false)}
};

function ct185ADiscoverState(){return{tab:String(discoverState?.tab||'foryou'),type:String(discoverState?.type||'all')}}
const ct185ARenderDiscoverBase=renderDiscover;
renderDiscover=async function(seq){
  const p=ct185ARenderDiscoverBase(seq),state=ct185ADiscoverState(),rec=ct185ARestore('discover','[data-discover]',state);if(rec)ct185ASync();
  await p;if(seq!==navSeq||route()!=='discover')return;
  const root=document.querySelector('[data-discover]');
  if(ct185AHealthy(root)){ct185ASetStale(root,false);ct185ASave('discover','[data-discover]',ct185ADiscoverState());if(rec)ct185ASyncDone(true)}
  else if(rec){ct185AFallback(rec,'[data-discover]');ct185ASyncDone(false)}
};

function ct185ASaveVisible(){
  const r=route();
  if(r==='home')ct185ASave('home','[data-home]');
  else if(r==='profile')ct185ASave('profile','[data-profile]');
  else if(r==='sports')ct185ASave('sports','[data-sports]');
  else if(r==='discover')ct185ASave('discover','[data-discover]',ct185ADiscoverState());
}
window.addEventListener('cinetracker:data-changed',()=>setTimeout(ct185ASaveVisible,180));
document.addEventListener('visibilitychange',()=>{if(document.hidden)ct185ASaveVisible()});
window.addEventListener('pagehide',ct185ASaveVisible);

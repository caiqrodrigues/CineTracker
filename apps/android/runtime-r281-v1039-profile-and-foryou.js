/* CineTracker Android 1.0.39 / r281 — Profile library independent of the
   monolithic RPC; retain server-verified Pra Voce r279/r280 authority. */
(()=>{
'use strict';
if(window.__ctR281AndroidV1039)return;
window.__ctR281AndroidV1039='profile-summary-real-cards+owner-scoped-cache+preserve-audited-foryou';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const owner=()=>String(session?.user?.id||user?.id||'');
const visible=(id=owner())=>Boolean(id&&session&&route()==='profile'&&owner()===id);
const cacheKey=id=>'ct281:profile:summary:'+id;
const isArray=x=>Array.isArray(x);
const arrays=['series','movies','series_favorites','movie_favorites','actors'];
const valid=s=>Boolean(s&&typeof s==='object'&&arrays.every(k=>isArray(s[k]))&&s.counts&&typeof s.counts==='object'&&arrays.every(k=>Number(s.counts[k]||0)===0||s[k].length>0));
let active=null,last=null,version=0,libraryOwner='';
function read(){
 const id=owner();if(!id)return null;
 if(last?.id===id&&Date.now()-last.at<30*60*1000)return last.summary;
 try{
  const value=JSON.parse(localStorage.getItem(cacheKey(id))||'null');
  if(value?.id===id&&Date.now()-Number(value.at||0)<30*60*1000&&valid(value.summary)){
   last=value;return value.summary;
  }
 }catch{}
 return null;
}
function save(summary){
 const id=owner();if(!id||!valid(summary))return;
 last={id,at:Date.now(),summary};
 try{localStorage.setItem(cacheKey(id),JSON.stringify(last))}catch{}
}
function library(summary){
 if(!valid(summary))return null;
 const byKey=new Map();
 function add(rows,changes){
  for(const item of rows){
   if(!item||typeof item!=='object')continue;
   const type=String(item.media_type||'');
   if(type!=='tv'&&type!=='movie')continue;
   const id=Number(item.media_id||0);
   const key=type+':'+(id||Number(item.tmdb_id||0));
   if(key.endsWith(':0'))continue;
   byKey.set(key,{...(byKey.get(key)||{}),...item,...changes,
    is_favorite:Boolean(changes.is_favorite||item.is_favorite||byKey.get(key)?.is_favorite),
    is_seen:Boolean(changes.is_seen||item.is_seen||byKey.get(key)?.is_seen),
    watched_episodes:Math.max(Number(item.watched_episodes||0),Number(byKey.get(key)?.watched_episodes||0))
   });
  }
 }
 add(summary.series,{is_in_progress:true});
 add(summary.movies,{is_seen:true});
 add(summary.series_favorites,{is_favorite:true});
 add(summary.movie_favorites,{is_favorite:true});
 return {dashboard:[...byKey.values()],favorite_actors:summary.actors.slice(0,12)};
}
function existingRows(){
 if(libraryOwner!==owner())return null;
 const d=profileCache?.dashboard;
 return isArray(d)&&d.length>0?d:null;
}
function showPending(message,offerRetry=false){
 if(!visible())return;
 const root=q('[data-profile]');if(!root)return;
 let banner=q('[data-ct281-library-status]',root);
 if(!banner){
  banner=document.createElement('div');banner.className='notice ct281-library-status';
  banner.dataset.ct281LibraryStatus='1';
  const statsPanel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');
  if(statsPanel)statsPanel.insertAdjacentElement('afterend',banner);else root.prepend(banner);
 }
 banner.innerHTML='<span>'+String(message).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</span>'+
  (offerRetry?'<button type="button" class="btn btn-secondary" data-ct281-library-retry>Tentar novamente</button>':'');
 for(const panel of root.querySelectorAll('section.panel')){
  const title=panel.querySelector('.panel-head h2')?.textContent?.trim();
  if(!['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'].includes(title))continue;
  const empty=q('.empty',panel);
  if(empty&&empty.textContent?.includes('Nenhum'))empty.textContent='Aguardando biblioteca sincronizada…';
 }
}
function paintSummary(summary,id){
 if(!visible(id))return false;
 const parts=library(summary);if(!parts)return false;
 const previous=profileCache||{};
 const current=existingRows();
 const dashboard=current?.length?current:parts.dashboard;
 const actors=isArray(previous.favorite_actors)&&previous.favorite_actors.length?
   previous.favorite_actors:parts.favorite_actors;
 const merged={...previous,dashboard,favorite_actors:actors};
 libraryOwner=id;profileCache=merged;
 const scroll=document.scrollingElement?.scrollTop||0;
 const pane=q('[data-profile]')?.closest('.content'),paneScroll=pane?.scrollTop||0;
 ct168PaintProfile(merged,'');
 requestAnimationFrame(()=>{
  if(!visible(id))return;
  if(document.scrollingElement&&scroll>0)document.scrollingElement.scrollTop=scroll;
  if(pane&&pane.isConnected&&paneScroll>0)pane.scrollTop=paneScroll;
  q('[data-ct281-library-status]')?.remove();
 });
 return true;
}
const priorPaint=ct168PaintProfile;
ct168PaintProfile=function(data,note){
 let incoming=data&&typeof data==='object'?data:{};
 const cached=visible()?read():null;
 if(cached&&!(isArray(incoming.dashboard)&&incoming.dashboard.length)){
  const parts=library(cached);
  if(parts)incoming={...incoming,dashboard:parts.dashboard,
   favorite_actors:isArray(incoming.favorite_actors)&&incoming.favorite_actors.length?
      incoming.favorite_actors:parts.favorite_actors};
 }
 const old=existingRows();
 if(old&&!(isArray(incoming.dashboard)&&incoming.dashboard.length)){
  incoming={...incoming,dashboard:old,
   favorite_actors:isArray(incoming.favorite_actors)&&incoming.favorite_actors.length?
      incoming.favorite_actors:(profileCache?.favorite_actors||[])};
 }
 const out=priorPaint(incoming,note);
 if(visible()&&isArray(incoming.dashboard)&&incoming.dashboard.length)libraryOwner=owner();
 if(visible()&&!existingRows())showPending('Buscando suas listas de filmes, séries e favoritos…');
 return out;
};
function fetchSummary(force=false){
 const id=owner();
 if(!visible(id))return Promise.resolve(null);
 if(!force){
  const cached=read();
  if(cached){paintSummary(cached,id);return Promise.resolve(cached)}
 }
 if(active?.id===id)return active.promise;
 const currentVersion=++version;
 showPending('Carregando biblioteca e favoritos…');
 const task=Promise.race([
  rpc('cinetracker_profile_summary_v489',{}),
  new Promise((_,reject)=>setTimeout(()=>reject(new Error('profile-library-timeout')),16000))
 ]).then(summary=>{
  if(!valid(summary))throw new Error('profile-library-invalid');
  if(!visible(id)||currentVersion!==version)return null;
  save(summary);
  paintSummary(summary,id);
  return summary;
 }).catch(()=>{
  if(visible(id)&&currentVersion===version&&!existingRows())
   showPending('Não foi possível carregar as listas agora. Seus dados não foram apagados.',true);
  return null;
 }).finally(()=>{if(active?.promise===task)active=null});
 active={id,promise:task};return task;
}
const prevRender=renderProfile;
renderProfile=function(seq){
 const output=prevRender.apply(this,arguments);
 queueMicrotask(()=>{
  if(!visible()||seq!==navSeq)return;
  void fetchSummary(false);
 });
 return output;
};
document.addEventListener('click',event=>{
 const b=event.target?.closest?.('[data-ct281-library-retry]');
 if(!b||!visible())return;
 event.preventDefault();event.stopImmediatePropagation();
 b.disabled=true;
 void fetchSummary(true).finally(()=>{if(b.isConnected)b.disabled=false});
},true);
window.addEventListener('cinetracker:data-changed',()=>{
 const id=owner();last=null;version++;
 if(id){try{localStorage.removeItem(cacheKey(id))}catch{}}
 if(visible())void fetchSummary(true);
});
const css=document.createElement('style');css.id='ct281-profile-resilience';
css.textContent=[
 '[data-profile] .ct281-library-status{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;padding:11px!important;font-size:12px!important;line-height:1.4!important;flex-wrap:wrap!important}',
 '[data-profile] .ct281-library-status button{min-height:34px!important;white-space:nowrap!important}',
 '[data-profile] .empty{min-height:55px!important}'
].join('\n');
document.head.appendChild(css);

/* First verification audits a bounded sample quickly. If a fresh category is
   still empty and the server verified the first wave, expand the original
   (non-destructively retained) source in the background. Never show unchecked
   titles or fill real Watchlist slots from a popular pool. */
const forYouBase=ct186LoadForYou;
const expanded=new WeakSet();
ct186LoadForYou=async function(...args){
 const data=await forYouBase.apply(this,args);
 if(!data||typeof data!=='object'||expanded.has(data)||data._ct280AuditPartial)return data;
 const fresh=data._ct186_fresh||{};
 const missing=['movie','series','anime'].some(k=>!Array.isArray(fresh[k])||fresh[k].length===0);
 if(!missing)return data;
 expanded.add(data);
 const id=owner();
 setTimeout(()=>{
  if(!id||owner()!==id||route()!=='discover'||discoverState?.tab!=='foryou')return;
  data._ct281AuditDeep=true;
  void window.__ctR279Audit?.auditData(data).then(updated=>{
   if(owner()===id&&route()==='discover'&&discoverState?.tab==='foryou')
    paintDiscover(updated);
  }).catch(()=>{});
 },240);
 return data;
};

window.__ctR281Test={valid,library,read,fetchSummary,paintSummary};
})();
/* CineTracker Web 1.0.266 r476 — immediate Home, intelligent Pra Você and complete Profile lists. */
(()=>{
'use strict';
if(window.__ctR476?.version==='1.0.266')return;
const core=window.__ctCoreR471;if(!core)throw new Error('r476 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};

/* HOME */
let homeToken=0,homeUserMoved=false;
function homeTarget(kind){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q('[data-ct388-movie-watch]',view);
 return qa(':scope > .home-section,:scope > [data-ct399-series-section],:scope > [data-ct388-series-section]',view).find(x=>norm(q('h3',x)?.textContent)==='assistir a seguir')||null;
}
function anchorHome(kind,token){
 if(token!==homeToken||homeUserMoved||routeNow()!=='home')return false;
 const target=homeTarget(kind);if(!target)return false;
 target.style.scrollMarginTop='8px';
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{target.scrollIntoView?.(true)}
 document.documentElement.dataset.ct476HomeAnchor=kind;return true;
}
function primeHome(kind='series'){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series';homeUserMoved=false;const token=++homeToken;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 for(const ms of [0,70,180,360,650,1000])setTimeout(()=>anchorHome(k,token),ms);
 return true;
}
function intentKind(target){
 const tab=target?.closest?.('[data-home-tab],.home-tabs button');if(!tab)return null;
 return String(tab.dataset.homeTab||'series')==='movies'||norm(tab.textContent).includes('filme')?'movies':'series';
}
window.addEventListener('pointerdown',e=>{
 const k=intentKind(e.target);if(k){for(const ms of [0,30,90])setTimeout(()=>primeHome(k),ms);return}
 if(e.target?.closest?.('[data-nav="home"]'))for(const ms of [0,30,90,180])setTimeout(()=>primeHome('series'),ms);
},{capture:true,passive:true});
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'){homeUserMoved=true;homeToken++}},{capture:true,passive:true});
window.addEventListener('keydown',e=>{if(routeNow()==='home'&&['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' '].includes(e.key)){homeUserMoved=true;homeToken++}},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')primeHome('series')},0));

/* PROFILE */
const LIMIT=12;
const labels={series:'Séries',movies:'Filmes',seriesFav:'Séries Favoritas',movieFav:'Filmes Favoritos',actors:'Atores Favoritos'};
const moreLabels={series:'Ver mais séries',movies:'Ver mais filmes',seriesFav:'Ver mais séries favoritas',movieFav:'Ver mais filmes favoritos',actors:'Ver mais atores'};
let profile=null,profileTask=null,profileSeq=0,allSeq=0;
const profileRoot=()=>q('[data-profile]');
const panelFor=key=>{const root=profileRoot(),wanted=norm(labels[key]);if(!root)return null;return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null};
const listFor=key=>key==='series'?rows(profile?.series):key==='movies'?rows(profile?.movies):key==='seriesFav'?rows(profile?.series_favorites):key==='movieFav'?rows(profile?.movie_favorites):rows(profile?.actors);
function actorCard(a){
 const id=Number(a?.tmdb_person_id||0),name=esc(a?.actor_name||'Ator'),p=String(a?.profile_path||''),src=p?(p.startsWith('http')?p:core.image?.(p,'w185')):'';
 return '<article class="card ct476-profile-card"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+name+'</b><small>Ator favorito</small></div></button></article>';
}
function mediaCard(x){
 try{const h=core.mediaCard?.(x);if(typeof h==='string'&&h.trim())return h}catch{}
 const type=String(x?.media_type||'tv')==='movie'?'movie':'tv',id=Number(x?.tmdb_id||0),p=String(x?.poster_path||''),src=p?(p.startsWith('http')?p:core.image?.(p,'w342')):'';
 return '<article class="card ct476-profile-card"><button type="button" data-media="'+type+':'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div class="card-body"><b>'+esc(x?.title||'Sem título')+'</b></div></button></article>';
}
const renderCard=(key,x)=>key==='actors'?actorCard(x):mediaCard(x);
function removeLargeMore(panel){
 qa('[data-ct424-more],[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more],[data-ct471-more],[data-ct472-more],.ct455-profile-more,.ct457-profile-more,.ct460-profile-more,.ct472-more-card',panel).forEach(x=>x.remove());
}
function ensureHeaderMore(panel,key,total){
 const head=q('.panel-head',panel)||panel;
 let b=qa('button,a,[role="button"]',head).find(x=>norm(x.textContent).includes('ver mais'))||null;
 if(!b){b=document.createElement('button');b.type='button';b.className='chip ct476-header-more';head.appendChild(b)}
 b.dataset.ct476HeaderMore=key;b.textContent=moreLabels[key];b.hidden=total===0;b.style.removeProperty('display');b.removeAttribute('aria-hidden');b.tabIndex=0;b.setAttribute('aria-label',moreLabels[key]);return b;
}
function renderPanel(key){
 const panel=panelFor(key);if(!panel)return false;
 const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);if(!row)return false;
 const data=listFor(key);removeLargeMore(panel);
 row.innerHTML=data.slice(0,LIMIT).map(x=>renderCard(key,x)).join('')||'<div class="empty">Nenhum item nesta seção.</div>';
 row.dataset.ct476ProfileRow=key;
 const count=q('.panel-head small',panel);if(count)count.textContent=data.length.toLocaleString('pt-BR');
 ensureHeaderMore(panel,key,data.length);return true;
}
function paintProfile(){
 if(routeNow()!=='profile'||!profile)return false;
 for(const key of Object.keys(labels))renderPanel(key);
 const root=profileRoot();if(root)root.dataset.ct476Profile='12+header-more-full';return true;
}
async function loadProfile(force=false){
 if(profileTask)return profileTask;
 if(profile&&!force){paintProfile();return profile}
 profileTask=(async()=>{try{
  const raw=await core.rpc('cinetracker_profile_lists_v476',{});
  if(raw&&typeof raw==='object'&&!Array.isArray(raw))profile=raw;
  paintProfile();return profile;
 }catch(e){document.documentElement.dataset.ct476ProfileError=String(e?.message||e);return profile}
 finally{profileTask=null}})();
 return profileTask;
}
function closeAll(){q('[data-ct476-all-screen]')?.remove();allSeq++}
function openAll(key){
 const data=listFor(key);closeAll();const seq=++allSeq,back=document.createElement('div');back.className='ct476-all-screen';back.dataset.ct476AllScreen=key;
 back.innerHTML='<section class="ct476-all-panel" role="dialog" aria-modal="true"><header><div><small>PERFIL</small><h2>'+esc(labels[key])+'</h2><p>'+data.length.toLocaleString('pt-BR')+' itens</p></div><button type="button" class="btn" data-ct476-all-close>✕ Fechar</button></header><div class="ct476-all-grid" data-ct476-all-grid></div></section>';
 document.body.appendChild(back);const grid=q('[data-ct476-all-grid]',back);let i=0;
 const paint=()=>{
  if(seq!==allSeq||!back.isConnected)return;
  const end=Math.min(data.length,i+36),frag=document.createDocumentFragment();
  for(;i<end;i++){const t=document.createElement('template');t.innerHTML=renderCard(key,data[i]).trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}
  grid.appendChild(frag);if(i<data.length)requestAnimationFrame(paint);
 };
 requestAnimationFrame(paint);q('[data-ct476-all-close]',back)?.focus();return true;
}
function scheduleProfile(force=false){
 const seq=++profileSeq;
 for(const ms of [40,140,320,700,1400,2600,4600,7200])setTimeout(()=>{
  if(seq!==profileSeq||routeNow()!=='profile')return;
  if(profile&&!force)paintProfile();else void loadProfile(force);
 },ms);
}
window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct476-header-more]');
 if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openAll(String(b.dataset.ct476HeaderMore||''));return}
 if(e.target?.closest?.('[data-ct476-all-close]')||e.target?.matches?.('[data-ct476-all-screen]')){e.preventDefault();closeAll();return}
 if(e.target?.closest?.('[data-nav="profile"]')){profile=null;setTimeout(()=>scheduleProfile(true),0)}
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){profile=null;scheduleProfile(true)}});
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')scheduleProfile(false)},0));

const style=document.createElement('style');style.id='ct476-style';style.textContent=[
'.ct476-home-skeleton{display:grid;gap:12px;padding:12px 0}.ct476-home-skeleton>div{height:86px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.09),rgba(255,255,255,.04))}',
'.ct476-movie-grid{grid-template-columns:repeat(auto-fill,minmax(150px,150px))!important;gap:16px!important;align-items:start!important}.ct476-movie-grid>.card{width:150px!important;min-width:150px!important;max-width:150px!important}.ct476-movie-grid .poster{aspect-ratio:2/3!important}.ct476-movie-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
'[data-profile] [data-ct476-profile-row]{display:flex!important;flex-flow:row wrap!important;gap:16px!important;align-items:stretch!important;max-height:none!important;overflow:visible!important}[data-profile] [data-ct476-profile-row]>.card{flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}[data-profile] [data-ct476-profile-row] .poster{aspect-ratio:2/3!important}[data-profile] [data-ct476-profile-row] .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
'.ct455-profile-more,.ct457-profile-more,.ct460-profile-more,.ct472-more-card,[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more],[data-ct471-more],[data-ct472-more]{display:none!important}',
'.ct476-header-more{margin-left:auto!important;min-height:28px!important;height:28px!important;padding:4px 9px!important;font-size:11px!important;line-height:1!important}',
'.ct476-all-screen{position:fixed;inset:0;z-index:2147482500;background:rgba(3,10,15,.88);backdrop-filter:blur(14px);overflow:auto;padding:24px}.ct476-all-panel{max-width:1240px;margin:0 auto;background:rgba(10,25,34,.98);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.5)}.ct476-all-panel>header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.ct476-all-panel h2{margin:2px 0}.ct476-all-panel p{margin:0;opacity:.7}.ct476-all-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,150px));gap:16px;align-items:start}.ct476-all-grid>.card{width:150px!important;min-width:150px!important;max-width:150px!important}.ct476-all-grid .poster{aspect-ratio:2/3!important}.ct476-all-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
'@media(max-width:720px){.ct476-movie-grid,.ct476-all-grid{grid-template-columns:repeat(auto-fill,minmax(132px,1fr))!important;gap:10px!important}.ct476-movie-grid>.card,.ct476-all-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}.ct476-all-screen{padding:10px}.ct476-all-panel{padding:12px}}'
].join('');
if(!q('#ct476-style'))document.head.appendChild(style);

if(routeNow()==='home')primeHome(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series');
if(routeNow()==='profile')scheduleProfile(true);
window.__ctR476Marker='home-visible-card-watchlist+foryou-v476-strict-smart+profile-12-header-more-full';
window.__ctR476={version:'1.0.266',scope:'home+discover-foryou+profile-lists',primeHome,loadProfile,paintProfile,openAll};
})();

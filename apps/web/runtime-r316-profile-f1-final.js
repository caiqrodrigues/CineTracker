/* CineTracker Web 1.0.107 r316 — Profile approved stat geometry + clickable Watchlists + truthful F1 overview. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR316)return;
window.__ctR316='profile-r237-order+watchlist-open+f1-incomplete-schedule-truth';
window.__ctR316Profile='r237-exact-order+watchlist-modal+live-sports+unified-collapse';
window.__ctR316F1='four-tabs+no-legacy-panel+no-false-season-ended';
window.__ctR316Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
let watchTask=null,watchCache=null,watchAt=0,testBridge=null;

function type316(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function id316(x){try{return Number(typeof mediaTmdb==='function'?mediaTmdb(x):0)||Number(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}}
function title316(x){return x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título'}
function year316(x){return n(x?.release_year)||n(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||0}
function poster316(x){
 let p='';try{p=typeof mediaPoster==='function'?mediaPoster(x):''}catch{}p=p||x?.poster_path||x?.raw_tmdb?.poster_path||'';
 if(!p)return'';if(/^https?:\/\//i.test(p))return p;try{return typeof img==='function'?img(p,'w342'):`https://image.tmdb.org/t/p/w342${String(p).startsWith('/')?'':'/'}${p}`}catch{return''}
}
function status316(x){
 if(x?.is_completed)return'Concluída';if(x?.is_up_to_date)return'Em dia';if(x?.is_in_progress||n(x?.watched_episodes)>0)return'Em andamento';if(x?.is_seen)return'Assistido';return'Não iniciado';
}
function statByLabel316(root,label){
 const wanted=norm(label);return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(x=>{
  const el=q('small,label,.stat-label,.label',x);return norm(el?.textContent||'')===wanted
 })||null;
}
function watchKind316(card){
 const label=norm(q('small,label,.stat-label,.label',card)?.textContent||'');
 return label==='series watchlist'?'series':label==='filmes watchlist'?'movie':'';
}
function decorateWatchStats316(root=q('[data-profile]')){
 if(!root)return false;let hit=false;
 for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){
  const kind=watchKind316(card);if(!kind)continue;hit=true;
  card.dataset.ct316Watchlist=kind;
  card.classList.add('ct316-watchlist-stat');
  card.classList.remove('ct315-watchlist-static');
  card.setAttribute('role','button');card.setAttribute('tabindex','0');
  card.setAttribute('aria-label',kind==='movie'?'Abrir Filmes Watchlist':'Abrir Séries Watchlist');
  card.setAttribute('title',kind==='movie'?'Abrir Filmes Watchlist':'Abrir Séries Watchlist');
 }
 return hit;
}
function exactOrder316(root=q('[data-profile]')){
 if(!root)return false;
 try{if(typeof window.__ctR237ProfileOrder==='function')window.__ctR237ProfileOrder()}catch{}
 const grid=q('.ct237-profile-stats',root);
 if(grid)grid.dataset.ct316Order='episodes,movies,series-watch,movies-watch,series-time,movies-time,series-watch-time,movies-watch-time,screen-total,watch-total';
 return !!grid;
}
function profilePanels316(root=q('[data-profile]')){
 if(!root)return{main:null,sports:null};
 const panels=qa('section.panel,.panel',root);
 const main=panels.find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'')==='estatisticas')||null;
 const sports=panels.find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'))||null;
 if(main&&sports&&main.nextElementSibling!==sports)main.insertAdjacentElement('afterend',sports);
 return{main,sports};
}
function decorateProfile316(){
 if(!['profile','perfil'].includes(routeNow()))return false;
 const root=q('[data-profile]');if(!root)return false;
 profilePanels316(root);exactOrder316(root);decorateWatchStats316(root);
 try{window.__ctR299Test?.decorateProfile299?.()}catch{}
 try{window.__ctV114SyncStats?.()}catch{}
 try{window.__ctR309?.actorRail?.()}catch{}
 root.dataset.ct316Profile='approved-r237-clickable-watchlists';
 return true;
}
function scheduleProfile316(){
 for(const ms of[0,40,120,320,700,1400])setTimeout(()=>decorateProfile316(),ms);
}

async function watchRows316(kind,force=false){
 if(testBridge?.watchRows)return testBridge.watchRows(kind,force);
 if(!force&&watchCache&&Date.now()-watchAt<60000)return watchCache.filter(x=>type316(x)===(kind==='movie'?'movie':'tv'));
 if(watchTask&&!force){const all=await watchTask;return all.filter(x=>type316(x)===(kind==='movie'?'movie':'tv'))}
 watchTask=(async()=>{
  let list=[];
  try{
   const d=await rpc('cinetracker_watchlist_full_v119',{});
   list=Array.isArray(d?.rows)?d.rows:Array.isArray(d)?d:[];
  }catch{}
  if(!list.length){
   try{
    const p=(typeof profileCache!=='undefined'&&profileCache?.dashboard)?profileCache:await rpc('cinetracker_profile_payload_v0997',{p_tz:typeof tz==='function'?tz():undefined});
    list=(Array.isArray(p?.dashboard)?p.dashboard:[]).filter(x=>x?.is_watchlist);
   }catch{}
  }
  const seen=new Set(),out=[];
  for(const x of list){const id=id316(x);if(!(id>0))continue;const k=type316(x)+':'+id;if(seen.has(k))continue;seen.add(k);out.push(x)}
  watchCache=out;watchAt=Date.now();return out;
 })().finally(()=>{watchTask=null});
 const all=await watchTask;return all.filter(x=>type316(x)===(kind==='movie'?'movie':'tv')).sort((a,b)=>title316(a).localeCompare(title316(b),'pt-BR',{sensitivity:'base'}));
}
function watchCard316(x){
 const type=type316(x),id=id316(x),title=title316(x),year=year316(x),poster=poster316(x),status=status316(x);
 const eps=type==='tv'&&n(x?.total_episodes)>0?`${n(x?.watched_episodes)}/${n(x?.total_episodes)} episódios`:'';
 return `<button type="button" class="ct316-watch-row" data-ct316-media="${type}:${id}">${poster?`<img loading="lazy" src="${esc(poster)}" alt="">`:'<span class="ct316-watch-poster-empty">Sem poster</span>'}<span class="ct316-watch-copy"><b>${esc(title)}</b><small>${[year||'',status,eps].filter(Boolean).map(esc).join(' · ')}</small></span><i aria-hidden="true">›</i></button>`;
}
function closeWatch316(){q('[data-ct316-watch-modal]')?.remove()}
async function openWatch316(kind){
 closeWatch316();const label=kind==='movie'?'Filmes Watchlist':'Séries Watchlist';
 const back=document.createElement('div');back.className='ct316-watch-backdrop';back.dataset.ct316WatchModal=kind;
 back.innerHTML=`<section class="ct316-watch-dialog" role="dialog" aria-modal="true" aria-labelledby="ct316-watch-title"><header><div><small>PERFIL · WATCHLIST</small><h2 id="ct316-watch-title">${label}</h2></div><button type="button" data-ct316-watch-close aria-label="Fechar">×</button></header><div class="ct316-watch-body"><div class="loader">Carregando Watchlist...</div></div></section>`;
 document.body.appendChild(back);
 try{
  const list=await watchRows316(kind,false),body=q('.ct316-watch-body',back),h=q('#ct316-watch-title',back);if(!body)return;
  if(h)h.textContent=`${label} · ${list.length}`;
  body.innerHTML=list.length?`<div class="ct316-watch-list">${list.map(watchCard316).join('')}</div>`:'<div class="empty">Nenhum item nessa Watchlist.</div>';
 }catch(e){const body=q('.ct316-watch-body',back);if(body)body.innerHTML=`<div class="empty">Não foi possível carregar a Watchlist.<br><small>${esc(e?.message||e)}</small></div>`}
}
function openMedia316(raw){
 const [type,idRaw]=String(raw||'').split(':'),id=Number(idRaw||0);if(!id)return false;closeWatch316();
 try{if(typeof go==='function'){go(`/${type==='movie'?'movie':'series'}/${id}`);return true}}catch{}
 location.href=`/${type==='movie'?'movie':'series'}/${id}`;return true;
}

function normalizeF1316(){
 if(!['sports','esportes'].includes(routeNow()))return false;
 qa('[data-ct263-f1-watch-panel],.ct263-f1-watch-panel').forEach(x=>x.remove());
 qa('[data-ct255-f1tab="drivers"],[data-ct255-f1tab="teams"],[data-ct257-f1tab="drivers"],[data-ct257-f1tab="teams"]').forEach(x=>x.remove());
 const hub=q('[data-ct255-f1]')||q('.ct255-f1hub');if(!hub)return false;
 const hero=q('.ct255-f1-hero',hub),title=q('.ct255-f1-hero h3',hub),summary=hero&&q('.ct255-f1-summary',hub);
 if(title&&norm(title.textContent)==='temporada encerrada'){
  title.textContent='Agenda ainda não sincronizada';
  hero.dataset.ct316Schedule='incomplete';
  let p=q('p',hero);if(p&&!p.textContent.trim())p.textContent='A fonte atual não trouxe as próximas etapas.';
  const next=summary&&qa('div',summary).find(x=>norm(q('small',x)?.textContent||'')==='proximo');
  const val=next&&q('b',next);if(val&&(!val.textContent.trim()||val.textContent.trim()==='—'))val.textContent='Aguardando agenda';
 }
 hub.dataset.ct316F1='truthful-incomplete-schedule';
 return true;
}
function scheduleF1316(){for(const ms of[0,80,250,650,1400,2600])setTimeout(normalizeF1316,ms)}

const baseProfile316=typeof renderProfile==='function'?renderProfile:null;
if(baseProfile316)renderProfile=async function(){const out=await baseProfile316.apply(this,arguments);scheduleProfile316();return out};
const baseSports316=typeof renderSports==='function'?renderSports:null;
if(baseSports316)renderSports=async function(){const out=await baseSports316.apply(this,arguments);scheduleF1316();return out};

function earlyHandle316(target,e){
 if(!target?.closest)return false;
 const stat=target.closest('[data-ct316-watchlist]');if(stat){void openWatch316(stat.dataset.ct316Watchlist==='movie'?'movie':'series');return true}
 const close=target.closest('[data-ct316-watch-close]');if(close){closeWatch316();return true}
 const media=target.closest('[data-ct316-media]');if(media){openMedia316(media.dataset.ct316Media);return true}
 if(target.matches?.('[data-ct316-watch-modal]')){closeWatch316();return true}
 return false;
}
window.__ctR316EarlyHandle=earlyHandle316;

window.addEventListener('cinetracker:data-changed',()=>{watchCache=null;watchAt=0;scheduleProfile316();scheduleF1316()});
window.addEventListener('popstate',()=>{scheduleProfile316();scheduleF1316()});
try{
 const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(['profile','perfil'].includes(routeNow()))requestAnimationFrame(decorateProfile316);if(['sports','esportes'].includes(routeNow()))requestAnimationFrame(normalizeF1316)}).observe(app,{subtree:true,childList:true,characterData:true});
}catch{}
scheduleProfile316();scheduleF1316();

const style=document.createElement('style');style.id='ct-web-r316';style.textContent=`
/* Restore the exact r237 statistic geometry after r238/r315 producers. */
[data-profile] .ct237-profile-stats{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
[data-profile] .ct237-profile-stats>[data-ct237-profile-stat="screen-total"],
[data-profile] .ct237-profile-stats>[data-ct237-profile-stat="watch-total"]{grid-column:span 2!important}
[data-profile] [data-ct316-watchlist]{position:relative!important;pointer-events:auto!important;cursor:pointer!important;padding-right:30px!important;transition:border-color .15s ease,background .15s ease,transform .15s ease!important}
[data-profile] [data-ct316-watchlist]:hover,[data-profile] [data-ct316-watchlist]:focus-visible{border-color:#3d7892!important;background:#0d202a!important;transform:translateY(-1px)!important;outline:none!important}
[data-profile] [data-ct316-watchlist]::after{content:'›'!important;display:block!important;position:absolute!important;right:11px!important;top:50%!important;transform:translateY(-50%)!important;font-size:22px!important;line-height:1!important;opacity:.82!important}
.ct316-watch-backdrop{position:fixed;inset:0;z-index:12040;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:14px}
.ct316-watch-dialog{width:min(920px,97vw);max-height:92vh;display:flex;flex-direction:column;background:#07131a;border:1px solid #285061;border-radius:18px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.55)}
.ct316-watch-dialog>header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 17px;border-bottom:1px solid #193946}
.ct316-watch-dialog>header small{display:block;font-size:10px;letter-spacing:.11em;opacity:.65}.ct316-watch-dialog>header h2{margin:2px 0 0;font-size:19px}
.ct316-watch-dialog>header button{width:34px;height:34px;border-radius:50%;border:1px solid #31596b;background:#0b1e27;color:inherit;font-size:22px;cursor:pointer}
.ct316-watch-body{overflow:auto;padding:12px}.ct316-watch-list{display:grid;gap:8px}
.ct316-watch-row{display:grid;grid-template-columns:58px minmax(0,1fr) 18px;gap:10px;align-items:center;width:100%;padding:7px 9px;border:1px solid #193946;border-radius:12px;background:#0a1921;color:inherit;text-align:left;cursor:pointer}
.ct316-watch-row img,.ct316-watch-poster-empty{width:58px;height:87px;border-radius:8px;object-fit:cover;background:#102630}.ct316-watch-poster-empty{display:grid;place-items:center;text-align:center;font-size:9px}
.ct316-watch-copy{min-width:0;display:flex;flex-direction:column;gap:5px}.ct316-watch-copy b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct316-watch-copy small{opacity:.72}.ct316-watch-row i{font-style:normal;font-size:22px;opacity:.75}
[data-ct316-schedule="incomplete"] h3{margin-bottom:4px!important}
[data-ct316-schedule="incomplete"] p{opacity:.72!important}
@media(max-width:700px){[data-profile] .ct237-profile-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}[data-profile] .ct237-profile-stats>[data-ct237-profile-stat="screen-total"],[data-profile] .ct237-profile-stats>[data-ct237-profile-stat="watch-total"]{grid-column:span 2!important}}
`;
document.head.appendChild(style);

window.__ctR316={decorateProfile:decorateProfile316,openWatchlist:openWatch316,normalizeF1:normalizeF1316,exactOrder:exactOrder316,version:'1.0.107'};
window.__ctR316Test={watchKind316,decorateWatchStats316,exactOrder316,normalizeF1316,watchRows316,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();

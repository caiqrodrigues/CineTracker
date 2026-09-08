/* CineTracker 1.0.17 — complete Watchlist drill-down in Profile + organized Web Sports cards. */
(()=>{
'use strict';
if(window.__ctR223V117)return;
window.__ctR223V117='profile-watchlist-drilldown-sports-organized-ui';
window.__ctV117ProfileWatchlist='stats-click-complete-watchlist-modal';
window.__ctV117SportsUI='four-column-structured-single-actionbar-deduped';

const q117=(s,r=document)=>r?.querySelector?.(s)||null;
const qa117=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n117=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm117=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc117=v=>{try{return esc(v)}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
const isAndroid117=()=>Boolean(window.__ctAndroidOfficialVersion||window.__ctAndroidRelease||document.querySelector('meta[name="ct-android-version"]'));
const type117=x=>String(x?.media_type||'')==='movie'?'movie':'tv';
const id117=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const poster117=x=>{try{return mediaPoster(x)||''}catch{return x?.poster_path||x?.raw_tmdb?.poster_path||''}};
function posterUrl117(x){const p=poster117(x);if(!p)return'';if(/^https?:\/\//i.test(p))return p;try{return img(p,'w342')}catch{return `https://image.tmdb.org/t/p/w342${String(p).startsWith('/')?'':'/'}${p}`}}
function year117(x){return n117(x?.release_year)||n117(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||0}
function status117(x){
 if(x?.is_completed)return'Concluída';
 if(x?.is_up_to_date)return'Em dia';
 if(x?.is_in_progress||n117(x?.watched_episodes)>0)return'Em andamento';
 if(x?.is_seen)return'Assistido';
 return'Não iniciado';
}

/* ---------- Perfil: os dois números da Watchlist viram botões de lista completa ---------- */
let profile117=null,profileAt117=0,profileTask117=null;
async function profilePayload117(force=false){
 let local=null;try{if(typeof profileCache!=='undefined'&&profileCache?.dashboard)local=profileCache}catch{}
 if(!force&&local?.dashboard){profile117=local;profileAt117=Date.now();return local}
 if(!force&&profile117&&Date.now()-profileAt117<60000)return profile117;
 if(profileTask117)return profileTask117;
 profileTask117=Promise.resolve().then(()=>rpc('cinetracker_profile_payload_v0997',{})).then(d=>{profile117=d||{};profileAt117=Date.now();return profile117}).finally(()=>profileTask117=null);
 return profileTask117;
}
function watchRows117(d,kind){
 const rows=Array.isArray(d?.dashboard)?d.dashboard:[];
 const filtered=rows.filter(x=>Boolean(x?.is_watchlist)&&(kind==='movie'?type117(x)==='movie':type117(x)==='tv')&&id117(x)>0);
 const seen=new Set(),out=[];
 for(const x of filtered){const k=type117(x)+':'+id117(x);if(seen.has(k))continue;seen.add(k);out.push(x)}
 return out.sort((a,b)=>String(a?.title||a?.name||'').localeCompare(String(b?.title||b?.name||''),'pt-BR',{sensitivity:'base'}));
}
function watchCard117(x){
 const title=x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título',year=year117(x),poster=posterUrl117(x),st=status117(x),eps=type117(x)==='tv'&&n117(x?.total_episodes)>0?`${n117(x?.watched_episodes)}/${n117(x?.total_episodes)} episódios`:'';
 return `<article class="ct117-watch-card" data-ct117-media="${type117(x)}:${id117(x)}">${poster?`<img loading="lazy" src="${esc117(poster)}" alt="Poster de ${esc117(title)}">`:'<div class="ct117-watch-poster-empty">Sem poster</div>'}<div class="ct117-watch-card-copy"><div class="ct117-watch-title"><b>${esc117(title)}</b>${year?`<span>${year}</span>`:''}</div><div class="ct117-watch-meta"><span>${esc117(st)}</span>${eps?`<span>${esc117(eps)}</span>`:''}</div></div></article>`;
}
function closeWatchModal117(){q117('[data-ct117-watch-modal]')?.remove()}
async function openWatchModal117(kind){
 closeWatchModal117();
 const label=kind==='movie'?'Filmes na Watchlist':'Séries na Watchlist',m=document.createElement('div');m.className='ct117-watch-modal';m.dataset.ct117WatchModal=kind;m.innerHTML=`<div class="ct117-watch-dialog" role="dialog" aria-modal="true" aria-label="${esc117(label)}"><div class="ct117-watch-head"><div><small>WATCHLIST COMPLETA</small><h2>${esc117(label)}</h2></div><button type="button" class="ct117-watch-close" data-ct117-watch-close aria-label="Fechar">×</button></div><div class="ct117-watch-body"><div class="loader">Carregando Watchlist...</div></div></div>`;document.body.appendChild(m);
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest?.('[data-ct117-watch-close]'))closeWatchModal117()});
 try{
  const d=await profilePayload117(false),rows=watchRows117(d,kind),body=q117('.ct117-watch-body',m),h=q117('.ct117-watch-head h2',m);if(!body)return;
  if(h)h.textContent=`${label} · ${rows.length}`;
  body.innerHTML=rows.length?`<div class="ct117-watch-list">${rows.map(watchCard117).join('')}</div>`:'<div class="empty">Nenhum item nessa Watchlist.</div>';
  m.dataset.ct117Count=String(rows.length);
 }catch(e){const body=q117('.ct117-watch-body',m);if(body)body.innerHTML=`<div class="error">Não foi possível carregar a Watchlist: ${esc117(e?.message||e)}</div>`}
}
function markWatchStats117(){
 const root=q117('[data-profile]');if(!root)return;const panel=q117('.ct-r180-stats-panel',root)||qa117('section.panel',root).find(p=>norm117(q117('.panel-head h2,h2',p)?.textContent)==='estatisticas');if(!panel)return;
 for(const stat of qa117('.stat',panel)){
  const label=norm117(q117('small',stat)?.textContent||'');const kind=label==='filmes watchlist'?'movie':label==='series watchlist'?'series':'';if(!kind)continue;
  stat.classList.add('ct117-watchlist-stat');stat.dataset.ct117WatchlistStat=kind;stat.setAttribute('role','button');stat.setAttribute('tabindex','0');stat.setAttribute('aria-label',kind==='movie'?'Abrir todos os filmes na Watchlist':'Abrir todas as séries na Watchlist');
  if(!q117('.ct117-stat-chevron',stat)){const c=document.createElement('span');c.className='ct117-stat-chevron';c.textContent='›';c.setAttribute('aria-hidden','true');stat.appendChild(c)}
 }
}

/* ---------- Web Esportes: uma hierarquia, uma barra de ações e sem botões duplicados ---------- */
function actionKind117(el){
 const t=norm117(el?.textContent||''),compact=t.replace(/\s+/g,'');
 if(el?.hasAttribute?.('data-ct165-open-favorite')||t.includes('ver eventos'))return'events';
 if(compact.includes('marcarcomoassistido')||compact.includes('marcarassistido')||compact.includes('desmarcarcomoassistido')||compact.includes('desmarcarassistido'))return'watched';
 return'';
}
function bestAction117(nodes,kind){
 return [...nodes].sort((a,b)=>{
  const ac=(a.classList.contains('chip')?-20:0)+String(a.textContent||'').length+(a.hasAttribute('data-ct165-open-favorite')?5:0),bc=(b.classList.contains('chip')?-20:0)+String(b.textContent||'').length+(b.hasAttribute('data-ct165-open-favorite')?5:0);return bc-ac;
 })[0]||null;
}
function organizeEvent117(card){
 if(!card||isAndroid117())return;card.classList.add('ct117-event-card');
 let bar=q117(':scope > .ct117-event-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct117-event-actions';card.appendChild(bar)}
 const all=qa117('button,a.btn,a.button',card).filter(x=>!bar.contains(x));
 for(const kind of ['events','watched']){
  const found=[...all,...qa117('button,a.btn,a.button',bar)].filter(x=>actionKind117(x)===kind),keep=bestAction117(found,kind);if(!keep)continue;
  for(const x of found)if(x!==keep)x.remove();
  keep.classList.remove('chip');keep.classList.add('ct117-event-action',kind==='watched'?'ct117-event-action-primary':'ct117-event-action-secondary');bar.appendChild(keep);
 }
 for(const el of qa117('button,a.btn,a.button',card)){if(bar.contains(el))continue;el.classList.add('ct117-event-meta-control')}
 bar.dataset.ct117Actions=String(qa117('.ct117-event-action',bar).length);
 if(!qa117('.ct117-event-action',bar).length)bar.remove();
}
function organizeSports117(){
 if(isAndroid117())return;const root=q117('[data-sports]');if(!root)return;
 for(const grid of qa117('.event-grid',root))grid.classList.add('ct117-event-grid');
 for(const card of qa117('.event,.sport-event',root))organizeEvent117(card);
 root.dataset.ct117SportsUi='organized';
}

let timer117=0;function sync117(){clearTimeout(timer117);timer117=setTimeout(()=>{markWatchStats117();organizeSports117()},25)}
document.addEventListener('click',e=>{
 const stat=e.target.closest?.('[data-ct117-watchlist-stat]');if(stat){e.preventDefault();e.stopPropagation();void openWatchModal117(stat.dataset.ct117WatchlistStat);return}
},true);
document.addEventListener('keydown',e=>{const stat=e.target.closest?.('[data-ct117-watchlist-stat]');if(stat&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void openWatchModal117(stat.dataset.ct117WatchlistStat)}if(e.key==='Escape'&&q117('[data-ct117-watch-modal]'))closeWatchModal117()},true);
try{new MutationObserver(sync117).observe(q117('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const style=document.createElement('style');style.id='ct-v117-ui';style.textContent=`
.ct117-watchlist-stat{position:relative!important;cursor:pointer!important;padding-right:32px!important;transition:transform .16s ease,border-color .16s ease,background .16s ease!important;outline:none!important}
.ct117-watchlist-stat:hover,.ct117-watchlist-stat:focus-visible{transform:translateY(-1px);border-color:#3d7892!important;background:#0d202a!important}
.ct117-stat-chevron{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:24px;line-height:1;opacity:.8}
.ct117-watch-modal{position:fixed;inset:0;z-index:10020;background:rgba(0,0,0,.78);display:grid;place-items:center;padding:18px}
.ct117-watch-dialog{width:min(860px,96vw);max-height:90vh;overflow:hidden;display:flex;flex-direction:column;background:#07131a;border:1px solid #254756;border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.55)}
.ct117-watch-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border-bottom:1px solid #193541}
.ct117-watch-head small{display:block;letter-spacing:.12em;opacity:.65;font-size:10px;margin-bottom:3px}.ct117-watch-head h2{margin:0;font-size:20px}
.ct117-watch-close{width:34px;height:34px;min-width:34px;border-radius:50%;border:1px solid #31596b;background:#0b1e27;color:inherit;font-size:23px;line-height:1;cursor:pointer}
.ct117-watch-body{overflow:auto;padding:14px}.ct117-watch-list{display:grid;gap:9px}
.ct117-watch-card{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center;min-height:96px;padding:8px;border:1px solid #193946;border-radius:13px;background:#0a1921}
.ct117-watch-card img,.ct117-watch-poster-empty{width:64px;height:96px;border-radius:9px;object-fit:cover;background:#102630;display:grid;place-items:center;text-align:center;font-size:10px;opacity:.95}
.ct117-watch-card-copy{min-width:0}.ct117-watch-title{display:flex;gap:8px;align-items:baseline;justify-content:space-between}.ct117-watch-title b{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct117-watch-title span{font-size:11px;opacity:.65;flex:none}
.ct117-watch-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.ct117-watch-meta span{font-size:10px;padding:4px 7px;border:1px solid #285064;border-radius:999px;opacity:.85}
`+(isAndroid117()?'':`
[data-sports] .event-grid.ct117-event-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;align-items:stretch!important}
[data-sports] .event.ct117-event-card,[data-sports] .sport-event.ct117-event-card{display:flex!important;flex-direction:column!important;gap:10px!important;min-width:0!important;min-height:270px!important;padding:14px!important;border-radius:16px!important;overflow:hidden!important}
[data-sports] .ct117-event-card .ct117-event-meta-control{min-height:27px!important;height:27px!important;padding:0 9px!important;border-radius:999px!important;font-size:10px!important;line-height:1!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;vertical-align:middle!important}
[data-sports] .ct117-event-actions{margin-top:auto!important;padding-top:11px!important;border-top:1px solid rgba(90,157,184,.2)!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;width:100%!important}
[data-sports] .ct117-event-actions[data-ct117-actions="1"]{grid-template-columns:1fr!important}
[data-sports] .ct117-event-action{box-sizing:border-box!important;width:100%!important;min-width:0!important;height:38px!important;min-height:38px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0 12px!important;border-radius:11px!important;font-size:12px!important;font-weight:650!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-sports] .ct117-event-action-primary{border-color:#3a7a96!important;background:rgba(30,91,116,.28)!important}
[data-sports] .ct117-event-action-secondary{background:transparent!important}
@media(max-width:1399px){[data-sports] .event-grid.ct117-event-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(max-width:1049px){[data-sports] .event-grid.ct117-event-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:699px){[data-sports] .event-grid.ct117-event-grid{grid-template-columns:1fr!important}[data-sports] .event.ct117-event-card,[data-sports] .sport-event.ct117-event-card{min-height:0!important}}
`);
document.getElementById(style.id)?.remove();document.head.appendChild(style);

window.__ctV117ProfilePayload=profilePayload117;
window.__ctV117WatchRows=watchRows117;
window.__ctV117OpenWatchlist=openWatchModal117;
window.__ctV117OrganizeSports=organizeSports117;
sync117();
})();

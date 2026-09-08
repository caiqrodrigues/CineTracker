/* CineTracker 1.0.21 — stable final authorities for Web feedback: async Pra Voce, Sports, stats collapse, Watchlist auth. */
(()=>{
'use strict';
if(window.__ctR227V121)return;
window.__ctR227V121='stable-web-authority-auth-refresh-no-premature-empty';
window.__ctV121ForYou='no-premature-empty-final-settle';
window.__ctV121Sports='direct-grid-children-canonical-actions';
window.__ctV121Stats='icon-only-stable-after-legacy-toggle';
window.__ctV121Watchlist='jwt-refresh-retry-dashboard-fallback';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc121=v=>{try{return esc(v)}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const mType=x=>String(x?.media_type||'')==='movie'?'movie':'tv';
const mId=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const mTitle=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const mYear=x=>n(x?.release_year)||n(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||0;
const mAdded=x=>{const t=Date.parse(x?.added_at||x?.created_at||0);return Number.isFinite(t)?t:0};
function mPoster(x){const p=x?.poster_path||x?.raw_tmdb?.poster_path||'';if(!p)return'';if(/^https?:\/\//i.test(p))return p;try{return img(p,'w342')}catch{return`https://image.tmdb.org/t/p/w342${String(p).startsWith('/')?'':'/'}${p}`}}

/* ---------- Auth-aware Watchlist ---------- */
let wlCache=null,wlAt=0,wlTask=null;
function jwtExpired121(e){return /jwt\s*expired|token\s*expired|expired\s*jwt|invalid\s*jwt/i.test(String(e?.message||e||''))}
async function refresh121(){
 try{
  if(session?.refresh_token&&typeof authRequest==='function'&&typeof saveSession==='function'){
   const d=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token});
   saveSession(d);try{user=d.user||user}catch{};return true;
  }
 }catch{}
 try{return Boolean(await restoreSession())}catch{return false}
}
function dashboardFallback121(){
 let dash=[];try{dash=Array.isArray(profileCache?.dashboard)?profileCache.dashboard:[]}catch{}
 const rows=dash.filter(x=>Boolean(x?.is_watchlist||x?.is_added_to_watchlist||x?.is_watch_later)).map(x=>({...x,added_at:x?.added_at||x?.created_at||x?.updated_at||null}));
 return {rows,counts:{movie:rows.filter(x=>mType(x)==='movie').length,series:rows.filter(x=>mType(x)==='tv').length},count:rows.length,fallback:true};
}
async function rpcFresh121(){
 try{return await rpc('cinetracker_watchlist_full_v119',{})}
 catch(e){
  if(!jwtExpired121(e))throw e;
  const ok=await refresh121();if(!ok)throw e;
  return rpc('cinetracker_watchlist_full_v119',{});
 }
}
async function full121(force=false){
 if(!force&&wlCache&&Date.now()-wlAt<60000)return wlCache;
 if(wlTask)return wlTask;
 wlTask=(async()=>{try{const d=await rpcFresh121();wlCache=d||{rows:[],counts:{movie:0,series:0}}}catch(e){const fb=dashboardFallback121();if(fb.rows.length)wlCache=fb;else throw e}wlAt=Date.now();return wlCache})().finally(()=>wlTask=null);
 return wlTask;
}
function wlRows121(d,kind){return (Array.isArray(d?.rows)?d.rows:[]).filter(x=>(kind==='movie'?mType(x)==='movie':mType(x)==='tv')&&mId(x)>0)}
function wlSort121(rows,mode){const a=[...rows],alpha=(x,y)=>mTitle(x).localeCompare(mTitle(y),'pt-BR',{sensitivity:'base',numeric:true});if(mode==='release_desc')return a.sort((x,y)=>mYear(y)-mYear(x)||alpha(x,y));if(mode==='release_asc')return a.sort((x,y)=>mYear(x)-mYear(y)||alpha(x,y));if(mode==='added_desc')return a.sort((x,y)=>mAdded(y)-mAdded(x)||alpha(x,y));return a.sort(alpha)}
function wlCount121(d,kind){const c=d?.counts?.[kind];return Number.isFinite(Number(c))?Number(c):wlRows121(d,kind).length}
function markStats121(){const root=q('[data-profile]');if(!root)return;for(const s of qa('.stat,button.stat',root)){const label=norm(q('small',s)?.textContent||'');const kind=label==='filmes watchlist'?'movie':label==='series watchlist'?'series':'';if(!kind)continue;s.removeAttribute('data-ct117-watchlist-stat');s.removeAttribute('data-ct118-watchlist');s.removeAttribute('data-ct119-count');s.removeAttribute('data-ct120-watchlist');s.dataset.ct121Watchlist=kind;s.classList.add('ct121-watch-stat');s.setAttribute('type','button')}}
async function syncWlCounts121(){const root=q('[data-profile]');if(!root)return;markStats121();try{const d=await full121(false);for(const kind of ['movie','series'])for(const s of qa(`[data-ct121-watchlist="${kind}"]`,root)){const b=q('b',s);if(b)b.textContent=wlCount121(d,kind).toLocaleString('pt-BR')}}catch{}}
try{
 const base=ctR180StatCard;
 ctR180StatCard=function(label,value,wide=false){const exact=String(label||''),kind=exact==='Filmes Watchlist'?'movie':exact==='Séries Watchlist'?'series':'';if(!kind)return base(label,value,wide);const shown=typeof value==='string'?value:Number(value||0).toLocaleString('pt-BR');return `<button type="button" class="stat ${wide?'ct-r180-stat-wide ':''}ct121-watch-stat" data-ct121-watchlist="${kind}"><small>${esc121(label)}</small><b>${esc121(shown)}</b><span class="ct121-chevron">›</span></button>`};
}catch{}
function closeWl121(){q('[data-ct121-watch-modal]')?.remove();q('[data-ct120-watch-modal]')?.remove();q('[data-ct119-watch-modal]')?.remove();q('[data-ct117-watch-modal]')?.remove()}
function wlStatus121(x){if(x?.is_completed)return'Concluído';if(x?.is_up_to_date)return'Em dia';if(x?.is_in_progress||n(x?.watched_episodes)>0)return'Em andamento';if(x?.is_seen)return'Assistido';return'Na Watchlist'}
function wlRow121(x){const t=mType(x),id=mId(x),p=mPoster(x),y=mYear(x),ttl=mTitle(x),dt=x?.added_at?new Date(x.added_at).toLocaleDateString('pt-BR'):'';return `<button type="button" class="ct121-watch-row" data-ct121-media="${t}:${id}">${p?`<img src="${esc121(p)}" loading="lazy" alt="">`:'<span class="ct121-poster-empty">Sem poster</span>'}<span class="ct121-watch-copy"><span class="ct121-watch-title"><b>${esc121(ttl)}</b>${y?`<small>${y}</small>`:''}</span><span class="ct121-watch-meta"><em>${esc121(wlStatus121(x))}</em>${dt?`<em>Adicionado ${esc121(dt)}</em>`:''}</span></span><span class="ct121-open">›</span></button>`}
function paintWl121(m,d,kind,mode){const rows=wlSort121(wlRows121(d,kind),mode);const body=q('[data-ct121-list]',m),cnt=q('[data-ct121-count]',m);if(cnt)cnt.textContent=rows.length.toLocaleString('pt-BR');if(body)body.innerHTML=rows.length?rows.map(wlRow121).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';m.__ct121Data=d;m.dataset.ct121Sort=mode}
async function openWl121(kind){closeWl121();const label=kind==='movie'?'Filmes na Watchlist':'Séries na Watchlist';const m=document.createElement('div');m.className='ct121-modal';m.dataset.ct121WatchModal=kind;m.innerHTML=`<div class="ct121-dialog"><header><div><small>WATCHLIST COMPLETA</small><h2>${label} · <span data-ct121-count>—</span></h2></div><button class="ct121-close" data-ct121-close>×</button></header><div class="ct121-toolbar"><select data-ct121-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct121-list" data-ct121-list><div class="loader">Sincronizando Watchlist...</div></div></div>`;document.body.appendChild(m);try{const d=await full121(true);paintWl121(m,d,kind,'alpha');void syncWlCounts121()}catch(e){q('[data-ct121-list]',m).innerHTML=`<div class="error">${esc121(e?.message||e)}</div>`}}
window.__ctV117OpenWatchlist=openWl121;window.__ctV119OpenWatchlist=openWl121;window.__ctV120OpenWatchlist=openWl121;window.__ctV121OpenWatchlist=openWl121;

/* ---------- Pra Voce: no false empty while async authorities are still resolving ---------- */
const pendingSince=new WeakMap();
function discover121(){
 const root=q('[data-page="discover"], [data-discover]');if(!root)return;
 const now=Date.now();
 for(const el of qa('div,article,section',root)){
  if(norm(el.textContent)!=='sem item elegivel')continue;
  if(!pendingSince.has(el))pendingSince.set(el,now);
  const age=now-pendingSince.get(el);
  if(age<12000){el.classList.add('ct121-pending-empty');el.textContent='Buscando recomendação…'}
 }
 for(const el of qa('.ct121-pending-empty',root)){if(norm(el.textContent)!=='buscando recomendacao')el.classList.remove('ct121-pending-empty')}
}

/* ---------- Statistics collapse: symbol authority survives legacy text rewrites ---------- */
function statsToggle121(){
 const root=q('[data-profile]');if(!root)return;
 for(const panel of qa('section,.panel,div',root)){
  const h=panel.querySelector?.('h2,h3');if(norm(h?.textContent)!=='estatisticas')continue;
  const head=h.closest?.('.panel-head')||h.parentElement;const buttons=qa('button',head||panel);if(!buttons.length)continue;
  const b=buttons[buttons.length-1];const old=norm(b.textContent),aria=b.getAttribute('aria-expanded');let expanded=b.dataset.ct121Expanded!=='0';if(old.includes('expandir'))expanded=false;else if(old.includes('recolher'))expanded=true;else if(aria==='false')expanded=false;else if(aria==='true')expanded=true;b.dataset.ct121StatsToggle='1';b.dataset.ct121Expanded=expanded?'1':'0';b.textContent=expanded?'⌃':'⌄';b.setAttribute('aria-label',expanded?'Recolher estatísticas':'Expandir estatísticas');b.title=b.getAttribute('aria-label');
  break;
 }
}

/* ---------- Sports: canonicalize direct grid children regardless of legacy class ---------- */
function actionKind121(x){const s=norm(x?.textContent||'').replace(/\s+/g,'');if(x?.hasAttribute?.('data-ct165-open-favorite')||s==='eventos'||s.includes('vereventos'))return'events';if(s.includes('marcarcomoassistido')||s.includes('marcarassistido')||s.includes('desmarcarcomoassistido')||s.includes('desmarcarassistido')||s==='assistido')return'watched';return''}
function controls121(card){return qa('button,a,[role="button"],.btn,.chip,.fav,[data-ct165-open-favorite]',card)}
function sportCard121(card){if(!card||card.dataset.ct121Busy==='1')return;card.dataset.ct121Busy='1';try{card.classList.add('ct121-event-card');const all=controls121(card);let bar=q(':scope > .ct121-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct121-actions';card.appendChild(bar)}for(const kind of ['events','watched']){const found=all.filter(x=>actionKind121(x)===kind);if(!found.length)continue;const keep=found.find(x=>x.matches?.('button,a'))||found[0];for(const x of found)if(x!==keep)x.remove();keep.className='ct121-action '+(kind==='watched'?'primary':'secondary');keep.textContent=kind==='events'?'Eventos':(norm(keep.textContent).includes('desmarcar')?'↶ Desmarcar':'✓ Assistido');if(keep.parentElement!==bar)bar.appendChild(keep)}for(const legacy of qa('.ct117-event-actions,.ct119-sport-actions,.ct120-sport-actions',card)){if(legacy!==bar){for(const c of [...legacy.children])if(actionKind121(c))c.remove();if(!legacy.children.length)legacy.remove()}}for(const chip of qa('.fav-actions button,.fav-actions a,.fav',card)){if(!bar.contains(chip))chip.classList.add('ct121-chip')}if(!bar.children.length)bar.remove()}finally{delete card.dataset.ct121Busy}}
function sports121(){const root=q('[data-sports]');if(!root)return;for(const grid of qa('.event-grid',root)){grid.classList.add('ct121-grid');for(const card of [...grid.children])sportCard121(card)}root.dataset.ct121Sports='stable'}

/* ---------- events + synchronization ---------- */
document.addEventListener('click',e=>{const s=e.target.closest?.('[data-ct121-watchlist]');if(s){e.preventDefault();e.stopImmediatePropagation();void openWl121(s.dataset.ct121Watchlist);return}if(e.target.closest?.('[data-ct121-close]')){e.preventDefault();e.stopImmediatePropagation();closeWl121();return}const row=e.target.closest?.('[data-ct121-media]');if(row){e.preventDefault();e.stopImmediatePropagation();const [t,id]=String(row.dataset.ct121Media).split(':');closeWl121();if(Number(id)>0){try{go(`/${t==='movie'?'movie':'series'}/${Number(id)}`)}catch{location.href=`/${t==='movie'?'movie':'series'}/${Number(id)}`}}return}const tg=e.target.closest?.('[data-ct121-stats-toggle]');if(tg){setTimeout(statsToggle121,0)}},true);
document.addEventListener('change',e=>{const s=e.target.closest?.('[data-ct121-sort]');if(!s)return;const m=s.closest('[data-ct121-watch-modal]');if(m?.__ct121Data)paintWl121(m,m.__ct121Data,m.dataset.ct121WatchModal,s.value)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&q('[data-ct121-watch-modal]'))closeWl121()},true);
let timer=0;function sync121(){clearTimeout(timer);timer=setTimeout(()=>{void syncWlCounts121();discover121();statsToggle121();sports121()},45)}
try{new MutationObserver(sync121).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
setInterval(()=>{if(q('[data-page="discover"], [data-discover], [data-sports], [data-profile]'))sync121()},1000);

const st=document.createElement('style');st.id='ct-v121-ui';st.textContent=`
.ct121-pending-empty{display:grid!important;place-items:center!important;min-height:180px!important;border:1px dashed #28556a!important;border-radius:14px!important;color:#91a9b4!important;font-size:12px!important}
.ct121-watch-stat{position:relative!important;cursor:pointer!important;padding-right:34px!important}.ct121-chevron{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:22px;opacity:.75}
.ct121-modal{position:fixed;inset:0;z-index:10120;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:14px}.ct121-dialog{width:min(920px,97vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;background:#07131a;border:1px solid #285061;border-radius:18px}.ct121-dialog header{display:flex;justify-content:space-between;align-items:center;padding:15px 16px 11px;border-bottom:1px solid #183642}.ct121-dialog h2{margin:3px 0 0;font-size:20px}.ct121-dialog header small{font-size:10px;letter-spacing:.12em;opacity:.65}.ct121-close{width:34px;height:34px;border-radius:50%;border:1px solid #31596b;background:#0b1e27;color:inherit;font-size:20px}.ct121-toolbar{display:flex;justify-content:flex-end;padding:9px 12px;border-bottom:1px solid #17343f}.ct121-toolbar select{height:34px;border:1px solid #31596b;border-radius:9px;background:#0b1e27;color:inherit;padding:0 10px}.ct121-list{overflow:auto;padding:11px;display:grid;gap:8px}.ct121-watch-row{appearance:none;width:100%;display:grid;grid-template-columns:58px minmax(0,1fr) 20px;gap:11px;align-items:center;padding:7px 9px;border:1px solid #193946;border-radius:12px;background:#0a1921;color:inherit;text-align:left;cursor:pointer}.ct121-watch-row img,.ct121-poster-empty{width:58px;height:86px;object-fit:cover;border-radius:8px;background:#102630;display:grid;place-items:center;font-size:9px}.ct121-watch-copy{min-width:0}.ct121-watch-title{display:flex;justify-content:space-between;gap:8px}.ct121-watch-title b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct121-watch-title small{opacity:.65}.ct121-watch-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.ct121-watch-meta em{font-style:normal;font-size:9px;padding:3px 6px;border:1px solid #284f61;border-radius:999px;opacity:.8}.ct121-open{font-size:20px;opacity:.7}
[data-ct121-stats-toggle]{width:34px!important;min-width:34px!important;height:34px!important;min-height:34px!important;padding:0!important;border-radius:50%!important;display:grid!important;place-items:center!important;font-size:17px!important;line-height:1!important}
.ct121-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(285px,1fr))!important;gap:12px!important;overflow:visible!important;align-items:stretch!important}.ct121-grid>*{min-width:0!important;width:100%!important;max-width:none!important}.ct121-event-card{display:flex!important;flex-direction:column!important;min-width:0!important}.ct121-event-card .fav-actions{display:flex!important;flex-wrap:wrap!important;gap:6px!important}.ct121-chip{min-height:30px!important;height:30px!important;padding:0 9px!important;border-radius:999px!important;font-size:10px!important;white-space:nowrap!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct121-actions{margin-top:auto!important;padding-top:10px!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;width:100%!important}.ct121-action{appearance:none!important;width:100%!important;min-width:0!important;height:36px!important;padding:0 10px!important;border-radius:10px!important;border:1px solid #35677a!important;background:#0b202a!important;color:inherit!important;font-size:11px!important;display:grid!important;place-items:center!important}.ct121-action.primary{background:#123242!important;border-color:#43809a!important}.ct121-event-card>.ct117-event-actions,.ct121-event-card>.ct119-sport-actions,.ct121-event-card>.ct120-sport-actions{display:none!important}
@media(max-width:900px){.ct121-grid{grid-template-columns:1fr!important}.ct121-dialog{width:100%;max-height:94vh}.ct121-watch-row{grid-template-columns:48px minmax(0,1fr) 18px}.ct121-watch-row img,.ct121-poster-empty{width:48px;height:72px}}
`;
document.getElementById(st.id)?.remove();document.head.appendChild(st);
sync121();
window.__ctV121FullWatchlist=full121;window.__ctV121Sync=sync121;
})();

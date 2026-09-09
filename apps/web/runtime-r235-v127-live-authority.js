/* CineTracker Web 1.0.27 r235 — one live DOM authority for the regressions reported in production. */
(()=>{
'use strict';
if(window.__ctR235V127)return;
window.__ctR235V127='single-live-dom-authority';
window.__ctV127Home='aired-unwatched-never-up-to-date';
window.__ctV127Discover='stable-content-no-legends-uniform-cards-top10-safe';
window.__ctV127Sports='single-action-zone-live-reconcile+provider-dedupe';
window.__ctV127Watchlist='rpc-full-universe-count-modal-identical';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const num=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today127=()=>{try{return localDay()}catch{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}};
const mediaType127=x=>String(x?.media_type||x?.type||'').toLowerCase()==='movie'?'movie':'tv';
const mediaId127=x=>{for(const v of [x?.tmdb_id,x?.source_tmdb_id,x?.raw_tmdb?.source_tmdb_id,x?.raw_tmdb?.id,x?.id]){const id=num(v);if(id>0)return id}return 0};
const mediaTitle127=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título').trim()||'Sem título';
const mediaYear127=x=>num(x?.release_year)||num(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4));
const mediaPoster127=x=>{let p=x?.poster_path||x?.raw_tmdb?.poster_path||'';if(!p)return'';if(/^https?:/i.test(p))return p;try{return img(p,'w185')}catch{return`https://image.tmdb.org/t/p/w185${String(p).startsWith('/')?'':'/'}${p}`}};

/* ---------------- Home: an aired unwatched episode can never remain in Em dia. ---------------- */
const homeDetails127=new Map();
let homeTask127=null,homePaintQueued127=false;
function pos127(row,prefix){
 if(prefix==='last')return [num(row?.last_season_number),num(row?.last_episode_number)];
 return [num(row?.latest_released_season_number||row?.latest_episode_meta_season_number),num(row?.latest_released_episode_number||row?.latest_episode_meta_episode_number)];
}
function newer127(latest,last){return latest[0]>0&&latest[1]>0&&(last[0]<=0||latest[0]>last[0]||(latest[0]===last[0]&&latest[1]>last[1]))}
function fixKnownHome127(){
 const rows=Array.isArray(homeCache?.series)?homeCache.series:[];let changed=false;
 for(const row of rows){
  if(num(row?.watched_episodes)<=0)continue;
  const latest=pos127(row,'latest'),last=pos127(row,'last');
  const released=num(row?.released_episodes),watched=num(row?.watched_episodes);
  const behind=newer127(latest,last)||(released>0&&watched<released);
  if(!behind)continue;
  if(row.is_caught_up!==false){row.is_caught_up=false;changed=true}
  if(row.home_bucket==='up_to_date'){row.home_bucket='continue';changed=true}
  const missing=Math.max(1,released-watched,latest[0]&&last[0]===latest[0]?latest[1]-last[1]:0);
  if(num(row.history_missing_episodes)!==missing){row.history_missing_episodes=missing;changed=true}
 }
 return changed;
}
function releasedCount127(detail,latest){
 if(!(num(latest?.season_number)>0&&num(latest?.episode_number)>0))return 0;
 let total=0;
 for(const s of detail?.seasons||[]){const sn=num(s?.season_number),ep=num(s?.episode_count);if(sn<=0)continue;if(sn<num(latest.season_number))total+=Math.max(0,ep);else if(sn===num(latest.season_number))total+=Math.max(0,Math.min(ep||num(latest.episode_number),num(latest.episode_number)))}
 return total;
}
async function detail127(id){const k=`${today127()}:${id}`;if(homeDetails127.has(k))return homeDetails127.get(k);const task=Promise.resolve().then(()=>safeTmdb(`/tv/${id}`,{})).catch(()=>null);homeDetails127.set(k,task);return task}
function applyDetail127(row,d){
 const latest=d?.last_episode_to_air,air=String(latest?.air_date||'').slice(0,10);if(!(num(latest?.season_number)>0&&num(latest?.episode_number)>0)||!air||air>today127())return false;
 let changed=false;const set=(k,v)=>{if(String(row[k]??'')!==String(v??'')){row[k]=v;changed=true}};
 set('latest_released_season_number',num(latest.season_number));set('latest_released_episode_number',num(latest.episode_number));set('latest_episode_meta_season_number',num(latest.season_number));set('latest_episode_meta_episode_number',num(latest.episode_number));set('latest_episode_air_date',air);set('latest_episode_name',String(latest.name||''));
 const released=releasedCount127(d,latest);if(released>0)set('released_episodes',released);if(num(d?.number_of_episodes)>0)set('total_episodes',num(d.number_of_episodes));
 const behind=newer127([num(latest.season_number),num(latest.episode_number)],pos127(row,'last'))||(released>0&&num(row.watched_episodes)<released);
 if(behind){if(row.is_caught_up!==false){row.is_caught_up=false;changed=true}if(row.home_bucket==='up_to_date'){row.home_bucket='continue';changed=true}const missing=Math.max(1,(released||num(row.released_episodes))-num(row.watched_episodes));if(num(row.history_missing_episodes)!==missing){row.history_missing_episodes=missing;changed=true}}
 else if(num(row.watched_episodes)>0){if(row.is_caught_up!==true){row.is_caught_up=true;changed=true}}
 return changed;
}
function repaintHome127(){if(homePaintQueued127)return;homePaintQueued127=true;requestAnimationFrame(()=>{homePaintQueued127=false;if(!String(location.pathname||'').startsWith('/home'))return;try{basePaintHome127()}catch{}})}
async function refreshHome127(){
 if(homeTask127)return homeTask127;const rows=(Array.isArray(homeCache?.series)?homeCache.series:[]).filter(x=>mediaId127(x)>0&&num(x?.watched_episodes)>0);if(!rows.length)return false;
 homeTask127=(async()=>{let i=0,changed=false;const worker=async()=>{while(i<rows.length){const row=rows[i++];try{if(applyDetail127(row,await detail127(mediaId127(row)))){changed=true;repaintHome127()}}catch{}}};await Promise.all(Array.from({length:Math.min(6,rows.length)},worker));return changed})().finally(()=>{homeTask127=null});return homeTask127;
}
let basePaintHome127=()=>{};
try{basePaintHome127=paintHome;paintHome=function(...args){fixKnownHome127();const out=basePaintHome127.apply(this,args);requestAnimationFrame(()=>void refreshHome127());return out}}catch{}
try{ct172HydrateHomeEpisodes=async function(){return false}}catch{}

/* ---------------- Discover: remove helper legends, keep content during tab loads, normalize after DOM exists. ---------------- */
function legend127(text){const t=norm(text);if(!t||t.length>420)return false;return t.includes('regra ativa')||t.includes('respeita historico progresso e watchlist')||t.includes('priorizada pelo seu gosto')||t.includes('prioridade pelo seu gosto')||t.includes('baseado nos seus vistos e favoritos')||t.includes('sem doramas somente nao assistidos')||(t.includes('somente nao assistidos')&&t.includes('filme')&&t.includes('serie'))}
function stripLegends127(root){for(const el of qa('small,p,span,div',root)){if(el.querySelector?.('article,button,img,picture,input,select'))continue;const t=String(el.textContent||'').trim();if(legend127(t))el.remove()}}
function isTop10127(root){const active=qa('button.active,[aria-selected="true"]',root).find(x=>/top\s*10/i.test(String(x.textContent||''))||/top.?10/i.test(String(x.dataset?.discoverTab||x.dataset?.tab||'')));return Boolean(active)}
function discoverCards127(root){return qa('article',root).filter(c=>c.querySelector('img,picture,.poster,[style*="background-image"]')&&!c.closest('.ct171-top-row,.top10,[data-top10]'))}
function normalizeDiscover127(){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return;stripLegends127(root);if(isTop10127(root)){root.dataset.ct127Discover='top10-preserved';return}
 try{window.__ctV124Discover?.()}catch{}
 const content=q('[data-discover-content]',root)||root;const cards=discoverCards127(content);
 for(const card of cards)card.classList.add('ct127-discover-card');
 for(const row of qa('.row,.media-row-grid,.recommendation-row',content))if(row.querySelector('.ct127-discover-card'))row.classList.add('ct127-discover-row');
 if(cards.length)for(const p of qa('.ct121-pending-empty',content))p.remove();
 root.dataset.ct127Discover='stable';
}
let discoverEpoch127=0;
try{
 const base=renderDiscover;
 renderDiscover=async function(...args){
  const epoch=++discoverEpoch127,old=q('[data-discover-content]');const oldHtml=old?.innerHTML||'';const hadUsable=Boolean(oldHtml&&!old?.querySelector?.('.loader'));
  const promise=base.apply(this,args);const fresh=q('[data-discover-content]');
  if(hadUsable&&fresh&&fresh.querySelector('.loader')){fresh.innerHTML=oldHtml;fresh.classList.add('ct127-discover-pending');fresh.setAttribute('aria-busy','true')}
  const out=await promise;
  if(epoch===discoverEpoch127){const now=q('[data-discover-content]');if(now){now.classList.remove('ct127-discover-pending');now.removeAttribute('aria-busy');if(!String(now.textContent||'').trim()&&!now.children.length&&hadUsable)now.innerHTML=oldHtml}normalizeDiscover127()}
  return out;
 };
}catch{}
try{const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);requestAnimationFrame(normalizeDiscover127);return out}}catch{}

/* ---------------- Sports: one canonical action bar + provider duplicate reconciliation. ---------------- */
function sportKey127(e){const a=norm(e?.home_name||''),b=norm(e?.away_name||''),title=norm(e?.title||''),day=String(e?.starts_at||'').slice(0,10);return `${e?.sport_slug||''}|${day}|${a||title}|${b}`}
function providerRank127(p){p=String(p||'');return p.startsWith('api-sports')?3:p.startsWith('espn')?2:p==='thesportsdb'?1:0}
function dedupeEvents127(rows){
 const out=[],by=new Map();for(const e of rows||[]){const k=sportKey127(e);if(!k||k.includes('||')){out.push(e);continue}const old=by.get(k);if(!old){by.set(k,e);out.push(e);continue}const better=providerRank127(e.provider)>providerRank127(old.provider)?e:old,worse=better===e?old:e;Object.assign(better,{home_score:better.home_score??worse.home_score,away_score:better.away_score??worse.away_score,competition_logo:better.competition_logo||worse.competition_logo,home_logo:better.home_logo||worse.home_logo,away_logo:better.away_logo||worse.away_logo,status:better.status==='unknown'?worse.status:better.status});if(better!==old){const idx=out.indexOf(old);if(idx>=0)out[idx]=better;by.set(k,better)}}return out;
}
try{const base=sportsFiltered;sportsFiltered=function(p){return dedupeEvents127(base(p))}}catch{}
function actionKind127(el){const t=norm(el?.textContent||'').replace(/\s+/g,'');if(el?.hasAttribute?.('data-ct165-open-favorite')||t==='eventos'||t.includes('vereventos'))return'events';if(t.includes('desmarcar')&&t.includes('assist'))return'off';if(t.includes('assistido')||t.includes('marcarassist'))return'on';return''}
function normalizeSports127(){
 const root=q('[data-sports]');if(!root)return;try{window.__ctV123SportsNow?.()}catch{}
 for(const card of qa('.event-grid > *',root)){
  if(!card.querySelector('button,a,[role="button"]'))continue;card.classList.add('ct127-sports-card');
  let bar=q(':scope > .ct123-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct123-actions';card.appendChild(bar)}bar.classList.add('ct127-sports-actions');
  const all=qa('button,a,[role="button"]',card),groups={events:[],watch:[]};for(const el of all){const k=actionKind127(el);if(k==='events')groups.events.push(el);else if(k==='on'||k==='off')groups.watch.push(el)}
  const pick=list=>list.find(x=>bar.contains(x))||list.find(x=>x.tagName==='BUTTON'||x.tagName==='A')||list[0];const ev=pick(groups.events),wt=pick(groups.watch);
  for(const x of groups.events)if(x!==ev)x.remove();for(const x of groups.watch)if(x!==wt)x.remove();
  if(ev){ev.className='ct123-action ct127-sport-action secondary';ev.textContent='Ver eventos';if(ev.parentElement!==bar)bar.appendChild(ev)}
  if(wt){const off=actionKind127(wt)==='off'||/^↶/.test(String(wt.textContent||''));wt.className='ct123-action ct127-sport-action primary';wt.textContent=off?'↶ Desmarcar assistido':'✓ Marcar como assistido';if(wt.parentElement!==bar)bar.appendChild(wt)}
  for(const x of [...bar.children])if(x!==ev&&x!==wt)x.remove();if(!bar.children.length)bar.remove();
 }
 root.dataset.ct127Sports='canonical';
}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);requestAnimationFrame(normalizeSports127);return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);normalizeSports127();return out}}catch{}
try{const base=syncSports;syncSports=async function(...args){const out=await base.apply(this,args);normalizeSports127();return out}}catch{}

/* ---------------- Watchlist: RPC rows are the exact universe for both counters and modal. ---------------- */
let wlData127=null,wlAt127=0,wlTask127=null;
function jwtExpired127(e){return /jwt\s*expired|token\s*expired|expired\s*jwt|invalid\s*jwt/i.test(String(e?.message||e||''))}
async function rpcWatch127(){try{return await rpc('cinetracker_watchlist_full_v119',{})}catch(e){if(!jwtExpired127(e))throw e;try{await restoreSession()}catch{};return rpc('cinetracker_watchlist_full_v119',{})}}
async function fullWatch127(force=false){if(!force&&wlData127&&Date.now()-wlAt127<45000)return wlData127;if(wlTask127)return wlTask127;wlTask127=rpcWatch127().then(d=>{wlData127=d||{rows:[]};wlAt127=Date.now();return wlData127}).finally(()=>{wlTask127=null});return wlTask127}
function rowsWatch127(d,kind){const rows=Array.isArray(d?.rows)?d.rows:[];return rows.filter(x=>kind==='movie'?mediaType127(x)==='movie':mediaType127(x)==='tv')}
function markStats127(){const root=q('[data-profile]');if(!root)return;for(const el of qa('.stat,button.stat',root)){const label=norm(q('small',el)?.textContent||'');const kind=label==='filmes watchlist'?'movie':label==='series watchlist'?'series':'';if(!kind)continue;for(const a of [...el.attributes].map(a=>a.name))if(/^data-ct\d+-(watchlist|count)/.test(a)||a==='data-ct117-watchlist-stat')el.removeAttribute(a);el.dataset.ct127Watchlist=kind;el.setAttribute('type','button')}}
async function syncWatch127(force=false){const root=q('[data-profile]');if(!root)return null;markStats127();let d;try{d=await fullWatch127(force)}catch{return null}for(const el of qa('[data-ct127-watchlist]',root)){const b=q('b',el);if(b)b.textContent=rowsWatch127(d,el.dataset.ct127Watchlist).length.toLocaleString('pt-BR')}return d}
function closeWatch127(){q('[data-ct127-watch-modal]')?.remove()}
const added127=x=>Date.parse(x?.added_at||x?.created_at||x?.updated_at||0)||0;
function sortWatch127(list,mode){const a=[...list],az=(x,y)=>mediaTitle127(x).localeCompare(mediaTitle127(y),'pt-BR',{numeric:true,sensitivity:'base'});if(mode==='release_desc')return a.sort((x,y)=>mediaYear127(y)-mediaYear127(x)||az(x,y));if(mode==='release_asc')return a.sort((x,y)=>mediaYear127(x)-mediaYear127(y)||az(x,y));if(mode==='added_desc')return a.sort((x,y)=>added127(y)-added127(x)||az(x,y));return a.sort(az)}
function rowWatch127(x){const kind=mediaType127(x),id=mediaId127(x),poster=mediaPoster127(x),title=mediaTitle127(x),year=mediaYear127(x),date=x?.added_at?new Date(x.added_at).toLocaleDateString('pt-BR'):'';const pic=poster?`<img src="${html(poster)}" loading="lazy" alt="">`:'<span class="ct127-poster-empty">◫</span>';const inner=`${pic}<span class="ct127-watch-copy"><b>${html(title)}</b><small>${html([year||'',date?`Adicionado ${date}`:''].filter(Boolean).join(' · '))}</small></span><span class="ct127-watch-open">${id>0?'›':'•'}</span>`;return id>0?`<button type="button" class="ct127-watch-row" data-ct127-media="${kind}:${id}">${inner}</button>`:`<div class="ct127-watch-row ct127-watch-local">${inner}</div>`}
function paintWatch127(m,kind,mode){const rows=sortWatch127(rowsWatch127(m.__ct127Data,kind),mode),cnt=q('[data-ct127-count]',m),body=q('[data-ct127-list]',m);if(cnt)cnt.textContent=rows.length.toLocaleString('pt-BR');if(body)body.innerHTML=rows.length?rows.map(rowWatch127).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';m.dataset.ct127Sort=mode}
async function openWatch127(kind){closeWatch127();const m=document.createElement('div');m.className='ct127-watch-modal';m.dataset.ct127WatchModal=kind;m.innerHTML=`<div class="ct127-watch-dialog"><header><div><small>WATCHLIST COMPLETA</small><h2>${kind==='movie'?'Filmes':'Séries'} na Watchlist · <span data-ct127-count>—</span></h2></div><button type="button" data-ct127-close>×</button></header><div class="ct127-watch-toolbar"><select data-ct127-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct127-watch-list" data-ct127-list><div class="loader">Sincronizando Watchlist...</div></div></div>`;document.body.appendChild(m);try{m.__ct127Data=await fullWatch127(true);paintWatch127(m,kind,'alpha');void syncWatch127(false)}catch(e){q('[data-ct127-list]',m).innerHTML=`<div class="error">${html(e?.message||e)}</div>`}return m}
try{const base=renderProfile;renderProfile=async function(...args){const out=await base.apply(this,args);markStats127();void syncWatch127(false);return out}}catch{}
document.addEventListener('click',e=>{const s=e.target.closest?.('[data-ct127-watchlist]');if(s){e.preventDefault();e.stopImmediatePropagation();void openWatch127(s.dataset.ct127Watchlist);return}if(e.target.closest?.('[data-ct127-close]')){e.preventDefault();e.stopImmediatePropagation();closeWatch127();return}const r=e.target.closest?.('[data-ct127-media]');if(r){e.preventDefault();e.stopImmediatePropagation();const[k,id]=String(r.dataset.ct127Media||'').split(':');closeWatch127();if(num(id)>0){try{go(`/${k==='movie'?'movie':'series'}/${num(id)}`)}catch{location.href=`/${k==='movie'?'movie':'series'}/${num(id)}`}}}},true);
document.addEventListener('change',e=>{const s=e.target.closest?.('[data-ct127-sort]');if(!s)return;const m=s.closest('[data-ct127-watch-modal]');if(m?.__ct127Data)paintWatch127(m,m.dataset.ct127WatchModal,s.value)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeWatch127()},true);

/* ---------------- One observer. This is the piece r234 was missing in production. ---------------- */
let reconcileQueued127=false,reconciling127=false;
function reconcile127(){if(reconciling127)return;reconciling127=true;try{if(q('[data-page="discover"],[data-discover]'))normalizeDiscover127();if(q('[data-sports]'))normalizeSports127();if(q('[data-profile]')){markStats127();void syncWatch127(false)}if(q('[data-home]'))fixKnownHome127()}finally{reconciling127=false}}
function queue127(){if(reconcileQueued127)return;reconcileQueued127=true;setTimeout(()=>{reconcileQueued127=false;reconcile127()},0)}
try{new MutationObserver(queue127).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
window.addEventListener('popstate',queue127);
window.addEventListener('cinetracker:data-changed',()=>{wlData127=null;wlAt127=0;homeDetails127.clear();queue127();if(q('[data-home]'))requestAnimationFrame(()=>void refreshHome127())});
queue127();

const st=document.createElement('style');st.id='ct-v127-live-authority';st.textContent=`
[data-page="discover"] .ct127-discover-row,[data-discover] .ct127-discover-row{align-items:stretch!important;gap:14px!important}
[data-page="discover"] .ct127-discover-card,[data-discover] .ct127-discover-card{box-sizing:border-box!important;width:200px!important;min-width:200px!important;max-width:200px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
[data-page="discover"] .ct127-discover-card .poster,[data-discover] .ct127-discover-card .poster,[data-page="discover"] .ct127-discover-card>img,[data-discover] .ct127-discover-card>img,[data-page="discover"] .ct127-discover-card picture,[data-discover] .ct127-discover-card picture{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important;flex:0 0 auto!important}
[data-page="discover"] .ct127-discover-card .card-body,[data-discover] .ct127-discover-card .card-body{min-width:0!important;overflow:hidden!important}
[data-page="discover"] .ct127-discover-card b,[data-discover] .ct127-discover-card b,[data-page="discover"] .ct127-discover-card small,[data-discover] .ct127-discover-card small{overflow-wrap:anywhere}
.ct127-discover-pending{opacity:.82!important;pointer-events:none!important}
.ct127-sports-card{display:flex!important;flex-direction:column!important;min-width:0!important}.ct127-sports-actions{margin-top:auto!important;padding-top:10px!important;width:100%!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.ct127-sport-action{box-sizing:border-box!important;width:100%!important;min-width:0!important;height:40px!important;min-height:40px!important;padding:0 8px!important;display:flex!important;align-items:center!important;justify-content:center!important;white-space:normal!important;text-align:center!important;font-size:11px!important;line-height:1.15!important}
.ct127-watch-modal{position:fixed;inset:0;z-index:99999;background:#02070bd9;display:grid;place-items:center;padding:18px}.ct127-watch-dialog{width:min(920px,96vw);max-height:90vh;background:#0b1419;border:1px solid #24414d;border-radius:16px;display:flex;flex-direction:column;overflow:hidden}.ct127-watch-dialog>header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border-bottom:1px solid #203640}.ct127-watch-dialog>header h2{margin:2px 0 0}.ct127-watch-dialog>header button{width:38px;height:38px;border-radius:10px}.ct127-watch-toolbar{padding:10px 18px;border-bottom:1px solid #203640}.ct127-watch-list{overflow:auto;min-height:220px;overscroll-behavior:contain}.ct127-watch-row{width:100%;box-sizing:border-box;display:grid;grid-template-columns:52px minmax(0,1fr) 22px;align-items:center;gap:12px;min-height:82px;padding:8px 16px;border:0;border-bottom:1px solid #16282f;background:transparent;color:inherit;text-align:left}.ct127-watch-row>img,.ct127-poster-empty{width:52px;height:78px;border-radius:8px;object-fit:cover;display:grid;place-items:center;background:#142229}.ct127-watch-copy{min-width:0;display:flex;flex-direction:column;gap:5px}.ct127-watch-copy b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct127-watch-copy small{opacity:.72}.ct127-watch-local{cursor:default}.ct127-watch-open{text-align:center;font-size:20px}
@media(max-width:700px){[data-page="discover"] .ct127-discover-card,[data-discover] .ct127-discover-card{width:170px!important;min-width:170px!important;max-width:170px!important}.ct127-sports-actions{grid-template-columns:1fr 1fr!important}.ct127-watch-modal{padding:8px}.ct127-watch-dialog{width:100%;max-height:94vh}}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);

window.__ctV127Reconcile=reconcile127;
window.__ctV127NormalizeDiscover=normalizeDiscover127;
window.__ctV127NormalizeSports=normalizeSports127;
window.__ctV127FixKnownHome=fixKnownHome127;
window.__ctV127RefreshHome=refreshHome127;
window.__ctV127FullWatchlist=fullWatch127;
window.__ctV127WatchRows=rowsWatch127;
window.__ctV127SyncWatchlist=syncWatch127;
window.__ctV127OpenWatchlist=openWatch127;
})();
/* CineTracker 1.0.19 — authoritative Watchlist counts/sorting/details + organized Web Sports controls. */
(()=>{
'use strict';
if(window.__ctR225V119)return;
window.__ctR225V119='watchlist-authoritative-sort-details-sports-controls';
window.__ctV119Watchlist='full-rpc-counts-sort-detail-open';
window.__ctV119Sports='three-column-single-actionbar-no-duplicates';
window.__ctV119Buttons='minimal-consistent-controls';

const q119=(s,r=document)=>r?.querySelector?.(s)||null;
const qa119=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n119=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm119=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc119=v=>{try{return esc(v)}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
const isAndroid119=()=>Boolean(window.__ctAndroidOfficialVersion||window.__ctAndroidRelease||document.querySelector('meta[name="ct-android-version"]'));
const type119=x=>String(x?.media_type||'')==='movie'?'movie':'tv';
const id119=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const poster119=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const year119=x=>n119(x?.release_year)||n119(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||0;
const title119=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
function posterUrl119(x){const p=poster119(x);if(!p)return'';if(/^https?:\/\//i.test(p))return p;try{return img(p,'w342')}catch{return `https://image.tmdb.org/t/p/w342${String(p).startsWith('/')?'':'/'}${p}`}}
function added119(x){const t=Date.parse(x?.added_at||x?.created_at||0);return Number.isFinite(t)?t:0}
function fmtDate119(v){const t=Date.parse(v||0);if(!Number.isFinite(t))return'';try{return new Date(t).toLocaleDateString('pt-BR')}catch{return''}}

/* ---------- Watchlist: uma única fonte para contagem e lista ---------- */
let full119=null,fullAt119=0,fullTask119=null;
async function loadFull119(force=false){
 if(!force&&full119&&Date.now()-fullAt119<60000)return full119;
 if(fullTask119)return fullTask119;
 fullTask119=Promise.resolve().then(()=>rpc('cinetracker_watchlist_full_v119',{})).then(d=>{full119=d||{rows:[],counts:{movie:0,series:0}};fullAt119=Date.now();return full119}).finally(()=>fullTask119=null);
 return fullTask119;
}
function rows119(d,kind){const a=Array.isArray(d?.rows)?d.rows:[];return a.filter(x=>kind==='movie'?type119(x)==='movie':type119(x)==='tv').filter(x=>id119(x)>0)}
function sort119(rows,mode){const out=[...rows];const alpha=(a,b)=>title119(a).localeCompare(title119(b),'pt-BR',{sensitivity:'base',numeric:true});if(mode==='release_desc')return out.sort((a,b)=>year119(b)-year119(a)||alpha(a,b));if(mode==='release_asc')return out.sort((a,b)=>year119(a)-year119(b)||alpha(a,b));if(mode==='added_desc')return out.sort((a,b)=>added119(b)-added119(a)||alpha(a,b));return out.sort(alpha)}
function exactCount119(d,kind){const c=n119(d?.counts?.[kind]);if(c||d?.counts?.[kind]===0)return c;return rows119(d,kind).length}
function syncStatCounts119(d){for(const kind of ['movie','series']){const value=exactCount119(d,kind).toLocaleString('pt-BR');for(const stat of qa119(`[data-ct118-watchlist="${kind}"],[data-ct117-watchlist-stat="${kind}"]`)){const b=q119('b',stat);if(b&&b.textContent!==value)b.textContent=value;stat.dataset.ct119Count=String(exactCount119(d,kind))}}}
async function syncCounts119(){if(!q119('[data-profile]'))return;try{syncStatCounts119(await loadFull119(false))}catch{}}
function statusMap119(){const m=new Map();let dash=[];try{dash=Array.isArray(profileCache?.dashboard)?profileCache.dashboard:[]}catch{}for(const x of dash){const id=id119(x);if(!(id>0))continue;let s='Não iniciado';if(x?.is_completed)s='Concluído';else if(x?.is_up_to_date)s='Em dia';else if(x?.is_in_progress||n119(x?.watched_episodes)>0)s='Em andamento';else if(x?.is_seen)s='Assistido';m.set(`${type119(x)}:${id}`,s)}return m}
function rowHtml119(x,status){const t=type119(x),id=id119(x),title=title119(x),poster=posterUrl119(x),year=year119(x),added=fmtDate119(x?.added_at),st=status.get(`${t}:${id}`)||'Na Watchlist';return `<button type="button" class="ct119-watch-row" data-ct119-watch-media="${t}:${id}" data-media="${t}:${id}" aria-label="Abrir ${esc119(title)}">${poster?`<img loading="lazy" src="${esc119(poster)}" alt="">`:'<span class="ct119-watch-poster-empty">Sem poster</span>'}<span class="ct119-watch-copy"><span class="ct119-watch-title"><b>${esc119(title)}</b>${year?`<small>${year}</small>`:''}</span><span class="ct119-watch-meta"><em>${esc119(st)}</em>${added?`<em>Adicionado ${esc119(added)}</em>`:''}</span></span><span class="ct119-watch-open" aria-hidden="true">›</span></button>`}
function closeModal119(){q119('[data-ct119-watch-modal]')?.remove();q119('[data-ct117-watch-modal]')?.remove()}
function paintList119(m,d,kind,mode){const body=q119('[data-ct119-list]',m),count=q119('[data-ct119-count]',m);if(!body)return;const rows=sort119(rows119(d,kind),mode),status=statusMap119();if(count)count.textContent=rows.length.toLocaleString('pt-BR');body.innerHTML=rows.length?rows.map(x=>rowHtml119(x,status)).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';m.dataset.ct119Count=String(rows.length);m.dataset.ct119Sort=mode;syncStatCounts119(d)}
async function openModal119(kind){
 closeModal119();const label=kind==='movie'?'Filmes na Watchlist':'Séries na Watchlist',m=document.createElement('div');m.className='ct119-watch-modal';m.dataset.ct119WatchModal=kind;m.innerHTML=`<div class="ct119-watch-dialog" role="dialog" aria-modal="true" aria-label="${esc119(label)}"><header class="ct119-watch-head"><div><small>WATCHLIST COMPLETA</small><h2>${esc119(label)} · <span data-ct119-count>—</span></h2></div><button type="button" class="ct119-icon-btn" data-ct119-close aria-label="Fechar">×</button></header><div class="ct119-watch-toolbar"><label>Ordenar<select data-ct119-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></label></div><div class="ct119-watch-list" data-ct119-list><div class="loader">Carregando Watchlist...</div></div></div>`;document.body.appendChild(m);
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest?.('[data-ct119-close]')){closeModal119();return}if(e.target.closest?.('[data-ct119-watch-media]'))setTimeout(closeModal119,0)});
 m.addEventListener('change',e=>{if(!e.target.matches?.('[data-ct119-sort]'))return;const d=m.__ct119Data;if(d)paintList119(m,d,kind,e.target.value)});
 try{const d=await loadFull119(false);m.__ct119Data=d;paintList119(m,d,kind,'alpha')}catch(e){const body=q119('[data-ct119-list]',m);if(body)body.innerHTML=`<div class="error">Não foi possível carregar a Watchlist: ${esc119(e?.message||e)}</div>`}
}
window.__ctV117OpenWatchlist=openModal119;
window.__ctV119OpenWatchlist=openModal119;
window.__ctV119LoadFullWatchlist=loadFull119;
window.__ctV119SortWatchlist=sort119;
try{const baseAdd119=addWatchlist;addWatchlist=async function(...args){const out=await baseAdd119.apply(this,args);full119=null;fullAt119=0;return out}}catch{}

/* ---------- Web Sports: cards legíveis, controles únicos e hierarquia fixa ---------- */
function actionKind119(el){const n=norm119(el?.textContent||''),c=n.replace(/\s+/g,'');if(el?.hasAttribute?.('data-ct165-open-favorite')||n.includes('ver eventos')||n==='eventos')return'events';if(c.includes('marcarcomoassistido')||c.includes('marcarassistido')||c.includes('desmarcarcomoassistido')||c.includes('desmarcarassistido'))return'watched';return''}
function candidateControls119(card){return qa119('button,a,[role="button"],.chip,.btn,.fav',card).filter(x=>x!==card)}
function best119(nodes,kind){return [...nodes].sort((a,b)=>{const score=x=>(x.matches?.('button,a')?30:0)+(kind==='events'&&x.hasAttribute?.('data-ct165-open-favorite')?20:0)+(x.classList?.contains('btn')?8:0)+String(x.textContent||'').length;return score(b)-score(a)})[0]||null}
function normalizeAction119(el,kind){if(!el)return null;el.classList.remove('chip','fav','ct117-event-meta-control','ct117-event-action','ct117-event-action-primary','ct117-event-action-secondary');el.classList.add('ct119-sport-action',kind==='watched'?'primary':'secondary');const old=norm119(el.textContent);if(kind==='events')el.textContent='Eventos';else el.textContent=old.includes('desmarcar')?'↶ Desmarcar':'✓ Marcar';return el}
function organizeEvent119(card){
 if(!card||isAndroid119())return;card.classList.add('ct119-event-card');
 const controls=candidateControls119(card);const actionNodes={events:controls.filter(x=>actionKind119(x)==='events'),watched:controls.filter(x=>actionKind119(x)==='watched')};
 let bar=q119(':scope > .ct119-sport-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct119-sport-actions';card.appendChild(bar)}
 for(const kind of ['events','watched']){const keep=best119(actionNodes[kind],kind);for(const x of actionNodes[kind])if(x!==keep)x.remove();if(keep){normalizeAction119(keep,kind);if(keep.parentElement!==bar)bar.appendChild(keep)}}
 for(const old of qa119(':scope > .ct117-event-actions',card)){for(const child of [...old.children])if(actionKind119(child))child.remove();if(!old.children.length)old.remove()}
 for(const x of candidateControls119(card)){if(bar.contains(x)||actionKind119(x))continue;if(x.closest?.('.fav-actions')||x.classList.contains('fav'))x.classList.add('ct119-sport-chip')}
 const count=qa119('.ct119-sport-action',bar).length;bar.dataset.ct119Actions=String(count);if(!count)bar.remove();
}
function organizeSports119(){if(isAndroid119())return;const root=q119('[data-sports]');if(!root)return;for(const grid of qa119('.event-grid',root))grid.classList.add('ct119-event-grid');for(const card of qa119('.event,.sport-event',root))organizeEvent119(card);root.dataset.ct119Sports='organized'}
function decorateDiscover119(){if(isAndroid119())return;const root=q119('[data-page="discover"], [data-discover]');if(!root)return;for(const b of qa119('button',root)){const n=norm119(b.textContent);if(n.includes('trocar'))b.classList.add('ct119-mini-action','swap');else if(n.includes('watchlist'))b.classList.add('ct119-mini-action','watchlist')}}

let syncTimer119=0;function sync119(){clearTimeout(syncTimer119);syncTimer119=setTimeout(()=>{void syncCounts119();organizeSports119();decorateDiscover119()},40)}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&q119('[data-ct119-watch-modal]'))closeModal119()},true);
try{new MutationObserver(sync119).observe(q119('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const style119=document.createElement('style');style119.id='ct-v119-ui';style119.textContent=`
.ct119-watch-modal{position:fixed;inset:0;z-index:10040;background:rgba(0,0,0,.8);display:grid;place-items:center;padding:16px}
.ct119-watch-dialog{width:min(900px,97vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;background:#07131a;border:1px solid #244653;border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.6)}
.ct119-watch-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px 12px;border-bottom:1px solid #183642}.ct119-watch-head small{display:block;font-size:10px;letter-spacing:.13em;opacity:.65;margin-bottom:3px}.ct119-watch-head h2{font-size:20px;margin:0}
.ct119-icon-btn{width:34px;height:34px;min-width:34px;border:1px solid #31596b;border-radius:50%;background:#0b1e27;color:inherit;font-size:20px;line-height:1;cursor:pointer}
.ct119-watch-toolbar{display:flex;justify-content:flex-end;padding:10px 14px;border-bottom:1px solid #17343f}.ct119-watch-toolbar label{display:flex;align-items:center;gap:8px;font-size:11px;opacity:.9}.ct119-watch-toolbar select{height:32px;border:1px solid #31596b;border-radius:9px;background:#0b1e27;color:inherit;padding:0 28px 0 10px;font:inherit;cursor:pointer}
.ct119-watch-list{overflow:auto;padding:12px;display:grid;gap:8px}.ct119-watch-row{appearance:none;-webkit-appearance:none;width:100%;display:grid;grid-template-columns:58px minmax(0,1fr) 24px;gap:12px;align-items:center;padding:7px 10px;border:1px solid #193946;border-radius:12px;background:#0a1921;color:inherit;text-align:left;cursor:pointer;transition:border-color .14s ease,background .14s ease,transform .14s ease}.ct119-watch-row:hover,.ct119-watch-row:focus-visible{border-color:#3e7992;background:#0d2029;transform:translateY(-1px);outline:none}.ct119-watch-row img,.ct119-watch-poster-empty{width:58px;height:86px;border-radius:8px;object-fit:cover;background:#102630;display:grid;place-items:center;text-align:center;font-size:9px}.ct119-watch-copy{min-width:0}.ct119-watch-title{display:flex;align-items:baseline;justify-content:space-between;gap:10px}.ct119-watch-title b{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct119-watch-title small{font-size:10px;opacity:.62;flex:none}.ct119-watch-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.ct119-watch-meta em{font-style:normal;font-size:9px;padding:3px 6px;border:1px solid #284f61;border-radius:999px;opacity:.78}.ct119-watch-open{font-size:22px;opacity:.7;text-align:center}
button.stat.ct118-watchlist-stat b{font-variant-numeric:tabular-nums}
`+(isAndroid119()?'':`
[data-sports] .event-grid.ct119-event-grid{display:grid!important;grid-template-columns:repeat(3,minmax(280px,1fr))!important;gap:14px!important;align-items:stretch!important}
[data-sports] .event.ct119-event-card,[data-sports] .sport-event.ct119-event-card{display:flex!important;flex-direction:column!important;gap:11px!important;min-width:0!important;min-height:278px!important;padding:15px!important;border-radius:16px!important;overflow:hidden!important}
[data-sports] .ct119-event-card .fav-actions{display:flex!important;flex-wrap:wrap!important;gap:6px!important;align-items:center!important}
[data-sports] .ct119-sport-chip{height:28px!important;min-height:28px!important;max-width:100%!important;padding:0 9px!important;border-radius:999px!important;font-size:10px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-sports] .ct119-sport-actions{margin-top:auto!important;padding-top:11px!important;border-top:1px solid rgba(90,157,184,.2)!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;width:100%!important}
[data-sports] .ct119-sport-actions[data-ct119-actions="1"]{grid-template-columns:1fr!important}
[data-sports] .ct119-sport-action{appearance:none!important;box-sizing:border-box!important;width:100%!important;height:36px!important;min-height:36px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0 11px!important;border:1px solid #31596b!important;border-radius:10px!important;background:transparent!important;color:inherit!important;font-size:11px!important;font-weight:650!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important}
[data-sports] .ct119-sport-action.primary{background:rgba(30,91,116,.3)!important;border-color:#3c7892!important}.ct119-sport-action:hover{filter:brightness(1.12)}
[data-sports] .ct117-event-actions{display:none!important}
[data-page="discover"] .ct119-mini-action,[data-discover] .ct119-mini-action{height:32px!important;min-height:32px!important;padding:0 10px!important;border-radius:9px!important;font-size:10px!important;font-weight:650!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;white-space:nowrap!important}
[data-page="discover"] .ct119-mini-action.swap::before,[data-discover] .ct119-mini-action.swap::before{content:'↻';font-size:12px}
@media(max-width:1199px){[data-sports] .event-grid.ct119-event-grid{grid-template-columns:repeat(2,minmax(270px,1fr))!important}}
@media(max-width:699px){[data-sports] .event-grid.ct119-event-grid{grid-template-columns:1fr!important}}
`)+`
@media(max-width:600px){.ct119-watch-modal{padding:8px}.ct119-watch-dialog{width:100%;max-height:95vh;border-radius:14px}.ct119-watch-head{padding:13px}.ct119-watch-head h2{font-size:17px}.ct119-watch-toolbar{justify-content:stretch}.ct119-watch-toolbar label{width:100%;justify-content:space-between}.ct119-watch-toolbar select{min-width:190px}.ct119-watch-list{padding:8px}.ct119-watch-row{grid-template-columns:50px minmax(0,1fr) 18px;gap:9px;padding:6px 8px}.ct119-watch-row img,.ct119-watch-poster-empty{width:50px;height:75px}.ct119-watch-meta em{font-size:8px}}
`;
document.getElementById(style119.id)?.remove();document.head.appendChild(style119);
sync119();
})();

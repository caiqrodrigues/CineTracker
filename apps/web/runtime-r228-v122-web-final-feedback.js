/* CineTracker 1.0.22 — final Web fixes from physical feedback. */
(()=>{
'use strict';
if(window.__ctR228V122)return;
window.__ctR228V122='discover-metadata-series-settle-sports-source-counts-exact';
window.__ctV122Discover='css-loading-preserves-empty-authority+year-genres';
window.__ctV122Sports='global-grid-direct-children-two-actions';
window.__ctV122Profile='exact-renderable-watchlist-counts';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc122=v=>{try{return esc(v)}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const tmdb=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}catch{return Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}};
const mediaType122=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||'')==='movie'?'movie':'tv'}};
const title122=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'').trim();
const year122=x=>n(String(mediaType122(x)==='movie'?(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||''):(x?.first_air_date||x?.raw_tmdb?.first_air_date||x?.release_year||'')).slice(0,4))||n(x?.release_year);
const genreIds122=x=>[...(x?.genre_ids||x?.raw_tmdb?.genre_ids||x?.genres?.map?.(g=>g?.id)||x?.raw_tmdb?.genres?.map?.(g=>g?.id)||[])].map(Number).filter(Boolean);
const GENRES={12:'Aventura',14:'Fantasia',16:'Animação',18:'Drama',27:'Terror',28:'Ação',35:'Comédia',36:'História',37:'Faroeste',53:'Suspense',80:'Crime',99:'Documentário',878:'Ficção científica',9648:'Mistério',10402:'Música',10749:'Romance',10751:'Família',10752:'Guerra',10759:'Ação e Aventura',10762:'Infantil',10763:'Notícias',10764:'Reality',10765:'Sci-Fi e Fantasia',10766:'Novela',10767:'Talk Show',10768:'Guerra e Política'};
function genresText122(x){const named=(x?.genres||x?.raw_tmdb?.genres||[]).map(g=>String(g?.name||'').trim()).filter(Boolean);const out=named.length?named:genreIds122(x).map(id=>GENRES[id]).filter(Boolean);return [...new Set(out)].slice(0,3).join(', ')}

/* --- Pra Voce: never mutate the semantic placeholder text while async renderers are working. --- */
const emptyAt122=new WeakMap();
function discoverLoading122(){
 const root=q('[data-page="discover"], [data-discover]');if(!root)return;
 const now=Date.now();
 for(const el of qa('.ct121-pending-empty',root)){if(norm(el.textContent)==='buscando recomendacao')el.textContent='Sem item elegível';el.classList.remove('ct121-pending-empty')}
 for(const el of qa('div,article,section',root)){
  if(norm(el.textContent)!=='sem item elegivel')continue;
  if(!emptyAt122.has(el))emptyAt122.set(el,now);
  const age=now-emptyAt122.get(el);el.classList.toggle('ct122-pending-empty',age<12000);
 }
}

/* Metadata index from real recommendation pools + dashboard. Missing details are enriched through existing TMDB client. */
const details122=new Map(),detailTasks122=new Map();
function indexRows122(){
 const rows=[];for(const k of ['movie','series','anime'])for(const x of (window.__ctV118LastPools?.[k]||[]))rows.push(x);
 try{for(const x of (profileCache?.dashboard||[]))rows.push(x)}catch{}
 const map=new Map();for(const x of rows){const t=norm(title122(x));if(t&&!map.has(t))map.set(t,x)}return map;
}
function cardTitle122(card){
 const candidates=qa('b,strong,h3,h4,.title,.name',card).map(x=>String(x.textContent||'').trim()).filter(Boolean);if(candidates.length)return candidates[0];
 const lines=String(card.innerText||'').split('\n').map(x=>x.trim()).filter(Boolean);return lines.find(x=>!/^filme|^s[eé]rie|^anime|watchlist|trocar|^[+↻＋]/i.test(x)&&!/^[★☆]?\s*\d/.test(x))||'';
}
function cardKey122(card,row){const id=tmdb(row)||Number(card.dataset?.tmdbId||card.dataset?.id||0);const t=mediaType122(row)||String(card.dataset?.mediaType||'tv');return id>0?`${t}:${id}`:''}
async function ensureDetails122(card,row){
 let data=row||null,key=cardKey122(card,row||{});if(data&&year122(data)&&genresText122(data))return data;if(key&&details122.has(key))return details122.get(key);if(key&&detailTasks122.has(key))return detailTasks122.get(key);
 const id=tmdb(data||{})||Number(card.dataset?.tmdbId||card.dataset?.id||0);let t=mediaType122(data||{});const dm=String(card.dataset?.media||'');if(dm.includes(':')){const [a,b]=dm.split(':');if(Number(b)>0){t=a==='movie'?'movie':'tv';key=`${t}:${Number(b)}`}}
 const finalId=id||Number(dm.split(':')[1]||0);if(!(finalId>0)||typeof safeTmdb!=='function')return data;
 const task=Promise.resolve(safeTmdb(`/${t}/${finalId}`)).then(d=>{const z={...(data||{}),...(d||{}),tmdb_id:finalId,media_type:t};details122.set(`${t}:${finalId}`,z);return z}).catch(()=>data).finally(()=>detailTasks122.delete(`${t}:${finalId}`));detailTasks122.set(`${t}:${finalId}`,task);return task;
}
function likelyCards122(root){
 const out=new Set();for(const img of qa('img',root)){let p=img.parentElement;for(let i=0;p&&p!==root&&i<6;i++,p=p.parentElement){const text=norm(p.textContent);if((text.includes('filme')||text.includes('serie')||text.includes('anime'))&&(text.includes('watchlist')||text.includes('trocar')||text.includes('★')||text.includes('☆'))){out.add(p);break}}}return [...out];
}
async function metadata122(){
 const root=q('[data-page="discover"], [data-discover]');if(!root)return;const byTitle=indexRows122();
 for(const card of likelyCards122(root)){if(card.dataset.ct122MetaBusy==='1')continue;card.dataset.ct122MetaBusy='1';try{const ttl=cardTitle122(card),seed=byTitle.get(norm(ttl))||null,data=await ensureDetails122(card,seed);if(!data)continue;const y=year122(data),g=genresText122(data);if(!y&&!g)continue;let meta=q(':scope .ct122-card-meta',card);if(!meta){meta=document.createElement('div');meta.className='ct122-card-meta';const action=qa('button,a',card).find(x=>/watchlist|trocar/i.test(x.textContent||''));if(action?.parentElement)action.parentElement.before(meta);else card.appendChild(meta)}meta.textContent=[y||'',g||''].filter(Boolean).join(' · ')}finally{delete card.dataset.ct122MetaBusy}}
}

/* --- Profile Watchlist: count exactly the same renderable rows shown by the modal. --- */
function rows122(d,kind){return (Array.isArray(d?.rows)?d.rows:[]).filter(x=>(kind==='movie'?mediaType122(x)==='movie':mediaType122(x)==='tv')&&tmdb(x)>0)}
let wlData122=null,wlAt122=0,wlTask122=null;
async function full122(force=false){if(!force&&wlData122&&Date.now()-wlAt122<60000)return wlData122;if(wlTask122)return wlTask122;wlTask122=Promise.resolve().then(()=>window.__ctV121FullWatchlist?window.__ctV121FullWatchlist(force):rpc('cinetracker_watchlist_full_v119',{})).then(d=>{wlData122=d||{rows:[]};wlAt122=Date.now();return wlData122}).finally(()=>wlTask122=null);return wlTask122}
function cleanWatchStats122(){const root=q('[data-profile]');if(!root)return;for(const stat of qa('.stat,button.stat',root)){const label=norm(q('small',stat)?.textContent||'');const kind=label==='filmes watchlist'?'movie':label==='series watchlist'?'series':'';if(!kind)continue;stat.dataset.ct122Watchlist=kind;stat.setAttribute('type','button');const b=q('b',stat);if(b&&b.textContent==='—')b.textContent='…'}}}
async function syncCounts122(){const root=q('[data-profile]');if(!root)return;cleanWatchStats122();try{const d=await full122(false);for(const kind of ['movie','series']){const count=rows122(d,kind).length;for(const stat of qa(`[data-ct122-watchlist="${kind}"]`,root)){const b=q('b',stat);if(b)b.textContent=count.toLocaleString('pt-BR')}}}catch{}}
function closeWl122(){q('[data-ct122-watch-modal]')?.remove()}
function wlYear122(x){return year122(x)}
function added122(x){const t=Date.parse(x?.added_at||x?.created_at||0);return Number.isFinite(t)?t:0}
function sortWl122(a,mode){const rows=[...a],alpha=(x,y)=>title122(x).localeCompare(title122(y),'pt-BR',{numeric:true,sensitivity:'base'});if(mode==='release_desc')return rows.sort((x,y)=>wlYear122(y)-wlYear122(x)||alpha(x,y));if(mode==='release_asc')return rows.sort((x,y)=>wlYear122(x)-wlYear122(y)||alpha(x,y));if(mode==='added_desc')return rows.sort((x,y)=>added122(y)-added122(x)||alpha(x,y));return rows.sort(alpha)}
function wlRow122(x){const t=mediaType122(x),id=tmdb(x),ttl=title122(x),y=wlYear122(x),g=genresText122(x);let p=x?.poster_path||x?.raw_tmdb?.poster_path||'';if(p&&!/^https?:/i.test(p))p=`https://image.tmdb.org/t/p/w185${String(p).startsWith('/')?'':'/'}${p}`;return `<button type="button" class="ct122-watch-row" data-ct122-media="${t}:${id}">${p?`<img src="${esc122(p)}" alt="" loading="lazy">`:''}<span><b>${esc122(ttl)}</b><small>${[y,g].filter(Boolean).join(' · ')}</small></span><i>›</i></button>`}
function paintWl122(m,d,kind,mode){const rows=sortWl122(rows122(d,kind),mode);q('[data-ct122-count]',m).textContent=rows.length.toLocaleString('pt-BR');q('[data-ct122-list]',m).innerHTML=rows.length?rows.map(wlRow122).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';m.__ct122Data=d}
async function openWl122(kind){closeWl122();const m=document.createElement('div');m.className='ct122-modal';m.dataset.ct122WatchModal=kind;m.innerHTML=`<div class="ct122-dialog"><header><div><small>WATCHLIST COMPLETA</small><h2>${kind==='movie'?'Filmes':'Séries'} na Watchlist · <span data-ct122-count>…</span></h2></div><button data-ct122-close>×</button></header><div class="ct122-toolbar"><select data-ct122-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct122-list" data-ct122-list>Carregando…</div></div>`;document.body.appendChild(m);try{const d=await full122(true);paintWl122(m,d,kind,'alpha');void syncCounts122()}catch(e){q('[data-ct122-list]',m).textContent='Não foi possível carregar a Watchlist.'}}
window.__ctV117OpenWatchlist=openWl122;window.__ctV119OpenWatchlist=openWl122;window.__ctV120OpenWatchlist=openWl122;window.__ctV121OpenWatchlist=openWl122;window.__ctV122OpenWatchlist=openWl122;

/* --- Sports: global event-grid authority, independent of wrapper/class names. --- */
function actionKind122(x){const s=norm(x?.textContent||'').replace(/\s+/g,'');if(x?.hasAttribute?.('data-ct165-open-favorite')||s==='eventos'||s.includes('vereventos'))return'events';if(s.includes('marcarcomoassistido')||s.includes('marcarassistido')||s.includes('desmarcarcomoassistido')||s.includes('desmarcarassistido')||s==='assistido')return'watched';return''}
function canonicalSportsCard122(card){if(!card||card.dataset.ct122Busy==='1')return;card.dataset.ct122Busy='1';try{card.classList.add('ct122-event-card');let bar=q(':scope > .ct122-actions',card);if(!bar){bar=document.createElement('div');bar.className='ct122-actions';card.appendChild(bar)}const controls=qa('button,a,[role="button"],.btn,.chip',card);for(const kind of ['events','watched']){let found=controls.filter(x=>actionKind122(x)===kind);if(!found.length)continue;let keep=found.find(x=>x.tagName==='BUTTON'||x.tagName==='A')||found[0];for(const x of found)if(x!==keep)x.remove();if(keep.tagName!=='BUTTON'&&keep.tagName!=='A'){const b=document.createElement('button');b.type='button';for(const a of [...keep.attributes])if(a.name!=='class'&&a.name!=='role')b.setAttribute(a.name,a.value);keep.replaceWith(b);keep=b}keep.className='ct122-action '+(kind==='watched'?'primary':'secondary');keep.textContent=kind==='events'?'Eventos':(norm(keep.textContent).includes('desmarcar')?'↶ Desmarcar':'✓ Assistido');if(keep.parentElement!==bar)bar.appendChild(keep)}for(const old of qa('.ct117-event-actions,.ct119-sport-actions,.ct120-sport-actions,.ct121-actions',card)){if(old===bar)continue;for(const c of [...old.children])if(actionKind122(c))c.remove();if(!old.children.length)old.remove()}for(const x of qa('button,a,[role="button"],.btn,.chip',card)){if(bar.contains(x))continue;if(actionKind122(x))x.remove()}if(!bar.children.length)bar.remove()}finally{delete card.dataset.ct122Busy}}
function sports122(){for(const grid of qa('.event-grid')){grid.classList.add('ct122-grid');for(const card of [...grid.children])canonicalSportsCard122(card)}}

function stableStats122(){const root=q('[data-profile]');if(!root)return;for(const panel of qa('section,.panel,div',root)){const h=q('h2,h3',panel);if(norm(h?.textContent)!=='estatisticas')continue;const head=h.closest?.('.panel-head')||h.parentElement;const bs=qa('button',head||panel);if(!bs.length)continue;const b=bs[bs.length-1],text=norm(b.textContent),aria=b.getAttribute('aria-expanded');let expanded=b.dataset.ct122Expanded!=='0';if(text.includes('expandir')||aria==='false')expanded=false;else if(text.includes('recolher')||aria==='true')expanded=true;b.dataset.ct122Stats='1';b.dataset.ct122Expanded=expanded?'1':'0';b.textContent=expanded?'⌃':'⌄';b.setAttribute('aria-label',expanded?'Recolher estatísticas':'Expandir estatísticas');b.title=b.getAttribute('aria-label');break}}

document.addEventListener('click',e=>{const st=e.target.closest?.('[data-ct122-watchlist]');if(st){e.preventDefault();e.stopImmediatePropagation();void openWl122(st.dataset.ct122Watchlist);return}if(e.target.closest?.('[data-ct122-close]')){e.preventDefault();e.stopImmediatePropagation();closeWl122();return}const row=e.target.closest?.('[data-ct122-media]');if(row){e.preventDefault();e.stopImmediatePropagation();const [t,id]=String(row.dataset.ct122Media).split(':');closeWl122();if(Number(id)>0){try{go(`/${t==='movie'?'movie':'series'}/${Number(id)}`)}catch{location.href=`/${t==='movie'?'movie':'series'}/${Number(id)}`}}}},true);
document.addEventListener('change',e=>{const s=e.target.closest?.('[data-ct122-sort]');if(!s)return;const m=s.closest('[data-ct122-watch-modal]');if(m?.__ct122Data)paintWl122(m,m.__ct122Data,m.dataset.ct122WatchModal,s.value)},true);

let syncTimer=0;function sync122(){clearTimeout(syncTimer);syncTimer=setTimeout(()=>{discoverLoading122();void metadata122();void syncCounts122();sports122();stableStats122()},35)}
try{new MutationObserver(sync122).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
setInterval(sync122,500);sync122();

const st=document.createElement('style');st.id='ct-v122-ui';st.textContent=`
.ct122-pending-empty{position:relative!important;color:transparent!important}.ct122-pending-empty::after{content:'Buscando recomendação…';position:absolute;inset:0;display:grid;place-items:center;color:#91a9b4;font-size:12px;text-align:center;padding:12px}.ct122-card-meta{font-size:10px!important;line-height:1.35!important;opacity:.78!important;padding:3px 7px 5px!important;white-space:normal!important}.ct122-card-meta:empty{display:none!important}
.ct122-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important;overflow:visible!important;align-items:stretch!important}.ct122-grid>*{width:100%!important;min-width:0!important;max-width:none!important}.ct122-event-card{display:flex!important;flex-direction:column!important;min-width:0!important}.ct122-actions{margin-top:auto!important;padding-top:10px!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;width:100%!important}.ct122-action{appearance:none!important;width:100%!important;min-width:0!important;height:36px!important;padding:0 9px!important;border-radius:10px!important;border:1px solid #35677a!important;background:#0b202a!important;color:inherit!important;font-size:11px!important;display:grid!important;place-items:center!important}.ct122-action.primary{background:#123242!important;border-color:#43809a!important}.ct122-event-card>.ct117-event-actions,.ct122-event-card>.ct119-sport-actions,.ct122-event-card>.ct120-sport-actions,.ct122-event-card>.ct121-actions{display:none!important}
[data-ct122-stats]{width:34px!important;min-width:34px!important;height:34px!important;min-height:34px!important;padding:0!important;display:grid!important;place-items:center!important;border-radius:50%!important;font-size:17px!important}
.ct122-modal{position:fixed;inset:0;z-index:10130;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:14px}.ct122-dialog{width:min(920px,97vw);max-height:92vh;display:flex;flex-direction:column;background:#07131a;border:1px solid #285061;border-radius:18px;overflow:hidden}.ct122-dialog header{display:flex;justify-content:space-between;align-items:center;padding:15px;border-bottom:1px solid #183642}.ct122-dialog header button{width:34px;height:34px;border-radius:50%;border:1px solid #31596b;background:#0b1e27;color:inherit}.ct122-toolbar{display:flex;justify-content:flex-end;padding:9px 12px;border-bottom:1px solid #17343f}.ct122-toolbar select{height:34px;border:1px solid #31596b;border-radius:9px;background:#0b1e27;color:inherit;padding:0 10px}.ct122-list{overflow:auto;padding:11px;display:grid;gap:8px}.ct122-watch-row{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 18px;gap:10px;align-items:center;padding:7px 9px;border:1px solid #193946;border-radius:12px;background:#0a1921;color:inherit;text-align:left}.ct122-watch-row img{width:52px;height:78px;object-fit:cover;border-radius:7px}.ct122-watch-row span{display:grid;gap:5px}.ct122-watch-row small{opacity:.7}.ct122-watch-row i{font-style:normal;font-size:19px}
@media(max-width:1100px){.ct122-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:700px){.ct122-grid{grid-template-columns:1fr!important}}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctV122Rows=rows122;window.__ctV122Sync=sync122;window.__ctV122Sports=sports122;
})();

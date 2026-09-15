/* Web 1.0.79 r288 — Descobrir parity with approved Android behavior, Web-only. */
window.__ctR288='discover-android-parity-web-only';
window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou';
window.__ctR288Top10='provider-specific-series+movies-real-rails';
window.__ctR288ForYou='movie-series-anime-independent-swap';
window.__ctR288Filter='compact-toggle-all-movies-series';
window.__ctR288Calendar='grouped-by-release-date';
window.__ctR288Android='preserved-1.0.20-10062';

const ct288State={
 filterOpen:false,
 topProvider:0,
 watchIndex:{movie:0,series:0,anime:0},
 freshIndex:{movie:0,series:0,anime:0},
 expanded:new Set(),
 topToken:0
};
const ct288TabLabels={trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais Aguardados',top:'Mais bem avaliados',calendar:'Calendário'};

function ct288Alive(tab=discover263.tab){
 try{return String(route())==='discover'&&discover263.tab===tab}catch{return false}
}
function ct288Date(x){return String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,10)}
function ct288Anime(x){
 if(type263(x)!=='tv')return false;
 const ids=[...(Array.isArray(x?.genre_ids)?x.genre_ids:[]),...(Array.isArray(x?.raw_tmdb?.genre_ids)?x.raw_tmdb.genre_ids:[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])];
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());
 return ids.map(Number).includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function ct288Group(rows){
 const out={movie:[],series:[],anime:[]};
 for(const x of rows||[]){
  if(type263(x)==='movie')out.movie.push(x);
  else if(ct288Anime(x))out.anime.push(x);
  else out.series.push(x);
 }
 return out;
}
function ct288TypeLabel(x){return type263(x)==='movie'?'Filme':ct288Anime(x)?'Anime':'Série'}
function ct288Meta(x){const y=year263(x),score=score263(x);return [y,ct288TypeLabel(x),score?`★ ${score.toFixed(1)}`:''].filter(Boolean).join(' · ')}
function ct288Poster(x){const p=poster263(x);return p?`<img class="ct288-poster" src="${esc263(image263(p,'w342'))}" alt="" loading="lazy">`:'<div class="ct288-poster ct288-poster-empty">Sem capa</div>'}
function ct288Card(x,{rank=0,watch=false,add=true}={}){
 if(!x)return '<div class="ct288-empty-card"><div class="ct288-empty-poster"></div><b>Sem item elegível</b><small>Tente novamente mais tarde</small></div>';
 const type=type263(x),id=id263(x),key=`${type}:${id}`;
 return `<article class="ct288-card" data-ct288-card="${key}">${rank?`<span class="ct288-rank">${rank}</span>`:''}<button type="button" class="ct288-open" data-media="${key}">${ct288Poster(x)}<span class="ct288-copy"><b>${esc263(title263(x))}</b><small>${esc263(ct288Meta(x)||'—')}</small></span></button>${watch?'<button type="button" class="ct288-state on" disabled aria-label="Na Watchlist">✓</button>':add?`<button type="button" class="ct288-state" data-ct288-add="${key}" aria-label="Adicionar à Watchlist">+</button>`:''}</article>`;
}
function ct288Slot(title,kind,rows,bucket,watch){
 const list=rows||[],idx=Number(ct288State[bucket][kind]||0),item=list.length?list[idx%list.length]:null;
 return `<section class="ct288-slot" data-ct288-slot="${bucket}:${kind}"><div class="ct288-slot-head"><h3>${title}</h3></div>${ct288Card(item,{watch,add:!watch})}<button type="button" class="ct288-swap" data-ct288-swap="${bucket}:${kind}" ${list.length<2?'disabled':''}>↻ Trocar</button></section>`;
}
function ct288ForYouGrid(title,groups,bucket,watch){
 return `<section class="panel ct288-foryou-block"><div class="panel-head"><h2>${title}</h2></div><div class="ct288-slot-grid">${ct288Slot('Filme','movie',groups.movie,bucket,watch)}${ct288Slot('Série','series',groups.series,bucket,watch)}${ct288Slot('Anime','anime',groups.anime,bucket,watch)}</div></section>`;
}
paintForYou263=function(){
 const host=discoverHost263(),d=discover263.forYou;if(!host||!d)return;
 const pick=d.picks?.length?d.picks[discover263.swap%d.picks.length]:null,watch=ct288Group(d.watch||[]),fresh=ct288Group(d.fresh||[]);
 host.innerHTML=`<div data-ct288-foryou>${block263('Indicação do Dia',pick?[pick]:[],d.picks?.length>1?'<button type="button" class="chip" data-ct263-swap>Trocar</button>':'')}${ct288ForYouGrid('Da sua Watchlist',watch,'watchIndex',true)}${ct288ForYouGrid('100% novos',fresh,'freshIndex',false)}</div>`;
 armDiscoverRails263(host);try{if(typeof ct171DecorateSeen==='function')void ct171DecorateSeen(false)}catch{}
};

function ct288BrowseCard(x){return ct288Card(x,{add:true})}
function ct288Rail(rows,name=''){return `<div class="ct288-rail${ct288State.expanded.has(name)?' ct288-expanded':''}" data-ct288-rail="${esc263(name)}">${(rows||[]).map(ct288BrowseCard).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div>`}
function ct288VerMore(name){return `<button type="button" class="chip ct288-more" data-ct288-more="${esc263(name)}">${ct288State.expanded.has(name)?'Recolher':'Ver mais'}</button>`}
function ct288FormatDate(v){try{return new Date(v+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'})}catch{return v}}
function ct288Calendar(rows){
 const groups=new Map();for(const x of rows||[]){const d=ct288Date(x);if(!d)continue;if(!groups.has(d))groups.set(d,[]);groups.get(d).push(x)}
 return [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([d,list])=>`<section class="panel ct288-browse-block ct288-calendar-day"><div class="panel-head"><h2>${esc263(ct288FormatDate(d))}</h2><small>${list.length}</small></div>${ct288Rail(list,'calendar:'+d)}</section>`).join('')||'<div class="empty">Nenhum lançamento encontrado no período.</div>';
}
paintBrowse263=function(rows,tab){
 const host=discoverHost263();if(!host)return;
 if(tab==='calendar'){host.innerHTML=`<div data-ct288-calendar>${ct288Calendar(rows)}</div>`;return}
 const title=ct288TabLabels[tab]||'Descobrir',key='browse:'+tab;
 host.innerHTML=`<section class="panel ct288-browse-block"><div class="panel-head"><h2>${esc263(title)}</h2>${ct288VerMore(key)}</div>${ct288Rail(rows,key)}</section>`;
 try{if(typeof ct171DecorateSeen==='function')void ct171DecorateSeen(false)}catch{}
};

function ct288ProviderButtons(rows){
 return (rows||[]).map(p=>`<button type="button" class="ct288-provider ${Number(p.provider_id)===Number(ct288State.topProvider)?'active':''}" data-ct288-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name||'Streaming')}</b></button>`).join('')||'<div class="empty">Nenhum streaming disponível.</div>';
}
function ct288TopCard(x,i){
 if(typeof ct171TopCard==='function')return ct171TopCard(x,i);
 return ct288Card(x,{rank:i+1,add:false});
}
async function ct288PaintTop(provider,token){
 const host=discoverHost263();if(!host||!ct288Alive('top10')||token!==ct288State.topToken)return;
 const content=host.querySelector('[data-ct288-top-content]');if(!content)return;
 content.innerHTML='<div class="ct263-loading">Montando Top 10…</div>';
 try{
  const data=await ct171TopRows(Number(provider));if(!ct288Alive('top10')||token!==ct288State.topToken)return;
  const p=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider));
  content.innerHTML=`<div class="ct288-top-name"><b>${esc(p?.provider_name||'Streaming')}</b></div><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${data.series.length}</small></div><div class="ct288-top-row">${data.series.map(ct288TopCard).join('')||'<div class="empty">Sem séries disponíveis neste streaming.</div>'}</div></section><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${data.movies.length}</small></div><div class="ct288-top-row">${data.movies.map(ct288TopCard).join('')||'<div class="empty">Sem filmes disponíveis neste streaming.</div>'}</div></section>`;
  try{if(typeof ct171DecorateSeen==='function')void ct171DecorateSeen(false)}catch{}
 }catch(e){if(content&&ct288Alive('top10'))content.innerHTML=`<div class="empty">Não foi possível carregar o Top 10 agora.</div>`}
}
async function ct288LoadTop10(gen){
 const host=discoverHost263();if(!host)return;const token=++ct288State.topToken;
 host.innerHTML=`<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct288-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct288-top-content><div class="ct263-loading">Carregando Top 10…</div></div></section>`;
 try{
  ct171ProviderList=null;const providers=await ct171Providers();if(gen!==discover263.gen||!ct288Alive('top10')||token!==ct288State.topToken)return;
  if(!ct288State.topProvider||!providers.some(p=>Number(p.provider_id)===Number(ct288State.topProvider)))ct288State.topProvider=Number(ct171TopProvider||providers[0]?.provider_id||0);
  ct171TopProvider=ct288State.topProvider;
  const box=host.querySelector('[data-ct288-providers]');if(box)box.innerHTML=ct288ProviderButtons(providers);
  if(ct288State.topProvider)await ct288PaintTop(ct288State.topProvider,token);
 }catch(e){const h=host.querySelector('[data-ct288-top-content]');if(h)h.innerHTML='<div class="empty">Não foi possível carregar os streamings agora.</div>'}
}

function ct288SyncShell(){
 syncDiscover263();const root=q263('[data-ct288-discover]');if(!root)return;
 const browse=!['foryou','top10'].includes(discover263.tab),filter=root.querySelector('[data-ct288-filter]'),types=root.querySelector('[data-ct288-types]');
 if(filter)filter.hidden=!browse;if(types){types.hidden=!browse||!ct288State.filterOpen;types.classList.toggle('open',browse&&ct288State.filterOpen)}
 const rail=root.querySelector('[data-ct288-tabs]'),active=rail?.querySelector(`[data-ct263-discover-tab="${discover263.tab}"]`);if(active&&rail){const r=rail.getBoundingClientRect(),a=active.getBoundingClientRect();if(a.left<r.left||a.right>r.right)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
}
loadDiscover263=function(tab=discover263.tab,force=false){
 discover263.tab=tab;if(tab==='foryou'||tab==='top10')discover263.type='all';const gen=++discover263.gen;ct288SyncShell();const host=discoverHost263();if(host)host.innerHTML='<div class="ct263-loading">Carregando títulos…</div>';
 if(tab==='foryou'){void forYou263(gen,force);return}
 if(tab==='top10'){void ct288LoadTop10(gen);return}
 void loadBrowse263(tab,gen,force);
};
renderDiscover=async function(seq){
 const tabs=DTABS263.map(([k,l])=>`<button type="button" class="chip ${discover263.tab===k?'active':''}" data-ct263-discover-tab="${k}">${l}</button>`).join('');
 const types=[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${discover263.type===k?'active':''}" data-ct263-discover-type="${k}">${l}</button>`).join('');
 setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover data-ct263-discover data-ct288-discover><div class="ct288-tab-shell"><button type="button" class="ct288-tab-arrow" data-ct288-tab-prev aria-label="Abas anteriores">‹</button><div class="tabs ct263-discover-tabs ct288-tabs" data-ct288-tabs>${tabs}</div><button type="button" class="ct288-tab-arrow" data-ct288-tab-next aria-label="Próximas abas">›</button><button type="button" class="ct288-filter-btn" data-ct288-filter aria-label="Filtrar por tipo" aria-expanded="false">☷<i></i></button></div><div class="filters ct263-discover-types ct288-types" data-ct288-types hidden>${types}</div><div data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div></div>`));
 if(seq!==navSeq||String(route())!=='discover')return;armDiscoverRails263(q263('[data-ct288-discover]'));ct288SyncShell();loadDiscover263(discover263.tab,false);
};

async function ct288Add(btn){
 if(!btn||btn.disabled)return;const [type,idRaw]=String(btn.dataset.ct288Add||'').split(':'),id=Number(idRaw);if(!id||!['movie','tv'].includes(type))return;btn.disabled=true;btn.textContent='…';
 try{await addWatchlist(type,id);btn.textContent='✓';btn.classList.add('on');discover263.personal=null;discover263.personalAt=0;discover263.forYou=null;discover263.cache.clear()}catch(e){btn.disabled=false;btn.textContent='+';try{toast(e?.message||e)}catch{}}
}
function ct288ScrollTabs(dir){const rail=q263('[data-ct288-tabs]');if(!rail)return;rail.scrollBy({left:dir*Math.max(240,rail.clientWidth*.75),behavior:'smooth'})}

document.addEventListener('click',e=>{
 const filter=e.target?.closest?.('[data-ct288-filter]');if(filter){e.preventDefault();e.stopImmediatePropagation();ct288State.filterOpen=!ct288State.filterOpen;filter.setAttribute('aria-expanded',String(ct288State.filterOpen));ct288SyncShell();return}
 const swap=e.target?.closest?.('[data-ct288-swap]');if(swap){e.preventDefault();e.stopImmediatePropagation();const [bucket,kind]=String(swap.dataset.ct288Swap||'').split(':');if(ct288State[bucket]?.[kind]!=null){ct288State[bucket][kind]++;paintForYou263()}return}
 const provider=e.target?.closest?.('[data-ct288-provider]');if(provider){e.preventDefault();e.stopImmediatePropagation();ct288State.topProvider=Number(provider.dataset.ct288Provider||0);ct171TopProvider=ct288State.topProvider;q263('[data-ct288-providers]')?.querySelectorAll('[data-ct288-provider]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ct288Provider)===ct288State.topProvider));void ct288PaintTop(ct288State.topProvider,ct288State.topToken);return}
 const add=e.target?.closest?.('[data-ct288-add]');if(add){e.preventDefault();e.stopImmediatePropagation();void ct288Add(add);return}
 const more=e.target?.closest?.('[data-ct288-more]');if(more){e.preventDefault();e.stopImmediatePropagation();const key=String(more.dataset.ct288More||'');if(ct288State.expanded.has(key))ct288State.expanded.delete(key);else ct288State.expanded.add(key);const rail=q263(`[data-ct288-rail="${CSS.escape(key)}"]`);rail?.classList.toggle('ct288-expanded',ct288State.expanded.has(key));more.textContent=ct288State.expanded.has(key)?'Recolher':'Ver mais';return}
 if(e.target?.closest?.('[data-ct288-tab-prev]')){e.preventDefault();e.stopImmediatePropagation();ct288ScrollTabs(-1);return}
 if(e.target?.closest?.('[data-ct288-tab-next]')){e.preventDefault();e.stopImmediatePropagation();ct288ScrollTabs(1);return}
},true);

const ct288Style=document.createElement('style');ct288Style.id='ct-web-r288-discover-parity';ct288Style.textContent=`
[data-ct288-discover]{min-width:0;overflow-x:hidden}
.ct288-tab-shell{display:flex;align-items:center;gap:7px;min-width:0;margin-bottom:8px}
.ct288-tabs{flex:1 1 auto;display:flex;flex-wrap:nowrap;gap:7px;overflow-x:auto!important;overflow-y:hidden;scrollbar-width:none;overscroll-behavior-x:contain;touch-action:pan-x pan-y;padding:2px 1px 6px;min-width:0}
.ct288-tabs::-webkit-scrollbar,.ct288-provider-row::-webkit-scrollbar,.ct288-rail::-webkit-scrollbar,.ct288-top-row::-webkit-scrollbar{display:none}
.ct288-tabs .chip{flex:0 0 auto;white-space:nowrap}
.ct288-tab-arrow,.ct288-filter-btn{flex:0 0 36px;width:36px;height:36px;border:1px solid var(--line,#2d3748);border-radius:11px;background:var(--panel,#151922);color:inherit;display:grid;place-items:center;font-size:22px;cursor:pointer}
.ct288-filter-btn{position:relative;font-size:17px}.ct288-filter-btn i{position:absolute;right:6px;top:6px;width:6px;height:6px;border-radius:50%;background:#4da3ff}
.ct288-types{display:flex;gap:7px;overflow-x:auto;margin:0 0 10px;padding:0 0 4px}.ct288-types[hidden]{display:none!important}
.ct288-slot-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start}
.ct288-slot{min-width:0}.ct288-slot-head h3{font-size:13px;margin:0 0 7px}.ct288-card{position:relative;min-width:0}.ct288-open{display:block;width:100%;min-width:0;text-align:left;background:transparent;border:0;color:inherit;padding:0;cursor:pointer}.ct288-poster,.ct288-empty-poster{display:block;width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:12px;background:#232a36}.ct288-copy{display:block;padding-top:7px;min-width:0}.ct288-copy b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct288-copy small{display:block;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.75;font-size:11px}.ct288-state{position:absolute;right:7px;bottom:42px;width:30px;height:30px;border-radius:999px;border:1px solid rgba(255,255,255,.26);background:rgba(10,14,20,.86);color:#fff;display:grid;place-items:center;font-size:19px;cursor:pointer}.ct288-state.on{font-size:14px}.ct288-swap{width:100%;margin-top:8px;min-height:32px;border:1px solid var(--line,#2d3748);border-radius:10px;background:transparent;color:inherit;cursor:pointer}.ct288-swap:disabled{opacity:.4;cursor:default}
.ct288-empty-card b,.ct288-empty-card small{display:block}.ct288-empty-card small{opacity:.65;margin-top:4px}.ct288-empty-poster{margin-bottom:7px}
.ct288-rail,.ct288-top-row,.ct288-provider-row{display:flex;flex-wrap:nowrap;overflow-x:auto!important;overflow-y:hidden;gap:12px;scroll-snap-type:x proximity;overscroll-behavior-x:contain;touch-action:pan-x pan-y;scrollbar-width:none;padding:2px 1px 8px;min-width:0}
.ct288-rail>.ct288-card{flex:0 0 154px;scroll-snap-align:start}.ct288-top-row>.ct171-top-card{flex:0 0 154px!important;min-width:154px!important;scroll-snap-align:start}.ct288-provider-row{gap:8px;margin-bottom:12px}.ct288-provider{flex:0 0 auto;display:flex;align-items:center;gap:7px;border:1px solid var(--line,#2d3748);border-radius:999px;background:transparent;color:inherit;padding:7px 11px;cursor:pointer;white-space:nowrap}.ct288-provider.active{border-color:#4da3ff;background:rgba(77,163,255,.14)}.ct288-provider span{width:22px;height:22px;border-radius:6px;background-size:cover;background-position:center}.ct288-top-name{margin:0 0 8px}.ct288-top-section+.ct288-top-section{margin-top:12px}
.ct288-browse-block .panel-head,.ct288-top-section .panel-head,.ct288-foryou-block .panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.ct288-more{flex:0 0 auto}.ct288-rail.ct288-expanded{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));overflow:visible!important}.ct288-rail.ct288-expanded>.ct288-card{min-width:0}
.ct288-calendar-day+.ct288-calendar-day{margin-top:10px}.ct288-rank{position:absolute;z-index:2;left:6px;top:4px;font-size:38px;font-weight:900;line-height:1;color:#fff;text-shadow:0 2px 8px #000}
@media(max-width:760px){.ct288-tab-arrow{display:grid}.ct288-tab-shell{gap:5px}.ct288-tab-arrow,.ct288-filter-btn{flex-basis:32px;width:32px;height:32px;border-radius:9px}.ct288-slot-grid{gap:7px}.ct288-slot-head h3{font-size:11px}.ct288-copy b{font-size:11px}.ct288-copy small{font-size:9px}.ct288-state{right:5px;bottom:35px;width:26px;height:26px}.ct288-swap{font-size:10px;min-height:29px}.ct288-rail>.ct288-card,.ct288-top-row>.ct171-top-card{flex-basis:142px!important;min-width:142px!important}}
@media(min-width:1100px){.ct288-rail>.ct288-card,.ct288-top-row>.ct171-top-card{flex-basis:176px!important;min-width:176px!important}.ct288-tab-arrow{display:grid}}
`;
document.getElementById(ct288Style.id)?.remove();document.head.appendChild(ct288Style);

window.__ctR288Test={state:ct288State,group:ct288Group,calendar:ct288Calendar,loadTop10:ct288LoadTop10,syncShell:ct288SyncShell};

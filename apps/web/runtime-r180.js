/* r180: strict Discover authority + scrollable tab rail + collapsible Profile statistics */
window.__ctR180='strict-discover-profile-layout';
window.__ct180Discover='all-tabs-scroll-strict-business-rules';
window.__ct180Profile='collapsible-stats-wide-time-cards';
window.__ct180Parity='web-android-same-discover-rules';

const ctR180Tabs=[
  ['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],
  ['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],
  ['top','Mais bem avaliados'],['calendar','Calendário']
];
const ctR180RuleLabels={
  foryou:'Personalizado · respeita histórico, progresso e Watchlist',
  trending:'Em alta agora · sem itens já conhecidos',
  popular:'Populares · sem itens já vistos, em progresso ou na Watchlist',
  new:'Somente lançados entre hoje e os últimos 30 dias',
  releases:'Janela de lançamentos: últimos 7 dias até os próximos 30 dias',
  anticipated:'Somente títulos futuros, a partir de amanhã',
  top:'Mais bem avaliados · sem itens já conhecidos',
  calendar:'Somente lançamentos da sua Watchlist',
  top10:'Top 10 por streaming no Brasil'
};

try{
  discoverCache.clear();
  if(typeof ct168ResetExclusions==='function')ct168ResetExclusions();
  for(const k of Object.keys(localStorage))if(k.indexOf('cinetracker:preload:r163:discover:')===0)localStorage.removeItem(k);
}catch{}

function ctR180Date(x){
  const t=mediaType(x);return String(t==='movie'?x?.release_date:x?.first_air_date||'').slice(0,10);
}
function ctR180Valid(x){
  if(!x||!(Number(x.id||x.tmdb_id||0)>0)||!mediaPoster(x))return false;
  try{if(typeof validDiscover158==='function'&&!validDiscover158(x))return false}catch{}
  return true;
}
function ctR180Unique(rows){
  if(typeof ct166Unique==='function')return ct166Unique(rows||[]);
  const seen=new Set(),out=[];for(const x of rows||[]){const k=mediaType(x)+':'+Number(x?.id||0);if(!Number(x?.id||0)||seen.has(k))continue;seen.add(k);out.push(x)}return out;
}
function ctR180Known(x,c){
  try{if(typeof ct166Known==='function')return ct166Known(x,c)}catch{}
  try{if(typeof known158==='function')return known158(x,c)}catch{}
  return false;
}
async function ctR180Context(){
  if(typeof ct168Exclusions==='function')return ct168Exclusions();
  if(typeof exclusionContext158==='function')return exclusionContext158();
  return exclusionContext();
}
function ctR180Clean(rows,c){return ctR180Unique(rows).filter(x=>ctR180Valid(x)&&!ctR180Known(x,c))}
function ctR180SortDate(rows,dir=1){return [...rows].sort((a,b)=>dir*ctR180Date(a).localeCompare(ctR180Date(b)))}
function ctR180CacheKey(tab){return 'r180-strict:'+tab+':'+localDay()}

async function ctR180StrictRows(tab){
  if(tab==='foryou')return typeof ct168ForYouRows==='function'?ct168ForYouRows():discoverRows(tab);
  if(tab==='calendar'){
    const raw=await rpc('cinetracker_calendar_watchlist_v0997',{p_from:localDay(),p_to:shiftDays(75)}).catch(()=>[]);
    return (Array.isArray(raw)?raw:[]).map(x=>({...x,id:Number(x.tmdb_id||x.id||0),media_type:mediaType(x)})).filter(ctR180Valid);
  }
  const c=await ctR180Context();
  if(tab==='trending'){
    const [m,t]=await Promise.all([pages('/trending/movie/day',{},'movie',2),pages('/trending/tv/day',{},'tv',2)]);
    return ctR180Clean([...m,...t],c).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,120);
  }
  if(tab==='popular'){
    const [m,t]=await Promise.all([pages('/movie/popular',{include_adult:false},'movie',4),pages('/tv/popular',{include_adult:false},'tv',4)]);
    return ctR180Clean([...m,...t],c).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,140);
  }
  if(tab==='new'){
    const lo=shiftDays(-30),hi=localDay();
    const [m,t]=await Promise.all([
      pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.desc',include_adult:false},'movie',5),
      pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.desc',include_adult:false},'tv',5)
    ]);
    return ctR180SortDate(ctR180Clean([...m,...t],c).filter(x=>{const d=ctR180Date(x);return d>=lo&&d<=hi}),-1).slice(0,120);
  }
  if(tab==='releases'){
    const lo=shiftDays(-7),hi=shiftDays(30);
    const [m,t]=await Promise.all([
      pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc',include_adult:false},'movie',5),
      pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc',include_adult:false},'tv',5)
    ]);
    return ctR180SortDate(ctR180Clean([...m,...t],c).filter(x=>{const d=ctR180Date(x);return d>=lo&&d<=hi}),1).slice(0,140);
  }
  if(tab==='anticipated'){
    const lo=shiftDays(1),hi=shiftDays(365);
    const [m,t]=await Promise.all([
      pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'popularity.desc',include_adult:false},'movie',5),
      pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'popularity.desc',include_adult:false},'tv',5)
    ]);
    return ctR180Clean([...m,...t],c).filter(x=>{const d=ctR180Date(x);return d>=lo&&d<=hi}).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)||ctR180Date(a).localeCompare(ctR180Date(b))).slice(0,140);
  }
  if(tab==='top'){
    const [m,t]=await Promise.all([pages('/movie/top_rated',{include_adult:false},'movie',4),pages('/tv/top_rated',{include_adult:false},'tv',4)]);
    return ctR180Clean([...m,...t],c).sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0)||Number(b.vote_count||0)-Number(a.vote_count||0)).slice(0,140);
  }
  return [];
}

const ctR180DiscoverRowsBase=discoverRows;
discoverRows=async function(tab){
  if(tab==='top10')return [];
  const key=ctR180CacheKey(tab);if(discoverCache.has(key))return discoverCache.get(key);
  const task=Promise.resolve().then(()=>ctR180StrictRows(tab));discoverCache.set(key,task);
  try{const rows=await task;discoverCache.set(key,rows);try{ct163Write('discover:'+tab+':all',rows)}catch{}return rows}catch(e){discoverCache.delete(key);throw e}
};

function ctR180TabsHtml(){return ctR180Tabs.map(([k,l])=>`<button class="chip ${discoverState.tab===k?'active':''}" data-discover-tab="${k}">${l}</button>`).join('')}
function ctR180FiltersHtml(){return [['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button class="chip ${discoverState.type===k?'active':''}" data-discover-type="${k}">${l}</button>`).join('')}
function ctR180TabRail(){return `<div class="ct-r180-tab-shell"><button type="button" class="ct-r180-tab-arrow prev" data-ct-r180-tab-scroll="-1" aria-label="Subabas anteriores">‹</button><div class="tabs ct-r180-tabs" data-ct-r180-tabs>${ctR180TabsHtml()}</div><button type="button" class="ct-r180-tab-arrow next" data-ct-r180-tab-scroll="1" aria-label="Próximas subabas">›</button></div>`}
function ctR180RuleNote(tab){return `<div class="ct-r180-rule-note"><span>REGRA ATIVA</span><b>${esc(ctR180RuleLabels[tab]||'Filtro estrito do Descobrir')}</b></div>`}

function ctR180RenderArray(rows){
  const h=$('[data-discover-content]');if(!h)return;let a=Array.isArray(rows)?rows:[];
  if(discoverState.type==='movie')a=a.filter(x=>mediaType(x)==='movie');else if(discoverState.type==='tv')a=a.filter(x=>mediaType(x)==='tv');
  if(discoverState.tab==='calendar'){
    const groups=new Map();for(const x of a){const ds=String(x.calendar_date||x.release_date||x.first_air_date||'').slice(0,10)||'Sem data';if(!groups.has(ds))groups.set(ds,[]);groups.get(ds).push(x)}
    h.innerHTML=ctR180RuleNote('calendar')+`<div class="page ct-r180-calendar">${[...groups.entries()].map(([d,g])=>`<section class="panel"><div class="panel-head"><h2>${d==='Sem data'?d:new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h2><small>${g.length}</small></div><div class="row">${g.map(mediaCard).join('')}</div></section>`).join('')||'<div class="empty">Nenhum lançamento da sua Watchlist neste período.</div>'}</div>`;return;
  }
  const labels={trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais Aguardados',top:'Mais bem avaliados'};
  const label=labels[discoverState.tab]||'Descobrir',expanded=Boolean(ct166Expanded?.[discoverState.tab]),limit=expanded?24:8,shown=a.slice(0,limit),more=a.length>8?`<button type="button" class="btn btn-secondary ct166-more" data-ct166-more="${esc(discoverState.tab)}">${expanded?'Ver menos':'Ver mais'}</button>`:'';
  h.innerHTML=ctR180RuleNote(discoverState.tab)+`<section class="panel discover-section ct-r180-discover-section"><div class="panel-head"><h2>${esc(label)}</h2><div class="ct-r180-section-actions">${more}</div></div>${discoverCarousel158(shown)}</section>`;
}

const ctR180PaintDiscoverBase=paintDiscover;
paintDiscover=function(rows){
  if(discoverState.tab==='foryou'){
    const h=$('[data-discover-content]');if(!h)return;h.innerHTML=ctR180RuleNote('foryou')+ct166RenderForYou(rows||{});try{requestAnimationFrame(ct169TuneForYou)}catch{}return;
  }
  if(discoverState.tab==='top10'){return}
  ctR180RenderArray(rows);
};

async function ctR180PaintTopProvider(provider){
  const content=document.querySelector('[data-ct171-top-content]');if(!content)return;content.innerHTML=loading('Montando Top 10 de hoje...');
  try{
    const data=await ct171TopRows(provider);if(discoverState.tab!=='top10')return;const p=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider));
    content.innerHTML=ctR180RuleNote('top10')+`<div class="ct171-top-caption"><b>${esc(p?.provider_name||'Streaming')}</b><small>Brasil · ranking diário por popularidade TMDB entre títulos disponíveis por assinatura.</small></div><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${data.series.length}</small></div><div class="ct171-top-row">${data.series.map(ct171TopCard).join('')||'<div class="empty">Sem séries disponíveis neste streaming.</div>'}</div></section><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${data.movies.length}</small></div><div class="ct171-top-row">${data.movies.map(ct171TopCard).join('')||'<div class="empty">Sem filmes disponíveis neste streaming.</div>'}</div></section>`;
  }catch(e){content.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}
}
ct171PaintTopProvider=ctR180PaintTopProvider;

async function ctR180RenderTop10(seq){
  discoverState.type='all';
  setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',`<div class="page" data-discover>${ctR180TabRail()}<section class="ct171-top10-shell"><div class="ct171-top10-title"><div><small>TOP 10 · ${new Date().toLocaleDateString('pt-BR')}</small><h2>Escolha o streaming</h2></div></div><div class="ct171-provider-tabs" data-ct171-provider-tabs>${loading('Carregando streamings...')}</div><div data-ct171-top-content>${loading('Carregando Top 10...')}</div></section></div>`));
  try{
    ct171ProviderList=null;const ps=await ct171Providers();if(seq!==navSeq||discoverState.tab!=='top10')return;
    if(!ct171TopProvider||!ps.some(x=>Number(x.provider_id)===Number(ct171TopProvider)))ct171TopProvider=Number(ps[0]?.provider_id||0);
    const box=document.querySelector('[data-ct171-provider-tabs]');if(box)box.innerHTML=ps.map(p=>`<button type="button" class="ct171-provider-tab ${Number(p.provider_id)===Number(ct171TopProvider)?'active':''}" data-ct171-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name)}</b></button>`).join('')||'<div class="empty">Nenhum streaming configurado.</div>';
    if(ct171TopProvider)await ctR180PaintTopProvider(ct171TopProvider);requestAnimationFrame(ctR180ExposeActiveTab);
  }catch(e){const h=document.querySelector('[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar streamings: '+(e?.message||e),'discover')}
}

renderDiscover=async function(seq){
  if(discoverState.tab==='top10')return ctR180RenderTop10(seq);
  setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',`<div class="page" data-discover>${ctR180TabRail()}<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div><div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  try{const rows=await discoverRows(discoverState.tab);if(seq!==navSeq||route()!=='discover')return;paintDiscover(rows);requestAnimationFrame(ctR180ExposeActiveTab)}catch(e){if(seq!==navSeq)return;const h=$('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover')}
};

function ctR180ExposeActiveTab(){const rail=document.querySelector('[data-ct-r180-tabs]'),active=rail?.querySelector('.chip.active');if(active)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct-r180-tab-scroll]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const rail=document.querySelector('[data-ct-r180-tabs]');if(rail)rail.scrollBy({left:Number(b.dataset.ctR180TabScroll||1)*Math.max(220,rail.clientWidth*.72),behavior:'smooth'});
},true);

/* ---------- Perfil: recolher/expandir estatísticas + dois cards largos ---------- */
const CT_R180_PROFILE_COLLAPSED='ct:r180:profile:stats-collapsed';
function ctR180StatsCollapsed(){try{return localStorage.getItem(CT_R180_PROFILE_COLLAPSED)==='1'}catch{return false}}
function ctR180StatCard(label,value,wide=false){return `<div class="stat ${wide?'ct-r180-stat-wide':''}"><small>${esc(label)}</small><b>${value}</b></div>`}
function ctR180ProfileStats(d=profileCache||{}){
  const root=$('[data-profile]');if(!root)return;const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const seriesWatch=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0)),movieWatch=Math.max(0,Number(rem.watchlist_movie_minutes??0)),collapsed=ctR180StatsCollapsed();
  const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
  const cards=[
    ctR180StatCard('Episódios',Number(s.episodes_watched||0).toLocaleString('pt-BR')),
    ctR180StatCard('Filmes',Number(s.movies_watched||0).toLocaleString('pt-BR')),
    ctR180StatCard('Séries Watchlist',Number(rem.watchlist_series??ss.not_started_series??0).toLocaleString('pt-BR')),
    ctR180StatCard('Filmes Watchlist',Number(rem.watchlist_movies??ss.watchlist_movies??0).toLocaleString('pt-BR')),
    ctR180StatCard('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true),
    ctR180StatCard('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),
    ctR180StatCard('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes)),
    ctR180StatCard('Tempo de série em Watchlist',ct166FmtMinutes(seriesWatch)),
    ctR180StatCard('Tempo de filme em Watchlist',ct166FmtMinutes(movieWatch)),
    ctR180StatCard('Tempo total em Watchlist',ct166FmtMinutes(seriesWatch+movieWatch),true)
  ].join('');
  panel.classList.add('ct-r180-stats-panel');panel.innerHTML=`<div class="panel-head ct-r180-stats-head"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="stats ct-r180-stats-grid">${cards}</div></div>`;
}
function ctR180ProfileButtons(){
  const root=$('[data-profile]');if(!root)return;root.querySelectorAll('.panel-head .section-more,.panel-head .mini-add,.panel-head button').forEach(b=>{if(!b.matches('[data-ct-r180-stats-toggle]'))b.classList.add('ct-r180-profile-button')});
}
function ctR180EnhanceProfile(d=profileCache||{}){ctR180ProfileStats(d);ctR180ProfileButtons()}
const ctR180PaintProfileBase=ct168PaintProfile;
ct168PaintProfile=function(d,note){ctR180PaintProfileBase(d,note);ctR180EnhanceProfile(d)};
const ctR180RenderProfileBase=renderProfile;
renderProfile=async function(seq){const out=await ctR180RenderProfileBase(seq);if(seq===navSeq&&route()==='profile')ctR180EnhanceProfile(profileCache||{});return out};
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct-r180-stats-toggle]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const body=document.querySelector('[data-ct-r180-stats-body]');if(!body)return;const next=!body.classList.contains('hidden');body.classList.toggle('hidden',next);b.setAttribute('aria-expanded',next?'false':'true');const span=b.querySelector('span'),icon=b.querySelector('b');if(span)span.textContent=next?'Expandir':'Recolher';if(icon)icon.textContent=next?'⌄':'⌃';try{localStorage.setItem(CT_R180_PROFILE_COLLAPSED,next?'1':'0')}catch{}
},true);

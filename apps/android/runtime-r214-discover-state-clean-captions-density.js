/* Android 0.99.7.42 — single-source Discover state + no explanatory captions + tighter Profile stats */
(() => {
'use strict';
if(window.__ctAndroidR214Loaded)return;
window.__ctAndroidR214Loaded=true;
window.__ctAndroidR214='discover-single-source-state-clean-captions-tighter-profile';
window.__ctAndroidDiscoverTabs='selected-tab-is-render-state-and-fetch-state';
window.__ctAndroidCaptions='remove-explanatory-copy-keep-data-labels';
window.__ctAndroidProfileStats='approved-order-ultra-compact';
window.__ctAndroidScope='android-only-no-web-change';

const tabs214=new Set(['foryou','top10','trending','popular','new','releases','anticipated','top','calendar']);
let ticket214=0;
function route214(name){try{return String(route())===name}catch{return String(location.pathname||'')==='/'+name}}
function tab214(v){v=String(v||'foryou');return tabs214.has(v)?v:'foryou'}
function railLeft214(){try{return Number(document.querySelector('[data-ct-r180-tabs]')?.scrollLeft||0)}catch{return 0}}
function restoreRail214(left){requestAnimationFrame(()=>{try{const r=document.querySelector('[data-ct-r180-tabs]');if(r)r.scrollLeft=Number(left||0)}catch{}})}

/* r180 still owns the exact approved rail markup/arrows, but it no longer owns selection.
   Selection is force-synchronised from discoverState.tab before the DOM is mounted. */
function rail214(selected){
  let raw='';
  try{raw=String(ctR180TabRail())}catch{}
  if(!raw){
    const labels={foryou:'Pra você',top10:'Top 10',trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais aguardados',top:'Melhores',calendar:'Calendário'};
    raw=`<div class="tabs" data-ct-r180-tabs>${[...tabs214].map(k=>`<button type="button" class="chip" data-discover-tab="${k}">${labels[k]}</button>`).join('')}</div>`;
  }
  try{
    const box=document.createElement('div');box.innerHTML=raw;
    box.querySelectorAll('[data-discover-tab]').forEach(b=>{
      const active=String(b.dataset.discoverTab||'')===selected;
      b.classList.toggle('active',active);b.classList.toggle('selected',active);
      b.setAttribute('aria-selected',active?'true':'false');
      if(active){b.dataset.ct214Active='1';b.setAttribute('aria-current','page')}else{delete b.dataset.ct214Active;b.removeAttribute('aria-current')}
    });
    return box.innerHTML;
  }catch{return raw}
}
function syncRail214(selected){
  try{document.querySelectorAll('[data-discover-tab]').forEach(b=>{const active=String(b.dataset.discoverTab||'')===selected;b.classList.toggle('active',active);b.classList.toggle('selected',active);b.setAttribute('aria-selected',active?'true':'false');if(active){b.dataset.ct214Active='1';b.setAttribute('aria-current','page')}else{delete b.dataset.ct214Active;b.removeAttribute('aria-current')}})}catch{}
}
function shell214(selected,left){
  discoverState.tab=selected;
  if(selected==='foryou')discoverState.type='all';
  const filters=selected==='foryou'?'':`<div class="filters ct-r180-type-filters">${ctR180FiltersHtml()}</div>`;
  setApp(shell('Descobrir','','discover',`<div class="page" data-discover>${rail214(selected)}${filters}<div data-discover-content>${loading('Carregando títulos...')}</div></div>`));
  syncRail214(selected);cleanExplanatory214();restoreRail214(left);
}
async function rows214(selected){
  if(selected==='foryou')return discoverRows('foryou');
  if(typeof ctR180StrictRows==='function')return ctR180StrictRows(selected);
  return discoverRows(selected);
}
async function selectTab214(value,opt={}){
  if(!route214('discover'))return false;
  const selected=tab214(value),left=Number.isFinite(opt.left)?opt.left:railLeft214(),my=++ticket214;
  discoverState.tab=selected;if(selected==='foryou')discoverState.type='all';
  if(opt.advanceNav!==false)++navSeq;
  const seq=navSeq;

  if(selected==='top10'&&typeof ctR180RenderTop10==='function'){
    /* Top 10 has its own approved multi-row renderer. State is set first and reasserted after it paints. */
    try{
      await ctR180RenderTop10(seq);
      if(my!==ticket214||!route214('discover')||tab214(discoverState.tab)!==selected)return true;
      discoverState.tab=selected;syncRail214(selected);cleanExplanatory214();restoreRail214(left);
    }catch(e){if(my===ticket214&&route214('discover')){const h=document.querySelector('[data-discover-content],[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}}
    return true;
  }

  shell214(selected,left);
  try{
    const rows=await rows214(selected);
    if(my!==ticket214||!route214('discover')||tab214(discoverState.tab)!==selected)return true;
    if(selected==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);
    discoverState.tab=selected;syncRail214(selected);cleanExplanatory214();restoreRail214(left);
  }catch(e){
    if(my!==ticket214||!route214('discover')||tab214(discoverState.tab)!==selected)return true;
    const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML=fail('Falha ao carregar Descobrir: '+(e?.message||e),'discover');
  }
  return true;
}
async function selectType214(value){
  if(!route214('discover'))return false;
  const selected=tab214(discoverState.tab);
  if(selected==='foryou'){discoverState.type='all';return true}
  let type=String(value||'all');if(!['all','movie','tv'].includes(type))type='all';
  discoverState.type=type;
  return selectTab214(selected,{advanceNav:true,left:railLeft214()});
}
window.ct214SelectDiscoverTab=selectTab214;
window.ct214SelectDiscoverType=selectType214;

/* Any normal app render while already on Discover uses the exact same controller instead of
   falling back to a legacy Discover renderer with a different active-tab state. */
try{
  const renderDiscoverBase214=renderDiscover;
  renderDiscover=async function(seq){
    if(!route214('discover'))return renderDiscoverBase214.apply(this,arguments);
    const selected=tab214(discoverState?.tab||'foryou');
    return selectTab214(selected,{advanceNav:false,left:railLeft214()});
  };
}catch{}

/* Remove only explanatory/helper prose. Keep card labels, numbers, dates, media metadata,
   buttons, errors and loading/status messages. */
const explanatory214=[
  /recomendações,\s*top\s*10/i,
  /estatísticas,\s*biblioteca,\s*favoritos/i,
  /baseado nos seus vistos/i,
  /priorizad[ao].*watchlist/i,
  /respeita histórico.*watchlist/i,
  /separado de filmes e séries/i,
  /o cache limpa apenas/i,
  /sem\s*\+?\s*watchlist\s*\+?\s*progresso/i,
  /sincroniza.*histórico.*watchlist/i,
  /use os filtros/i,
  /escolha.*aba/i
];
function helperNode214(el){
  if(!el||!el.matches)return false;
  if(el.closest('.card,.stat,.event,.sport-event,[data-media-card]'))return false;
  if(el.matches('.panel-head small,.section-head small,.panel-head p,.section-head p'))return true;
  return el.matches('small,p,.muted,.subtitle,.caption,.helper,.hint,.description,.panel-note,.section-note');
}
function cleanExplanatory214(){
  try{
    document.querySelectorAll('.panel-head small,.section-head small,.panel-head p,.section-head p').forEach(el=>{if(!el.closest('.stat,.card,.event'))el.remove()});
    document.querySelectorAll('small,p,.muted,.subtitle,.caption,.helper,.hint,.description,.panel-note,.section-note,div,span').forEach(el=>{
      if(!helperNode214(el)&&!el.className?.toString?.().match(/rule|notice|intro/i))return;
      const txt=String(el.textContent||'').replace(/\s+/g,' ').trim();if(!txt)return;
      if(explanatory214.some(rx=>rx.test(txt)))el.remove();
    });
    document.querySelectorAll('[data-discover]').forEach(root=>root.querySelectorAll('*').forEach(el=>{
      const txt=String(el.textContent||'').replace(/\s+/g,' ').trim();
      if(/^REGRA ATIVA\b/i.test(txt)&&el.children.length<=3){const target=el.closest('[class*="rule"],[class*="notice"],[class*="banner"]')||el;target.remove()}
    }));
  }catch{}
}
window.ct214CleanExplanatory=cleanExplanatory214;
try{const observer214=new MutationObserver(()=>requestAnimationFrame(cleanExplanatory214));observer214.observe(document.documentElement,{subtree:true,childList:true})}catch{}

/* Perfil: same approved order, only a little shorter vertically. */
function fmt214(v){return Number(v||0).toLocaleString('pt-BR')}
function seriesCount214(d,ss){try{const rows=typeof profileRows==='function'?profileRows(d):null;if(rows&&Array.isArray(rows.series))return rows.series.length}catch{}const explicit=Number(ss?.series_with_history??ss?.total_series??0);if(explicit>0)return explicit;return Math.max(0,Number(ss?.completed_series||0)+Number(ss?.in_progress_series||0))}
function card214(label,value,wide=false){
  const h=wide?'40px':'34px',font=wide?'19px':'16px';
  return `<div class="stat ct214-stat ${wide?'ct214-wide':''}" style="min-width:0!important;min-height:${h}!important;height:auto!important;padding:2px 3px!important;border-radius:9px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important;width:auto!important;max-width:none!important"><small style="font-size:7px!important;line-height:1!important;white-space:normal!important;margin:0!important">${esc(label)}</small><b style="font-size:${font}!important;line-height:1!important;margin-top:1px!important;white-space:nowrap!important">${value}</b></div>`
}
function row214(cols,cards){return `<div class="ct214-stat-row" style="display:grid!important;grid-template-columns:repeat(${cols},minmax(0,1fr))!important;gap:3px!important;width:100%!important;max-width:100%!important;min-width:0!important">${cards.join('')}</div>`}
function profileStats214(d=profileCache||{}){
  const root=document.querySelector('[data-profile]');if(!root)return;
  const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const collapsed=typeof ctR180StatsCollapsed==='function'?ctR180StatsCollapsed():false;
  const seriesCount=seriesCount214(d,ss),watchSeries=Math.max(0,Number(rem.watchlist_series??ss.not_started_series??0)),watchMovies=Math.max(0,Number(rem.watchlist_movies??ss.watchlist_movies??0)),seriesWatchMinutes=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0)),movieWatchMinutes=Math.max(0,Number(rem.watchlist_movie_minutes??0));
  const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
  const body=[
    row214(3,[card214('Séries',fmt214(seriesCount)),card214('Episódios',fmt214(s.episodes_watched)),card214('Filmes',fmt214(s.movies_watched))]),
    row214(2,[card214('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),card214('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes))]),
    row214(1,[card214('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true)]),
    row214(2,[card214('Séries Watchlist',fmt214(watchSeries)),card214('Filmes Watchlist',fmt214(watchMovies))]),
    row214(1,[card214('Tempo total em Watchlist',ct166FmtMinutes(seriesWatchMinutes+movieWatchMinutes),true)])
  ].join('');
  panel.classList.add('ct-r180-stats-panel','ct214-stats-panel');panel.style.setProperty('padding','6px','important');
  panel.innerHTML=`<div class="panel-head ct-r180-stats-head" style="margin-bottom:2px!important;min-height:26px!important"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="ct214-stats-layout" style="display:flex!important;flex-direction:column!important;gap:3px!important;width:100%!important;max-width:100%!important;min-width:0!important">${body}</div></div>`;
}
try{ctR180ProfileStats=profileStats214}catch{}
try{const paintProfileBase214=ct168PaintProfile;ct168PaintProfile=function(d,note){const out=paintProfileBase214.apply(this,arguments);requestAnimationFrame(()=>{profileStats214(d||profileCache||{});cleanExplanatory214()});return out}}catch{}

const style214=document.createElement('style');style214.id='ct-android-099742';style214.textContent=`
[data-page="discover"] [data-discover-tab][data-ct214-active="1"]{background:var(--accent,#0f6f99)!important;border-color:rgba(76,190,240,.62)!important;color:#fff!important}
[data-page="discover"] [data-ct-r180-tabs]>.chip{pointer-events:auto!important}
[data-profile] .ct214-stats-panel{padding:6px!important}
[data-profile] .ct214-stat-row{gap:3px!important}
[data-profile] [data-profile-sports-panel] .stats{gap:3px!important}
[data-profile] [data-profile-sports-panel] .stat{min-height:36px!important;padding:2px 3px!important}
[data-profile] [data-profile-sports-panel] .stat small{font-size:7px!important;line-height:1!important}
[data-profile] [data-profile-sports-panel] .stat b{font-size:16px!important;line-height:1!important;margin-top:1px!important}
`;
document.getElementById(style214.id)?.remove();document.head.appendChild(style214);
requestAnimationFrame(()=>{if(route214('profile'))profileStats214(profileCache||{});cleanExplanatory214()});
})();
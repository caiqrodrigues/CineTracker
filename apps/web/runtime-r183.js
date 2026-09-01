/* r183 — Web-only: cabeçalhos limpos + Perfil reorganizado + extras recolhíveis */
window.__ctR183='web-clean-headers-profile-reflow';
window.__ct183Headers='remove-redundant-page-title-copy-preserve-back';
window.__ct183Profile='four-column-balanced-stats-wide-totals';
window.__ct183ExtraStats='collapsible-sports-extra-statistics';

/* ---------- Cabeçalhos Web ----------
 * Remove apenas o bloco redundante "CineTracker / nome da tela / descrição".
 * O botão global Voltar da r169 é preservado quando existir.
 */
function ctR183CleanHeader(){
  const head=document.querySelector('.content>.header');if(!head)return;
  [...head.children].forEach(el=>{if(!el.matches?.('[data-ct169-back]'))el.remove()});
  const back=head.querySelector('[data-ct169-back]');
  if(back)head.classList.add('ct-r183-back-only');
  else head.remove();
}
const ctR183SetAppBase=setApp;
setApp=function(markup){
  const out=ctR183SetAppBase(markup);
  /* r169 injeta Voltar no primeiro RAF; limpamos no RAF seguinte. */
  requestAnimationFrame(()=>requestAnimationFrame(ctR183CleanHeader));
  return out;
};
window.addEventListener('popstate',()=>requestAnimationFrame(()=>requestAnimationFrame(ctR183CleanHeader)));

/* ---------- Perfil: grade desktop balanceada ---------- */
function ctR183ProfileStats(d=profileCache||{}){
  const root=$('[data-profile]');if(!root)return;
  const s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{};
  const seriesWatch=Math.max(0,Number(rem.watchlist_series_remaining_minutes??rem.series_remaining_minutes??0));
  const movieWatch=Math.max(0,Number(rem.watchlist_movie_minutes??0));
  const collapsed=ctR180StatsCollapsed();
  const panel=[...root.querySelectorAll('section.panel')].find(p=>p.querySelector('.panel-head h2')?.textContent?.trim()==='Estatísticas');if(!panel)return;
  const cards=[
    ctR180StatCard('Episódios',Number(s.episodes_watched||0).toLocaleString('pt-BR')),
    ctR180StatCard('Filmes',Number(s.movies_watched||0).toLocaleString('pt-BR')),
    ctR180StatCard('Séries Watchlist',Number(rem.watchlist_series??ss.not_started_series??0).toLocaleString('pt-BR')),
    ctR180StatCard('Filmes Watchlist',Number(rem.watchlist_movies??ss.watchlist_movies??0).toLocaleString('pt-BR')),
    ctR180StatCard('Tempo total de tela',ct166FmtMinutes(s.total_minutes),true),
    ctR180StatCard('Tempo total em Watchlist',ct166FmtMinutes(seriesWatch+movieWatch),true),
    ctR180StatCard('Tempo em Séries',ct166FmtMinutes(s.series_minutes)),
    ctR180StatCard('Tempo em Filmes',ct166FmtMinutes(s.movie_minutes)),
    ctR180StatCard('Tempo de série em Watchlist',ct166FmtMinutes(seriesWatch)),
    ctR180StatCard('Tempo de filme em Watchlist',ct166FmtMinutes(movieWatch))
  ].join('');
  panel.classList.add('ct-r180-stats-panel','ct-r183-stats-panel');
  panel.innerHTML=`<div class="panel-head ct-r180-stats-head"><h2>Estatísticas</h2><button type="button" class="ct-r180-stats-toggle" data-ct-r180-stats-toggle aria-expanded="${collapsed?'false':'true'}"><span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b></button></div><div class="ct-r180-stats-body ${collapsed?'hidden':''}" data-ct-r180-stats-body><div class="stats ct-r180-stats-grid ct-r183-stats-grid">${cards}</div></div>`;
}
ctR180ProfileStats=ctR183ProfileStats;

/* ---------- Estatísticas extras / Esportes assistidos ---------- */
const CT_R183_EXTRA_COLLAPSED='ct:r183:profile:extra-stats-collapsed';
function ctR183ExtraCollapsed(){try{return localStorage.getItem(CT_R183_EXTRA_COLLAPSED)==='1'}catch{return false}}
function ctR183FindExtraPanel(root){
  return [...root.querySelectorAll('section.panel')].find(p=>{
    const title=p.querySelector('.panel-head h2,.panel-head h3')?.textContent?.trim().toLowerCase()||'';
    return title==='esportes assistidos'||title==='estatísticas extras'||title==='estatisticas extras';
  })||null;
}
function ctR183ExtraStats(){
  const root=$('[data-profile]');if(!root)return;
  const panel=ctR183FindExtraPanel(root);if(!panel)return;
  panel.classList.add('ct-r183-extra-stats-panel');
  let head=panel.querySelector(':scope>.panel-head');if(!head)return;
  head.classList.add('ct-r183-extra-head');
  let button=head.querySelector('[data-ct-r183-extra-toggle]');
  if(!button){
    button=document.createElement('button');button.type='button';button.className='ct-r183-extra-toggle';button.dataset.ctR183ExtraToggle='1';head.appendChild(button);
  }
  let body=panel.querySelector(':scope>.ct-r183-extra-stats-body');
  if(!body){
    body=document.createElement('div');body.className='ct-r183-extra-stats-body';
    [...panel.children].filter(el=>el!==head).forEach(el=>body.appendChild(el));
    panel.appendChild(body);
  }
  const collapsed=ctR183ExtraCollapsed();
  body.classList.toggle('hidden',collapsed);button.setAttribute('aria-expanded',collapsed?'false':'true');button.innerHTML=`<span>${collapsed?'Expandir':'Recolher'}</span><b>${collapsed?'⌄':'⌃'}</b>`;
}

const ctR183EnhanceProfileBase=ctR180EnhanceProfile;
ctR180EnhanceProfile=function(d=profileCache||{}){
  ctR183EnhanceProfileBase(d);
  ctR183ExtraStats();
  requestAnimationFrame(ctR183ExtraStats);
};

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct-r183-extra-toggle]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  const collapsed=b.getAttribute('aria-expanded')==='true';
  try{localStorage.setItem(CT_R183_EXTRA_COLLAPSED,collapsed?'1':'0')}catch{}
  ctR183ExtraStats();
},true);

/* Tela já restaurada de cache/snapshot. */
setTimeout(()=>{ctR183CleanHeader();if(route()==='profile'){ctR183ProfileStats(profileCache||{});ctR183ExtraStats()}},0);

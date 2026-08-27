(() => {
'use strict';
if (window.__ct0994WebLoaded) return;
window.__ct0994WebLoaded = true;
window.__ctWebBuild = '0.99.4';

const stableLegacyNavigate = window.ct991Navigate || window.ct0992Navigate || window.ct98Navigate;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
const fmt=min=>{min=Math.max(0,Number(min||0));const d=Math.floor(min/1440),h=Math.floor((min%1440)/60),m=Math.round(min%60);return [d?`${d}d`:null,h?`${h}h`:null,m||(!d&&!h)?`${m}min`:null].filter(Boolean).join(' ')};
const NAV=[['home','⌂ Home','Home'],['discover','✦ Descobrir','Descobrir'],['profile','◉ Perfil','Perfil'],['settings','⚙ Configurações','Config.']];

const runtimeStyle=document.createElement('style');
runtimeStyle.id='ct0994-runtime-style';
runtimeStyle.textContent=`
.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct95-version,.ct94-version,.ct93-version,.ct92-version,.ct91-version,.ct90-version,.ct89-version,.ct-version-footer,#ct56-version{display:none!important}
.ct994-version{text-align:center;color:#6f8798;font-size:11px;margin:28px 0 8px}
.sidebar [data-view="history"],.sidebar [data-view99="history"],.sidebar [data-view991="history"],.mobile-nav [data-view="history"],.mobile-nav [data-view99="history"],.mobile-nav [data-view991="history"]{display:none!important;pointer-events:none!important}
@media (min-width:851px){
 .app{position:relative!important;isolation:isolate!important;grid-template-columns:180px minmax(0,1fr)!important}
 .sidebar{position:sticky!important;top:0!important;z-index:9999!important;pointer-events:auto!important;overflow:visible!important}
 .sidebar .nav{position:relative!important;z-index:10000!important;pointer-events:auto!important}
 .sidebar .nav button,.sidebar .nav a,.sidebar-item{position:relative!important;z-index:10001!important;pointer-events:auto!important;cursor:pointer!important}
 .content{position:relative!important;z-index:1!important;min-width:0!important}
}
.sidebar,.sidebar .nav,.sidebar button,.sidebar a,.mobile-nav,.mobile-nav button,.mobile-nav a{pointer-events:auto!important}
.sidebar button,.sidebar a,.mobile-nav button,.mobile-nav a{cursor:pointer!important}
.ct994-more{display:flex;justify-content:center;margin:14px 0 4px}
.ct994-more button{border:1px solid #315b75;background:#0d2230;color:#eaf7ff;border-radius:10px;padding:9px 13px;cursor:pointer;pointer-events:auto!important}
`;
document.getElementById(runtimeStyle.id)?.remove();
document.head.appendChild(runtimeStyle);

let payload994=null;
let busy994=null;
let tab994='series';
let movieLimit994=120;
let route994='home';
let renderSeq994=0;

function setView994(target){
  route994=target==='history'?'profile':target;
  try{view=route994}catch{}
  try{window.view=route994}catch{}
}
function active994(){
  let v=route994||'home';
  try{v=String(typeof view!=='undefined'?view:window.view||v)}catch{}
  return v==='history'?'profile':v;
}
function navButtons994(active,mobile=false){
  return NAV.map(([v,desk,mob])=>`<button type="button" data-view="${v}" class="${active===v?'active':''}"${active===v?' aria-current="page"':''}>${mobile?mob:desk}</button>`).join('');
}
function shell994(title,subtitle,content,active){
  return `<div class="app"><aside class="sidebar"><div class="logo">CINE<span class="gold">TRACKER</span></div><div class="muted small">Filmes, séries e animes</div><div class="nav">${navButtons994(active,false)}</div><div class="profile"><div class="small muted">Conta sincronizada</div><button class="logout-btn btn-secondary" type="button" onclick="signOut().then(()=>renderAuth())">Sair</button></div></aside><main class="content"><header class="header"><div><div class="eyebrow">CineTracker</div><h1 class="h1">${esc(title)}</h1><p class="subtitle">${esc(subtitle)}</p></div></header>${content}<div class="ct994-version">CineTracker • v0.99.4</div><nav class="mobile-nav">${navButtons994(active,true)}</nav></main></div>`;
}
function cleanupNav994(){
  $$('.sidebar .nav button,.sidebar .nav a,.mobile-nav button,.mobile-nav a').forEach(el=>{
    const target=String(el.dataset.view||el.dataset.view99||el.dataset.view991||'').toLowerCase();
    const text=String(el.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(target==='history'||text.includes('historico'))el.remove();
  });
  const active=active994();
  $$('.sidebar .nav button,.mobile-nav button').forEach(el=>{
    const target=String(el.dataset.view||el.dataset.view99||el.dataset.view991||'');
    const on=target===active;
    el.classList.toggle('active',on);
    if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
}
function footer994(){
  const host=$('.content');if(!host)return;
  $$('.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct95-version,.ct94-version,.ct93-version,.ct92-version,.ct91-version,.ct90-version,.ct89-version,.ct-version-footer,#ct56-version',host).forEach(x=>x.style.display='none');
  let f=$('.ct994-version',host);if(!f){f=document.createElement('div');f.className='ct994-version';host.appendChild(f)}
  f.textContent='CineTracker • v0.99.4';
}
function settle994(){
  cleanupNav994();footer994();
  if(active994()==='profile')void patchProfile994();
}

async function load994(force=false){
  if(payload994&&!force)return payload994;
  if(busy994)return busy994;
  busy994=(async()=>{
    const p=await sbRpc('cinetracker_profile_home_payload_v0994',{});
    payload994=p||{series:[],movie_watchlist:[],history_episodes:[],history_movies:[]};
    return payload994;
  })().finally(()=>busy994=null);
  return busy994;
}
function rowSeries994(x){
  const rel=Number(x.released_episodes||0),seen=Number(x.watched_episodes||0),missing=Math.max(0,rel-seen),last=x.last_watched_at?new Date(x.last_watched_at).toLocaleDateString('pt-BR'):'Sem atividade';
  return `<div class="ct992-row" data-ct994-open="${x.media_id}"><div class="ct992-poster"${x.poster_path?` style="background-image:url('${img(x.poster_path)}')"`:''}></div><div class="ct992-info"><div class="ct992-title">${esc(x.title)}</div><div class="ct992-meta">${seen}/${rel||'?'} · Faltam ${missing}</div><div class="ct992-sub">${esc(last)}</div></div></div>`;
}
function rowMovie994(x){
  const runtime=Number(x.runtime_minutes||0);
  return `<div class="ct992-row" data-ct994-open="${x.media_id}"><div class="ct992-poster"${x.poster_path?` style="background-image:url('${img(x.poster_path)}')"`:''}></div><div class="ct992-info"><div class="ct992-title">${esc(x.title)}</div><div class="ct992-meta">${x.release_year||'—'}${runtime?` · ${runtime} min`:''}</div><div class="ct992-sub">${esc(x.overview||'Metadados sendo atualizados.')}</div></div><button class="ct992-check" type="button" data-ct994-mark-movie="${x.media_id}" title="Marcar como visto">✓</button></div>`;
}
function histEpisode994(h){
  return `<div class="ct992-row"><div class="ct992-poster"${h.poster_path?` style="background-image:url('${img(h.poster_path)}')"`:''}></div><div class="ct992-info"><div class="ct992-title">${esc(h.media_title||h.title||'Série')}</div><div class="ct992-meta">S${String(h.season_number??0).padStart(2,'0')} E${String(h.episode_number??0).padStart(2,'0')}</div><div class="ct992-sub">${h.watched_at?new Date(h.watched_at).toLocaleString('pt-BR'):''}</div></div><span class="ct992-badge">✓</span></div>`;
}
function histMovie994(h){
  return `<div class="ct992-row"><div class="ct992-poster"${h.poster_path?` style="background-image:url('${img(h.poster_path)}')"`:''}></div><div class="ct992-info"><div class="ct992-title">${esc(h.media_title||h.title||'Filme')}</div><div class="ct992-meta">${Number(h.plays||1)>1?`x${Number(h.plays)}`:'Visto'}</div><div class="ct992-sub">${h.watched_at?new Date(h.watched_at).toLocaleString('pt-BR'):''}</div></div><span class="ct992-badge">✓</span></div>`;
}
function section994(title,rows,renderer,count=rows.length){
  return `<section class="ct992-section ct992-section-anchor"><div class="ct992-head"><h3>${title}</h3><span class="ct992-count">${Number(count).toLocaleString('pt-BR')}</span></div><div class="ct992-stack">${rows.length?rows.map(renderer).join(''):'<div class="ct992-empty">Nenhum item nesta seção.</div>'}</div></section>`;
}
function buckets994(p){
  const s=Array.isArray(p.series)?p.series:[];
  return {cont:s.filter(x=>x.home_bucket==='continue'),dust:s.filter(x=>x.home_bucket==='dust'),up:s.filter(x=>x.home_bucket==='up_to_date'),watch:s.filter(x=>x.home_bucket==='not_started'),done:s.filter(x=>x.home_bucket==='completed')};
}
function homeBody994(p){
  const g=buckets994(p);
  if(tab994==='series'){
    return `<div class="ct992-history"><div class="ct992-history-hint">Histórico oculto · puxe para baixo para revelar</div><div class="ct992-stack">${(p.history_episodes||[]).map(histEpisode994).join('')||'<div class="ct992-empty">Nenhum episódio no histórico.</div>'}</div></div><div class="ct992-start"><div class="ct992-pull-label">↑ Histórico acima</div>${section994('Assistir a seguir',g.cont,rowSeries994)}${section994('Juntando poeira',g.dust,rowSeries994)}${section994('Em dia',g.up,rowSeries994)}${section994('Não Iniciadas / Watchlist',g.watch,rowSeries994)}${section994('Concluídas',g.done,rowSeries994)}</div>`;
  }
  const all=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],visible=all.slice(0,movieLimit994),remaining=Math.max(0,all.length-visible.length);
  return `<div class="ct992-history"><div class="ct992-history-hint">Vistos ocultos · puxe para baixo para revelar</div><div class="ct992-stack">${(p.history_movies||[]).map(histMovie994).join('')||'<div class="ct992-empty">Nenhum filme no histórico.</div>'}</div></div><div class="ct992-start"><div class="ct992-pull-label">↑ Vistos acima</div>${section994('Assistir a seguir / Watchlist',visible,rowMovie994,all.length)}${remaining?`<div class="ct994-more"><button type="button" data-ct994-more>Mostrar mais (${remaining.toLocaleString('pt-BR')} restantes)</button></div>`:''}</div>`;
}
function bindHome994(root){
  $$('[data-ct994-tab]',root).forEach(b=>b.onclick=async e=>{e.preventDefault();e.stopPropagation();tab994=b.dataset.ct994Tab;movieLimit994=120;await renderHome994(false)});
  $$('[data-ct994-open]',root).forEach(el=>el.onclick=e=>{
    if(e.target.closest('[data-ct994-mark-movie]'))return;
    const id=Number(el.dataset.ct994Open),all=[...(payload994?.series||[]),...(payload994?.movie_watchlist||[])],row=all.find(x=>Number(x.media_id)===id);if(!row)return;
    const tmdb=Number(row.tmdb_id||0),open=window.ct92OpenMedia||window.ct91OpenMedia;
    if(tmdb>0&&typeof open==='function')open(row.media_type||'movie',tmdb);
  });
  $$('[data-ct994-mark-movie]',root).forEach(b=>b.onclick=async e=>{
    e.preventDefault();e.stopPropagation();b.disabled=true;
    try{
      const id=Number(b.dataset.ct994MarkMovie),row=(payload994?.movie_watchlist||[]).find(x=>Number(x.media_id)===id);
      await sbRpc('cinetracker_mark_watch_v0994',{p_media_id:id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:row?.title||null,p_runtime_minutes:Number(row?.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
      payload994=null;await renderHome994(true);
      window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'web-0.99.4-movie'}}));
    }catch(err){console.error('[CineTracker 0.99.4] mark movie',err)}finally{b.disabled=false}
  });
  const more=$('[data-ct994-more]',root);if(more)more.onclick=async e=>{e.preventDefault();e.stopPropagation();movieLimit994+=120;await renderHome994(false)};
}
async function renderHome994(force=false){
  const seq=++renderSeq994;setView994('home');
  const app=$('#app');if(!app)return false;
  app.innerHTML=shell994('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.',`<div class="ct992-shell" id="ct994-home-root"><div class="ct992-empty">Sincronizando Home…</div></div>`,'home');
  settle994();
  const root=$('#ct994-home-root');
  try{
    const p=await load994(force);if(seq!==renderSeq994||active994()!=='home'||!document.body.contains(root))return false;
    root.innerHTML=`<div class="ct992-tabs"><button type="button" class="ct992-tab ${tab994==='series'?'active':''}" data-ct994-tab="series">Séries</button><button type="button" class="ct992-tab ${tab994==='movies'?'active':''}" data-ct994-tab="movies">Filmes</button></div><div id="ct994-viewport" class="ct992-viewport">${homeBody994(p)}</div>`;
    bindHome994(root);settle994();
    requestAnimationFrame(()=>{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist)vp.scrollTop=hist.offsetHeight});
    return true;
  }catch(err){
    if(root&&document.body.contains(root))root.innerHTML=`<div class="ct992-empty">Falha ao sincronizar Home: ${esc(err?.message||err)}</div>`;
    console.error('[CineTracker 0.99.4] home',err);return false;
  }
}
async function patchProfile994(){
  const host=$('#ct991-profile');if(!host||host.dataset.ct994Metrics==='loading')return;
  host.dataset.ct994Metrics='loading';
  try{
    const r=await sbRpc('cinetracker_profile_remaining_v0994',{}),m=Array.isArray(r)?r[0]:r;if(!m){host.dataset.ct994Metrics='ready';return}
    for(const stat of $$('.ct991-stat',host)){
      const label=$('.l',stat)?.textContent?.trim(),val=$('.v',stat);if(!val)continue;
      if(label==='Filmes na Watchlist')val.textContent=Number(m.watchlist_movies||0).toLocaleString('pt-BR');
      if(label==='Tempo p/ séries em dia')val.textContent=fmt(m.series_remaining_minutes);
      if(label==='Tempo p/ filmes em dia')val.textContent=fmt(m.watchlist_movie_minutes);
    }
    host.dataset.ct994Metrics='ready';
  }catch(err){host.dataset.ct994Metrics='error';console.error('[CineTracker 0.99.4] profile metrics',err)}
}
async function navigate994(requested){
  const target=requested==='history'?'profile':String(requested||'home');
  if(!['home','discover','profile','settings'].includes(target))return false;
  setView994(target);
  if(target==='home')return renderHome994(false);
  if(typeof stableLegacyNavigate!=='function')return false;
  try{await Promise.resolve(stableLegacyNavigate(target))}catch(err){console.error(`[CineTracker 0.99.4] legacy route ${target}`,err)}
  setView994(target);settle994();
  if(target==='profile')await patchProfile994();
  setTimeout(settle994,60);setTimeout(settle994,220);
  return true;
}

window.__ct0994Navigate=navigate994;
window.ct0994Navigate=navigate994;
window.ct0992Navigate=navigate994;
window.ct991Navigate=navigate994;
window.ct98Navigate=navigate994;

window.addEventListener('cinetracker:data-changed',()=>{
  payload994=null;
  if(active994()==='home')void renderHome994(true);
  else if(active994()==='profile')void patchProfile994();
});

/* Old 0.99.2 has one bounded late route call at startup. Reassert the selected 0.99.4 route after it. */
for(const delay of [0,180,820,1100])setTimeout(()=>{
  if(!document.querySelector('#app .app'))return;
  const target=active994();
  if(target==='home')void renderHome994(false);else{settle994();if(target==='profile')void patchProfile994()}
},delay);
})();

(() => {
'use strict';
if (window.__ct99ProfileLRU) return;
window.__ct99ProfileLRU = true;
window.__ct99Version = '0.0.99';
const VERSION99 = '0.0.99';
const $99 = (s,r=document) => r.querySelector(s);
const $$99 = (s,r=document) => [...r.querySelectorAll(s)];
const esc99 = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img99 = (p,size='w500') => p ? `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}` : '';

const style99=document.createElement('style');
style99.id='ct99-profile-style';
style99.textContent=`
.ct98-version,.ct95-version,.ct94-version,.ct93-version,.ct92-version,.ct91-version,.ct90-version,.ct89-version,.ct-version-footer,#ct56-version{display:none!important}
.ct99-version{text-align:center;color:#6f8798;font-size:11px;margin:28px 0 8px}
.ct99-profile{max-width:1120px;margin:0 auto;display:grid;gap:18px}
.ct99-mainstats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}
.ct99-stat{border:1px solid #203b4e;background:linear-gradient(145deg,#091219,#0c1720);border-radius:13px;padding:10px;text-align:center;min-width:0}
.ct99-stat .l{font-size:9px;color:#8ea5b6;text-transform:uppercase;letter-spacing:.05em}.ct99-stat .v{font-size:17px;font-weight:800;margin-top:4px;line-height:1.2}.ct99-stat .s{font-size:9px;color:#7890a1;margin-top:3px}
.ct99-carousels{display:grid;gap:18px}.ct99-section{min-width:0}.ct99-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.ct99-head-btn{border:0;background:transparent;color:#f1f8fc;font-size:17px;font-weight:850;padding:0;cursor:pointer;text-align:left}.ct99-head-btn:hover{color:#73c9f5}.ct99-head small{color:#7890a1;font-size:10px}
.ct99-carousel{display:grid;grid-auto-flow:column;grid-auto-columns:150px;gap:11px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 1px 9px;overscroll-behavior-inline:contain}
.ct99-card{position:relative;scroll-snap-align:start;border:1px solid #203b4e;background:#0b1218;border-radius:14px;overflow:hidden;color:#fff;text-align:left;padding:0;cursor:pointer;min-width:0;box-shadow:0 8px 28px #00000022}.ct99-card:hover{border-color:#4b8eb6;transform:translateY(-1px)}
.ct99-poster{aspect-ratio:2/3;background:#101b23 center/cover no-repeat;position:relative}.ct99-fav{position:absolute;top:7px;right:7px;background:#071018dd;border:1px solid #ee6e91;color:#ff91ae;border-radius:999px;padding:4px 7px;font-size:11px;font-weight:900;box-shadow:0 3px 14px #0008}
.ct99-card-body{padding:8px}.ct99-card-body b{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct99-progress{font-size:10px;color:#91a8b7;margin-top:5px}.ct99-progress.ok{color:#8ce5ad}.ct99-lru{font-size:8px;color:#607888;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct99-panel{border:1px solid #203b4e;background:radial-gradient(circle at 15% 0,#12304766,transparent 36%),linear-gradient(145deg,#071017,#0b151d);border-radius:16px;padding:14px;box-shadow:inset 0 1px 0 #ffffff08}.ct99-panel-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:10px}.ct99-panel-head h3{margin:0}.ct99-panel-head small{color:#7890a1}
.ct99-chart{height:220px;overflow:hidden;border-radius:12px;background:linear-gradient(180deg,#0c1d2a,#071018);position:relative}.ct99-chart:before{content:'';position:absolute;inset:0;background:linear-gradient(#3e76941a 1px,transparent 1px),linear-gradient(90deg,#3e76941a 1px,transparent 1px);background-size:100% 25%,10% 100%}.ct99-chart svg{position:absolute;inset:12px;width:calc(100% - 24px);height:calc(100% - 24px);overflow:visible}
.ct99-extra{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}
.ct99-collection{max-width:1120px;margin:0 auto;display:grid;gap:18px}.ct99-back{border:1px solid #315b76;background:#0b1720;color:#f0f7fb;border-radius:10px;padding:9px 12px;cursor:pointer;width:max-content}.ct99-category{border:1px solid #203646;background:#091219;border-radius:15px;padding:13px}.ct99-category h3{margin:0 0 11px}.ct99-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:11px}.ct99-grid.favorites{grid-template-columns:repeat(3,minmax(0,1fr));max-width:760px}.ct99-grid .ct99-card{width:100%}.ct99-empty{border:1px dashed #27485e;border-radius:12px;padding:16px;color:#7892a4;font-size:12px}
.ct99-local-overlay{position:fixed;inset:0;z-index:900000;background:#02070cf2;overflow:auto;padding:20px}.ct99-local-wrap{max-width:720px;margin:auto}.ct99-local-card{border:1px solid #28465a;background:#08131b;border-radius:16px;padding:16px;display:grid;grid-template-columns:180px 1fr;gap:16px}.ct99-local-poster{aspect-ratio:2/3;border-radius:12px;background:#101b23 center/cover no-repeat}.ct99-local-meta{color:#8fa6b5;font-size:12px;line-height:1.6}
@media(max-width:900px){.ct99-mainstats,.ct99-extra{grid-template-columns:repeat(3,minmax(0,1fr))}.ct99-grid.favorites{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.ct99-mainstats,.ct99-extra{grid-template-columns:repeat(2,minmax(0,1fr))}.ct99-carousel{grid-auto-columns:132px}.ct99-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ct99-grid.favorites{grid-template-columns:repeat(2,minmax(0,1fr))}.ct99-local-card{grid-template-columns:110px 1fr}.ct99-head-btn{font-size:15px}}
`;
document.head.appendChild(style99);

function setView99(v){try{view=v}catch{}try{window.view=v}catch{}}
function nav99(v,label,active){return `<button data-view99="${v}" class="${active===v?'active':''}">${label}</button>`}
function shell99(title,subtitle,content,active='profile'){
  return `<div class="app"><aside class="sidebar"><div class="logo">CINETRACKER</div><nav class="nav">${nav99('home','⌂ Home',active)}${nav99('discover','✦ Descobrir',active)}${nav99('profile','◉ Perfil',active)}${nav99('settings','⚙ Configurações',active)}</nav></aside><main class="content"><h1 class="ct54-title">${esc99(title)}</h1><p class="ct54-sub">${esc99(subtitle)}</p>${content}<nav class="mobile-nav">${nav99('home','Home',active)}${nav99('discover','Descobrir',active)}${nav99('profile','Perfil',active)}${nav99('settings','Config.',active)}</nav><div class="ct99-version">CineTracker • v0.0.99</div></main></div>`;
}
function bindNav99(root=document){
  $$99('[data-view99]',root).forEach(b=>b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();window.ct98Navigate?.(b.dataset.view99)});
}
function fmt99(minutes){let h=Math.max(0,Math.floor(Number(minutes||0)/60)),m=Math.floor(h/720);h-=m*720;const d=Math.floor(h/24);h-=d*24;return `${m} ${m===1?'mês':'meses'} ${d} ${d===1?'dia':'dias'} ${h} ${h===1?'hora':'horas'}`}
function lru99(a,b){const ad=Date.parse(a.last_watched_at||'')||0,bd=Date.parse(b.last_watched_at||'')||0;return bd-ad||Number(b.media_id||0)-Number(a.media_id||0)}
function sorted99(rows){return [...rows].sort(lru99)}
function progress99(x){
  if(x.media_type==='movie')return x.is_seen?{text:'Visto ✓',ok:true}:{text:x.is_watchlist?'Na Watchlist':'Não visto',ok:false};
  const seen=Number(x.watched_episodes||0),total=Number(x.total_episodes||0);
  if(total>0)return {text:`${seen}/${total}`,ok:x.is_completed||seen>=total};
  if(x.is_completed)return {text:`${seen||'—'} episódios · Concluída ✓`,ok:true};
  if(x.is_up_to_date)return {text:`${seen||'—'} episódios · Em dia ✓`,ok:true};
  return {text:seen?`${seen} episódios`:'Não iniciada',ok:false};
}
function lastLabel99(x){if(!x.last_watched_at)return 'Sem reprodução registrada';try{return `Última atividade: ${new Date(x.last_watched_at).toLocaleDateString('pt-BR')}`}catch{return ''}}
function card99(x){
  const p=progress99(x),fav=x.is_favorite?'<span class="ct99-fav" title="Favorito">♥</span>':'';
  return `<button class="ct99-card" data-card99 data-media-id="${Number(x.media_id||0)}"><div class="ct99-poster"${x.poster_path?` style="background-image:url('${img99(x.poster_path,'w342')}')"`:''}>${fav}</div><div class="ct99-card-body"><b>${esc99(x.title||'Sem título')}</b><div class="ct99-progress ${p.ok?'ok':''}">${esc99(p.text)}</div><div class="ct99-lru">${esc99(lastLabel99(x))}</div></div></button>`;
}
function chart99(rows){
  const data=Array.isArray(rows)?rows.slice(-30):[];if(!data.length)return '<div class="ct99-empty">Sem atividade registrada no período.</div>';
  const w=900,h=210,pad=15,max=Math.max(1,...data.map(x=>Number(x.plays||0))),pts=data.map((x,i)=>[pad+(w-pad*2)*(data.length===1?.5:i/(data.length-1)),h-pad-(h-pad*2)*(Number(x.plays||0)/max)]),line=pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' '),area=`${pad},${h-pad} ${line} ${pts[pts.length-1][0].toFixed(1)},${h-pad}`;
  const dots=pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.8"><title>${esc99(String(data[i].day||''))}: ${Number(data[i].plays||0)} reproduções</title></circle>`).join('');
  return `<div class="ct99-chart"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="ct99g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55b8ec" stop-opacity=".38"/><stop offset="1" stop-color="#55b8ec" stop-opacity=".02"/></linearGradient></defs><polygon points="${area}" fill="url(#ct99g)"/><polyline points="${line}" fill="none" stroke="#67c5f4" stroke-width="4" vector-effect="non-scaling-stroke"/><g fill="#c4edff" stroke="#091720" stroke-width="2">${dots}</g></svg></div>`;
}

let dashboard99=[];
let stats99={};
let seriesStats99={};
let daily99=[];
let currentCollection99=null;
let requestSeq99=0;
async function fetch99(){
  const seq=++requestSeq99;
  const [st,ss,daily,dash]=await Promise.all([
    sbRpc('cinetracker_profile_stats',{}).catch(()=>({})),
    sbRpc('cinetracker_series_state_stats',{}).catch(()=>({})),
    sbRpc('cinetracker_consumption_daily',{p_limit_days:30}).catch(()=>[]),
    sbRpc('cinetracker_profile_media_dashboard',{}).catch(()=>[])
  ]);
  if(seq!==requestSeq99)return null;
  stats99=Array.isArray(st)?st[0]||{}:st||{};
  seriesStats99=Array.isArray(ss)?ss[0]||{}:ss||{};
  daily99=Array.isArray(daily)?daily:[];
  dashboard99=sorted99(Array.isArray(dash)?dash:[]);
  return dashboard99;
}
function find99(id){return dashboard99.find(x=>Number(x.media_id)===Number(id))}
function openLocal99(x){
  const p=progress99(x),o=document.createElement('div');o.className='ct99-local-overlay';o.innerHTML=`<div class="ct99-local-wrap"><button class="ct99-back" data-close99>← Voltar</button><div class="ct99-local-card"><div class="ct99-local-poster"${x.poster_path?` style="background-image:url('${img99(x.poster_path,'w500')}')"`:''}></div><div><h2>${esc99(x.title||'Sem título')}</h2><div class="ct99-local-meta">${x.media_type==='movie'?'Filme':'Série'}<br>${esc99(p.text)}<br>${x.is_favorite?'♥ Favorito<br>':''}${x.is_in_progress?'Em andamento<br>':''}${x.is_up_to_date?'Em dia<br>':''}${x.is_completed?'Concluída<br>':''}${x.is_watchlist?'Watchlist / Assistir mais tarde<br>':''}${esc99(lastLabel99(x))}</div></div></div></div>`;document.body.appendChild(o);$99('[data-close99]',o).onclick=()=>o.remove();o.addEventListener('click',e=>{if(e.target===o)o.remove()});
}
function open99(x){
  if(!x)return;const id=Number(x.tmdb_id||0);if(id>0){const fn=window.ct92OpenMedia||window.ct91OpenMedia;if(typeof fn==='function'){fn(x.media_type,id);return}}
  openLocal99(x);
}
function bindCards99(root=document){$$99('[data-card99]',root).forEach(b=>b.onclick=()=>open99(find99(b.dataset.mediaId)))}
function carouselSection99(key,label,rows){const visible=sorted99(rows).slice(0,24);return `<section class="ct99-section"><div class="ct99-head"><button class="ct99-head-btn" data-expand99="${key}">${esc99(label)} ›</button><small>${rows.length.toLocaleString('pt-BR')}</small></div><div class="ct99-carousel">${visible.map(card99).join('')||'<div class="ct99-empty">Nenhum título nesta seção.</div>'}</div></section>`}
function category99(label,rows,favorites=false){const items=sorted99(rows);return `<section class="ct99-category"><h3>${esc99(label)}</h3><div class="ct99-grid ${favorites?'favorites':''}">${items.map(card99).join('')||'<div class="ct99-empty">Nenhum título nesta categoria.</div>'}</div></section>`}

async function fillProfile99(){
  const host=$99('#ct99-profile');if(!host)return;host.innerHTML='<div class="ct99-empty">Sincronizando Perfil…</div>';
  try{
    await fetch99();if(!$99('#ct99-profile'))return;
    const s=stats99,ss=seriesStats99;
    const seriesRecent=dashboard99.filter(x=>x.media_type==='tv'&&(x.is_in_progress||x.is_seen));
    const seriesFav=dashboard99.filter(x=>x.media_type==='tv'&&x.is_favorite);
    const moviesRecent=dashboard99.filter(x=>x.media_type==='movie'&&x.is_seen);
    const moviesFav=dashboard99.filter(x=>x.media_type==='movie'&&x.is_favorite);
    host.innerHTML=`<div class="ct99-profile"><section><div class="ct99-mainstats"><div class="ct99-stat"><div class="l">Episódios</div><div class="v">${Number(s.episodes_watched||0).toLocaleString('pt-BR')}</div><div class="s">${Number(ss.history_series??s.series_watched??0).toLocaleString('pt-BR')} séries com histórico</div></div><div class="ct99-stat"><div class="l">Filmes</div><div class="v">${Number(s.movies_watched||0).toLocaleString('pt-BR')}</div></div><div class="ct99-stat"><div class="l">Tempo séries</div><div class="v">${fmt99(s.series_minutes||0)}</div></div><div class="ct99-stat"><div class="l">Tempo filmes</div><div class="v">${fmt99(s.movie_minutes||0)}</div></div><div class="ct99-stat"><div class="l">Tempo total</div><div class="v">${fmt99(s.total_minutes||0)}</div></div></div></section><div class="ct99-carousels">${carouselSection99('series','Séries',seriesRecent)}${carouselSection99('series-favorites','Séries favoritas',seriesFav)}${carouselSection99('movies','Filmes',moviesRecent)}${carouselSection99('movies-favorites','Filmes favoritos',moviesFav)}</div><section class="ct99-panel"><div class="ct99-panel-head"><h3>Atividade</h3><small>Últimos 30 dias · sincronizado</small></div>${chart99(daily99)}</section><section class="ct99-panel"><div class="ct99-panel-head"><h3>Estatísticas extras</h3><small>Estados atuais</small></div><div class="ct99-extra"><div class="ct99-stat"><div class="l">Concluídas</div><div class="v">${Number(ss.completed_series||0).toLocaleString('pt-BR')}</div></div><div class="ct99-stat"><div class="l">Em dia</div><div class="v">${Number(ss.up_to_date_series||0).toLocaleString('pt-BR')}</div></div><div class="ct99-stat"><div class="l">Em andamento</div><div class="v">${Number(ss.in_progress_series||0).toLocaleString('pt-BR')}</div></div><div class="ct99-stat"><div class="l">Não iniciadas</div><div class="v">${Number(ss.not_started_series||0).toLocaleString('pt-BR')}</div></div><div class="ct99-stat"><div class="l">Filmes Watchlist</div><div class="v">${Number(ss.watchlist_movies||0).toLocaleString('pt-BR')}</div></div></div></section></div>`;
    bindCards99(host);$$99('[data-expand99]',host).forEach(b=>b.onclick=()=>renderCollection99(b.dataset.expand99));
  }catch(e){host.innerHTML=`<div class="ct99-empty">Falha ao sincronizar Perfil: ${esc99(e?.message||e)}</div>`}
}
function renderProfile99(){
  currentCollection99=null;setView99('profile');const app=$99('#app');if(!app)return false;app.innerHTML=shell99('Perfil','Estatísticas, biblioteca pessoal e atividade sincronizada.','<div id="ct99-profile"></div>','profile');bindNav99(app);void fillProfile99();return true;
}
async function renderCollection99(kind){
  currentCollection99=kind;setView99('profile');const app=$99('#app');if(!app)return;const titles={series:['Séries','Organizadas pelo seu estado atual.'],'series-favorites':['Séries favoritas','Todos os títulos favoritados.'],movies:['Filmes','Watchlist e filmes já vistos.'],'movies-favorites':['Filmes favoritos','Todos os títulos favoritados.']};const meta=titles[kind]||titles.series;app.innerHTML=shell99(meta[0],meta[1],'<div class="ct99-collection"><button class="ct99-back" data-back99>← Perfil</button><div id="ct99-collection-body"><div class="ct99-empty">Sincronizando…</div></div></div>','profile');bindNav99(app);$99('[data-back99]',app).onclick=renderProfile99;
  try{await fetch99();const host=$99('#ct99-collection-body');if(!host||currentCollection99!==kind)return;const tv=dashboard99.filter(x=>x.media_type==='tv'),mv=dashboard99.filter(x=>x.media_type==='movie');if(kind==='series')host.innerHTML=category99('Em andamento',tv.filter(x=>x.is_in_progress))+category99('Não iniciadas',tv.filter(x=>x.is_not_started))+category99('Assistir mais tarde / Watchlist',tv.filter(x=>x.is_watchlist))+category99('Em dia',tv.filter(x=>x.is_up_to_date))+category99('Concluídas',tv.filter(x=>x.is_completed));else if(kind==='movies')host.innerHTML=category99('Assistir a seguir / Watchlist',mv.filter(x=>x.is_watchlist))+category99('Já vistos',mv.filter(x=>x.is_seen));else if(kind==='series-favorites')host.innerHTML=category99('Séries favoritas',tv.filter(x=>x.is_favorite),true);else host.innerHTML=category99('Filmes favoritos',mv.filter(x=>x.is_favorite),true);bindCards99(host)}catch(e){const host=$99('#ct99-collection-body');if(host)host.innerHTML=`<div class="ct99-empty">Falha ao sincronizar: ${esc99(e?.message||e)}</div>`}
}

const previousNavigate99=window.ct98Navigate;
window.__ct98NavigateBefore99=previousNavigate99;
window.ct98Navigate=function(target){const t=target==='history'?'profile':target;if(t==='profile')return renderProfile99();return typeof previousNavigate99==='function'?previousNavigate99(t):false};
window.ct99RenderProfile=renderProfile99;
window.ct99RefreshProfile=async()=>{if(currentCollection99)return renderCollection99(currentCollection99);if($99('#ct99-profile'))return fillProfile99();return fetch99()};
window.__ctAndroidBuild=VERSION99;

let refreshTimer99=null;
function scheduleRefresh99(){clearTimeout(refreshTimer99);refreshTimer99=setTimeout(()=>{if(currentCollection99)void renderCollection99(currentCollection99);else if($99('#ct99-profile'))void fillProfile99()},120)}
window.addEventListener('cinetracker:data-changed',scheduleRefresh99);
window.addEventListener('focus',()=>{if(currentCollection99||$99('#ct99-profile'))scheduleRefresh99()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&(currentCollection99||$99('#ct99-profile')))scheduleRefresh99()});
setInterval(()=>{if(document.visibilityState==='visible'&&(currentCollection99||$99('#ct99-profile')))scheduleRefresh99()},15000);

try{
  if(typeof window.sbApi==='function'&&!window.__ct99SbApiWrapped){window.__ct99SbApiWrapped=true;const original=window.sbApi;window.sbApi=async function(path,init){const result=await original.apply(this,arguments);const method=String(init?.method||'GET').toUpperCase();if(method!=='GET'&&/^(?:watch_history|episode_progress|media_overrides)(?:\?|$)/.test(String(path||'')))window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v0.0.99-db-write',path:String(path||''),method}}));return result}}
}catch{}

setTimeout(()=>{let v='';try{v=String(view||'')}catch{}if(v==='profile'||v==='history')renderProfile99()},180);
})();

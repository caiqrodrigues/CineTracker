(() => {
'use strict';
if (window.__ct47Loaded) return;
window.__ct47Loaded = true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const poster=p=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=w500`:'';
const css=document.createElement('style');
css.id='ct47-style';
css.textContent=`
body.ct47-discover .content .grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}
body.ct47-discover .content .grid>.card{min-width:0!important;border-radius:11px!important;overflow:hidden!important}
body.ct47-discover .content .grid .poster,body.ct47-discover .content .grid .tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important;padding:0!important}
body.ct47-discover .content .grid .card-body{padding:6px!important;min-height:62px!important}
body.ct47-discover .content .grid h3{font-size:10px!important;line-height:1.15!important;margin:0 0 4px!important}
body.ct47-discover .content .grid .media-meta{font-size:7.5px!important;gap:2px!important}
body.ct47-discover .content .grid .cast,body.ct47-discover .content .grid .availability,body.ct47-discover .content .grid .card-actions{display:none!important}
.ct47-hidden{display:none!important}
.ct41-window,.ct41-track,.ct41-day,.ct40-last7{background:#090e12!important;color:#f4f4f5!important}
.ct41-day{appearance:none!important;-webkit-appearance:none!important;border:1px solid #203443!important;background:#0c151c!important;color:#f4f4f5!important;box-shadow:none!important}
.ct41-day.today{background:#102331!important;border-color:#31536d!important}.ct41-bar{background:#568eb5!important}.ct41-day.today .ct41-bar{background:#d6b55b!important}
.ct47-kinds,.ct47-modes{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}.ct47-kinds{margin:4px 0 10px}.ct47-modes{margin:0 0 14px}.ct47-kinds::-webkit-scrollbar,.ct47-modes::-webkit-scrollbar{display:none}
.ct47-pill{white-space:nowrap;border:1px solid #263b4e;background:#0a1119;color:#bcd0e1;border-radius:999px;padding:8px 14px;font-size:12px}.ct47-pill.active{background:#123b60;border-color:#4599da;color:#fff}
.ct47-section{margin:22px 0}.ct47-section h2{font-size:20px;margin:0 0 4px}.ct47-section>p{font-size:11px;color:#788895;margin:0 0 10px}.ct47-list{display:grid;gap:9px}
.ct47-card{display:grid;grid-template-columns:82px minmax(0,1fr) 34px;min-height:122px;border:1px solid #1d3040;background:#11171c;border-radius:14px;overflow:hidden;cursor:pointer;scroll-snap-align:start}.ct47-poster{background:#0b1721 center/cover no-repeat}.ct47-body{padding:11px;min-width:0}.ct47-title{font-size:14px;font-weight:700;line-height:1.2}.ct47-meta{font-size:10px;color:#94a0aa;margin-top:7px}.ct47-sub{font-size:9px;color:#748490;margin-top:7px}.ct47-go{align-self:center;font-size:25px;color:#8ba0af}
#ct47-content.ct47-carousel .ct47-list{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:82%!important;grid-template-columns:none!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;gap:9px!important;scrollbar-width:none;padding-bottom:4px}#ct47-content.ct47-carousel .ct47-list::-webkit-scrollbar{display:none}
#ct47-content.ct47-grid .ct47-list{grid-template-columns:repeat(2,minmax(0,1fr))!important}#ct47-content.ct47-grid .ct47-card{display:block!important;min-height:0}#ct47-content.ct47-grid .ct47-poster{aspect-ratio:2/3}#ct47-content.ct47-grid .ct47-body{padding:8px}#ct47-content.ct47-grid .ct47-go{display:none}
#ct47-content.ct47-list .ct47-list{grid-template-columns:1fr!important}
.ct47-empty{border:1px solid #1d3040;background:#0b1117;border-radius:12px;padding:14px;color:#8495a3}.ct47-back{border:1px solid #2a4052;background:#0d141a;color:#fff;border-radius:11px;padding:9px 12px;margin-bottom:14px}
.ct47-hero{display:grid;grid-template-columns:112px minmax(0,1fr);gap:13px}.ct47-hero-poster{aspect-ratio:2/3;border-radius:13px;background:#0c1720 center/cover no-repeat}.ct47-hero h1{font-size:23px;line-height:1.15;margin:0 0 8px}.ct47-overview{font-size:12px;line-height:1.55;color:#aab5be;margin:15px 0}
.ct47-season{border:1px solid #1d3040;border-radius:12px;margin:9px 0;overflow:hidden}.ct47-season-btn{width:100%;border:0;background:#0d151c;color:#fff;text-align:left;padding:12px;font-weight:700}.ct47-eps{padding:0 11px 9px}.ct47-ep{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border-top:1px solid #202e39;padding:10px 0;cursor:pointer}.ct47-ep strong{font-size:11px}.ct47-ep span{display:block;color:#7e8e9b;font-size:9px;margin-top:3px}.ct47-seen{width:32px;height:32px;border-radius:50%;border:1px solid #375168;background:#0b131b;color:#9aa8b2}.ct47-seen.on{background:#153a25;border-color:#39754d;color:#9fddb0}.ct47-ephero{aspect-ratio:16/9;border-radius:14px;background:#0b151e center/cover no-repeat;margin:10px 0 14px}.ct47-action{border:1px solid #2d4355;background:#0d151d;color:#fff;border-radius:11px;padding:10px 13px}.ct47-action.on{background:#153a25;border-color:#39754d;color:#a7dfb5}
`;
document.head.appendChild(css);

let kind='series';
let displayMode=localStorage.getItem('ct47_display_mode')||'carousel';
let seriesRows=[];
let movieRows=[];
let currentSeriesId=0;

async function tmdb(type,id,extra=''){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
  u.searchParams.set('path',`/${type}/${id}${extra}`);u.searchParams.set('language','pt-BR');
  const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});
  if(!r.ok) throw new Error(`TMDB ${r.status}`);return r.json();
}
async function loadSeries(){seriesRows=await sbRpc('cinetracker_continue_items_v2',{})||[]}
async function loadMovies(){
  const rows=await sbApi('media_overrides?select=state,media_id,updated_at,media:media(id,tmdb_id,media_type,title,poster_path,release_year,raw_tmdb)&state=in.(AddedToWatchlist,WatchLater)&order=updated_at.desc&limit=1000');
  const seenRows=await sbApi('media_overrides?select=media_id&state=in.(AlreadySeen,Completed)&limit=1000');
  const seen=new Set((seenRows||[]).map(x=>x.media_id)), map=new Map();
  for(const x of rows||[]){const m=x.media;if(m?.media_type==='movie'&&!seen.has(x.media_id)&&!map.has(x.media_id))map.set(x.media_id,{...m,media_id:x.media_id})}
  movieRows=[...map.values()];
}
function card(r,type){
  const sub=type==='movie'?'Na Watchlist · ainda não assistido':r.status==='up_to_date'?'Em dia · aguardando próximo episódio/temporada':r.status==='not_started'?'Ainda não iniciada':r.status==='dusty'?'Juntando poeira · mais de 30 dias sem assistir':'Acompanhando';
  return `<article class="ct47-card" data-type="${type}" data-id="${Number(r.tmdb_id||0)}"><div class="ct47-poster"${r.poster_path?` style="background-image:url('${poster(r.poster_path)}')"`:''}></div><div class="ct47-body"><div class="ct47-title">${esc(r.title||`TMDB #${r.tmdb_id}`)}</div><div class="ct47-meta">${type==='movie'?'FILME':`${r.media_kind==='anime'?'ANIME':'SÉRIE'} · ${Number(r.watched_episodes||0).toLocaleString('pt-BR')}/${r.total_episodes||'?'}`}</div><div class="ct47-sub">${esc(sub)}</div></div><div class="ct47-go">›</div></article>`;
}
function section(key,title,desc,rows){return `<section class="ct47-section" data-section="${key}"><h2>${title}</h2><p>${desc}</p><div class="ct47-list">${rows.length?rows.map(r=>card(r,'tv')).join(''):'<div class="ct47-empty">Nenhuma série nesta seção.</div>'}</div></section>`}
function applyMode(){const box=$('#ct47-content');if(!box)return;box.classList.remove('ct47-carousel','ct47-grid','ct47-list');box.classList.add('ct47-'+displayMode);$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===displayMode))}
function bindCards(){$$('.ct47-card').forEach(c=>c.onclick=()=>openDetail(c.dataset.type,Number(c.dataset.id)))}
async function renderAssist(){
  const root=$('#app');if(!root)return;
  root.innerHTML=`<div class="app"><main class="content"><h1>Assistir</h1><div class="ct47-kinds"><button class="ct47-pill ${kind==='series'?'active':''}" data-kind="series">Séries</button><button class="ct47-pill ${kind==='movies'?'active':''}" data-kind="movies">Filmes</button></div><div class="ct47-modes"><button class="ct47-pill" data-mode="carousel">Carrossel</button><button class="ct47-pill" data-mode="grid">Grade</button><button class="ct47-pill" data-mode="list">Lista</button></div><div id="ct47-content" class="ct47-${displayMode}"><div class="ct47-empty">Carregando…</div></div></main></div>`;
  $$('[data-kind]').forEach(b=>b.onclick=async()=>{kind=b.dataset.kind;await renderAssist()});
  $$('[data-mode]').forEach(b=>b.onclick=()=>{displayMode=b.dataset.mode;localStorage.setItem('ct47_display_mode',displayMode);applyMode()});
  applyMode();
  const box=$('#ct47-content');
  try{
    if(kind==='series'){
      await loadSeries();
      const up=seriesRows.filter(x=>x.status==='up_to_date');
      const following=seriesRows.filter(x=>x.status==='following');
      const dusty=seriesRows.filter(x=>x.status==='dusty');
      const notStarted=seriesRows.filter(x=>x.status==='not_started');
      box.innerHTML=section('up','Em dia','Tudo disponível já foi visto; aguardando próximo episódio ou temporada.',up)+section('following','Acompanhando','Séries que você está assistindo atualmente.',following)+section('dusty','Juntando poeira','Séries iniciadas sem atividade há mais de 30 dias.',dusty)+section('not','Não iniciadas','Séries da sua lista que ainda não começaram.',notStarted);
      bindCards();applyMode();
      const follow=$('[data-section="following"]');if(follow)setTimeout(()=>follow.scrollIntoView({block:'start',behavior:'auto'}),100);
    } else {
      await loadMovies();
      box.innerHTML=`<section class="ct47-section"><h2>Filmes para assistir</h2><p>Filmes da Watchlist que ainda não foram vistos.</p><div class="ct47-list">${movieRows.length?movieRows.map(r=>card(r,'movie')).join(''):'<div class="ct47-empty">Nenhum filme pendente.</div>'}</div></section>`;
      bindCards();applyMode();
    }
  }catch(e){box.innerHTML=`<div class="ct47-empty">Falha ao carregar: ${esc(e.message||e)}</div>`}
}
async function stateMap(tmdbId){try{const rows=await sbRpc('cinetracker_episode_state',{p_tmdb_id:tmdbId})||[];return new Map(rows.map(r=>[`${r.season_number}:${r.episode_number}`,!!r.watched]))}catch{return new Map()}}
async function setSeen(tmdbId,season,episode,watched,title){await sbRpc('cinetracker_set_episode_watched',{p_tmdb_id:tmdbId,p_season:season,p_episode:episode,p_watched:watched,p_title:title||null})}
async function openDetail(type,id){
  if(!id)return;currentSeriesId=type==='tv'?id:0;
  const root=$('#app');root.innerHTML='<div class="app"><main class="content"><div class="ct47-empty">Carregando detalhes…</div></main></div>';
  try{
    const d=await tmdb(type,id), content=$('.content');
    content.innerHTML=`<button class="ct47-back" id="ct47-back">← Assistir</button><div class="ct47-hero"><div class="ct47-hero-poster"${d.poster_path?` style="background-image:url('${poster(d.poster_path)}')"`:''}></div><div><h1>${esc(d.title||d.name||'Sem título')}</h1><div class="ct47-meta">${type==='movie'?'FILME':`SÉRIE · ${Number(d.number_of_seasons||0)} temporadas · ${Number(d.number_of_episodes||0)} episódios`}</div></div></div><p class="ct47-overview">${esc(d.overview||'Sem sinopse disponível.')}</p><div id="ct47-extra"></div>`;
    $('#ct47-back').onclick=renderAssist;
    if(type==='tv'){
      const map=await stateMap(id), seasons=(d.seasons||[]).filter(s=>s.season_number>0), extra=$('#ct47-extra');
      extra.innerHTML=seasons.map(s=>`<div class="ct47-season"><button class="ct47-season-btn" data-season="${s.season_number}">Temporada ${s.season_number} · ${s.episode_count||0} episódios</button><div class="ct47-eps" id="ct47-s-${s.season_number}" hidden></div></div>`).join('');
      $$('.ct47-season-btn').forEach(b=>b.onclick=async()=>{
        const n=Number(b.dataset.season),box=$(`#ct47-s-${n}`);if(!box.hidden){box.hidden=true;return}box.hidden=false;if(box.dataset.loaded)return;box.innerHTML='Carregando episódios…';
        try{
          const sd=await tmdb('tv',id,`/season/${n}`);
          box.innerHTML=(sd.episodes||[]).map(ep=>{const seen=!!map.get(`${n}:${ep.episode_number}`);return `<div class="ct47-ep" data-season="${n}" data-episode="${ep.episode_number}" data-name="${esc(ep.name||'Episódio')}"><div><strong>E${ep.episode_number} · ${esc(ep.name||'Episódio')}</strong><span>${ep.air_date?new Date(ep.air_date+'T12:00:00').toLocaleDateString('pt-BR'):'Sem data'}</span></div><button class="ct47-seen${seen?' on':''}" data-seen="${seen?'1':'0'}">${seen?'✓':'○'}</button></div>`}).join('');box.dataset.loaded='1';
          $$('.ct47-ep',box).forEach(row=>{
            const sn=Number(row.dataset.season),en=Number(row.dataset.episode),name=row.dataset.name;
            $('.ct47-seen',row).onclick=async ev=>{ev.stopPropagation();const btn=ev.currentTarget,nv=btn.dataset.seen!=='1';btn.disabled=true;try{await setSeen(id,sn,en,nv,name);btn.dataset.seen=nv?'1':'0';btn.classList.toggle('on',nv);btn.textContent=nv?'✓':'○'}finally{btn.disabled=false}};
            row.onclick=()=>openEpisode(id,sn,en);
          });
        }catch{box.innerHTML='Falha ao carregar episódios.'}
      });
    }
  }catch{$('.content').innerHTML='<button class="ct47-back" onclick="window.ct47Navigate(\'library\')">← Assistir</button><div class="ct47-empty">Falha ao abrir detalhes.</div>'}
}
async function openEpisode(id,season,episode){
  const root=$('#app');root.innerHTML='<div class="app"><main class="content"><div class="ct47-empty">Carregando episódio…</div></main></div>';
  try{
    const d=await tmdb('tv',id,`/season/${season}/episode/${episode}`),map=await stateMap(id),seen=!!map.get(`${season}:${episode}`),img=d.still_path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(d.still_path)}&size=w780`:'';
    $('.content').innerHTML=`<button class="ct47-back" id="ct47-epback">← Série</button><div class="ct47-ephero"${img?` style="background-image:url('${img}')"`:''}></div><div class="eyebrow">T${season} · E${episode}</div><h1>${esc(d.name||'Episódio')}</h1><p class="ct47-overview">${esc(d.overview||'Sem sinopse disponível.')}</p><button class="ct47-action${seen?' on':''}" id="ct47-toggle">${seen?'✓ Assistido':'Marcar como assistido'}</button>`;
    $('#ct47-epback').onclick=()=>openDetail('tv',id);
    $('#ct47-toggle').onclick=async ev=>{const btn=ev.currentTarget,nv=!btn.classList.contains('on');btn.disabled=true;try{await setSeen(id,season,episode,nv,d.name||'');btn.classList.toggle('on',nv);btn.textContent=nv?'✓ Assistido':'Marcar como assistido'}finally{btn.disabled=false}};
  }catch{$('.content').innerHTML='<button class="ct47-back" onclick="window.ct47Navigate(\'library\')">← Assistir</button><div class="ct47-empty">Falha ao abrir episódio.</div>'}
}

function hideHourlyProfile(){
  if(typeof view==='undefined'||view!=='profile')return;
  $$('.ct33-chart,.ct36-hourchart,.ct36-carousel,.ct36-dots,.ct36-peakline,.ct39-full-analytics').forEach(x=>x.classList.add('ct47-hidden'));
  const all=$$('div,section');
  for(const el of all){
    const t=(el.textContent||'').replace(/\s+/g,' ');
    if(t.includes('00h')&&t.includes('06h')&&t.includes('12h')&&t.includes('18h')&&t.includes('23h')){
      const child=[...el.children].some(c=>{const s=(c.textContent||'');return s.includes('00h')&&s.includes('23h')});
      if(!child)el.classList.add('ct47-hidden');
    }
    if(/^Atividade por horário/i.test(t.trim()))el.classList.add('ct47-hidden');
  }
}
function removeHomeCalendar(){
  if(typeof view==='undefined'||view!=='home')return;
  $$('section,.panel,.card,div').forEach(el=>{const t=(el.textContent||'').trim();if(t.startsWith('Calendário das séries em acompanhamento'))el.classList.add('ct47-hidden')});
}
function applyView(){
  const isDiscover=typeof view!=='undefined'&&view==='discover';
  document.body.classList.toggle('ct47-discover',isDiscover);
  hideHourlyProfile();removeHomeCalendar();
}
function syncSession(){try{if(window.CineTrackerNative&&typeof CineTrackerNative.saveSession==='function'&&typeof ctSession!=='undefined'&&ctSession?.access_token)CineTrackerNative.saveSession(JSON.stringify({access_token:ctSession.access_token,expires_at:ctSession.expires_at||null}))}catch{}}

const originalRender=typeof render==='function'?render:null;
if(originalRender){
  window.__ct47OriginalRender=originalRender;
  render=function(){
    if(typeof view!=='undefined'&&view==='library'){renderAssist();return}
    const r=window.__ct47OriginalRender();
    setTimeout(applyView,0);setTimeout(applyView,120);return r;
  };
}
window.ct47Navigate=(target)=>{
  try{
    view=target;
    if(target==='library')renderAssist();else render();
    window.scrollTo(0,0);setTimeout(applyView,0);return true;
  }catch(e){return false}
};
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;applyView()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(applyView,50);setTimeout(applyView,500);setTimeout(syncSession,700);setInterval(syncSession,30000);
})();
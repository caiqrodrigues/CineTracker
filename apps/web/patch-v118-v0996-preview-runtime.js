(() => {
'use strict';
if(window.__ct0996PreviewRuntimeLoaded)return;
window.__ct0996PreviewRuntimeLoaded=true;
window.__ct0996PreviewRuntime='v118-profile-posters-season-discover';

const $118=(s,r=document)=>r?.querySelector?.(s)||null;
const $$118=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc118=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm118=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const img118=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
const year118=x=>Number(String(x?.release_date||x?.first_air_date||'').slice(0,4))||Number(x?.release_year||0)||0;
function route118(){try{return String(typeof view!=='undefined'?view:(window.view||'')).replace('history','profile')}catch{return String(window.view||'').replace('history','profile')}}
async function sb118(path,options={}){const fn=typeof window.sbApi==='function'?window.sbApi:(typeof sbApi==='function'?sbApi:null);if(!fn)throw new Error('Supabase indisponível');return fn(path,options)}
async function rpc118(name,body={}){const fn=typeof window.sbRpc==='function'?window.sbRpc:(typeof sbRpc==='function'?sbRpc:null);if(!fn)throw new Error('RPC indisponível');return fn(name,body)}
async function api118(path,params={}){const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}

const style=document.createElement('style');
style.id='ct0996-v118-style';
style.textContent=`
/* 0.99.6 preview authority: geometry is calculated from the real viewport, not from a 200% approximation. */
.ct116-timeline .ct116-track{display:flex!important;align-items:flex-end!important;grid-auto-columns:unset!important}
.ct116-timeline .ct116-day{min-width:0!important;scroll-snap-align:center!important}
.ct117-season-ratings-strip{grid-auto-columns:100%!important;scroll-snap-type:x mandatory!important;scrollbar-width:thin}
.ct117-season-rating-card{width:100%!important;min-width:0!important}
.ct118-season-titlebar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
.ct118-season-titlebar h2{margin:0!important}
.ct118-season-nav{display:flex;gap:6px}.ct118-season-nav button{width:34px;height:32px;border:1px solid #315d76;background:#0a1b25;color:#eaf9ff;border-radius:9px;cursor:pointer;font-size:18px;line-height:1}.ct118-season-nav button:hover{border-color:#63caff}
.ct118-profile-sync-note{color:#7892a4;font-size:9px}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

/* ---------------- Perfil: dados já vêm corretos do RPC; esta camada corrige apenas DOM/viewport. ---------------- */
let profileSyncBusy118=null;
function actorMarkup118(actors){return actors.length?actors.map(a=>`<article class="ct116-actor"><button type="button" class="ct116-actor-open" data-ct118-person="${Number(a.tmdb_person_id)}"><div class="ct116-actor-photo"${a.profile_path?` style="background-image:url('${img118(a.profile_path)}')"`:''}></div><div class="ct116-actor-name">${esc118(a.actor_name)}</div></button><button type="button" class="ct116-actor-remove" data-ct118-actor-remove="${Number(a.tmdb_person_id)}">♥ Remover</button></article>`).join(''):'<div class="ct116-empty">Nenhum ator favorito ainda.</div>'}
function bindActors118(section){
  $$118('[data-ct118-person]',section).forEach(b=>b.onclick=()=>void window.__ct0994OpenPerson?.(Number(b.dataset.ct118Person)));
  $$118('[data-ct118-actor-remove]',section).forEach(b=>b.onclick=async()=>{const id=Number(b.dataset.ct118ActorRemove);if(!id||b.disabled)return;b.disabled=true;try{await sb118(`favorite_actors?tmdb_person_id=eq.${id}`,{method:'DELETE'});try{localStorage.removeItem('ct0996_profile_snapshot_v2')}catch{}window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v118-remove-actor',tmdb_person_id:id}}));await syncProfile118(true)}finally{b.disabled=false}});
}
function renderActors118(actors){
  if(route118()!=='profile')return;
  const host=$118('#ct991-profile'),sections=$118('.ct116-sections',host);if(!host||!sections)return;
  let section=$$118('.ct116-section',sections).find(s=>norm118($118('h2',s)?.textContent)==='atores favoritos');
  if(!section){section=document.createElement('section');section.className='ct116-section';sections.appendChild(section)}
  section.innerHTML=`<div class="ct116-head"><h2>Atores Favoritos</h2><small>${actors.length}</small></div><div class="ct116-actors">${actorMarkup118(actors)}</div>`;
  bindActors118(section);
}
function layoutTimeline118(){
  if(route118()!=='profile')return;
  const sc=$118('#ct116-timeline'),track=$118('.ct116-track',sc),days=$$118('.ct116-day',track);if(!sc||!track||days.length<7)return;
  const css=getComputedStyle(sc),inner=Math.max(280,sc.clientWidth-(parseFloat(css.paddingLeft)||0)-(parseFloat(css.paddingRight)||0)),gap=8,day=Math.max(38,(inner-gap*6)/7),width=day*days.length+gap*Math.max(0,days.length-1);
  track.style.setProperty('display','flex','important');track.style.setProperty('gap',`${gap}px`,'important');track.style.setProperty('width',`${width}px`,'important');track.style.setProperty('min-width',`${width}px`,'important');
  for(const d of days){d.style.setProperty('flex',`0 0 ${day}px`,'important');d.style.setProperty('width',`${day}px`,'important')}
  const today=$118('.ct116-day.today',track);if(today){const target=today.offsetLeft-(inner-today.offsetWidth)/2;sc.scrollLeft=Math.max(0,target)}
}
async function syncProfile118(force=false){
  if(route118()!=='profile')return null;if(profileSyncBusy118&&!force)return profileSyncBusy118;
  profileSyncBusy118=(async()=>{try{const data=await rpc118('cinetracker_profile_payload_v0996',{});if(route118()!=='profile')return data;renderActors118(Array.isArray(data?.favorite_actors)?data.favorite_actors:[]);requestAnimationFrame(layoutTimeline118);setTimeout(layoutTimeline118,90);return data}catch(e){console.warn('[CineTracker 0.99.6 preview] profile sync',e);return null}finally{profileSyncBusy118=null}})();return profileSyncBusy118;
}
let resizeTimer118=null;window.addEventListener('resize',()=>{clearTimeout(resizeTimer118);resizeTimer118=setTimeout(()=>{if(route118()==='profile')layoutTimeline118()},120)},{passive:true});

/* ---------------- Capas: resolver visível por título original/localizado sem alterar banco na prévia. ---------------- */
const posterAttempt118=new Map(),posterResolve118=new Map();let posterBusy118=false;
function poster118(card){const p=$118('.ct116-poster,.ct992-poster,.ct994-poster,.ct991-poster,.ct99-poster',card);if(!p)return null;return String(p.style.backgroundImage||'').includes('url(')?null:p}
function localId118(card){return Number(card?.dataset?.card991||card?.dataset?.ct994Open||0)}
function open118(card){const el=card?.matches?.('[data-open-media991]')?card:$118('[data-open-media991]',card);if(!el)return null;const [type,id]=String(el.dataset.openMedia991||'').split(':');return {el,type:['movie','tv'].includes(type)?type:null,id:Number(id||0)}}
function due118(k,ttl=8*60*1000){const t=Number(posterAttempt118.get(k)||0);if(t&&Date.now()-t<ttl)return false;posterAttempt118.set(k,Date.now());return true}
function aliases118(x){return [x?.title,x?.name,x?.original_title,x?.original_name].map(norm118).filter(Boolean)}
function tokenScore118(a,b){const A=new Set(a.split(' ').filter(Boolean)),B=new Set(b.split(' ').filter(Boolean));if(!A.size||!B.size)return 0;let hit=0;for(const t of A)if(B.has(t))hit++;return hit/Math.max(A.size,B.size)}
function pickSearch118(results,title,year){const want=norm118(String(title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,''));let best=null,bestScore=-1;for(const x of results||[]){const names=aliases118(x);const exact=names.includes(want),sim=Math.max(0,...names.map(n=>tokenScore118(want,n))),y=year118(x),yd=year&&y?Math.abs(y-year):99;if(!exact&&sim<.82)continue;let score=(exact?1200:700+sim*250)+(yd===0?260:yd===1?130:yd===2?40:0)+Math.min(80,Number(x.popularity||0));if(year&&y&&yd>2)score-=500;if(score>bestScore){best=x;bestScore=score}}return best}
async function resolveLocalPoster118(mediaId){
  if(posterResolve118.has(mediaId))return posterResolve118.get(mediaId);
  const job=(async()=>{const rows=await sb118(`media?select=id,media_type,title,release_year,poster_path,tmdb_id,raw_tmdb&id=eq.${Number(mediaId)}&limit=1`).catch(()=>[]),m=rows?.[0];if(!m)return null;const type=m.media_type==='movie'?'movie':'tv',official=Number(m.tmdb_id)>0?Number(m.tmdb_id):Number(m.raw_tmdb?.source_tmdb_id||m.raw_tmdb?.id||0);if(official>0){const d=await api118(`/${type}/${official}`).catch(()=>null);return d?.poster_path?{type,id:official,poster_path:d.poster_path}:null}const query=String(m.title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();if(!query)return null;const params={query,include_adult:false,page:1};if(Number(m.release_year)>0)params[type==='movie'?'year':'first_air_date_year']=Number(m.release_year);let s=await api118(`/search/${type}`,params).catch(()=>({results:[]})),hit=pickSearch118(s.results,query,Number(m.release_year||0));if(!hit&&Number(m.release_year)>0){s=await api118(`/search/${type}`,{query,include_adult:false,page:1}).catch(()=>({results:[]}));hit=pickSearch118(s.results,query,Number(m.release_year||0))}return hit?.id&&hit?.poster_path?{type,id:Number(hit.id),poster_path:hit.poster_path}:null})();posterResolve118.set(mediaId,job);return job;
}
async function repairOnePoster118(card){const p=poster118(card);if(!p)return;const ref=open118(card);if(ref?.type&&ref.id>0&&due118(`ref:${ref.type}:${ref.id}`)){const d=await api118(`/${ref.type}/${ref.id}`).catch(()=>null);if(d?.poster_path){p.style.backgroundImage=`url('${img118(d.poster_path)}')`;return}}
  const mediaId=localId118(card);if(mediaId<=0||!due118(`media:${mediaId}`))return;const hit=await resolveLocalPoster118(mediaId).catch(()=>null);if(hit?.poster_path){p.style.backgroundImage=`url('${img118(hit.poster_path)}')`;if(ref?.el&&hit.id>0)ref.el.dataset.openMedia991=`${hit.type}:${hit.id}`}}
async function repairVisiblePosters118(){if(posterBusy118)return;const cards=[...new Set([...$$118('.ct116-card'),...$$118('[data-card991]'),...$$118('[data-ct994-open]')])].filter(c=>poster118(c));if(!cards.length)return;posterBusy118=true;try{for(let i=0;i<Math.min(cards.length,42);i+=6)await Promise.allSettled(cards.slice(i,i+6).map(repairOnePoster118))}finally{posterBusy118=false}}

/* ---------------- Detalhe: gráfico sempre fora do acordeão, uma temporada por página horizontal. ---------------- */
function chartSvg118(seasonNo,episodes){const rated=(episodes||[]).filter(e=>Number(e.vote_average)>0);if(!rated.length)return '<div class="ct117-season-chart-empty">Ainda não há avaliações suficientes no TMDB.</div>';const vals=rated.map(e=>Number(e.vote_average)),min=Math.min(...vals),max=Math.max(...vals),W=Math.max(620,rated.length*52),H=220,left=34,right=18,top=15,bottom=42,iw=W-left-right,ih=H-top-bottom,x=i=>left+(rated.length===1?iw/2:(i/(rated.length-1))*iw),y=v=>top+((10-v)/10)*ih,points=rated.map((e,i)=>`${x(i)},${y(Number(e.vote_average))}`).join(' '),grid=[0,2,4,6,8,10].map(v=>`<line x1="${left}" y1="${y(v)}" x2="${W-right}" y2="${y(v)}" stroke="#15394b" stroke-width="1"/><text x="4" y="${y(v)+3}" fill="#718d9d" font-size="9">${v}</text>`).join(''),nodes=rated.map((e,i)=>{const v=Number(e.vote_average),best=v===max,worst=v===min,fill=best?'#48e39a':worst?'#ff5f59':'#58cfff',code=`S${String(seasonNo).padStart(2,'0')}E${String(e.episode_number).padStart(2,'0')}`;return `<circle cx="${x(i)}" cy="${y(v)}" r="${best||worst?5:4}" fill="${fill}" stroke="#061018" stroke-width="2"><title>${code} · ${v.toFixed(1)} · ${esc118(e.name||'')} · ${Number(e.vote_count||0)} votos</title></circle><text x="${x(i)}" y="${H-10}" fill="#7894a5" font-size="8" text-anchor="middle">${code}</text>`}).join('');return `<div class="ct117-season-rating-note">Melhor episódio em verde · pior em vermelho · escala 0–10</div><div class="ct117-season-svg-scroll"><svg width="${W}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Avaliações da temporada ${seasonNo}">${grid}<polyline points="${points}" fill="none" stroke="#55cfff" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"/>${nodes}</svg></div>`}
async function loadChartCard118(tmdbId,card){if(!card||card.dataset.loaded==='1'||card.dataset.loading==='1')return;card.dataset.loading='1';const n=Number(card.dataset.ct117SeasonRating);try{const d=await api118(`/tv/${tmdbId}/season/${n}`);$118('.ct117-season-rating-content',card).innerHTML=chartSvg118(n,(d.episodes||[]).filter(e=>Number(e.episode_number)>0));card.dataset.loaded='1'}catch{$118('.ct117-season-rating-content',card).innerHTML='<div class="ct117-season-chart-empty">Falha ao carregar avaliações.</div>'}finally{delete card.dataset.loading}}
function bindSeasonNav118(sec,tmdbId){let titlebar=$118('.ct118-season-titlebar',sec);if(!titlebar){const h=$118('h2',sec);titlebar=document.createElement('div');titlebar.className='ct118-season-titlebar';titlebar.innerHTML=`<h2>${esc118(h?.textContent||'Avaliações dos episódios por temporada')}</h2><div class="ct118-season-nav"><button type="button" data-ct118-prev aria-label="Temporada anterior">‹</button><button type="button" data-ct118-next aria-label="Próxima temporada">›</button></div>`;h?.replaceWith(titlebar)}const strip=$118('.ct117-season-ratings-strip',sec),cards=$$118('[data-ct117-season-rating]',sec);if(!strip)return;const move=dir=>strip.scrollBy({left:dir*strip.clientWidth,behavior:'smooth'});$118('[data-ct118-prev]',sec).onclick=()=>move(-1);$118('[data-ct118-next]',sec).onclick=()=>move(1);const loadNear=()=>{const i=Math.max(0,Math.round(strip.scrollLeft/Math.max(1,strip.clientWidth)));for(const n of [i-1,i,i+1])if(cards[n])void loadChartCard118(tmdbId,cards[n])};let timer;strip.onscroll=()=>{clearTimeout(timer);timer=setTimeout(loadNear,80)};loadNear()}
async function ensureSeasonRatings118(tmdbId){const o=$118('#ct114-overlay'),body=$118('.ct114-body',o);if(!o||!body||!tmdbId)return;$$118('.ct114-season-body > .ct114-chart',o).forEach(x=>x.remove());const seasonsSection=$$118(':scope > .ct114-section',body).find(s=>norm118($118('h2',s)?.textContent)==='temporadas e episodios');if(!seasonsSection)return;let sec=$118('#ct117-season-ratings',o);if(!sec){const detail=await api118(`/tv/${tmdbId}`).catch(()=>null),seasons=(detail?.seasons||[]).filter(s=>Number(s.season_number)>0&&Number(s.episode_count)>0);if(!seasons.length)return;sec=document.createElement('section');sec.id='ct117-season-ratings';sec.className='ct114-section ct117-season-ratings';sec.innerHTML=`<h2>Avaliações dos episódios por temporada</h2><div class="ct117-season-ratings-strip">${seasons.map(s=>`<article class="ct117-season-rating-card" data-ct117-season-rating="${Number(s.season_number)}"><h3>Temporada ${Number(s.season_number)}</h3><div class="ct117-season-rating-content"><div class="ct117-season-chart-loading">Carregando avaliações…</div></div></article>`).join('')}</div>`}if(sec.previousElementSibling!==seasonsSection)seasonsSection.insertAdjacentElement('afterend',sec);bindSeasonNav118(sec,tmdbId)}

/* ---------------- Descobrir: a camada v116 precisa ser a autoridade final, nunca o legado. ---------------- */
let discoverRepairing118=false;
function discoverOk118(){const root=$118('#ct116-discover');if(!root)return false;const text=norm118(root.textContent),required=['pra voce','em alta','mais aguardados','mais bem avaliados','calendario','geral','series','filmes'];return required.every(x=>text.includes(x))}
async function ensureDiscover118(rawNav){if(route118()!=='discover'||discoverOk118()||discoverRepairing118||typeof rawNav!=='function')return;discoverRepairing118=true;try{await rawNav('discover');if(!discoverOk118())console.warn('[CineTracker 0.99.6 preview] Discover authority missing after canonical rerender')}finally{discoverRepairing118=false}}

/* ---------------- Final wrappers: sem MutationObserver e sem polling permanente. ---------------- */
const rawDetail118=window.__ct0994OpenDetail;
if(typeof rawDetail118==='function'&&!rawDetail118.__ct118Wrapped){const fn=async function(type,id){const r=await rawDetail118.apply(this,arguments);if(type==='tv'&&Number(id)>0){for(const d of [220,520])setTimeout(()=>void ensureSeasonRatings118(Number(id)),d)}return r};fn.__ct118Wrapped=true;window.__ct0994OpenDetail=fn;window.ct91OpenMedia=(type,id)=>fn(type,id);window.ct92OpenMedia=(type,id)=>fn(type,id)}
const rawById118=window.__ct0994OpenMediaById;
if(typeof rawById118==='function'&&!rawById118.__ct118Wrapped){const fn=async function(mediaId){const rows=await sb118(`media?select=media_type,tmdb_id,raw_tmdb&id=eq.${Number(mediaId)}&limit=1`).catch(()=>[]),m=rows?.[0],tid=Number(m?.tmdb_id)>0?Number(m.tmdb_id):Number(m?.raw_tmdb?.source_tmdb_id||m?.raw_tmdb?.id||0),r=await rawById118.apply(this,arguments);if(m?.media_type==='tv'&&tid>0)for(const d of [220,520])setTimeout(()=>void ensureSeasonRatings118(tid),d);return r};fn.__ct118Wrapped=true;window.__ct0994OpenMediaById=fn}
const rawNav118=window.__ct0994Navigate;
if(typeof rawNav118==='function'&&!rawNav118.__ct118Wrapped){const fn=async function(target){const r=await rawNav118.apply(this,arguments),t=String(target||'home').replace('history','profile');if(t==='profile'){for(const d of [0,90,320])setTimeout(()=>void syncProfile118(d>0),d)}if(t==='discover')for(const d of [0,160,520])setTimeout(()=>void ensureDiscover118(rawNav118),d);for(const d of [0,100,420,1200])setTimeout(()=>void repairVisiblePosters118(),d);return r};fn.__ct118Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct991Navigate=fn;window.ct0992Navigate=fn;window.ct99Navigate=fn;window.ct98Navigate=fn}
window.addEventListener('cinetracker:data-changed',()=>{const r=route118();if(r==='profile')setTimeout(()=>void syncProfile118(true),100);setTimeout(()=>void repairVisiblePosters118(),140)});
for(const d of [80,300,900,2200])setTimeout(()=>{if(route118()==='profile')void syncProfile118(d>300);if(route118()==='discover')void ensureDiscover118(rawNav118);void repairVisiblePosters118()},d);
})();

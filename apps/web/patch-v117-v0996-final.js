(() => {
'use strict';
if(window.__ct0996FinalLoaded)return;
window.__ct0996FinalLoaded=true;
window.__ct0996Final='v117-posters-actors-season-ratings';

const $117=(s,r=document)=>r.querySelector(s);
const $$117=(s,r=document)=>[...r.querySelectorAll(s)];
const esc117=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function sb117(path,options={}){const fn=typeof window.sbApi==='function'?window.sbApi:(typeof sbApi==='function'?sbApi:null);if(!fn)throw new Error('Supabase indisponível');return fn(path,options)}
async function api117(path,params={}){const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}
function route117(){try{return String(typeof view!=='undefined'?view:(window.view||'')).replace('history','profile')}catch{return String(window.view||'').replace('history','profile')}}

const style=document.createElement('style');
style.id='ct0996-v117-style';
style.textContent=`
.ct114-season-body>.ct114-chart{display:none!important}
.ct115-actor-heart,.ct115-actor-detail{display:none!important}
.ct117-cast-heart{position:absolute;top:6px;right:6px;z-index:30;width:30px;height:30px;border:1px solid #7d405a;background:#071018e8;color:#ffa1bd;border-radius:999px;display:grid;place-items:center;cursor:pointer;font-size:17px}
.ct117-cast-heart.on,.ct117-person-fav.on{background:#651d3a;border-color:#ff789f;color:#fff}.ct114-person{position:relative!important}.ct117-person-fav{margin-top:10px;border:1px solid #7d405a;background:#211019;color:#ffabc4;border-radius:10px;padding:9px 11px;cursor:pointer}
.ct117-season-ratings{overflow:hidden}.ct117-season-ratings-strip{display:grid;grid-auto-flow:column;grid-auto-columns:min(760px,86vw);gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 1px 10px}.ct117-season-rating-card{scroll-snap-align:start;border:1px solid #26546d;background:radial-gradient(circle at 10% 0,#114c6655,transparent 42%),#07141c;border-radius:14px;padding:12px;min-height:260px}.ct117-season-rating-card h3{margin:0 0 8px;font-size:14px}.ct117-season-rating-note{color:#7893a5;font-size:9px;margin-bottom:8px}.ct117-season-svg-scroll{overflow-x:auto}.ct117-season-rating-card svg{display:block;height:220px}.ct117-season-chart-loading{display:grid;place-items:center;height:220px;color:#7892a4}.ct117-season-chart-empty{display:grid;place-items:center;height:180px;color:#7892a4;border:1px dashed #274a5e;border-radius:10px}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

const posterAttempted117=new Set();let posterBusy117=false;
async function repairVisiblePosters117(){
  if(posterBusy117)return;
  const ids=[];
  for(const card of $$117('[data-card991],[data-ct994-open]')){
    const p=card.querySelector('.ct116-poster,.ct992-poster,.ct994-poster,.ct991-poster,.ct99-poster');
    if(!p||String(p.style.backgroundImage||'').includes('url('))continue;
    const id=Number(card.dataset.card991||card.dataset.ct994Open||0);
    if(id>0&&!posterAttempted117.has(id)){ids.push(id);if(ids.length>=36)break}
  }
  if(!ids.length)return;
  ids.forEach(x=>posterAttempted117.add(x));posterBusy117=true;
  try{
    const headers=typeof authHeaders==='function'?{...authHeaders()}:{},token=(()=>{try{return ctSession?.access_token||''}catch{return''}})();
    if(token&&!headers.Authorization)headers.Authorization=`Bearer ${token}`;
    if(!headers.Authorization)return;
    headers['content-type']='application/json';
    const r=await fetch(`${SUPABASE_URL}/functions/v1/ct-enrich-media-user?limit=${ids.length}&priority=visible-posters`,{method:'POST',headers,body:JSON.stringify({requested_media_ids:ids})});
    if(!r.ok)return;
    const d=await r.json();
    if(Number(d.ok||0)>0){try{localStorage.removeItem('ct0996_profile_snapshot_v2')}catch{}window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v117-visible-poster-enrichment',count:Number(d.ok||0)}}))}
  }catch(e){console.warn('[CineTracker 0.99.6] poster repair',e)}finally{posterBusy117=false}
}

let actorFav117=null,actorFavBusy117=null;
async function actorFavorites117(force=false){if(actorFav117&&!force)return actorFav117;if(actorFavBusy117&&!force)return actorFavBusy117;actorFavBusy117=sb117('favorite_actors?select=tmdb_person_id,actor_name,profile_path&limit=500').then(rows=>{actorFav117=new Map((rows||[]).map(x=>[Number(x.tmdb_person_id),x]));return actorFav117}).finally(()=>actorFavBusy117=null);return actorFavBusy117}
function actorState117(btn,on,label=false){btn.classList.toggle('on',Boolean(on));btn.textContent=on?(label?'♥ Ator favorito':'♥'):(label?'♡ Favoritar ator':'♡');btn.setAttribute('aria-pressed',on?'true':'false')}
async function toggleActor117(id,btn,label=false){
  await actorFavorites117();const old=actorFav117.get(Number(id)),on=!old;
  if(on){const d=await api117(`/person/${Number(id)}`),body={tmdb_person_id:Number(id),actor_name:d.name||`TMDB #${id}`,profile_path:d.profile_path||null};await sb117('favorite_actors',{method:'POST',body:JSON.stringify(body)});actorFav117.set(Number(id),body)}
  else{await sb117(`favorite_actors?tmdb_person_id=eq.${Number(id)}`,{method:'DELETE'});actorFav117.delete(Number(id))}
  actorState117(btn,on,label);try{localStorage.removeItem('ct0996_profile_snapshot_v2')}catch{}window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v117-actor-favorite',tmdb_person_id:Number(id),favorite:on}}));
}
async function decorateCast117(){
  const o=$117('#ct114-overlay');if(!o)return;await actorFavorites117().catch(()=>new Map());
  for(const card of $$117('[data-ct114-person]',o)){
    const id=Number(card.dataset.ct114Person);if(!id)continue;
    card.onclick=e=>{if(e.target.closest('.ct117-cast-heart'))return;e.preventDefault();e.stopPropagation();void window.__ct0994OpenPerson?.(id)};
    let b=card.querySelector('.ct117-cast-heart');if(!b){b=document.createElement('button');b.type='button';b.className='ct117-cast-heart';b.onclick=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();void toggleActor117(id,b,false)};card.appendChild(b)}
    actorState117(b,actorFav117.has(id),false);
  }
}
function decoratePersonFavorite117(id){for(const delay of [0,90,260])setTimeout(async()=>{const o=$117('#ct114-overlay'),hero=$117('.ct114-person-hero',o);if(!o||!hero)return;await actorFavorites117().catch(()=>new Map());let b=$117('.ct117-person-fav',hero);if(!b){b=document.createElement('button');b.type='button';b.className='ct117-person-fav';(hero.children[1]||hero).appendChild(b);b.onclick=e=>{e.preventDefault();e.stopPropagation();void toggleActor117(Number(id),b,true)}}actorState117(b,actorFav117.has(Number(id)),true)},delay)}

function seasonChartSvg117(seasonNo,episodes){
  const rated=(episodes||[]).filter(e=>Number(e.vote_average)>0);
  if(!rated.length)return '<div class="ct117-season-chart-empty">Ainda não há avaliações suficientes no TMDB.</div>';
  const vals=rated.map(e=>Number(e.vote_average)),min=Math.min(...vals),max=Math.max(...vals),W=Math.max(620,rated.length*52),H=220,left=34,right=18,top=15,bottom=42,iw=W-left-right,ih=H-top-bottom;
  const x=i=>left+(rated.length===1?iw/2:(i/(rated.length-1))*iw),y=v=>top+((10-v)/10)*ih,points=rated.map((e,i)=>`${x(i)},${y(Number(e.vote_average))}`).join(' ');
  const grid=[0,2,4,6,8,10].map(v=>`<line x1="${left}" y1="${y(v)}" x2="${W-right}" y2="${y(v)}" stroke="#15394b" stroke-width="1"/><text x="4" y="${y(v)+3}" fill="#718d9d" font-size="9">${v}</text>`).join('');
  const nodes=rated.map((e,i)=>{const v=Number(e.vote_average),best=v===max,worst=v===min,fill=best?'#48e39a':worst?'#ff5f59':'#58cfff',code=`S${String(seasonNo).padStart(2,'0')}E${String(e.episode_number).padStart(2,'0')}`,votes=Number(e.vote_count||0);return `<circle cx="${x(i)}" cy="${y(v)}" r="${best||worst?5:4}" fill="${fill}" stroke="#061018" stroke-width="2"><title>${code} · ${v.toFixed(1)} · ${esc117(e.name||'')} · ${votes} votos</title></circle><text x="${x(i)}" y="${H-10}" fill="#7894a5" font-size="8" text-anchor="middle">${code}</text>`}).join('');
  return `<div class="ct117-season-rating-note">Melhor episódio em verde · pior em vermelho · escala 0–10</div><div class="ct117-season-svg-scroll"><svg width="${W}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Avaliações da temporada ${seasonNo}">${grid}<polyline points="${points}" fill="none" stroke="#55cfff" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"/>${nodes}</svg></div>`;
}
async function loadSeasonRating117(tmdbId,card){if(!card||card.dataset.loaded==='1'||card.dataset.loading==='1')return;card.dataset.loading='1';const n=Number(card.dataset.ct117SeasonRating);try{const d=await api117(`/tv/${Number(tmdbId)}/season/${n}`);card.querySelector('.ct117-season-rating-content').innerHTML=seasonChartSvg117(n,(d.episodes||[]).filter(e=>Number(e.episode_number)>0));card.dataset.loaded='1'}catch{card.querySelector('.ct117-season-rating-content').innerHTML='<div class="ct117-season-chart-empty">Falha ao carregar avaliações.</div>'}finally{delete card.dataset.loading}}
async function decorateSeasonRatings117(tmdbId){
  const o=$117('#ct114-overlay'),body=$117('.ct114-body',o);if(!o||!body||!Number(tmdbId)||$117('#ct117-season-ratings',o))return;
  let detail;try{detail=await api117(`/tv/${Number(tmdbId)}`)}catch{return}
  const seasons=(detail.seasons||[]).filter(s=>Number(s.season_number)>0&&Number(s.episode_count)>0);if(!seasons.length)return;
  const sec=document.createElement('section');sec.id='ct117-season-ratings';sec.className='ct114-section ct117-season-ratings';sec.innerHTML=`<h2>Avaliações dos episódios por temporada</h2><div class="ct117-season-ratings-strip">${seasons.map(s=>`<article class="ct117-season-rating-card" data-ct117-season-rating="${Number(s.season_number)}"><h3>Temporada ${Number(s.season_number)}</h3><div class="ct117-season-rating-content"><div class="ct117-season-chart-loading">Carregando avaliações…</div></div></article>`).join('')}</div>`;
  const episodeSec=body.querySelector('.ct114-section');episodeSec?.insertAdjacentElement('afterend',sec);
  const strip=sec.querySelector('.ct117-season-ratings-strip'),cards=[...sec.querySelectorAll('[data-ct117-season-rating]')],open=Number(o.querySelector('.ct114-season.open')?.dataset.ct114Season||seasons[0].season_number),idx=Math.max(0,cards.findIndex(c=>Number(c.dataset.ct117SeasonRating)===open));
  const loadNear=()=>{const r=strip.getBoundingClientRect();for(const c of cards){const cr=c.getBoundingClientRect();if(cr.right>=r.left-r.width&&cr.left<=r.right+r.width)void loadSeasonRating117(tmdbId,c)}};
  requestAnimationFrame(()=>{cards[idx]?.scrollIntoView({behavior:'auto',block:'nearest',inline:'center'});loadNear()});let timer;strip.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(loadNear,80)},{passive:true});for(const i of [idx-1,idx,idx+1])if(cards[i])void loadSeasonRating117(tmdbId,cards[i]);
}

const rawDetail117=window.__ct0994OpenDetail;
if(typeof rawDetail117==='function'){window.__ct0994OpenDetail=async function(type,id){const r=await rawDetail117(type,id);for(const d of [0,100,320])setTimeout(()=>void decorateCast117(),d);if(type==='tv')for(const d of [40,180])setTimeout(()=>void decorateSeasonRatings117(Number(id)),d);return r};window.ct91OpenMedia=(type,id)=>window.__ct0994OpenDetail(type,id);window.ct92OpenMedia=(type,id)=>window.__ct0994OpenDetail(type,id)}
const rawById117=window.__ct0994OpenMediaById;
if(typeof rawById117==='function'){window.__ct0994OpenMediaById=async function(mediaId){const rows=await sb117(`media?select=media_type,tmdb_id,raw_tmdb&id=eq.${Number(mediaId)}&limit=1`).catch(()=>[]),m=rows?.[0],tid=Number(m?.tmdb_id)>0?Number(m.tmdb_id):Number(m?.raw_tmdb?.source_tmdb_id||0),r=await rawById117(mediaId);for(const d of [0,100,320])setTimeout(()=>void decorateCast117(),d);if(m?.media_type==='tv'&&tid>0)for(const d of [40,180])setTimeout(()=>void decorateSeasonRatings117(tid),d);return r}}
const rawPerson117=window.__ct0994OpenPerson;
if(typeof rawPerson117==='function'){window.__ct0994OpenPerson=async function(id){const r=await rawPerson117(id);decoratePersonFavorite117(Number(id));return r}}
const rawNav117=window.__ct0994Navigate;
if(typeof rawNav117==='function'&&!rawNav117.__ct117Wrapped){const fn=async function(target){const r=await rawNav117.apply(this,arguments);for(const d of [120,650,1800])setTimeout(()=>void repairVisiblePosters117(),d);return r};fn.__ct117Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct991Navigate=fn;window.ct0992Navigate=fn;window.ct99Navigate=fn;window.ct98Navigate=fn}
for(const d of [350,1200,2600])setTimeout(()=>void repairVisiblePosters117(),d);
})();

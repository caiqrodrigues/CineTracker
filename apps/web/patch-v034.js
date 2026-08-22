(() => {
'use strict';
const VERSION='0.3.6';
const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(path,size='w342')=>path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`:'';

// Short REST cache: page changes can reuse the same Supabase reads instead of
// downloading the same profile/history/library data again. Writes invalidate it.
const realFetch34=window.fetch.bind(window);
const restCache34=new Map();
window.ct34InvalidateCache=()=>restCache34.clear();
window.fetch=function(input,init={}){
  try{
    const url=typeof input==='string'?input:input?.url||String(input);
    const method=String(init?.method||'GET').toUpperCase();
    const cacheable=method==='GET'&&url.includes('/rest/v1/');
    if(cacheable){
      const key=url+'|'+JSON.stringify(init?.headers||{});const hit=restCache34.get(key);
      if(hit&&Date.now()-hit.t<45000)return hit.p.then(r=>r.clone());
      const p=realFetch34(input,init).then(r=>{if(!r.ok){restCache34.delete(key);return r;}return r.clone();}).catch(e=>{restCache34.delete(key);throw e;});
      restCache34.set(key,{t:Date.now(),p});return p.then(r=>r.clone());
    }
    if(method!=='GET'&&(url.includes('/rest/v1/')||url.includes('/functions/v1/')))restCache34.clear();
  }catch{}
  return realFetch34(input,init);
};

const detailCache34=new Map();
async function tmdb34(path,params={}){
  const qs=new URLSearchParams(Object.entries(params).filter(([,v])=>v!==undefined&&v!=='').map(([k,v])=>[k,String(v)])).toString();
  const key=path+'?'+qs;let hit=detailCache34.get(key);if(hit)return hit;
  try{const raw=sessionStorage.getItem('ct34:'+key);if(raw){const saved=JSON.parse(raw);if(Date.now()-saved.t<86400000){detailCache34.set(key,saved.v);return saved.v;}}}catch{}
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);for(const[k,v]of Object.entries(params))if(v!==undefined&&v!=='')u.searchParams.set(k,String(v));
  const r=await fetch(u,{headers:authHeaders()});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||d.status_message||`TMDB ${r.status}`);
  detailCache34.set(key,d);try{sessionStorage.setItem('ct34:'+key,JSON.stringify({t:Date.now(),v:d}))}catch{}return d;
}
function cardIdentity34(card){
  const mid=card.dataset.mediaId||'';let item=null;try{item=typeof mediaRegistry!=='undefined'?mediaRegistry.get(mid):null}catch{}
  let id=Number(item?.tmdbId||card.dataset.ct29Id||card.dataset.ct30Id||0),type=item?.apiType||card.dataset.apiType||card.dataset.ct29Type||'';
  if(!id){const m=mid.match(/^tmdb-(movie|tv)-(\d+)$/);if(m){type=m[1];id=Number(m[2]);}}
  type=String(type).includes('movie')?'movie':'tv';return{id,type,item};
}
function applyDetail34(card,d,item){
  const title=d.title||d.name||item?.title||'';const poster=card.querySelector('.poster,.tmdb-poster');const h=card.querySelector('h3,h2,strong');
  if(title&&h)h.textContent=title;
  if(d.poster_path&&poster){poster.classList.add('tmdb-poster');poster.style.backgroundImage=`linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.03)),url('${image(d.poster_path,'w500')}')`;poster.style.backgroundSize='cover';poster.style.backgroundPosition='center 18%';}
  if(item){item.title=title||item.title;item.posterUrl=d.poster_path?image(d.poster_path,'w500'):item.posterUrl;item.tmdbId=d.id||item.tmdbId;item.year=String((d.release_date||d.first_air_date||item.year||'').slice(0,4)||item.year||'—');if(Array.isArray(d.genres)&&d.genres.length)item.genres=d.genres.map(g=>g.name);}
  card.dataset.ct34Ready='1';
}
async function hydrateCard34(card){
  if(card.dataset.ct34Ready==='1')return;const{id,type,item}=cardIdentity34(card);let title=(item?.lookupTitle||item?.title||card.dataset.lookupTitle||card.querySelector('h3,h2,strong')?.textContent||'').trim();
  try{
    if(id){const d=await tmdb34(`/${type}/${id}`,{language:'pt-BR'});applyDetail34(card,d,item);return;}
    if(!title)return;const s=await tmdb34('/search/multi',{query:title,language:'pt-BR',include_adult:false,page:1});let rows=(s.results||[]).filter(x=>x.media_type==='movie'||x.media_type==='tv');const forced=String(card.dataset.apiType||'');if(forced)rows=rows.filter(x=>x.media_type===(forced.includes('movie')?'movie':'tv'));const row=rows.find(x=>String(x.title||x.name||'').toLowerCase()===title.toLowerCase())||rows[0];if(row?.id){const d=await tmdb34(`/${row.media_type}/${row.id}`,{language:'pt-BR'});applyDetail34(card,d,item);}
  }catch{card.dataset.ct34Ready='0';}
}
let homeHydrationToken=0;
async function fastHome34(){
  if(typeof view!=='undefined'&&view!=='home')return;const token=++homeHydrationToken;const cards=[...document.querySelectorAll('.feature,.card')].filter(c=>!c.closest('#ct29-overlay')).slice(0,16);let i=0;
  const workers=Array.from({length:6},()=> (async()=>{while(i<cards.length&&token===homeHydrationToken){await hydrateCard34(cards[i++]);}})());await Promise.all(workers);
}

// Delay availability until the visible structure has rendered. This removes a
// large burst of provider requests from the critical path of every tab change.
try{
  const oldAvailability=typeof hydrateAvailability==='function'?hydrateAvailability:null;
  if(oldAvailability)hydrateAvailability=function(){const expected=typeof view==='undefined'?'':view;setTimeout(()=>{if(typeof view==='undefined'||view===expected)oldAvailability();},1200);};
}catch{}

const css=document.createElement('style');css.id='ct34-style';css.textContent=`
.ct34-fav-tools{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin:8px 0 14px}.ct34-fav-tools input{min-width:0;border:1px solid #294159;background:#07111a;color:#fff;border-radius:11px;padding:11px 12px}.ct34-fav-results{display:grid;gap:7px;margin-bottom:12px}.ct34-fav-result{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:9px;align-items:center;border:1px solid #19344b;background:#08131d;border-radius:11px;padding:7px}.ct34-fav-result-poster{width:48px;height:72px;border-radius:7px;background:#10202c center/cover no-repeat}.ct34-fav-result strong{font-size:12px}.ct34-fav-result span{font-size:10px;color:#89a5bd}.ct34-recent{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0 12px}.ct34-recent-card{display:grid;grid-template-columns:48px minmax(0,1fr);gap:8px;border:1px solid #19344b;background:#08131d;border-radius:10px;overflow:hidden;min-height:72px}.ct34-recent-poster{width:48px;background:#10202c center/cover no-repeat}.ct34-recent-body{padding:8px 6px 8px 0;min-width:0}.ct34-recent-body strong{font-size:11px;display:block;line-height:1.25}.ct34-recent-body span{font-size:9px;color:#89a5bd;display:block;margin-top:4px}@media(max-width:650px){.ct34-recent{grid-template-columns:1fr 1fr}.ct34-fav-result{grid-template-columns:42px minmax(0,1fr) auto}.ct34-fav-result-poster{width:42px;height:63px}}`;
document.head.appendChild(css);

function findSection34(label){return [...document.querySelectorAll('#ct30-profile-body section,.ct29-section')].find(s=>s.querySelector('h2')&&s.querySelector('h2').textContent.trim().toLowerCase()===label.toLowerCase());}
function favoriteTools34(section,type){
  if(!section||section.querySelector('.ct34-fav-tools'))return;const wrap=document.createElement('div');wrap.innerHTML=`<div class="ct34-fav-tools"><input type="search" placeholder="Adicionar ${type==='tv'?'série':'filme'} favorito"><button class="btn-secondary" type="button">Buscar</button></div><div class="ct34-fav-results"></div>`;section.insertBefore(wrap,section.children[1]||null);const input=wrap.querySelector('input'),btn=wrap.querySelector('button'),out=wrap.querySelector('.ct34-fav-results');
  const search=async()=>{const q=input.value.trim();if(!q)return;btn.disabled=true;btn.textContent='Buscando…';out.innerHTML='';try{const d=await tmdb34(type==='movie'?'/search/movie':'/search/tv',{query:q,language:'pt-BR',include_adult:false,page:1});const rows=(d.results||[]).slice(0,5);out.innerHTML=rows.map(r=>{const title=r.title||r.name||'',date=r.release_date||r.first_air_date||'',year=date.slice(0,4)||'—';return `<div class="ct34-fav-result"><div class="ct34-fav-result-poster"${r.poster_path?` style="background-image:url('${image(r.poster_path,'w185')}')"`:''}></div><div><strong>${esc(title)}</strong><span>${esc(year)} • ${type==='movie'?'FILME':'SÉRIE'}</span></div><button class="btn-secondary" type="button" data-fav-id="${Number(r.id)||0}" data-fav-type="${type}" data-title="${esc(title)}" data-year="${esc(year)}" data-poster="${esc(r.poster_path||'')}">+ Favorito</button></div>`}).join('')||'<div class="subtitle">Nenhum resultado.</div>';out.querySelectorAll('[data-fav-id]').forEach(b=>b.onclick=()=>saveFavorite34(b));}catch(e){out.innerHTML=`<div class="subtitle">Falha na busca: ${esc(e.message||e)}</div>`}finally{btn.disabled=false;btn.textContent='Buscar';}};
  btn.onclick=search;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();search();}};
}
async function saveFavorite34(btn){
  const id=Number(btn.dataset.favId),type=btn.dataset.favType,title=btn.dataset.title,year=Number(btn.dataset.year)||null,poster=btn.dataset.poster||null;if(!id)return;btn.disabled=true;btn.textContent='Salvando…';
  try{await sbRpc('cinetracker_set_state',{p_tmdb_id:id,p_media_type:type,p_media_kind:type==='movie'?'movie':'series',p_title:title,p_release_year:year,p_poster_path:poster,p_state:'Liked',p_genres:[],p_raw_tmdb:{poster_path:poster}});restCache34.clear();btn.textContent='✓ Favorito';setTimeout(()=>{try{view='profile';render();}catch{}},250);}catch(e){btn.disabled=false;btn.textContent='+ Favorito';if(typeof toast==='function')toast(e.message||'Não foi possível salvar favorito.');}
}
async function recentHistory34(section){
  if(!section||section.querySelector('#ct34-recent-history'))return;const host=document.createElement('div');host.id='ct34-recent-history';host.innerHTML='<div class="subtitle">Carregando atividade recente…</div>';const button=section.querySelector('#ct30-open-history,button');section.insertBefore(host,button||null);
  try{const rows=await sbApi('watch_history?select=id,item_type,season_number,episode_number,watched_at,title,media:media(tmdb_id,media_type,title,poster_path)&order=watched_at.desc&limit=6');host.innerHTML=rows?.length?`<div class="ct34-recent">${rows.map(r=>{const m=r.media||{},title=r.title||m.title||'Sem título',sub=r.item_type==='episode'?`T${r.season_number??'—'} • E${r.episode_number??'—'}`:'Filme';return `<article class="ct34-recent-card"><div class="ct34-recent-poster"${m.poster_path?` style="background-image:url('${image(m.poster_path,'w185')}')"`:''}></div><div class="ct34-recent-body"><strong>${esc(title)}</strong><span>${esc(sub)}</span></div></article>`}).join('')}</div>`:'<div class="subtitle">Nenhum item recente.</div>';}catch(e){host.innerHTML='<div class="subtitle">Não foi possível carregar o histórico recente.</div>';}
}
function enhanceProfile34(){
  const body=document.querySelector('#ct30-profile-body');if(!body||body.dataset.ct34Enhanced==='1')return;const series=findSection34('Séries favoritas'),movies=findSection34('Filmes favoritos'),history=findSection34('Histórico');if(!series||!movies||!history)return;body.dataset.ct34Enhanced='1';favoriteTools34(series,'tv');favoriteTools34(movies,'movie');recentHistory34(history);
}
function removeCloud34(){document.querySelectorAll('.cloud-bar').forEach(x=>x.remove());}
let scheduled34=false;function run34(){if(scheduled34)return;scheduled34=true;requestAnimationFrame(()=>{scheduled34=false;removeCloud34();enhanceProfile34();if(typeof view!=='undefined'&&view==='home')fastHome34();});}
const obs34=new MutationObserver(run34);obs34.observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
const oldRender34=typeof render==='function'?render:null;if(oldRender34)render=function(){homeHydrationToken++;const r=oldRender34();window.scrollTo(0,0);run34();return r;};
setTimeout(run34,0);
})();

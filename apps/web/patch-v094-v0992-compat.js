(() => {
'use strict';
if(window.__ct0992Compat)return;
window.__ct0992Compat=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(p,size='w500')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
const headers=()=>typeof authHeaders==='function'?authHeaders():{};
const now=()=>new Date().toISOString();

async function api(path){const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');const r=await fetch(u,{headers:headers()});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}
function decorateSeriesRows(){
  $$('[data-series-row992]').forEach(row=>{
    if(row.dataset.ct992RatingDecorated==='1')return;
    const title=$('.ct992-title',row),sub=$('[data-next-title992]',row);if(!title||!sub)return;
    const match=String(sub.textContent||'').match(/\s·\s★\s([0-9]+(?:\.[0-9]+)?)\s*$/);if(!match)return;
    const rating=document.createElement('span');rating.className='ct992-episode-rating';rating.textContent=` • ★ ${match[1]}`;
    const badge=title.querySelector('.ct992-badge');title.insertBefore(rating,badge||null);
    sub.textContent=String(sub.textContent||'').replace(/\s·\s★\s[0-9]+(?:\.[0-9]+)?\s*$/,'');
    row.dataset.ct992RatingDecorated='1';
  });
}

async function openLocal(mediaId){
  const rows=await sbApi(`media?select=id,tmdb_id,media_type,title,poster_path,release_year,runtime_minutes,total_episodes&id=eq.${Number(mediaId)}&limit=1`).catch(()=>[]),m=rows?.[0];
  if(!m||Number(m.tmdb_id)>0)return;
  const [eps,liked]=await Promise.all([
    m.media_type==='tv'?sbApi(`episode_progress?select=season_number,episode_number,watched&media_id=eq.${m.id}&watched=eq.true`).catch(()=>[]):Promise.resolve([]),
    sbApi(`media_overrides?select=id&media_id=eq.${m.id}&state=eq.Liked&limit=1`).catch(()=>[])
  ]);
  const seen=(eps||[]).length,total=Number(m.total_episodes||0),o=document.createElement('div');o.className='ct991-modal';
  o.innerHTML=`<div class="ct991-modal-card"><div class="ct991-modal-head"><h3>${esc(m.title||'Sem título')}</h3><button class="ct991-close" data-close992local>Fechar</button></div><div class="ct991-local"><div class="ct991-local-poster"${m.poster_path?` style="background-image:url('${image(m.poster_path)}')"`:''}></div><div><p>${m.media_type==='movie'?'Filme':'Série'}${m.release_year?` · ${m.release_year}`:''}</p><p>${m.media_type==='tv'?(total?`${seen}/${total} episódios vistos`:`${seen} episódios vistos`):(m.runtime_minutes?`${m.runtime_minutes} min`:'')}</p><p class="ct991-meta">Mídia importada sem TMDB oficial. O detalhe local evita consultar um ID substituto inválido.</p><button class="ct991-favbtn ${liked?.length?'on':''}" data-localfav992>${liked?.length?'♥ Favorito':'♡ Favoritar'}</button></div></div></div>`;
  document.body.appendChild(o);$('[data-close992local]',o).onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};
  $('[data-localfav992]',o).onclick=async e=>{const b=e.currentTarget,on=!b.classList.contains('on');b.disabled=true;try{const current=await sbApi(`media_overrides?select=id&media_id=eq.${m.id}&state=eq.Liked`).catch(()=>[]);if(on){if(!current?.length)await sbApi('media_overrides',{method:'POST',body:JSON.stringify({media_id:Number(m.id),state:'Liked',origin:'manual'})})}else{for(const r of current||[])await sbApi(`media_overrides?id=eq.${r.id}`,{method:'DELETE'}).catch(()=>{})}b.classList.toggle('on',on);b.textContent=on?'♥ Favorito':'♡ Favoritar';window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'local-favorite-v0.99.2',mediaId:Number(m.id)}}))}finally{b.disabled=false}}
}

async function markDailyMovie(tmdbId,button){
  button.disabled=true;
  try{
    let rows=await sbApi(`media?select=*&tmdb_id=eq.${Number(tmdbId)}&media_type=eq.movie&limit=1`).catch(()=>[]);
    let media=rows?.[0];
    if(!media){
      const d=await api(`/movie/${Number(tmdbId)}`);
      rows=await sbApi('media',{method:'POST',body:JSON.stringify({tmdb_id:Number(tmdbId),media_type:'movie',media_kind:'movie',title:d.title||`TMDB #${tmdbId}`,original_title:d.original_title||null,poster_path:d.poster_path||null,release_year:Number(String(d.release_date||'').slice(0,4))||null,runtime_minutes:Number(d.runtime||0)||null,genres:Array.isArray(d.genres)?d.genres:[],raw_tmdb:d})}).catch(()=>[]);
      media=rows?.[0];
    }
    if(!media)throw new Error('Não foi possível registrar o filme recomendado.');
    const watchedAt=now();
    await sbApi('watch_history',{method:'POST',body:JSON.stringify({media_id:Number(media.id),item_type:'movie',title:media.title,watched_at:watchedAt,source:'manual'})});
    const seen=await sbApi(`media_overrides?select=id&media_id=eq.${media.id}&state=eq.AlreadySeen&limit=1`).catch(()=>[]);
    if(seen?.[0])await sbApi(`media_overrides?id=eq.${seen[0].id}`,{method:'PATCH',body:JSON.stringify({watched_at:watchedAt,origin:'manual',updated_at:watchedAt})});
    else await sbApi('media_overrides',{method:'POST',body:JSON.stringify({media_id:Number(media.id),state:'AlreadySeen',origin:'manual',watched_at:watchedAt})});
    window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'daily-movie-v0.99.2',mediaId:Number(media.id)}}));
  }catch(e){console.error('CineTracker 0.99.2 Escolha para Hoje:',e);button.disabled=false}
}

document.addEventListener('click',e=>{
  const daily=e.target.closest?.('[data-mark-tmdb-movie992]');
  if(daily){e.preventDefault();e.stopImmediatePropagation();void markDailyMovie(Number(daily.dataset.markTmdbMovie992),daily);return}
  const row=e.target.closest?.('[data-open-row992]');
  if(row&&!e.target.closest('[data-mark-episode992],[data-mark-movie992]'))setTimeout(()=>void openLocal(Number(row.dataset.openRow992)),0);
},true);

let timer=null;const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(decorateSeriesRows,50)});setTimeout(()=>{const app=$('#app');if(app)observer.observe(app,{subtree:true,childList:true,characterData:true});decorateSeriesRows()},350);
window.addEventListener('cinetracker:data-changed',()=>setTimeout(decorateSeriesRows,120));
})();

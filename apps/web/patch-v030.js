(() => {
  'use strict';
  const VERSION='0.3.0';
  let historyKind='all';
  const detailCache=new Map();

  const style=document.createElement('style');
  style.id='ct-v030-style';
  style.textContent=`
    .ct30-history-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}.ct30-history-tabs button{border:1px solid #1b3147;background:#07101a;color:#c9def4;border-radius:10px;padding:8px 11px;cursor:pointer}.ct30-history-tabs button.active{background:#0a2a48;border-color:#2f83c9;color:#fff}
    .ct30-history-day{margin:0 0 24px}.ct30-history-day h2{font-size:17px;margin:0 0 10px}.ct30-history-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.ct30-history-card{min-height:0!important}.ct30-history-card .poster{height:auto!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center!important}.ct30-history-card .card-body{min-height:0!important;padding:9px}.ct30-history-card h3{font-size:12px;margin:0 0 5px}.ct30-history-card .media-meta{font-size:10px}.ct30-history-time{font-size:10px;color:#86a3be;margin-top:4px}.ct30-empty{padding:22px;border:1px solid #172b3d;border-radius:13px;background:#07101a;color:#86a3be}
    .ct29-filmography .ct29-media[data-type="movie"] .ct29-media-body span::after{content:" • FILME"}.ct29-filmography .ct29-media[data-type="tv"] .ct29-media-body span::after{content:" • SÉRIE"}
    .ct30-library-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}
    @media(max-width:1100px){.ct30-history-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.ct30-library-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:850px){.ct30-history-grid,.ct30-library-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const img=(p,size='w500')=>p?`https://image.tmdb.org/t/p/${size}${p}`:'';

  async function tmdb(path,params={}){
    const q=new URLSearchParams(Object.entries(params).filter(([,v])=>v!==undefined&&v!=='').map(([k,v])=>[k,String(v)])).toString();
    const key=path+'?'+q,now=Date.now(),hit=detailCache.get(key);if(hit&&now-hit.t<600000)return hit.v;
    const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);for(const[k,v]of Object.entries(params))if(v!==undefined&&v!=='')u.searchParams.set(k,String(v));
    const r=await fetch(u,{headers:authHeaders()});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||d.status_message||`TMDB ${r.status}`);detailCache.set(key,{t:now,v:d});return d;
  }

  const originalShell=typeof shell==='function'?shell:null;
  if(originalShell){
    shell=function ctShell030(content){
      let html=originalShell(content);
      html=html.replace('data-view="home" class="','data-view="home" class="').replace('>⌂ Hoje</button>','>⌂ Home</button>').replace('>Hoje</button>','>Home</button>');
      const desktop=`<button type="button" data-view="history" class="${typeof view!=='undefined'&&view==='history'?'active':''}">◷ Histórico</button>`;
      const mobile=`<button type="button" data-view="history" class="${typeof view!=='undefined'&&view==='history'?'active':''}">Histórico</button>`;
      html=html.replace(/(<button type="button" data-view="library"[^>]*>▤ Biblioteca<\/button>)/,`$1${desktop}`);
      html=html.replace(/(<button type="button" data-view="library"[^>]*>Biblioteca<\/button>)/,`$1${mobile}`);
      return html;
    };
  }

  function mediaKind(item){const t=String(item?.media_type||item?.media_kind||'').toLowerCase();return t.includes('movie')||t.includes('film')?'movie':'tv';}
  function dateKey(value){if(!value)return null;const d=new Date(value);return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10);}
  function fmtDate(key){return new Date(key+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});}
  function fmtTime(value){if(!value)return'';const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}

  async function historyRows(){
    const [eps,movies]=await Promise.all([
      sbApi('episode_progress?select=season_number,episode_number,watched_at,media:media(id,tmdb_id,media_type,media_kind,title,release_year,poster_path)&watched=eq.true&watched_at=not.is.null&order=watched_at.desc&limit=800'),
      sbApi('media_overrides?select=state,watched_at,media:media(id,tmdb_id,media_type,media_kind,title,release_year,poster_path)&watched_at=not.is.null&state=in.(AlreadySeen,Completed)&order=watched_at.desc&limit=800')
    ]);
    const rows=[];
    for(const e of eps||[]){if(!e.media)continue;rows.push({kind:'tv',when:e.watched_at,media:e.media,meta:`T${e.season_number} • E${e.episode_number}`});}
    for(const m of movies||[]){if(!m.media||mediaKind(m.media)!=='movie')continue;rows.push({kind:'movie',when:m.watched_at,media:m.media,meta:'Filme'});}
    rows.sort((a,b)=>new Date(b.when)-new Date(a.when));return rows;
  }

  function historyCard(r){const m=r.media,type=r.kind,poster=img(m.poster_path,'w342');return `<article class="card ct30-history-card" data-ct29-id="${Number(m.tmdb_id||0)}" data-ct29-type="${type}" data-lookup-title="${esc(m.title||'')}" data-api-type="${type}"><div class="poster"${poster?` style="background-image:url('${poster}')"`:''}><span class="eyebrow">${type==='movie'?'FILME':'SÉRIE'}</span></div><div class="card-body"><h3>${esc(m.title||`TMDB #${m.tmdb_id||''}`)}</h3><p class="media-meta"><span>${esc(r.meta)}</span>${m.release_year?`<span class="dot">•</span><span>${m.release_year}</span>`:''}</p><div class="ct30-history-time">${fmtTime(r.when)}</div></div></article>`;}

  async function hydrateHistoryPosters(root,rows){
    const missing=[...root.querySelectorAll('.ct30-history-card .poster')].filter(p=>!p.style.backgroundImage).slice(0,30);
    let cursor=0;async function worker(){while(cursor<missing.length){const p=missing[cursor++],card=p.closest('.ct30-history-card'),id=Number(card?.dataset.ct29Id||0),type=card?.dataset.ct29Type;if(!id||!type)continue;try{const d=await tmdb(`/${type}/${id}`,{language:'pt-BR'});if(d.poster_path)p.style.backgroundImage=`url('${img(d.poster_path,'w342')}')`;}catch{}}}
    await Promise.all(Array.from({length:Math.min(5,missing.length)},worker));
  }

  async function loadHistory(){const host=document.querySelector('#ct30-history-body');if(!host)return;host.innerHTML='<div class="ct30-empty">Carregando histórico…</div>';try{const all=await historyRows(),rows=historyKind==='all'?all:all.filter(x=>x.kind===historyKind);if(!rows.length){host.innerHTML='<div class="ct30-empty">Nenhum item com data de visualização disponível neste filtro.</div>';return;}const groups=new Map();for(const r of rows){const k=dateKey(r.when);if(!k)continue;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);}host.innerHTML=[...groups.entries()].map(([k,list])=>`<section class="ct30-history-day"><h2>${fmtDate(k)}</h2><div class="ct30-history-grid">${list.map(historyCard).join('')}</div></section>`).join('');void hydrateHistoryPosters(host,rows);}catch(e){host.innerHTML=`<div class="ct30-empty">Falha ao carregar histórico: ${esc(e.message||e)}</div>`;}}

  function historyView(){return shell(`<header class="header"><div><div class="eyebrow">HISTÓRICO</div><h1 class="h1">O que você assistiu</h1><p class="subtitle">Filmes e episódios organizados pela data em que foram vistos.</p></div></header><div class="ct30-history-tabs"><button data-ct30-history="all" class="${historyKind==='all'?'active':''}">Mídia</button><button data-ct30-history="tv" class="${historyKind==='tv'?'active':''}">Séries</button><button data-ct30-history="movie" class="${historyKind==='movie'?'active':''}">Filmes</button></div><div id="ct30-history-body"><div class="ct30-empty">Carregando histórico…</div></div>`);}
  function bindHistory(){document.querySelectorAll('[data-ct30-history]').forEach(b=>b.addEventListener('click',()=>{historyKind=b.dataset.ct30History||'all';document.querySelectorAll('[data-ct30-history]').forEach(x=>x.classList.toggle('active',x===b));void loadHistory();}));}

  if(typeof library==='function'&&typeof mediaCard==='function'){
    library=function ctLibrary030(){
      const all=[...mediaRegistry.values()];
      const progress=all.filter(item=>typeof inProgressMedia!=='undefined'&&inProgressMedia.some(x=>x.id===item.id));
      const wl=all.filter(item=>watchlist.has(item.id));
      return shell(`<header class="header"><div><div class="eyebrow">BIBLIOTECA</div><h1 class="h1">Sua biblioteca</h1><p class="subtitle">Watchlist e títulos em andamento com capas oficiais.</p></div></header><section class="section"><div class="section-title"><h2>Em andamento</h2><span class="eyebrow">${progress.length}</span></div>${progress.length?`<div class="ct30-library-grid">${progress.map(x=>mediaCard(x)).join('')}</div>`:'<div class="ct30-empty">Nenhuma série em andamento.</div>'}</section><section class="section"><div class="section-title"><h2>Watchlist</h2><span class="eyebrow">${wl.length}</span></div>${wl.length?`<div class="ct30-library-grid">${wl.map(x=>mediaCard(x)).join('')}</div>`:'<div class="ct30-empty">Sua Watchlist está vazia.</div>'}</section>`);
    };
  }

  async function hydrateLookupCards(){
    const cards=[...document.querySelectorAll('[data-lookup-title]')].filter(el=>el.querySelector('.poster')&&!el.querySelector('.poster').style.backgroundImage).slice(0,24);
    let cursor=0;async function worker(){while(cursor<cards.length){const card=cards[cursor++],title=(card.dataset.lookupTitle||'').trim(),type=(card.dataset.apiType||'').includes('movie')?'movie':'tv',poster=card.querySelector('.poster');if(!title||!poster)continue;try{const s=await tmdb('/search/multi',{query:title,include_adult:false,page:1,language:'pt-BR'});let rows=(s.results||[]).filter(x=>x.media_type===type);const hit=rows.find(x=>(x.title||x.name||'').toLowerCase()===title.toLowerCase())||rows[0];if(hit?.poster_path){poster.style.backgroundImage=`url('${img(hit.poster_path,'w500')}')`;poster.style.backgroundSize='cover';poster.style.backgroundPosition='center';card.dataset.ct29Id=hit.id;card.dataset.ct29Type=type;}}catch{}}}
    await Promise.all(Array.from({length:Math.min(5,cards.length)},worker));
  }

  if(typeof persistState==='function'){
    const prevPersist=persistState;
    persistState=async function ctPersist030(item,state,remove=false){const out=await prevPersist(item,state,remove);if(state==='AlreadySeen'&&!remove){try{const tmdbId=item.tmdbId||Number(String(item.id||'').match(/\d+$/)?.[0]||0);if(tmdbId){const rows=await sbApi(`media?tmdb_id=eq.${tmdbId}&select=id&limit=1`);const mediaId=rows?.[0]?.id;if(mediaId)await sbApi(`media_overrides?media_id=eq.${mediaId}&state=eq.AlreadySeen`,{method:'PATCH',body:JSON.stringify({watched_at:new Date().toISOString(),updated_at:new Date().toISOString()})});}}catch{} }return out;};
  }

  const prevRender=typeof render==='function'?render:null;
  if(prevRender){render=function ctRender030(){if(currentUser&&typeof view!=='undefined'&&view==='history'){app.innerHTML=historyView();if(typeof bind==='function')bind();bindHistory();queueMicrotask(()=>void loadHistory());queueMicrotask(()=>void hydrateLookupCards());return;}const out=prevRender();queueMicrotask(()=>void hydrateLookupCards());return out;};}
  queueMicrotask(()=>void hydrateLookupCards());
})();
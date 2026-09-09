/* CineTracker Web 1.0.22 r231 — final web-only authority. */
(() => {
  'use strict';
  if (window.__ctR231V122) return;
  window.__ctR231V122 = 'final-web-only-authority';

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const mid=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
  const mtype=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||'')==='movie'?'movie':'tv'}};
  const title=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'').trim();
  const year=x=>Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4))||0;
  const GEN={12:'Aventura',14:'Fantasia',16:'Animação',18:'Drama',27:'Terror',28:'Ação',35:'Comédia',36:'História',37:'Faroeste',53:'Suspense',80:'Crime',99:'Documentário',878:'Ficção científica',9648:'Mistério',10402:'Música',10749:'Romance',10751:'Família',10752:'Guerra',10759:'Ação e Aventura',10765:'Sci-Fi e Fantasia',10766:'Novela'};
  const genreNames=x=>{const a=(x?.genres||x?.raw_tmdb?.genres||[]).map(g=>g?.name).filter(Boolean);const b=(x?.genre_ids||x?.raw_tmdb?.genre_ids||[]).map(Number).map(i=>GEN[i]).filter(Boolean);return [...new Set(a.length?a:b)].slice(0,3)};

  function stripLegends(){
    for(const e of qa('small,p,span,div')){
      if(e.childElementCount>2) continue;
      const t=norm(e.textContent);
      if(!t||t.length>320) continue;
      if(t.startsWith('regra ativa personalizado')||t.includes('baseado nos seus vistos e favoritos')||t.includes('prioridade pelo seu gosto')||t.includes('separado de filmes e series')||t.includes('filmes e series ficam nas estatisticas acima')||t.includes('respeita historico progresso e watchlist')) e.remove();
    }
  }

  function poolIndex(){
    const m=new Map(), all=[];
    for(const k of ['movie','series','anime']) for(const x of (window.__ctV118LastPools?.[k]||[])) all.push(x);
    try{all.push(...(profileCache?.dashboard||[]))}catch{}
    for(const x of all){const k=norm(title(x));if(k&&!m.has(k))m.set(k,x)}
    return m;
  }

  function ensureActions(card){
    let bar=q(':scope > .ct231-actions',card);
    if(!bar){
      bar=document.createElement('div');
      bar.className='ct231-actions';
      for(const b of qa('button,a',card).filter(x=>!x.closest('.ct231-actions'))) bar.appendChild(b);
      card.appendChild(bar);
    }
    return bar;
  }

  function discover(){
    const root=q('[data-page="discover"],[data-discover]');
    if(!root) return;
    const idx=poolIndex();
    const sections=qa('section,.panel,div',root).filter(sec=>['indicacao do dia','da sua watchlist','100 novos'].includes(norm(q('h2,h3',sec)?.textContent||'')));
    for(const sec of sections){
      sec.classList.add('ct231-section');
      const cards=qa('article,.card,.media-card',sec).filter(c=>q('img',c));
      for(const card of cards){
        card.classList.add('ct231-card');
        const bar=ensureActions(card);
        const t=qa('b,strong,h3,h4,.title,.name',card).map(e=>e.textContent.trim()).find(Boolean)||'';
        const x=idx.get(norm(t));
        if(x){
          let meta=q(':scope > .ct231-meta',card);
          if(!meta){meta=document.createElement('div');meta.className='ct231-meta';bar.before(meta)}
          meta.textContent=[year(x),genreNames(x).join(', ')].filter(Boolean).join(' · ');
        }
        for(const b of qa('button,a',bar)){
          const n=norm((b.textContent||'')+' '+(b.getAttribute('aria-label')||''));
          if(n.includes('trocar')||b.textContent.trim()==='↻'){b.textContent='↻';b.title='Trocar';b.setAttribute('aria-label','Trocar')}
          else if(n.includes('watchlist')||b.textContent.includes('+')||b.textContent.includes('＋')){b.textContent='＋';b.title='Adicionar à Watchlist';b.setAttribute('aria-label','Adicionar à Watchlist')}
        }
      }
      const loose=qa('button,a',sec).filter(b=>!b.closest('.ct231-card')&&(norm(b.textContent).includes('trocar')||b.textContent.trim()==='↻'));
      for(let i=0;i<Math.min(loose.length,cards.length);i++) ensureActions(cards[i]).appendChild(loose[i]);
      for(const p of qa('div,article',sec)) if(norm(p.textContent)==='sem item elegivel') p.classList.add('ct231-empty');
    }
  }

  function actionKind(x){
    const n=norm((x.textContent||'')+' '+(x.getAttribute?.('aria-label')||''));
    if(x.hasAttribute?.('data-ct165-open-favorite')||n.includes('ver eventos')||n==='eventos') return 'events';
    if(n.includes('assistido')) return 'watched';
    return '';
  }

  function sports(){
    for(const grid of qa('.event-grid')){
      grid.classList.add('ct231-sports-grid');
      for(const card of [...grid.children]){
        card.classList.add('ct231-sport-card');
        let bar=q(':scope > .ct231-sport-actions',card);
        if(!bar){bar=document.createElement('div');bar.className='ct231-sport-actions';card.appendChild(bar)}
        const all=qa('button,a,[role="button"],.btn,.chip',card);
        for(const kind of ['events','watched']){
          const items=all.filter(x=>actionKind(x)===kind);
          if(!items.length) continue;
          let keep=items.find(x=>x.tagName==='BUTTON'||x.tagName==='A')||items[0];
          for(const x of items) if(x!==keep) x.remove();
          if(keep.tagName!=='BUTTON'&&keep.tagName!=='A'){
            const b=document.createElement('button');b.type='button';keep.replaceWith(b);keep=b;
          }
          keep.className='ct231-sport-action '+kind;
          keep.textContent=kind==='events'?'Ver eventos':(norm(keep.textContent).includes('desmarcar')?'↶ Desmarcar':'✓ Assistido');
          if(keep.parentElement!==bar) bar.appendChild(keep);
        }
        for(const x of qa('button,a,[role="button"],.btn,.chip',card)) if(!bar.contains(x)&&actionKind(x)) x.remove();
        if(!bar.children.length) bar.remove();
      }
    }
  }

  let cache=null,cacheAt=0,task=null;
  async function fullWatchlist(force=false){
    if(!force&&cache&&Date.now()-cacheAt<60000) return cache;
    if(task) return task;
    task=Promise.resolve().then(()=>window.__ctV121FullWatchlist?window.__ctV121FullWatchlist(force):rpc('cinetracker_watchlist_full_v119',{})).then(d=>{cache=d||{rows:[]};cacheAt=Date.now();return cache}).finally(()=>task=null);
    return task;
  }
  const rowsFor=(d,k)=>(d?.rows||[]).filter(x=>(k==='movie'?mtype(x)==='movie':mtype(x)==='tv')&&mid(x)>0);

  function statsIcon(root=q('[data-profile]')){
    if(!root) return;
    for(const h of qa('h2,h3',root)){
      if(norm(h.textContent)!=='estatisticas') continue;
      const head=h.closest('.panel-head')||h.parentElement;
      const b=qa('button',head).at(-1);
      if(b){
        const expanded=b.getAttribute('aria-expanded')!=='false'&&!norm(b.textContent).includes('expandir');
        b.textContent=expanded?'⌃':'⌄';
        b.dataset.ct231Stats='1';
        b.setAttribute('aria-label',expanded?'Recolher estatísticas':'Expandir estatísticas');
      }
      break;
    }
  }

  async function profile(){
    const root=q('[data-profile]');
    if(!root) return;
    let data;
    try{data=await fullWatchlist(false)}catch{return}
    for(const kind of ['movie','series']){
      for(const el of qa('.stat,button.stat',root)){
        const label=norm(q('small',el)?.textContent||'');
        if((kind==='movie'&&label!=='filmes watchlist')||(kind==='series'&&label!=='series watchlist')) continue;
        for(const a of [...el.attributes].map(a=>a.name)) if(/^data-ct1/.test(a)) el.removeAttribute(a);
        el.dataset.ct231Watchlist=kind;
        const b=q('b',el); if(b) b.textContent=rowsFor(data,kind).length.toLocaleString('pt-BR');
      }
    }
    statsIcon(root);
  }

  const addedAt=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
  function sortRows(list,mode){
    const a=[...list], az=(x,y)=>title(x).localeCompare(title(y),'pt-BR',{numeric:true,sensitivity:'base'});
    if(mode==='release_desc') return a.sort((x,y)=>year(y)-year(x)||az(x,y));
    if(mode==='release_asc') return a.sort((x,y)=>year(x)-year(y)||az(x,y));
    if(mode==='added_desc') return a.sort((x,y)=>addedAt(y)-addedAt(x)||az(x,y));
    return a.sort(az);
  }
  function rowHtml(x){
    const kind=mtype(x),id=mid(x),t=title(x)||'Sem título',y=year(x),g=genreNames(x).join(', ');
    let poster=x?.poster_path||x?.raw_tmdb?.poster_path||'';
    if(poster&&!/^https?:/i.test(poster)) poster='https://image.tmdb.org/t/p/w185'+(String(poster).startsWith('/')?'':'/')+poster;
    return `<button class="ct231-wl-row" data-ct231-media="${kind}:${id}">${poster?`<img src="${poster}" alt="">`:''}<span><b>${t}</b><small>${[y,g].filter(Boolean).join(' · ')}</small></span><i>›</i></button>`;
  }
  function paintModal(modal,kind,mode){
    const items=sortRows(rowsFor(modal.__data,kind),mode);
    q('[data-count]',modal).textContent=items.length.toLocaleString('pt-BR');
    q('.ct231-list',modal).innerHTML=items.length?items.map(rowHtml).join(''):'<div class="empty">Nenhum item.</div>';
  }
  async function openWatchlist(kind){
    q('[data-ct231-modal]')?.remove();
    const m=document.createElement('div');
    m.className='ct231-modal';m.dataset.ct231Modal=kind;
    m.innerHTML=`<div class="ct231-dialog"><header><h2>${kind==='movie'?'Filmes':'Séries'} na Watchlist · <span data-count>…</span></h2><button data-close>×</button></header><div class="ct231-toolbar"><select data-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct231-list">Carregando…</div></div>`;
    document.body.appendChild(m);
    try{m.__data=await fullWatchlist(true);paintModal(m,kind,'alpha')}catch{q('.ct231-list',m).textContent='Não foi possível carregar a Watchlist.'}
  }

  document.addEventListener('click',e=>{
    const s=e.target.closest?.('[data-ct231-watchlist]');
    if(s){e.preventDefault();e.stopImmediatePropagation();void openWatchlist(s.dataset.ct231Watchlist);return}
    if(e.target.closest?.('[data-close]')){e.preventDefault();q('[data-ct231-modal]')?.remove();return}
    const r=e.target.closest?.('[data-ct231-media]');
    if(r){e.preventDefault();e.stopImmediatePropagation();const[k,id]=r.dataset.ct231Media.split(':');q('[data-ct231-modal]')?.remove();try{go(`/${k==='movie'?'movie':'series'}/${Number(id)}`)}catch{location.href=`/${k==='movie'?'movie':'series'}/${Number(id)}`}}
  },true);
  document.addEventListener('change',e=>{const s=e.target.closest?.('[data-sort]');if(!s)return;const m=s.closest('[data-ct231-modal]');if(m?.__data)paintModal(m,m.dataset.ct231Modal,s.value)},true);

  function sync(){stripLegends();discover();sports();void profile()}
  let timer=0;
  try{new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(sync,60)}).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
  setInterval(sync,1500);sync();

  const st=document.createElement('style');
  st.id='ct231-style';
  st.textContent=`.ct231-card{width:200px!important;min-width:200px!important;max-width:200px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}.ct231-card img{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}.ct231-meta{padding:5px 9px 0;font-size:10px;color:#91a9b4}.ct231-actions{margin-top:auto!important;padding:8px!important;display:flex!important;gap:7px!important}.ct231-actions button,.ct231-actions a{width:34px!important;height:34px!important;min-width:34px!important;padding:0!important;border-radius:10px!important;display:grid!important;place-items:center!important}.ct231-empty{width:200px!important;min-height:300px!important;display:grid!important;place-items:center!important}.ct231-sports-grid{display:grid!important;grid-template-columns:repeat(3,minmax(260px,1fr))!important;gap:12px!important;overflow:visible!important}.ct231-sport-card{display:flex!important;flex-direction:column!important;min-width:0!important}.ct231-sport-actions{margin-top:auto!important;padding-top:10px!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.ct231-sport-action{height:36px!important;width:100%!important;border-radius:10px!important}.ct231-modal{position:fixed;inset:0;z-index:12000;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:18px}.ct231-dialog{width:min(980px,96vw);max-height:92vh;background:#07131a;border:1px solid #285061;border-radius:18px;display:flex;flex-direction:column;overflow:hidden}.ct231-dialog header{display:flex;justify-content:space-between;align-items:center;padding:16px}.ct231-toolbar{display:flex;justify-content:flex-end;padding:0 16px 12px}.ct231-toolbar select{min-width:230px;height:38px;border-radius:10px}.ct231-list{overflow:auto;padding:12px;display:grid;gap:8px}.ct231-wl-row{width:100%!important;display:grid!important;grid-template-columns:64px minmax(0,1fr) 20px!important;gap:12px!important;align-items:center!important;text-align:left!important;padding:8px 10px!important;border:1px solid #234653!important;border-radius:12px!important;background:#0a1921!important;color:inherit!important}.ct231-wl-row img{width:64px!important;height:96px!important;object-fit:cover!important;border-radius:8px!important}.ct231-wl-row span{display:flex!important;flex-direction:column!important;gap:5px!important}.ct231-wl-row b{font-size:14px!important}.ct231-wl-row small{display:block!important;color:#91a9b4!important;font-size:11px!important}@media(max-width:1100px){.ct231-sports-grid{grid-template-columns:repeat(2,minmax(240px,1fr))!important}}@media(max-width:720px){.ct231-sports-grid{grid-template-columns:1fr!important}}`;
  document.getElementById(st.id)?.remove();document.head.appendChild(st);

  window.__ctV122FinalSync=sync;
  window.__ctV122FinalSports=sports;
  window.__ctV122FinalOpenWatchlist=openWatchlist;
})();

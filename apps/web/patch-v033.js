(() => {
'use strict';
const VERSION='0.3.4';

// Shared GET cache for TMDB proxy calls. Several legacy patches ask for the
// same title/person during one render; coalescing those requests makes page
// changes and Android WebView rendering noticeably faster.
const realFetch=window.fetch.bind(window);
const tmdbFetchCache=new Map();
window.fetch=function(input,init={}){
  try{
    const url=typeof input==='string'?input:input?.url||String(input);
    const method=String(init?.method||'GET').toUpperCase();
    if(method==='GET'&&url.includes('/functions/v1/tmdb-proxy')){
      const auth=(init?.headers&&((init.headers.Authorization)||(init.headers.authorization)))||'';
      const key=url+'|'+auth;
      const hit=tmdbFetchCache.get(key);
      if(hit&&Date.now()-hit.t<300000)return hit.p.then(r=>r.clone());
      const p=realFetch(input,init).then(r=>{
        if(!r.ok){tmdbFetchCache.delete(key);return r;}
        return r.clone();
      }).catch(e=>{tmdbFetchCache.delete(key);throw e;});
      tmdbFetchCache.set(key,{t:Date.now(),p});
      return p.then(r=>r.clone());
    }
  }catch{}
  return realFetch(input,init);
};

const posterCache=new Map();
function proxyImage(path,size='w500'){
  if(!path)return '';
  return `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`;
}
function mediaType(card){
  const raw=String(card.dataset.apiType||card.dataset.type||'').toLowerCase();
  return raw.includes('movie')||raw.includes('filme')?'movie':raw.includes('tv')||raw.includes('serie')||raw.includes('série')?'tv':'';
}
function titleOf(card){return (card.dataset.lookupTitle||card.querySelector('h3,h2,strong')?.textContent||'').trim();}
async function searchPoster(card){
  if(card.dataset.ct33Poster==='1')return;
  const poster=card.querySelector('.poster,.tmdb-poster');
  if(!poster)return;
  const existing=poster.style.backgroundImage||getComputedStyle(poster).backgroundImage||'';
  if(existing&&existing!=='none'&&!existing.includes('gradient')){card.dataset.ct33Poster='1';return;}
  const title=titleOf(card); if(!title)return;
  card.dataset.ct33Poster='1';
  const type=mediaType(card),year=String(card.dataset.year||'');
  const key=[type,title.toLowerCase(),year].join('|');
  try{
    let hit=posterCache.get(key);
    if(!hit){
      try{hit=JSON.parse(sessionStorage.getItem('ct33:'+key)||'null')}catch{}
    }
    if(!hit){
      const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
      u.searchParams.set('path','/search/multi');u.searchParams.set('query',title);u.searchParams.set('language','pt-BR');u.searchParams.set('include_adult','false');u.searchParams.set('page','1');
      const r=await fetch(u,{headers:authHeaders()});const d=await r.json();
      let rows=(d.results||[]).filter(x=>['movie','tv'].includes(x.media_type));
      if(type)rows=rows.filter(x=>x.media_type===type);
      const exact=rows.find(x=>String(x.title||x.name||'').toLowerCase()===title.toLowerCase());
      const row=exact||rows[0];
      hit=row?.poster_path?{poster_path:row.poster_path,title:row.title||row.name||title}:null;
      if(hit){posterCache.set(key,hit);try{sessionStorage.setItem('ct33:'+key,JSON.stringify(hit))}catch{}}
    }
    if(hit?.poster_path){
      poster.style.backgroundImage=`linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.03)),url('${proxyImage(hit.poster_path,'w500')}')`;
      poster.style.backgroundSize='cover';poster.style.backgroundPosition='center 18%';
      const h=card.querySelector('h3,h2,strong');if(h&&(!h.textContent||/sem título|carregando/i.test(h.textContent)))h.textContent=hit.title||title;
    }else card.dataset.ct33Poster='0';
  }catch{card.dataset.ct33Poster='0';}
}
async function hydrateVisibleCards(root=document){
  const all=[...root.querySelectorAll?.('.card,.feature')||[]].filter(c=>!c.closest('#ct29-overlay')&&c.dataset.ct33Poster!=='1');
  const first=all.slice(0,10);
  const workers=[];let i=0;
  for(let n=0;n<4;n++)workers.push((async()=>{while(i<first.length){const card=first[i++];await searchPoster(card);}})());
  await Promise.all(workers);
}
function moveImportIntoSettings(){
  document.querySelectorAll('.nav [data-view="import"],.mobile-nav [data-view="import"]').forEach(b=>b.style.display='none');
  const heading=[...document.querySelectorAll('h1,.h1')].find(x=>/configurações|configuracoes/i.test(x.textContent||''));
  if(!heading)return;
  const host=heading.closest('.content')||document.querySelector('.content');if(!host||host.querySelector('#ct33-import-settings'))return;
  const box=document.createElement('section');box.id='ct33-import-settings';box.className='panel';box.style.cssText='padding:14px;margin:14px 0';
  box.innerHTML='<h2 style="margin:0 0 6px">Importar e exportar</h2><p class="subtitle">Traga seu histórico antigo ou faça backup dos seus dados.</p><button type="button" class="btn-secondary" id="ct33-open-import" style="margin-top:10px">⇧ Importar dados</button>';
  host.appendChild(box);box.querySelector('#ct33-open-import').onclick=()=>{try{view='import';render()}catch{document.querySelector('[data-view="import"]')?.click();}};
}
function updateVersion(){document.querySelectorAll('.cloud-bar').forEach(el=>{el.innerHTML=el.innerHTML.replace(/CineTracker Oficial v\d+\.\d+\.\d+/g,'CineTracker Oficial v'+VERSION);});}
let scheduled=false;
function run(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;hydrateVisibleCards();moveImportIntoSettings();updateVersion();});}
const obs=new MutationObserver(run);obs.observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',run);setTimeout(run,0);
})();

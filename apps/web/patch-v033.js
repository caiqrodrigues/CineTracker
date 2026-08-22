(() => {
'use strict';
const VERSION='0.3.5';
const realFetch=window.fetch.bind(window);
const tmdbFetchCache=new Map();
window.fetch=function(input,init={}){
  try{
    const url=typeof input==='string'?input:input?.url||String(input);
    const method=String(init?.method||'GET').toUpperCase();
    if(method==='GET'&&url.includes('/functions/v1/tmdb-proxy')){
      const auth=(init?.headers&&((init.headers.Authorization)||(init.headers.authorization)))||'';
      const key=url+'|'+auth,hit=tmdbFetchCache.get(key);
      if(hit&&Date.now()-hit.t<600000)return hit.p.then(r=>r.clone());
      const p=realFetch(input,init).then(r=>{if(!r.ok)tmdbFetchCache.delete(key);return r.clone();}).catch(e=>{tmdbFetchCache.delete(key);throw e;});
      tmdbFetchCache.set(key,{t:Date.now(),p});return p.then(r=>r.clone());
    }
  }catch{}
  return realFetch(input,init);
};
const mediaCache=new Map();
const proxyImage=(path,size='w500')=>path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`:'';
function typeOf(card){const raw=String(card.dataset.apiType||card.dataset.type||'').toLowerCase();return raw.includes('movie')||raw.includes('filme')?'movie':raw.includes('tv')||raw.includes('serie')||raw.includes('série')?'tv':'';}
function registryItem(card){
  try{
    const id=card.dataset.mediaId||'';
    if(typeof mediaRegistry!=='undefined'&&mediaRegistry?.get&&id&&mediaRegistry.get(id))return mediaRegistry.get(id);
    const title=(card.dataset.lookupTitle||card.querySelector('h3,h2,strong')?.textContent||'').trim().toLowerCase();
    if(typeof mediaRegistry!=='undefined'&&mediaRegistry?.values&&title){for(const item of mediaRegistry.values()){if(String(item?.title||item?.lookupTitle||'').trim().toLowerCase()===title)return item;}}
  }catch{}
  return null;
}
async function detailsFor(card){
  const item=registryItem(card),type=item?.apiType||typeOf(card)||'tv';
  let id=Number(item?.tmdbId||0);
  if(!id){const m=String(item?.id||card.dataset.mediaId||'').match(/tmdb-(?:movie|tv)-(\d+)/);if(m)id=Number(m[1]);}
  const title=String(item?.lookupTitle||item?.title||card.dataset.lookupTitle||card.querySelector('h3,h2,strong')?.textContent||'').trim();
  const key=id?`${type}:${id}`:`${type}:${title.toLowerCase()}`;
  if(mediaCache.has(key))return mediaCache.get(key);
  let d=null;
  if(id){
    const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${type}/${id}`);u.searchParams.set('language','pt-BR');
    const r=await fetch(u,{headers:authHeaders()});if(r.ok)d=await r.json();
  }
  if(!d&&title){
    const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path','/search/multi');u.searchParams.set('query',title);u.searchParams.set('language','pt-BR');u.searchParams.set('include_adult','false');u.searchParams.set('page','1');
    const r=await fetch(u,{headers:authHeaders()});if(r.ok){const s=await r.json();let rows=(s.results||[]).filter(x=>['movie','tv'].includes(x.media_type));if(type)rows=rows.filter(x=>x.media_type===type);d=rows.find(x=>String(x.title||x.name||'').toLowerCase()===title.toLowerCase())||rows[0]||null;}
  }
  if(d)mediaCache.set(key,d);return d;
}
async function hydrateCard(card){
  if(card.dataset.ct35Done==='1')return;card.dataset.ct35Done='1';
  try{
    const d=await detailsFor(card);if(!d){card.dataset.ct35Done='0';return;}
    const title=d.title||d.name;const h=card.querySelector('h3,h2,strong');if(title&&h&&(!h.textContent?.trim()||/sem título|carregando/i.test(h.textContent)))h.textContent=title;
    const p=card.querySelector('.poster,.tmdb-poster');if(d.poster_path&&p){p.style.backgroundImage=`linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.03)),url('${proxyImage(d.poster_path,'w500')}')`;p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%';}
  }catch{card.dataset.ct35Done='0';}
}
async function hydrateHome(root=document){
  const cards=[...root.querySelectorAll?.('.card,.feature')||[]].filter(c=>!c.closest('#ct29-overlay'));
  let i=0;const workers=Array.from({length:6},()=> (async()=>{while(i<cards.length){const c=cards[i++];await hydrateCard(c);}})());
  await Promise.all(workers);
}
function cleanupUi(){
  document.querySelectorAll('.cloud-bar').forEach(el=>el.style.display='none');
  document.querySelectorAll('#ct33-import-settings').forEach(el=>el.remove());
  document.querySelectorAll('.nav [data-view="import"],.mobile-nav [data-view="import"]').forEach(b=>b.style.display='none');
  document.querySelectorAll('.cloud-bar').forEach(el=>{el.innerHTML=el.innerHTML.replace(/CineTracker Oficial v\d+\.\d+\.\d+/g,'CineTracker Oficial v'+VERSION);});
}
let scheduled=false;
function run(root=document){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;cleanupUi();if(typeof view==='undefined'||view==='home')hydrateHome(root);});}
const obs=new MutationObserver(ms=>{for(const m of ms){if(m.addedNodes.length){run(document);break;}}});obs.observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',()=>run(document));setTimeout(()=>run(document),0);
})();

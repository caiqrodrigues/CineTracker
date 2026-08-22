(() => {
'use strict';
const VERSION='0.3.3';
const cache=new Map();
const img=(path,size='w500')=>path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`:'';
async function tmdb(path,params={}){
  const qs=new URLSearchParams(Object.entries(params).filter(([,v])=>v!==undefined&&v!=='').map(([k,v])=>[k,String(v)])).toString();
  const key=path+'?'+qs,hit=cache.get(key);if(hit&&Date.now()-hit.t<600000)return hit.v;
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);for(const[k,v]of Object.entries(params))if(v!==undefined&&v!=='')u.searchParams.set(k,String(v));
  const r=await fetch(u,{headers:authHeaders()});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||d.status_message||`TMDB ${r.status}`);cache.set(key,{t:Date.now(),v:d});return d;
}
function patchBg(el){if(!el?.style)return;const bg=el.style.backgroundImage||'';const m=bg.match(/https:\/\/image\.tmdb\.org\/t\/p\/([^/]+)(\/[^'"\)]+)/);if(m)el.style.backgroundImage=bg.replace(m[0],img(m[2],m[1]));}
function rewrite(root=document){if(root.nodeType===1)patchBg(root);const all=root.querySelectorAll?root.querySelectorAll('*'):[];for(const el of all){patchBg(el);if(el.tagName==='IMG'&&String(el.src||'').includes('image.tmdb.org/t/p/')){try{const u=new URL(el.src),p=u.pathname.split('/'),size=p[3],path='/'+p.slice(4).join('/');el.src=img(path,size);}catch{}}}}
async function hydrateHistory(root=document){
  const cards=[...root.querySelectorAll?.('.ct30-history-card[data-ct30-id]')||[]];
  for(const card of cards){if(card.dataset.ct32Done==='1')continue;card.dataset.ct32Done='1';const id=Number(card.dataset.ct30Id),type=card.dataset.ct30Type==='movie'?'movie':'tv';if(!id)continue;try{const d=await tmdb(`/${type}/${id}`,{language:'pt-BR'});const title=d.title||d.name;const poster=card.querySelector('.ct30-history-poster');const strong=card.querySelector('.ct30-history-body strong');if(title&&strong)strong.textContent=title;if(d.poster_path&&poster){poster.style.backgroundImage=`url('${img(d.poster_path,'w342')}')`;poster.style.backgroundSize='cover';poster.style.backgroundPosition='center';}}catch{card.dataset.ct32Done='0';}}
}
async function hydrateFavs(root=document){
  const cards=[...root.querySelectorAll?.('.ct30-fav[data-ct30-id],.ct30-follow-card[data-ct30-id]')||[]];
  for(const card of cards){if(card.dataset.ct32Done==='1')continue;card.dataset.ct32Done='1';const id=Number(card.dataset.ct30Id),type=card.dataset.ct30Type==='movie'?'movie':'tv';if(!id)continue;try{const d=await tmdb(`/${type}/${id}`,{language:'pt-BR'});const title=d.title||d.name;const strong=card.querySelector('strong');const poster=card.querySelector('.ct30-fav-poster,.ct30-follow-poster');if(title&&strong)strong.textContent=title;if(d.poster_path&&poster)poster.style.backgroundImage=`url('${img(d.poster_path,'w342')}')`;}catch{card.dataset.ct32Done='0';}}
}
async function hydratePeople(root=document){
  const people=[...root.querySelectorAll?.('.ct29-person[data-ct29-person]')||[]];
  for(const card of people){if(card.dataset.ct32Done==='1')continue;card.dataset.ct32Done='1';const id=Number(card.dataset.ct29Person);if(!id)continue;try{const p=await tmdb(`/person/${id}`,{language:'pt-BR'});const photo=card.querySelector('.ct29-person-photo');if(p.profile_path&&photo)photo.style.backgroundImage=`url('${img(p.profile_path,'w342')}')`;}catch{card.dataset.ct32Done='0';}}
  const page=root.matches?.('.ct29-person-page')?root:root.querySelector?.('.ct29-person-page');if(page&&!page.dataset.ct32Done){page.dataset.ct32Done='1';const name=page.querySelector('.ct29-title')?.textContent?.trim();if(name){try{const s=await tmdb('/search/person',{query:name,language:'pt-BR',include_adult:false,page:1});const hit=(s.results||[]).find(x=>String(x.name||'').toLowerCase()===name.toLowerCase())||s.results?.[0];if(hit?.id){const p=await tmdb(`/person/${hit.id}`,{language:'pt-BR'});const photo=page.querySelector('.ct29-person-main-photo');if(p.profile_path&&photo)photo.style.backgroundImage=`url('${img(p.profile_path,'h632')}')`;}}catch{page.dataset.ct32Done='';}}}
}
function version(){document.querySelectorAll('.cloud-bar').forEach(el=>{if(/CineTracker Oficial v\d+\.\d+\.\d+/.test(el.textContent||'')){for(const n of el.childNodes){if(n.nodeType===Node.TEXT_NODE&&/CineTracker Oficial v\d+\.\d+\.\d+/.test(n.textContent||''))n.textContent=(n.textContent||'').replace(/CineTracker Oficial v\d+\.\d+\.\d+/,'CineTracker Oficial v'+VERSION);}}});}
function run(root=document){rewrite(root);hydrateHistory(root);hydrateFavs(root);hydratePeople(root);version();}
const obs=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)run(n);});obs.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>run(document),0);setInterval(()=>run(document),2500);
})();

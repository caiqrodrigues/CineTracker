(() => {
'use strict';
const VERSION='0.3.2';
const esc31=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'');
const cache31=new Map();
const imageProxy31=(path,size='w500')=>path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`:'';

async function tmdb31(path,params={}){
  const key=path+'?'+new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v??'')])).toString();
  const hit=cache31.get(key);if(hit&&Date.now()-hit.t<600000)return hit.v;
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);
  for(const[k,v]of Object.entries(params))if(v!==undefined&&v!=='')u.searchParams.set(k,String(v));
  const r=await fetch(u,{headers:authHeaders()});const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||d.status_message||`TMDB ${r.status}`);
  cache31.set(key,{t:Date.now(),v:d});return d;
}
function providers31(raw){const br=raw?.results?.BR||{};const rows=[...(br.flatrate||[]),...(br.free||[]),...(br.ads||[])];const seen=new Set();return rows.filter(x=>x?.provider_name&&!seen.has(x.provider_name)&&seen.add(x.provider_name)).map(x=>x.provider_name);}
async function lookup31(params={}){
  let type=params.type==='movie'?'movie':'tv',id=0,base=null;
  const m=String(params.title||'').match(/^TMDB\s*#(\d+)$/i);if(m)id=Number(m[1]);
  if(!id){const s=await tmdb31('/search/multi',{query:params.title||'',language:'pt-BR',include_adult:false,page:1});let rows=(s.results||[]).filter(x=>x.media_type==='movie'||x.media_type==='tv');if(params.type)rows=rows.filter(x=>x.media_type===type);const y=Number(params.year);if(y)rows.sort((a,b)=>{const ay=Number((a.release_date||a.first_air_date||'').slice(0,4))===y?1:0,by=Number((b.release_date||b.first_air_date||'').slice(0,4))===y?1:0;return by-ay});base=rows[0]||null;if(!base)return{result:null};id=base.id;type=base.media_type;}
  const [d,c,p]=await Promise.all([tmdb31(`/${type}/${id}`,{language:'pt-BR'}),tmdb31(`/${type}/${id}/credits`,{language:'pt-BR'}).catch(()=>({cast:[]})),tmdb31(`/${type}/${id}/watch/providers`).catch(()=>({results:{}}))]);
  const date=d.release_date||d.first_air_date||'';
  return{result:{id:d.id,mediaType:type,title:d.title||d.name||base?.title||base?.name||params.title||'Sem título',originalTitle:d.original_title||d.original_name||'',year:date?Number(date.slice(0,4)):null,posterPath:d.poster_path||null,posterUrl:d.poster_path?imageProxy31(d.poster_path,'w500'):null,genres:(d.genres||[]).map(g=>g.name),actors:(c.cast||[]).slice(0,5).map(x=>x.name),rating:Number(d.vote_average||0),availability:{streaming:providers31(p),link:p?.results?.BR?.link||''}}};
}
if(typeof tmdbFetch==='function'){
  tmdbFetch=async function(params={}){
    if(params.mode==='lookup')return lookup31(params);
    if(params.path)return tmdb31(params.path,params);
    const u=new URLSearchParams(params);const path=u.get('path');if(path){u.delete('path');return tmdb31(path,Object.fromEntries(u));}
    return lookup31(params);
  };
}
function bindExtraNav31(){
  document.querySelectorAll('[data-view="history"],[data-view="profile"]').forEach(b=>{b.onclick=()=>{view=b.dataset.view;render();};});
}
function rewriteImages31(root=document){
  const all=root.querySelectorAll?root.querySelectorAll('*'):[];
  for(const el of all){
    const bg=el.style?.backgroundImage||'';const mm=bg.match(/https:\/\/image\.tmdb\.org\/t\/p\/([^/]+)(\/[^'"\)]+)/);if(mm)el.style.backgroundImage=bg.replace(mm[0],imageProxy31(mm[2],mm[1]));
    if(el.tagName==='IMG'&&String(el.src||'').includes('image.tmdb.org/t/p/')){try{const u=new URL(el.src),parts=u.pathname.split('/');const size=parts[3],path='/'+parts.slice(4).join('/');el.src=imageProxy31(path,size);}catch{}}
  }
}
async function hydrateVisible31(){
  const cards=[...document.querySelectorAll('.card[data-media-id]')].slice(0,30);
  for(const card of cards){
    const item=typeof mediaRegistry!=='undefined'?mediaRegistry.get(card.dataset.mediaId):null;if(!item?.tmdbId)continue;
    const needs=!item.posterUrl||/^TMDB\s*#/i.test(item.title||'')||!item.genres?.length;
    if(!needs)continue;
    try{
      const {result}=await lookup31({title:item.title,type:item.apiType||'tv',year:item.year});if(!result)continue;
      item.title=result.title||item.title;item.lookupTitle=result.originalTitle||result.title||item.lookupTitle;item.year=result.year?String(result.year):item.year;item.posterUrl=result.posterUrl||item.posterUrl;item.genres=result.genres||item.genres;item.actors=result.actors||item.actors;item.rating=result.rating?Number(result.rating).toFixed(1):item.rating;item.availability=result.availability||item.availability;
      const h=card.querySelector('h3');if(h)h.textContent=item.title;
      const p=card.querySelector('.poster');if(p&&result.posterPath){p.classList.add('tmdb-poster');p.style.backgroundImage=`linear-gradient(to top,rgba(0,0,0,.72),rgba(0,0,0,.05)),url('${imageProxy31(result.posterPath,'w500')}')`;}
      const meta=card.querySelector('.media-meta');if(meta)meta.innerHTML=`<span>${esc31(item.year||'—')}</span><span class="dot">•</span><span>${esc31((item.genres||[]).join(' • ')||'Gênero não informado')}</span>`;
      const cast=card.querySelector('.cast');if(cast)cast.innerHTML=`<strong>Principais atores:</strong> ${esc31((item.actors||[]).join(', ')||'Elenco não informado')}`;
    }catch{}
  }
  const feature=document.querySelector('.feature.js-feature-media');if(feature){const title=feature.querySelector('h2');const raw=feature.dataset.lookupTitle||title?.textContent||'';const m=raw.match(/^TMDB\s*#(\d+)$/i);if(m){const apiType=(feature.dataset.apiType||'tv').includes('movie')?'movie':'tv';try{const {result}=await lookup31({title:raw,type:apiType});if(result){if(title)title.textContent=result.title;const p=feature.querySelector('.poster');if(p&&result.posterPath)p.style.backgroundImage=`url('${imageProxy31(result.posterPath,'w500')}')`;}}catch{}}}
  rewriteImages31();
}
function version31(){document.querySelectorAll('.cloud-bar').forEach(el=>{for(const n of el.childNodes){if(n.nodeType===Node.TEXT_NODE&&/CineTracker Oficial v\d+\.\d+\.\d+/.test(n.textContent||''))n.textContent=(n.textContent||'').replace(/CineTracker Oficial v\d+\.\d+\.\d+/,'CineTracker Oficial v'+VERSION);else if(n.nodeType===Node.ELEMENT_NODE&&/CineTracker Oficial v\d+\.\d+\.\d+/.test(n.textContent||''))n.textContent=n.textContent.replace(/CineTracker Oficial v\d+\.\d+\.\d+/,'CineTracker Oficial v'+VERSION);}});}
const oldRender31=typeof render==='function'?render:null;
if(oldRender31)render=function(){const r=oldRender31();setTimeout(()=>{bindExtraNav31();hydrateVisible31();rewriteImages31();version31();},0);return r;};
const obs31=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)rewriteImages31(n);});obs31.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>{bindExtraNav31();hydrateVisible31();rewriteImages31();version31();},0);
})();

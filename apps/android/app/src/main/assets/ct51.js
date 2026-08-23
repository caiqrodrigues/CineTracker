(() => {
'use strict';
if(window.__ct51Loaded)return;window.__ct51Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let syncing=false,lastSync=0,knownIds=new Set(),knownTitles=new Set();

function mediaKey(type,id){return `tmdb-${type}-${Number(id)}`}
function collectCardId(card){
  const raw=card?.dataset?.mediaId||card?.querySelector?.('[data-media-id]')?.dataset?.mediaId||'';
  if(raw)return raw;
  const id=Number(card?.dataset?.id||card?.querySelector?.('[data-id]')?.dataset?.id||0);
  if(!id)return'';
  const type=card?.dataset?.type==='movie'||/FILME/i.test(card.textContent||'')?'movie':'tv';
  return mediaKey(type,id);
}
function collectTitle(card){
  const el=$('h1,h2,h3,.ct47-title,.ct48-home-title,strong',card);
  return norm(el?.textContent||card?.dataset?.title||'');
}
async function syncKnown(force=false){
  if(syncing||(!force&&Date.now()-lastSync<1000))return;
  syncing=true;lastSync=Date.now();
  try{
    const [cont,over]=await Promise.all([
      sbRpc('cinetracker_continue_items_v2',{}).catch(()=>[]),
      sbApi('media_overrides?select=state,media:media(tmdb_id,media_type,title)&limit=5000').catch(()=>[])
    ]);
    const ids=new Set(),titles=new Set();
    for(const r of cont||[]){if(r?.tmdb_id)ids.add(mediaKey('tv',r.tmdb_id));if(r?.title)titles.add(norm(r.title))}
    for(const r of over||[]){const m=r?.media;if(!m)continue;if(m.tmdb_id&&m.media_type)ids.add(mediaKey(m.media_type,m.tmdb_id));if(m.title)titles.add(norm(m.title))}
    knownIds=ids;knownTitles=titles;
  }finally{syncing=false}
}
function filterDiscover(){
  if(typeof view==='undefined'||view!=='discover')return;
  const root=$('.content')||document;
  const cards=$$('.card,.feature,[data-media-id],[data-id]',root).filter(c=>c.matches?.('.card,.feature')||c.closest?.('.card,.feature')===c);
  for(const card of cards){
    const id=collectCardId(card),title=collectTitle(card);
    const blocked=(id&&knownIds.has(id))||(title&&knownTitles.has(title));
    card.classList.toggle('ct51-hidden-known',!!blocked);
  }
}
function providerFamily(name){
  const n=norm(name);
  if(n.includes('paramount'))return'paramount+';
  if(n.includes('prime video')||n==='amazon video'||n.includes('amazon prime'))return'amazon prime video';
  if(n.includes('apple tv'))return'apple tv';
  if(n.includes('disney'))return'disney+';
  if(n.includes('max')||n.includes('hbo'))return'max';
  if(n.includes('globoplay'))return'globoplay';
  if(n.includes('netflix'))return'netflix';
  if(n.includes('crunchyroll'))return'crunchyroll';
  if(n.includes('mubi'))return'mubi';
  if(n.includes('telecine'))return'telecine';
  if(n.includes('starz'))return'starz';
  return n.replace(/\b(amazon channel|apple tv channel|roku premium channel|premium channel|channel|with ads|com anuncios|ads)\b/g,'').replace(/\s+/g,' ').trim();
}
function dedupeProviders(){
  const track=$('.ct50-provider-track');if(!track)return;
  const seen=new Set();
  for(const card of $$('.ct50-provider',track)){
    const name=$('.ct50-provider-body strong',card)?.textContent||'';
    const key=providerFamily(name);
    if(!key||seen.has(key)){card.remove();continue}
    seen.add(key);
  }
}
function fixBuildFooter(){
  if(typeof view==='undefined'||view!=='settings')return;
  const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.61';
}
async function applyAsync(){await syncKnown();filterDiscover();dedupeProviders()}
function apply(){fixBuildFooter();void applyAsync()}
document.addEventListener('click',e=>{if(typeof view!=='undefined'&&view==='discover'&&e.target.closest('button'))setTimeout(()=>{lastSync=0;void syncKnown(true).then(filterDiscover)},120)},true);
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
const css=document.createElement('style');css.id='ct51-style';css.textContent='.ct51-hidden-known{display:none!important}';document.head.appendChild(css);
setTimeout(apply,80);setTimeout(apply,450);setTimeout(apply,1200);
})();

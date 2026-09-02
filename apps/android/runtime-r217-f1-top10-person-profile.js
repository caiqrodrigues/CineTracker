/* Android 0.99.7.45 — reliable Top 10 + imported-media recovery + direct person hero */
(() => {
'use strict';
if(window.__ctAndroidR217Loaded)return;
window.__ctAndroidR217Loaded=true;
window.__ctAndroidR217='top10-independent-imported-media-direct-person-profile-trim';
window.__ctAndroidTop10='synchronous-own-shell-tokenized-provider-flow';
window.__ctAndroidImportedMedia='invalid-id-unique-exact-title-fallback-positive-id';
window.__ctAndroidPerson='remove-cinetracker-person-header-direct-photo-bio';
window.__ctAndroidProfile='remove-series-count-card-only';
window.__ctAndroidScope='android-only-web-untouched';
window.__ctAndroidBundle='android-v0.99.7.45-r217-f1-top10-person-profile';

/* ---------- Top 10: owns its shell immediately, so old Pra voce content cannot remain ---------- */
let topToken217=0;
function topRoot217(token=topToken217){try{return document.querySelector('[data-ct217-top10="'+String(token)+'"]')}catch{return null}}
function topCurrent217(token){const r=topRoot217(token);return !!(r&&r.isConnected&&token===topToken217)}
function markTopRail217(){
  try{document.querySelectorAll('[data-discover-tab]').forEach(b=>{const on=String(b.dataset.discoverTab||'')==='top10';b.classList.toggle('active',on);b.classList.toggle('selected',on);b.setAttribute('aria-selected',on?'true':'false');if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}catch{}
}
function providerButtons217(rows){
  return (rows||[]).map(p=>`<button type="button" class="ct171-provider-tab ${Number(p.provider_id)===Number(ct171TopProvider)?'active':''}" data-ct171-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name)}</b></button>`).join('')||'<div class="empty">Nenhum streaming configurado.</div>';
}
async function paintTop217(provider,token=topToken217){
  const root=topRoot217(token),content=root?.querySelector('[data-ct171-top-content]');
  if(!content)return true;
  content.innerHTML=loading('Montando Top 10...');
  try{
    const data=await ct171TopRows(Number(provider));
    if(!topCurrent217(token))return true;
    ct171TopProvider=Number(provider)||ct171TopProvider;
    const p=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider));
    content.innerHTML=`<div class="ct217-top-provider"><b>${esc(p?.provider_name||'Streaming')}</b></div><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${data.series.length}</small></div><div class="ct171-top-row">${data.series.map(ct171TopCard).join('')||'<div class="empty">Sem séries disponíveis neste streaming.</div>'}</div></section><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${data.movies.length}</small></div><div class="ct171-top-row">${data.movies.map(ct171TopCard).join('')||'<div class="empty">Sem filmes disponíveis neste streaming.</div>'}</div></section>`;
    try{root.querySelectorAll('[data-ct171-provider]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ct171Provider)===Number(provider)))}catch{}
    try{if(typeof ct171DecorateSeen==='function')void ct171DecorateSeen(false)}catch{}
    return true;
  }catch(e){if(topCurrent217(token))content.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover');return true}
}
async function renderTop217(){
  try{discoverState.tab='top10';discoverState.type='all'}catch{}
  const token=++topToken217;
  let rail='';try{rail=ctR180TabRail()}catch{}
  /* Synchronous repaint is intentional: no stale Pra voce DOM survives the tap. */
  setApp(shell('Descobrir','','discover',`<div class="page" data-discover data-ct217-top10="${token}">${rail}<section class="ct171-top10-shell"><div class="ct171-top10-title"><h2>Top 10</h2></div><div class="ct171-provider-tabs" data-ct171-provider-tabs>${loading('Carregando streamings...')}</div><div data-ct171-top-content>${loading('Carregando Top 10...')}</div></section></div>`));
  markTopRail217();
  try{
    ct171ProviderList=null;
    const providers=await ct171Providers();
    if(!topCurrent217(token))return true;
    if(!ct171TopProvider||!providers.some(x=>Number(x.provider_id)===Number(ct171TopProvider)))ct171TopProvider=Number(providers[0]?.provider_id||0);
    const box=topRoot217(token)?.querySelector('[data-ct171-provider-tabs]');if(box)box.innerHTML=providerButtons217(providers);
    if(ct171TopProvider)await paintTop217(ct171TopProvider,token);
    markTopRail217();
    try{if(typeof ct214CleanExplanatory==='function')ct214CleanExplanatory()}catch{}
    return true;
  }catch(e){const h=topRoot217(token)?.querySelector('[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar streamings: '+(e?.message||e),'discover');return true}
}
window.ctR217RenderTop10=renderTop217;
try{ct171PaintTopProvider=paintTop217}catch{}
try{ctR180PaintTopProvider=paintTop217}catch{}

/* ---------- Imported media: retry negative/invalid TMDB ids without trusting broken import year ---------- */
const P217_PREFIX='ct:a45:media:';
const p217Inflight=new Map();
function norm217(v){try{return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' e ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}catch{return String(v||'').toLowerCase().trim()}}
function names217(x){return [x?.title,x?.name,x?.original_title,x?.original_name].map(norm217).filter(Boolean)}
function hash217(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function job217(host){
  const m=String(host?.dataset?.media||'').match(/^(movie|tv):(-?\d+)$/);if(!m)return null;
  const oldId=Number(m[2]||0)||0;if(oldId>0)return null;
  const title=host.querySelector('b')?.textContent?.trim()||host.querySelector('.card-title')?.textContent?.trim()||'';if(!title)return null;
  return {host,type:m[1],oldId,title,key:hash217(m[1]+'|'+norm217(title))};
}
function pick217(rows,title){
  const q=norm217(title);
  const exact=(Array.isArray(rows)?rows:[]).filter(x=>names217(x).includes(q)&&Number(x?.id||0)>0&&x?.poster_path);
  if(!exact.length)return null;
  if(exact.length===1)return exact[0];
  exact.sort((a,b)=>Number(b?.popularity||0)-Number(a?.popularity||0)||Number(b?.vote_count||0)-Number(a?.vote_count||0));
  const a=Number(exact[0]?.popularity||0),b=Number(exact[1]?.popularity||0);
  if(a>0&&a>=Math.max(1,b*1.25))return exact[0];
  /* Multiple exact titles are still safe when only the leading result has meaningful audience evidence. */
  const va=Number(exact[0]?.vote_count||0),vb=Number(exact[1]?.vote_count||0);
  if(va>=50&&va>=Math.max(2,vb*2))return exact[0];
  return null;
}
async function resolve217(j){
  try{const cached=JSON.parse(localStorage.getItem(P217_PREFIX+j.key)||'null');if(cached&&Number(cached.id)>0&&cached.poster_path)return cached}catch{}
  const d=await safeTmdb('/search/'+j.type,{query:j.title,page:1,include_adult:false});
  const hit=pick217(d?.results,j.title);if(!hit)return null;
  const out={id:Number(hit.id),poster_path:String(hit.poster_path)};try{localStorage.setItem(P217_PREFIX+j.key,JSON.stringify(out))}catch{}return out;
}
function apply217(j,r){
  if(!r||!j.host?.isConnected)return;
  const visual=j.host.querySelector('.poster,.thumb');if(!visual)return;
  try{visual.style.backgroundImage="url('"+img(r.poster_path,visual.classList.contains('thumb')?'w154':'w342')+"')"}catch{}
  visual.dataset.ct217Recovered='1';visual.dataset.ct215PosterState='done';
  j.host.dataset.media=j.type+':'+Number(r.id);
}
function retryHost217(host){
  const j=job217(host);if(!j)return;
  const visual=host.querySelector('.poster,.thumb');if(!visual)return;
  const bg=String(visual.style?.backgroundImage||'');if(bg&&bg!=='none')return;
  let p=p217Inflight.get(j.key);if(!p){p=resolve217(j).finally(()=>p217Inflight.delete(j.key));p217Inflight.set(j.key,p)}
  p.then(r=>apply217(j,r)).catch(()=>{});
}
function scan217(root=document){
  const hosts=[];try{if(root.matches?.('[data-media]'))hosts.push(root)}catch{}try{hosts.push(...(root.querySelectorAll?.('[data-media]')||[]))}catch{}
  for(const h of hosts)retryHost217(h);
}

/* ---------- Person page: remove only the decorative CineTracker / Pessoa heading ---------- */
function cleanPersonHeader217(){
  let isPerson=false;try{isPerson=String(route())==='person'}catch{isPerson=String(location.pathname||'').includes('/person')}
  if(!isPerson)return;
  const hero=document.querySelector('.ct170-person-hero');if(!hero)return;
  const app=document.querySelector('#app')||document.body;
  const candidates=[...app.querySelectorAll('h1,h2,h3')].filter(x=>String(x.textContent||'').trim()==='Pessoa');
  for(const title of candidates){
    if(hero.contains(title))continue;
    let block=title;
    for(let i=0;i<3&&block.parentElement&&block.parentElement!==app;i++){
      const p=block.parentElement,txt=String(p.textContent||'').replace(/\s+/g,' ').trim();
      if(p.contains(hero)||p.querySelector('input,textarea')||txt.length>80)break;
      block=p;
      if(/CineTracker/i.test(txt)&&/Pessoa/i.test(txt))break;
    }
    if(!block.contains(hero)&&!block.querySelector('input,textarea'))block.remove();
  }
  /* Some shells render the brand as a sibling of the title. Remove that tiny header only. */
  [...app.querySelectorAll('div,section,header')].forEach(el=>{
    if(el.contains(hero)||el.querySelector('input,textarea'))return;
    const txt=String(el.textContent||'').replace(/\s+/g,' ').trim();
    if(txt==='CineTracker' || txt==='CineTracker Pessoa'){
      const r=el.getBoundingClientRect?.();if(!r||r.height<150)el.remove();
    }
  });
}

let frame217=0;
function schedule217(root=document){if(frame217)return;frame217=requestAnimationFrame(()=>{frame217=0;scan217(root);cleanPersonHeader217()})}
try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)scan217(n);schedule217(document)}).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true})}catch{}
requestAnimationFrame(()=>{scan217(document);cleanPersonHeader217()});
})();

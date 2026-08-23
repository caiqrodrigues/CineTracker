(() => {
'use strict';
if(window.__ct56Loaded)return;window.__ct56Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
window.__ctAndroidBuild='0.0.67';
const attempts=new Map();
const style=document.createElement('style');style.id='ct56-style';style.textContent=`
.ct56-on,.ct48-next.ct56-on,.ct48-card-check.ct56-on{background:#153a25!important;border-color:#39754d!important;color:#a8dfb7!important}
.ct56-retry{cursor:pointer!important;border-color:#35546a!important;color:#b8cad7!important}
.ct56-season-hint{font-size:11px!important;color:#738795!important;margin-top:6px!important}
`;
document.head.appendChild(style);

function currentView(){try{return typeof view==='undefined'?'':String(view||'')}catch{return''}}
function loadingLeaves(){return $$('*').filter(el=>el.children.length===0&&/^(Carregando(?: perfil| histórico| títulos| episódios)?\.\.\.|Falha ao carregar:\s*Failed to fetch)$/i.test((el.textContent||'').trim()))}
function hasUsableContent(v){
  if(v==='profile')return !!($('.ct41-wrap')||$('.ct52-profile-chart')||$('.metric')||$('.ct43-full'));
  if(v==='history')return !!($('.history-item')||$('.timeline-item')||$('.ct47-card'));
  if(v==='discover')return !!($('.card[data-media-id]')||$('.tmdb-grid .card')||$('.discover-grid .card'));
  if(v==='library')return !!($('.ct47-card')||$('.ct47-list'));
  return true;
}
async function retryView(v){
  const n=attempts.get(v)||0;if(n>=2)return false;attempts.set(v,n+1);
  try{
    if(v==='library'&&typeof window.ct47Navigate==='function'){window.ct47Navigate('library');return true}
    if(typeof loadCloudState==='function')await Promise.race([loadCloudState(),new Promise(r=>setTimeout(r,1800))]);
    if(currentView()===v&&typeof render==='function')render();
    return true;
  }catch{return false}
}
function makeRetry(v){
  if(hasUsableContent(v)){loadingLeaves().forEach(el=>{if(/Carregando/i.test(el.textContent||''))el.remove()});return}
  for(const el of loadingLeaves()){
    if(/episódios/i.test(el.textContent||''))continue;
    el.textContent='Não foi possível atualizar. Toque para tentar novamente.';
    el.classList.add('ct56-retry');
    if(!el.dataset.ct56Retry){el.dataset.ct56Retry='1';el.addEventListener('click',()=>{attempts.set(v,0);el.textContent='Carregando...';void retryView(v)})}
  }
}
function scheduleWatch(v){
  attempts.set(v,0);
  setTimeout(async()=>{if(currentView()!==v)return;const bad=loadingLeaves().some(el=>!/episódios/i.test(el.textContent||''));if(bad&&!hasUsableContent(v))await retryView(v)},1800);
  setTimeout(()=>{if(currentView()===v)makeRetry(v)},4800);
}

window.ct67Navigate=(target)=>{
  try{
    if(target==='library'&&typeof window.ct47Navigate==='function'){const ok=window.ct47Navigate(target);window.scrollTo(0,0);scheduleWatch(target);return ok!==false}
    view=target;render();window.scrollTo(0,0);scheduleWatch(target);return true;
  }catch{return false}
};

function fixSettings(){
  if(currentView()!=='settings')return;
  const footer=$('#ct49-build-footer');if(footer)footer.textContent='CineTracker Android • build 0.0.67';
  $$('*').filter(el=>el.children.length===0).forEach(el=>{
    const t=(el.textContent||'').trim();
    if(/^CineTracker Web\s+0\.\d+\.\d+\s*[•·-]\s*Android build\s+0\.0\.\d+$/i.test(t))el.textContent='CineTracker Web 0.4.8 • Android build 0.0.67';
    else if(/^CineTracker Android\s*[•·-]?\s*build\s+0\.0\.\d+$/i.test(t))el.textContent='CineTracker Android • build 0.0.67';
  });
}
function cleanProfile(){
  if(currentView()!=='profile')return;
  if(hasUsableContent('profile'))loadingLeaves().filter(el=>/perfil/i.test(el.textContent||'')).forEach(el=>el.remove());
}
function cleanDetail(){
  if(!$('.ct47-hero'))return;
  const seen=new Set();
  $$('.ct50-ratingbar').forEach(el=>{const key=(el.textContent||'').replace(/\s+/g,' ').trim();if(seen.has(key))el.remove();else seen.add(key)});
  const seasonCards=$$('*').filter(el=>el.children.length===0&&/^Temporada\s+\d+\s*[·•-]\s*\d+\s+episódios?$/i.test((el.textContent||'').trim()));
  seasonCards.forEach(label=>{
    const host=label.closest('.panel,.card,section,div');if(!host)return;
    const loaders=$$('*',host).filter(x=>x.children.length===0&&/^Carregando episódios\.\.\.$/i.test((x.textContent||'').trim()));
    if(loaders.length&&host.dataset.ct56Opened!=='1')loaders.forEach(x=>{x.textContent='Toque na temporada para carregar episódios.';x.classList.add('ct56-season-hint')});
    if(!host.dataset.ct56Bound){host.dataset.ct56Bound='1';host.addEventListener('click',()=>{host.dataset.ct56Opened='1'},true)}
  });
}
function bindSeen(){
  $$('.ct48-next,.ct48-card-check').forEach(b=>{
    if(b.dataset.ct56Seen)return;b.dataset.ct56Seen='1';
    b.addEventListener('click',()=>setTimeout(()=>{if(!/Tentar novamente|Em dia/i.test(b.textContent||''))b.classList.add('ct56-on')},650));
  });
}
function cleanDuplicateMeta(){
  $$('.ct48-home-meta,.ct47-meta,.media-meta').forEach(el=>{
    const parts=(el.textContent||'').split(/\s*[·•|]\s*/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean),out=[],keys=new Set();
    for(const p of parts){const k=p.toLowerCase();if(!keys.has(k)){keys.add(k);out.push(p)}}
    if(out.length&&out.length<parts.length)el.textContent=out.join(' · ');
  });
}
function apply(){fixSettings();cleanProfile();cleanDetail();bindSeen();cleanDuplicateMeta()}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true,characterData:true});
setTimeout(apply,80);setTimeout(apply,450);setTimeout(apply,1400);
})();

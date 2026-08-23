(() => {
'use strict';
if(window.__ct57Loaded)return;window.__ct57Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
window.__ctAndroidBuild='0.0.68';
const style=document.createElement('style');style.id='ct57-style';style.textContent=`
.ct57-on{background:#153a25!important;border-color:#39754d!important;color:#a8dfb7!important}
`;
document.head.appendChild(style);

function v(){try{return typeof view==='undefined'?'':String(view||'')}catch{return''}}
function fixBuild(){if(v()!=='settings')return;const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.68';$$('*').filter(x=>x.children.length===0).forEach(x=>{const t=(x.textContent||'').trim();if(/^CineTracker Web\s+0\.\d+\.\d+\s*[•·-]\s*Android build\s+0\.0\.\d+$/i.test(t))x.textContent='CineTracker Web 0.4.8 • Android build 0.0.68';else if(/^CineTracker Android\s*[•·-]?\s*build\s+0\.0\.\d+$/i.test(t))x.textContent='CineTracker Android • build 0.0.68'})}
function cleanProfile(){if(v()!=='profile')return;if($('.ct41-wrap')||$('.ct52-profile-chart')||$('canvas'))$$('*').filter(x=>x.children.length===0&&/^Carregando perfil\.\.\.$/i.test((x.textContent||'').trim())).forEach(x=>x.remove())}
function cleanScores(){
  $$('.ct48-home-meta,.ct47-meta,.media-meta,.rating-row').forEach(el=>{
    let t=(el.textContent||'').replace(/\s+/g,' ').trim();if(!t)return;
    const scores=t.match(/★\s*\d{1,2}(?:[.,]\d)?/g)||[];if(scores.length<=1)return;
    const keep=scores[0];t=t.replace(/★\s*\d{1,2}(?:[.,]\d)?/g,'').replace(/\s*[·•|]\s*(?=[·•|]|$)/g,' ').replace(/\s+/g,' ').trim();
    t=t.replace(/[·•|\s]+$/,'').trim();el.textContent=(t?t+' · ':'')+keep;
  });
}
function optimisticHome(btn){
  const card=btn.closest('.ct48-home-card,.ct47-card');if(!card)return;
  const meta=$('.ct48-home-meta,.ct47-meta',card);if(!meta)return;
  const before=meta.textContent||'';const m=before.match(/\b(\d{1,4})\s*\/\s*(\d{1,4})\b/);if(!m)return;
  const watched=Number(m[1]),total=Number(m[2]);if(!total||watched>=total)return;
  const next=watched+1,missing=Math.max(0,total-next);
  meta.textContent=before.replace(m[0],`${next}/${total}`).replace(/Faltam\s+\d+\s+episódios?/i,`Faltam ${missing} ${missing===1?'episódio':'episódios'}`);
  btn.dataset.ct57BeforeMeta=before;
}
function bindSeen(){
  $$('.ct48-next,.ct48-card-check').forEach(btn=>{if(btn.dataset.ct57)return;btn.dataset.ct57='1';btn.addEventListener('click',()=>{
    optimisticHome(btn);btn.classList.add('ct57-on');btn.textContent='✓ Assistido';
    setTimeout(()=>{if(/Tentar novamente/i.test(btn.textContent||'')){btn.classList.remove('ct57-on');const card=btn.closest('.ct48-home-card,.ct47-card'),meta=card&&$('.ct48-home-meta,.ct47-meta',card);if(meta&&btn.dataset.ct57BeforeMeta)meta.textContent=btn.dataset.ct57BeforeMeta}},2200);
  },true)})
}
function cleanLoaders(){
  const current=v();
  if(current==='profile')cleanProfile();
  if(current==='history'&&($('.history-item')||$('.timeline-item')||$('.ct47-card')))$$('*').filter(x=>x.children.length===0&&/^Carregando histórico\.\.\.$/i.test((x.textContent||'').trim())).forEach(x=>x.remove());
  if(current==='discover'&&($('.card[data-media-id]')||$('.tmdb-grid .card')||$('.discover-grid .card')))$$('*').filter(x=>x.children.length===0&&/^Carregando títulos\.\.\.$/i.test((x.textContent||'').trim())).forEach(x=>x.remove());
}
function apply(){fixBuild();cleanProfile();cleanScores();bindSeen();cleanLoaders()}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true,characterData:true});
setTimeout(apply,50);setTimeout(apply,250);setTimeout(apply,900);
})();

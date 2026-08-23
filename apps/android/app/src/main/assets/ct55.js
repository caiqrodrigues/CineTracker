(() => {
'use strict';
if(window.__ct55Loaded)return;window.__ct55Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
window.__ctAndroidBuild='0.0.65';
const style=document.createElement('style');style.id='ct55-style';style.textContent=`
.ct55-hidden{display:none!important}
`;
document.head.appendChild(style);
function uniqueBits(text){
  const bits=String(text||'').split(/\s*[·•|]\s*/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  const out=[];const seen=new Set();
  for(const b of bits){const k=b.toLowerCase();if(!seen.has(k)){seen.add(k);out.push(b)}}
  return out;
}
function fixWatchlistMeta(){
  if(typeof view!=='undefined'&&view!=='home')return;
  const heading=$$('h2,h3').find(h=>/Da sua Watchlist/i.test(h.textContent||''));if(!heading)return;
  const section=heading.closest('section,.section,.panel')||heading.parentElement?.parentElement;if(!section)return;
  $$('.media-meta,.card-meta,.meta',section).forEach(el=>{
    let t=(el.textContent||'').replace(/\s+/g,' ').trim();if(!t)return;
    const year=(t.match(/\b(19|20)\d{2}\b/)||[])[0];
    const rating=(t.match(/★\s*\d{1,2}(?:[.,]\d)?/)||[])[0];
    const genres=['Ação','Aventura','Animação','Comédia','Crime','Documentário','Drama','Família','Fantasia','História','Terror','Música','Mistério','Romance','Ficção científica','Sci-Fi','Thriller','Guerra','Faroeste'];
    const found=[];for(const g of genres){if(new RegExp(g.replace('-','\\-'),'i').test(t)&&!found.includes(g))found.push(g)}
    const bits=[year,...found.slice(0,2),rating].filter(Boolean);if(bits.length)el.textContent=bits.join(' · ');
  });
}
function fixProgressMath(){
  $$('.ct48-home-meta,.ct47-meta').forEach(el=>{
    let t=(el.textContent||'').replace(/\s+/g,' ').trim();
    const m=t.match(/\b(\d{1,4})\s*\/\s*(\d{1,4})\b/);if(!m)return;
    const watched=Number(m[1]),total=Number(m[2]);if(!Number.isFinite(watched)||!Number.isFinite(total)||total<watched)return;
    const missing=Math.max(0,total-watched);
    t=t.replace(/Faltam\s+\d{1,4}\s+episódios?/i,`Faltam ${missing} ${missing===1?'episódio':'episódios'}`);
    const score=(t.match(/★\s*\d{1,2}(?:[.,]\d)?/g)||[])[0];
    const kind=(t.match(/\b(ANIME|SÉRIE)\b/i)||[])[1];
    const bits=[kind?.toUpperCase(),`${watched}/${total}`,`Faltam ${missing} ${missing===1?'episódio':'episódios'}`,score].filter(Boolean);
    el.textContent=bits.join(' · ');
  });
}
function fixRepeatedRatings(){
  $$('.ct47-meta,.ct48-home-meta,.media-meta,.rating-row').forEach(el=>{
    const text=(el.textContent||'').replace(/\s+/g,' ').trim();if(!text)return;
    const matches=[...text.matchAll(/★?\s*(\d{1,2}(?:[.,]\d)?)/g)];
    if(matches.length<2)return;
    const star=(text.match(/★\s*\d{1,2}(?:[.,]\d)?/)||[])[0];
    const cleaned=text.replace(/(?:\s*[·•|]?\s*★\s*\d{1,2}(?:[.,]\d)?){2,}/g,star?` · ${star}`:'');
    el.textContent=uniqueBits(cleaned).join(' · ');
  });
}
function fixProfile(){
  if(typeof view==='undefined'||view!=='profile')return;
  $$('*').filter(el=>el.children.length===0&&/^Carregando perfil\.\.\.$/i.test((el.textContent||'').trim())).forEach(el=>el.classList.add('ct55-hidden'));
}
function fixBuild(){if(typeof view!=='undefined'&&view==='settings'){const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.65'}}
function apply(){fixBuild();fixWatchlistMeta();fixProgressMath();fixRepeatedRatings();fixProfile()}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true,characterData:true});
setTimeout(apply,80);setTimeout(apply,400);setTimeout(apply,1200);
})();

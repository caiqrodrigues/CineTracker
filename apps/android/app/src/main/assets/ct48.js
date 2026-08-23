(() => {
'use strict';
if(window.__ct48Loaded)return;window.__ct48Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const hide=el=>{if(el)el.style.setProperty('display','none','important')};
const style=document.createElement('style');style.id='ct48-style';style.textContent=`
body.ct48-discover .content .grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}
body.ct48-discover .content .grid>.card{min-width:0!important;border-radius:10px!important;overflow:hidden!important}
body.ct48-discover .content .grid .poster,body.ct48-discover .content .grid .tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important;padding:0!important}
body.ct48-discover .content .grid .card-body{padding:6px!important;min-height:62px!important}
body.ct48-discover .content .grid h3{font-size:10px!important;line-height:1.15!important;margin:0 0 4px!important}
body.ct48-discover .content .grid .media-meta{font-size:7.5px!important;gap:2px!important}
body.ct48-discover .content .grid .cast,body.ct48-discover .content .grid .availability,body.ct48-discover .content .grid .card-actions{display:none!important}
.ct41-window,.ct41-track{background:#090e12!important;color:#f4f4f5!important}.ct41-day{appearance:none!important;-webkit-appearance:none!important;border:1px solid #203443!important;background:#0c151c!important;color:#f4f4f5!important;box-shadow:none!important}.ct41-day.today{background:#102331!important;border-color:#31536d!important}.ct41-bar{background:#568eb5!important}.ct41-day.today .ct41-bar{background:#d6b55b!important}
.ct33-chart,.ct36-hourchart,.ct36-carousel,.ct36-dots,.ct36-peakline,.ct39-full-analytics,.ct39-carousel,.ct39-dots{display:none!important}
`;
document.head.appendChild(style);

function closestCard(el){return el?.closest?.('.metric,.ct43-metric,.ct33-insight,.ct44-insight,.ct36-kpi,.panel,.card,section')||el?.parentElement||null}
function hideHourly(){
  if(typeof view==='undefined'||view!=='profile')return;
  $$('.ct33-chart,.ct36-hourchart,.ct36-carousel,.ct36-dots,.ct36-peakline,.ct39-full-analytics,.ct39-carousel,.ct39-dots').forEach(hide);
  $$('*').filter(el=>el.children.length===0).forEach(el=>{
    const t=(el.textContent||'').trim();
    if(/^HORÁRIO DE PICO$/i.test(t)||/^Atividade por horário/i.test(t))hide(closestCard(el));
  });
  const zero=$$('*').find(el=>el.children.length===0&&(el.textContent||'').trim()==='00h');
  if(zero){let p=zero.parentElement;for(let i=0;i<6&&p;i++,p=p.parentElement){const t=(p.textContent||'');if(t.includes('06h')&&t.includes('12h')&&t.includes('18h')&&t.includes('23h')){hide(p);break}}}
}
function fixSettingsVersion(){
  if(typeof view==='undefined'||view!=='settings')return;
  const root=$('#app');if(!root)return;
  const leaves=$$('*',root).filter(el=>el.children.length===0);
  for(const el of leaves){
    const t=(el.textContent||'').trim();
    if(/^0\.0\.\d+$/.test(t)&&el.parentElement&&/\bBuild\b/i.test(el.parentElement.textContent||''))el.textContent='0.0.48';
  }
  const footers=leaves.filter(el=>/^CineTracker Android\s*[•·-]?\s*build\s+0\.0\.\d+$/i.test((el.textContent||'').trim()));
  if(footers.length){footers[0].textContent='CineTracker Android • build 0.0.48';for(let i=1;i<footers.length;i++)footers[i].remove()}
}
function removeHomeCalendar(){
  if(typeof view==='undefined'||view!=='home')return;
  $$('section,.panel,.card,div').forEach(el=>{const t=(el.textContent||'').trim();if(t.startsWith('Calendário das séries em acompanhamento'))hide(el)});
}
function apply(){
  const v=typeof view==='undefined'?'':view;
  document.body.classList.toggle('ct48-discover',v==='discover');
  hideHourly();fixSettingsVersion();removeHomeCalendar();
}
window.ct48Navigate=(target)=>{
  try{
    if(target==='library'&&typeof window.ct47Navigate==='function')return window.ct47Navigate(target);
    view=target;render();window.scrollTo(0,0);setTimeout(apply,0);setTimeout(apply,180);return true;
  }catch(e){return false}
};
function syncSession(){try{if(window.CineTrackerNative&&typeof CineTrackerNative.saveSession==='function'&&typeof ctSession!=='undefined'&&ctSession?.access_token)CineTrackerNative.saveSession(JSON.stringify({access_token:ctSession.access_token,expires_at:ctSession.expires_at||null}))}catch{}}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,50);setTimeout(apply,400);setTimeout(apply,1200);setTimeout(syncSession,700);setInterval(syncSession,30000);
})();

(() => {
'use strict';
if (window.__ct46Loaded) return;
window.__ct46Loaded = true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const style=document.createElement('style');
style.id='ct46-style';
style.textContent=`
/* Descobrir: 3 capas por linha em qualquer filtro */
body.ct46-discover .content .grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}
body.ct46-discover .content .grid>.card{min-width:0!important;border-radius:10px!important;overflow:hidden!important}
body.ct46-discover .content .grid .poster,body.ct46-discover .content .grid .tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important}
body.ct46-discover .content .grid .card-body{padding:6px!important;min-height:68px!important}
body.ct46-discover .content .grid h3{font-size:10px!important;line-height:1.18!important;margin:0 0 4px!important}
body.ct46-discover .content .grid .media-meta{font-size:7.5px!important}
body.ct46-discover .content .grid .cast,body.ct46-discover .content .grid .availability,body.ct46-discover .content .grid .card-actions{display:none!important}
/* Tempo de Tela: remover definitivamente gráficos antigos de horário */
.ct33-chart,.ct36-hourchart,.ct36-carousel,.ct36-dots,.ct36-peakline,.ct39-full-analytics,.ct39-carousel .ct39-slide:not(:first-child){display:none!important}
/* Controles e cards do Assistir permanecem no tema dark */
.ct45-pill,.ct45-card,.ct45-section,.ct45-list,.ct45-season,.ct45-eps,.ct45-ep{color:#f4f4f5!important}
`;
document.head.appendChild(style);

function syncSession(){
  try{
    if(window.CineTrackerNative && typeof CineTrackerNative.saveSession==='function' && typeof ctSession!=='undefined' && ctSession?.access_token){
      CineTrackerNative.saveSession(JSON.stringify({access_token:ctSession.access_token,expires_at:ctSession.expires_at||null}));
      return true;
    }
  }catch(e){}
  return false;
}
function applyViewState(){
  try{document.body.classList.toggle('ct46-discover',typeof view!=='undefined'&&view==='discover')}catch(e){}
  if(typeof view!=='undefined'&&view==='profile'){
    $$('.ct33-chart,.ct36-hourchart,.ct36-carousel,.ct36-dots,.ct36-peakline,.ct39-full-analytics').forEach(x=>x.style.setProperty('display','none','important'));
  }
}
function run(){applyViewState();syncSession()}
window.ct46Navigate=(target)=>{
  try{
    view=target;
    render();
    window.scrollTo(0,0);
    setTimeout(run,0);
    return true;
  }catch(e){return false}
};
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(run,50);setTimeout(run,500);setTimeout(run,1500);setInterval(syncSession,30000);
})();

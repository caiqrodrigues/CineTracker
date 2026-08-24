(() => {
'use strict';
if(window.__ct56Version)return;window.__ct56Version=true;
const apply=()=>{
  const host=document.querySelector('.content')||document.querySelector('#app');
  if(!host)return;
  const active=document.querySelector('.nav button.active,.mobile-nav button.active');
  const isSettings=(typeof view!=='undefined'&&view==='settings')||/configura/i.test(active?.textContent||'');
  if(!isSettings)return;
  for(const x of host.querySelectorAll('.ct54-version,.ct53w-version,#ct66-version,.ct-version-footer')){
    if(/CineTracker Web|CineTracker Android/i.test(x.textContent||''))x.remove();
  }
  let f=document.querySelector('#ct56-version');
  if(!f){f=document.createElement('div');f.id='ct56-version';f.style.cssText='margin:28px 0 8px;text-align:center;color:#71808b;font-size:11px';host.appendChild(f)}
  f.textContent='CineTracker Web • versão 0.5.6';
};
const old=window.render;if(typeof old==='function'&&!window.__ct56Render){window.__ct56Render=old;window.render=function(){const out=window.__ct56Render();setTimeout(apply,0);return out}}
setTimeout(apply,0);setTimeout(apply,400);
})();

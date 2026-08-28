(() => {
'use strict';
if (window.__ctAuthRuntimeGuard134Loaded) return;
window.__ctAuthRuntimeGuard134Loaded = true;
window.__ctAuthRuntimeGuard134 = 'r134-auth-main-thread-unfreeze';
window.__ctAuthRuntimeGuard136 = 'r136-legacy-observer-cutoff';

const authVisible=()=>Boolean(document.querySelector('.auth-page,#auth-form'));

/*
 * Observers criados antes da autoridade r133 são históricos. Eles podem voltar a
 * reconciliar Home/Perfil/Descobrir depois do login e iniciar ciclos de
 * MutationObserver -> render -> MutationObserver. Guardamos a geração no momento
 * da criação: quando a autoridade atual assumir, somente observers legados ficam
 * silenciados. Observers novos, criados depois da r133, continuam permitidos.
 */
const NativeMutationObserver=window.MutationObserver;
if (NativeMutationObserver && !window.__ctAuthMutationObserverGuard134) {
  class AuthSafeMutationObserver extends NativeMutationObserver {
    constructor(callback) {
      const legacyObserver=!window.__ct0997PrimaryReady;
      super((records,observer)=>{
        if (authVisible()) return;
        if (legacyObserver && window.__ct0997PrimaryObserverSuppressed) return;
        return callback(records,observer);
      });
    }
  }
  window.MutationObserver=AuthSafeMutationObserver;
  window.__ctAuthMutationObserverGuard134=true;
}

/*
 * Navegadores legados são atribuídos várias vezes durante o carregamento. O
 * accessor guarda cada função original e entrega um wrapper vinculado à versão
 * existente naquele instante. Navegação automática continua bloqueada no login.
 */
function guardNavigator(name){
  let current=typeof window[name]==='function'?window[name]:null;
  try{
    Object.defineProperty(window,name,{
      configurable:true,
      enumerable:true,
      get(){
        const fn=current;
        if(typeof fn!=='function')return fn;
        return function(...args){
          if(authVisible())return false;
          return fn.apply(this,args);
        };
      },
      set(fn){current=fn}
    });
  }catch{}
}
for(const name of ['ct95Navigate','ct98Navigate','ct99Navigate','ct991Navigate','ct0992Navigate','__ct0994Navigate','__ct132Go'])guardNavigator(name);

/* Mantém o formulário acima de overlays legados e restaura os estilos após login. */
let layered=false,saved=null;
function protectAuthUi(){
  const page=document.querySelector('.auth-page');
  const app=document.querySelector('#app');
  if(page){
    if(!layered){
      saved={
        appPosition:app?.style.position||'',appZ:app?.style.zIndex||'',
        pagePosition:page.style.position||'',pageZ:page.style.zIndex||'',
        bodyPointer:document.body.style.pointerEvents||''
      };
      layered=true;
    }
    if(app){app.style.position='relative';app.style.zIndex='2147483646'}
    page.style.position='relative';
    page.style.zIndex='2147483647';
    page.style.pointerEvents='auto';
    document.body.style.pointerEvents='auto';
    for(const el of page.querySelectorAll('form,input,button,label,a'))el.style.pointerEvents='auto';
    for(const el of document.querySelectorAll('.ct132-search,.ct991-modal,.ct118-overlay,.ct131-overlay,.ct124-overlay'))el.remove();
    document.body.classList.remove('ct133-primary-active');
    return;
  }
  if(layered){
    if(app){app.style.position=saved?.appPosition||'';app.style.zIndex=saved?.appZ||''}
    document.body.style.pointerEvents=saved?.bodyPointer||'';
    layered=false;saved=null;
  }
}

protectAuthUi();
for(const delay of [0,50,150,350,750,1500])setTimeout(protectAuthUi,delay);
window.addEventListener('cinetracker:auth-state-change',()=>{
  for(const delay of [0,60,220])setTimeout(protectAuthUi,delay);
});
})();

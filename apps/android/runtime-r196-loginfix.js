/* Android 0.99.7.24 — login -> Home shell fix */
(() => {
'use strict';
if(window.__ctAndroidR196LoginFix)return;
window.__ctAndroidR196LoginFix='auth-success-mount-home-shell-before-fast-paint';
window.__ctAndroidLoginFlow='session-success-home-shell-visible';

/*
  0.99.7.23 made Home use the fast r5 RPC, but that wrapper could run directly
  after login while the DOM was still the auth card. paintHome() then had no
  [data-home] target and returned, leaving the login card on screen even though
  the session had succeeded. Always mount the Home shell before delegating to
  the fast Home renderer.
*/
try {
  const renderHomeR195 = renderHome;
  renderHome = async function(seq){
    if(!document.querySelector('[data-home]')){
      setApp(shell(
        'Home',
        'Sua biblioteca sincronizada e organizada pelo seu progresso.',
        'home',
        `<div class="page" data-home>${loading('Sincronizando Home...')}</div>`
      ));
    }
    return renderHomeR195(seq);
  };
} catch {}
})();

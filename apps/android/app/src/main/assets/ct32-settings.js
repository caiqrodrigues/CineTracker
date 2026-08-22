(() => {
'use strict';
if (window.__ct32SettingsLoaded) return;
window.__ct32SettingsLoaded = true;
const esc = v => typeof escapeHtml === 'function' ? escapeHtml(String(v ?? '')) : String(v ?? '');
const baseRender = typeof render === 'function' ? render : null;
const baseShell = typeof shell === 'function' ? shell : null;
const baseBind = typeof bind === 'function' ? bind : null;

function settingsScreen(){
  const email = esc(currentUser?.email || 'Usuário');
  const html = `<header class="header"><div><div class="eyebrow">APLICATIVO</div><h1 class="h1">Configurações</h1><p class="subtitle">Preferências, importação e conta.</p></div></header>
  <section class="panel" style="padding:16px;margin-bottom:12px"><h2 style="margin-top:0">Dados</h2><p class="subtitle">Importe ou atualize seus dados do CineTracker.</p><div class="actions"><button id="ct32-import" class="btn-primary">Importar dados</button></div></section>
  <section class="panel" style="padding:16px;margin-bottom:12px"><h2 style="margin-top:0">Conta</h2><div class="small muted" style="margin-bottom:10px">${email}</div><button id="ct32-logout" class="btn-secondary">Sair da conta</button></section>
  <section class="panel" style="padding:16px;margin-bottom:12px"><h2 style="margin-top:0">Aplicativo</h2><div class="list-item"><span>Build Android</span><strong>0.0.32</strong></div><div class="list-item"><span>Banco</span><strong>Supabase</strong></div></section>`;
  return baseShell ? baseShell(html) : html;
}

function cleanStats(){
  document.querySelectorAll('[data-view="stats"],[data-view="account"]').forEach(el=>el.remove());
}
function bindSettings(){
  document.getElementById('ct32-import')?.addEventListener('click',()=>{view='import';render();window.scrollTo(0,0)});
  document.getElementById('ct32-logout')?.addEventListener('click',async()=>{try{await signOut()}finally{render();}});
}

if (baseRender) {
  render = function(){
    if (view === 'stats' || view === 'account') view = 'settings';
    if (view === 'settings') {
      app.innerHTML = settingsScreen();
      baseBind?.();
      cleanStats();
      bindSettings();
      window.scrollTo(0,0);
      return;
    }
    const out = baseRender();
    setTimeout(cleanStats,0);
    return out;
  };
}

window.ct32OpenSettings = function(){ view='settings'; render(); window.scrollTo(0,0); return true; };
window.ct31OpenSettings = window.ct32OpenSettings;
window.ctOpenSettings = window.ct32OpenSettings;

const obs = new MutationObserver(()=>cleanStats());
obs.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(cleanStats,0);
})();

(() => {
'use strict';
if (window.__ct42Loaded) return;
window.__ct42Loaded = true;
const esc42 = v => typeof escapeHtml === 'function' ? escapeHtml(String(v ?? '')) : String(v ?? '');
const baseRender42 = typeof render === 'function' ? render : null;
const baseShell42 = typeof shell === 'function' ? shell : null;
const baseBind42 = typeof bind === 'function' ? bind : null;

function settings42(){
  const email = esc42(currentUser?.email || 'Usuário');
  const html = `<header class="header"><div><div class="eyebrow">APLICATIVO</div><h1 class="h1">Configurações</h1><p class="subtitle">Preferências, importação e acesso do CineTracker.</p></div></header>
  <section class="panel" style="padding:16px;margin-bottom:12px"><h2 style="margin-top:0">Dados e biblioteca</h2><p class="subtitle">Importe ou atualize seus dados sem apagar decisões manuais.</p><div class="actions"><button class="btn-primary" id="ct42-import">Importar dados</button></div></section>
  <section class="panel" style="padding:16px;margin-bottom:12px"><h2 style="margin-top:0">Conta</h2><div class="small muted" style="margin-bottom:10px">${email}</div><button class="btn-secondary" id="ct42-logout">Sair da conta</button></section>
  <section class="panel" style="padding:16px;margin-bottom:12px"><h2 style="margin-top:0">Aplicativo</h2><div class="list-item"><span>Versão Web</span><strong>0.4.5</strong></div><div class="list-item"><span>Banco de dados</span><strong>Supabase</strong></div></section>`;
  return baseShell42 ? baseShell42(html) : html;
}

function cleanNav42(){
  document.querySelectorAll('[data-view="stats"],[data-view="account"]').forEach(el=>el.remove());
  for (const nav of document.querySelectorAll('.nav,.mobile-nav')) {
    let b=nav.querySelector('[data-view="settings"]');
    if(!b){ b=document.createElement('button'); b.type='button'; b.dataset.view='settings'; b.textContent=nav.classList.contains('mobile-nav')?'Config.':'⚙ Configurações'; nav.appendChild(b); }
    b.classList.toggle('active', typeof view!=='undefined' && view==='settings');
  }
}

function bindSettings42(){
  document.getElementById('ct42-import')?.addEventListener('click',()=>{view='import';render();window.scrollTo(0,0)});
  document.getElementById('ct42-logout')?.addEventListener('click',async()=>{try{await signOut()}finally{render();}});
}

if(baseRender42){
  render=function(){
    if(view==='account'||view==='stats') view='settings';
    if(view==='settings'){
      app.innerHTML=settings42();
      baseBind42?.();
      cleanNav42();
      bindSettings42();
      window.scrollTo(0,0);
      return;
    }
    const r=baseRender42();
    setTimeout(cleanNav42,0);
    return r;
  };
}

window.ctOpenSettings=function(){view='settings';render();window.scrollTo(0,0);return true;};
const obs=new MutationObserver(()=>cleanNav42());
obs.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(cleanNav42,0);
})();

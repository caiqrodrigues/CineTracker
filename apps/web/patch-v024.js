(() => {
  'use strict';
  const VERSION = '0.2.4';
  const BLUE = '#4da3ff';
  let ctProfile = null;
  let settingsOpen = false;
  let authInstalling = false;

  const style = document.createElement('style');
  style.id = 'ct-v024-theme';
  style.textContent = `
    :root{--gold:${BLUE}!important;--bg:#030507!important;--panel:#090d12!important;--panel2:#0d131b!important;--border:#1c2b3a!important;--muted:#8d9bad!important;--success:#5ac98b!important}
    html,body{background:#030507!important;color:#f5f8fc}
    body{background:radial-gradient(circle at 78% 0,#081625 0,#030507 34%,#020304 100%)!important}
    .sidebar{background:#05080c!important;border-right-color:#122235!important}.nav button.active,.mobile-nav button.active{background:#07192b!important;border-color:#1d5b91!important;color:${BLUE}!important}
    .card,.feature,.panel,.metric,.auth-card{background:#080c11!important;border-color:#17283a!important}.card:hover{border-color:${BLUE}!important;box-shadow:0 0 0 1px #4da3ff22}
    .feature{background:linear-gradient(110deg,#071523,#080c11 55%,#06101a)!important;border-color:#17385a!important}.poster{background:radial-gradient(circle at 78% 18%,rgba(77,163,255,.24),transparent 34%),linear-gradient(145deg,#14202d,#080c11)!important}
    .auth-page{background:radial-gradient(circle at 50% 12%,#0b2037 0,#04070a 34%,#020304 100%)!important}.auth-card{border-color:#1b3958!important;box-shadow:0 20px 70px #000a}
    .auth-card input,.search input,.settings-input,.settings-select{background:#05080c!important;border:1px solid #20344a!important;color:#fff!important}.auth-card input:focus,.search input:focus,.settings-input:focus,.settings-select:focus{outline:none;border-color:${BLUE}!important;box-shadow:0 0 0 3px #4da3ff18}
    .btn-primary{background:${BLUE}!important;border-color:${BLUE}!important;color:#02101d!important}.btn-secondary{background:#0b1118!important;border-color:#26384b!important;color:#eaf2fb!important}
    .actor-link,.availability a,.gold,.eyebrow,.auth-toggle{color:${BLUE}!important}.cloud-bar{background:#070b10!important;border-color:#1a2f43!important}.cloud-bar.ok{border-color:#245b79!important}.cloud-bar.warn{border-color:#713d3d!important}
    .profile{min-width:0!important;overflow:hidden!important}.profile strong,.ct-profile-name{display:block!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.profile .small{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.settings-group{display:grid;gap:7px}.settings-group.full{grid-column:1/-1}.settings-input,.settings-select{width:100%;padding:10px 11px;border-radius:11px}.settings-note{font-size:11px;color:var(--muted);line-height:1.45}.settings-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.settings-status{min-height:18px;margin-top:10px;font-size:12px;color:#a9c9e8}.account-divider{height:1px;background:#182635;margin:20px 0}.account-warning{color:#e3b4b4;font-size:11px}
    @media(max-width:700px){.settings-grid{grid-template-columns:1fr}.settings-group.full{grid-column:auto}.mobile-nav{grid-template-columns:repeat(5,1fr)!important}}
  `;
  document.head.appendChild(style);

  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement('link'); icon.rel='icon'; icon.type='image/svg+xml'; icon.href='/favicon.svg'; document.head.appendChild(icon);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content','#030507');

  function displayName() {
    return ctProfile?.display_name || currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || 'Usuário';
  }
  function currentSettings() {
    const s = ctProfile?.settings && typeof ctProfile.settings === 'object' ? ctProfile.settings : {};
    return { ...s, language:s.language||'pt-BR', country:s.country||'BR', phone:s.phone||'' };
  }
  async function loadProfile() {
    if (!currentUser?.id || !ctSession?.access_token) return;
    try {
      const rows = await sbApi(`profiles?id=eq.${currentUser.id}&select=id,display_name,settings&limit=1`);
      ctProfile = Array.isArray(rows) ? rows[0] || null : null;
    } catch (e) { console.warn('CineTracker profile:', e); }
  }
  function patchUi() {
    document.querySelectorAll('.cloud-bar .small.muted').forEach(el=>{
      const wanted=`CineTracker Oficial v${VERSION}`; if(el.textContent!==wanted) el.textContent=wanted;
    });
    const profile=document.querySelector('.profile');
    if(profile){
      const strong=profile.querySelector('strong');
      const name=displayName();
      if(strong && strong.textContent!==name){strong.textContent=name;strong.title=name;strong.classList.add('ct-profile-name');}
      const detail=profile.querySelector('.small.muted');
      const email=currentUser?.email||'Perfil principal';
      if(detail && detail.textContent!==email){detail.textContent=email;detail.title=currentUser?.email||'';}
    }
    addSettingsButton(document.querySelector('.nav'),false);
    addSettingsButton(document.querySelector('.mobile-nav'),true);
    installAuthHandler();
  }
  function addSettingsButton(nav,mobile){
    if(!nav || nav.querySelector('[data-ct-settings="1"]')) return;
    const b=document.createElement('button'); b.type='button'; b.dataset.ctSettings='1'; b.textContent=mobile?'Conta':'⚙ Configurações';
    b.addEventListener('click',openSettings); nav.appendChild(b);
  }
  function setStatus(msg,error=false){const el=document.querySelector('#ct-settings-status');if(el){el.textContent=msg||'';el.style.color=error?'#e7a5a5':'#9dccf5';}}
  async function updateAuthUser(payload){
    const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{method:'PUT',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.msg||d.message||d.error_description||d.error||'Não foi possível atualizar a conta.');
    currentUser=d; if(ctSession){ctSession.user=d;localStorage.setItem('cinetracker_session',JSON.stringify(ctSession));} return d;
  }
  function settingsHtml(){
    const s=currentSettings(),email=currentUser?.email||'';
    return `<header class="header"><div><div class="eyebrow">CONTA</div><h1 class="h1">Configurações</h1><p class="subtitle">Perfil e preferências sincronizados com a sua conta CineTracker.</p></div></header><section class="panel section" style="padding:18px"><div class="settings-grid"><label class="settings-group"><span>Nome do perfil</span><input id="ct-setting-name" class="settings-input" maxlength="60" value="${escapeHtml(displayName())}"></label><label class="settings-group"><span>Telefone</span><input id="ct-setting-phone" class="settings-input" type="tel" maxlength="30" value="${escapeHtml(String(s.phone||''))}"></label><label class="settings-group"><span>Idioma</span><select id="ct-setting-language" class="settings-select"><option value="pt-BR"${s.language==='pt-BR'?' selected':''}>Português (Brasil)</option><option value="en"${s.language==='en'?' selected':''}>English</option></select></label><label class="settings-group"><span>País / disponibilidade</span><select class="settings-select" disabled><option>Brasil</option></select></label><div class="settings-group full"><span>E-mail atual</span><input class="settings-input" value="${escapeHtml(email)}" disabled></div></div><div class="settings-actions"><button id="ct-save-profile" class="btn-primary" type="button">Salvar perfil</button></div><div id="ct-settings-status" class="settings-status"></div><div class="account-divider"></div><h2 style="font-size:16px">Segurança e acesso</h2><div class="settings-grid"><label class="settings-group full"><span>Novo e-mail</span><input id="ct-new-email" class="settings-input" type="email" placeholder="novo@email.com"></label><label class="settings-group"><span>Nova senha</span><input id="ct-new-password" class="settings-input" type="password" minlength="6"></label><label class="settings-group"><span>Confirmar nova senha</span><input id="ct-new-password-confirm" class="settings-input" type="password" minlength="6"></label></div><div class="settings-actions"><button id="ct-update-email" class="btn-secondary" type="button">Alterar e-mail</button><button id="ct-update-password" class="btn-secondary" type="button">Alterar senha</button></div><p class="account-warning">Alterações de e-mail podem exigir confirmação.</p></section>`;
  }
  function openSettings(){
    if(!currentUser) return; settingsOpen=true; const content=document.querySelector('main.content'); if(!content) return;
    const cloud=content.querySelector('.cloud-bar')?.outerHTML||''; const mobile=content.querySelector('.mobile-nav')?.outerHTML||'';
    content.innerHTML=`${cloud}${settingsHtml()}${mobile}<div id="toast" class="toast hidden" aria-live="polite"></div>`; patchUi(); bindSettings();
  }
  function bindSettings(){
    document.querySelector('#ct-save-profile')?.addEventListener('click',async()=>{try{setStatus('Salvando…');const name=(document.querySelector('#ct-setting-name')?.value||'').trim();const phone=(document.querySelector('#ct-setting-phone')?.value||'').trim();const language=document.querySelector('#ct-setting-language')?.value||'pt-BR';if(!name)throw new Error('Informe um nome para o perfil.');const settings={...currentSettings(),phone,language,country:'BR'};await sbApi(`profiles?id=eq.${currentUser.id}`,{method:'PATCH',body:JSON.stringify({display_name:name,settings,updated_at:new Date().toISOString()})});try{await updateAuthUser({data:{...(currentUser?.user_metadata||{}),display_name:name,language}})}catch{}ctProfile={...(ctProfile||{}),display_name:name,settings};setStatus('Perfil salvo e sincronizado.');patchUi();}catch(e){setStatus(e instanceof Error?e.message:'Falha ao salvar.',true);}});
    document.querySelector('#ct-update-email')?.addEventListener('click',async()=>{const email=(document.querySelector('#ct-new-email')?.value||'').trim();if(!email)return setStatus('Informe o novo e-mail.',true);try{setStatus('Solicitando alteração…');await updateAuthUser({email});setStatus('Alteração solicitada. Confira os e-mails de confirmação.');}catch(e){setStatus(e instanceof Error?e.message:'Falha ao alterar e-mail.',true);}});
    document.querySelector('#ct-update-password')?.addEventListener('click',async()=>{const p1=document.querySelector('#ct-new-password')?.value||'',p2=document.querySelector('#ct-new-password-confirm')?.value||'';if(p1.length<6)return setStatus('A senha precisa ter pelo menos 6 caracteres.',true);if(p1!==p2)return setStatus('As senhas não coincidem.',true);try{setStatus('Alterando senha…');await updateAuthUser({password:p1});setStatus('Senha alterada com sucesso.');}catch(e){setStatus(e instanceof Error?e.message:'Falha ao alterar senha.',true);}});
  }

  function setAuthBusy(busy){const b=document.querySelector('#auth-form button[type="submit"]');if(b){if(!b.dataset.orig)b.dataset.orig=b.textContent||'';b.disabled=busy;b.textContent=busy?'Entrando…':b.dataset.orig;}}
  function installAuthHandler(){
    if(authInstalling || typeof currentUser==='undefined' || currentUser) return;
    const old=document.querySelector('#auth-form'); if(!old || old.dataset.ctStable==='1') return;
    authInstalling=true;
    try{
      const form=old.cloneNode(true);form.dataset.ctStable='1';old.replaceWith(form);
      form.addEventListener('submit',async e=>{e.preventDefault();const email=(document.querySelector('#auth-email')?.value||'').trim();const password=document.querySelector('#auth-password')?.value||'';const error=document.querySelector('#auth-error');if(error)error.textContent='';if(!email||!password){if(error)error.textContent='Informe e-mail e senha.';return;}setAuthBusy(true);try{if(authMode==='signup')await signUp(email,password);else await signIn(email,password);if(currentUser){render();void (async()=>{await loadProfile();try{await loadCloudState();}catch{}try{await primeOfficialSuggestions();}catch{}render();})();}else throw new Error('Sessão não carregada.');}catch(err){if(error)error.textContent=err instanceof Error?err.message:'Falha no login';setAuthBusy(false);}});
    }finally{authInstalling=false;}
  }

  const baseRender=render;
  render=function ctRender(){settingsOpen=false;baseRender();patchUi();if(currentUser&&!ctProfile)void loadProfile().then(patchUi);};

  const baseSignOut=signOut;
  signOut=async function ctSignOut(){ctProfile=null;settingsOpen=false;return baseSignOut();};

  patchUi();
  setTimeout(()=>{patchUi();if(currentUser&&!ctProfile)void loadProfile().then(patchUi);},300);
})();

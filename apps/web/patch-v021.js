(() => {
  'use strict';

  const VERSION = '0.2.1';
  const BLUE = '#4da3ff';
  let ctProfile = null;
  let settingsOpen = false;
  let observerBusy = false;

  const style = document.createElement('style');
  style.id = 'ct-v021-theme';
  style.textContent = `
    :root{--gold:${BLUE}!important;--bg:#030507!important;--panel:#090d12!important;--panel2:#0d131b!important;--border:#1c2b3a!important;--muted:#8d9bad!important;--success:#5ac98b!important}
    html,body{background:#030507!important;color:#f5f8fc}
    body{background:radial-gradient(circle at 78% 0,#081625 0,#030507 34%,#020304 100%)!important}
    .sidebar{background:#05080c!important;border-right-color:#122235!important}
    .nav button.active,.mobile-nav button.active{background:#07192b!important;border-color:#1d5b91!important;color:${BLUE}!important}
    .card,.feature,.panel,.metric,.auth-card{background:#080c11!important;border-color:#17283a!important}
    .card:hover{border-color:${BLUE}!important;box-shadow:0 0 0 1px #4da3ff22}
    .feature{background:linear-gradient(110deg,#071523,#080c11 55%,#06101a)!important;border-color:#17385a!important}
    .poster{background:radial-gradient(circle at 78% 18%,rgba(77,163,255,.24),transparent 34%),linear-gradient(145deg,#14202d,#080c11)!important}
    .auth-page{background:radial-gradient(circle at 50% 12%,#0b2037 0,#04070a 34%,#020304 100%)!important}
    .auth-card{border-color:#1b3958!important;box-shadow:0 20px 70px #000a}
    .auth-card input,.search input,.settings-input,.settings-select{background:#05080c!important;border:1px solid #20344a!important;color:#fff!important}
    .auth-card input:focus,.search input:focus,.settings-input:focus,.settings-select:focus{outline:none;border-color:${BLUE}!important;box-shadow:0 0 0 3px #4da3ff18}
    .btn-primary{background:${BLUE}!important;border-color:${BLUE}!important;color:#02101d!important}
    .btn-secondary{background:#0b1118!important;border-color:#26384b!important;color:#eaf2fb!important}
    .actor-link,.availability a,.gold,.eyebrow,.auth-toggle{color:${BLUE}!important}
    .cloud-bar{background:#070b10!important;border-color:#1a2f43!important}.cloud-bar.ok{border-color:#245b79!important}.cloud-bar.warn{border-color:#713d3d!important}
    .profile{min-width:0;overflow:hidden}.profile strong,.ct-profile-name{display:block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.profile .small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.settings-group{display:grid;gap:7px}.settings-group.full{grid-column:1/-1}.settings-input,.settings-select{width:100%;padding:10px 11px;border-radius:11px}.settings-note{font-size:11px;color:var(--muted);line-height:1.45}.settings-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.settings-status{min-height:18px;margin-top:10px;font-size:12px;color:#a9c9e8}.account-divider{height:1px;background:#182635;margin:20px 0}.account-warning{color:#e3b4b4;font-size:11px}
    @media(max-width:700px){.settings-grid{grid-template-columns:1fr}.settings-group.full{grid-column:auto}}
  `;
  document.head.appendChild(style);

  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = '/favicon.svg';
    document.head.appendChild(icon);
  }
  const theme = document.querySelector('meta[name="theme-color"]');
  if (theme) theme.setAttribute('content', '#030507');

  function displayName() {
    return ctProfile?.display_name || currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || 'Usuário';
  }

  async function loadProfile() {
    if (!currentUser?.id || !ctSession?.access_token) return null;
    try {
      const rows = await sbApi(`profiles?id=eq.${currentUser.id}&select=id,display_name,settings&limit=1`);
      ctProfile = Array.isArray(rows) ? rows[0] || null : null;
      return ctProfile;
    } catch (err) {
      console.warn('CineTracker profile load:', err);
      return null;
    }
  }

  function currentSettings() {
    const base = ctProfile?.settings && typeof ctProfile.settings === 'object' ? ctProfile.settings : {};
    return {
      ...base,
      language: base.language || 'pt-BR',
      country: base.country || 'BR',
      phone: base.phone || ''
    };
  }

  function settingsHtml() {
    const s = currentSettings();
    const email = currentUser?.email || '';
    return `<header class="header"><div><div class="eyebrow">CONTA</div><h1 class="h1">Configurações</h1><p class="subtitle">Perfil e preferências sincronizados com a sua conta CineTracker.</p></div></header>
      <section class="panel section" style="padding:18px">
        <div class="settings-grid">
          <label class="settings-group"><span>Nome do perfil</span><input id="ct-setting-name" class="settings-input" maxlength="60" value="${escapeHtml(displayName())}"></label>
          <label class="settings-group"><span>Telefone</span><input id="ct-setting-phone" class="settings-input" type="tel" maxlength="30" placeholder="+55 11 99999-9999" value="${escapeHtml(String(s.phone || ''))}"></label>
          <label class="settings-group"><span>Idioma</span><select id="ct-setting-language" class="settings-select"><option value="pt-BR"${s.language === 'pt-BR' ? ' selected' : ''}>Português (Brasil)</option><option value="en"${s.language === 'en' ? ' selected' : ''}>English</option></select></label>
          <label class="settings-group"><span>País / disponibilidade</span><select id="ct-setting-country" class="settings-select"><option value="BR" selected>Brasil</option></select></label>
          <div class="settings-group full"><span>E-mail atual</span><input class="settings-input" value="${escapeHtml(email)}" disabled><div class="settings-note">O e-mail de login pode ser alterado abaixo. Dependendo da configuração de segurança, o Supabase poderá pedir confirmação no endereço antigo e/ou no novo.</div></div>
        </div>
        <div class="settings-actions"><button id="ct-save-profile" class="btn-primary" type="button">Salvar perfil</button></div>
        <div id="ct-settings-status" class="settings-status"></div>
        <div class="account-divider"></div>
        <h2 style="font-size:16px">Segurança e acesso</h2>
        <div class="settings-grid">
          <label class="settings-group full"><span>Novo e-mail</span><input id="ct-new-email" class="settings-input" type="email" placeholder="novo@email.com"></label>
          <label class="settings-group"><span>Nova senha</span><input id="ct-new-password" class="settings-input" type="password" minlength="6" placeholder="Mínimo de 6 caracteres"></label>
          <label class="settings-group"><span>Confirmar nova senha</span><input id="ct-new-password-confirm" class="settings-input" type="password" minlength="6" placeholder="Repita a nova senha"></label>
        </div>
        <div class="settings-actions"><button id="ct-update-email" class="btn-secondary" type="button">Alterar e-mail</button><button id="ct-update-password" class="btn-secondary" type="button">Alterar senha</button></div>
        <p class="account-warning">Alterações de e-mail podem exigir confirmação antes de entrarem em vigor.</p>
      </section>`;
  }

  function setStatus(message, error = false) {
    const el = document.querySelector('#ct-settings-status');
    if (!el) return;
    el.textContent = message;
    el.style.color = error ? '#e7a5a5' : '#9dccf5';
  }

  async function updateAuthUser(payload) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.msg || d.message || d.error_description || d.error || 'Não foi possível atualizar a conta.');
    currentUser = d;
    if (ctSession) {
      ctSession.user = d;
      localStorage.setItem('cinetracker_session', JSON.stringify(ctSession));
    }
    return d;
  }

  async function saveProfile() {
    const name = (document.querySelector('#ct-setting-name')?.value || '').trim();
    const phone = (document.querySelector('#ct-setting-phone')?.value || '').trim();
    const language = document.querySelector('#ct-setting-language')?.value || 'pt-BR';
    if (!name) throw new Error('Informe um nome para o perfil.');
    const settings = { ...currentSettings(), phone, language, country: 'BR' };
    await sbApi(`profiles?id=eq.${currentUser.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ display_name: name, settings, updated_at: new Date().toISOString() })
    });
    try { await updateAuthUser({ data: { ...(currentUser?.user_metadata || {}), display_name: name } }); } catch (_) {}
    ctProfile = { ...(ctProfile || {}), display_name: name, settings };
    document.documentElement.lang = language;
    patchVisibleUi();
  }

  function bindSettings() {
    document.querySelector('#ct-save-profile')?.addEventListener('click', async () => {
      try { setStatus('Salvando…'); await saveProfile(); setStatus('Perfil salvo e sincronizado.'); }
      catch (err) { setStatus(err instanceof Error ? err.message : 'Falha ao salvar.', true); }
    });
    document.querySelector('#ct-update-email')?.addEventListener('click', async () => {
      const email = (document.querySelector('#ct-new-email')?.value || '').trim();
      if (!email) return setStatus('Informe o novo e-mail.', true);
      try { setStatus('Solicitando alteração de e-mail…'); await updateAuthUser({ email }); setStatus('Alteração solicitada. Confira os e-mails de confirmação, se forem enviados.'); patchVisibleUi(); }
      catch (err) { setStatus(err instanceof Error ? err.message : 'Falha ao alterar e-mail.', true); }
    });
    document.querySelector('#ct-update-password')?.addEventListener('click', async () => {
      const p1 = document.querySelector('#ct-new-password')?.value || '';
      const p2 = document.querySelector('#ct-new-password-confirm')?.value || '';
      if (p1.length < 6) return setStatus('A nova senha precisa ter pelo menos 6 caracteres.', true);
      if (p1 !== p2) return setStatus('As senhas não coincidem.', true);
      try { setStatus('Alterando senha…'); await updateAuthUser({ password: p1 }); setStatus('Senha alterada com sucesso.'); document.querySelector('#ct-new-password').value=''; document.querySelector('#ct-new-password-confirm').value=''; }
      catch (err) { setStatus(err instanceof Error ? err.message : 'Falha ao alterar senha.', true); }
    });
  }

  function openSettings() {
    if (!currentUser) return;
    settingsOpen = true;
    const content = document.querySelector('main.content');
    if (!content) return;
    const cloud = content.querySelector('.cloud-bar')?.outerHTML || '';
    const mobile = content.querySelector('.mobile-nav')?.outerHTML || '';
    content.innerHTML = `${cloud}${settingsHtml()}${mobile}<div id="toast" class="toast hidden" aria-live="polite"></div>`;
    patchVisibleUi();
    bindSettings();
  }

  function addSettingsButton(nav, mobile = false) {
    if (!nav || nav.querySelector('[data-ct-settings="1"]')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.ctSettings = '1';
    b.textContent = mobile ? 'Conta' : '⚙ Configurações';
    if (settingsOpen) b.classList.add('active');
    b.addEventListener('click', openSettings);
    nav.appendChild(b);
  }

  function patchVisibleUi() {
    if (observerBusy) return;
    observerBusy = true;
    try {
      document.querySelectorAll('.cloud-bar .small.muted').forEach(el => { if (el.textContent?.includes('CineTracker Oficial')) el.textContent = `CineTracker Oficial v${VERSION}`; });
      const profile = document.querySelector('.profile');
      if (profile) {
        const strong = profile.querySelector('strong');
        if (strong) {
          strong.textContent = displayName();
          strong.classList.add('ct-profile-name');
          strong.title = displayName();
        }
        const detail = profile.querySelector('.small.muted');
        if (detail) {
          detail.textContent = currentUser?.email || 'Perfil principal';
          detail.title = currentUser?.email || '';
        }
      }
      addSettingsButton(document.querySelector('.nav'), false);
      addSettingsButton(document.querySelector('.mobile-nav'), true);
      if (settingsOpen) document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      const lang = currentSettings().language;
      document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    } finally {
      observerBusy = false;
    }
  }

  const originalRender = render;
  render = function patchedRender() {
    settingsOpen = false;
    originalRender();
    queueMicrotask(patchVisibleUi);
  };

  const originalSignOut = signOut;
  signOut = async function patchedSignOut() {
    ctProfile = null;
    settingsOpen = false;
    return originalSignOut();
  };

  // Evita que uma única consulta opcional derrube o status inteiro do banco.
  loadCloudState = async function resilientCloudState() {
    if (!ctSession?.access_token) {
      cloudConnected = false;
      cloudStatus = 'Faça login para conectar ao banco';
      return;
    }
    try {
      seenMedia.clear();
      watchlist.clear();
      inProgressMedia = [];
      latestEpisodeByMedia = new Map();
      permanentRecommendationHistory.clear();
      const results = await Promise.allSettled([
        sbApi('media_overrides?select=state,media:media(*)&order=updated_at.desc'),
        sbApi('recommendation_history?select=shown_at,context,slot,media:media(tmdb_id,media_type)&order=shown_at.desc&limit=1000'),
        sbApi('episode_progress?select=season_number,episode_number,watched,media:media(*)&watched=eq.true&order=watched_at.desc.nullslast'),
        sbApi(`profiles?id=eq.${currentUser.id}&select=id,display_name,settings&limit=1`)
      ]);
      const overrides = results[0].status === 'fulfilled' ? results[0].value : [];
      const recs = results[1].status === 'fulfilled' ? results[1].value : [];
      const episodes = results[2].status === 'fulfilled' ? results[2].value : [];
      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) ctProfile = results[3].value[0] || ctProfile;
      const criticalOk = results[0].status === 'fulfilled' && results[3].status === 'fulfilled';
      cloudConnected = criticalOk;
      cloudStatus = criticalOk ? 'Banco persistente conectado' : 'Conexão parcial com o banco';
      const byState = {};
      for (const row of overrides || []) {
        if (!row.media) continue;
        (byState[row.state] ||= []).push(row.media);
        const item = dbMediaToMedia(row.media);
        mediaRegistry.set(item.id, item);
      }
      for (const row of [...(byState.AlreadySeen || []), ...(byState.Completed || [])]) seenMedia.add(dbMediaToMedia(row).id);
      for (const row of byState.AddedToWatchlist || []) watchlist.add(dbMediaToMedia(row).id);
      realHistoryCount = seenMedia.size;
      realCompletedCount = (byState.Completed || []).length;
      realInProgressCount = (byState.InProgress || []).length;
      inProgressMedia = (byState.InProgress || []).map(dbMediaToMedia);
      for (const rec of recs || []) if (rec.media?.tmdb_id && rec.media?.media_type) permanentRecommendationHistory.add(`tmdb-${rec.media.media_type}-${rec.media.tmdb_id}`);
      permanentRecommendationHistory.forEach(id => suggestionHistory.add(id));
      for (const ep of episodes || []) {
        if (!ep.media) continue;
        const item = dbMediaToMedia(ep.media);
        mediaRegistry.set(item.id, item);
        const cur = { season: Number(ep.season_number || 0), episode: Number(ep.episode_number || 0) };
        const prev = latestEpisodeByMedia.get(item.id);
        if (!prev || cur.season > prev.season || (cur.season === prev.season && cur.episode > prev.episode)) latestEpisodeByMedia.set(item.id, cur);
      }
      const cloudWatchlist = (byState.AddedToWatchlist || []).map(dbMediaToMedia);
      const ordered = [];
      for (const type of ['FILME','SÉRIE','ANIME']) {
        const found = cloudWatchlist.find(item => item.type === type);
        if (found) ordered.push(found.id);
      }
      watchlistSlots = ordered;
      if (!criticalOk) console.warn('CineTracker partial DB connection', results.filter(r => r.status === 'rejected'));
    } catch (error) {
      seenMedia.clear();
      watchlist.clear();
      watchlistSlots = [];
      cloudConnected = false;
      cloudStatus = 'Falha ao conectar ao banco';
      console.warn(error);
    }
    queueMicrotask(patchVisibleUi);
  };

  const observer = new MutationObserver(() => queueMicrotask(patchVisibleUi));
  observer.observe(document.documentElement, { childList: true, subtree: true });

  (async () => {
    if (currentUser) await loadProfile();
    patchVisibleUi();
    // Se o bootstrap original ainda estiver em curso, este pequeno atraso garante
    // que o nome sincronizado seja aplicado após a primeira renderização autenticada.
    setTimeout(async () => {
      if (currentUser && !ctProfile) await loadProfile();
      patchVisibleUi();
    }, 600);
  })();
})();

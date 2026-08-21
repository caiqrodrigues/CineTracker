(() => {
  'use strict';
  const VERSION = '0.2.3';
  let installing = false;

  function setAuthBusy(busy, message = '') {
    const button = document.querySelector('#auth-form button[type="submit"]');
    if (button) {
      button.disabled = busy;
      if (!button.dataset.ctOriginalText) button.dataset.ctOriginalText = button.textContent || '';
      button.textContent = busy ? (message || 'Entrando…') : button.dataset.ctOriginalText;
    }
  }

  function showAuthError(message) {
    const el = document.querySelector('#auth-error');
    if (el) el.textContent = message || '';
  }

  async function finishLoginInBackground() {
    try {
      if (typeof loadCloudState === 'function') await loadCloudState();
    } catch (err) {
      console.warn('CineTracker cloud bootstrap after login:', err);
    }
    try {
      if (typeof primeOfficialSuggestions === 'function') await primeOfficialSuggestions();
    } catch (err) {
      console.warn('CineTracker suggestion bootstrap after login:', err);
    }
    try {
      if (typeof render === 'function' && currentUser) render();
    } catch (err) {
      console.warn('CineTracker post-login refresh:', err);
    }
  }

  function installAuthHandler() {
    if (installing || typeof currentUser === 'undefined' || currentUser) return;
    const oldForm = document.querySelector('#auth-form');
    const oldToggle = document.querySelector('#auth-toggle');
    if (!oldForm || oldForm.dataset.ctV023 === '1') return;
    installing = true;
    try {
      const form = oldForm.cloneNode(true);
      form.dataset.ctV023 = '1';
      oldForm.replaceWith(form);

      let toggle = oldToggle;
      if (oldToggle) {
        toggle = oldToggle.cloneNode(true);
        oldToggle.replaceWith(toggle);
        toggle.addEventListener('click', () => {
          authMode = authMode === 'signin' ? 'signup' : 'signin';
          render();
          queueMicrotask(installAuthHandler);
        });
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = (document.querySelector('#auth-email')?.value || '').trim();
        const password = document.querySelector('#auth-password')?.value || '';
        showAuthError('');
        if (!email || !password) {
          showAuthError('Informe e-mail e senha.');
          return;
        }
        setAuthBusy(true, authMode === 'signup' ? 'Criando conta…' : 'Entrando…');
        try {
          if (authMode === 'signup') {
            await signUp(email, password);
          } else {
            await signIn(email, password);
          }

          // O login não depende mais de TMDB, recomendações ou consultas opcionais.
          // Assim que o Supabase autentica, a interface autenticada é exibida.
          if (currentUser) {
            render();
            void finishLoginInBackground();
            return;
          }

          showAuthError('Autenticação concluída, mas a sessão não foi carregada. Atualize a página.');
        } catch (err) {
          showAuthError(err instanceof Error ? err.message : 'Falha no login');
          setAuthBusy(false);
        }
      });
    } finally {
      installing = false;
    }
  }

  function patchVersion() {
    document.querySelectorAll('.cloud-bar .small.muted').forEach((el) => {
      if (el.textContent?.includes('CineTracker Oficial')) el.textContent = `CineTracker Oficial v${VERSION}`;
    });
  }

  const observer = new MutationObserver(() => {
    queueMicrotask(() => {
      installAuthHandler();
      patchVersion();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  installAuthHandler();
  patchVersion();
})();

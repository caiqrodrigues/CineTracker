(() => {
'use strict';
if (window.__ct097Fix6Loaded) return;
window.__ct097Fix6Loaded = true;
window.__ctAndroidBuild = '0.0.97 FIX 6';
window.__ctAuthOwner = 'fix6';

const $ = (selector, root = document) => root.querySelector(selector);
const AUTH_TIMEOUT_MS = 8000;
let activeAuthController = null;
let authStateCleanup = null;

function timeoutError(message = 'O login excedeu 8 segundos. Verifique sua conexão e tente novamente.') {
  const error = new Error(message);
  error.name = 'TimeoutError';
  return error;
}

function setAuthError(message = '') {
  const element = $('#auth-error') || $('.auth-error');
  if (element) element.textContent = message;
}

function setLoading(loading) {
  window.__ctAuthIsLoading = Boolean(loading);
  const form = $('#auth-form');
  if (!form) return;
  form.dataset.fix6Loading = loading ? '1' : '0';
  const button = $('.auth-submit', form) || $('button[type="submit"]', form);
  if (!button) return;
  if (!button.dataset.fix6Label) button.dataset.fix6Label = button.textContent || 'Entrar no CineTracker';
  button.disabled = Boolean(loading);
  button.setAttribute('aria-busy', loading ? 'true' : 'false');
  button.textContent = loading ? 'Entrando...' : button.dataset.fix6Label;
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('[CineTracker FIX 6] falha ao gravar localStorage:', error);
    return false;
  }
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('[CineTracker FIX 6] falha ao ler localStorage:', error);
    return null;
  }
}

function safeStorageRemove(key) {
  try { localStorage.removeItem(key); } catch (error) { console.warn('[CineTracker FIX 6] falha ao limpar localStorage:', error); }
}

function persistNativeSession(session) {
  try {
    const json = JSON.stringify(session || {});
    if (window.CineTrackerNative?.saveAuthSession) window.CineTrackerNative.saveAuthSession(json);
    else window.CineTrackerNative?.saveSession?.(json);
    return true;
  } catch (error) {
    console.warn('[CineTracker FIX 6] falha ao persistir sessão nativa:', error);
    return false;
  }
}

function readNativeSession() {
  try {
    const raw = window.CineTrackerNative?.getAuthSession?.();
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('[CineTracker FIX 6] falha ao ler sessão nativa:', error);
    return null;
  }
}

function clearNativeSession() {
  try { window.CineTrackerNative?.clearAuthSession?.(); } catch (error) { console.warn('[CineTracker FIX 6] falha ao limpar sessão nativa:', error); }
}

function normalizeSession(session) {
  if (!session?.access_token) throw new Error('O Supabase não retornou uma sessão válida.');
  const expiresAt = session.expires_at || Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600);
  return { ...session, expires_at: expiresAt };
}

function applySessionSafely(session) {
  const saved = normalizeSession(session);
  // O storage nunca pode impedir a aplicação da sessão em memória.
  try {
    if (typeof saveSession === 'function') saveSession(saved);
  } catch (error) {
    console.warn('[CineTracker FIX 6] saveSession base falhou; mantendo sessão em memória:', error);
  }
  try { ctSession = saved; } catch (error) { throw new Error('Não foi possível aplicar a sessão ao aplicativo.'); }
  try { currentUser = saved.user || currentUser || null; } catch (error) { throw new Error('Não foi possível aplicar o usuário autenticado.'); }
  if (!ctSession?.access_token || !currentUser) throw new Error('A sessão foi recebida, mas não pôde ser ativada.');
  safeStorageSet('cinetracker_session', JSON.stringify(saved));
  persistNativeSession(saved);
  return saved;
}

function readPersistedSession() {
  const local = safeStorageGet('cinetracker_session');
  if (local) {
    try { return JSON.parse(local); } catch (error) { console.warn('[CineTracker FIX 6] sessão local inválida:', error); }
  }
  return readNativeSession();
}

function beginAuthDeadline() {
  if (activeAuthController) {
    try { activeAuthController.abort(); } catch {}
  }
  const controller = new AbortController();
  activeAuthController = controller;
  const timer = setTimeout(() => controller.abort('timeout'), AUTH_TIMEOUT_MS);
  return {
    controller,
    finish() {
      clearTimeout(timer);
      if (activeAuthController === controller) activeAuthController = null;
    }
  };
}

async function fetchAuthJson(url, options, signal) {
  try {
    const response = await fetch(url, { ...options, signal, cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || `Falha na autenticação (${response.status})`);
    return data;
  } catch (error) {
    if (signal?.aborted || error?.name === 'AbortError') throw timeoutError();
    throw error;
  }
}

async function signInWithPasswordFix6(email, password) {
  const deadline = beginAuthDeadline();
  try {
    const data = await fetchAuthJson(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      { method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) },
      deadline.controller.signal
    );
    return applySessionSafely(data);
  } finally {
    deadline.finish();
  }
}

async function getSessionFix6() {
  const persisted = readPersistedSession();
  if (!persisted?.access_token) return false;
  const deadline = beginAuthDeadline();
  try {
    let saved = persisted;
    if (saved.expires_at && saved.expires_at < Math.floor(Date.now() / 1000) + 60 && saved.refresh_token) {
      saved = await fetchAuthJson(
        `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
        { method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: saved.refresh_token }) },
        deadline.controller.signal
      );
      saved = normalizeSession(saved);
    }
    const user = await fetchAuthJson(
      `${SUPABASE_URL}/auth/v1/user`,
      { method: 'GET', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${saved.access_token}` } },
      deadline.controller.signal
    );
    applySessionSafely({ ...saved, user: saved.user || user });
    return true;
  } catch (error) {
    if (error?.name === 'TimeoutError') throw error;
    safeStorageRemove('cinetracker_session');
    clearNativeSession();
    try { ctSession = null; currentUser = null; } catch {}
    return false;
  } finally {
    deadline.finish();
  }
}

function nextUiTurn() {
  return new Promise(resolve => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

async function navigateHomeSafely() {
  await nextUiTurn();
  try { view = 'home'; } catch (error) { throw new Error('Não foi possível selecionar a rota Home.'); }
  try { cloudConnected = true; cloudStatus = 'Banco persistente conectado'; } catch {}
  if (typeof render !== 'function') throw new Error('Renderização principal indisponível.');
  render();
  await nextUiTurn();
  window.scrollTo?.(0, 0);
  if ($('#auth-form') || !($('.app') || $('.content') || $('[data-view="home"]'))) {
    throw new Error('A sessão foi confirmada, mas a Home não foi renderizada.');
  }
  window.__ctFix6HomeReached = true;
  return true;
}

function hydrateInBackground() {
  void (async () => {
    try { if (typeof loadCloudState === 'function') await loadCloudState(); } catch (error) { console.warn('[CineTracker FIX 6] sincronização em segundo plano:', error); }
    try { if (typeof primeOfficialSuggestions === 'function') await primeOfficialSuggestions(); } catch (error) { console.warn('[CineTracker FIX 6] recomendações em segundo plano:', error); }
    try { if (typeof render === 'function' && currentUser) render(); } catch (error) { console.warn('[CineTracker FIX 6] render pós-hidratação:', error); }
  })().catch(error => console.warn('[CineTracker FIX 6] hidratação não tratada:', error));
}

function installAuthStateListener() {
  if (typeof authStateCleanup === 'function') authStateCleanup();
  if (typeof window.__ctFix6AuthUnsubscribe === 'function') window.__ctFix6AuthUnsubscribe();
  const handler = event => {
    const detail = event?.detail || {};
    if (detail.event === 'SIGNED_OUT') {
      try { ctSession = null; currentUser = null; } catch {}
    }
  };
  window.addEventListener('cinetracker:auth-state-change', handler);
  authStateCleanup = () => window.removeEventListener('cinetracker:auth-state-change', handler);
  window.__ctFix6AuthUnsubscribe = authStateCleanup;
  return authStateCleanup;
}

async function submitFix6() {
  const form = $('#auth-form');
  if (!form || form.dataset.fix6Loading === '1' || window.__ctAuthIsLoading) return false;
  const email = ($('#auth-email')?.value || '').trim();
  const password = $('#auth-password')?.value || '';
  setAuthError('');
  if (!email || !password) {
    setAuthError('Informe e-mail e senha.');
    return false;
  }
  setLoading(true);
  try {
    let mode = 'signin';
    try { mode = authMode; } catch {}
    if (mode === 'signup') {
      throw new Error('Cadastro temporariamente indisponível neste hotfix. Use uma conta já criada.');
    }
    const session = await signInWithPasswordFix6(email, password);
    await navigateHomeSafely();
    window.dispatchEvent?.(new CustomEvent('cinetracker:auth-state-change', { detail: { event: 'SIGNED_IN', session } }));
    hydrateInBackground();
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha no login';
    setAuthError(message);
    window.dispatchEvent?.(new CustomEvent('cinetracker:auth-state-change', { detail: { event: 'SIGNED_OUT', error: message } }));
    return false;
  } finally {
    setLoading(false);
  }
}

function captureSubmit(event) {
  const form = event.target?.closest?.('#auth-form') || (event.target?.id === 'auth-form' ? event.target : null);
  if (!form) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  void submitFix6().catch(error => {
    console.error('[CineTracker FIX 6] submit não tratado:', error);
    setAuthError('Falha inesperada no login. Tente novamente.');
    setLoading(false);
  });
}

function bindAuthFix6() {
  // O submit é tratado exclusivamente no listener global em capture.
  const toggle = $('#auth-toggle');
  if (toggle && !toggle.dataset.fix6Bound) {
    toggle.dataset.fix6Bound = '1';
    toggle.addEventListener('click', event => {
      event.preventDefault();
      try { authMode = authMode === 'signin' ? 'signup' : 'signin'; } catch {}
      if (typeof render === 'function') render();
    }, { once: true });
  }
}

document.addEventListener('submit', captureSubmit, true);
installAuthStateListener();
try { signIn = signInWithPasswordFix6; restoreSession = getSessionFix6; bindAuth = bindAuthFix6; } catch (error) { console.warn('[CineTracker FIX 6] não foi possível substituir globals de auth:', error); }

async function restoreOnBoot() {
  if (!$('#auth-form')) return false;
  try {
    const restored = await getSessionFix6();
    if (!restored) return false;
    await navigateHomeSafely();
    hydrateInBackground();
    return true;
  } catch (error) {
    setAuthError(error instanceof Error ? error.message : 'Falha ao restaurar sessão.');
    return false;
  } finally {
    setLoading(false);
  }
}

setTimeout(() => { void restoreOnBoot().catch(error => console.warn('[CineTracker FIX 6] restore não tratado:', error)); }, 50);

window.__ctFix6Dispose = () => {
  document.removeEventListener('submit', captureSubmit, true);
  if (typeof authStateCleanup === 'function') authStateCleanup();
  authStateCleanup = null;
  if (activeAuthController) {
    try { activeAuthController.abort(); } catch {}
    activeAuthController = null;
  }
  setLoading(false);
};

window.__ctFix6Test = {
  submit: submitFix6,
  restore: restoreOnBoot,
  signIn: signInWithPasswordFix6,
  getSession: getSessionFix6,
  navigateHome: navigateHomeSafely,
  dispose: window.__ctFix6Dispose,
  timeoutMs: AUTH_TIMEOUT_MS
};
})();

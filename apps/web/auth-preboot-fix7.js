(() => {
'use strict';
if (window.__ctFix7PrebootLoaded) return;
window.__ctFix7PrebootLoaded = true;
window.__ctFix7Quarantine = { canonical: null, supabase: [] };
try {
  const raw = localStorage.getItem('cinetracker_session');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') window.__ctFix7Quarantine.canonical = parsed;
    } catch {}
    try { localStorage.removeItem('cinetracker_session'); } catch {}
  }
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  for (const key of keys) {
    const lower = key.toLowerCase();
    if ((lower.startsWith('sb-') && lower.includes('auth')) || lower === 'supabase.auth.token') {
      try {
        window.__ctFix7Quarantine.supabase.push([key, localStorage.getItem(key)]);
        localStorage.removeItem(key);
      } catch {}
    }
  }
} catch (error) {
  console.warn('[CineTracker FIX 7] preboot storage quarantine:', error);
}
window.__ctFix7TakeQuarantinedSession = () => {
  const session = window.__ctFix7Quarantine?.canonical || null;
  if (window.__ctFix7Quarantine) window.__ctFix7Quarantine.canonical = null;
  return session;
};
})();

(() => {
'use strict';
if (window.__ct0992UnfreezeLoaded) return;
window.__ct0992UnfreezeLoaded = true;
window.__ct0992Unfreeze = 'fix2-idempotent-dom-mutation-guard';

/*
 * 0.99.2 FIX2 — emergency unfreeze.
 *
 * The 0.99.2 Home observer and the final navigation observer both reconcile the
 * version footer after DOM changes. Their historical footer helpers assign
 * textContent even when the text is already identical. In browsers/WebView,
 * assigning identical textContent still replaces the text node, producing a
 * new childList MutationRecord. The observer then runs again and creates an
 * endless observer -> textContent -> observer loop that pegs the main thread.
 *
 * Keep DOM semantics intact while making same-value textContent assignments a
 * no-op. This patch is intentionally loaded after all 0.99.1/0.99.2 layers but
 * before their delayed observers begin observing (#app at 250/500 ms).
 */
const nodeProto = window.Node && Node.prototype;
const desc = nodeProto && Object.getOwnPropertyDescriptor(nodeProto, 'textContent');
if (desc?.get && desc?.set && desc.configurable && !window.__ctTextContentIdempotent992) {
  Object.defineProperty(nodeProto, 'textContent', {
    configurable: desc.configurable,
    enumerable: desc.enumerable,
    get: desc.get,
    set(value) {
      try {
        const next = value == null ? '' : String(value);
        if (desc.get.call(this) === next) return;
      } catch {}
      return desc.set.call(this, value);
    }
  });
  window.__ctTextContentIdempotent992 = true;
}

/* Limit duplicate synthetic refresh bursts while preserving real state changes. */
let refreshQueued = false;
function refreshCurrentView() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    let current = 'home';
    try { current = String(view || window.view || 'home'); } catch { current = String(window.view || 'home'); }
    if (current === 'history') current = 'profile';
    if (!['home','discover','profile','settings'].includes(current)) current = 'home';
    try { window.ct0992Navigate?.(current); } catch (error) { console.error('CineTracker 0.99.2 FIX2 navigation refresh:', error); }
  });
}

window.addEventListener('pageshow', refreshCurrentView, { once: true });
setTimeout(refreshCurrentView, 900);
})();

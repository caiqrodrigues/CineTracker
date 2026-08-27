(() => {
'use strict';
if (window.__ct0994AuthorityLoaded) return;
window.__ct0994AuthorityLoaded = true;
window.__ct0994Authority = 'web-0.99.4-passive-only';
window.__ctWebBuild = '0.99.4';

/* Cleanup leftovers from earlier authority attempts. */
try { window.__ct0994AuthorityObserver?.disconnect?.(); } catch {}
try { if (window.__ct0994AuthorityInterval) clearInterval(window.__ct0994AuthorityInterval); } catch {}
window.__ct0994AuthorityObserver = null;
window.__ct0994AuthorityInterval = null;

/* History is removed visually without DOM mutation/re-render loops. */
const style = document.createElement('style');
style.id = 'ct0994-authority-style';
style.textContent = `
.sidebar .nav [data-view="history"],
.sidebar .nav [data-view99="history"],
.sidebar .nav [data-view991="history"],
.mobile-nav [data-view="history"],
.mobile-nav [data-view99="history"],
.mobile-nav [data-view991="history"] {
  display:none!important;
  pointer-events:none!important;
}
.ct993-version,.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct-version-footer {
  display:none!important;
}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);

function footer994() {
  const host = document.querySelector('.content');
  if (!host) return;
  let footer = host.querySelector('.ct994-version');
  if (!footer) {
    footer = document.createElement('div');
    footer.className = 'ct994-version';
    footer.style.cssText = 'text-align:center;color:#6f8798;font-size:11px;margin:28px 0 8px';
    host.appendChild(footer);
  }
  footer.textContent = 'CineTracker • v0.99.4';
}

/* Bounded startup only. No MutationObserver, no interval, no route interception,
   no data-changed listener, and no nav reconstruction. */
footer994();
setTimeout(footer994, 300);
setTimeout(footer994, 1000);
})();

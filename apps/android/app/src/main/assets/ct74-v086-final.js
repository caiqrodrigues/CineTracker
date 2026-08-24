(() => {
  'use strict';
  window.__ctAndroidBuild = '0.0.86';
  const fix = () => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.children.length) return;
      const t = (el.textContent || '').trim();
      if (t === 'Android 0.0.86-test') el.textContent = 'Android 0.0.86';
    });
  };
  new MutationObserver(fix).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  setTimeout(fix, 50);
})();

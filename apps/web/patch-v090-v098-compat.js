(() => {
'use strict';
if (window.__ct98Compat) return;
window.__ct98Compat = true;
const previous15 = window.ct15Navigate;
window.__ct15NavigateBefore98 = previous15;
window.ct15Navigate = function(target) {
  const t = target === 'history' ? 'profile' : target;
  if (['home','discover','profile','settings'].includes(t) && typeof window.ct98Navigate === 'function') return window.ct98Navigate(t);
  return typeof previous15 === 'function' ? previous15(target) : false;
};
window.__ctAndroidBuild = '0.0.98';
})();

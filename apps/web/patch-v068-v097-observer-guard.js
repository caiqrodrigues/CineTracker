(() => {
  'use strict';
  if (window.__ct97ObserverGuard) return;
  window.__ct97ObserverGuard = true;

  const NativeMutationObserver = window.MutationObserver;
  if (typeof NativeMutationObserver !== 'function') return;

  function GuardedMutationObserver(callback) {
    let nativeObserver;
    const guardedCallback = (records) => {
      const relevant = records.filter((record) => {
        const target = record?.target;
        if (!(target instanceof Element)) return true;
        return !target.matches('.ct97-version') && !target.closest('.ct97-version');
      });
      if (relevant.length) callback(relevant, nativeObserver);
    };
    nativeObserver = new NativeMutationObserver(guardedCallback);
    return nativeObserver;
  }

  GuardedMutationObserver.prototype = NativeMutationObserver.prototype;
  Object.setPrototypeOf(GuardedMutationObserver, NativeMutationObserver);
  window.MutationObserver = GuardedMutationObserver;
})();

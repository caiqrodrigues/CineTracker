(() => {
  'use strict';
  if (!Object.prototype.hasOwnProperty.call(window, 'ctProfile')) window.ctProfile = null;

  async function syncProfile025() {
    if (!currentUser?.id || !ctSession?.access_token) return;
    try {
      const rows = await sbApi(`profiles?id=eq.${currentUser.id}&select=id,display_name,settings&limit=1`);
      window.ctProfile = Array.isArray(rows) ? rows[0] || null : null;
    } catch (error) {
      console.warn('CineTracker v0.2.5 profile sync:', error);
    }
  }

  const previousRender = render;
  render = function ctProfileAwareRender() {
    previousRender();
    if (currentUser && !window.ctProfile) void syncProfile025();
  };

  if (currentUser) void syncProfile025();
})();

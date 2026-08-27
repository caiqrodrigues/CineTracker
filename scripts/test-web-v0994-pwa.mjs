import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const gate = await readFile('apps/web/patch-v103-v0994-session-gate.js', 'utf8');
const resilience = await readFile('apps/web/patch-v108-v0994-pwa-resilience.js', 'utf8');
const gradle = await readFile('apps/android/app/build.gradle', 'utf8');

assert.match(gate, /web-0\.99\.4-auth-required-nonblocking-preload/, 'Web session gate marker missing');
assert.match(gate, /void preloadRoute994\(target\);/, 'Web navigation must not wait for Home preload');
assert.ok(!gate.includes('  await preloadRoute994(target);'), 'Web navigation still blocks on preload');
assert.match(resilience, /v108-web-pwa-home-resilience/, 'PWA resilience marker missing');
assert.match(resilience, /Tempo limite ao sincronizar Home/, 'Home timeout guard missing');
assert.match(resilience, /readStaleHome108/, 'Home stale-cache fallback missing');
assert.match(gradle, /versionName '0\.99\.2\.3'/, 'Android identity must stay unchanged during Web fix');
assert.match(gradle, /versionCode 9923/, 'Android versionCode must stay unchanged during Web fix');

const staleData = { series: [{ media_id: 1, title: 'cached' }], movie_watchlist: [] };
const rawRpc = (name) => name === 'cinetracker_profile_home_payload_v0994'
  ? new Promise(() => {})
  : Promise.resolve({ ok: true });
const context = {
  window: { sbRpc: rawRpc, __ct0994HomeTimeoutMs: 20 },
  sbRpc: rawRpc,
  currentUser: { id: 'user-1' },
  ctSession: { user: { id: 'user-1' }, access_token: 'token' },
  navigator: { onLine: true },
  localStorage: {
    getItem(key) {
      if (key === 'ct0994_home_preload_v1') return JSON.stringify({ uid: 'user-1', at: Date.now(), data: staleData });
      return null;
    }
  },
  console: { warn() {} },
  setTimeout,
  clearTimeout,
  Promise,
  Date,
  JSON,
  Number
};
vm.runInNewContext(resilience, context, { filename: 'patch-v108-v0994-pwa-resilience.js' });
const result = await context.window.sbRpc('cinetracker_profile_home_payload_v0994', {});
assert.equal(JSON.stringify(result), JSON.stringify(staleData), 'PWA Home must fall back to cached payload after timeout');

console.log('WEB_0994_PWA_OK navigation=nonblocking home-timeout=guarded stale-cache=fallback android=unchanged');

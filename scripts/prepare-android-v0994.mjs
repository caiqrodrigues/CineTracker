import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix5');
const version = '0.99.4';
const bundle = 'android-v0.99.4-startup-resilient';

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const indexPath = resolve(target, 'index.html');
let html = await readFile(indexPath, 'utf8');
const earlyMarker = `<script>window.__ctAndroidBundle='${bundle}';window.__ctAndroidBuild='${version}';window.__ctAndroidEmbedded=true;</script>`;
html = html.replace('</head>', `${earlyMarker}</head>`);

const scriptPattern = /<script src="\/([^"?#]+)"><\/script>/g;
const scripts = [...html.matchAll(scriptPattern)];
let patchedSessionGate = false;
for (const match of scripts) {
  const fileName = match[1];
  let script = await readFile(resolve(source, fileName), 'utf8');
  if (fileName === 'patch-v103-v0994-session-gate.js') {
    const blockingNeedle = '  await preloadRoute994(target);';
    const nonBlockingNeedle = '  void preloadRoute994(target);';
    if (script.includes(blockingNeedle)) {
      const replacement = `  if (new URLSearchParams(location.search).get('android') === '1' || /CineTrackerAndroid\\//i.test(navigator.userAgent || '')) {\n    void preloadRoute994(target);\n  } else {\n    await preloadRoute994(target);\n  }`;
      script = script.replace(blockingNeedle, replacement);
      patchedSessionGate = true;
    } else if (script.includes(nonBlockingNeedle)) {
      patchedSessionGate = true;
    } else {
      throw new Error('Android 0.99.4: navigation preload marker not found.');
    }
  }
  script = script.replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], () => `<script data-ct-inline="${fileName}">\n${script}\n</script>`);
}

html = html.replace("if (!('serviceWorker' in navigator)) return;", "if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;");
html = html.replace(/<link rel="icon"[^>]*>/g, '');

const resilience = `<script>
(() => {
  'use strict';
  window.__ctAndroidBuild='${version}';
  window.__ctAndroidBundle='${bundle}';
  const rawRpc = typeof window.sbRpc === 'function' ? window.sbRpc : null;
  if (rawRpc && !rawRpc.__ctAndroid994Timeout) {
    const wrapped = async function(name, body = {}) {
      if (name !== 'cinetracker_profile_home_payload_v0994') return rawRpc(name, body);
      return new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          reject(new Error('Tempo limite ao sincronizar Home. Toque em Home para tentar novamente.'));
        }, 15000);
        Promise.resolve(rawRpc(name, body)).then(value => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(value);
        }, error => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(error);
        });
      });
    };
    wrapped.__ctAndroid994Timeout = true;
    try { sbRpc = wrapped; } catch {}
    window.sbRpc = wrapped;
  }
  const navigate994 = target => {
    const nav = window.__ct0994Navigate || window.ct0994Navigate;
    if (typeof nav !== 'function') return false;
    void nav(target === 'history' ? 'profile' : target);
    return true;
  };
  window.ct15Navigate = navigate994;
  window.ct14Navigate = navigate994;
  window.__ctAndroid994Navigate = navigate994;
})();
</script>`;
html = html.replace('</body>', `${resilience}</body>`);
await writeFile(indexPath, html, 'utf8');

if (!patchedSessionGate) throw new Error('Android 0.99.4 session gate was not patched.');
const required = [
  'patch-v099-v0994-web.js',
  'patch-v101-v0994-nav-pre.js',
  'patch-v103-v0994-session-gate.js',
  'patch-v104-v0994-authority.js',
  'patch-v105-v0994-preload-layout.js',
  'patch-v106-v0994-refactor.js',
  'patch-v107-v0994-data-ui-fix.js'
];
for (const name of required) {
  if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android 0.99.4 missing ${name}.`);
}
if (!html.includes("window.__ctAndroidBundle='android-v0.99.4-startup-resilient'")) throw new Error('Android 0.99.4 bundle marker missing.');
if (!html.includes('void preloadRoute994(target);')) throw new Error('Android 0.99.4 still blocks navigation on preload.');
if (!html.includes('Tempo limite ao sincronizar Home')) throw new Error('Android 0.99.4 Home timeout guard missing.');
if (!html.includes('window.ct15Navigate = navigate994')) throw new Error('Android native navigation is not routed to 0.99.4.');
if (html.includes('<script src="/')) throw new Error('Android 0.99.4 still has root script dependencies.');
console.log(`Android ${version} bundle prepared with ${scripts.length} inlined scripts; startup preload is non-blocking and native navigation targets 0.99.4.`);

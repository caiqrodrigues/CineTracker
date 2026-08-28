import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix5');
const version = '0.99.4';
const bundle = 'android-v0.99.4-fluid-preload';

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
      script = script.replace(blockingNeedle, '  void preloadRoute994(target);');
      patchedSessionGate = true;
    } else if (script.includes(nonBlockingNeedle)) patchedSessionGate = true;
    else throw new Error('Android 0.99.4: navigation preload marker not found.');
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
        const timer = setTimeout(() => { if (!settled) { settled = true; reject(new Error('Tempo limite ao sincronizar Home.')); } }, 10000);
        Promise.resolve(rawRpc(name, body)).then(value => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } }, error => { if (!settled) { settled = true; clearTimeout(timer); reject(error); } });
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
  'patch-v099-v0994-web.js','patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js',
  'patch-v105-v0994-preload-layout.js','patch-v106-v0994-refactor.js','patch-v107-v0994-data-ui-fix.js','patch-v108-v0994-pwa-resilience.js',
  'patch-v109-v0994-settings-web.js','patch-v110-v0994-episode-check.js','patch-v111-v0994-global-search.js','patch-v112-v0994-warm-boot.js','patch-v113-v0994-fluidity.js'
];
for (const name of required) if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android 0.99.4 missing ${name}.`);
if (!html.includes("window.__ctAndroidBundle='android-v0.99.4-fluid-preload'")) throw new Error('Android 0.99.4 fluid bundle marker missing.');
if (!html.includes('v113-cache-first-fast-boot')) throw new Error('Android 0.99.4 missing cache-first boot.');
if (!html.includes('v113-persistent-hot-route-cache')) throw new Error('Android 0.99.4 missing persistent Profile/Discover snapshots.');
if (!html.includes('v113-cache-first-tabs-activity')) throw new Error('Android 0.99.4 missing fluidity/activity layer.');
if (!html.includes('void preloadRoute994(target);')) throw new Error('Android 0.99.4 still blocks navigation on preload.');
if (!html.includes('window.ct15Navigate = navigate994')) throw new Error('Android native navigation is not routed to 0.99.4.');
if (html.includes('<script src="/')) throw new Error('Android 0.99.4 still has root script dependencies.');
console.log(`Android ${version} bundle prepared with ${scripts.length} inlined scripts; cache-first Web preload and fluid tabs are embedded.`);

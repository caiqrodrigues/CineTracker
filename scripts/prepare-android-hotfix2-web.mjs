import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix2');

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const indexPath = resolve(target, 'index.html');
let html = await readFile(indexPath, 'utf8');

// The HOTFIX 1 AssetLoader path proved unsafe on a real device. HOTFIX 2 keeps
// the validated Web build inside the APK, but turns it into one self-contained
// HTML document that Android can load with loadDataWithBaseURL using the normal
// CineTracker HTTPS origin.
const scriptPattern = /<script src="\/([^"?#]+)"><\/script>/g;
const scripts = [...html.matchAll(scriptPattern)];
for (const match of scripts) {
  const fileName = match[1];
  const scriptPath = resolve(source, fileName);
  let script = await readFile(scriptPath, 'utf8');
  script = script.replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], `<script data-ct-inline="${fileName}">\n${script}\n</script>`);
}

// Never let the embedded Android document register/refresh a Web service worker.
// The APK already contains the exact runtime that was validated by CI.
html = html.replace(
  "if (!('serviceWorker' in navigator)) return;",
  "if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;"
);

// Avoid an empty black document while restoreSession is waiting on the network.
html = html.replace(
`async function bootstrap() {
    const restored = await restoreSession();
    if (!restored) {
        render();
        return;
    }
    enterAuthenticatedHome();
}`,
`async function bootstrap() {
    render();
    const restored = await restoreSession();
    if (!restored)
        return;
    enterAuthenticatedHome();
}`
);

const hotfix2Marker = `<script>
window.__ctAndroidBundle = 'hotfix2-inline';
window.__ctHotfix2Version = true;
window.__ctAndroidBuild = '0.0.97 HOTFIX 2';
(function(){
  function apply(){
    window.__ctAndroidBuild = '0.0.97 HOTFIX 2';
    document.querySelectorAll('.ct97-version,.ct-version-footer,#ct56-version').forEach(function(el){
      if (el.classList && el.classList.contains('ct97-version')) el.textContent='CineTracker • v0.0.97 HOTFIX 2';
      else if (/CineTracker|versão|v\\d/i.test(el.textContent||'')) el.textContent='CineTracker • v0.0.97 HOTFIX 2';
    });
  }
  var previous = window.render;
  if (typeof previous === 'function' && !window.__ctHotfix2Render) {
    window.__ctHotfix2Render = previous;
    window.render = function(){ var out = window.__ctHotfix2Render.apply(this, arguments); setTimeout(apply,0); return out; };
  }
  setTimeout(apply,0); setTimeout(apply,250);
})();
</script>`;
html = html.replace('</body>', hotfix2Marker + '</body>');
html = html.replace(/<link rel="icon"[^>]*>/g, '');

await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-base'")) throw new Error('Android HOTFIX 2 bundle missing auth recovery.');
if (!html.includes("window.__ctAndroidBundle = 'hotfix2-inline'")) throw new Error('Android HOTFIX 2 marker missing.');
if (!html.includes('0.0.97 HOTFIX 2')) throw new Error('Android HOTFIX 2 version missing.');
if (html.includes('<script src="/')) throw new Error('Android HOTFIX 2 still has root script dependencies.');
if (html.includes('patch-v073-v097-fix7.js') || html.includes('auth-preboot-fix7.js')) throw new Error('Legacy FIX 7 found in Android HOTFIX 2 bundle.');
if (!html.includes('async function bootstrap() {\n    render();\n    const restored = await restoreSession();')) throw new Error('Android HOTFIX 2 startup render guard missing.');

console.log(`Android HOTFIX 2 self-contained Web bundle prepared with ${scripts.length} inlined scripts.`);

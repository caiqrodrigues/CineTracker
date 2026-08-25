import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix5');

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const indexPath = resolve(target, 'index.html');
let html = await readFile(indexPath, 'utf8');

// HOTFIX 5 keeps the validated Web runtime inside the APK and makes it
// authoritative. Vercel is a deployment target for Web, not an Android
// boot dependency.
const scriptPattern = /<script src="\/([^"?#]+)"><\/script>/g;
const scripts = [...html.matchAll(scriptPattern)];
for (const match of scripts) {
  const fileName = match[1];
  const scriptPath = resolve(source, fileName);
  let script = await readFile(scriptPath, 'utf8');
  script = script.replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], `<script data-ct-inline="${fileName}">\n${script}\n</script>`);
}

// The APK owns its exact runtime. Never let it register or refresh a Web SW.
html = html.replace(
  "if (!('serviceWorker' in navigator)) return;",
  "if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;"
);

// Paint the login shell immediately; session restore happens after first paint.
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

const hotfix5Marker = `<script>
window.__ctAndroidBundle = 'hotfix5-inline-authoritative';
window.__ctHotfix5Version = true;
window.__ctAndroidBuild = '0.0.97 HOTFIX 5';
(function(){
  function apply(){
    window.__ctAndroidBuild = '0.0.97 HOTFIX 5';
    document.querySelectorAll('.ct97-version,.ct-version-footer,#ct56-version').forEach(function(el){
      if (el.classList && el.classList.contains('ct97-version')) el.textContent='CineTracker • v0.0.97 HOTFIX 5';
      else if (/CineTracker|versão|v\\d/i.test(el.textContent||'')) el.textContent='CineTracker • v0.0.97 HOTFIX 5';
    });
  }
  var previous = window.render;
  if (typeof previous === 'function' && !window.__ctHotfix5BundleRender) {
    window.__ctHotfix5BundleRender = previous;
    window.render = function(){ var out = window.__ctHotfix5BundleRender.apply(this, arguments); setTimeout(apply,0); return out; };
  }
  setTimeout(apply,0); setTimeout(apply,250);
})();
</script>`;
html = html.replace('</body>', hotfix5Marker + '</body>');
html = html.replace(/<link rel="icon"[^>]*>/g, '');

await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-hotfix5'")) throw new Error('Android HOTFIX 5 bundle missing auth recovery.');
if (!html.includes("window.__ctAndroidBundle = 'hotfix5-inline-authoritative'")) throw new Error('Android HOTFIX 5 marker missing.');
if (!html.includes('0.0.97 HOTFIX 5')) throw new Error('Android HOTFIX 5 version missing.');
if (!html.includes('ctLooksLikeJwt')) throw new Error('Android HOTFIX 5 JWT guard missing.');
if (html.includes('<script src="/')) throw new Error('Android HOTFIX 5 still has root script dependencies.');
if (html.includes('patch-v073-v097-fix7.js') || html.includes('auth-preboot-fix7.js')) throw new Error('Legacy FIX 7 found in Android HOTFIX 5 bundle.');
if (!html.includes('async function bootstrap() {\n    render();\n    const restored = await restoreSession();')) throw new Error('Android HOTFIX 5 startup render guard missing.');

console.log(`Android HOTFIX 5 authoritative self-contained bundle prepared with ${scripts.length} inlined scripts.`);

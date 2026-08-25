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

const scriptPattern = /<script src="\/([^"?#]+)"><\/script>/g;
const scripts = [...html.matchAll(scriptPattern)];
for (const match of scripts) {
  const fileName = match[1];
  const scriptPath = resolve(source, fileName);
  let script = await readFile(scriptPath, 'utf8');
  script = script.replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], () => `<script data-ct-inline="${fileName}">\n${script}\n</script>`);
}

// Android executes the exact validated Web bootstrap. Do not rewrite auth/session
// startup here: Web and Android must share the same P0 login-first behavior.
html = html.replace(
  "if (!('serviceWorker' in navigator)) return;",
  "if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;"
);

const hotfixMarker = `<script>
window.__ctAndroidBundle = 'hotfix8-post-login-inline-authoritative';
window.__ctHotfix8Startup = true;
window.__ctAndroidBuild = '0.0.97 HOTFIX 8';
(function(){
  function apply(){
    window.__ctAndroidBuild = '0.0.97 HOTFIX 8';
    document.querySelectorAll('.ct97-version,.ct-version-footer,#ct56-version').forEach(function(el){
      var next='CineTracker • v0.0.97 HOTFIX 8';
      if (el.textContent!==next && (el.classList && el.classList.contains('ct97-version') || /CineTracker|versão|v\\d/i.test(el.textContent||''))) el.textContent=next;
    });
  }
  var previous = window.render;
  if (typeof previous === 'function' && !window.__ctHotfix8BundleRender) {
    window.__ctHotfix8BundleRender = previous;
    window.render = function(){ var out = window.__ctHotfix8BundleRender.apply(this, arguments); setTimeout(apply,0); return out; };
  }
  setTimeout(apply,0); setTimeout(apply,250);
})();
</script>`;
html = html.replace('</body>', hotfixMarker + '</body>');
html = html.replace(/<link rel="icon"[^>]*>/g, '');

await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-hotfix6-startup'")) throw new Error('Android bundle missing startup auth recovery.');
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) throw new Error('Android bundle missing one-time poisoned-session reset.');
if (!html.includes('window.__ct97ObserverGuard = true')) throw new Error('Android bundle missing HOTFIX8 v97 observer guard.');
if (html.indexOf('window.__ct97ObserverGuard = true') > html.indexOf('if(window.__ct97Loaded)return')) throw new Error('Android HOTFIX8 observer guard loads after v97.');
if (!html.includes("window.__ctAndroidBundle = 'hotfix8-post-login-inline-authoritative'")) throw new Error('Android HOTFIX 8 bundle marker missing.');
if (!html.includes('const media = [')) throw new Error('Android bundle lost the critical media startup block.');
if (!html.includes('0.0.97 HOTFIX 8')) throw new Error('Android HOTFIX 8 version missing.');
if (!html.includes('ctLooksLikeJwt')) throw new Error('Android JWT guard missing.');
if (html.includes('<script src="/')) throw new Error('Android still has root script dependencies.');
if (html.includes('patch-v073-v097-fix7.js') || html.includes('auth-preboot-fix7.js')) throw new Error('Legacy FIX 7 found in Android bundle.');
if (!html.includes("restored = await authRecoveryWithTimeout(restoreSession(), 6500, 'Restauração de sessão');")) throw new Error('Android hard session-restore timeout missing.');
if (!html.includes("localStorage.removeItem('cinetracker_session');")) throw new Error('Android poisoned-session cleanup missing.');
if (!html.includes('$$=(s,r=document)=>')) throw new Error('Android inliner corrupted the $$ selector helper.');

console.log(`Android HOTFIX 8 bundle prepared with ${scripts.length} inlined scripts; startup and post-login guards preserved.`);

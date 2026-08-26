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

html = html.replace(
  "if (!('serviceWorker' in navigator)) return;",
  "if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;"
);

const hotfixMarker = `<script>
window.__ctAndroidBundle = 'hotfix11-import-sync-v95-core-inline-authoritative';
window.__ctHotfix10Startup = true;
window.__ctAndroidBuild = '0.0.97 HOTFIX 11';
</script>`;
html = html.replace('</body>', hotfixMarker + '</body>');
html = html.replace(/<link rel="icon"[^>]*>/g, '');

await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-hotfix6-startup'")) throw new Error('Android HOTFIX11 missing startup auth recovery.');
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) throw new Error('Android HOTFIX11 missing one-time poisoned-session reset.');
if (!html.includes('data-ct-inline="patch-v067-v095.js"')) throw new Error('Android HOTFIX11 missing stable v95 feature layer.');
for (const name of ['patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js']) {
  if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android HOTFIX11 missing ${name}.`);
}
if (!html.includes('__ctHotfix11ImportSync') || !html.includes('__ctHotfix11SettingsBridge')) throw new Error('Android HOTFIX11 import/sync markers missing.');
if (html.includes('patch-v068-v097.js') || html.includes('__ct97Loaded')) throw new Error('Android HOTFIX11 still contains unstable v97 overlay.');
if (html.includes('patch-v068-v097-observer-guard.js') || html.includes('__ct97ObserverGuard')) throw new Error('Android HOTFIX11 still contains obsolete v97 observer guard.');
if (!html.includes("window.__ctAndroidBundle = 'hotfix11-import-sync-v95-core-inline-authoritative'")) throw new Error('Android HOTFIX11 bundle marker missing.');
if (!html.includes('const media = [')) throw new Error('Android HOTFIX11 lost critical media startup block.');
if (!html.includes('0.0.97 HOTFIX 11')) throw new Error('Android HOTFIX11 version missing.');
if (!html.includes('ctLooksLikeJwt')) throw new Error('Android HOTFIX11 JWT guard missing.');
if (html.includes('<script src="/')) throw new Error('Android HOTFIX11 still has root script dependencies.');
if (html.includes('patch-v073-v097-fix7.js') || html.includes('auth-preboot-fix7.js')) throw new Error('Legacy FIX7 found in Android HOTFIX11 bundle.');
if (!html.includes("restored = await authRecoveryWithTimeout(restoreSession(), 6500, 'Restauração de sessão');")) throw new Error('Android HOTFIX11 hard session-restore timeout missing.');
if (!html.includes("localStorage.removeItem('cinetracker_session');")) throw new Error('Android HOTFIX11 poisoned-session cleanup missing.');

console.log(`Android HOTFIX11 import-sync bundle prepared with ${scripts.length} inlined scripts; v97 overlay absent.`);

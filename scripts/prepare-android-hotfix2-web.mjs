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
  let script = await readFile(resolve(source, fileName), 'utf8');
  script = script.replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], () => `<script data-ct-inline="${fileName}">\n${script}\n</script>`);
}
html = html.replace("if (!('serviceWorker' in navigator)) return;", "if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;");
const hotfixMarker = `<script>\nwindow.__ctAndroidBundle = 'hotfix15-import-transport-v95-core-inline-authoritative';\nwindow.__ctHotfix10Startup = true;\nwindow.__ctAndroidBuild = '0.0.97 HOTFIX 15';\n</script>`;
html = html.replace('</body>', hotfixMarker + '</body>');
html = html.replace(/<link rel="icon"[^>]*>/g, '');
await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-hotfix6-startup'")) throw new Error('Android HOTFIX15 missing startup auth recovery.');
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) throw new Error('Android HOTFIX15 missing one-time poisoned-session reset.');
if (!html.includes('data-ct-inline="patch-v067-v095.js"')) throw new Error('Android HOTFIX15 missing stable v95 feature layer.');
const required = ['patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js'];
for (const name of required) if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android HOTFIX15 missing ${name}.`);
if (html.includes('data-ct-inline="patch-v081-hotfix12-nav-pre.js"')) throw new Error('Android HOTFIX15 contains obsolete HOTFIX12 capture nav.');
if (html.includes('data-ct-inline="patch-v084-hotfix14-real-device.js"')) throw new Error('Android HOTFIX15 contains obsolete HOTFIX14 import layer.');
const navIndex = html.indexOf('data-ct-inline="patch-v085-hotfix15-import-transport.js"'), selectiveIndex = html.indexOf('data-ct-inline="patch-v075-hotfix10-selective.js"'), pickerIndex = html.indexOf('data-ct-inline="patch-v082-hotfix12-picker-guard.js"'), semanticsIndex = html.indexOf('data-ct-inline="patch-v083-hotfix13-bingers-semantics.js"');
if (navIndex < 0 || selectiveIndex < 0 || pickerIndex < 0 || semanticsIndex < 0 || navIndex > selectiveIndex || pickerIndex < selectiveIndex || semanticsIndex < pickerIndex) throw new Error('Android HOTFIX15 runtime patch order invalid.');
if (!html.includes('__ctHotfix15ImportTransport') || !html.includes('ct15RestoreNativeFiles') || !html.includes('ct15EnhanceNativePicker')) throw new Error('Android HOTFIX15 import transport markers missing.');
if (!html.includes('__ctHotfix12PickerGuard') || !html.includes('__ctHotfix11ImportSync') || !html.includes('__ctHotfix11SettingsBridge')) throw new Error('Android HOTFIX15 import/sync markers missing.');
if (!html.includes('__ctHotfix13BingersSemantics') || !html.includes('movie_plays') || !html.includes('watch_later_total')) throw new Error('Android HOTFIX15 Bingers semantics missing.');
if (html.includes('patch-v068-v097.js') || html.includes('__ct97Loaded')) throw new Error('Android HOTFIX15 still contains unstable v97 overlay.');
if (!html.includes("window.__ctAndroidBundle = 'hotfix15-import-transport-v95-core-inline-authoritative'")) throw new Error('Android HOTFIX15 bundle marker missing.');
if (!html.includes('const media = [')) throw new Error('Android HOTFIX15 lost critical media startup block.');
if (!html.includes('0.0.97 HOTFIX 15')) throw new Error('Android HOTFIX15 version missing.');
if (!html.includes('ctLooksLikeJwt')) throw new Error('Android HOTFIX15 JWT guard missing.');
if (html.includes('<script src="/')) throw new Error('Android HOTFIX15 still has root script dependencies.');
if (!html.includes("restored = await authRecoveryWithTimeout(restoreSession(), 6500, 'Restauração de sessão');")) throw new Error('Android HOTFIX15 hard restore timeout missing.');
if (!html.includes("localStorage.removeItem('cinetracker_session');")) throw new Error('Android HOTFIX15 poisoned-session cleanup missing.');
console.log(`Android HOTFIX15 import-transport bundle prepared with ${scripts.length} inlined scripts; native picker present; v97 absent.`);
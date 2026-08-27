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
const marker = `<script>\nwindow.__ctAndroidBundle = 'v0.99.2.3-fix2-unfreeze-authoritative';\nwindow.__ctAndroidBuild = '0.99.2.3';\n</script>`;
html = html.replace('</body>', marker + '</body>');
html = html.replace(/<link rel="icon"[^>]*>/g, '');
await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-hotfix6-startup'")) throw new Error('Android 0.99.2.3 missing startup auth recovery.');
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) throw new Error('Android 0.99.2.3 missing one-time session reset.');
const required = ['patch-v067-v095.js','patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js','patch-v093-v0992.js','patch-v094-v0992-compat.js','patch-v095-v0992-fix.js','patch-v096-v0992-unfreeze.js'];
for (const name of required) if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android 0.99.2.3 missing ${name}.`);
for (const obsolete of ['patch-v081-hotfix12-nav-pre.js','patch-v084-hotfix14-real-device.js','patch-v086-hotfix15-import-retry.js','patch-v068-v097.js']) if (html.includes(`data-ct-inline="${obsolete}"`)) throw new Error(`Android 0.99.2.3 contains obsolete ${obsolete}.`);
const order=['patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js','patch-v093-v0992.js','patch-v094-v0992-compat.js','patch-v095-v0992-fix.js','patch-v096-v0992-unfreeze.js'];
const pos=order.map(x=>html.indexOf(`data-ct-inline="${x}"`));if(!pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1])))throw new Error('Android 0.99.2.3 runtime patch order invalid.');
for (const markerText of ['__ct0991Loaded','__ct0992Loaded','__ct0992Compat','__ct0992FixLoaded','__ct0992UnfreezeLoaded','fix2-idempotent-dom-mutation-guard','authoritative-runtime-navigation-profile-writes','cinetracker_profile_home_dashboard_v0992','Assistir a seguir','Juntando poeira','Escolha para Hoje','daily_movie_recommendations_v0992','window.addEventListener(\'click\'','profile_id','media_kind','CineTracker • v0.99.2']) if(!html.includes(markerText))throw new Error(`Android 0.99.2.3 missing ${markerText}.`);
if (!html.includes("window.__ctAndroidBundle = 'v0.99.2.3-fix2-unfreeze-authoritative'")) throw new Error('Android 0.99.2.3 bundle marker missing.');
if (!html.includes('const media = [')) throw new Error('Android 0.99.2.3 lost startup media block.');
if (!html.includes('ctLooksLikeJwt')) throw new Error('Android 0.99.2.3 JWT guard missing.');
if (html.includes('<script src="/')) throw new Error('Android 0.99.2.3 still has root script dependencies.');
console.log(`Android 0.99.2.3 bundle prepared with ${scripts.length} inlined scripts; 99.1 + 99.2 + unfreeze guard active.`);
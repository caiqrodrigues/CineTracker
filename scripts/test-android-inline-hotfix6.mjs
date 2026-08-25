import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path = 'apps/android/app/src/main/assets/hotfix5/index.html';
const html = await readFile(path, 'utf8');

if (!html.includes("window.__ctAndroidBundle = 'hotfix8-post-login-inline-authoritative'")) {
  throw new Error('Android inline smoke: HOTFIX 8 bundle marker missing');
}
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) {
  throw new Error('Android inline smoke: P0 session reset marker missing');
}
if (!html.includes('window.__ct97ObserverGuard = true')) {
  throw new Error('Android inline smoke: HOTFIX8 observer guard missing');
}
if (html.indexOf('window.__ct97ObserverGuard = true') > html.indexOf('if(window.__ct97Loaded)return')) {
  throw new Error('Android inline smoke: HOTFIX8 observer guard is loaded after v97');
}
if (!html.includes('const media = [')) {
  throw new Error('Android inline smoke: const media block missing');
}
if (!html.includes('$$=(s,r=document)=>')) {
  throw new Error('Android inline smoke: $$ selector helper was corrupted');
}
if (html.includes('<script src="/')) {
  throw new Error('Android inline smoke: external root script remains');
}

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
if (!scripts.length) throw new Error('Android inline smoke: no inline scripts found');

for (let i = 0; i < scripts.length; i += 1) {
  const source = scripts[i][1].replace(/<\\\/script/gi, '</script');
  const label = scripts[i][0].match(/data-ct-inline="([^"]+)"/i)?.[1] || `base-inline-${i + 1}`;
  try {
    new vm.Script(source, { filename: `android-inline-${i + 1}-${label}.js` });
  } catch (error) {
    const preview = source.slice(0, 500).replace(/\s+/g, ' ');
    throw new Error(`Android inline smoke: script ${i + 1}/${scripts.length} (${label}) has invalid JavaScript: ${error.message}\nSource preview: ${preview}`);
  }
}

console.log(`Android HOTFIX 8 inline smoke OK: ${scripts.length} scripts preserved and syntactically valid.`);

import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path = 'apps/android/app/src/main/assets/hotfix5/index.html';
const html = await readFile(path, 'utf8');

if (!html.includes("window.__ctAndroidBundle = 'hotfix12-nav-mobile-import-v95-core-inline-authoritative'")) {
  throw new Error('Android inline smoke: HOTFIX12 nav/mobile-import bundle marker missing');
}
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) {
  throw new Error('Android inline smoke: P0 session reset marker missing');
}
const required = [
  'patch-v067-v095.js',
  'patch-v081-hotfix12-nav-pre.js',
  'patch-v075-hotfix10-selective.js',
  'patch-v076-hotfix10-actions.js',
  'patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js',
  'patch-v079-hotfix11-compat.js',
  'patch-v080-hotfix11-settings-bridge.js',
  'patch-v082-hotfix12-picker-guard.js'
];
for (const name of required) {
  if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android inline smoke: ${name} missing`);
}
const navIndex=html.indexOf('data-ct-inline="patch-v081-hotfix12-nav-pre.js"');
const selectiveIndex=html.indexOf('data-ct-inline="patch-v075-hotfix10-selective.js"');
const pickerIndex=html.indexOf('data-ct-inline="patch-v082-hotfix12-picker-guard.js"');
if(navIndex<0||selectiveIndex<0||pickerIndex<0||navIndex>selectiveIndex||pickerIndex<selectiveIndex)throw new Error('Android inline smoke: HOTFIX12 patch order invalid');
if (!html.includes('__ctHotfix12NavPre') || !html.includes('__ctHotfix12PickerGuard') || !html.includes('__ctHotfix10Selective') || !html.includes('__ctHotfix10Actions') || !html.includes('__ctHotfix10NativeBridge') || !html.includes('__ctHotfix11ImportSync') || !html.includes('__ctHotfix11SettingsBridge')) {
  throw new Error('Android inline smoke: HOTFIX10/HOTFIX11/HOTFIX12 markers missing');
}
if (html.includes('patch-v068-v097.js') || html.includes('__ct97Loaded')) {
  throw new Error('Android inline smoke: unstable v97 overlay is still embedded');
}
if (html.includes('patch-v068-v097-observer-guard.js') || html.includes('__ct97ObserverGuard')) {
  throw new Error('Android inline smoke: obsolete v97 observer guard is still embedded');
}
if (!html.includes('const media = [')) {
  throw new Error('Android inline smoke: const media block missing');
}
if (!html.includes('0.0.97 HOTFIX 12')) {
  throw new Error('Android inline smoke: HOTFIX12 version missing');
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

console.log(`Android HOTFIX12 inline smoke OK: ${scripts.length} scripts preserved, navigation pre-router + persistent dual CSV picker embedded, v97 absent, syntax valid.`);
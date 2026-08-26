import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path = 'apps/android/app/src/main/assets/hotfix5/index.html';
const html = await readFile(path, 'utf8');

if (!html.includes("window.__ctAndroidBundle = 'hotfix13-bingers-semantics-v95-core-inline-authoritative'")) {
  throw new Error('Android inline smoke: HOTFIX13 authoritative bundle marker missing');
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
  'patch-v082-hotfix12-picker-guard.js',
  'patch-v083-hotfix13-bingers-semantics.js'
];
for (const name of required) {
  if (!html.includes(`data-ct-inline="${name}"`)) throw new Error(`Android inline smoke: ${name} missing`);
}
const navIndex=html.indexOf('data-ct-inline="patch-v081-hotfix12-nav-pre.js"');
const selectiveIndex=html.indexOf('data-ct-inline="patch-v075-hotfix10-selective.js"');
const pickerIndex=html.indexOf('data-ct-inline="patch-v082-hotfix12-picker-guard.js"');
const semanticsIndex=html.indexOf('data-ct-inline="patch-v083-hotfix13-bingers-semantics.js"');
if(navIndex<0||selectiveIndex<0||pickerIndex<0||semanticsIndex<0||!(navIndex<selectiveIndex&&selectiveIndex<pickerIndex&&pickerIndex<semanticsIndex)){
  throw new Error('Android inline smoke: HOTFIX13 patch order invalid');
}
const markers=['__ctHotfix12NavPre','__ctHotfix12PickerGuard','__ctHotfix10Selective','__ctHotfix10Actions','__ctHotfix10NativeBridge','__ctHotfix11ImportSync','__ctHotfix11SettingsBridge','__ctHotfix13BingersSemantics'];
for(const marker of markers)if(!html.includes(marker))throw new Error(`Android inline smoke: ${marker} missing`);
if(!html.includes('movie_plays')||!html.includes('episode_plays')||!html.includes('watch_later_total')||!html.includes('not_started_series')){
  throw new Error('Android inline smoke: HOTFIX13 Bingers aggregate semantics missing');
}
if (html.includes('patch-v068-v097.js') || html.includes('__ct97Loaded')) {
  throw new Error('Android inline smoke: unstable v97 overlay is still embedded');
}
if (html.includes('patch-v068-v097-observer-guard.js') || html.includes('__ct97ObserverGuard')) {
  throw new Error('Android inline smoke: obsolete v97 observer guard is still embedded');
}
if (!html.includes('const media = [')) throw new Error('Android inline smoke: const media block missing');
if (!html.includes('0.0.97 HOTFIX 13')) throw new Error('Android inline smoke: HOTFIX13 version missing');
if (html.includes('<script src="/')) throw new Error('Android inline smoke: external root script remains');

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
if (!scripts.length) throw new Error('Android inline smoke: no inline scripts found');
for (let i = 0; i < scripts.length; i += 1) {
  const source = scripts[i][1].replace(/<\\\/script/gi, '</script');
  const label = scripts[i][0].match(/data-ct-inline="([^"]+)"/i)?.[1] || `base-inline-${i + 1}`;
  try { new vm.Script(source, { filename: `android-inline-${i + 1}-${label}.js` }); }
  catch (error) {
    const preview = source.slice(0, 500).replace(/\s+/g, ' ');
    throw new Error(`Android inline smoke: script ${i + 1}/${scripts.length} (${label}) has invalid JavaScript: ${error.message}\nSource preview: ${preview}`);
  }
}

console.log(`Android HOTFIX13 inline smoke OK: ${scripts.length} scripts preserved; Bingers plays/watchlist semantics embedded; v97 absent; syntax valid.`);

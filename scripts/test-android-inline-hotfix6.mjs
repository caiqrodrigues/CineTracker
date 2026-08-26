import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path = 'apps/android/app/src/main/assets/hotfix5/index.html';
const html = await readFile(path, 'utf8');
if (!html.includes("window.__ctAndroidBundle = 'hotfix15-import-transport-v95-core-inline-authoritative'")) throw new Error('Android inline smoke: HOTFIX15 authoritative marker missing');
if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) throw new Error('Android inline smoke: P0 session reset missing');
const required=['patch-v067-v095.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js'];
for(const name of required)if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android inline smoke: ${name} missing`);
if(html.includes('data-ct-inline="patch-v081-hotfix12-nav-pre.js"'))throw new Error('Android inline smoke: obsolete v081 capture nav remains');
if(html.includes('data-ct-inline="patch-v084-hotfix14-real-device.js"'))throw new Error('Android inline smoke: obsolete v084 import layer remains');
const navIndex=html.indexOf('data-ct-inline="patch-v085-hotfix15-import-transport.js"'),selectiveIndex=html.indexOf('data-ct-inline="patch-v075-hotfix10-selective.js"'),pickerIndex=html.indexOf('data-ct-inline="patch-v082-hotfix12-picker-guard.js"'),semanticsIndex=html.indexOf('data-ct-inline="patch-v083-hotfix13-bingers-semantics.js"');
if(navIndex<0||selectiveIndex<0||pickerIndex<0||semanticsIndex<0||!(navIndex<selectiveIndex&&selectiveIndex<pickerIndex&&pickerIndex<semanticsIndex))throw new Error('Android inline smoke: HOTFIX15 patch order invalid');
const markers=['__ctHotfix15ImportTransport','ct15RestoreNativeFiles','ct15EnhanceNativePicker','__ctHotfix12PickerGuard','__ctHotfix10Selective','__ctHotfix10Actions','__ctHotfix10NativeBridge','__ctHotfix11ImportSync','__ctHotfix11SettingsBridge','__ctHotfix13BingersSemantics'];
for(const marker of markers)if(!html.includes(marker))throw new Error(`Android inline smoke: ${marker} missing`);
if(!html.includes('movie_plays')||!html.includes('episode_plays')||!html.includes('watch_later_total')||!html.includes('not_started_series'))throw new Error('Android inline smoke: Bingers aggregate semantics missing');
if(html.includes('patch-v068-v097.js')||html.includes('__ct97Loaded'))throw new Error('Android inline smoke: unstable v97 overlay embedded');
if(!html.includes('const media = ['))throw new Error('Android inline smoke: const media block missing');
if(!html.includes('0.0.97 HOTFIX 15'))throw new Error('Android inline smoke: HOTFIX15 version missing');
if(html.includes('<script src="/'))throw new Error('Android inline smoke: external root script remains');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
if(!scripts.length)throw new Error('Android inline smoke: no inline scripts found');
for(let i=0;i<scripts.length;i++){
 const source=scripts[i][1].replace(/<\\\/script/gi,'</script');
 const label=scripts[i][0].match(/data-ct-inline="([^"]+)"/i)?.[1]||`base-inline-${i+1}`;
 try{new vm.Script(source,{filename:`android-inline-${i+1}-${label}.js`})}catch(error){throw new Error(`Android inline smoke: ${label} invalid: ${error.message}`)}
}
console.log(`Android HOTFIX15 inline smoke OK: ${scripts.length} scripts; explicit native picker; verified navigation; v97 absent.`);
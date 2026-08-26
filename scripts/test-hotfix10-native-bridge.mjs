import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile('dist/patch-v077-hotfix10-native-bridge.js','utf8');
const calls=[];
const context={window:{}};
context.window.ct95Navigate=target=>{calls.push(`legacy:${target}`);return true};
context.window.ct10Navigate=target=>{calls.push(`selective:${target}`);return context.window.ct95Navigate(target)};
vm.createContext(context);
new vm.Script(source,{filename:'patch-v077-hotfix10-native-bridge.js'}).runInContext(context);
const result=context.window.ct95Navigate('settings');
if(result!==true)throw new Error('Native bridge did not return successful navigation.');
if(calls.join('|')!=='selective:settings|legacy:settings')throw new Error(`Native bridge recursion/order invalid: ${calls.join('|')}`);
if(context.window.__ctHotfix10NativeBridge!==true)throw new Error('Native bridge marker missing.');
console.log('HOTFIX10_NATIVE_BRIDGE_OK selective=settings; legacy fallback once; recursion=0');

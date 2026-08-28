import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function loadPatch(name){
  try{return await readFile(`dist/${name}`,'utf8')}catch{}
  const runtime=await readFile('dist/cinetracker-runtime-consolidated.js','utf8');
  const marker=`/* ==== ${name} ==== */`;
  const start=runtime.indexOf(marker);
  if(start<0)throw new Error(`Missing ${name} in individual and consolidated runtime`);
  const bodyStart=start+marker.length;
  const next=runtime.indexOf('\n/* ==== ',bodyStart);
  return runtime.slice(bodyStart,next<0?runtime.length:next).trim();
}

const name='patch-v077-hotfix10-native-bridge.js';
const source=await loadPatch(name);
const calls=[];
const context={window:{}};
context.window.ct95Navigate=target=>{calls.push(`legacy:${target}`);return true};
context.window.ct10Navigate=target=>{calls.push(`selective:${target}`);return context.window.ct95Navigate(target)};
vm.createContext(context);
new vm.Script(source,{filename:name}).runInContext(context);
const result=context.window.ct95Navigate('settings');
if(result!==true)throw new Error('Native bridge did not return successful navigation.');
if(calls.join('|')!=='selective:settings|legacy:settings')throw new Error(`Native bridge recursion/order invalid: ${calls.join('|')}`);
if(context.window.__ctHotfix10NativeBridge!==true)throw new Error('Native bridge marker missing.');
console.log('HOTFIX10_NATIVE_BRIDGE_OK selective=settings; legacy fallback once; recursion=0; source=consolidation-aware');

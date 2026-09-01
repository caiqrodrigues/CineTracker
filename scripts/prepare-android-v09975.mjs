import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root=resolve(process.cwd());
const sourcePath=resolve(root,'scripts/prepare-android-v09974.mjs');
const tempPath=resolve(root,'scripts/.tmp-prepare-android-v09975-core.mjs');
let source=await readFile(sourcePath,'utf8');

// 0.99.7.4 embedded the generated JS through String.replace replacement text.
// Replacement text interprets $$ as $, corrupting the Web runtime (`const $$` -> `const $`)
// and causing a SyntaxError before boot/login. 0.99.7.5 keeps the Web r173 bytes literal
// by using replacement callbacks instead of replacement strings.
source=source
  .replaceAll('Android 0.99.7.4','Android 0.99.7.5')
  .replaceAll('0.99.7.4','0.99.7.5')
  .replaceAll('ANDROID_09974','ANDROID_09975')
  .replaceAll('android-v0.99.7.5-r173-parity','android-v0.99.7.5-r173-parity-bootfix')
  .replace('.replace(/<link rel="stylesheet"[^>]*app-v173\\.css[^>]*>/i,`<style', '.replace(/<link rel="stylesheet"[^>]*app-v173\\.css[^>]*>/i,()=>`<style')
  .replace('.replace(/<script defer src="\\/app-v173\\.js[^>]*><\\/script>/i,`<script', '.replace(/<script defer src="\\/app-v173\\.js[^>]*><\\/script>/i,()=>`<script')
  .replace(".replace('</head>',`<meta", ".replace('</head>',()=>`<meta");

if(!source.includes('()=>`<script data-ct-android="r173-js">${js}</script>`'))
  throw new Error('Android 0.99.7.5: safe JS embedding callback was not installed');

await writeFile(tempPath,source,'utf8');
try{
  await import(pathToFileURL(tempPath).href+`?bootfix=${Date.now()}`);
}finally{
  await rm(tempPath,{force:true});
}

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r173-js">';
const start=html.indexOf(marker);
const end=start<0?-1:html.indexOf('</script>',start+marker.length);
if(start<0||end<0)throw new Error('Android 0.99.7.5: embedded r173 script not found');
const embedded=html.slice(start+marker.length,end);
if(!embedded.includes('const $$=(s,r=document)=>'))throw new Error('Android 0.99.7.5: $$ helper was corrupted during packaging');
if((embedded.match(/const \$=\(s,r=document\)=>/g)||[]).length!==1)throw new Error('Android 0.99.7.5: duplicate $ helper detected');
const checkPath=resolve(root,'scripts/.tmp-android-v09975-embedded.js');
await writeFile(checkPath,embedded,'utf8');
try{
  execFileSync(process.execPath,['--check',checkPath],{stdio:'inherit'});
}finally{
  await rm(checkPath,{force:true});
}
console.log('ANDROID_09975_BOOT_OK web=r173 embedded-js=syntax-valid dollar-helpers=preserved');

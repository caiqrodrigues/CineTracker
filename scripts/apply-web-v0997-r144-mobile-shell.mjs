import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const name='patch-v144-v0997-mobile-shell.js';
const source=resolve(root,'apps/web',name);
const navName='patch-v143-v0997-nav-gate.js';
const must=(ok,msg)=>{if(!ok)throw new Error('r144: '+msg)};

for(const dir of dirs){
  await copyFile(source,resolve(dir,name));
  execFileSync(process.execPath,['--check',resolve(dir,name)],{stdio:'pipe'});
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${name}"></script>`;
  const navTag=`<script src="/${navName}"></script>`;
  html=html.replaceAll(tag,'');
  must(html.includes(navTag),'r143 nav gate anchor missing');
  html=html.replace(navTag,navTag+tag);
  const navAt=html.indexOf(navTag),mobileAt=html.indexOf(tag),appAt=html.indexOf('<div id="app">');
  must(navAt>html.indexOf('<body>'),'r143 nav must remain after body');
  must(mobileAt>navAt&&mobileAt<appAt,'mobile shell must execute after nav gate and before #app');
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R144_APPLIED surface=phone-from-physical-screen viewport=device-width sidebar=off mobile-nav=fixed');
await import('./test-web-v0997-r144-mobile-shell.mjs');

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const allowed=new Set(['.html','.js','.css']);
let changedFiles=0,changedQueries=0;

function bridgeMedia(src){
  return src.replace(/@media\s*\(\s*max-width\s*:\s*(\d+)px\s*\)/g,(full,numRaw)=>{
    const n=Number(numRaw);
    if(!Number.isFinite(n)||n>850)return full;
    changedQueries+=1;
    return `@media(max-width:${n}px), (max-device-width:${n}px)`;
  });
}

for(const dir of dirs){
  for(const name of await readdir(dir)){
    if(!allowed.has(extname(name)))continue;
    const path=resolve(dir,name);
    let src=await readFile(path,'utf8');
    const before=src;
    src=bridgeMedia(src);
    // Garante URL nova nos quatro runtimes que controlam boot/rota/preload.
    src=src.replaceAll('?r145"','?r146"');
    if(src!==before){await writeFile(path,src,'utf8');changedFiles+=1}
  }
}

if(changedQueries<6)throw new Error(`r146: poucos breakpoints convertidos (${changedQueries})`);
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const nav=await readFile(resolve(root,'dist/patch-v143-v0997-nav-gate.js'),'utf8');
const primary=await readFile(resolve(root,'dist/patch-v143-v0997-primary-router.js'),'utf8');
if(!index.includes('@media(max-width:850px), (max-device-width:850px)'))throw new Error('r146: breakpoint compartilhado do index ausente');
if(!nav.includes('@media(max-width:850px), (max-device-width:850px)'))throw new Error('r146: nav gate ainda depende apenas do viewport lógico');
if(!primary.includes('(max-device-width:850px)'))throw new Error('r146: runtime primário não recebeu breakpoint físico');
if(index.includes('ct144-phone')||nav.includes('ct144-phone'))throw new Error('r146: modo mobile rejeitado reapareceu');

console.log(`WEB_R146_APPLIED responsive=same-css viewport+device files=${changedFiles} media=${changedQueries} no-mobile-shell=true`);
await import('./test-web-v0997-r146-device-responsive.mjs');

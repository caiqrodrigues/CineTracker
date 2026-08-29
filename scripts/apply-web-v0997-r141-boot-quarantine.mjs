import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const name='patch-v141-v0997-boot-gate.js';
const source=resolve(root,'apps/web',name);

for(const dir of dirs){
  const gatePath=resolve(dir,name);
  await copyFile(source,gatePath);
  execFileSync(process.execPath,['--check',gatePath],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const old='<script src="/patch-v138-v0997-network-gate.js"></script>';
  const tag=`<script src="/${name}"></script>`;
  html=html.replaceAll(tag,'').replaceAll(old,'');
  if(!html.includes('<body>'))throw new Error('r141: body anchor missing');
  html=html.replace('<body>','<body>'+tag);
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R141_APPLIED boot=single-authority gate=physical-new primary-bypass=rNNN legacy-guards=prearmed');
await import('./test-web-v0997-r141-boot-quarantine.mjs');

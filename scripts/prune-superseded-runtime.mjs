import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const SUPERSEDED=[
  'patch-v111-v0994-global-search.js',
  'patch-v114-v0994-universal-detail.js',
  'patch-v115-v0995-favorites-profile-discover.js',
  'patch-v116-v0996-authoritative.js',
  'patch-v117-v0996-final.js'
];

for(const dir of dirs){
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  let bytes=0,removed=0;
  for(const name of SUPERSEDED){
    const tag=new RegExp(`<script\\s+src=["']/${name.replaceAll('.','\\.')}["']><\\/script>`,'g');
    const hits=(html.match(tag)||[]).length;
    if(hits){
      html=html.replace(tag,''); removed+=hits;
      try{bytes+=(await stat(resolve(dir,name))).size}catch{}
    }
  }
  await writeFile(indexPath,html,'utf8');
  console.log(`RUNTIME_PRUNE ${JSON.stringify({dir:dir.endsWith('/dist')?'dist':dir,removed_tags:removed,removed_execution_bytes:bytes,files:SUPERSEDED})}`);
}

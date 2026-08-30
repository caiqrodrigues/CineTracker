import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const pipeline=await readFile(resolve(root,'scripts/apply-web-v0997-rich-movie-discover.mjs'),'utf8');
const source=await readFile(resolve(root,'apps/web/index.html'),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error('r144-revert: '+msg)};

must(!pipeline.includes('apply-web-v0997-r144-mobile-shell.mjs'),'r144 still linked in pipeline');
must(pipeline.includes("apply-web-v0997-r143-nav-capture.mjs"),'r143 navigation fix must remain');
must(source.includes('@media(max-width:850px)'),'normal responsive Web breakpoint missing');
must(source.includes('.sidebar{display:none}'),'normal responsive sidebar rule missing');
must(source.includes('.mobile-nav{display:grid'),'normal responsive mobile nav rule missing');
for(const file of ['apps/web/patch-v144-v0997-mobile-shell.js','scripts/apply-web-v0997-r144-mobile-shell.mjs']){
  let exists=true;try{await access(resolve(root,file))}catch{exists=false}
  must(!exists,file+' must be removed');
}
console.log('WEB_R144_REVERT_OK web=unified-responsive r143=preserved special-mobile-shell=removed');

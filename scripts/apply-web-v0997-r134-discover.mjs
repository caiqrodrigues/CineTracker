import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v131-v0997-rich-movie-discover.js');
const name='patch-v134a-v0997-discover-final.js';
let js=await readFile(source,'utf8');
js=js.replaceAll('__ct0997MediaDiscover131Loaded','__ct0997MediaDiscover134Loaded').replaceAll('__ct0997MediaDiscover131','__ct0997MediaDiscover134').replaceAll('v131-rich-movie-discover-six-tabs','v134-fresh-discover-six-tabs').replaceAll('ct0997-media-discover131-style','ct0997-media-discover134-style');
if(!js.includes("['new','Novidades']")||!js.includes("['anticipated','Mais Aguardados']"))throw new Error('r134 Discover contract missing');
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await writeFile(resolve(dir,name),js,'utf8');
  const p=resolve(dir,'index.html');let html=await readFile(p,'utf8');const tag=`<script src="/${name}"></script>`;html=html.replaceAll(tag,'');
  html=html.replace('</body>',`${tag}</body>`);await writeFile(p,html,'utf8');
}
console.log('WEB_R134_DISCOVER fresh physical runtime emitted');

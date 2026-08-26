import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const names=['patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js'];
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-v097.js'))throw new Error(`HOTFIX10: v97 overlay must be absent before selective layer: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`HOTFIX10: stable v95 core missing: ${indexPath}`);
  for(const name of names){
    const tag=`<script src="/${name}"></script>`;
    if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
    if(!html.includes(tag))throw new Error(`HOTFIX10: ${name} was not injected: ${indexPath}`);
    await copyFile(resolve(root,'apps/web',name),resolve(target,name));
  }
  await writeFile(indexPath,html,'utf8');
}

console.log('HOTFIX10 selective: stable v95 core + isolated navigation/discover/import/actions emitted.');

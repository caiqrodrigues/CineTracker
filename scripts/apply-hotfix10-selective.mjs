import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const name='patch-v075-hotfix10-selective.js';
const source=resolve(root,'apps/web',name);
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const tag=`<script src="/${name}"></script>`;

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-v097.js'))throw new Error(`HOTFIX10: v97 overlay must be absent before selective layer: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`HOTFIX10: stable v95 core missing: ${indexPath}`);
  if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
  if(!html.includes(tag))throw new Error(`HOTFIX10: selective layer was not injected: ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
  await copyFile(source,resolve(target,name));
}

console.log('HOTFIX10 selective: stable v95 core + isolated navigation/discover/import layer emitted.');

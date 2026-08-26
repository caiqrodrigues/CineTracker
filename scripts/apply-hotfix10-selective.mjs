import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const names=[
  'patch-v081-hotfix12-nav-pre.js',
  'patch-v075-hotfix10-selective.js',
  'patch-v076-hotfix10-actions.js',
  'patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js',
  'patch-v079-hotfix11-compat.js',
  'patch-v080-hotfix11-settings-bridge.js',
  'patch-v082-hotfix12-picker-guard.js'
];
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-v097.js'))throw new Error(`HOTFIX12: v97 overlay must be absent before selective layer: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`HOTFIX12: stable v95 core missing: ${indexPath}`);
  for(const name of names){
    const tag=`<script src="/${name}"></script>`;
    if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
    if(!html.includes(tag))throw new Error(`HOTFIX12: ${name} was not injected: ${indexPath}`);
    await copyFile(resolve(root,'apps/web',name),resolve(target,name));
  }
  const navIndex=html.indexOf('patch-v081-hotfix12-nav-pre.js');
  const selectiveIndex=html.indexOf('patch-v075-hotfix10-selective.js');
  const pickerIndex=html.indexOf('patch-v082-hotfix12-picker-guard.js');
  if(navIndex<0||selectiveIndex<0||pickerIndex<0||navIndex>selectiveIndex||pickerIndex<selectiveIndex)throw new Error(`HOTFIX12: runtime patch order invalid: ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('HOTFIX12 navigation/mobile import: stable v95 core + pre-router + selective layers + persistent dual CSV picker emitted.');
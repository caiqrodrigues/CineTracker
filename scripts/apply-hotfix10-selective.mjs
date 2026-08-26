import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const names=[
  'patch-v084-hotfix14-real-device.js',
  'patch-v075-hotfix10-selective.js',
  'patch-v076-hotfix10-actions.js',
  'patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js',
  'patch-v079-hotfix11-compat.js',
  'patch-v080-hotfix11-settings-bridge.js',
  'patch-v082-hotfix12-picker-guard.js',
  'patch-v083-hotfix13-bingers-semantics.js'
];
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-v097.js'))throw new Error(`HOTFIX14: v97 overlay must be absent before selective layer: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`HOTFIX14: stable v95 core missing: ${indexPath}`);
  html=html.replace(/<script src="\/patch-v081-hotfix12-nav-pre\.js"><\/script>/g,'');
  for(const name of names){
    const tag=`<script src="/${name}"></script>`;
    if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
    if(!html.includes(tag))throw new Error(`HOTFIX14: ${name} was not injected: ${indexPath}`);
    await copyFile(resolve(root,'apps/web',name),resolve(target,name));
  }
  const navIndex=html.indexOf('patch-v084-hotfix14-real-device.js');
  const selectiveIndex=html.indexOf('patch-v075-hotfix10-selective.js');
  const pickerIndex=html.indexOf('patch-v082-hotfix12-picker-guard.js');
  const semanticsIndex=html.indexOf('patch-v083-hotfix13-bingers-semantics.js');
  if(navIndex<0||selectiveIndex<0||pickerIndex<0||semanticsIndex<0||navIndex>selectiveIndex||pickerIndex<selectiveIndex||semanticsIndex<pickerIndex)throw new Error(`HOTFIX14: runtime patch order invalid: ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('HOTFIX14 real-device recovery: unique nav layer + stable v95 + native picker bridge + HOTFIX13 Bingers semantics emitted.');
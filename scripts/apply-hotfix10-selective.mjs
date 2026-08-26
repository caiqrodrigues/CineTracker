import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const profileName='patch-v074-hotfix1-version.js';
const names=[
  'patch-v085-hotfix15-import-transport.js',
  'patch-v075-hotfix10-selective.js',
  'patch-v076-hotfix10-actions.js',
  'patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js',
  'patch-v079-hotfix11-compat.js',
  'patch-v080-hotfix11-settings-bridge.js',
  'patch-v082-hotfix12-picker-guard.js',
  'patch-v083-hotfix13-bingers-semantics.js',
  'patch-v087-hotfix16-import-resilience.js',
  profileName
];
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-v097.js'))throw new Error(`HOTFIX16: v97 overlay must be absent before selective layer: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`HOTFIX16: stable v95 core missing: ${indexPath}`);
  html=html.replace(/<script src="\/patch-v081-hotfix12-nav-pre\.js"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v084-hotfix14-real-device\.js"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v086-hotfix15-import-retry\.js"><\/script>/g,'');
  // HOTFIX18 must be the final runtime layer. Remove the build-web copy before reinjecting it last.
  const profileTag=`<script src="/${profileName}"></script>`;
  html=html.split(profileTag).join('');
  for(const name of names){
    const tag=`<script src="/${name}"></script>`;
    if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
    if(!html.includes(tag))throw new Error(`HOTFIX16: ${name} was not injected: ${indexPath}`);
    await copyFile(resolve(root,'apps/web',name),resolve(target,name));
  }
  const navIndex=html.indexOf('patch-v085-hotfix15-import-transport.js');
  const selectiveIndex=html.indexOf('patch-v075-hotfix10-selective.js');
  const pickerIndex=html.indexOf('patch-v082-hotfix12-picker-guard.js');
  const semanticsIndex=html.indexOf('patch-v083-hotfix13-bingers-semantics.js');
  const resilienceIndex=html.indexOf('patch-v087-hotfix16-import-resilience.js');
  const profileIndex=html.indexOf(profileName);
  if(navIndex<0||selectiveIndex<0||pickerIndex<0||semanticsIndex<0||resilienceIndex<0||profileIndex<0||navIndex>selectiveIndex||pickerIndex<selectiveIndex||semanticsIndex<pickerIndex||resilienceIndex<semanticsIndex||profileIndex<resilienceIndex)throw new Error(`HOTFIX18: runtime patch order invalid: ${indexPath}`);
  if(html.includes('patch-v086-'+'hotfix15-import-retry.js'))throw new Error(`HOTFIX16: legacy retry layer still active: ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('HOTFIX18 governance: HOTFIX16 resilient import stack and HOTFIX17 series-state profile retained; current version layer emitted last.');

import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const profileName='patch-v074-hotfix1-version.js';
const pre98='patch-v088-v098-nav-pre.js';
const ui98='patch-v089-v098.js';
const compat98='patch-v090-v098-compat.js';
const profile99='patch-v091-v099-profile-lru.js';
const names=[
  pre98,
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
  profileName,
  ui98,
  compat98,
  profile99
];
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-v097.js'))throw new Error(`v0.0.99: v97 overlay must be absent before authoritative layer: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`v0.0.99: stable v95 core missing: ${indexPath}`);
  html=html.replace(/<script src="\/patch-v081-hotfix12-nav-pre\.js"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v084-hotfix14-real-device\.js"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v086-hotfix15-import-retry\.js"><\/script>/g,'');
  for(const name of [pre98,profileName,ui98,compat98,profile99]){
    const tag=`<script src="/${name}"></script>`;
    html=html.split(tag).join('');
  }
  for(const name of names){
    const tag=`<script src="/${name}"></script>`;
    if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
    if(!html.includes(tag))throw new Error(`v0.0.99: ${name} was not injected: ${indexPath}`);
    await copyFile(resolve(root,'apps/web',name),resolve(target,name));
  }
  const preIndex=html.indexOf(pre98),navIndex=html.indexOf('patch-v085-hotfix15-import-transport.js'),selectiveIndex=html.indexOf('patch-v075-hotfix10-selective.js'),pickerIndex=html.indexOf('patch-v082-hotfix12-picker-guard.js'),semanticsIndex=html.indexOf('patch-v083-hotfix13-bingers-semantics.js'),resilienceIndex=html.indexOf('patch-v087-hotfix16-import-resilience.js'),profileIndex=html.indexOf(profileName),uiIndex=html.indexOf(ui98),compatIndex=html.indexOf(compat98),profile99Index=html.indexOf(profile99);
  if(preIndex<0||navIndex<0||selectiveIndex<0||pickerIndex<0||semanticsIndex<0||resilienceIndex<0||profileIndex<0||uiIndex<0||compatIndex<0||profile99Index<0||!(preIndex<navIndex&&navIndex<selectiveIndex&&selectiveIndex<pickerIndex&&pickerIndex<semanticsIndex&&semanticsIndex<resilienceIndex&&resilienceIndex<profileIndex&&profileIndex<uiIndex&&uiIndex<compatIndex&&compatIndex<profile99Index))throw new Error(`v0.0.99: runtime patch order invalid: ${indexPath}`);
  if(html.includes('patch-v086-'+'hotfix15-import-retry.js'))throw new Error(`v0.0.99: legacy retry layer still active: ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('CineTracker 0.0.99: v0.0.98 navigation/discover/settings retained; reactive profile LRU layer emitted last.');

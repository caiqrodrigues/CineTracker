import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const profileName='patch-v074-hotfix1-version.js';
const pre98='patch-v088-v098-nav-pre.js';
const ui98='patch-v089-v098.js';
const compat98='patch-v090-v098-compat.js';
const profile99='patch-v091-v099-profile-lru.js';
const release991='patch-v092-v0991.js';
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
  profile99,
  release991
];
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  if(html.includes('patch-v068-'+'v097.js'))throw new Error(`v0.99.1: v97 overlay must remain absent: ${indexPath}`);
  if(!html.includes('patch-v067-v095.js'))throw new Error(`v0.99.1: stable v95 core missing: ${indexPath}`);
  html=html.replace(/<script src="\/patch-v081-hotfix12-nav-pre\.js"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v084-hotfix14-real-device\.js"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v086-hotfix15-import-retry\.js"><\/script>/g,'');
  for(const name of [pre98,profileName,ui98,compat98,profile99,release991]){
    const tag=`<script src="/${name}"></script>`;
    html=html.split(tag).join('');
  }
  for(const name of names){
    const tag=`<script src="/${name}"></script>`;
    if(!html.includes(tag))html=html.replace('</body>',tag+'</body>');
    if(!html.includes(tag))throw new Error(`v0.99.1: ${name} was not injected: ${indexPath}`);
    await copyFile(resolve(root,'apps/web',name),resolve(target,name));
  }
  const order=['patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js',profileName,ui98,compat98,profile99,release991];
  const pos=order.map(x=>html.indexOf(x));
  if(!pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1])))throw new Error(`v0.99.1: runtime patch order invalid: ${indexPath}`);
  if(html.includes('patch-v086-'+'hotfix15-import-retry.js'))throw new Error(`v0.99.1: legacy retry layer still active: ${indexPath}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('CineTracker 0.99.1: stable v95/v98 core retained; v0.99.1 profile/discover/favorites layer emitted last.');

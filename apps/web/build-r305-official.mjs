import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r305.mjs');
const gate=spawnSync(process.execPath,['test-r305.mjs'],{cwd:process.cwd(),stdio:'inherit',env:process.env});
if(gate.status!==0)throw Error(`r305 static gate failed (${gate.status})`);
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.96'||release.revision!=='r305-official-1.0.96')throw Error('r305 release identity mismatch');
console.log('WEB_R305_OFFICIAL_OK production build + static gate green; browser gate runs in verify/CI');

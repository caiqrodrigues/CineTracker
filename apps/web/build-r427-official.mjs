import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r427.mjs');
const gate=spawnSync(process.execPath,['test-r427.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R427_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r427 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.218'||release.revision!=='r427-official-1.0.218')throw new Error('r427 release mismatch');
console.log('WEB_R427_OFFICIAL_OK');

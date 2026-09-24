import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r354.mjs');
const gate=spawnSync(process.execPath,['test-r354.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R354_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r354 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.145'||r.revision!=='r354-official-1.0.145')throw new Error('r354 identity');
console.log('WEB_R354_OFFICIAL_OK');
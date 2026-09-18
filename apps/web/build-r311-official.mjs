import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r311.mjs');
const gate=spawnSync(process.execPath,['test-r311.mjs'],{
 cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R311_SKIP_BUILD:'1'}
});
if(gate.status!==0)throw new Error(`r311 static production gate failed (${gate.status})`);
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.102'||release.revision!=='r311-official-1.0.102')throw new Error('r311 release identity mismatch');
console.log('WEB_R311_OFFICIAL_OK Profile + F1 + Discover latest-video gate green');

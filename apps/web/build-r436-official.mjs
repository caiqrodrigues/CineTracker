import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r436.mjs');
const gate=spawnSync(process.execPath,['test-r436.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R436_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r436 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.227'||release.revision!=='r436-official-1.0.227')throw new Error('r436 release mismatch');
console.log('WEB_R436_OFFICIAL_OK');

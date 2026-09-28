import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r391.mjs');
const g=spawnSync(process.execPath,['test-r391.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R391_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r391 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.182'||r.revision!=='r391-official-1.0.182')throw new Error('r391 identity');
console.log('WEB_R391_OFFICIAL_OK');
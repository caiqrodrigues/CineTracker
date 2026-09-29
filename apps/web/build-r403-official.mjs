import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r403.mjs');
const run=(file,env={})=>{const x=spawnSync(process.execPath,[file],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,...env}});if(x.status!==0)throw new Error(file+' failed')};
run('test-r403.mjs',{CT_R403_SKIP_BUILD:'1'});run('test-r403-browser.mjs',{CT_R403_SKIP_BUILD:'1'});
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.194'||r.revision!=='r403-official-1.0.194')throw new Error('r403 identity');
console.log('WEB_R403_OFFICIAL_OK');
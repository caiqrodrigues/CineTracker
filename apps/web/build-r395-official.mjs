import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r395.mjs');
const run=(file,env={})=>{const x=spawnSync(process.execPath,[file],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,...env}});if(x.status!==0)throw new Error(file+' failed')};
run('test-r395.mjs',{CT_R395_SKIP_BUILD:'1'});
run('test-r394-browser.mjs',{CT_R394_SKIP_BUILD:'1'});
run('test-r395-browser.mjs',{CT_R395_SKIP_BUILD:'1'});
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.186'||r.revision!=='r395-official-1.0.186')throw new Error('r395 identity');
console.log('WEB_R395_OFFICIAL_OK');

import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r404.mjs');
const run=(file,env={})=>{const x=spawnSync(process.execPath,[file],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,...env}});if(x.status!==0)throw new Error(file+' failed')};
run('test-r404.mjs',{CT_R404_SKIP_BUILD:'1'});run('test-r404-browser.mjs',{CT_R404_SKIP_BUILD:'1'});
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.195'||r.revision!=='r404-official-1.0.195')throw new Error('r404 identity');
console.log('WEB_R404_OFFICIAL_OK');

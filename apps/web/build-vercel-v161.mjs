import {execFileSync} from 'node:child_process';
import {cp,mkdir,readFile,rm} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const webRoot=dirname(fileURLToPath(import.meta.url));
const repoRoot=resolve(webRoot,'../..');
const rootDist=resolve(repoRoot,'dist');
const webDist=resolve(webRoot,'dist');
const node=process.execPath;

const scripts=[
  'scripts/build-web-v158-adjustments-v2.mjs',
  'scripts/build-web-v159-sports-watch.mjs',
  'scripts/build-web-v160-sports-recent-home-history.mjs',
  'scripts/build-web-v161-release-guard.mjs',
  'scripts/test-web-v161-release-guard.mjs'
];

for(const script of scripts){
  execFileSync(node,[resolve(repoRoot,script)],{cwd:repoRoot,stdio:'inherit'});
}

const [rootHtml,rootRelease]=await Promise.all([
  readFile(resolve(rootDist,'index.html'),'utf8'),
  readFile(resolve(rootDist,'release.json'),'utf8').then(JSON.parse)
]);
if(!rootHtml.includes('/app-v161.js?ct=r161-release-guard'))throw new Error('root r161 artifact missing before Vercel copy');
if(rootRelease?.revision!=='r161-release-guard')throw new Error('root release.json is not r161');

await rm(webDist,{recursive:true,force:true});
await mkdir(webDist,{recursive:true});
await cp(rootDist,webDist,{recursive:true,force:true});

const [html,js,release]=await Promise.all([
  readFile(resolve(webDist,'index.html'),'utf8'),
  readFile(resolve(webDist,'app-v161.js'),'utf8'),
  readFile(resolve(webDist,'release.json'),'utf8').then(JSON.parse)
]);
if((html.match(/<script\b/g)||[]).length!==1)throw new Error('Vercel output must contain exactly one app script');
if(!html.includes('/app-v161.js?ct=r161-release-guard'))throw new Error('Vercel output is not r161');
if(!js.includes("const REVISION='r161-release-guard';"))throw new Error('Vercel JS revision is not r161');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime'"))throw new Error('Vercel output lost single runtime authority');
if(release?.revision!=='r161-release-guard')throw new Error('Vercel release.json is not r161');

console.log('VERCEL_WEB_R161_READY root=apps/web output=apps/web/dist revision=r161-release-guard');

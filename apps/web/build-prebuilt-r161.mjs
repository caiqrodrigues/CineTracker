import {cp,mkdir,readFile,rm} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const webRoot=dirname(fileURLToPath(import.meta.url));
const src=resolve(webRoot,'prebuilt-r161');
const dist=resolve(webRoot,'dist');

const required=['app-v161.js','app-v161.css','index.html','service-worker.js','release.json','favicon.svg'];
for(const name of required)await readFile(resolve(src,name));

const [srcHtml,srcJs,srcRelease]=await Promise.all([
  readFile(resolve(src,'index.html'),'utf8'),
  readFile(resolve(src,'app-v161.js'),'utf8'),
  readFile(resolve(src,'release.json'),'utf8').then(JSON.parse)
]);
if((srcHtml.match(/<script\b/g)||[]).length!==1)throw new Error('prebuilt r161 must contain exactly one application script');
if(!srcHtml.includes('/app-v161.js?ct=r161-release-guard'))throw new Error('prebuilt index is not r161');
if(!srcJs.includes("const REVISION='r161-release-guard';"))throw new Error('prebuilt JS is not r161');
if(!srcJs.includes("window.__ctRuntimeAuthority='single-clean-runtime'"))throw new Error('prebuilt single runtime authority missing');
if(!srcJs.includes("b.dataset.sportsTab='yesterday'"))throw new Error('prebuilt Yesterday sports missing');
if(!srcJs.includes('watchedAt161'))throw new Error('prebuilt Home history order missing');
if(srcRelease?.revision!=='r161-release-guard')throw new Error('prebuilt release.json is not r161');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(src,dist,{recursive:true,force:true});

const [html,js,release]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v161.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8').then(JSON.parse)
]);
if((html.match(/<script\b/g)||[]).length!==1)throw new Error('Vercel dist must contain exactly one application script');
if(!html.includes('/app-v161.js?ct=r161-release-guard'))throw new Error('Vercel dist index is not r161');
if(!js.includes("const REVISION='r161-release-guard';"))throw new Error('Vercel dist JS is not r161');
if(release?.revision!=='r161-release-guard')throw new Error('Vercel dist release.json is not r161');

console.log('VERCEL_WEB_R161_PREBUILT_OK source=apps/web/prebuilt-r161 output=apps/web/dist root-dependencies=0');

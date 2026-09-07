import fs from 'node:fs';
const checks=[
 ['apps/web/dist/app-v208.js',"const REVISION='r208-official-1.0.4'",'revision'],
 ['apps/web/dist/app-v208.js',"window.__ctR208='v104-authoritative-internal-runtime'",'internal runtime'],
 ['apps/web/dist/app-v208.js','cinetracker_rewatch_counts_v104','rewatch counts'],
 ['apps/web/dist/app-v208.js','ct104DecorateHistory','history rewatch'],
 ['apps/web/dist/app-v208.js','cinetracker_recommendation_memory_v101','recommendation memory'],
 ['apps/web/dist/app-v208.js','cinetracker_recommendation_record_v101','recommendation record'],
 ['apps/web/dist/app-v208.js','cinetracker-f1-v1','F1 edge'],
 ['apps/web/dist/app-v208.js','ct104EnsureF1','F1 hub'],
 ['apps/web/dist/index.html','app-v208.js','index asset'],
 ['apps/web/dist/service-worker.js','ct-web-1.0.4-r208','service worker identity'],
 ['apps/web/package.json','"version": "1.0.4"','package version']
];
for(const [file,needle,label] of checks){if(!fs.existsSync(file))throw new Error(`WEB104 missing file ${file}`);const text=fs.readFileSync(file,'utf8');if(!text.includes(needle))throw new Error(`WEB104 ${label} missing: ${needle}`);console.log('WEB104_OK',label)}
const js=fs.readFileSync('apps/web/dist/app-v208.js','utf8');
const core=js.indexOf("window.__ctR208='v104-authoritative-internal-runtime'"),boot=js.lastIndexOf('\nboot();');
if(!(core>0&&boot>core))throw new Error('WEB104 runtime is not inside main scope before boot');
for(const bad of ["window.__ctR206='f1-hub-rewatch-functional-sports-cleanup'","window.__ctR207='v103-rewatch-navigation-recommendations-f1'"])if(js.includes(bad))throw new Error('WEB104 rejected external overlay leaked: '+bad);
console.log('WEB_1_0_4_ASSETS_VALIDATED internal-before-boot no-r206-r207-overlay');

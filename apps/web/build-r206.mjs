import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath,['apps/web/build-r205.mjs'],{stdio:'inherit'});
const dist='apps/web/dist';
let html=fs.readFileSync(`${dist}/index.html`,'utf8');
let js=fs.readFileSync(`${dist}/app-v205.js`,'utf8');
let sw=fs.readFileSync(`${dist}/service-worker.js`,'utf8');
const patch=fs.readFileSync('apps/web/runtime-r206-f1-rewatch-fix.js','utf8');
const must=[
  "window.__ctR206='f1-hub-rewatch-functional-sports-cleanup'",
  "cinetracker_mark_watch_v0994",
  "[data-ct171-rewatch-media],[data-ct171-rewatch-episode],[data-rewatch-episode]",
  "https://api.jolpi.ca/ergast/f1",
  "current/driverstandings",
  "current/constructorstandings",
  "current/last/results",
  "current/last/qualifying",
  "remove-status-statistics-summary-card-runtime"
];
for(const x of must) if(!patch.includes(x)) throw new Error(`r206 patch missing: ${x}`);
js += `\n;${patch}\n;window.__ctOfficialVersion='1.0.2';window.__ctOfficialRevision='r206-official-1.0.2';window.__ctRelease102='functional-rewatch-plus-f1-sports-hub-web-android';\n`;
html=html.replaceAll('app-v205.js','app-v206.js').replaceAll('r205-official-1.0.1','r206-official-1.0.2');
sw=sw.replaceAll('app-v205.js','app-v206.js').replaceAll('r205-official-1.0.1','r206-official-1.0.2');
for(const x of must) if(!js.includes(x)) throw new Error(`final Web runtime missing: ${x}`);
if(!html.includes('app-v206.js')) throw new Error('Web HTML does not load app-v206.js');
if(!sw.includes('app-v206.js')) throw new Error('Web service worker does not cache app-v206.js');
fs.writeFileSync(`${dist}/app-v206.js`,js);
fs.writeFileSync(`${dist}/index.html`,html);
fs.writeFileSync(`${dist}/service-worker.js`,sw);
const rel={version:'1.0.2',revision:'r206-official-1.0.2',scope:'functional-rewatch-plus-f1-sports-hub-web-android',generatedAt:new Date().toISOString()};
fs.writeFileSync(`${dist}/release.json`,JSON.stringify(rel,null,2));
console.log('Web 1.0.2 r206 built and final assets asserted.');
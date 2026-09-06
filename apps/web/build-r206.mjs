import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath,['apps/web/build-r205.mjs'],{stdio:'inherit'});
const dist='apps/web/dist';
let html=fs.readFileSync(`${dist}/index.html`,'utf8');
let js=fs.readFileSync(`${dist}/app-v205.js`,'utf8');
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
html=html.replace(/app-v205\.js/g,'app-v206.js').replace(/content="1\.0\.1"/g,'content="1.0.2"').replace(/r205-official-1\.0\.1/g,'r206-official-1.0.2');
for(const x of must) if(!js.includes(x)) throw new Error(`final Web runtime missing: ${x}`);
if(!js.includes('watchlist-swap-uses-active-ct186-selected-pool')) throw new Error('Watchlist pool regression');
fs.writeFileSync(`${dist}/app-v206.js`,js);
fs.writeFileSync(`${dist}/index.html`,html);
const rel={version:'1.0.2',revision:'r206-official-1.0.2',scope:'functional-rewatch-plus-f1-sports-hub-web-android',generatedAt:new Date().toISOString()};
fs.writeFileSync(`${dist}/release.json`,JSON.stringify(rel,null,2));
console.log('Web 1.0.2 r206 built and functionally asserted.');
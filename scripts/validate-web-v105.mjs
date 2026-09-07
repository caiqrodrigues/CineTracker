import fs from 'node:fs';
const d='apps/web/dist';const html=fs.readFileSync(`${d}/index.html`,'utf8'),js=fs.readFileSync(`${d}/app-v209.js`,'utf8'),sw=fs.readFileSync(`${d}/service-worker.js`,'utf8'),rel=JSON.parse(fs.readFileSync(`${d}/release.json`,'utf8'));
for(const x of ['app-v209.js','app-v209.css'])if(!html.includes(x))throw new Error('index missing '+x);
for(const x of ["window.__ctR209='v105-video-corrections'",'data-ct105-rewatch-movie','data-ct105-history-rewatch','ct104PaintF1=async function','cinetracker-f1-v1'])if(!js.includes(x))throw new Error('web bundle missing '+x);
if(!sw.includes("ct-web-1.0.5-r209"))throw new Error('service worker version missing');
if(rel.version!=='1.0.5'||rel.revision!=='r209-official-1.0.5')throw new Error('release identity wrong');
console.log('WEB_1_0_5_VALIDATED');

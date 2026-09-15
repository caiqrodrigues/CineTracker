import {readFile} from 'node:fs/promises';
await import('./build-r298-official.mjs');
const [js,rt,rel]=await Promise.all([readFile('dist/app-v298.js','utf8'),readFile('runtime-r298-stadium-foryou-completion.js','utf8'),readFile('dist/release.json','utf8')]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R298_STATIC missing '+x)};
for(const x of["window.__ctR298='stadium-real-controls+exact-foryou-live-pipeline'","window.__ctR298Sports='ct255-real-watch-button+tv-or-stadium+watched-badge'","window.__ctR298Profile='stadium-stat-inside-sports-assisted-only'","window.__ctR298ForYou='1-daily+3-watchlist+3-new+bounded-no-spinner'",'window.addEventListener(\'click\'',"[data-ct255-watch]",'data-ct298-choice="screen"','data-ct298-choice="stadium"','cinetracker_sports_watch_set_v296','cinetracker_sports_stadium_summary_v296','sportsPanel(root)','selected.every(Boolean)','Não foi possível montar o Pra Você agora.'])must(rt,x);
if(rt.includes('setInterval('))throw new Error('R298_STATIC perpetual interval forbidden');
const r=JSON.parse(rel);if(r.version!=='1.0.89'||r.revision!=='r298-official-1.0.89'||r.android!=='1.0.20/10062')throw new Error('R298_STATIC identity');
must(js,"window.__ctR297='r288-live-owner-hotfix-full-bundle'");
console.log('R298_STATIC_OK real sports control + semantic Sports profile placement + bounded exact Pra Você');
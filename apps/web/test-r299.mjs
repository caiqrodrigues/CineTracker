import{readFile}from'node:fs/promises';
const [runtime,build,official,pkg]=await Promise.all(['runtime-r299-profile-sports-history.js','build-r299.mjs','build-r299-official.mjs','package.json'].map(f=>readFile(f,'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw Error('R299_STATIC missing '+x)};
for(const x of["window.__ctR299='profile-sports-history-clickable+stadium-presence-only'","window.__ctR299Profile='eventos-assistidos+jogos-no-estadio-clickable-history'","window.__ctR299Sports='tv-or-stadium-no-stadium-name'",'data-ct299-history','data-ct299-choice="stadium"','cinetracker_sports_watch_history_v296','p_stadium_name:null','Jogos no Estádio','Eventos assistidos'])must(runtime,x);
if(runtime.includes('Nome do Estádio')||runtime.includes('data-ct299-stadium')||runtime.includes('stadium_name?'))throw Error('R299_STATIC stadium name input must not exist');
for(const x of["version:'1.0.90'","revision:'r299-official-1.0.90'","sports_stadium_name_capture:false","profile_sports_history:'eventos-assistidos+jogos-no-estadio-clickable'",'app-v299.js','app-v299.css'])must(build,x);
for(const x of["window.__ctWebBuild='1.0.90';window.__ctOfficialVersion='1.0.90';","const REVISION='r299-official-1.0.90';",'input[data-ct298-stadium]{display:none!important}'])must(official+build,x);
must(pkg,'"version": "1.0.90"');must(pkg,'build-r299-official.mjs');
console.log('R299_STATIC_OK clickable profile sports history + stadium presence only + no stadium name input');

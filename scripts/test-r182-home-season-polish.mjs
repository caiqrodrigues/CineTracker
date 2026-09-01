import {readFile} from 'node:fs/promises';
const [js,css,build]=await Promise.all([
  readFile('apps/web/runtime-r182.js','utf8'),
  readFile('apps/web/r182.css','utf8'),
  readFile('apps/web/build-r182.mjs','utf8')
]);
for(const m of [
  "window.__ctR182='home-clean-status-season-compact-control'",
  "window.__ct182Home='remove-noninteractive-circle-badge-keep-row-navigation'",
  "window.__ct182Season='compact-inline-season-toggle-no-giant-button'",
  "document.querySelectorAll('[data-home] .media-row > .badge')",
  'ct181SeasonToggleHtml=ct182SeasonToggleHtml',
  "card?'✓ Vista':'✓ Vista · desfazer'",
  "card?'○ Marcar vista':'○ Marcar temporada vista'",
  'data-ct181-season-toggle'
])if(!js.includes(m))throw new Error('r182 runtime missing '+m);
for(const m of [
  '[data-home] .media-row>.badge{display:none!important}',
  '.ct169-season-card .ct181-season-toggle.ct182-season-toggle',
  'width:auto!important',
  'border-radius:999px!important',
  '.ct182-season-progress'
])if(!css.includes(m))throw new Error('r182 css missing '+m);
for(const m of ["await import('./build-r181.mjs')","r182-home-season-polish","app-v182.js","app-v182.css"])if(!build.includes(m))throw new Error('r182 build missing '+m);
if(js.includes("rpc('cinetracker_mark_episode_v0994'")||js.includes("rpc('cinetracker_unmark_episode_v1'"))throw new Error('r182 must not fork r181 season persistence authority');
console.log('R182_OK Home circle removed; season control compact; r181 behavior preserved');

import {readFile} from 'node:fs/promises';
const [shared,web,css,build]=await Promise.all([
  readFile('apps/web/runtime-r185c-shared.js','utf8'),
  readFile('apps/web/runtime-r185c-web.js','utf8'),
  readFile('apps/web/r185c-polish-shared.css','utf8'),
  readFile('apps/web/build-r185c.mjs','utf8')
]);
for(const m of [
  "window.__ctR185CShared='home-entry-top-anchor'",
  "reset-only-when-entering-home",'ct185CResetHomeTop',
  "next==='home'&&ct185CLastRoute!=='home'","window.scrollTo({top:0,left:0,behavior:'auto'})"
])if(!shared.includes(m))throw new Error('r185C shared missing '+m);
for(const m of [
  "window.__ctR185CWeb='profile-discover-hot-route-reuse'",
  "full-profile-idle-prefetch-short-fresh-reuse","intent-adjacent-prefetch-hot-render",
  "same-rpcs-renderers-business-rules","no-layout-reorder-no-content-change",
  "rpc('cinetracker_profile_payload_v0997'",'ct185CWarmProfileFull','ct185CShowHotProfile',
  'ct185CWarmDiscoverTab','ct185CShowHotDiscover','ct185CScheduleDiscoverNeighbors',
  "document.addEventListener('pointerover'","document.addEventListener('touchstart'",
  "window.addEventListener('cinetracker:data-changed'"
])if(!web.includes(m))throw new Error('r185C web missing '+m);
for(const m of ["await import('./build-r185b.mjs')","const REVISION='r185c-profile-discover-polish';","app-v185c.js","runtime-r185c-shared.js","runtime-r185c-web.js","r185c-polish-shared.css"])if(!build.includes(m))throw new Error('r185C build missing '+m);
for(const m of ['--ct185c-radius-panel','border-radius:var(--ct185c-radius-panel)','background-clip:padding-box'])if(!css.includes(m))throw new Error('r185C polish missing '+m);
const forbiddenProps=['color:','background:','padding:','margin:','display:','position:','width:','height:','gap:','grid-','font-','transform:','box-shadow:'];
for(const p of forbiddenProps)if(css.includes(p))throw new Error('r185C polish must not alter layout/palette: '+p);
if(/::before|::after/.test(css))throw new Error('r185C polish must not insert pseudo-elements');
console.log('R185C_OK profile=hot discover=hot home=top polish=geometry-only no-layout-no-color historical=true');

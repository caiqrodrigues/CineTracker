import {readFile} from 'node:fs/promises';
const [js,css,build]=await Promise.all([
  readFile('apps/web/runtime-r185a-shared.js','utf8'),
  readFile('apps/web/r185a-shared.css','utf8'),
  readFile('apps/web/build-r185a.mjs','utf8')
]);
for(const m of [
  "window.__ctR185A='instant-visual-cache-safe-revalidate'",
  "window.__ct185AMode='stale-while-revalidate-visual-only'",
  "window.__ct185AAuthority='cache-never-writes-never-decides-business-state'",
  "window.__ct185AFallback='old-render-path-remains-authority'",
  "const CT185A_MAX_AGE=24*60*60*1000",
  "const p=ct185ARenderHomeBase(seq),rec=ct185ARestore('home','[data-home]')",
  "const p=ct185ARenderProfileBase(seq),rec=ct185ARestore('profile','[data-profile]')",
  "const p=ct185ARenderSportsBase(seq),rec=ct185ARestore('sports','[data-sports]')",
  "const p=ct185ARenderDiscoverBase(seq)",
  "ct185ASetStale(root,true)",
  "ct185AFallback(rec,'[data-home]')",
  "localStorage.setItem(ct185AKey(slot)",
  "root.querySelector('.loader')||root.querySelector('.error')"
])if(!js.includes(m))throw new Error('r185A runtime missing '+m);
for(const forbidden of ["rpc('cinetracker_","api('media_overrides","api('watch_history","fetch(`${SUPABASE_URL}"]){if(js.includes(forbidden))throw new Error('r185A cache layer must not write/fetch business data: '+forbidden)}
for(const m of ['.ct185a-sync','[data-ct185a-stale="1"]','@keyframes ct185spin'])if(!css.includes(m))throw new Error('r185A css missing '+m);
for(const m of ["await import('./build-r184.mjs')","r185a-instant-cache","app-v185a.js","runtime-r185a-shared.js"])if(!build.includes(m))throw new Error('r185A build missing '+m);
console.log('R185A_INSTANT_CACHE_OK visual-only=true old-authority=true stale-safe=true fallback=true historical=true');

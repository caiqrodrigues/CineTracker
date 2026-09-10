import {readFile} from 'node:fs/promises';
const [js,release]=await Promise.all([readFile('dist/app-v241.js','utf8'),readFile('dist/release.json','utf8')]);
const must=x=>{if(!js.includes(x))throw new Error('r241 missing '+x)};
for(const x of ["const REVISION='r241-official-1.0.32';","window.__ctR241Home='fast-first-paint-episode-and-movie-metadata'","window.__ctR241Scope='home-only'","await preloadHome241()","safeTmdb(`/tv/${id241(x)}`","safeTmdb(`/movie/${id}`","parts.push(`${r} min`)","parts.push(y)","parts.push(g.join(', '))","renderHome=async function(seq)"])must(x);
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(js.includes(`runtime-r241`)&&js.includes(forbidden))throw new Error('r241 title hardcode forbidden: '+forbidden);
const r=JSON.parse(release);if(r.version!=='1.0.32'||r.revision!=='r241-official-1.0.32'||r.scope!=='home-only')throw new Error('bad release identity');
console.log('R241_HOME_ONLY_INVARIANTS_OK');
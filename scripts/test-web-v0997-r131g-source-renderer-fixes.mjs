import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

const homePath='dist/patch-v099-v0994-web.js';
const profilePath='dist/patch-v126-v0997-video3124-recovery.js';
const discoverOldPath='dist/patch-v124-v0997-video-smoke-authority.js';
const discoverNewPath='dist/patch-v131-v0997-rich-movie-discover.js';
const html=await readFile('dist/index.html','utf8');
const [home,profile,discoverOld,discoverNew]=await Promise.all([
  readFile(homePath,'utf8'),readFile(profilePath,'utf8'),readFile(discoverOldPath,'utf8'),readFile(discoverNewPath,'utf8')
]);

for(const p of [homePath,profilePath,discoverOldPath,discoverNewPath])execFileSync(process.execPath,['--check',p],{stdio:'pipe'});

if(!home.includes("total=Math.max(rel,seen,Number(x.total_episodes||0))"))throw new Error('r131g Home must use canonical total as denominator');
if(!home.includes("missing>0?'Faltam '+missing:'Em dia'"))throw new Error('r131g Home must render Em dia when no released episodes are missing');
if(home.includes("${seen}/${rel||'?'} · Faltam ${missing}"))throw new Error('r131g legacy released-only denominator survived');

for(const needle of ["applyTenMore('Séries')","applyTenMore('Filmes')","applyTenMore('Séries Favoritas')","applyTenMore('Filmes Favoritos')",'applyTenActors()','c.hidden=i>=10','cards.length-10']){
  if(!profile.includes(needle))throw new Error(`r131g Profile missing ${needle}`);
}
if(profile.includes('applyFourMore(')||profile.includes('cards.length-4'))throw new Error('r131g four-card Profile override survived');

if(!discoverOld.includes("function ensureDiscover(){if(window.__ct0997MediaDiscover131Loaded)return;if(route()!=='discover')return;"))throw new Error('r131g v124 must yield Discover to r131');
if(!discoverNew.includes("['new','Novidades']")||!discoverNew.includes("['anticipated','Mais Aguardados']"))throw new Error('r131g r131 Discover tabs missing Novidades/Mais Aguardados');
if(!html.includes('patch-v131d-v0997-real-data-path.js'))throw new Error('r131g Calendar provider r131d missing from final HTML');
if(/patch-v132-v0997|patch-v133-v0997/.test(html))throw new Error('r131g must keep r132/r133 disabled');

console.log('WEB_R131G_OK home=canonical-total+released-missing profile=10-more discover=r131+calendar');

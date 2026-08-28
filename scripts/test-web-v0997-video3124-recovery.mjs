import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source=await readFile('apps/web/patch-v126-v0997-video3124-recovery.js','utf8');
const runtime=await readFile('dist/patch-v126-v0997-video3124-recovery.js','utf8');
const legacy43=await readFile('dist/patch-v043.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','video3124 recovery must not bump version');
assert.ok(source.includes('v126-video3124-surgical-recovery'),'source marker missing');
for(const token of [
  'meaningfulHome',
  'dashboardToHome',
  'cleanupNav',
  'removeStandaloneHistory',
  "applyFourMore('Séries')",
  "applyFourMore('Filmes')",
  "applyFourMore('Séries Favoritas')",
  "applyFourMore('Filmes Favoritos')",
  "applyFourMore('Atores Favoritos')",
  '.ct120-actors,.ct118-actors',
  '.ct120-actor,.ct118-actor',
  'c.hidden=i>=4',
  'cards.length<=4',
  'cards.length-4',
  '<b>Ver mais</b>',
  'row.dataset.ct126Four===signature',
  "row.classList.toggle('ct126-expanded',open)",
  '#ct43-profile{display:none!important}',
  '[data-ct120-slot="series-favorites"] .ct120-card:nth-child(n+5)',
  '[data-ct120-slot="movie-favorites"] .ct120-card:nth-child(n+5)',
  '[data-ct120-slot="actors"] .ct120-actor:nth-child(n+5)',
  "h==='da sua watchlist'",
  'knownContext',
  'isKnownCard',
  '+ Watchlist',
  '7*60*1000',
  'ct126-profile-grid'
]) assert.ok(runtime.includes(token),`emitted video3124 recovery missing ${token}`);
assert.ok(!runtime.includes('applyTenMore'),'Profile must not keep the old 10-card limit');
assert.ok(!runtime.includes('i>=10'),'Profile emitted runtime must not keep 10 hidden cards');
assert.ok(!runtime.includes('new MutationObserver'),'video3124 recovery must not add another observer');
assert.ok(!legacy43.includes("function run(){if(!currentUser)return;insertProfileBlocks();"),'legacy v043 must not recreate Tempo de Tela/Histórico');
assert.ok(legacy43.includes("function run(){if(!currentUser)return;document.getElementById('ct43-profile')?.remove();hydrateAll();"),'legacy v043 must be neutralized at its run hook');
const a=html.indexOf('<script src="/patch-v125-v0997-restore-foryou-contract.js"></script>');
const b=html.indexOf('<script src="/patch-v126-v0997-video3124-recovery.js"></script>');
assert.ok(a>=0&&b>a,'video3124 recovery must load after v125');
assert.equal((html.match(/patch-v126-v0997-video3124-recovery\.js/g)||[]).length,1,'video3124 recovery duplicated');
console.log('WEB_0997_VIDEO3124_RECOVERY_OK profile=4+more-idempotent legacy-profile=disabled-no-flicker');

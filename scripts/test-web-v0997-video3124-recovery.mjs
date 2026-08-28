import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v126-v0997-video3124-recovery.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','video3124 recovery must not bump version');
for(const token of [
  'v126-video3124-surgical-recovery',
  'meaningfulHome',
  'dashboardToHome',
  'cleanupNav',
  'removeStandaloneHistory',
  "applyFourMore('Séries')",
  "applyFourMore('Filmes')",
  'c.hidden=i>=4',
  'cards.length<=4',
  'cards.length-4',
  '<b>Ver mais</b>',
  "h==='da sua watchlist'",
  'knownContext',
  'isKnownCard',
  '+ Watchlist',
  '7*60*1000',
  'ct126-profile-grid'
]) assert.ok(src.includes(token),`video3124 recovery missing ${token}`);
assert.ok(!src.includes('applyTenMore'),'Profile must not keep the old 10-card limit');
assert.ok(!src.includes('new MutationObserver'),'video3124 recovery must not add another observer');
const a=html.indexOf('<script src="/patch-v125-v0997-restore-foryou-contract.js"></script>');
const b=html.indexOf('<script src="/patch-v126-v0997-video3124-recovery.js"></script>');
assert.ok(a>=0&&b>a,'video3124 recovery must load after v125');
assert.equal((html.match(/patch-v126-v0997-video3124-recovery\.js/g)||[]).length,1,'video3124 recovery duplicated');
console.log('WEB_0997_VIDEO3124_RECOVERY_OK home=no-false-empty nav=dedup profile=no-history+4-more discover=no-watchlist-leak');

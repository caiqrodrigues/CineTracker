import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const patch=await readFile('apps/web/patch-v111-v0994-global-search.js','utf8');
const apply=await readFile('scripts/apply-web-v0994-global-search.mjs','utf8');
const index=await readFile('dist/index.html','utf8');

assert.match(patch,/v111-home-discover-global-search/,'v111 marker missing');
assert.match(patch,/\/search\/multi/,'TMDB multi search missing');
assert.match(patch,/\['movie','tv','person'\]/,'search must include movie, tv and person');
assert.match(patch,/Buscar filmes, séries e atores/,'search placeholder missing');
assert.match(patch,/\['home','discover'\]\.includes\(r\)/,'search must be restricted to Home and Discover');
assert.match(patch,/\/person\/\$\{id\}\/combined_credits/,'person credits lookup missing');
assert.match(patch,/__ct0994OpenDetail/,'media results must open canonical detail');
assert.match(patch,/ct0994_catalog_fix_v111/,'catalog correction cache marker missing');
assert.match(patch,/ct0994_home_preload_v1/,'stale Home cache must be invalidated after catalog fix');
assert.match(apply,/patch-v110-v0994-episode-check\.js/,'v111 must load after v110');
const i110=index.indexOf('/patch-v110-v0994-episode-check.js');
const i111=index.indexOf('/patch-v111-v0994-global-search.js');
assert.ok(i110>=0&&i111>i110,'v111 must be emitted after v110');
assert.equal((index.match(/patch-v111-v0994-global-search\.js/g)||[]).length,1,'v111 must be emitted once');

console.log('WEB_0994_GLOBAL_SEARCH_OK routes=home+discover types=movie+tv+person detail=canonical person=credits cache=invalidated');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('dist/index.html','utf8');
const layer=await readFile('dist/patch-v115-v0995-favorites-profile-discover.js','utf8');
const legacy=await readFile('dist/patch-v092-v0991.js','utf8');
const detail=await readFile('dist/patch-v114-v0994-universal-detail.js','utf8');
const pkg=await readFile('package.json','utf8');
const sw=await readFile('apps/web/service-worker.js','utf8');
const migration=await readFile('supabase/migrations/20260828022500_v0995_favorite_actors.sql','utf8');

assert.match(pkg,/"version": "0\.99\.5"/,'Web release version must be 0.99.5');
assert.match(sw,/ct-web-0\.99\.5/,'service worker cache must invalidate to 0.99.5');
assert.equal((html.match(/patch-v115-v0995-favorites-profile-discover\.js/g)||[]).length,1,'v115 must load exactly once');
assert.ok(html.indexOf('patch-v115-v0995-favorites-profile-discover.js')>html.indexOf('patch-v114-v0994-universal-detail.js'),'v115 must load after universal detail');
assert.doesNotThrow(()=>new vm.Script(layer),'v115 syntax invalid');
assert.ok(!layer.includes('new MutationObserver('),'v115 must not add MutationObserver loops');
assert.ok(!layer.includes('setInterval('),'v115 must not add permanent polling');
assert.match(layer,/state:'Liked'/,'media favorites must use canonical Liked state');
assert.match(layer,/favorite_actors\?/,'actor favorites table integration missing');
assert.match(layer,/Atores Favoritos/,'Favorite Actors profile section missing');
assert.match(layer,/series,movies,seriesFav,movieFav/,'profile media sections strict reorder missing');
assert.match(layer,/for\(let i=-10;i<=3;i\+\+\)/,'profile timeline must span 10 days back through 3 days ahead');
assert.match(layer,/Hoje centralizado · 3 dias antes e 3 depois visíveis · role até 10 dias para trás/,'profile timeline guidance missing');
assert.match(layer,/window\.__ct0994OpenPerson/,'favorite actor cards must open person page');
assert.match(layer,/data-ct115-remove-person/,'favorite actor direct removal missing');
assert.match(detail,/body\.dataset\.loaded='1';body\.innerHTML=`\$\{chart114\(seasonNo,eps\)\}<div class="ct114-episodes">/,'season rating chart must appear before the episode list');
assert.match(legacy,/const pickLocal=kind=>personal\.map\(toCard\)/,'Pra Voce must use local Watchlist data first');
assert.match(legacy,/primary_release_date\.gte':'1991-01-01'/,'daily/fresh movie year rule missing');
assert.match(legacy,/score991\(x\)>=8/,'daily movie score >= 8 rule missing');
assert.match(legacy,/!blocker\.isBlocked\(x\)/,'Discover strict seen/watchlist exclusion missing');
assert.match(migration,/create table if not exists public\.favorite_actors/,'favorite_actors schema missing');
assert.match(migration,/tmdb_person_id integer not null/,'favorite actor TMDB person id missing');
assert.match(migration,/auth\.uid\(\)/,'favorite actor RLS ownership missing');

console.log('WEB_0995_FAVORITES_PROFILE_DISCOVER_OK');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('dist/index.html','utf8');
const detail=await readFile('dist/patch-v114-v0994-universal-detail.js','utf8');
const legacy=await readFile('dist/patch-v092-v0991.js','utf8');
const home=await readFile('dist/patch-v099-v0994-web.js','utf8');
const preload=await readFile('dist/patch-v113-v0994-fluidity.js','utf8');
const pkg=await readFile('package.json','utf8');

assert.match(pkg,/"version": "0\.99\.4"/,'version must remain 0.99.4');
assert.equal((html.match(/patch-v114-v0994-universal-detail\.js/g)||[]).length,1,'v114 detail must load exactly once');
assert.ok(html.indexOf('patch-v114-v0994-universal-detail.js')>html.indexOf('patch-v113-v0994-fluidity.js'),'v114 must load after v113');
assert.doesNotThrow(()=>new vm.Script(detail),'v114 syntax invalid');
assert.ok(!detail.includes('new MutationObserver('),'v114 must not add observer loops');
assert.ok(!detail.includes('setInterval('),'v114 must not add permanent polling');

for(const marker of ['[data-ct994-open]','[data-card991]','[data-open-media991]','window.__ct0994OpenDetail','window.ct91OpenMedia','window.ct92OpenMedia'])assert.ok(detail.includes(marker),`universal media entry missing: ${marker}`);
assert.match(detail,/source_tmdb_id/,'surrogate TMDB resolution missing');
assert.match(detail,/\/search\/\$\{type\}/,'title/year TMDB fallback missing');
assert.match(home,/histEpisode994[\s\S]*data-ct994-open/,'episode history rows must be openable');
assert.match(home,/histMovie994[\s\S]*data-ct994-open/,'movie history rows must be openable');

for(const marker of ['still_path','air_date','vote_average','overview','cinetracker_mark_episode_v0994','data-ct114-watch','data-ct114-rewatch'])assert.ok(detail.includes(marker),`episode detail requirement missing: ${marker}`);
assert.match(detail,/ct114-season-head/,'collapsible seasons missing');
assert.match(detail,/polyline/,'line rating chart missing');
assert.ok(detail.includes('#48e39a')&&detail.includes('#ff5f59'),'best/worst episode colors missing');
assert.match(detail,/data-ct114-person/,'clickable cast missing');
assert.match(detail,/combined_credits/,'person filmography missing');
assert.match(detail,/Filmes · mais novos primeiro/,'movie filmography split/order missing');
assert.match(detail,/Séries · mais novas primeiro/,'TV filmography split/order missing');
assert.match(detail,/creditSort114/,'filmography newest-first sort missing');

assert.match(legacy,/Promise\.allSettled\(/,'Pra Você must survive partial TMDB failures');
assert.match(legacy,/source_tmdb_id/,'Pra Você must use effective TMDB IDs for imported Watchlist rows');
assert.match(legacy,/score991\(x\)>=8/,'daily movie score >= 8 rule missing');
assert.match(legacy,/year991\(x\)>1990/,'daily movie year > 1990 rule missing');
for(const k of ['wm','wt','wa','fm','ft','fa'])assert.ok(legacy.includes(k),`Pra Você slot missing: ${k}`);
assert.match(legacy,/cinetracker_discovery_exclusions_v0994/,'strict Discover exclusions missing');

assert.match(preload,/v114-cache-first-posters-stable-enrichment/,'stable preload marker missing');
assert.ok(!preload.includes("localStorage.removeItem('ct0994_discover_snapshot_v4')"),'catalog enrichment must not erase visible Discover cache');
assert.ok(!preload.includes("setTimeout(()=>void window.__ct0994Navigate?.(route)"),'catalog enrichment must not force route rerender');
assert.match(preload,/centerTimeline113/,'profile timeline centering missing');
assert.match(legacy,/for\(let i=-10;i<=3;i\+\+\)/,'profile timeline must be -10 through +3 days');
assert.match(legacy,/item_type==='episode'/,'profile timeline must count episodes');

console.log('WEB_0994_UNIVERSAL_OK media=all-entrypoints series=episodes+rewatch+chart person=split-filmography recommendations=resilient preload=stable timeline=centered');

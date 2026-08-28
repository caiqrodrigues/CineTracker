import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const pkg=await readFile('package.json','utf8');
const html=await readFile('dist/index.html','utf8');
const sw=await readFile('dist/service-worker.js','utf8');
const layer=await readFile('dist/patch-v116-v0996-authoritative.js','utf8');
const finalLayer=await readFile('dist/patch-v117-v0996-final.js','utf8');
const detail=await readFile('dist/patch-v114-v0994-universal-detail.js','utf8');

assert.match(pkg,/"version": "0\.99\.6"/,'Web package must be 0.99.6');
assert.match(sw,/ct-web-0\.99\.6/,'service worker must use 0.99.6 cache');
assert.equal((html.match(/patch-v116-v0996-authoritative\.js/g)||[]).length,1,'v116 must load exactly once');
assert.equal((html.match(/patch-v117-v0996-final\.js/g)||[]).length,1,'v117 must load exactly once');
assert.ok(html.indexOf('patch-v116-v0996-authoritative.js')>html.indexOf('patch-v115-v0995-favorites-profile-discover.js'),'v116 must supersede v115');
assert.ok(html.indexOf('patch-v117-v0996-final.js')>html.indexOf('patch-v116-v0996-authoritative.js'),'v117 must be last 0.99.6 layer');
assert.doesNotThrow(()=>new vm.Script(layer),'v116 syntax invalid');
assert.doesNotThrow(()=>new vm.Script(finalLayer),'v117 syntax invalid');
assert.ok(!layer.includes('new MutationObserver('),'v116 must not add MutationObserver loops');
assert.ok(!layer.includes('setInterval('),'v116 must not add permanent polling');
assert.ok(!finalLayer.includes('new MutationObserver('),'v117 must not add MutationObserver loops');
assert.ok(!finalLayer.includes('setInterval('),'v117 must not add permanent polling');

for(const marker of ['v116-profile-discover-single-authority','cinetracker_profile_payload_v0996','ct0996_profile_snapshot_v2','ct0996_discover_snapshot_v2','window.__ct0996WarmAll'])assert.ok(layer.includes(marker),`missing authority/cache marker ${marker}`);
assert.match(layer,/if\(target==='profile'\)return renderProfile116\(\)/,'Profile must bypass legacy renderer');
assert.match(layer,/if\(target==='discover'\)return renderDiscover116\(\)/,'Discover must bypass legacy renderer');
assert.ok(layer.includes("window.__ct0994Navigate=navigate116")&&layer.includes('window.ct991Navigate=navigate116'),'canonical navigation aliases missing');

const order=['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'];
let last=-1;for(const label of order){const p=layer.indexOf(label);assert.ok(p>last,`Profile section order invalid at ${label}`);last=p}
assert.match(layer,/favorite_actors/,'favorite actors persistence missing');
assert.match(layer,/state:'Liked'/,'media favorites must use canonical Liked state');
assert.match(layer,/data-ct116-actor-remove/,'actor removal missing');
assert.match(layer,/__ct0994OpenPerson/,'actor detail opening missing');
assert.match(finalLayer,/ct117-cast-heart/,'cast favorite heart missing');
assert.match(finalLayer,/ct117-person-fav/,'person favorite action missing');

assert.match(layer,/Episódios por dia/,'requested profile graph missing');
assert.match(layer,/ct116-day/,'profile timeline markers missing');
assert.match(layer,/today\.offsetLeft-\(sc\.clientWidth-today\.clientWidth\)\/2/,'today must be centered');
assert.ok(!layer.includes('Últimos 30 dias'),'legacy 30-day graph must not be rendered by v116');

for(const label of ['Pra Você','Em alta','Mais aguardados','Mais bem avaliados','Calendário','Geral','Séries','Filmes'])assert.ok(layer.includes(label),`Discover label missing ${label}`);
assert.match(layer,/cinetracker_discovery_exclusions_v0994/,'strict exclusion RPC missing');
assert.ok(!layer.includes("cinetracker_discovery_exclusions_v0994',{}).catch"),'strict exclusions must fail closed');
assert.match(layer,/strict_exclusions:true/,'strict Discover marker missing');
assert.match(layer,/score116\(x\)>=8/,'daily score >=8 rule missing');
assert.match(layer,/year116\(x\)>1990/,'daily year >1990 rule missing');
for(const slot of ['wm','wt','wa','fm','ft','fa'])assert.ok(layer.includes(slot),`Pra Você slot missing ${slot}`);
assert.match(layer,/Buscar filmes, séries e atores/,'Discover global search missing');
assert.match(layer,/next_episode_to_air/,'calendar official next episode integration missing');

assert.match(layer,/data-ct115-heart-bound="1" data-open-media991/,'TMDB cards must remain compatible with universal opener without duplicate legacy hearts');
for(const marker of ['data-ct114-rewatch','still_path','air_date','vote_average','overview','combined_credits','#48e39a','#ff5f59'])assert.ok(detail.includes(marker),`universal detail requirement missing ${marker}`);
assert.match(finalLayer,/\.ct114-season-body>\.ct114-chart\{display:none!important\}/,'chart inside season accordion must be hidden');
assert.match(finalLayer,/Avaliações dos episódios por temporada/,'standalone season rating section missing');
assert.match(finalLayer,/ct117-season-ratings-strip/,'season rating horizontal scroll missing');
assert.match(finalLayer,/vote_count/,'season rating vote tooltip missing');

console.log('WEB_0996_AUTHORITATIVE_OK profile=single-renderer discover=fail-closed favorites=media+actors detail=universal season-chart=external preload=shared');

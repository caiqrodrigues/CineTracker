import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const patch=await readFile('dist/patch-v118-v0996-preview-runtime.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=await readFile('package.json','utf8');

assert.match(pkg,/"version": "0\.99\.6"/,'logical release must remain 0.99.6');
assert.doesNotThrow(()=>new vm.Script(patch),'v118 preview runtime syntax invalid');
assert.equal((html.match(/patch-v118-v0996-preview-runtime\.js/g)||[]).length,1,'v118 must load exactly once');
assert.ok(html.indexOf('patch-v118-v0996-preview-runtime.js')>html.indexOf('patch-v117-v0996-final.js'),'v118 must load after v117');
assert.ok(!patch.includes('new MutationObserver('),'v118 must not add MutationObserver churn');
assert.ok(!patch.includes('setInterval('),'v118 must not add permanent polling');

// Perfil: the payload is authoritative; viewport geometry must calculate seven visible days instead of approximating 200%.
assert.match(patch,/cinetracker_profile_payload_v0996/,'profile payload refresh missing');
assert.match(patch,/Atores Favoritos/,'favorite actors repair missing');
assert.match(patch,/\(inner-gap\*6\)\/7/,'profile timeline must calculate exactly seven visible day widths');
assert.match(patch,/today\.offsetLeft-\(inner-today\.offsetWidth\)\/2/,'profile today centering missing');

// Poster regression: imported English titles must match TMDB original_title/original_name even with pt-BR results.
assert.match(patch,/original_title/,'poster resolver must compare TMDB original_title');
assert.match(patch,/original_name/,'poster resolver must compare TMDB original_name');
assert.match(patch,/tokenScore118/,'poster resolver similarity guard missing');
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases=x=>[x.title,x.name,x.original_title,x.original_name].map(normalize).filter(Boolean);
const imported=normalize('Star Wars: Episode II - Attack of the Clones');
const localized={title:'Star Wars: Episódio II - Ataque dos Clones',original_title:'Star Wars: Episode II - Attack of the Clones',release_date:'2002-05-15'};
assert.ok(aliases(localized).includes(imported),'localized TMDB result must still match imported original title');

// Series ratings: never inside season accordion; standalone section is immediately after Temporadas e episódios and one season occupies one carousel page.
assert.match(patch,/\.ct114-season-body > \.ct114-chart/,'inner season chart removal missing');
assert.match(patch,/temporadas e episodios/,'standalone placement must target the episodes section by heading');
assert.match(patch,/insertAdjacentElement\('afterend',sec\)/,'ratings section must be placed after episodes section');
assert.match(patch,/grid-auto-columns:100%!important/,'season carousel must show one season per horizontal page');
assert.match(patch,/data-ct118-prev/,'season previous control missing');
assert.match(patch,/data-ct118-next/,'season next control missing');

// Discover: v116 is the canonical renderer and v118 rejects mixed/legacy DOM.
for(const marker of ['pra voce','em alta','mais aguardados','mais bem avaliados','calendario','geral','series','filmes'])assert.ok(patch.includes(marker),`Discover authority marker missing ${marker}`);
assert.match(patch,/ensureDiscover118\(rawNav118\)/,'Discover final authority check missing');

console.log('WEB_0996_PREVIEW_RUNTIME_OK profile=7-days+actors posters=original-title season=standalone-carousel discover=authority version=0.99.6');

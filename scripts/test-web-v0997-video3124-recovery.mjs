import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source=await readFile('apps/web/patch-v126-v0997-video3124-recovery.js','utf8');
const runtime=await readFile('dist/patch-v126-v0997-video3124-recovery.js','utf8');
const legacy43=await readFile('dist/patch-v043.js','utf8');
const legacy44=await readFile('dist/patch-v044.js','utf8');
const legacy91=await readFile('dist/patch-v091-v099-profile-lru.js','utf8');
const home99=await readFile('dist/patch-v099-v0994-web.js','utf8');
const auth118=await readFile('dist/patch-v118-v0997-authoritative.js','utf8');
const profile120=await readFile('dist/patch-v120-v0997-structural-authority.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','video3124 recovery must not bump version');
assert.ok(source.includes('v126-video3124-surgical-recovery'),'source marker missing');
for(const token of [
  'meaningfulHome','dashboardToHome','cleanupNav','removeStandaloneHistory',
  "applyFourMore('Séries')","applyFourMore('Filmes')","applyFourMore('Séries Favoritas')","applyFourMore('Filmes Favoritos')","applyFourMore('Atores Favoritos')",
  '.ct120-actors,.ct118-actors','.ct120-actor,.ct118-actor','c.hidden=i>=4','cards.length<=4','cards.length-4','<b>Ver mais</b>',
  'row.dataset.ct126Four===signature',"row.classList.toggle('ct126-expanded',open)",'#ct43-profile{display:none!important}',
  '[data-ct120-slot="series-favorites"] .ct120-card:nth-child(n+5)','[data-ct120-slot="movie-favorites"] .ct120-card:nth-child(n+5)','[data-ct120-slot="actors"] .ct120-actor:nth-child(n+5)',
  "h==='da sua watchlist'",'knownContext','isKnownCard','+ Watchlist','7*60*1000','ct126-profile-grid'
]) assert.ok(runtime.includes(token),`emitted video3124 recovery missing ${token}`);
assert.ok(!runtime.includes('applyTenMore'),'Profile must not keep the old 10-card limit');
assert.ok(!runtime.includes('i>=10'),'Profile emitted runtime must not keep 10 hidden cards');
assert.ok(!runtime.includes('new MutationObserver'),'video3124 recovery must not add another observer');
assert.ok(!legacy43.includes("function run(){if(!currentUser)return;insertProfileBlocks();"),'legacy v043 must not recreate Tempo de Tela/Histórico');
assert.ok(legacy43.includes("function run(){if(!currentUser)return;document.getElementById('ct43-profile')?.remove();hydrateAll();"),'legacy v043 must be neutralized at its run hook');
assert.ok(!legacy44.includes("function run(){if(!currentUser)return;enhanceProfile();"),'legacy v044 must not enhance/rebuild Tempo de Tela');
assert.ok(!legacy91.includes("if(t==='profile')return renderProfile99()"),'legacy ct99 must not take over Profile navigation');
assert.ok(legacy91.includes('window.ct99RenderProfile=()=>false'),'legacy ct99 direct Profile renderer must be disabled');
assert.ok(!legacy91.includes("if(v==='profile'||v==='history')renderProfile99()"),'legacy delayed ct99 Profile render must be disabled');
assert.ok(profile120.includes("rpc120('cinetracker_profile_media_dashboard_v0991',{})"),'Profile timeout must fall back to lighter dashboard RPC');
assert.ok(profile120.includes("rpc120('cinetracker_profile_stats',{})"),'Profile fallback must keep real stats');
assert.ok(profile120.includes("sb120('favorite_actors?select=tmdb_person_id,actor_name,profile_path&order=created_at.desc')"),'Profile fallback must retain favorite actors');
assert.ok(profile120.includes('#ct120-page[data-ct120-route="profile"] .content{width:auto!important;max-width:none!important'),'Profile must fill available viewport width');
assert.ok(profile120.includes('Episódios por Dia'),'correct daily Profile graph must remain');
assert.ok(home99.includes("cont:s.filter(x=>x.home_bucket==='continue'&&!caught(x))"),'Assistir a seguir must exclude series with zero released episodes remaining');
assert.ok(home99.includes("up:s.filter(x=>x.home_bucket==='up_to_date'||(x.home_bucket==='continue'&&caught(x)))"),'caught-up continue rows must move to Em dia');
assert.ok(auth118.includes('media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb&id=in.('),'poster repair must have title/year for strict matching');
assert.ok(auth118.includes("clean=v=>norm118(String(v||'').replace(/\\s*\\((?:18|19|20)\\d{2}\\)\\s*$/,''))"),'poster repair must normalize title without year suffix');
assert.ok(auth118.includes("matches(x)&&(!yr||cy(x)===yr)"),'poster repair must require exact title/year when year exists');
assert.ok(!auth118.includes('priority=visible-posters'),'visible poster repair must not use fuzzy server enrichment fallback');
const a=html.indexOf('<script src="/patch-v125-v0997-restore-foryou-contract.js"></script>');
const b=html.indexOf('<script src="/patch-v126-v0997-video3124-recovery.js"></script>');
assert.ok(a>=0&&b>a,'video3124 recovery must load after v125');
assert.equal((html.match(/patch-v126-v0997-video3124-recovery\.js/g)||[]).length,1,'video3124 recovery duplicated');
console.log('WEB_0997_VIDEO3124_RECOVERY_OK profile=authoritative+full-width+fallback home=no-zero-remaining posters=strict');

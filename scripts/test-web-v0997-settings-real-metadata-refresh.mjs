import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v129-v0997-settings-real-metadata-refresh.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','settings metadata refresh must not bump version');
for(const token of [
  'v129-settings-real-metadata-refresh-only',
  '#ct91-refresh',
  'media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb',
  "method:'PATCH'",
  'raw_tmdb:d',
  'poster_path:d.poster_path',
  'release_year:detailYear129',
  '/search/${type}',
  'aliases129(x).includes(local)',
  'state.corrected',
  'Ignorados com segurança',
  'Cancelar',
  'ct121safe:',
  "k.includes('-meta')",
  'window.ct53Refresh',
  'window.ct53RebootCovers'
]) assert.ok(src.includes(token),`settings v129 missing ${token}`);
for(const forbidden of ['new MutationObserver','Pra Você','Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário']) assert.ok(!src.includes(forbidden),`settings-only metadata patch must not alter/add ${forbidden}`);
const a=html.indexOf('<script src="/patch-v128-v0997-settings-minimal-transfer.js"></script>');
const b=html.indexOf('<script src="/patch-v129-v0997-settings-real-metadata-refresh.js"></script>');
assert.ok(a>=0&&b>a,'settings v129 must load once after v128');
assert.equal((html.match(/patch-v129-v0997-settings-real-metadata-refresh\.js/g)||[]).length,1,'settings v129 duplicated');
console.log('WEB_0997_SETTINGS_V129_OK scope=settings metadata=real safe=exact-title-year progress=yes');

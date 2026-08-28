import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v128-v0997-settings-minimal-transfer.js','utf8');
const meta=await readFile('apps/web/patch-v129-v0997-settings-real-metadata-refresh.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','settings-only change must not bump version');
for(const token of [
  'v128-settings-minimal-import-export-only',
  '>Exportar<',
  '>Importar<',
  'Exportar dados',
  'Importar dados',
  'data-ct128-target="ct91-exp-json"',
  'data-ct128-target="ct91-exp-zip"',
  'data-ct128-target="ct106-exp-csv"',
  'data-ct128-target="ct91-imp-json"',
  'data-ct128-target="ct91-imp-zip"',
  'library.csv + watches.csv',
  'ct128-vault',
  'ct127-data-hub{display:none!important}',
  'ct128-csv-mode',
  'CineTracker <b>0.99.7</b>'
]) assert.ok(src.includes(token),`settings v128 missing ${token}`);
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
]) assert.ok(meta.includes(token),`settings v129 missing ${token}`);
for(const forbidden of ['Pra Você','Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário','Indicação do dia']){
  assert.ok(!src.includes(forbidden),`settings-only v128 must not alter ${forbidden}`);
  assert.ok(!meta.includes(forbidden),`settings-only v129 must not alter ${forbidden}`);
}
assert.ok(!src.includes('new MutationObserver'),'settings v128 must not add a MutationObserver');
assert.ok(!meta.includes('new MutationObserver'),'settings v129 must not add a MutationObserver');
assert.ok(!src.includes('<h3>Importar do Bingers</h3>'),'Bingers must not be a visible standalone section in v128');
assert.ok(!src.includes('Sincronizar agora</button>'),'sync must not be a primary visible action in v128');
new Function(meta);
const a=html.indexOf('<script src="/patch-v127-v0997-settings-unified-data-hub.js"></script>');
const b=html.indexOf('<script src="/patch-v128-v0997-settings-minimal-transfer.js"></script>');
const c=html.indexOf('<script src="/patch-v129-v0997-settings-real-metadata-refresh.js"></script>');
assert.ok(a>=0&&b>a&&c>b,'settings v128/v129 must load once after v127 in order');
assert.equal((html.match(/patch-v128-v0997-settings-minimal-transfer\.js/g)||[]).length,1,'settings v128 duplicated');
assert.equal((html.match(/patch-v129-v0997-settings-real-metadata-refresh\.js/g)||[]).length,1,'settings v129 duplicated');
console.log('WEB_0997_SETTINGS_V128_V129_OK scope=settings visible=import+export metadata=real safe=exact-title-year progress=yes');

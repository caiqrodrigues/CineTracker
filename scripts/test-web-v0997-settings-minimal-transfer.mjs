import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v128-v0997-settings-minimal-transfer.js','utf8');
const runtime=await readFile('dist/patch-v128-v0997-settings-minimal-transfer.js','utf8');
const meta=await readFile('apps/web/patch-v129-v0997-settings-real-metadata-refresh.js','utf8');
const stable=await readFile('apps/web/patch-v130-v0997-nav-footer-stability.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
function scriptPos(name){const esc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const m=html.match(new RegExp(`<script\\s+src="/${esc}(?:\\?[^\"]*)?"></script>`));return m?m.index:-1}
assert.equal(pkg.version,'0.99.7','settings/nav fix must not bump version');
for(const token of [
  'v128-settings-minimal-import-export-only','>Exportar<','>Importar<','Exportar dados','Importar dados',
  'data-ct128-target="ct91-exp-json"','data-ct128-target="ct91-exp-zip"','data-ct128-target="ct106-exp-csv"',
  'data-ct128-target="ct91-imp-json"','data-ct128-target="ct91-imp-zip"','library.csv + watches.csv','ct128-vault','ct127-data-hub{display:none!important}','ct128-csv-mode','CineTracker <b>0.99.7</b>'
]) assert.ok(src.includes(token),`settings v128 missing ${token}`);
assert.ok(runtime.includes('@media (min-width:1100px){.ct91-settings.ct109-settings{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}'),'Settings account and maintenance cards must share desktop width equally');
assert.ok(runtime.includes('.ct109-account,.ct109-maintenance{width:100%!important;max-width:none!important;min-width:0!important'),'Settings top cards must fit their columns without overflow');
for(const token of [
  'v129-settings-real-metadata-refresh-only','#ct91-refresh','media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb',
  "method:'PATCH'",'raw_tmdb:d','poster_path:d.poster_path','release_year:detailYear129','/search/${type}','aliases129(x).includes(local)',
  'state.corrected','Ignorados com segurança','Cancelar','ct121safe:',"k.includes('-meta')",'window.ct53Refresh','window.ct53RebootCovers'
]) assert.ok(meta.includes(token),`settings v129 missing ${token}`);
for(const token of [
  'v130-nav-footer-stability-only','data-ct130-primary','data-ct130-locked',"['home','discover','profile','settings']",
  'ct130-stable-footer','ct130-stable-marker','ct130-settings-active','new MutationObserver(schedule130)',
  "observer130.observe(host130,{childList:true,subtree:true})",'legacyVersion130','aria-label','CineTracker 0.99.7'
]) assert.ok(stable.includes(token),`nav/footer v130 missing ${token}`);
for(const forbidden of ['Pra Você','Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário','Indicação do dia']){
  assert.ok(!src.includes(forbidden),`settings-only v128 must not alter ${forbidden}`);
  assert.ok(!meta.includes(forbidden),`settings-only v129 must not alter ${forbidden}`);
  assert.ok(!stable.includes(forbidden),`nav/footer-only v130 must not alter ${forbidden}`);
}
assert.ok(!src.includes('new MutationObserver'),'settings v128 must not add a MutationObserver');
assert.ok(!meta.includes('new MutationObserver'),'settings v129 must not add a MutationObserver');
assert.ok(!stable.includes('window.sbRpc='),'v130 must not wrap Supabase');
assert.ok(!stable.includes('window.fetch='),'v130 must not wrap fetch');
assert.ok(!src.includes('<h3>Importar do Bingers</h3>'),'Bingers must not be a visible standalone section in v128');
assert.ok(!src.includes('Sincronizar agora</button>'),'sync must not be a primary visible action in v128');
new Function(runtime);new Function(meta);new Function(stable);
const a=scriptPos('patch-v127-v0997-settings-unified-data-hub.js');
const b=scriptPos('patch-v128-v0997-settings-minimal-transfer.js');
const c=scriptPos('patch-v129-v0997-settings-real-metadata-refresh.js');
const d=scriptPos('patch-v130-v0997-nav-footer-stability.js');
assert.ok(a>=0&&b>a&&c>b&&d>c,'settings v128/v129 and nav/footer v130 must load once after v127 in order');
for(const p of ['patch-v128-v0997-settings-minimal-transfer.js','patch-v129-v0997-settings-real-metadata-refresh.js','patch-v130-v0997-nav-footer-stability.js'])assert.equal((html.match(new RegExp(p.replaceAll('.','\\.'),'g'))||[]).length,1,`${p} duplicated`);
console.log('WEB_0997_SETTINGS_V128_V129_NAV_V130_OK metadata=real sidebar=locked footer=stable layout=balanced scope=settings+sidebar');

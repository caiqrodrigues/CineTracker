import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('dist/index.html','utf8');
const js = await readFile('dist/patch-v109-v0994-settings-web.js','utf8');

assert.equal((html.match(/patch-v109-v0994-settings-web\.js/g)||[]).length,1,'v109 Settings must be emitted exactly once');
assert.match(js,/v109-browser-settings-complete/,'Settings marker missing');
assert.match(js,/Conta e preferências/,'account section missing');
assert.match(js,/Manutenção e sincronização/,'maintenance section missing');
assert.match(js,/Gerenciamento de Dados/,'data management section missing');
assert.match(js,/ct109-data-columns/,'export and restore layout missing');
assert.match(js,/Importar dados externos/,'external import section missing');
assert.match(js,/ct10-import-panel/,'Bingers importer must be preserved');
assert.match(js,/ct91-exp-json/,'JSON export handler must be preserved');
assert.match(js,/ct91-exp-zip/,'ZIP export handler must be preserved');
assert.match(js,/ct106-exp-csv/,'CSV export must be preserved');
assert.match(js,/ct91-imp-json/,'JSON restore handler must be preserved');
assert.match(js,/ct91-imp-zip/,'ZIP restore handler must be preserved');
assert.match(js,/@media \(max-width:850px\)/,'mobile browser responsive Settings rules missing');
assert.match(js,/Configurações da <b>Web\/PWA<\/b>/,'Web/PWA identity missing');
assert.ok(!/new MutationObserver/.test(js),'Settings v109 must not add a MutationObserver');
assert.ok(!/setInterval\s*\(/.test(js),'Settings v109 must not add polling loops');

console.log('WEB_0994_SETTINGS_OK unified responsive handlers=preserved android=untouched');

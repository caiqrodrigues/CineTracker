import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v127-v0997-settings-unified-data-hub.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
function scriptPos(name){const esc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const m=html.match(new RegExp(`<script\\s+src="/${esc}(?:\\?[^\"]*)?"></script>`));return m?m.index:-1}
assert.equal(pkg.version,'0.99.7','settings-only fix must not bump version');
for(const token of [
  'v127-settings-unified-data-hub-only',
  'Backup, importação e sincronização',
  'Backup e exportação',
  'Importação e sincronização',
  'Importar do Bingers',
  'Exportar JSON',
  'Importar JSON',
  'Sincronizar agora',
  '#ct10-import-panel',
  '#ct11-sync',
  'ct127-retired-data',
  'grid-template-columns:repeat(2,minmax(0,1fr))',
  '@media(max-width:850px)',
  'CineTracker <b>0.99.7</b>'
]) assert.ok(src.includes(token),`settings v127 missing ${token}`);
for(const forbidden of ['Pra Você','Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário','Indicação do dia']) assert.ok(!src.includes(forbidden),`settings-only patch must not alter ${forbidden}`);
assert.ok(!src.includes('new MutationObserver'),'settings v127 must not add a MutationObserver');
const a=scriptPos('patch-v126-v0997-video3124-recovery.js');
const b=scriptPos('patch-v127-v0997-settings-unified-data-hub.js');
assert.ok(a>=0&&b>a,'settings v127 must load once after v126');
assert.equal((html.match(/patch-v127-v0997-settings-unified-data-hub\.js/g)||[]).length,1,'settings v127 duplicated');
console.log('WEB_0997_SETTINGS_V127_OK scope=settings hub=backup+import+sync responsive=desktop+mobile');

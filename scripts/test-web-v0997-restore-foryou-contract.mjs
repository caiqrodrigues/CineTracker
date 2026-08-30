import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v125-v0997-restore-foryou-contract.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
function scriptPos(name){const esc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const m=html.match(new RegExp(`<script\\s+src="/${esc}(?:\\?[^\"]*)?"></script>`));return m?m.index:-1}

assert.equal(pkg.version,'0.99.7','Pra Você fix must not bump version');
for(const token of [
  'v125-restore-foryou-only-no-other-tabs',
  'Indicação do dia',
  '100% novos',
  'Filme',
  'Série',
  'Anime',
  'fora da Watchlist e histórico',
  '[data-ct124-tab="foryou"]',
  '[data-ct124-type]',
  'window.__ct0997ApplyForYouContract'
]) assert.ok(src.includes(token),`Pra Você contract missing: ${token}`);
for(const forbidden of ['Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário']) assert.ok(!src.includes(forbidden),`isolated Pra Você patch must not alter ${forbidden}`);
assert.ok(!src.includes('MutationObserver'),'isolated Pra Você patch must not add a permanent observer');
const v124=scriptPos('patch-v124-v0997-video-smoke-authority.js');
const v125=scriptPos('patch-v125-v0997-restore-foryou-contract.js');
assert.ok(v124>=0&&v125>v124,'Pra Você restore must load once after v124');
assert.equal((html.match(/patch-v125-v0997-restore-foryou-contract\.js/g)||[]).length,1,'Pra Você restore duplicated');
console.log('WEB_0997_RESTORE_FORYOU_OK scope=PraVocê only layout=daily+100%-new slots=movie,tv,anime');

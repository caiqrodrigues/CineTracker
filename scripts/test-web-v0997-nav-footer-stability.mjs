import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v130-v0997-nav-footer-stability.js','utf8');
const html=await readFile('dist/index.html','utf8');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','nav/footer-only fix must not bump version');
for(const token of [
  'v130-nav-footer-stability-only',
  'data-ct130-primary',
  'data-ct130-locked',
  "['home','discover','profile','settings']",
  'ct130-stable-footer',
  'ct130-stable-marker',
  'ct130-settings-active',
  'new MutationObserver(schedule130)',
  "observer130.observe(host130,{childList:true,subtree:true})",
  'legacyVersion130',
  'aria-label','CineTracker 0.99.7'
]) assert.ok(src.includes(token),`nav/footer v130 missing ${token}`);
for(const forbidden of ['Pra Você','Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário','cinetracker_profile_payload','cinetracker_profile_home_payload','tmdb-proxy','media?select=']) assert.ok(!src.includes(forbidden),`nav/footer fix must not alter unrelated behavior: ${forbidden}`);
assert.ok(!src.includes("window.sbRpc="),'nav/footer fix must not wrap Supabase');
assert.ok(!src.includes("window.fetch="),'nav/footer fix must not wrap fetch');
const a=html.indexOf('<script src="/patch-v128-v0997-settings-minimal-transfer.js"></script>');
const b=html.indexOf('<script src="/patch-v130-v0997-nav-footer-stability.js"></script>');
assert.ok(a>=0&&b>a,'v130 must load once after v128');
assert.equal((html.match(/patch-v130-v0997-nav-footer-stability\.js/g)||[]).length,1,'v130 duplicated');
console.log('WEB_0997_NAV_FOOTER_V130_OK sidebar=locked profile/settings=single footer=stable scope=nav+settings-footer');

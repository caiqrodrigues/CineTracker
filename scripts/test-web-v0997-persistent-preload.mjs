import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const src=await readFile('apps/web/patch-v1196-v0997-persistent-preload.js','utf8');
const html=await readFile('dist/index.html','utf8');
const normalizedHtml=html.replace(/\?[^"']+/g,'');
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(pkg.version,'0.99.7','performance-only preload must not bump version');
for(const token of [
  'v1196-persistent-rpc-stale-while-revalidate',
  "const STALE_TIME=10*60*1000",
  "const MAX_AGE=24*60*60*1000",
  "const DB_NAME='cinetracker-preload-v1'",
  "indexedDB.open(DB_NAME,1)",
  'Promise.allSettled([',
  'rpc(HOME_RPC,{})',
  'rpc(PROFILE_RPC,{p_tz:tz()})',
  'rpc(DASH_RPC,{})',
  'rpc(EX_RPC,{})',
  'window.__ct0994PreloadedHome=value',
  'void network(String(name),body,key).catch(()=>{})',
  "if(type==='SIGNED_IN')",
  "if(type==='SIGNED_OUT')"
]) assert.ok(src.includes(token),`persistent preload missing ${token}`);
for(const forbidden of ['innerHTML=','new MutationObserver','Pra Você','Em alta','Mais aguardados','Populares','Mais bem avaliados','Calendário','renderProfile','renderDiscover','navigate120']) assert.ok(!src.includes(forbidden),`preload must not alter UI/function contract: ${forbidden}`);
const a=normalizedHtml.indexOf('<script src="/patch-v1195-v0997-route-preload-core.js"></script>');
const b=normalizedHtml.indexOf('<script src="/patch-v1196-v0997-persistent-preload.js"></script>');
const c=normalizedHtml.indexOf('<script src="/patch-v120-v0997-structural-authority.js"></script>');
assert.ok(a>=0&&b>a&&c>b,'persistent preload must load after v1195 and before v120');
assert.equal((html.match(/patch-v1196-v0997-persistent-preload\.js(?:\?[^"']+)?/g)||[]).length,1,'persistent preload duplicated');
console.log('WEB_0997_PERSISTENT_PRELOAD_OK source=legacy-contract final-runtime=r154-canonical ui=untouched');

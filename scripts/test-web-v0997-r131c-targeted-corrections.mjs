import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const src=await readFile('apps/web/patch-v131c-v0997-targeted-corrections.js','utf8');
assert.ok(src.includes('v131c-targeted-home-profile-calendar'),'r131c marker missing');
assert.ok(!src.includes('MutationObserver'),'r131c must not add MutationObserver');
assert.ok(!src.includes('setInterval('),'r131c must not add permanent polling');
assert.ok(src.includes("cinetracker_profile_media_dashboard_v0991"),'r131c movie fallback must use real dashboard');
assert.ok(src.includes("x.media_type==='movie'&&x.is_watchlist&&!x.is_seen"),'r131c movie watchlist filter missing');
assert.ok(src.includes("Faltam\\s+0")&&src.includes(" · Em dia"),'r131c Faltam 0 repair missing');
assert.ok(src.includes("limitProfileMedia('series-favorites'")&&src.includes("limitProfileMedia('movie-favorites'")&&src.includes('limitProfileActors()'),'r131c profile 10 + Ver mais coverage incomplete');
assert.ok(src.includes("b.textContent='Calendário'")&&src.includes('Minha Watchlist')&&src.includes('next_episode_to_air'),'r131c Calendar/watchlist behavior missing');

for(const base of ['dist','apps/web/dist']){
  const html=await readFile(`${base}/index.html`,'utf8');
  const emitted=await readFile(`${base}/patch-v131c-v0997-targeted-corrections.js`,'utf8');
  assert.ok(emitted.includes('v131c-targeted-home-profile-calendar'),`${base}: emitted r131c missing`);
  const b=html.indexOf('/patch-v131b-v0997-person-credit-bridge.js');
  const c=html.indexOf('/patch-v131c-v0997-targeted-corrections.js');
  assert.ok(b>=0&&c>b,`${base}: r131c must load after r131b`);
  assert.ok(!html.includes('/patch-v132-v0997-deeplink-pages.js'),`${base}: r132 accidentally reintroduced`);
  assert.ok(!html.includes('/patch-v133-v0997-primary-authority.js'),`${base}: r133 accidentally reintroduced`);
}

const vercel=JSON.parse(await readFile('apps/web/vercel.json','utf8'));
for(const route of ['/','/home','/discover','/profile','/configs'])assert.ok(vercel.rewrites.some(x=>x.source===route&&x.destination==='/index.html'),`r131c: ${route} must stay on stable index`);
const jsHeader=vercel.headers.find(x=>x.source==='/(.*)\\.js');
assert.ok(jsHeader?.headers?.some(x=>x.key==='Cache-Control'&&x.value.includes('no-store')),'r131c: JS must remain no-store');
console.log('WEB_R131C_OK baseline=r131 observers=0 home=real-dashboard profile=10-more calendar=watchlist');

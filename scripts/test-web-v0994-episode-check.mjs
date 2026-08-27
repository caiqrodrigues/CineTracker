import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const patch=await readFile('apps/web/patch-v110-v0994-episode-check.js','utf8');
const apply=await readFile('scripts/apply-web-v0994-episode-check.mjs','utf8');
const migration=await readFile('supabase/migrations/20260827222500_v0994_episode_check_state_sync.sql','utf8');
const index=await readFile('dist/index.html','utf8');

assert.match(patch,/v110-canonical-episode-check/,'episode-check marker missing');
assert.match(patch,/cinetracker_mark_episode_v0994/,'canonical episode RPC missing');
assert.match(patch,/p_released_episodes:released/,'released episode count must be sent to backend');
assert.match(patch,/p_series_status:show\?\.status/,'live series status must be sent to backend');
assert.match(patch,/stopImmediatePropagation\(\)/,'legacy direct-write click handler must be blocked');
assert.match(patch,/web-0\.99\.4-episode-check/,'data-changed event source missing');
assert.match(patch,/localStorage\.removeItem\('ct0994_home_preload_v1'\)/,'Home preload cache must be invalidated');
assert.match(patch,/topo de Continuar assistindo/,'continue-priority feedback missing');
assert.match(patch,/Série agora está Em dia/,'up-to-date feedback missing');
assert.match(patch,/Série movida para Concluídas/,'completed feedback missing');
assert.match(patch,/episode_progress\?select=episode_number/,'episode_progress synchronization missing');
assert.match(apply,/patch-v109-v0994-settings-web\.js/,'v110 must load after v109');
assert.match(index,/patch-v109-v0994-settings-web\.js"><\/script><script src="\/patch-v110-v0994-episode-check\.js"><\/script>/,'v110 must be emitted immediately after v109');
assert.match(migration,/v_state:='Completed'/,'terminal series must become Completed');
assert.match(migration,/v_state:='UpToDate'/,'fully caught-up active series must become UpToDate');
assert.match(migration,/v_state:='InProgress'/,'series with released episodes remaining must become InProgress');
assert.match(migration,/p_watched_at/,'episode RPC must keep watch timestamp for Home ordering');

console.log('WEB_0994_EPISODE_CHECK_OK check=canonical sync=supabase home-priority=recent state=continue-up-to-date-completed');

import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r304.mjs');

// Production/Vercel must only require Node. Chromium interaction tests remain
// mandatory in `npm run verify` and GitHub Actions, where a browser is available.
const staticGate=spawnSync(process.execPath,['test-r304.mjs'],{
  cwd:process.cwd(),
  stdio:'inherit',
  env:process.env,
});
if(staticGate.status!==0)throw new Error(`r304 static behavioral gate failed (${staticGate.status})`);

const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.95'||release.revision!=='r304-official-1.0.95')throw new Error('r304 release identity mismatch');
console.log('WEB_R304_OFFICIAL_OK production build + static regression green; Chromium gate runs in CI verify');

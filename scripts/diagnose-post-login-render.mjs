import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(process.cwd(), 'dist');
const originalHtml = await readFile(join(root, 'index.html'), 'utf8');
const tagPattern = /<script src="\/([^"]+\.js)"><\/script>/g;
const patchTags = [...originalHtml.matchAll(tagPattern)].map(m => m[1]);
const baseHtml = originalHtml.replace(tagPattern, '');

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'], ['.svg', 'image/svg+xml']
]);
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    if (url.pathname === '/') {
      const keep = Math.max(0, Math.min(patchTags.length, Number(url.searchParams.get('keep') ?? patchTags.length)));
      const tags = patchTags.slice(0, keep).map(file => `<script src="/${file}"></script>`).join('');
      const html = baseHtml.replace('</body>', tags + '</body>');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(html); return;
    }
    const rel = url.pathname.replace(/^\/+/, '');
    const safe = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
    const file = join(root, safe);
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not file');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': mime.get(extname(file)) || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
const executablePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

async function run(keep) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${String(error?.stack || error)}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`); });
  await page.route('https://pjmkxryboypluleuuupp.supabase.co/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwMC1wb3N0LWxvZ2luIiwiZW1haWwiOiJwMEBleGFtcGxlLmNvbSJ9.signature',
        refresh_token: 'p0-refresh-token', expires_in: 3600, token_type: 'bearer',
        user: { id: 'p0-post-login', email: 'p0@example.com' }
      }) }); return;
    }
    if (url.pathname.startsWith('/rest/v1/')) { await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); return; }
    if (url.pathname.startsWith('/functions/v1/')) { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [] }) }); return; }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  let ok = false, body = '';
  try {
    await page.goto(`http://127.0.0.1:4173/?keep=${keep}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.locator('#auth-form').waitFor({ state: 'visible', timeout: 1200 });
    await page.locator('#auth-email').fill('p0@example.com');
    await page.locator('#auth-password').fill('password123');
    await page.locator('#auth-form button[type="submit"]').click();
    await page.locator('.content').waitFor({ state: 'visible', timeout: 1200 });
    await page.waitForTimeout(80);
    body = (await page.locator('body').innerText({ timeout: 500 })).slice(0, 500);
    ok = body.trim().length > 40 && !(await page.locator('#auth-form').isVisible().catch(() => false));
  } catch (error) {
    errors.push(`driver: ${error?.message || error}`);
    try { body = (await page.locator('body').innerText({ timeout: 500 })).slice(0, 500); } catch {}
  }
  await context.close().catch(() => {});
  const last = keep ? patchTags[keep - 1] : 'BASE';
  console.log(`PREFIX ${String(keep).padStart(2, '0')}/${patchTags.length} ${ok ? 'PASS' : 'FAIL'} last=${last} body=${JSON.stringify(body.slice(0,120))}`);
  if (errors.length) console.log(`PREFIX_ERRORS ${keep} ${errors.join(' || ')}`);
  return ok;
}

try {
  console.log(`PATCH_ORDER ${patchTags.join(',')}`);
  let previous = await run(0);
  if (!previous) throw new Error('Base recovered HTML cannot enter authenticated Home; patch isolation invalid.');
  let firstFailure = -1;
  for (let keep = 1; keep <= patchTags.length; keep += 1) {
    const ok = await run(keep);
    if (previous && !ok && firstFailure < 0) firstFailure = keep;
    previous = ok;
  }
  if (firstFailure < 0) {
    console.log('ALL_PREFIXES_PASS HOTFIX8 observer guard prevents the v97 authenticated render regression.');
  } else {
    console.log(`FIRST_FAILURE ${firstFailure} ${patchTags[firstFailure - 1]}`);
    if (!previous) throw new Error(`Full patch chain still fails after ${patchTags[firstFailure - 1]}.`);
    console.log('FINAL_STATE PASS_AFTER_LATER_RECOVERY');
  }
} finally {
  await browser.close().catch(() => {});
  await new Promise(resolve => server.close(resolve));
}

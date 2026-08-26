import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(process.cwd(), process.env.CINETRACKER_TEST_ROOT || 'dist');
const mime = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'], ['.svg', 'image/svg+xml']
]);
const server = http.createServer(async (req, res) => {
  try {
    const rawPath = new URL(req.url || '/', 'http://127.0.0.1').pathname;
    const rel = rawPath === '/' ? 'index.html' : rawPath.replace(/^\/+/, '');
    const safe = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
    const file = join(root, safe);
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not file');
    res.writeHead(200, { 'content-type': mime.get(extname(file)) || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});
await new Promise(resolve => server.listen(4177, '127.0.0.1', resolve));

const executablePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(String(error?.stack || error)));
page.on('console', msg => { if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`); });

await page.route('https://pjmkxryboypluleuuupp.supabase.co/**', async route => {
  const url = new URL(route.request().url());
  if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password') {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdGFiaWxpdHktaG90Zml4OSIsImVtYWlsIjoic3RhYmlsaXR5QGV4YW1wbGUuY29tIn0.signature',
      refresh_token: 'stability-refresh-token', expires_in: 3600, token_type: 'bearer',
      user: { id: 'stability-hotfix9', email: 'stability@example.com' }
    }) });
    return;
  }
  if (url.pathname === '/auth/v1/user') {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'stability-hotfix9', email: 'stability@example.com' }) });
    return;
  }
  if (url.pathname.startsWith('/rest/v1/')) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    return;
  }
  if (url.pathname.startsWith('/functions/v1/')) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [] }) });
    return;
  }
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
});

try {
  await page.goto('http://127.0.0.1:4177/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.locator('#auth-form').waitFor({ state: 'visible', timeout: 1500 });
  await page.locator('#auth-email').fill('stability@example.com');
  await page.locator('#auth-password').fill('password123');
  await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({ state: 'visible', timeout: 1500 });
  await page.waitForTimeout(250);

  const runtime = await page.evaluate(() => ({
    v97: window.__ct97Loaded === true,
    auth: window.__ctAuthRecovery || null,
    reset: window.__ctP0SessionReset || null
  }));
  if (runtime.v97) throw new Error('HOTFIX9 stability failed: v97 overlay executed.');
  if (!runtime.auth || runtime.reset !== 'hotfix7-once') throw new Error('HOTFIX9 stability failed: auth recovery missing.');
  if (await page.locator('#auth-form').isVisible().catch(() => false)) throw new Error('Login remained visible after accepted login.');

  const labels = await page.locator('.nav button').allInnerTexts();
  const uniqueLabels = [...new Set(labels.map(x => x.trim()).filter(Boolean))];
  if (uniqueLabels.length < 4) throw new Error(`Expected at least 4 primary navigation tabs, got ${uniqueLabels.length}: ${uniqueLabels.join(', ')}`);

  for (const label of uniqueLabels) {
    const button = page.locator('.nav button').filter({ hasText: label }).first();
    await button.click({ timeout: 1500 });
    await page.waitForTimeout(180);
    if (await page.locator('#auth-form').isVisible().catch(() => false)) throw new Error(`Navigation ${label}: app fell back to login.`);
    if (!(await page.locator('.content').isVisible().catch(() => false))) throw new Error(`Navigation ${label}: content shell disappeared.`);
    if (errors.length) throw new Error(`Navigation ${label}: browser errors:\n${errors.join('\n')}`);
  }

  const heartbeat = await Promise.race([
    page.evaluate(() => new Promise(resolve => setTimeout(() => resolve('alive'), 1200))),
    new Promise(resolve => setTimeout(() => resolve('starved'), 2500))
  ]);
  if (heartbeat !== 'alive') throw new Error('UI thread starved during stability soak.');
  if (errors.length) throw new Error(`Browser errors after stability soak:\n${errors.join('\n')}`);

  console.log(`STABILITY_OK root=${process.env.CINETRACKER_TEST_ROOT || 'dist'}; tabs=${uniqueLabels.join(' | ')}; v97=disabled; browser errors=0`);
} finally {
  await browser.close().catch(() => {});
  await new Promise(resolve => server.close(resolve));
}

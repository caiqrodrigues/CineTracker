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
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': mime.get(extname(file)) || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});
await new Promise(resolve => server.listen(4175, '127.0.0.1', resolve));

const executablePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
const restPaths = [];
page.on('pageerror', error => errors.push(String(error?.stack || error)));
page.on('console', msg => { if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`); });

await page.route('https://pjmkxryboypluleuuupp.supabase.co/**', async route => {
  const url = new URL(route.request().url());
  if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password') {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwMC1wb3N0LWxvZ2luIiwiZW1haWwiOiJwMEBleGFtcGxlLmNvbSJ9.signature',
      refresh_token: 'p0-refresh-token', expires_in: 3600, token_type: 'bearer',
      user: { id: 'p0-post-login', email: 'p0@example.com' }
    }) });
    return;
  }
  if (url.pathname.startsWith('/rest/v1/')) {
    restPaths.push(url.pathname + url.search);
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
  await page.goto('http://127.0.0.1:4175/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.locator('#auth-form').waitFor({ state: 'visible', timeout: 1200 });
  const guard = await page.evaluate(() => window.__ct97ObserverGuard === true);
  if (!guard) throw new Error('HOTFIX8 observer guard not active before login.');

  await page.locator('#auth-email').fill('p0@example.com');
  await page.locator('#auth-password').fill('password123');
  await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({ state: 'visible', timeout: 1200 });
  await page.waitForTimeout(250);

  const body = await page.locator('body').innerText({ timeout: 800 });
  if (!body.includes('CINETRACKER')) throw new Error('Authenticated shell did not render.');
  if (await page.locator('#auth-form').isVisible().catch(() => false)) throw new Error('Login form remained visible after accepted login.');
  const required = ['media_overrides', 'recommendation_history', 'episode_progress'];
  for (const name of required) {
    if (!restPaths.some(path => path.includes(`/rest/v1/${name}`))) throw new Error(`Post-login hydration never requested ${name}.`);
  }

  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 50)));
  if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
  console.log(`POST_LOGIN_OK root=${process.env.CINETRACKER_TEST_ROOT || 'dist'}; hydration=${required.join(',')}; browser errors=0`);
} finally {
  await browser.close().catch(() => {});
  await new Promise(resolve => server.close(resolve));
}

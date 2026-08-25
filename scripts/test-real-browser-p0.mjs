import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(process.cwd(), 'dist');
const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.json', 'application/json; charset=utf-8'],
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

await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
const executablePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

async function basePage({ poisoned = false } = {}) {
  const context = await browser.newContext();
  if (poisoned) {
    await context.addInitScript(() => {
      localStorage.setItem('cinetracker_session', JSON.stringify({
        access_token: 'aaa.bbb.ccc',
        refresh_token: 'legacy-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { id: 'legacy-user' }
      }));
    });
  }
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));
  page.on('console', msg => {
    if (msg.type() === 'error') pageErrors.push(`console.error: ${msg.text()}`);
  });
  return { context, page, pageErrors };
}

async function startupScenario(name, { poisoned = false, hangAuth = false } = {}) {
  const { context, page, pageErrors } = await basePage({ poisoned });
  if (hangAuth) {
    await page.route('**/auth/v1/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 15000));
      await route.abort().catch(() => {});
    });
  }
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.locator('#auth-form').waitFor({ state: 'visible', timeout: 1000 });
  const reset = await page.evaluate(() => window.__ctP0SessionReset || null);
  if (poisoned && reset !== 'hotfix7-once') throw new Error(`${name}: P0 reset marker missing`);
  const session = await page.evaluate(() => localStorage.getItem('cinetracker_session'));
  if (poisoned && session !== null) throw new Error(`${name}: poisoned legacy session was not removed immediately`);
  await page.waitForTimeout(150);
  if (pageErrors.length) throw new Error(`${name}: browser errors:\n${pageErrors.join('\n')}`);
  console.log(`OK - ${name}: login visible immediately; page errors = 0`);
  await context.close();
}

async function postLoginScenario() {
  const { context, page, pageErrors } = await basePage();
  const fakeUser = { id: 'p0-login-user', email: 'p0@example.com', user_metadata: { display_name: 'P0' } };
  const fakeSession = {
    access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwMC1sb2dpbi11c2VyIn0.signature',
    refresh_token: 'refresh-p0-valid-length-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: fakeUser
  };

  await page.route('**/auth/v1/token?grant_type=password', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeSession) });
  });
  await page.route('**/auth/v1/user', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeUser) });
  });
  await page.route('**/rest/v1/profiles**', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: fakeUser.id, display_name: 'P0', settings: {} }]) });
  });
  await page.route('**/rest/v1/**', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route('**/functions/v1/**', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.locator('#auth-form').waitFor({ state: 'visible', timeout: 1000 });
  await page.locator('#auth-email').fill('p0@example.com');
  await page.locator('#auth-password').fill('correct-password');
  await page.locator('#auth-form button[type="submit"]').click();

  await page.locator('#auth-form').waitFor({ state: 'detached', timeout: 1000 });
  await page.locator('.app').waitFor({ state: 'visible', timeout: 1000 });
  const state = await page.evaluate(() => ({
    userId: window.currentUser?.id || null,
    hasSession: !!window.ctSession?.access_token,
    authVisible: !!document.querySelector('#auth-form'),
    appVisible: !!document.querySelector('.app')
  }));
  if (!state.appVisible || state.authVisible) throw new Error(`post-login: authenticated shell not visible: ${JSON.stringify(state)}`);
  await page.waitForTimeout(150);
  if (pageErrors.length) throw new Error(`post-login: browser errors:\n${pageErrors.join('\n')}`);
  console.log('OK - successful password login: authenticated Home shell visible within 1s; page errors = 0');
  await context.close();
}

try {
  await startupScenario('clean profile');
  await startupScenario('poisoned persisted session with hung Auth', { poisoned: true, hangAuth: true });
  await postLoginScenario();
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

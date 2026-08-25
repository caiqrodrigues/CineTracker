import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(process.cwd(), 'dist');
const originalHtml = await readFile(join(root, 'index.html'), 'utf8');
const patchTags = [...originalHtml.matchAll(/<script src="\/([^"]+\.js)"><\/script>/g)].map(m => m[1]);
const candidates = [];
for (const file of patchTags) {
  const source = await readFile(join(root, file), 'utf8').catch(() => '');
  if (/\brender\b/.test(source)) candidates.push(file);
}

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
]);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    if (url.pathname === '/') {
      const omit = url.searchParams.get('omit');
      let html = originalHtml;
      if (omit) html = html.replace(`<script src="/${omit}"></script>`, '');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(html);
      return;
    }
    const rel = url.pathname.replace(/^\/+/, '');
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

async function run(name, omit = '') {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${String(error?.stack || error)}`));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  await page.route('https://pjmkxryboypluleuuupp.supabase.co/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwMC1wb3N0LWxvZ2luIiwiZW1haWwiOiJwMEBleGFtcGxlLmNvbSJ9.signature',
          refresh_token: 'p0-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: { id: 'p0-post-login', email: 'p0@example.com' }
        })
      });
      return;
    }
    if (url.pathname.startsWith('/rest/v1/profiles')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
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

  let ok = false;
  let body = '';
  try {
    const qs = omit ? `?omit=${encodeURIComponent(omit)}` : '';
    await page.goto(`http://127.0.0.1:4173/${qs}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.locator('#auth-form').waitFor({ state: 'visible', timeout: 1500 });
    await page.locator('#auth-email').fill('p0@example.com');
    await page.locator('#auth-password').fill('password123');
    await page.locator('#auth-form button[type="submit"]').click();
    await page.getByText('O que vamos assistir hoje?', { exact: true }).waitFor({ state: 'visible', timeout: 1800 });
    ok = true;
  } catch (error) {
    errors.push(`driver: ${error?.message || error}`);
  }
  try { body = (await page.locator('body').innerText({ timeout: 800 })).slice(0, 1200); } catch {}
  await context.close().catch(() => {});
  console.log(`RESULT ${ok ? 'PASS' : 'FAIL'} | ${name}${omit ? ` | omit=${omit}` : ''}`);
  if (!ok) {
    console.log(`BODY ${JSON.stringify(body)}`);
    if (errors.length) console.log(`ERRORS ${errors.join(' || ')}`);
  }
  return { ok, errors, body };
}

try {
  const baseline = await run('baseline');
  if (baseline.ok) {
    console.log('DIAGNOSIS baseline already passes; post-login blocker not reproduced.');
    process.exitCode = 2;
  } else {
    console.log(`CANDIDATES ${candidates.join(',')}`);
    const rescuers = [];
    for (const file of candidates) {
      const result = await run(file, file);
      if (result.ok) rescuers.push(file);
    }
    console.log(`RESCUERS ${rescuers.join(',') || 'NONE'}`);
    if (rescuers.length !== 1) process.exitCode = 3;
  }
} finally {
  await browser.close().catch(() => {});
  await new Promise(resolve => server.close(resolve));
}

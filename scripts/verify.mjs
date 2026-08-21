import { readFile } from 'node:fs/promises';
const html = await readFile('apps/web/index.html', 'utf8');
const checks = [
  ['CineTracker', html.includes('CineTracker')],
  ['Supabase', html.includes('supabase')],
  ['TMDB proxy', html.includes('tmdb-proxy')],
  ['Importação', /import/i.test(html)],
  ['Watchlist', /watchlist/i.test(html)],
  ['Login', /Entrar|login/i.test(html)]
];
let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);

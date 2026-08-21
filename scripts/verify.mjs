import { readFile } from 'node:fs/promises';

const html = await readFile('apps/web/index.html', 'utf8');
const patch024 = await readFile('apps/web/patch-v024.js', 'utf8');
const patch025 = await readFile('apps/web/patch-v025.js', 'utf8');
const patch027 = await readFile('apps/web/patch-v027.js', 'utf8');
const patch028 = await readFile('apps/web/patch-v028.js', 'utf8');
const profileSync = await readFile('apps/web/patch-v025-profile-sync.js', 'utf8');
const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const androidGradle = await readFile('apps/android/app/build.gradle', 'utf8');

for (const [name, source] of [['patch-v024.js', patch024], ['patch-v025.js', patch025], ['patch-v027.js', patch027], ['patch-v028.js', patch028], ['patch-v025-profile-sync.js', profileSync]]) {
  try { new Function(source); }
  catch (error) { console.error(`ERRO - sintaxe ${name}: ${error.message}`); process.exit(1); }
}

const checks = [
  ['CineTracker', html.includes('CineTracker')],
  ['Supabase', html.includes('supabase')],
  ['TMDB proxy', html.includes('tmdb-proxy')],
  ['Watchlist', /watchlist/i.test(html)],
  ['Login', /Entrar|login/i.test(html)],
  ['Sidebar 210px', patch025.includes('grid-template-columns:210px')],
  ['Importar dentro das configurações', patch025.includes('ct-v025-import') && patch025.includes('removeImportFromNavigation')],
  ['Exportação JSON', patch025.includes("exportData('json')")],
  ['Exportação ZIP', patch025.includes("exportData('zip')") && patch025.includes('makeZip')],
  ['Preferência de notificações', patch025.includes('notifications_enabled')],
  ['Calendário e filtro pessoal', patch028.includes('Calendário') && patch028.includes('Somente meus') && patch028.includes('personalSet')],
  ['Mais bem avaliados', patch028.includes('Mais bem avaliados') && patch028.includes('/movie/top_rated') && patch028.includes('/tv/top_rated')],
  ['Cards clicáveis', patch028.includes('openMedia') && patch028.includes('bindCards')],
  ['Capas originais', patch028.includes('item.poster_path') && patch028.includes('aspect-ratio:2/3')],
  ['Sinopse e elenco', patch028.includes('overview') && patch028.includes('/credits')],
  ['Filmografia', patch028.includes('/combined_credits') && patch028.includes('Filmografia')],
  ['Streaming sem aluguel/compra', patch028.includes('flatrate') && patch028.includes('Compra e aluguel foram ocultados')],
  ['IMDb id/ficha', patch028.includes('/external_ids') && patch028.includes('imdb.com/title/')],
  ['Sincronização de perfil', profileSync.includes('profiles?id=eq.') && profileSync.includes('window.ctProfile')],
  ['Android produção', androidGradle.includes('https://mycinetracker.vercel.app')],
  ['Android importação nativa', android.includes('onShowFileChooser') && android.includes('ACTION_OPEN_DOCUMENT')],
  ['Android DOM storage', android.includes('setDomStorageEnabled(true)')]
];

let failed = false;
for (const [name, ok] of checks) { console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`); if (!ok) failed = true; }
if (failed) process.exit(1);

import { readFile } from 'node:fs/promises';

const html = await readFile('apps/web/index.html', 'utf8');
const patch024 = await readFile('apps/web/patch-v024.js', 'utf8');
const patch025 = await readFile('apps/web/patch-v025.js', 'utf8');
const patch027 = await readFile('apps/web/patch-v027.js', 'utf8');
const patch028 = await readFile('apps/web/patch-v028.js', 'utf8');
const patch029 = await readFile('apps/web/patch-v029.js', 'utf8');
const profileSync = await readFile('apps/web/patch-v025-profile-sync.js', 'utf8');
const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const androidGradle = await readFile('apps/android/app/build.gradle', 'utf8');

for (const [name, source] of [['patch-v024.js', patch024], ['patch-v025.js', patch025], ['patch-v027.js', patch027], ['patch-v028.js', patch028], ['patch-v029.js', patch029], ['patch-v025-profile-sync.js', profileSync]]) {
  try { new Function(source); }
  catch (error) { console.error(`ERRO - sintaxe ${name}: ${error.message}`); process.exit(1); }
}

const checks = [
  ['CineTracker', html.includes('CineTracker')],
  ['Supabase', html.includes('supabase')],
  ['TMDB proxy', html.includes('tmdb-proxy')],
  ['Watchlist', /watchlist/i.test(html)],
  ['Login', /Entrar|login/i.test(html)],
  ['Calendário', patch028.includes('Calendário')],
  ['Detalhes globais', patch029.includes('.card,.feature') && patch029.includes('openMedia')],
  ['Capas originais globais', patch029.includes('poster_path') && patch029.includes('ct29-hydrated')],
  ['Status de séries', patch029.includes('mapTvStatus') && patch029.includes('Cancelada') && patch029.includes('Finalizada')],
  ['Duração filme/episódio', patch029.includes('min por episódio') && patch029.includes('d.runtime')],
  ['Temporadas e episódios', patch029.includes('/season/') && patch029.includes('Temporadas e episódios')],
  ['Filmografia cronológica', patch029.includes('/combined_credits') && patch029.includes('return db-da')],
  ['Relacionados fora da Watchlist', patch029.includes('watchlistIds') && patch029.includes('/recommendations') && patch029.includes('/similar')],
  ['Streaming somente assinatura', patch029.includes('flatrate') && patch029.includes('Compra e aluguel não são exibidos')],
  ['Elenco clicável', patch029.includes('data-ct29-person')],
  ['Sincronização de perfil', profileSync.includes('profiles?id=eq.')],
  ['Android produção', androidGradle.includes('https://mycinetracker.vercel.app')],
  ['Android importação nativa', android.includes('onShowFileChooser')],
  ['Android DOM storage', android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[name,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true;}if(failed)process.exit(1);

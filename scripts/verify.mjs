import { readFile } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');
const webFiles = [
  'patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v074-hotfix1-version.js',
  'patch-v075-hotfix10-selective.js','patch-v078-hotfix11-import-sync.js','patch-v082-hotfix12-picker-guard.js',
  'patch-v083-hotfix13-bingers-semantics.js','patch-v085-hotfix15-import-transport.js','patch-v087-hotfix16-import-resilience.js',
  'patch-v088-v098-nav-pre.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js',
  'patch-v092-v0991.js','patch-v093-v0992.js','patch-v094-v0992-compat.js','patch-v095-v0992-fix.js',
  'patch-v096-v0992-unfreeze.js','patch-v097-v0993-nav-pre.js','patch-v098-v0993-web.js','service-worker.js'
];
const src = {};
for (const file of webFiles) {
  src[file] = await read(`apps/web/${file}`);
  if (file.endsWith('.js')) {
    try { new Function(src[file]); }
    catch (error) { console.error(`ERRO - sintaxe ${file}: ${error.message}`); process.exit(1); }
  }
}

const pkg = await read('package.json');
const gradle = await read('apps/android/app/build.gradle');
const layout = await read('apps/android/app/src/main/res/layout/activity_main.xml');
const selective = await read('scripts/apply-hotfix10-selective.mjs');
const apply993 = await read('scripts/apply-web-v0993.mjs');
const test993 = await read('scripts/test-web-v0993.mjs');
const prepareAndroid = await read('scripts/prepare-android-hotfix2-web.mjs');
const android = await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
const migration = await read('supabase/migrations/20260827004500_v0992_home_series_movies.sql');
const backupEdge = await read('supabase/functions/ct-backup-user/index.ts');
const bingersEdge = await read('supabase/functions/ct-import-bingers-user/index.ts');
const rules = await read('docs/DEVELOPMENT_RULES.md');

const p91 = src['patch-v061-v091.js'];
const p92 = src['patch-v063-v092.js'];
const v98 = src['patch-v089-v098.js'];
const v99 = src['patch-v091-v099-profile-lru.js'];
const v991 = src['patch-v092-v0991.js'];
const v992 = src['patch-v093-v0992.js'];
const v992c = src['patch-v094-v0992-compat.js'];
const fix = src['patch-v095-v0992-fix.js'];
const unfreeze = src['patch-v096-v0992-unfreeze.js'];
const pre993 = src['patch-v097-v0993-nav-pre.js'];
const web993 = src['patch-v098-v0993-web.js'];
const sem = src['patch-v083-hotfix13-bingers-semantics.js'];
const h16 = src['patch-v087-hotfix16-import-resilience.js'];
const sw = src['service-worker.js'];

const checks = [
  ['package Web 0.99.3', pkg.includes('"version": "0.99.3"')],
  ['cache Web 0.99.3', sw.includes("ct-web-0.99.3") && !sw.includes('index.html')],
  ['Android permanece 0.99.2.3 / code 9923', gradle.includes("versionName '0.99.2.3'") && gradle.includes('versionCode 9923')],
  ['Histórico continua oculto no layout Android', layout.includes('nav_history') && layout.includes('android:visibility="gone"')],
  ['runtime 0.99.2 preservado', selective.includes("const unfreeze992='patch-v096-v0992-unfreeze.js'") && !selective.includes("'patch-v068-v097.js'")],
  ['Web 0.99.3 pré-gate antes do FIX', apply993.includes('html.replace(fixTag, `${preTag}${fixTag}`)') && apply993.includes('html.indexOf(preTag) >= html.indexOf(fixTag)')],
  ['Web 0.99.3 camada final depois do FIX2', apply993.includes("patch-v098-v0993-web.js") && apply993.includes('html.indexOf(postTag) <= html.indexOf(unfreezeTag)')],
  ['pré-gate 0.99.3 captura navegação', pre993.includes("window.addEventListener('click'") && pre993.includes('stopImmediatePropagation') && pre993.includes('__ct0993Navigate')],
  ['pré-gate 0.99.3 captura tabs e filtros Descobrir', pre993.includes('data-dtab991') && pre993.includes('data-dfilter991') && pre993.includes('discover-tab') && pre993.includes('discover-filter')],
  ['diagnóstico de console e exceções', pre993.includes('console.log') && pre993.includes("window.addEventListener('error'") && pre993.includes('unhandledrejection')],
  ['sidebar final só tem quatro destinos', ['home','discover','profile','settings'].every(v => web993.includes(`view:'${v}'`)) && !web993.includes("view:'history'")],
  ['Histórico removido defensivamente', web993.includes('purgeHistory993') && web993.includes("target === 'history'")],
  ['pointer events Descobrir protegidos', web993.includes('.ct991-discover-tabs') && web993.includes('.ct991-discover-filters') && web993.includes('pointer-events:auto')],
  ['Pra Você tem fallback orientado', web993.includes('Nenhum título elegível') && web993.includes('Atualizar recomendações') && web993.includes('Importar / sincronizar dados')],
  ['rodapé Web 0.99.3', web993.includes('CineTracker • v0.99.3') && web993.includes("window.__ctWebBuild = '0.99.3'")],
  ['observer 0.99.3 usa debounce e reconciliação idempotente', web993.includes('MutationObserver(schedule993)') && web993.includes('footer.textContent !==') && web993.includes('const valid = existing.length === definitions993.length')],
  ['teste funcional 0.99.3 cobre quatro rotas', test993.includes("['home', 'discover', 'profile', 'settings']") && test993.includes('Discover tab handler must run exactly once') && test993.includes('Discover filter handler must run exactly once')],
  ['FIX2 anti-freeze preservado', unfreeze.includes('fix2-idempotent-dom-mutation-guard') && unfreeze.includes('__ctTextContentIdempotent992')],
  ['hardening de escrita preservado', fix.includes("['watch_history','episode_progress','media_overrides'].includes(table)") && fix.includes('v.profile_id=pid') && fix.includes("table==='media'&&!v.media_kind")],
  ['Perfil strict-mode preservado', fix.includes("if (!('days' in window)) window.days=[]") && v991.includes('days=[]')],
  ['Home Séries 0.99.2 preservada', ['Assistir a seguir','Juntando poeira','Em dia','Não Iniciadas / Watchlist','Concluídas'].every(x => v992.includes(x))],
  ['Pull-to-Reveal preservado', v992.includes('Histórico oculto · puxe para baixo para revelar') && v992.includes('Vistos ocultos · puxe para baixo para revelar')],
  ['quick mark preservado', v992.includes("sbApi('watch_history'") && v992.includes("sbApi('episode_progress'") && v992.includes('quick-episode-v0.99.2')],
  ['Escolha para Hoje preservada', v992.includes('Escolha para Hoje') && v992.includes('daily_movie_recommendations_v0992') && v992c.includes("media_kind:'movie'")],
  ['Perfil/Pra Você 0.99.1 preservados', v991.includes('Consumo temporal') && v991.includes('Indicação geral da Watchlist') && v991.includes('100% Novos') && v99.includes('last_watched_at')],
  ['episódios ricos e confirmação inteligente preservados', p91.includes('ep.still_path') && p91.includes('Você já assistiu aos episódios anteriores')],
  ['cinegrafia de ator preservada', p92.includes('<h2>Filmes</h2>') && p92.includes('<h2>Séries</h2>') && p92.includes('ct92-person-carousel')],
  ['Backup preservado', v98.includes('id="ct98-export">Exportar</button>') && backupEdge.includes("action==='snapshot'") && backupEdge.includes("action==='restore'")],
  ['Bingers preservado', sem.includes('movie_plays') && h16.includes('client_run_id') && bingersEdge.includes('CURSOR_MISMATCH')],
  ['backend Home seguro preservado', migration.includes('cinetracker_profile_home_dashboard_v0992') && migration.includes('security invoker') && migration.includes('auth.uid()') && migration.includes('enable row level security')],
  ['Android continua runtime local e identidade publicada', prepareAndroid.includes('v0.99.2.3-fix2-unfreeze-authoritative') && android.includes('loadDataWithBaseURL') && !android.includes('webView.loadUrl(runtimeUrl')],
  ['governança vigente', rules.includes('Toda atualização ou mudança do CineTracker deve gerar registro no GitHub') && rules.includes('Toda tabela nova com dados por usuário')]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);

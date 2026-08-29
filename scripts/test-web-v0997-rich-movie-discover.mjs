import { readFile } from 'node:fs/promises';
const js=await readFile('dist/patch-v131-v0997-rich-movie-discover.js','utf8');
const checks=[
  ['seis abas', "['new','Novidades']"],
  ['mais aguardados após novidades', "['anticipated','Mais Aguardados']"],
  ['janela 30 dias', 'const lo=shiftDays(-30),hi=todayKey();'],
  ['novidades inclusivas', 'd&&d>=lo&&d<=hi'],
  ['novidades desc', 'dateOf(b).localeCompare(dateOf(a))'],
  ['futuro começa amanhã', 'const tomorrow=shiftDays(1);'],
  ['futuro estrito', 'dateOf(x)>today'],
  ['aguardados asc', 'dateOf(a).localeCompare(dateOf(b))'],
  ['data legível', 'Estreia: ${esc(formatRelease(date))}'],
  ['documentário/drama puro', 'g.length===1&&(g[0]===18||g[0]===99)'],
  ['exclusão histórico/watchlist', '!known(x,c)'],
  ['relacionados seguros', 'valid(x)&&!known(x,c)'],
  ['ator abre obra', '[data-ct118-credit]'],
  ['detalhe rico', 'ct131-movie-hero'],
  ['onde assistir', 'Onde Assistir'],
  ['filmes relacionados', 'Filmes Relacionados']
];
for(const [name,needle] of checks)if(!js.includes(needle))throw new Error(`v131 missing: ${name}`);
if(js.includes('shiftDays(540)')||js.includes("release_date.lte':future"))throw new Error('v131 awaited query must have no upper date ceiling');
const tabs=(js.match(/\['(?:foryou|trending|popular|top|new|anticipated)','[^']+'\]/g)||[]);
if(tabs.length!==6)throw new Error(`v131 expected 6 discover tabs, got ${tabs.length}`);
await import('./test-web-v0997-r131c-targeted-corrections.mjs');
await import('./test-web-v0997-r131d-real-data-path.mjs');
await import('./test-web-v0997-r131e-enable-runtime.mjs');
console.log('Web v131 checks OK + r131c/r131d/r131e targeted checks OK');

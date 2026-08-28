import { readFile } from 'node:fs/promises';
const js=await readFile('apps/web/patch-v131-v0997-rich-movie-discover.js','utf8');
const checks=[
  ['seis abas', "['new','Novidades']"],
  ['mais aguardados após novidades', "['anticipated','Mais Aguardados']"],
  ['janela 30 dias', 'const lo=shiftDays(-30),hi=todayKey();'],
  ['novidades inclusivas', 'd&&d>=lo&&d<=hi'],
  ['novidades desc', 'dateOf(b).localeCompare(dateOf(a))'],
  ['futuro começa amanhã', 'const tomorrow=shiftDays(1),future=shiftDays(540);'],
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
const tabs=(js.match(/\['(?:foryou|trending|popular|top|new|anticipated)','[^']+'\]/g)||[]);
if(tabs.length!==6)throw new Error(`v131 expected 6 discover tabs, got ${tabs.length}`);
console.log('Web v131 checks OK');

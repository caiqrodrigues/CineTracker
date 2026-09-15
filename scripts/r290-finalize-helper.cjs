const fs=require('node:fs');
const path='CHANGELOG.md';
let s=fs.readFileSync(path,'utf8');
const marker='## 1.0.81 — 2026-09-15 — Web r290';
if(!s.includes(marker)){
  const idx=s.indexOf('\n\n## ');
  if(idx<0) throw new Error('CHANGELOG insertion point not found');
  const section=`\n\n## 1.0.81 — 2026-09-15 — Web r290\n\n### Cards de mídia / padrão Indicação do Dia\n- Todos os cards poster-based de filmes, séries e animes passam a compartilhar a geometria exata da Indicação do Dia: pôster 2:3 de 176×264 px no desktop e 154×231 px no mobile.\n- O container do card, a área clicável e o bloco de texto ficam dimensionalmente travados. Títulos usam no máximo duas linhas; ano, gêneros/tipo e nota ficam em uma linha truncada.\n- A normalização compartilhada também cobre cards criados depois do primeiro paint, sem alterar o Android.\n\n### Descobrir\n- \`Da sua Watchlist\` e \`100% Novos\` mantêm Filme, Série e Anime em três cards verticais do tamanho padrão, sem esticar por largura disponível ou por quantidade de texto.\n- \`Top 10\`, \`Em alta\`, \`Populares\`, \`Novidades\`, \`Lançamentos\`, \`Mais Aguardados\`, \`Mais bem avaliados\` e \`Calendário\` passam a usar exclusivamente o card vertical uniforme.\n- O Top 10 deixa de recorrer ao renderer legado de faixa/banner e recebe o mesmo card vertical dos demais trilhos.\n- \`Ver mais\` pode expandir para grid, mas cada célula mantém exatamente a mesma largura do card da Indicação do Dia.\n\n### Build / validação\n- Web atualizada para \`1.0.81 / r290-official-1.0.81\`; Android permanece \`1.0.20 / versionCode 10062\`.\n- Chromium valida 420 px e 1200 px, as nove sub-abas do Descobrir, card genérico fora do Descobrir, Top 10 sem banner, pôster 2:3, container travado, título \`line-clamp-2\` e metadados em uma linha.\n- Bundle final exato e identidade da release são exigidos antes da promoção para \`main\`.\n`;
  s=s.slice(0,idx)+section+s.slice(idx);
  fs.writeFileSync(path,s,'utf8');
}
if(!fs.readFileSync(path,'utf8').includes(marker)) throw new Error('CHANGELOG r290 marker missing');
console.log('R290_CHANGELOG_READY');

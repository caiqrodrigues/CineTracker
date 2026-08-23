# CineTracker Web 0.4.8

## Objetivo

Levar para a Web as funcionalidades consolidadas no Android 0.0.48 que ainda não estavam disponíveis ou estavam incompletas, mantendo a experiência adequada ao navegador. Notificações nativas Android não fazem parte desta versão Web.

## Paridade Web / Android

A Web 0.4.8 passa a compartilhar com o Android a mesma lógica de acompanhamento, progresso, metadados, histórico e Tempo de Tela através do Supabase e TMDB.

### Perfil / Tempo de Tela

- remove o gráfico antigo de atividade por horário e o conceito visual de `Horário de pico`;
- gráfico principal passa a ser atividade diária em dark mode;
- sete dias ficam visíveis por vez, com hoje centralizado entre três dias anteriores e três posteriores;
- navegação horizontal permite consultar até 15 dias anteriores;
- tocar/clicar em um dia abre o detalhamento do que foi assistido;
- dados vêm de `cinetracker_watch_daily_timeline` e `cinetracker_watch_day_details`.

### Assistir

- `Carrossel` é o modo inicial e a escolha fica persistida no navegador;
- modos `Grade` e `Lista` continuam disponíveis;
- séries são separadas fisicamente em `Em dia`, `Acompanhando`, `Juntando poeira` e `Não iniciadas`;
- a abertura posiciona a tela em `Acompanhando`, mantendo `Em dia` acima;
- cards de séries e filmes são clicáveis;
- série abre a página de detalhes e temporadas;
- temporada expande episódios;
- episódio possui página própria;
- episódios podem ser marcados e desmarcados como assistidos com persistência no Supabase;
- utiliza `cinetracker_continue_items_v2`, `cinetracker_episode_state` e `cinetracker_set_episode_watched`.

### Descobrir

- catálogo compacto em três colunas nos grids principais;
- posters em proporção 2:3;
- metadados adaptados para manter legibilidade sem aumentar o custo de renderização.

### Configurações

Mantém as funções Web já existentes e passa a apresentar somente a versão Web correta:

- alteração de e-mail;
- alteração de senha;
- importação;
- exportação de backup completo;
- versão exibida como `CineTracker Web 0.4.8`.

### Capas e nomes

O resolvedor global `patch-v045.js` permanece ativo e é executado antes da camada de paridade 0.4.8. Ele prioriza dados persistidos, usa cache local e consulta o TMDB somente quando necessário.

## Otimização

- a nova camada final usa cache para séries, filmes e timeline;
- não cria polling periódico adicional;
- alterações de DOM são agrupadas com `MutationObserver` + `requestAnimationFrame`;
- metadados já resolvidos continuam reaproveitados pelo cache existente;
- o modo de exibição escolhido em Assistir é persistido em `localStorage`.

## Diferença intencional para Android

Notificações de lançamentos e novos episódios continuam exclusivas do Android, pois dependem de WorkManager e canal de notificação nativo. A Web não replica esse subsistema nesta versão.

## Arquivos principais

- `apps/web/patch-v046.js` — camada final de paridade;
- `apps/web/patch-v045.js` — resolvedor global de nomes e capas;
- `scripts/build-web.mjs` — injeta `patch-v046.js` por último;
- `package.json` — versão `0.4.8`.

## Validação

Implementação em código não equivale a validação visual. A versão deve ser conferida no deploy Web real após a publicação da plataforma, incluindo Perfil, Assistir, Descobrir, Configurações e marcação persistente de episódios.

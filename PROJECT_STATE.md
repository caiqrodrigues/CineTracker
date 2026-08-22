# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-22  
**Branch principal:** `main`  
**Android em desenvolvimento:** `0.0.44`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas e descoberta de conteúdo.

## 2. Integrações

- TMDB: títulos, capas, elenco, imagens e metadados oficiais.
- Supabase: Auth, PostgreSQL, RLS, progresso, histórico e sincronização.
- GitHub: código, documentação, Releases e CI/CD.
- Vercel: publicação Web.

## 3. Regras de domínio

Não criar tabela separada `CompletedSeries`. Conclusão deve ser derivada de progresso importado/manual + metadados oficiais. Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

## 4. Estatísticas obrigatórias

- filmes assistidos;
- séries com histórico/concluídas/em andamento;
- episódios assistidos;
- tempo de filmes, séries e total;
- Tempo de Tela diário com interação por data.

## 5. Estado Android 0.0.44

Implementado, aguardando validação real após build/instalação:

- gráfico diário em dark mode como único gráfico de Tempo de Tela;
- Descobrir com três cards por linha;
- Assistir organizado em `Em dia` → `Acompanhando` → `Juntando poeira` → `Não iniciadas`, abrindo posicionado em `Acompanhando`;
- Carrossel como modo padrão, além de Grade e Lista;
- abertura de série, temporadas e episódios;
- tela de episódio;
- marcar/desmarcar episódio como assistido;
- RPCs `cinetracker_episode_state` e `cinetracker_set_episode_watched` para persistência manual e sincronização com histórico.

## 6. Regra de validação

Implementado/compilado não significa validado. Android, instalação, atualização, GitHub Actions e comportamento visual só são considerados validados após teste real correspondente.

## 7. Regra de documentação e publicação

Toda nova versão deve atualizar o projeto no GitHub, não apenas anexar o APK. O pacote mínimo de release é:

1. código-fonte;
2. versão Gradle;
3. workflow de build;
4. `README.md` quando arquitetura/recursos mudarem;
5. `VERSIONS.md`;
6. `PROJECT_STATE.md`;
7. `docs/releases/<versão>.md`;
8. `CHANGELOG.md` quando aplicável;
9. Release GitHub + APK;
10. status `Android Build` concluído.

## 8. Pendências que exigem teste do usuário

- confirmar que o gráfico antigo foi totalmente removido;
- confirmar 3 cards por linha em todas as categorias de Descobrir;
- confirmar posição inicial em Acompanhando e ordem das seções;
- confirmar persistência Carrossel/Grade/Lista;
- confirmar abertura série → temporada → episódio;
- confirmar marcar/desmarcar visto e reflexo no histórico/estatísticas;
- continuar validando nomes e capas em todas as telas.

## 9. Continuidade

Antes de alterações importantes: ler este arquivo, conferir commits/builds atuais, preservar decisões arquiteturais e registrar separadamente implementação, compilação e validação real.

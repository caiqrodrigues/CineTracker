# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-22  
**Branch principal:** `main`  
**Android em desenvolvimento:** `0.0.45`

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

## 5. Correção arquitetural Android 0.0.45

A 0.0.44 compilava a partir de um `MainActivity.java` antigo e o workflow reescrevia esse arquivo temporariamente, além de empilhar módulos Android de várias versões. Isso permitia uma build `success` sem garantir que a experiência instalada refletisse as alterações pretendidas.

A 0.0.45 muda essa regra:

- `MainActivity.java` no repositório já é a Activity real da versão 0.0.45;
- o workflow não reescreve mais a Activity durante a compilação;
- o Java compila diretamente o código versionado;
- módulos conflitantes `ct40.js`, `ct42.js` e `ct44.js` deixam de ser carregados pela Activity;
- o módulo final de comportamento é `ct45.js`;
- `versionCode = 45` e `versionName = 0.0.45`.

## 6. Comportamento implementado na 0.0.45

### Tempo de Tela

- remover/ocultar gráfico antigo de atividade por horário;
- manter a experiência diária em dark mode;
- evitar cards/botões brancos herdados do estilo padrão do WebView.

### Descobrir

- três cards por linha;
- posters compactos em proporção 2:3;
- regra aplicada ao grid padrão usado pelas diferentes categorias/filtros de Descobrir.

### Assistir

- Carrossel como modo inicial/padrão;
- modos alternativos Grade e Lista;
- ordem física: `Em dia` → `Acompanhando` → `Juntando poeira` → `Não iniciadas`;
- abertura posicionada automaticamente em `Acompanhando`, permitindo subir para `Em dia` e descer para as demais seções;
- cards de série e filme clicáveis;
- série abre detalhes;
- temporadas expansíveis;
- episódios clicáveis;
- tela própria de episódio;
- marcar/desmarcar episódio como assistido;
- persistência via Supabase.

## 7. Backend de episódios

RPCs utilizados:

- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`

A persistência usa `episode_progress` e atualiza o estado manual do episódio por perfil.

## 8. Regra de validação

Implementado/compilado não significa validado. Android, instalação, atualização, GitHub Actions e comportamento visual só são considerados validados após teste real correspondente.

## 9. Regra de documentação e publicação

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

## 10. Pendências que exigem teste real

- confirmar visualmente remoção total do gráfico antigo;
- confirmar 3 cards por linha em todas as categorias de Descobrir;
- confirmar posição inicial em Acompanhando e ordem correta das seções;
- confirmar Carrossel/Grade/Lista;
- confirmar abertura série → temporada → episódio;
- confirmar marcação/desmarcação e persistência após reabrir;
- continuar validando nomes e capas em todas as telas.

## 11. Continuidade

Antes de alterações importantes: ler este arquivo, conferir commits/builds atuais, preservar decisões arquiteturais e registrar separadamente implementação, compilação e validação real.

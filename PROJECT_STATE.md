# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-27  
**Branch principal:** `main`  
**Branch de trabalho:** `feat/v0.99.2`  
**Release lógica em preparação:** `0.99.2 FIX`  
**Web:** source `0.99.2`, aguardando merge/deploy final  
**Android:** source `0.99.2` (`versionCode 9912`), aguardando build/release final  
**Backend lógico:** `0.99.2`, migration Home aplicada no Supabase  
**Windows:** não lançado

## 1. Governança

Toda nova unidade lógica de atualização/mudança deve possuir versão e registro no GitHub. Como a 0.99.2 ainda não havia sido publicada, as correções encontradas por vídeo/prints permanecem na mesma unidade **0.99.2 FIX** em vez de criar uma versão artificialmente nova. Source, CI, deploy, APK publicado e teste real são estados diferentes.

## 2. Evidência que bloqueou a primeira tentativa da 0.99.2

O vídeo e os prints reais mostraram:
- produção ainda em `CineTracker • v0.99.1`;
- sidebar com destinos duplicados e Histórico legado;
- Home antiga em vez da Home 0.99.2;
- Perfil falhando com `days is not defined`;
- navegador Android conseguia clicar, mas no desktop handlers capture legados bloqueavam botões;
- recursos existentes no source não estavam efetivamente autoritativos no DOM final.

A partir disso, a 0.99.2 anterior foi tratada como **não concluída**.

## 3. Runtime final obrigatório

A pilha compartilhada termina em:
1. base v95 + recuperações estáveis;
2. 0.98 navegação/config/backup;
3. 0.99 Perfil LRU;
4. `patch-v092-v0991.js` — recursos 0.99.1;
5. `patch-v093-v0992.js` — Home Séries/Filmes 0.99.2;
6. `patch-v094-v0992-compat.js` — compatibilidade de detalhe/recomendação;
7. **`patch-v095-v0992-fix.js` — camada final autoritativa.**

A overlay global `patch-v068-v097.js` continua desativada.

## 4. O que `patch-v095-v0992-fix.js` resolve

- navegação em `window` capture para executar antes dos listeners antigos de `document`;
- rebinding de `ct0992Navigate`, `ct991Navigate` e `ct98Navigate` para uma única rota;
- sidebar/mobile-nav reconciliadas para exatamente Home, Descobrir, Perfil e Configurações;
- Histórico permanece dentro do Perfil e não volta ao menu;
- binding global compatível corrige o crash `days is not defined` da timeline 0.99.1;
- wrapper de `sbApi` injeta `profile_id` autenticado em inserts pessoais que os patches legados omitiam;
- inserts de `media` sem `media_kind` passam a receber `movie`, `series` ou `anime` inferido;
- cabeçalhos Séries/Séries favoritas/Filmes/Filmes favoritos voltam a abrir visão completa;
- rodapé final autoritativo: `CineTracker • v0.99.2`;
- rota atual é re-renderizada depois que os patches antigos terminam de inicializar.

## 5. Perfil consolidado da 0.99.1

Mantidos/recuperados:
- estatísticas principais compactas;
- Tempo Total em largura dupla;
- timeline temporal com Hoje centralizado e detalhe por data;
- quatro seções: Séries, Séries favoritas, Filmes, Filmes favoritos;
- filtros de status e Carrossel/Grade/Lista;
- Não Iniciadas = Watchlist sem progresso;
- expansão completa de Séries/Filmes/Favoritos;
- favorito no detalhe;
- quatro métricas extras solicitadas;
- Pra Você com 7 slots, ano >1990 e nota >=7,8;
- Calendário por último com Geral/Séries/Filmes;
- cards ricos de episódios e marcação inteligente dos anteriores;
- cinegrafia de ator separada em Filmes/Séries;
- Bingers dentro de Importar Dados.

## 6. Home 0.99.2 — Séries

Viewport vertical com histórico acima do ponto inicial para Pull-to-Reveal.

Ordem:
1. Assistir a seguir — iniciada, com pendência e atividade <=30 dias, ou movida por novo episódio;
2. Juntando poeira — pendência e atividade >30 dias;
3. Em dia — sem episódio lançado pendente e não concluída;
4. Não Iniciadas / Watchlist — 0 episódios vistos;
5. Concluídas — estado `Completed`.

Cards: pôster 2:3, título, próximo `Sxx Exx`, assistidos/lançados, faltantes, nome/nota do próximo episódio e ação ✓.

Quick mark grava `watch_history` + `episode_progress`, atualiza `last_watched_at`, avança episódio, reordena LRU e move para Em dia quando zeram pendências.

## 7. Sincronização de lançamentos

`syncReleaseStates()` roda no primeiro uso do dia, retorno de visibilidade e atualização do Calendário. Séries com TMDB oficial em UpToDate/InProgress são conciliadas com episódios já lançados. Se existe novo episódio lançado, UpToDate -> InProgress e o card recebe **Novo Episódio**. Surrogates TMDB <=0 não são consultados.

## 8. Home 0.99.2 — Filmes

- histórico Vistos oculto por Pull-to-Reveal;
- Escolha para Hoje com rating >=8,0, nunca visto e persistência por perfil/data;
- sem repetição de TMDB já recomendado ao perfil;
- Watchlist abaixo da recomendação;
- quick mark grava histórico + `AlreadySeen`.

## 9. Backend 0.99.2

Migration aplicada: `supabase/migrations/20260827004500_v0992_home_series_movies.sql`.

- RPC `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- tabela `daily_movie_recommendations_v0992` — RLS, PK perfil/data, unique perfil/TMDB.

## 10. Reatividade pós-importação

Home refaz leitura ao abrir, alternar Séries/Filmes, receber `cinetracker:data-changed`, recuperar visibilidade e detectar conclusão visual de importação. Atualizar Calendário também força a checagem de lançamentos.

## 11. Identidade

Web:
- package `0.99.2`;
- cache `ct-web-0.99.2`;
- patch final `patch-v095-v0992-fix.js`;
- rodapé `CineTracker • v0.99.2`.

Android:
- `applicationId com.cinetracker.app`;
- `versionName 0.99.2`;
- `versionCode 9912`;
- bundle `v0.99.2-fix-991-992-authoritative`;
- workflow `.github/workflows/build-android-v0992.yml`;
- release alvo `android-v0.99.2`.

## 12. Validação ainda não encerrada

Não marcar como concluído até haver evidência:
- Verify do head final do PR;
- merge PR #21;
- Verify da main;
- deploy Vercel main;
- build/assinatura/artifact/release Android;
- navegação desktop real;
- Perfil real sem crash;
- Pull-to-Reveal, quick mark, LRU e transições reais;
- instalação do APK em Android real.

Ver `docs/validation/0.99.2.md`.

## 13. Débitos conhecidos

- surrogate negativo em `media.tmdb_id` ainda existe para parte da importação; caminhos recentes bloqueiam chamadas externas inválidas;
- advisories históricos Supabase continuam documentados;
- AGP 8.5.2 vs compileSdk 35 continua emitindo warning apesar de builds anteriores concluírem.

## 14. Documentos canônicos

- `README.md`;
- `VERSIONS.md`;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SECURITY.md`;
- `docs/releases/0.99.2.md`;
- `docs/validation/0.99.2.md`.

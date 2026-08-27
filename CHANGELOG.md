# Changelog

Todas as mudanças relevantes do CineTracker são registradas aqui. A partir do HOTFIX18, toda nova unidade lógica de mudança exige versão e registro completo conforme `docs/DEVELOPMENT_RULES.md`.

## 0.99.2 FIX — 2026-08-27

### Evidência real / bloqueio da primeira tentativa
- Vídeo e prints reais mostraram que a produção continuava em `CineTracker • v0.99.1`, portanto a primeira implementação 0.99.2 não foi considerada publicada.
- Sidebar Web podia exibir Histórico legado e duplicar Perfil/Configurações.
- Home antiga ainda podia permanecer visível apesar dos patches 0.99.2 existirem no source.
- Perfil falhava com `days is not defined`.
- Navegação funcionava no navegador Android, mas handlers capture legados com `stopImmediatePropagation` podiam bloquear os botões no navegador desktop.
- A governança foi reforçada: marker/arquivo/CI verde não substitui validação do DOM e do comportamento final.

### Runtime autoritativo
- Criado `patch-v095-v0992-fix.js` como última camada obrigatória de Web e Android.
- Gate de navegação movido para `window` no capture phase, executando antes dos listeners antigos em `document`.
- `ct0992Navigate`, `ct991Navigate` e `ct98Navigate` passam a apontar para uma rota única.
- Sidebar/mobile-nav são reconciliadas para exatamente Home, Descobrir, Perfil e Configurações; Histórico continua integrado ao Perfil.
- A rota corrente é re-renderizada após a inicialização das camadas legadas para impedir que uma tela antiga vença a camada final.
- Rodapé final permanece `CineTracker • v0.99.2`.

### Recuperação integral da 0.99.1
- Corrigido o crash de timeline `days is not defined` por binding global compatível, sem reativar a overlay v97.
- Preservados estatísticas compactas, Tempo Total duplo, timeline com Hoje centralizado e detalhe por dia, filtros de status/layout, quatro métricas extras, favoritos, Pra Você com 7 slots, Calendário por último, episódios ricos, marcação inteligente, cinegrafia de ator e Bingers em Importar Dados.
- Recuperados os cabeçalhos clicáveis `Séries ›`, `Séries favoritas ›`, `Filmes ›` e `Filmes favoritos ›` e suas visões completas.

### Contrato de banco no cliente
- Wrapper final de `sbApi` adiciona o `profile_id` autenticado em POSTs de `watch_history`, `episode_progress` e `media_overrides` quando patches legados omitem o campo exigido pelo schema/RLS.
- Inserts legados de `media` recebem `media_kind` quando ausente (`movie`, `series` ou `anime`).
- Valores explicitamente fornecidos continuam preservados; nenhuma credencial privilegiada foi adicionada ao cliente.

### Android / CI
- Bundle alvo alterado para `v0.99.2-fix-991-992-authoritative`.
- `prepare-android-hotfix2-web.mjs`, smoke inline, Verify e pipeline Android agora exigem `patch-v095-v0992-fix.js` por último e o marker `__ct0992FixLoaded`.
- Android continua `versionName 0.99.2`, `versionCode 9912`; a release só é publicada após merge/CI/build/assinatura reais.

## 0.99.2 — 2026-08-26

### Home / Séries
- Criada camada autoritativa `patch-v093-v0992.js` para Web e runtime Android embarcado.
- Home de Séries passa a usar lista vertical contínua com histórico de episódios oculto acima do ponto inicial e revelado por Pull-to-Reveal/scroll superior.
- Ordem oficial: Assistir a seguir, Juntando poeira, Em dia, Não Iniciadas / Watchlist e Concluídas.
- Assistir a seguir usa séries iniciadas com pendências lançadas e última atividade em até 30 dias; Juntando poeira usa mais de 30 dias.
- Cards em linha usam pôster 2:3, título, próximo Sxx Exx, progresso assistidos/lançados, faltantes, nome e nota do próximo episódio e ação circular ✓.
- Quick mark grava `watch_history`, sincroniza `episode_progress`, atualiza o marcador de detalhe quando presente, avança o próximo episódio e reordena por `last_watched_at DESC`.
- Ao zerar pendências lançadas, a série migra para Em dia.

### Sincronização de lançamentos
- Adicionada checagem diária de metadados TMDB para séries Em dia/Em andamento.
- A checagem roda no primeiro uso do dia, retorno de visibilidade e atualização do Calendário.
- Quando um novo episódio com `air_date <= hoje` aparece, a série sai de UpToDate, recebe InProgress system, vai para Assistir a seguir e recebe badge Novo Episódio.
- IDs TMDB substitutos negativos continuam bloqueados para chamadas externas.

### Home / Filmes
- Histórico Vistos passa a ficar oculto acima do ponto inicial e é revelado por Pull-to-Reveal.
- Adicionada Escolha para Hoje com 1 filme por data, nota >=8.0, nunca visto e sem repetição por perfil/TMDB.
- Criada persistência `daily_movie_recommendations_v0992` com RLS e unicidade por perfil/TMDB.
- Assistir a seguir / Watchlist exibe pôster, ano, duração, sinopse curta e ação ✓.
- Quick mark grava histórico e `AlreadySeen` com timestamp atual.

### Backend
- Migration `20260827004500_v0992_home_series_movies.sql` aplicada ao Supabase.
- Criada RPC `cinetracker_profile_home_dashboard_v0992()` como `SECURITY INVOKER` e escopo `auth.uid()`.
- RPC expõe último S/E assistido, `last_watched_at`, plays, estados, metadados e progresso necessários à Home.
- Nova tabela de recomendação diária possui RLS select/insert por `profile_id = auth.uid()`.

### Reatividade / importação
- Home força nova leitura ao abrir e ao alternar Séries/Filmes.
- `cinetracker:data-changed`, retorno de visibilidade e conclusão visual de importação invalidam o cache da Home.
- Dados Bingers recém-importados passam a aparecer na Home sem refresh manual ao retornar/alternar a aba.

### Versionamento / CI
- Web: package `0.99.2`, cache `ct-web-0.99.2`, rodapé `CineTracker • v0.99.2`.
- Android: `versionName 0.99.2`, `versionCode 9912`, bundle `v0.99.2-home-series-movies-v95-core-inline-authoritative`.
- Criado workflow `build-android-v0992.yml`, release alvo `android-v0.99.2` e novos invariantes de Verify/inline smoke.
- Criados `docs/releases/0.99.2.md` e `docs/validation/0.99.2.md`.

## 0.99.1 — 2026-08-26

### Estabilidade / Perfil / Descobrir
- Perfil estabilizado com carregamento single-flight e sem polling periódico na camada final.
- Descobrir passa sempre a abrir em Pra Você.
- Perfil recebe Tempo Total em largura dupla, timeline de 7 dias com Hoje centralizado, detalhe por dia, filtros de status/layout, favoritos e quatro métricas extras.
- Pra Você restaurado com exatamente 7 posições, ano >1990 e nota >=7.8.
- Calendário permanece por último com filtros Geral/Séries/Filmes.
- Cards ricos de episódios, confirmação inteligente de episódios anteriores e cinegrafia do ator em dois carrosséis permanecem preservados.
- Bingers é organizado dentro de Importar Dados.
- Criada RPC `cinetracker_profile_media_dashboard_v0991()` e versionamento Web/Android `0.99.1` / `versionCode 9911`.
- Release Android `android-v0.99.1` publicada após CI e build aprovados.

## 0.0.99 — 2026-08-26

### Perfil / biblioteca pessoal
- Adicionada camada final `patch-v091-v099-profile-lru.js` para Web e runtime Android embarcado.
- Perfil passa a exibir, imediatamente abaixo das estatísticas, quatro carrosséis horizontais: Séries, Séries favoritas, Filmes e Filmes favoritos.
- Cards usam proporção 2:3, título, progresso, badge de favorito e última atividade.
- Cards com TMDB oficial abrem a tela global de detalhes; surrogate IDs negativos abrem detalhe local sem enviar ID inválido à TMDB.

### LRU e sincronização
- Nova RPC `cinetracker_profile_media_dashboard()` consolida histórico, progresso e overrides do usuário.
- Ordenação dos carrosséis e grids usa `last_watched_at DESC` com desempate por `media_id DESC`.
- `last_watched_at` considera `watch_history.watched_at`, `episode_progress.watched_at` e `media_overrides.watched_at` para `AlreadySeen` de filmes.
- Escritas em `watch_history`, `episode_progress` e `media_overrides` disparam atualização reativa do Perfil.
- Foco/visibilidade e reconciliação periódica enquanto o Perfil está visível funcionam como fallback para alterações externas.

### Subtelas
- `Séries ›`: Em andamento, Não iniciadas, Assistir mais tarde / Watchlist, Em dia e Concluídas.
- `Filmes ›`: Assistir a seguir / Watchlist e Já vistos.
- `Séries favoritas ›` e `Filmes favoritos ›`: grids completos responsivos de 2/3 colunas.

### Banco
- Migration `20260826234500_v099_profile_media_lru_dashboard.sql` aplicada e versionada.
- RPC criada como `SECURITY INVOKER`, filtrada por `auth.uid()` e liberada somente para `authenticated`.
- Flags consolidadas: favorito/Liked, AddedToWatchlist, WatchLater, InProgress, UpToDate, Completed, não iniciada e já vista.

### Versionamento / build / documentação
- Web: package `0.0.99`, cache `ct-web-0.0.99`, rodapé `CineTracker • v0.0.99`.
- Android: `versionName 0.0.99`, `versionCode 997`, bundle alvo `v0.0.99-profile-lru-v95-core-inline-authoritative`.
- Atualizados scripts de build, preparação Android, smoke inline e workflow geral `Verify`.
- Criados release note e matriz de validação 0.0.99.
- Criados retroativamente `docs/releases/0.0.98.md` e `docs/validation/0.0.98.md` para fechar a pendência documental anterior sem inventar evidência de publicação.
- Navegação, Descobrir, Backup/Importação, Cache, Metadados e Bingers 0.0.98 foram preservados.

## 0.0.98 — 2026-08-26

### Navegação
- Criada camada autoritativa `patch-v088-v098-nav-pre.js` para capturar navegação antes de handlers legados.
- Criada UI final `patch-v089-v098.js` e bridge `patch-v090-v098-compat.js`.
- Home, Descobrir, Perfil e Configurações passam a ser os quatro destinos visíveis oficiais.
- A aba dedicada Histórico foi removida da navegação Web e Android; rotas legadas `history` redirecionam para Perfil.
- Android mantém quatro botões visíveis na barra inferior: Home, Descobrir, Perfil e Configurações.

### Perfil e Histórico
- Perfil reorganizado em: estatísticas compactas → gráfico moderno → estatísticas extras → Histórico.
- Histórico absorvido pelo Perfil.
- Adicionado carrossel superior de séries assistidas e carrossel inferior de filmes assistidos.
- Criada RPC `cinetracker_profile_history_media(integer)` para agregar mídias do histórico e `plays` server-side.
- Migration `20260826230500_v098_profile_history_media.sql` aplicada em produção e versionada.
- RPC criada como `SECURITY INVOKER`, escopada por `auth.uid()`.

### Descobrir
- Ordem oficial alterada para Pra você, Em alta, Mais aguardados, Mais bem avaliados e Calendário.
- Pra você é a seção inicial.
- Em alta, Mais aguardados, Mais bem avaliados e Calendário recebem filtros Todos/Filmes/Séries.
- Filtros usam fontes/endpoints por tipo e exibem estritamente o tipo selecionado.
- Mais bem avaliados recebe ordenação final decrescente por `vote_average`, com `vote_count` como desempate.
- Caminhos novos impedem consulta TMDB direta para IDs substitutos `<= 0`.

### Configurações / Backup
- Backup & Restauração consolidado visualmente em somente dois botões: Exportar e Importar.
- Exportação passa a gerar `cinetracker-backup-0.0.98.zip` com `manifest.csv`, `profile.csv`, `imports.csv`, `media.csv`, `media_overrides.csv`, `watch_history.csv` e `episode_progress.csv`.
- Criada Edge Function `ct-backup-user`, deploy inicial v1, para snapshot e restauração autenticados.
- Snapshot pagina dados do usuário e inclui somente mídias referenciadas pelo seu estado.
- Restauração remapeia IDs de mídia e de importação, restaura overrides/histórico/progresso e limita limpeza ao perfil autenticado.
- `verify_jwt=false` no gateway da função é acompanhado de autenticação bearer explícita contra `/auth/v1/user` no corpo da função.

### Manutenção
- Limpar Cache remove `sessionStorage`, caches CineTracker do Cache Storage e caches em memória/metadados, preservando sessão e dados persistentes.
- Atualizar Metadados enumera mídias do usuário, consulta TMDB com concorrência controlada, ignora surrogate IDs não positivos e persiste metadados atualizados.

### Versionamento / Android / CI
- Web atualizado para package `0.0.98`, cache `ct-web-0.0.98` e rodapé `CineTracker • v0.0.98`.
- Android atualizado para `versionName 0.0.98` e `versionCode 996`.
- Bundle Android: `v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative`.
- `scripts/apply-hotfix10-selective.mjs`, `scripts/prepare-android-hotfix2-web.mjs`, `scripts/verify.mjs` e o smoke de scripts inline foram atualizados para a pilha 0.0.98.
- Workflow geral `Verify` atualizado para invariantes 0.0.98.
- Criado pipeline `.github/workflows/build-android-v098.yml` para build, identidade, assinatura, artifact, SHA-256 e Release `android-v0.0.98`.

## 0.0.97 HOTFIX 18 — 2026-08-26

### Governança e versionamento
- Web e Android sincronizados em `0.0.97 HOTFIX 18`.
- Web package: `0.0.97-hotfix18-documentation-governance`.
- Web cache namespace: `ct-web-0.0.97-hotfix18-documentation-governance`.
- Android: `versionName 0.0.97 HOTFIX 18`, `versionCode 995`.
- Bundle Android alvo: `hotfix18-documentation-governance-v95-core-inline-authoritative`.
- Criada a regra obrigatória: toda nova mudança deve possuir versão, registro GitHub, release note, validação e atualização dos documentos canônicos.
- Criados `docs/DEVELOPMENT_RULES.md`, release/validation HOTFIX18 e nota técnica da reconciliação Bingers.

### Consolidação Bingers
- Importação direta verificada concluída como import ID 6.
- 3.078 itens de biblioteca, sendo 2.318 filmes e 760 séries.
- 12.696 registros de histórico, sendo 949 de filmes e 11.747 de episódios.
- 16.216 reproduções: 1.312 de filmes + 14.904 de episódios.
- 1.309 filmes na Watchlist, 533 séries não iniciadas, 227 séries com histórico e 0 eventos sem correspondência.
- Ratings, avaliações, comentários e listas continuam fora da importação.
- Plays repetidos são preservados em `external_ids.plays`; datas ausentes não são inventadas.

### Perfil e estados das séries
- Classificação reconciliada em 155 Concluídas, 47 Em dia, 25 Em andamento e 533 Não iniciadas.
- Perfil separa `Concluídas`, `Em andamento`, `Em dia` e `Não iniciadas`.
- Episódios exibem subtítulo baseado em séries com histórico, não em estado atual.
- Corrigido erro do Bingers que marcava séries com zero episódios vistos como iniciadas.
- Proteções `ct_guard_bingers_import_inprogress()` e `ct_cleanup_bingers_zero_history_inprogress()` evitam/regulam o estado importado incorreto.
- Validação posterior: 0 séries `InProgress` sem histórico.

### Estatísticas
- Perfil usa RPCs server-side para evitar distorção por paginação do cliente.
- `cinetracker_series_state_stats()` fornece estados agregados.
- `cinetracker_consumption_daily()` fornece histórico diário e soma `plays`.
- Valores reconciliados: 14.904 episódios, 1.312 reproduções de filmes, 3 meses 20 dias 13 horas em filmes e 16 meses 19 dias 5 horas no total.

### Débitos explicitamente registrados
- surrogate IDs TMDB negativos podem produzir 404 no `tmdb-proxy` se forem tratados como IDs TMDB reais.
- advisories Supabase para funções `SECURITY DEFINER`, leaked-password protection e RLS/policies históricas permanecem abertos para tratamento seguro.
- deploy Web e publicação APK são estados independentes do source e exigem confirmação.

## 0.0.97 HOTFIX 17 — 2026-08-26

### Perfil / séries
- Adicionada classificação server-side de séries em `Completed`, `UpToDate`, `InProgress` e não iniciadas.
- Criado/ativado `cinetracker_series_state_stats()`.
- Criado/ativado `cinetracker_consumption_daily()` para gráfico diário server-side.
- Perfil passou a usar 155 Concluídas, 47 Em dia, 25 Em andamento, 533 Não iniciadas e 227 séries com histórico após reconciliação.
- Ajustado runtime Android para preservar a camada de perfil como camada final.

### Build
- Foram corrigidos verificadores antigos que ainda esperavam identidade HOTFIX15/HOTFIX16.
- Foi corrigida a ordem de injeção do runtime para manter `patch-v074-hotfix1-version.js` por último.
- Tentativas de build anteriores falharam durante o processo de convergência; não foram consideradas releases válidas.

## 0.0.97 HOTFIX 16 — 2026-08-26

### Importação resiliente
- `ct-import-bingers-user` evoluiu para deploy v8.
- Adicionados erros tipados de autenticação, transientes e permanentes.
- Adicionado `client_run_id` para begin idempotente/retomável.
- Adicionado contrato de cursor e replay seguro de lotes.
- Adicionadas validação e deduplicação de library/watches.
- Importador não inventa datas de watch.
- Limpeza anterior é restrita ao Bingers/import-origin e preserva decisões manuais.
- Finalização exige cursor/total/histórico exatos.
- Erros permanentes passam a encerrar import como `failed` em vez de deixá-lo em `processing`.
- Import ID 5 legado foi encerrado como `LEGACY_PIPELINE_STALLED`.

## 0.0.97 HOTFIX 15 — 2026-08-26

### Correção do transporte Bingers
- Corrigido payload PostgREST de `watch_history` que misturava shapes diferentes.
- Filmes passaram a incluir `season_number: null` e `episode_number: null`, eliminando `PGRST102: All object keys must match` para essa causa.
- Preservado picker/transporte nativo no Android e fluxo dual CSV no Web.

## Web 0.3.0 — 2026-08-21

### Ajustado
- `Hoje` passa a se chamar `Home` na navegação desktop e mobile.
- Biblioteca deixa de ser apenas uma lista textual e passa a exibir Watchlist e itens em andamento como cards com capas oficiais.
- Capas da Home e Biblioteca recebem uma segunda camada de hidratação TMDB para preencher títulos que ainda estavam sem poster.
- Filmografia passa a indicar explicitamente se cada crédito é `FILME` ou `SÉRIE`, mantendo ordenação do mais recente para o mais antigo.

### Adicionado
- Nova aba `Histórico` com filtros `Mídia`, `Séries` e `Filmes`.
- Histórico de séries usa `episode_progress.watched_at` e mostra temporada, episódio, data e horário vistos.
- Histórico de filmes usa `media_overrides.watched_at` para registrar visualizações daqui em diante.
- Cards do histórico reutilizam a tela global de detalhes já existente.

### Banco
- Migration `media_watch_history_timestamp_v030` adiciona `watched_at` a `media_overrides` e índice por perfil/data.
- Filmes marcados a partir desta versão passam a registrar a data real de visualização.
- Registros antigos importados sem timestamp original de filme continuam sem data até reconciliação.

## Android 0.0.6 — 2026-08-21

### Ajustado
- Shell Android sincronizado com a Web 0.3.0.
- Home, Biblioteca, Histórico e capas seguem a mesma experiência da versão Web.
- `versionCode` 6 e `versionName` `0.0.6`.

## Web 0.2.9 — 2026-08-21

### Ajustado
- Filmes e séries passam a ser clicáveis também em Home, Biblioteca e cards principais do sistema, não somente em Descobrir.
- Capas originais verticais da TMDB substituem placeholders quando o título pode ser conciliado.
- Filmografia de atores/atrizes é ordenada do trabalho mais recente para o mais antigo.

### Adicionado
- Tela unificada de filme/série com sinopse, ano, gêneros, nota TMDB e acesso à ficha IMDb.
- Filmes: duração total e data/estado de lançamento.
- Séries: status traduzido e duração média por episódio.
- Temporadas/episódios clicáveis, relacionados, streaming por assinatura, elenco clicável e tela de pessoa.

## Android 0.0.5 — 2026-08-21

### Ajustado
- Shell Android sincronizado com a Web 0.2.9.
- Home, Biblioteca e Descobrir usam a mesma experiência de detalhes/temporadas/relacionados/capas.
- `versionCode` 5, `versionName` `0.0.5`.

## Web 0.2.8 — 2026-08-21

### Adicionado
- Cards de Descobrir, Calendário, busca e rankings clicáveis.
- Detalhes de filmes/séries, ficha IMDb, elenco/pessoa, streaming/cinema e pôster 2:3.

### Observação
- TMDB não fornece nota numérica IMDb; a UI usa nota TMDB e link IMDb.

## Android 0.0.4 — 2026-08-21

- Shell sincronizado com Web 0.2.8; `versionCode` 4, `versionName` `0.0.4`.

## Web 0.2.7 — 2026-08-21

- Lançamentos renomeado Calendário e movido para última posição.
- Filtro Somente meus e nova aba Mais bem avaliados.

## Android 0.0.3 — 2026-08-21

- Shell sincronizado com Web 0.2.7; `versionCode` 3, `versionName` `0.0.3`.

## Web 0.2.6 — 2026-08-21

- Cabeçalho retorna à Home; Descobrir reorganizado; Calendário com dia/semana/Hoje; Séries/Filmes; cache TMDB e limite de enriquecimento.

## Android 0.0.2 — 2026-08-21

- WebView consome Descobrir/Calendário Web 0.2.6; `versionCode` 2, `versionName` `0.0.2`.

## Web 0.2.5 — 2026-08-21

- Configurações concentra conta/importação/backup; exportação JSON/ZIP; preferência de notificações.

## Android 0.0.1 — 2026-08-21

- Activity + WebView, picker nativo, links externos, estado preservado e navegação Voltar.

## Web 0.2.4 — 2026-08-21

- Corrigida tela em branco por MutationObserver recursivo; patches antigos removidos; login desacoplado de dados opcionais.

## Web 0.2.3 — 2026-08-21

- Login exibe UI imediatamente após autenticação; dados opcionais carregam em segundo plano.

## Web 0.2.2 — 2026-08-21

- Build oficial, tolerância a falhas opcionais, tema Black/Blue, domínio oficial.

## Web 0.2.1 — 2026-08-21

- Identidade Black/Blue, favicon, configurações e correção de Perfil.

## Web 0.2.0 — 2026-08-21

- Auth Supabase, persistência, Watchlist/progresso, importação, TMDB, elenco, streaming e recomendações.

## Histórico 0.1.x

- Protótipos Dark/Gold, cards, troca individual por tipo, TMDB, atores e disponibilidade.

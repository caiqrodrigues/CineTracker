# Changelog

Todas as mudanças relevantes do CineTracker são registradas aqui. A partir do HOTFIX18, toda nova unidade lógica de mudança exige versão e registro completo conforme `docs/DEVELOPMENT_RULES.md`.

## Web + Android 0.99.7 — 2026-08-28

### Evidência real e mudança de arquitetura
- Vídeo real da release anterior mostrou capas ainda vazias, favoritos de atores sem controle confiável, gráfico do Perfil divergente, gráfico de avaliações dentro da temporada e Descobrir sem filtros/layout combinados.
- Criado `patch-v118-v0997-authoritative.js` como autoridade única de Perfil, Descobrir, busca, detalhes, atores, gráficos de temporada e reparo de capas.
- O build final remove da execução v111/v114/v115/v116/v117 para impedir que renderizadores antigos sobrescrevam a UX final.

### Perfil / gráfico / atores
- Novo RPC `cinetracker_profile_payload_v0997(p_tz)` agrupa `watch_history.watched_at` pela data local usando o timezone IANA do navegador.
- Timeline D-10..D+3 mostra exatamente sete dias por viewport e abre com Hoje centralizado em D-3..D+3.
- Ordem canônica: Séries → Filmes → Séries Favoritas → Filmes Favoritos → Atores Favoritos → Episódios por dia → Estatísticas extras.
- Coração de ator passa a ser renderizado diretamente no elenco; página da pessoa recebe Favoritar ator / Ator favorito; Perfil lê e remove da mesma `favorite_actors`.

### Série / episódios / avaliações
- Accordion de temporada contém somente episódios.
- `Avaliações dos episódios por temporada` passa a ser uma seção independente depois de todo o bloco Temporadas e episódios, visível com temporadas abertas ou fechadas.
- Scroll horizontal entre temporadas, lazy-load de gráficos próximos, eixo Y 0–10, SxxExx no eixo X, melhor verde, pior vermelho, demais ciano e tooltip com votos.
- Episódios preservam still, data, nota, sinopse, visto e revisto.

### Descobrir
- Tabs finais: Pra Você, Em alta, Mais aguardados, Populares, Mais bem avaliados e Calendário.
- Filtros finais: Todos / Séries / Filmes e modos Lista / Carrossel / Grade.
- Cards compactos: Grade 128–152 px, Carrossel 142 px, Lista com pôster 64×92.
- Exclusões pessoais são fail-closed: sem `cinetracker_discovery_exclusions_v0994()` válido, coleções públicas potencialmente erradas não são exibidas.
- Vistos, histórico, Watchlist, em andamento, em dia e concluídos ficam fora das listas públicas por ID e aliases.
- Pra Você preserva indicação diária após 1990 e nota >=8, três slots não vistos da Watchlist e três slots 100% novos.
- Calendário combina filmes futuros e `next_episode_to_air` das séries acompanhadas.

### Capas / busca
- Cards usam `poster_path || raw_tmdb.poster_path`.
- Cards ainda vazios mais próximos do viewport recebem prioridade em `ct-enrich-media-user?priority=visible-posters` via `requested_media_ids`; nova checagem ocorre ao rolar, sem polling permanente.
- Busca global antiga `#ct111-global-search` é removida antes da montagem da busca 0.99.7, evitando a duplicação observada no vídeo.

### Android / versionamento
- Web package/cache: `0.99.7` / `ct-web-0.99.7`.
- Android: `versionName 0.99.7`, `versionCode 9970`, bundle `android-v0.99.7-single-authority`.
- `prepare-android-v0997.mjs` incorpora o mesmo `dist` Web e falha se v111/v114/v115/v116/v117 ainda estiverem executáveis.
- Workflow alvo: `.github/workflows/build-android-v0997.yml`; Release alvo: `android-v0.99.7`.
- CI, Vercel, APK, assinatura, SHA e smoke real permanecem estados separados até sua comprovação.

## Web + Android 0.99.6 — 2026-08-28

### Autoridade final de Perfil e Descobrir
- Criados `patch-v116-v0996-authoritative.js` e `patch-v117-v0996-final.js` para impedir que renderizadores legados sobrescrevam as telas depois do carregamento.
- Perfil passa a ser renderizado diretamente na ordem Séries → Filmes → Séries Favoritas → Filmes Favoritos → Atores Favoritos → Episódios por dia → Estatísticas extras.
- Descobrir passa a ter renderer próprio com Pra Você, Em alta, Mais aguardados, Mais bem avaliados, Calendário e filtros Geral/Séries/Filmes.

### Perfil / favoritos / atividade
- Novo payload `cinetracker_profile_payload_v0996()` reduz chamadas e entrega dashboard, estatísticas, tempos restantes, atores favoritos e atividade.
- Gráfico usa `watch_history`, episódios distintos por dia, D-10..D+3, exatamente sete dias visíveis e Hoje centralizado.
- `favorite_actors` com RLS; coração no elenco e na página da pessoa; seção Atores Favoritos clicável/removível no Perfil.
- Favoritos de filmes/séries continuam sincronizados pelo estado canônico `Liked`.

### Capas / metadados
- Auditoria encontrou 1.932 itens do dashboard sem `poster_path`; 1.931 exigiam resolução TMDB.
- Cards usam fallback `raw_tmdb.poster_path`.
- v117 consulta TMDB oficial imediatamente para card visível e usa `ct-enrich-media-user?priority=visible-posters` + `requested_media_ids` para registros locais/surrogates.
- IDs solicitados são limitados ao dashboard autenticado; não é criada associação arbitrária quando o catálogo não pode ser resolvido com segurança.

### Detalhe de série / avaliações
- Episódios preservam capa, data, nota, sinopse, Marcar como visto e Marcar como revisto.
- Gráfico legado dentro do accordion é ocultado.
- Nova seção independente `Avaliações dos episódios por temporada` fica após o bloco de temporadas/episódios e continua visível com accordions abertos ou fechados.
- Scroll horizontal entre temporadas; melhor episódio verde, pior vermelho, demais ciano; tooltip inclui SxxExx, nota, nome e votos.

### Descobrir / fluidez
- Exclusões de vistos, histórico, Watchlist, em andamento, em dia e concluídos são obrigatórias por ID e aliases; falha fechada quando o conjunto autenticado não está disponível.
- Pra Você mantém sete posições: indicação diária (>1990 e nota TMDB >=8), Filme/Série/Anime da Watchlist não vistos e Filme/Série/Anime 100% novos.
- Pools públicos consultam duas páginas por fonte; resolução de imports pessoais sem ID oficial ocorre em paralelo.
- Calendário reutiliza `raw_tmdb.next_episode_to_air` de séries acompanhadas e datas oficiais de estreias, evitando dezenas de requisições sequenciais.
- Cache Web `ct-web-0.99.6`, Perfil `ct0996_profile_snapshot_v2`, Descobrir `ct0996_discover_snapshot_v2`.

### Android / publicação
- Android volta a compartilhar a mesma árvore Web: `versionName 0.99.6`, `versionCode 9960`, bundle `android-v0.99.6-authoritative-preload`.
- Verify `33165215299` / #1398: success; Vercel Production: success.
- Android workflow `33165215281`: success; package/versionName/versionCode e assinatura validados.
- Release `android-v0.99.6` publicada.
- APK SHA-256: `777c55e9b2687d30de1aebf28d5b8e3db7ef6c53c7c0b68be47a66219ce5d7c9`.
- Smoke real Web/PWA e APK permanece pendente; evidência visual prevalece sobre CI.

## Web 0.99.3 — 2026-08-27

### Navegação desktop
- Nova camada `patch-v097-v0993-nav-pre.js` é injetada antes do `patch-v095-v0992-fix.js` para vencer corretamente o listener `window`/capture legado que usa `stopImmediatePropagation`.
- Home, Descobrir, Perfil e Configurações passam por gate Web 0.99.3; rota legada Histórico redireciona ao Perfil.
- `patch-v098-v0993-web.js` reconcilia a Sidebar final para somente quatro destinos e remove defensivamente qualquer Histórico/History recriado por camada antiga.

### Descobrir
- Tabs Pra Você, Em Alta, Mais Aguardados, Mais bem avaliados e Calendário recebem captura explícita e executam o handler real já vinculado pela 0.99.1.
- Filtros Geral/Séries/Filmes recebem o mesmo tratamento.
- Containers e pílulas recebem proteção de hit-area com `pointer-events:auto` e z-index local.
- Pra Você vazio deixa de ficar preso apenas em “Nenhum título elegível”: passa a orientar Atualizar recomendações ou Importar/sincronizar dados.
- Cliques, `window.error` e `unhandledrejection` ficam disponíveis em `window.__ct0993Diagnostics`.

### Build / versão
- package Web `0.99.3`.
- cache `ct-web-0.99.3`.
- rodapé `CineTracker • v0.99.3`.
- `scripts/apply-web-v0993.mjs` impõe a ordem pré-gate -> FIX -> FIX2 -> camada final.
- `scripts/test-web-v0993.mjs` cobre quatro rotas, redirecionamento de Histórico, tab e filtro do Descobrir, markers e ordem do runtime.
- Android permanece `0.99.2.3`, `versionCode 9923`; nenhum novo APK é reconstruído ou republicado nesta unidade Web-only.

## 0.99.2 FIX2 — 2026-08-27

### Evidência real e causa raiz
- Após a publicação do primeiro 0.99.2 FIX, vídeo e teste real confirmaram **Web e APK completamente travados**.
- A causa foi localizada em ciclos recursivos de `MutationObserver`: `patch-v093-v0992.js` e `patch-v095-v0992-fix.js` reconciliavam rodapé/cabeçalhos e podiam reatribuir `textContent` mesmo quando o valor já era idêntico.
- A reatribuição substituía o text node, gerava novo `childList MutationRecord` e acionava novamente o observer, saturando a main thread no navegador e na WebView Android.
- CI antigo não detectava o problema porque validava sintaxe, markers e ordem, mas não churn de DOM em runtime.

### Anti-freeze
- Criado `patch-v096-v0992-unfreeze.js` como última camada obrigatória da pilha compartilhada.
- Marker: `__ct0992UnfreezeLoaded` / `fix2-idempotent-dom-mutation-guard`.
- A camada torna atribuição de `Node.textContent` com valor idêntico um no-op e delega ao setter nativo quando o conteúdo realmente muda.
- O guard é instalado antes dos observers atrasados de 250/500 ms começarem a observar `#app`.
- Refresh inicial é coalescido por `requestAnimationFrame`.
- Cache Web rotacionado para `ct-web-0.99.2-fix2`.

### Android / publicação
- APK defeituoso `versionCode 9912` foi invalidado e não é reutilizado.
- FIX2 mantém `versionName 0.99.2` e sobe para `versionCode 9913`.
- Bundle: `v0.99.2-fix2-unfreeze-991-992-authoritative`.
- Criado workflow dedicado `.github/workflows/build-android-v0992-fix2.yml`.
- Run `33032044592` concluiu build, identidade, runtime FIX2, assinatura, artifact e substituição da Release com sucesso.
- Release atual: `android-v0.99.2`, título `CineTracker Android 0.99.2 FIX2`.
- APK: `cinetracker-android-0.99.2-debug.apk`.
- SHA-256: `8564bacca16bf153ebdb05f64a89337b998d23c02c8edb9a137e2a104725f9d2`.

### Governança
- Regras passam a exigir callbacks de `MutationObserver` idempotentes e smoke de responsividade/ausência de CPU runaway.
- Build/CI/Vercel/APK publicado continuam separados de smoke real. A 0.99.2 só será funcionalmente encerrada após validação real em Web desktop, Web Android e APK 9913.

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
- Gate de navegação movido para `window` no capture phase, executando antes dos listeners antigos de `document`.
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
- `prepare-android-hotfix2-web.mjs`, smoke inline, Verify e pipeline Android passaram a exigir `patch-v095-v0992-fix.js` por último e marker `__ct0992FixLoaded`.
- Android usava `versionName 0.99.2`, `versionCode 9912`; esse APK foi posteriormente invalidado pelo congelamento documentado no FIX2.

## 0.99.2 — 2026-08-26

### Home / Séries
- Criada camada `patch-v093-v0992.js` para Web e runtime Android embarcado.
- Home de Séries usa lista vertical contínua com histórico de episódios oculto acima do ponto inicial e Pull-to-Reveal.
- Ordem: Assistir a seguir, Juntando poeira, Em dia, Não Iniciadas / Watchlist e Concluídas.
- Assistir a seguir usa pendências lançadas com última atividade em até 30 dias; Juntando poeira usa mais de 30 dias.
- Cards em linha usam pôster 2:3, próximo Sxx Exx, progresso assistidos/lançados, faltantes, nome/nota e ação ✓.
- Quick mark grava `watch_history`, sincroniza `episode_progress`, avança o próximo episódio e reordena por `last_watched_at DESC`.
- Ao zerar pendências lançadas, a série migra para Em dia.

### Sincronização de lançamentos
- Checagem diária de metadados TMDB para séries Em dia/Em andamento.
- Roda no primeiro uso do dia, retorno de visibilidade e Calendário.
- Novo episódio com `air_date <= hoje` move UpToDate para InProgress/Assistir a seguir e recebe badge Novo Episódio.
- IDs TMDB substitutos negativos são bloqueados para chamadas externas.

### Home / Filmes
- Histórico Vistos fica oculto acima do ponto inicial e é revelado por Pull-to-Reveal.
- Escolha para Hoje: 1 filme por data, nota >=8,0, nunca visto e sem repetição por perfil/TMDB.
- `daily_movie_recommendations_v0992` persiste a escolha com RLS/unicidade.
- Watchlist exibe pôster, ano, duração, sinopse curta e ação ✓.
- Quick mark grava histórico e `AlreadySeen`.

### Backend / reatividade / versionamento
- Migration `20260827004500_v0992_home_series_movies.sql` aplicada.
- RPC `cinetracker_profile_home_dashboard_v0992()` como `SECURITY INVOKER`, escopo `auth.uid()`.
- Home força nova leitura ao abrir, alternar Séries/Filmes, `cinetracker:data-changed`, visibilidade e importação concluída.
- Web package `0.99.2`; Android inicialmente `versionCode 9912`; release alvo `android-v0.99.2`.

## 0.99.1 — 2026-08-26

### Estabilidade / Perfil / Descobrir
- Perfil com carregamento single-flight e sem polling periódico na camada final.
- Descobrir abre em Pra Você.
- Tempo Total em largura dupla, timeline de 7 dias com Hoje centralizado, detalhe por dia, filtros de status/layout, favoritos e quatro métricas extras.
- Pra Você restaurado com 7 posições, ano >1990 e nota >=7,8.
- Calendário por último com Geral/Séries/Filmes.
- Cards ricos de episódios, confirmação inteligente de episódios anteriores e cinegrafia em dois carrosséis preservados.
- Bingers organizado dentro de Importar Dados.
- RPC `cinetracker_profile_media_dashboard_v0991()`; Web/Android `0.99.1` / `versionCode 9911`.
- Release Android `android-v0.99.1` publicada após CI/build.

## 0.0.99 — 2026-08-26

### Perfil / biblioteca pessoal
- `patch-v091-v099-profile-lru.js` adiciona Séries, Séries favoritas, Filmes e Filmes favoritos imediatamente abaixo das estatísticas.
- Cards 2:3 mostram título, progresso, favorito e última atividade.
- TMDB oficial abre detalhe global; surrogate negativo abre detalhe local.
- RPC `cinetracker_profile_media_dashboard()` consolida histórico/progresso/overrides e ordena LRU por `last_watched_at DESC`.
- Subtelas: Séries por estados; Filmes Watchlist/Já vistos; favoritos em grids 2/3 colunas.
- Migration `20260826234500_v099_profile_media_lru_dashboard.sql` aplicada.
- Web `0.0.99`; Android `versionCode 997`.

## 0.0.98 — 2026-08-26

### Navegação / Perfil / Descobrir / Configurações
- `patch-v088-v098-nav-pre.js`, `patch-v089-v098.js` e `patch-v090-v098-compat.js` consolidam Home, Descobrir, Perfil e Configurações.
- Histórico dedicado removido e conteúdo integrado ao Perfil.
- Perfil reorganizado em estatísticas, gráfico, extras e Histórico; RPC `cinetracker_profile_history_media(integer)` aplicada.
- Descobrir: Pra você, Em alta, Mais aguardados, Mais bem avaliados e Calendário; filtros Todos/Filmes/Séries e ordenação decrescente por nota.
- Backup consolidado em Exportar/Importar com ZIP/CSVs e Edge Function `ct-backup-user`.
- Limpar Cache e Atualizar Metadados refeitos; surrogate <=0 não é enviado à TMDB.
- Web `0.0.98`; Android `versionCode 996`.

## 0.0.97 HOTFIX 18 — 2026-08-26

### Governança e versionamento
- Web e Android sincronizados em `0.0.97 HOTFIX 18`; Android `versionCode 995`.
- Formalizada regra obrigatória de versão + registro GitHub + release note + validação + documentação.

### Consolidação Bingers
- Import ID 6 concluído: 3.078 itens de biblioteca, 12.696 registros de histórico e 16.216 reproduções.
- 1.309 filmes na Watchlist, 533 séries não iniciadas, 227 séries com histórico e 0 eventos sem correspondência.
- Plays repetidos preservados em `external_ids.plays`; datas ausentes não são inventadas.

### Perfil e estados
- Classificação reconciliada em 155 Concluídas, 47 Em dia, 25 Em andamento e 533 Não iniciadas.
- Corrigido Bingers marcando séries com zero episódios como iniciadas; 0 `InProgress` sem histórico após validação.
- Perfil usa RPCs server-side; 14.904 episódios, 1.312 reproduções de filmes, 3 meses 20 dias 13 horas em filmes e 16 meses 19 dias 5 horas total.
- Débitos: surrogate TMDB negativo, advisories `SECURITY DEFINER`, leaked-password protection e staging/RLS.

## 0.0.97 HOTFIX 17 — 2026-08-26

- Classificação server-side `Completed`, `UpToDate`, `InProgress` e não iniciadas.
- `cinetracker_series_state_stats()` e `cinetracker_consumption_daily()`.
- Perfil reconciliado em 155 Concluídas, 47 Em dia, 25 Em andamento, 533 Não iniciadas e 227 séries com histórico.
- Corrigidos verificadores/build order antigos.

## 0.0.97 HOTFIX 16 — 2026-08-26

- `ct-import-bingers-user` v8 com erros tipados, `client_run_id`, cursor/replay, validação/dedupe, limpeza escopada e finalização exata.
- Datas de watch não são inventadas; decisões manuais são preservadas.
- Import ID 5 legado encerrado como `LEGACY_PIPELINE_STALLED`.

## 0.0.97 HOTFIX 15 — 2026-08-26

- Corrigido payload PostgREST misto de `watch_history`; filmes incluem `season_number:null` e `episode_number:null`.
- Picker/transporte Android e fluxo dual CSV Web preservados.

## Web 0.3.0 — 2026-08-21

- Hoje renomeado Home; Biblioteca com cards/capas; filmografia identifica FILME/SÉRIE.
- Aba Histórico com filtros e timestamps; migration de `watched_at` em `media_overrides`.

## Android 0.0.6 — 2026-08-21

- Shell sincronizado com Web 0.3.0; `versionCode 6`, `versionName 0.0.6`.

## Web 0.2.9 — 2026-08-21

- Cards clicáveis em Home/Biblioteca; pôsteres TMDB; filmografia cronológica.
- Tela unificada de mídia, IMDb, temporadas/episódios, relacionados, streaming, elenco e pessoa.

## Android 0.0.5 — 2026-08-21

- Shell sincronizado com Web 0.2.9; `versionCode 5`, `versionName 0.0.5`.

## Web 0.2.8 — 2026-08-21

- Descobrir/Calendário/busca/rankings clicáveis; detalhes, IMDb, elenco/pessoa, streaming/cinema e pôster 2:3.
- TMDB não fornece nota numérica IMDb; UI usa nota TMDB + link IMDb.

## Android 0.0.4 — 2026-08-21

- Shell sincronizado com Web 0.2.8; `versionCode 4`, `versionName 0.0.4`.

## Web 0.2.7 — 2026-08-21

- Lançamentos renomeado Calendário e movido para última posição; Somente meus e Mais bem avaliados.

## Android 0.0.3 — 2026-08-21

- Shell sincronizado com Web 0.2.7; `versionCode 3`, `versionName 0.0.3`.

## Web 0.2.6 — 2026-08-21

- Cabeçalho retorna à Home; Descobrir reorganizado; Calendário dia/semana/Hoje; Séries/Filmes; cache TMDB e limite de enriquecimento.

## Android 0.0.2 — 2026-08-21

- WebView consome Descobrir/Calendário Web 0.2.6; `versionCode 2`, `versionName 0.0.2`.

## Web 0.2.5 — 2026-08-21

- Configurações concentra conta/importação/backup; exportação JSON/ZIP; preferência de notificações.

## Android 0.0.1 — 2026-08-21

- Activity + WebView, picker nativo, links externos, estado preservado e navegação Voltar.

## Web 0.2.4 — 2026-08-21

- Corrigida tela em branco por `MutationObserver` recursivo; patches antigos removidos; login desacoplado de dados opcionais.

## Web 0.2.3 — 2026-08-21

- Login exibe UI imediatamente após autenticação; dados opcionais carregam em segundo plano.

## Web 0.2.2 — 2026-08-21

- Build oficial, tolerância a falhas opcionais, tema Black/Blue e domínio oficial.

## Web 0.2.1 — 2026-08-21

- Identidade Black/Blue, favicon, configurações e correção de Perfil.

## Web 0.2.0 — 2026-08-21

- Auth Supabase, persistência, Watchlist/progresso, importação, TMDB, elenco, streaming e recomendações.

## Histórico 0.1.x

- Protótipos Dark/Gold, cards, troca individual por tipo, TMDB, atores e disponibilidade.

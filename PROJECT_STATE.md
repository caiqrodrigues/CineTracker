# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-28  
**Branch de trabalho:** `fix/web-android-0.99.7-ux`  
**Web alvo:** `0.99.7`, package/cache `0.99.7`  
**Android alvo:** `0.99.7`, `versionCode 9970`  
**Backend lógico:** `0.99.7`  
**Windows:** não lançado

## 1. Motivo da 0.99.7

Smoke real em vídeo mostrou que a publicação técnica 0.99.6 ainda não entregava corretamente a UX combinada: capas vazias persistiam, favoritos de atores não apareciam de forma confiável, o gráfico do Perfil continuava divergente, o gráfico de avaliações da série permanecia dentro do accordion da temporada e o Descobrir estava sem os filtros/layout esperados e com cards grandes.

A 0.99.7 não considera a existência de código ou CI como prova de UX. Ela consolida essas áreas em uma única autoridade final e só será marcada como funcionalmente validada após novo smoke real.

## 2. Autoridade final 0.99.7

Arquivo: `apps/web/patch-v118-v0997-authoritative.js`  
Marker: `v118-single-authority-profile-discover-detail`

O build final remove da execução os antigos:
- `patch-v111-v0994-global-search.js`;
- `patch-v114-v0994-universal-detail.js`;
- `patch-v115-v0995-favorites-profile-discover.js`;
- `patch-v116-v0996-authoritative.js`;
- `patch-v117-v0996-final.js`.

Assim Perfil, Descobrir, busca, detalhes, favoritos de atores, gráficos de temporada e reparo de capas não dependem de reorganização posterior do DOM legado. Continuam preservadas as camadas base necessárias de Home, auth, navegação, Configurações, episódios e preload.

Não adicionar `MutationObserver` ou `setInterval` permanente. Reparos devem ser orientados a evento ou finitos.

## 3. Perfil

Ordem canônica:
1. Séries;
2. Filmes;
3. Séries Favoritas;
4. Filmes Favoritos;
5. Atores Favoritos;
6. Episódios por dia;
7. Estatísticas extras.

Payload: `cinetracker_profile_payload_v0997(p_tz text)`.

### Gráfico de atividade

- fonte: `watch_history`;
- somente `item_type='episode'`;
- conta episódios distintos por `(media_id, season_number, episode_number)`;
- agrupamento pela data **local** de `watched_at`, usando timezone IANA enviado pelo navegador;
- D-10..D+3 no backend;
- exatamente sete dias visíveis por viewport;
- abertura com Hoje centralizado: D-3..D+3;
- scroll horizontal permite voltar até D-10.

O uso anterior de `watched_at::date` em UTC não é autoridade da 0.99.7.

## 4. Capas ausentes

A biblioteca importada possui muitos registros sem `poster_path`. A 0.99.7 usa uma estratégia progressiva e visível:
- `poster_path || raw_tmdb.poster_path` primeiro;
- cards sem imagem mais próximos do viewport têm prioridade;
- IDs locais visíveis são enviados a `ct-enrich-media-user` com `priority=visible-posters` e `requested_media_ids`;
- a checagem é reexecutada ao rolar a página, com debounce, sem polling;
- surrogate TMDB continua sendo resolvido apenas por ID efetivo ou correspondência título/ano, nunca por associação arbitrária.

## 5. Atores Favoritos

Persistência: `favorite_actors` com RLS.

Comportamento obrigatório:
- coração em cada card do elenco;
- botão Favoritar ator / Ator favorito na página da pessoa;
- Perfil possui seção Atores Favoritos;
- remover pelo Perfil sincroniza Supabase e UI;
- coração não deve abrir a pessoa;
- card da pessoa abre biografia e filmografia;
- filmografia separada em Filmes e Séries, mais novos primeiro.

## 6. Detalhe de série

A autoridade v118 renderiza o detalhe diretamente.

Temporada aberta:
- contém somente a lista de episódios;
- episódio mostra still/capa, SxxExx, título, data, nota, sinopse;
- Marcar como visto;
- Marcar como revisto com preservação de plays.

### Avaliações dos episódios por temporada

Regra absoluta:
- não fica dentro do accordion da temporada;
- não fica acima nem abaixo dos episódios dentro da temporada;
- fica em seção independente **depois de todo o bloco Temporadas e episódios**;
- aparece com temporadas abertas ou fechadas;
- possui scroll horizontal entre temporadas;
- cada temporada carrega sob demanda;
- eixo Y 0–10, eixo X SxxExx;
- melhor episódio verde, pior vermelho, demais ciano;
- tooltip: código, nota, título e quantidade de votos.

## 7. Descobrir

Tabs canônicas:
- Pra Você;
- Em alta;
- Mais aguardados;
- Populares;
- Mais bem avaliados;
- Calendário.

Filtro `☰ Filtros`:
- Tipo: Todos / Séries / Filmes;
- Visualização: Lista / Carrossel / Grade.

Tamanhos:
- Grade: aproximadamente 128–152 px por card;
- Carrossel: 142 px;
- Lista: pôster 64×92 em linha compacta;
- Pra Você/Watchlist/100% novos usam a mesma escala de card.

Regras de conteúdo:
- `cinetracker_profile_media_dashboard_v0991()` e `cinetracker_discovery_exclusions_v0994()` são obrigatórios;
- falha fechada: sem exclusões válidas, não mostrar lista pública potencialmente errada;
- vistos, histórico, Watchlist, InProgress, UpToDate e Completed ficam fora das coleções públicas;
- bloqueio por TMDB ID e aliases original/localizado;
- filme diário: após 1990, nota TMDB >= 8, nunca visto e fora da Watchlist;
- Da sua Watchlist: Filme/Série/Anime ainda não vistos;
- 100% novos: Filme/Série/Anime fora de histórico e Watchlist;
- Calendário combina filmes futuros e `next_episode_to_air` das séries acompanhadas, até 45 dias.

## 8. Busca

A 0.99.7 possui uma única busca global de filmes, séries e atores na Home e no Descobrir. O v118 remove o `#ct111-global-search` antigo antes de montar a busca própria, evitando a duplicação observada no vídeo.

## 9. Android 0.99.7

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7`;
- `versionCode`: `9970`;
- bundle: `android-v0.99.7-single-authority`;
- builder: `scripts/prepare-android-v0997.mjs`;
- test: `scripts/test-android-v0997.mjs`;
- workflow: `.github/workflows/build-android-v0997.yml`;
- release alvo: `android-v0.99.7`;
- APK alvo: `cinetracker-android-0.99.7-debug.apk`.

O builder incorpora o mesmo `dist` final da Web e falha se encontrar v111/v114/v115/v116/v117 como scripts executáveis.

## 10. Backend 0.99.7

Novo contrato aplicado em produção:
- `cinetracker_profile_payload_v0997(text)`;
- timezone validado em `pg_timezone_names`;
- atividade calculada no fuso do usuário;
- execute somente para `authenticated`.

Contratos preservados:
- `cinetracker_discovery_exclusions_v0994()`;
- `cinetracker_profile_media_dashboard_v0991()`;
- `favorite_actors`;
- `ct-enrich-media-user` com `visible-posters` / `requested_media_ids`.

## 11. Estado de validação

Comprovado nesta unidade:
- [x] branch 0.99.7 criada;
- [x] package Web 0.99.7 no source;
- [x] service-worker source `ct-web-0.99.7`;
- [x] Android source `versionName 0.99.7` / `versionCode 9970`;
- [x] migration/RPC 0.99.7 aplicada em Supabase production;
- [x] test gates Web/Android 0.99.7 adicionados;
- [x] workflow Android 0.99.7 adicionado.

Pendente:
- [ ] Verify do PR;
- [ ] promoção para `main`;
- [ ] Vercel Production;
- [ ] build APK 0.99.7;
- [ ] identidade/assinatura/SHA do APK;
- [ ] GitHub Release Android 0.99.7;
- [ ] smoke real Web/PWA;
- [ ] smoke real APK em aparelho;
- [ ] confirmação visual dos cinco defeitos reportados.

Vídeo/print real prevalece sobre CI caso haja divergência.

## 12. Débitos conhecidos

- grande volume de itens importados ainda depende de enriquecimento TMDB gradual;
- runtimes/metadados incompletos não devem ser inventados;
- advisories históricos do Supabase permanecem separados desta release;
- a pilha base ainda é acumulada, mas as áreas v118 não devem voltar a depender das autoridades removidas do HTML final.

## 13. Documentos canônicos

`README.md`, `VERSIONS.md`, `CHANGELOG.md`, `PROJECT_STATE.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.7.md`, `docs/validation/0.99.7.md`.

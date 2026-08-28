# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-28  
**Branch principal publicada:** `main`  
**Branch de release atual:** `fix/web-android-0.99.6-authoritative`  
**Web alvo:** `0.99.6`, package/cache `0.99.6`  
**Android alvo:** `0.99.6`, `versionCode 9960`  
**Backend lógico:** `0.99.6`  
**Windows:** não lançado

## 1. Unidade atual — 0.99.6 Web + Android

A 0.99.6 é uma consolidação funcional de Web e Android. O objetivo principal é impedir que renderizadores legados sobrescrevam Perfil e Descobrir depois que a tela nova já foi exibida.

O vídeo real de 2026-08-28 mostrou produção Web 0.99.5 com problemas ainda visíveis: capas vazias, ausência de Atores Favoritos, gráfico de Perfil incorreto, gráfico de temporada no local errado e Descobrir exibindo conteúdo inadequado/vazio. Esses pontos são critérios de aceite explícitos da 0.99.6.

## 2. Autoridade de runtime

A pilha antiga continua presente apenas onde ainda é necessária por compatibilidade, porém a autoridade final é:

- `patch-v116-v0996-authoritative.js`: renderer final de Perfil e Descobrir;
- `patch-v117-v0996-final.js`: complemento final para capas sem metadados, favoritos de atores e gráficos de temporada independentes dos accordions;
- Home continua usando o runtime canônico 0.99.4 já estabilizado;
- Configurações continuam usando a camada Web canônica já estabilizada;
- Histórico permanece integrado ao Perfil e não volta à Sidebar.

Não adicionar `MutationObserver` ou `setInterval` permanente a essas camadas. Reparos assíncronos devem ser finitos/event-driven.

## 3. Perfil 0.99.6

Renderer próprio com ordem canônica:

1. Séries;
2. Filmes;
3. Séries Favoritas;
4. Filmes Favoritos;
5. Atores Favoritos;
6. Episódios por dia;
7. Estatísticas extras.

O payload é `cinetracker_profile_payload_v0996()`.

### Gráfico do Perfil

A implementação inicial da 0.99.6 estava errada porque contava apenas `watch_play_events_v0994` com `source='manual'`. Isso não representa o histórico importado/real.

Migration corretiva:
`supabase/migrations/20260828062500_v0996_profile_activity_from_watch_history.sql`.

Regra atual:
- fonte: `watch_history`;
- apenas `item_type='episode'`;
- contagem de episódios distintos `(media_id, season_number, episode_number)` por dia;
- janela: D-10 até D+3;
- Hoje centralizado visualmente.

## 4. Capas ausentes

O vídeo mostrou cards sem pôster. Inspeção no banco confirmou mídia importada com `tmdb_id` substituto/negativo, `poster_path` nulo e sem `source_tmdb_id` oficial.

A Edge Function `ct-enrich-media-user` está na versão 5 e suporta:
- `priority=visible-posters`;
- body `requested_media_ids`;
- interseção obrigatória dos IDs solicitados com o dashboard autenticado;
- resolução por título/ano e segunda busca controlada quando necessário;
- atualização de `source_tmdb_id`, `poster_path`, runtime e metadados oficiais.

`patch-v117-v0996-final.js` detecta cards locais visíveis sem capa e dispara enriquecimento direcionado. Não deve ficar repetindo indefinidamente o mesmo ID durante a sessão.

## 5. Atores Favoritos

Tabela: `favorite_actors`, com RLS e `user_id default auth.uid()`.

Comportamento 0.99.6:
- coração em cards de elenco;
- botão de favoritar na página/detalhe da pessoa;
- Perfil possui seção Atores Favoritos;
- clique no coração não deve abrir o ator;
- clique no ator abre a filmografia;
- remover do Perfil atualiza Supabase e a UI.

## 6. Gráficos de temporada

Regra obrigatória do produto:
- o gráfico **não** fica dentro da temporada acima dos episódios;
- o gráfico antigo dentro de `.ct114-season-body` fica oculto;
- há uma seção independente **Avaliações dos episódios por temporada** após todo o bloco `Temporadas e episódios`;
- a seção existe mesmo se todos os accordions estiverem fechados;
- cada temporada tem seu gráfico próprio;
- navegação entre temporadas do gráfico é horizontal;
- os gráficos são carregados sob demanda/próximos ao viewport;
- eixo Y 0–10;
- eixo X SxxExx;
- melhor episódio verde, pior vermelho, demais ciano;
- tooltip: código, nota, título e votos.

## 7. Descobrir 0.99.6

Renderer próprio e final.

Tabs:
- Pra Você;
- Em alta;
- Mais aguardados;
- Mais bem avaliados;
- Calendário.

Filtros:
- Geral;
- Séries;
- Filmes.

Regras:
- `cinetracker_profile_media_dashboard_v0991()` e `cinetracker_discovery_exclusions_v0994()` são requisitos, não fallbacks opcionais;
- se exclusões autenticadas falharem, Descobrir falha fechado;
- Watchlist/histórico/vistos/em andamento/em dia/concluídos não entram em coleções 100% novas;
- aliases localizados/originais também bloqueiam duplicatas;
- Pra Você tenta resolver títulos importados sem ID TMDB oficial antes de deixar slots pessoais vazios;
- fontes públicas são buscadas em mais de uma página para não esgotar o pool após exclusões;
- Calendário usa `next_episode_to_air` para séries acompanhadas e lançamento oficial para filmes.

Caches rotacionados após as correções:
- `ct0996_profile_snapshot_v2`;
- `ct0996_discover_snapshot_v2`.

## 8. Android 0.99.6

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.6`;
- `versionCode`: `9960`;
- bundle: `android-v0.99.6-authoritative-preload`;
- builder: `scripts/prepare-android-v0996.mjs`;
- test: `scripts/test-android-v0996.mjs`;
- workflow: `.github/workflows/build-android-v0996.yml`;
- release alvo: `android-v0.99.6`.

O Android incorpora o mesmo `dist` Web 0.99.6 e exige v116 + v117. Não criar uma implementação paralela das mesmas telas.

## 9. Backend 0.99.6 aplicado

- `cinetracker_profile_payload_v0996()` criado/atualizado;
- atividade do Perfil corrigida para `watch_history`;
- `ct-enrich-media-user` v5 ativo com JWT obrigatório;
- `favorite_actors` com RLS;
- exclusões do Descobrir continuam baseadas em `cinetracker_discovery_exclusions_v0994()`.

## 10. Validação e publicação

Estados independentes:

- [x] source 0.99.6 criado;
- [x] migrations necessárias aplicadas em produção;
- [x] Edge Function v5 ativa;
- [x] identidade Android 0.99.6 / 9960 definida;
- [ ] Verify completo verde no commit final;
- [ ] build APK completo no commit final;
- [ ] merge em `main`;
- [ ] Vercel Production sucesso no commit final;
- [ ] GitHub Release `android-v0.99.6` publicada;
- [ ] SHA-256 do APK registrado;
- [ ] smoke real Web desktop após publicação;
- [ ] smoke real APK em aparelho.

Não marcar itens pendentes como concluídos por inferência.

## 11. Débitos conhecidos

- ainda existem registros importados com TMDB surrogate negativo que dependem de enriquecimento gradual;
- metadados/runtime ainda podem estar incompletos em parte da biblioteca;
- advisories Supabase históricos continuam separados desta release;
- compatibilidade acumulada de patches continua grande e deve ser reduzida futuramente sem quebrar a autoridade atual.

## 12. Documentos canônicos

`README.md`, `VERSIONS.md`, `CHANGELOG.md`, `PROJECT_STATE.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.6.md`, `docs/validation/0.99.6.md`.

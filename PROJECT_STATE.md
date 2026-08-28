# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-28  
**Branch principal publicada:** `main`  
**Web atual:** `0.99.6`, package/cache `0.99.6`  
**Android atual:** `0.99.6`, `versionCode 9960`  
**Backend lógico:** `0.99.6`  
**Windows:** não lançado

## 1. Release atual — 0.99.6 Web + Android

A 0.99.6 é uma consolidação funcional compartilhada por Web/PWA e Android. Ela foi criada depois que vídeos reais da 0.99.5 mostraram que renderizadores legados ainda conseguiam sobrescrever Perfil, Descobrir, gráfico e favoritos depois que as camadas novas carregavam.

Publicação técnica 0.99.6 concluída:
- código funcional base em `main`: `781cc537ac9e408c574517855320caf260904a9e`;
- Verify `33165215299` / #1398: success;
- Vercel Production: success;
- Android Production workflow `33165215281`: success;
- Release `android-v0.99.6`: publicada;
- smoke real Web/PWA e APK: **pendente**.

## 2. Autoridade de runtime

A pilha histórica permanece por compatibilidade onde ainda é necessária, mas a autoridade final das áreas problemáticas é:

- `patch-v116-v0996-authoritative.js`: renderer final de Perfil e Descobrir;
- `patch-v117-v0996-final.js`: capas visíveis, favoritos de atores, gráfico exato do Perfil e gráficos externos de temporada;
- Home continua usando o runtime canônico 0.99.4 já estabilizado;
- Configurações continua usando a camada Web canônica já estabilizada;
- Histórico permanece integrado ao Perfil e não volta à Sidebar.

Não adicionar `MutationObserver` ou `setInterval` permanente a essas camadas. Reparos devem ser finitos ou orientados a eventos.

## 3. Perfil 0.99.6

Renderer próprio com ordem canônica:
1. Séries;
2. Filmes;
3. Séries Favoritas;
4. Filmes Favoritos;
5. Atores Favoritos;
6. Episódios por dia;
7. Estatísticas extras.

Payload: `cinetracker_profile_payload_v0996()`.

### Gráfico do Perfil

Regra atual:
- fonte: `watch_history`;
- apenas `item_type='episode'`;
- episódios distintos por `(media_id, season_number, episode_number)` por dia;
- intervalo backend: D-10..D+3;
- exatamente sete dias visíveis no viewport;
- Hoje centralizado, portanto posição inicial D-3..D+3;
- rolagem horizontal permite retornar até D-10.

O gráfico antigo de 30 dias não é autoridade da tela 0.99.6.

## 4. Capas ausentes

Auditoria de produção da biblioteca pessoal:
- 2.985 itens no dashboard;
- 1.932 sem `poster_path`;
- apenas 1 recuperável diretamente do `raw_tmdb.poster_path` existente;
- 1.931 dependiam de resolução/enriquecimento TMDB.

Estratégia 0.99.6:
- card usa `poster_path || raw_tmdb.poster_path`;
- card visível com TMDB oficial consulta detalhe diretamente e pinta o pôster imediatamente;
- IDs locais visíveis ainda sem pôster são enviados a `ct-enrich-media-user` com `priority=visible-posters` e `requested_media_ids`;
- Edge Function restringe os IDs ao dashboard autenticado;
- surrogates são resolvidos por ID efetivo ou título/ano sem associação arbitrária;
- cache do Perfil é invalidado quando metadados válidos retornam.

## 5. Atores Favoritos

Tabela `favorite_actors` com RLS e `user_id default auth.uid()`.

Comportamento:
- coração no card de cada ator no elenco;
- favoritar/desfavoritar também na página da pessoa;
- Perfil possui seção Atores Favoritos;
- clique no coração não abre o ator;
- clique no ator abre biografia e filmografia;
- remoção pelo Perfil sincroniza Supabase/UI.

Consulta de produção do payload 0.99.6 confirmou favoritos persistidos, incluindo Nicole Kidman e Zoe Saldaña no momento da validação técnica.

## 6. Detalhe universal de mídia

Todo card de filme/série nas rotas canônicas deve abrir o detalhe universal. Para séries:
- temporadas expansíveis/minimizáveis;
- episódio com capa, SxxExx, título, data, nota e sinopse;
- Marcar como visto;
- Marcar como revisto e preservar plays;
- elenco clicável;
- ator abre biografia e filmografia separada entre Filmes e Séries, mais novos primeiro.

## 7. Gráficos de temporada

Regra obrigatória:
- o gráfico **não** fica dentro do accordion da temporada acima dos episódios;
- o gráfico antigo dentro de `.ct114-season-body` é ocultado;
- existe uma seção independente **Avaliações dos episódios por temporada** depois de todo o bloco `Temporadas e episódios`;
- a seção permanece visível com accordions abertos ou fechados;
- temporadas dos gráficos ficam em carrossel/scroll horizontal;
- carregamento sob demanda por temporada;
- eixo Y 0–10;
- eixo X SxxExx;
- melhor episódio verde, pior vermelho, demais ciano;
- tooltip com código, nota, título e votos.

## 8. Descobrir 0.99.6

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
- `cinetracker_profile_media_dashboard_v0991()` e `cinetracker_discovery_exclusions_v0994()` são requisitos;
- exclusões falham fechado: sem lista pessoal confiável, não mostrar coleção potencialmente errada;
- histórico/vistos/Watchlist/em andamento/em dia/concluídos ficam fora das coleções de conteúdo novo;
- bloqueio usa ID e aliases original/localizado;
- Pra Você mantém exatamente sete posições: filme diário, Filme/Série/Anime da Watchlist não vistos e Filme/Série/Anime novos;
- filme diário exige ano > 1990 e nota TMDB >= 8;
- pools públicos usam duas páginas por fonte principal;
- resolução de imports pessoais sem ID oficial ocorre em paralelo;
- Calendário reutiliza `raw_tmdb.next_episode_to_air` de séries acompanhadas para evitar dezenas de detalhes sequenciais, e combina estreias futuras oficiais.

Caches:
- `ct0996_profile_snapshot_v2`;
- `ct0996_discover_snapshot_v2`.

## 9. Preload / fluidez

Princípio atual: cache-first + atualização silenciosa. Não esperar todo o catálogo antes de liberar interface.

- Perfil e Descobrir mantêm snapshots persistentes;
- `window.__ct0996WarmAll` aquece as fontes compartilhadas;
- pôsteres visíveis recebem prioridade;
- enriquecimento de catálogo não bloqueia a navegação;
- Android incorpora esse mesmo runtime.

## 10. Android 0.99.6

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.6`;
- `versionCode`: `9960`;
- bundle: `android-v0.99.6-authoritative-preload`;
- builder: `scripts/prepare-android-v0996.mjs`;
- test: `scripts/test-android-v0996.mjs`;
- workflow: `.github/workflows/build-android-v0996.yml`;
- release: `android-v0.99.6`;
- APK: `cinetracker-android-0.99.6-debug.apk`;
- APK SHA-256: `777c55e9b2687d30de1aebf28d5b8e3db7ef6c53c7c0b68be47a66219ce5d7c9`;
- certificado SHA-256: `dfff8a709378ba963d6270670c7b4daf1e72736a649a13488f8e61c2064f8686`.

O Android incorpora o mesmo `dist` Web 0.99.6 e exige v116 + v117. Não criar implementação paralela de Perfil/Descobrir.

## 11. Backend 0.99.6

- `cinetracker_profile_payload_v0996()`;
- atividade do Perfil baseada em `watch_history`;
- `favorite_actors` com RLS;
- `ct-enrich-media-user` com suporte a `visible-posters` / `requested_media_ids`;
- exclusões de Descobrir continuam baseadas em `cinetracker_discovery_exclusions_v0994()`.

## 12. Estado de validação

Comprovado:
- [x] source 0.99.6;
- [x] migrations/contratos necessários em produção;
- [x] package/cache Web 0.99.6;
- [x] Verify final da `main` verde;
- [x] Vercel Production verde;
- [x] build Android 0.99.6 verde;
- [x] package/versionCode/versionName APK validados;
- [x] assinatura validada;
- [x] SHA-256 registrado;
- [x] GitHub Release Android publicada.

Ainda não comprovado por automação:
- [ ] smoke real Web/PWA do usuário;
- [ ] smoke real APK em aparelho;
- [ ] confirmação visual de capas antes vazias;
- [ ] confirmação visual do Perfil, Atores Favoritos, Descobrir e gráficos de temporada.

Vídeo/print real prevalece sobre CI caso haja divergência.

## 13. Débitos conhecidos

- grande volume de registros importados ainda possui TMDB surrogate e depende de enriquecimento gradual;
- metadados/runtime podem permanecer incompletos em parte da biblioteca;
- advisories históricos do Supabase permanecem separados desta release;
- a pilha acumulada de compatibilidade ainda é grande e deve ser reduzida futuramente sem romper a autoridade v116/v117.

## 14. Documentos canônicos

`README.md`, `VERSIONS.md`, `CHANGELOG.md`, `PROJECT_STATE.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.6.md`, `docs/validation/0.99.6.md`.

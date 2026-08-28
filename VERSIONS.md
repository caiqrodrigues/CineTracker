# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-28

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.7** | package `0.99.7`, cache `ct-web-0.99.7`, autoridade final `patch-v118-v0997-authoritative.js` | branch de correção; CI/publicação pendentes |
| Android | **0.99.7** | `versionName 0.99.7`, `versionCode 9970`, bundle `android-v0.99.7-single-authority` | builder/workflow preparados; APK/publicação pendentes |
| Backend / Supabase | **0.99.7** | RPC `cinetracker_profile_payload_v0997(text)` + contratos anteriores | migration de atividade local aplicada em produção |
| Windows | — | — | não lançado |

## Release corretiva unificada 0.99.7

A 0.99.7 nasce do smoke real em vídeo da release anterior. A validação visual mostrou capas ainda vazias, ausência de controles de atores favoritos, gráfico de Perfil divergente, gráfico de temporada no lugar errado e Descobrir sem os filtros/layout combinados. Por isso a 0.99.7 substitui o encadeamento de reparos dessas áreas por uma única autoridade final.

### Autoridade de runtime

`patch-v118-v0997-authoritative.js` passa a ser o único runtime emitido para:
- Perfil;
- Descobrir;
- busca global de Home/Descobrir;
- detalhe de filme/série;
- detalhe e favoritos de atores;
- gráficos de avaliação das temporadas;
- reparo/enriquecimento progressivo de capas visíveis.

Na saída final 0.99.7 deixam de executar os antigos `v111`, `v114`, `v115`, `v116` e `v117`, evitando que uma camada antiga sobrescreva o DOM final.

## Perfil 0.99.7

Ordem canônica:
1. Séries;
2. Filmes;
3. Séries Favoritas;
4. Filmes Favoritos;
5. Atores Favoritos;
6. Episódios por dia;
7. Estatísticas extras.

O gráfico de atividade usa `cinetracker_profile_payload_v0997(p_tz)`. O navegador envia o timezone IANA real; o backend agrupa `watched_at` pela data local, não pela data UTC. O intervalo é D-10..D+3, exatamente sete dias ficam visíveis por viewport e Hoje abre centralizado em D-3..D+3.

## Atores Favoritos

- coração aparece diretamente em cada card de elenco;
- página da pessoa possui `Favoritar ator` / `Ator favorito`;
- persistência em `favorite_actors`;
- Perfil lista Atores Favoritos e permite remoção;
- clique no coração não abre a pessoa; clique no card abre biografia/filmografia.

## Gráficos de temporadas

Regra 0.99.7:
- accordion da temporada contém **somente episódios**;
- gráfico não fica acima, abaixo nem dentro dos episódios da temporada aberta;
- existe uma seção independente **Avaliações dos episódios por temporada** após todo o bloco `Temporadas e episódios`;
- a seção independe de qualquer temporada estar aberta;
- temporadas do gráfico navegam por scroll horizontal;
- melhor episódio verde, pior vermelho, demais ciano;
- tooltip contém SxxExx, nota, título e quantidade de votos.

## Descobrir 0.99.7

Tabs:
- Pra Você;
- Em alta;
- Mais aguardados;
- Populares;
- Mais bem avaliados;
- Calendário.

Filtros:
- Tipo: Todos / Séries / Filmes;
- Visualização: Lista / Carrossel / Grade.

Layout:
- Grade compacta: cards de aproximadamente 128–152 px;
- Carrossel: cards de 142 px;
- Lista: linha compacta com pôster 64×92;
- cards de Pra Você, Watchlist e 100% novos usam a mesma escala visual.

Regras:
- `cinetracker_discovery_exclusions_v0994()` é obrigatório; sem exclusões pessoais válidas o Descobrir falha fechado;
- vistos, histórico, Watchlist, em andamento, em dia e concluídos não entram nas coleções públicas;
- bloqueio por TMDB ID e aliases original/localizado;
- indicação do dia: filme após 1990, nota TMDB >= 8, nunca visto e fora da Watchlist;
- Da sua Watchlist: Filme/Série/Anime ainda não vistos;
- 100% novos: Filme/Série/Anime fora de histórico e Watchlist;
- Calendário combina filmes futuros e `next_episode_to_air` das séries acompanhadas, com filtro Todos/Séries/Filmes.

## Capas

Cards usam `poster_path || raw_tmdb.poster_path`. Cards visíveis ainda sem imagem são priorizados por proximidade do viewport e enviados para `ct-enrich-media-user` com `priority=visible-posters` e `requested_media_ids`. A correção é reavaliada ao rolar a página, sem polling permanente.

## Android 0.99.7

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7`;
- `versionCode`: `9970`;
- builder: `scripts/prepare-android-v0997.mjs`;
- test: `scripts/test-android-v0997.mjs`;
- workflow: `.github/workflows/build-android-v0997.yml`;
- release alvo: `android-v0.99.7`;
- APK alvo: `cinetracker-android-0.99.7-debug.apk`.

O APK é gerado a partir do mesmo `dist` Web 0.99.7 e rejeita explicitamente a presença das autoridades obsoletas v111/v114/v115/v116/v117.

## Estado de publicação

- Supabase RPC 0.99.7: **aplicado**;
- source Web/Android 0.99.7: **em branch**;
- Verify: **pendente**;
- Vercel Production: **pendente**;
- APK 0.99.7: **pendente**;
- assinatura/SHA-256: **pendentes**;
- GitHub Release Android: **pendente**;
- smoke real Web/APK: **pendente**.

## Regra obrigatória

Source, migration, CI, deploy Web, build APK, assinatura, release e smoke real são estados separados. Vídeo/print real prevalece sobre CI quando houver divergência.

Release: `docs/releases/0.99.7.md`.  
Validação: `docs/validation/0.99.7.md`.

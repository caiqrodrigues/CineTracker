# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-28

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.6** | package `0.99.6`, cache `ct-web-0.99.6`, autoridade `patch-v116-v0996-authoritative.js`, final `patch-v117-v0996-final.js` | publicada em `main`; Verify #1398 success; Vercel Production success; smoke real pendente |
| Android | **0.99.6** | `versionName 0.99.6`, `versionCode 9960`, bundle `android-v0.99.6-authoritative-preload` | Release `android-v0.99.6` publicada; build/assinatura/SHA aprovados; smoke real pendente |
| Backend / Supabase | **0.99.6** | RPC `cinetracker_profile_payload_v0996`, `favorite_actors`, `ct-enrich-media-user` | contratos 0.99.6 aplicados em produção |
| Windows | — | — | não lançado |

## Release unificada 0.99.6

A 0.99.6 volta a alinhar Web e Android. O APK é montado a partir do mesmo `dist` validado da Web e incorpora os scripts do runtime em vez de manter uma segunda implementação visual.

### Autoridade final

- `patch-v116-v0996-authoritative.js`: renderer final de Perfil e Descobrir;
- `patch-v117-v0996-final.js`: capas visíveis, favoritos de atores, ajuste exato do gráfico do Perfil e avaliações externas por temporada;
- Perfil e Descobrir deixam de depender de reorganização posterior do DOM legado.

### Perfil

Ordem canônica:
1. Séries;
2. Filmes;
3. Séries Favoritas;
4. Filmes Favoritos;
5. Atores Favoritos;
6. Episódios por dia;
7. Estatísticas extras.

O gráfico recebe D-10..D+3 do backend, exibe exatamente sete dias por viewport e centraliza Hoje, deixando D-3..D+3 visíveis na posição inicial.

### Detalhe de série

- episódios: capa, data, nota, sinopse, visto e revisto;
- temporadas expansíveis;
- gráfico de notas removido de dentro do accordion;
- seção independente **Avaliações dos episódios por temporada** abaixo do bloco de temporadas/episódios;
- seção visível independentemente de temporada aberta/fechada;
- scroll horizontal entre temporadas;
- melhor episódio verde, pior vermelho, demais ciano, tooltip com votos.

### Descobrir

- Pra Você / Em alta / Mais aguardados / Mais bem avaliados / Calendário;
- Geral / Séries / Filmes;
- busca de filmes, séries e atores;
- exclusão obrigatória de vistos, histórico e Watchlist por ID e aliases;
- falha fechada se exclusões pessoais não estiverem disponíveis;
- Pra Você: filme diário (>1990 e nota >=8), Filme/Série/Anime da Watchlist não vistos e Filme/Série/Anime 100% novos;
- resolução de imports pessoais sem TMDB oficial em paralelo;
- Calendário usa dados de `next_episode_to_air` já sincronizados para reduzir chamadas e latência.

### Capas

A auditoria encontrou 1.932 itens do dashboard sem `poster_path`. A 0.99.6 utiliza fallback de `raw_tmdb.poster_path`, consulta direta quando existe TMDB oficial e enriquecimento direcionado de cards visíveis por `requested_media_ids`.

### Android 0.99.6

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.6`;
- `versionCode`: `9960`;
- workflow: `.github/workflows/build-android-v0996.yml`;
- Release: `android-v0.99.6`;
- APK: `cinetracker-android-0.99.6-debug.apk`;
- APK SHA-256: `777c55e9b2687d30de1aebf28d5b8e3db7ef6c53c7c0b68be47a66219ce5d7c9`;
- certificado SHA-256: `dfff8a709378ba963d6270670c7b4daf1e72736a649a13488f8e61c2064f8686`.

## Publicação 0.99.6

- código funcional promovido a `main`: `781cc537ac9e408c574517855320caf260904a9e`;
- Verify `33165215299` / #1398: success;
- Vercel Production: success;
- Android Production workflow `33165215281`: success;
- GitHub Release `android-v0.99.6`: publicada.

## Regra obrigatória

Source, migration, Edge Function, CI, Vercel, APK, assinatura e smoke real são estados separados. A publicação técnica 0.99.6 está concluída, mas UX só será considerada validada após teste real da Web/PWA e do APK.

Release: `docs/releases/0.99.6.md`.  
Validação: `docs/validation/0.99.6.md`.

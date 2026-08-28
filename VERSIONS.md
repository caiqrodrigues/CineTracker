# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-28

## Matriz atual

| Sistema | Versão alvo | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.6** | package `0.99.6`, cache `ct-web-0.99.6`, autoridade `patch-v116-v0996-authoritative.js`, final `patch-v117-v0996-final.js` | candidato em `fix/web-android-0.99.6-authoritative`; ainda não considerado publicado até Verify + Vercel + smoke real |
| Android | **0.99.6** | `versionName 0.99.6`, `versionCode 9960`, bundle `android-v0.99.6-authoritative-preload` | candidato; APK final só é publicado após build, identidade, assinatura e SHA-256 aprovados |
| Backend / Supabase | **0.99.6** | RPC `cinetracker_profile_payload_v0996`, Edge Function `ct-enrich-media-user` v5 | migrations/funções necessárias já aplicadas em produção; cliente 0.99.6 ainda em validação |
| Windows | — | — | não lançado |

## Release unificada 0.99.6

A 0.99.6 volta a alinhar Web e Android. O APK é montado a partir do mesmo `dist` validado da Web, com scripts incorporados no bundle Android.

### Autoridade final de interface

- `patch-v116-v0996-authoritative.js` é o renderer final de Perfil e Descobrir;
- Perfil não depende mais de reorganizar DOM legado depois do render;
- Descobrir não depende mais de listas antigas para a tela final;
- `patch-v117-v0996-final.js` adiciona reparos finais sem criar outro renderer concorrente: capas ausentes, favoritos de atores e carrossel externo de avaliações por temporada.

### Perfil

Ordem canônica:

1. Séries;
2. Filmes;
3. Séries Favoritas;
4. Filmes Favoritos;
5. Atores Favoritos;
6. gráfico de episódios por dia;
7. Estatísticas extras.

O gráfico usa `watch_history` e conta episódios distintos por dia. A janela é de 10 dias anteriores até 3 dias futuros, com Hoje centralizado.

### Detalhe de série

- temporadas continuam expansíveis para exibir episódios;
- o gráfico de notas não fica dentro da temporada/accordion;
- existe uma seção independente **Avaliações dos episódios por temporada** depois do bloco de episódios;
- a seção existe mesmo com temporadas fechadas;
- temporadas do gráfico são navegadas horizontalmente;
- cada gráfico usa escala 0–10, SxxExx, melhor episódio verde, pior vermelho e tooltip com nota/título/votos.

### Descobrir

- tabs: Pra Você / Em alta / Mais aguardados / Mais bem avaliados / Calendário;
- filtros: Geral / Séries / Filmes;
- exclusões de visto/histórico/Watchlist são obrigatórias para conteúdo novo;
- se o conjunto de exclusão autenticado não estiver disponível, o carregamento falha fechado em vez de recomendar algo potencialmente já visto;
- Pra Você mantém indicação diária, Watchlist não vista e opções 100% novas;
- Calendário usa `next_episode_to_air` oficial para séries acompanhadas e datas futuras de filmes.

### Capas e metadados

`ct-enrich-media-user` v5 aceita enriquecimento direcionado de IDs visíveis sem capa. IDs solicitados são limitados ao dashboard do usuário autenticado. Isso resolve imports legados com `tmdb_id` substituto/negativo e `poster_path` ausente sem liberar enriquecimento arbitrário.

### Android

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.6`;
- `versionCode`: `9960`;
- workflow: `.github/workflows/build-android-v0996.yml`;
- release alvo: `android-v0.99.6`;
- APK alvo: `cinetracker-android-0.99.6-debug.apk`;
- SHA-256: pendente do build final.

## Estado publicado anterior

O vídeo real recebido em 2026-08-28 ainda mostra produção Web `0.99.5`. A 0.99.6 **não deve ser declarada publicada** apenas porque source, migration ou CI parcial existem.

## Regra obrigatória

Source, migration, Edge Function, CI, Vercel, APK, assinatura e smoke em ambiente real são estados separados. Só registrar uma release como concluída quando os estados aplicáveis estiverem comprovados.

Release 0.99.6: `docs/releases/0.99.6.md`.  
Validação 0.99.6: `docs/validation/0.99.6.md`.

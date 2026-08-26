# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-26

## Matriz atual

| Sistema | Versão atual | Versão técnica adicional | Estado de source |
|---|---:|---|---|
| Web | **0.0.99** | package `0.0.99`, cache `ct-web-0.0.99` | implementado em `main` |
| Android | **0.0.99** | `versionCode 997` | source + pipeline dedicado em `main` |
| Backend / Supabase | **0.0.99** | RPC `cinetracker_profile_media_dashboard`; `ct-backup-user` v1; Bingers v8 | migration/RPC ativos |
| Windows | **—** | — | não lançado |

## Identidade 0.0.99

### Web
- package: `0.0.99`;
- Service Worker: `ct-web-0.0.99`;
- camada final: `patch-v091-v099-profile-lru.js`;
- rodapé: `CineTracker • v0.0.99`.

### Android
- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.99`;
- `versionCode`: `997`;
- bundle alvo: `v0.0.99-profile-lru-v95-core-inline-authoritative`;
- workflow: `.github/workflows/build-android-v099.yml`;
- tag/release alvo: `android-v0.0.99`.

## Backend 0.0.99

Migration: `20260826234500_v099_profile_media_lru_dashboard.sql`.

A RPC `cinetracker_profile_media_dashboard()` é `SECURITY INVOKER`, usa `auth.uid()` e produz a visão central do Perfil com progresso, favoritos, estados e `last_watched_at`.

Edge Functions mantêm numeração própria:
- `ct-backup-user`: v1;
- `ct-import-bingers-user`: v8;
- `tmdb-proxy` e `tmdb-image`: versões de deploy independentes.

## Conteúdo funcional da 0.0.99

- quatro carrosséis no Perfil: Séries, Séries favoritas, Filmes, Filmes favoritos;
- cards 2:3 com título, progresso, favorito e última atividade;
- LRU por `last_watched_at DESC`;
- atualização reativa após gravações de histórico/progresso/overrides;
- subtela Séries com Em andamento, Não iniciadas, Assistir mais tarde/Watchlist, Em dia e Concluídas;
- subtela Filmes com Assistir a seguir/Watchlist e Já vistos;
- favoritos em grid completo responsivo de 2/3 colunas;
- detalhe TMDB quando o ID é oficial e detalhe local seguro para surrogate negativo;
- preservação integral da navegação, Descobrir, Backup, Cache, Metadados e importação Bingers da 0.0.98.

## Linha recente

- **0.0.97 HOTFIX 15** — transporte/picker e shape homogêneo do histórico;
- **0.0.97 HOTFIX 16** — Bingers resiliente/idempotente;
- **0.0.97 HOTFIX 17** — Perfil server-side e estados das séries;
- **0.0.97 HOTFIX 18** — governança/versionamento;
- **0.0.98** — navegação, Histórico absorvido pelo Perfil, backup CSV/ZIP e Descobrir reformulado;
- **0.0.99** — biblioteca pessoal do Perfil com favoritos, grids e ordenação LRU reativa.

## Regra obrigatória

Toda nova unidade lógica de mudança recebe nova versão e registro no GitHub. Source, validação automatizada, deploy Web, publicação APK e teste em aparelho real são estados separados.

Release atual: `docs/releases/0.0.99.md`.  
Validação atual: `docs/validation/0.0.99.md`.

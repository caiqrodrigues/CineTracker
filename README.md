# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. Web e Android compartilham conta, biblioteca, Watchlist, histórico, progresso, Perfil, descoberta, configurações e backup por meio do Supabase.

## Versão atual

| Sistema | Versão | Estado comprovado |
|---|---:|---|
| Web | **0.0.99** | package `0.0.99`, cache `ct-web-0.0.99`; Verify/build e Vercel concluídos |
| Android | **0.0.99** | `versionName 0.0.99`, `versionCode 997`; APK/artifact/Release publicados |
| Backend lógico | **0.0.99** | RPC LRU aplicada; Edge Functions possuem versões próprias |
| Windows | — | não lançado |

A 0.0.99 preserva a navegação, Descobrir, backup CSV/ZIP e manutenção da 0.0.98 e reformula a biblioteca pessoal do Perfil.

## Perfil 0.0.99

Logo abaixo das estatísticas principais existem quatro carrosséis horizontais de cards 2:3:

1. **Séries** — séries em andamento ou já iniciadas/recentes;
2. **Séries favoritas** — séries com estado `Liked`;
3. **Filmes** — filmes vistos/recentes;
4. **Filmes favoritos** — filmes com estado `Liked`.

Cada card exibe pôster, título, progresso (`18/20`, contagem de episódios, `Visto ✓`, etc.), badge `♥` quando favoritado e a data da última atividade. Cards com TMDB oficial abrem a tela de detalhes existente. Mídias importadas com surrogate TMDB negativo continuam clicáveis por um detalhe local, sem enviar ID inválido à TMDB.

### LRU / sincronização

A ordenação principal é `last_watched_at DESC`. `cinetracker_profile_media_dashboard()` calcula `last_watched_at` usando histórico, progresso de episódios e timestamp de `AlreadySeen` de filmes. Ao gravar `watch_history`, `episode_progress` ou `media_overrides`, a camada 0.0.99 dispara atualização reativa do Perfil; foco/retorno à aba e uma reconciliação periódica funcionam como fallback para alterações externas.

### Cabeçalhos clicáveis

- **Séries ›** abre uma visão completa com: Em andamento, Não iniciadas, Assistir mais tarde / Watchlist, Em dia e Concluídas.
- **Filmes ›** abre: Assistir a seguir / Watchlist e Já vistos.
- **Séries favoritas ›** e **Filmes favoritos ›** abrem grids completos responsivos de 2/3 colunas.

## Backend do Perfil

Migration: `supabase/migrations/20260826234500_v099_profile_media_lru_dashboard.sql`.

RPC `cinetracker_profile_media_dashboard()` é `SECURITY INVOKER`, filtra por `auth.uid()` e consolida progresso, `last_watched_at`, favoritos (`Liked`), AddedToWatchlist / WatchLater, InProgress / UpToDate / Completed, não iniciadas e já vistas.

## Recursos preservados da 0.0.98

- navegação oficial: Home, Descobrir, Perfil e Configurações; Histórico não é aba separada;
- Descobrir: Pra você → Em alta → Mais aguardados → Mais bem avaliados → Calendário, com filtros Todos/Filmes/Séries quando aplicável e ranking decrescente;
- Backup & Restauração com apenas Exportar/Importar e ZIP contendo CSVs completos;
- Edge Function autenticada `ct-backup-user` v1;
- Limpar Cache e Atualizar Metadados funcionais;
- importador Bingers resiliente preservado (`ct-import-bingers-user` v8).

## Publicação 0.0.99

### Web
- Verify final: run `33021058624` — success;
- status Vercel do commit funcional `f4261cb944b60c15c01b41989645e8c64468e4ef`: success / Deployment has completed.

### Android
- pipeline: run `33021058734` — success;
- bundle: `v0.0.99-profile-lru-v95-core-inline-authoritative`;
- APK: `cinetracker-android-0.0.99-debug.apk`;
- artifact `cinetracker-android-0.0.99-debug`, ID `9626549788`;
- GitHub Release `android-v0.0.99`, ID `377463898`;
- SHA-256: `c39c08cd51470050f3eac2c444c4d468dcfcb4072230cf9e082def9ab176cf57`.

Build, `aapt`, assinatura, runtime embarcado, artifact e Release foram aprovados. Instalação em aparelho real e smoke visual autenticado continuam explicitamente separados como testes manuais pendentes.

## Documentação canônica

- `PROJECT_STATE.md` — continuidade técnica atual;
- `VERSIONS.md` — matriz de versões;
- `CHANGELOG.md` — histórico completo;
- `docs/DEVELOPMENT_RULES.md` — regra obrigatória de versionamento/registro;
- `docs/ARCHITECTURE.md` e `docs/SECURITY.md`;
- `docs/releases/0.0.99.md` — release atual;
- `docs/validation/0.0.99.md` — evidências executadas.

**Regra permanente:** toda atualização/mudança recebe nova versão e registro integral no GitHub. Source, build, deploy, publicação e teste físico são estados distintos.

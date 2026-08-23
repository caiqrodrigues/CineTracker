# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.60** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Arquitetura

```text
CineTracker
├── apps/web
├── apps/android
│   └── app/src/main/assets          runtime móvel versionado ctXX.js
├── supabase
├── docs/releases
├── scripts
├── CHANGELOG.md
├── VERSIONS.md
├── PROJECT_STATE.md
└── .github/workflows
```

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Android 0.0.60

A 0.0.60 carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js` e `ct50.js`.

- Descobrir oculta itens já vistos, concluídos, em progresso, acompanhados ou presentes em listas/estados persistentes da conta em todos os filtros e rerenders.
- Detalhes de filme/série seguem um padrão visual único: poster, título/metadados, nota TMDB, ações, sinopse, disponibilidade e temporadas/episódios.
- `Onde assistir` aparece uma única vez e usa cards horizontais de provedores informados pela TMDB no Brasil, incluindo streaming/aluguel/compra quando disponíveis.
- Episódios recebem nota TMDB quando disponível e ação textual `Assistido`.
- Cards Android recebem nota TMDB quando disponível.
- Configurações exibe a build `0.0.60`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Backend

**Supabase:** Auth, PostgreSQL, RLS e RPCs autenticadas.  
**Metadados:** TMDB via funções/proxy de backend.  
**Deploy Web:** Vercel.  
**Android:** Java, Android WebView, WorkManager e Gradle.  
**CI/CD:** GitHub Actions.

### RPCs relevantes

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications`

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.

## Segurança

- Navegador e Android usam somente chave publicável do Supabase.
- Dados privados ficam protegidos por autenticação/RLS.
- RPCs usam `auth.uid()` para limitar dados ao próprio perfil.
- Decisões manuais do usuário não devem ser apagadas por novas importações.

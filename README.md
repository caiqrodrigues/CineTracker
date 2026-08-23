# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso por episódio, favoritos, recomendações, descoberta TMDB, estatísticas, backup e notificações nativas no Android.

## Versões

| Plataforma | Publicada | Em implementação |
|---|---:|---:|
| Web | **0.4.9** | **0.5.0** |
| Android | **0.0.49** | **0.0.50** |
| Windows | — | planejado |

Produção Web: `https://mycinetracker.vercel.app`

## Arquitetura

```text
CineTracker
├── apps/web                         aplicação Web
├── apps/android                     Android nativo (Java + WebView)
│   └── app/src/main/assets          runtime móvel ctXX.js
├── docs/releases                    documentação por versão
├── scripts                          build e validações Web
├── ci-status                        baseline/diagnósticos de CI
├── CHANGELOG.md                     histórico consolidado
├── VERSIONS.md                      matriz de versões
├── PROJECT_STATE.md                 estado técnico atual
└── .github/workflows                CI/CD Android e validações
```

Web e Android compartilham autenticação, Supabase, histórico, Watchlist, progresso, favoritos e metadados TMDB. Notificações são exclusivas do Android.

## Funcionalidades principais

- Home com recomendações, Watchlist e `Continuar assistindo` sincronizado com `Assistir > Acompanhando`.
- Assistir separado em `Em dia`, `Acompanhando`, `Juntando poeira` e `Não iniciadas`.
- Carrossel como modo principal, além de Grade e Lista.
- Série → temporada → episódio → marcação/desmarcação de assistido.
- Marcação inteligente: ao marcar um episódio posterior, pode marcar automaticamente os anteriores da mesma temporada.
- Ordenação de Acompanhando por atividade recente.
- Perfil com estatísticas e Tempo de Tela diário interativo.
- Descobrir com cards compactos e objetivo de três colunas no mobile.
- Capas e nomes resolvidos via TMDB com cache.
- Onde assistir no Brasil via TMDB Watch Providers; filmes recentes podem indicar janela de cinema/lançamento.
- Configurações com conta, senha, importação e exportação.
- Android com notificações de filmes da Watchlist e novos episódios.

## Android 0.0.50

A camada final `ct50.js` adiciona:

- Home rolável e clicável para abrir a série;
- Voltar físico/gesto integrado ao histórico interno do app;
- marcação inteligente de episódios anteriores;
- reordenação por último episódio visto;
- atualização visual imediata após progresso;
- disponibilidade de streaming/cinema;
- reforço final de Descobrir em três colunas.

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js` e `ct50.js`.

### Assinatura Android

A 0.0.49 é a base permanente de assinatura após a reinstalação única autorizada. Baseline SHA-256 atual:

`277a81b60c689c801ea9d45a311de29c2e5ed97fdc5bea0f4705f8531153e1ed`

0.0.50+ só são publicadas se package `com.cinetracker.app` e certificado coincidirem com esse baseline.

## Web 0.5.0

A Web recebe paridade das funções não nativas da 0.0.50 por `patch-v050.js`: marcação inteligente, ordenação recente, atualização de progresso, disponibilidade e reforço de três colunas.

## Backend

- Supabase Auth/PostgreSQL/RLS/RPCs autenticadas.
- TMDB para títulos, posters, elenco, temporadas, episódios e Watch Providers.
- Vercel para produção Web.
- Android Java + WebView + WorkManager + Gradle.
- GitHub Actions para build, assinatura e Release Android.

### RPCs relevantes

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## Regra de publicação

Uma versão não é considerada concluída apenas porque compilou. Código, documentação, versionamento e pipeline precisam estar sincronizados. Android exige também Release + APK e teste real em aparelho; Web exige deploy real e validação no ambiente publicado.

Detalhes: `VERSIONS.md`, `PROJECT_STATE.md` e `docs/releases/`.

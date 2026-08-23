# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso por episódio, favoritos, recomendações, descoberta TMDB, estatísticas, backup e notificações nativas no Android.

## Versões

| Plataforma | Status |
|---|---|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.50 publicada** |
| Windows | planejado |

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
- Descobrir compacto em três colunas no mobile.
- Capas e nomes resolvidos via TMDB com cache.
- Onde assistir no Brasil via TMDB Watch Providers; filmes recentes podem indicar cinema/lançamento.
- Configurações com conta, senha, importação e exportação.
- Android com notificações de filmes da Watchlist e novos episódios.

## Android 0.0.50

A camada final `ct50.js` adiciona Home rolável/clicável, Voltar integrado à navegação interna, marcação inteligente de episódios anteriores, ordenação pelo último episódio visto, atualização imediata após progresso, disponibilidade de streaming/cinema e reforço de Descobrir em três colunas.

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js` e `ct50.js`.

### Assinatura Android

A 0.0.50 é a base atual de assinatura estabilizada pelo CI. Baseline SHA-256:

`651e737a4e1de5d5db89773116528cd3ab3b0764a736dbd12dd8894fcc55bae7`

Próximas versões devem preservar `com.cinetracker.app` e essa assinatura.

## Web 0.5.0

A Web recebe paridade das funções não nativas da 0.0.50 por `patch-v050.js`: marcação inteligente, ordenação recente, atualização de progresso, disponibilidade e três colunas. O último deploy de produção pode depender do limite de builds do Vercel.

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
- `cinetracker_mark_episode_through`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## Regra de publicação

Uma versão não é considerada concluída apenas porque compilou. Código, documentação, versionamento e pipeline precisam estar sincronizados. Android exige também Release + APK e teste real em aparelho; Web exige deploy real e validação no ambiente publicado.

Detalhes: `VERSIONS.md`, `PROJECT_STATE.md` e `docs/releases/`.

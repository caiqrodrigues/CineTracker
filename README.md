# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso por episódio, favoritos, recomendações, descoberta TMDB, estatísticas, backup e notificações nativas no Android.

## Versões

| Plataforma | Status |
|---|---|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.51 publicada** |
| Windows | planejado |

Produção Web: `https://mycinetracker.vercel.app`

## Arquitetura

```text
CineTracker
├── apps/web                         aplicação Web
├── apps/android                     Android nativo (Java + WebView)
│   └── app/src/main/assets/ct51.js  runtime Android consolidado
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

- Home com `Continuar assistindo` sincronizado com `Assistir > Acompanhando`.
- Continuar assistindo em carrossel horizontal, cards clicáveis e check do próximo episódio.
- Assistir separado em `Em dia`, `Acompanhando`, `Juntando poeira` e `Não iniciadas`.
- Carrossel como modo principal, além de Grade e Lista.
- Série → temporada → episódio → marcação/desmarcação de assistido.
- Marcação inteligente: episódio posterior pode marcar automaticamente os anteriores da temporada após confirmação.
- Ordenação de Acompanhando pelo último episódio visto.
- Perfil com estatísticas e Tempo de Tela diário interativo.
- Descobrir compacto em três colunas no mobile.
- Capas e nomes resolvidos via TMDB.
- Onde assistir no Brasil via TMDB Watch Providers.
- Configurações com conta, senha, importação e exportação.
- Android com notificações de filmes da Watchlist e novos episódios.

## Android 0.0.51

A 0.0.51 remove a pilha local `ct41 + ct47 + ct48 + ct49 + ct50`. A Activity injeta apenas `ct51.js`, evitando que handlers e observers antigos sobrescrevam a navegação mais nova.

Principais correções:

- Home rolável horizontalmente e clique direto na ficha da série;
- clique da Home não passa mais por Estatísticas ou outra aba;
- botão Assistir nativo aponta diretamente para `assist`;
- série, temporada e episódio têm navegação própria;
- Voltar físico/gesto percorre a pilha interna;
- Acompanhando reordena por atividade recente;
- disponibilidade de streaming aparece na ficha;
- Descobrir reforçado em três colunas;
- Configurações exibe a build `0.0.51` sem duplicação.

### Assinatura Android

A 0.0.51 criou uma nova chave estável `v5`, persistida após o primeiro build bem-sucedido. Baseline SHA-256 atual:

`d4954df3952a7bd63519db79e7369ff55e5fe3d330aa4d5630287621cc79fd43`

A 0.0.52+ deve reutilizar exatamente essa chave e manter `applicationId=com.cinetracker.app`.

## Web 0.5.0

A Web mantém paridade das funções não nativas: marcação inteligente, ordenação recente, atualização de progresso, disponibilidade e três colunas.

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

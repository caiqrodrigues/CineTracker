# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.59** | Build automatizado / Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Arquitetura

```text
CineTracker
├── apps/web                         aplicação Web
├── apps/android                     Android nativo (Java + WebView)
│   └── app/src/main/assets          runtime móvel versionado ctXX.js
├── supabase                         migrations e funções compartilhadas
├── docs/releases                    documentação por versão
├── scripts                          build e validações
├── CHANGELOG.md                     histórico consolidado
├── VERSIONS.md                      versões por plataforma
├── PROJECT_STATE.md                 estado técnico atual
└── .github/workflows                CI/CD Web e Android
```

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Paridade Web / Android

A Web 0.4.8 mantém a base compartilhada usada pelo Android. O Android adiciona navegação e ajustes móveis, além de notificações nativas.

- Perfil com estatísticas e Tempo de Tela diário interativo.
- Assistir separado em `Em dia`, `Acompanhando`, `Juntando poeira` e `Não iniciadas`.
- Carrossel como padrão, com Grade e Lista disponíveis.
- Série → temporada → episódio, com marcação persistente de episódios vistos.
- Descobrir com grid compacto de três colunas e posters 2:3.
- Resolução global de nomes/capas com cache e TMDB.
- Configurações com alteração de e-mail/senha, importação e exportação de backup.

Detalhes Web: `docs/releases/web-0.4.8.md`.

## Android 0.0.59

A 0.0.59 mantém os módulos estáveis `ct41.js`, `ct47.js` e `ct48.js` e adiciona `ct49.js` apenas para as correções desta versão.

- Botões que avançam episódio exibem `Assistido` em vez de `Próximo episódio`.
- Progresso de séries exibe também `Faltam X episódios` nas áreas de série suportadas.
- Descobrir oculta títulos já vistos/concluídos, em progresso/acompanhamento e presentes na Watchlist/Watch Later.
- O gráfico do Perfil deixa de ser ocultado pelo patch Android anterior.
- Configurações exibe a build `0.0.59`.
- Notificações nativas permanecem preservadas.

### Migração única de assinatura

A APK publicada da 0.0.46 foi assinada por uma chave privada que não está mais disponível. A 0.0.48 estabeleceu o baseline permanente de assinatura; versões 0.0.49+ devem instalar por sobreposição e manter o mesmo certificado.

Detalhes Android: `docs/releases/0.0.59.md`.

## Backend

**Supabase:** Auth, PostgreSQL, RLS e RPCs autenticadas.  
**Metadados:** TMDB via funções/proxy de backend.  
**Deploy Web:** Vercel.  
**Android:** Java, Android WebView, WorkManager e Gradle.  
**CI/CD:** GitHub Actions.

### RPCs relevantes

- `cinetracker_continue_items_v2` — classificação das séries em acompanhamento.
- `cinetracker_episode_state` — estado de episódios por usuário.
- `cinetracker_set_episode_watched` — persiste marcação manual.
- `cinetracker_watch_daily_timeline` — timeline diária do Perfil.
- `cinetracker_watch_day_details` — itens assistidos em um dia.
- `cinetracker_due_notifications` — eventos de notificação Android.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.

## Segurança

- Navegador e Android usam somente chave publicável do Supabase.
- Dados privados ficam protegidos por autenticação/RLS.
- RPCs usam `auth.uid()` para limitar dados ao próprio perfil.
- Decisões manuais do usuário não devem ser apagadas por novas importações.

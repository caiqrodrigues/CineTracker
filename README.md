# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.48** | Build automatizado / Release GitHub |
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

A Web 0.4.8 adapta as funcionalidades do Android 0.0.48 ao navegador, exceto notificações nativas.

- Perfil com estatísticas e Tempo de Tela diário interativo.
- Sete dias visíveis no gráfico, hoje centralizado, navegação para dias anteriores e detalhe do que foi assistido ao clicar no dia.
- Assistir separado em `Em dia`, `Acompanhando`, `Juntando poeira` e `Não iniciadas`.
- Carrossel como padrão, com Grade e Lista disponíveis.
- Série → temporada → episódio, com marcação persistente de episódios vistos.
- Descobrir com grid compacto de três colunas e posters 2:3.
- Resolução global de nomes/capas com cache e TMDB.
- Configurações com alteração de e-mail/senha, importação e exportação de backup.

Detalhes Web: `docs/releases/web-0.4.8.md`.

## Android 0.0.48

A 0.0.48 consolida a camada Android e carrega somente `ct41.js`, `ct47.js` e `ct48.js` para evitar que patches antigos reintroduzam telas desatualizadas.

- Perfil sem gráfico antigo por horário/horário de pico.
- Descobrir com três cards por linha.
- Assistir com Carrossel/Grade/Lista e ordem Em dia → Acompanhando → Juntando poeira → Não iniciadas.
- Série → temporada → episódio e marcação persistente.
- Configurações exibe uma única build `0.0.48`.
- Notificações nativas validadas anteriormente são preservadas.

### Migração única de assinatura

A APK publicada da 0.0.46 foi assinada por uma chave privada que não está mais disponível. A chave persistente atual usa outro certificado. Por isso, instalações antigas precisam ser removidas **uma única vez** antes da 0.0.48. A 0.0.48 passa a ser o baseline permanente de assinatura; versões 0.0.49+ devem instalar por sobreposição e o CI bloqueia mudança de certificado.

Detalhes Android: `docs/releases/0.0.48.md`.

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

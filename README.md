# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.61** | Código + pipeline de Release GitHub |
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

## Android 0.0.61

A 0.0.61 carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js` e `ct51.js`.

- Descobrir passa a bloquear conteúdo conhecido por duas chaves: identificador TMDB e título normalizado. Isso cobre Destaque e os demais filtros/rerenders, mesmo quando o card não expõe `data-media-id` diretamente.
- São excluídos títulos vistos, concluídos, em progresso, acompanhados, Watchlist, Watch Later ou qualquer outro estado persistente da conta.
- `Onde assistir` mantém apenas um card por serviço. Variantes do mesmo provedor, como múltiplos canais/planos do Paramount+, são consolidadas em uma única entrada.
- O padrão visual de detalhes, notas, ações e episódios da 0.0.60 é preservado.
- Configurações exibe a build `0.0.61`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Backend

**Supabase:** Auth, PostgreSQL, RLS e RPCs autenticadas.  
**Metadados:** TMDB via funções/proxy de backend.  
**Deploy Web:** Vercel.  
**Android:** Java, Android WebView, WorkManager e Gradle.  
**CI/CD:** GitHub Actions.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.

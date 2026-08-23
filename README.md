# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.65** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.65

A 0.0.65 corrige os problemas restantes observados no vídeo da 0.0.64.

- restaura `ct53.js` para a função correta de marcador de build, eliminando a duplicação acidental da lógica do `ct54.js`;
- corrige metadados repetidos/corrompidos nos cards da Watchlist;
- corrige o cálculo de episódios restantes para `total - assistidos`;
- mantém apenas uma nota por card;
- remove definitivamente o texto residual `Carregando perfil...` quando o Perfil já renderizou;
- preserva os estados de `Assistido`, `Acompanhando`, Descobrir estrito e streaming deduplicado;
- Configurações exibe a build `0.0.65`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.

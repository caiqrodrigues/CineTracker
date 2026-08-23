# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.66** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.66

A 0.0.66 corrige os problemas observados na validação em vídeo da 0.0.65.

- estabiliza Assistir, Descobrir, Histórico e Perfil contra carregamentos presos;
- tenta nova carga automaticamente em falhas transitórias e oferece tentativa manual se necessário;
- evita o rerender extra do Perfil que podia fazê-lo voltar para `Carregando perfil...`;
- atualiza corretamente o rodapé de Configurações para a build `0.0.66`;
- remove notas e metadados duplicados no detalhe/cards;
- elimina `Carregando episódios...` residual em temporadas;
- mantém `Assistido` verde após uma marcação bem-sucedida;
- preserva Descobrir estrito e streaming deduplicado.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.

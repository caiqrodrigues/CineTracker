# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.72** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.72

Esta versão foi criada diretamente sobre a base oficial 0.0.71.

- gráfico do Perfil é controlado por uma única camada e fica imediatamente acima de Histórico;
- `ct52` foi removido do runtime ativo para evitar disputa pelo gráfico;
- Descobrir exclui títulos já vistos, acompanhados, em progresso, concluídos ou presentes em Watchlist/Watch Later;
- Home/Continuar assistindo foi estabilizado sem observer permanente;
- Assistir mantém Carrossel/Grade/Lista dentro do filtro `Exibição`;
- nome do próximo episódio maior e botão `Assistido` centralizado;
- redução de rerenders concorrentes para eliminar tremor;
- mantém carregamento resiliente de episódios, notas individuais e streaming deduplicado;
- Configurações/build Android apontam para `0.0.72`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.5.1** | Código publicado / deploy Vercel |
| Android | **0.0.80** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Foco desta etapa

O ciclo principal deve ser previsível e persistente:

`abre → dados aparecem → navega → marca episódio → tudo atualiza → fecha → abre → continua correto`

### Web 0.5.1

- coordenador de lifecycle único para pré-carregamento curto e sincronização;
- navegação das abas interceptada por uma única rota;
- após marcação de episódio, estado principal e nuvem são relidos;
- apenas uma versão oficial é exibida em Configurações.

### Android 0.0.80

- runtime Android reduzido a `ct47.js` e `ct65.js`, removendo a cadeia de módulos concorrentes;
- pré-carregamento tem orçamento curto e não bloqueia indefinidamente a abertura;
- navegação nativa usa uma única rota;
- marcação de episódio dispara sincronização explícita;
- histórico não recebe linhas extras de progresso;
- Perfil recompõe o gráfico acima do Histórico;
- Descobrir filtra itens pertencentes ao histórico, acompanhamento e Watchlist/overrides;
- Configurações exibe somente `CineTracker Android • versão 0.0.80`.

A validação visual/funcional final depende de teste real no navegador e no aparelho Android.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.

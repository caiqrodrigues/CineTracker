# CineTracker Web — 0.0.97 HOTFIX 18

**Package:** `0.0.97-hotfix18-documentation-governance`  
**Cache:** `ct-web-0.0.97-hotfix18-documentation-governance`

A Web compartilha conta, biblioteca, histórico, progresso, Watchlist, Perfil e importações com Android por meio do Supabase.

## Runtime atual

O build preserva o núcleo estável v95, remove o overlay v97 instável e injeta em ordem controlada as camadas ativas de navegação, importação, picker, semântica Bingers, resiliência e Perfil.

Camadas críticas:

- HOTFIX15: transporte/navegação de importação;
- HOTFIX16: importação resiliente com refresh de sessão, retry seguro, cursor e `client_run_id`;
- HOTFIX17: Perfil server-side e estados Concluídas / Em andamento / Em dia / Não iniciadas;
- HOTFIX18: identidade de versão, cache e governança documental.

## Bingers

O fluxo usa somente `library.csv` e `watches.csv`. Ratings, comentários, avaliações e listas são ignorados. Estados manuais têm precedência, plays repetidos são preservados e datas não são inventadas.

Import reconciliado de referência: 3.078 itens de biblioteca, 12.696 watch records e 16.216 reproduções.

## Perfil

O Perfil usa RPCs server-side:

- `cinetracker_profile_stats`;
- `cinetracker_series_state_stats`;
- `cinetracker_consumption_daily`.

Estado reconciliado: 155 Concluídas, 47 Em dia, 25 Em andamento, 533 Não iniciadas e 227 séries com histórico.

## Service Worker

O Service Worker cacheia imagens/metadados TMDB e não cacheia o shell HTML. O namespace é rotacionado a cada release relevante para reduzir risco de runtime obsoleto.

## Build

Comando principal: `npm run build`. O verificador testa também presença das camadas HOTFIX15–18, semântica Bingers, identidade Android e documentação de governança.

## Publicação

Source em `main` não equivale automaticamente a produção. O deploy do endereço `https://mycinetracker.vercel.app` deve ser confirmado antes de declarar HOTFIX18 publicado.

## Regra obrigatória

Toda próxima mudança Web deve incrementar versão da unidade lógica e atualizar documentação/release/validação conforme `docs/DEVELOPMENT_RULES.md`.

Release atual: `docs/releases/0.0.97-HOTFIX18.md`.

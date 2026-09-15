# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.82 — 2026-09-15 — Web r291

### Descobrir / ações
- `+ Playlist` / `✓ Salvo` deixam a área de título e metadados e passam para o footer ao lado de `↻ Trocar`, em layout horizontal sem sobreposição.
- Títulos e metadados ficam isolados dos controles, com uma linha, `line-clamp-1` e truncamento por reticências.

### Favoritos
- Cada card de mídia do Descobrir recebe um coração minimalista sobre o pôster, com estado otimista instantâneo e animação curta ao favoritar.
- O estado canônico usa `media_overrides.state = 'Liked'`, reaproveitando o dashboard do Perfil para Favoritos de Filmes e Favoritos de Séries.
- A adição resolve/upserta a mídia pelo TMDB antes do `Liked`; a remoção apaga somente o override `Liked` do usuário autenticado.

### Carrosséis
- `Em Alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados`, Top 10 e blocos do Pra Você retêm o scroll horizontal no próprio trilho, com snap, touch `pan-x` e arraste por ponteiro.
- Os trilhos recebem `flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x`; a janela permanece sem overflow horizontal.

### Build / validação
- Web atualizada para `1.0.82 / r291-official-1.0.82`; Android permanece `1.0.20 / versionCode 10062`.
- Chromium valida ação/`Trocar` no mesmo footer, ausência de botão sobre texto, `line-clamp-1`, favorito otimista e persistência `Liked`, remoção de `Liked`, coração em cards genéricos e trilho com overflow local real.
- Bundle final exato e `production_smoke` público são obrigatórios antes da promoção definitiva.

## Histórico anterior
O histórico completo da Web 1.0.0 até a 1.0.81/r290 permanece preservado integralmente em `docs/releases/CHANGELOG-through-1.0.81.md` e no histórico Git.

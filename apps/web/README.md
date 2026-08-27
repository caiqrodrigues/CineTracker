# CineTracker Web — 0.99.2 FIX

**Package:** `0.99.2`  
**Cache:** `ct-web-0.99.2`  
**Patch final:** `patch-v095-v0992-fix.js`

## Runtime final

A pilha preserva o core v95, 0.98, 0.99, 0.99.1 e a Home 0.99.2. A ordem termina em:
- `patch-v092-v0991.js` — Perfil, Pra Você, filtros e favoritos;
- `patch-v093-v0992.js` — Home vertical Séries/Filmes;
- `patch-v094-v0992-compat.js` — compatibilidade de recomendação/detalhe local;
- `patch-v095-v0992-fix.js` — camada autoritativa final.

O FIX foi necessário após vídeo/prints reais mostrarem produção ainda em 0.99.1, menu duplicado/Histórico legado, Home antiga, Perfil com `days is not defined` e botões bloqueados no navegador desktop.

## O FIX corrige

- navegação em `window` capture antes dos handlers legados de `document`;
- rota única para Home, Descobrir, Perfil e Configurações;
- sidebar/mobile-nav sem Histórico ou duplicações;
- crash `days is not defined` da timeline do Perfil;
- inserts pessoais legados sem `profile_id`;
- inserts de `media` sem `media_kind`;
- cabeçalhos expansíveis de Séries/Filmes/Favoritos;
- rodapé autoritativo `CineTracker • v0.99.2`.

## Perfil 0.99.1 preservado

Estatísticas compactas, Tempo Total duplo, timeline com Hoje centralizado e detalhe por dia, Séries/Séries favoritas/Filmes/Filmes favoritos, filtros status/layout, favoritos, quatro métricas extras, Pra Você com 7 slots, Calendário por último, episódios ricos, marcação inteligente, cinegrafia de ator e Bingers em Importar Dados.

## Home 0.99.2

### Séries
Histórico Pull-to-Reveal, Assistir a seguir <=30 dias, Juntando poeira >30 dias, Em dia, Não Iniciadas/Watchlist e Concluídas. Cards em linha 2:3 exibem próximo S/E, progresso, faltantes, nome/nota e ✓. Quick mark grava histórico/progresso e reordena por `last_watched_at`.

### Filmes
Vistos Pull-to-Reveal, Escolha para Hoje >=8,0 sem repetição e Watchlist. Quick mark grava histórico + `AlreadySeen`.

### Reatividade
Abertura, troca Séries/Filmes, `cinetracker:data-changed`, retorno de visibilidade, conclusão de importação e atualização do Calendário reconciliam a Home.

## Backend

- `20260827004500_v0992_home_series_movies.sql`;
- `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS e não repetição por perfil.

## Rodapé

**`CineTracker • v0.99.2`**.

Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.

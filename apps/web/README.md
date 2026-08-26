# CineTracker Web — 0.0.98

**Package:** `0.0.98`  
**Cache:** `ct-web-0.0.98`

A Web compartilha conta, biblioteca, progresso, Perfil, descoberta, configurações, backup e histórico persistente com o Android por meio do Supabase.

## Navegação

A navegação visível 0.0.98 possui quatro abas: **Home, Descobrir, Perfil e Configurações**. A aba dedicada Histórico foi removida; qualquer rota legada `history` é direcionada para Perfil.

A pilha final usa:

- `patch-v088-v098-nav-pre.js` — gate de clique antes das camadas legadas;
- stack estável v95 + HOTFIX15/16 para recursos preservados;
- `patch-v089-v098.js` — UI/fluxos 0.0.98;
- `patch-v090-v098-compat.js` — compatibilidade da navegação legada/Android com `ct98Navigate`.

## Perfil

Ordem obrigatória:

1. estatísticas principais compactas;
2. gráfico tecnológico de atividade em SVG;
3. estatísticas extras;
4. Histórico integrado.

O Histórico usa `cinetracker_profile_history_media` e apresenta dois carrosséis: Séries assistidas acima e Filmes assistidos abaixo.

## Descobrir

Ordem: **Pra você → Em alta → Mais aguardados → Mais bem avaliados → Calendário**.

Em alta, Mais aguardados, Mais bem avaliados e Calendário possuem filtros **Todos / Filmes / Séries**. O filtro é aplicado por tipo de mídia, não apenas visualmente. Mais bem avaliados é sempre ordenado de maior para menor nota.

## Configurações

Backup & Restauração foi reduzido a duas ações visíveis: **Exportar** e **Importar**.

Exportar gera ZIP com `manifest.csv`, `profile.csv`, `imports.csv`, `media.csv`, `media_overrides.csv`, `watch_history.csv` e `episode_progress.csv`. Importar restaura esses dados por meio da Edge Function autenticada `ct-backup-user`.

**Limpar Cache** remove caches locais/temporários e Cache Storage sem apagar o estado persistente. **Atualizar Metadados** atualiza as mídias do usuário via TMDB e ignora IDs substitutos não positivos.

## Backend relacionado

- migration `20260826230500_v098_profile_history_media.sql`;
- RPC `cinetracker_profile_history_media(integer)` com `SECURITY INVOKER` e `auth.uid()`;
- Edge Function `ct-backup-user`, deploy inicial v1.

O importador Bingers resiliente permanece preservado.

## Build

Comando principal: `npm run build`. O workflow geral `Verify` valida versão, navegação, Perfil, Descobrir, backup, cache, metadados e runtime Android embarcado.

## Rodapé

O rodapé autoritativo da versão é **`CineTracker • v0.0.98`**.

Release: `docs/releases/0.0.98.md`.  
Validação: `docs/validation/0.0.98.md`.

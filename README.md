# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. Web e Android compartilham conta, biblioteca, Watchlist, histórico, progresso, Perfil, Descobrir, configurações e backup via Supabase.

## Versão atual

| Sistema | Versão | Identidade |
|---|---:|---|
| Web | **0.99.3** | package `0.99.3`, cache `ct-web-0.99.3`, pre-gate `patch-v097-v0993-nav-pre.js`, final `patch-v098-v0993-web.js` |
| Android | **0.99.2.3** | `versionName 0.99.2.3`, `versionCode 9923`, bundle `v0.99.2.3-fix2-unfreeze-authoritative` |
| Backend | **0.99.2** | RPC/tabela Home no Supabase |
| Windows | — | não lançado |

A Web 0.99.3 é uma unidade exclusiva do navegador desktop. O Android não é alterado nesta release.

## Web 0.99.3 — navegação e Descobrir

A correção preserva o runtime 0.99.1/0.99.2 e adiciona duas camadas Web:

- `patch-v097-v0993-nav-pre.js`, antes do listener capture legado de `patch-v095-v0992-fix.js`, para receber primeiro os cliques de Home / Descobrir / Perfil / Configurações e das tabs/filtros do Descobrir;
- `patch-v098-v0993-web.js`, depois do anti-freeze `patch-v096-v0992-unfreeze.js`, para reconciliar Sidebar, hit-area, fallback do Pra Você e rodapé.

O menu lateral é limitado a **Home, Descobrir, Perfil e Configurações**. Histórico permanece integrado ao Perfil e qualquer item legado que reapareça é removido defensivamente.

Descobrir mantém Pra Você, Em Alta, Mais Aguardados, Mais bem avaliados, Calendário e filtros Geral/Séries/Filmes. Quando o Pra Você não possui dados elegíveis, a tela oferece ações de atualizar recomendações ou importar/sincronizar dados em vez de permanecer em um estado vazio rígido.

Cliques e erros globais são registrados em `window.__ct0993Diagnostics` para facilitar diagnóstico no navegador.

## Conteúdo preservado

- Perfil com estatísticas, timeline, filtros/layouts e expansões completas;
- Home Séries em lista vertical com Pull-to-Reveal, Assistir a seguir, Juntando poeira, Em dia, Não Iniciadas/Watchlist e Concluídas;
- Home Filmes com Vistos Pull-to-Reveal, Escolha para Hoje e Watchlist;
- quick mark, LRU e sincronização de lançamentos;
- episódios ricos e confirmação inteligente;
- cinegrafia;
- Bingers em Importar Dados;
- backup;
- hardening de `profile_id`/`media_kind`;
- anti-freeze FIX2 de `Node.textContent` preservado.

## Estado de validação

Build, Verify e deploy são estados técnicos. A Web 0.99.3 só é considerada funcionalmente validada depois de smoke real no navegador PC confirmar navegação repetida, tabs/filtros do Descobrir, Perfil, Configurações e responsividade por pelo menos 60 segundos.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.3.md` e `docs/validation/0.99.3.md`.

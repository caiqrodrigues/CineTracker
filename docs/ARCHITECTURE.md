# CineTracker — Arquitetura atual

**Release lógica em preparação:** `0.99.2 FIX`  
**Atualizado em:** 2026-08-27

## 1. Visão geral

CineTracker compartilha o mesmo domínio entre Web e Android:
- Web: runtime HTML/JavaScript em `apps/web`;
- Android: `Activity + WebView` com runtime Web embarcado e inline;
- Supabase: Auth, PostgreSQL, RPCs e Edge Functions;
- TMDB: metadados/calendário externos;
- GitHub: fonte de verdade do source, migrations, documentação e CI/CD.

## 2. Motivo do FIX

Vídeo/prints reais provaram que presença de patches no build não garantia a interface final: a produção permanecia em 0.99.1, handlers legados bloqueavam cliques no desktop, sidebar recebia itens duplicados/Histórico, Home antiga podia reaparecer e o Perfil quebrava com `days is not defined`.

A 0.99.2 ainda não havia sido publicada, portanto essas correções pertencem à mesma release 0.99.2.

## 3. Ordem autoritativa do runtime

A base v95 e recuperações estáveis continuam presentes. O final da pilha é:
1. `patch-v088-v098-nav-pre.js` — gate inicial;
2. HOTFIX15/16 e core v95 preservado;
3. `patch-v089-v098.js` / `patch-v090-v098-compat.js`;
4. `patch-v091-v099-profile-lru.js`;
5. `patch-v092-v0991.js` — Perfil/Pra Você/filtros/favoritos;
6. `patch-v093-v0992.js` — Home vertical Séries/Filmes;
7. `patch-v094-v0992-compat.js` — detalhe local/recomendação;
8. **`patch-v095-v0992-fix.js` — camada final autoritativa.**

`patch-v068-v097.js` permanece desativado.

## 4. Navegação final

A camada FIX registra o gate em `window` no capture phase. Isso a faz executar antes dos listeners antigos instalados em `document`, inclusive os que usam `stopImmediatePropagation`.

Ela rebindeia `ct0992Navigate`, `ct991Navigate` e `ct98Navigate` para uma única rota. Sidebar e mobile-nav são reconciliadas para exatamente:
- Home;
- Descobrir;
- Perfil;
- Configurações.

A rota legada Histórico redireciona ao Perfil e nunca volta como destino visual.

## 5. Hardening das escritas do cliente

O wrapper final de `sbApi` corrige contratos legados antes da chamada REST:
- POST em `watch_history`, `episode_progress` e `media_overrides` recebe `profile_id` do usuário autenticado quando o campo estiver ausente;
- POST em `media` recebe `media_kind` quando ausente: `movie`, `series` ou `anime` inferido pelos metadados.

Valores explicitamente fornecidos pelo chamador são preservados. Nenhuma credencial privilegiada é introduzida.

## 6. Perfil consolidado 0.99.1

A camada 0.99.1 continua responsável por:
- estatísticas compactas e Tempo Total duplo;
- timeline temporal com Hoje centralizado e detalhe por dia;
- Séries / Séries favoritas / Filmes / Filmes favoritos;
- filtros de status e layouts Carrossel/Grade/Lista;
- favoritos e quatro métricas extras;
- Pra Você com 7 slots;
- Calendário por último;
- recursos de episódios, ator e Importar Dados.

O FIX fornece o binding global compatível necessário ao legado `days=[]`, eliminando `days is not defined`, e recupera os cabeçalhos expansíveis das quatro seções.

## 7. Home 0.99.2 — Séries

A Home possui viewport vertical. O histórico recente fica renderizado acima do ponto inicial; após o render o scroll é posicionado em **Assistir a seguir**, permitindo Pull-to-Reveal.

Classificação:
- Assistir a seguir: pendência lançada + atividade <=30 dias, ou novo episódio detectado;
- Juntando poeira: pendência + atividade >30 dias;
- Em dia: zero pendências lançadas, iniciada e não concluída;
- Não Iniciadas / Watchlist: zero episódios vistos;
- Concluídas: `Completed`.

Cards em linha usam pôster 2:3 e exibem próximo S/E, assistidos/lançados, faltantes, nome/nota e ação ✓. Quick mark grava histórico/progresso, atualiza `last_watched_at`, avança episódio e reordena LRU.

## 8. Sincronização de lançamentos

`syncReleaseStates()` executa no primeiro uso do dia, retorno de visibilidade e atualização do Calendário. Para séries com TMDB oficial positivo, calcula episódios efetivamente lançados. Novo episódio disponível move UpToDate -> InProgress/Assistir a seguir; zerar pendências retorna para UpToDate.

Não há cron server-side nesta versão; a checagem é disparada pelo cliente. IDs TMDB <=0 não são enviados ao proxy.

## 9. Home 0.99.2 — Filmes

- Vistos oculto por Pull-to-Reveal;
- Escolha para Hoje com nota >=8,0, nunca visto e sem repetição;
- Assistir a seguir / Watchlist;
- quick mark grava `watch_history` + `AlreadySeen`.

A seleção diária é persistida em `daily_movie_recommendations_v0992`.

## 10. Backend

Migration: `20260827004500_v0992_home_series_movies.sql`.

`cinetracker_profile_home_dashboard_v0992()`:
- `SECURITY INVOKER`;
- `auth.uid()`;
- consolida mídia, histórico, progresso, estados, LRU e último S/E.

`daily_movie_recommendations_v0992`:
- RLS habilitado;
- escopo `profile_id = auth.uid()`;
- PK perfil/data;
- unique perfil/TMDB.

## 11. Android

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9912`;
- bundle: `v0.99.2-fix-991-992-authoritative`.

O preparo Android exige `patch-v095-v0992-fix.js` por último e o smoke inline compila todos os scripts embutidos.

## 12. Reatividade

Home revalida ao abrir, alternar Séries/Filmes, receber `cinetracker:data-changed`, voltar à visibilidade e detectar conclusão de importação. O Perfil também reage ao estado central; ordem visual deriva do timestamp persistente, não apenas do DOM.

## 13. Débito legado

Surrogate negativo ainda existe em `media.tmdb_id` para parte da importação. Caminhos recentes evitam chamadas TMDB com IDs <=0; separar definitivamente ID interno de TMDB oficial continua recomendado.

## 14. Versionamento

Toda alteração deve seguir `docs/DEVELOPMENT_RULES.md`. Source, CI, deploy, APK publicado e smoke real são estados independentes.

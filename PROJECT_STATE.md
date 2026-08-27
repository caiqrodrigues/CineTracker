# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-26  
**Branch principal:** `main`  
**Branch de trabalho:** `feat/v0.99.2`  
**Release lógica em preparação:** `0.99.2`  
**Web:** source `0.99.2`, aguardando CI/merge/deploy final  
**Android:** source `0.99.2` (`versionCode 9912`), aguardando build/release final  
**Backend lógico:** `0.99.2`, migration Home já aplicada no Supabase  
**Windows:** não lançado

## 1. Governança

Toda nova unidade lógica de atualização/mudança deve possuir versão nova e registro no GitHub. Código, documentação, versionamento, migrations, release note e validação devem permanecer sincronizados. Source, CI, deploy, APK publicado e teste em aparelho real são estados diferentes.

## 2. Arquitetura atual

- Web: runtime HTML/JavaScript em `apps/web`.
- Android: Activity + WebView com runtime Web local/inline.
- Supabase: Auth, PostgreSQL, RPCs e Edge Functions.
- TMDB: metadados/imagens externos via Edge proxy.
- GitHub `main`: fonte de verdade do source, migrations, documentação e CI/CD.

Estados manuais continuam tendo precedência sobre importação/inferência. A 0.99.2 usa estados `system` apenas para transições automáticas de acompanhamento quando detecta novos episódios ou quando o usuário fica em dia.

## 3. Home 0.99.2 — Séries

Camada final: `apps/web/patch-v093-v0992.js`, carregada depois de `patch-v092-v0991.js`.

A Home possui abas Séries/Filmes. Em Séries, o viewport começa visualmente em **Assistir a seguir** e mantém o histórico recente de episódios acima do ponto inicial para Pull-to-Reveal.

Ordem vertical:
1. Assistir a seguir — iniciado, pendente, até 30 dias desde `last_watched_at`, ou recém-movido por novo episódio;
2. Juntando poeira — iniciado, pendente, mais de 30 dias;
3. Em dia — 0 episódios lançados pendentes e não concluída;
4. Não Iniciadas / Watchlist — Watchlist com 0 episódios vistos;
5. Concluídas — estado `Completed`.

Cards usam layout em linha, pôster 2:3, próximo `Sxx Exx`, assistidos/lançados, faltantes, título e nota do próximo episódio e ação ✓.

### Quick mark

Ao marcar o próximo episódio:
- grava `watch_history` com `watched_at = now()`;
- cria/atualiza `episode_progress` como manual;
- atualiza botões de detalhe `data-ep91` quando presentes;
- avança o próximo episódio;
- reordena por `last_watched_at DESC`;
- se não houver pendência lançada, troca para `UpToDate` system;
- dispara `cinetracker:data-changed` e refaz a Home.

## 4. Sincronização de lançamentos

`syncReleaseStates()` roda:
- uma vez por dia no primeiro uso;
- no retorno de visibilidade;
- ao atualizar a sub-aba Calendário.

Para séries positivas na TMDB em `UpToDate`/`InProgress`, atualiza metadados e calcula episódios efetivamente lançados. Se `aired > watched`, remove `UpToDate` system/import, garante `InProgress` system e o card passa para Assistir a seguir com badge **Novo Episódio**. IDs TMDB substitutos negativos não são enviados ao proxy.

## 5. Home 0.99.2 — Filmes

O histórico **Vistos** fica oculto acima do ponto inicial. A área visível começa em **Escolha para Hoje** e segue para **Assistir a seguir / Watchlist**.

Escolha para Hoje:
- rating >=8.0;
- filme nunca visto;
- uma seleção por perfil/data;
- não repete `tmdb_id` já recomendado ao mesmo perfil;
- persistência em `daily_movie_recommendations_v0992`.

Quick mark de filme grava `watch_history`, atualiza/cria `AlreadySeen` manual e dispara sincronização reativa.

## 6. Backend 0.99.2

Migration aplicada: `supabase/migrations/20260827004500_v0992_home_series_movies.sql`.

### RPC `cinetracker_profile_home_dashboard_v0992()`
- `SECURITY INVOKER`;
- escopo `auth.uid()`;
- agrega watch history, episode progress e overrides;
- expõe `last_watched_at`, último S/E assistido, plays, `raw_tmdb`, estados e contagens.

### `daily_movie_recommendations_v0992`
- RLS habilitado;
- políticas select/insert limitadas a `profile_id = auth.uid()`;
- PK `(profile_id, recommendation_date)`;
- unique `(profile_id, tmdb_id)`.

## 7. Reatividade pós-importação

Home força leitura central ao abrir e ao alternar Séries/Filmes. Também reage a `cinetracker:data-changed`, retorno de visibilidade e observação de conclusão de importação para invalidar o cache. Assim os dados importados aparecem sem refresh manual quando o usuário retorna à Home.

## 8. Recursos preservados da 0.99.1

- Perfil estável com single-flight, Tempo Total duplo e timeline 7 dias;
- filtros e layouts de Séries/Filmes no Perfil;
- favoritos em detalhes;
- quatro estatísticas extras;
- Pra Você com exatamente 7 posições, ano >1990 e nota >=7.8;
- Calendário por último com Geral/Séries/Filmes;
- cards ricos de episódios e confirmação de episódios anteriores;
- cinegrafia do ator em Filmes/Séries, recente -> antigo;
- Bingers dentro de Importar Dados;
- backup CSV/ZIP, Limpar Cache e Atualizar Metadados;
- overlay global v97 continua desativada.

## 9. Bingers consolidado

Import ID 6 concluído/verificado permanece referência:
- 3.078 itens de biblioteca;
- 12.696 watch records;
- 16.216 reproduções;
- 1.312 reproduções de filmes;
- 14.904 reproduções de episódios;
- 227 séries com histórico;
- 0 eventos sem correspondência.

## 10. Identidade de versão

Web:
- package `0.99.2`;
- cache `ct-web-0.99.2`;
- rodapé `CineTracker • v0.99.2`;
- patch final `patch-v093-v0992.js`.

Android:
- `applicationId com.cinetracker.app`;
- `versionName 0.99.2`;
- `versionCode 9912`;
- bundle `v0.99.2-home-series-movies-v95-core-inline-authoritative`;
- workflow `.github/workflows/build-android-v0992.yml`;
- release alvo `android-v0.99.2`.

## 11. Validação ainda não encerrada

Enquanto esta branch não for mergeada e os pipelines não concluírem, não marcar como executados:
- Verify final da branch/PR e da main;
- Vercel final;
- build/assinatura/release Android 0.99.2;
- smoke autenticado visual Web;
- instalação em Android real;
- Pull-to-Reveal e quick mark em dispositivos reais;
- transição real por novo `air_date` e recomendação diária em dias consecutivos.

Ver `docs/validation/0.99.2.md`.

## 12. Débitos conhecidos

- surrogate negativo em `media.tmdb_id` ainda existe para parte da importação; caminhos recentes bloqueiam envio desses IDs à TMDB;
- advisories históricos Supabase continuam documentados;
- AGP 8.5.2 vs compileSdk 35 continua emitindo warning apesar de builds anteriores concluírem.

## 13. Documentos canônicos

- `README.md`;
- `VERSIONS.md`;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SECURITY.md`;
- `docs/releases/0.99.2.md`;
- `docs/validation/0.99.2.md`.

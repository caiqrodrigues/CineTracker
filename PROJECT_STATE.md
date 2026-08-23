# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-22  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.48`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Integrações

- TMDB: títulos, capas, elenco, imagens e metadados oficiais.
- Supabase: Auth, PostgreSQL, RLS, progresso, histórico, sincronização e RPCs autenticadas.
- GitHub: código, documentação, Releases e CI/CD.
- Vercel: publicação Web.
- Android WorkManager: notificações periódicas em segundo plano exclusivamente no Android.

## 3. Regras de domínio

Não criar tabela separada `CompletedSeries`. Conclusão deve ser derivada de progresso importado/manual + metadados oficiais. Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

## 4. Assinatura e atualização Android

- `applicationId`: `com.cinetracker.app`;
- `versionCode` sempre crescente;
- a instalação antiga/publicada da 0.0.46 foi comprovadamente assinada pelo certificado `5a5e16933b91f015b5f5da0f178543b63c92e49e595c8c2a8a5862b6487dc876`;
- a chave privada antiga não está disponível;
- a build final da 0.0.48 usa keystore dedicado do CineTracker e o baseline persistido pelo CI é `fe69519cd5669429446e4701cd5d0ad78c5a936b3130f27e478a05c0591353d3`;
- a `0.0.48` é a migração única: instalações antigas precisam ser removidas uma vez antes de instalar a 0.0.48;
- da 0.0.49 em diante, o CI bloqueia qualquer certificado diferente desse baseline e as APKs devem atualizar por sobreposição normalmente.

## 5. Estado Android 0.0.48

### Notificações

Infraestrutura da 0.0.46 preservada e já validada em aparelho real: novo episódio e filme elegível da Watchlist. Após a reinstalação 0.0.48 é necessário fazer login novamente para reativar a sessão nativa.

### Runtime consolidado

A Activity carrega somente:

1. `ct41.js` — gráfico diário interativo;
2. `ct47.js` — Assistir e detalhes de série/temporada/episódio;
3. `ct48.js` — correções finais de Perfil, Descobrir, Configurações e navegação.

### Interface

- Perfil: sem gráfico de horário/horário de pico; timeline diária dark e interativa.
- Descobrir: três cards por linha, posters 2:3.
- Assistir: Carrossel padrão, Grade/Lista, ordem `Em dia` → `Acompanhando` → `Juntando poeira` → `Não iniciadas`, abertura posicionada em Acompanhando.
- Série → temporada → episódio com marcação persistente.
- Configurações: versão única `0.0.48`.

## 6. Estado Web 0.4.8

A Web passa a ter paridade funcional com o Android 0.0.48, exceto notificações nativas.

### Perfil / Tempo de Tela

- remove atividade por horário e horário de pico;
- timeline diária em dark mode;
- 7 dias visíveis, hoje centralizado com 3 dias anteriores e 3 posteriores;
- navegação horizontal até 15 dias anteriores;
- clique em um dia abre itens assistidos naquele dia.

### Assistir

- Carrossel inicial e persistente;
- Grade e Lista;
- seções físicas `Em dia`, `Acompanhando`, `Juntando poeira`, `Não iniciadas`;
- abertura posicionada em Acompanhando;
- filmes e séries clicáveis;
- série → temporada → episódio;
- marcação/desmarcação de episódios persistida no Supabase.

### Descobrir / Metadados

- três colunas nos grids principais;
- resolvedor global de nomes/capas `patch-v045.js` permanece ativo;
- `patch-v046.js` é carregado por último e consolida a paridade sem polling periódico adicional.

### Configurações

- alteração de e-mail e senha;
- importação e exportação de backup;
- versão única `CineTracker Web 0.4.8`.

### Diferença intencional

Notificações de lançamentos/episódios não são portadas para Web nesta versão.

## 7. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## 8. Regra de validação

Implementado/compilado não significa validado. Android exige instalação e teste real. Web exige build/deploy real e teste das telas no ambiente publicado.

## 9. Regra de documentação e publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release, `CHANGELOG.md` quando aplicável e pipeline correspondente. Android também exige Release + APK.

## 10. Pendências de validação

### Android 0.0.48

- instalar após remover uma build assinada pela chave antiga;
- confirmar versão única 0.0.48;
- confirmar Perfil, Descobrir e Assistir;
- confirmar série → temporada → episódio;
- confirmar continuidade das notificações após login.

### Web 0.4.8

- confirmar deploy real;
- confirmar timeline diária e detalhe por dia;
- confirmar seções/modos de Assistir;
- confirmar marcação persistente de episódio;
- confirmar três colunas em Descobrir;
- confirmar Configurações e resolvedor de capas/nomes.

## 11. Continuidade

Antes de alterações importantes: ler este arquivo, conferir a Release/commit atual e preservar as decisões arquiteturais e regras de validação.

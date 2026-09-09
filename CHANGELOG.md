# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.25 — 2026-09-09 — Web r233

### Estabilidade de runtime
- Criada a autoridade final `r233-official-1.0.25` sobre a Web 1.0.24/r232.
- Eliminado o polling esportivo concorrente de `700ms` introduzido pela autoridade r229.
- Neutralizados MutationObservers e polls legados de r223/r225/r226/r227/r228/r228b/r228c/r228d/r229/r232 que continuavam reescrevendo Descobrir, Esportes ou contagens da Watchlist depois do paint final.
- A r233 não cria novo `MutationObserver` nem `setInterval`; normalizações finais são acionadas pelos próprios eventos de render/paint e por `cinetracker:data-changed`.
- Padronizado um normalizador final compartilhado pela r233 para classificação de ações e textos.

### Home / episódios
- Séries classificadas como `Em dia` passam por revalidação ao vivo do TMDB após o carregamento da Home.
- A posição do último episódio efetivamente lançado (`last_episode_to_air`) é comparada com a última posição assistida.
- O total liberado é recalculado pelas temporadas anteriores mais os episódios já lançados da temporada atual.
- Se houver episódio novo já lançado, `is_caught_up` é corrigido e o item sai de `Em dia` para `Assistir a seguir` sem depender de metadado persistido desatualizado.

### Descobrir
- Removidos observadores conflitantes que repintavam cards e ações de forma assíncrona depois da navegação.
- A normalização final de cards, Watchlist e `Trocar` ocorre somente após render/paint real.
- Mantida a camada de metadados consolidada da 1.0.24, agora chamada de forma determinística e sem polling contínuo.

### Esportes
- Mantida a semântica visual da autoridade v123: uma zona final de ações com `Eventos` e `Assistido/Desmarcar`.
- A canonicalização dos cards passa a ser acionada somente após `paintSports`/`renderSports`, sem loop de 700ms.
- Normalizadores esportivos legados que disputavam o mesmo DOM deixam de ser disparados automaticamente.

### Watchlist / Perfil
- A contagem e o modal passam a usar todas as linhas retornadas por `cinetracker_watchlist_full_v119`.
- Removido o filtro que descartava entradas sem TMDB id válido antes da contagem.
- Registros locais sem TMDB continuam visíveis no modal; itens com TMDB id mantêm navegação para os detalhes.
- Contagem exibida e quantidade de linhas do modal passam a usar exatamente a mesma fonte.

### Build e validação
- Web package e package raiz atualizados para `1.0.25`.
- Build oficial passa a ser `apps/web/build-r233.mjs` e gera `app-v233.js`, cache `ct-web-1.0.25-r233` e `release.json` da 1.0.25.
- Adicionado `test-r233.mjs` para bloquear regressões de polling/observers e validar as quatro autoridades finais: Home, Descobrir, Esportes e Watchlist.
- `verify.yml` atualizado para validar a Web 1.0.25 e manter a baseline Android atual separada.

## 1.0.0 — 2026-09-04 — OFICIAL

### Release
- Web e Android passam a compartilhar a identidade pública **1.0.0**.
- Web: package `1.0.0`, revision `r204-official-1.0.0` e assets `app-v204`.
- Android: `versionName 1.0.0`, `versionCode 10042`, APK `CineTracker-1.0.0.apk`.
- Backend Supabase permanece o production compartilhado; nenhuma migration artificial foi criada apenas para renumerar a aplicação.

### Versão visível
- Rodapé da Web alterado para `CineTracker • v1.0.0`.
- Runtime embarcado no Android alterado para `CineTracker • v1.0.0`.
- `window.__ctWebBuild` e `window.__ctOfficialVersion` passam a `1.0.0`.
- Android também publica `window.__ctAndroidOfficialVersion='1.0.0'`.
- Snapshots/backup exportados passam a declarar `version:'1.0.0'`.
- `release.json` Web passa a declarar `version:1.0.0`, revision `r204-official-1.0.0` e `status:official`.

### Android — último bloqueador encerrado
- A 1.0.0 usa como base funcional exatamente a **0.99.7.71/r243**, validada no aparelho pelo usuário.
- Corrigida a divergência que fazia `Da sua Watchlist` renderizar a partir de `wmPool/wsPool/waPool`, enquanto o botão `Trocar` reconstruía outro pool e podia terminar sem candidato.
- `pool237('watchlist:*')` passa a consumir exatamente o pool selecionado pelo renderer ativo `ct186`.
- `r237` permanece a única autoridade de `pointerup/click`; não existe novo handler concorrente.
- Teste de regressão executa a cadeia real do clique e exige Watchlist `11 → 14` mantendo `100% novos` em `21 → 21`.
- O usuário confirmou no aparelho que o `Trocar` da Watchlist funciona.

### Android — Top 10/streamings
- Preservado o scroll horizontal nativo do WebView para Top 10, streamings e trilhos de cards.
- Não é reintroduzido controlador manual de `touchmove`.
- O usuário confirmou no aparelho que o scroll lateral funciona.

### Web
- A r204 importa integralmente a r203; não há reescrita funcional nesta promoção.
- Preservados filtro do Descobrir à direita da busca, limpeza de filtro duplicado em Sports, rewatch persistente `2x/3x/4x...`, Ver mais para filme/série/pessoa e demais comportamentos consolidados.

### Documentação/CI
- `README.md`, `PROJECT_STATE.md`, `VERSIONS.md`, READMEs de Web/Android e documentos de release/validação passam a apontar 1.0.0.
- Criado `.github/workflows/release-v1.yml` como pipeline oficial conjunto Web + Android.
- `verify.yml` deixa de validar r203/Android .64 e passa a validar a baseline 1.0.0.

## Linha 0.99.7 — consolidação pré-1.0

Principais marcos preservados pela 1.0.0:

- Home com progresso e interação otimista;
- Descobrir/Pra Você, filtros, Watchlist e 100% novos;
- exclusões pessoais de vistos/em andamento/Watchlist;
- detalhes ricos, temporadas, episódios, avaliações e elenco;
- Perfil, favoritos, atividade e estatísticas;
- Sports integrado;
- importação, sincronização, manutenção e backup;
- rewatch persistente;
- múltiplas iterações Android de composição mobile e interação física;
- 0.99.7.71 como última pré-release, encerrando o bug do `Trocar` da Watchlist.

## Histórico anterior

As releases 0.0.x, 0.99.1–0.99.7 e hotfixes continuam disponíveis no histórico Git e em `docs/releases/`. Elas são históricas e não devem ser usadas como baseline para novas alterações depois da 1.0.0.

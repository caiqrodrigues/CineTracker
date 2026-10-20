# CineTracker Android — 1.0.60

App Android leve baseado em `Activity + WebView`, com runtime CineTracker embarcado no APK e backend Supabase compartilhado com a Web.

## Identidade oficial

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.0`;
- `versionCode`: `10042`;
- base funcional: **0.99.7.71 / r243**;
- preparação: `scripts/prepare-android-v1000.mjs`;
- teste: `scripts/test-android-v1000.mjs`;
- pipeline: `.github/workflows/release-v1.yml`;
- artifact: `cinetracker-android-1.0.0`;
- APK: `CineTracker-1.0.0.apk`.

## Baseline funcional

A 1.0.0 é uma promoção de release da 0.99.7.71 validada no aparelho. Nenhuma nova autoridade de toque é criada.

O contrato congelado é:

- `r237` permanece a única autoridade do botão Trocar;
- em Da sua Watchlist, `pool237()` usa exatamente o `wmPool/wsPool/waPool` retornado pelo renderer ativo `ct186`;
- Filme/Série/Anime trocam somente o próprio slot;
- 100% novos permanece independente;
- Top 10/streamings usa scroll horizontal nativo, sem controlador manual de `touchmove`;
- rewatch persistente `2x/3x/4x...` e demais recursos da linha 0.99.7 permanecem presentes.

## Versão exibida

Além de `versionName`, a preparação 1.0.0 atualiza o número mostrado dentro do runtime:

- `window.__ctWebBuild = '1.0.0'`;
- `window.__ctOfficialVersion = '1.0.0'`;
- `window.__ctAndroidOfficialVersion = '1.0.0'`;
- rodapé `CineTracker • v1.0.0`;
- snapshot exportado `version: 1.0.0`.

Markers históricos de revisões anteriores permanecem no bundle apenas como identidade interna de camadas; eles não são a versão oficial exibida.

## Validação oficial

O pipeline 1.0.0 repete o teste que finalmente capturou o bug real da Watchlist: um `PointerEvent('pointerup')` atravessa o handler real e precisa produzir `Watchlist 11 → 14` sem alterar `100% novos 21 → 21`.

Depois disso são validados Gradle, `aapt`, assinatura e conteúdo interno do APK.

Documentação: `docs/releases/1.0.0.md` e `docs/validation/1.0.0.md`.

## Android 1.0.42 / r284

- Histórico de filmes completo com paginação autenticada v542 e conciliação de eventos anteriores.
- Pra Você: seis grupos elegíveis v421 auditados v525; sete posições e Watchlist real.
- APK de teste paralelo: `com.cinetracker.app.teste42`.
- Web r541 congelada, shell nativo preservado.

## Android 1.0.43 / r285

- Indicação do Dia compacta em 2:3; Trocar usa pools reais v421 auditados v525; ações locais não reinicializam as outras recomendações.
- Perfil com estatísticas, biblioteca e histórico de atividade carregados progressivamente, sem reinicialização de tela.
- APK TESTE43: `com.cinetracker.app.teste43`; Web r541 intocada.

## Android 1.0.44 / r286

- Pra Você: Trocar em todos os slots reais auditados pelo Supabase v525, rotação de itens mostrados e ausência de validação TMDB no clique.
- Home: UFC, WWE e Fórmula 1 ordenados após as séries comuns e com botão de marcar o próximo evento liberado.
- APK TESTE44 tem package separado `com.cinetracker.app.teste44`. Web r541 permanece congelada.

## Android 1.0.45 / r287

Corrigida a tela preta causada pela inicialização fora do escopo privado do módulo r263. Login preservado por isolamento de falhas e teste comparativo headless. Sem alterações na Web r541.

## Android 1.0.46 / r288

Pra Voce com renderer autenticado final e troca sem regressao para cards legados; Home UFC/WWE/F1 com snapshot no erro e botao pequeno 36px. APK TESTE46 com package independente com.cinetracker.app.teste46. Web r541 sem alteracoes.

## Android 1.0.47 / r289

Retorno das janelas de histórico e Watchlist pelos contadores no Perfil. Classificação de Pilotos/Construtores do F1 Hub usando Jolpica como fallback em falha do payload principal. UFC/WWE/F1 padronizados na Home; dados autenticados mantidos em Pra Você. TESTE47 separado de produção. Web r541 congelada.

## Android 1.0.48 / r290

Home padronizada (UFC, WWE, F1), NFL Super Bowl anual navegável com episódios existentes, Perfil com históricos mais recentes primeiro e Watchlist v119 em quatro ordenações, Pra Você estável. TESTE48 independente. Web r541 congelada.

## Android 1.0.49 / r291

Pra Você mantém a seleção auditada após Trocar durante a mesma navegação; Home UFC/WWE com 793/567 episódios históricos e botão Assistido 36px; NFL Super Bowl com escudo, jogo e show do intervalo por ano, com capas individuais. TESTE49 independente. Web congelada r541.

## Android 1.0.50 / r292

Home contadores históricos v540 de UFC/WWE/F1, NFL Super Bowl 120 episódios, antiga Fórmula 1 sem capa oculta apenas na Home e sete recomendações autenticadas estáveis durante o Trocar. TESTE50 package independente. Web r541 congelada.

## Android 1.0.51 / r293

Descobrir > Pra Você: proteção final no renderizador original r158 contra auditorias antigas r279 e respostas assíncronas r282/r284 que substituíam todos os sete cards por itens antigos. Trocar, Visto e Watchlist preservam ações localmente sem refazer a página; TESTE51 independente. Web r541 congelada.

## Android 1.0.52 / r294

Descobrir Pra Você com dono exclusivo dos sete slots mesmo em Watchlist parcialmente vazia, sem renderizações antigas/recursão nem refetch geral em Trocar/Visto/Watchlist. Episódios recentes de Raw/SmackDown sincronizados em segundo plano pela função autenticada, sem full reload. Web r542 limitada a WWE.

## Android 1.0.53 / r295

Estabilização das recomendações autenticadas sem restaurar a Watchlist antiga após Trocar. Alterações reais de cards permanecem locais. Raw e SmackDown visíveis são preservados em redesenhos assíncronos de Home com cache temporário de três minutos. Web não alterada.

## Android 1.0.54 / r296

A autenticação de Descobrir/Pra Você valida todos os sete slots e os botões finais antes de bloquear atualizações legadas, aceitando Watchlist vazia por categoria. Raw/SmackDown da Home reutilizam os próprios cards confirmados através de atualizações assíncronas, sem clones de três minutos, com limpeza após marcação de assistido. O APK TESTE54 tem applicationId `com.cinetracker.app.teste54`, independente do aplicativo principal. Web congelada. Validação: `node scripts/prepare-android-v1054.mjs && node scripts/test-android-v1054.mjs`.

## Android 1.0.55 / r297

Carregamento inicial de Descobrir > Pra Você limita os candidatos a 24 novos + 16 de Watchlist por tipo antes da auditoria personalizada Supabase v525. Uma Watchlist vazia não provoca nova chamada; uma falha ou conjunto vazio mostra botão de nova tentativa diretamente na aba, sem refazer o app. `scripts/prepare-android-v1055.mjs`, `scripts/test-android-v1055.mjs`, workflow `release-android-v1055.yml` e APK TESTE55 independente. Web congelada.

## Android 1.0.56 / r298

Correção estrita de Descobrir > Pra Você: nenhum botão é recriado por mudança de busy; reconcile mantém a escolha montada mesmo com atualização em segundo plano; Trocar jamais recicla títulos do histórico de indicações do mesmo slot. Testes de regressão em `scripts/test-android-v1056.mjs`, workflow `release-android-v1056.yml`, APK TESTE56 com package independente. Web congelada.

## Android 1.0.57 / r299

Corrige conflito entre r292 (seis callbacks agendados depois de cada toque e carregamento) e r278; r292 mantém apenas bloqueio de repintura antiga, sem novo click listener, dados ou agendamentos. O MutationObserver do protetor r293 observa somente substituições estruturais, não cada alteração interna de cartão. Fluxos v525 e swaps sem repetição mantidos. `scripts/prepare-android-v1057.mjs`, `scripts/test-android-v1057.mjs`, workflow `release-android-v1057.yml`, TESTE57 paralelo. Web congelada.

## Android 1.0.58 / r300

Esportes: somente abas Anteriores, Próximos e Favoritos; F1 Hub e estatísticas inalterados. Pra Você: seleção inicial e Trocar aleatorizados com ponderação por nota/votos e lista de já apresentados salva na sessão diária. Séries: fila canônica avança após o último episódio visto e WWE Raw/SmackDown usam o último episódio lançado nos 21 dias anteriores sem percorrer históricos antigos. Preparação `scripts/prepare-android-v1058.mjs`, regressões `scripts/test-android-v1058.mjs`, release `release-android-v1058.yml` e TESTE58 instalável separadamente. Web e SQL congelados.

## Android 1.0.59 / r301

Esportes: apenas Anteriores e Próximos (remoção somente da aba Favoritos, sem alterar marcação). Pra Você: remove 4 timers de reconciliação r290 remanescentes, mantém o card enquanto Trocar está ocupado, estende memória diária de escolhas entre os slots novos. Raw/SmackDown: reidrata a Home por v527 + estado assistido v4 se a linha nem apareceu no primeiro render, mantém cache autorizado e invalida ao assistir. Não altera Web, SQL, outros esportes ou Fórmula 1. Scripts `scripts/prepare-android-v1059.mjs`, `scripts/test-android-v1059.mjs` e workflow `release-android-v1059.yml`. TESTE59 paralelo.

## Android 1.0.60 / r302

Escopo: somente Descobrir > Pra Você. Elimina callbacks redundantes dos módulos r284, r288 e r293 que disparavam re-renderizações após a escolha do usuário; mantém r278 como controlador de ações e a proteção estrutural dos sete slots do r293. Scripts: `scripts/prepare-android-v1060.mjs`, `scripts/test-android-v1060.mjs`, `.github/workflows/release-android-v1060.yml`. Variante TESTE60 instalável em paralelo. Web, SQL, regras, esportes, F1 e WWE preservados.

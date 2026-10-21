# CineTracker Android — 1.0

App Android leve baseado em `Activity + WebView`, com runtime CineTracker embarcado no APK e backend Supabase compartilhado com a Web.

## Identidade oficial — Android 1.0 (estável)

- `applicationId`: `com.cinetracker.app` — preservado para atualizar instalações existentes;
- `versionName`: **`1.0`**;
- `versionCode`: **`10108`** (release oficial 1.0/r307);
- versão funcional: **CineTracker 1.0/r308**, preservando r306 com correções visuais de Home e recomendações adaptativas somente Android;
- preparação: `scripts/prepare-android-v10-r308.mjs`;
- validação: `scripts/test-android-v10-official.mjs` — compara com APK 1.0.61 publicado;
- build nativo: **release não depurável**, assinatura estável de release; **não compatível com o certificado do APK oficial 1.0.61** (reinstalação pode ser necessária, com risco para dados locais);
- pipeline: `.github/workflows/release-android-v10-official.yml`;
- release GitHub: `android-v1.0`;
- APK: `CineTracker-Android-1.0.apk`.

**Importante:** a release `v1.0.0` de `versionCode=10042` é histórica. O Android 1.0 atual promove a linha 1.0.61/r303; não utiliza o código antigo.

## Contrato funcional congelado

O JavaScript da versão 1.0.61/r303 é preservado, exceto identidade e exibição da versão. O novo certificado da release 1.0 é diferente do certificado usado no APK 1.0.61. Quem utiliza a instalação oficial anterior deve conferir a sincronização antes de desinstalar para instalar a 1.0. Mantidos os sete slots de Pra Você com renderizador único, as duas abas de Esportes, a lógica Raw/SmackDown e a sincronização de Fórmula 1. Web e Supabase intocados.

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

## Android 1.0.61 / r303

Corrigida a arquitetura de renderização de Descobrir > Pra Você. A grade auditada v525 é montada diretamente uma única vez por visita, sem acionar dezenas de callbacks do `paintDiscover` legado. Após a montagem, callbacks passivos não fazem rotação de Indicação do Dia ou 100% Novos. Mutações Visto e Trocar atualizam somente o slot tocado. Scripts: `scripts/prepare-android-v1061.mjs`, `scripts/test-android-v1061.mjs`, workflow `release-android-v1061.yml`. APK TESTE61 independente. Web e banco não modificados.

## Android 1.0 / r304 — patch somente Esportes

Substitui bordas vermelhas por estilo neutro e uniformiza as ações dos cards esportivos em duas colunas de 42px. Marcação de assistido passa a ter um único handler com confirmação explícita do resultado de `cinetracker_sport_mark_watched_v1`, rollback e erro visível; Formula 1 usa o mesmo fluxo anterior, sem mudança. Preparação `scripts/prepare-android-v10-sportsfix.mjs`, testes `scripts/test-android-v10-sportsfix.mjs`, publicação oficial na mesma release `android-v1.0`. Nome público 1.0 mantido, `versionCode 10105`.

## Android 1.0 / r305

Remove unicamente o botão `Ver eventos` adjacente a Assistido, mantendo a ação de marcação e F1 intactas. A aba Home → Filmes → Histórico consulta a primeira página de `cinetracker_home_movie_history_v542` ao abrir a aba e retornar ao aplicativo, além de revalidar em marcações e em janela de 2 minutos. O estado recente autorizado é mesclado com a listagem completa anterior e prevalece contra respostas tardias de carregamentos históricos; novas entradas ficam ao final da cronologia. Sem reload, sem mudanças em Web, SQL, Discover, Raw/SmackDown ou Perfil. Preparação `scripts/prepare-android-v10-r305-history.mjs`, testes `scripts/test-android-v10-r305-history.mjs`, pipeline `.github/workflows/release-android-v10-r305.yml`.

## Android 1.0 / r306 — Home Séries, episódios e Históricos

Correção limitada ao APK Android: validação da regra de 30 dias em Séries, identificação de novos episódios Raw/SmackDown, reconciliação do Histórico de Episódios por RPC v391 e manutenção dos filmes recentes v542 mesmo quando renderizadores antigos reconstruírem a Home. Atualiza em abertura, retomada do app e mutação relevante sem full reload, preservando Esportes, F1, Descobrir, Perfil, Web e banco. Build: `scripts/prepare-android-v10-r306-home.mjs`. Testes: `scripts/test-android-v10-r306-home.mjs`. Versão pública `1.0`, code `10107`.

### r307 — preferências adaptativas e proteção da Home

Os sete slots do Pra Você usam perfil de gêneros (vistos, Watchlist, favoritos) e feedback local dos botões, com rotação diária, memória de impressões e auditoria v525 na expansão de candidatos. A Home remove apenas barras órfãs de ✓ em Séries e reconcilia visualmente o Histórico de Filmes se o DOM for sobrescrito por cache antigo. Testes em `scripts/test-android-v10-r307-taste-home.mjs`. Nome público 1.0, código 10108, assinatura anterior.

## Home 1.0/r308

Correção restrita à Home do Android: botões de episódio com 52 px, travas contra toques rápidos, cards de altura consistente (inclusive UFC), Histórico com Desmarcar minimalista e RPC autenticada com rollback, e filme recente pinado pela última v542 verificada antes do paint para impedir alternância com Pokémon. Descobrir r307, Esportes e banco intactos.

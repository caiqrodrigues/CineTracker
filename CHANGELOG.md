## 1.0.248 / r458 — finalização orientada pelo vídeo — 2026-10-02

- Corrige o ciclo recursivo de timers da aba Filmes introduzido na r457; a aba permanece em Filmes e chama a Watchlist v405 somente por verificações finitas.
- Home Séries zera a posição antiga imediatamente e converge para **Continuar assistindo** assim que o painel existe, sem restaurar o fim do Histórico.
- Descobrir > Pra Você reafirma de forma finita o owner r457 e exige **Trocar** visível nos 7 slots.
- Perfil mantém exatamente 13 cards + meio-card **Ver mais** nas cinco listas pedidas e preserva **Desmarcar visto** no histórico diário.
- Fórmula 1 repinta o progresso autenticado por `cinetracker_f1_progress_v426` e agenda a correção também ao abrir a série; sincronização Série ↔ Esportes ↔ F1Hub permanece preservada.
- Sem reload global, MutationObserver, setInterval ou loop ilimitado.

## 1.0.247 / r457 — estabilidade final de Home Filmes, Pra Você, Perfil e F1 — 2026-10-02

- Home > Filmes passa a manter a seleção de Filmes após os handlers legados e dispara a Watchlist v405 sem retornar sozinho para Séries.
- Descobrir > Pra Você passa a ter owner único r457 sobre os seis pools filtrados v421, com timeout ampliado e os sete slots sempre renderizando **Trocar** junto às ações corretas.
- Perfil reafirma exatamente 13 cards em Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores; o 14º elemento é o botão **Ver mais** de meia largura. O desfazer do histórico diário r426 é preservado.
- Fórmula 1 passa a pintar o progresso visível por `cinetracker_f1_progress_v426`, usando somente sessões efetivamente liberadas e assistidas; a sincronização Série ↔ Esportes ↔ F1Hub r423/r452 permanece intacta.
- Validação de produção confirmou no banco 77 sessões F1 liberadas em 2026 e 75 assistidas no estado atual, eliminando o 77/77 stale.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado.

## 1.0.246 / r456 — Watchlist, Pra Você e progresso F1 — 2026-10-02

- Home > Filmes usa diretamente `cinetracker_home_movies_v405`: primeira página de 120 itens aparece imediatamente e as demais páginas entram em lotes assíncronos delimitados, sem congelar a main thread.
- Descobrir > Pra Você usa os pools filtrados `cinetracker_discover_watch_unseen_v421` e `cinetracker_discover_fresh_v421` em paralelo; os sete slots exibem **Trocar** de forma estável.
- Mantidos os filtros rígidos já consolidados no v421 (curtas, YouTube/web, novelas, reality, stand-up, WWE e exclusões pessoais conforme o bloco).
- Fórmula 1 passa a repintar o progresso da temporada atual pela verdade canônica de `cinetracker_home_series_v452`, eliminando o 77/77 stale quando ainda existem sessões não vistas.
- Perfil r455 preservado: 13 cards por lista + meio-card **Ver mais** e **↶ Desmarcar visto** no histórico diário.
- Sem full-page reload, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado.

## 1.0.245 / r455 — Perfil: 13 cards, Ver mais e desfazer histórico — 2026-10-02

- Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores exibem exatamente 13 cards na visão resumida do Perfil.
- Quando existem mais itens, o 14º elemento visual é um botão **Ver mais** com metade da largura padrão do card (75 px sobre o card-base de 150 px) e a mesma altura visual do rail.
- O novo botão delega ao **Ver mais** nativo de cada seção; não expande dados por um caminho paralelo.
- O histórico diário aberto pelo gráfico reafirma o renderer r426, exibindo **↶ Desmarcar visto** em cada filme, episódio e evento esportivo.
- Desmarcar remove somente o item exato e dispara atualização local por `cinetracker:data-changed`, sem full-page reload.
- Home, Descobrir, Esportes, Fórmula 1 e Android permanecem inalterados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado no runtime r455.

## 1.0.244 / r454 — Recuperação da tela preta no boot — 2026-10-02

- Corrigida a tela preta introduzida pela r453.
- A r454 volta a montar diretamente sobre a r452 estável e remove somente os disparos automáticos do verificador de release, sem apagar blocos inteiros do runtime.
- `checkRelease161`, `globalSearch` e todo o restante do código entre essas rotinas permanecem intactos; o patch destrutivo da r453 foi eliminado.
- `location.replace(...ct_refresh...)` foi substituído por atualização de URL via History API, sem recarregar a página.
- Fórmula 1 r452, Home, Descobrir, Perfil e Esportes permanecem funcionalmente inalterados.
- Adicionado gate para impedir remoção destrutiva de runtime e smoke real de produção com Chromium verificando conteúdo visível e erros fatais de JavaScript.
- Android permanece 1.0.20 / 10062.

## 1.0.243 / r453 — Correção exclusiva do refresh/pisca automático — 2026-10-02

- Corrigida somente a causa do recarregamento/pisca cíclico da página.
- O verificador legado `checkRelease161` não executa mais `location.replace(...ct_refresh...)` após o boot.
- Removidos exclusivamente os gatilhos automáticos desse verificador em foco, visibilidade, navegação e timer de boot.
- Nenhuma regra de Home, Descobrir, Perfil, Fórmula 1, Esportes, recomendações ou Android foi alterada.
- Mantidas as proibições de `window.location.reload()` e `router.refresh()`.

## 1.0.242 / r452 — Fórmula 1 como Série + Esporte — 2026-10-02

- Removida a regra incorreta de 1.280 episódios liberados da Fórmula 1 na Home.
- A Home passa a usar somente o mapa canônico da temporada atual em `f1_episode_map_v423`: total da temporada, sessões já exibidas, assistidas e próxima sessão disponível.
- Fórmula 1 entra em `Continuar assistindo` somente quando existe sessão atual já exibida e ainda não vista; sem sessão pendente, fica em `Em dia`.
- Toda marcação de episódio F1 em Séries passa a espelhar no histórico esportivo por trigger de banco, preservando a contagem de tempo em Séries e Esportes.
- Backfill executado para reparar divergências históricas entre `episode_progress` e `user_sport_watch_history`.
- Escopo restrito à Fórmula 1 Web; Descobrir, Perfil, demais séries/esportes e Android preservados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado.

## 1.0.241 / r451 — URL canônica sem ct_refresh — 2026-10-02

- Removido `ct_refresh` da URL antes do boot da aplicação com `history.replaceState`, sem recarregar a página.
- `history.pushState` e `history.replaceState` passam a eliminar somente `ct_refresh` de futuras navegações internas, preservando qualquer outro parâmetro e hash.
- Corrigida a regressão da r450, que partiu da base r444 e deixou de carregar a proteção já existente na r445.
- Removido o workflow temporário `activate-web-r450.yml`, que poderia reativar a r450 em pushes posteriores.
- Nenhum `window.location.reload()`, `router.refresh()`, polling, `setInterval` ou `MutationObserver` adicionado.

## 1.0.240 / r450 — Descobrir > Pra Você — 2026-10-02

- Escopo exclusivo em Descobrir > Pra Você.

- Build parte da base limpa r444 e aplica somente o owner RPC-first novo.

- Diário e 100% Novos: Watchlist + Visto + Trocar.

- Da sua Watchlist: Visto + Trocar, sem botão Watchlist cinza.

- Sem full-page reload, router.refresh, MutationObserver, setInterval ou loop infinito.

## 1.0.239 / r448 — Bloqueio do refresh automático periódico — 2026-10-02

- Desativados exclusivamente os schedulers automáticos legados de Pra Você em r420, r421 e r426, que reentravam na tela em aproximadamente 1,5–1,8 s.
- Mantidos os disparos manuais, ações dos cards, RPCs, renderer, Watchlist, Visto e Trocar.
- Nenhuma alteração em Home, Perfil, Esportes, F1, Android ou regras de recomendação.
- Build: apps/web/build-r448.mjs; regressão: apps/web/test-r448.mjs.

## 1.0.238 / r447 — Bloqueio do refresh automático — 2026-10-02

- Bloqueadas somente as rotinas automáticas legadas de reentrada de Pra Você em r426/r427/r428.
- Mantida a remoção da renderização automática causada pelo evento `online`.
- Nenhuma ação manual, renderer, botão, RPC, Home, Perfil, Esportes, F1 ou Android foi alterado.
- Build: `apps/web/build-r447.mjs`; regressão: `apps/web/test-r447.mjs`.

## 1.0.237 / r446 — Bloqueio de refresh automático — 2026-10-02

- Removida exclusivamente a chamada automática de `render()` disparada pelo evento `online`.
- Isso impede que eventos repetidos de conectividade reinicializem a tela durante o uso/teste.
- Nenhuma lógica de Descobrir > Pra Você, Home, Perfil, Esportes, F1, Supabase ou Android foi alterada.
- Mantidos os bloqueios existentes de `window.location.reload()`, `router.refresh()`, `setInterval` e loops infinitos.
- Build: `apps/web/build-r446.mjs`; regressão: `apps/web/test-r446.mjs`.

## 1.0.236 / r445 — Descobrir > Pra Você — 2026-10-02

- Eliminada a reentrada concorrente do loader de Pra Você: somente uma execução de buildForYou pode estar ativa por vez.
- Chamadas automáticas repetidas durante a mesma montagem são coalescidas; nova montagem automática fica bloqueada por 15 segundos.
- O estado e o DOM de Pra Você deixam de ser reconstruídos por chamadas concorrentes.
- O parâmetro externo ct_refresh é removido com history.replaceState, sem recarregar a página.
- Trocar, Watchlist e Visto permanecem sob a autoridade r309.
- Escopo exclusivo em Descobrir > Pra Você; Home, Perfil, Esportes, F1 e Android preservados.

Build: apps/web/build-r445.mjs; gate: apps/web/build-r445-official.mjs; regressão: apps/web/test-r445.mjs.

## 1.0.235 / r444 — Descobrir > Pra Você — 2026-10-02

- Criado build r444 limpo, partindo diretamente do r437 e usando versões explícitas.
- Removidos owners legados r395–r403 e r406–r410 do bundle final.
- Desativados os reparos automáticos de Pra Você dos r412–r415, r417 e r418.
- r309/r432 permanece como único renderer ativo de Pra Você, incluindo Trocar, Watchlist e Visto.
- Nenhuma alteração funcional em Home, Perfil, Esportes, F1 ou Android.

Build: apps/web/build-r444.mjs; gate: apps/web/build-r444-official.mjs; regressão: apps/web/test-r444.mjs.

## 1.0.234 / r443 — Descobrir > Pra Você — 2026-10-02

- Removidos os patches de `isFY` de r416/r426; ambos dependiam do owner r411, que já não existe no bundle final.
- Mantidos os cortes efetivos dos owners r395–r403 e r406–r410 e as barreiras r412–r415/r417/r418.
- r309/r432 continua como único renderer ativo de Pra Você, com Trocar, Watchlist e Visto.

Build: apps/web/build-r443.mjs; gate: apps/web/build-r443-official.mjs; regressão: apps/web/test-r443.mjs.

## 1.0.233 / r442 — Descobrir > Pra Você — 2026-10-02

- Tornada robusta a identificação dos runtimes r412–r418/r426 durante a montagem do bundle.
- O corte dos owners legados permanece exclusivo de Pra Você.
- r309/r432 continua como único renderer ativo, incluindo Trocar, Watchlist e Visto.

Build: apps/web/build-r442.mjs; gate: apps/web/build-r442-official.mjs; regressão: apps/web/test-r442.mjs.

## 1.0.232 / r441 — Descobrir > Pra Você — 2026-10-02

- Removido o patch textual frágil do click handler r404; ele não era necessário porque a autoridade local isForYou=false já impede qualquer carregamento legado.
- r309/r432 permanece como único renderer ativo de Pra Você.
- Trocar, Watchlist e Visto permanecem no owner r309.
- Escopo exclusivo em Pra Você; demais áreas preservadas.

Build: apps/web/build-r441.mjs; gate: apps/web/build-r441-official.mjs; regressão: apps/web/test-r441.mjs.

## 1.0.231 / r440 — Descobrir > Pra Você — 2026-10-02

- Corrigidos os identificadores reais dos runtimes r412–r418 na montagem do bundle.
- O corte dos owners r395–r403 e r406–r410 permanece.
- As rotinas de reparo automático r412–r418/r426 continuam impedidas de reconstruir Pra Você.
- r309/r432 permanece como único renderer ativo, incluindo **Trocar**, Watchlist e Visto.
- Nenhuma alteração funcional em Home, Perfil, Esportes, F1 ou Android.

Build: apps/web/build-r440.mjs; gate: apps/web/build-r440-official.mjs; regressão: apps/web/test-r440.mjs.

## 1.0.230 / r439 — Descobrir > Pra Você — 2026-10-02

- Corrigida a montagem da correção r438: o bundle base já não continha o marcador r411, então a faixa de remoção agora termina corretamente em r412.
- Mantido o corte dos owners legados r395–r403 e r406–r410.
- Mantidas as barreiras contra repaint automático dos runtimes r412–r418 e r426.
- r309/r432 permanece como único renderer ativo de Pra Você.
- **Trocar**, Watchlist e Visto permanecem no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**.

Build: apps/web/build-r439.mjs; gate: apps/web/build-r439-official.mjs; regressão: apps/web/test-r439.mjs.

## 1.0.229 / r438 — Descobrir > Pra Você — 2026-10-02

- Corrigido o ciclo de repintura/recarregamento visual que fazia a tela de **Pra Você** reiniciar aproximadamente a cada 2 segundos.
- Removidos do bundle final os owners legados r395–r403 e r406–r410, que continuavam reentrando no carregamento/renderização do Pra Você.
- Desativadas as rotinas automáticas de reparo de Pra Você dos runtimes r412–r418 e r426; elas não alteram mais o DOM dessa aba.
- r404/r405 permanecem somente como autoridades de Home; o bridge de Pra Você delega diretamente ao r309.
- r309/r432 permanece como único renderer/owner ativo de Pra Você.
- **Trocar**, **+ Watchlist** e **✓ Visto** continuam no renderer r309.
- Escopo exclusivo: **Descobrir > Pra Você**; Home, Perfil, Esportes, F1 e Android preservados.

Build: apps/web/build-r438.mjs; gate: apps/web/build-r438-official.mjs; regressão: apps/web/test-r438.mjs.

## 1.0.228 / r437 — Descobrir > Pra Você — 2026-10-02

- Corrigido o **pisca/recarregamento visual** durante a montagem de Pra Você.
- `paintForYou()` agora é idempotente: se as sete recomendações não mudaram, o DOM não é recriado.
- O placeholder de carregamento não é reinserido por chamadas concorrentes antigas.
- O token de geração existente continua cancelando respostas obsoletas, sem adicionar loop ou observer.
- **↻ Trocar**, **+ Watchlist** e **✓ Visto** permanecem no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.

Build: apps/web/build-r437.mjs; gate: apps/web/build-r437-official.mjs; regressão: apps/web/test-r437.mjs.

## 1.0.227 / r436 — Descobrir > Pra Você — 2026-10-02

- Corrigido o efeito de **piscando/recarregando** ao abrir **Pra Você**.
- A montagem das recomendações agora usa **single-flight**: chamadas simultâneas compartilham a mesma execução e não recriam a tela várias vezes.
- paintForYou deixa de substituir o DOM quando o conteúdo não mudou, preservando cards, botões e estado visual.
- **↻ Trocar**, **+ Watchlist** e **✓ Visto** permanecem no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.
- Sem full-page reload, router.refresh(), MutationObserver, setInterval ou loop infinito.

Build: apps/web/build-r436.mjs; gate: apps/web/build-r436-official.mjs; regressão: apps/web/test-r436.mjs.

## 1.0.226 / r435 — Descobrir > Pra Você — 2026-10-02

- Corrigida a tela preta do **Pra Você** causada pelo proxy que tratava `__ctR288R263.discover263` como uma propriedade literal com ponto no nome.
- O renderer r309 agora recebe e altera o objeto real `window.__ctR288R263.discover263`.
- Exposto um bridge estável `window.__ctR309Api` para o owner do Pra Você durante o boot, evitando dependência de estado intermediário do marcador r309.
- Cards, filtros, Watchlist, Visto e **↻ Trocar** continuam no renderer r309; nenhuma regra de recomendação foi alterada.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.
- Sem full-page reload, `router.refresh()`, `MutationObserver`, `setInterval` ou loop infinito.

Build: `apps/web/build-r435.mjs`; gate: `apps/web/build-r435-official.mjs`; regressão: `apps/web/test-r435.mjs`.

## 1.0.225 / r434 — Descobrir > Pra Você — 2026-10-02

- Corrigido exclusivamente o primeiro clique em Pra Você, que ainda podia cair no owner legado antes de discover263.tab ser definido.
- O runtime r434 intercepta a entrada da aba no capture phase, define discover.tab = 'foryou' e discover.type = 'all' antes de chamar o renderer r309.
- O mesmo owner r309 continua responsável pelos cards e pelas ações Watchlist, Visto e ↻ Trocar.
- Incluídas variantes de seletor da aba para cobrir o DOM real servido no Web sem alterar as demais abas.
- Sem full-page reload, router.refresh, MutationObserver, setInterval ou loop infinito.
- Escopo exclusivo: Descobrir > Pra Você. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.

Build: apps/web/build-r434.mjs; gate: apps/web/build-r434-official.mjs; regressão: apps/web/test-r434.mjs.

## 1.0.224 / r433 — Descobrir > Pra Você — 2026-10-01

- Corrigida a tela preta introduzida no r432.
- Causa: o renderer r309 capturava `discover263` antes do boot, quando o objeto ainda não existia, e permanecia com esse estado vazio durante toda a sessão.
- r433 passa a resolver `discover263`, os hooks de RPC e os owners auxiliares dinamicamente após o boot, preservando o mesmo renderer e as mesmas ações.
- **Trocar**, **Watchlist** e **Visto** continuam exclusivamente no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.
- Sem full-page reload, router.refresh, MutationObserver, setInterval ou loop infinito.

Build: `apps/web/build-r433.mjs`; gate: `apps/web/build-r433-official.mjs`; regressão: `apps/web/test-r433.mjs`.

## 1.0.223 / r432 — Descobrir > Pra Você — 2026-10-01

- Corrigido o ciclo que fazia Pra Você reconstruir os cards repetidamente.
- Removido do bundle o runtime r386 obsoleto que podia reiniciar a aplicação.
- Removidos os owners legados r395/r396.
- Runtimes r397/r403/r404/r406/r407/r408 deixam de disputar o renderer do Pra Você.
- Eventos `cinetracker:data-changed` e `online` são bloqueados durante Pra Você para impedir repaints automáticos.
- **r309 é o único renderer efetivo:** cards, Watchlist, Visto e **↻ Trocar** permanecem no mesmo owner.
- Escopo exclusivo: **Descobrir > Pra Você**; demais áreas preservadas.
- Android permanece inalterado.

Build: `apps/web/build-r432.mjs`; gate: `apps/web/build-r432-official.mjs`; regressão: `apps/web/test-r432.mjs`.

## 1.0.222 / r431 — Descobrir > Pra Você — 2026-10-01

- Corrigido o carregamento preso em **“Montando recomendações…” / “Buscando indicação…”**: a montagem não espera mais `loadRecent296`.
- Removidos gatilhos automáticos de `cinetracker:data-changed` e `online` que reconstruíam o Pra Você sem ação do usuário.
- O clique da aba Pra Você interrompe owners legados posteriores antes que repintem o bloco.
- **Trocar** continua no renderer único r309 e altera somente o slot selecionado.
- Sem full-page reload, `router.refresh()`, `setInterval`, `MutationObserver` ou loop de recuperação.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.
- Android permanece **1.0.20 / versionCode 10062**.

Build: `apps/web/build-r431.mjs`; gate: `apps/web/build-r431-official.mjs`; regressão: `apps/web/test-r431.mjs`.

## 1.0.221 / r430 — Descobrir > Pra Você — 2026-10-01

- **Descobrir > Pra Você** passa a ter um único renderer real: r309.
- r411 deixa de participar do bundle final; ele não pode mais sobrescrever os cards, ações ou estado do Pra Você.
- r427/r428/r429 deixam de participar do bundle final como recovery owners.
- **Trocar**, **Visto** e **Watchlist** voltam a ser renderizados pelo mesmo renderer que carrega os dados, eliminando cards com ações cinzas ou sem Trocar.
- O carregamento usa as três categorias reais de Pra Você — Filme, Série e Anime — e preserva os blocos Indicação do Dia, Da sua Watchlist e 100% novos.
- Removida a cadeia de recuperação periódica responsável pelas repinturas repetidas.
- Não há reload de página, router.refresh, setInterval, MutationObserver ou loop de recuperação no novo owner.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

## 1.0.220 / r429 — Descobrir > Pra Você — 2026-10-01

- r411 passa a ser o único owner ativo do Pra Você.
- Removidos do build os recovery owners r427/r428 que provocavam repaints/reinicializações sucessivas.
- Eliminado o ciclo que fazia a URL avançar em `?ct_refresh=` e reiniciava a tela.
- Mantidas as ações nativas Watchlist, Visto e Trocar do renderer r411.
- Home, Perfil, Esportes e Android permanecem inalterados.

## 1.0.219 — r428 (2026-10-01)

### Fixed
- **Descobrir > Pra Você:** o r428 passa a ser dono da composição visível do bloco, em vez de apenas reativar botões que já existiam.
- Quando o renderer legado recria um slot, o r428 recompõe a linha de ações correspondente: **Watchlist + Visto + Trocar** nos blocos novos e **Visto + Trocar** na Watchlist.
- **Trocar** usa os atributos nativos data-ct388-action/data-ct388-slot e delega ao handler r388 existente, mantendo a troca somente no slot clicado.
- Cards ausentes acionam o loader/renderizador r388 do próprio Pra Você antes da normalização das ações.
- Botões cinza/desabilitados são reativados no DOM visível sem reload de página, MutationObserver, setInterval ou loop ilimitado.

- Vercel: o commit final r428 recebeu status **success** para o deploy Web.

### Scope
- Web: exclusivamente **Descobrir > Pra Você**.
- Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem fora do escopo.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.218 — r427 (2026-10-01)

### Fixed
- **Descobrir > Pra Você:** corrigida a causa do renderer errado continuar vencendo no aparelho.
- O r427 reconhece explicitamente o DOM real do renderer **r388**, além dos owners r411/r336/r288.
- Quando o r388 é o owner visível, seu loader `__ctR388LoadForYou` é recuperado para repintar os cards reais de Pra Você.
- Os botões nativos `data-ct388-action="swap"` são reconhecidos e reativados sem substituir o handler nativo de **↻ Trocar**.
- **Trocar** deixa de ficar cinza/desabilitado: remove `disabled`, `hidden` e `inert`, forçando visibilidade e interação apenas no escopo de Pra Você.
- A correção usa apenas tentativas temporizadas e delimitadas; não cria MutationObserver, setInterval, loop infinito, reload de página ou router.refresh.

### Scope
- Web: exclusivamente **Descobrir > Pra Você**.
- Home, Perfil, Esportes, Top 10, Configurações, backend e Android permanecem fora do escopo.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.217 — r426 (2026-10-01)

### Fixed
- Perfil > Histórico diário usa uma RPC direta e oferece **↶ Desmarcar visto** por filme, episódio e evento esportivo.
- Descobrir > Pra Você passa a ter um único owner de clique para **Trocar**, reaplicado em passagens finitas após paints e navegação.
- Perfil deixa de aceitar repaints concorrentes das estatísticas esportivas no evento de sincronização; r424 fica como autoridade canônica.
- Fórmula 1 passa a exibir **vistos / episódios já exibidos** da temporada corrente; o denominador não é derivado da quantidade de vistos/importados.

### Banco
- `cinetracker_activity_items_by_day_v426`
- `cinetracker_unmark_history_item_v426`
- `cinetracker_unmark_sport_history_v426`
- `cinetracker_f1_progress_v426`

### Scope
- Web: Perfil, Histórico diário, Descobrir > Pra Você e Fórmula 1.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.216 — r425 (2026-10-01)

### Fixed
- Home > Séries deixa de ocultar a tela inteira enquanto aguarda os dados.
- Fórmula 1 (media_id=865) passa a usar 1.280 sessões importadas de 2015-2026; os 77 vistos deixam 1.203 restantes.
- Descobrir > Pra Você deixa de disparar repaint global ao marcar Visto ou Watchlist; somente o slot acionado é removido e substituído.
- Aliases legados de estatísticas esportivas no Perfil convergem para cinetracker_sport_stats_v421.
- Sem full-page reload, MutationObserver, setInterval ou loop ilimitado.

### Scope
- Home, F1, Pra Você e Perfil Web.
- Android permanece **1.0.20 / 10062**.

## 1.0.215 — r424 (2026-10-01)

### Fixed
- Home > Séries deixa de iniciar visualmente no fim do Histórico: a entrada da aba segura a primeira pintura antiga, busca a autoridade atual e revela a tela já posicionada em Assistir a seguir.
- Fórmula 1 (media_id=865) passa a obedecer a semântica de série na Home; quando existe próximo episódio não visto, entra em **Assistir a seguir**. Raw e SmackDown recorrentes recebem a mesma correção.
- Perfil passa a repintar os tempos a partir de cinetracker_profile_stats e os tempos esportivos a partir de cinetracker_sport_stats_v421 após entrada e alterações de dados. O tempo das sessões F1 já persistido nos dois domínios volta a aparecer nos dois contabilizadores.
- Listas de Séries e Filmes no Perfil deixam de usar arraste horizontal: os cards quebram em múltiplas linhas, permanecem inteiros e listas longas exibem **Ver mais**.
- Sem full-page reload, MutationObserver, setInterval ou loop ilimitado.

### Scope
- Android permanece **1.0.20 / 10062**.
- Descobrir, Top 10, Esportes fora da sincronização F1 e demais áreas visuais não tiveram alterações nesta r424.

## 1.0.214 — r423 (2026-10-01)

### Fixed
- Corrigida a causa real da Fórmula 1 não sincronizar: os handlers lexicais efetivamente usados pela Série, Esportes e F1 Hub agora delegam diretamente para r423, sem depender de reatribuições tardias de funções.
- Marcar/desmarcar uma sessão F1 em qualquer uma das três superfícies persiste o mesmo episódio da série media_id=865 e o mesmo evento no histórico esportivo.
- O fluxo real de Esportes r255 deixa de passar por um RPC legado inexistente para F1 e sincroniza pelo writer canônico.
- O mapa f1_episode_map_v423 mantém temporada, rodada, tipo de sessão e número de episódio alinhados; a reconciliação da temporada atual repara estados antigos divergentes sem duplicar play events já existentes.
- Optimistic UI/rollback preservados; sem reload global, observer contínuo, intervalo agressivo ou loop ilimitado.

### Accounting
- Cada sessão F1 assistida contabiliza o runtime em **Séries** e também em **Esportes**, conforme solicitado.

### Scope
- Perfil, Descobrir, Home fora da invalidação de dados F1, demais esportes e Android não tiveram regra visual ou funcional alterada.
- Android permanece **1.0.20 / 10062**.
## 1.0.213 — r422 (2026-10-01)
- Fórmula 1 passa a ter sincronização dupla e atômica: cada sessão é o episódio correspondente da série `media_id=865` e, ao mesmo tempo, um evento assistido em Esportes.
- Marcar/desmarcar pelo detalhe da série, pela tela de Esportes ou pelo F1 Hub converge em `cinetracker_f1_watch_sync_v422`; o estado de uma superfície reaparece nas outras sem full-page reload.
- O tempo da sessão é contabilizado nos dois domínios: histórico/tempo de séries e histórico/tempo de esportes. O contador de Esportes volta a incluir Fórmula 1.
- F1 Hub e detalhe da série mantêm Optimistic UI e rollback em falha; o fluxo de Esportes é interceptado somente para `formula_1`, preservando os demais esportes.
- Perfil, Descobrir e filtros de recomendação da r421 não tiveram layout ou regras alterados. Android permanece 1.0.20 / 10062.

## 1.0.212 — r421 (2026-10-01)
- Descobrir bloqueia stand-up em duas camadas: elegibilidade SQL v421 e validação de detalhes TMDB antes do paint no Pra Você, abas públicas e Top 10. Curtas <40 min, YouTube/web, novelas, Reality, WWE, vistos e Watchlist continuam bloqueados pelas regras existentes.
- Fórmula 1 passa a usar exclusivamente a série `media_id=865` no F1 Hub: o estado visual é lido do progresso de episódios e a escrita usa `cinetracker_f1_episode_watch_set_v421`; o histórico esportivo genérico deixa de pintar as sessões.
- Perfil mantém o layout existente e corrige os três tempos de Watchlist por rótulo semântico, usando `cinetracker_profile_watchlist_runtime_v421`. Trilhos de Séries/Filmes exibem todos os cards retornados e permitem alcançar o último card sem corte.
- Sem full-page reload, MutationObserver novo, setInterval ou loop ilimitado. Android permanece 1.0.20 / 10062.

## 1.0.211 — r420 (2026-10-01)
- Descobrir passa a excluir stand-up em todas as autoridades atuais: elegibilidade SQL v420, pools do Pra Você v420 e barreira client-side; regras anteriores de curtas <40 min, YouTube/web, novelas, Reality, WWE e biblioteca pessoal permanecem.
- Fórmula 1 corrige o owner lexical r311: o clique real do F1 Hub delega ao writer de episódios da série media_id 865, sem espelhar a sessão como evento esportivo genérico; estado do modal vem do progresso da série.
- Perfil recebe tempos reais da Watchlist (séries, filmes e total) pelo RPC v420 e os contadores de esportes passam a excluir Fórmula 1, que pertence à série.
- Listas Séries/Filmes do Perfil deixam de cortar em 10 cards e renderizam todos os cards retornados, com trilho horizontal completo e último card alcançável.
- Android permanece 1.0.20 / 10062.

## 1.0.210 — r419 (2026-10-01)
- Hotfix final de Fórmula 1: o owner legado r311 que captura os cliques do F1 Hub agora delega diretamente ao writer r418 da série Fórmula 1 (media_id 865), impedindo a persistência como evento esportivo genérico.
- Mantém integralmente as correções r418 de entrada da Home, botões Trocar do Pra Você e contadores esportivos do Perfil.
- Android permanece 1.0.20 / 10062.

## 1.0.209 — r418 (2026-10-01)
- Home Séries arma a proteção antes do boot e só revela a tela já ancorada em **Assistir a seguir**, eliminando o flash/salto pelo fim do Histórico.
- Descobrir > Pra Você repara os botões **Trocar** diretamente nas linhas de ação visíveis; Indicação do Dia e 100% Novos ficam com Watchlist + Visto + Trocar, e Da sua Watchlist com Visto + Trocar.
- Perfil preserva integralmente o layout e passa a ler Tempo/Eventos assistidos pela autoridade relacional `cinetracker_sport_stats_v418`.
- F1 Hub passa a persistir cada sessão como episódio da série Fórmula 1 (media_id 865), com Optimistic UI e espelho da sessão F1.
- Sem full-page reload, MutationObserver global, setInterval ou loop infinito. Android permanece 1.0.20 / 10062.

## Web 1.0.208 / r417 — 2026-10-01

### Corrigido
- **Home > Séries:** o canvas fica oculto até a geometria final de **Assistir a seguir** e a altura total da Home permanecerem estáveis; o alinhamento é reaplicado de forma finita após a revelação, eliminando a abertura no fim do Histórico e o salto tardio.
- **Descobrir > Pra Você:** a correção atua na linha de ações realmente visível, independentemente do painter legado que venceu. Os sete slots populados recebem **↻ Trocar** funcional; Diário/100% Novos mantêm **+ Watchlist + ✓ Visto + ↻ Trocar** e Da sua Watchlist mantém **✓ Visto + ↻ Trocar**.
- **Perfil:** sem alteração visual. **Tempo assistido** e **Eventos assistidos** de Esportes passam a ser repostos pela autoridade `cinetracker_sport_stats_v1`; produção possui 86 registros / 11.490 minutos e não pode mais ser sobrescrita por payload legado zerado.
- **Fórmula 1:** `media_id=865` é reafirmada como série. Marcar uma sessão atualiza o card e o contador imediatamente, persiste por `cinetracker_mark_watch_v0994` como episódio e só depois faz o espelho opcional da sessão F1.
- Mantidos Optimistic UI, rollback em falha, timers finitos e ausência de `MutationObserver` novo, `setInterval`, loop ilimitado ou full-page reload.
- Android preservado em **1.0.20 / 10062**.

## Web 1.0.207 / r416 — 2026-10-01

### Corrigido
- **Perfil:** preservado o renderer visual aprovado; um snapshot persistente por usuário é pintado imediatamente e `cinetracker_profile_v380` atualiza os dados em segundo plano, reduzindo o loading longo sem mudar layout, cards ou ordem.
- **Descobrir > Pra Você:** a r411 volta a ser a autoridade final do DOM visível. Os sete slots populados usam os botões nativos da r411, incluindo **↻ Trocar**; painters legados deixam de ser a última pintura da aba.
- **Fórmula 1 como série:** a marcação de sessão/episódio passa a ser otimista e imediata, persiste em `cinetracker_mark_watch_v0994` como episódio da série importada `media_id=865`, envia a quantidade de episódios já exibidos para o estado Em dia/Em progresso e espelha a sessão em `cinetracker_f1_session_watch_set_v314`.
- A marcação da F1 invalida Home/Perfil por evento local e reconcilia o estado em segundo plano, sem full-page reload.
- Sem novo `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` ou `router.refresh()`.

## Web 1.0.206 / r415 — 2026-09-30

### Corrigido
- **Home > Séries:** a tela permanece visualmente bloqueada enquanto o Histórico e a seção **Assistir a seguir** estabilizam; só então alinha e revela a Home, eliminando o primeiro paint no fim do Histórico e o salto posterior.
- **Descobrir > Pra Você:** o reparo deixa de depender de wrappers/slots específicos e atua na linha de ações realmente visível. Os sete slots populados recebem **↻ Trocar**: Diário e 100% Novos ficam com **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist fica com **✓ Visto + ↻ Trocar**.
- **Perfil:** o visual aprovado permanece intacto, mas o carregamento passa a ter owner único, cache-first e uma única chamada principal a `cinetracker_profile_v380`; os RPCs legados pesados `cinetracker_profile_payload_v0997`, `cinetracker_profile_media_dashboard_v0991` e `cinetracker_profile_quick_stats_v1` não fazem parte do novo caminho de entrada.
- Enriquecimento esportivo do Perfil é assíncrono e delimitado, sem bloquear o primeiro paint.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver` novo, `setInterval` ou loop ilimitado.

## Web 1.0.205 / r414 — 2026-09-30

### Corrigido
- Corrigido exclusivamente o desaparecimento do botão **↻ Trocar** em `Descobrir > Pra Você`.
- O runtime identifica os sete slots visíveis mesmo quando um painter legado recria o DOM sem o terceiro/segundo botão.
- Indicação do Dia e 100% Novos recebem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist recebe **✓ Visto + ↻ Trocar**.
- O botão é reativado de forma finita após paints conhecidos e delega a troca ao owner r411, sem `MutationObserver`, `setInterval`, loop ilimitado ou full-page reload.
- Nenhuma regra de Home, recomendações, filtros, Reality, Perfil, Esportes, Top 10, backend ou Android foi alterada.

## [1.0.204] - 2026-09-30

### Added
- Bloqueio global de **Reality / Reality TV (TMDB 10764)** em recomendações e descoberta, preservando os filtros r412 de curta-metragem abaixo de 40 min, YouTube/web originals, novelas/Soap, WWE, vistos e Watchlist.
- Novas autoridades Supabase `cinetracker_recommendation_eligible_v413`, `cinetracker_discover_fresh_v413`, `cinetracker_discover_watch_unseen_v413` e `cinetracker_home_series_v413`.

### Fixed
- Home Séries não exibe mais o fim do Histórico antes de saltar para **Assistir a seguir**: o canvas da Home fica oculto somente durante o alinhamento inicial e é revelado já na posição correta.
- `Descobrir > Pra Você` reafirma r411 como owner final e recompõe de forma delimitada os botões **↻ Trocar** ausentes; Diário/100% Novos = **+ Watchlist / ✓ Visto / ↻ Trocar** e Da sua Watchlist = **✓ Visto / ↻ Trocar**.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados passam pela elegibilidade r413 com substituição ordenada do candidato bloqueado.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou laços ilimitados.

## [1.0.203] - 2026-09-30

### Added
- Regra global de elegibilidade r412 para recomendações e descoberta: filmes, animações em formato de filme e especiais com runtime conhecido inferior a **40 minutos** são descartados antes do paint.
- Bloqueio de produções vinculadas a **YouTube, YouTube Originals, YouTube Premium/Red**, web series, web videos e vlogs por network, produtora, homepage e keywords.
- Bloqueio de **novelas / telenovelas / Soap** por gênero TMDB 10766, gênero textual e media kind.
- Novas autoridades Supabase `cinetracker_recommendation_eligible_v412`, `cinetracker_discover_fresh_v412`, `cinetracker_discover_watch_unseen_v412` e `cinetracker_home_series_v412`.
- Substituição dinâmica e delimitada: candidatos inválidos são pulados e o próximo candidato elegível é escolhido sem recursão ou loop infinito.

### Fixed
- `Descobrir > Pra Você` usa os pools estritos v412 e mantém os **7 botões ↻ Trocar** visíveis/ativos: Diário, 3 slots da Watchlist e 3 slots de 100% Novos.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados passam pela mesma elegibilidade antes do paint, preservando exclusões de vistos/Watchlist/WWE já existentes.
- Home Séries passa pela autoridade v412 sem remover Raw/SmackDown do acompanhamento de episódios.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou laços ilimitados.

## [1.0.202] - 2026-09-30

### Fixed
- Escopo exclusivo em **Descobrir > Pra Você**.
- Removido do caminho ativo o RPC composto `cinetracker_discover_foryou_v396`, que no aparelho real estava retornando HTTP 500 por `statement timeout`.
- Os seis pools de Filme/Série/Anime passam a carregar diretamente e em paralelo por `cinetracker_discover_watch_unseen_v396` e `cinetracker_discover_fresh_v387`.
- Timeout do cliente passa de 4,5 s para 12 s por pool; o paint é progressivo e aceita respostas parciais sem deixar a tela em "Recomendações indisponíveis".
- Loaders legados r396-r410 delegam antes de executar seus próprios caminhos, impedindo repaints/erros antigos de retomarem a tela.
- Indicação do Dia e 100% Novos exibem **+ Watchlist / ✓ Visto / ↻ Trocar**; Da sua Watchlist exibe **✓ Visto / ↻ Trocar**.
- `Trocar` permanece local, delimitado e sem recursão; Visto/Watchlist continuam otimistas e sem full-page reload.
- Home, Séries, Perfil, Esportes, Top 10, Configurações, backend e Android não foram alterados.

## [1.0.201] - 2026-09-29

### Fixed
- Escopo exclusivo em **Descobrir > Pra Você**.
- Corrigido o owner real r319: `loadForYou319` e o caminho `loadDiscover319('foryou')` delegam antes de chamar o builder legado r309.
- `buildForYou` e painter r309 deixam de poder sobrescrever o renderer atual depois que os cards aparecem; o painter r288 já não existe no bundle final.
- Os 7 slots usam ações completas e ativas: **+ Watchlist / ✓ Visto / ↻ Trocar** no Diário/100% Novos e **✓ Visto / ↻ Trocar** na Watchlist.
- Botões deixam de herdar apresentação cinza/inativa: passam a usar `chip ct410-action`, sem `disabled`, `inert` ou bloqueio de pointer.
- Mantido o payload canônico v396 e fallback v396/v387; nenhuma mudança de banco foi necessária.
- Nenhuma alteração em Home, Séries, Perfil, Esportes, Top 10, Configurações ou Android.
- Sem `window.location.reload()`, `router.refresh()`, observer novo, `setInterval` ou loop ilimitado.

## [1.0.200] - 2026-09-29

### Fixed
- Home não abre mais no fim do Histórico; Séries e Filmes alinham na seção principal somente após o paint real.
- Marcação de episódio como assistido atualiza imediatamente Histórico, contador, bucket e próximo episódio antes da confirmação do servidor.
- Reconciliação pós-persistência usa as autoridades existentes da Home sem full-page reload e restaura o estado local em caso de falha.
- Descobrir > Pra Você ganhou owner único r409, fallback paralelo delimitado e proteção contra painters legados sobrescreverem os cards.
- Botões completos restaurados: **+ Watchlist / Visto / Trocar** nos slots diário e 100% novos; **Visto / Trocar** nos slots da Watchlist.
- Mantidas as autoridades r406 para Séries e r405 para paginação da Watchlist de Filmes.
- Sem MutationObserver global, setInterval agressivo, recursão não delimitada ou reload de página.

## Web 1.0.199 / r408 — 2026-09-29

### Home
- Entrada e retorno alinham uma única vez o bloco real **Assistir a seguir** depois que ele existe no DOM; o Histórico permanece acima e deixa de ocupar a viewport.
- O alinhamento é absoluto, finito e cancelado por interação manual, eliminando a disputa que devolvia a Home ao fim do Histórico.
- Filmes chama diretamente o loader r406/v405 após ativar a semi-aba, garantindo o primeiro paint da Watchlist sem depender de estado legado.

### Descobrir / Pra Você
- Owner final sobre `cinetracker_discover_foryou_v396`. Indicação do Dia e 100% Novos exibem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist exibe **✓ Visto + ↻ Trocar**.
- Verificação finita recupera o renderer final caso um painter legado tardio tente remover **Trocar**.
- Ações seguem otimistas e com trava por slot, sem reload.

### Estabilidade
- Sem MutationObserver global, setInterval, loop ilimitado, window.location.reload() ou router.refresh().
- Perfil, Esportes, Top 10, Configurações, regras de Séries e Android não foram alterados.

## Web 1.0.198 / r407 — 2026-09-29

### Home
- Corrige a entrada e a reentrada que ficavam no final do Histórico: a restauração automática de scroll do navegador fica em modo manual e os owners r374/r393/r404 delegam para uma única âncora semântica em **Assistir a seguir**.
- O clique capturado de Séries/Filmes na r374 agora entrega a navegação ao owner vivo depois de trocar a aba. Em **Filmes**, o loader r406/v405 é disparado imediatamente, eliminando a Watchlist vazia até repaint tardio.
- Regras e dados de Séries da r406 são preservados; esta release não muda classificação nem cálculo de episódios.

### Descobrir / Pra Você
- `cinetracker_discover_foryou_v396` passa a ser consumido por um único owner final, com prefetch em segundo plano depois da Home estabilizar.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist exibe **✓ Visto + ↻ Trocar**.
- Closures tardios r404/r406 delegam ao r407 e deixam de apagar o botão **Trocar** depois que os cards aparecem.
- Ações usam estado local otimista e trava por slot, sem recarregar a página.

### Estabilidade
- Removidos bursts tardios de ownership de até 46 segundos; permanecem somente timers curtos e delimitados.
- Sem `MutationObserver` global, `setInterval`, loop infinito, `window.location.reload()` ou `router.refresh()`.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

## 1.0.197 — r406\n\n### Corrigido\n- Contagem de episódios disponíveis restaurada para a autoridade de episódios recentes; removida a sobrescrita r404 que transformava backlog histórico de Raw/SmackDown em `available_episodes`.\n- Raw e SmackDown com episódio recente liberado e não visto passam para **Assistir a seguir**.\n- Home > Filmes deixa de esvaziar a Watchlist quando o estado legado da aba diverge da view visível.\n- Descobrir > Pra Você completa os botões ausentes em todos os sete slots.\n- Renderização continua em lotes via `requestAnimationFrame` e timers são finitos; sem full page reload.\n\n## Web 1.0.196 / r405 — 2026-09-29

### Home / Filmes
- O vídeo real da r404 confirmou que **Assistir a seguir / Watchlist** permanecia em `Carregando Watchlist…`.
- Os logs de produção mostraram o clique real executando `cinetracker_home_movies_v393` com HTTP 200, sem chegar ao loader paginado r404.
- A causa foi localizada no closure legado r388: `media_id` é UUID, mas o renderer aplicava `Number(media_id)`; o resultado virava zero e todos os filmes válidos eram descartados.
- O closure real `loadMovies` da r388 agora delega imediatamente para r405, eliminando esse filtro inválido e a disputa de autoridade.
- `cinetracker_home_movies_v405` implementa paginação SQL real com `LIMIT/OFFSET`, sem materializar primeiro o JSON completo da v402.
- Produção validada com **1.381 filmes**; primeira página = **120**, segunda página = **120**.
- O índice existente `idx_media_overrides_profile_state_updated_r274` é reutilizado; nenhum índice redundante foi criado.

### Descobrir / Pra Você
- O vídeo real confirmou cards visíveis sem o botão **Trocar**.
- Os logs mostraram o caminho legado ainda ativo (`shown_recommendations_v296`, `watchlist_full_v119`, `discover_filter_v333`) ao mesmo tempo em que a autoridade nova também carregava.
- Os closures que realmente venciam a navegação em produção — `loadForYou321`, `paintForYou336` e `switchDiscover336` — passam a delegar diretamente para r405 quando a aba é `foryou`.
- Os closures locais `loadForYou` e `renderForYou` da r388 também delegam para r405, impedindo repaint tardio do renderer antigo.
- O caminho crítico deixa a chamada composta de ~8 s e carrega em paralelo os seis pools de Filme/Série/Anime por `cinetracker_discover_watch_unseen_v396` e `cinetracker_discover_fresh_v387`.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + Visto + Trocar**; Da sua Watchlist exibe **Visto + Trocar**.
- `Trocar` continua com trava local por slot e não executa reload de página.

### Estabilidade / escopo
- Nenhum `window.location.reload()`, `router.refresh()`, `setInterval`, `MutationObserver` permanente ou loop infinito foi adicionado.
- Raw/SmackDown permanecem exatamente na regra já aprovada da r404.
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.
- Web **1.0.196 / r405**; Android preservado em **1.0.20 / 10062**.
- Migration: `20260929235900_r405_home_movies_true_paging.sql`.

## Web 1.0.195 / r404 — 2026-09-29

### Home / Filmes
- A Watchlist deixa de depender de uma resposta única com 1.381 itens: `cinetracker_home_movies_v404` pagina a fonte em blocos de 120, mantém o total exato e libera o primeiro paint sem esperar a lista completa.
- As páginas restantes são carregadas em sequência delimitada e pintadas em lotes ociosos; falha de rede encerra em estado explícito em vez de manter `Carregando Watchlist…` indefinidamente.
- A semi-aba ativa passa a reconhecer também o botão visível por rótulo Séries/Filmes, impedindo estado legado stale de bloquear o paint de Filmes.

### Descobrir / Pra Você
- O owner r404 escolhe o container realmente visível do Descobrir e ignora roots antigos ocultos, corrigindo o caso do vídeo em que os cards apareciam pelo renderer legado sem o botão Trocar.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + Visto + Trocar**; Da sua Watchlist exibe **Visto + Trocar**.
- A posse do renderer é recuperada por uma sequência finita de verificações até 45 s, sem observer contínuo, e cada Trocar altera somente o slot clicado.
- Ações continuam locais/otimistas e sem full-page reload.

### Raw / SmackDown
- `cinetracker_home_series_v404` separa **backlog total não visto** de **episódio recente pendente**.
- Produção validada: Raw = **1.499 episódios restantes totais / 1 recente pendente**; SmackDown = **1.187 totais / 1 recente pendente**.
- Enquanto existir o episódio recente pendente, Raw/SmackDown ficam em **Continuar assistindo**. Depois que esse episódio for marcado como visto, passam para **Em dia**, mesmo que o backlog histórico continue alto.

### Estabilidade / release
- Sem `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` ou `router.refresh()` no runtime r404.
- Web 1.0.195 / r404; Android preservado em 1.0.20 / 10062.
- Migration: `20260929223000_r404_home_movies_paged_recurring_backlog.sql`.

## Web 1.0.194 / r403 — 2026-09-29

### Home / Séries
- `cinetracker_home_series_v403` mantém a autoridade da r402 e corrige Raw/SmackDown: episódio recente lançado e não visto passa a classificar a série em **Assistir a seguir / Continuar assistindo**, não mais em **Em dia**.
- Contagem `available_episodes` e próximo episódio continuam vindo da autoridade server-side, sem backlog histórico de WWE.

### Home / Filmes
- `cinetracker_home_movies_v402` permanece como payload leve e foi validado com 1.381 filmes.
- O frontend passa a aceitar todas as formas reais do payload (objeto com `rows`, envelope `data`, array direto e array unitário), aumenta o timeout do RPC e possui owner finito para recuperar a seção caso um renderer legado a apague.
- Paint de filmes e séries é interrompido quando a semi-aba deixa de estar ativa, evitando trabalho escondido na main thread e reduzindo congelamentos.
- A semi-aba ativa passa a ser lida primeiro do DOM visível, evitando estado legado stale selecionar Séries enquanto Filmes está aberto.

### Descobrir / Pra Você
- Diário e 100% Novos mantêm **+ Watchlist + Visto + Trocar**; Da sua Watchlist mantém **Visto + Trocar**.
- CSS r403 força grid de 3/2 ações dentro da largura do card, impedindo o botão **Trocar** de ficar cortado.
- `cinetracker_discover_foryou_v396` continua como payload canônico e as ações permanecem locais/otimistas, sem reload.

### Estabilidade / release
- Runtime r402 é aposentado no bundle final para eliminar disputa de loaders entre r402 e r403.
- Sem `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` ou `router.refresh()`.
- Web 1.0.194 / r403; Android preservado.

## Web 1.0.193 / r402 — 2026-09-29

### Home / Séries
- Cria `cinetracker_home_series_v402` para corrigir a contagem de episódios disponíveis.
- Séries normais deixam de considerar episódios do catálogo sem `air_date` como já liberados.
- Quando o metadata TMDB possui contagem liberada válida, ela tem precedência sobre a quantidade bruta do catálogo; histórico assistido continua sendo o piso para metadata atrasado.
- O frontend exibe `available_episodes` diretamente, eliminando divergência com a função legada de texto.
- Raw e SmackDown mantêm a janela recorrente de 21 dias e exigem data real do episódio, sem reintroduzir backlog histórico.

### Home / Filmes
- Cria `cinetracker_home_movies_v402`, mantendo o payload leve da r401.
- Normaliza a resposta RPC antes de ler `rows`, cobrindo objeto direto, array unitário e envelope `data`.
- **Assistir a seguir / Watchlist** continua com carregamento fatiado e sem bloquear a main thread.

### Descobrir / Pra Você
- O owner r402 assume os dois entrypoints vivos herdados da r288: `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`.
- Somente a aba `foryou` é redirecionada; demais abas do Descobrir continuam delegadas ao loader original.
- `cinetracker_discover_foryou_v396` permanece como payload canônico e a posse do renderer é reafirmada por sequência finita de timers.
- Visto, Watchlist e Trocar continuam locais/otimistas e sem reload de página.

### Estabilidade / validação
- Mantido paint em lotes pequenos via `requestIdleCallback`/frame.
- Proibidos no runtime r402: `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` e `router.refresh()`.
- Testes r402 cobrem owner vivo r288, fim do skeleton, Watchlist de filmes e resposta RPC envelopada.
- Web 1.0.193 / r402; Android permanece sem alteração.

## Web 1.0.192 / r401 — 2026-09-29

### Home / Séries
- `cinetracker_home_series_v401` deixa de usar a cobertura parcial de `episode_catalog_v336` como contagem total de episódios liberados.
- Para séries normais, episódios disponíveis passam a ser calculados pelos episódios efetivamente lançados no metadata TMDB menos episódios assistidos; o catálogo local fica responsável pelos metadados do próximo episódio.
- O próximo episódio normal é derivado pela primeira lacuna real da temporada liberada, evitando saltos como S03E07 → S09E38 quando o catálogo local ainda está incompleto.
- Raw e SmackDown mantêm semântica recorrente: backlog histórico é ignorado, mas o episódio recente não visto aparece em **Em dia**.
- `ct-refresh-tv-state-user` v5 só considera uma temporada normal em cache quando todos os episódios já lançados daquela temporada estão presentes.

### Home / Filmes
- `cinetracker_home_movies_v401` substitui na Home o payload de 2,5 MB da Watchlist antiga por um payload enxuto sem `raw_tmdb`; para a conta validada, 1.381 filmes caíram para cerca de 407 KB.
- Séries e filmes são pintados em lotes de 10 itens com `requestIdleCallback`/fallback por frame, evitando monopolizar a main thread.
- **Assistir a seguir / Watchlist** usa a nova autoridade enxuta e não depende mais do RPC pesado v376.

### Descobrir / Pra Você
- O owner r401 reconhece a aba ativa pelo DOM e também cobre o container base `data-discover-content`, sem depender exclusivamente do estado legado `discover263`.
- O renderer legado r388 é redirecionado para o renderer r401; loaders antigos não conseguem mais restaurar skeletons de **Buscando indicação…** depois que o payload v396 chega.
- A posse da aba é reafirmada por uma sequência finita de timers, sem `MutationObserver`, `setInterval` ou loop permanente.
- Indicação do Dia, Da sua Watchlist e 100% Novos continuam usando `cinetracker_discover_foryou_v396` e ações locais Visto/Watchlist/Trocar.

### Estabilidade / build
- Web 1.0.192 / r401 deriva da base segura r396; r397-r400 não são encadeadas no bundle.\n- O build r401 valida sintaxe do runtime, padrões proibidos e os nomes finais `app-v401.js`/cache r401 antes de concluir o deploy.
- Nenhuma mutação usa `window.location.reload()` ou `router.refresh()`.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

## Web 1.0.191 / r400 — 2026-09-29

### Home
- Corrige a race condition de boot que disparava `cinetracker_home_series_v391` e `cinetracker_watchlist_full_v376` antes da sessão autenticada existir e consolidava listas vazias.
- Séries e filmes passam a carregar somente após sessão + DOM da rota estarem prontos.
- Renderização de listas extensas é fatiada com `requestAnimationFrame`; Histórico continua acima e a entrada é ancorada no bloco principal.
- Raw e SmackDown recebem refresh autenticado da temporada corrente em segundo plano e nova leitura da autoridade v391.

### Descobrir / Pra Você
- Corrige o mesmo race de autenticação que transformava a falha inicial do RPC v396 em `Buscando indicação…`/estado vazio permanente.
- O owner r400 consome o payload canônico `cinetracker_discover_foryou_v396` depois do boot e pinta os 7 slots com 18 ações.
- Visto, Watchlist e Trocar permanecem locais/otimistas, com trava síncrona e sem full-page reload.

### TV recorrente
- `ct-refresh-tv-state-user` deixa de considerar cache recente suficiente para séries esportivas recorrentes.
- Temporada atual de Raw/SmackDown é sempre consultada quando o refresh roda; episódios esportivos já lançados são aceitos pela data real da temporada, sem depender do `last_episode_to_air` atrasado do detalhe da série.

### Estabilidade / build
- r400 volta a derivar de r396 para retirar completamente do bundle o observer global introduzido em r397.
- Web 1.0.191 / r400; Android permanece sem alteração.

# Changelog

## 1.0.190 — 2026-09-29 — Web r399

### Travamento inicial
- Corrige a regressão da r398 que instalou um `MutationObserver` global em `document.documentElement` e chamava novamente o owner da Home a cada mutação do DOM.
- O ciclo removido era: render da Home → mutação → observer → nova entrada da Home → novo render/timers → nova mutação.
- O runtime r399 não possui observer global e usa somente um probe de boot finito e idempotente.

### Home
- Séries continuam usando `cinetracker_home_series_v391` como autoridade.
- Raw/SmackDown continuam recebendo refresh da temporada atual, mas o refresh é adiado para depois do primeiro paint, possui uma única task em voo e TTL de 5 minutos.
- Filmes mantêm o fallback `cinetracker_watchlist_full_v376`.
- A Watchlist de filmes é pintada em blocos pequenos via `requestAnimationFrame`, sem `setInterval` de alta frequência e sem bloquear a main thread.
- A âncora inicial permanece em Assistir a seguir / Watchlist, com apenas alinhamentos delimitados.

### Descobrir / Pra Você
- O owner r399 usa listener em `window` na fase de captura para vencer o handler legado r397 que interceptava a aba Pra Você antes da correção r398.
- `cinetracker_discover_foryou_v396` continua como payload canônico; fallback continua limitado.
- Visto, Watchlist e Trocar permanecem otimistas e protegidos por trava por slot.
- Nenhum full-page reload foi adicionado.

### Validação
- Novo gate estático falha se `MutationObserver`, `setInterval`, `window.location.reload()` ou `router.refresh()` reaparecerem no runtime r399.
- Novo gate Chromium mede reentrada da Home e falha se a RPC de Séries entrar em loop; também exige 7 cards e 18 ações em Pra Você.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.190 / r399-official-1.0.190.
- Build: `apps/web/build-r399.mjs`.
- Gate: `apps/web/build-r399-official.mjs`.

## 1.0.189 — 2026-09-29 — Web r398

### Home
- Corrige definitivamente a entrada: a Home aguarda o bloco principal existir e ancora em **Assistir a seguir** / **Assistir a seguir / Watchlist**, mantendo o Histórico acima para acesso por rolagem.
- Filmes passa a ter fallback direto em `cinetracker_watchlist_full_v376`; a lista não depende mais de o cache/loader r388 já estar preenchido para renderizar os 1.381 itens.
- A Watchlist de Filmes continua em paint delimitado por lotes, sem bloquear a main thread e sem full-page reload.
- Séries usa `cinetracker_home_series_v391` diretamente antes e depois do refresh de TV.
- Raw e SmackDown forçam `ct-refresh-tv-state-user` e reaplicam o payload v391, exibindo o episódio recente não visto no card de **Em dia**, sem caminhar por backlog histórico.

### Descobrir / Pra Você
- r398 assume renderer, estado e entrypoint do Pra Você sem depender do conjunto `validated` do r388, eliminando o deadlock que deixava os sete slots em **Buscando indicação…**.
- `cinetracker_discover_foryou_v396` continua como payload canônico; em falha, existe somente um fallback limitado às seis RPCs server-side.
- Indicação do Dia, Da sua Watchlist e 100% Novos são pintados no mesmo estado local.
- Botões: Diário/Fresh = Watchlist + Visto + Trocar; Watchlist = Visto + Trocar.
- Visto/Watchlist/Trocar são locais/otimistas, com trava síncrona por slot e sem reload.

### Escopo
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.
- Android permanece 1.0.20 / versionCode 10062.

### Release
- Web: 1.0.189 / r398-official-1.0.189.
- Commit/push: main.

# Changelog

## 1.0.188 — 2026-09-29 — Web r397

### Home
- Corrige a entrada da Home: o Histórico continua escondido acima, mas a posição inicial só é alinhada depois do bloco principal existir, evitando abrir no final do Histórico.
- Corrige Filmes > Assistir a seguir / Watchlist: os 1.381 itens já devolvidos pelo RPC v393 deixam de desaparecer quando um renderer legado falha; o paint passa a ser defensivo e em lotes delimitados.
- Mantém as seis ordenações da Watchlist de filmes sem full-page reload.
- Raw, SmackDown e outras séries recorrentes continuam classificadas em Em dia, mas exibem o próximo episódio lançado não visto e a ação de marcar como assistido.
- ct-refresh-tv-state-user v3 prioriza séries recorrentes, consulta a temporada atual e atualiza o catálogo recente em vez de caminhar pelas temporadas históricas antigas.

### Descobrir / Pra Você
- r397 assume também o entrypoint real após r395/r396 e rebinda os owners antigos que ainda podiam vencer depois do boot.
- cinetracker_discover_foryou_v396 continua como payload canônico; fallback é limitado às seis RPCs server-side já existentes.
- Um recovery delimitado observa apenas o estado preso sem cards e dispara o loader canônico; não existe loop ilimitado.
- Indicação do Dia, Da sua Watchlist e 100% Novos voltam a produzir cards com Visto, Watchlist e Trocar pelo renderer r388/Optimistic UI.
- Nenhum window.location.reload() ou router.refresh() foi introduzido.

### Backend / produção
- Edge Function ct-refresh-tv-state-user publicada como versão 3 no Supabase ativo.
- Escopo da r397 permanece Home + Descobrir/Pra Você; Perfil, Esportes, Top 10, Configurações e Android permanecem preservados.

### Validação
- Gate estático cobre identidade r397, renderer defensivo de Filmes, episódios recorrentes e ausência de reload/loop ilimitado.
- Gate Chromium reproduz a falha do renderer de Filmes, valida a âncora da Home, valida Raw com próximo episódio e exige sete cards + ações no Pra Você.
- Android permanece 1.0.20 / versionCode 10062.

### Release
- Web: 1.0.188 / r397-official-1.0.188.
- Commit/push: main.

## 1.0.187 — 2026-09-29 — Web r396

### Descobrir / Pra Você
- Remove do caminho crítico a sequência de RPCs + auditorias cliente que deixava os sete slots presos em `Buscando indicação…`.
- Adiciona `cinetracker_discover_foryou_v396`, que devolve em uma única chamada os três pools de Watchlist e os três pools de 100% Novos.
- Adiciona `cinetracker_discover_watch_unseen_v396`, filtrando no banco Watchlist já assistida, progresso de episódios e estados AlreadySeen/Completed/InProgress/UpToDate.
- `100% Novos` usa diretamente `cinetracker_discover_fresh_v387`, cuja própria SQL já elimina vistos e Watchlist; a auditoria redundante v391 deixa de bloquear o paint.
- `Indicação do Dia` é selecionada somente do Fresh já validado.
- r396 substitui apenas o loader do owner r388/r395; renderer, botões e Optimistic UI aprovados permanecem intactos.
- Timeout de 5 s termina em estado explícito de falha/vazio; não existe spinner infinito.
- Nenhum `window.location.reload()`, `router.refresh()`, loop ilimitado ou recursão foi introduzido.

### Backend / produção
- Migration `r396_discover_foryou_single_payload` aplicada no projeto Supabase ativo.
- Escopo SQL é `SECURITY INVOKER` padrão e mantém `auth.uid()` como autoridade do usuário.

### Validação
- Gate estático exige RPC único v396, barreira de Watchlist não vista, ausência de auditoria cliente no runtime r396 e identidade 1.0.187/r396.
- Gate Chromium exige exatamente uma chamada ao payload v396 e sete cards pintados, além de confirmar que o loader legado não executa.
- Gate r395 continua executado para preservar o owner de navegação; r394 continua preservado pela cadeia anterior.
- Android permanece 1.0.20 / versionCode 10062.

### Release
- Web: 1.0.187 / r396-official-1.0.187.
- Commit/push: main.


## 1.0.186 — 2026-09-29 — Web r395

### Escopo exclusivo: Descobrir / Pra Você
- Corrige os placeholders permanentes de Indicação do Dia, Da sua Watchlist e 100% novos.
- A navegação real de Pra Você passa a ter um único owner: r388.
- r321/r336 e os aliases legados de loader são reencaminhados antes de cada entrada no Descobrir, sem alterar as outras abas.
- Da sua Watchlist usa a autoridade `cinetracker_discover_watch_v391`.
- 100% novos usa `cinetracker_discover_fresh_v387` e auditoria estrita `cinetracker_discover_filter_v391`.
- Mantém filtros de vistos/watchlist, ações otimistas e ausência de full-page reload.
- Adiciona retry único e delimitado; se não existir candidato elegível, o skeleton termina em estado vazio explícito em vez de permanecer carregando.

### Evidência
- Logs reais da sessão de 2026-09-29 mostraram chamadas a `cinetracker_watchlist_full_v119`, `cinetracker_shown_recommendations_recent_v296`, `cinetracker_shown_recommendations_record_v296` e `cinetracker_discover_filter_v333`.
- No mesmo fluxo não houve chamadas às autoridades r388 esperadas (`discover_watch_v391`, `discover_fresh_v387`, `discover_filter_v391`), confirmando que o entrypoint legado ainda vencia em produção.

### Validação
- Gate estático valida owner r395, fontes v391/v387, ausência de v333 no novo runtime, ausência de reload e ausência de loop ilimitado.
- Gate Chromium exercita os entrypoints r321/r336/render real e falha se o loader legado de Pra Você for chamado.
- O gate r394 da Home continua no release oficial para garantir que a correção de Descobrir não regrida a Home.

### Não alterado
- Home, Perfil, Esportes, Top 10, Configurações e Android.

### Release
- Web: 1.0.186 / r395-official-1.0.186.
- Android: 1.0.20 / versionCode 10062 preservado.


## 1.0.185 — 2026-09-29 — Web r394

### Escopo exclusivo: Home + Descobrir / Pra Você
- Corrige a regressão reproduzida no vídeo em que a Home abria no topo do Histórico e, após o Histórico assíncrono crescer, `Assistir a seguir` era empurrado várias telas para baixo.
- A âncora da Home agora é reaplicada depois da conclusão do carregamento crítico de Séries + Histórico, preservando o Histórico acima da posição inicial e o acesso por scroll para cima.
- Reaproveita o cache válido da sessão no primeiro paint da Home e continua reconciliando com as autoridades atuais em background, sem reload.
- Corrige a dupla autoridade do Pra Você: a navegação real ainda passava por `__ctR382LoadForYou`/r321, enquanto o renderer já era r388. Isso deixava os placeholders permanentes porque loader e renderer escreviam estados diferentes.
- Todos os entrypoints legados de Pra Você passam a apontar para o loader r388. A tela real volta a chamar `cinetracker_discover_watch_v391`, `cinetracker_discover_fresh_v387` e `cinetracker_discover_filter_v391`.
- Mantida a exclusão estrita de Vistos/Watchlist em 100% Novos e as ações otimistas sem full-page reload.

### Evidência da regressão
- Nos logs da gravação r393, o fluxo quebrado chamou `cinetracker_discover_filter_v333` e não chamou as RPCs v391/v387 esperadas pelo owner atual.
- O novo gate Chromium valida o entrypoint r321/r382 real, não apenas a chamada direta de `window.__ctR388.loadForYou`, e reproduz Histórico alto antes do bloco principal.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.185 / r394-official-1.0.185.
- Android: 1.0.20 / versionCode 10062 preservado.


## 1.0.184 — 2026-09-28 — Web r393

### Escopo exclusivo: Home + Descobrir / Pra Você
- Home volta a iniciar no primeiro bloco principal, mantendo o Histórico renderizado acima da posição inicial e acessível ao rolar para cima.
- A âncora da Home é reaplicada durante os repaints assíncronos do Histórico e no alternar Séries/Filmes; interação manual de scroll cancela reposicionamentos posteriores.
- A Watchlist de Filmes deixa de baixar o payload completo de filmes+séries do v376 como caminho principal. O novo `cinetracker_home_movies_v393` retorna somente filmes e os campos necessários para a Home.
- No estado atual validado, o payload da Watchlist caiu de aproximadamente 2,87 MB / 1.961 registros para aproximadamente 399 KB / 1.381 filmes, preservando a contagem atual da Home.
- Filmes passam a ser pré-carregados em segundo plano depois do carregamento crítico de Séries/Histórico; v376 permanece somente como fallback compatível.
- Pra Você volta a preencher 100% Novos pelo `cinetracker_discover_fresh_v387` antes do fallback TMDB, com auditoria `cinetracker_discover_filter_v391` e limites de tempo maiores para rede móvel.
- A auditoria inicial de cache foi reduzida aos cards correntes; pools grandes deixam de bloquear a tela inteira antes do primeiro paint útil.
- Da sua Watchlist e 100% Novos carregam em paralelo por tipo e os slots são atualizados progressivamente.
- Mantidas as ações sem full-page reload, os locks de interação e a exclusão estrita de vistos/Watchlist.

### Banco
- Migration `20260929002751_home_movies_v393_lightweight` aplicada e registrada no Supabase.
- RPC novo usa `security invoker`, `auth.uid()` e retorna somente a Watchlist de filmes do usuário autenticado.

### Validação
- Gate estático exige âncora r393, RPC leve de Filmes, Pra Você DB-first e ausência de `window.location.reload()` / `router.refresh()`.
- Gate Chromium preserva regressões r392, exige o caminho `cinetracker_home_movies_v393`, valida 1.382 itens mockados no cenário de regressão, confirma Histórico acima da viewport e Pra Você preenchido pelo caminho DB-first.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.184 / r393-official-1.0.184.
- Android: 1.0.20 / versionCode 10062 preservado.

## 1.0.183 — 2026-09-28 — Web r392

### Escopo exclusivo: Home + Descobrir / Pra Você
- Remove da Home a combinação entre cinetracker_home_active_v380 e a autoridade v391. Duplicatas antigas não conseguem mais preencher next_episode_* nulo de uma série já atualizada e ressuscitar um card em Continuar.
- O renderer de séries deixa de chamar ct276EpisodeCard; os metadados autoritativos do episódio são renderizados diretamente no mesmo paint, eliminando Atualizando episódios... / Sincronizando estado atual persistentes.
- Ações de episódio/filme assistido ganham owner r392 com UI otimista, lock síncrono por item e persistência cinetracker_mark_watch_v0994, sem reload global.
- cinetracker:data-changed invalida memória e caches da Home em qualquer rota. Marcar no detalhe e voltar para a Home força uma leitura nova; resultados de requests antigos são descartados por geração.
- Stuart/TMDB 287620 foi validado no banco após o vídeo: T1E10 existe em episode_progress/watch_history, e a autoridade v391 retorna up_to_date, 10/10 e zero episódios disponíveis.
- Histórico de episódios e filmes sobe para 100 itens recentes por bloco e deixa de concorrer, no primeiro paint de Séries, com o fetch completo da Watchlist de Filmes.
- A Watchlist de Filmes só é carregada ao abrir a semi-aba Filmes; mantém lista completa e ordenações existentes.
- Pra Você audita pools persistidos em um único lote antes de exibir cards e reutiliza itens já validados; Fresh continua com TMDB bounded e auditoria pessoal fail-closed.
- Nenhum window.location.reload(), router.refresh() ou loop infinito foi adicionado.
- O build de hospedagem usa `build-r392.mjs`; o gate Chromium continua obrigatório no GitHub Actions via `build-r392-official.mjs`, evitando falha de deploy por ausência de browser no builder da Vercel.

### Validação
- Gate Chromium reproduz mutação feita fora da Home: invalida cache, refaz a Home, exige Stuart fora de Continuar, presente em Em dia e T1E10 no Histórico.
- Gate injeta um renderer legado que só devolve loading e exige que ele não seja usado pela Home r392.
- Gate preserva 1.382 filmes, seis sorts, exclusão de Harry/Azkaban visto e ações 3/2/3 do Pra Você.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.183 / r392-official-1.0.183.
- Android: 1.0.20 / versionCode 10062 preservado.
## 1.0.182 — 2026-09-28 — Web r391

### Escopo exclusivo: Home + Descobrir / Pra Você
- Remove o enriquecimento TMDB bloqueante do primeiro paint da Home. A lista ativa v380 aparece imediatamente e a autoridade completa v391 (~415 ms no conjunto real) corrige/completa o estado sem esperar chamadas por card.
- Corrige a fusão que fazia o bucket rápido `continue` sobrescrever `dust`. No conjunto real, a autoridade v391 retorna 2 em Continuar e 20 em Juntando poeira, em vez de concentrar tudo no mesmo bloco.
- Stuart/TMDB 287620 já sai no payload local como T1E10, com título, data e nota; o catálogo recebeu o episódio atual e o refresh TMDB fica apenas em background.
- Histórico v391 foi reescrito para trabalhar somente sobre eventos recentes já indexados e caiu de ~8 s para ~125 ms no banco real.
- Filmes preservam a Watchlist completa v376 e as seis ordenações existentes.
- Pra Você deixa de consultar qualquer RPC de Fresh que varra a biblioteca. Filme/Série/Anime vêm de lotes TMDB limitados e passam pela auditoria pessoal v391.
- A auditoria v391 une TMDB exato e aliases importados do mesmo título/ano. Harry Potter/Azkaban (movie:673) é bloqueado mesmo quando o registro visto está em um ID importado diferente.
- Botões permanecem: Indicação/Fresh = Watchlist + Visto + Trocar; Da sua Watchlist = Visto + Trocar. Coração continua contido na capa.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: `1.0.182 / r391-official-1.0.182`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.181 — 2026-09-28 — Web r390

### Escopo exclusivo: Home + Descobrir / Pra Você
- Home Séries passa a usar `cinetracker_home_active_v380` como primeiro fetch (medido em ~0,17 s no banco), deduplica títulos pelo TMDB e combina linhas duplicadas antes do primeiro paint.
- Séries ativas são enriquecidas em paralelo com timeout curto antes de aparecerem; a RPC completa `cinetracker_home_series_v389` fica em background e não deve alterar tardiamente a composição de Continuar assistindo.
- Stuart duplicado em português/inglês é consolidado no mesmo item lógico, preservando o título localizado e o ponteiro/metadados de episódio mais completo.
- Filmes preservam a Watchlist completa v376. O gate usa 1.382 registros e testa as seis ordenações.
- Pra Você mantém o caminho rápido `fresh_v387 + filter_v389` (medido em ~0,76 s para 24 filmes). A RPC `fresh_v389` de ~26 s fica fora do runtime.
- Auditoria r389 cruza TMDB + título localizado/original + ano. Harry Potter/Azkaban TMDB 673 retorna em `seen_keys`/`blocked_keys` e é caso obrigatório do gate.
- Botões permanecem 3/2/3 e o coração precisa ficar integralmente dentro da capa.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android não foram modificados.

### Release
- Web: `1.0.181 / r390-official-1.0.181`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.179 — 2026-09-28 — Web r388

### Escopo exclusivo: Home + Descobrir / Pra Você
- Home Séries passa a combinar o estado autoritativo v385 com o conjunto ativo v380 antes do primeiro paint estável.
- Próximos episódios visíveis/ativos são enriquecidos em paralelo pelo TMDB com timeout curto; isso evita nomes/datas/notas chegando dezenas de segundos depois e permite que séries ativas como Stuart entrem no primeiro conjunto quando existe episódio novo.
- Home Filmes usa a Watchlist completa v376 e monta todos os registros de uma vez. O total atual autoritativo é 1.381 e as seis ordenações atuam sobre todos os nós.
- Pra Você deixa de depender das action rows/observers antigos. O r388 renderiza Indicação do Dia, Da sua Watchlist e 100% novos diretamente.
- 100% novos é auditado pelo filtro pessoal v385 antes do render e antes de cada troca; Vistos/Watchlist não aparecem.
- Botões: Diário e 100% Novos = Watchlist + Visto + Trocar; Da sua Watchlist = Visto + Trocar. Botões só existem quando existe card real.
- Coração/favorito fica contido dentro da capa.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android não foram modificados.

### Release
- Web: `1.0.179 / r388-official-1.0.179`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.178 — 2026-09-28 — Web r387

### Home — somente correções solicitadas
- Séries e Filmes voltam a abrir no primeiro bloco principal: `Assistir a seguir` / `Assistir a seguir / Watchlist`.
- Histórico continua fisicamente acima da posição inicial e só aparece ao rolar para cima.
- O alinhamento é reafirmado durante os repaints iniciais, mas é cancelado assim que o usuário começa a rolar manualmente.
- Novo `cinetracker_home_history_v387` remove o teto de 50/100 itens e consolida o histórico completo por mídia lógica.
- A Watchlist de Filmes, filtros e demais regras da Home r385/r386 são preservados.

### Descobrir / Pra Você — somente correções solicitadas
- Antes de montar a linha final, qualquer action-row legado direto do slot é removido; fica uma única `.ct385-actions`.
- A linha usa Flexbox nowrap e sincroniza sua largura com a largura real da capa.
- Novo `cinetracker_discover_fresh_v387` fornece fallback local estrito já excluindo Vistos/Watchlist; TMDB continua como fallback bounded adicional.
- O carregamento tenta novamente Fresh de forma limitada antes de aceitar estado parcial.
- Nenhum outro bloco do Descobrir foi alterado.

### Validação
- Browser gate exige Histórico de Filmes com 130 itens completos e item posterior ao Pokémon presente.
- Séries e Filmes precisam iniciar no bloco principal com o histórico acima do viewport.
- Fresh começa vazio e precisa preencher Filme/Série/Anime pelo fallback.
- O teste injeta action-rows legados e mede os botões: apenas uma linha pode sobreviver, sem sobreposição e sem exceder a largura da capa.

### Escopo congelado
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.
- Web: `1.0.178 / r387-official-1.0.178`.
- Android: `1.0.20 / versionCode 10062`.

## 1.0.177 — 2026-09-28 — Web r386

### Home + Descobrir / Pra Você
- Mantém integralmente o owner r385 já validado para Home e Pra Você; nenhuma outra área funcional é alterada.
- Corrige o cenário comprovado no vídeo em que o navegador permanecia em Web 1.0.174 / r383 mesmo após a produção estar em r385.
- `/`, `/home`, `/discover` e `/index.html` passam a responder com `no-cache, no-store, must-revalidate`.
- Ao entrar em Home ou Descobrir, o cliente consulta `release.json` sem cache e solicita atualização do Service Worker.
- Depois que r386 estiver carregada uma vez, futuras divergências de versão nessas duas áreas acionam reload único para evitar continuar executando bundle antigo.

### Validação
- O gate completo da r385 é executado novamente sem mudanças: Stuart/metadata da Home, 1.382 filmes + seis filtros, remoção do filtro duplicado no Pra Você, três ações corretas e exclusão do Harry Potter visto.
- Profile, Esportes, Top 10, Settings e Android permanecem fora do escopo.

## 1.0.176 — 2026-09-28 — Web r385

### Home — correção isolada
- Remove a autoridade r384 da Home. Séries, Histórico e Filmes passam a carregar em paralelo e atualizar somente o próprio bloco.
- Novo `cinetracker_home_series_v385` consolida duplicatas por TMDB, cruza todo o histórico/progresso do título e devolve bucket + próximo episódio + nome + nota + data + disponíveis na primeira resposta.
- Séries esportivas de longa duração (Raw/SmackDown/F1/UFC) só entram em Continuar se houver episódio recente não visto; backlog antigo não volta a inflar Assistir a seguir.
- Cache r384 não é reutilizado. O novo cache r385 é curto e sempre recebe refresh de rede.
- Novo `cinetracker_home_history_v385` carrega Histórico em paralelo, sem depender do payload monolítico.
- Filmes usam diretamente a Watchlist completa v376 desde a entrada na Home, sem depender do clique em Filmes. O único contador é o total real e os seis sorts continuam locais.

### Descobrir / Pra Você — correção isolada
- Novo filtro `cinetracker_discover_filter_v385` cruza TMDB + títulos localizado/original + histórico/progresso/overrides.
- Auditoria Fresh é fail-closed: se a validação falhar, o card não é liberado como 100% novo.
- `100% Novos` exige nota >= 7,5, ano > 1990, pôster, categoria correta e ausência em Visto/Watchlist.
- Harry Potter/Azkaban marcado em registro legado é caso de regressão obrigatório.
- Linha final de ações usa somente `.ct385-actions`: Diário/Fresh = Watchlist, Visto, Trocar; Watchlist = Visto, Trocar.
- Filtro duplicado dentro de Pra Você é removido; filtro global externo é preservado; coração fica dentro da capa.

### Escopo congelado
- Nenhuma alteração em Perfil, Esportes, Top 10, Configurações ou Android.
- Web: `1.0.176 / r385-official-1.0.176`.
- Android preservado em `1.0.20 / versionCode 10062`.

## 1.0.175 — 2026-09-27 — Web r384

### Home
- A abertura de Séries deixa de disparar simultaneamente Séries, payload completo e Watchlist de filmes.
- Primeiro paint usa apenas `cinetracker_home_series_v383` e `cinetracker_home_active_v380` com live patch limitado, evitando o congestionamento observado no celular.
- O cache de Séries passa a persistir entre reloads; quando existe, a Home pinta imediatamente.
- Stuart e metadados do próximo episódio entram no mesmo ciclo inicial de até poucos segundos, não por um repaint tardio de dezenas de segundos.
- A Watchlist completa de Filmes (1.382 no cenário atual) só é carregada ao entrar em Filmes; o contador legado de 240 é removido e o filtro nativo de seis opções permanece sob o owner r376.

### Descobrir / Pra Você
- O filtro duplicado dentro de Pra Você é removido; o filtro global ao lado da busca é preservado.
- Todo card de `100% Novos` é validado individualmente por `cinetracker_media_state_v1` antes de ser exibido.
- Visto, Watchlist e Favorito são exclusões obrigatórias no Fresh; aliases/títulos alternativos como o caso Harry Potter são bloqueados.
- Indicação do Dia e 100% Novos recebem fallback limitado quando o pool está vazio.
- Botões ficam fixos em 3/2/3 (Diário/Watchlist/Fresh), exatamente na largura do card; coração fica totalmente dentro da capa.
- Trocar usa lock por slot e valida o próximo Fresh antes de renderizar.

### Escopo
- Somente Home e Descobrir/Pra Você.
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

## 1.0.174 — 2026-09-26 — Web r383

### Home — somente Home
- Novo primeiro paint `cinetracker_home_series_v383`: busca apenas as séries relevantes e já devolve episódio, nome, nota, data, contagens e bucket antes de pintar.
- Stuart e outras séries ativas entram na mesma resposta inicial; o payload completo v382 roda apenas em background e é salvo para a próxima navegação, sem repintar a tela atual dezenas de segundos depois.
- Reconciliadores tardios r332 ficam desativados enquanto a r383 é a autoridade da Home.
- Filmes continua usando a Watchlist completa v376; o contador legado 240 é removido antes da hidratação e a lista completa é reaplicada ao entrar em Filmes.
- A ordenação da Watchlist continua no owner v376 sobre os nós completos.

### Descobrir / Pra Você — somente Descobrir
- Remove o filtro duplicado que r328 inseria abaixo da aba Pra você.
- A faixa final de ações deixa de reutilizar `.ct336-actions`; usa `.ct383-actions`, fora do alcance dos writers antigos.
- Contrato fixo: Indicação do Dia = Watchlist/Visto/Trocar; Da sua Watchlist = Visto/Trocar; 100% Novos = Watchlist/Visto/Trocar.
- Cada Fresh passa pela auditoria v381 e por uma validação final `cinetracker_media_state_v1` antes de aparecer. Item visto, em Watchlist ou favorito é rejeitado.
- Fresh Filme/Série/Anime é preenchido em paralelo com fallback TMDB limitado e sem loop bloqueante.
- Coração fica integralmente dentro da capa.

### Escopo preservado
- Perfil, Configurações, animações e Esportes não são alterados.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.173 — 2026-09-26 — Web r382

### Rollback estrutural
- A build volta a partir da r376 para retirar completamente os renderers substitutos r380/r381 de Home e Perfil.
- Perfil volta ao renderer aprovado r313/r316; apenas a fonte de dados muda para `cinetracker_profile_v380`, com cache-first, sem mudar seções, ordem ou estatísticas.

### Home
- O renderer original volta a ser a única autoridade de composição: Histórico, Continuar assistindo, Assistir a seguir, Em dia e demais buckets não são remontados por runtime novo.
- Novo `cinetracker_home_payload_v382` parte do v359 e injeta apenas metadados ativos no primeiro payload (episódio, nota, data, contagens), preservando `home_bucket` do v359.
- Séries ativas ausentes no v359 podem ser acrescentadas com o bucket derivado da própria autoridade ativa, evitando aparição tardia.
- Filmes mantém a Watchlist completa v376; o contador legado de 240 é removido do header, deixando apenas o total real.

### Descobrir / Pra Você
- `100% Novos` é auditado obrigatoriamente por `cinetracker_discover_filter_v381`, incluindo aliases/título original; itens vistos ou em Watchlist são removidos antes do paint.
- Ações finais são exatamente 3/2/3: Diário e 100% Novos = Watchlist, Visto, Trocar; Da sua Watchlist = Visto, Trocar.
- O botão Trocar usa pool finito, lock por slot e refill sem loop bloqueante; o evento é interceptado antes do clique do card.
- Coração fica integralmente dentro da capa.

### Release
- Web: `1.0.173 / r382-official-1.0.173`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.172 — 2026-09-25 — Web r381

### Home restaurada
- Remove `home_active_v380` como autoridade parcial do primeiro paint. A composição, buckets e históricos voltam a vir do payload completo `cinetracker_home_payload_v359`.
- Snapshots parciais r380 são ignorados; o cache r381 aceita somente Home completa.
- No primeiro carregamento de rede, v359 e uma atualização curta dos episódios ativos rodam em paralelo. Séries com catálogo local atrasado, como Stuart, recebem o episódio liberado antes do primeiro paint quando o TMDB responde dentro do orçamento.
- Histórico de séries e filmes volta a fazer parte do payload inicial e permanece acima do ponto semântico da Home.
- Repaints/reconciliações tardios r332 são cancelados; a composição não deve ganhar séries dezenas de segundos depois.

### Perfil
- Mantém o RPC rápido `cinetracker_profile_v380`, medido abaixo de 1 s na biblioteca atual.
- Remove o HTML próprio das r379/r380 e restaura a estrutura original: Estatísticas, Séries, Filmes, Séries Favoritas, Filmes Favoritos, Atores Favoritos, Episódios por dia e Biblioteca.
- O produtor r238 volta a controlar o grid expandível de Estatísticas. A Watchlist completa v376 continua sincronizando os números, incluindo 1.382 filmes.

### Descobrir / Pra Você
- Novo filtro `cinetracker_discover_filter_v381` bloqueia candidatos somente por evidência do usuário, mas cruza TMDB, título localizado e título original. Harry Potter 673 é bloqueado pelo histórico legado em inglês.
- Auditoria é obrigatória: erro de auditoria não libera Fresh sem validação.
- A linha final de botões usa classe isolada `ct381-actions`; writers antigos não conseguem remover `Trocar`.
- Contrato obrigatório e visível em mobile: Daily 3 botões, Watchlist 2, Fresh 3, todos dentro da largura do card.
- Coração fica inteiramente dentro da capa.

### Release
- Web: `1.0.172 / r381-official-1.0.172`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.171 — 2026-09-25 — Web r380

### Home / Séries
- Primeiro paint deixa de aguardar o payload monolítico: usa snapshot existente e o RPC enxuto `cinetracker_home_active_v380` para atualizar imediatamente séries `InProgress/UpToDate`.
- Séries ativas ausentes do snapshot, como Stuart, entram no mesmo ciclo inicial; não existe recomposição de bucket dezenas de segundos depois.
- Metadados visíveis continuam hidratados em paralelo com orçamento curto, sem bloquear a Home.
- A aba selecionada e o ponto semântico da r375 continuam preservados.

### Home / Filmes
- A Watchlist completa da r376 é reaplicada depois de cada paint da Home.
- Remove o contador-base truncado `240`; o cabeçalho mantém apenas o total completo (1.382 no estado atual).
- O `select` de ordenação é religado ao owner da Watchlist e reorganiza os mesmos nós DOM.

### Descobrir / Pra Você
- Remove definitivamente o filtro duplicado abaixo da aba `Pra você`.
- Daily/Fresh = `Watchlist + Visto + Trocar`; Watchlist = `Visto + Trocar`, sempre dentro da largura do card.
- Novo `cinetracker_discover_filter_v380` cruza TMDB ID, título localizado e título original. Isso bloqueia o caso comprovado de Harry Potter/Azkaban salvo no histórico em inglês e recebido pelo TMDB em português.
- Fresh é auditado antes do render e o fallback TMDB também passa pela auditoria v380.

### Perfil
- O Perfil deixa de chamar o dashboard monolítico e usa um único `cinetracker_profile_v380` direto sobre tabelas indexadas.
- Na medição com a biblioteca atual, o RPC retornou o total de 1.382 filmes em Watchlist sem o timeout que derrubava a página.
- Cache local continua disponível como primeiro paint/fallback.

### Desempenho / Top 10 e favoritos
- Corações usam `cinetracker_favorites_v380`, sem montar o dashboard do Perfil.
- Lista de streamings fica em cache local por 24 h; Top 10 por provedor fica em cache por 15 min e os primeiros provedores são pré-carregados em segundo plano.
- Coração fica inteiramente dentro do card/pôster também no Top 10.

### Release
- Web: `1.0.171 / r380-official-1.0.171`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.170 — 2026-09-25 — Web r379

### Home / Séries
- r379 assume a autoridade da Home e desativa os reparos automáticos tardios da r332; a composição exibida não recebe novas séries dezenas de segundos depois.
- O refresh em background é salvo como snapshot para a próxima navegação, sem repintar a tela atual.
- O snapshot da Home é persistido em sessionStorage para retorno instantâneo.
- Metadados dos episódios visíveis são hidratados imediatamente com limite de 3,5 s, sem aguardar o antigo ciclo tardio.

### Descobrir / Pra Você
- O filtro pessoal passa a usar `cinetracker_discover_filter_v322` (indexado).
- Nenhum card de 100% Novos é renderizado antes da auditoria pessoal.
- Regressão obrigatória: `movie:673` (Harry Potter e o Prisioneiro de Azkaban) marcado como visto deve ser removido do Fresh antes do render.

### Perfil
- Novo RPC `cinetracker_profile_fast_v379`: materializa o dashboard uma única vez e deriva estatísticas, estados e contagens sem recalcular o dashboard em funções aninhadas.
- Perfil usa cache de sessão no primeiro paint e atualiza pelo RPC rápido; falha de atualização não derruba uma tela já válida.
- Fonte da Watchlist do Perfil passa para `cinetracker_watchlist_full_v376`.

### Release
- Web: `1.0.170 / r379-official-1.0.170`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.170 — 2026-09-25 — Web r379

### Home Séries
- Persiste o payload v359 (~167 KB) em armazenamento local e usa snapshot no primeiro paint, evitando skeleton longo nas aberturas seguintes.
- Desativa os repaints tardios r325/r332 que alteravam buckets e faziam séries como Stuart aparecerem depois.
- O payload v359 vira a autoridade de composição da lista; enriquecimento TMDB posterior só completa nome/nota/data do episódio, sem mover a série entre seções.
- O alinhamento semântico Séries/Filmes da r375 continua obrigatório após cada paint.

### Descobrir / Pra Você
- Novo filtro `cinetracker_discover_filter_v379`: `100% Novos` bloqueia qualquer mídia já conhecida pela biblioteca pessoal, inclusive `Liked`, além de Visto e Watchlist.
- Todo lote de fallback TMDB é validado no servidor antes de entrar no pool.
- Filme/Série/Anime Fresh são reabastecidos em paralelo com nota mínima 7.5 e filtros de ano/WWE.
- Contrato visual reimposto depois de cada render/troca: Daily/Fresh = Watchlist + Visto + Trocar; Watchlist = Visto + Trocar.
- Troca continua local por slot e usa apenas candidatos Fresh previamente validados.

### Perfil
- Primeiro paint usa `cinetracker_profile_quick_stats_v1` (~150 ms na medição atual).
- Biblioteca/favoritos/atividade entram depois pelo novo `cinetracker_profile_landing_v379` (~1,9 s medido), sem poder substituir o Perfil por erro vermelho.
- Snapshot do Perfil é persistido para reaberturas instantâneas.

### Detalhe
- Remove falso positivo que tratava o texto “Marcar como visto” como evidência de item assistido; estado de Visto passa a exigir estado explícito.

### Release
- Web: `1.0.170 / r379-official-1.0.170`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.169 — 2026-09-25 — Web r378

### Rollback de regressões da r377
- Restaura `cinetracker_home_payload_v359`, removendo a troca regressiva para v334.
- A Home mantém um snapshot em memória entre rotas: ao voltar de Descobrir/Esportes/Detalhe, pinta imediatamente o conteúdo anterior e atualiza em background, sem ficar presa no loader.
- Após qualquer repaint, reaplica a aba escolhida pelo usuário e o início semântico da r375: `Assistir a seguir` em Séries e `Assistir a seguir / Watchlist` em Filmes, com Histórico preservado acima.

### Descobrir / Pra Você
- Remove a autoridade interativa da r377.
- O r321 delega diretamente ao owner r378; o startup r376 não disputa mais o mesmo DOM.
- O r378 usa classes e handlers próprios (`ct378-*`), fora do alcance dos writers antigos `ct336-actions`.
- Slots vazios exibem placeholder sem botões; botões só existem quando há card real.
- `100% novos` preenche Filme/Série/Anime em paralelo com filtro pessoal e fallback TMDB limitado.
- Visto/Watchlist são otimistas e locais; Trocar altera somente o slot clicado e usa lock por slot, sem loop bloqueante.

### Validação
- Gate exige retorno da Home por snapshot em menos de 500 ms, sem loader e com alinhamento semântico.
- Gate rejeita qualquer `.ct336-actions` dentro do novo Pra Você.
- Fresh precisa ter três cards reais e três botões por card; Watchlist precisa ter exatamente dois.
- Oito trocas seguidas na mesma recomendação não podem navegar para o card nem quebrar os botões.

### Release
- Web: `1.0.169 / r378-official-1.0.169`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.168 — 2026-09-25 — Web r377

### Home / Watchlist
- O filtro customizado é substituído por um `select` nativo compacto sobre o ícone ⇅; pointer/click não atravessa mais para os cards.
- Os 1.382 registros continuam presentes por `media_id`, mas os cards voltam ao renderer rico `ct274Row/ct274MovieMeta`: ano, duração, gêneros e nota.
- Cards sem metadados completos são enriquecidos sob demanda quando entram perto do viewport, com cache por TMDB.
- Ordenar muda apenas a propriedade `order` dos mesmos nós DOM; não recria nem redimensiona os cards.
- O retorno para a Home deixa de usar `cinetracker_profile_home_payload_v0997_r6` e usa `cinetracker_home_payload_v334`; se o refresh falhar, a Home em cache é mantida em vez de ser substituída por erro vermelho.

### Descobrir / Pra Você
- Um `Pra Você` válido permanece visível enquanto atualiza; o loader não apaga mais os cards existentes.
- Os três pools de `100% Novos` são preenchidos em paralelo.
- Ações têm área física de 34 px e captura de pointer/click antes da navegação do card.
- A r377 assume a abertura da aba Pra Você: pinta estado disponível imediatamente e atualiza/refaz Fresh em background.

### Validação
- Browser gate usa 1.382 linhas e exige metadados ricos, seis ordens sem navegação/rebuild e altura preservada.
- Um listener hostil de navegação é instalado no teste: tocar no filtro e nos botões do Pra Você não pode alcançá-lo.
- Os três slots 100% Novos precisam ficar preenchidos e três trocas sucessivas não podem quebrar botões nem mudar de rota.

### Release
- Web: `1.0.168 / r377-official-1.0.168`.
- Android: `1.0.20 / versionCode 10062` preservado.

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.166 — 2026-09-25 — Web r375\n\n### Home / início correto após trocar Séries ↔ Filmes\n- Corrige a regressão visual mostrada em vídeo: `scrollTop = 0` revelava o Histórico que fica propositalmente acima da tela inicial.\n- A troca de aba agora procura semanticamente o primeiro bloco não histórico: `Assistir a seguir` em Séries e `Assistir a seguir / Watchlist` em Filmes.\n- O bloco principal é alinhado logo abaixo do toggle Séries/Filmes, tanto para scroll da janela quanto para container interno.\n- `Histórico recente` e `Filmes vistos` continuam acima do viewport inicial e permanecem acessíveis rolando para cima.\n- Os anchors legados continuam bloqueados durante a troca para não disputar a posição.\n\n### Validação\n- Browser gate parte do rodapé, alterna Séries → Filmes e Filmes → Séries, confirmando que o bloco principal fica alinhado e que o Histórico permanece fora da tela acima.\n- O teste também exige `scrollTop > 500`, garantindo explicitamente que a implementação não voltou ao zero absoluto.\n\n### Release\n- Web: `1.0.166 / r375-official-1.0.166`.\n- Android: `1.0.20 / versionCode 10062` preservado.\n\n## 1.0.165 — 2026-09-25 — Web r374

### Home / troca Séries ↔ Filmes
- A troca de semi-aba agora zera imediatamente a rolagem da janela e de qualquer ancestral/container interno scrollável da Home.
- O clique é capturado antes dos antigos handlers de anchor (`r327/r328/r331/r332/r335`), impedindo que eles restaurem uma posição antiga ou mantenham a tela no fundo.
- A seleção da aba continua delegada ao owner r371; a r374 assume somente o comportamento de scroll.
- O reset é reafirmado de forma limitada durante a estabilização do layout e é cancelado assim que o usuário inicia uma nova rolagem manual.

### Validação
- Browser gate começa no fundo da aba Séries, troca para Filmes e confirma `window.scrollY = 0` e `scrollTop = 0` no container interno.
- Repete do fundo de Filmes para Séries e confirma o mesmo resultado.
- Um listener legado propositalmente hostil é instalado no teste e confirmado como bloqueado pelo novo owner.

### Release
- Web: `1.0.165 / r374-official-1.0.165`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.164 — 2026-09-25 — Web r373

### Home / Assistir a seguir / Watchlist
- A Home deixa de depender do subconjunto limitado do payload de Home para a Watchlist de filmes e passa a usar `cinetracker_watchlist_full_v119`, cuja consulta não aplica `LIMIT` aos títulos.
- O contador no cabeçalho usa a coleção completa carregada e exibe o total real, inclusive acima de 120.
- O DOM renderiza 80 itens por vez e oferece `Mostrar mais`, mantendo a busca/contagem completas sem montar centenas de nós de uma vez.

### Mini-filtro de ordenação
- Adiciona um botão compacto `⇅` imediatamente ao lado do contador, com popover local e seis opções:
  - Por último adicionado (`added_at` desc, padrão)
  - Primeiro adicionado (`added_at` asc)
  - Último lançado (`release_date`/`first_air_date` desc)
  - Primeiro lançado (`release_date`/`first_air_date` asc)
  - A-Z
  - Z-A
- A ordenação acontece instantaneamente em memória, sem reload, navegação ou nova consulta ao banco.

### Validação
- Browser gate usa 155 itens, confirma contador `155`, paginação DOM inicial de 80, as seis ordenações e URL inalterada.

### Release
- Web: `1.0.164 / r373-official-1.0.164`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.163 — 2026-09-25 — Web r372

### Descobrir / Pra você — layout
- O rodapé de ações passa a ter uma única geometria final em Flexbox (`row`, `nowrap`, `gap: 8px`) com altura fixa de 32 px.
- Botões de ação não encolhem, não quebram linha e não podem ficar ocultos após re-render do card.
- Coração/favorito e controle flutuante do pôster ficam absolutos, 36×36, `z-index: 10` e fundo translúcido com blur.
- O writer geométrico legado da r348 é retirado da build final para não voltar a sobrepor/recolher botões.

### 100% Novos — filtro pessoal estrito
- Antes de renderizar cada `fresh:*`, cruza o pool com a autoridade pessoal canônica da r319.
- Qualquer ID presente em `seen` ou `watch` é removido do estado antes do card ficar visível.
- Se um tipo ficar sem candidato elegível, busca um único novo lote TMDB e filtra novamente antes do render.
- Marcar Visto/Watchlist atualiza imediatamente a autoridade local, impedindo que o mesmo item reapareça no próximo card.

### Validação
- Browser gate injeta itens Vistos e Watchlist nos três pools `fresh:*` e confirma que nenhum sobrevive.
- Executa 15 re-renders dos cards e valida três botões visíveis, Flexbox nowrap e controles flutuantes 36×36/z10 em todas as passagens.

### Release
- Web: `1.0.163 / r372-official-1.0.163`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.162 — 2026-09-25 — Web r371

### Home / Séries e Filmes
- A aba ativa passa a ter uma autoridade própria (`tabRef`) e só muda por clique explícito do usuário.
- `paintHome`, `ct275PaintHome`, `ct274PaintHome` e `renderHome` podem atualizar dados, mas a seleção do usuário é reaplicada imediatamente após cada repaint.
- Clicar em Séries/Filmes aborta o ciclo anterior com `AbortController`, incrementa uma geração lógica e invalida o `episodeRun` assíncrono da r332.
- Respostas tardias de reconciliação de episódios não podem mais devolver a Home para Séries depois que o usuário escolheu Filmes.
- O estado visual do botão, `aria-selected`, `hidden` e classe `hidden` são sincronizados pela mesma autoridade.

### Validação
- Browser gate seleciona Filmes, executa 10 repaints forçados que recriam o DOM com Séries como padrão e valida que Filmes continua ativo.
- Em seguida conclui um `renderHome()` assíncrono tardio e confirma novamente que a aba permanece em Filmes.

### Release
- Web: `1.0.162 / r371-official-1.0.162`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.161 — 2026-09-25 — Web r370

### Descobrir / Pra você
- Substitui o algoritmo de troca por **pré-filtro único em memória**: `candidatePool.filter(...)` seguido de `Math.floor(Math.random() * eligibleItems.length)`.
- Remove qualquer `while`, `do...while` e recursão da autoridade final `handleSwap`.
- Se o array elegível estiver vazio, faz **uma única** busca assíncrona de lote e filtra novamente uma vez; não existe retry recursivo.
- Adota trava síncrona física `swapLockRef.current`, equivalente a `useRef`, antes do primeiro `await`.
- Mantém `AbortController` e timeout máximo de 3 segundos para a consulta TMDB.
- Continua respeitando sessão excluída, Vistos/Watchlist através da autoridade pessoal, WWE, nota mínima e ano.
- Pool final limitado a 80 itens por slot.

### Validação de estresse
- Browser gate executa **35 trocas consecutivas**, exigindo item diferente a cada troca, lock sempre liberado e heartbeat da main thread ativo.
- Em seguida dispara **40 cliques rápidos** e confirma que o lock síncrono aceita no máximo uma troca concorrente e rejeita as demais sem bloquear a UI.

### Release
- Web: `1.0.161 / r370-official-1.0.161`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.160 — 2026-09-25 — Web r369

### Esportes / F1
- Neutraliza todos os caminhos de marcação assistida ativos (r255, r263, r296, r299 e r301).
- Remove dos fluxos de clique qualquer `loadSports255(true)`, `paintSports255()`, `render()`, recarga de histórico F1 e `cinetracker:data-changed`.
- Todos os botões envolvidos usam `type="button"`; handlers chamam `preventDefault()`, `stopPropagation()` e, nos owners legados, `stopImmediatePropagation()`.
- A UI muda de forma otimista no card/botão local; Supabase persiste em background e falhas fazem rollback local.

### Descobrir / Pra você
- r369 vira o owner final do `Trocar`, sem `MutationObserver`.
- Desativa o observer de refill da r363 e o observer global da r367 na build final.
- Remove o `while` do sorteio de páginas e limita a varredura a 240 itens / 100 ms.
- Usa `AbortController` real no TMDB, com timeout estrito de 3 segundos e cancelamento de requisição anterior.
- Pool por slot é limitado a 60 itens; quando não há item inédito, usa fallback limitado no pool existente sem bloquear a main thread.

### Validação
- Teste de navegador executa 20 trocas sequenciais, verifica heartbeat da main thread e botão sempre liberado.
- Teste de formulário executa 5 marcações esportivas e confirma zero submits e URL inalterada.

### Release
- Web: `1.0.160 / r369-official-1.0.160`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.159 — 2026-09-25 — Web r368

### Descobrir / Pra você
- Adiciona lock `isSwapping` durante cada troca e libera obrigatoriamente o botão em `finally`.
- Mantém `session_excluded_ids` em `sessionStorage` para impedir repetição de mídias já exibidas na sessão.
- Amplia o pool com páginas aleatórias do TMDB e escolhe a próxima mídia com `Math.random()`.
- Preserva filtros de Vistos, Watchlist quando aplicável, WWE, nota, ano e auditoria pessoal.

### Esportes / F1
- Marcar/desmarcar assistido passa a ser otimista e persiste no Supabase em segundo plano.
- Remove do toggle `loadSports255(true)`, `paintSports255()`, `enhanceF1Watch263(true)` e `cinetracker:data-changed`.
- Sem reload, repaint global ou refetch global; falha reverte somente o card afetado.
- Perfil recebe atualização local pelo evento `cinetracker:sports-watched-changed`.

### Release
- Web: `1.0.159 / r368-official-1.0.159`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.143 — 2026-09-23 — Web r352

### Descobrir / ações de card
- Elimina qualquer repaint global do `Pra você` ao clicar em `Trocar`, `✓ Visto` ou `+ Watchlist`.
- `Trocar` altera apenas o slot clicado, de forma imediata e sem chamada ao backend.
- `✓ Visto` e `+ Watchlist` usam estado otimista: o card clicado é substituído imediatamente e a persistência ocorre em segundo plano.
- Em falha de rede, somente o slot afetado é revertido e um toast discreto é exibido.
- Os handlers chamam `preventDefault`, `stopPropagation` e `stopImmediatePropagation`, evitando navegação/submissão acidental.
- Não há `window.location.reload()`, `router.refresh()`, `router.push()`, `renderDiscover()`, `loadForYou()` nem `paintForYou336()` no fluxo de clique r352.
- Em Top 10/Populares e demais listas públicas, `+ Watchlist` muda imediatamente para `✓ Salvo` e persiste em segundo plano sem trocar o card.
- A transição local usa `transition-opacity duration-300 ease-in-out`.

### Release
- Web: `1.0.143 / r352-official-1.0.143`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.127 — 2026-09-22 — Web r336

### Busca
- Amplia a busca global para filmes, séries, atores/pessoas e nomes de episódios.
- Adiciona `cinetracker_episode_search_v336` para títulos de episódios presentes no histórico/cache do usuário.
- Adiciona `cinetracker_episode_search_targets_v336` para selecionar séries acompanhadas que podem precisar de consulta episódica ao TMDB.
- Faz busca ao vivo na temporada corrente para episódios ainda não persistidos localmente e aceita pequenas diferenças ortográficas, como `Unraveling` / `Unravelling`.

### Home
- Preserva o histórico de Séries e Filmes no fluxo normal acima da seção de entrada, sem botão.
- Ao clicar em Séries ou Filmes, um único listener prioritário troca a aba e alinha diretamente em `Assistir a seguir` / `Assistir a seguir / Watchlist`.
- Remove a interferência de listeners legados concorrentes durante a troca de abas.

### Descobrir / Pra você
- Restaura `Todos / Filmes / Séries / Animes` como filtro interno do próprio `Pra você`.
- `Da sua Watchlist`: somente `Visto + Trocar`.
- `100% novos` e `Indicação do Dia`: `Watchlist + Visto + Trocar`.
- Todas as ações ficam em uma única linha compacta no tamanho do card.
- Qualquer ação troca o card imediatamente; Watchlist/Visto persistem em seguida.
- Mantém `cinetracker_discover_filter_v333` como auditoria final de vistos, progresso, Watchlist e Não interessado.

### Release
- Web: `1.0.127 / r336-official-1.0.127`.
- Android: `1.0.20 / versionCode 10062` preservado.
- F1 Hub, Esportes e contagens do Perfil não são alterados.

## 1.0.126 — 2026-09-22 — Web r335

### Home
- Mantém o histórico de Séries e Filmes carregado no fluxo normal, sem botão e sem scroll interno.
- Mantém a ordem cronológica ascendente no DOM: mais antigos acima e mais recentes imediatamente antes do conteúdo atual.
- Faz um único alinhamento em `Assistir a seguir` / `Assistir a seguir / Watchlist`.
- Adiciona trava curta de aba para impedir que um repaint antigo troque Filmes de volta para Séries.
- Aposenta os últimos loops automáticos de posicionamento da r332/r334.

### Descobrir
- Remove a faixa temporária `Todos / Filmes / Séries / Animes` do topo e zera seu espaço de layout.
- Reseta o filtro interno para `all`, evitando filtro invisível.
- Mantém r329 como renderer final do `Pra você` após a auditoria v333.
- Garante três ações por card — Watchlist, Visto e Trocar — em uma única linha compacta.
- Mantém `cinetracker_discover_filter_v333` como autoridade para vistos/progresso/Watchlist/Não interessado.
- Mantém Top 10 progressivo até 10 elegíveis após a auditoria.

### Estabilidade
- A r335 não adiciona MutationObserver.
- Teste de navegador cobre Home Filmes sem retorno automático a Séries, remoção dos filtros superiores, recuperação do Trocar, auditoria do Pra você, troca rápida de abas e refill do Top 10.

### Release
- Web: `1.0.126 / r335-official-1.0.126`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.125 — 2026-09-22 — Web r334

### Home / navegação
- Adiciona `cinetracker_home_series_watch_state_v4` e `cinetracker_home_payload_v334`.
- Remove o principal gargalo do estado consolidado de séries, reduzindo o benchmark de ~5,7 s para ~0,27 s.
- Remove a segunda atualização de histórico da r331, já redundante porque o payload atual traz o histórico canônico.
- Mantém o histórico no fluxo da página, sem botão e sem scroll interno.
- Mantém apenas r332 como autoridade de posicionamento inicial da Home.
- Desativa observers concorrentes de r327/r328/r329/r331/r333 que podiam repintar a interface durante navegação.

### Descobrir
- Mantém `cinetracker_discover_filter_v333` como autoridade, incluindo `watch_play_events` e aliases de título/ano.
- Filtros do Pra você passam a ser diretos e idempotentes.
- Watchlist, Visto e Trocar ficam em uma linha compacta em todos os renderers conhecidos.
- Top 10 continua progressivo até 10 elegíveis por rail.

### Performance
- Sports não faz warmup em segundo plano durante Home/Descobrir.
- Remove prefetch/normalização redundantes que competiam durante trocas de abas.

### Release
- Web: `1.0.125 / r334-official-1.0.125`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.124 — 2026-09-22 — Web r333

### Home
- Adiciona `cinetracker_home_payload_v333`.
- Consolida duplicatas de séries antes do primeiro paint; Citadel/Stuart deixam de anunciar episódios já assistidos ou não lançados.
- Filmes da Watchlist da Home passam a exigir: estar na Watchlist atual, já ter sido lançado e ainda não ter sido visto.
- Histórico continua no fluxo da página acima do ponto inicial, sem botão e sem scroll interno.
- Reduz reposicionamentos automáticos e remove o observer de scroll/repaint da r332.

### Descobrir
- Adiciona `cinetracker_discover_filter_v333`, incluindo eventos de reprodução na autoridade de vistos.
- Remove setas laterais e botão de filtro antigo; filtros ficam inline.
- Pra você mantém Todos / Filmes / Séries / Animes e força Watchlist + Visto + Trocar em três colunas compactas.
- Remove prefetch agressivo ao entrar no Descobrir.
- Top 10 busca páginas progressivamente até 10 elegíveis por rail e faz auditoria final v333.
- Remove a faixa vazia superior do Top 10.

### Esportes
- Abertura do site aquece o payload de Esportes e dispara sincronização de provedores em segundo plano.
- Após a sincronização, o payload é recarregado para a aba abrir com dados recentes sempre que possível.

### Escopo
- Web: `1.0.124 / r333-official-1.0.124`.
- Perfil/Watchlist permanece na autoridade r324.
- F1 Hub preservado.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.123 — 2026-09-22 — Web r332

### Home
- Remove qualquer dependência de botão para revelar o histórico; histórico de Séries e Filmes permanece no fluxo normal acima do conteúdo atual.
- Corrige o ponto inicial para não deixar uma faixa do histórico aparente após repaints assíncronos.
- Cancela o reposicionamento automático quando o usuário inicia scroll.
- Reaplica o estado lógico consolidado das séries antes de exibir o próximo episódio.
- Impede ponteiro de próximo episódio anterior ou igual ao último episódio já assistido.
- Refresh de metadados episódicos volta a ser tentável após falha e recebe uma tentativa forçada em segundo plano por sessão.

### Descobrir
- Pra você deixa de aceitar o r309 como renderer final.
- Faz auditoria final com `cinetracker_discover_filter_v326` e pinta apenas com o r329.
- Mantém `Da sua Watchlist` restrita a Watchlist não vista e `100% novos`/Indicação sem vistos, progresso, Em dia, concluídos, Watchlist e Não interessado.
- Restaura de forma determinística os filtros Todos / Filmes / Séries / Animes.
- Watchlist, Visto e Trocar ficam em uma única linha compacta.
- Preserva cache de fontes TMDB quando muda apenas o estado pessoal, deduplica requests concorrentes e pré-carrega abas públicas em segundo plano.
- Top 10 mantém refill progressivo 10 Séries + 10 Filmes e auditoria final v326.

### Escopo
- Web: `1.0.123 / r332-official-1.0.123`.
- Android permanece `1.0.20 / versionCode 10062`.
- Perfil/Watchlist, Esportes e F1 Hub preservados.

## 1.0.121 — 2026-09-22 — Web r330

### Home · desempenho / navegação
- Remove o contrato r285 de aguardar reconciliação completa de até dezenas de séries antes do primeiro paint.
- A Home pinta primeiro o payload do banco e reconcilia episódios em segundo plano.
- Reconciliação antiga é impedida de repintar após mudança de rota.
- O refresh remoto de TV é adiado para depois da primeira tela e só inicia se a Home continuar ativa.
- Mantém o histórico r328 acima da área inicial, sem botão e sem scroll interno.

### Descobrir · Pra você
- Watchlist + Visto + Trocar passam a usar grid final de três colunas iguais.
- Botões têm altura fixa, `nowrap` e o Trocar não pode cair para outra linha.

### Descobrir · Top 10
- Remove o cabeçalho `Top 10` redundante dentro da área e o segundo texto com o nome do streaming.
- Reduz o espaço vertical entre tabs, streamings e listas.
- Mantém refill até dez elegíveis e adiciona auditoria v326 imediatamente antes do paint.
- Harry Potter foi usado como regressão de dados: os oito filmes informados como vistos retornam bloqueados pela autoridade atual.

### Escopo
- Web: `1.0.121 / r330-official-1.0.121`.
- Perfil, Esportes e F1 Hub sem mudanças funcionais.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.120 — 2026-09-21 — Web r329

### Descobrir · layout
- Corrige a regressão visual em que cards do Pra você eram comprimidos para três colunas e o botão Trocar caía para baixo/encostava no bloco seguinte.
- Restaura cards de 154 px no mobile e 176 px no desktop, proporção 2:3.
- Filme / Série / Anime passam a rolar horizontalmente dentro de cada seção, sem scrollbar horizontal no documento.
- Watchlist + Visto + Trocar ficam em uma linha única, com altura fixa e classes exclusivas da r329.
- Slots vazios não ocupam um card fantasma.
- Abas públicas e Top 10 recebem a mesma geometria padrão e ações sem quebra.

### Regras preservadas
- Mantém `cinetracker_discover_filter_v326` como autoridade estrita antes do HTML.
- Mantém refill do Top 10 até dez elegíveis e cancelamento de refill ao trocar de aba.
- Preserva filtros Todos / Filmes / Séries / Animes.

### Escopo
- Web: `1.0.120 / r329-official-1.0.120`.
- Home, Perfil, episódios, Esportes e F1 sem alterações.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.119 — 2026-09-21 — Web r328

### Home
- Restaura o contrato r276: histórico renderizado acima da área inicial, sem botão e sem scroller interno.
- Séries abre em `Assistir a seguir`; Filmes abre em `Assistir a seguir / Watchlist`.
- Trocar Séries/Filmes redefine a posição da página para o início correto da respectiva aba.
- O item mais recente do histórico permanece imediatamente acima da área normal; itens mais antigos ficam progressivamente mais acima.

### Descobrir
- `Pra você` passa a usar markup final próprio para eliminar a quebra de linha herdada da r309.
- Watchlist + Visto + Trocar ficam na mesma linha, com três colunas compactas e cards 2:3 de largura uniforme.
- Filtros `Todos / Filmes / Séries / Animes` ficam sempre visíveis no Pra você e atuam sem recarregar.
- As abas públicas continuam sendo filtradas por `cinetracker_discover_filter_v326` antes do HTML.
- Top 10 mantém a mesma autoridade, preenche até dez elegíveis e interrompe páginas extras quando o usuário muda de aba.

### Preservado
- r324: contagens/ordenação das Watchlists.
- r325: consolidação de episódios e atualização de série.
- Esportes e F1 Hub sem alterações.
- Android `1.0.20 / versionCode 10062`.
- Web `1.0.119 / r328-official-1.0.119`.

## 1.0.118 — 2026-09-21 — Web r327

### Home
- Histórico de Séries e Filmes deixa de ser um scroll interno e deixa de usar botão.
- Histórico permanece carregado acima do conteúdo normal; troca Série ↔ Filme reposiciona a página no início normal de cada aba.
- Rolar para cima revela primeiro os registros mais recentes e, continuando, os mais antigos.
- Mantida a autoridade de histórico da r325/r323.

### Descobrir · Pra você
- Watchlist, Visto e Trocar ficam em uma única linha flexível e minimalista sem alterar o tamanho dos cards.
- Filtros Todos / Filmes / Séries / Animes reaplicados diretamente após cada repaint.
- Remove refill sequencial de até cinco rodadas; refill adicional é único e paralelo.

### Descobrir · Top 10
- Remove Mubi e Looke da seleção de streamings.
- Mantém `cinetracker_discover_filter_v326` como autoridade autenticada para Visto/Watchlist/Progresso.
- Top 10 busca páginas em lotes paralelos e completa até 10 elegíveis.
- Exibe 10 cards integralmente no grid; fallback 5×2 em telas estreitas.

### Preservação
- Sincronização de episódios r325 preservada.
- Watchlist do Perfil r324 preservada.
- F1 Hub e Esportes não alterados.
- Web: `1.0.118 / r327-official-1.0.118`.
- Android: `1.0.20 / versionCode 10062`.

## 1.0.117 — 2026-09-21 — Web r326

### Home / Histórico
- Restaura o comportamento pré-r275 dos históricos de Séries e Filmes.
- Remove da interface os controles `Ver histórico / Ocultar histórico`.
- Mantém o conteúdo carregado e rolável, com ordenação cronológica ascendente dentro do container e posicionamento automático no fundo, deixando o registro mais recente imediatamente acessível e os antigos acima.

### Descobrir
- Adiciona `cinetracker_discover_filter_v326`.
- O filtro cruza candidatos com todas as mídias do usuário por TMDB ou aliases de título original/localizado + ano, inclusive quando a duplicata histórica já tem outro TMDB efetivo.
- `Pra você` passa a recompor os pools depois da validação exata e busca candidatos adicionais quando a filtragem esvazia Filme/Série/Anime ou Indicação do Dia.
- Durante a validação, o draft antigo fica oculto para evitar flash de conteúdo proibido.
- Força Watchlist + Visto + Trocar na mesma linha compacta e sem quebra no `Pra você`.
- Mantém Watchlist + Visto lado a lado nas demais abas.
- Top 10 preserva o preenchimento até 10 elegíveis e usa a autoridade v326.

### Preservações
- Sincronização de episódios novos da r325 preservada.
- Contadores/ordenação das Watchlists do Perfil preservados.
- F1 e Esportes inalterados.
- Web: `1.0.117 / r326-official-1.0.117`.
- Android: `1.0.20 / versionCode 10062`.

## 1.0.116 — 2026-09-20 — Web r325

### Home / Histórico
- Adiciona `cinetracker_home_history_v324` como autoridade para pré-carregar histórico de episódios e filmes antes do paint.
- Mantém os dois históricos recolhidos na abertura, sem depender de lazy-load quando o usuário expande.

### Home / Séries e episódios novos
- Adiciona `cinetracker_home_series_watch_state_v2`.
- Consolida progresso de fichas duplicadas pelo TMDB efetivo, incluindo contagem assistida, chaves S/E, último S/E e último horário assistido.
- Corrige combinações inconsistentes de contagem e episódio atual causadas por progresso dividido entre mídia legada e mídia canônica.
- Ativa `ct-refresh-tv-state-user` a partir do Home para atualizar metadata episódica quando a data do próximo episódio já passou ou a ficha está velha.
- Após atualização, o Home reconcilia o TMDB atual e calcula novamente episódios lançados, episódio seguinte não visto e quantidade disponível.
- Episódio recente lançado e ainda não visto recebe marca `NOVO`.

### Preservações
- Mantém a r324 para botões compactos do Descobrir, filtro Top 10 contra vistos legados, Watchlists completas/contadores corretos e ordenação.
- Web: `1.0.116 / r325-official-1.0.116`.
- Android permanece `1.0.20 / versionCode 10062`.
- Esportes e F1 não foram alterados.

## 1.0.115 — 2026-09-20 — Web r324

### Home
- Séries e Filmes passam a iniciar com o histórico já carregado porém recolhido.
- Adiciona controle independente `Ver histórico / Ocultar histórico` para cada aba, sem lazy-load do conteúdo.

### Descobrir
- Compacta as ações do `Pra você` em uma única linha: Watchlist, Visto e Trocar.
- Mantém Watchlist + Visto em uma única linha nas abas públicas e Top 10, inclusive em viewport estreita.
- Adiciona `cinetracker_discover_filter_v324`: aliases de título original + ano são unidos ao match TMDB direto, em vez de serem ignorados quando existe uma ficha positiva.
- Corrige títulos vistos importados que reapareciam no Top 10, incluindo a duplicidade legado/atual da franquia Harry Potter.

### Perfil / Watchlist
- O modal deixa de usar a lista r316 que descartava `tmdb_id <= 0`.
- Passa a renderizar todas as linhas de `cinetracker_watchlist_full_v119`.
- O cabeçalho usa os contadores do RPC, preservando os totais completos de Séries e Filmes.
- Registros legados sem TMDB positivo permanecem visíveis na lista, sem tentar abrir uma rota TMDB inválida.

### Release
- Web: `1.0.115 / r324-official-1.0.115`.
- Android permanece `1.0.20 / versionCode 10062`.
- Esportes e F1 não foram alterados.

## 1.0.114 — 2026-09-20 — Web r323

### Home
- Corrige `Filmes vistos` para incorporar reproduções de `watch_play_events_v0994` e manter fallback do `watch_history` legado.
- O histórico passa a refletir filmes recentes mesmo quando o registro canônico antigo não foi atualizado.

### Descobrir
- Adiciona `cinetracker_discover_filter_v323` com reconciliação por TMDB e, para registros legados sem TMDB válido, por título original/localizado + ano.
- `Pra você` mantém `Da sua Watchlist` apenas para Watchlist ainda não vista e `100% novos`/Indicação somente para itens desbloqueados.
- Top 10 busca páginas adicionais até obter 10 séries e 10 filmes elegíveis por streaming, limitado a cinco páginas.

### Perfil / Watchlist
- Adiciona seletor de ordenação visível em Filmes Watchlist e Séries Watchlist.
- Opções: Último adicionado, Primeiro adicionado, A–Z, Z–A, Ano mais recente e Ano mais antigo.

### Release
- Web: `1.0.114 / r323-official-1.0.114`.
- Android permanece `1.0.20 / versionCode 10062`.
- F1 Hub e Esportes não foram alterados.

## 1.0.113 — 2026-09-20 — Web r322

### Descobrir
- Corrige o travamento observado no vídeo em `Carregando...` / `Montando Top 10...`.
- Adiciona `cinetracker_discover_filter_v322`, usando a chave lógica TMDB indexada para cruzar candidatos com Watchlist, histórico e progresso do usuário.
- Mantém a exclusão antes da renderização para vistos, progresso, Em dia, Concluído, Watchlist, Assistir depois e Não interessado.
- Top 10 volta a usar a autoridade/cache `ct171TopRows` e aplica o mesmo filtro antes de montar as duas listas.
- Pra você mantém as regras e filtros já aprovados.
- Calendário mantém a exceção de Watchlist.

### Escopo
- Alteração somente em Descobrir.
- Perfil/Histórico, Esportes e F1 Hub permanecem inalterados.
- Android permanece `1.0.20 / versionCode 10062`.
- Web: `1.0.113 / r322-official-1.0.113`.

## 1.0.112 — 2026-09-20 — Web r321

### Descobrir
- Reverte o mecanismo da r320 que ocultava cards enquanto aguardava validação e podia deixar `Pra você` e outras abas em branco.
- A validação pessoal agora ocorre dentro do carregamento da aba e antes do renderer.
- Mantém `cinetracker_discover_filter_v320` como autoridade exata para Visto, progresso, Em dia, Concluído, Watchlist, Assistir depois e Não interessado.
- `Pra você`, Top 10 e as seis abas públicas voltam a carregar normalmente sem depender de MutationObserver para liberar conteúdo.

### Perfil / Histórico
- Mantém o histórico diário baseado em `watch_history`, a mesma fonte de mídia usada pela Home.
- Mantém temporada/episódio, nome do episódio, nota, data, episódios restantes e reproduções no detalhe diário.

### Escopo
- Web: `1.0.112 / r321-official-1.0.112`.
- Android permanece `1.0.20 / versionCode 10062`.
- Nenhuma alteração em F1 Hub.

## 1.0.111 — 2026-09-20 — Web r320

### Descobrir
- Adiciona `cinetracker_discover_filter_v320`, que valida cada candidato diretamente contra Watchlist, histórico, progresso e estados do usuário.
- A validação usa TMDB ID e fallback por título/ano para cobrir registros legados.
- Cards públicos ficam ocultos até serem validados; itens vistos, em progresso, em dia, concluídos, na Watchlist ou não interessados são removidos antes de ficarem visíveis.
- O mesmo cruzamento é aplicado ao Top 10.
- No `Pra você`, `Da sua Watchlist` exige Watchlist + não visto; `100% novos` e Indicação do Dia exigem item totalmente desbloqueado.

### Perfil / Histórico
- Substitui a fonte divergente de atividade por `cinetracker_activity_by_day_v320` e `cinetracker_activity_items_by_day_v320`.
- Episódios e filmes passam a vir do mesmo `watch_history` usado pela Home.
- O detalhe diário preserva temporada/episódio, título do episódio, nota, data, episódios restantes e reproduções.
- Eventos esportivos continuam aparecendo no Perfil sem alterar a autoridade de mídia da Home.

### Escopo
- Web: `1.0.111 / r320-official-1.0.111`.
- Android permanece `1.0.20 / versionCode 10062`.
- Nenhuma alteração em F1 Hub.

## 1.0.110 — 2026-09-19 — Web r319

### Descobrir
- Corrige a barreira pessoal que permitia títulos já vistos ou já salvos reaparecerem em abas públicas.
- Adiciona o RPC autenticado `cinetracker_discover_blocked_v319`, baseado em TMDB efetivo e no dashboard canônico do usuário.
- Expõe separadamente `blocked_keys`, `seen_keys` e `watch_keys`, além de aliases de título/ano.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados, Mais bem avaliados e Top 10 consultam a autoridade pessoal novamente antes de cada render.
- Se a autoridade pessoal falhar, a tela não renderiza catálogo sem filtro: comportamento fail-closed.
- Mantém `Pra você` e Calendário com as exceções previamente autorizadas.

### Escopo
- Nenhuma alteração em Perfil, Esportes ou F1 Hub.
- Android permanece `1.0.20 / versionCode 10062`.
- Web: `1.0.110 / r319-official-1.0.110`.

## 1.0.109 — 2026-09-19 — Web r318

### Descobrir
- Adiciona filtro funcional no `Pra você`: Todos, Filmes, Séries e Animes.
- Preserva as regras canônicas do `Pra você`, incluindo pools independentes, `Trocar`, ações Watchlist/Visto e exclusões de frescor/qualidade já aprovadas.
- Aplica exclusão estrita antes da renderização em Top 10, Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados.
- Títulos já vistos ou na Watchlist não entram no HTML dessas áreas; progresso, Em dia e aliases visuais também permanecem excluídos.
- Top 10 mantém todos os streamings disponíveis e duas listas por provedor: Séries e Filmes.
- Corrige janelas de Novidades (-30d), Lançamentos (-7d/+30d) e Mais Aguardados (a partir de amanhã).
- Mantém Calendário como exceção autorizada de Watchlist.
- Mantém cache de 5 minutos e prefetch.

### Escopo
- Nenhuma alteração em Perfil, Esportes ou F1 Hub.
- Android permanece `1.0.20 / versionCode 10062`.
- Web: `1.0.109 / r318-official-1.0.109`.

## 1.0.108 — 2026-09-19 — Web r317

### Perfil
- Corrige definitivamente `Filmes Watchlist`: o card passa a abrir a lista completa pelo rótulo no primeiro capture listener, antes dos bloqueadores legados.
- Mantém `Séries Watchlist` com o mesmo contrato.
- Corrige o alias singular `Tempo de filme em Watchlist` para preservar a ordem exata das dez estatísticas.

### Build / validação
- Web: `1.0.108 / r317-official-1.0.108`.
- Android permanece `1.0.20 / versionCode 10062`.
- Adiciona teste Chromium que remove propositalmente os datasets do card de filmes e valida que o clique ainda abre a Watchlist apenas pelo rótulo.

## 1.0.107 — 2026-09-19 — Web r316

### Perfil
- Restaura a ordem visual aprovada do r237 para as dez estatísticas.
- Restaura os cards Séries Watchlist e Filmes Watchlist como botões funcionais, abrindo a lista completa.
- Mantém a fonte esportiva canônica e o recolher conjunto de Estatísticas + Esportes assistidos.

### F1 Hub
- Mantém apenas Visão geral, Calendário, Classificações e Circuitos.
- Continua removendo o painel legado de registro da Fórmula 1.
- Remove a mensagem falsa `Temporada encerrada` quando a agenda está incompleta e passa a sinalizar `Agenda ainda não sincronizada`.

### Build / validação
- Web: `1.0.107 / r316-official-1.0.107`.
- Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressão Chromium para ordem física, abertura das duas Watchlists e verdade do F1 Hub.

## 1.0.106 — 2026-09-18 — Web r315

### Descobrir
- Restaura o `Pra você` aprovado da r309, com Watchlist, Visto e Trocar nos slots corretos.
- Restaura o Top 10 por streaming da r288, com duas listas independentes para cada provedor: `Top 10 Séries` e `Top 10 Filmes`.
- Reaplica antes do HTML a exclusão estrita de vistos e Watchlist em Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados.
- Remove o contrato de ação única da r314 e recupera Watchlist + Visto nas seis abas públicas.
- Mantém cache de 5 minutos e prefetch em segundo plano para troca rápida entre abas.

### F1 Hub
- Remove o painel legado `Seu registro / Fórmula 1 assistida`, inclusive contra reinserções tardias do runtime r263.
- Preserva detalhes do GP, qualificação, resultado, Δ, DNF, volta mais rápida e marcação individual de sessões.

### Perfil
- Restaura a ordem física de estatísticas da r238.
- Volta a buscar `cinetracker_sport_stats_v1` em paralelo ao payload do Perfil; o tempo esportivo deixa de ser zerado por ausência de `sports_stats` em `cinetracker_profile_payload_v0997`.
- Restaura as ações de histórico em Eventos assistidos e Jogos no Estádio.
- O controle Recolher/Expandir volta a controlar em conjunto Estatísticas e Esportes assistidos.
- Séries Watchlist e Filmes Watchlist permanecem estáticas, sem chevron/modal.
- Mantém Atores Favoritos com geometria uniforme e overflow horizontal somente no rail.

### Build / validação
- Web atualizada para `1.0.106 / r315-official-1.0.106`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões estática e Chromium específicas para os contratos restaurados.

## 1.0.105 — 2026-09-18 — Web r314

### Perfil
- Elimina o fallback de cache antigo do paint final: estatísticas gerais e esportivas passam a refletir o payload atual do Supabase e permanecem estabilizadas no topo do Perfil.
- Transforma `Séries Watchlist` e `Filmes Watchlist` em contadores estritamente estáticos, removendo chevrons, links, `data-watchlist-kind`, cursor de ação e qualquer gatilho de modal.
- Padroniza os cards/fotos de Atores Favoritos e restringe `overflow-x:auto` exclusivamente ao rail real dos atores.

### Descobrir
- Restaura `Lançamentos` e volta a nove sub-abas canônicas.
- Aplica exclusão estrita de vistos + Watchlist + aliases antes do HTML em `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados` e `Mais bem avaliados`.
- Reutiliza o `+` minimalista de Watchlist em todos os cards públicos.
- Introduz cache stale-while-revalidate de 5 minutos, revalidação em segundo plano e prefetch das fontes públicas.
- Compacta `Da sua Watchlist` e `100% novos` em três slots Filme/Série/Anime com proporção 2:3.

### F1 Hub
- Calendário e GPs anteriores da Visão Geral passam a abrir um drawer dedicado do GP.
- O drawer consulta classificação e resultado da etapa selecionada, exibindo Grid de Largada, Q1/Q2/Q3, resultado final, Δ de posições, DNF e volta mais rápida.
- Sessões individuais usam persistência própria por usuário com IDs `f1:temporada:etapa:sessão`.

### Backend / segurança
- Adiciona `user_f1_session_watch` com RLS por `profile_id` e RPCs `cinetracker_f1_session_watch_history_v314` / `cinetracker_f1_session_watch_set_v314` como `SECURITY INVOKER`.
- Remove o writer F1 `SECURITY DEFINER` da tentativa anterior e reconcilia o histórico de migrations já aplicado em produção.

### Build / validação
- Web atualizada para `1.0.105 / r314-official-1.0.105`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões estática e Chromium para nove abas, exclusão estrita, `+` minimalista, Perfil estático/atores, detalhes da F1 e persistência de sessões.

## 1.0.104 — 2026-09-18 — Web r313

### Descobrir
- Reverte o renderer visual próprio da r312 e restaura o card aprovado `ct288Card`; nenhum `ct312-card`/banner é permitido no bundle final.
- `Todos / Filmes / Séries` volta a ficar oculto por padrão e é aberto somente pelo botão compacto `☷`.
- Mantém as oito abas visíveis durante loading, scroll horizontal nativo e título/metadados sem corte.
- As cinco abas públicas aplicam visto + Watchlist + identidade visual antes da montagem do HTML e mantêm `+ Watchlist` + `✓ Visto`.
- `Pra Você` reutiliza a autoridade exata r309 com acabamento compacto.

### Esportes
- Move a responsabilidade do filtro para o produtor real `paintSports255`.
- `Próximos` e `Anteriores` recebem, dentro do próprio `panel-head`, `Todos` mais todos os esportes retornados em `payload.sports`.
- Remove o produtor global antigo `.ct255-sport-filters`; `Assistidos` e demais abas não recebem o filtro inline.

### Perfil
- Substitui a cadeia herdada final por `renderProfile313`, com um único estado de carregamento e um único paint canônico.
- Garante `Jogos no Estádio` e unifica o visual de `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist`, preservando os contratos de clique.
- Mantém histórico esportivo canônico e atualização de atores favoritos da r312.

### Preservações
- JWT expirado continua renovando sessão e repetindo uma vez.
- F1 r311 permanece clicável, com detalhe completo e marcação por sessão.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.103 — 2026-09-18 — Web r312

### Descobrir
- Adota um shell único com oito abas persistentes; trocar de aba ou carregar títulos não pode mais apagar/recriar a navegação.
- Nas cinco abas públicas, cruza Watchlist completa, dashboard pessoal e exclusões canônicas antes do HTML, removendo itens vistos ou já salvos.
- Substitui cards herdados por cards r312 próprios, com metadados sem truncamento e `+ Watchlist` + `✓ Visto` em faixa estável abaixo do pôster.
- Mantém scroll horizontal nativo no rail e alinha os controles pela altura final dos cards.
- `Pra Você` reutiliza os pools exatos 1+3+3 da r309, mas com layout compacto e controles pequenos/estáveis.

### Sessão / autenticação
- Se uma chamada protegida retornar JWT expirado/401, renova a sessão com o `refresh_token`, persiste a nova sessão e repete a operação uma vez.
- O fluxo cobre API/RPC, Edge Functions e TMDB proxy protegido, eliminando `Falha ao carregar Esportes: JWT expired` quando a sessão ainda pode ser renovada.

### Perfil
- Garante `Jogos no Estádio` mesmo quando o payload inicial não produzir o card, clonando o contrato visual/clicável de `Eventos assistidos`.
- Lê Atores Favoritos diretamente da tabela `favorite_actors` e invalida/atualiza o Perfil imediatamente após gravações, cobrindo novos favoritos adicionados durante a sessão.

### Esportes
- Remove o filtro global antigo.
- Insere em `Próximos` e `Anteriores`, ao lado do título, um filtro horizontal com `Todos` e todos os esportes disponíveis em `payload.sports`.
- O filtro é dinâmico: novos esportes suportados pelo payload aparecem sem alteração de código.

### F1 / preservação
- Mantém a autoridade r311: Calendário clicável, fim de semana completo, Grid de Largada, Resultado de Chegada e marcação por sessão.

### Build / validação
- Web atualizada para `1.0.103 / r312-official-1.0.103`; Android permanece `1.0.20 / versionCode 10062`.
- Chromium cobre shell durante loading, barreira vistos+Watchlist, cards/scroll, Pra Você compacto, estádio, atualização de ator favorito e filtros esportivos inline.

## 1.0.102 — 2026-09-18 — Web r311

### Perfil / Estatísticas
- Unifica `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist` pela mesma classe/contrato visual final, usando `Eventos assistidos` como referência.
- Neutraliza as autoridades visuais tardias r300/r301, impedindo que os cards troquem de versão após o primeiro paint.
- Preserva os contratos de clique já existentes para histórico esportivo, estádio e Watchlists.

### F1 Hub
- O Calendário passa a renderizar cada GP como botão clicável `Abrir corrida`, em vez de artigos sem ação.
- O modal de corrida reúne fim de semana, Grid de Largada e Resultado de Chegada.
- Sessões já iniciadas podem ser marcadas/desmarcadas individualmente como assistidas usando IDs estáveis `f1:temporada:etapa:sessão` e `cinetracker_sports_watch_set_v296`.
- O objeto completo de cada GP permanece estável entre repaints do calendário, evitando botão visível sem dados ao clicar.

### Descobrir
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` têm um único renderer final.
- A exclusão de vistos e Watchlist ocorre antes da montagem do HTML.
- Remove o `+` legado sobreposto ao card; `+ Watchlist` e `✓ Visto` ficam em uma faixa estável abaixo do card e fora do elemento de mídia.

### Build / validação
- Web atualizada para `1.0.102 / r311-official-1.0.102`; Android permanece `1.0.20 / versionCode 10062`.
- Regressão Chromium exige igualdade visual dos quatro controles do Perfil, clique real do GP, persistência da sessão de F1 e ações estáveis/exclusões do Descobrir.

## 1.0.101 — 2026-09-18 — Web r310

### Descobrir / autoridades tardias
- Aposenta o injetor r252 que ainda podia acrescentar `Top 10` e `Lançamentos` depois que a interface canônica já estava pronta.
- Neutraliza o recovery r300 de 2,2 s e o repaint atrasado r293, impedindo que renderers antigos substituam cards/actions depois da r310.
- Usa `cinetracker_watchlist_full_v119` como fonte canônica adicional antes do paint das abas públicas; títulos já salvos deixam de reaparecer com `+ Watchlist`.
- Os cards mantêm dois controles coerentes com o estado real: Watchlist e `✓ Visto`.

### Perfil / Esportes
- O primeiro paint do Perfil usa `cinetracker_sports_watch_history_v296` para o total de eventos assistidos; o RPC legado de stats fica somente como fallback para demais métricas.
- Evita divergências como 59 eventos no Perfil contra 68 na aba Esportes.
- Atores Favoritos passa a ter somente uma barra horizontal, criada explicitamente abaixo do rail dos cards.

### Esportes / acabamento
- Eventos antigos ainda marcados como `live` pelo provider são normalizados para encerrados após oito horas, evitando partidas de dias anteriores exibidas como `AO VIVO`.
- Corrige o rodapé Web congelado em `v1.0.57`; a identidade visível passa a `v1.0.101 / r310-official-1.0.101`.

### Build / validação
- Web atualizada para `1.0.101 / r310-official-1.0.101`; Android permanece `1.0.20 / versionCode 10062`.
- Chromium reproduz o novo vídeo: título já salvo na Watchlist, tabs tardias, takeover das ações, 68 vs 59, scrollbar dos atores e versão antiga no rodapé.

## 1.0.100 — 2026-09-18 — Web r309

### Descobrir
- Usa os dois vídeos de validação de 18/09 como regressão: remove a aba `Lançamentos` de todos os produtores privados ainda embarcados e impede rails duplicados de recriarem `Top 10`/abas antigas.
- Paraleliza autoridade pessoal e busca do catálogo nas abas públicas, eliminando a espera sequencial r308 que prolongava `Carregando títulos…`.
- Deduplica o resultado final por TMDB e também por tipo+título+ano, cobrindo títulos visualmente duplicados como `Next Time`.
- Reconstrói `Pra Você` combinando a autoridade r295 com `cinetracker_watchlist_full_v119`; hidrata a Watchlist por categoria e mantém Filme + Série + Anime em `Da sua Watchlist` e `100% novos`.
- Garante dois controles visíveis por card — `+ Watchlist`/estado da Watchlist e `✓ Visto` — usando `chip` do sistema; `↻ Trocar` fica em uma linha própria.

### F1 Hub
- Remove `Pilotos` e `Equipes` da fonte r257 antes do primeiro paint.
- Neutraliza os repaints r257 agendados em 0/180/700/1800 ms e a reparação do observer que podiam sobrescrever o Hub atual e recriar seis abas.
- Mantém somente `Visão geral`, `Calendário`, `Classificações` e `Circuitos`; pilotos e equipes permanecem dentro de `Classificações`.

### Perfil
- Substitui o fluxo r168 de cache → quick stats → full payload por um único paint canônico. Cache e quick ficam somente como fallback caso o payload completo não responda no limite definido.
- Estatísticas esportivas e resumo de `Jogos no Estádio` começam em paralelo com o payload do Perfil e entram antes de revelar a tela.
- Neutraliza a reescrita tardia r255 e remove o chevron da Watchlist no próprio produtor, evitando aparecer e sumir.
- O scroll de `Atores Favoritos` passa a pertencer somente ao pai real dos cards, mantendo a scrollbar abaixo do carrossel.

### Build / validação
- Web atualizada para `1.0.100 / r309-official-1.0.100`; Android permanece `1.0.20 / versionCode 10062`.
- Novas regressões estáticas e Chromium cobrem 1+3+3, duplicação visual, rail de abas, dois controles por card, primeiro paint F1 e geometria do scroll de atores.

## 1.0.99 — 2026-09-17 — Web r308

### Descobrir / Pra Você
- Substitui a composição permissiva da r301 por pools separados de Filme, Série e Anime, garantindo a estrutura `Indicação do Dia + 3 Watchlist + 3 100% novos` sem usar uma categoria para preencher outra.
- A Indicação do Dia passa a manter um pool próprio e recebe `↻ Trocar`; cada slot da Watchlist e dos 100% novos também troca somente dentro da própria categoria.
- Inicia autoridade pessoal, memória de recomendações e primeira página dos três catálogos TMDB em paralelo; hidrata somente a parcela necessária da Watchlist e reutiliza a composição recente por três minutos.
- Remove o refresh atrasado/observer da r293 e o observer de rota da r301 que podiam repintar o Pra Você depois de a tela já estar pronta.
- Padroniza Watchlist/Visto com controles `chip` do próprio sistema, sem paleta exclusiva do Descobrir.

### Descobrir / exclusões pessoais
- Aplica novamente, na última etapa antes do renderer, a exclusão de qualquer mídia já assistida ou existente na Watchlist em `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados`.
- Mantém `Calendário`, `Pra Você` e `Top 10` explicitamente fora dessa exclusão geral.

### F1 Hub
- Remove `Pilotos` e `Equipes` do modelo ativo que chega à produção. O Hub fica com `Visão geral`, `Calendário`, `Classificações` e `Circuitos`, e a r308 também saneia qualquer botão redundante que ainda seja emitido por uma autoridade herdada.
- Corrige a autoridade de clique do Calendário para ler `data-event-id`; IDs como `2026-16` resolvem temporada/rodada corretamente antes de abrir `Grid de Largada` e `Resultado de Chegada`.

### Perfil
- Consolida o acabamento final do Perfil no renderer vivo da r308, por rótulo semântico, sem depender da posição física dos cards; autoridades históricas já removidas em releases anteriores não são reintroduzidas.
- Identifica `Séries Watchlist` e `Filmes Watchlist` semanticamente pelo rótulo, remove `Abrir`/setas/pseudo-ícones e preserva a área clicável sem indicador visual.

### Build / validação
- Web atualizada para `1.0.99 / r308-official-1.0.99`; Android permanece `1.0.20 / versionCode 10062`.
- Regressão Chromium monta a estrutura 1+3+3, verifica as cinco exclusões pessoais e três exceções, remove Pilotos/Equipes, clica uma corrida `2026-16` e valida o Perfil por rótulo.

## 1.0.98 — 2026-09-17 — Web r307

### Home / Raw e SmackDown
- Impede a captura genérica r306 de transformar `Marcar episódio como assistido` em `markSeen` da série inteira.
- Usa a fronteira assistida das séries recorrentes antigas para calcular somente episódios realmente novos; backlog histórico anterior não vira pendência.
- Preserva o bucket `Juntando poeira` quando ainda existe episódio novo e força `Em dia` somente quando a fronteira alcança o último episódio lançado.
- A reparação de dados do Raw em 17/09 removeu os registros em massa criados pelo clique defeituoso e preservou o episódio correto.

### Build / validação
- Web atualizada para `1.0.98 / r307-official-1.0.98`; Android permanece `1.0.20 / versionCode 10062`.
- Regressão Chromium reproduz o botão real do episódio e falha se houver qualquer chamada de marcação da série inteira.

## 1.0.97 — 2026-09-17 — Web r306

### Detalhes de filmes e séries
- Corrige a autoridade de clique dos títulos semelhantes/recomendados e dos cards de atores, usando o TMDB/person ID do próprio card antes dos handlers legados.
- `+ Watchlist` e `✓ Visto` passam pela ação assíncrona canônica tanto nos cards relacionados quanto no detalhe principal, com estado de busy e atualização visual imediata.
- Remove do bundle final a autoridade r305 que dependia de hit-test/handlers incompatíveis com o lifecycle real.

### Descobrir / Top 10
- Compacta header, margens e paddings superiores do Top 10 para elevar o ranking na viewport e reduzir a necessidade de scroll vertical.
- Preserva o bloqueio de overflow horizontal global e mantém o scroll somente nos trilhos que precisam dele.

### F1 Hub
- Remove definitivamente a aba `Pilotos` do modelo e do DOM; a r306 falha em teste se ela reaparecer.
- Corridas passadas do Calendário abrem modal próprio com `Grid de Largada` e `Resultado de Chegada`.
- O detalhe usa resultados já disponíveis no evento e fallback Jolpica por temporada/round quando necessário.

### Esportes
- Força a ordem `Próximos`, `Anteriores`, `Favoritos`, `Assistidos` e mantém esse submenu estritamente abaixo do F1 Hub.
- Move `↻ Rebuscar / Sincronizar` para o header da página, fora do submenu, e a ação força `ct-sports-sync`/reload dos providers e dados esportivos.

### Perfil
- Elimina reconciliações temporizadas do r299 e mantém as autoridades tardias r300/r301 neutralizadas, impedindo troca involuntária de versão/layout das estatísticas após a primeira pintura.
- Remove `Abrir`, `>` e `›` dos cards `Séries Watchlist` e `Filmes Watchlist`.
- Padroniza os cards de atores em 132x178 e os avatares em 112x112, com o scroll horizontal retido somente no trilho dos atores.

### Build / validação
- Web atualizada para `1.0.97 / r306-official-1.0.97`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressões estática e Chromium cobrindo interações de relacionados/atores/Watchlist/Visto, Top 10, remoção de Pilotos, Grid/Resultado da F1, ordem/refresh de Esportes e geometria/scroll do Perfil.
- O runtime r306 opera por autoridade pré-boot e hooks de renderer, sem `MutationObserver`, `setInterval` ou `setTimeout` de reconciliação visual.

## 1.0.91 — 2026-09-16 — Web r300

### Perfil / Watchlist
- `Séries Watchlist` e `Filmes Watchlist` recebem o mesmo tratamento visual clicável aplicado aos cards esportivos de estatísticas, preservando as ações já existentes desses contadores.

### Esportes
- Remove a aba `Ao vivo` do DOM efetivamente renderizado pela autoridade r255, em vez de tentar alterar constantes privadas fora do escopo do renderer.
- A navegação fica exatamente na ordem `Próximos`, `Anteriores`, `Assistidos`, `Favoritos`.
- Sessões antigas que ainda estejam em `live` retornam para `Próximos`; uma barreira CSS impede que controles `Ao vivo` legados reapareçam durante repaints.
- Corrige a divergência mostrada no vídeo de 16/09, em que a aba `Ao vivo` ainda exibia partidas de 12/09.

### Descobrir
- Adiciona recuperação finita para `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` quando o fluxo herdado permanece preso em `Carregando títulos…`.
- O fallback usa TMDB, respeita o filtro Filme/Série e a autoridade pessoal existente, e pinta pelo renderer real r288 sem observer ou `setInterval` perpétuo.
- `Pra Você` 1+3+3 e `Top 10` permanecem sob as autoridades específicas das releases anteriores.

### Build / validação
- Web atualizada para `1.0.91 / r300-official-1.0.91`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressão Chromium reproduzindo os pontos do vídeo: Watchlist com estilo clicável, cinco abas esportivas legadas reduzidas para quatro na ordem aprovada e detecção do loading persistente do Descobrir.

## 1.0.90 — 2026-09-16 — Web r299

### Perfil / histórico esportivo
- `Eventos assistidos` passa a ser clicável e abre o histórico esportivo do usuário.
- `Jogos no Estádio` passa a ser clicável e abre somente os eventos marcados presencialmente.
- As listas exibem evento, competição e data quando disponíveis, sem mostrar nome do estádio.

### Presença no estádio
- O fluxo real de Esportes mantém somente `📺 Assistido na TV / Tela` e `🏟️ Fui ao Estádio`.
- A opção presencial salva `attended_in_person = true` com `stadium_name = null`; o campo legado para digitar o estádio deixa de participar da interface.
- Badges presenciais mostram apenas `🏟️ No Estádio`.

### Build / validação
- Web atualizada para `1.0.90 / r299-official-1.0.90`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona testes estáticos e Chromium para os dois históricos clicáveis e para o fluxo presencial sem captura de nome do estádio.

## 1.0.89 — 2026-09-15 — Web r298

### Esportes / presença presencial
- Intercepta o botão esportivo real `data-ct255-watch` antes do handler legado e disponibiliza a escolha TV/Tela ou Estádio.
- Registros presenciais usam o RPC canônico de histórico esportivo e recebem badge `🏟️ No Estádio`.

### Perfil
- `Jogos no Estádio` deixa de ser inserido em uma grade genérica próxima de Séries e passa a existir somente no painel semântico `Esportes assistidos`.

### Descobrir / Pra Você
- Introduz pipeline finito que aguarda autoridade pessoal, memória de recomendações e pools TMDB antes da pintura.
- A composição fica em `Indicação do Dia` com 1 Filme, `Da sua Watchlist` com Filme + Série + Anime e `100% Novos` com Filme + Série + Anime, sem duplicações.
- Falta real de candidato passa a produzir estado explícito em vez de spinner infinito.

### Build / validação
- Web atualizada para `1.0.89 / r298-official-1.0.89`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões Chromium para o botão esportivo real, posição da métrica no Perfil e composição 1+3+3 do `Pra Você`.

## 1.0.88 — 2026-09-15 — Web r297

### Boot / tela preta
- Corrige a tela preta/vazia pública introduzida no bundle da r296: `runtime-r295-browse-actions-self-scope-fix.js` podia lançar `r295 browse self-scope fix missing r295 authority` antes de `boot()`, interrompendo a aplicação com `#app` vazio.
- A proteção r295 deixa de derrubar o bundle durante a inicialização legítima e mantém fallback compatível com as regressões históricas.

### Descobrir / donos reais de execução
- A validação do bundle final identificou a causa arquitetural complementar: desde a r288 os renderers/carregador vivos do Descobrir são `window.__ctR288PaintBrowse`, `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`; r295/r296 ainda interceptavam nomes legados que não eram os donos efetivos em produção.
- Adiciona `runtime-r297-live-discover-owner-bridge.js`, conectando a autoridade pessoal da r295 e as regras rígidas da r296 diretamente aos três donos reais r288.
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` passam pela exclusão canônica de vistos/Watchlist no renderer efetivamente usado pela página e recebem as ações r295 no mesmo caminho.
- `Pra Você` executa sanitização pessoal + composição rígida r296 antes da pintura real, preservando nota >= 7,5, ano > 1990, exclusões de Drama/Documentário-only e WWE, zero duplicatas e anti-repetição de 7 dias.
- O carregador vivo passa a aguardar a autoridade pessoal nos fluxos públicos/Calendário/Pra Você sem reconstruir a página inteira.

### Build / validação
- Web atualizada para `1.0.88 / r297-official-1.0.88`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressão Chromium específica com os mesmos nomes `window.__ctR288...` do bundle oficial, cobrindo exclusão de vistos/Watchlist, ações, `Pra Você` rígido e chamada ao carregador autorizado.
- Adiciona regressão Chromium do bundle final completo `app-v297.js`, exigindo `boot()` real, `#app` preenchido, ausência de page error e os três hooks r297 conectados.
- O `production_smoke` valida identidade r297, assets públicos e DOM renderizado antes de considerar a release concluída.
- Todo o escopo funcional da r296 permanece preservado: quatro abas de Esportes, presença no estádio, métrica do Perfil e polimento Web.

## 1.0.87 — 2026-09-15 — Web r296

### Pra Você / autoridade rígida
- Endurece a elegibilidade global para TMDB >= 7,5 e ano > 1990, excluindo títulos compostos exclusivamente por Drama/Documentário e ampliando a barreira absoluta contra WWE, incluindo Raw, SmackDown, NXT, WrestleMania, Royal Rumble, SummerSlam, Survivor Series, Money in the Bank e Elimination Chamber.
- A memória de recomendação passa a usar explicitamente `shown_recommendations` com janela móvel de 7 dias por usuário, mantendo fallback local equivalente para evitar repetição mesmo em indisponibilidade temporária do backend.
- A composição visível fica rigidamente separada em `Indicação do Dia` com um Filme, `Da sua Watchlist` com Filme + Série + Anime e `100% Novos` com Filme + Série + Anime, sem repetir a mesma mídia na mesma tela.
- O refresh/troca continua local ao bloco do Descobrir, sem recarregar a página inteira, e a r296 preserva as exclusões canônicas de vistos/Watchlist e os filtros combináveis do Calendário introduzidos na r295.

### Esportes / histórico presencial
- A navegação de Esportes é reduzida para exatamente quatro abas: `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; `Ao vivo` deixa de ser uma quinta aba independente.
- `Próximos` aceita somente eventos do dia corrente em `America/Sao_Paulo`; `Anteriores` limita o histórico operacional às últimas 72 horas; `Favoritos` mantém somente eventos de entidades favoritas e `Assistidos` usa o histórico persistido do usuário.
- `user_sport_watch_history` recebe `attended_in_person boolean default false` e `stadium_name text`, preservando compatibilidade com registros anteriores.
- `Marcar como assistido` abre um popover compacto com `📺 Assistido na TV / Tela` ou `🏟️ Fui ao Estádio (In Loco)`; no segundo caso o nome do estádio é opcional.
- Eventos presenciais recebem o badge âmbar `🏟️ No Estádio` em Assistidos e o Perfil passa a incluir a métrica `Jogos no Estádio`.

### Polimento Web
- `Assistir a Seguir` recebe padding/gap mais compacto, hierarquia tipográfica mais limpa e botão canônico de visto em 40x40, arredondado e com tratamento esmeralda.
- Métricas e pôsteres do Perfil ganham superfície translúcida, borda suave, raio consistente e hover discreto.
- Formulários de Configurações passam a compartilhar tratamento translúcido, borda/foco ciano e botões arredondados.
- Sidebar/containers laterais recebem glassmorphism sutil com fundo preto translúcido, borda branca de 10% e blur, preservando o bloqueio de overflow horizontal global.

### Build / validação
- Web atualizada para `1.0.87 / r296-official-1.0.87`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r296 adiciona testes estáticos e Chromium para composição sem duplicatas, filtros WWE/Drama/Documentário/nota/ano, quatro janelas de Esportes, métrica de estádio e identidade final do bundle.

## 1.0.86 — 2026-09-15 — Web r295

### Descobrir / autoridade pessoal
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` passam por uma autoridade unificada de histórico + Watchlist antes da pintura.
- A autoridade une `cinetracker_recommendation_state_v108`, `cinetracker_profile_media_dashboard_v0997_fast` e `cinetracker_list_snapshot_v247`, reduzindo vazamentos quando uma fonte individual estiver atrasada ou incompleta.
- Cards dessas cinco áreas preservam `+ Playlist` e recebem `✓ Visto`; após qualquer uma das ações, o título é retirado imediatamente da seleção atual e do estado local elegível.

### Calendário
- Adiciona filtros `Todos / Filmes / Séries` como eixo exclusivo e `Watchlist` como toggle independente.
- Permite combinações reais, inclusive `Séries + Watchlist` e `Filmes + Watchlist`.
- A coleta do Calendário deixa de depender da exclusão geral que removia a Watchlist antes da interface; itens futuros da Watchlist são mesclados e, quando necessário, hidratados pelo TMDB antes da filtragem.

### Pra Você / Indicação do Dia
- `100% Novos` recebe uma segunda barreira canônica contra títulos assistidos e títulos da Watchlist antes de toda pintura, mantendo as regras da r293 (TMDB >= 7,5, ano > 1990, sem WWE/Raw/SmackDown e sem repetição semanal).
- `Indicação do Dia` deixa de reutilizar picks antigos/Watchlist e passa a escolher somente um título válido do pool `100% Novos`, com seleção determinística por dia.
- Remove filtros `blur`/`backdrop-filter` herdados do bloco da indicação e solicita pôster de resolução maior quando a ponte de imagem está disponível.

### Build / validação
- Web atualizada para `1.0.86 / r295-official-1.0.86`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r295 adiciona validação estática e Chromium cobrindo união de estados pessoais, exclusão de vistos/Watchlist, ações Playlist/Visto, combinação `Séries + Watchlist`, `100% Novos` e Indicação do Dia sem blur.

## 1.0.85 — 2026-09-15 — Web r294

### Descobrir / densidade visual
- Corrige a composição mostrada no vídeo de validação: texto, ações e barra horizontal deixam de ficar excessivamente afastados e passam a formar um bloco vertical compacto.
- Cards Web desktop passam de 176x264 para 158x237; mobile Web preserva 154x231.
- O bloco de texto cai de 80px para 52px no desktop, mantendo título e metadados em uma linha com reticências.
- Gap horizontal dos trilhos cai de 16px para 8px e a reserva inferior do scroll de 16px para 6px.

### Top 10
- A geometria desktop passa a permitir 10 cards completos em uma linha na referência de 1920px usada no vídeo, em vez de exibir apenas 9 antes do scroll.
- O trilho continua com scroll horizontal local para viewports menores, sem reintroduzir overflow horizontal no documento.

### Ações / barra de rolagem
- Rodapé de Playlist/Trocar passa a fazer parte da altura efetiva do card/slot; os botões ficam acima da barra horizontal em vez de vazarem para a área inferior do scroller.
- Altura dos controles cai para 28px, com gap de 4px e margem superior de 2px.
- A faixa de ações de Títulos Relacionados/Semelhantes recebe a mesma compactação, preservando a autoridade de clique/ID da r286/r292/r293.

### Build / validação
- Web atualizada para `1.0.85 / r294-official-1.0.85`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r294 adiciona teste Chromium em viewport 1920x1032 para validar 10 cards no Top 10, 158x237, texto de 52px, footer contido no card e ordem conteúdo -> ações -> scrollbar.

## 1.0.84 — 2026-09-15 — Web r293

### Descobrir / navegação
- Remove a aba `Lançamentos`, introduzida sem autorização na r288, da fonte `DTABS263`, do mapa de labels e do DOM; qualquer reconstrução antiga que tente recriá-la é saneada novamente.
- Caso uma sessão antiga esteja parada em `releases`, a navegação volta para `Novidades` sem criar outra aba substituta.

### Pra Você
- `100% Novos` volta a significar novo para o usuário, e não lançamento recente: mantém TMDB >= 7,5, ano > 1990, exclusão de WWE/Raw/SmackDown, histórico/assistidos, Watchlist e repetição semanal, mas elimina o limite inferior de data dos últimos 30 dias.
- O catálogo candidato pode usar qualquer título já lançado até hoje, preservando pools independentes de Filme, Série e Anime.
- `Da sua Watchlist` continua baseado no estado canônico `cinetracker_recommendation_state_v108`, removendo itens já vistos e descartando mídias sem identidade/pôster válidos.
- Slots sem candidato real deixam de produzir card cinza/`Indisponível`; somente categorias com item válido são renderizadas.
- `↻ Trocar` em `100% Novos` remove o item atual do pool da sessão, registra a exibição na semana e pinta o próximo candidato válido, evitando retorno ao mesmo item durante a semana.
- A r293 detecta repaints herdados da r292 e reaplica sua autoridade quando o pool antigo tentar sobrescrever o estado corrigido.

### Botões / relacionados
- Ações de Watchlist/Visto dos títulos relacionados/semelhantes são agrupadas em uma faixa própria dentro do card, sem sobrepor pôster/título e sem escapar para outras áreas da tela.
- A autoridade de clique/ID da r286/r292 é preservada: pôster/título abre a mídia correta e Watchlist/Visto continuam usando tipo + TMDB do próprio card.
- Nos três slots do Pra Você, Playlist permanece à esquerda e `↻ Trocar` à direita em footer estável.

### Build / validação
- Web atualizada para `1.0.84 / r293-official-1.0.84`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r293 adiciona validação estática e Chromium para remoção de `Lançamentos`, catálogo sem limite de 30 dias, exclusões canônicas, três categorias válidas, ausência de placeholders, troca semanal e posição das ações.

## 1.0.83 — 2026-09-15 — Web r292

### Títulos Relacionados / Semelhantes
- Clique no pôster ou título mantém autoridade própria e abre imediatamente a rota correta de filme/série pelo TMDB da mídia clicada.
- Watchlist usa o ID/tipo do próprio card, executa de forma assíncrona e atualiza o controle sem fechar o modal; a autoridade r286 permanece preservada e a r292 cobre também estruturas genéricas de relacionados/semelhantes.

### Descobrir / Pra Você
- `Da sua Watchlist` passa a reconstruir os candidatos a partir do estado canônico `cinetracker_recommendation_state_v108`, removendo itens já vistos e hidratando Filme, Série e Anime separadamente.
- `100% Novos` ganha pools independentes de Filme, Série e Anime, com TMDB >= 7.5, ano > 1990, exclusão de WWE/Raw/SmackDown, exclusão da Watchlist e do conjunto semanal `fresh_excluded`.
- `Trocar` opera somente sobre pools válidos por categoria; os índices são normalizados após cada atualização para não cair em posição inexistente.

### Cards / layout
- Título e metadados ficam rigidamente em uma linha com `line-clamp-1`, `white-space: nowrap` e reticências.
- Botões de Watchlist e `Trocar` ficam compactos em 30px, preservando o coração sobreposto no pôster e a geometria 154x231 mobile / 176x264 desktop herdada da r290/r291.
- A janela continua sem scroll horizontal; os trilhos permanecem locais.

### Build / validação
- Web atualizada para `1.0.83 / r292-official-1.0.83`; Android permanece `1.0.20 / versionCode 10062`.
- CI da r292 valida sintaxe, build oficial, regressões herdadas, Chromium para clique/Watchlist dos relacionados, pools Filme/Série/Anime do Pra Você, filtros de elegibilidade, bundle final exato e `production_smoke`.

## 1.0.82 — 2026-09-15 — Web r291

### Descobrir / ações
- `+ Playlist` / `✓ Salvo` deixam a área de título e metadados e passam para o footer ao lado de `↻ Trocar`, em layout horizontal sem sobreposição.
- Títulos e metadados ficam isolados dos controles, com uma linha, `line-clamp-1` e truncamento por reticências.

### Favoritos
- Cada card de mídia do Descobrir recebe um coração minimalista sobre o pôster, com estado otimista instantâneo e persistência `media_overrides.state = 'Liked'`.

### Carrosséis
- Trilhos do Descobrir, Top 10 e Pra Você mantêm scroll horizontal local com snap, `pan-x` e arraste por ponteiro; a janela permanece sem overflow horizontal.

## Histórico anterior
O histórico completo da Web 1.0.0 até a 1.0.81/r290 permanece preservado integralmente em `docs/releases/CHANGELOG-through-1.0.81.md` e no histórico Git.

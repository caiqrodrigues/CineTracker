# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.8`  
**Web em código:** `0.4.9`  
**Android publicado:** `0.0.48`  
**Android em código:** `0.0.49`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android devem manter paridade funcional, exceto recursos explicitamente nativos como notificações.
- Implementado/compilado não significa validado.

## 2. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode` sempre crescente.
- O APK 0.0.48 publicado foi validado com SHA-256 `fe69519cd5669429446e4701cd5d0ad78c5a936b3130f27e478a05c0591353d3`.
- O build 0.0.49 compila, porém o cache do GitHub restaurou uma chave cujo certificado é `fcac3a6a0bfdaf475adc8044b6c040cfe9c241dd36427a4c6b649a21475f2790`.
- Portanto a 0.0.49 NÃO deve ser publicada nem entregue como atualização enquanto a chave privada correspondente ao baseline da 0.0.48 não for recuperada. Não mascarar esse bloqueio trocando o baseline.

## 3. Android 0.0.49 — código pronto, publicação bloqueada

Runtime: `ct41.js` + `ct47.js` + `ct48.js` + `ct49.js`.

- `Home > Continuar assistindo` usa exatamente itens `status='following'`, a mesma origem de `Assistir > Acompanhando`.
- Home e Acompanhando têm botão de check para marcar o próximo episódio como visto.
- O próximo episódio é determinado por `cinetracker_episode_state` + metadados TMDB.
- A marcação persiste via `cinetracker_set_episode_watched` e invalida a leitura de progresso.
- Descobrir identifica os contêineres reais de cards e força 3 colunas.
- Configurações exibe `0.0.49`.
- Notificações nativas permanecem inalteradas.

## 4. Web 0.4.9 — código pronto, deploy pendente

- mesma sincronização Home ↔ Acompanhando;
- check do próximo episódio nas duas áreas;
- Descobrir em três colunas;
- `patch-v047.js` também reconhece o runtime Android 0.0.48, permitindo aplicar essas correções ao APK 0.0.48 quando a Web 0.4.9 estiver em produção;
- deploy automático bloqueado atualmente pelo limite de builds do Vercel.

## 5. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## 6. Próximos passos obrigatórios

1. Recuperar a chave privada que gerou o certificado `fe69519...53d3` da 0.0.48, ou assumir explicitamente uma nova migração de assinatura antes de publicar outro APK.
2. Publicar Web 0.4.9 assim que o Vercel liberar novo build; isso também corrige a experiência do Android 0.0.48 sem novo APK.
3. Validar em aparelho: Home=Acompanhando, check do próximo episódio e Descobrir em três colunas.

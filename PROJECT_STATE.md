# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.9`  
**Web 0.5.0:** código pronto; último deploy pode aguardar limite do Vercel  
**Android publicado:** `0.0.50`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android mantêm paridade funcional, exceto recursos nativos como notificações e botão físico Voltar.
- Implementado/compilado não significa validado.
- Toda versão atualiza código, documentação, versionamento e pipelines; Android exige Release + APK.

## 2. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode`: `50`.
- `versionName`: `0.0.50`.
- A 0.0.50 foi publicada com sucesso e passa a ser a base de assinatura atual.
- Baseline SHA-256 registrado pelo CI: `651e737a4e1de5d5db89773116528cd3ab3b0764a736dbd12dd8894fcc55bae7`.
- Próximas versões devem manter esse certificado; não trocar assinatura silenciosamente.

## 3. Android 0.0.50

Runtime: `ct41.js` + `ct47.js` + `ct48.js` + `ct49.js` + `ct50.js`.

### Progresso inteligente

- Ao marcar um episódio posterior, verifica os episódios anteriores da mesma temporada.
- Se houver lacunas, pergunta se o usuário já viu os anteriores.
- Confirmando, usa `cinetracker_mark_episode_through` para marcar do episódio 1 até o selecionado.
- `cinetracker_set_episode_watched` continua registrando progresso e histórico manual.

### Home / Assistir

- `Home > Continuar assistindo` e `Assistir > Acompanhando` usam a mesma origem de dados.
- Home tem rolagem horizontal e cards clicáveis para abrir a série.
- Acompanhando é ordenado pelo `last_watched_at` mais recente, portanto a série vista por último sobe para a frente.
- Após marcar progresso, a interface e o Perfil são invalidados/recalculados imediatamente.

### Navegação

- O botão/gesto Voltar do Android tenta primeiro `ct50Back()`.
- Série/episódio voltam para a tela interna anterior antes de sair do app.

### Descobrir

- A camada final identifica os containers reais dos cards e força três colunas compactas no mobile, com posters 2:3.

### Onde assistir

- TMDB Watch Providers para região `BR` informa streaming, aluguel e compra quando disponíveis.
- Filmes recentes podem receber indicação de `Cinema / lançamento` quando aplicável.

### Notificações

- Permanecem nativas do Android e preservadas.

## 4. Backend 0.0.50 / Web 0.5.0

Migration `activity_order_smart_episode_and_movie_watch_v050`:

- `cinetracker_continue_items_v2` passa a ordenar Acompanhando por atividade recente;
- `cinetracker_mark_episode_through` marca uma sequência de episódios;
- `cinetracker_set_state` grava `watched_at` e histórico manual de filme quando marcado como visto;
- estatísticas de Perfil usam os dados persistidos e podem refletir a mudança imediatamente.

Migration `restrict_progress_notification_rpcs_v050` restringe RPCs sensíveis de progresso/notificação a usuários autenticados.

## 5. Web 0.5.0

`patch-v050.js` leva para Web as funções não nativas da 0.0.50:

- marcação inteligente;
- ordenação recente;
- atualização imediata do progresso;
- disponibilidade via Watch Providers;
- Descobrir em três colunas.

Notificações e botão físico Voltar continuam exclusivos do Android.

## 6. Validação pendente

Android: testar em aparelho Home rolável/clicável, Voltar interno, confirmação dos episódios anteriores, ordenação recente, atualização imediata do Perfil, Onde assistir e três colunas em Descobrir.

Web 0.5.0: validar após o próximo deploy de produção bem-sucedido no Vercel.

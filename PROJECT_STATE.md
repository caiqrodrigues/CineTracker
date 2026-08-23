# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.9`  
**Web em implementação:** `0.5.0`  
**Android publicado:** `0.0.49`  
**Android em implementação:** `0.0.50`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android devem manter paridade funcional, exceto recursos explicitamente nativos como notificações.
- Implementado/compilado não significa validado.
- Toda versão deve atualizar código, documentação, versionamento e pipelines; Android exige também APK + Release.

## 2. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode` sempre crescente.
- A 0.0.49 foi autorizada como reinstalação única e passou a ser a nova base permanente de assinatura.
- Baseline SHA-256 atual: `277a81b60c689c801ea9d45a311de29c2e5ed97fdc5bea0f4705f8531153e1ed`.
- 0.0.50+ devem reutilizar o cache `cinetracker-signing-v3-0.0.49`; o CI falha se package ou certificado divergirem.

## 3. Android 0.0.50

Runtime final: `ct41.js` + `ct47.js` + `ct48.js` + `ct49.js` + `ct50.js`.

### Progresso inteligente

- Ao marcar um episódio posterior como visto, o app verifica o estado real da temporada.
- Se houver episódios anteriores não vistos, pergunta se o usuário já os assistiu.
- Confirmando, marca automaticamente os anteriores da mesma temporada e depois o episódio selecionado.
- Toda mudança dispara invalidação/atualização visual imediata.

### Home / Assistir

- `Continuar assistindo` e `Assistir > Acompanhando` continuam consumindo a mesma origem.
- Home recebe rolagem horizontal explícita e cards clicáveis para abrir a série.
- Acompanhando é ordenado por atividade recente (`last_watched_at`, `last_activity_at`, `last_seen_at`, `watched_at` ou `updated_at`, nessa prioridade de fallback).
- A série cujo episódio foi visto mais recentemente sobe para o início.

### Navegação Android

- O botão/gesto Voltar chama primeiro `ct50Back()`.
- Detalhes de série/episódio retornam à tela interna anterior.
- Se não houver histórico interno, volta para Home; depois disso o Android pode sair do app.

### Estatísticas

- Após marcar episódio/filme como visto, a camada final dispara atualização da interface e, no Perfil, nova renderização para refletir totais imediatamente.

### Disponibilidade

- TMDB Watch Providers com região `BR` é usado para mostrar plataformas de streaming/locação/compra quando disponíveis.
- Filmes recentes sem provider digital podem indicar `Cinema / lançamento` como fallback de janela de lançamento.

### Descobrir

- Nova detecção dos containers reais de cards.
- Força `repeat(3, minmax(0, 1fr))` com posters 2:3 e conteúdo compacto.

### Notificações

- Permanecem exclusivas do Android e sem mudança funcional nesta versão.

## 4. Web 0.5.0

- Paridade com Android 0.0.50, exceto notificações e integração do botão físico Voltar.
- Marcação inteligente dos episódios anteriores da temporada.
- Ordenação de Acompanhando por atividade recente.
- Atualização visual imediata após progresso.
- Disponibilidade de streaming via TMDB Watch Providers.
- Descobrir reforçado em três colunas.
- `patch-v050.js` carregado por último.

## 5. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## 6. Validação pendente

### Android 0.0.50

- confirmar build/release assinados pelo baseline da 0.0.49;
- confirmar atualização por cima da 0.0.49;
- confirmar Voltar interno;
- confirmar marcação inteligente de episódios anteriores;
- confirmar ordenação por atividade recente;
- confirmar Home rolável/clicável;
- confirmar Perfil atualizado imediatamente;
- confirmar disponibilidade e três colunas em Descobrir.

### Web 0.5.0

- confirmar deploy real;
- validar marcação inteligente, ordenação, disponibilidade e três colunas.

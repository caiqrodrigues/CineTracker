# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.9`  
**Web 0.5.0:** código pronto  
**Android publicado:** `0.0.50`  
**Android em build:** `0.0.51`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android mantêm paridade funcional, exceto recursos nativos como notificações e botão físico Voltar.
- Implementado/compilado não significa validado.
- Toda versão atualiza código, documentação, versionamento e pipelines; Android exige Release + APK.

## 2. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- Baseline atual: APK 0.0.50.
- SHA-256: `651e737a4e1de5d5db89773116528cd3ab3b0764a736dbd12dd8894fcc55bae7`.
- 0.0.51 usa `versionCode 51`, `versionName 0.0.51` e só é publicada se o CI confirmar o mesmo certificado.

## 3. Causa confirmada dos bugs 0.0.50

A 0.0.50 injetava em sequência `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js` e `ct50.js`. Esses módulos mantinham handlers e MutationObservers próprios. Em aparelho, isso gerou disputa por navegação e renderização: o clique de `Continuar assistindo` podia abrir outra view (inclusive Estatísticas), o carrossel não respondia corretamente e telas antigas reapareciam.

## 4. Android 0.0.51 — runtime consolidado

A Activity injeta somente `ct51.js`.

### Home

- `Continuar assistindo` vem de `cinetracker_continue_items_v2`, filtrado em `following`, a mesma origem de Assistir/Acompanhando.
- Carrossel horizontal com `touch-action: pan-x`, `overflow-x:auto` e scroll snap.
- Clique no card abre diretamente `openDetail(tv, tmdb_id)`; não navega por uma aba intermediária.
- Check do próximo episódio disponível na Home.

### Assistir

- Carrossel padrão; Grade e Lista disponíveis.
- Ordem: Em dia → Acompanhando → Juntando poeira → Não iniciadas.
- Após renderizar, posiciona Acompanhando no topo da viewport.
- Acompanhando ordenado por `last_watched_at` decrescente.

### Série / episódios

- Série abre ficha própria.
- Temporadas expansíveis.
- Episódios clicáveis com tela individual.
- Botão de visto em cada episódio.
- Se marcar episódio posterior e houver anteriores não vistos na temporada, pergunta se deve marcar os anteriores; confirmação usa `cinetracker_mark_episode_through`.

### Navegação

- O botão Assistir da barra nativa agora chama `assist`, não `library`.
- Botão/gesto Voltar chama `ct51Back()` e percorre a pilha interna antes de sair.

### Descobrir

- Runtime aplica 3 colunas compactas aos containers reais de `.card` e posters 2:3.

### Disponibilidade

- Ficha consulta TMDB Watch Providers para região BR e exibe provedores quando disponíveis.

### Configurações

- Exibe `0.0.51` e remove duplicações de build Android encontradas no DOM.

### Notificações

- WorkManager e infraestrutura nativa permanecem preservados; não fazem parte da consolidação visual.

## 5. Backend

RPCs relevantes:

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_mark_episode_through`
- `cinetracker_profile_stats`
- `cinetracker_due_notifications`

## 6. Validação pendente da 0.0.51

- confirmar instalação por cima da 0.0.50;
- confirmar Home rolável horizontalmente;
- confirmar clique da Home abrindo série, nunca Estatísticas;
- confirmar abertura temporada → episódio;
- confirmar check do próximo episódio e marcação inteligente;
- confirmar Voltar interno;
- confirmar Acompanhando reordenando após novo episódio visto;
- confirmar 3 cards por linha em Descobrir;
- confirmar disponibilidade em detalhes;
- confirmar Configurações mostrando somente build 0.0.51.

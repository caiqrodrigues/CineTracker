# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.9`  
**Web 0.5.0:** código pronto  
**Android publicado:** `0.0.51`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android mantêm paridade funcional, exceto recursos nativos como notificações e botão físico Voltar.
- Implementado/compilado não significa validado.
- Toda versão atualiza código, documentação, versionamento e pipelines; Android exige Release + APK.

## 2. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode`: `51`.
- `versionName`: `0.0.51`.
- A 0.0.51 criou uma nova chave `v5`, persistida no cache após o build bem-sucedido.
- Baseline SHA-256 atual: `d4954df3952a7bd63519db79e7369ff55e5fe3d330aa4d5630287621cc79fd43`.
- 0.0.52+ devem reutilizar `cinetracker-signing-v5-0.0.51-stable` e falhar se o certificado divergir.

## 3. Causa confirmada dos bugs 0.0.50

A 0.0.50 injetava `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js` e `ct50.js` na mesma WebView. Cada módulo mantinha handlers e observers próprios. Em aparelho, isso causou disputa de navegação e renderização: `Continuar assistindo` podia cair em outra view, o gesto horizontal não era confiável e telas antigas reapareciam.

## 4. Android 0.0.51 — runtime consolidado

A Activity injeta somente `ct51.js`.

### Home

- `Continuar assistindo` usa `cinetracker_continue_items_v2`, filtrado em `following`, a mesma origem de Assistir/Acompanhando.
- Carrossel horizontal com `overflow-x:auto`, `touch-action:pan-x` e scroll snap.
- Clique no card chama a ficha diretamente pelo TMDB ID; não passa por Estatísticas nem por outra aba intermediária.
- Check do próximo episódio disponível na Home.

### Assistir

- Carrossel padrão; Grade e Lista disponíveis.
- Ordem: Em dia → Acompanhando → Juntando poeira → Não iniciadas.
- Abertura reposiciona a viewport em Acompanhando.
- Acompanhando ordenado por `last_watched_at` decrescente.

### Série / episódios

- Série abre ficha própria com poster, sinopse e Onde assistir.
- Temporadas expansíveis.
- Episódios clicáveis com tela individual.
- Check por episódio.
- Ao marcar episódio posterior, se houver anteriores não vistos, pergunta se devem ser marcados também; confirmação usa `cinetracker_mark_episode_through`.

### Navegação

- Botão Assistir da barra nativa chama `assist`, não `library`.
- Botão/gesto Voltar chama `ct51Back()` e percorre a pilha interna antes de sair.

### Descobrir

- Runtime força três colunas compactas para containers reais de `.card`, com poster 2:3.

### Configurações

- Exibe `0.0.51` e remove build Android duplicada no DOM.

### Notificações

- WorkManager e infraestrutura nativa permanecem preservados.

## 5. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_mark_episode_through`
- `cinetracker_profile_stats`
- `cinetracker_due_notifications`

## 6. Validação pendente da 0.0.51

- confirmar instalação e login;
- confirmar Home rolável horizontalmente;
- confirmar clique da Home abrindo série, nunca Estatísticas;
- confirmar temporada → episódio;
- confirmar check do próximo episódio e marcação inteligente;
- confirmar Voltar interno;
- confirmar Acompanhando reordenando após episódio visto;
- confirmar três cards por linha em Descobrir;
- confirmar Onde assistir;
- confirmar Configurações mostrando somente build 0.0.51.

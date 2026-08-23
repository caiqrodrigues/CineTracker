# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.9`  
**Web 0.5.0:** código pronto  
**Android publicado:** `0.0.52`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android mantêm paridade funcional, exceto recursos nativos como notificações e botão físico Voltar.
- Implementado/compilado não significa validado.
- Toda versão atualiza código, documentação, versionamento e pipelines; Android exige Release + APK.

## 2. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode`: `52`.
- `versionName`: `0.0.52`.
- A 0.0.52 estabelece a chave estável `v6`, persistida no cache após build bem-sucedido.
- Baseline SHA-256: `231fab65f7af070000c37788e18ba7b1eaec3b40f87dd4772955ff241e8b57b7`.
- 0.0.53+ devem restaurar a mesma chave `v6` e falhar se o certificado divergir.

## 3. 0.0.51 reprovada

A 0.0.51 substituiu todos os módulos Android por `ct51.js`. Em teste real, o aplicativo deixou de carregar corretamente e a versão foi reprovada. Ela não deve ser considerada base funcional.

## 4. Android 0.0.52 — recuperação estável

A Activity volta a carregar a pilha que efetivamente funcionava antes da regressão:

`ct41.js + ct47.js + ct48.js + ct49.js + ct50.js + ct52.js`

`ct52.js` é propositalmente pequeno e corrige apenas os pontos pendentes, evitando reescrever o aplicativo inteiro.

### Home / Continuar assistindo

- Mantém a mesma origem de dados de Acompanhando.
- Rolagem horizontal reforçada com `display:flex`, `overflow-x:auto`, `touch-action:pan-x` e scroll snap.
- Clique no card abre diretamente a ficha da série pelo TMDB ID; não passa por Estatísticas nem por aba intermediária.
- Botões dentro do card continuam independentes do clique do card.

### Série / temporada / episódio

- Ficha da série com poster, temporadas e episódios.
- Episódios abrem tela própria.
- Check por episódio.
- Marcação inteligente pergunta sobre episódios anteriores da mesma temporada.

### Navegação

- Barra inferior nativa volta a usar o fluxo estável anterior.
- Botão/gesto Voltar chama primeiro `ct52Back()`, depois o fallback `ct50Back()`.

### Descobrir

- Reforço final em JavaScript identifica containers reais de cards e aplica três colunas compactas.

### Configurações

- Exibe build `0.0.52` e remove identificação duplicada no rodapé.

### Notificações

- WorkManager e notificações nativas permanecem preservados.

## 5. Validação

O CI da 0.0.52 passou: sintaxe dos módulos carregados, compilação Gradle, package `com.cinetracker.app`, assinatura e publicação da Release.

Ainda depende de validação em aparelho para comportamento visual e interação real. Não marcar essas etapas como comprovadas antes do teste do usuário.

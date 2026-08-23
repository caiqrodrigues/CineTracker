# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web publicada:** `0.4.9`  
**Web 0.5.0:** código pronto  
**Android em publicação:** `0.0.53`

## 1. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android mantêm paridade funcional, exceto recursos nativos como notificações e botão físico Voltar.
- Implementado/compilado não significa validado.
- Toda versão atualiza código, documentação, versionamento e pipelines; Android exige Release + APK.

## 2. Base Android válida

A última base confirmada pelo usuário como funcional é a tag `android-v0.0.49`.

A 0.0.53 restaura deliberadamente essa arquitetura e não carrega os runtimes experimentais posteriores:

`ct41.js + ct47.js + ct48.js + ct49.js + ct53.js`

`ct53.js` contém somente correções incrementais solicitadas após a 0.0.49.

## 3. Correções 0.0.53

### Marcação inteligente
- Ao marcar um episódio posterior, consulta o estado real da temporada.
- Se houver episódios anteriores não vistos, pergunta se o usuário já os viu.
- Confirmando, usa `cinetracker_mark_episode_through` ou fallback sequencial.

### Home / Continuar assistindo
- Mantém a origem de `Acompanhando` da base 0.0.49.
- Rolagem horizontal recebe `touch-action: pan-x`, `overflow-x:auto` e scroll snap.
- Card de série passa a abrir a série; botão de check continua independente.

### Voltar Android
- Primeiro tenta o botão interno da ficha/episódio.
- Fora das fichas, retorna para a aba anterior registrada na navegação nativa.
- Só sai do app quando não existe histórico interno.

### Descobrir
- Detecta os containers reais que possuem cards e força `repeat(3,minmax(0,1fr))` com largura mínima zerada.

### Acompanhando
- Ordenação por `last_watched_at`, com fallbacks de atividade/atualização.
- Após marcar episódio, a lista é reordenada novamente.

### Atualização imediata
- Marcação de episódio dispara evento `cinetracker:data-changed`, atualiza Home/Acompanhando e força nova leitura das estatísticas quando Perfil estiver aberto.
- Ações de filme marcadas como visto também disparam atualização das áreas dependentes.

### Onde assistir
- Consulta `/watch/providers` do TMDB para Brasil.
- Exibe provedores disponíveis nos cards suportados.
- Filmes recentes podem receber indicação `Cinema / lançamento`.

### Notificações
- WorkManager e notificações nativas existentes permanecem preservados.

## 4. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode`: `53`.
- `versionName`: `0.0.53`.
- Usa a chave estável `v6` persistida pela 0.0.52.
- O CI compara a assinatura gerada contra `ci-status/android-signing-baseline.sha256` e falha se divergir.

## 5. Validação

CI deve comprovar: sintaxe dos módulos efetivamente carregados, compilação Gradle, package, assinatura e publicação da Release.

Comportamento visual/interação em aparelho não deve ser marcado como validado até teste real do usuário.

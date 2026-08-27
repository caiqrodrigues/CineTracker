# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-27  
**Branch principal:** `main`  
**Release lógica em correção:** `0.99.2 FIX2`  
**Web:** `0.99.2`, cache `ct-web-0.99.2-fix2`, anti-freeze final `patch-v096-v0992-unfreeze.js`  
**Android:** `0.99.2`, `versionCode 9913`, bundle `v0.99.2-fix2-unfreeze-991-992-authoritative`  
**Backend lógico:** `0.99.2`, migration Home aplicada no Supabase  
**Windows:** não lançado

## 1. Governança
Toda atualização/mudança deve possuir versão, registro no GitHub, documentação e validação real. A 0.99.2 ainda não foi funcionalmente encerrada; por isso as correções continuam como **0.99.2 FIX2**, sem criar 0.99.3 artificialmente. Android pode aumentar `versionCode` dentro da mesma release lógica quando um APK defeituoso já foi publicado.

## 2. Histórico da falha real
A validação visual anterior mostrou produção incompleta/legada. Depois do primeiro 0.99.2 FIX, o usuário enviou novo vídeo e confirmou que **Web e APK estavam completamente travados**.

A revisão do runtime encontrou a causa raiz:
- `patch-v093-v0992.js` possui `MutationObserver` e chamava `footer()` a cada mutação;
- `footer()` reatribuía `textContent` mesmo com o mesmo valor;
- `patch-v095-v0992-fix.js` adicionou outro observer com comportamento semelhante em rodapé/cabeçalhos;
- atribuição de `textContent` substitui o text node e cria novo `childList MutationRecord`;
- o ciclo observer -> DOM -> observer saturava a main thread na Web e WebView Android.

Checks antigos não detectavam esse churn porque validavam presença/sintaxe/markers, não comportamento de MutationObserver em runtime.

## 3. Runtime final obrigatório
A pilha compartilhada termina em:
1. base v95 + recuperações estáveis;
2. 0.98 navegação/config/backup;
3. 0.99 Perfil LRU;
4. `patch-v092-v0991.js` — recursos 0.99.1;
5. `patch-v093-v0992.js` — Home Séries/Filmes 0.99.2;
6. `patch-v094-v0992-compat.js` — compatibilidade;
7. `patch-v095-v0992-fix.js` — navegação/escritas/perfil;
8. **`patch-v096-v0992-unfreeze.js` — anti-freeze final FIX2.**

A overlay global `patch-v068-v097.js` continua desativada.

## 4. O que o FIX2 resolve
- instala guarda idempotente para `Node.prototype.textContent`;
- atribuição de texto idêntico vira no-op, evitando MutationRecord redundante;
- guard entra antes dos observers atrasados de 250/500 ms começarem a observar `#app`;
- refresh inicial é coalescido por `requestAnimationFrame`;
- cache Web rotacionado para `ct-web-0.99.2-fix2`;
- Android sobe de `versionCode 9912` defeituoso para `9913`.

Marker obrigatório: `__ct0992UnfreezeLoaded` / `fix2-idempotent-dom-mutation-guard`.

## 5. Recursos preservados 0.99.1
- navegação final Home / Descobrir / Perfil / Configurações;
- Histórico integrado ao Perfil e fora do menu;
- Perfil com estatísticas compactas, Tempo Total duplo, timeline, detalhe por data e quatro métricas extras;
- Séries, Séries favoritas, Filmes e Filmes favoritos com filtros/layouts e expansões completas;
- favoritos no detalhe;
- Pra Você com 7 slots, ano >1990 e nota >=7,8;
- Calendário por último com Geral/Séries/Filmes;
- cards ricos de episódios e marcação inteligente;
- cinegrafia separada Filmes/Séries;
- Bingers dentro de Importar Dados;
- hardening de `profile_id` e `media_kind` do FIX anterior.

## 6. Home 0.99.2 — Séries
Viewport vertical com histórico Pull-to-Reveal. Ordem:
1. Assistir a seguir — pendências lançadas e atividade <=30 dias, ou novo episódio;
2. Juntando poeira — pendência e atividade >30 dias;
3. Em dia — sem pendência lançada;
4. Não Iniciadas / Watchlist — 0 episódios vistos;
5. Concluídas — `Completed`.

Cards: pôster 2:3, próximo `Sxx Exx`, assistidos/lançados, faltantes, nome/nota do episódio e ação ✓. Quick mark grava `watch_history` + `episode_progress`, atualiza `last_watched_at`, avança episódio, reordena LRU e move para Em dia quando não restam pendências.

## 7. Home 0.99.2 — Filmes
- Vistos ocultos por Pull-to-Reveal;
- Escolha para Hoje com rating >=8,0, nunca visto e sem repetição;
- Watchlist abaixo da recomendação;
- quick mark grava histórico + `AlreadySeen`.

## 8. Sincronização de lançamentos
`syncReleaseStates()` roda no primeiro uso do dia, retorno de visibilidade e Calendário. Séries UpToDate/InProgress com TMDB oficial são conciliadas com episódios lançados; novo episódio move para Assistir a seguir. Surrogates `tmdb_id <= 0` não são consultados externamente.

## 9. Backend 0.99.2
Migration aplicada: `supabase/migrations/20260827004500_v0992_home_series_movies.sql`.
- RPC `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS, PK perfil/data, unique perfil/TMDB.

## 10. Identidade e publicação
### Web
- package `0.99.2`;
- cache `ct-web-0.99.2-fix2`;
- patch final `patch-v096-v0992-unfreeze.js`;
- rodapé `CineTracker • v0.99.2`;
- Verify FIX2 em `main`: success;
- Vercel do source FIX2: success.

### Android
- `applicationId com.cinetracker.app`;
- `versionName 0.99.2`;
- `versionCode 9913`;
- bundle `v0.99.2-fix2-unfreeze-991-992-authoritative`;
- workflow `.github/workflows/build-android-v0992-fix2.yml`;
- run `33032044592`: success;
- Release `android-v0.99.2` atualizada para `CineTracker Android 0.99.2 FIX2`;
- APK `cinetracker-android-0.99.2-debug.apk`;
- SHA-256 `8564bacca16bf153ebdb05f64a89337b998d23c02c8edb9a137e2a104725f9d2`.

O APK `versionCode 9912` anterior foi invalidado por travamento e não deve ser tratado como release funcional.

## 11. Validação
Confirmado por CI/publicação após o FIX2:
- build Web/verificador reconhecem o anti-freeze;
- preparo Android inline contém v096 e markers FIX2;
- smoke inline do bundle passou;
- Vercel está `success` para o source FIX2;
- build Android 9913 passou;
- identidade/runtime/assinatura do APK passaram;
- artifact e substituição da Release passaram.

**Ainda exige evidência real antes de encerrar a versão:**
- Web desktop responsiva por pelo menos 60 s sem congelamento/CPU runaway;
- Web Android responsiva por pelo menos 60 s;
- múltiplas alternâncias Home/Descobrir/Perfil/Configurações;
- Perfil/Descobrir/Home funcionando com dados reais;
- instalação/upgrade do APK 9913 em aparelho real;
- APK responsivo por pelo menos 60 s e navegação real funcionando.

Ver `docs/validation/0.99.2.md`.

## 12. Débitos conhecidos
- surrogate negativo em `media.tmdb_id` permanece como débito legado, com chamadas externas bloqueadas para IDs <=0;
- advisories históricos Supabase continuam documentados;
- AGP 8.5.2 vs compileSdk 35 ainda pode emitir warning;
- o monkey-patch idempotente de `Node.textContent` é correção transitória de compatibilidade; refatoração futura deve tornar os observers legados localmente idempotentes e permitir removê-lo.

## 13. Documentos canônicos
`README.md`, `VERSIONS.md`, `CHANGELOG.md`, `PROJECT_STATE.md`, `apps/web/README.md`, `apps/android/README.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.2.md`, `docs/validation/0.99.2.md`.

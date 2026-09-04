# CineTracker — Project State

> Documento canônico de continuidade. O estado atual deve ser lido daqui e dos documentos vinculados, não inferido de versões históricas ou do histórico de conversa.

**Última atualização:** 2026-09-04  
**Branch de produção:** `main`  
**Release oficial:** **1.0.0**  
**Web:** **1.0.0 / `r204-official-1.0.0`**  
**Android:** **1.0.0 / versionCode `10042`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Baseline oficial 1.0.0

A 1.0.0 encerra a fase pré-1.0 e passa a ser a única baseline recomendada para novas mudanças. Não reabre correções já aceitas; qualquer regressão deve ser tratada a partir desta release.

A promoção foi deliberadamente conservadora:

- Web 1.0.0 = comportamento r203 + identidade oficial r204;
- Android 1.0.0 = comportamento 0.99.7.71/r243 validado fisicamente + identidade oficial 1.0.0;
- Supabase permanece o backend compartilhado atual, sem migration criada apenas para renumerar a aplicação.

## 2. Web oficial

Revision: `r204-official-1.0.0`.

A r204 importa integralmente a r203 e altera somente o envelope de release: package, revision/cache identity, asset final, `release.json`, snapshot e versão visível no rodapé.

Comportamentos preservados incluem Home, Descobrir, filtros, Sports, Perfil, busca, detalhes, favoritos, importação/sincronização, rewatch persistente e exclusões pessoais.

Produção: `https://mycinetracker.vercel.app`.

## 3. Android oficial

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.0`;
- `versionCode`: `10042`;
- base funcional: `0.99.7.71 / r243-android-watchlist-renderer-pool`;
- preparação oficial: `scripts/prepare-android-v1000.mjs`;
- teste oficial: `scripts/test-android-v1000.mjs`;
- pipeline: `.github/workflows/release-v1.yml`;
- APK: `CineTracker-1.0.0.apk`.

### Estado funcional congelado

O último bug bloqueador antes da 1.0.0 era o `Trocar` em **Pra você → Da sua Watchlist**. A causa final estava na divergência entre o pool usado pelo renderer `ct186` e o pool reconstruído pelo handler `r237`. A 0.99.7.71 passou a usar exatamente `wmPool/wsPool/waPool` selecionados pelo renderer visível. O usuário confirmou no aparelho que a correção funcionou.

Também está validado pelo usuário que o scroll lateral do Top 10/streamings ficou funcional. A implementação usa scroll horizontal nativo no WebView e não reintroduz `touchmove` manual.

A 1.0.0 não altera essa lógica; apenas renumera a aplicação e a versão exibida.

## 4. Versionamento visível

A versão **1.0.0** deve aparecer:

- no rodapé da Web;
- no rodapé/runtime embarcado do Android;
- em `window.__ctWebBuild` / identidade oficial do runtime;
- em `apps/web/package.json`;
- em `dist/release.json` da Web;
- em `versionName` do APK;
- na documentação canônica.

O `versionCode` Android é `10042` para manter monotonicidade em relação à 0.99.7.71 (`10041`).

## 5. Pipeline e governança

Pipeline oficial: `.github/workflows/release-v1.yml`.

Ele valida Web e Android juntos, incluindo:

- build/test Web 1.0.0;
- identidade visual 1.0.0;
- preservação dos markers funcionais da r203;
- preparação Android em cima da .71;
- pool Watchlist igual ao renderer ativo;
- clique completo Watchlist `11 → 14` mantendo 100% novos `21 → 21`;
- Gradle APK;
- `aapt` versionName/versionCode;
- `apksigner`;
- artifact oficial.

## 6. Regra de evidência

Estados separados:

1. source/documentação;
2. CI/testes;
3. deploy Web;
4. APK/assinatura;
5. smoke real Web;
6. smoke real Android.

Print/vídeo/teste físico prevalece sobre CI quando houver divergência.

## 7. Documentos canônicos

- `README.md`
- `VERSIONS.md`
- `CHANGELOG.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/SECURITY.md`
- `docs/releases/1.0.0.md`
- `docs/validation/1.0.0.md`

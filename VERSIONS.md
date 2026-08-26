# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-26

## Matriz atual

| Sistema | Versão de código / release lógica | Versão técnica adicional | Estado |
|---|---:|---|---|
| Web | **0.0.97 HOTFIX 18** | package `0.0.97-hotfix18-documentation-governance` | source atual na `main`; produção requer confirmação de deploy |
| Android | **0.0.97 HOTFIX 18** | `versionCode 995` | source/build target atual; publicação exige APK/Release válidos |
| Backend / Supabase | **0.0.97 HOTFIX 18** | `ct-import-bingers-user` deploy v8 | schema/RPCs ativos; Edge Functions têm numeração própria |
| Windows | **—** | — | não lançado |

## Edge Functions relevantes

Os números abaixo são números de deploy do Supabase, não substituem a versão da release do CineTracker:

- `ct-import-bingers-user`: **v8**;
- `tmdb-proxy`: **v3**;
- `cinetracker-web`: **v3**;
- `tmdb-image`: **v2**.

## Regra obrigatória a partir do HOTFIX18

Toda nova unidade lógica de mudança deve receber incremento de versão e registro completo no GitHub. A unidade pode possuir vários commits enquanto está sendo concluída, todos sob a mesma versão. Depois de encerrada, a próxima mudança exige nova versão.

Arquivos que devem acompanhar a mudança, conforme aplicável:

- `package.json` e versão exibida Web;
- namespace de cache/Service Worker;
- Android `versionName` + `versionCode`;
- bundle Android e workflow/release;
- `README.md` e README da plataforma;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `VERSIONS.md`;
- `docs/releases/<versão>.md`;
- `docs/validation/<versão>.md`;
- arquitetura, segurança e migrations quando afetadas.

Detalhes normativos: `docs/DEVELOPMENT_RULES.md`.

## Regras permanentes

- `applicationId` Android permanece `com.cinetracker.app`.
- `versionCode` Android deve ser sempre crescente.
- Mudança compartilhada Web/Android deve atualizar os dois targets.
- Mudança somente de backend ainda deve ser associada à próxima release lógica e registrada em migration/código da função correspondente.
- Uma versão Android não é considerada publicada sem build, APK válido, assinatura e Release.
- Uma versão Web não é considerada em produção sem deploy confirmado.
- Teste automatizado não equivale a teste visual/funcional em aparelho real.
- Não marcar como validado o que não foi executado.

## Linha recente

- **0.0.97 HOTFIX 13** — semântica Bingers e estatísticas por `plays`.
- **0.0.97 HOTFIX 14** — tentativas de compatibilidade em dispositivo real.
- **0.0.97 HOTFIX 15** — transporte/picker de importação e shape homogêneo de `watch_history`.
- **0.0.97 HOTFIX 16** — pipeline de importação resiliente, idempotente e verificável; Edge Function Bingers v8.
- **0.0.97 HOTFIX 17** — Perfil server-side e classificação de séries em Concluídas / Em andamento / Em dia / Não iniciadas.
- **0.0.97 HOTFIX 18** — consolidação documental, governança obrigatória, sincronização integral de versionamento e preservação das correções HOTFIX15–17.

## Release atual

- Release note: `docs/releases/0.0.97-HOTFIX18.md`.
- Validação: `docs/validation/0.0.97-HOTFIX18.md`.

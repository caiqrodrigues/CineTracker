# CineTracker Android — 0.0.97 HOTFIX 18

App Android leve baseado em `Activity + WebView`, com runtime CineTracker Web embarcado no APK.

## Identidade atual de source/build target

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.97 HOTFIX 18`;
- `versionCode`: `995`;
- bundle: `hotfix18-documentation-governance-v95-core-inline-authoritative`.

## Runtime

`scripts/prepare-android-hotfix2-web.mjs` prepara o build Web, copia para `apps/android/app/src/main/assets/hotfix5`, transforma os scripts ativos em inline e adiciona o marcador do bundle. O runtime principal é local; o app não deve depender de fallback remoto para iniciar a aplicação.

HOTFIX18 preserva:

- núcleo Web v95 estável;
- recuperação de autenticação/sessão;
- navegação global;
- picker/transporte nativo do HOTFIX15;
- resiliência de importação HOTFIX16;
- Perfil e classificação de séries HOTFIX17;
- identidade/versionamento HOTFIX18.

## Importação Bingers

No Android, o bridge nativo seleciona/persiste temporariamente os arquivos da importação e os devolve ao runtime Web. O fluxo funcional usa `library.csv` + `watches.csv` e compartilha o mesmo backend do Web.

## Build e publicação

A release HOTFIX18 deve produzir:

- APK debug `cinetracker-android-0.0.97-HOTFIX18-debug.apk`;
- artifact `cinetracker-android-0.0.97-HOTFIX18-debug`;
- tag/release `android-v0.0.97-hotfix18`;
- SHA-256 do APK;
- verificação de identidade por `aapt`;
- verificação de assinatura por `apksigner`.

A existência de `versionName/versionCode` na `main` não significa que o APK já foi publicado. O status real deve ser registrado em `docs/validation/0.0.97-HOTFIX18.md`.

## Validação real

Compilação e checks automatizados não equivalem a teste em dispositivo. Só marcar instalação/navegação/importação Android como validadas quando o APK HOTFIX18 tiver sido instalado e testado fisicamente.

## Regra obrigatória

Toda próxima mudança Android deve incrementar versão da unidade lógica, aumentar `versionCode` e atualizar documentação, workflow/release e validação conforme `docs/DEVELOPMENT_RULES.md`.

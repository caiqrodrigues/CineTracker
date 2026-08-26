# CineTracker Android — 0.0.97 HOTFIX 18

App Android leve baseado em `Activity + WebView`, com runtime CineTracker Web embarcado no APK.

## Identidade atual

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.97 HOTFIX 18`;
- `versionCode`: `995`;
- bundle: `hotfix18-documentation-governance-v95-core-inline-authoritative`.

## Runtime

`scripts/prepare-android-hotfix2-web.mjs` prepara o build Web, copia para `apps/android/app/src/main/assets/hotfix5`, transforma os scripts ativos em inline e adiciona o marcador do bundle. O runtime principal é local; o app não depende de fallback remoto para iniciar a aplicação.

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

## Build e publicação — concluídos

Pipeline dedicado HOTFIX18: run `33016118908`.

Concluído e comprovado:

- build debug HOTFIX18: sucesso;
- preparação do runtime embarcado: sucesso;
- identidade do APK por `aapt`: `com.cinetracker.app`, `0.0.97 HOTFIX 18`, `versionCode 995`;
- assinatura validada por `apksigner`;
- artifact: `cinetracker-android-0.0.97-HOTFIX18-debug`, id `9624582547`;
- GitHub Release: `android-v0.0.97-hotfix18`;
- APK publicado: `cinetracker-android-0.0.97-HOTFIX18-debug.apk`;
- SHA-256 do APK: `9a9801c69be9f66142c98a43ba084c262dc19a3b00cc15db5e379b6f8f05035f`.

O workflow geral `Verify` também foi atualizado para a pilha HOTFIX18 e concluiu com sucesso no run `33016322725`.

## Validação real pendente

Compilação, assinatura e Release não equivalem a teste físico. A instalação/navegação/importação no APK HOTFIX18 em aparelho Android real permanece pendente e não deve ser marcada como validada até execução real.

## Regra obrigatória

Toda próxima mudança Android deve incrementar versão da unidade lógica, aumentar `versionCode` e atualizar documentação, workflow/release e validação conforme `docs/DEVELOPMENT_RULES.md`.

Release atual: `docs/releases/0.0.97-HOTFIX18.md`.  
Validação atual: `docs/validation/0.0.97-HOTFIX18.md`.

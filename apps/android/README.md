# CineTracker Android — 0.0.98

App Android nativo leve baseado em `Activity + WebView`, com runtime CineTracker Web embarcado e inlined no APK.

## Identidade

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.98`;
- `versionCode`: `996`;
- bundle: `v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative`.

## Navegação

A barra inferior nativa apresenta **Home, Descobrir, Perfil e Configurações**. A aba Histórico deixou de ser destino visível e seu conteúdo foi integrado ao Perfil. O runtime 0.0.98 também redireciona chamadas legadas de `history` para Perfil.

O bridge nativo ainda chama a entrada legada `ct15Navigate`; `patch-v090-v098-compat.js` substitui essa entrada no runtime final e encaminha para `ct98Navigate`, mantendo compatibilidade sem reintroduzir a navegação antiga.

## Perfil e Histórico

Perfil segue a mesma ordem da Web:

1. estatísticas compactas;
2. gráfico moderno de atividade;
3. estatísticas extras;
4. Histórico com carrossel de séries acima e filmes abaixo.

## Descobrir

A ordem e filtros são idênticos à Web: Pra você, Em alta, Mais aguardados, Mais bem avaliados e Calendário; as quatro últimas seções possuem Todos/Filmes/Séries e Mais bem avaliados é decrescente por nota.

## Backup e manutenção

Configurações mostra somente **Exportar** e **Importar** para Backup & Restauração. O ZIP contém CSVs completos da conta sincronizada. O Android usa a interface nativa `exportBackup` para salvar o arquivo via seletor do sistema e o WebView/FileChooser para selecionar o ZIP de restauração.

Limpar Cache e Atualizar Metadados usam a mesma implementação 0.0.98 da Web. Metadados externos são consultados somente para `tmdb_id > 0`.

## Runtime local

`scripts/prepare-android-hotfix2-web.mjs` gera o runtime embarcado em `apps/android/app/src/main/assets/hotfix5`, transforma scripts em inline e valida a ordem autoritativa da pilha. O app não depende de fallback remoto para iniciar o bundle principal.

## Build e publicação

Pipeline dedicado: `.github/workflows/build-android-v098.yml`.

Saídas previstas e verificadas pelo pipeline quando acionado:

- APK `cinetracker-android-0.0.98-debug.apk`;
- artifact `cinetracker-android-0.0.98-debug`;
- tag/release `android-v0.0.98`;
- validação de `applicationId`, `versionName` e `versionCode` por `aapt`;
- validação de assinatura por `apksigner`;
- SHA-256 publicado ao lado do APK.

O estado executado do pipeline e da publicação é registrado em `docs/validation/0.0.98.md` e não é presumido somente pelo source.

## Rodapé

O runtime embarcado exibe **`CineTracker • v0.0.98`**.

Release: `docs/releases/0.0.98.md`.  
Validação: `docs/validation/0.0.98.md`.

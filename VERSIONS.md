# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-26

## Matriz atual

| Sistema | Versão atual | Versão técnica adicional | Estado de source |
|---|---:|---|---|
| Web | **0.0.98** | package `0.0.98`, cache `ct-web-0.0.98` | implementado em `main` |
| Android | **0.0.98** | `versionCode 996` | source e pipeline dedicado em `main` |
| Backend / Supabase | **0.0.98** | `ct-backup-user` v1; `ct-import-bingers-user` v8 | migration/RPC e função de backup ativos |
| Windows | **—** | — | não lançado |

O estado de build/deploy/publicação é registrado separadamente em `docs/validation/0.0.98.md` para não confundir source com evidência executada.

## Identidade 0.0.98

### Web

- versão exibida: `0.0.98`;
- package: `0.0.98`;
- Service Worker: `ct-web-0.0.98`;
- rodapé: `CineTracker • v0.0.98`.

### Android

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.98`;
- `versionCode`: `996`;
- bundle: `v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative`;
- tag/release definida: `android-v0.0.98`.

## Backend 0.0.98

Os números de Edge Function são independentes da versão do aplicativo:

- `ct-backup-user`: **v1** — snapshot/restauração autenticados do backup CSV/ZIP;
- `ct-import-bingers-user`: **v8** — importador Bingers resiliente preservado;
- `tmdb-proxy`: versão de deploy própria;
- `tmdb-image`: versão de deploy própria.

Migration 0.0.98: `20260826230500_v098_profile_history_media.sql`.

## Conteúdo funcional da 0.0.98

- navegação autoritativa e correção das abas;
- remoção da aba Histórico e integração do conteúdo ao Perfil;
- Perfil reordenado em estatísticas → gráfico → extras → histórico;
- carrosséis separados de séries e filmes;
- Backup & Restauração reduzido a Exportar/Importar;
- exportação ZIP com CSVs e restauração autenticada;
- Limpar Cache funcional;
- Atualizar Metadados funcional com guard para IDs substitutos;
- Descobrir na ordem Pra você → Em alta → Mais aguardados → Mais bem avaliados → Calendário;
- filtros Todos/Filmes/Séries nas quatro seções aplicáveis;
- ranking de Mais bem avaliados sempre decrescente.

## Regra obrigatória

Toda nova unidade lógica de mudança deve receber incremento de versão e registro completo no GitHub. A unidade pode possuir vários commits enquanto está sendo concluída; a próxima unidade posterior exige novo incremento.

Arquivos/áreas que devem acompanhar a mudança conforme aplicável:

- `package.json`, versão exibida e Service Worker Web;
- Android `versionName`, `versionCode`, bundle e workflow/release;
- `README.md` e README da plataforma;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `VERSIONS.md`;
- `docs/releases/<versão>.md`;
- `docs/validation/<versão>.md`;
- `docs/ARCHITECTURE.md` e `docs/SECURITY.md` quando afetados;
- migrations e Edge Function source para mudanças de backend.

## Linha recente

- **0.0.97 HOTFIX 15** — transporte/picker de importação e shape homogêneo de `watch_history`;
- **0.0.97 HOTFIX 16** — importação Bingers resiliente/idempotente;
- **0.0.97 HOTFIX 17** — Perfil server-side e classificação de séries;
- **0.0.97 HOTFIX 18** — governança/versionamento e consolidação documental;
- **0.0.98** — navegação, Perfil com Histórico integrado, backup CSV/ZIP, manutenção funcional e Descobrir reformulado.

## Release atual

- release note: `docs/releases/0.0.98.md`;
- validação: `docs/validation/0.0.98.md`.

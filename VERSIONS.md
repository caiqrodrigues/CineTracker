# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial publicada | Próxima versão |
|---|---:|---:|
| Web | **0.4.8** | **0.4.9** pronta no código, deploy pendente |
| Android | **0.0.48** | **0.0.49** pronta no código, APK pendente |
| Windows | — | — |

## Regra

- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- O APK 0.0.48 publicado usa o certificado SHA-256 `fe69519cd5669429446e4701cd5d0ad78c5a936b3130f27e478a05c0591353d3`.
- A 0.0.49 só pode ser publicada como atualização por cima se o CI recuperar exatamente a chave privada correspondente a esse baseline.

## Web

- **0.4.8** — versão atualmente publicada.
- **0.4.9** — código pronto: Home/Continuar assistindo sincronizado com Assistir/Acompanhando, check do próximo episódio nas duas áreas e Descobrir em três colunas. O deploy de produção está pendente por limite de builds do Vercel.

## Android

- **0.0.48** — versão atualmente publicada e instalada para validação.
- **0.0.49** — código pronto com `ct49.js`: mesma fonte para Continuar assistindo/Acompanhando, check do próximo episódio nas duas áreas, Descobrir em três colunas e versão 0.0.49. O Gradle compila, mas a publicação foi bloqueada porque a chave restaurada pelo cache do GitHub não corresponde ao certificado da 0.0.48.

## Documentação

- `docs/releases/web-0.4.9.md`
- `docs/releases/0.0.49.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico do GitHub.

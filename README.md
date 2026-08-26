# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. A conta é compartilhada entre Web e Android e concentra biblioteca, Watchlist, histórico, progresso de episódios, descoberta, recomendações, perfil, estatísticas, importação e backup.

## Versões atuais de código

| Sistema | Versão atual na `main` | Estado |
|---|---:|---|
| Web | **0.0.97 HOTFIX 18** | source target atual; deploy de produção deve ser confirmado separadamente |
| Android | **0.0.97 HOTFIX 18** (`versionCode 995`) | source/build target atual; APK/Release dependem de CI e validação |
| Backend lógico | **0.0.97 HOTFIX 18** | schema/RPCs alinhados; Edge Functions mantêm versão própria de deploy |
| Windows | **—** | não lançado |

Identificadores técnicos Web: pacote `0.0.97-hotfix18-documentation-governance`, cache `ct-web-0.0.97-hotfix18-documentation-governance`.

## Regra obrigatória de desenvolvimento

A partir do HOTFIX 18, **toda nova atualização/mudança deve gerar registro no GitHub e deve estar associada a uma nova versão**. A mudança precisa sincronizar código, versionamento, `CHANGELOG.md`, `PROJECT_STATE.md`, `VERSIONS.md`, README(s), release note e registro de validação, além de arquitetura/segurança/migrations quando afetadas.

Uma unidade lógica pode usar vários commits sob a mesma versão enquanto está sendo concluída; a próxima unidade de mudança exige novo incremento. Consulte `docs/DEVELOPMENT_RULES.md`.

## Estado Bingers reconciliado

A importação válida usa somente `library.csv` + `watches.csv`, preserva decisões manuais e não inventa datas. A importação direta verificada (import ID 6) consolidou:

- 3.078 itens de biblioteca: 2.318 filmes + 760 séries;
- 12.696 registros de histórico: 949 filmes + 11.747 episódios;
- 16.216 reproduções: 1.312 de filmes + 14.904 de episódios;
- 1.309 filmes na Watchlist;
- 533 séries não iniciadas;
- 227 séries com histórico;
- 0 eventos de histórico sem correspondência.

Repetições são preservadas em `external_ids.plays`. Ratings, avaliações, comentários e listas do Bingers não são importados.

## Estados das séries

Após reconciliação do estado real das séries:

- **155 Concluídas** (`Completed`);
- **47 Em dia** (`UpToDate`);
- **25 Em andamento** (`InProgress`);
- **533 Não iniciadas**;
- **227 séries com histórico**.

Série importada com zero episódios vistos não pode permanecer `InProgress`. O banco possui guard/cleanup para o erro de origem do Bingers e a verificação posterior encontrou zero séries `InProgress` sem histórico.

## Perfil e estatísticas

O Perfil usa agregações server-side para evitar contagens incorretas por paginação do cliente. As RPCs principais são `cinetracker_profile_stats`, `cinetracker_series_state_stats` e `cinetracker_consumption_daily`.

Valores reconciliados atuais do conjunto importado incluem 14.904 episódios, 1.312 reproduções de filmes, **3 meses 20 dias 13 horas** em filmes e **16 meses 19 dias 5 horas** no total.

O Perfil separa `Concluídas`, `Em andamento`, `Em dia` e `Não iniciadas`, e o gráfico diário soma reproduções (`plays`).

## Importador resiliente

A Edge Function `ct-import-bingers-user` está no deploy **v8** e preserva o stack HOTFIX16: autenticação no backend, erros tipados, `client_run_id`, cursor/replay idempotente, validação, dedupe, limpeza escopada ao Bingers, precedência manual e verificação exata antes de concluir.

A falha histórica PostgREST `All object keys must match` foi corrigida tornando o shape de `watch_history` homogêneo; filmes incluem `season_number: null` e `episode_number: null`.

## Web

O runtime Web atual preserva o núcleo estável v95, recuperação de sessão, navegação global, importação Bingers HOTFIX15/16 e Perfil HOTFIX17, com identidade HOTFIX18. O Service Worker não cacheia o shell HTML e mantém cache de imagens/metadados TMDB.

Produção conhecida: `https://mycinetracker.vercel.app`. A versão servida em produção só deve ser declarada após confirmação do deploy.

## Android

Android usa `Activity + WebView` com runtime Web embarcado/inline, sem depender de fallback remoto para o bundle principal. HOTFIX18 usa:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.97 HOTFIX 18`;
- `versionCode`: `995`;
- bundle: `hotfix18-documentation-governance-v95-core-inline-authoritative`.

Build, assinatura, artifact, GitHub Release e teste em aparelho são etapas independentes; não são consideradas concluídas apenas porque o source está na `main`.

## Backend e migrations recentes

Migrations relevantes desta linha:

- `20260826130000_hotfix13_profile_stats_plays.sql`;
- `20260826211500_bingers_authoritative_profile_stats.sql`;
- `20260826212500_profile_consumption_daily_rpc.sql`;
- `20260826213500_bingers_series_state_hardening.sql`;
- `20260826214500_profile_active_series_metric.sql`;
- `20260826215500_bingers_completion_requires_metadata.sql`.

## Débitos conhecidos

- IDs TMDB substitutos negativos ainda podem gerar 404 se forem enviados ao `tmdb-proxy`; o cliente deve impedir consultas para surrogate IDs ou o modelo de IDs deve ser separado.
- Advisories de segurança Supabase permanecem abertos para algumas funções `SECURITY DEFINER` e para proteção de senha vazada desativada.
- RLS/policies de estruturas históricas de staging precisam ser tratados com política correta, sem ativação cega que quebre o fluxo.

## Documentação canônica

- `PROJECT_STATE.md` — estado técnico atual e continuidade.
- `VERSIONS.md` — matriz de versões e regras de incremento.
- `CHANGELOG.md` — histórico de mudanças.
- `docs/DEVELOPMENT_RULES.md` — regra obrigatória de registro/versionamento.
- `docs/ARCHITECTURE.md` — arquitetura atual.
- `docs/SECURITY.md` — segurança e débitos abertos.
- `docs/releases/0.0.97-HOTFIX18.md` — release atual.
- `docs/validation/0.0.97-HOTFIX18.md` — matriz de validação.
- `docs/notes/2026-08-26-bingers-import-reconciliation.md` — cronologia técnica da reconciliação Bingers.

## Regra de publicação

Código em `main` não equivale automaticamente a produção. Para Web, publicação exige build e deploy confirmados. Para Android, exige build, APK válido, assinatura, artifact/Release e, quando declarado como testado, instalação real em dispositivo.

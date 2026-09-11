# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.42** | `r251-official-1.0.42` | release com renderizadores diretos e validação por Chromium + smoke público |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r251 |
| Backend | produção compartilhada | Supabase | produção; inclui persistência `shown_recommendations` com RLS |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.42 / r251

A r251 troca a estratégia de reconciliação pós-render por autoridade direta nas telas críticas. Home, Descobrir, Esportes/F1 e Perfil passam a assumir os renderizadores ativos antes do `boot()`, evitando que camadas herdadas voltem a reconstruir a UI depois da tela correta.

- **Home:** a fronteira de acompanhamento considera somente o que foi efetivamente assistido. Backlog histórico continua preservado, mas não desloca a série para trás; episódio lançado depois da fronteira tem prioridade absoluta e volta para `Assistir a seguir`. A auditoria canônica é concorrente e reapinta a Home assim que o episódio atual é confirmado. F1 e Super Bowl entram pela ponte esportiva direta: evento recente não assistido aparece como novo, e o próximo evento real mantém o acompanhamento em dia. Cards de filmes preservam a nota TMDB visível.
- **Descobrir:** recomendações exigem TMDB ≥ 7,5, ano posterior a 1990 e removem Drama/Documentário puro, vistos, itens em andamento, `NotInterested`, WWE e Watchlist fora do bloco próprio. As nove sub-abas (`Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados`, `Calendário`) permanecem funcionais sob a mesma autoridade. A r251 mantém três blocos obrigatórios (`Indicação do Dia`, `Da sua Watchlist`, `100% Novos`), antirrepetição e histórico persistente por 7 dias de todos os itens exibidos, inclusive os vindos da Watchlist, via `shown_recommendations`.
- **Trocar recomendação:** troca o conteúdo elegível sem reload global e respeita as mesmas exclusões pessoais e a janela de 7 dias.
- **Esportes:** permanecem somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, correspondendo ao futuro de hoje, às 72 horas anteriores, aos favoritos e ao histórico visto. A carga usa `cinetracker_sports_payload_v1`, reaproveita a sincronização autenticada quando o feed está vazio e marca/desmarca com microinteração via `cinetracker_sport_mark_watched_v1`. O bundle final não chama `cinetracker_sports_events_v0997`.
- **F1 Hub:** existe uma única instância com minimizar/expandir persistido pelo usuário, sem autoexpansão por reconciliadores antigos.
- **Perfil:** existe um único bloco expansível de `Estatísticas`, incluindo os dados esportivos, sem painel paralelo concorrente.
- **Layout:** overflow horizontal global permanece bloqueado; temporadas, gráficos, trilhos, Descobrir e F1 usam somente scroll horizontal local. Home, Perfil, Configurações e sidebar receberam polish de proporção e espaçamento.
- **Persistência:** migration `20260911175655_r251_shown_recommendations.sql` cria o histórico de recomendações exibidas com RLS para sustentar a regra de 7 dias; `20260911192843_r251_shown_recommendations_policy_hardening.sql` limita os privilégios ao cliente autenticado e otimiza as policies por usuário.
- **Validação:** a pipeline preserva a regressão r250 e acrescenta invariantes r251, regressões de lógica, cenário Chromium para as nove sub-abas, histórico semanal da Watchlist, F1/Super Bowl e casos reportados pelo usuário, identidade do bundle final e alinhamento dos manifests raiz/Web em 1.0.42.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para evitar recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, elenco e pessoas;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.

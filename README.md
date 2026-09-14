# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.65** | `r274-official-1.0.65` | Home limitada/indexada, Histórico cronológico, metadados completos e Reassistir |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r274 |
| Backend | produção compartilhada | Supabase | `cinetracker_profile_home_payload_v0997_r6` é a autoridade limitada da Home |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.65 / r274

A r274 corrige o `statement timeout` da Home na fonte, reduzindo o conjunto de trabalho do Supabase e restaurando a riqueza visual e as ações do Histórico sem voltar a consultas globais pesadas.

- **Home sem timeout:** o renderer final usa `cinetracker_profile_home_payload_v0997_r6`, com limites explícitos de 20 itens de Histórico, 120 séries e 120 filmes. O backend seleciona somente candidatos relevantes e usa índices parciais próprios para episódios/filmes recentes e para estados da biblioteca.
- **Validação real de desempenho:** a consulta r6 foi executada contra o volume real da conta em produção e concluiu em aproximadamente 410 ms, muito abaixo do limite de statement timeout que derrubava a r5.
- **Histórico do mais antigo para o mais recente:** o backend seleciona os 20 registros recentes por índice e os devolve em `watched_at ASC`; a UI preserva essa ordem, abre o trilho no final e deixa os registros mais recentes embaixo. Ao rolar para cima aparecem os mais antigos.
- **Metadados de episódios:** cards de Histórico e `Assistir a seguir` exibem `SXXEYY • Ep: Título • ⭐ Nota • Data`. Metadados ausentes no payload são hidratados pelo proxy TMDB com cache por temporada e concorrência limitada. Séries também exibem quantos episódios já lançados ainda estão disponíveis para assistir.
- **Metadados de filmes:** Histórico e `Assistir a seguir / Watchlist` voltam a mostrar `Ano • Duração min • Gêneros • ⭐ Nota`, com hidratação apenas quando algum dado estiver ausente.
- **Assistido e Reassistir:** `✓` permanece fixo à extrema direita dos cards de `Assistir a seguir`. Cada item do Histórico possui `↻` para registrar uma nova visualização e `↶` para desfazer a marcação. `cinetracker_rewatch_history_v1` reaproveita o writer canônico e mantém o contador `2x`, `3x`, `4x...` consistente.
- **Estado em tempo real:** Reassistir ou desfazer recarrega o payload r6, repinta contagens/ordem/metadados e mantém a aba de Séries/Filmes ativa.
- **Layout estrito:** cards continuam `display:flex`, `flex-direction:row`, `flex-wrap:nowrap`; ações de 40×40 px nunca podem cair para baixo, em 420 px ou desktop.
- **Escopo preservado:** Descobrir, detalhes/scroll, Sports/F1 e Android continuam na autoridade anterior e não são reconstruídos pela r274.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes ordenado cronologicamente, com Reassistir e opção de desfazer marcação de visto;
- metadados ricos de episódios e filmes nos cards da Home;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
- Formula 1 e NFL Super Bowl importados tratados como séries, sem perder a área esportiva/F1 Hub;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker e F1 Hub;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r274 mantém a composição horizontal aprovada da r273, mas troca a autoridade da Home pelo payload r6 limitado e indexado e adiciona hidratação leve de metadados somente nos cards que precisam dela.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.

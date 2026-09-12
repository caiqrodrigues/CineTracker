# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.47** | `r256-official-1.0.47` | correção guiada pelo vídeo: Home, detalhes/scroll, Descobrir, Esportes/F1, Perfil e navegação |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r256 |
| Backend | produção compartilhada | Supabase | histórico, Watchlist e estatísticas canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.47 / r256

A r256 usa o vídeo posterior à r255 como ground truth e corrige os pontos que ainda divergiam do uso real, sem reconstruir as áreas que já estavam aprovadas.

- **Home / Lioness e Stuart:** uma pendência real (`history_missing_episodes` ou fronteira liberada maior que a assistida) passa a vencer um `is_caught_up=true` contraditório em séries normais. A auditoria viva compara somente `last_episode_to_air` com a fronteira realmente assistida. Raw, SmackDown, Fórmula 1 e Super Bowl continuam ignorando backlog histórico e nunca tratam `next_episode_to_air` como já lançado.
- **Navegação e cache:** Home, Descobrir, Esportes e Perfil preservam snapshots recentes do DOM. Ao abrir um detalhe e voltar, a tela carregada anteriormente reaparece imediatamente; a Home não volta para `Sincronizando Home...` nem repete o RPC canônico enquanto o snapshot/cache ainda é válido. Atualizações vencidas acontecem em segundo plano sem apagar conteúdo já visível.
- **Scroll horizontal local:** episódios da temporada, temporadas, gráficos, relacionados/semelhantes e atores/elenco recebem rolagem horizontal no próprio componente mesmo quando entram no DOM vários segundos depois da navegação. O observer é permanente, restrito a `childList`, não reexecuta renderizadores e o documento continua sem overflow horizontal global.
- **Descobrir:** a regra de dados da r255 é preservada, mas a geometria do card passa a ser explicitamente protegida contra estilos compactos herdados: poster 2:3 visível, título, ano, gêneros e nota ocupam uma altura real verificável. O teste Chromium mede card, poster e área de metadados, em vez de apenas contar nós no DOM.
- **Esportes / F1:** o F1 Hub é o primeiro bloco da página. Abaixo dele ficam `Próximos`, `Ao vivo`, `Anteriores`, `Favoritos` e `Assistidos`, depois os filtros por esporte e então o feed. A ordem é reparada estruturalmente após qualquer repaint, não por posicionamento visual artificial.
- **Perfil:** o controle já existente `Recolher/Expandir` do bloco `Estatísticas` passa a controlar também `Esportes assistidos`, fazendo mídia e esporte se comportarem como uma única seção lógica.
- **Validação:** além de regras estáticas e algoritmos, a r256 reproduz em Chromium Lioness/Stuart no bucket correto, mede a geometria real do Descobrir, testa a ordem física F1 → filtros → feed, testa o recolhimento único do Perfil, cria episódios/gráfico/relacionados/elenco depois de 5,3 segundos e exige que todos ainda recebam scroll local, e confirma retorno imediato à Home sem segundo RPC.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
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

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.

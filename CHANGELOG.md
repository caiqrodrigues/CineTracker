# Changelog

Todas as mudanças relevantes do CineTracker são registradas aqui. A partir do HOTFIX18, toda nova unidade lógica de mudança exige versão e registro completo conforme `docs/DEVELOPMENT_RULES.md`.

## 0.0.97 HOTFIX 18 — 2026-08-26

### Governança e versionamento
- Web e Android sincronizados em `0.0.97 HOTFIX 18`.
- Web package: `0.0.97-hotfix18-documentation-governance`.
- Web cache namespace: `ct-web-0.0.97-hotfix18-documentation-governance`.
- Android: `versionName 0.0.97 HOTFIX 18`, `versionCode 995`.
- Bundle Android alvo: `hotfix18-documentation-governance-v95-core-inline-authoritative`.
- Criada a regra obrigatória: toda nova mudança deve possuir versão, registro GitHub, release note, validação e atualização dos documentos canônicos.
- Criados `docs/DEVELOPMENT_RULES.md`, release/validation HOTFIX18 e nota técnica da reconciliação Bingers.

### Consolidação Bingers
- Importação direta verificada concluída como import ID 6.
- 3.078 itens de biblioteca, sendo 2.318 filmes e 760 séries.
- 12.696 registros de histórico, sendo 949 de filmes e 11.747 de episódios.
- 16.216 reproduções: 1.312 de filmes + 14.904 de episódios.
- 1.309 filmes na Watchlist, 533 séries não iniciadas, 227 séries com histórico e 0 eventos sem correspondência.
- Ratings, avaliações, comentários e listas continuam fora da importação.
- Plays repetidos são preservados em `external_ids.plays`; datas ausentes não são inventadas.

### Perfil e estados das séries
- Classificação reconciliada em 155 Concluídas, 47 Em dia, 25 Em andamento e 533 Não iniciadas.
- Perfil separa `Concluídas`, `Em andamento`, `Em dia` e `Não iniciadas`.
- Episódios exibem subtítulo baseado em séries com histórico, não em estado atual.
- Corrigido erro do Bingers que marcava séries com zero episódios vistos como iniciadas.
- Proteções `ct_guard_bingers_import_inprogress()` e `ct_cleanup_bingers_zero_history_inprogress()` evitam/regulam o estado importado incorreto.
- Validação posterior: 0 séries `InProgress` sem histórico.

### Estatísticas
- Perfil usa RPCs server-side para evitar distorção por paginação do cliente.
- `cinetracker_series_state_stats()` fornece estados agregados.
- `cinetracker_consumption_daily()` fornece histórico diário e soma `plays`.
- Valores reconciliados: 14.904 episódios, 1.312 reproduções de filmes, 3 meses 20 dias 13 horas em filmes e 16 meses 19 dias 5 horas no total.

### Débitos explicitamente registrados
- surrogate IDs TMDB negativos podem produzir 404 no `tmdb-proxy` se forem tratados como IDs TMDB reais.
- advisories Supabase para funções `SECURITY DEFINER`, leaked-password protection e RLS/policies históricas permanecem abertos para tratamento seguro.
- deploy Web e publicação APK são estados independentes do source e exigem confirmação.

## 0.0.97 HOTFIX 17 — 2026-08-26

### Perfil / séries
- Adicionada classificação server-side de séries em `Completed`, `UpToDate`, `InProgress` e não iniciadas.
- Criado/ativado `cinetracker_series_state_stats()`.
- Criado/ativado `cinetracker_consumption_daily()` para gráfico diário server-side.
- Perfil passou a usar 155 Concluídas, 47 Em dia, 25 Em andamento, 533 Não iniciadas e 227 séries com histórico após reconciliação.
- Ajustado runtime Android para preservar a camada de perfil como camada final.

### Build
- Foram corrigidos verificadores antigos que ainda esperavam identidade HOTFIX15/HOTFIX16.
- Foi corrigida a ordem de injeção do runtime para manter `patch-v074-hotfix1-version.js` por último.
- Tentativas de build anteriores falharam durante o processo de convergência; não foram consideradas releases válidas.

## 0.0.97 HOTFIX 16 — 2026-08-26

### Importação resiliente
- `ct-import-bingers-user` evoluiu para deploy v8.
- Adicionados erros tipados de autenticação, transientes e permanentes.
- Adicionado `client_run_id` para begin idempotente/retomável.
- Adicionado contrato de cursor e replay seguro de lotes.
- Adicionadas validação e deduplicação de library/watches.
- Importador não inventa datas de watch.
- Limpeza anterior é restrita ao Bingers/import-origin e preserva decisões manuais.
- Finalização exige cursor/total/histórico exatos.
- Erros permanentes passam a encerrar import como `failed` em vez de deixá-lo em `processing`.
- Import ID 5 legado foi encerrado como `LEGACY_PIPELINE_STALLED`.

## 0.0.97 HOTFIX 15 — 2026-08-26

### Correção do transporte Bingers
- Corrigido payload PostgREST de `watch_history` que misturava shapes diferentes.
- Filmes passaram a incluir `season_number: null` e `episode_number: null`, eliminando `PGRST102: All object keys must match` para essa causa.
- Preservado picker/transporte nativo no Android e fluxo dual CSV no Web.

## Web 0.3.0 — 2026-08-21

### Ajustado
- `Hoje` passa a se chamar `Home` na navegação desktop e mobile.
- Biblioteca deixa de ser apenas uma lista textual e passa a exibir Watchlist e itens em andamento como cards com capas oficiais.
- Capas da Home e Biblioteca recebem uma segunda camada de hidratação TMDB para preencher títulos que ainda estavam sem poster.
- Filmografia passa a indicar explicitamente se cada crédito é `FILME` ou `SÉRIE`, mantendo ordenação do mais recente para o mais antigo.

### Adicionado
- Nova aba `Histórico` com filtros `Mídia`, `Séries` e `Filmes`.
- Histórico de séries usa `episode_progress.watched_at` e mostra temporada, episódio, data e horário vistos.
- Histórico de filmes usa `media_overrides.watched_at` para registrar visualizações daqui em diante.
- Cards do histórico reutilizam a tela global de detalhes já existente.

### Banco
- Migration `media_watch_history_timestamp_v030` adiciona `watched_at` a `media_overrides` e índice por perfil/data.
- Filmes marcados como vistos a partir desta versão passam a registrar a data real de visualização.
- Registros antigos importados sem timestamp original de filme continuam sem data até a retomada/reconciliação do histórico Trakt.

## Android 0.0.6 — 2026-08-21

### Ajustado
- Shell Android sincronizado com a Web 0.3.0.
- Home, Biblioteca, Histórico e capas seguem a mesma experiência da versão Web.
- `versionCode` 6 e `versionName` `0.0.6`.

## Web 0.2.9 — 2026-08-21

### Ajustado
- Filmes e séries passam a ser clicáveis também em Home, Biblioteca e cards principais do sistema, não somente em Descobrir.
- Capas originais verticais da TMDB passam a substituir os placeholders também nas áreas legadas sempre que o título pode ser conciliado.
- Filmografia de atores/atrizes é ordenada do trabalho mais recente para o mais antigo.

### Adicionado
- Tela unificada de filme/série para todo o sistema, com sinopse, ano, gêneros, nota TMDB e acesso à ficha IMDb.
- Para filmes: duração total e data/estado de lançamento.
- Para séries: status traduzido (`Cancelada`, `Finalizada`, `Em andamento / renovada`, `Em produção`, `Planejada`) e duração média por episódio.
- Temporadas e episódios clicáveis por temporada, com imagem, número, nome, duração e data de exibição quando disponíveis.
- Seção de filmes/séries relacionados usando recomendações + similares da TMDB.
- Relacionados removem títulos já presentes na Watchlist do usuário.
- Onde assistir continua restrito a streaming por assinatura (`flatrate`) no Brasil; compra e aluguel permanecem ocultados.
- Elenco clicável e tela de pessoa com biografia e filmografia cronológica.

## Android 0.0.5 — 2026-08-21

### Ajustado
- Shell Android sincronizado com a Web 0.2.9.
- Home, Biblioteca e Descobrir usam a mesma experiência de detalhes, temporadas/episódios, relacionados e capas originais.
- `versionCode` incrementado para 5 e `versionName` para `0.0.5`.

## Web 0.2.8 — 2026-08-21

### Adicionado
- Todos os cards de Descobrir, Calendário, busca e rankings passam a ser clicáveis.
- Nova tela de detalhes para filmes e séries com sinopse, ano, gêneros e nota TMDB.
- Integração com o identificador/ficha oficial do IMDb quando disponível.
- Elenco principal clicável, abrindo tela própria do ator/atriz.
- Tela de ator/atriz com biografia e filmografia combinada de filmes e séries.
- Onde assistir focado somente em streaming por assinatura no Brasil (`flatrate`) e cinema para filmes quando a TMDB informa lançamento teatral; compra e aluguel são ocultados.
- Cards e telas novas usam `poster_path` da TMDB em proporção vertical 2:3, priorizando a capa original em vez do backdrop horizontal.

### Observação
- A API TMDB não fornece a nota numérica do IMDb. Para não exibir dado incorreto, a tela mostra a nota TMDB e oferece acesso à ficha oficial IMDb pelo `imdb_id`. Uma nota IMDb numérica exigirá uma fonte/API adicional.

## Android 0.0.4 — 2026-08-21

### Ajustado
- Shell Android sincronizado com a Web 0.2.8.
- Telas de detalhes, elenco, filmografia, streaming/cinema e capas verticais ficam disponíveis na mesma WebView leve.
- `versionCode` incrementado para 4 e `versionName` para `0.0.4`.

## Web 0.2.7 — 2026-08-21

### Ajustado
- `Lançamentos` passa a se chamar `Calendário`.
- `Calendário` foi movido para a última posição das opções de Descobrir.

### Adicionado
- Filtro `Somente meus` no Calendário.
- Para Séries, o filtro mostra somente títulos da Watchlist ou em acompanhamento.
- Para Filmes, o filtro mostra somente títulos da Watchlist com lançamento na data selecionada.
- Nova aba `Mais bem avaliados`.
- `Mais bem avaliados` possui abas separadas de `Filmes` e `Séries` usando os rankings da TMDB.
- A aba `Séries` inclui animes porque a TMDB cataloga anime televisivo dentro do tipo TV.

## Android 0.0.3 — 2026-08-21

### Ajustado
- Shell Android sincronizado com a Web 0.2.7.
- Calendário pessoal e ranking Mais bem avaliados disponíveis dentro da mesma experiência WebView leve.
- `versionCode` incrementado para 3 e `versionName` para `0.0.3`.

## Web 0.2.6 — 2026-08-21

### Adicionado
- Cabeçalho `CINETRACKER / Seu universo de mídia` passa a ser clicável e retorna para a Home.
- Aba Descobrir reorganizada em `Em Alta`, `Lançamentos`, `Mais Aguardados` e `Populares`.
- Calendário de lançamentos com navegação por dia/semana e atalho `Hoje`.
- Alternância entre calendário de `Séries` e `Filmes`.
- Séries exibem temporada/episódio quando a TMDB informa o próximo episódio para a data selecionada.
- Busca direta de filmes, séries e animes permanece disponível dentro de Descobrir.

### Desempenho
- Cache de respostas de descoberta/TMDB em memória e `sessionStorage` por 10 minutos para reduzir chamadas repetidas e travamentos na WebView e no navegador.
- Limite de enriquecimento de detalhes no calendário para evitar dezenas de chamadas simultâneas.

## Android 0.0.2 — 2026-08-21

### Ajustado
- Shell Android continua leve em WebView, mas passa a consumir automaticamente a experiência Descobrir/Calendário da Web 0.2.6.
- `versionCode` incrementado para 2 e `versionName` para `0.0.2`.

## Web 0.2.5 — 2026-08-21

### Ajustado
- Sidebar ampliada e reenquadrada para comportar `Configurações` sem corte.
- `Importar` removido da navegação principal e movido para o hub de Configurações.
- Configurações passa a concentrar conta, preferências, importação e backup.

### Adicionado
- Exportação completa da conta em JSON.
- Exportação ZIP contendo o backup JSON do CineTracker.
- Preferência `notifications_enabled` persistida em `profiles.settings` e sincronizada entre plataformas.
- Botão único para ativar/desativar notificações. A preferência existe agora; o serviço automático de push/agenda será implementado na camada de notificações.

### Banco
- Migration `profile_notification_preference_v025` adiciona o default de notificações aos perfis existentes e novos.

## Android 0.0.1 — 2026-08-21

### Implementado
- Shell Android leve em WebView apontando por padrão para `https://mycinetracker.vercel.app`.
- JavaScript e DOM Storage habilitados para sessão e experiência sincronizada com o Web.
- Seletor nativo de arquivos para importação JSON/ZIP.
- Links externos abrem no navegador; CineTracker e Supabase permanecem no app.
- Estado do WebView preservado em recriação da Activity e navegação Voltar integrada ao histórico.
- Sem framework híbrido pesado: Activity + WebView nativos para manter APK e consumo reduzidos.

## Web 0.2.4 — 2026-08-21

### Corrigido
- Corrigida a tela em branco causada por patches anteriores que usavam `MutationObserver` de forma recursiva e podiam gerar um ciclo contínuo de mutações/renderizações no navegador.
- Removido o carregamento conjunto dos patches 0.2.1/0.2.2/0.2.3; a produção passa a usar a linha de patches estáveis sem observadores recursivos.
- Tema Black/Blue, favicon, configurações e fluxo de login foram consolidados no patch 0.2.4.
- O login exibe a área autenticada imediatamente após o Supabase aceitar as credenciais; banco, TMDB e recomendações carregam em segundo plano.

## Web 0.2.3 — 2026-08-21

### Corrigido
- O login não fica mais condicionado ao carregamento de recomendações, TMDB ou consultas opcionais do banco.
- Assim que o Supabase autentica com sucesso, a interface autenticada é exibida imediatamente.
- Carregamento de estado persistente e sugestões passa a ocorrer em segundo plano após a entrada.

## Web 0.2.2 — 2026-08-21

### Corrigido / adicionado
- Aplicação principal servida diretamente pelo build oficial.
- Estado persistente tolera falha de consultas opcionais.
- Watchlist/histórico locais são limpos antes da leitura autenticada.
- Tema Black/Blue, favicon, configurações de conta e perfil sem overflow.
- Domínio oficial `https://mycinetracker.vercel.app`.

## Web 0.2.1 — 2026-08-21

- Identidade Black/Blue, favicon CineTracker, configurações e correção da área de perfil.

## Web 0.2.0 — 2026-08-21

- Autenticação Supabase, persistência por usuário, Watchlist, progresso, anti-repetição, importação JSON/ZIP, TMDB, elenco, streaming e recomendações por tipo.

## Histórico 0.1.x

- Protótipos Dark/Gold, cards, troca individual por tipo, TMDB, atores e disponibilidade.

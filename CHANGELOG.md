# Changelog

Todas as mudanças relevantes do CineTracker são registradas aqui.

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
- Tema Black/Blue, favicon, perfil, configurações e fluxo de login foram consolidados no patch 0.2.4.
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

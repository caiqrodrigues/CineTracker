# Changelog

Todas as mudanças relevantes do CineTracker são registradas aqui.

## Web 0.2.2 — 2026-08-21

### Corrigido
- A aplicação principal deixa de depender de um wrapper/iframe e volta a ser servida diretamente pelo build oficial.
- Estado persistente do Supabase passa a tolerar falha de consultas opcionais sem marcar todo o banco como desconectado.
- Watchlist e histórico locais são limpos antes da leitura autenticada, evitando dados de exemplo quando a conta real está vazia.
- Nome do perfil e e-mail ficam limitados à largura da sidebar com truncamento visual seguro.

### Adicionado / refinado
- Tema Black/Blue aplicado diretamente ao Web oficial.
- Favicon oficial de TV + reprodução/cinema.
- Área Configurações dentro da aplicação com nome do perfil, telefone, idioma PT-BR/English, alteração de e-mail e alteração de senha.
- Nome, telefone e idioma persistidos no registro `profiles` do Supabase; nome também é sincronizado ao metadata do Auth.
- Idioma salvo é aplicado ao documento e traduz os principais pontos de navegação quando configurado como English.
- Versão visual atualizada para 0.2.2.
- Domínio oficial definido como `https://mycinetracker.vercel.app`.

### Notificações
- Acompanhamento de estreias/novos episódios via TMDB está definido como próxima camada do produto. Push notification ainda não faz parte da 0.2.2.

## Web 0.2.1 — 2026-08-21

### Adicionado
- Identidade visual Black/Blue.
- Favicon oficial com TV e símbolo de reprodução/cinema.
- Configurações de conta com nome do perfil, e-mail, telefone e idioma PT-BR/English.
- Persistência de nome e idioma no perfil de autenticação Supabase.

### Ajustado
- Área lateral passa a priorizar o nome do perfil e mantém o e-mail como informação secundária.
- Nome e e-mail usam truncamento visual e não extrapolam a sidebar.
- Web oficial passa a exibir a versão 0.2.1.

### Observação técnica
- A camada 0.2.1 envolvia a aplicação 0.2.0 em um wrapper temporário. A 0.2.2 substitui essa abordagem pela aplicação direta.

## Web 0.2.0 — 2026-08-21

### Adicionado
- Autenticação por e-mail e senha com Supabase Auth.
- Persistência oficial por usuário.
- Watchlist, estados de mídia e progresso persistentes.
- Regra anti-repetição para recomendações.
- Importação JSON/ZIP com prévia e rastreio.
- Capas oficiais da TMDB.
- Atores clicáveis com perfil e filmografia.
- Busca por título e pessoa.
- Streaming no Brasil sem blocos de aluguel/compra.
- Recomendações com troca mantendo o mesmo tipo de mídia.

### Ajustado
- Interface compactada em relação aos primeiros protótipos.
- Cards responsivos para desktop e mobile.
- Dados fictícios removidos da linha oficial: contas novas começam sem histórico e sem Watchlist.

## Android 0.0.1 — 2026-08-21

### Adicionado
- Estrutura Android inicial.
- WebView configurado para hospedar a experiência CineTracker responsiva.
- Navegação externa tratada pelo app.
- Preparação para compartilhar login e dados via Supabase.

## Histórico 0.1.x

- Protótipos Dark/Gold.
- Cards de filme, série e anime.
- Troca individual por tipo.
- TMDB para metadados, atores e disponibilidade.
- Evolução visual até o layout aprovado que originou a linha 0.2.x.

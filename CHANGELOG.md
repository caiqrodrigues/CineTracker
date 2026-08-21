# Changelog

Todas as mudanças relevantes do CineTracker são registradas aqui.

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
- A camada 0.2.1 envolve a aplicação 0.2.0 já aprovada, preservando sua lógica existente enquanto a interface/configurações é refinada antes da importação do histórico legado.

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

# Arquitetura do CineTracker

## Princípio central

O CineTracker usa uma conta única e um backend único para Web, Android e, futuramente, Windows.

```text
Web / Android / Windows
        │
        ├── Supabase Auth
        ├── PostgreSQL + RLS
        ├── Edge Functions
        └── TMDB via proxy backend
```

## Web como referência

A experiência Web é a implementação funcional de referência. Recursos compartilhados devem nascer ou ser validados no Web antes de serem promovidos para os wrappers nativos quando isso reduzir divergência de comportamento.

## Dados persistidos

- `profiles`: preferências e configurações de usuário.
- `media`: catálogo normalizado dos títulos já utilizados pelo sistema.
- `media_overrides`: estados manuais do usuário.
- `episode_progress`: progresso por episódio.
- `recommendation_history`: histórico de exibição/troca/ação para evitar repetição.
- `daily_menus`: menus diários persistidos.
- `imports`: controle de importações.
- `import_items`: itens individuais importados e status de conciliação.

## Regra anti-repetição

Um título não entra em “Fora da lista” quando já está em um estado incompatível com novidade ou quando o histórico de recomendações indicar que ele foi exibido dentro da janela de repetição configurada.

## Android

A linha Android começa com WebView nativa apontando para a experiência Web oficial. A identidade do usuário continua sendo a conta Supabase. Recursos nativos podem ser adicionados sem duplicar o modelo de dados.

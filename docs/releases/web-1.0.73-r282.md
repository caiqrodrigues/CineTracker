# Web 1.0.73 / r282

## Problema reproduzido

Depois de marcar um episódio como assistido, a série podia subir algumas posições mas não necessariamente para o topo de `Assistir a seguir`. O payload r6 já ordena por `last_watched_at`, porém a reconciliação fresca do TMDB pode alterar `home_bucket` depois dessa ordenação inicial; ao entrar no novo bucket, a série herdava a posição antiga no array canônico.

## Regra corrigida

- dentro de cada bucket final de séries, a ordem é `last_watched_at DESC`;
- a última série assistida fica em primeiro quando ainda pertence a `Assistir a seguir` ou `Juntando poeira`;
- se o episódio marcado deixa a série `Em dia` ou `Concluída`, o bucket final vence e a série permanece nessa seção;
- a ordenação também é aplicada a `Em dia` e `Concluídas`, sempre sem mover uma mídia entre buckets;
- itens sem data de última visualização mantêm ordem estável.

## Preservado

A r282 herda integralmente a r281: clique do `✓` isolado do card, writer `cinetracker_mark_watch_v0994`, recarga única pelo payload r6, check minimalista, Séries/Filmes fixo, sidebar fixa, Histórico acima da viewport inicial, cards ricos, deduplicação por TMDB, Reassistir, Descobrir, detalhes e Sports/F1. Android permanece 1.0.20 / versionCode 10062.

## Validação

O teste Chromium executa em 420 px e 1200 px com uma ordem de origem em que Lioness aparece abaixo de SmackDown/Lanternas/Reacher, mas possui `last_watched_at` mais recente. A saída obrigatória coloca Lioness em primeiro. O teste também confirma que uma série `Em dia` continua no bucket `Em dia` e que empates sem data preservam ordem estável.

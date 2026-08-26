# Registro técnico — reconciliação Bingers de 2026-08-26

Este arquivo preserva a cronologia técnica das correções de importação e estatísticas para que o projeto não dependa de histórico de conversa.

## Arquivos de origem e semântica

A importação considerada válida usa somente `library.csv` e `watches.csv`. Arquivos de ratings, avaliações, comentários e listas não participam da migração. Decisões manuais já existentes no CineTracker prevalecem sobre qualquer inferência importada.

Totais de referência do conjunto importado:

- biblioteca: 3.078;
- filmes na biblioteca: 2.318;
- séries na biblioteca: 760;
- registros de watches: 12.696;
- registros de filmes: 949;
- registros de episódios: 11.747;
- plays de filmes: 1.312;
- plays de episódios: 14.904;
- plays totais: 16.216.

## Falha da tentativa legada

A tentativa de import ID 5 avançou até cursor 8.178 e ficou presa. O erro anterior identificado em `watch_history` era um bulk payload PostgREST com objetos de shapes diferentes: episódios tinham `season_number` e `episode_number`; filmes não possuíam as chaves.

A correção tornou as linhas de filme homogêneas com `season_number: null` e `episode_number: null`.

A tentativa legada foi encerrada como `failed` com código `LEGACY_PIPELINE_STALLED`, evitando um registro falso de `processing` permanente.

## HOTFIX16 / Edge Function v8

O importador foi endurecido para:

- autenticar o bearer token no backend;
- classificar falhas de auth, transientes e permanentes;
- suportar begin idempotente com `client_run_id`;
- aplicar contrato de cursor e replay seguro;
- rejeitar dados inválidos sem inventar datas;
- deduplicar histórico/progresso/overrides;
- limpar somente dados do Bingers/import-origin da execução anterior;
- preservar overrides manuais conflitantes;
- finalizar somente quando cursor, total e contagem de histórico forem exatos;
- gravar falha permanente no registro de importação.

## Importação direta verificada

A execução reconciliada foi registrada como import ID 6 e concluída com 3.078 itens de biblioteca + 12.696 registros de histórico. A verificação final encontrou 0 eventos sem mídia correspondente.

As repetições são representadas em `external_ids.plays`; não são criadas datas fictícias para representar plays adicionais.

## Estatísticas e limite de paginação

Contagens do Perfil não devem ser inferidas carregando tabelas completas no cliente, porque PostgREST pode limitar resultados e distorcer agregados. Foram adicionadas/ajustadas RPCs server-side para estatísticas de perfil, estado de séries e consumo diário.

Valores reconciliados relevantes:

- episódios assistidos: 14.904;
- séries com histórico: 227;
- tempo em filmes: 3 meses 20 dias 13 horas;
- tempo total: 16 meses 19 dias 5 horas.

## Classificação de séries

Após revisão explícita do estado real das séries, a regra ficou:

- título encerrado/cancelado e usuário em dia → `Completed`;
- título ainda ativo ou aguardando nova temporada/episódio e usuário em dia → `UpToDate`;
- título realmente iniciado e ainda atrasado → `InProgress`;
- título sem nenhum episódio visto → `AddedToWatchlist` / Não iniciadas, salvo decisão manual.

Resultado do conjunto reconciliado:

- 155 `Completed`;
- 47 `UpToDate`;
- 25 `InProgress`;
- 533 não iniciadas;
- 227 séries com histórico.

## Erro de zero episódios do Bingers

Foram observadas séries marcadas como iniciadas pelo Bingers apesar de zero episódios vistos. Elas não devem contar como histórico ou `InProgress`.

Foram adicionadas proteções de banco para impedir/limpar esse estado em imports Bingers. A verificação posterior retornou zero séries `InProgress` sem histórico.

## Identificadores TMDB substitutos

O importador pode gerar IDs negativos substitutos quando não existe TMDB real. Esses IDs não podem ser tratados como IDs válidos pela API TMDB. Foram observados 404 do `tmdb-proxy` em paths com IDs negativos. Isso permanece débito técnico: o cliente deve ignorar TMDB para IDs <= 0 ou o modelo de identificação deve separar surrogate ID de `tmdb_id`.

## Segurança pendente

Advisories do Supabase ainda exigem revisão, incluindo funções `SECURITY DEFINER` executáveis por papéis amplos e proteção contra senhas vazadas desativada. Estruturas históricas de staging também devem ser revisadas quanto a RLS/policies. Não habilitar RLS sem políticas compatíveis apenas para silenciar advisor.

## Regra de continuidade

A partir de HOTFIX18 toda nova mudança deve seguir `docs/DEVELOPMENT_RULES.md`, possuir versão, registro no GitHub, release note e validação correspondente.

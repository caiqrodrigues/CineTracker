# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado em outra conversa sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-21
**Branch principal:** `main`

## 1. Objetivo do produto

Construir o aplicativo de uso diário do usuário para acompanhar filmes e séries e descobrir novos conteúdos, substituindo na prática apps como TV Time, Bingers e Showly/Trakt, com experiência sincronizada entre Web e Android.

## 2. Fontes e integrações principais

- TMDB para metadados oficiais, títulos, capas, elenco e imagens.
- Supabase para backend, autenticação e persistência/sincronização.
- GitHub para código, versionamento, releases e CI/CD.
- Web e Android devem compartilhar o mesmo estado do usuário.

## 3. Regras de domínio obrigatórias

### Séries concluídas

NÃO criar uma tabela separada `CompletedSeries`.

O estado de conclusão deve ser derivado de:

- episódios em `shows.pEp`;
- temporadas em `shows.pSe`;
- metadados oficiais do TMDB;
- correções/decisões manuais do usuário.

### Estado manual do usuário

Deve existir entidade persistente equivalente a `UserMediaState` ou `MediaOverride`, suportando pelo menos:

- `AlreadySeen`
- `Completed`
- `InProgress`
- `NotInterested`
- `Liked`
- `Disliked`
- `WatchLater`
- `AddedToWatchlist`

Estados/correções manuais têm prioridade sobre inferências automáticas e NUNCA podem ser apagados por nova importação.

## 4. Estatísticas obrigatórias

O aplicativo deverá calcular/exibir, no mínimo:

- filmes assistidos;
- séries com histórico;
- séries concluídas;
- séries em andamento;
- episódios assistidos;
- tempo total de filmes;
- tempo total de séries.

## 5. Regra de validação

Nenhum item de Windows, instalação, atualização, executável ou GitHub Actions pode ser marcado como validado/concluído apenas porque foi implementado ou compilado. Só deve ser marcado como validado após teste real correspondente.

## 6. Distribuição e portfólio

O projeto deve ser abastecido como projeto de portfólio profissional, incluindo progressivamente:

- apresentação do projeto;
- screenshots;
- arquitetura;
- tecnologias utilizadas;
- instruções para execução;
- releases/versionamento;
- histórico de commits organizado;
- executáveis/APKs nas Releases quando aplicável.

## 7. Estado técnico conhecido em 2026-08-21

Commits recentes confirmam trabalho ativo nas seguintes versões:

- Web `0.3.3`;
- Android `0.0.8`.

Último commit observado ao criar este documento:

`71cfc625a30b1ff911457d5747dfc23c24dc841b` — `ci(android): publish 0.0.8 synced with web 0.3.3`.

Correções imediatamente anteriores incluem:

- hidratação de títulos/capas do histórico e fotos de atores;
- restauração de navegação de metadados e imagens TMDB;
- sincronização da versão Android com a Web.

## 8. Problemas reportados que exigem validação visual/funcional

Os seguintes problemas foram reportados pelo usuário e NÃO devem ser considerados resolvidos somente pela existência dos commits de correção:

- nomes/títulos desaparecendo;
- capas/posters não aparecendo;
- Histórico não carregando/entrando corretamente;
- Perfil não carregando/entrando corretamente;
- fotos dos atores indisponíveis.

A correção só deve ser considerada concluída após confirmação em execução real.

## 9. Princípios de continuidade

Antes de alterações importantes:

1. Ler este arquivo.
2. Conferir o estado atual do repositório e commits recentes.
3. Não desfazer decisões arquiteturais registradas aqui sem decisão explícita do usuário.
4. Não tratar implementação como teste concluído.
5. Após mudança relevante, atualizar este arquivo com estado, versão, pendências e validações reais.

## 10. Próximo foco

Validar em execução real as correções da Web `0.3.3` / Android `0.0.8`, especialmente títulos, posters, Histórico, Perfil e imagens de atores. Registrar separadamente o que foi apenas implementado e o que foi efetivamente testado pelo usuário.

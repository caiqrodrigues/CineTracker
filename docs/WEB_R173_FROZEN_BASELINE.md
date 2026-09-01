# CineTracker Web — r173 Frozen Baseline

**Status:** FROZEN / NÃO ALTERAR  
**Versão Web:** 0.99.7  
**Revision:** `r173-detail-left-window`  
**Commit canônico de produção:** `9157d436bab8619a2cfbd492d35052176654c3ff`  
**Data de congelamento:** 2026-09-01

## Regra absoluta

A Web r173 é a referência visual e funcional atual do CineTracker. A partir deste ponto, trabalhos de Android devem **portar/adaptar** esta versão sem modificar o código Web r173. Qualquer mudança futura na Web exige solicitação explícita e uma nova revision separada.

Vídeo/print real do usuário prevalece sobre CI se houver divergência visual ou funcional.

## Navegação global

- Home
- Descobrir
- Esportes
- Perfil
- Configurações
- busca global de filmes, séries e atores
- opção Voltar nas telas internas
- detalhes de filme, série e pessoa

## Home

### Séries
- inicia em `Assistir a seguir`, sem correr visualmente pelo histórico;
- histórico inicia escondido;
- mantém progresso assistido/total, temporada/episódio atual e faltantes;
- mostra também nome do episódio, nota TMDB do episódio e data de lançamento;
- botão rápido para marcar próximo episódio lançado como visto;
- categorias de continuidade, poeira, em dia, não iniciadas/Watchlist e concluídas.

### Filmes
- inicia na Watchlist/assistir a seguir;
- histórico de filmes permanece disponível;
- não usa o selo verde gigante `VISTO` sobre os cards da Home.

## Descobrir

Abas canônicas da r173:
- Pra você
- Top 10
- Em alta
- Populares
- Novidades
- Lançamentos
- Mais Aguardados
- Mais bem avaliados
- Calendário

### Pra você
Ordem:
1. Indicação do dia
2. Da sua Watchlist
3. 100% novos

Regras:
- não recomendar itens já vistos/concluídos/em andamento;
- não colocar item da Watchlist em conteúdo 100% novo;
- cards compactos;
- ações Watchlist e Trocar por tipo;
- Filme, Série e Anime tratados separadamente.

### Coleções públicas
- carrossel horizontal;
- scroll lateral;
- Ver mais / Ver menos;
- exclusões pessoais aplicadas antes da exibição.

### Top 10
- separado entre Top 10 Séries e Top 10 Filmes;
- ranking diário por popularidade TMDB entre títulos disponíveis por assinatura no Brasil;
- somente os streamings canônicos listados abaixo.

## Streamings canônicos

Top 10 e Onde Assistir aceitam somente:
1. HBO Max
2. Amazon Prime Video
3. Netflix
4. Globoplay
5. Disney+
6. Apple TV+
7. Paramount+
8. Looke
9. Mubi
10. Crunchyroll

Variantes de plano são consolidadas no serviço principal. Canais `Amazon Channel`, planos `with Ads`, `Premium`, `Standard with Ads` etc. não aparecem duplicados.

## Esportes

- Central esportiva com Hoje, Ontem, Recentes, Ao vivo, Calendário, Favoritos e Assistidos;
- busca global por jogo, time e competição, não limitada ao lote já sincronizado;
- filtro rápido visual;
- categorias de esporte;
- favoritos de competições/times;
- `Ver eventos` de ligas/favoritos;
- sincronização em blocos respeitando o limite do provedor;
- calendário cobre período recente e futuro necessário;
- cada jogo pode ser marcado/desmarcado como assistido;
- jogos assistidos alimentam histórico e estatísticas esportivas.

## Perfil

### Estatísticas — duas linhas de cinco cards
Linha 1:
- Episódios
- Filmes
- Séries Watchlist
- Filmes Watchlist
- Tempo total de tela

Linha 2:
- Tempo em Séries
- Tempo em Filmes
- Tempo de série em Watchlist
- Tempo de filme em Watchlist
- Tempo total em Watchlist

Tempos usam formato compacto, por exemplo `48M 17D 05H`.

### Esportes assistidos
Mantidos em seção própria; não duplicar as mesmas estatísticas na caixa geral.

### Assistido por dia
- nome canônico: `Assistido por dia`;
- soma episódios + filmes + esportes;
- exatamente 15 dias;
- Hoje é o último dia;
- sem dias futuros;
- dia novo começa em zero;
- scroll horizontal;
- dia clicável abre o que foi visto naquele dia.

### Coleções do Perfil
- Séries
- Filmes
- Séries Favoritas
- Filmes Favoritos
- Atores Favoritos
- botões Ver mais funcionais
- botões adicionar série/filme/ator funcionais

## Detalhe de filme

- hero com backdrop;
- bloco principal **enjanelado e ancorado à esquerda**;
- capa, título, diretor, metadados, gêneros, duração, nota e sinopse juntos no painel;
- país de produção;
- ações Watchlist, Visto/Reassistido e Favorito;
- Onde Assistir;
- elenco/atores;
- Títulos Relacionados após atores;
- sem bloco de sentimento/comunidade e sem avaliação pessoal nessa área.

## Detalhe de série

- mesmo padrão visual rico do filme;
- bloco principal **enjanelado e ancorado à esquerda**;
- capa, título, criadores, metadados, gêneros, episódios, estado, nota e sinopse;
- país de produção;
- Watchlist, Visto/Reassistido e Favorito;
- Onde Assistir;
- temporadas;
- elenco;
- relacionados;
- gráficos de avaliações por temporada.

### Temporadas e episódios
- clicar em temporada abre painel lateral direito;
- episódio mostra imagem/still, título, SxxExx, duração, nota, data e sinopse;
- visto aparece realmente checkado;
- Reassistido disponível para episódio já visto;
- estado de série vista é reconciliado pela identidade TMDB lógica, inclusive quando existem registros locais duplicados.

### Gráfico de episódios
- seção moderna/futurista independente;
- um gráfico por temporada;
- carrossel horizontal e scroll lateral;
- melhor episódio destacado em verde;
- pior episódio destacado em vermelho;
- demais pontos seguem o visual da série;
- atalhos de melhor/pior episódio abrem o episódio correspondente.

## Onde Assistir

- disponibilidade do Brasil;
- referência JustWatch/TMDB;
- somente os 10 streamings canônicos;
- card com logo e tipo de disponibilidade (Stream/Alugar/Comprar quando aplicável);
- sem duplicação por plano/canal.

## Atores / Pessoa

- biografia em pt-BR quando disponível;
- fallback para inglês quando não houver biografia em português;
- botão funcional para adicionar/remover ator dos favoritos;
- filmografia separada em Filmes e Séries;
- cards de filmografia abrem o título correspondente.

## Títulos Relacionados

- seção depois de Atores;
- mistura filmes e séries;
- identifica o tipo;
- mostra ano, gêneros, duração para filme, classificação etária e nota TMDB quando disponível;
- somente duas ações: Watchlist e Visto;
- não mostra título já visto;
- não mostra título já presente na Watchlist.

## Dados e confiabilidade

- sessão Supabase com refresh em falhas 401 do TMDB;
- leituras pesadas possuem retry/coalescing onde aplicado;
- `media_overrides.profile_id` protegido para RLS/autenticação;
- identidade de mídia usa TMDB lógico para reduzir registros duplicados;
- sincronização da biblioteca permanece funcional em Configurações;
- preload do Descobrir é em etapas para não saturar banco/TMDB.

## Autoridade para Android

Android 0.99.7.4 deve empacotar o **mesmo `app-v173.js` + `app-v173.css` gerados por `apps/web/build-r173.mjs`**, acrescentando somente adaptações de viewport/navegação/mobile. Regras de negócio não devem ser reimplementadas de forma divergente no APK.

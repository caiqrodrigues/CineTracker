# CineTracker 0.99.7 — smoke real Web/PWA

## Estado

A produção permanece intocada. O trabalho corretivo continua no PR #29 (`fix/0997-real-smoke-hotfix`) e não deve ser mergeado antes do smoke real aprovado.

## Falhas observadas no smoke

- mistura visual/DOM de versões antigas com 0.99.7;
- navegação duplicada e entrada de Histórico reaparecendo;
- busca duplicada na Home;
- capas ausentes ou incorretas;
- nomes/metadados locais contaminados por correspondência TMDB incorreta;
- detalhe podendo abrir mídia diferente quando resoluções antigas usavam aproximação;
- Descobrir bloqueado, vazio ou com recomendações inadequadas depois das exclusões pessoais;
- Perfil contendo blocos/gráficos/históricos redundantes fora do contrato desejado.

## Contrato atual do Perfil

Somente estes oito blocos, nesta ordem:

1. Estatísticas Básicas
2. Séries
3. Filmes
4. Séries Favoritas
5. Filmes Favoritos
6. Atores Favoritos
7. Episódios por Dia
8. Estatísticas Extras

O histórico não existe como bloco separado. Nas seções Séries e Filmes, os itens mais recentes ficam visíveis e o histórico restante é revelado dentro da própria seção.

## Correções v121 (sem bump de versão e sem refatoração paralela)

- mantém a arquitetura normal da 0.99.7; não reutiliza o runtime consolidado abandonado;
- reforça remoção de entrada Histórico, versões antigas e busca duplicada;
- adiciona revelação do histórico dentro de Séries/Filmes sem criar seção extra;
- marca visualmente os cards de Séries Favoritas e Filmes Favoritos com coração;
- reforça centralização do gráfico Episódios por Dia e adiciona retry caso o Perfil fique preso no carregamento;
- valida `raw_tmdb` antes de usar título/capa persistidos; metadado que não corresponda exatamente ao título/ano local não é confiado visualmente;
- resolução de mídia continua exata por aliases (`title/name/original_title/original_name`) e ano, sem `rows[0]`, `results[0]`, `includes` ou tolerância de ano;
- Descobrir deixa de recomendar itens da Watchlist no Pra Você;
- Descobrir passa a buscar múltiplas páginas do TMDB para não ficar vazio só porque a primeira página inteira foi excluída pela biblioteca do usuário;
- Pra Você usa gêneros percebidos no histórico/favoritos para ampliar recomendações novas;
- Indicação do dia continua sendo filme e também respeita todas as exclusões pessoais;
- abas mantidas: Pra Você, Em alta, Mais aguardados, Populares, Mais bem avaliados e Calendário;
- filtros mantidos: Todos/Séries/Filmes e Lista/Carrossel/Grade;
- dados do Descobrir são carregados por aba, evitando baixar todas as categorias ao abrir a tela.

## Segurança de publicação

- não mergear PR #29 antes do smoke real;
- não publicar a Edge Function de enriquecimento antes da validação;
- não gerar nova release Android antes da validação;
- continuar na versão 0.99.7 durante esta correção.

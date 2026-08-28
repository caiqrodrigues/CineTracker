# CineTracker 0.99.7 — smoke real Web/PWA

## Estado

A produção permanece intocada. O trabalho corretivo continua no PR #29 (`fix/0997-real-smoke-hotfix`) e não deve ser mergeado antes do smoke real aprovado.

## Falhas observadas no smoke

- mistura visual/DOM de versões antigas com 0.99.7;
- navegação duplicada, menu inferior vazando para desktop e entrada de Histórico reaparecendo;
- busca duplicada na Home;
- Home presa em sincronização até terminar em timeout;
- capas ausentes ou incorretas;
- nomes/metadados locais contaminados por correspondência TMDB incorreta;
- detalhe podendo abrir mídia diferente quando resoluções antigas usavam aproximação;
- Descobrir bloqueado, vazio ou mostrando itens já vistos/Watchlist;
- Perfil contendo Tempo de Tela, Histórico e outros elementos redundantes fora do contrato desejado;
- Perfil estourando horizontalmente com listas muito extensas.

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

Tempo de Tela e Histórico legados devem ser removidos. Séries e Filmes mostram 10 cards no Perfil; o 11º elemento é **Ver mais**, que abre a lista completa em painel próprio sem esticar horizontalmente a página.

## Correções v121

- mantém a arquitetura normal da 0.99.7; não reutiliza o runtime consolidado abandonado;
- reforça remoção de entrada Histórico, versões antigas e busca duplicada;
- marca visualmente os cards de Séries Favoritas e Filmes Favoritos com coração;
- reforça centralização do gráfico Episódios por Dia e adiciona retry caso o Perfil fique preso no carregamento;
- valida `raw_tmdb` antes de usar título/capa persistidos;
- resolução de mídia continua exata por aliases (`title/name/original_title/original_name`) e ano;
- Descobrir consulta múltiplas páginas do TMDB e carrega dados por aba.

## Correções v122 — smoke ao vivo no navegador

- Home não espera mais o timeout longo do payload completo: sem cache, após uma janela curta monta um payload funcional pelo dashboard; quando o payload completo terminar, ele alimenta o cache normalmente;
- menu inferior fica oculto no desktop e a navegação é deduplicada;
- largura de `app/content/Perfil/Descobrir` é limitada à viewport; o scroll horizontal fica restrito aos carrosséis internos;
- Séries e Filmes no Perfil ficam limitados a 10 cards + 11º **Ver mais**;
- painel **Ver mais** mostra a lista completa em grid responsivo, inclusive no APK quando esse bundle for aprovado/gerado;
- Tempo de Tela e Histórico antigos são removidos mesmo quando um renderer legado tentar inseri-los fora do host autoritativo;
- cards do Descobrir recebem ação **+ Watchlist** usando a ação rápida canônica já existente;
- depois de adicionar à Watchlist, o item deixa a recomendação atual e as exclusões são invalidadas;
- exclusões do Descobrir passam por uma segunda validação que combina RPC + dashboard local, por ID TMDB e aliases com ano, reduzindo itens já vistos/Watchlist em Em alta, Mais aguardados e Mais bem avaliados;
- Calendário ganha o filtro **Minha Watchlist**, que mostra lançamentos de filmes, estreias de séries e próximos episódios conhecidos da Watchlist na janela suportada;
- o cache interno PWA/TMDB foi rotacionado para `ct-web-0.99.7-r122`, sem alterar a versão exibida, para eliminar metadados/capas antigos entre rodadas da mesma 0.99.7.

## Segurança de publicação

- versão exibida continua 0.99.7;
- não mergear PR #29 antes do smoke real;
- não publicar a Edge Function de enriquecimento antes da validação;
- não gerar nova release Android antes da validação.

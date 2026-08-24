# Segurança

## Versões de referência

- Web: **0.5.7**
- Android: **0.0.83** (`versionCode 83`)

Esta documentação acompanha a geração cache-first do CineTracker. A mudança de arquitetura não altera permissões de acesso aos dados nem transforma cache local em fonte de autoridade.

## Credenciais

- Nunca versionar `service_role` do Supabase.
- Nunca versionar token secreto da TMDB.
- O frontend pode usar somente chave Supabase publicável/anon destinada a clientes públicos.
- Secrets backend ficam em variáveis do ambiente ou secrets de Edge Functions.
- Service Worker, IndexedDB e cache do WebView não devem armazenar credenciais privilegiadas.

## Banco e autorização

- RLS deve permanecer habilitado nas tabelas com dados de usuário.
- Políticas usam `auth.uid()` para restringir leitura e escrita ao dono dos dados.
- Supabase continua sendo a fonte consolidada do estado persistente da conta.
- Cache local é apenas uma cópia operacional para abertura, navegação e funcionamento mais fluido.
- Decisões manuais do usuário têm precedência sobre importações automáticas e recomposição de metadados.

## Cache local — Web 0.5.7

A Web utiliza IndexedDB para snapshots operacionais e Service Worker para recursos/metadados compatíveis.

Regras de segurança e consistência:

- cache nunca deve contornar RLS ou autorização do backend;
- dados retornados pelo cache pertencem à sessão/conta que os originou;
- logout/troca de identidade deve impedir reutilização indevida de dados privados de outra conta;
- respostas de autenticação e segredos não devem ser tratadas como recursos públicos pelo Service Worker;
- falha ou expiração do cache não pode promover dado local a autoridade sobre o backend;
- atualizações silenciosas continuam sujeitas às mesmas regras de autenticação das chamadas normais.

## Cache local — Android 0.0.83

O Android utiliza cache HTTP/WebView e IndexedDB dentro da WebView para snapshots de performance.

- o aplicativo mantém `setAllowFileAccess(false)`;
- conteúdo misto permanece bloqueado (`MIXED_CONTENT_NEVER_ALLOW`);
- URLs externas não autorizadas são abertas fora da WebView;
- Supabase e o domínio oficial permanecem como destinos internos esperados;
- cache local não contém chave `service_role` nem token secreto TMDB;
- a ponte nativa deve expor somente operações necessárias ao aplicativo.

## TMDB e imagens

TMDB é acessado por proxy/backend quando aplicável. Capas e metadados podem ser armazenados em cache para reduzir chamadas repetidas, mas:

- nenhuma credencial secreta TMDB deve ser exposta no cliente;
- uma resposta de imagem/metadado em cache não concede acesso adicional a dados de usuário;
- falhas de rede não devem apagar metadados válidos já conhecidos;
- refresh de metadados não deve sobrescrever decisões manuais do usuário.

## Sincronização

A arquitetura 0.5.7/0.0.83 prioriza renderização local e sincronização posterior. Isso não muda a autoridade do backend.

Em conflitos:

1. estados manuais persistidos do usuário têm prioridade sobre inferências;
2. backend autenticado é a referência persistente compartilhada entre dispositivos;
3. cache local deve ser reconciliado/atualizado, não usado para contornar regras do banco;
4. metadados TMDB não devem alterar estados pessoais de acompanhamento por conta própria.

## Importação

Arquivos importados são tratados como dados não confiáveis. O parser deve validar tipo, tamanho, estrutura e campos antes de persistir.

Uma importação não deve apagar decisões manuais existentes nem inserir conteúdo fora do escopo autorizado do usuário.

## Build e distribuição

### Web

O build executa `scripts/verify.mjs` antes da geração de `dist`. A versão só é considerada publicada após validação e deploy de produção confirmado.

### Android

O GitHub Actions valida módulos JavaScript, compila o APK, verifica assinatura, package `com.cinetracker.app` e `versionName 0.0.83` antes da publicação da Release `android-v0.0.83`.

O APK não deve ser considerado oficial apenas por existir um commit na `main`; o pipeline precisa concluir com sucesso.

## Status

A aplicação está em desenvolvimento ativo e não deve ser apresentada como formalmente auditada em segurança. Web 0.5.7 e Android 0.0.83 introduzem uma camada de cache/performance, não uma auditoria ou certificação de segurança.

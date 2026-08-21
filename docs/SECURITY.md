# Segurança

## Credenciais

- Nunca versionar `service_role` do Supabase.
- Nunca versionar token secreto da TMDB.
- O frontend pode usar somente chave Supabase publicável/anon destinada a clientes públicos.
- Secrets backend ficam em variáveis do ambiente ou secrets de Edge Functions.

## Banco

- RLS deve permanecer habilitado nas tabelas com dados de usuário.
- Políticas usam `auth.uid()` para restringir leitura e escrita ao dono dos dados.
- Decisões manuais do usuário têm precedência sobre importações automáticas.

## Importação

Arquivos importados são tratados como dados não confiáveis. O parser deve validar tipo, tamanho, estrutura e campos antes de persistir.

## Status

A aplicação está em desenvolvimento ativo e não deve ser apresentada como formalmente auditada em segurança.

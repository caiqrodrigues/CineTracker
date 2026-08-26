# Regras obrigatórias de desenvolvimento e registro

**Vigência:** 2026-08-26  
**Aplicação:** todo o repositório CineTracker, Web, Android, Supabase, banco de dados, importadores, CI/CD e documentação.

## Regra principal

**Toda atualização ou mudança do CineTracker deve gerar registro no GitHub e deve estar associada a uma versão explícita.**

Nenhuma alteração funcional, correção, migração, mudança de regra de domínio, mudança de build, alteração de importação, mudança de segurança ou modificação de comportamento pode existir apenas em conversa, console, Supabase ou ambiente local.

Uma unidade lógica de mudança pode exigir vários commits; esses commits pertencem à mesma versão enquanto a unidade não estiver encerrada. Uma nova unidade de mudança posterior exige novo incremento de versão.

## Checklist obrigatório para cada mudança

1. Definir a nova versão antes ou junto da implementação.
2. Alterar todos os identificadores de versão afetados: pacote Web, versão exibida, namespace de cache, Android `versionName` e `versionCode`, bundle/runtime e workflow de release quando aplicável.
3. Registrar a mudança no `CHANGELOG.md`.
4. Atualizar `PROJECT_STATE.md` com o estado real do projeto.
5. Atualizar `VERSIONS.md` com a matriz de versão por sistema.
6. Atualizar `README.md` e o README da plataforma afetada.
7. Criar ou atualizar a nota da release em `docs/releases/`.
8. Criar ou atualizar o registro de validação em `docs/validation/`.
9. Atualizar `docs/ARCHITECTURE.md` se a mudança alterar fluxo, responsabilidade, armazenamento, integração ou runtime.
10. Atualizar `docs/SECURITY.md` se houver impacto de autenticação, autorização, RLS, funções privilegiadas, segredos, upload/importação ou superfície pública.
11. Alterações de banco devem possuir migration versionada em `supabase/migrations/`; mudanças de Edge Function devem manter o código-fonte correspondente em `supabase/functions/`.
12. Não marcar build, APK, deploy, produção, Android real ou comportamento visual como validado sem evidência real.

## Fonte de verdade e precedência

- GitHub `main`: fonte de verdade do código, documentação, migrations e pipelines.
- Supabase: fonte de verdade do estado persistente da conta e backend ativo.
- TMDB: fonte externa de metadados; não é fonte de verdade para decisões manuais do usuário.
- Decisões manuais do usuário têm prioridade sobre inferências e importações automáticas.

## Versionamento atual

A regra passa a valer formalmente a partir de **CineTracker 0.0.97 HOTFIX 18**.

- Web: `0.0.97 HOTFIX 18` / pacote `0.0.97-hotfix18-documentation-governance`.
- Android: `0.0.97 HOTFIX 18`, `versionCode 995`.
- Backend lógico do projeto: alinhado à release `0.0.97 HOTFIX 18`; Edge Functions preservam seus próprios números de deploy.
- Windows: ainda não possui release.

## Publicação x versão de código

A versão de código pode existir antes de estar publicada. O estado deve ser informado separadamente:

- **source/current target**: versão já gravada na `main`;
- **validated**: verificações automatizadas concluídas;
- **published**: artefato/deploy efetivamente publicado;
- **device-validated**: instalado e testado em dispositivo real quando aplicável.

Nunca usar "publicado" ou "validado" como sinônimo de "o código foi commitado".

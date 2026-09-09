# Web 1.0.32 / r240 — Sports

Contrato validado:
- Próximos: somente eventos futuros do dia de hoje.
- Anteriores: somente eventos dos três dias anteriores, sem itens mais antigos.
- Favoritos: consulta somente eventos de favoritos.
- Assistidos: preserva a fonte canônica já existente de eventos assistidos.
- Abas removidas da interface: Hoje, Ontem, Recentes, Ao vivo e Calendário.

Validação Chromium executa as funções reais `sportsTabs`, `sportsPayload` e `sportsFiltered`, incluindo limites de data, flag `p_favorite_only` e delegação para a fonte canônica de Assistidos.
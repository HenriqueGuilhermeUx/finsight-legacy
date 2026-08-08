# F-Insight - Guia do Administrador

Este documento explica como você controla e administra toda a plataforma F-Insight, incluindo o site web, app mobile, usuários, conteúdo e monetização.

---

## Visão Geral do Controle

Você tem **controle total** sobre a plataforma através de três interfaces principais:

| Interface | Acesso | Funcionalidades |
|-----------|--------|-----------------|
| **Painel Web (Dashboard)** | f-insight.org/dashboard | Gerenciar usuários, ver analytics, moderar conteúdo |
| **Management UI (Manus)** | Painel direito no chat | Publicar, configurar domínio, ver métricas, editar secrets |
| **Banco de Dados** | Management UI > Database | CRUD direto nas tabelas, queries SQL |

---

## 1. Management UI (Painel Manus)

Após publicar o site, você acessa o painel de gerenciamento clicando no ícone no canto superior direito do chat. Este painel oferece:

### Preview
Visualização ao vivo do site com editor visual. Você pode selecionar qualquer elemento e ajustar cores, bordas, padding diretamente. Mudanças criam um novo checkpoint automaticamente.

### Code
Acesso a todos os arquivos do projeto. Você pode baixar o código completo ou visualizar arquivos específicos.

### Dashboard
Monitoramento em tempo real:
- **Status do servidor**: Running/Stopped
- **Visibilidade**: Público/Privado
- **Analytics**: Visitantes únicos (UV), Page views (PV)
- **Uptime**: Tempo online

### Database
Interface visual para gerenciar o banco de dados:
- Ver todas as tabelas (users, portfolios, alerts, tournaments, etc.)
- Adicionar/editar/deletar registros
- Executar queries SQL customizadas
- Informações de conexão (host, porta, usuário) no canto inferior esquerdo

### Settings

#### General
- Nome do site
- Favicon
- Visibilidade (público/privado)

#### Domains
- Prefixo do domínio automático (xxx.manus.space)
- Comprar domínio personalizado
- Vincular domínio existente (f-insight.org)

#### Notifications
- Configurar notificações do sistema
- Alertas para novos usuários, erros, etc.

#### Secrets
- Visualizar/editar variáveis de ambiente
- API keys, tokens, configurações sensíveis

---

## 2. Painel de Administrador no Site

Como **owner** do projeto, você tem acesso automático ao papel de administrador. Para acessar funcionalidades admin:

### Promover Usuários a Admin

1. Acesse **Management UI > Database**
2. Selecione a tabela `users`
3. Encontre o usuário desejado
4. Edite o campo `role` de `user` para `admin`
5. Salve

### Funcionalidades Exclusivas de Admin

Usuários com `role: admin` podem:
- Ver todos os portfólios (públicos e privados)
- Moderar chat e mensagens
- Gerenciar torneios (criar, editar, encerrar)
- Banir usuários
- Ver métricas detalhadas de todos os usuários

### Acessar via Código

No código, use `adminProcedure` para proteger rotas:

```typescript
// server/routers.ts
adminOnlyProcedure: protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
}),
```

---

## 3. Gerenciamento de Usuários

### Ver Todos os Usuários

1. **Management UI > Database > users**
2. Visualize: id, openId, name, email, role, createdAt

### Ações Disponíveis

| Ação | Como Fazer |
|------|------------|
| Promover a admin | Editar `role` para `admin` |
| Banir usuário | Adicionar campo `banned: true` ou deletar registro |
| Ver atividade | Consultar tabelas `portfolios`, `alerts`, `transactions` |
| Reset de dados | Deletar registros relacionados ao userId |

---

## 4. Gerenciamento de Conteúdo

### Torneios

Tabela: `tournaments`

| Campo | Descrição |
|-------|-----------|
| name | Nome do torneio |
| description | Descrição |
| startDate | Data de início |
| endDate | Data de término |
| status | draft, active, completed |
| prizePool | Prêmios em XP |

Para criar um torneio:
1. Database > tournaments > Add Record
2. Preencha os campos
3. Mude status para `active` quando quiser iniciar

### Badges e Conquistas

Tabela: `badges`

Você pode criar novos badges editando diretamente a tabela ou via código em `client/src/pages/Conquistas.tsx`.

---

## 5. Monetização e Assinaturas

### RevenueCat (In-App Purchases)

Após configurar RevenueCat:
1. Acesse https://app.revenuecat.com
2. Veja métricas: MRR, churn, LTV
3. Gerencie produtos e preços
4. Veja transações individuais

### Stripe (Web)

Se configurado:
1. Acesse https://dashboard.stripe.com
2. Veja pagamentos, assinaturas, clientes
3. Configure webhooks para sincronizar com o banco

### Sincronização

O campo `subscriptionStatus` na tabela `users` indica:
- `free`: Usuário gratuito
- `premium`: Assinante premium
- `pro`: Assinante pro

---

## 6. Analytics e Métricas

### Métricas Disponíveis

| Métrica | Onde Ver |
|---------|----------|
| Visitantes únicos | Management UI > Dashboard |
| Page views | Management UI > Dashboard |
| Usuários registrados | Database > users (count) |
| Portfólios criados | Database > portfolios (count) |
| Alertas ativos | Database > advancedAlerts (count) |
| Torneios ativos | Database > tournaments (filter status=active) |

### Queries Úteis

```sql
-- Total de usuários
SELECT COUNT(*) FROM users;

-- Usuários ativos (último mês)
SELECT COUNT(*) FROM users WHERE updatedAt > DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Portfólios por usuário
SELECT userId, COUNT(*) as total FROM portfolios GROUP BY userId;

-- Top traders por retorno
SELECT userId, SUM(returnPercent) as totalReturn 
FROM portfolioSnapshots 
GROUP BY userId 
ORDER BY totalReturn DESC 
LIMIT 10;
```

---

## 7. Backup e Recuperação

### Checkpoints

Cada `webdev_save_checkpoint` cria um snapshot completo do código. Para restaurar:
1. Encontre o checkpoint desejado no histórico
2. Clique em "Rollback"

### Banco de Dados

O banco de dados é gerenciado automaticamente. Para backup manual:
1. Database > Settings (canto inferior esquerdo)
2. Copie as credenciais de conexão
3. Use um cliente MySQL para exportar

---

## 8. Manutenção

### Reiniciar Servidor

Se o site ficar lento ou com erros:
1. Management UI > Dashboard
2. Clique em "Restart"

### Atualizar Código

1. Faça as alterações necessárias
2. Salve um novo checkpoint
3. O site atualiza automaticamente

### Monitorar Erros

1. Management UI > Dashboard
2. Veja "Recent output" para logs do servidor
3. Erros de TypeScript aparecem em "Health checks"

---

## 9. Segurança

### Boas Práticas

1. **Nunca compartilhe** as credenciais do banco de dados
2. **Mantenha secrets seguros** - use Management UI > Settings > Secrets
3. **Revise usuários admin** periodicamente
4. **Monitore atividades suspeitas** via logs

### Variáveis Sensíveis

Todas as variáveis sensíveis estão em:
- `JWT_SECRET`: Autenticação
- `DATABASE_URL`: Conexão do banco
- `STRIPE_SECRET_KEY`: Pagamentos
- `REVENUECAT_API_KEY`: Assinaturas mobile

---

## 10. Suporte e Escalabilidade

### Limites Atuais

| Recurso | Limite |
|---------|--------|
| Usuários simultâneos | ~1000 |
| Requisições/minuto | ~10000 |
| Armazenamento DB | 10GB |
| Armazenamento S3 | Ilimitado |

### Para Escalar

Quando precisar de mais capacidade:
1. Contate suporte Manus para upgrade de plano
2. Considere CDN para assets estáticos
3. Implemente cache Redis para dados frequentes

---

## Resumo de Acesso Rápido

| O que você quer fazer | Onde fazer |
|----------------------|------------|
| Ver visitantes | Management UI > Dashboard |
| Editar usuário | Management UI > Database > users |
| Criar torneio | Management UI > Database > tournaments |
| Mudar domínio | Management UI > Settings > Domains |
| Ver logs | Management UI > Dashboard > Recent output |
| Publicar mudanças | Management UI > Publish |
| Restaurar versão | Checkpoint > Rollback |

---

*Última atualização: Dezembro 2024*

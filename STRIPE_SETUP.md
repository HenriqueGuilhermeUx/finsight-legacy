# Configuração do Stripe - FinSight

## Visão Geral

A FinSight utiliza o Stripe para processar assinaturas premium. Este documento descreve como ativar e configurar o Stripe para produção.

## Status Atual

O projeto está configurado com um **sandbox de teste** do Stripe. Para ativar:

1. Acesse o link de reivindicação do sandbox fornecido na configuração do projeto
2. Complete o processo de verificação da conta Stripe
3. O sandbox estará ativo para testes

## Planos Configurados

| Plano | Preço Mensal | Preço Anual | Recursos |
|-------|--------------|-------------|----------|
| **Gratuito** | R$ 0 | R$ 0 | Radar básico, 5 alertas, 3 favoritos |
| **Pro** | R$ 29,90 | R$ 269,90 (25% off) | Radar completo, alertas ilimitados, favoritos ilimitados, IA avançada |
| **Enterprise** | R$ 199,90 | R$ 1.799,90 (25% off) | Tudo do Pro + API access, suporte prioritário, relatórios personalizados |

## Fluxo de Assinatura

1. Usuário acessa `/premium` e escolhe um plano
2. Clica em "Assinar" e é redirecionado para o Checkout do Stripe
3. Após pagamento, webhook atualiza o status do usuário
4. Usuário é redirecionado para `/premium?success=true`

## Webhooks Configurados

O endpoint `/api/stripe/webhook` processa os seguintes eventos:

- `checkout.session.completed` - Atualiza usuário para premium
- `customer.subscription.updated` - Atualiza período de assinatura
- `customer.subscription.deleted` - Remove status premium

## Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente:

- `STRIPE_SECRET_KEY` - Chave secreta do Stripe
- `STRIPE_WEBHOOK_SECRET` - Secret para validar webhooks
- `VITE_STRIPE_PUBLISHABLE_KEY` - Chave pública para o frontend

## Testando Pagamentos

Use os cartões de teste do Stripe:

| Cartão | Número | Resultado |
|--------|--------|-----------|
| Sucesso | 4242 4242 4242 4242 | Pagamento aprovado |
| Recusado | 4000 0000 0000 0002 | Pagamento recusado |
| 3D Secure | 4000 0025 0000 3155 | Requer autenticação |

**CVV**: Qualquer 3 dígitos  
**Data**: Qualquer data futura

## Migrando para Produção

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Ative o modo de produção
3. Atualize as variáveis de ambiente com as chaves de produção
4. Configure o webhook de produção apontando para seu domínio
5. Teste um pagamento real com valor baixo

## Suporte

Para dúvidas sobre a integração Stripe, consulte:
- [Documentação Stripe](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) para testes locais

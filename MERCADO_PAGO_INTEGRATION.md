# Integração Mercado Pago - F-Insight

## Visão Geral

O Mercado Pago oferece a solução de **Assinaturas** para pagamentos recorrentes automatizados.

### Funcionalidades:
- Gestão ágil de cobranças
- Cobranças recorrentes automatizadas
- Periodicidade personalizável (semanal, mensal, anual)
- Tentativas automáticas de cobrança em caso de falha
- Meios de pagamento: Pix, cartão de crédito/débito, boleto bancário

### Requisitos para Integração:
1. Conta de vendedor no Mercado Pago
2. Aplicação criada em "Suas integrações"
3. Credenciais (Access Token)

### Endpoints da API:

**Base URL:** `https://api.mercadopago.com`

**Criar Assinatura:**
```
POST /preapproval
```

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Body para assinatura mensal:**
```json
{
  "reason": "F-Insight Premium Mensal",
  "auto_recurring": {
    "frequency": 1,
    "frequency_type": "months",
    "transaction_amount": 49.00,
    "currency_id": "BRL"
  },
  "back_url": "https://f-insight.org/pagamento/sucesso",
  "payer_email": "email@cliente.com"
}
```

**Body para assinatura anual:**
```json
{
  "reason": "F-Insight Premium Anual",
  "auto_recurring": {
    "frequency": 1,
    "frequency_type": "years",
    "transaction_amount": 470.00,
    "currency_id": "BRL"
  },
  "back_url": "https://f-insight.org/pagamento/sucesso",
  "payer_email": "email@cliente.com"
}
```

### Webhooks

Configurar webhook para receber notificações de:
- `subscription_preapproval` - Criação/atualização de assinatura
- `subscription_authorized_payment` - Pagamento autorizado
- `subscription_preapproval_plan` - Alterações no plano

### Credenciais Necessárias

Para produção, você precisará:
- `MERCADO_PAGO_ACCESS_TOKEN` - Token de acesso da conta vendedor
- `MERCADO_PAGO_PUBLIC_KEY` - Chave pública para frontend

### Taxas do Mercado Pago

- Cartão de crédito: 4,99% + R$ 0,49 por transação
- Pix: 0,99% por transação
- Boleto: R$ 3,49 por boleto pago

### SDK Node.js

```bash
npm install mercadopago
```

```javascript
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
});

const preapproval = new PreApproval(client);

// Criar assinatura
const subscription = await preapproval.create({
  body: {
    reason: "F-Insight Premium",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 49,
      currency_id: "BRL"
    },
    back_url: "https://f-insight.org/pagamento/sucesso",
    payer_email: payerEmail
  }
});
```

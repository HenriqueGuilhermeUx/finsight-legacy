/**
 * Serviço de Integração com Mercado Pago
 * F-Insight - Pagamentos Recorrentes
 */

import { MercadoPagoConfig, PreApproval, PreApprovalPlan, Payment } from 'mercadopago';

// Configuração do cliente Mercado Pago
const getClient = () => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado');
  }
  return new MercadoPagoConfig({ accessToken });
};

// Planos de assinatura F-Insight
export const PLANS = {
  PREMIUM_MENSAL: {
    id: 'premium_mensal',
    name: 'F-Insight Premium Mensal',
    price: 49.00,
    frequency: 1,
    frequencyType: 'months' as const,
    description: 'Acesso completo a todas as funcionalidades premium por 1 mês'
  },
  PREMIUM_ANUAL: {
    id: 'premium_anual',
    name: 'F-Insight Premium Anual',
    price: 470.00, // ~20% desconto
    frequency: 1,
    frequencyType: 'years' as const,
    description: 'Acesso completo a todas as funcionalidades premium por 1 ano (economia de R$ 118)'
  }
};

// URLs de callback
const getBaseUrl = () => {
  return process.env.VITE_APP_URL || 'https://f-insight.org';
};

/**
 * Criar uma assinatura no Mercado Pago
 */
export async function createSubscription(params: {
  planId: 'premium_mensal' | 'premium_anual';
  payerEmail: string;
  payerName?: string;
  externalReference?: string;
}) {
  const client = getClient();
  const preapproval = new PreApproval(client);
  
  const plan = params.planId === 'premium_mensal' ? PLANS.PREMIUM_MENSAL : PLANS.PREMIUM_ANUAL;
  const baseUrl = getBaseUrl();
  
  try {
    const response = await preapproval.create({
      body: {
        reason: plan.name,
        external_reference: params.externalReference || `finsight_${Date.now()}`,
        payer_email: params.payerEmail,
        auto_recurring: {
          frequency: plan.frequency,
          frequency_type: plan.frequencyType,
          transaction_amount: plan.price,
          currency_id: 'BRL'
        },
        back_url: `${baseUrl}/pagamento/sucesso`,
        status: 'pending'
      }
    });
    
    return {
      success: true,
      subscriptionId: response.id,
      initPoint: response.init_point, // URL para redirecionar o usuário
      sandboxInitPoint: (response as any).sandbox_init_point, // URL para testes
      status: response.status
    };
  } catch (error: any) {
    console.error('Erro ao criar assinatura Mercado Pago:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar assinatura'
    };
  }
}

/**
 * Buscar detalhes de uma assinatura
 */
export async function getSubscription(subscriptionId: string) {
  const client = getClient();
  const preapproval = new PreApproval(client);
  
  try {
    const response = await preapproval.get({ id: subscriptionId });
    
    return {
      success: true,
      subscription: {
        id: response.id,
        status: response.status,
        reason: response.reason,
        payerEmail: response.payer_email,
        dateCreated: response.date_created,
        lastModified: response.last_modified,
        autoRecurring: response.auto_recurring,
        nextPaymentDate: response.next_payment_date
      }
    };
  } catch (error: any) {
    console.error('Erro ao buscar assinatura:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar assinatura'
    };
  }
}

/**
 * Cancelar uma assinatura
 */
export async function cancelSubscription(subscriptionId: string) {
  const client = getClient();
  const preapproval = new PreApproval(client);
  
  try {
    const response = await preapproval.update({
      id: subscriptionId,
      body: {
        status: 'cancelled'
      }
    });
    
    return {
      success: true,
      status: response.status
    };
  } catch (error: any) {
    console.error('Erro ao cancelar assinatura:', error);
    return {
      success: false,
      error: error.message || 'Erro ao cancelar assinatura'
    };
  }
}

/**
 * Pausar uma assinatura
 */
export async function pauseSubscription(subscriptionId: string) {
  const client = getClient();
  const preapproval = new PreApproval(client);
  
  try {
    const response = await preapproval.update({
      id: subscriptionId,
      body: {
        status: 'paused'
      }
    });
    
    return {
      success: true,
      status: response.status
    };
  } catch (error: any) {
    console.error('Erro ao pausar assinatura:', error);
    return {
      success: false,
      error: error.message || 'Erro ao pausar assinatura'
    };
  }
}

/**
 * Reativar uma assinatura pausada
 */
export async function reactivateSubscription(subscriptionId: string) {
  const client = getClient();
  const preapproval = new PreApproval(client);
  
  try {
    const response = await preapproval.update({
      id: subscriptionId,
      body: {
        status: 'authorized'
      }
    });
    
    return {
      success: true,
      status: response.status
    };
  } catch (error: any) {
    console.error('Erro ao reativar assinatura:', error);
    return {
      success: false,
      error: error.message || 'Erro ao reativar assinatura'
    };
  }
}

/**
 * Processar webhook do Mercado Pago
 */
export async function processWebhook(data: {
  type: string;
  action: string;
  data: { id: string };
}) {
  const client = getClient();
  
  try {
    switch (data.type) {
      case 'subscription_preapproval':
        // Assinatura criada ou atualizada
        const subscription = await getSubscription(data.data.id);
        return {
          type: 'subscription',
          action: data.action,
          subscription: subscription.subscription
        };
        
      case 'subscription_authorized_payment':
        // Pagamento autorizado
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: data.data.id });
        return {
          type: 'payment',
          action: data.action,
          payment: {
            id: paymentData.id,
            status: paymentData.status,
            amount: paymentData.transaction_amount,
            payerEmail: paymentData.payer?.email,
            externalReference: paymentData.external_reference
          }
        };
        
      default:
        return {
          type: data.type,
          action: data.action,
          data: data.data
        };
    }
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    throw error;
  }
}

/**
 * Verificar status de pagamento
 */
export async function getPaymentStatus(paymentId: string) {
  const client = getClient();
  const payment = new Payment(client);
  
  try {
    const response = await payment.get({ id: paymentId });
    
    return {
      success: true,
      payment: {
        id: response.id,
        status: response.status,
        statusDetail: response.status_detail,
        amount: response.transaction_amount,
        currency: response.currency_id,
        payerEmail: response.payer?.email,
        dateCreated: response.date_created,
        dateApproved: response.date_approved
      }
    };
  } catch (error: any) {
    console.error('Erro ao buscar pagamento:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar pagamento'
    };
  }
}

/**
 * Mapear status do Mercado Pago para status interno
 */
export function mapSubscriptionStatus(mpStatus: string): 'active' | 'paused' | 'cancelled' | 'pending' {
  switch (mpStatus) {
    case 'authorized':
      return 'active';
    case 'paused':
      return 'paused';
    case 'cancelled':
      return 'cancelled';
    case 'pending':
    default:
      return 'pending';
  }
}

/**
 * Mapear status de pagamento do Mercado Pago
 */
export function mapPaymentStatus(mpStatus: string): 'approved' | 'pending' | 'rejected' | 'refunded' {
  switch (mpStatus) {
    case 'approved':
      return 'approved';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return 'pending';
    case 'refunded':
    case 'charged_back':
      return 'refunded';
    case 'rejected':
    case 'cancelled':
    default:
      return 'rejected';
  }
}

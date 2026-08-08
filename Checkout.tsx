import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Check, CreditCard, Loader2, Shield, Zap, Crown, Star, TrendingUp, BarChart3 } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function Checkout() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'premium_mensal' | 'premium_anual'>('premium_anual');
  const [isLoading, setIsLoading] = useState(false);

  const createSubscription = trpc.mercadoPago.createSubscription.useMutation();

  const plans = [
    {
      id: 'premium_mensal' as const,
      name: 'Premium Mensal',
      price: 49,
      period: '/mês',
      description: 'Ideal para começar',
      features: [
        'Análise fundamentalista avançada',
        'Screener profissional com 50+ filtros',
        'Alertas ilimitados de preço',
        'Backtesting de 16 estratégias',
        'Relatórios em PDF',
        'Suporte prioritário',
        'Acesso ao chat de traders',
        'Participação em torneios'
      ],
      icon: Zap,
      popular: false
    },
    {
      id: 'premium_anual' as const,
      name: 'Premium Anual',
      price: 470,
      originalPrice: 588,
      period: '/ano',
      description: 'Melhor custo-benefício',
      discount: 20,
      features: [
        'Tudo do plano mensal',
        '20% de desconto (economia de R$ 118)',
        'Acesso antecipado a novidades',
        'Badges exclusivos',
        'Copy trading ilimitado',
        'Prioridade no suporte',
        'Materiais educacionais exclusivos',
        'Convites para eventos'
      ],
      icon: Crown,
      popular: true
    }
  ];

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }

    setIsLoading(true);
    try {
      const result = await createSubscription.mutateAsync({ planId: selectedPlan });
      
      // Redirecionar para o checkout do Mercado Pago
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              Oferta Especial
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Desbloqueie Todo o Potencial da F-Insight
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acesse ferramentas profissionais de análise financeira por uma fração do custo de um Bloomberg Terminal
            </p>
          </div>

          {/* Comparison */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>80% das funcionalidades do Bloomberg</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span>Por menos de 1% do custo</span>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-full mb-4 ${
                    plan.popular ? 'bg-amber-500/10' : 'bg-primary/10'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.popular ? 'text-amber-500' : 'text-primary'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mb-6">
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through mr-2">
                        R$ {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                    {plan.discount && (
                      <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-600">
                        -{plan.discount}%
                      </Badge>
                    )}
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={selectedPlan === plan.id ? 'default' : 'outline'}
                    size="lg"
                  >
                    {selectedPlan === plan.id ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="max-w-md mx-auto">
            <Button 
              className="w-full h-14 text-lg" 
              size="lg"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Assinar Agora
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <img 
                  src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/6.6.92/mercadopago/logo__large.png" 
                  alt="Mercado Pago" 
                  className="h-5"
                />
              </div>
            </div>
            
            <p className="text-center text-xs text-muted-foreground mt-4">
              Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade.
              Você pode cancelar a qualquer momento.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10.000+</div>
              <div className="text-sm text-muted-foreground">Usuários ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4.8/5</div>
              <div className="text-sm text-muted-foreground">Avaliação média</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime garantido</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Suporte disponível</div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! Você pode cancelar sua assinatura a qualquer momento pelo painel de configurações. 
                    O acesso continua até o fim do período pago.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quais formas de pagamento são aceitas?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aceitamos Pix, cartão de crédito, cartão de débito e boleto bancário através do Mercado Pago.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Existe período de teste?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A versão gratuita já oferece acesso a várias funcionalidades. 
                    O Premium desbloqueia recursos avançados como backtesting, alertas ilimitados e relatórios em PDF.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

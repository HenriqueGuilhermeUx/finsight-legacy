import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Users,
  DollarSign,
  TrendingUp,
  Gift,
  CheckCircle2,
  Star,
  Zap,
  Target,
  Award,
  ArrowRight,
  Calculator,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Send,
  Sparkles,
  Shield,
  Clock,
  BarChart3,
} from "lucide-react";

export default function SejaAfiliado() {
  const [referrals, setReferrals] = useState(50);
  const [conversionRate, setConversionRate] = useState(30);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    youtube: "",
    audienceSize: "",
    niche: "",
    experience: "",
    promotionPlan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Cálculo de ganhos
  const conversions = Math.floor(referrals * (conversionRate / 100));
  const tier = conversions >= 100 ? "gold" : conversions >= 25 ? "silver" : "bronze";
  const commissionRate = tier === "gold" ? 0.20 : tier === "silver" ? 0.15 : 0.10;
  const avgTicket = 49.90; // Plano mensal médio
  const monthlyEarnings = conversions * avgTicket * commissionRate;
  const yearlyEarnings = monthlyEarnings * 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Comissões de até 20%",
      description: "Ganhe até R$ 9,98 por cada assinatura mensal convertida",
    },
    {
      icon: Clock,
      title: "Comissões Recorrentes",
      description: "Receba enquanto o cliente permanecer ativo na plataforma",
    },
    {
      icon: Zap,
      title: "Pagamento Rápido",
      description: "Saque via PIX com mínimo de R$ 50,00",
    },
    {
      icon: BarChart3,
      title: "Dashboard Completo",
      description: "Acompanhe cliques, conversões e ganhos em tempo real",
    },
    {
      icon: Gift,
      title: "Materiais de Marketing",
      description: "Banners, posts e conteúdos prontos para divulgação",
    },
    {
      icon: Shield,
      title: "Cookie de 30 Dias",
      description: "Suas indicações são rastreadas por 30 dias",
    },
  ];

  const tiers = [
    {
      name: "Bronze",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      commission: "10%",
      requirements: "0-24 conversões",
      benefits: ["Dashboard básico", "Link de afiliado", "Suporte por email"],
    },
    {
      name: "Prata",
      color: "text-slate-300",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/30",
      commission: "15%",
      requirements: "25-99 conversões",
      benefits: ["Tudo do Bronze", "Materiais exclusivos", "Suporte prioritário", "Campanhas personalizadas"],
    },
    {
      name: "Ouro",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      commission: "20%",
      requirements: "100+ conversões",
      benefits: ["Tudo do Prata", "Gerente dedicado", "Bônus trimestrais", "Acesso antecipado a features", "Co-marketing"],
    },
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Youtuber de Finanças",
      avatar: "CM",
      content: "Em 3 meses já gerei mais de R$ 5.000 em comissões. A plataforma é excelente e minha audiência adora!",
      earnings: "R$ 5.230/mês",
    },
    {
      name: "Ana P.",
      role: "Influencer de Investimentos",
      avatar: "AP",
      content: "O dashboard é muito completo e o suporte é incrível. Melhor programa de afiliados que já participei.",
      earnings: "R$ 3.450/mês",
    },
    {
      name: "Roberto S.",
      role: "Blogger Financeiro",
      avatar: "RS",
      content: "Comecei há 6 meses e já alcancei o tier Ouro. As comissões recorrentes fazem toda diferença!",
      earnings: "R$ 8.900/mês",
    },
  ];

  const faqs = [
    {
      question: "Como funciona o programa de afiliados?",
      answer: "Você recebe um link único de indicação. Quando alguém se cadastra através do seu link e assina um plano, você recebe uma comissão de 10% a 20% do valor, dependendo do seu tier.",
    },
    {
      question: "Quando recebo minhas comissões?",
      answer: "As comissões são creditadas após 30 dias da conversão (período de garantia). Você pode sacar via PIX quando atingir o mínimo de R$ 50,00.",
    },
    {
      question: "As comissões são recorrentes?",
      answer: "Sim! Você recebe comissão em todas as renovações do cliente enquanto ele permanecer ativo na plataforma.",
    },
    {
      question: "Preciso ter muitos seguidores para participar?",
      answer: "Não necessariamente. Valorizamos a qualidade da audiência e o engajamento. Criadores de conteúdo de nicho financeiro são bem-vindos independente do tamanho.",
    },
    {
      question: "Quanto tempo leva para aprovar minha aplicação?",
      answer: "Analisamos todas as aplicações em até 48 horas úteis. Você receberá um email com o resultado.",
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Aplicação Enviada!</h2>
            <p className="text-muted-foreground mb-6">
              Recebemos sua aplicação e entraremos em contato em até 48 horas úteis.
              Fique de olho no seu email!
            </p>
            <Link href="/">
              <Button>Voltar para Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Programa de Afiliados F-Insight
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ganhe Dinheiro Indicando a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Melhor Plataforma
              </span>{" "}
              de Análise Financeira
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comissões de até 20% recorrentes. Ganhe enquanto seus indicados permanecerem ativos.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">20%</div>
                <div className="text-sm text-muted-foreground">Comissão Máxima</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400">30 dias</div>
                <div className="text-sm text-muted-foreground">Cookie Duration</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">R$ 50</div>
                <div className="text-sm text-muted-foreground">Saque Mínimo</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-muted-foreground">Recorrência</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Quero Ser Afiliado
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/afiliados">
              <Button size="lg" variant="outline">
                Já sou afiliado
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Por que ser um Afiliado F-Insight?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 border-border/50 hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Badge className="mb-4">
              <Calculator className="w-3 h-3 mr-1" />
              Calculadora de Ganhos
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Quanto você pode ganhar?</h2>
            <p className="text-muted-foreground">Simule seus ganhos potenciais como afiliado</p>
          </div>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="mb-4 block">Indicações por mês: {referrals}</Label>
                    <Slider
                      value={[referrals]}
                      onValueChange={(value) => setReferrals(value[0])}
                      min={10}
                      max={500}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="mb-4 block">Taxa de conversão: {conversionRate}%</Label>
                    <Slider
                      value={[conversionRate]}
                      onValueChange={(value) => setConversionRate(value[0])}
                      min={5}
                      max={50}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl p-6 border border-emerald-500/20">
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Seu Tier</div>
                    <Badge className={`${tier === 'gold' ? 'bg-yellow-500/20 text-yellow-400' : tier === 'silver' ? 'bg-slate-500/20 text-slate-300' : 'bg-orange-500/20 text-orange-400'}`}>
                      {tier === 'gold' ? '🥇 Ouro' : tier === 'silver' ? '🥈 Prata' : '🥉 Bronze'} - {(commissionRate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{conversions}</div>
                      <div className="text-xs text-muted-foreground">Conversões/mês</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">R$ {avgTicket.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Ticket médio</div>
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ganho Mensal:</span>
                      <span className="font-bold text-emerald-400">R$ {monthlyEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ganho Anual:</span>
                      <span className="font-bold text-2xl text-emerald-400">R$ {yearlyEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Níveis de Afiliado</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tierItem, index) => (
              <Card key={index} className={`${tierItem.bgColor} ${tierItem.borderColor} border-2`}>
                <CardHeader className="text-center">
                  <div className={`text-4xl font-bold ${tierItem.color}`}>{tierItem.commission}</div>
                  <CardTitle className={tierItem.color}>{tierItem.name}</CardTitle>
                  <CardDescription>{tierItem.requirements}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tierItem.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 ${tierItem.color}`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos afiliados dizem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {testimonial.earnings}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Candidate-se Agora</h2>
            <p className="text-muted-foreground">Preencha o formulário abaixo para se tornar um afiliado F-Insight</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="audienceSize">Tamanho da Audiência *</Label>
                    <Select value={formData.audienceSize} onValueChange={(value) => setFormData({ ...formData, audienceSize: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1k">0 - 1.000 seguidores</SelectItem>
                        <SelectItem value="1k-10k">1.000 - 10.000 seguidores</SelectItem>
                        <SelectItem value="10k-50k">10.000 - 50.000 seguidores</SelectItem>
                        <SelectItem value="50k-100k">50.000 - 100.000 seguidores</SelectItem>
                        <SelectItem value="100k+">100.000+ seguidores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website/Blog</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="pl-10"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="pl-10"
                        placeholder="@usuario"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="youtube"
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        className="pl-10"
                        placeholder="URL do canal"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="niche">Nicho Principal *</Label>
                    <Select value={formData.niche} onValueChange={(value) => setFormData({ ...formData, niche: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investimentos">Investimentos</SelectItem>
                        <SelectItem value="financas-pessoais">Finanças Pessoais</SelectItem>
                        <SelectItem value="trading">Trading/Day Trade</SelectItem>
                        <SelectItem value="cripto">Criptomoedas</SelectItem>
                        <SelectItem value="educacao-financeira">Educação Financeira</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Experiência com Afiliados</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Conte sobre sua experiência anterior com programas de afiliados..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="promotionPlan">Como pretende divulgar? *</Label>
                  <Textarea
                    id="promotionPlan"
                    value={formData.promotionPlan}
                    onChange={(e) => setFormData({ ...formData, promotionPlan: e.target.value })}
                    placeholder="Descreva como você planeja promover a F-Insight para sua audiência..."
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Candidatura
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Ao enviar, você concorda com nossos{" "}
                  <Link href="/termos" className="underline">Termos de Uso</Link> e{" "}
                  <Link href="/privacidade" className="underline">Política de Privacidade</Link>.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar a Ganhar?</h2>
          <p className="text-muted-foreground mb-8">
            Junte-se a centenas de afiliados que já estão lucrando com a F-Insight
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Quero Ser Afiliado Agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2024 F-Insight. Todos os direitos reservados.</p>
          <p className="mt-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            {" · "}
            <Link href="/afiliados" className="hover:text-foreground">Painel do Afiliado</Link>
            {" · "}
            <Link href="/termos" className="hover:text-foreground">Termos</Link>
            {" · "}
            <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

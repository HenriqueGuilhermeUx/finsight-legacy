import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Link2, 
  Copy, 
  Check,
  Gift,
  Target,
  Award,
  BarChart3,
  Wallet,
  Share2,
  ChevronRight,
  Star,
  Zap,
  Crown,
  Diamond
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// Affiliate tiers configuration
const tiers = [
  { 
    name: "Bronze", 
    icon: Award, 
    color: "text-amber-600", 
    bgColor: "bg-amber-600/10",
    minReferrals: 0, 
    minConversions: 0, 
    commission: 10,
    benefits: ["Link de indicação único", "Dashboard básico", "Pagamentos mensais"]
  },
  { 
    name: "Silver", 
    icon: Star, 
    color: "text-slate-400", 
    bgColor: "bg-slate-400/10",
    minReferrals: 10, 
    minConversions: 5, 
    commission: 15,
    benefits: ["Tudo do Bronze", "Materiais de marketing", "Suporte prioritário"]
  },
  { 
    name: "Gold", 
    icon: Zap, 
    color: "text-yellow-500", 
    bgColor: "bg-yellow-500/10",
    minReferrals: 50, 
    minConversions: 25, 
    commission: 20,
    benefits: ["Tudo do Silver", "Campanhas personalizadas", "Pagamentos quinzenais"]
  },
  { 
    name: "Platinum", 
    icon: Crown, 
    color: "text-cyan-400", 
    bgColor: "bg-cyan-400/10",
    minReferrals: 200, 
    minConversions: 100, 
    commission: 25,
    benefits: ["Tudo do Gold", "Gerente dedicado", "Bônus trimestrais"]
  },
  { 
    name: "Diamond", 
    icon: Diamond, 
    color: "text-purple-400", 
    bgColor: "bg-purple-400/10",
    minReferrals: 500, 
    minConversions: 250, 
    commission: 30,
    benefits: ["Tudo do Platinum", "Comissão vitalícia", "Eventos exclusivos"]
  },
];

// Mock affiliate data
const mockAffiliateData = {
  isAffiliate: true,
  status: "active",
  tier: "silver",
  code: "TRADER2024",
  stats: {
    totalClicks: 1247,
    totalReferrals: 89,
    totalConversions: 34,
    conversionRate: 38.2,
    totalEarnings: 4520.50,
    pendingEarnings: 890.00,
    paidEarnings: 3630.50,
  },
  recentReferrals: [
    { id: 1, name: "João S.", status: "converted", date: "2024-12-18", value: 49.90 },
    { id: 2, name: "Maria L.", status: "registered", date: "2024-12-17", value: 0 },
    { id: 3, name: "Pedro A.", status: "converted", date: "2024-12-15", value: 249.90 },
    { id: 4, name: "Ana C.", status: "clicked", date: "2024-12-14", value: 0 },
    { id: 5, name: "Carlos M.", status: "converted", date: "2024-12-12", value: 49.90 },
  ],
  monthlyEarnings: [
    { month: "Jul", value: 320 },
    { month: "Ago", value: 480 },
    { month: "Set", value: 650 },
    { month: "Out", value: 890 },
    { month: "Nov", value: 1200 },
    { month: "Dez", value: 980 },
  ],
  campaigns: [
    { id: 1, name: "YouTube Review", clicks: 456, conversions: 12, earnings: 1450.00 },
    { id: 2, name: "Instagram Bio", clicks: 321, conversions: 8, earnings: 890.00 },
    { id: 3, name: "Blog Post", clicks: 234, conversions: 6, earnings: 720.00 },
  ],
};

export default function Afiliados() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showJoinForm, setShowJoinForm] = useState(false);
  
  const affiliateData = mockAffiliateData;
  const currentTier = tiers.find(t => t.name.toLowerCase() === affiliateData.tier) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  
  const referralLink = `https://f-insight.org/?ref=${affiliateData.code}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "converted":
        return <Badge className="bg-green-500/20 text-green-400">Convertido</Badge>;
      case "registered":
        return <Badge className="bg-blue-500/20 text-blue-400">Registrado</Badge>;
      case "clicked":
        return <Badge className="bg-gray-500/20 text-gray-400">Clicou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Landing page for non-affiliates
  if (!affiliateData.isAffiliate || showJoinForm) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-500/20 text-teal-400">
              Programa de Afiliados
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Ganhe dinheiro indicando a <span className="text-teal-400">F-Insight</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Junte-se ao nosso programa de afiliados e ganhe comissões de até 30% 
              em cada assinatura gerada através do seu link de indicação.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-400">30%</div>
                <div className="text-sm text-muted-foreground">Comissão máxima</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-400">12 meses</div>
                <div className="text-sm text-muted-foreground">Recorrência</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-400">R$ 50</div>
                <div className="text-sm text-muted-foreground">Saque mínimo</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-400">PIX</div>
                <div className="text-sm text-muted-foreground">Pagamento instantâneo</div>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <Card className="bg-card/50 border-border/50 mb-12">
            <CardHeader>
              <CardTitle>Como funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-teal-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Cadastre-se</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie sua conta de afiliado gratuitamente
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-teal-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Compartilhe</h3>
                  <p className="text-sm text-muted-foreground">
                    Divulgue seu link único nas redes sociais
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-teal-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Converta</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus indicados assinam a F-Insight
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-teal-400 font-bold">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Receba</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe comissões recorrentes via PIX
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tiers */}
          <Card className="bg-card/50 border-border/50 mb-12">
            <CardHeader>
              <CardTitle>Níveis de Afiliado</CardTitle>
              <CardDescription>
                Quanto mais você indica, maior sua comissão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {tiers.map((tier) => {
                  const TierIcon = tier.icon;
                  return (
                    <div 
                      key={tier.name}
                      className={`p-4 rounded-lg border ${tier.bgColor} border-border/50`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <TierIcon className={`h-5 w-5 ${tier.color}`} />
                        <span className={`font-semibold ${tier.color}`}>{tier.name}</span>
                      </div>
                      <div className="text-2xl font-bold mb-2">{tier.commission}%</div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {tier.minConversions}+ conversões
                      </div>
                      <ul className="text-xs space-y-1">
                        {tier.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-teal-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Gift className="mr-2 h-5 w-5" />
              Tornar-se Afiliado
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Cadastro gratuito. Comece a ganhar hoje mesmo.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Affiliate Dashboard
  return (
    <MainLayout>
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Programa de Afiliados</h1>
            <div className="flex items-center gap-3">
              <Badge className={`${currentTier.bgColor} ${currentTier.color}`}>
                <currentTier.icon className="h-3 w-3 mr-1" />
                {currentTier.name}
              </Badge>
              <span className="text-muted-foreground">
                {currentTier.commission}% de comissão
              </span>
            </div>
          </div>
          
          {/* Referral Link */}
          <Card className="bg-card/50 border-border/50 w-full md:w-auto">
            <CardContent className="p-4">
              <Label className="text-xs text-muted-foreground">Seu link de indicação</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="bg-background/50 text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total de Cliques</p>
                  <p className="text-2xl font-bold">{affiliateData.stats.totalClicks.toLocaleString()}</p>
                </div>
                <Link2 className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Conversões</p>
                  <p className="text-2xl font-bold">{affiliateData.stats.totalConversions}</p>
                  <p className="text-xs text-green-400">
                    {affiliateData.stats.conversionRate}% taxa
                  </p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ganhos Totais</p>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {affiliateData.stats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Saldo Disponível</p>
                  <p className="text-2xl font-bold text-teal-400">
                    R$ {affiliateData.stats.pendingEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <Button size="sm" className="w-full mt-2 bg-teal-600 hover:bg-teal-700">
                Sacar via PIX
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <Card className="bg-card/50 border-border/50 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Progresso para</span>
                  <Badge className={`${nextTier.bgColor} ${nextTier.color}`}>
                    <nextTier.icon className="h-3 w-3 mr-1" />
                    {nextTier.name}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {affiliateData.stats.totalConversions}/{nextTier.minConversions} conversões
                </span>
              </div>
              <Progress 
                value={(affiliateData.stats.totalConversions / nextTier.minConversions) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Faltam {nextTier.minConversions - affiliateData.stats.totalConversions} conversões para desbloquear {nextTier.commission}% de comissão
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="referrals">Indicações</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="payouts">Pagamentos</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Ganhos Mensais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {affiliateData.monthlyEarnings.map((item, i) => {
                      const maxValue = Math.max(...affiliateData.monthlyEarnings.map(e => e.value));
                      const height = (item.value / maxValue) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-teal-500/80 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-muted-foreground mt-2">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Referrals */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Indicações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {affiliateData.recentReferrals.map((referral) => (
                      <div 
                        key={referral.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-teal-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{referral.name}</p>
                            <p className="text-xs text-muted-foreground">{referral.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {referral.value > 0 && (
                            <span className="text-sm text-green-400">
                              +R$ {referral.value.toFixed(2)}
                            </span>
                          )}
                          {getStatusBadge(referral.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="mt-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Todas as Indicações</CardTitle>
                <CardDescription>
                  {affiliateData.stats.totalReferrals} pessoas se cadastraram através do seu link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {affiliateData.recentReferrals.map((referral) => (
                    <div 
                      key={referral.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="font-medium">{referral.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {referral.value > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-green-400">+R$ {referral.value.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">comissão</p>
                          </div>
                        )}
                        {getStatusBadge(referral.status)}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Campanhas</CardTitle>
                  <CardDescription>
                    Crie links personalizados para rastrear diferentes fontes de tráfego
                  </CardDescription>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Nova Campanha
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {affiliateData.campaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className="p-4 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge variant="outline">Ativa</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Cliques</p>
                          <p className="text-lg font-semibold">{campaign.clicks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                          <p className="text-lg font-semibold">{campaign.conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Ganhos</p>
                          <p className="text-lg font-semibold text-green-400">
                            R$ {campaign.earnings.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="mt-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>
                  Total pago: R$ {affiliateData.stats.paidEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">PIX - R$ 1.200,00</p>
                        <p className="text-sm text-muted-foreground">15/12/2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Pago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">PIX - R$ 980,50</p>
                        <p className="text-sm text-muted-foreground">15/11/2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Pago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">PIX - R$ 1.450,00</p>
                        <p className="text-sm text-muted-foreground">15/10/2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Pago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Materiais de Marketing</CardTitle>
                <CardDescription>
                  Baixe banners, logos e textos prontos para divulgação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-background/50 text-center">
                    <div className="w-full h-32 bg-teal-500/20 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-teal-400">Banner 728x90</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Baixar
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 text-center">
                    <div className="w-full h-32 bg-teal-500/20 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-teal-400">Banner 300x250</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Baixar
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 text-center">
                    <div className="w-full h-32 bg-teal-500/20 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-teal-400">Stories 1080x1920</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Baixar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

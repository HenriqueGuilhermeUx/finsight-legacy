import { useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  RefreshCw, 
  Trophy,
  Target,
  Flame,
  Zap,
  ArrowRight,
  Crown,
  Medal,
  Award,
  Star,
  Activity,
  BarChart3,
  LineChart,
  Gauge,
  Globe,
  Bitcoin,
  Building2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

function getSignalDisplay(signal: string) {
  switch (signal) {
    case 'strong_buy':
      return { text: '🚀 Compra Forte', className: 'bg-emerald-500 text-white', color: 'emerald', icon: Flame };
    case 'buy':
      return { text: '⬆️ Compra', className: 'bg-emerald-500/70 text-white', color: 'emerald', icon: TrendingUp };
    case 'strong_sell':
      return { text: '🚨 Venda Forte', className: 'bg-red-500 text-white', color: 'red', icon: TrendingDown };
    case 'sell':
      return { text: '⬇️ Venda', className: 'bg-red-500/70 text-white', color: 'red', icon: TrendingDown };
    default:
      return { text: '➖ Neutro', className: 'bg-slate-500 text-white', color: 'slate', icon: Activity };
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-amber-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-slate-300" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
}

function ScoreBar({ score, max = 6 }: { score: number; max?: number }) {
  // Score ranges from -6 to +6, normalize to 0-100
  const normalized = ((score + max) / (max * 2)) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Venda</span>
        <span className={cn(
          "font-bold",
          score > 2 ? "text-emerald-400" : score < -2 ? "text-red-400" : "text-slate-400"
        )}>
          {score > 0 ? `+${score}` : score}
        </span>
        <span>Compra</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            score > 2 ? "bg-emerald-500" : score < -2 ? "bg-red-500" : "bg-slate-500"
          )}
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}

export default function TopSinais() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [region, setRegion] = useState<"all" | "brazil" | "usa" | "crypto">("all");

  const { data: topSignals, isLoading, refetch } = trpc.signalAlerts.getTopSignals.useQuery(
    { limit: 20, region },
    { staleTime: 60000 }
  );

  const regionLabels = {
    all: { label: "Todos", icon: Globe },
    brazil: { label: "Brasil", icon: Building2 },
    usa: { label: "EUA", icon: Building2 },
    crypto: { label: "Cripto", icon: Bitcoin },
  };

  const buySignals = topSignals?.filter(s => s.score > 0) || [];
  const sellSignals = topSignals?.filter(s => s.score < 0).sort((a, b) => a.score - b.score) || [];

  const displaySignals = activeTab === "buy" ? buySignals : sellSignals;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-400" />
              Top Sinais do Dia
            </h1>
            <p className="text-muted-foreground mt-1">
              Ranking dos ativos com os sinais técnicos mais fortes
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Region Filter */}
            <Select value={region} onValueChange={(v) => setRegion(v as typeof region)}>
              <SelectTrigger className="w-[140px] bg-slate-900/50 border-slate-700">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Todos
                  </span>
                </SelectItem>
                <SelectItem value="brazil">
                  <span className="flex items-center gap-2">
                    🇧🇷 Brasil
                  </span>
                </SelectItem>
                <SelectItem value="usa">
                  <span className="flex items-center gap-2">
                    🇺🇸 EUA
                  </span>
                </SelectItem>
                <SelectItem value="crypto">
                  <span className="flex items-center gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Cripto
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 gap-1">
              <TrendingUp className="h-3 w-3" />
              {buySignals.length} Compra
            </Badge>
            <Badge variant="outline" className="border-red-500/50 text-red-400 gap-1">
              <TrendingDown className="h-3 w-3" />
              {sellSignals.length} Venda
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Ranking */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="bg-slate-900/50 border border-slate-700 mb-6">
                <TabsTrigger 
                  value="buy" 
                  className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 gap-2"
                >
                  <Flame className="h-4 w-4" />
                  Top Compras ({buySignals.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="sell" 
                  className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 gap-2"
                >
                  <TrendingDown className="h-4 w-4" />
                  Top Vendas ({sellSignals.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  </div>
                ) : displaySignals.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="py-12 text-center">
                      <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Nenhum ativo com sinal de {activeTab === "buy" ? "compra" : "venda"} forte no momento
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {displaySignals.slice(0, 10).map((signal, index) => {
                      const display = getSignalDisplay(signal.signal);
                      const rank = index + 1;
                      const isTop3 = rank <= 3;

                      return (
                        <Card 
                          key={signal.ticker}
                          className={cn(
                            "bg-slate-900/50 border-slate-700/50 transition-all hover:border-cyan-500/30",
                            isTop3 && "border-l-4",
                            rank === 1 && "border-l-amber-400",
                            rank === 2 && "border-l-slate-300",
                            rank === 3 && "border-l-amber-600"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Rank */}
                              <div className="w-12 h-12 flex items-center justify-center">
                                {getRankIcon(rank)}
                              </div>

                              {/* Asset Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Link href={`/radar/${signal.ticker}`}>
                                    <span className="font-mono font-bold text-lg hover:text-cyan-400 cursor-pointer">
                                      {signal.ticker}
                                    </span>
                                  </Link>
                                  <span className="text-muted-foreground text-sm">{signal.name}</span>
                                  <Badge className={display.className}>
                                    {display.text}
                                  </Badge>
                                </div>

                                {/* Score Bar */}
                                <ScoreBar score={signal.score} />
                              </div>

                              {/* Indicators */}
                              <div className="hidden md:grid grid-cols-3 gap-4 text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="p-2 rounded bg-slate-800/50">
                                        <div className="text-xs text-muted-foreground">RSI</div>
                                        <div className={cn(
                                          "font-mono font-bold",
                                          signal.rsi < 30 ? "text-emerald-400" : signal.rsi > 70 ? "text-red-400" : ""
                                        )}>
                                          {signal.rsi?.toFixed(1)}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {signal.rsi < 30 ? "Sobrevendido" : signal.rsi > 70 ? "Sobrecomprado" : "Normal"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <div className="p-2 rounded bg-slate-800/50">
                                  <div className="text-xs text-muted-foreground">MACD</div>
                                  <div className={cn(
                                    "font-mono font-bold",
                                    signal.macd > 0 ? "text-emerald-400" : "text-red-400"
                                  )}>
                                    {signal.macd?.toFixed(2)}
                                  </div>
                                </div>

                                <div className="p-2 rounded bg-slate-800/50">
                                  <div className="text-xs text-muted-foreground">Preço</div>
                                  <div className="font-mono font-bold">
                                    {signal.price?.toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              {/* Action */}
                              <Link href={`/radar/${signal.ticker}`}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  Ver
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Legend */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gauge className="h-5 w-5 text-cyan-400" />
                  Como Funciona o Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  O score técnico varia de <span className="text-red-400 font-bold">-6</span> (venda forte) 
                  a <span className="text-emerald-400 font-bold">+6</span> (compra forte), 
                  baseado em 4 indicadores:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Activity className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">RSI (±2 pts)</div>
                      <div className="text-xs text-muted-foreground">
                        &lt;30 = +2 | &lt;40 = +1 | &gt;60 = -1 | &gt;70 = -2
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">MACD (±2 pts)</div>
                      <div className="text-xs text-muted-foreground">
                        Histograma &gt;0 = +2 | &lt;0 = -2
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <LineChart className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">SMA 20 (±1 pt)</div>
                      <div className="text-xs text-muted-foreground">
                        Preço &gt; SMA20 = +1 | &lt; SMA20 = -1
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <LineChart className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">SMA 50 (±1 pt)</div>
                      <div className="text-xs text-muted-foreground">
                        Preço &gt; SMA50 = +1 | &lt; SMA50 = -1
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-amber-400" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <div className="text-2xl font-bold text-emerald-400">
                      {buySignals.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Sinais de Compra</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">
                      {sellSignals.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Sinais de Venda</div>
                  </div>
                </div>

                {buySignals.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
                    <div className="text-sm text-muted-foreground mb-1">Maior Score de Compra</div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">{buySignals[0]?.ticker}</span>
                      <Badge className="bg-emerald-500">+{buySignals[0]?.score}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Zap className="h-10 w-10 mx-auto mb-3 text-cyan-400" />
                  <h3 className="font-bold mb-2">Receba Alertas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure alertas para ser notificado quando um ativo mudar de sinal
                  </p>
                  <Link href="/sinais">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 gap-2">
                      Configurar Alertas
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

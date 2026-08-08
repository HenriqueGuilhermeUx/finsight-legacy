import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, TrendingUp, TrendingDown, BarChart3, LineChart, 
  Waves, Play, History, Trash2, Target, Percent, AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { useAnalysisLimit } from "@/hooks/useAnalysisLimit";
import { RegisterModal } from "@/components/RegisterModal";
import { AnalysisLimitBadge } from "@/components/AnalysisLimitBadge";
import { Disclaimer } from "@/components/Disclaimer";

type IndicatorType = "rsi" | "macd" | "sma" | "ema" | "bb";

export default function BacktestingTecnico() {
  const { user } = useAuth();
  
  // Analysis limit system
  const { incrementCount, canAnalyze, showRegisterModal, setShowRegisterModal } = useAnalysisLimit();
  const [ticker, setTicker] = useState("");
  const [indicatorType, setIndicatorType] = useState<IndicatorType>("rsi");
  const [period, setPeriod] = useState<"1mo" | "3mo" | "6mo" | "1y" | "2y">("1y");
  const [holdingDays, setHoldingDays] = useState("5");
  
  // RSI params
  const [rsiThreshold, setRsiThreshold] = useState("30");
  const [rsiCondition, setRsiCondition] = useState<"above" | "below">("below");
  
  // MACD params
  const [macdCondition, setMacdCondition] = useState<"bullish_cross" | "bearish_cross">("bullish_cross");
  
  // MA params
  const [maPeriod, setMaPeriod] = useState("20");
  const [maCondition, setMaCondition] = useState<"price_above" | "price_below">("price_above");
  
  // BB params
  const [bbCondition, setBbCondition] = useState<"above_upper" | "below_lower">("below_lower");

  const [result, setResult] = useState<any>(null);

  const { data: history, refetch: refetchHistory } = trpc.backtesting2.list.useQuery(undefined, {
    enabled: !!user,
  });

  const runBacktest = trpc.backtesting2.run.useMutation({
    onSuccess: (data) => {
      setResult(data);
      refetchHistory();
    },
  });

  const deleteResult = trpc.backtesting2.delete.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const handleRun = () => {
    if (!ticker) return;
    if (!canAnalyze()) return;
    incrementCount();

    const params: any = {};
    if (indicatorType === "rsi") {
      params.rsiThreshold = parseInt(rsiThreshold);
      params.rsiCondition = rsiCondition;
    } else if (indicatorType === "macd") {
      params.macdCondition = macdCondition;
    } else if (indicatorType === "sma" || indicatorType === "ema") {
      params.maPeriod = parseInt(maPeriod);
      params.maCondition = maCondition;
    } else if (indicatorType === "bb") {
      params.bbCondition = bbCondition;
    }

    runBacktest.mutate({
      ticker: ticker.toUpperCase(),
      indicatorType,
      params,
      period,
      holdingDays: parseInt(holdingDays),
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Backtesting Técnico
              </CardTitle>
              <CardDescription>
                Teste a eficácia de indicadores técnicos em dados históricos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Faça login para executar backtests e ver seu histórico.
              </p>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Fazer Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              Backtesting de Indicadores
            </h1>
            <p className="text-muted-foreground mt-2">
              Teste a eficácia de estratégias baseadas em indicadores técnicos
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/alertas-tecnicos">
              <Activity className="h-4 w-4 mr-2" />
              Alertas Técnicos
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuração</CardTitle>
                <CardDescription>Configure os parâmetros do backtest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ticker */}
                <div className="space-y-2">
                  <Label>Ativo</Label>
                  <Input
                    placeholder="PETR4, AAPL, BTC..."
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                </div>

                {/* Period */}
                <div className="space-y-2">
                  <Label>Período de Análise</Label>
                  <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1mo">1 mês</SelectItem>
                      <SelectItem value="3mo">3 meses</SelectItem>
                      <SelectItem value="6mo">6 meses</SelectItem>
                      <SelectItem value="1y">1 ano</SelectItem>
                      <SelectItem value="2y">2 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Holding Days */}
                <div className="space-y-2">
                  <Label>Dias de Holding</Label>
                  <Select value={holdingDays} onValueChange={setHoldingDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 dia</SelectItem>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="10">10 dias</SelectItem>
                      <SelectItem value="20">20 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Indicator Selection */}
                <div className="space-y-3">
                  <Label>Indicador</Label>
                  <Tabs value={indicatorType} onValueChange={(v: any) => setIndicatorType(v)}>
                    <TabsList className="grid grid-cols-5 w-full">
                      <TabsTrigger value="rsi">RSI</TabsTrigger>
                      <TabsTrigger value="macd">MACD</TabsTrigger>
                      <TabsTrigger value="sma">SMA</TabsTrigger>
                      <TabsTrigger value="ema">EMA</TabsTrigger>
                      <TabsTrigger value="bb">BB</TabsTrigger>
                    </TabsList>

                    <TabsContent value="rsi" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Nível RSI</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={rsiThreshold}
                          onChange={(e) => setRsiThreshold(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={rsiCondition} onValueChange={(v: any) => setRsiCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below">Comprar quando RSI abaixo</SelectItem>
                            <SelectItem value="above">Vender quando RSI acima</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="macd" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={macdCondition} onValueChange={(v: any) => setMacdCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bullish_cross">Cruzamento de Alta (Compra)</SelectItem>
                            <SelectItem value="bearish_cross">Cruzamento de Baixa (Venda)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="sma" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Período</Label>
                        <Select value={maPeriod} onValueChange={setMaPeriod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9">9 períodos</SelectItem>
                            <SelectItem value="20">20 períodos</SelectItem>
                            <SelectItem value="50">50 períodos</SelectItem>
                            <SelectItem value="200">200 períodos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={maCondition} onValueChange={(v: any) => setMaCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price_above">Comprar quando preço acima</SelectItem>
                            <SelectItem value="price_below">Vender quando preço abaixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="ema" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Período</Label>
                        <Select value={maPeriod} onValueChange={setMaPeriod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9">9 períodos</SelectItem>
                            <SelectItem value="12">12 períodos</SelectItem>
                            <SelectItem value="26">26 períodos</SelectItem>
                            <SelectItem value="50">50 períodos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={maCondition} onValueChange={(v: any) => setMaCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price_above">Comprar quando preço acima</SelectItem>
                            <SelectItem value="price_below">Vender quando preço abaixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="bb" className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={bbCondition} onValueChange={(v: any) => setBbCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below_lower">Comprar na banda inferior</SelectItem>
                            <SelectItem value="above_upper">Vender na banda superior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button 
                  onClick={handleRun} 
                  disabled={!ticker || runBacktest.isPending}
                  className="w-full"
                >
                  {runBacktest.isPending ? (
                    "Executando..."
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Executar Backtest
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Result */}
            {result && (
              <Card className="border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Resultado: {result.ticker} - {result.indicatorType.toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    Período: {result.period} | Holding: {holdingDays} dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <p className="text-2xl font-bold">{result.totalSignals}</p>
                      <p className="text-sm text-muted-foreground">Sinais</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <p className={`text-2xl font-bold ${result.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                        {result.winRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <p className={`text-2xl font-bold ${result.avgReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {result.avgReturn >= 0 ? '+' : ''}{result.avgReturn.toFixed(2)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Retorno Médio</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-amber-500">
                        -{result.maxDrawdown.toFixed(2)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    </div>
                  </div>

                  {/* Win/Loss */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="text-green-500 font-semibold">{result.wins} ganhos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      <span className="text-red-500 font-semibold">{result.losses} perdas</span>
                    </div>
                  </div>

                  {/* Recent Signals */}
                  {result.signals && result.signals.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Últimos Sinais</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.signals.map((signal: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                            <div className="flex items-center gap-3">
                              <Badge variant={signal.type === "buy" ? "default" : "secondary"}>
                                {signal.type === "buy" ? "COMPRA" : "VENDA"}
                              </Badge>
                              <span className="text-sm">{signal.date}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span>R$ {signal.price.toFixed(2)} → R$ {signal.exitPrice.toFixed(2)}</span>
                              <span className={signal.return >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {signal.return >= 0 ? '+' : ''}{signal.return.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interpretation */}
                  <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Interpretação
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {result.winRate >= 55 && result.avgReturn > 0 ? (
                        "Esta estratégia mostrou resultados positivos no período analisado. Considere criar um alerta técnico com esses parâmetros."
                      ) : result.winRate >= 45 ? (
                        "Resultados mistos. A estratégia pode funcionar em condições específicas de mercado. Teste com diferentes períodos."
                      ) : (
                        "Esta configuração não apresentou bons resultados históricos. Considere ajustar os parâmetros ou testar outro indicador."
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Backtests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history && history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">{item.ticker}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.indicatorType.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-semibold ${Number(item.winRate) >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                              {Number(item.winRate).toFixed(1)}% acerto
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.totalSignals} sinais
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteResult.mutate({ id: item.id })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum backtest executado ainda. Configure os parâmetros e clique em "Executar Backtest".
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Disclaimer variant="compact" className="mt-6" />
      </div>

      {/* Register Modal */}
      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </MainLayout>
  );
}

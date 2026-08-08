import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Play,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  History,
} from "lucide-react";

// Available strategies
const strategies = [
  {
    id: "buy_hold",
    name: "Buy & Hold",
    description: "Comprar e manter o ativo durante todo o período",
    category: "Básica",
    params: [],
  },
  {
    id: "sma_crossover",
    name: "SMA Crossover",
    description: "Comprar quando SMA curta cruza acima da SMA longa, vender quando cruza abaixo",
    category: "Tendência",
    params: [
      { name: "shortPeriod", label: "Período Curto", default: 20 },
      { name: "longPeriod", label: "Período Longo", default: 50 },
    ],
  },
  {
    id: "rsi_oversold",
    name: "RSI Oversold/Overbought",
    description: "Comprar quando RSI < 30 (sobrevenda), vender quando RSI > 70 (sobrecompra)",
    category: "Oscilador",
    params: [
      { name: "period", label: "Período RSI", default: 14 },
      { name: "oversold", label: "Nível Sobrevenda", default: 30 },
      { name: "overbought", label: "Nível Sobrecompra", default: 70 },
    ],
  },
  {
    id: "macd_signal",
    name: "MACD Signal",
    description: "Comprar quando MACD cruza acima do sinal, vender quando cruza abaixo",
    category: "Tendência",
    params: [
      { name: "fastPeriod", label: "Período Rápido", default: 12 },
      { name: "slowPeriod", label: "Período Lento", default: 26 },
      { name: "signalPeriod", label: "Período Sinal", default: 9 },
    ],
  },
  {
    id: "bollinger_bands",
    name: "Bollinger Bands",
    description: "Comprar quando preço toca banda inferior, vender quando toca banda superior",
    category: "Volatilidade",
    params: [
      { name: "period", label: "Período", default: 20 },
      { name: "stdDev", label: "Desvio Padrão", default: 2 },
    ],
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Comprar quando momentum é positivo, vender quando é negativo",
    category: "Momentum",
    params: [
      { name: "period", label: "Período", default: 14 },
    ],
  },
  // Novas estratégias avançadas
  {
    id: "turtle_trading",
    name: "Turtle Trading (Donchian)",
    description: "Estratégia lendária dos Turtle Traders: comprar no breakout de 20 dias, vender no breakout de 10 dias",
    category: "Breakout",
    params: [
      { name: "entryPeriod", label: "Período Entrada", default: 20 },
      { name: "exitPeriod", label: "Período Saída", default: 10 },
      { name: "atrPeriod", label: "Período ATR (Stop)", default: 20 },
      { name: "atrMultiplier", label: "Multiplicador ATR", default: 2 },
    ],
  },
  {
    id: "mean_reversion",
    name: "Mean Reversion (Z-Score)",
    description: "Comprar quando preço está 2 desvios abaixo da média, vender quando volta à média",
    category: "Reversão",
    params: [
      { name: "lookbackPeriod", label: "Período Lookback", default: 20 },
      { name: "entryZScore", label: "Z-Score Entrada", default: -2 },
      { name: "exitZScore", label: "Z-Score Saída", default: 0 },
      { name: "stopZScore", label: "Z-Score Stop", default: -3 },
    ],
  },
  {
    id: "pairs_trading",
    name: "Pairs Trading (Spread)",
    description: "Arbitragem estatística entre dois ativos correlacionados",
    category: "Reversão",
    params: [
      { name: "pairTicker", label: "Ticker do Par", default: "VALE3" },
      { name: "lookbackPeriod", label: "Período Lookback", default: 60 },
      { name: "entryThreshold", label: "Threshold Entrada", default: 2 },
      { name: "exitThreshold", label: "Threshold Saída", default: 0.5 },
    ],
  },
  {
    id: "ichimoku_cloud",
    name: "Ichimoku Cloud",
    description: "Comprar quando preço cruza acima da nuvem e Tenkan > Kijun, vender no oposto",
    category: "Tendência",
    params: [
      { name: "tenkanPeriod", label: "Período Tenkan", default: 9 },
      { name: "kijunPeriod", label: "Período Kijun", default: 26 },
      { name: "senkouPeriod", label: "Período Senkou B", default: 52 },
    ],
  },
  {
    id: "volume_breakout",
    name: "Volume Breakout",
    description: "Comprar em breakout de preço com volume 2x acima da média",
    category: "Breakout",
    params: [
      { name: "pricePeriod", label: "Período Preço", default: 20 },
      { name: "volumePeriod", label: "Período Volume", default: 20 },
      { name: "volumeMultiplier", label: "Multiplicador Volume", default: 2 },
    ],
  },
  {
    id: "triple_ema",
    name: "Triple EMA (TEMA)",
    description: "Sistema de 3 EMAs: comprar quando EMA curta > média > longa, vender no oposto",
    category: "Tendência",
    params: [
      { name: "fastPeriod", label: "EMA Rápida", default: 8 },
      { name: "mediumPeriod", label: "EMA Média", default: 21 },
      { name: "slowPeriod", label: "EMA Lenta", default: 55 },
    ],
  },
  {
    id: "keltner_channel",
    name: "Keltner Channel",
    description: "Similar a Bollinger mas usa ATR: comprar na banda inferior, vender na superior",
    category: "Volatilidade",
    params: [
      { name: "emaPeriod", label: "Período EMA", default: 20 },
      { name: "atrPeriod", label: "Período ATR", default: 10 },
      { name: "atrMultiplier", label: "Multiplicador ATR", default: 2 },
    ],
  },
  {
    id: "adx_trend",
    name: "ADX Trend Following",
    description: "Operar apenas quando ADX > 25 (tendência forte), usar DI+/DI- para direção",
    category: "Tendência",
    params: [
      { name: "adxPeriod", label: "Período ADX", default: 14 },
      { name: "adxThreshold", label: "Threshold ADX", default: 25 },
    ],
  },
  {
    id: "ml_prediction",
    name: "ML Prediction (Random Forest)",
    description: "Modelo de Machine Learning usando features técnicas para prever direção",
    category: "Machine Learning",
    params: [
      { name: "lookbackPeriod", label: "Período Features", default: 20 },
      { name: "predictionThreshold", label: "Threshold Predição", default: 0.6 },
      { name: "retrainFrequency", label: "Frequência Retrain (dias)", default: 30 },
    ],
  },
  {
    id: "sentiment_based",
    name: "Sentiment Analysis",
    description: "Combina análise de sentimento de notícias com indicadores técnicos",
    category: "Machine Learning",
    params: [
      { name: "sentimentWeight", label: "Peso Sentimento (%)", default: 30 },
      { name: "technicalWeight", label: "Peso Técnico (%)", default: 70 },
      { name: "minSentimentScore", label: "Score Mínimo", default: 0.3 },
    ],
  },
];

// Available tickers
const availableTickers = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "WEGE3", "ABEV3", "RENT3", "SUZB3",
  "ELET3", "BBAS3", "JBSS3", "RDOR3", "TOTS3", "CYRE3", "MGLU3", "LREN3",
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
];

// Periods
const periods = [
  { value: "1y", label: "1 Ano" },
  { value: "2y", label: "2 Anos" },
  { value: "3y", label: "3 Anos" },
  { value: "5y", label: "5 Anos" },
];

// Mock backtest function
function runBacktest(
  ticker: string,
  strategy: string,
  period: string,
  initialCapital: number,
  params: Record<string, number | string>
) {
  // Generate mock historical data
  const days = period === "1y" ? 252 : period === "2y" ? 504 : period === "3y" ? 756 : 1260;
  const startPrice = 30 + Math.random() * 20;
  
  const priceHistory: { date: string; price: number; signal?: "buy" | "sell" }[] = [];
  const portfolioHistory: { date: string; value: number }[] = [];
  const trades: { date: string; type: "buy" | "sell"; price: number; shares: number; value: number }[] = [];
  
  let price = startPrice;
  let cash = initialCapital;
  let shares = 0;
  let portfolioValue = initialCapital;
  let inPosition = false;
  
  // Generate price data with random walk
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const dateStr = date.toISOString().split("T")[0];
    
    // Random price movement
    const change = (Math.random() - 0.48) * 2;
    price = Math.max(price * (1 + change / 100), 1);
    
    // Generate signals based on strategy
    let signal: "buy" | "sell" | undefined;
    
    if (strategy === "buy_hold") {
      if (i === 0) signal = "buy";
    } else if (strategy === "sma_crossover") {
      // Simplified SMA crossover logic
      if (i > 50 && Math.random() < 0.02) {
        signal = inPosition ? "sell" : "buy";
      }
    } else if (strategy === "rsi_oversold") {
      const rsi = 30 + Math.random() * 40;
      if (rsi < Number(params.oversold || 30) && !inPosition) signal = "buy";
      if (rsi > Number(params.overbought || 70) && inPosition) signal = "sell";
    } else if (strategy === "macd_signal") {
      if (Math.random() < 0.015) {
        signal = inPosition ? "sell" : "buy";
      }
    } else if (strategy === "bollinger_bands") {
      if (Math.random() < 0.02) {
        signal = inPosition ? "sell" : "buy";
      }
    } else if (strategy === "momentum") {
      if (Math.random() < 0.018) {
        signal = inPosition ? "sell" : "buy";
      }
    }
    
    // Execute trades
    if (signal === "buy" && !inPosition) {
      shares = Math.floor(cash / price);
      const tradeValue = shares * price;
      cash -= tradeValue;
      inPosition = true;
      trades.push({ date: dateStr, type: "buy", price, shares, value: tradeValue });
    } else if (signal === "sell" && inPosition) {
      const tradeValue = shares * price;
      cash += tradeValue;
      trades.push({ date: dateStr, type: "sell", price, shares, value: tradeValue });
      shares = 0;
      inPosition = false;
    }
    
    portfolioValue = cash + shares * price;
    priceHistory.push({ date: dateStr, price, signal });
    portfolioHistory.push({ date: dateStr, value: portfolioValue });
  }
  
  // Final sell if still holding
  if (inPosition) {
    const finalValue = shares * price;
    cash += finalValue;
    trades.push({ 
      date: priceHistory[priceHistory.length - 1].date, 
      type: "sell", 
      price, 
      shares, 
      value: finalValue 
    });
    portfolioValue = cash;
  }
  
  // Calculate metrics
  const totalReturn = ((portfolioValue - initialCapital) / initialCapital) * 100;
  const buyHoldReturn = ((price - startPrice) / startPrice) * 100;
  
  // Calculate max drawdown
  let maxValue = initialCapital;
  let maxDrawdown = 0;
  for (const point of portfolioHistory) {
    maxValue = Math.max(maxValue, point.value);
    const drawdown = ((maxValue - point.value) / maxValue) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }
  
  // Calculate Sharpe ratio (simplified)
  const returns = portfolioHistory.slice(1).map((p, i) => 
    (p.value - portfolioHistory[i].value) / portfolioHistory[i].value
  );
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdReturn = Math.sqrt(
    returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length
  );
  const sharpeRatio = stdReturn > 0 ? (avgReturn * 252) / (stdReturn * Math.sqrt(252)) : 0;
  
  // Win rate
  const winningTrades = trades.filter((t, i) => {
    if (t.type === "sell" && i > 0) {
      const buyTrade = trades.slice(0, i).reverse().find(bt => bt.type === "buy");
      return buyTrade && t.price > buyTrade.price;
    }
    return false;
  }).length;
  const totalSells = trades.filter(t => t.type === "sell").length;
  const winRate = totalSells > 0 ? (winningTrades / totalSells) * 100 : 0;
  
  return {
    ticker,
    strategy,
    period,
    initialCapital,
    finalValue: portfolioValue,
    totalReturn,
    buyHoldReturn,
    maxDrawdown,
    sharpeRatio,
    winRate,
    totalTrades: trades.length,
    priceHistory,
    portfolioHistory,
    trades,
  };
}

export default function Backtesting() {
  const [selectedTicker, setSelectedTicker] = useState("PETR4");
  const [selectedStrategy, setSelectedStrategy] = useState("buy_hold");
  const [selectedPeriod, setSelectedPeriod] = useState("1y");
  const [initialCapital, setInitialCapital] = useState(10000);
  const [strategyParams, setStrategyParams] = useState<Record<string, number | string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof runBacktest> | null>(null);
  const [savedResults, setSavedResults] = useState<Array<ReturnType<typeof runBacktest>>>([]);
  
  const currentStrategy = strategies.find(s => s.id === selectedStrategy);
  
  // Initialize params when strategy changes
  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      const params: Record<string, number | string> = {};
      strategy.params.forEach(p => {
        params[p.name] = p.default;
      });
      setStrategyParams(params);
    }
  };
  
  // Run backtest
  const handleRunBacktest = async () => {
    setIsRunning(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = runBacktest(
      selectedTicker,
      selectedStrategy,
      selectedPeriod,
      initialCapital,
      strategyParams
    );
    
    setResults(result);
    setSavedResults(prev => [result, ...prev].slice(0, 10));
    setIsRunning(false);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LineChart className="h-8 w-8 text-primary" />
              Backtesting de Estratégias
            </h1>
            <p className="text-muted-foreground mt-1">
              Teste suas estratégias de investimento com dados históricos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ativo</Label>
                  <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTickers.map(ticker => (
                        <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Estratégia</Label>
                  <Select value={selectedStrategy} onValueChange={handleStrategyChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map(strategy => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {currentStrategy && (
                    <p className="text-xs text-muted-foreground">
                      {currentStrategy.description}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map(period => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Capital Inicial (R$)</Label>
                  <Input
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    min={1000}
                    step={1000}
                  />
                </div>
                
                {/* Strategy Parameters */}
                {currentStrategy?.params.map(param => (
                  <div key={param.name} className="space-y-2">
                    <Label>{param.label}</Label>
                    <Input
                      type="number"
                      value={strategyParams[param.name] || param.default}
                      onChange={(e) => setStrategyParams(prev => ({
                        ...prev,
                        [param.name]: Number(e.target.value)
                      }))}
                    />
                  </div>
                ))}
                
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRunBacktest}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Executando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Executar Backtest
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            {/* Strategy Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sobre a Estratégia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    {currentStrategy?.description}
                  </p>
                  <div className="pt-2 border-t">
                    <p className="font-medium">Parâmetros:</p>
                    {currentStrategy?.params.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum parâmetro configurável</p>
                    ) : (
                      <ul className="text-muted-foreground">
                        {currentStrategy?.params.map(p => (
                          <li key={p.name}>• {p.label}: {strategyParams[p.name] || p.default}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {results ? (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Retorno Total</p>
                          <p className={`text-2xl font-bold ${results.totalReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {results.totalReturn >= 0 ? "+" : ""}{results.totalReturn.toFixed(2)}%
                          </p>
                        </div>
                        {results.totalReturn >= 0 ? (
                          <ArrowUpRight className="h-8 w-8 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Buy & Hold</p>
                          <p className={`text-2xl font-bold ${results.buyHoldReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {results.buyHoldReturn >= 0 ? "+" : ""}{results.buyHoldReturn.toFixed(2)}%
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Max Drawdown</p>
                          <p className="text-2xl font-bold text-amber-500">
                            -{results.maxDrawdown.toFixed(2)}%
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                          <p className="text-2xl font-bold">
                            {results.sharpeRatio.toFixed(2)}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados Detalhados</CardTitle>
                    <CardDescription>
                      {results.ticker} • {strategies.find(s => s.id === results.strategy)?.name} • {periods.find(p => p.value === results.period)?.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Capital Inicial</p>
                        <p className="text-lg font-semibold">{formatCurrency(results.initialCapital)}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Valor Final</p>
                        <p className="text-lg font-semibold">{formatCurrency(results.finalValue)}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-semibold">{results.winRate.toFixed(1)}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Total de Trades</p>
                        <p className="text-lg font-semibold">{results.totalTrades}</p>
                      </div>
                    </div>

                    {/* Portfolio Chart (Simplified) */}
                    <div className="h-64 bg-muted/30 rounded-lg p-4">
                      <div className="h-full flex flex-col">
                        <div className="text-sm text-muted-foreground mb-2">Evolução do Patrimônio</div>
                        <div className="flex-1 flex items-end gap-px">
                          {results.portfolioHistory.filter((_, i) => i % Math.ceil(results.portfolioHistory.length / 50) === 0).map((point, i) => {
                            const minValue = Math.min(...results.portfolioHistory.map(p => p.value));
                            const maxValue = Math.max(...results.portfolioHistory.map(p => p.value));
                            const height = ((point.value - minValue) / (maxValue - minValue)) * 100;
                            const isPositive = point.value >= results.initialCapital;
                            return (
                              <div
                                key={i}
                                className={`flex-1 rounded-t ${isPositive ? "bg-emerald-500/80" : "bg-red-500/80"}`}
                                style={{ height: `${Math.max(height, 5)}%` }}
                                title={`${point.date}: ${formatCurrency(point.value)}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trades History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Operações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.trades.map((trade, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={trade.type === "buy" ? "default" : "secondary"}>
                              {trade.type === "buy" ? "Compra" : "Venda"}
                            </Badge>
                            <span className="text-sm">{trade.date}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{trade.shares} ações @ R$ {trade.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(trade.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Comparison with Buy & Hold */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação com Buy & Hold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${results.totalReturn > results.buyHoldReturn ? "border-emerald-500 bg-emerald-500/10" : "border-muted"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-5 w-5" />
                          <span className="font-medium">{strategies.find(s => s.id === results.strategy)?.name}</span>
                        </div>
                        <p className={`text-2xl font-bold ${results.totalReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {results.totalReturn >= 0 ? "+" : ""}{results.totalReturn.toFixed(2)}%
                        </p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(results.finalValue)}</p>
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${results.buyHoldReturn > results.totalReturn ? "border-emerald-500 bg-emerald-500/10" : "border-muted"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5" />
                          <span className="font-medium">Buy & Hold</span>
                        </div>
                        <p className={`text-2xl font-bold ${results.buyHoldReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {results.buyHoldReturn >= 0 ? "+" : ""}{results.buyHoldReturn.toFixed(2)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(results.initialCapital * (1 + results.buyHoldReturn / 100))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      <p className="text-sm">
                        {results.totalReturn > results.buyHoldReturn ? (
                          <span className="text-emerald-500">
                            ✓ A estratégia superou o Buy & Hold em {(results.totalReturn - results.buyHoldReturn).toFixed(2)} pontos percentuais
                          </span>
                        ) : results.totalReturn < results.buyHoldReturn ? (
                          <span className="text-amber-500">
                            ⚠ O Buy & Hold superou a estratégia em {(results.buyHoldReturn - results.totalReturn).toFixed(2)} pontos percentuais
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            = A estratégia teve performance igual ao Buy & Hold
                          </span>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="lg:col-span-2">
                <CardContent className="py-16 text-center">
                  <LineChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhum backtest executado</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure os parâmetros e clique em "Executar Backtest" para testar sua estratégia
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Saved Results */}
            {savedResults.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico de Backtests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedResults.slice(1).map((result, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70"
                        onClick={() => setResults(result)}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{result.ticker}</Badge>
                          <span className="text-sm">{strategies.find(s => s.id === result.strategy)?.name}</span>
                          <span className="text-sm text-muted-foreground">{periods.find(p => p.value === result.period)?.label}</span>
                        </div>
                        <span className={`font-medium ${result.totalReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {result.totalReturn >= 0 ? "+" : ""}{result.totalReturn.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

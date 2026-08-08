import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { useAnalysisLimit } from "@/hooks/useAnalysisLimit";
import { RegisterModal } from "@/components/RegisterModal";
import { AnalysisLimitBadge } from "@/components/AnalysisLimitBadge";
import { Disclaimer } from "@/components/Disclaimer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Activity,
  Target,
  Layers,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Cloud,
  GitBranch,
  Gauge,
  Eye,
} from "lucide-react";

// Generate mock price data with OHLC
const generatePriceData = (ticker: string) => {
  const basePrice = ticker === "PETR4" ? 31 : ticker === "VALE3" ? 58 : ticker === "ITUB4" ? 32 : 100;
  const data = [];
  let price = basePrice;
  
  for (let i = 60; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * 2 * volatility * price;
    price = Math.max(price + change, basePrice * 0.7);
    
    const open = price * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, price) * (1 + Math.random() * 0.015);
    const low = Math.min(open, price) * (1 - Math.random() * 0.015);
    const close = price;
    const volume = Math.floor(Math.random() * 50000000) + 10000000;
    
    data.push({
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      fullDate: date.toISOString().split("T")[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }
  
  return data;
};

// Calculate technical indicators
const calculateIndicators = (data: any[]) => {
  const closes = data.map(d => d.close);
  
  // RSI
  const calculateRSI = (period: number = 14) => {
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const rsiData = data.map((d, i) => {
      if (i < period) return { ...d, rsi: 50 };
      
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      return { ...d, rsi: Number(rsi.toFixed(2)) };
    });
    
    return rsiData;
  };
  
  // MACD
  const calculateMACD = () => {
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    const macdLine = ema12.map((v, i) => v - ema26[i]);
    const signalLine = calculateEMA(macdLine, 9);
    
    return data.map((d, i) => ({
      ...d,
      macd: Number(macdLine[i].toFixed(4)),
      signal: Number(signalLine[i].toFixed(4)),
      histogram: Number((macdLine[i] - signalLine[i]).toFixed(4)),
    }));
  };
  
  // EMA helper
  const calculateEMA = (values: number[], period: number) => {
    const k = 2 / (period + 1);
    const ema = [values[0]];
    
    for (let i = 1; i < values.length; i++) {
      ema.push(values[i] * k + ema[i - 1] * (1 - k));
    }
    
    return ema;
  };
  
  // Bollinger Bands
  const calculateBollinger = (period: number = 20) => {
    return data.map((d, i) => {
      if (i < period - 1) return { ...d, upperBand: d.close, middleBand: d.close, lowerBand: d.close };
      
      const slice = closes.slice(i - period + 1, i + 1);
      const sma = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      
      return {
        ...d,
        upperBand: Number((sma + 2 * stdDev).toFixed(2)),
        middleBand: Number(sma.toFixed(2)),
        lowerBand: Number((sma - 2 * stdDev).toFixed(2)),
      };
    });
  };
  
  // Fibonacci Levels
  const calculateFibonacci = () => {
    const maxPrice = Math.max(...closes);
    const minPrice = Math.min(...closes);
    const diff = maxPrice - minPrice;
    
    return {
      level0: maxPrice,
      level236: maxPrice - diff * 0.236,
      level382: maxPrice - diff * 0.382,
      level500: maxPrice - diff * 0.5,
      level618: maxPrice - diff * 0.618,
      level786: maxPrice - diff * 0.786,
      level100: minPrice,
    };
  };
  
  // Ichimoku Cloud
  const calculateIchimoku = () => {
    const tenkanPeriod = 9;
    const kijunPeriod = 26;
    const senkouBPeriod = 52;
    
    return data.map((d, i) => {
      const tenkanHigh = Math.max(...data.slice(Math.max(0, i - tenkanPeriod + 1), i + 1).map(x => x.high));
      const tenkanLow = Math.min(...data.slice(Math.max(0, i - tenkanPeriod + 1), i + 1).map(x => x.low));
      const tenkan = (tenkanHigh + tenkanLow) / 2;
      
      const kijunHigh = Math.max(...data.slice(Math.max(0, i - kijunPeriod + 1), i + 1).map(x => x.high));
      const kijunLow = Math.min(...data.slice(Math.max(0, i - kijunPeriod + 1), i + 1).map(x => x.low));
      const kijun = (kijunHigh + kijunLow) / 2;
      
      const senkouA = (tenkan + kijun) / 2;
      
      const senkouBHigh = Math.max(...data.slice(Math.max(0, i - senkouBPeriod + 1), i + 1).map(x => x.high));
      const senkouBLow = Math.min(...data.slice(Math.max(0, i - senkouBPeriod + 1), i + 1).map(x => x.low));
      const senkouB = (senkouBHigh + senkouBLow) / 2;
      
      return {
        ...d,
        tenkan: Number(tenkan.toFixed(2)),
        kijun: Number(kijun.toFixed(2)),
        senkouA: Number(senkouA.toFixed(2)),
        senkouB: Number(senkouB.toFixed(2)),
        chikou: closes[Math.max(0, i - 26)] || d.close,
      };
    });
  };
  
  // Volume Profile
  const calculateVolumeProfile = () => {
    const priceRange = Math.max(...closes) - Math.min(...closes);
    const bucketSize = priceRange / 20;
    const minPrice = Math.min(...closes);
    const buckets: { [key: number]: number } = {};
    
    data.forEach(d => {
      const bucket = Math.floor((d.close - minPrice) / bucketSize);
      buckets[bucket] = (buckets[bucket] || 0) + d.volume;
    });
    
    return Object.entries(buckets).map(([bucket, volume]) => ({
      priceLevel: Number((minPrice + Number(bucket) * bucketSize + bucketSize / 2).toFixed(2)),
      volume: volume as number,
    })).sort((a, b) => a.priceLevel - b.priceLevel);
  };
  
  // Support and Resistance
  const calculateSupportResistance = () => {
    const levels: { price: number; type: "support" | "resistance"; strength: number }[] = [];
    
    // Find local minima (supports) and maxima (resistances)
    for (let i = 2; i < data.length - 2; i++) {
      const isLocalMin = data[i].low < data[i-1].low && data[i].low < data[i-2].low &&
                         data[i].low < data[i+1].low && data[i].low < data[i+2].low;
      const isLocalMax = data[i].high > data[i-1].high && data[i].high > data[i-2].high &&
                         data[i].high > data[i+1].high && data[i].high > data[i+2].high;
      
      if (isLocalMin) {
        levels.push({ price: data[i].low, type: "support", strength: 1 });
      }
      if (isLocalMax) {
        levels.push({ price: data[i].high, type: "resistance", strength: 1 });
      }
    }
    
    // Consolidate nearby levels
    const consolidated: typeof levels = [];
    const threshold = (Math.max(...closes) - Math.min(...closes)) * 0.02;
    
    levels.forEach(level => {
      const existing = consolidated.find(c => Math.abs(c.price - level.price) < threshold && c.type === level.type);
      if (existing) {
        existing.strength++;
        existing.price = (existing.price + level.price) / 2;
      } else {
        consolidated.push({ ...level });
      }
    });
    
    return consolidated.sort((a, b) => b.strength - a.strength).slice(0, 6);
  };
  
  // Candlestick Patterns
  const detectPatterns = () => {
    const patterns: { date: string; pattern: string; type: "bullish" | "bearish" | "neutral"; description: string }[] = [];
    
    for (let i = 2; i < data.length; i++) {
      const curr = data[i];
      const prev = data[i - 1];
      const prev2 = data[i - 2];
      
      const bodySize = Math.abs(curr.close - curr.open);
      const upperWick = curr.high - Math.max(curr.open, curr.close);
      const lowerWick = Math.min(curr.open, curr.close) - curr.low;
      const range = curr.high - curr.low;
      
      // Doji
      if (bodySize < range * 0.1) {
        patterns.push({
          date: curr.date,
          pattern: "Doji",
          type: "neutral",
          description: "Indecisão no mercado, possível reversão"
        });
      }
      
      // Hammer (bullish)
      if (lowerWick > bodySize * 2 && upperWick < bodySize * 0.5 && curr.close > curr.open) {
        patterns.push({
          date: curr.date,
          pattern: "Hammer",
          type: "bullish",
          description: "Padrão de reversão de alta após tendência de baixa"
        });
      }
      
      // Shooting Star (bearish)
      if (upperWick > bodySize * 2 && lowerWick < bodySize * 0.5 && curr.close < curr.open) {
        patterns.push({
          date: curr.date,
          pattern: "Shooting Star",
          type: "bearish",
          description: "Padrão de reversão de baixa após tendência de alta"
        });
      }
      
      // Engulfing Bullish
      if (prev.close < prev.open && curr.close > curr.open &&
          curr.open < prev.close && curr.close > prev.open) {
        patterns.push({
          date: curr.date,
          pattern: "Engulfing Bullish",
          type: "bullish",
          description: "Forte sinal de reversão de alta"
        });
      }
      
      // Engulfing Bearish
      if (prev.close > prev.open && curr.close < curr.open &&
          curr.open > prev.close && curr.close < prev.open) {
        patterns.push({
          date: curr.date,
          pattern: "Engulfing Bearish",
          type: "bearish",
          description: "Forte sinal de reversão de baixa"
        });
      }
    }
    
    return patterns.slice(-10).reverse();
  };
  
  const rsiData = calculateRSI();
  const macdData = calculateMACD();
  const bollingerData = calculateBollinger();
  const fibonacci = calculateFibonacci();
  const ichimokuData = calculateIchimoku();
  const volumeProfile = calculateVolumeProfile();
  const supportResistance = calculateSupportResistance();
  const patterns = detectPatterns();
  
  // Merge all data
  const fullData = data.map((d, i) => ({
    ...d,
    ...rsiData[i],
    ...macdData[i],
    ...bollingerData[i],
    ...ichimokuData[i],
  }));
  
  return {
    data: fullData,
    fibonacci,
    volumeProfile,
    supportResistance,
    patterns,
    currentRSI: rsiData[rsiData.length - 1]?.rsi || 50,
    currentMACD: macdData[macdData.length - 1],
  };
};

// Technical Signal Component
const TechnicalSignal = ({ indicator, value, signal, description }: {
  indicator: string;
  value: string;
  signal: "buy" | "sell" | "neutral";
  description: string;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
    <div className="flex items-center gap-3">
      {signal === "buy" ? (
        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </div>
      ) : signal === "sell" ? (
        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <ArrowDown className="h-4 w-4 text-red-500" />
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Minus className="h-4 w-4 text-yellow-500" />
        </div>
      )}
      <div>
        <div className="font-medium">{indicator}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-mono">{value}</div>
      <Badge variant={signal === "buy" ? "default" : signal === "sell" ? "destructive" : "secondary"}
             className={signal === "buy" ? "bg-emerald-500" : ""}>
        {signal === "buy" ? "Compra" : signal === "sell" ? "Venda" : "Neutro"}
      </Badge>
    </div>
  </div>
);

export default function AnaliseTecnica() {
  const [selectedTicker, setSelectedTicker] = useState("PETR4");
  const [searchQuery, setSearchQuery] = useState("");
  const [showIchimoku, setShowIchimoku] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showFibonacci, setShowFibonacci] = useState(true);
  
  // Analysis limit system
  const { incrementCount, canAnalyze, showRegisterModal, setShowRegisterModal } = useAnalysisLimit();
  
  const priceData = useMemo(() => generatePriceData(selectedTicker), [selectedTicker]);
  const indicators = useMemo(() => calculateIndicators(priceData), [priceData]);
  
  const currentPrice = priceData[priceData.length - 1]?.close || 0;
  const previousPrice = priceData[priceData.length - 2]?.close || currentPrice;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  
  // Calculate overall signal
  const getOverallSignal = () => {
    let buySignals = 0;
    let sellSignals = 0;
    
    // RSI
    if (indicators.currentRSI < 30) buySignals++;
    else if (indicators.currentRSI > 70) sellSignals++;
    
    // MACD
    if (indicators.currentMACD.histogram > 0) buySignals++;
    else if (indicators.currentMACD.histogram < 0) sellSignals++;
    
    // Price vs Bollinger
    const lastData = indicators.data[indicators.data.length - 1];
    if (currentPrice < lastData.lowerBand) buySignals++;
    else if (currentPrice > lastData.upperBand) sellSignals++;
    
    // Price vs Ichimoku Cloud
    if (currentPrice > lastData.senkouA && currentPrice > lastData.senkouB) buySignals++;
    else if (currentPrice < lastData.senkouA && currentPrice < lastData.senkouB) sellSignals++;
    
    if (buySignals > sellSignals + 1) return "buy";
    if (sellSignals > buySignals + 1) return "sell";
    return "neutral";
  };
  
  const overallSignal = getOverallSignal();
  
  const tickers = [
    { value: "PETR4", label: "PETR4 - Petrobras" },
    { value: "VALE3", label: "VALE3 - Vale" },
    { value: "ITUB4", label: "ITUB4 - Itaú" },
    { value: "BBDC4", label: "BBDC4 - Bradesco" },
    { value: "WEGE3", label: "WEGE3 - WEG" },
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              Análise Técnica Avançada
            </h1>
            <p className="text-muted-foreground mt-1">
              Fibonacci, Ichimoku Cloud, Volume Profile e padrões de candlestick
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <AnalysisLimitBadge />
            <Select value={selectedTicker} onValueChange={(value) => {
              if (!canAnalyze()) return;
              incrementCount();
              setSelectedTicker(value);
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tickers.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{selectedTicker}</h2>
                  <Badge variant={overallSignal === "buy" ? "default" : overallSignal === "sell" ? "destructive" : "secondary"}
                         className={`${overallSignal === "buy" ? "bg-emerald-500" : ""} text-sm`}>
                    {overallSignal === "buy" ? "COMPRA" : overallSignal === "sell" ? "VENDA" : "NEUTRO"}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold font-mono">
                    R$ {currentPrice.toFixed(2)}
                  </span>
                  <span className={`text-lg font-mono ${priceChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={showIchimoku} onCheckedChange={setShowIchimoku} />
                  <span className="text-sm">Ichimoku</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={showBollinger} onCheckedChange={setShowBollinger} />
                  <span className="text-sm">Bollinger</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={showFibonacci} onCheckedChange={setShowFibonacci} />
                  <span className="text-sm">Fibonacci</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart with Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Gráfico de Preços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={indicators.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" fontSize={10} />
                      <YAxis domain={["auto", "auto"]} stroke="#888" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      
                      {/* Ichimoku Cloud */}
                      {showIchimoku && (
                        <>
                          <Area
                            type="monotone"
                            dataKey="senkouA"
                            stroke="transparent"
                            fill="#22c55e"
                            fillOpacity={0.1}
                            name="Senkou A"
                          />
                          <Area
                            type="monotone"
                            dataKey="senkouB"
                            stroke="transparent"
                            fill="#ef4444"
                            fillOpacity={0.1}
                            name="Senkou B"
                          />
                          <Line type="monotone" dataKey="tenkan" stroke="#22c55e" dot={false} strokeWidth={1} name="Tenkan" />
                          <Line type="monotone" dataKey="kijun" stroke="#ef4444" dot={false} strokeWidth={1} name="Kijun" />
                        </>
                      )}
                      
                      {/* Bollinger Bands */}
                      {showBollinger && (
                        <>
                          <Line type="monotone" dataKey="upperBand" stroke="#8b5cf6" dot={false} strokeDasharray="3 3" name="Upper Band" />
                          <Line type="monotone" dataKey="middleBand" stroke="#8b5cf6" dot={false} name="Middle Band" />
                          <Line type="monotone" dataKey="lowerBand" stroke="#8b5cf6" dot={false} strokeDasharray="3 3" name="Lower Band" />
                        </>
                      )}
                      
                      {/* Price Line */}
                      <Line type="monotone" dataKey="close" stroke="#3b82f6" dot={false} strokeWidth={2} name="Preço" />
                      
                      {/* Fibonacci Levels */}
                      {showFibonacci && (
                        <>
                          <ReferenceLine y={indicators.fibonacci.level0} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "0%", fill: "#f59e0b", fontSize: 10 }} />
                          <ReferenceLine y={indicators.fibonacci.level236} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "23.6%", fill: "#f59e0b", fontSize: 10 }} />
                          <ReferenceLine y={indicators.fibonacci.level382} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "38.2%", fill: "#f59e0b", fontSize: 10 }} />
                          <ReferenceLine y={indicators.fibonacci.level500} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "50%", fill: "#f59e0b", fontSize: 10 }} />
                          <ReferenceLine y={indicators.fibonacci.level618} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "61.8%", fill: "#f59e0b", fontSize: 10 }} />
                          <ReferenceLine y={indicators.fibonacci.level100} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "100%", fill: "#f59e0b", fontSize: 10 }} />
                        </>
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* RSI Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  RSI (14)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={indicators.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" fontSize={10} />
                      <YAxis domain={[0, 100]} stroke="#888" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                      />
                      <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                      <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
                      <Area
                        type="monotone"
                        dataKey="rsi"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* MACD Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  MACD (12, 26, 9)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={indicators.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" fontSize={10} />
                      <YAxis stroke="#888" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                      />
                      <ReferenceLine y={0} stroke="#666" />
                      <Bar
                        dataKey="histogram"
                        fill="#3b82f6"
                        opacity={0.5}
                      />
                      <Line type="monotone" dataKey="macd" stroke="#22c55e" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="signal" stroke="#ef4444" dot={false} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technical Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Sinais Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TechnicalSignal
                  indicator="RSI (14)"
                  value={indicators.currentRSI.toFixed(1)}
                  signal={indicators.currentRSI < 30 ? "buy" : indicators.currentRSI > 70 ? "sell" : "neutral"}
                  description={indicators.currentRSI < 30 ? "Sobrevendido" : indicators.currentRSI > 70 ? "Sobrecomprado" : "Zona neutra"}
                />
                <TechnicalSignal
                  indicator="MACD"
                  value={indicators.currentMACD.histogram.toFixed(4)}
                  signal={indicators.currentMACD.histogram > 0 ? "buy" : indicators.currentMACD.histogram < 0 ? "sell" : "neutral"}
                  description={indicators.currentMACD.histogram > 0 ? "Histograma positivo" : "Histograma negativo"}
                />
                <TechnicalSignal
                  indicator="Bollinger"
                  value={`${((currentPrice - indicators.data[indicators.data.length - 1].lowerBand) / (indicators.data[indicators.data.length - 1].upperBand - indicators.data[indicators.data.length - 1].lowerBand) * 100).toFixed(0)}%`}
                  signal={currentPrice < indicators.data[indicators.data.length - 1].lowerBand ? "buy" : currentPrice > indicators.data[indicators.data.length - 1].upperBand ? "sell" : "neutral"}
                  description="Posição nas bandas"
                />
                <TechnicalSignal
                  indicator="Ichimoku"
                  value={currentPrice > indicators.data[indicators.data.length - 1].senkouA ? "Acima" : "Abaixo"}
                  signal={currentPrice > indicators.data[indicators.data.length - 1].senkouA && currentPrice > indicators.data[indicators.data.length - 1].senkouB ? "buy" : currentPrice < indicators.data[indicators.data.length - 1].senkouA && currentPrice < indicators.data[indicators.data.length - 1].senkouB ? "sell" : "neutral"}
                  description="Posição relativa à nuvem"
                />
              </CardContent>
            </Card>

            {/* Fibonacci Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Níveis de Fibonacci
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(indicators.fibonacci).map(([key, value]) => {
                    const level = key.replace("level", "").replace("00", "0");
                    const isNearPrice = Math.abs(value - currentPrice) / currentPrice < 0.02;
                    return (
                      <div key={key} className={`flex justify-between items-center p-2 rounded ${isNearPrice ? "bg-primary/20" : ""}`}>
                        <span className="text-sm text-muted-foreground">
                          {level === "0" ? "0%" : level === "100" ? "100%" : `${level}%`}
                        </span>
                        <span className={`font-mono ${isNearPrice ? "text-primary font-bold" : ""}`}>
                          R$ {value.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Support & Resistance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Suportes e Resistências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {indicators.supportResistance.map((level, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-2">
                        {level.type === "resistance" ? (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-emerald-500" />
                        )}
                        <span className="text-sm">
                          {level.type === "resistance" ? "Resistência" : "Suporte"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Força: {level.strength}
                        </Badge>
                      </div>
                      <span className="font-mono">R$ {level.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Candlestick Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Padrões de Candlestick
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {indicators.patterns.length > 0 ? (
                    indicators.patterns.slice(0, 5).map((pattern, i) => (
                      <div key={i} className="p-2 rounded bg-muted/50">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pattern.pattern}</span>
                          <Badge variant={pattern.type === "bullish" ? "default" : pattern.type === "bearish" ? "destructive" : "secondary"}
                                 className={pattern.type === "bullish" ? "bg-emerald-500" : ""}>
                            {pattern.type === "bullish" ? "Alta" : pattern.type === "bearish" ? "Baixa" : "Neutro"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {pattern.date} - {pattern.description}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      Nenhum padrão detectado recentemente
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Volume Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Volume Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={indicators.volumeProfile}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#888" fontSize={10} />
                      <YAxis dataKey="priceLevel" type="category" stroke="#888" fontSize={10} width={60} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                        formatter={(value: number) => [value.toLocaleString(), "Volume"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
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

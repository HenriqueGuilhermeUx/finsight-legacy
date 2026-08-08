import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CandlestickChart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Layers,
  Calendar,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
} from "recharts";

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AdvancedChartProps {
  ticker: string;
  priceHistory: PriceData[];
  indicators?: {
    sma20?: number[];
    sma50?: number[];
    sma200?: number[];
    bollingerUpper?: number[];
    bollingerMiddle?: number[];
    bollingerLower?: number[];
  };
  dividends?: { date: string; amount: number }[];
  splits?: { date: string; ratio: string }[];
}

type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";
type ChartType = "candle" | "line" | "area" | "ohlc";
type Overlay = "sma" | "bollinger" | "volume" | "events";

const timeframeLabels: Record<Timeframe, string> = {
  "1D": "1 Dia",
  "1W": "1 Semana",
  "1M": "1 Mês",
  "3M": "3 Meses",
  "6M": "6 Meses",
  "1Y": "1 Ano",
  "5Y": "5 Anos",
  "MAX": "Máximo",
};

const timeframeDays: Record<Timeframe, number> = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
  "5Y": 1825,
  "MAX": 9999,
};

export default function AdvancedChart({
  ticker,
  priceHistory,
  indicators,
  dividends,
  splits,
}: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("3M");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [overlays, setOverlays] = useState<Overlay[]>(["volume"]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter data based on timeframe
  const filteredData = useMemo(() => {
    const days = timeframeDays[timeframe];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return priceHistory
      .filter(d => new Date(d.date) >= cutoffDate)
      .map((d, i) => ({
        ...d,
        dateFormatted: new Date(d.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        }),
        sma20: indicators?.sma20?.[i],
        sma50: indicators?.sma50?.[i],
        sma200: indicators?.sma200?.[i],
        bollingerUpper: indicators?.bollingerUpper?.[i],
        bollingerMiddle: indicators?.bollingerMiddle?.[i],
        bollingerLower: indicators?.bollingerLower?.[i],
        // Candlestick data
        candleBody: [d.open, d.close],
        candleWick: [d.low, d.high],
        isGreen: d.close >= d.open,
      }));
  }, [priceHistory, timeframe, indicators]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const prices = filteredData.map(d => d.close);
    const volumes = filteredData.map(d => d.volume);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const highPrice = Math.max(...filteredData.map(d => d.high));
    const lowPrice = Math.min(...filteredData.map(d => d.low));
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return {
      change,
      high: highPrice,
      low: lowPrice,
      avgVolume,
      volatility: ((highPrice - lowPrice) / lowPrice) * 100,
    };
  }, [filteredData]);

  // Toggle overlay
  const toggleOverlay = (overlay: Overlay) => {
    setOverlays(prev =>
      prev.includes(overlay)
        ? prev.filter(o => o !== overlay)
        : [...prev, overlay]
    );
  };

  // Custom candlestick shape
  const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    
    const { open, close, high, low, isGreen } = payload;
    const color = isGreen ? "#10b981" : "#ef4444";
    const bodyTop = Math.min(open, close);
    const bodyBottom = Math.max(open, close);
    const bodyHeight = Math.abs(close - open);
    
    // Scale calculations
    const priceRange = Math.max(...filteredData.map(d => d.high)) - Math.min(...filteredData.map(d => d.low));
    const minPrice = Math.min(...filteredData.map(d => d.low));
    const scale = (price: number) => ((price - minPrice) / priceRange) * height;
    
    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y + height - scale(high)}
          x2={x + width / 2}
          y2={y + height - scale(low)}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={y + height - scale(bodyBottom)}
          width={width * 0.6}
          height={Math.max(scale(bodyHeight), 1)}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

  // Find events in the timeframe
  const eventsInRange = useMemo(() => {
    const events: { date: string; type: "dividend" | "split"; value: string }[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays[timeframe]);
    
    dividends?.forEach(d => {
      if (new Date(d.date) >= cutoffDate) {
        events.push({ date: d.date, type: "dividend", value: `R$ ${d.amount.toFixed(2)}` });
      }
    });
    
    splits?.forEach(s => {
      if (new Date(s.date) >= cutoffDate) {
        events.push({ date: s.date, type: "split", value: s.ratio });
      }
    });
    
    return events;
  }, [dividends, splits, timeframe]);

  return (
    <Card className={`bg-slate-900/50 border-slate-700/50 ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      <CardHeader className="border-b border-slate-700/50 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CandlestickChart className="h-5 w-5 text-cyan-400" />
            Gráfico Avançado - {ticker}
          </CardTitle>
          
          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${stats.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {stats.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {stats.change >= 0 ? "+" : ""}{stats.change.toFixed(2)}%
              </div>
              <div className="text-muted-foreground">
                <span className="text-green-400">↑ {stats.high.toFixed(2)}</span>
                {" / "}
                <span className="text-red-400">↓ {stats.low.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {/* Timeframe buttons */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            {(Object.keys(timeframeLabels) as Timeframe[]).map(tf => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-2 text-xs ${timeframe === tf ? "bg-cyan-600" : ""}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
          
          {/* Chart type */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              className={`h-7 px-2 ${chartType === "area" ? "bg-cyan-600" : ""}`}
              onClick={() => setChartType("area")}
            >
              <Activity className="h-3 w-3" />
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="sm"
              className={`h-7 px-2 ${chartType === "line" ? "bg-cyan-600" : ""}`}
              onClick={() => setChartType("line")}
            >
              <BarChart3 className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Overlays */}
          <div className="flex items-center gap-1">
            <Button
              variant={overlays.includes("sma") ? "default" : "outline"}
              size="sm"
              className={`h-7 text-xs ${overlays.includes("sma") ? "bg-cyan-600" : ""}`}
              onClick={() => toggleOverlay("sma")}
            >
              SMA
            </Button>
            <Button
              variant={overlays.includes("bollinger") ? "default" : "outline"}
              size="sm"
              className={`h-7 text-xs ${overlays.includes("bollinger") ? "bg-cyan-600" : ""}`}
              onClick={() => toggleOverlay("bollinger")}
            >
              BB
            </Button>
            <Button
              variant={overlays.includes("volume") ? "default" : "outline"}
              size="sm"
              className={`h-7 text-xs ${overlays.includes("volume") ? "bg-cyan-600" : ""}`}
              onClick={() => toggleOverlay("volume")}
            >
              Vol
            </Button>
            <Button
              variant={overlays.includes("events") ? "default" : "outline"}
              size="sm"
              className={`h-7 text-xs ${overlays.includes("events") ? "bg-cyan-600" : ""}`}
              onClick={() => toggleOverlay("events")}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Eventos
            </Button>
          </div>
          
          {/* Fullscreen */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 ml-auto"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {filteredData.length > 0 ? (
          <div className={`${isFullscreen ? "h-[calc(100vh-200px)]" : "h-[400px]"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBollinger" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="dateFormatted"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="price"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => value.toFixed(0)}
                />
                {overlays.includes("volume") && (
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`}
                  />
                )}
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(value: number, name: string) => {
                    if (name === "volume") return [`${(value / 1e6).toFixed(2)}M`, "Volume"];
                    if (name === "close") return [`R$ ${value.toFixed(2)}`, "Fechamento"];
                    if (name === "high") return [`R$ ${value.toFixed(2)}`, "Máxima"];
                    if (name === "low") return [`R$ ${value.toFixed(2)}`, "Mínima"];
                    if (name === "open") return [`R$ ${value.toFixed(2)}`, "Abertura"];
                    return [`R$ ${value.toFixed(2)}`, name];
                  }}
                />
                
                {/* Bollinger Bands */}
                {overlays.includes("bollinger") && indicators?.bollingerUpper && (
                  <>
                    <Area
                      yAxisId="price"
                      type="monotone"
                      dataKey="bollingerUpper"
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      fill="none"
                      dot={false}
                    />
                    <Area
                      yAxisId="price"
                      type="monotone"
                      dataKey="bollingerMiddle"
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      fill="none"
                      dot={false}
                    />
                    <Area
                      yAxisId="price"
                      type="monotone"
                      dataKey="bollingerLower"
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      fill="url(#colorBollinger)"
                      dot={false}
                    />
                  </>
                )}
                
                {/* SMAs */}
                {overlays.includes("sma") && (
                  <>
                    {indicators?.sma20 && (
                      <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="sma20"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        dot={false}
                        name="SMA 20"
                      />
                    )}
                    {indicators?.sma50 && (
                      <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="sma50"
                        stroke="#10b981"
                        strokeWidth={1}
                        dot={false}
                        name="SMA 50"
                      />
                    )}
                    {indicators?.sma200 && (
                      <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="sma200"
                        stroke="#ef4444"
                        strokeWidth={1}
                        dot={false}
                        name="SMA 200"
                      />
                    )}
                  </>
                )}
                
                {/* Price */}
                {chartType === "area" && (
                  <Area
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#colorArea)"
                    dot={false}
                  />
                )}
                {chartType === "line" && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                
                {/* Volume */}
                {overlays.includes("volume") && (
                  <Bar
                    yAxisId="volume"
                    dataKey="volume"
                    fill="#334155"
                    opacity={0.5}
                    name="volume"
                  />
                )}
                
                {/* Events */}
                {overlays.includes("events") && eventsInRange.map((event, i) => (
                  <ReferenceLine
                    key={i}
                    yAxisId="price"
                    x={new Date(event.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    stroke={event.type === "dividend" ? "#10b981" : "#f59e0b"}
                    strokeDasharray="3 3"
                    label={{
                      value: event.type === "dividend" ? "DIV" : "SPLIT",
                      position: "top",
                      fill: event.type === "dividend" ? "#10b981" : "#f59e0b",
                      fontSize: 10,
                    }}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Dados históricos não disponíveis para este período
          </div>
        )}
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-700/50 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-muted-foreground">Preço</span>
          </div>
          {overlays.includes("sma") && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-500" />
                <span className="text-muted-foreground">SMA 20</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500" />
                <span className="text-muted-foreground">SMA 50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500" />
                <span className="text-muted-foreground">SMA 200</span>
              </div>
            </>
          )}
          {overlays.includes("bollinger") && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-violet-500" />
              <span className="text-muted-foreground">Bollinger Bands</span>
            </div>
          )}
          {overlays.includes("events") && eventsInRange.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{eventsInRange.filter(e => e.type === "dividend").length} Dividendos</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

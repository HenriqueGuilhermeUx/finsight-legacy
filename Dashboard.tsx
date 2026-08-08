import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Bell,
  Star,
  Globe,
  Settings,
  Plus,
  X,
  GripVertical,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { getLoginUrl } from "@/const";
import MainLayout from "@/components/MainLayout";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Widget types
type WidgetType = "quote" | "watchlist" | "alerts" | "macro" | "market_summary" | "highlights";

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  ticker?: string;
  size: "small" | "medium" | "large";
}

// Default widgets configuration
const DEFAULT_WIDGETS: Widget[] = [
  { id: "1", type: "market_summary", title: "Resumo do Mercado", size: "large" },
  { id: "2", type: "quote", title: "PETR4", ticker: "PETR4", size: "small" },
  { id: "3", type: "quote", title: "VALE3", ticker: "VALE3", size: "small" },
  { id: "4", type: "quote", title: "ITUB4", ticker: "ITUB4", size: "small" },
  { id: "5", type: "watchlist", title: "Meus Favoritos", size: "medium" },
  { id: "6", type: "alerts", title: "Alertas Ativos", size: "medium" },
  { id: "7", type: "macro", title: "Indicadores Macro", size: "medium" },
];

// Available widgets to add
const AVAILABLE_WIDGETS: { type: WidgetType; title: string; description: string }[] = [
  { type: "quote", title: "Cotação de Ativo", description: "Exibe preço e variação de um ativo específico" },
  { type: "watchlist", title: "Meus Favoritos", description: "Lista de ativos favoritos com preços" },
  { type: "alerts", title: "Alertas Ativos", description: "Alertas de preço configurados" },
  { type: "macro", title: "Indicadores Macro", description: "Principais indicadores econômicos" },
  { type: "market_summary", title: "Resumo do Mercado", description: "Visão geral do mercado" },
  { type: "highlights", title: "Destaques do Dia", description: "Top ativos por volume, altas e baixas" },
];

// Mini sparkline component
function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const chartData = data.map((value, index) => ({ value, index }));
  const color = isPositive ? "#10b981" : "#ef4444";
  
  return (
    <div className="w-16 h-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Quote Widget Component
function QuoteWidget({ ticker, onRemove }: { ticker: string; onRemove: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/trpc/assets.getByTicker?input=${encodeURIComponent(JSON.stringify({ ticker }))}`);
        const result = await response.json();
        if (result?.result?.data) {
          setData(result.result.data);
        }
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error);
      }
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [ticker]);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
        </CardContent>
      </Card>
    );
  }

  const change = data?.change || 0;
  const isPositive = change >= 0;
  const sparklineData = data?.priceHistory?.slice(-10).map((p: any) => p.close) || [];

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link href={`/radar/${ticker}`}>
              <span className="font-bold text-white hover:text-cyan-400 cursor-pointer font-mono text-lg">
                {ticker}
              </span>
            </Link>
            <p className="text-xs text-slate-400 truncate max-w-[100px]">{data?.name || ticker}</p>
          </div>
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-white font-mono">
              R$ {data?.price?.toFixed(2) || "N/A"}
            </p>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span>{isPositive ? "+" : ""}{change.toFixed(2)}%</span>
            </div>
          </div>
          {sparklineData.length > 0 && (
            <MiniSparkline data={sparklineData} isPositive={isPositive} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Watchlist Widget Component
function WatchlistWidget({ onRemove }: { onRemove: () => void }) {
  const { isAuthenticated } = useAuth();
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Meus Favoritos
            </CardTitle>
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-slate-400 text-sm">Faça login para ver seus favoritos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Meus Favoritos
          </CardTitle>
          <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="space-y-2">
            {favorites.slice(0, 5).map((fav) => (
              <Link key={fav.ticker} href={`/radar/${fav.ticker}`}>
                <div className="flex items-center justify-between py-1 hover:bg-slate-700/30 px-2 rounded cursor-pointer">
                  <span className="text-white font-mono text-sm">{fav.ticker}</span>
                  <Badge variant="outline" className="text-xs">
                    {fav.assetType === "stock" ? "Ação" : fav.assetType === "etf" ? "ETF" : "Cripto"}
                  </Badge>
                </div>
              </Link>
            ))}
            {favorites.length > 5 && (
              <Link href="/watchlist">
                <p className="text-cyan-400 text-xs text-center hover:underline cursor-pointer">
                  Ver todos ({favorites.length})
                </p>
              </Link>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">Nenhum favorito ainda</p>
        )}
      </CardContent>
    </Card>
  );
}

// Alerts Widget Component
function AlertsWidget({ onRemove }: { onRemove: () => void }) {
  const { isAuthenticated } = useAuth();
  const { data: alerts, isLoading } = trpc.alerts.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const activeAlerts = alerts?.filter((a) => !a.isTriggered) || [];

  if (!isAuthenticated) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" />
              Alertas Ativos
            </CardTitle>
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-slate-400 text-sm">Faça login para ver seus alertas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            Alertas Ativos ({activeAlerts.length})
          </CardTitle>
          <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
          </div>
        ) : activeAlerts.length > 0 ? (
          <div className="space-y-2">
            {activeAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between py-1 px-2 bg-slate-700/30 rounded">
                <span className="text-white font-mono text-sm">{alert.ticker}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs ${alert.condition === "above" ? "text-emerald-500" : "text-red-500"}`}>
                    {alert.condition === "above" ? "↑" : "↓"} {alert.alertType === "percent" 
                      ? `${parseFloat(alert.targetPercent || "0").toFixed(1)}%`
                      : `R$ ${parseFloat(alert.targetPrice || "0").toFixed(2)}`}
                  </Badge>
                </div>
              </div>
            ))}
            {activeAlerts.length > 4 && (
              <Link href="/alertas">
                <p className="text-cyan-400 text-xs text-center hover:underline cursor-pointer">
                  Ver todos ({activeAlerts.length})
                </p>
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-400 text-sm mb-2">Nenhum alerta ativo</p>
            <Link href="/alertas">
              <Button size="sm" variant="outline" className="text-cyan-400 border-cyan-600">
                Criar Alerta
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Macro Widget Component
function MacroWidget({ onRemove }: { onRemove: () => void }) {
  const macroData = [
    { name: "SELIC", value: "11.25%", change: "0.00", trend: "stable" },
    { name: "IPCA", value: "4.87%", change: "+0.12", trend: "up" },
    { name: "Dólar", value: "R$ 6.12", change: "+0.45%", trend: "up" },
    { name: "IBOV", value: "121.450", change: "-0.32%", trend: "down" },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-500" />
            Indicadores Macro
          </CardTitle>
          <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {macroData.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-1">
              <span className="text-slate-400 text-sm">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm">{item.value}</span>
                <span className={`text-xs ${
                  item.trend === "up" ? "text-emerald-500" : item.trend === "down" ? "text-red-500" : "text-slate-400"
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/macro">
          <p className="text-cyan-400 text-xs text-center hover:underline cursor-pointer mt-3">
            Ver painel completo
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}

// Highlights Widget Component - Destaques do Dia
function HighlightsWidget({ onRemove }: { onRemove: () => void }) {
  const { data: popularAssets, isLoading } = trpc.assets.getPopular.useQuery();
  
  const topGainers = popularAssets?.filter(a => a.change > 0).sort((a, b) => b.change - a.change).slice(0, 3) || [];
  const topLosers = popularAssets?.filter(a => a.change < 0).sort((a, b) => a.change - b.change).slice(0, 3) || [];
  const topVolume = popularAssets?.slice().sort((a, b) => ((b as any).volume || 0) - ((a as any).volume || 0)).slice(0, 3) || [];

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            Destaques do Dia
          </CardTitle>
          <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* Maiores Altas */}
            <div>
              <p className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> Maiores Altas
              </p>
              <div className="space-y-1">
                {topGainers.map((asset, i) => (
                  <Link key={asset.ticker} href={`/radar/${asset.ticker}`}>
                    <div className="flex items-center justify-between py-1 px-2 bg-emerald-500/10 rounded hover:bg-emerald-500/20 cursor-pointer">
                      <span className="text-white font-mono text-xs">{asset.ticker}</span>
                      <span className="text-emerald-400 text-xs">+{asset.change.toFixed(1)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Maiores Baixas */}
            <div>
              <p className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" /> Maiores Baixas
              </p>
              <div className="space-y-1">
                {topLosers.map((asset, i) => (
                  <Link key={asset.ticker} href={`/radar/${asset.ticker}`}>
                    <div className="flex items-center justify-between py-1 px-2 bg-red-500/10 rounded hover:bg-red-500/20 cursor-pointer">
                      <span className="text-white font-mono text-xs">{asset.ticker}</span>
                      <span className="text-red-400 text-xs">{asset.change.toFixed(1)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Maior Volume */}
            <div>
              <p className="text-xs text-blue-400 font-medium mb-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Maior Volume
              </p>
              <div className="space-y-1">
                {topVolume.map((asset, i) => (
                  <Link key={asset.ticker} href={`/radar/${asset.ticker}`}>
                    <div className="flex items-center justify-between py-1 px-2 bg-blue-500/10 rounded hover:bg-blue-500/20 cursor-pointer">
                      <span className="text-white font-mono text-xs">{asset.ticker}</span>
                      <span className={`text-xs ${asset.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(1)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        <Link href="/alertas-volatilidade">
          <p className="text-amber-400 text-xs text-center hover:underline cursor-pointer mt-3">
            Configurar alertas de volatilidade
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}

// Market Summary Widget Component
function MarketSummaryWidget({ onRemove }: { onRemove: () => void }) {
  const marketData = [
    { name: "IBOVESPA", value: "121.450", change: -0.32, region: "BR" },
    { name: "S&P 500", value: "6.051", change: 0.15, region: "US" },
    { name: "NASDAQ", value: "19.926", change: 0.28, region: "US" },
    { name: "Bitcoin", value: "$104.250", change: 1.85, region: "Crypto" },
    { name: "Ethereum", value: "$3.890", change: 2.12, region: "Crypto" },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-500" />
            Resumo do Mercado
          </CardTitle>
          <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {marketData.map((item) => (
            <div key={item.name} className="text-center">
              <p className="text-xs text-slate-400 mb-1">{item.name}</p>
              <p className="text-white font-mono font-bold">{item.value}</p>
              <p className={`text-xs flex items-center justify-center gap-1 ${
                item.change >= 0 ? "text-emerald-500" : "text-red-500"
              }`}>
                {item.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem("finsight_dashboard_widgets");
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [newWidgetTicker, setNewWidgetTicker] = useState("");

  // Save widgets to localStorage
  useEffect(() => {
    localStorage.setItem("finsight_dashboard_widgets", JSON.stringify(widgets));
  }, [widgets]);

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
    toast.success("Widget removido");
  };

  const addWidget = (type: WidgetType, ticker?: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: type === "quote" ? ticker || "Novo Ativo" : AVAILABLE_WIDGETS.find((w) => w.type === type)?.title || "Widget",
      ticker,
      size: type === "market_summary" || type === "highlights" ? "large" : type === "quote" ? "small" : "medium",
    };
    setWidgets([...widgets, newWidget]);
    setShowAddWidget(false);
    setNewWidgetTicker("");
    toast.success("Widget adicionado");
  };

  const resetDashboard = () => {
    setWidgets(DEFAULT_WIDGETS);
    toast.success("Dashboard restaurado para configuração padrão");
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "quote":
        return <QuoteWidget ticker={widget.ticker || "PETR4"} onRemove={() => removeWidget(widget.id)} />;
      case "watchlist":
        return <WatchlistWidget onRemove={() => removeWidget(widget.id)} />;
      case "alerts":
        return <AlertsWidget onRemove={() => removeWidget(widget.id)} />;
      case "macro":
        return <MacroWidget onRemove={() => removeWidget(widget.id)} />;
      case "market_summary":
        return <MarketSummaryWidget onRemove={() => removeWidget(widget.id)} />;
      case "highlights":
        return <HighlightsWidget onRemove={() => removeWidget(widget.id)} />;
      default:
        return null;
    }
  };

  const getWidgetGridClass = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-1 md:col-span-2";
      case "large":
        return "col-span-1 md:col-span-2 lg:col-span-4";
      default:
        return "col-span-1";
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-cyan-500" />
              Meu Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Personalize seu painel com os widgets que mais importam para você
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={resetDashboard}
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button
              onClick={() => setShowAddWidget(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Widget
            </Button>
          </div>
        </div>

        {/* Add Widget Modal */}
        {showAddWidget && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Adicionar Widget</CardTitle>
                <button onClick={() => setShowAddWidget(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {AVAILABLE_WIDGETS.map((widget) => (
                  <button
                    key={widget.type}
                    onClick={() => {
                      if (widget.type === "quote") {
                        const ticker = prompt("Digite o ticker do ativo (ex: PETR4, AAPL, BTC):");
                        if (ticker) {
                          addWidget(widget.type, ticker.toUpperCase());
                        }
                      } else {
                        addWidget(widget.type);
                      }
                    }}
                    className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left"
                  >
                    <p className="text-white font-medium mb-1">{widget.title}</p>
                    <p className="text-slate-400 text-xs">{widget.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgets.map((widget) => (
            <div key={widget.id} className={getWidgetGridClass(widget.size)}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>

        {widgets.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <LayoutDashboard className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Seu dashboard está vazio</h3>
              <p className="text-slate-400 mb-6">
                Adicione widgets para personalizar sua experiência.
              </p>
              <Button onClick={() => setShowAddWidget(true)} className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Widget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

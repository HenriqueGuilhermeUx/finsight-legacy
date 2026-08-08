import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TradingViewChart,
  AdvancedTradingViewChart,
  TradingViewMiniChart,
  TradingViewTickerTape,
} from "@/components/TradingViewChart";
import {
  LineChart,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CandlestickChart,
  Maximize2,
  Settings,
  Plus,
  X,
  Star,
} from "lucide-react";

const popularSymbols = [
  { symbol: "PETR4", name: "Petrobras", type: "BR" },
  { symbol: "VALE3", name: "Vale", type: "BR" },
  { symbol: "ITUB4", name: "Itaú", type: "BR" },
  { symbol: "BBDC4", name: "Bradesco", type: "BR" },
  { symbol: "WEGE3", name: "WEG", type: "BR" },
  { symbol: "AAPL", name: "Apple", type: "US" },
  { symbol: "MSFT", name: "Microsoft", type: "US" },
  { symbol: "GOOGL", name: "Google", type: "US" },
  { symbol: "AMZN", name: "Amazon", type: "US" },
  { symbol: "NVDA", name: "NVIDIA", type: "US" },
  { symbol: "BTC-USD", name: "Bitcoin", type: "Crypto" },
  { symbol: "ETH-USD", name: "Ethereum", type: "Crypto" },
];

const intervals = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "30", label: "30m" },
  { value: "60", label: "1h" },
  { value: "240", label: "4h" },
  { value: "D", label: "1D" },
  { value: "W", label: "1W" },
  { value: "M", label: "1M" },
];

const studies = [
  { value: "MASimple@tv-basicstudies", label: "SMA" },
  { value: "MAExp@tv-basicstudies", label: "EMA" },
  { value: "RSI@tv-basicstudies", label: "RSI" },
  { value: "MACD@tv-basicstudies", label: "MACD" },
  { value: "BB@tv-basicstudies", label: "Bollinger Bands" },
  { value: "Volume@tv-basicstudies", label: "Volume" },
  { value: "StochasticRSI@tv-basicstudies", label: "Stochastic RSI" },
  { value: "IchimokuCloud@tv-basicstudies", label: "Ichimoku" },
];

export default function Graficos() {
  const [selectedSymbol, setSelectedSymbol] = useState("PETR4");
  const [searchQuery, setSearchQuery] = useState("");
  const [interval, setInterval] = useState("D");
  const [selectedStudies, setSelectedStudies] = useState<string[]>([
    "MASimple@tv-basicstudies",
    "RSI@tv-basicstudies",
  ]);
  const [watchlist, setWatchlist] = useState<string[]>(["PETR4", "VALE3", "ITUB4", "AAPL", "BTC-USD"]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedSymbol(searchQuery.trim().toUpperCase());
      setSearchQuery("");
    }
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const toggleStudy = (study: string) => {
    if (selectedStudies.includes(study)) {
      setSelectedStudies(selectedStudies.filter((s) => s !== study));
    } else {
      setSelectedStudies([...selectedStudies, study]);
    }
  };

  return (
    <MainLayout>
      {/* Ticker Tape */}
      <div className="border-b border-border/40 bg-card/30">
        <TradingViewTickerTape />
      </div>

      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CandlestickChart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Gráficos TradingView</h1>
            </div>
            <p className="text-muted-foreground">
              Análise técnica profissional com gráficos interativos e indicadores avançados.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ativo..."
                className="pl-9 w-48"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Watchlist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {watchlist.map((symbol) => (
                    <div
                      key={symbol}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedSymbol === symbol
                          ? "bg-primary/20 border border-primary/40"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedSymbol(symbol)}
                    >
                      <span className="font-medium">{symbol}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(symbol);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Symbols */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Ativos Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {popularSymbols.slice(0, 8).map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer"
                      onClick={() => setSelectedSymbol(asset.symbol)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{asset.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWatchlist(asset.symbol);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Indicators */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Indicadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studies.map((study) => (
                    <Badge
                      key={study.value}
                      variant={selectedStudies.includes(study.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStudy(study.value)}
                    >
                      {study.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chart Controls */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{selectedSymbol}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => addToWatchlist(selectedSymbol)}
                      >
                        <Star className={`h-4 w-4 ${watchlist.includes(selectedSymbol) ? "text-yellow-500 fill-yellow-500" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Interval Selector */}
                    <Select value={interval} onValueChange={setInterval}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {intervals.map((int) => (
                          <SelectItem key={int.value} value={int.value}>
                            {int.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Chart */}
            <Card className={isFullscreen ? "fixed inset-4 z-50" : ""}>
              <CardContent className="p-0">
                <div className={isFullscreen ? "h-full" : "h-[600px]"}>
                  <TradingViewChart
                    symbol={selectedSymbol}
                    interval={interval}
                    studies={selectedStudies}
                    showToolbar={true}
                    showDrawingTools={true}
                    autosize={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mini Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {watchlist.slice(0, 3).filter(s => s !== selectedSymbol).map((symbol) => (
                <Card
                  key={symbol}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{symbol}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TradingViewMiniChart symbol={symbol} height={150} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

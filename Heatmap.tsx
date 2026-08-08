import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import {
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Building2,
  Globe,
  Layers,
  BarChart3,
} from "lucide-react";

// Mock stock data for heatmap
const stockData = [
  // Petróleo e Gás
  { ticker: "PETR4", name: "Petrobras PN", sector: "Petróleo e Gás", marketCap: 420000, change: -0.16, price: 31.01 },
  { ticker: "PETR3", name: "Petrobras ON", sector: "Petróleo e Gás", marketCap: 380000, change: -0.25, price: 33.50 },
  { ticker: "PRIO3", name: "PRIO", sector: "Petróleo e Gás", marketCap: 45000, change: 1.85, price: 42.30 },
  { ticker: "CSAN3", name: "Cosan", sector: "Petróleo e Gás", marketCap: 28000, change: -1.20, price: 12.45 },
  // Mineração
  { ticker: "VALE3", name: "Vale", sector: "Mineração", marketCap: 280000, change: 1.23, price: 58.92 },
  { ticker: "CSNA3", name: "CSN", sector: "Mineração", marketCap: 18000, change: -0.85, price: 11.25 },
  { ticker: "GGBR4", name: "Gerdau", sector: "Mineração", marketCap: 32000, change: 0.45, price: 18.50 },
  { ticker: "USIM5", name: "Usiminas", sector: "Mineração", marketCap: 8500, change: -2.10, price: 6.85 },
  // Bancos
  { ticker: "ITUB4", name: "Itaú Unibanco", sector: "Bancos", marketCap: 320000, change: 0.85, price: 32.45 },
  { ticker: "BBDC4", name: "Bradesco", sector: "Bancos", marketCap: 135000, change: -0.45, price: 12.85 },
  { ticker: "BBAS3", name: "Banco do Brasil", sector: "Bancos", marketCap: 145000, change: 0.32, price: 28.50 },
  { ticker: "SANB11", name: "Santander", sector: "Bancos", marketCap: 95000, change: -0.18, price: 25.80 },
  { ticker: "ITSA4", name: "Itaúsa", sector: "Bancos", marketCap: 85000, change: 0.55, price: 9.85 },
  // Varejo
  { ticker: "MGLU3", name: "Magazine Luiza", sector: "Varejo", marketCap: 12000, change: -3.50, price: 1.85 },
  { ticker: "VIIA3", name: "Via", sector: "Varejo", marketCap: 2500, change: -5.20, price: 0.75 },
  { ticker: "LREN3", name: "Lojas Renner", sector: "Varejo", marketCap: 18000, change: 1.25, price: 15.20 },
  { ticker: "AMER3", name: "Americanas", sector: "Varejo", marketCap: 800, change: -8.50, price: 0.12 },
  // Utilities
  { ticker: "ELET3", name: "Eletrobras ON", sector: "Utilities", marketCap: 85000, change: 0.65, price: 38.50 },
  { ticker: "ELET6", name: "Eletrobras PNB", sector: "Utilities", marketCap: 82000, change: 0.72, price: 42.30 },
  { ticker: "CMIG4", name: "Cemig", sector: "Utilities", marketCap: 28000, change: -0.35, price: 11.85 },
  { ticker: "CPFE3", name: "CPFL Energia", sector: "Utilities", marketCap: 35000, change: 0.28, price: 32.50 },
  { ticker: "EGIE3", name: "Engie Brasil", sector: "Utilities", marketCap: 42000, change: 0.45, price: 42.10 },
  // Bens Industriais
  { ticker: "WEGE3", name: "WEG", sector: "Bens Industriais", marketCap: 220000, change: 2.15, price: 52.30 },
  { ticker: "EMBR3", name: "Embraer", sector: "Bens Industriais", marketCap: 45000, change: 1.85, price: 55.20 },
  { ticker: "RAIL3", name: "Rumo", sector: "Bens Industriais", marketCap: 38000, change: -0.65, price: 21.50 },
  // Alimentos e Bebidas
  { ticker: "ABEV3", name: "Ambev", sector: "Alimentos e Bebidas", marketCap: 180000, change: -0.32, price: 11.25 },
  { ticker: "JBSS3", name: "JBS", sector: "Alimentos e Bebidas", marketCap: 75000, change: 1.45, price: 35.80 },
  { ticker: "BRFS3", name: "BRF", sector: "Alimentos e Bebidas", marketCap: 28000, change: 0.85, price: 22.50 },
  { ticker: "MDIA3", name: "M. Dias Branco", sector: "Alimentos e Bebidas", marketCap: 8500, change: -1.20, price: 28.30 },
  // Saúde
  { ticker: "RDOR3", name: "Rede D'Or", sector: "Saúde", marketCap: 65000, change: 0.95, price: 28.50 },
  { ticker: "HAPV3", name: "Hapvida", sector: "Saúde", marketCap: 32000, change: -1.85, price: 3.85 },
  { ticker: "FLRY3", name: "Fleury", sector: "Saúde", marketCap: 12000, change: 0.45, price: 15.20 },
  // Tecnologia
  { ticker: "TOTS3", name: "Totvs", sector: "Tecnologia", marketCap: 18000, change: 1.25, price: 28.50 },
  { ticker: "LWSA3", name: "Locaweb", sector: "Tecnologia", marketCap: 3500, change: -2.50, price: 5.85 },
  { ticker: "POSI3", name: "Positivo", sector: "Tecnologia", marketCap: 1800, change: 0.85, price: 8.50 },
  // Imobiliário
  { ticker: "CYRE3", name: "Cyrela", sector: "Imobiliário", marketCap: 8500, change: 1.45, price: 22.50 },
  { ticker: "MRVE3", name: "MRV", sector: "Imobiliário", marketCap: 4500, change: -2.85, price: 8.20 },
  { ticker: "EZTC3", name: "EZTEC", sector: "Imobiliário", marketCap: 3200, change: 0.65, price: 15.80 },
];

// Get color based on change percentage
const getHeatmapColor = (change: number) => {
  if (change >= 3) return "bg-emerald-600";
  if (change >= 2) return "bg-emerald-500";
  if (change >= 1) return "bg-emerald-400";
  if (change >= 0.5) return "bg-emerald-300/80";
  if (change >= 0) return "bg-emerald-200/60";
  if (change >= -0.5) return "bg-red-200/60";
  if (change >= -1) return "bg-red-300/80";
  if (change >= -2) return "bg-red-400";
  if (change >= -3) return "bg-red-500";
  return "bg-red-600";
};

// Get text color based on background
const getTextColor = (change: number) => {
  if (Math.abs(change) >= 1) return "text-white";
  return "text-foreground";
};

// Calculate box size based on market cap
const getBoxSize = (marketCap: number, maxMarketCap: number) => {
  const minSize = 80;
  const maxSize = 200;
  const ratio = Math.sqrt(marketCap / maxMarketCap);
  return Math.max(minSize, Math.min(maxSize, ratio * maxSize));
};

export default function Heatmap() {
  const [viewMode, setViewMode] = useState<"sector" | "marketcap">("sector");
  const [selectedSector, setSelectedSector] = useState("all");
  
  const sectors = useMemo(() => {
    const sectorSet = new Set(stockData.map(s => s.sector));
    return Array.from(sectorSet);
  }, []);
  
  const maxMarketCap = useMemo(() => Math.max(...stockData.map(s => s.marketCap)), []);
  
  // Group stocks by sector
  const stocksBySector = useMemo(() => {
    const grouped: Record<string, typeof stockData> = {};
    stockData.forEach(stock => {
      if (!grouped[stock.sector]) grouped[stock.sector] = [];
      grouped[stock.sector].push(stock);
    });
    // Sort each sector by market cap
    Object.keys(grouped).forEach(sector => {
      grouped[sector].sort((a, b) => b.marketCap - a.marketCap);
    });
    return grouped;
  }, []);
  
  // Calculate sector performance
  const sectorPerformance = useMemo(() => {
    const performance: Record<string, { avgChange: number; totalMarketCap: number; stocks: number }> = {};
    
    Object.entries(stocksBySector).forEach(([sector, stocks]) => {
      const totalMarketCap = stocks.reduce((sum, s) => sum + s.marketCap, 0);
      const weightedChange = stocks.reduce((sum, s) => sum + s.change * s.marketCap, 0) / totalMarketCap;
      performance[sector] = {
        avgChange: weightedChange,
        totalMarketCap,
        stocks: stocks.length,
      };
    });
    
    return performance;
  }, [stocksBySector]);
  
  // Filter stocks
  const filteredStocks = useMemo(() => {
    if (selectedSector === "all") return stockData;
    return stockData.filter(s => s.sector === selectedSector);
  }, [selectedSector]);
  
  // Sort stocks by market cap for treemap view
  const sortedStocks = useMemo(() => {
    return [...filteredStocks].sort((a, b) => b.marketCap - a.marketCap);
  }, [filteredStocks]);
  
  // Market summary
  const marketSummary = useMemo(() => {
    const gainers = stockData.filter(s => s.change > 0).length;
    const losers = stockData.filter(s => s.change < 0).length;
    const unchanged = stockData.filter(s => s.change === 0).length;
    const avgChange = stockData.reduce((sum, s) => sum + s.change, 0) / stockData.length;
    
    return { gainers, losers, unchanged, avgChange };
  }, []);

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutGrid className="h-8 w-8 text-primary" />
              Heatmap de Mercado
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualização de performance por setor e capitalização
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Setores</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Alta</p>
                  <p className="text-2xl font-bold text-emerald-500">{marketSummary.gainers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Baixa</p>
                  <p className="text-2xl font-bold text-red-500">{marketSummary.losers}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estáveis</p>
                  <p className="text-2xl font-bold">{marketSummary.unchanged}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Média</p>
                  <p className={`text-2xl font-bold ${marketSummary.avgChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {marketSummary.avgChange >= 0 ? "+" : ""}{marketSummary.avgChange.toFixed(2)}%
                  </p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "sector" | "marketcap")}>
          <TabsList className="mb-4">
            <TabsTrigger value="sector" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Por Setor
            </TabsTrigger>
            <TabsTrigger value="marketcap" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Por Market Cap
            </TabsTrigger>
          </TabsList>

          {/* Sector View */}
          <TabsContent value="sector">
            <div className="space-y-6">
              {/* Sector Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(sectorPerformance)
                  .sort((a, b) => b[1].avgChange - a[1].avgChange)
                  .map(([sector, perf]) => (
                    <Card 
                      key={sector} 
                      className={`cursor-pointer transition-all hover:scale-105 ${selectedSector === sector ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedSector(selectedSector === sector ? "all" : sector)}
                    >
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground truncate">{sector}</div>
                        <div className={`text-lg font-bold ${perf.avgChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {perf.avgChange >= 0 ? "+" : ""}{perf.avgChange.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">{perf.stocks} ativos</div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Heatmap Grid by Sector */}
              {(selectedSector === "all" ? Object.entries(stocksBySector) : [[selectedSector, stocksBySector[selectedSector] || []]]).map(([sectorKey, stocks]) => {
                const sectorName = sectorKey as string;
                const stockList = stocks as typeof stockData;
                const perf = sectorPerformance[sectorName];
                return (
                <Card key={sectorName}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{sectorName}</span>
                      <Badge variant={perf?.avgChange >= 0 ? "default" : "destructive"}
                             className={perf?.avgChange >= 0 ? "bg-emerald-500" : ""}>
                        {perf?.avgChange >= 0 ? "+" : ""}
                        {perf?.avgChange?.toFixed(2) || "0.00"}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {stockList.map(stock => {
                        const size = getBoxSize(stock.marketCap, maxMarketCap);
                        return (
                          <Link key={stock.ticker} href={`/radar/${stock.ticker}`}>
                            <div
                              className={`${getHeatmapColor(stock.change)} ${getTextColor(stock.change)} rounded-lg p-2 cursor-pointer hover:opacity-80 transition-opacity flex flex-col justify-between`}
                              style={{ width: size, height: size * 0.7 }}
                            >
                              <div>
                                <div className="font-bold text-sm">{stock.ticker}</div>
                                <div className="text-xs opacity-80 truncate">{stock.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono text-sm">
                                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                                </div>
                                <div className="text-xs opacity-80">
                                  R$ {stock.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          </TabsContent>

          {/* Market Cap View */}
          <TabsContent value="marketcap">
            <Card>
              <CardHeader>
                <CardTitle>Treemap por Capitalização de Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {sortedStocks.map(stock => {
                    const size = getBoxSize(stock.marketCap, maxMarketCap);
                    return (
                      <Link key={stock.ticker} href={`/radar/${stock.ticker}`}>
                        <div
                          className={`${getHeatmapColor(stock.change)} ${getTextColor(stock.change)} rounded p-2 cursor-pointer hover:opacity-80 transition-opacity flex flex-col justify-between`}
                          style={{ width: size, height: size * 0.6 }}
                        >
                          <div>
                            <div className="font-bold text-sm">{stock.ticker}</div>
                            <div className="text-xs opacity-80 truncate">{stock.sector}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">
                              {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                            </div>
                            <div className="text-xs opacity-80">
                              R$ {(stock.marketCap / 1000).toFixed(0)}B
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Color Legend */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Variação:</span>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-red-600"></div>
                <span className="text-xs">-3%+</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-red-400"></div>
                <span className="text-xs">-2%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-red-200/60"></div>
                <span className="text-xs">-0.5%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-gray-300"></div>
                <span className="text-xs">0%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-emerald-200/60"></div>
                <span className="text-xs">+0.5%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-emerald-400"></div>
                <span className="text-xs">+2%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-emerald-600"></div>
                <span className="text-xs">+3%+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

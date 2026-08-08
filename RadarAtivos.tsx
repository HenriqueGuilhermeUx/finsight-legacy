import { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Loader2, RefreshCw, Star, Filter, X, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Signal Badge Component with real-time data
function SignalBadge({ ticker }: { ticker: string }) {
  const { data: signal, isLoading } = trpc.assets.getSignal.useQuery(
    { ticker },
    { 
      staleTime: 60000, // Cache for 1 minute
      refetchOnWindowFocus: false 
    }
  );

  if (isLoading) {
    return <span className="text-xs text-muted-foreground">...</span>;
  }

  if (!signal) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  const getSignalDisplay = () => {
    switch (signal.signal) {
      case 'strong_buy':
        return { text: '🚀 Compra Forte', className: 'bg-emerald-500 text-white' };
      case 'buy':
        return { text: '⬆️ Compra', className: 'bg-emerald-500/70 text-white' };
      case 'strong_sell':
        return { text: '🚨 Venda Forte', className: 'bg-red-500 text-white' };
      case 'sell':
        return { text: '⬇️ Venda', className: 'bg-red-500/70 text-white' };
      default:
        return { text: '➖ Neutro', className: 'bg-slate-500 text-white' };
    }
  };

  const display = getSignalDisplay();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`text-xs ${display.className}`}>
            {display.text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 border-slate-700">
          <div className="text-xs space-y-1">
            <div>RSI: <span className={signal.rsi < 30 ? 'text-emerald-400' : signal.rsi > 70 ? 'text-red-400' : ''}>{signal.rsi?.toFixed(1)}</span></div>
            <div>MACD: <span className={signal.macd > signal.macdSignal ? 'text-emerald-400' : 'text-red-400'}>{signal.macd?.toFixed(2)}</span></div>
            <div>SMA20: {signal.sma20?.toFixed(2)}</div>
            <div>SMA50: {signal.sma50?.toFixed(2)}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function formatPrice(price: number, currency: string = "BRL"): string {
  if (currency === "USD") {
    return `US$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMarketCap(value: number | null): string {
  if (!value) return "N/A";
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toLocaleString("pt-BR");
}

// Sector options
const SECTORS = [
  { value: "all", label: "Todos os Setores" },
  { value: "Petróleo e Gás", label: "Petróleo e Gás" },
  { value: "Mineração", label: "Mineração" },
  { value: "Bancos", label: "Bancos" },
  { value: "Bebidas", label: "Bebidas" },
  { value: "Bens Industriais", label: "Bens Industriais" },
  { value: "Varejo", label: "Varejo" },
  { value: "Tecnologia", label: "Tecnologia" },
  { value: "Semicondutores", label: "Semicondutores" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Automotivo", label: "Automotivo" },
  { value: "Saúde", label: "Saúde" },
  { value: "Serviços Financeiros", label: "Serviços Financeiros" },
  { value: "Alimentos", label: "Alimentos" },
  { value: "Siderurgia", label: "Siderurgia" },
  { value: "Aeronáutica", label: "Aeronáutica" },
  { value: "Papel e Celulose", label: "Papel e Celulose" },
  { value: "Aluguel de Carros", label: "Aluguel de Carros" },
];

// Market cap ranges
const MARKET_CAP_RANGES = [
  { value: "all", label: "Qualquer Market Cap" },
  { value: "micro", label: "Micro Cap (< 300M)" },
  { value: "small", label: "Small Cap (300M - 2B)" },
  { value: "mid", label: "Mid Cap (2B - 10B)" },
  { value: "large", label: "Large Cap (10B - 200B)" },
  { value: "mega", label: "Mega Cap (> 200B)" },
];

// Region options
const REGIONS = [
  { value: "all", label: "Todas as Regiões" },
  { value: "BR", label: "🇧🇷 Brasil" },
  { value: "US", label: "🇺🇸 Estados Unidos" },
  { value: "CRYPTO", label: "🌐 Cripto" },
];

export default function RadarAtivos() {
  const searchParams = useSearch();
  const urlQuery = new URLSearchParams(searchParams).get("q") || "";
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<"stock" | "etf" | "crypto">("stock");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Advanced filters state
  const [filters, setFilters] = useState({
    sector: "all",
    region: "all",
    marketCap: "all",
    plMin: 0,
    plMax: 100,
    dividendYieldMin: 0,
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fetch assets from API
  const { data: assets, isLoading, refetch } = trpc.assets.search.useQuery({
    query: searchTerm || undefined,
    type: activeTab === "etf" ? undefined : activeTab,
  });

  // Fetch user favorites
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Update search when URL changes
  useEffect(() => {
    if (urlQuery) {
      setSearchTerm(urlQuery);
    }
  }, [urlQuery]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.sector !== "all") count++;
    if (filters.region !== "all") count++;
    if (filters.marketCap !== "all") count++;
    if (filters.plMin > 0 || filters.plMax < 100) count++;
    if (filters.dividendYieldMin > 0) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const favoriteTickersSet = new Set(favorites?.map(f => f.ticker) || []);

  // Apply all filters
  const filteredAssets = useMemo(() => {
    let result = assets?.filter(asset => {
      if (activeTab === "crypto") return asset.type === "crypto";
      if (activeTab === "stock") return asset.type === "stock";
      return true;
    }) || [];

    // Sector filter
    if (filters.sector !== "all") {
      result = result.filter(asset => asset.sector === filters.sector);
    }

    // Region filter
    if (filters.region !== "all") {
      result = result.filter(asset => asset.region === filters.region);
    }

    return result;
  }, [assets, activeTab, filters]);

  const clearFilters = () => {
    setFilters({
      sector: "all",
      region: "all",
      marketCap: "all",
      plMin: 0,
      plMax: 100,
      dividendYieldMin: 0,
    });
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header - Bloomberg Style */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Radar de Ativos</h1>
              <p className="text-muted-foreground">
                Dados em tempo real via Yahoo Finance
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ticker ou nome... (ex: PETR4, Apple, Bitcoin)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 focus:border-cyan-500"
            />
          </div>
          <Button 
            variant="outline" 
            className={`gap-2 border-slate-700 hover:border-cyan-500/50 ${filtersOpen ? 'bg-cyan-500/10 border-cyan-500/50' : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-cyan-500 text-white text-xs px-1.5 py-0">
                {activeFiltersCount}
              </Badge>
            )}
            {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 border-slate-700 hover:border-cyan-500/50"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Advanced Filters Panel */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <Card className="mb-6 bg-slate-900/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-300">Filtros Avançados</h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpar filtros
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Sector Filter */}
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Setor</label>
                    <Select
                      value={filters.sector}
                      onValueChange={(v) => setFilters({ ...filters, sector: v })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector.value} value={sector.value}>
                            {sector.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Região</label>
                    <Select
                      value={filters.region}
                      onValueChange={(v) => setFilters({ ...filters, region: v })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Selecione a região" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {REGIONS.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Market Cap Filter */}
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Market Cap</label>
                    <Select
                      value={filters.marketCap}
                      onValueChange={(v) => setFilters({ ...filters, marketCap: v })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Selecione o range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {MARKET_CAP_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dividend Yield Filter */}
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">
                      Dividend Yield Mínimo: {filters.dividendYieldMin}%
                    </label>
                    <Slider
                      value={[filters.dividendYieldMin]}
                      onValueChange={([v]) => setFilters({ ...filters, dividendYieldMin: v })}
                      min={0}
                      max={20}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* P/L Range Filter */}
                <div className="mt-6">
                  <label className="text-xs text-slate-400 mb-2 block">
                    Faixa de P/L: {filters.plMin} - {filters.plMax === 100 ? '100+' : filters.plMax}
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[filters.plMin, filters.plMax]}
                      onValueChange={([min, max]) => setFilters({ ...filters, plMin: min, plMax: max })}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0 (Barato)</span>
                    <span>50 (Médio)</span>
                    <span>100+ (Caro)</span>
                  </div>
                </div>

                {/* Active Filters Tags */}
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filters.sector !== "all" && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        Setor: {filters.sector}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({ ...filters, sector: "all" })}
                        />
                      </Badge>
                    )}
                    {filters.region !== "all" && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        Região: {filters.region}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({ ...filters, region: "all" })}
                        />
                      </Badge>
                    )}
                    {filters.marketCap !== "all" && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        Market Cap: {MARKET_CAP_RANGES.find(r => r.value === filters.marketCap)?.label}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({ ...filters, marketCap: "all" })}
                        />
                      </Badge>
                    )}
                    {(filters.plMin > 0 || filters.plMax < 100) && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        P/L: {filters.plMin} - {filters.plMax === 100 ? '100+' : filters.plMax}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({ ...filters, plMin: 0, plMax: 100 })}
                        />
                      </Badge>
                    )}
                    {filters.dividendYieldMin > 0 && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        DY ≥ {filters.dividendYieldMin}%
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({ ...filters, dividendYieldMin: 0 })}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="stock" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Ações
            </TabsTrigger>
            <TabsTrigger value="crypto" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Cripto
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                {filteredAssets.length} {filteredAssets.length === 1 ? 'ativo encontrado' : 'ativos encontrados'}
                {activeFiltersCount > 0 && ` (${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''})`}
              </span>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-slate-700/50">
              <div>Ativo</div>
              <div className="text-right">Região</div>
              <div className="text-right">Setor</div>
              <div className="text-right">Tipo</div>
              <div className="text-center">Sinal</div>
              <div className="text-right">Favorito</div>
              <div></div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              </div>
            )}

            {/* Asset Cards */}
            {!isLoading && (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <Link key={asset.ticker} href={`/radar/${asset.ticker}`}>
                    <Card className="hover:border-cyan-500/50 transition-all cursor-pointer bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center">
                          {/* Asset Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center font-bold text-sm font-mono text-cyan-400">
                              {asset.ticker.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold font-mono">{asset.ticker}</div>
                              <div className="text-sm text-muted-foreground">{asset.name}</div>
                            </div>
                          </div>

                          {/* Region */}
                          <div className="text-right hidden md:block">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              asset.region === "BR" 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : asset.region === "US"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}>
                              {asset.region}
                            </span>
                          </div>

                          {/* Sector */}
                          <div className="text-right hidden md:block">
                            <span className="text-xs text-muted-foreground">
                              {asset.sector}
                            </span>
                          </div>

                          {/* Type */}
                          <div className="text-right hidden md:block">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              asset.type === "crypto" 
                                ? "bg-amber-500/20 text-amber-400" 
                                : "bg-slate-700/50 text-muted-foreground"
                            }`}>
                              {asset.type === "crypto" ? "Cripto" : "Ação"}
                            </span>
                          </div>

                          {/* Technical Signal */}
                          <div className="text-center hidden md:block">
                            <SignalBadge ticker={asset.ticker} />
                          </div>

                          {/* Favorite indicator */}
                          <div className="text-right hidden md:block">
                            {favoriteTickersSet.has(asset.ticker) && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 inline" />
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="text-right">
                            <span className="text-cyan-400 text-sm">Ver detalhes →</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && filteredAssets.length === 0 && (
              <Card className="bg-slate-900/30 border-slate-700/50">
                <CardContent className="py-12 text-center">
                  <Filter className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    {searchTerm 
                      ? `Nenhum ativo encontrado para "${searchTerm}"`
                      : activeFiltersCount > 0
                      ? "Nenhum ativo corresponde aos filtros selecionados"
                      : "Nenhum ativo disponível nesta categoria"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Dados fornecidos por Yahoo Finance • Ativos brasileiros (B3) e internacionais (NYSE/NASDAQ)</p>
        </div>
      </div>
    </MainLayout>
  );
}

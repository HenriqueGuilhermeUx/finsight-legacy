import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Search,
  ArrowUpRight,
  Info,
  DollarSign,
  Percent,
  Building2,
  PieChart,
  Activity,
  Target,
  Scale,
  Wallet,
  Calculator,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Layers
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Dados fundamentalistas das empresas
const FUNDAMENTAL_DATA: {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  marketCap: number; // em bilhões
  // Indicadores de Rentabilidade
  roe: number;
  roic: number;
  roa: number;
  margemBruta: number;
  margemEbitda: number;
  margemLiquida: number;
  // Indicadores de Valuation
  pl: number;
  pvp: number;
  evEbitda: number;
  psr: number;
  dividendYield: number;
  // Indicadores de Endividamento
  dividaLiquidaEbitda: number;
  dividaLiquidaPl: number;
  liquidezCorrente: number;
  // Indicadores de Crescimento
  crescimentoReceita5a: number;
  crescimentoLucro5a: number;
  cagrReceita: number;
  cagrLucro: number;
  // Dados do Balanço (em bilhões)
  ativoTotal: number;
  patrimonioLiquido: number;
  dividaLiquida: number;
  caixa: number;
  // Dados da DRE (em bilhões)
  receitaLiquida: number;
  lucroLiquido: number;
  ebitda: number;
  lucroBruto: number;
  // Score
  scoreGeral: number;
}[] = [
  {
    ticker: 'WEGE3',
    name: 'WEG',
    sector: 'Industrial',
    price: 52.80,
    marketCap: 220.5,
    roe: 28.5,
    roic: 24.2,
    roa: 15.8,
    margemBruta: 32.5,
    margemEbitda: 22.8,
    margemLiquida: 16.2,
    pl: 35.2,
    pvp: 9.8,
    evEbitda: 25.5,
    psr: 5.8,
    dividendYield: 1.5,
    dividaLiquidaEbitda: -0.5,
    dividaLiquidaPl: -0.15,
    liquidezCorrente: 2.8,
    crescimentoReceita5a: 85,
    crescimentoLucro5a: 120,
    cagrReceita: 13.2,
    cagrLucro: 17.1,
    ativoTotal: 45.2,
    patrimonioLiquido: 22.5,
    dividaLiquida: -3.2,
    caixa: 8.5,
    receitaLiquida: 38.2,
    lucroLiquido: 6.2,
    ebitda: 8.7,
    lucroBruto: 12.4,
    scoreGeral: 92,
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco',
    sector: 'Financeiro',
    price: 32.45,
    marketCap: 285.0,
    roe: 19.8,
    roic: 0,
    roa: 1.5,
    margemBruta: 0,
    margemEbitda: 0,
    margemLiquida: 22.5,
    pl: 8.2,
    pvp: 1.6,
    evEbitda: 0,
    psr: 2.8,
    dividendYield: 6.2,
    dividaLiquidaEbitda: 0,
    dividaLiquidaPl: 0,
    liquidezCorrente: 0,
    crescimentoReceita5a: 45,
    crescimentoLucro5a: 55,
    cagrReceita: 7.8,
    cagrLucro: 9.2,
    ativoTotal: 2450.0,
    patrimonioLiquido: 178.0,
    dividaLiquida: 0,
    caixa: 85.0,
    receitaLiquida: 102.0,
    lucroLiquido: 35.2,
    ebitda: 0,
    lucroBruto: 0,
    scoreGeral: 85,
  },
  {
    ticker: 'PETR4',
    name: 'Petrobras',
    sector: 'Petróleo',
    price: 36.80,
    marketCap: 485.0,
    roe: 32.5,
    roic: 18.5,
    roa: 12.8,
    margemBruta: 52.0,
    margemEbitda: 48.5,
    margemLiquida: 28.2,
    pl: 4.2,
    pvp: 1.35,
    evEbitda: 3.2,
    psr: 1.2,
    dividendYield: 18.5,
    dividaLiquidaEbitda: 0.8,
    dividaLiquidaPl: 0.45,
    liquidezCorrente: 1.2,
    crescimentoReceita5a: 65,
    crescimentoLucro5a: 180,
    cagrReceita: 10.5,
    cagrLucro: 22.8,
    ativoTotal: 850.0,
    patrimonioLiquido: 360.0,
    dividaLiquida: 145.0,
    caixa: 72.0,
    receitaLiquida: 405.0,
    lucroLiquido: 114.0,
    ebitda: 196.0,
    lucroBruto: 210.0,
    scoreGeral: 78,
  },
  {
    ticker: 'VALE3',
    name: 'Vale',
    sector: 'Mineração',
    price: 62.50,
    marketCap: 265.0,
    roe: 22.8,
    roic: 15.2,
    roa: 10.5,
    margemBruta: 42.0,
    margemEbitda: 45.2,
    margemLiquida: 25.8,
    pl: 5.8,
    pvp: 1.3,
    evEbitda: 4.5,
    psr: 1.5,
    dividendYield: 8.2,
    dividaLiquidaEbitda: 0.5,
    dividaLiquidaPl: 0.35,
    liquidezCorrente: 1.8,
    crescimentoReceita5a: 42,
    crescimentoLucro5a: 85,
    cagrReceita: 7.3,
    cagrLucro: 13.1,
    ativoTotal: 520.0,
    patrimonioLiquido: 205.0,
    dividaLiquida: 42.0,
    caixa: 28.0,
    receitaLiquida: 178.0,
    lucroLiquido: 46.0,
    ebitda: 80.0,
    lucroBruto: 75.0,
    scoreGeral: 75,
  },
  {
    ticker: 'BBAS3',
    name: 'Banco do Brasil',
    sector: 'Financeiro',
    price: 54.20,
    marketCap: 155.0,
    roe: 21.2,
    roic: 0,
    roa: 1.2,
    margemBruta: 0,
    margemEbitda: 0,
    margemLiquida: 18.5,
    pl: 4.8,
    pvp: 1.0,
    evEbitda: 0,
    psr: 1.5,
    dividendYield: 9.8,
    dividaLiquidaEbitda: 0,
    dividaLiquidaPl: 0,
    liquidezCorrente: 0,
    crescimentoReceita5a: 38,
    crescimentoLucro5a: 65,
    cagrReceita: 6.7,
    cagrLucro: 10.5,
    ativoTotal: 2100.0,
    patrimonioLiquido: 155.0,
    dividaLiquida: 0,
    caixa: 120.0,
    receitaLiquida: 175.0,
    lucroLiquido: 32.5,
    ebitda: 0,
    lucroBruto: 0,
    scoreGeral: 82,
  },
  {
    ticker: 'RENT3',
    name: 'Localiza',
    sector: 'Aluguel de Carros',
    price: 42.80,
    marketCap: 45.0,
    roe: 18.5,
    roic: 12.2,
    roa: 5.8,
    margemBruta: 68.0,
    margemEbitda: 42.5,
    margemLiquida: 12.8,
    pl: 15.2,
    pvp: 2.8,
    evEbitda: 8.5,
    psr: 1.9,
    dividendYield: 2.5,
    dividaLiquidaEbitda: 2.8,
    dividaLiquidaPl: 1.2,
    liquidezCorrente: 1.5,
    crescimentoReceita5a: 125,
    crescimentoLucro5a: 95,
    cagrReceita: 17.5,
    cagrLucro: 14.3,
    ativoTotal: 85.0,
    patrimonioLiquido: 16.0,
    dividaLiquida: 28.0,
    caixa: 5.2,
    receitaLiquida: 24.0,
    lucroLiquido: 3.1,
    ebitda: 10.2,
    lucroBruto: 16.3,
    scoreGeral: 72,
  },
  {
    ticker: 'RADL3',
    name: 'Raia Drogasil',
    sector: 'Varejo Farmacêutico',
    price: 25.50,
    marketCap: 42.0,
    roe: 15.2,
    roic: 12.8,
    roa: 8.5,
    margemBruta: 28.5,
    margemEbitda: 8.2,
    margemLiquida: 4.5,
    pl: 28.5,
    pvp: 4.2,
    evEbitda: 18.5,
    psr: 1.3,
    dividendYield: 1.2,
    dividaLiquidaEbitda: 0.8,
    dividaLiquidaPl: 0.35,
    liquidezCorrente: 1.2,
    crescimentoReceita5a: 95,
    crescimentoLucro5a: 75,
    cagrReceita: 14.3,
    cagrLucro: 11.8,
    ativoTotal: 18.0,
    patrimonioLiquido: 10.0,
    dividaLiquida: 2.2,
    caixa: 1.8,
    receitaLiquida: 32.0,
    lucroLiquido: 1.45,
    ebitda: 2.6,
    lucroBruto: 9.1,
    scoreGeral: 70,
  },
  {
    ticker: 'EGIE3',
    name: 'Engie Brasil',
    sector: 'Energia',
    price: 42.50,
    marketCap: 35.0,
    roe: 28.5,
    roic: 14.2,
    roa: 8.2,
    margemBruta: 65.0,
    margemEbitda: 55.2,
    margemLiquida: 28.5,
    pl: 8.5,
    pvp: 2.4,
    evEbitda: 6.8,
    psr: 2.4,
    dividendYield: 8.5,
    dividaLiquidaEbitda: 2.2,
    dividaLiquidaPl: 0.85,
    liquidezCorrente: 1.1,
    crescimentoReceita5a: 35,
    crescimentoLucro5a: 45,
    cagrReceita: 6.2,
    cagrLucro: 7.7,
    ativoTotal: 52.0,
    patrimonioLiquido: 14.5,
    dividaLiquida: 18.0,
    caixa: 3.5,
    receitaLiquida: 14.5,
    lucroLiquido: 4.1,
    ebitda: 8.0,
    lucroBruto: 9.4,
    scoreGeral: 80,
  },
];

const SECTORS = [
  { value: 'all', label: 'Todos os Setores' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Petróleo', label: 'Petróleo' },
  { value: 'Mineração', label: 'Mineração' },
  { value: 'Aluguel de Carros', label: 'Aluguel de Carros' },
  { value: 'Varejo Farmacêutico', label: 'Varejo Farmacêutico' },
  { value: 'Energia', label: 'Energia' },
];

type TabType = 'overview' | 'rentabilidade' | 'valuation' | 'endividamento' | 'crescimento' | 'balanco';

export default function Fundamentalista() {
  const [sector, setSector] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Filtrar
  const filteredStocks = useMemo(() => {
    let result = FUNDAMENTAL_DATA;

    if (sector !== 'all') {
      result = result.filter(stock => stock.sector === sector);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(stock => 
        stock.ticker.toLowerCase().includes(searchLower) ||
        stock.name.toLowerCase().includes(searchLower)
      );
    }

    return result.sort((a, b) => b.scoreGeral - a.scoreGeral);
  }, [sector, search]);

  const selectedStockData = useMemo(() => {
    return FUNDAMENTAL_DATA.find(s => s.ticker === selectedStock);
  }, [selectedStock]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatBillions = (value: number) => {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)} tri`;
    return `R$ ${value.toFixed(1)} bi`;
  };

  const getIndicatorColor = (value: number, type: 'roe' | 'pl' | 'divida' | 'margem' | 'crescimento') => {
    switch (type) {
      case 'roe':
        if (value >= 20) return 'text-green-500';
        if (value >= 10) return 'text-yellow-500';
        return 'text-red-500';
      case 'pl':
        if (value <= 10) return 'text-green-500';
        if (value <= 20) return 'text-yellow-500';
        return 'text-red-500';
      case 'divida':
        if (value <= 1) return 'text-green-500';
        if (value <= 3) return 'text-yellow-500';
        return 'text-red-500';
      case 'margem':
        if (value >= 20) return 'text-green-500';
        if (value >= 10) return 'text-yellow-500';
        return 'text-red-500';
      case 'crescimento':
        if (value >= 15) return 'text-green-500';
        if (value >= 5) return 'text-yellow-500';
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIndicatorStatus = (value: number, thresholds: { good: number; bad: number; higherIsBetter: boolean }) => {
    const { good, bad, higherIsBetter } = thresholds;
    
    if (higherIsBetter) {
      if (value >= good) return { icon: CheckCircle, color: 'text-green-500', label: 'Bom' };
      if (value >= bad) return { icon: AlertCircle, color: 'text-yellow-500', label: 'Regular' };
      return { icon: XCircle, color: 'text-red-500', label: 'Ruim' };
    } else {
      if (value <= good) return { icon: CheckCircle, color: 'text-green-500', label: 'Bom' };
      if (value <= bad) return { icon: AlertCircle, color: 'text-yellow-500', label: 'Regular' };
      return { icon: XCircle, color: 'text-red-500', label: 'Ruim' };
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Análise Fundamentalista</h1>
        </div>
        <p className="text-muted-foreground">
          Indicadores de rentabilidade, valuation, endividamento e crescimento das principais empresas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticker ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de Empresas */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-lg mb-3">Empresas ({filteredStocks.length})</h3>
          {filteredStocks.map((stock) => (
            <Card 
              key={stock.ticker}
              className={`cursor-pointer transition-all hover:border-primary ${selectedStock === stock.ticker ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setSelectedStock(stock.ticker)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{stock.ticker}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                    <Badge variant="outline" className="mt-1 text-xs">{stock.sector}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="flex items-center gap-2">
                      <Progress value={stock.scoreGeral} className={`w-16 h-2 ${getScoreColor(stock.scoreGeral)}`} />
                      <span className="font-bold">{stock.scoreGeral}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detalhes da Empresa */}
        <div className="lg:col-span-2">
          {selectedStockData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedStockData.ticker}
                      <Badge>{selectedStockData.sector}</Badge>
                    </CardTitle>
                    <CardDescription>{selectedStockData.name}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(selectedStockData.price)}</div>
                    <div className="text-sm text-muted-foreground">
                      Market Cap: {formatBillions(selectedStockData.marketCap)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
                    <TabsTrigger value="overview">Geral</TabsTrigger>
                    <TabsTrigger value="rentabilidade">Rentabilidade</TabsTrigger>
                    <TabsTrigger value="valuation">Valuation</TabsTrigger>
                    <TabsTrigger value="endividamento">Dívida</TabsTrigger>
                    <TabsTrigger value="crescimento">Crescimento</TabsTrigger>
                    <TabsTrigger value="balanco">Balanço</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground">ROE</div>
                        <div className={`text-2xl font-bold ${getIndicatorColor(selectedStockData.roe, 'roe')}`}>
                          {selectedStockData.roe.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground">P/L</div>
                        <div className={`text-2xl font-bold ${getIndicatorColor(selectedStockData.pl, 'pl')}`}>
                          {selectedStockData.pl.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground">DY</div>
                        <div className="text-2xl font-bold text-green-500">
                          {selectedStockData.dividendYield.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground">Dív/EBITDA</div>
                        <div className={`text-2xl font-bold ${getIndicatorColor(selectedStockData.dividaLiquidaEbitda, 'divida')}`}>
                          {selectedStockData.dividaLiquidaEbitda.toFixed(1)}x
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Score Geral</h4>
                      <div className="flex items-center gap-4">
                        <Progress value={selectedStockData.scoreGeral} className="flex-1 h-4" />
                        <span className="text-2xl font-bold">{selectedStockData.scoreGeral}/100</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedStockData.scoreGeral >= 80 
                          ? 'Empresa com excelentes fundamentos. Indicadores de rentabilidade e crescimento acima da média.'
                          : selectedStockData.scoreGeral >= 60
                          ? 'Empresa com bons fundamentos. Alguns indicadores podem ser melhorados.'
                          : 'Empresa com fundamentos que merecem atenção. Analise com cuidado antes de investir.'}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="rentabilidade">
                    <div className="space-y-4">
                      {[
                        { label: 'ROE (Return on Equity)', value: selectedStockData.roe, suffix: '%', desc: 'Retorno sobre o patrimônio líquido', thresholds: { good: 15, bad: 8, higherIsBetter: true } },
                        { label: 'ROIC (Return on Invested Capital)', value: selectedStockData.roic, suffix: '%', desc: 'Retorno sobre capital investido', thresholds: { good: 12, bad: 6, higherIsBetter: true } },
                        { label: 'ROA (Return on Assets)', value: selectedStockData.roa, suffix: '%', desc: 'Retorno sobre ativos totais', thresholds: { good: 8, bad: 4, higherIsBetter: true } },
                        { label: 'Margem Bruta', value: selectedStockData.margemBruta, suffix: '%', desc: 'Lucro bruto / Receita líquida', thresholds: { good: 30, bad: 15, higherIsBetter: true } },
                        { label: 'Margem EBITDA', value: selectedStockData.margemEbitda, suffix: '%', desc: 'EBITDA / Receita líquida', thresholds: { good: 20, bad: 10, higherIsBetter: true } },
                        { label: 'Margem Líquida', value: selectedStockData.margemLiquida, suffix: '%', desc: 'Lucro líquido / Receita líquida', thresholds: { good: 15, bad: 5, higherIsBetter: true } },
                      ].map((item) => {
                        const status = getIndicatorStatus(item.value, item.thresholds);
                        const StatusIcon = status.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-sm text-muted-foreground">{item.desc}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xl font-bold ${status.color}`}>
                                {item.value > 0 ? `${item.value.toFixed(1)}${item.suffix}` : 'N/A'}
                              </span>
                              <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="valuation">
                    <div className="space-y-4">
                      {[
                        { label: 'P/L (Preço/Lucro)', value: selectedStockData.pl, suffix: 'x', desc: 'Quantos anos de lucro para pagar o preço', thresholds: { good: 10, bad: 25, higherIsBetter: false } },
                        { label: 'P/VP (Preço/Valor Patrimonial)', value: selectedStockData.pvp, suffix: 'x', desc: 'Preço em relação ao patrimônio', thresholds: { good: 1.5, bad: 4, higherIsBetter: false } },
                        { label: 'EV/EBITDA', value: selectedStockData.evEbitda, suffix: 'x', desc: 'Valor da empresa / EBITDA', thresholds: { good: 8, bad: 15, higherIsBetter: false } },
                        { label: 'PSR (Price/Sales)', value: selectedStockData.psr, suffix: 'x', desc: 'Preço em relação à receita', thresholds: { good: 2, bad: 5, higherIsBetter: false } },
                        { label: 'Dividend Yield', value: selectedStockData.dividendYield, suffix: '%', desc: 'Dividendos / Preço da ação', thresholds: { good: 5, bad: 2, higherIsBetter: true } },
                      ].map((item) => {
                        const status = getIndicatorStatus(item.value, item.thresholds);
                        const StatusIcon = status.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-sm text-muted-foreground">{item.desc}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xl font-bold ${status.color}`}>
                                {item.value > 0 ? `${item.value.toFixed(1)}${item.suffix}` : 'N/A'}
                              </span>
                              <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="endividamento">
                    <div className="space-y-4">
                      {[
                        { label: 'Dívida Líquida/EBITDA', value: selectedStockData.dividaLiquidaEbitda, suffix: 'x', desc: 'Anos para pagar a dívida com EBITDA', thresholds: { good: 1, bad: 3, higherIsBetter: false } },
                        { label: 'Dívida Líquida/PL', value: selectedStockData.dividaLiquidaPl, suffix: 'x', desc: 'Dívida em relação ao patrimônio', thresholds: { good: 0.5, bad: 1.5, higherIsBetter: false } },
                        { label: 'Liquidez Corrente', value: selectedStockData.liquidezCorrente, suffix: 'x', desc: 'Ativo circulante / Passivo circulante', thresholds: { good: 1.5, bad: 1, higherIsBetter: true } },
                      ].map((item) => {
                        const status = item.value !== 0 ? getIndicatorStatus(item.value, item.thresholds) : { icon: AlertCircle, color: 'text-muted-foreground', label: 'N/A' };
                        const StatusIcon = status.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-sm text-muted-foreground">{item.desc}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xl font-bold ${status.color}`}>
                                {item.value !== 0 ? `${item.value.toFixed(2)}${item.suffix}` : 'N/A'}
                              </span>
                              <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            </div>
                          </div>
                        );
                      })}

                      <div className="mt-6 p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-3">Posição de Caixa</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Caixa</div>
                            <div className="text-xl font-bold text-green-500">{formatBillions(selectedStockData.caixa)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Dívida Líquida</div>
                            <div className={`text-xl font-bold ${selectedStockData.dividaLiquida < 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {formatBillions(selectedStockData.dividaLiquida)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="crescimento">
                    <div className="space-y-4">
                      {[
                        { label: 'Crescimento Receita (5 anos)', value: selectedStockData.crescimentoReceita5a, suffix: '%', desc: 'Variação total em 5 anos', thresholds: { good: 50, bad: 20, higherIsBetter: true } },
                        { label: 'Crescimento Lucro (5 anos)', value: selectedStockData.crescimentoLucro5a, suffix: '%', desc: 'Variação total em 5 anos', thresholds: { good: 60, bad: 25, higherIsBetter: true } },
                        { label: 'CAGR Receita', value: selectedStockData.cagrReceita, suffix: '%', desc: 'Taxa composta de crescimento anual', thresholds: { good: 10, bad: 5, higherIsBetter: true } },
                        { label: 'CAGR Lucro', value: selectedStockData.cagrLucro, suffix: '%', desc: 'Taxa composta de crescimento anual', thresholds: { good: 12, bad: 6, higherIsBetter: true } },
                      ].map((item) => {
                        const status = getIndicatorStatus(item.value, item.thresholds);
                        const StatusIcon = status.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-sm text-muted-foreground">{item.desc}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xl font-bold ${status.color}`}>
                                {item.value.toFixed(1)}{item.suffix}
                              </span>
                              <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="balanco">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          Balanço Patrimonial
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>Ativo Total</span>
                            <span className="font-bold">{formatBillions(selectedStockData.ativoTotal)}</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>Patrimônio Líquido</span>
                            <span className="font-bold">{formatBillions(selectedStockData.patrimonioLiquido)}</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>Dívida Líquida</span>
                            <span className={`font-bold ${selectedStockData.dividaLiquida < 0 ? 'text-green-500' : ''}`}>
                              {formatBillions(selectedStockData.dividaLiquida)}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>Caixa</span>
                            <span className="font-bold text-green-500">{formatBillions(selectedStockData.caixa)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          DRE (Demonstração de Resultado)
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>Receita Líquida</span>
                            <span className="font-bold">{formatBillions(selectedStockData.receitaLiquida)}</span>
                          </div>
                          {selectedStockData.lucroBruto > 0 && (
                            <div className="flex justify-between p-2 rounded bg-muted/50">
                              <span>Lucro Bruto</span>
                              <span className="font-bold">{formatBillions(selectedStockData.lucroBruto)}</span>
                            </div>
                          )}
                          {selectedStockData.ebitda > 0 && (
                            <div className="flex justify-between p-2 rounded bg-muted/50">
                              <span>EBITDA</span>
                              <span className="font-bold">{formatBillions(selectedStockData.ebitda)}</span>
                            </div>
                          )}
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>Lucro Líquido</span>
                            <span className="font-bold text-green-500">{formatBillions(selectedStockData.lucroLiquido)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-6">
                  <Link href={`/radar/${selectedStockData.ticker}`}>
                    <Button>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Análise Técnica
                    </Button>
                  </Link>
                  <Link href={`/valuation?ticker=${selectedStockData.ticker}`}>
                    <Button variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Valuation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Selecione uma empresa</h3>
                <p className="text-muted-foreground">
                  Clique em uma empresa na lista para ver a análise fundamentalista completa
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Card Informativo */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Guia de Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Rentabilidade
              </h4>
              <p className="text-sm text-muted-foreground">
                ROE, ROIC e margens medem a eficiência da empresa em gerar lucro. 
                ROE acima de 15% é considerado bom.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-500" />
                Valuation
              </h4>
              <p className="text-sm text-muted-foreground">
                P/L e P/VP indicam se a ação está cara ou barata. 
                Compare sempre com empresas do mesmo setor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-red-500" />
                Endividamento
              </h4>
              <p className="text-sm text-muted-foreground">
                Dívida/EBITDA abaixo de 2x é saudável. 
                Empresas com caixa líquido são mais seguras.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Crescimento
              </h4>
              <p className="text-sm text-muted-foreground">
                CAGR mostra o crescimento médio anual. 
                Empresas de qualidade crescem acima de 10% ao ano.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

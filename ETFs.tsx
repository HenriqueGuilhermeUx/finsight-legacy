import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  DollarSign, 
  BarChart3, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Bitcoin,
  Building2,
  Briefcase,
  Target,
  Shield,
  Zap,
  Info,
  Star,
  Crown,
  Medal,
  Trophy
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';

// Dados dos ETFs com informações detalhadas
const ETF_DATA: Record<string, {
  name: string;
  category: string;
  categoryIcon: typeof Layers;
  benchmark: string;
  taxaAdm: number;
  aum: number; // Assets Under Management em milhões
  dividendYield: number;
  description: string;
}> = {
  // Índices Brasil
  'BOVA11.SA': { name: 'iShares Ibovespa', category: 'Índice Brasil', categoryIcon: Building2, benchmark: 'Ibovespa', taxaAdm: 0.10, aum: 15000, dividendYield: 5.2, description: 'Replica o Ibovespa, principal índice da B3 com as maiores empresas brasileiras' },
  'BOVV11.SA': { name: 'It Now Ibovespa', category: 'Índice Brasil', categoryIcon: Building2, benchmark: 'Ibovespa', taxaAdm: 0.10, aum: 2500, dividendYield: 5.0, description: 'ETF do Itaú que replica o Ibovespa com baixo custo' },
  'BBOV11.SA': { name: 'BB Ibovespa', category: 'Índice Brasil', categoryIcon: Building2, benchmark: 'Ibovespa', taxaAdm: 0.18, aum: 800, dividendYield: 4.8, description: 'ETF do Banco do Brasil que replica o Ibovespa' },
  'XBOV11.SA': { name: 'Caixa Ibovespa', category: 'Índice Brasil', categoryIcon: Building2, benchmark: 'Ibovespa', taxaAdm: 0.15, aum: 600, dividendYield: 4.9, description: 'ETF da Caixa que replica o Ibovespa' },
  
  // Small Caps
  'SMAL11.SA': { name: 'iShares Small Cap', category: 'Small Caps', categoryIcon: Zap, benchmark: 'SMLL', taxaAdm: 0.50, aum: 2800, dividendYield: 3.5, description: 'Investe em empresas de menor capitalização com alto potencial de crescimento' },
  'SMAC11.SA': { name: 'It Now Small Cap', category: 'Small Caps', categoryIcon: Zap, benchmark: 'SMLL', taxaAdm: 0.50, aum: 450, dividendYield: 3.2, description: 'ETF do Itaú focado em small caps brasileiras' },
  
  // Dividendos
  'DIVO11.SA': { name: 'It Now Dividendos', category: 'Dividendos', categoryIcon: DollarSign, benchmark: 'IDIV', taxaAdm: 0.50, aum: 3200, dividendYield: 8.5, description: 'Foca em empresas pagadoras de dividendos consistentes' },
  'BBSD11.SA': { name: 'BB Dividendos', category: 'Dividendos', categoryIcon: DollarSign, benchmark: 'IDIV', taxaAdm: 0.50, aum: 280, dividendYield: 8.2, description: 'ETF do BB focado em ações de dividendos' },
  
  // Internacional
  'IVVB11.SA': { name: 'iShares S&P 500', category: 'Internacional', categoryIcon: Globe, benchmark: 'S&P 500', taxaAdm: 0.23, aum: 8500, dividendYield: 1.5, description: 'Exposição às 500 maiores empresas americanas' },
  'SPXI11.SA': { name: 'It Now S&P 500', category: 'Internacional', categoryIcon: Globe, benchmark: 'S&P 500', taxaAdm: 0.21, aum: 1200, dividendYield: 1.4, description: 'ETF do Itaú que replica o S&P 500' },
  'NASD11.SA': { name: 'Trend NASDAQ', category: 'Internacional', categoryIcon: Globe, benchmark: 'NASDAQ-100', taxaAdm: 0.30, aum: 850, dividendYield: 0.5, description: 'Exposição às maiores empresas de tecnologia americanas' },
  'EURP11.SA': { name: 'Trend Europa', category: 'Internacional', categoryIcon: Globe, benchmark: 'MSCI Europe', taxaAdm: 0.30, aum: 320, dividendYield: 2.8, description: 'Exposição às maiores empresas europeias' },
  'XINA11.SA': { name: 'Trend China', category: 'Internacional', categoryIcon: Globe, benchmark: 'MSCI China', taxaAdm: 0.30, aum: 280, dividendYield: 1.2, description: 'Exposição às maiores empresas chinesas' },
  'ACWI11.SA': { name: 'Trend Global', category: 'Internacional', categoryIcon: Globe, benchmark: 'MSCI ACWI', taxaAdm: 0.30, aum: 420, dividendYield: 1.8, description: 'Exposição global diversificada em mercados desenvolvidos e emergentes' },
  
  // Criptomoedas
  'HASH11.SA': { name: 'Hashdex Crypto', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'NCI', taxaAdm: 1.30, aum: 2200, dividendYield: 0, description: 'Exposição diversificada às principais criptomoedas' },
  'BITH11.SA': { name: 'Hashdex Bitcoin', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'Bitcoin', taxaAdm: 0.70, aum: 1800, dividendYield: 0, description: 'Exposição 100% ao Bitcoin' },
  'ETHE11.SA': { name: 'Hashdex Ethereum', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'Ethereum', taxaAdm: 0.70, aum: 650, dividendYield: 0, description: 'Exposição 100% ao Ethereum' },
  'QBTC11.SA': { name: 'QR Bitcoin', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'Bitcoin', taxaAdm: 0.75, aum: 520, dividendYield: 0, description: 'ETF de Bitcoin da QR Asset' },
  'QETH11.SA': { name: 'QR Ethereum', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'Ethereum', taxaAdm: 0.75, aum: 180, dividendYield: 0, description: 'ETF de Ethereum da QR Asset' },
  'DEFI11.SA': { name: 'Hashdex DeFi', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'CF DeFi', taxaAdm: 1.30, aum: 120, dividendYield: 0, description: 'Exposição ao setor de finanças descentralizadas' },
  'WEB311.SA': { name: 'Hashdex Web3', category: 'Criptomoedas', categoryIcon: Bitcoin, benchmark: 'CF Web3', taxaAdm: 1.30, aum: 85, dividendYield: 0, description: 'Exposição a projetos Web3 e metaverso' },
  
  // Setoriais
  'FIND11.SA': { name: 'It Now Financeiro', category: 'Setorial', categoryIcon: Briefcase, benchmark: 'IFNC', taxaAdm: 0.50, aum: 380, dividendYield: 6.5, description: 'Foca no setor financeiro brasileiro (bancos, seguradoras)' },
  'MATB11.SA': { name: 'It Now Materiais', category: 'Setorial', categoryIcon: Briefcase, benchmark: 'IMAT', taxaAdm: 0.50, aum: 220, dividendYield: 4.2, description: 'Foca em empresas de materiais básicos (mineração, siderurgia)' },
  'UTIP11.SA': { name: 'It Now Utilities', category: 'Setorial', categoryIcon: Briefcase, benchmark: 'UTIL', taxaAdm: 0.50, aum: 180, dividendYield: 7.8, description: 'Foca em empresas de utilidade pública (energia, saneamento)' },
  'TECK11.SA': { name: 'It Now Tech', category: 'Setorial', categoryIcon: Briefcase, benchmark: 'Tech BR', taxaAdm: 0.50, aum: 150, dividendYield: 1.2, description: 'Foca em empresas de tecnologia brasileiras' },
  
  // Renda Fixa
  'IMAB11.SA': { name: 'It Now IMA-B', category: 'Renda Fixa', categoryIcon: Shield, benchmark: 'IMA-B', taxaAdm: 0.25, aum: 4500, dividendYield: 0, description: 'Títulos públicos indexados à inflação (NTN-B)' },
  'IRFM11.SA': { name: 'It Now IRF-M', category: 'Renda Fixa', categoryIcon: Shield, benchmark: 'IRF-M', taxaAdm: 0.20, aum: 1200, dividendYield: 0, description: 'Títulos públicos prefixados (LTN e NTN-F)' },
  'FIXA11.SA': { name: 'Mirae CDI', category: 'Renda Fixa', categoryIcon: Shield, benchmark: 'CDI', taxaAdm: 0.30, aum: 850, dividendYield: 0, description: 'Títulos de renda fixa atrelados ao CDI' },
  'B5P211.SA': { name: 'It Now IMA-B5+', category: 'Renda Fixa', categoryIcon: Shield, benchmark: 'IMA-B 5+', taxaAdm: 0.20, aum: 2800, dividendYield: 0, description: 'NTN-Bs com vencimento acima de 5 anos' },
  
  // ESG
  'ISUS11.SA': { name: 'It Now ISE', category: 'ESG', categoryIcon: Target, benchmark: 'ISE', taxaAdm: 0.40, aum: 280, dividendYield: 4.5, description: 'Empresas com melhores práticas de sustentabilidade' },
  'ESGB11.SA': { name: 'BTG ESG', category: 'ESG', categoryIcon: Target, benchmark: 'S&P/B3 ESG', taxaAdm: 0.35, aum: 180, dividendYield: 4.2, description: 'Empresas brasileiras com boas práticas ESG' },
};

const CATEGORIES = [
  { value: 'all', label: 'Todas as Categorias', icon: Layers },
  { value: 'Índice Brasil', label: 'Índice Brasil', icon: Building2 },
  { value: 'Small Caps', label: 'Small Caps', icon: Zap },
  { value: 'Dividendos', label: 'Dividendos', icon: DollarSign },
  { value: 'Internacional', label: 'Internacional', icon: Globe },
  { value: 'Criptomoedas', label: 'Criptomoedas', icon: Bitcoin },
  { value: 'Setorial', label: 'Setorial', icon: Briefcase },
  { value: 'Renda Fixa', label: 'Renda Fixa', icon: Shield },
  { value: 'ESG', label: 'ESG', icon: Target },
];

type SortOption = 'aum' | 'taxaAdm' | 'dividendYield' | 'price';

export default function ETFs() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('aum');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [selectedETF, setSelectedETF] = useState<string | null>(null);

  // Buscar cotações dos ETFs
  const etfTickers = Object.keys(ETF_DATA);
  
  const quotesQueries = etfTickers.map(ticker => 
    trpc.assets.getQuote.useQuery(
      { ticker },
      { refetchInterval: 60000, staleTime: 30000 }
    )
  );
  
  const isLoading = quotesQueries.some(q => q.isLoading);

  // Combinar dados estáticos com cotações
  const etfsWithQuotes = useMemo(() => {
    return etfTickers.map((ticker, index) => {
      const staticData = ETF_DATA[ticker];
      const quoteData = quotesQueries[index]?.data;
      
      return {
        ticker,
        ...staticData,
        price: quoteData?.price || 0,
        change: quoteData?.change || 0,
        changePercent: quoteData?.change || 0,
        volume: quoteData?.volume || 0,
        dataSource: quoteData?.dataSource || 'loading',
      };
    });
  }, [quotesQueries.map(q => q.data)]);

  // Filtrar e ordenar
  const filteredETFs = useMemo(() => {
    let result = etfsWithQuotes;

    if (category !== 'all') {
      result = result.filter(etf => etf.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(etf => 
        etf.ticker.toLowerCase().includes(searchLower) ||
        etf.name.toLowerCase().includes(searchLower) ||
        etf.benchmark.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let valueA: number, valueB: number;
      
      switch (sortBy) {
        case 'aum':
          valueA = a.aum;
          valueB = b.aum;
          break;
        case 'taxaAdm':
          valueA = a.taxaAdm;
          valueB = b.taxaAdm;
          break;
        case 'dividendYield':
          valueA = a.dividendYield;
          valueB = b.dividendYield;
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        default:
          valueA = a.aum;
          valueB = b.aum;
      }

      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
    });

    return result;
  }, [etfsWithQuotes, category, search, sortBy, sortOrder]);

  // Estatísticas da categoria
  const categoryStats = useMemo(() => {
    const etfs = category === 'all' ? etfsWithQuotes : etfsWithQuotes.filter(e => e.category === category);
    
    if (etfs.length === 0) return null;

    const totalAUM = etfs.reduce((sum, e) => sum + e.aum, 0);
    const avgTaxa = etfs.reduce((sum, e) => sum + e.taxaAdm, 0) / etfs.length;
    const avgDY = etfs.filter(e => e.dividendYield > 0).reduce((sum, e) => sum + e.dividendYield, 0) / etfs.filter(e => e.dividendYield > 0).length || 0;
    const positiveCount = etfs.filter(e => e.changePercent > 0).length;

    return {
      count: etfs.length,
      totalAUM,
      avgTaxa,
      avgDY,
      positiveCount,
    };
  }, [etfsWithQuotes, category]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-mono">{index + 1}</span>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatAUM = (value: number) => {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}B`;
    return `R$ ${value}M`;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">ETFs (Exchange Traded Funds)</h1>
        </div>
        <p className="text-muted-foreground">
          Invista de forma diversificada com baixo custo em índices, setores, criptomoedas e renda fixa
        </p>
      </div>

      {/* Estatísticas */}
      {categoryStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">ETFs</div>
              <div className="text-2xl font-bold">{categoryStats.count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">AUM Total</div>
              <div className="text-2xl font-bold">{formatAUM(categoryStats.totalAUM)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Taxa Média</div>
              <div className="text-2xl font-bold">{categoryStats.avgTaxa.toFixed(2)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">DY Médio</div>
              <div className="text-2xl font-bold text-green-500">{categoryStats.avgDY.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Em Alta</div>
              <div className="text-2xl font-bold text-green-500">{categoryStats.positiveCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticker, nome ou benchmark..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                <div className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aum">Patrimônio (AUM)</SelectItem>
            <SelectItem value="taxaAdm">Taxa de Adm.</SelectItem>
            <SelectItem value="dividendYield">Dividend Yield</SelectItem>
            <SelectItem value="price">Preço</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        >
          {sortOrder === 'desc' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
        </Button>
      </div>

      {/* Tabs por Categoria */}
      <Tabs value={category} onValueChange={setCategory} className="mb-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value} className="gap-1">
              <cat.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.value === 'all' ? 'Todos' : cat.value.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Lista de ETFs */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredETFs.map((etf, index) => {
            const CategoryIcon = etf.categoryIcon;
            const isSelected = selectedETF === etf.ticker;
            
            return (
              <Card 
                key={etf.ticker}
                className={`cursor-pointer transition-all hover:border-primary ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setSelectedETF(isSelected ? null : etf.ticker)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Ranking */}
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index)}
                    </div>

                    {/* Ícone */}
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CategoryIcon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Info Principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/ativo/${etf.ticker}`}>
                          <span className="font-bold text-lg hover:text-primary">
                            {etf.ticker.replace('.SA', '')}
                          </span>
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {etf.benchmark}
                        </Badge>
                        {etf.dataSource === 'fallback' && (
                          <Badge variant="secondary" className="text-xs">
                            Cache
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{etf.name}</p>
                    </div>

                    {/* Métricas Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Preço</div>
                        <div className="font-bold">{etf.price > 0 ? formatCurrency(etf.price) : '-'}</div>
                        <div className={`text-xs ${etf.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Taxa Adm.</div>
                        <div className={`font-bold ${etf.taxaAdm <= 0.30 ? 'text-green-500' : etf.taxaAdm >= 1.0 ? 'text-red-500' : ''}`}>
                          {etf.taxaAdm.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {etf.taxaAdm <= 0.30 ? 'Baixa' : etf.taxaAdm >= 1.0 ? 'Alta' : 'Média'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">DY</div>
                        <div className={`font-bold ${etf.dividendYield > 5 ? 'text-green-500' : ''}`}>
                          {etf.dividendYield > 0 ? `${etf.dividendYield.toFixed(1)}%` : '-'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">AUM</div>
                        <div className="font-bold">{formatAUM(etf.aum)}</div>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex flex-col items-end">
                      <div className="font-bold">{etf.price > 0 ? formatCurrency(etf.price) : '-'}</div>
                      <div className="text-xs text-muted-foreground">Taxa: {etf.taxaAdm.toFixed(2)}%</div>
                    </div>

                    <Link href={`/ativo/${etf.ticker}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Detalhes Expandidos */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-4">{etf.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Benchmark</div>
                          <div className="font-medium">{etf.benchmark}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Categoria</div>
                          <div className="font-medium">{etf.category}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Taxa de Administração</div>
                          <div className="font-medium">{etf.taxaAdm.toFixed(2)}% a.a.</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Patrimônio Líquido</div>
                          <div className="font-medium">{formatAUM(etf.aum)}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link href={`/ativo/${etf.ticker}`}>
                          <Button size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Ver Análise Completa
                          </Button>
                        </Link>
                        <Link href={`/comparador?tickers=${etf.ticker}`}>
                          <Button variant="outline" size="sm">
                            Comparar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Card Informativo */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sobre ETFs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                O que são ETFs?
              </h4>
              <p className="text-sm text-muted-foreground">
                ETFs são fundos negociados em bolsa que replicam índices, setores ou estratégias. 
                Oferecem diversificação instantânea com baixo custo e alta liquidez, sendo 
                ideais para investidores iniciantes e experientes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-500" />
                Taxa de Administração
              </h4>
              <p className="text-sm text-muted-foreground">
                A taxa de administração é cobrada anualmente sobre o patrimônio. ETFs de índice 
                costumam ter taxas baixas (0,10% a 0,30%), enquanto ETFs temáticos e de cripto 
                podem ter taxas mais altas (0,50% a 1,30%).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                AUM (Assets Under Management)
              </h4>
              <p className="text-sm text-muted-foreground">
                O patrimônio líquido indica o tamanho do fundo. ETFs maiores costumam ter 
                maior liquidez e menor spread entre compra e venda. Prefira ETFs com 
                patrimônio acima de R$ 100 milhões.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Dividend Yield
              </h4>
              <p className="text-sm text-muted-foreground">
                Alguns ETFs distribuem dividendos periodicamente. ETFs de dividendos (DIVO11) 
                e setoriais (UTIP11) costumam ter yields mais altos, enquanto ETFs de 
                crescimento e cripto não distribuem proventos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

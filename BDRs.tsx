import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  DollarSign, 
  BarChart3, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
  Building,
  ShoppingCart,
  Heart,
  Fuel,
  Factory,
  CreditCard,
  Info,
  Star,
  Crown,
  Medal,
  Trophy,
  Globe
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';

// Dados dos BDRs com informações detalhadas
const BDR_DATA: Record<string, {
  name: string;
  sector: string;
  sectorIcon: typeof Cpu;
  originalTicker: string;
  exchange: string;
  pe: number;
  dividendYield: number;
  description: string;
}> = {
  // Tecnologia
  'AAPL34.SA': { name: 'Apple', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'AAPL', exchange: 'NASDAQ', pe: 31.2, dividendYield: 0.5, description: 'Maior empresa de tecnologia do mundo, fabricante do iPhone, Mac e serviços' },
  'MSFT34.SA': { name: 'Microsoft', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'MSFT', exchange: 'NASDAQ', pe: 35.8, dividendYield: 0.8, description: 'Líder em software, cloud (Azure) e produtividade (Office 365)' },
  'GOGL34.SA': { name: 'Alphabet (Google)', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'GOOGL', exchange: 'NASDAQ', pe: 24.5, dividendYield: 0, description: 'Dona do Google, YouTube e líder em publicidade digital' },
  'AMZO34.SA': { name: 'Amazon', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'AMZN', exchange: 'NASDAQ', pe: 62.3, dividendYield: 0, description: 'Maior e-commerce do mundo e líder em cloud computing (AWS)' },
  'NVDC34.SA': { name: 'NVIDIA', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'NVDA', exchange: 'NASDAQ', pe: 65.8, dividendYield: 0.03, description: 'Líder em GPUs e chips para IA e data centers' },
  'META34.SA': { name: 'Meta (Facebook)', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'META', exchange: 'NASDAQ', pe: 28.5, dividendYield: 0.4, description: 'Dona do Facebook, Instagram, WhatsApp e investindo em metaverso' },
  'TSLA34.SA': { name: 'Tesla', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'TSLA', exchange: 'NASDAQ', pe: 72.5, dividendYield: 0, description: 'Líder em veículos elétricos e energia limpa' },
  'NFLX34.SA': { name: 'Netflix', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'NFLX', exchange: 'NASDAQ', pe: 45.5, dividendYield: 0, description: 'Maior plataforma de streaming de vídeo do mundo' },
  'ADBE34.SA': { name: 'Adobe', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'ADBE', exchange: 'NASDAQ', pe: 45.5, dividendYield: 0, description: 'Líder em software criativo (Photoshop, Premiere, Illustrator)' },
  'ORCL34.SA': { name: 'Oracle', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'ORCL', exchange: 'NYSE', pe: 28.5, dividendYield: 1.2, description: 'Líder em banco de dados e software empresarial' },
  'INTC34.SA': { name: 'Intel', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'INTC', exchange: 'NASDAQ', pe: 125.5, dividendYield: 1.5, description: 'Fabricante de processadores e semicondutores' },
  'QCOM34.SA': { name: 'Qualcomm', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'QCOM', exchange: 'NASDAQ', pe: 18.5, dividendYield: 2.0, description: 'Líder em chips para smartphones e 5G' },
  'A1MD34.SA': { name: 'AMD', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'AMD', exchange: 'NASDAQ', pe: 285.5, dividendYield: 0, description: 'Fabricante de processadores e GPUs, concorrente da Intel e NVIDIA' },
  'AVGO34.SA': { name: 'Broadcom', sector: 'Tecnologia', sectorIcon: Cpu, originalTicker: 'AVGO', exchange: 'NASDAQ', pe: 32.5, dividendYield: 1.8, description: 'Fabricante de semicondutores para infraestrutura' },
  
  // Bancos e Financeiras
  'JPMC34.SA': { name: 'JPMorgan Chase', sector: 'Financeiro', sectorIcon: Building, originalTicker: 'JPM', exchange: 'NYSE', pe: 10.5, dividendYield: 2.3, description: 'Maior banco dos EUA por ativos' },
  'BOAC34.SA': { name: 'Bank of America', sector: 'Financeiro', sectorIcon: Building, originalTicker: 'BAC', exchange: 'NYSE', pe: 10.5, dividendYield: 2.5, description: 'Segundo maior banco dos EUA' },
  'GSGI34.SA': { name: 'Goldman Sachs', sector: 'Financeiro', sectorIcon: Building, originalTicker: 'GS', exchange: 'NYSE', pe: 12.5, dividendYield: 2.5, description: 'Banco de investimento líder global' },
  'MSBR34.SA': { name: 'Morgan Stanley', sector: 'Financeiro', sectorIcon: Building, originalTicker: 'MS', exchange: 'NYSE', pe: 14.5, dividendYield: 3.2, description: 'Banco de investimento e gestão de patrimônio' },
  'VISA34.SA': { name: 'Visa', sector: 'Financeiro', sectorIcon: CreditCard, originalTicker: 'V', exchange: 'NYSE', pe: 28.5, dividendYield: 0.8, description: 'Maior rede de pagamentos do mundo' },
  'MSCD34.SA': { name: 'Mastercard', sector: 'Financeiro', sectorIcon: CreditCard, originalTicker: 'MA', exchange: 'NYSE', pe: 35.5, dividendYield: 0.6, description: 'Segunda maior rede de pagamentos do mundo' },
  'AXPB34.SA': { name: 'American Express', sector: 'Financeiro', sectorIcon: CreditCard, originalTicker: 'AXP', exchange: 'NYSE', pe: 18.5, dividendYield: 1.2, description: 'Empresa de cartões de crédito premium' },
  'PYPL34.SA': { name: 'PayPal', sector: 'Financeiro', sectorIcon: CreditCard, originalTicker: 'PYPL', exchange: 'NASDAQ', pe: 18.5, dividendYield: 0, description: 'Líder em pagamentos digitais' },
  
  // Consumo e Varejo
  'COCA34.SA': { name: 'Coca-Cola', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'KO', exchange: 'NYSE', pe: 24.5, dividendYield: 3.0, description: 'Maior empresa de bebidas do mundo' },
  'PEPB34.SA': { name: 'PepsiCo', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'PEP', exchange: 'NASDAQ', pe: 26.5, dividendYield: 2.8, description: 'Bebidas e snacks (Pepsi, Doritos, Lay\'s)' },
  'MCDC34.SA': { name: 'McDonald\'s', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'MCD', exchange: 'NYSE', pe: 25.5, dividendYield: 2.2, description: 'Maior rede de fast food do mundo' },
  'SBUB34.SA': { name: 'Starbucks', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'SBUX', exchange: 'NASDAQ', pe: 28.5, dividendYield: 2.5, description: 'Maior rede de cafeterias do mundo' },
  'NIKE34.SA': { name: 'Nike', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'NKE', exchange: 'NYSE', pe: 28.5, dividendYield: 1.5, description: 'Maior marca de artigos esportivos do mundo' },
  'WALM34.SA': { name: 'Walmart', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'WMT', exchange: 'NYSE', pe: 28.5, dividendYield: 1.4, description: 'Maior varejista do mundo' },
  'HOME34.SA': { name: 'Home Depot', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'HD', exchange: 'NYSE', pe: 22.5, dividendYield: 2.5, description: 'Maior varejista de materiais de construção' },
  'COST34.SA': { name: 'Costco', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'COST', exchange: 'NASDAQ', pe: 48.5, dividendYield: 0.6, description: 'Rede de atacado por assinatura' },
  'DISB34.SA': { name: 'Disney', sector: 'Consumo', sectorIcon: ShoppingCart, originalTicker: 'DIS', exchange: 'NYSE', pe: 65.5, dividendYield: 0, description: 'Maior empresa de entretenimento do mundo' },
  
  // Saúde e Farmacêuticas
  'JNJB34.SA': { name: 'Johnson & Johnson', sector: 'Saúde', sectorIcon: Heart, originalTicker: 'JNJ', exchange: 'NYSE', pe: 15.8, dividendYield: 3.0, description: 'Maior empresa de saúde do mundo' },
  'PFIZ34.SA': { name: 'Pfizer', sector: 'Saúde', sectorIcon: Heart, originalTicker: 'PFE', exchange: 'NYSE', pe: 12.5, dividendYield: 5.8, description: 'Uma das maiores farmacêuticas do mundo' },
  'MRCK34.SA': { name: 'Merck', sector: 'Saúde', sectorIcon: Heart, originalTicker: 'MRK', exchange: 'NYSE', pe: 15.5, dividendYield: 2.5, description: 'Farmacêutica líder em oncologia e vacinas' },
  'ABBV34.SA': { name: 'AbbVie', sector: 'Saúde', sectorIcon: Heart, originalTicker: 'ABBV', exchange: 'NYSE', pe: 22.5, dividendYield: 3.8, description: 'Farmacêutica focada em imunologia' },
  'LILY34.SA': { name: 'Eli Lilly', sector: 'Saúde', sectorIcon: Heart, originalTicker: 'LLY', exchange: 'NYSE', pe: 85.5, dividendYield: 0.7, description: 'Farmacêutica líder em diabetes e obesidade' },
  'UNHH34.SA': { name: 'UnitedHealth', sector: 'Saúde', sectorIcon: Heart, originalTicker: 'UNH', exchange: 'NYSE', pe: 22.5, dividendYield: 1.4, description: 'Maior empresa de saúde dos EUA' },
  
  // Energia e Petróleo
  'EXXO34.SA': { name: 'ExxonMobil', sector: 'Energia', sectorIcon: Fuel, originalTicker: 'XOM', exchange: 'NYSE', pe: 12.5, dividendYield: 3.3, description: 'Maior empresa de petróleo dos EUA' },
  'CHVX34.SA': { name: 'Chevron', sector: 'Energia', sectorIcon: Fuel, originalTicker: 'CVX', exchange: 'NYSE', pe: 11.5, dividendYield: 4.0, description: 'Segunda maior petroleira dos EUA' },
  
  // Industrial e Aeroespacial
  'BERK34.SA': { name: 'Berkshire Hathaway', sector: 'Industrial', sectorIcon: Factory, originalTicker: 'BRK.B', exchange: 'NYSE', pe: 9.2, dividendYield: 0, description: 'Conglomerado de Warren Buffett' },
  'CATP34.SA': { name: 'Caterpillar', sector: 'Industrial', sectorIcon: Factory, originalTicker: 'CAT', exchange: 'NYSE', pe: 15.5, dividendYield: 1.6, description: 'Líder em equipamentos de construção' },
  'GEOO34.SA': { name: 'General Electric', sector: 'Industrial', sectorIcon: Factory, originalTicker: 'GE', exchange: 'NYSE', pe: 18.5, dividendYield: 0.3, description: 'Conglomerado industrial diversificado' },
  'HONB34.SA': { name: 'Honeywell', sector: 'Industrial', sectorIcon: Factory, originalTicker: 'HON', exchange: 'NASDAQ', pe: 22.5, dividendYield: 2.0, description: 'Conglomerado de tecnologia industrial' },
  'IBMB34.SA': { name: 'IBM', sector: 'Industrial', sectorIcon: Factory, originalTicker: 'IBM', exchange: 'NYSE', pe: 22.5, dividendYield: 4.5, description: 'Empresa de tecnologia e consultoria' },
  'BOEI34.SA': { name: 'Boeing', sector: 'Industrial', sectorIcon: Factory, originalTicker: 'BA', exchange: 'NYSE', pe: 0, dividendYield: 0, description: 'Maior fabricante de aviões do mundo' },
  
  // Cripto e Fintech
  'COIN34.SA': { name: 'Coinbase', sector: 'Cripto', sectorIcon: Globe, originalTicker: 'COIN', exchange: 'NASDAQ', pe: 0, dividendYield: 0, description: 'Maior exchange de criptomoedas dos EUA' },
};

const SECTORS = [
  { value: 'all', label: 'Todos os Setores', icon: Globe },
  { value: 'Tecnologia', label: 'Tecnologia', icon: Cpu },
  { value: 'Financeiro', label: 'Financeiro', icon: Building },
  { value: 'Consumo', label: 'Consumo e Varejo', icon: ShoppingCart },
  { value: 'Saúde', label: 'Saúde', icon: Heart },
  { value: 'Energia', label: 'Energia', icon: Fuel },
  { value: 'Industrial', label: 'Industrial', icon: Factory },
  { value: 'Cripto', label: 'Cripto e Fintech', icon: Globe },
];

type SortOption = 'pe' | 'dividendYield' | 'price' | 'change';

export default function BDRs() {
  const [sector, setSector] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [selectedBDR, setSelectedBDR] = useState<string | null>(null);

  // Buscar cotações dos BDRs
  const bdrTickers = Object.keys(BDR_DATA);
  
  // Buscar cotações de todos os BDRs usando queries individuais
  const quotesQueries = bdrTickers.map(ticker => 
    trpc.assets.getQuote.useQuery(
      { ticker },
      { refetchInterval: 60000, staleTime: 30000 }
    )
  );
  
  const isLoading = quotesQueries.some(q => q.isLoading);

  // Combinar dados estáticos com cotações
  const bdrsWithQuotes = useMemo(() => {
    return bdrTickers.map((ticker, index) => {
      const staticData = BDR_DATA[ticker];
      const quoteData = quotesQueries[index]?.data;
      
      return {
        ticker,
        ...staticData,
        price: quoteData?.price || 0,
        change: quoteData?.change || 0,
        changePercent: quoteData?.change || 0,
        volume: quoteData?.volume || 0,
        marketCap: quoteData?.marketCap || 0,
        dataSource: quoteData?.dataSource || 'loading',
      };
    });
  }, [quotesQueries.map(q => q.data)]);

  // Filtrar e ordenar
  const filteredBDRs = useMemo(() => {
    let result = bdrsWithQuotes;

    // Filtrar por setor
    if (sector !== 'all') {
      result = result.filter(bdr => bdr.sector === sector);
    }

    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(bdr => 
        bdr.ticker.toLowerCase().includes(searchLower) ||
        bdr.name.toLowerCase().includes(searchLower) ||
        bdr.originalTicker.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar
    result.sort((a, b) => {
      let valueA: number, valueB: number;
      
      switch (sortBy) {
        case 'pe':
          valueA = a.pe || 0;
          valueB = b.pe || 0;
          break;
        case 'dividendYield':
          valueA = a.dividendYield;
          valueB = b.dividendYield;
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'change':
          valueA = a.changePercent;
          valueB = b.changePercent;
          break;
        default:
          valueA = a.price;
          valueB = b.price;
      }

      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
    });

    return result;
  }, [bdrsWithQuotes, sector, search, sortBy, sortOrder]);

  // Estatísticas do setor
  const sectorStats = useMemo(() => {
    const bdrs = sector === 'all' ? bdrsWithQuotes : bdrsWithQuotes.filter(b => b.sector === sector);
    
    if (bdrs.length === 0) return null;

    const avgPE = bdrs.filter(b => b.pe > 0).reduce((sum, b) => sum + b.pe, 0) / bdrs.filter(b => b.pe > 0).length || 0;
    const avgDY = bdrs.reduce((sum, b) => sum + b.dividendYield, 0) / bdrs.length;
    const positiveCount = bdrs.filter(b => b.changePercent > 0).length;
    const negativeCount = bdrs.filter(b => b.changePercent < 0).length;
    const bestPerformer = bdrs.reduce((best, b) => b.changePercent > best.changePercent ? b : best, bdrs[0]);

    return {
      count: bdrs.length,
      avgPE,
      avgDY,
      positiveCount,
      negativeCount,
      bestPerformer,
    };
  }, [bdrsWithQuotes, sector]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-mono">{index + 1}</span>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Landmark className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">BDRs (Brazilian Depositary Receipts)</h1>
        </div>
        <p className="text-muted-foreground">
          Invista em empresas globais como Apple, Microsoft, Amazon e Google diretamente na B3
        </p>
      </div>

      {/* Estatísticas do Setor */}
      {sectorStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">BDRs</div>
              <div className="text-2xl font-bold">{sectorStats.count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">P/L Médio</div>
              <div className="text-2xl font-bold">{sectorStats.avgPE.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">DY Médio</div>
              <div className="text-2xl font-bold text-green-500">{sectorStats.avgDY.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Em Alta</div>
              <div className="text-2xl font-bold text-green-500">{sectorStats.positiveCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Destaque</div>
              <div className="text-lg font-bold text-green-500">
                {sectorStats.bestPerformer.ticker.replace('.SA', '')}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
            {SECTORS.map(sec => (
              <SelectItem key={sec.value} value={sec.value}>
                <div className="flex items-center gap-2">
                  <sec.icon className="h-4 w-4" />
                  {sec.label}
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
            <SelectItem value="price">Preço</SelectItem>
            <SelectItem value="change">Variação</SelectItem>
            <SelectItem value="pe">P/L</SelectItem>
            <SelectItem value="dividendYield">Dividend Yield</SelectItem>
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

      {/* Tabs por Setor */}
      <Tabs value={sector} onValueChange={setSector} className="mb-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {SECTORS.map(sec => (
            <TabsTrigger key={sec.value} value={sec.value} className="gap-1">
              <sec.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{sec.label}</span>
              <span className="sm:hidden">{sec.value === 'all' ? 'Todos' : sec.value}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Lista de BDRs */}
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
          filteredBDRs.map((bdr, index) => {
            const SectorIcon = bdr.sectorIcon;
            const isSelected = selectedBDR === bdr.ticker;
            
            return (
              <Card 
                key={bdr.ticker}
                className={`cursor-pointer transition-all hover:border-primary ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setSelectedBDR(isSelected ? null : bdr.ticker)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Ranking */}
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index)}
                    </div>

                    {/* Ícone do Setor */}
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <SectorIcon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Info Principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/ativo/${bdr.ticker}`}>
                          <span className="font-bold text-lg hover:text-primary">
                            {bdr.ticker.replace('.SA', '')}
                          </span>
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {bdr.originalTicker}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {bdr.exchange}
                        </Badge>
                        {bdr.dataSource === 'fallback' && (
                          <Badge variant="secondary" className="text-xs">
                            Cache
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{bdr.name}</p>
                    </div>

                    {/* Métricas */}
                    <div className="hidden md:flex items-center gap-6">
                      {/* Preço */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Preço</div>
                        <div className="font-bold">{formatCurrency(bdr.price)}</div>
                        <div className={`text-xs ${bdr.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {bdr.changePercent >= 0 ? '+' : ''}{bdr.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      {/* P/L */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">P/L</div>
                        <div className="font-bold">{bdr.pe > 0 ? bdr.pe.toFixed(1) : 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">
                          {bdr.pe > 0 && bdr.pe < 15 ? 'Barato' : bdr.pe > 30 ? 'Caro' : 'Justo'}
                        </div>
                      </div>

                      {/* DY */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">DY</div>
                        <div className={`font-bold ${bdr.dividendYield > 2 ? 'text-green-500' : ''}`}>
                          {bdr.dividendYield.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {bdr.dividendYield > 0 ? 'Paga dividendos' : 'Não paga'}
                        </div>
                      </div>

                      {/* Setor */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Setor</div>
                        <div className="font-bold">{bdr.sector}</div>
                      </div>
                    </div>

                    {/* Mobile Metrics */}
                    <div className="md:hidden flex flex-col items-end">
                      <div className="font-bold">{formatCurrency(bdr.price)}</div>
                      <div className={`text-sm ${bdr.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bdr.changePercent >= 0 ? '+' : ''}{bdr.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Ação */}
                    <Link href={`/ativo/${bdr.ticker}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Detalhes Expandidos */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-4">{bdr.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Ticker Original</div>
                          <div className="font-medium">{bdr.originalTicker}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Bolsa</div>
                          <div className="font-medium">{bdr.exchange}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Volume</div>
                          <div className="font-medium">{formatVolume(bdr.volume)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Setor</div>
                          <div className="font-medium">{bdr.sector}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link href={`/ativo/${bdr.ticker}`}>
                          <Button size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Ver Análise Completa
                          </Button>
                        </Link>
                        <Link href={`/comparador?tickers=${bdr.ticker}`}>
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
            Sobre BDRs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                O que são BDRs?
              </h4>
              <p className="text-sm text-muted-foreground">
                BDRs (Brazilian Depositary Receipts) são certificados que representam ações 
                de empresas estrangeiras negociados na B3. Permitem investir em gigantes 
                globais como Apple, Google e Amazon sem precisar abrir conta no exterior.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Vantagens
              </h4>
              <p className="text-sm text-muted-foreground">
                Diversificação internacional, exposição ao dólar, acesso a empresas líderes 
                mundiais, negociação em reais na B3, sem necessidade de conta no exterior 
                e tributação simplificada.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Percent className="h-4 w-4 text-purple-500" />
                P/L (Preço/Lucro)
              </h4>
              <p className="text-sm text-muted-foreground">
                Indica quantos anos de lucro seriam necessários para pagar o preço da ação. 
                P/L baixo pode indicar ação barata, mas também pode refletir problemas. 
                Empresas de tecnologia costumam ter P/L mais alto.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Dividend Yield
              </h4>
              <p className="text-sm text-muted-foreground">
                Retorno anual em dividendos em relação ao preço. Empresas maduras como 
                Coca-Cola e J&J pagam dividendos consistentes, enquanto empresas de 
                crescimento como Amazon e Tesla reinvestem os lucros.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

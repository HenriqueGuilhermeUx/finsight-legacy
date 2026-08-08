import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PieChartComponent from '@/components/PieChart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { 
  Briefcase, 
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  DollarSign,
  Percent,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Download,
  Share2,
  Calculator,
  Wallet,
  Building2,
  Layers,
  Landmark,
  Save,
  FolderOpen,
  Loader2,
  LogIn,
  LineChart,
  History
} from 'lucide-react';

// Cores para gráficos
const CHART_COLORS = [
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#ec4899", // pink
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
];

const TYPE_COLORS: Record<string, string> = {
  acao: "#06b6d4",
  fii: "#8b5cf6",
  etf: "#f59e0b",
  bdr: "#10b981",
};

// Dados de ativos disponíveis
const AVAILABLE_ASSETS: Record<string, { name: string; price: number; type: 'acao' | 'fii' | 'etf' | 'bdr'; sector: string; dy: number; beta: number }> = {
  // Ações
  'PETR4': { name: 'Petrobras', price: 36.80, type: 'acao', sector: 'Petróleo', dy: 18.5, beta: 1.3 },
  'VALE3': { name: 'Vale', price: 62.50, type: 'acao', sector: 'Mineração', dy: 8.2, beta: 1.2 },
  'ITUB4': { name: 'Itaú Unibanco', price: 32.45, type: 'acao', sector: 'Financeiro', dy: 6.2, beta: 0.9 },
  'BBAS3': { name: 'Banco do Brasil', price: 54.20, type: 'acao', sector: 'Financeiro', dy: 9.8, beta: 1.0 },
  'WEGE3': { name: 'WEG', price: 52.80, type: 'acao', sector: 'Industrial', dy: 1.5, beta: 0.8 },
  'ABEV3': { name: 'Ambev', price: 12.50, type: 'acao', sector: 'Consumo', dy: 5.5, beta: 0.7 },
  'RENT3': { name: 'Localiza', price: 42.80, type: 'acao', sector: 'Aluguel de Carros', dy: 2.5, beta: 1.1 },
  'EGIE3': { name: 'Engie Brasil', price: 42.50, type: 'acao', sector: 'Energia', dy: 8.5, beta: 0.6 },
  'TAEE11': { name: 'Taesa', price: 35.20, type: 'acao', sector: 'Energia', dy: 10.5, beta: 0.5 },
  'BBSE3': { name: 'BB Seguridade', price: 34.80, type: 'acao', sector: 'Seguros', dy: 9.2, beta: 0.8 },
  // FIIs
  'HGLG11': { name: 'CSHG Logística', price: 158.50, type: 'fii', sector: 'Logística', dy: 8.5, beta: 0.4 },
  'XPML11': { name: 'XP Malls', price: 95.20, type: 'fii', sector: 'Shopping', dy: 9.2, beta: 0.5 },
  'KNRI11': { name: 'Kinea Renda', price: 135.80, type: 'fii', sector: 'Híbrido', dy: 8.8, beta: 0.4 },
  'MXRF11': { name: 'Maxi Renda', price: 10.25, type: 'fii', sector: 'CRI', dy: 12.5, beta: 0.3 },
  'VISC11': { name: 'Vinci Shopping', price: 108.50, type: 'fii', sector: 'Shopping', dy: 8.9, beta: 0.5 },
  // ETFs
  'BOVA11': { name: 'iShares Ibovespa', price: 128.50, type: 'etf', sector: 'Índice Brasil', dy: 0, beta: 1.0 },
  'IVVB11': { name: 'iShares S&P 500', price: 285.20, type: 'etf', sector: 'Índice EUA', dy: 0, beta: 0.8 },
  'SMAL11': { name: 'iShares Small Cap', price: 98.50, type: 'etf', sector: 'Small Caps', dy: 0, beta: 1.3 },
  'HASH11': { name: 'Hashdex Crypto', price: 45.80, type: 'etf', sector: 'Cripto', dy: 0, beta: 2.5 },
  // BDRs
  'AAPL34': { name: 'Apple', price: 52.30, type: 'bdr', sector: 'Tecnologia', dy: 0.5, beta: 1.2 },
  'MSFT34': { name: 'Microsoft', price: 48.50, type: 'bdr', sector: 'Tecnologia', dy: 0.8, beta: 1.0 },
  'AMZO34': { name: 'Amazon', price: 38.20, type: 'bdr', sector: 'Tecnologia', dy: 0, beta: 1.3 },
  'GOGL34': { name: 'Alphabet', price: 62.80, type: 'bdr', sector: 'Tecnologia', dy: 0, beta: 1.1 },
};

interface PortfolioItem {
  ticker: string;
  quantity: number;
  avgPrice: number;
}

export default function SimuladorCarteira() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [portfolioName, setPortfolioName] = useState('Minha Carteira');
  
  const [newTicker, setNewTicker] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newAvgPrice, setNewAvgPrice] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [targetYears, setTargetYears] = useState(10);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  // tRPC queries and mutations
  const { data: savedPortfolios, refetch: refetchPortfolios } = trpc.simulatedPortfolio.list.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const createPortfolio = trpc.simulatedPortfolio.create.useMutation({
    onSuccess: (data) => {
      setSelectedPortfolioId(data.id);
      refetchPortfolios();
      setShowSaveDialog(false);
      alert('Carteira salva com sucesso!');
    },
  });

  const addAssetMutation = trpc.simulatedPortfolio.addAsset.useMutation({
    onSuccess: () => refetchPortfolios(),
  });

  const removeAssetMutation = trpc.simulatedPortfolio.removeAsset.useMutation({
    onSuccess: () => refetchPortfolios(),
  });

  const deletePortfolio = trpc.simulatedPortfolio.delete.useMutation({
    onSuccess: () => {
      setSelectedPortfolioId(null);
      setPortfolio([]);
      setPortfolioName('Minha Carteira');
      refetchPortfolios();
    },
  });

  const { data: loadedPortfolio } = trpc.simulatedPortfolio.get.useQuery(
    { id: selectedPortfolioId! },
    { enabled: !!selectedPortfolioId && !!user }
  );

  // Load portfolio from database when selected
  useEffect(() => {
    if (loadedPortfolio) {
      setPortfolioName(loadedPortfolio.portfolio.name);
      setPortfolio(loadedPortfolio.assets.map(a => ({
        ticker: a.ticker,
        quantity: Number(a.quantity),
        avgPrice: Number(a.averagePrice),
      })));
    }
  }, [loadedPortfolio]);

  // Initialize with demo data if not logged in
  useEffect(() => {
    if (!user && !authLoading && portfolio.length === 0) {
      setPortfolio([
        { ticker: 'PETR4', quantity: 100, avgPrice: 35.00 },
        { ticker: 'ITUB4', quantity: 200, avgPrice: 30.00 },
        { ticker: 'HGLG11', quantity: 50, avgPrice: 155.00 },
        { ticker: 'BOVA11', quantity: 30, avgPrice: 125.00 },
      ]);
    }
  }, [user, authLoading]);

  // Cálculos da carteira
  const portfolioAnalysis = useMemo(() => {
    let totalInvested = 0;
    let totalCurrent = 0;
    let totalDividends = 0;
    let weightedBeta = 0;

    const items = portfolio.map(item => {
      const asset = AVAILABLE_ASSETS[item.ticker];
      if (!asset) return null;

      const invested = item.quantity * item.avgPrice;
      const current = item.quantity * asset.price;
      const profit = current - invested;
      const profitPercent = (profit / invested) * 100;
      const annualDividend = current * (asset.dy / 100);

      totalInvested += invested;
      totalCurrent += current;
      totalDividends += annualDividend;

      return {
        ...item,
        asset,
        invested,
        current,
        profit,
        profitPercent,
        annualDividend,
      };
    }).filter(Boolean);

    // Calcular peso e beta ponderado
    items.forEach(item => {
      if (item) {
        const weight = item.current / totalCurrent;
        weightedBeta += weight * item.asset.beta;
      }
    });

    const totalProfit = totalCurrent - totalInvested;
    const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    const avgDY = totalCurrent > 0 ? (totalDividends / totalCurrent) * 100 : 0;

    // Distribuição por tipo
    const byType: Record<string, number> = {};
    const bySector: Record<string, number> = {};
    
    items.forEach(item => {
      if (item) {
        byType[item.asset.type] = (byType[item.asset.type] || 0) + item.current;
        bySector[item.asset.sector] = (bySector[item.asset.sector] || 0) + item.current;
      }
    });

    return {
      items,
      totalInvested,
      totalCurrent,
      totalProfit,
      totalProfitPercent,
      totalDividends,
      avgDY,
      weightedBeta,
      byType,
      bySector,
    };
  }, [portfolio]);

  // Projeção futura
  const projection = useMemo(() => {
    const annualReturn = 0.12; // 12% ao ano
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
    
    let futureValue = portfolioAnalysis.totalCurrent;
    const projections: { year: number; value: number; dividends: number }[] = [];
    
    for (let year = 1; year <= targetYears; year++) {
      for (let month = 1; month <= 12; month++) {
        futureValue = futureValue * (1 + monthlyReturn) + monthlyContribution;
      }
      const annualDividends = futureValue * (portfolioAnalysis.avgDY / 100);
      projections.push({ year, value: futureValue, dividends: annualDividends });
    }

    return projections;
  }, [portfolioAnalysis, monthlyContribution, targetYears]);

  const addAsset = () => {
    if (!newTicker || !newQuantity || !newAvgPrice) return;
    
    const ticker = newTicker.toUpperCase();
    if (!AVAILABLE_ASSETS[ticker]) {
      alert('Ativo não encontrado');
      return;
    }

    const existing = portfolio.find(p => p.ticker === ticker);
    if (existing) {
      // Calcular novo preço médio
      const totalQty = existing.quantity + Number(newQuantity);
      const totalValue = (existing.quantity * existing.avgPrice) + (Number(newQuantity) * Number(newAvgPrice));
      const newAvg = totalValue / totalQty;
      
      setPortfolio(prev => prev.map(p => 
        p.ticker === ticker 
          ? { ...p, quantity: totalQty, avgPrice: newAvg }
          : p
      ));
    } else {
      setPortfolio(prev => [...prev, {
        ticker,
        quantity: Number(newQuantity),
        avgPrice: Number(newAvgPrice),
      }]);
    }

    setNewTicker('');
    setNewQuantity('');
    setNewAvgPrice('');
  };

  const removeAsset = (ticker: string) => {
    setPortfolio(prev => prev.filter(p => p.ticker !== ticker));
  };

  const savePortfolio = async () => {
    if (!user) {
      alert('Faça login para salvar sua carteira');
      return;
    }

    const name = newPortfolioName || portfolioName;
    
    try {
      const result = await createPortfolio.mutateAsync({
        name,
        initialCapital: portfolioAnalysis.totalInvested,
        isPublic: false,
      });

      // Add assets to portfolio
      for (const item of portfolio) {
        await addAssetMutation.mutateAsync({
          portfolioId: result.id,
          ticker: item.ticker,
          name: AVAILABLE_ASSETS[item.ticker]?.name,
          quantity: item.quantity,
          averagePrice: item.avgPrice,
        });
      }

      setNewPortfolioName('');
    } catch (error) {
      alert('Erro ao salvar carteira');
    }
  };

  const loadPortfolio = (id: number) => {
    setSelectedPortfolioId(id);
    setShowLoadDialog(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'acao': return <TrendingUp className="h-4 w-4" />;
      case 'fii': return <Building2 className="h-4 w-4" />;
      case 'etf': return <Layers className="h-4 w-4" />;
      case 'bdr': return <Landmark className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'acao': return 'Ação';
      case 'fii': return 'FII';
      case 'etf': return 'ETF';
      case 'bdr': return 'BDR';
      default: return type;
    }
  };

  const getRiskLevel = (beta: number) => {
    if (beta < 0.7) return { label: 'Conservador', color: 'text-green-500', bg: 'bg-green-500' };
    if (beta < 1.0) return { label: 'Moderado', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    if (beta < 1.3) return { label: 'Arrojado', color: 'text-orange-500', bg: 'bg-orange-500' };
    return { label: 'Agressivo', color: 'text-red-500', bg: 'bg-red-500' };
  };

  const riskLevel = getRiskLevel(portfolioAnalysis.weightedBeta);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Simulador de Carteira</h1>
              <p className="text-muted-foreground">
                {portfolioName} {selectedPortfolioId && <Badge variant="outline" className="ml-2">Salva</Badge>}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {user ? (
              <>
                <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Carregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Carregar Carteira</DialogTitle>
                      <DialogDescription>Selecione uma carteira salva</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {savedPortfolios?.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">Nenhuma carteira salva</p>
                      )}
                      {savedPortfolios?.map(p => (
                        <div 
                          key={p.id} 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted flex justify-between items-center"
                          onClick={() => loadPortfolio(p.id)}
                        >
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(Number(p.currentValue || p.initialCapital))}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Excluir esta carteira?')) {
                                deletePortfolio.mutate({ id: p.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Salvar Carteira</DialogTitle>
                      <DialogDescription>Dê um nome para sua carteira</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome da Carteira</Label>
                        <Input 
                          value={newPortfolioName} 
                          onChange={(e) => setNewPortfolioName(e.target.value)}
                          placeholder="Ex: Carteira de Dividendos"
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={savePortfolio}
                        disabled={createPortfolio.isPending}
                      >
                        {createPortfolio.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Salvar Carteira
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Button asChild>
                <a href="/api/oauth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login para Salvar
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Adicionar Ativo */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Ativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Ticker</Label>
              <Select value={newTicker} onValueChange={setNewTicker}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ativo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AVAILABLE_ASSETS).map(([ticker, asset]) => (
                    <SelectItem key={ticker} value={ticker}>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(asset.type)}
                        <span>{ticker}</span>
                        <span className="text-muted-foreground">- {asset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {newTicker && AVAILABLE_ASSETS[newTicker] && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div className="font-medium">{AVAILABLE_ASSETS[newTicker].name}</div>
                <div className="text-muted-foreground">
                  Preço atual: {formatCurrency(AVAILABLE_ASSETS[newTicker].price)}
                </div>
                <div className="text-muted-foreground">
                  DY: {AVAILABLE_ASSETS[newTicker].dy}% | Beta: {AVAILABLE_ASSETS[newTicker].beta}
                </div>
              </div>
            )}

            <div>
              <Label>Quantidade</Label>
              <Input 
                type="number" 
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <Label>Preço Médio (R$)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={newAvgPrice}
                onChange={(e) => setNewAvgPrice(e.target.value)}
                placeholder="Ex: 35.50"
              />
            </div>

            <Button className="w-full" onClick={addAsset}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardContent>
        </Card>

        {/* Resumo da Carteira */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Resumo da Carteira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Valor Investido</div>
                <div className="text-xl font-bold">{formatCurrency(portfolioAnalysis.totalInvested)}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Valor Atual</div>
                <div className="text-xl font-bold">{formatCurrency(portfolioAnalysis.totalCurrent)}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Lucro/Prejuízo</div>
                <div className={`text-xl font-bold ${portfolioAnalysis.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioAnalysis.totalProfit >= 0 ? '+' : ''}{formatCurrency(portfolioAnalysis.totalProfit)}
                  <span className="text-sm ml-1">({portfolioAnalysis.totalProfitPercent.toFixed(2)}%)</span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Dividendos/Ano</div>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(portfolioAnalysis.totalDividends)}
                  <span className="text-sm ml-1">({portfolioAnalysis.avgDY.toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Perfil de Risco */}
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg mb-6">
              <AlertTriangle className={`h-6 w-6 ${riskLevel.color}`} />
              <div>
                <div className="text-sm text-muted-foreground">Perfil de Risco</div>
                <div className={`font-bold ${riskLevel.color}`}>{riskLevel.label}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Beta: {portfolioAnalysis.weightedBeta.toFixed(2)}</div>
                <Progress value={portfolioAnalysis.weightedBeta * 40} className="h-2" />
              </div>
            </div>

            {/* Lista de Ativos */}
            <div className="space-y-2">
              <h4 className="font-semibold">Ativos na Carteira</h4>
              {portfolioAnalysis.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Adicione ativos à sua carteira</p>
              ) : (
                portfolioAnalysis.items.map((item: any) => (
                  <div key={item.ticker} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        {getTypeIcon(item.asset.type)}
                      </div>
                      <div>
                        <div className="font-medium">{item.ticker}</div>
                        <div className="text-sm text-muted-foreground">{item.asset.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(item.current)}</div>
                      <div className={`text-sm ${item.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.profit >= 0 ? '+' : ''}{item.profitPercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{item.quantity} cotas</div>
                      <div>PM: {formatCurrency(item.avgPrice)}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeAsset(item.ticker)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projeção Futura */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Projeção Futura
          </CardTitle>
          <CardDescription>
            Simulação com aporte mensal de {formatCurrency(monthlyContribution)} e retorno estimado de 12% a.a.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label>Aporte Mensal (R$)</Label>
              <Input 
                type="number" 
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Label>Horizonte (anos)</Label>
              <Select value={targetYears.toString()} onValueChange={(v) => setTargetYears(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y} anos</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {projection.filter((_, i) => i === Math.floor(projection.length / 3) - 1 || i === Math.floor(2 * projection.length / 3) - 1 || i === projection.length - 1).map((p) => (
              <div key={p.year} className="p-4 bg-muted rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Em {p.year} anos</div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(p.value)}</div>
                <div className="text-sm text-muted-foreground">
                  Dividendos: {formatCurrency(p.dividends)}/ano
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribuição com Gráficos de Pizza */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Por Tipo de Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Gráfico de Pizza */}
              <div className="flex-shrink-0">
                <PieChartComponent
                  data={Object.entries(portfolioAnalysis.byType).map(([type, value], index) => ({
                    label: getTypeLabel(type),
                    value,
                    color: TYPE_COLORS[type] || CHART_COLORS[index % CHART_COLORS.length],
                  }))}
                  size={180}
                  showLegend={false}
                />
              </div>
              {/* Legenda */}
              <div className="flex-1 space-y-3 w-full">
                {Object.entries(portfolioAnalysis.byType).map(([type, value], index) => {
                  const percent = (value / portfolioAnalysis.totalCurrent) * 100;
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: TYPE_COLORS[type] || CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          {getTypeIcon(type)}
                          {getTypeLabel(type)}
                        </span>
                        <span>{formatCurrency(value)} ({percent.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Por Setor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Gráfico de Pizza */}
              <div className="flex-shrink-0">
                <PieChartComponent
                  data={Object.entries(portfolioAnalysis.bySector)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([sector, value], index) => ({
                      label: sector,
                      value,
                      color: CHART_COLORS[index % CHART_COLORS.length],
                    }))}
                  size={180}
                  showLegend={false}
                />
              </div>
              {/* Legenda */}
              <div className="flex-1 space-y-3 w-full">
                {Object.entries(portfolioAnalysis.bySector)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([sector, value], index) => {
                    const percent = (value / portfolioAnalysis.totalCurrent) * 100;
                    return (
                      <div key={sector}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            {sector}
                          </span>
                          <span>{formatCurrency(value)} ({percent.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      {selectedPortfolioId && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Evolução do Patrimônio
            </CardTitle>
            <CardDescription>
              Acompanhe a evolução do valor da sua carteira ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChart portfolioId={selectedPortfolioId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Componente de gráfico de evolução
function PortfolioChart({ portfolioId }: { portfolioId: number }) {
  const { data: history, isLoading } = trpc.portfolioHistory.getHistory.useQuery(
    { portfolioId, days: 90 },
    { enabled: !!portfolioId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <History className="h-12 w-12 mb-2" />
        <p>Nenhum histórico disponível ainda</p>
        <p className="text-sm">O histórico será registrado automaticamente</p>
      </div>
    );
  }

  const maxValue = Math.max(...history.map(h => parseFloat(h.totalValue)));
  const minValue = Math.min(...history.map(h => parseFloat(h.totalValue)));
  const range = maxValue - minValue || 1;

  return (
    <div className="space-y-4">
      {/* Gráfico simplificado */}
      <div className="h-48 flex items-end gap-1">
        {history.map((point, i) => {
          const value = parseFloat(point.totalValue);
          const height = ((value - minValue) / range) * 100;
          const isPositive = parseFloat(point.totalReturn) >= 0;
          
          return (
            <div
              key={i}
              className="flex-1 group relative"
              style={{ height: '100%' }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-t transition-all ${isPositive ? 'bg-green-500' : 'bg-red-500'} hover:opacity-80`}
                style={{ height: `${Math.max(height, 5)}%` }}
              />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover border rounded p-2 text-xs whitespace-nowrap z-10">
                <div className="font-medium">
                  {new Date(point.recordedAt).toLocaleDateString('pt-BR')}
                </div>
                <div>Valor: R$ {parseFloat(point.totalValue).toLocaleString('pt-BR')}</div>
                <div className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  Retorno: {parseFloat(point.returnPercent).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{history.length > 0 ? new Date(history[0].recordedAt).toLocaleDateString('pt-BR') : ''}</span>
        <span>{history.length > 0 ? new Date(history[history.length - 1].recordedAt).toLocaleDateString('pt-BR') : ''}</span>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Mínimo</div>
          <div className="font-medium">R$ {minValue.toLocaleString('pt-BR')}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Máximo</div>
          <div className="font-medium">R$ {maxValue.toLocaleString('pt-BR')}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Registros</div>
          <div className="font-medium">{history.length}</div>
        </div>
      </div>
    </div>
  );
}

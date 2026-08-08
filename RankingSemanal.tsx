import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp,
  TrendingDown,
  Medal,
  Crown,
  Flame,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Calendar,
  DollarSign,
  Percent,
  Volume2,
  Star,
  Zap
} from 'lucide-react';

interface RankedStock {
  position: number;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  weekChange: number;
  monthChange: number;
  volume: number;
  marketCap: number;
}

// Dados de exemplo
const TOP_GAINERS: RankedStock[] = [
  { position: 1, ticker: 'MGLU3', name: 'Magazine Luiza', sector: 'Varejo', price: 12.45, change: 8.5, weekChange: 25.3, monthChange: 45.2, volume: 85000000, marketCap: 15000000000 },
  { position: 2, ticker: 'VIIA3', name: 'Via', sector: 'Varejo', price: 2.85, change: 7.2, weekChange: 22.1, monthChange: 38.5, volume: 120000000, marketCap: 4500000000 },
  { position: 3, ticker: 'CVCB3', name: 'CVC Brasil', sector: 'Turismo', price: 3.20, change: 6.8, weekChange: 18.5, monthChange: 32.0, volume: 45000000, marketCap: 1200000000 },
  { position: 4, ticker: 'AZUL4', name: 'Azul', sector: 'Aéreo', price: 5.80, change: 5.9, weekChange: 15.2, monthChange: 28.3, volume: 35000000, marketCap: 2100000000 },
  { position: 5, ticker: 'GOLL4', name: 'Gol', sector: 'Aéreo', price: 1.95, change: 5.5, weekChange: 14.8, monthChange: 25.0, volume: 28000000, marketCap: 800000000 },
  { position: 6, ticker: 'PETZ3', name: 'Petz', sector: 'Varejo', price: 4.50, change: 5.2, weekChange: 12.5, monthChange: 22.0, volume: 18000000, marketCap: 2000000000 },
  { position: 7, ticker: 'LWSA3', name: 'Locaweb', sector: 'Tecnologia', price: 5.20, change: 4.8, weekChange: 11.2, monthChange: 18.5, volume: 15000000, marketCap: 3000000000 },
  { position: 8, ticker: 'CASH3', name: 'Meliuz', sector: 'Tecnologia', price: 3.80, change: 4.5, weekChange: 10.8, monthChange: 15.2, volume: 12000000, marketCap: 350000000 },
  { position: 9, ticker: 'BHIA3', name: 'Casas Bahia', sector: 'Varejo', price: 7.20, change: 4.2, weekChange: 9.5, monthChange: 12.0, volume: 55000000, marketCap: 1800000000 },
  { position: 10, ticker: 'COGN3', name: 'Cogna', sector: 'Educação', price: 1.85, change: 3.8, weekChange: 8.2, monthChange: 10.5, volume: 42000000, marketCap: 3500000000 },
];

const TOP_LOSERS: RankedStock[] = [
  { position: 1, ticker: 'MRFG3', name: 'Marfrig', sector: 'Alimentos', price: 12.80, change: -6.5, weekChange: -15.2, monthChange: -22.0, volume: 25000000, marketCap: 8500000000 },
  { position: 2, ticker: 'BEEF3', name: 'Minerva', sector: 'Alimentos', price: 5.90, change: -5.8, weekChange: -12.5, monthChange: -18.5, volume: 18000000, marketCap: 3500000000 },
  { position: 3, ticker: 'BRFS3', name: 'BRF', sector: 'Alimentos', price: 22.50, change: -4.5, weekChange: -10.2, monthChange: -15.0, volume: 35000000, marketCap: 18000000000 },
  { position: 4, ticker: 'USIM5', name: 'Usiminas', sector: 'Siderurgia', price: 6.20, change: -4.2, weekChange: -9.8, monthChange: -14.2, volume: 22000000, marketCap: 8000000000 },
  { position: 5, ticker: 'CSNA3', name: 'CSN', sector: 'Siderurgia', price: 11.50, change: -3.8, weekChange: -8.5, monthChange: -12.0, volume: 28000000, marketCap: 15000000000 },
  { position: 6, ticker: 'GGBR4', name: 'Gerdau', sector: 'Siderurgia', price: 18.20, change: -3.5, weekChange: -7.2, monthChange: -10.5, volume: 32000000, marketCap: 32000000000 },
  { position: 7, ticker: 'GOAU4', name: 'Metalúrgica Gerdau', sector: 'Siderurgia', price: 9.80, change: -3.2, weekChange: -6.8, monthChange: -9.2, volume: 12000000, marketCap: 10000000000 },
  { position: 8, ticker: 'CMIN3', name: 'CSN Mineração', sector: 'Mineração', price: 5.50, change: -2.8, weekChange: -6.2, monthChange: -8.5, volume: 15000000, marketCap: 30000000000 },
  { position: 9, ticker: 'SUZB3', name: 'Suzano', sector: 'Papel', price: 52.80, change: -2.5, weekChange: -5.5, monthChange: -7.8, volume: 18000000, marketCap: 70000000000 },
  { position: 10, ticker: 'KLBN11', name: 'Klabin', sector: 'Papel', price: 21.50, change: -2.2, weekChange: -4.8, monthChange: -6.5, volume: 14000000, marketCap: 25000000000 },
];

const TOP_VOLUME: RankedStock[] = [
  { position: 1, ticker: 'PETR4', name: 'Petrobras', sector: 'Petróleo', price: 36.80, change: 1.2, weekChange: 3.5, monthChange: 8.2, volume: 450000000, marketCap: 480000000000 },
  { position: 2, ticker: 'VALE3', name: 'Vale', sector: 'Mineração', price: 62.50, change: -0.8, weekChange: -2.1, monthChange: -5.5, volume: 380000000, marketCap: 280000000000 },
  { position: 3, ticker: 'ITUB4', name: 'Itaú Unibanco', sector: 'Financeiro', price: 32.45, change: 0.5, weekChange: 2.2, monthChange: 5.8, volume: 220000000, marketCap: 320000000000 },
  { position: 4, ticker: 'BBDC4', name: 'Bradesco', sector: 'Financeiro', price: 12.80, change: 0.3, weekChange: 1.5, monthChange: 3.2, volume: 180000000, marketCap: 130000000000 },
  { position: 5, ticker: 'BBAS3', name: 'Banco do Brasil', sector: 'Financeiro', price: 54.20, change: 0.8, weekChange: 2.8, monthChange: 6.5, volume: 150000000, marketCap: 155000000000 },
  { position: 6, ticker: 'B3SA3', name: 'B3', sector: 'Financeiro', price: 11.20, change: -0.5, weekChange: -1.2, monthChange: -2.8, volume: 140000000, marketCap: 62000000000 },
  { position: 7, ticker: 'VIIA3', name: 'Via', sector: 'Varejo', price: 2.85, change: 7.2, weekChange: 22.1, monthChange: 38.5, volume: 120000000, marketCap: 4500000000 },
  { position: 8, ticker: 'MGLU3', name: 'Magazine Luiza', sector: 'Varejo', price: 12.45, change: 8.5, weekChange: 25.3, monthChange: 45.2, volume: 85000000, marketCap: 15000000000 },
  { position: 9, ticker: 'RENT3', name: 'Localiza', sector: 'Aluguel', price: 42.80, change: 1.5, weekChange: 4.2, monthChange: 9.5, volume: 75000000, marketCap: 45000000000 },
  { position: 10, ticker: 'WEGE3', name: 'WEG', sector: 'Industrial', price: 52.80, change: 0.2, weekChange: 1.8, monthChange: 4.5, volume: 65000000, marketCap: 220000000000 },
];

const TOP_DIVIDENDS: RankedStock[] = [
  { position: 1, ticker: 'PETR4', name: 'Petrobras', sector: 'Petróleo', price: 36.80, change: 1.2, weekChange: 3.5, monthChange: 8.2, volume: 450000000, marketCap: 480000000000 },
  { position: 2, ticker: 'CPLE6', name: 'Copel', sector: 'Energia', price: 9.50, change: 0.8, weekChange: 2.5, monthChange: 6.2, volume: 45000000, marketCap: 26000000000 },
  { position: 3, ticker: 'TAEE11', name: 'Taesa', sector: 'Energia', price: 35.20, change: 0.5, weekChange: 1.8, monthChange: 4.5, volume: 25000000, marketCap: 12000000000 },
  { position: 4, ticker: 'BBAS3', name: 'Banco do Brasil', sector: 'Financeiro', price: 54.20, change: 0.8, weekChange: 2.8, monthChange: 6.5, volume: 150000000, marketCap: 155000000000 },
  { position: 5, ticker: 'BBSE3', name: 'BB Seguridade', sector: 'Seguros', price: 34.80, change: 0.6, weekChange: 2.2, monthChange: 5.8, volume: 35000000, marketCap: 70000000000 },
  { position: 6, ticker: 'CMIG4', name: 'Cemig', sector: 'Energia', price: 11.80, change: 0.4, weekChange: 1.5, monthChange: 3.8, volume: 42000000, marketCap: 25000000000 },
  { position: 7, ticker: 'EGIE3', name: 'Engie Brasil', sector: 'Energia', price: 42.50, change: 0.3, weekChange: 1.2, monthChange: 3.2, volume: 18000000, marketCap: 35000000000 },
  { position: 8, ticker: 'VIVT3', name: 'Telefônica', sector: 'Telecom', price: 52.80, change: 0.2, weekChange: 0.8, monthChange: 2.5, volume: 22000000, marketCap: 88000000000 },
  { position: 9, ticker: 'ITSA4', name: 'Itaúsa', sector: 'Holding', price: 9.80, change: 0.5, weekChange: 1.8, monthChange: 4.2, volume: 85000000, marketCap: 100000000000 },
  { position: 10, ticker: 'TRPL4', name: 'Transmissão Paulista', sector: 'Energia', price: 25.50, change: 0.4, weekChange: 1.5, monthChange: 3.5, volume: 12000000, marketCap: 17000000000 },
];

export default function RankingSemanal() {
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('semana');

  const formatCurrency = (value: number) => {
    if (value >= 1000000000000) return `R$ ${(value / 1000000000000).toFixed(1)}T`;
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    return value.toLocaleString('pt-BR');
  };

  const getChangeValue = (stock: RankedStock) => {
    switch (period) {
      case 'dia': return stock.change;
      case 'semana': return stock.weekChange;
      case 'mes': return stock.monthChange;
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{position}</span>;
    }
  };

  const renderRankingTable = (stocks: RankedStock[], type: 'gainer' | 'loser' | 'volume' | 'dividend') => (
    <div className="space-y-2">
      {stocks.map((stock) => {
        const change = getChangeValue(stock);
        return (
          <Link key={stock.ticker} href={`/ativo/${stock.ticker}`}>
            <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-8 flex justify-center">
                {getMedalIcon(stock.position)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{stock.ticker}</span>
                  <span className="text-sm text-muted-foreground truncate">{stock.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">{stock.sector}</div>
              </div>
              <div className="text-right">
                {type === 'volume' ? (
                  <>
                    <div className="font-bold">{formatVolume(stock.volume)}</div>
                    <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </div>
                  </>
                ) : type === 'dividend' ? (
                  <>
                    <div className="font-bold text-green-500">
                      {stock.ticker === 'PETR4' ? '18.5%' : 
                       stock.ticker === 'CPLE6' ? '12.2%' :
                       stock.ticker === 'TAEE11' ? '10.5%' :
                       stock.ticker === 'BBAS3' ? '9.8%' :
                       stock.ticker === 'BBSE3' ? '9.2%' :
                       stock.ticker === 'CMIG4' ? '8.8%' :
                       stock.ticker === 'EGIE3' ? '8.5%' :
                       stock.ticker === 'VIVT3' ? '7.5%' :
                       stock.ticker === 'ITSA4' ? '7.2%' : '6.8%'} DY
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(stock.price)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(stock.price)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Rankings Semanais</h1>
        </div>
        <p className="text-muted-foreground">
          Acompanhe os melhores e piores desempenhos do mercado
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Período:</span>
        <div className="flex gap-2">
          {[
            { value: 'dia', label: 'Hoje' },
            { value: 'semana', label: 'Semana' },
            { value: 'mes', label: 'Mês' },
          ].map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.value as any)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Rankings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Altas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Maiores Altas
            </CardTitle>
            <CardDescription>
              Ações com melhor desempenho no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderRankingTable(TOP_GAINERS, 'gainer')}
          </CardContent>
        </Card>

        {/* Top Baixas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Maiores Baixas
            </CardTitle>
            <CardDescription>
              Ações com pior desempenho no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderRankingTable(TOP_LOSERS, 'loser')}
          </CardContent>
        </Card>

        {/* Top Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Mais Negociadas
            </CardTitle>
            <CardDescription>
              Ações com maior volume financeiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderRankingTable(TOP_VOLUME, 'volume')}
          </CardContent>
        </Card>

        {/* Top Dividendos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Maiores Dividend Yields
            </CardTitle>
            <CardDescription>
              Ações com maior retorno em dividendos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderRankingTable(TOP_DIVIDENDS, 'dividend')}
          </CardContent>
        </Card>
      </div>

      {/* Destaques da Semana */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Destaques da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-green-500">Maior Alta</span>
              </div>
              <div className="text-2xl font-bold">MGLU3</div>
              <div className="text-sm text-muted-foreground">Magazine Luiza</div>
              <div className="text-lg font-bold text-green-500 mt-2">+25.3%</div>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-red-500">Maior Baixa</span>
              </div>
              <div className="text-2xl font-bold">MRFG3</div>
              <div className="text-sm text-muted-foreground">Marfrig</div>
              <div className="text-lg font-bold text-red-500 mt-2">-15.2%</div>
            </div>

            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-orange-500">Mais Negociada</span>
              </div>
              <div className="text-2xl font-bold">PETR4</div>
              <div className="text-sm text-muted-foreground">Petrobras</div>
              <div className="text-lg font-bold text-orange-500 mt-2">R$ 450M</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

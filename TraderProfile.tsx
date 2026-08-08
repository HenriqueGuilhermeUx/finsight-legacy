import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Trophy, 
  Calendar,
  BarChart3,
  Copy,
  MessageSquare,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart
} from "lucide-react";
import { useParams } from "wouter";
import { useState } from "react";

// Mock trader data
const mockTrader = {
  id: '1',
  name: 'Carlos Silva',
  username: '@carlossilva',
  avatar: null,
  bio: 'Trader profissional com 10 anos de experiência. Especialista em análise técnica e swing trade. Foco em ações brasileiras e americanas.',
  location: 'São Paulo, BR',
  joinedAt: '2023-01-15',
  isVerified: true,
  isPremium: true,
  level: 8,
  levelName: 'Mestre',
  xp: 3450,
  xpToNextLevel: 4000,
  followers: 1234,
  following: 56,
  isFollowing: false,
  isCopying: false,
  stats: {
    totalReturn: 156.8,
    monthlyReturn: 12.4,
    weeklyReturn: 3.2,
    winRate: 68.5,
    totalTrades: 847,
    avgHoldingDays: 12,
    sharpeRatio: 2.34,
    maxDrawdown: -15.2,
    profitFactor: 2.1,
    riskScore: 'Moderado',
  },
  badges: [
    { id: '1', name: 'Early Adopter', icon: '🚀', rarity: 'Épico' },
    { id: '2', name: 'Mestre do Lucro', icon: '💰', rarity: 'Raro' },
    { id: '3', name: 'Centurião', icon: '⚔️', rarity: 'Raro' },
    { id: '4', name: 'Top 10', icon: '🏆', rarity: 'Lendário' },
    { id: '5', name: 'Influenciador', icon: '⭐', rarity: 'Épico' },
    { id: '6', name: 'Mãos de Diamante', icon: '💎', rarity: 'Raro' },
  ],
  recentTrades: [
    { id: '1', ticker: 'PETR4', type: 'buy', price: 28.50, date: '2024-01-15', return: 8.5, status: 'closed' },
    { id: '2', ticker: 'VALE3', type: 'sell', price: 72.30, date: '2024-01-14', return: -2.1, status: 'closed' },
    { id: '3', ticker: 'ITUB4', type: 'buy', price: 32.80, date: '2024-01-13', return: 5.2, status: 'open' },
    { id: '4', ticker: 'WEGE3', type: 'buy', price: 35.20, date: '2024-01-12', return: 12.3, status: 'closed' },
    { id: '5', ticker: 'BBDC4', type: 'sell', price: 15.40, date: '2024-01-11', return: 3.8, status: 'closed' },
  ],
  portfolio: [
    { ticker: 'PETR4', allocation: 25, return: 8.5 },
    { ticker: 'VALE3', allocation: 20, return: -2.1 },
    { ticker: 'ITUB4', allocation: 18, return: 5.2 },
    { ticker: 'WEGE3', allocation: 15, return: 12.3 },
    { ticker: 'BBDC4', allocation: 12, return: 3.8 },
    { ticker: 'Outros', allocation: 10, return: 4.5 },
  ],
  performanceHistory: [
    { month: 'Jul', return: 5.2 },
    { month: 'Ago', return: -2.1 },
    { month: 'Set', return: 8.4 },
    { month: 'Out', return: 3.7 },
    { month: 'Nov', return: 11.2 },
    { month: 'Dez', return: 7.8 },
    { month: 'Jan', return: 12.4 },
  ],
};

export default function TraderProfile() {
  const params = useParams<{ id: string }>();
  const [trader, setTrader] = useState(mockTrader);
  const [isFollowing, setIsFollowing] = useState(trader.isFollowing);
  const [isCopying, setIsCopying] = useState(trader.isCopying);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setTrader(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  const handleCopy = () => {
    setIsCopying(!isCopying);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'bg-gray-500/20 text-gray-400';
      case 'Incomum': return 'bg-green-500/20 text-green-400';
      case 'Raro': return 'bg-blue-500/20 text-blue-400';
      case 'Épico': return 'bg-purple-500/20 text-purple-400';
      case 'Lendário': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl">
        {/* Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={trader.avatar || undefined} />
                  <AvatarFallback className="text-4xl bg-primary/20">
                    {trader.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-bold">
                  Nível {trader.level}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 pt-8 md:pt-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{trader.name}</h1>
                      {trader.isVerified && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                      {trader.isPremium && (
                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{trader.username}</p>
                    <p className="text-sm mt-2 max-w-xl">{trader.bio}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Membro desde {new Date(trader.joinedAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      variant={isFollowing ? "outline" : "default"}
                      onClick={handleFollow}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                    <Button 
                      variant={isCopying ? "outline" : "secondary"}
                      onClick={handleCopy}
                      className={isCopying ? "border-green-500 text-green-500" : ""}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {isCopying ? 'Copiando' : 'Copiar'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{trader.followers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{trader.following}</p>
                    <p className="text-sm text-muted-foreground">Seguindo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">+{trader.stats.totalReturn}%</p>
                    <p className="text-sm text-muted-foreground">Retorno Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{trader.stats.winRate}%</p>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{trader.levelName} (Nível {trader.level})</span>
                    <span className="text-muted-foreground">{trader.xp} / {trader.xpToNextLevel} XP</span>
                  </div>
                  <Progress value={(trader.xp / trader.xpToNextLevel) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Retorno Mensal</p>
                  <p className={`text-2xl font-bold ${trader.stats.monthlyReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trader.stats.monthlyReturn >= 0 ? '+' : ''}{trader.stats.monthlyReturn}%
                  </p>
                </div>
                {trader.stats.monthlyReturn >= 0 ? (
                  <ArrowUpRight className="h-8 w-8 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{trader.stats.sharpeRatio}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-500">{trader.stats.maxDrawdown}%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Trades</p>
                  <p className="text-2xl font-bold">{trader.stats.totalTrades}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="trades">Operações</TabsTrigger>
            <TabsTrigger value="badges">Conquistas</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Histórico de Retornos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trader.performanceHistory.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="w-12 text-sm text-muted-foreground">{item.month}</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.return >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(item.return) * 5, 100)}%` }}
                          />
                        </div>
                        <span className={`w-16 text-right font-medium ${item.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.return >= 0 ? '+' : ''}{item.return}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Métricas de Risco
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Profit Factor</span>
                    <span className="font-medium">{trader.stats.profitFactor}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Média de Dias por Trade</span>
                    <span className="font-medium">{trader.stats.avgHoldingDays} dias</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Perfil de Risco</span>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
                      {trader.stats.riskScore}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Retorno Semanal</span>
                    <span className={`font-medium ${trader.stats.weeklyReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trader.stats.weeklyReturn >= 0 ? '+' : ''}{trader.stats.weeklyReturn}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Alocação do Portfólio
                </CardTitle>
                <CardDescription>Distribuição atual dos ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trader.portfolio.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 font-medium">{item.ticker}</div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.allocation}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right text-muted-foreground">{item.allocation}%</div>
                      <div className={`w-16 text-right font-medium ${item.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.return >= 0 ? '+' : ''}{item.return}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Operações Recentes
                </CardTitle>
                <CardDescription>Últimas operações realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trader.recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {trade.type === 'buy' ? (
                            <TrendingUp className={`h-4 w-4 text-green-500`} />
                          ) : (
                            <TrendingDown className={`h-4 w-4 text-red-500`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{trade.ticker}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.type === 'buy' ? 'Compra' : 'Venda'} • R$ {trade.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${trade.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.return >= 0 ? '+' : ''}{trade.return}%
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(trade.date).toLocaleDateString('pt-BR')}
                          <Badge variant="outline" className={trade.status === 'open' ? 'bg-blue-500/20 text-blue-400' : ''}>
                            {trade.status === 'open' ? 'Aberta' : 'Fechada'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Conquistas
                </CardTitle>
                <CardDescription>{trader.badges.length} badges conquistados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trader.badges.map((badge) => (
                    <div key={badge.id} className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="font-medium">{badge.name}</p>
                      <Badge className={getRarityColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Medal,
  Crown,
  Target,
  BarChart3,
  Eye,
  Copy,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

// Mock data for leaderboard
const mockLeaderboard = [
  {
    rank: 1,
    portfolioId: 1,
    portfolioName: "Alpha Growth",
    userId: 1,
    userName: "Carlos Silva",
    returnPercent: 156.8,
    currentValue: 256800,
    initialCapital: 100000,
    benchmark: "IBOV",
    followerCount: 1247,
    sharpeRatio: 2.45,
    maxDrawdown: -12.5,
    winRate: 68,
    totalTrades: 156,
  },
  {
    rank: 2,
    portfolioId: 2,
    portfolioName: "Dividend Master",
    userId: 2,
    userName: "Ana Rodrigues",
    returnPercent: 89.4,
    currentValue: 189400,
    initialCapital: 100000,
    benchmark: "IDIV",
    followerCount: 892,
    sharpeRatio: 1.98,
    maxDrawdown: -8.2,
    winRate: 72,
    totalTrades: 89,
  },
  {
    rank: 3,
    portfolioId: 3,
    portfolioName: "Tech Momentum",
    userId: 3,
    userName: "Pedro Santos",
    returnPercent: 78.2,
    currentValue: 178200,
    initialCapital: 100000,
    benchmark: "IBOV",
    followerCount: 654,
    sharpeRatio: 1.76,
    maxDrawdown: -15.8,
    winRate: 61,
    totalTrades: 234,
  },
  {
    rank: 4,
    portfolioId: 4,
    portfolioName: "Value Investor",
    userId: 4,
    userName: "Maria Oliveira",
    returnPercent: 65.3,
    currentValue: 165300,
    initialCapital: 100000,
    benchmark: "IBOV",
    followerCount: 521,
    sharpeRatio: 1.89,
    maxDrawdown: -6.4,
    winRate: 75,
    totalTrades: 45,
  },
  {
    rank: 5,
    portfolioId: 5,
    portfolioName: "Crypto Hunter",
    userId: 5,
    userName: "Lucas Ferreira",
    returnPercent: 234.5,
    currentValue: 334500,
    initialCapital: 100000,
    benchmark: "BTC",
    followerCount: 2156,
    sharpeRatio: 1.45,
    maxDrawdown: -35.2,
    winRate: 52,
    totalTrades: 412,
  },
  {
    rank: 6,
    portfolioId: 6,
    portfolioName: "Balanced Portfolio",
    userId: 6,
    userName: "Julia Costa",
    returnPercent: 42.8,
    currentValue: 142800,
    initialCapital: 100000,
    benchmark: "CDI",
    followerCount: 389,
    sharpeRatio: 2.12,
    maxDrawdown: -4.5,
    winRate: 78,
    totalTrades: 67,
  },
  {
    rank: 7,
    portfolioId: 7,
    portfolioName: "Small Caps BR",
    userId: 7,
    userName: "Rafael Lima",
    returnPercent: 98.6,
    currentValue: 198600,
    initialCapital: 100000,
    benchmark: "SMLL",
    followerCount: 445,
    sharpeRatio: 1.34,
    maxDrawdown: -22.1,
    winRate: 58,
    totalTrades: 178,
  },
  {
    rank: 8,
    portfolioId: 8,
    portfolioName: "FII Income",
    userId: 8,
    userName: "Fernanda Souza",
    returnPercent: 28.4,
    currentValue: 128400,
    initialCapital: 100000,
    benchmark: "IFIX",
    followerCount: 678,
    sharpeRatio: 1.67,
    maxDrawdown: -5.8,
    winRate: 82,
    totalTrades: 34,
  },
  {
    rank: 9,
    portfolioId: 9,
    portfolioName: "US Tech Focus",
    userId: 9,
    userName: "Bruno Almeida",
    returnPercent: 112.3,
    currentValue: 212300,
    initialCapital: 100000,
    benchmark: "QQQ",
    followerCount: 567,
    sharpeRatio: 1.56,
    maxDrawdown: -18.4,
    winRate: 63,
    totalTrades: 145,
  },
  {
    rank: 10,
    portfolioId: 10,
    portfolioName: "Swing Trader",
    userId: 10,
    userName: "Camila Martins",
    returnPercent: 85.7,
    currentValue: 185700,
    initialCapital: 100000,
    benchmark: "IBOV",
    followerCount: 334,
    sharpeRatio: 1.23,
    maxDrawdown: -19.6,
    winRate: 55,
    totalTrades: 567,
  },
];

const periods = [
  { value: "day", label: "Hoje" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" },
  { value: "all_time", label: "All-Time" },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedTrader, setSelectedTrader] = useState<typeof mockLeaderboard[0] | null>(null);

  const followMutation = trpc.copyTrading.follow.useMutation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const handleFollow = async (portfolioId: number) => {
    if (!user) return;
    try {
      await followMutation.mutateAsync({ portfolioId, copyTrading: false });
    } catch (error) {
      console.error("Error following portfolio:", error);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground">
              Ranking dos melhores traders da plataforma. Siga e copie as estratégias vencedoras.
            </p>
          </div>
          <div className="flex gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="text-lg font-bold">{mockLeaderboard[0].userName}</p>
                  <p className="text-sm text-green-500">{formatPercent(mockLeaderboard[0].returnPercent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Seguidores</p>
                  <p className="text-lg font-bold">
                    {mockLeaderboard.reduce((sum, t) => sum + t.followerCount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retorno Médio</p>
                  <p className="text-lg font-bold text-green-500">
                    {formatPercent(mockLeaderboard.reduce((sum, t) => sum + t.returnPercent, 0) / mockLeaderboard.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate Médio</p>
                  <p className="text-lg font-bold">
                    {(mockLeaderboard.reduce((sum, t) => sum + t.winRate, 0) / mockLeaderboard.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ranking de Performance
                </CardTitle>
                <CardDescription>
                  Clique em um trader para ver mais detalhes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockLeaderboard.map((trader) => (
                    <div
                      key={trader.portfolioId}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                        selectedTrader?.portfolioId === trader.portfolioId
                          ? "bg-accent border-primary"
                          : "bg-card"
                      }`}
                      onClick={() => setSelectedTrader(trader)}
                    >
                      {/* Rank */}
                      <div className="w-10 flex justify-center">
                        {getRankIcon(trader.rank)}
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar>
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {trader.userName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{trader.portfolioName}</p>
                          <p className="text-sm text-muted-foreground truncate">{trader.userName}</p>
                        </div>
                      </div>

                      {/* Return */}
                      <div className="text-right">
                        <p className={`font-bold ${trader.returnPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatPercent(trader.returnPercent)}
                        </p>
                        <p className="text-xs text-muted-foreground">vs {trader.benchmark}</p>
                      </div>

                      {/* Followers */}
                      <div className="hidden md:flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{trader.followerCount}</span>
                      </div>

                      {/* Action */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(trader.portfolioId);
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trader Details */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detalhes do Trader
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTrader ? (
                  <div className="space-y-6">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/20 text-primary text-xl">
                          {selectedTrader.userName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{selectedTrader.portfolioName}</h3>
                        <p className="text-muted-foreground">{selectedTrader.userName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRankIcon(selectedTrader.rank)}
                          <Badge variant="outline">{selectedTrader.benchmark}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Retorno</p>
                        <p className={`text-lg font-bold ${selectedTrader.returnPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatPercent(selectedTrader.returnPercent)}
                        </p>
                      </div>
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Valor Atual</p>
                        <p className="text-lg font-bold">{formatCurrency(selectedTrader.currentValue)}</p>
                      </div>
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-lg font-bold">{selectedTrader.sharpeRatio.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Max Drawdown</p>
                        <p className="text-lg font-bold text-red-500">{selectedTrader.maxDrawdown.toFixed(1)}%</p>
                      </div>
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-bold">{selectedTrader.winRate}%</p>
                      </div>
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total Trades</p>
                        <p className="text-lg font-bold">{selectedTrader.totalTrades}</p>
                      </div>
                    </div>

                    {/* Followers */}
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Seguidores</span>
                      </div>
                      <span className="font-bold">{selectedTrader.followerCount.toLocaleString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" onClick={() => handleFollow(selectedTrader.portfolioId)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Seguir Trader
                      </Button>
                      <Link href={`/copy-trading?portfolio=${selectedTrader.portfolioId}`}>
                        <Button variant="outline" className="w-full">
                          <Copy className="h-4 w-4 mr-2" />
                          Ativar Copy Trading
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione um trader para ver os detalhes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

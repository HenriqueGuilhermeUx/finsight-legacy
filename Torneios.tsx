import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Calendar,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Award,
  Target,
  Medal,
  Crown,
  Star,
  Timer,
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock tournament data
const mockTournaments = {
  active: [
    {
      id: '1',
      name: 'Torneio Semanal #47',
      description: 'Competição semanal de trading. Comece com R$ 100.000 virtuais e maximize seu retorno!',
      type: 'weekly',
      status: 'active',
      startDate: '2024-01-15T00:00:00',
      endDate: '2024-01-21T23:59:59',
      entryFee: 100,
      prizePool: 5000,
      participants: 87,
      maxParticipants: 100,
      prizes: [
        { position: 1, xp: 2000, badge: '🥇 Campeão Semanal' },
        { position: 2, xp: 1000, badge: '🥈 Vice-Campeão' },
        { position: 3, xp: 500, badge: '🥉 Terceiro Lugar' },
        { position: 4, xp: 250, badge: null },
        { position: 5, xp: 150, badge: null },
      ],
      userParticipation: {
        isParticipating: true,
        rank: 12,
        return: 8.45,
        trades: 15,
      },
      topParticipants: [
        { rank: 1, name: 'Carlos Silva', return: 24.5, trades: 32 },
        { rank: 2, name: 'Ana Rodrigues', return: 21.3, trades: 28 },
        { rank: 3, name: 'Pedro Santos', return: 18.7, trades: 41 },
        { rank: 4, name: 'Maria Oliveira', return: 15.2, trades: 22 },
        { rank: 5, name: 'João Costa', return: 14.8, trades: 19 },
      ],
    },
  ],
  upcoming: [
    {
      id: '2',
      name: 'Torneio Semanal #48',
      description: 'Próxima competição semanal. Inscreva-se antecipadamente!',
      type: 'weekly',
      status: 'upcoming',
      startDate: '2024-01-22T00:00:00',
      endDate: '2024-01-28T23:59:59',
      entryFee: 100,
      prizePool: 5000,
      participants: 34,
      maxParticipants: 100,
      prizes: [
        { position: 1, xp: 2000, badge: '🥇 Campeão Semanal' },
        { position: 2, xp: 1000, badge: '🥈 Vice-Campeão' },
        { position: 3, xp: 500, badge: '🥉 Terceiro Lugar' },
      ],
    },
    {
      id: '3',
      name: 'Torneio Mensal de Janeiro',
      description: 'Grande competição mensal com prêmios especiais!',
      type: 'monthly',
      status: 'upcoming',
      startDate: '2024-02-01T00:00:00',
      endDate: '2024-02-29T23:59:59',
      entryFee: 500,
      prizePool: 25000,
      participants: 156,
      maxParticipants: 500,
      prizes: [
        { position: 1, xp: 10000, badge: '👑 Rei do Mês' },
        { position: 2, xp: 5000, badge: '⭐ Elite Trader' },
        { position: 3, xp: 2500, badge: '💎 Diamond' },
      ],
    },
  ],
  completed: [
    {
      id: '4',
      name: 'Torneio Semanal #46',
      type: 'weekly',
      status: 'completed',
      startDate: '2024-01-08T00:00:00',
      endDate: '2024-01-14T23:59:59',
      participants: 92,
      winners: [
        { rank: 1, name: 'Maria Oliveira', return: 32.4, xpAwarded: 2000 },
        { rank: 2, name: 'Carlos Silva', return: 28.1, xpAwarded: 1000 },
        { rank: 3, name: 'João Costa', return: 25.7, xpAwarded: 500 },
      ],
      userResult: {
        participated: true,
        rank: 8,
        return: 12.3,
        xpAwarded: 100,
      },
    },
    {
      id: '5',
      name: 'Torneio Semanal #45',
      type: 'weekly',
      status: 'completed',
      startDate: '2024-01-01T00:00:00',
      endDate: '2024-01-07T23:59:59',
      participants: 78,
      winners: [
        { rank: 1, name: 'Pedro Santos', return: 28.9, xpAwarded: 2000 },
        { rank: 2, name: 'Ana Rodrigues', return: 24.5, xpAwarded: 1000 },
        { rank: 3, name: 'Carlos Silva', return: 21.2, xpAwarded: 500 },
      ],
      userResult: {
        participated: false,
      },
    },
  ],
};

const userStats = {
  totalTournaments: 12,
  wins: 2,
  top3: 5,
  top10: 9,
  totalXpEarned: 8500,
  bestReturn: 32.4,
  avgReturn: 14.2,
  currentStreak: 3,
};

export default function Torneios() {
  const [selectedTournament, setSelectedTournament] = useState(mockTournaments.active[0]);

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Encerrado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h restantes`;
    if (hours > 0) return `${hours}h ${minutes}m restantes`;
    return `${minutes}m restantes`;
  };

  const getTimeUntilStart = (startDate: string) => {
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const diff = start - now;
    
    if (diff <= 0) return 'Iniciado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Inicia em ${days}d ${hours}h`;
    return `Inicia em ${hours}h`;
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="text-3xl font-bold">Torneios</h1>
              <p className="text-muted-foreground">Compita com outros traders e ganhe prêmios</p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vitórias</p>
                  <p className="text-2xl font-bold text-amber-500">{userStats.wins}</p>
                </div>
                <Crown className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top 3</p>
                  <p className="text-2xl font-bold">{userStats.top3}</p>
                </div>
                <Medal className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">XP Ganho</p>
                  <p className="text-2xl font-bold text-green-500">{userStats.totalXpEarned.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Melhor Retorno</p>
                  <p className="text-2xl font-bold text-green-500">+{userStats.bestReturn}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Em Andamento
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximos
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Encerrados
            </TabsTrigger>
          </TabsList>

          {/* Active Tournaments */}
          <TabsContent value="active">
            {mockTournaments.active.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum torneio em andamento no momento</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Tournament Details */}
                <div className="md:col-span-2 space-y-6">
                  {mockTournaments.active.map((tournament) => (
                    <Card key={tournament.id} className="border-primary/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 mb-2">
                              <Timer className="h-3 w-3 mr-1" />
                              Em Andamento
                            </Badge>
                            <CardTitle className="text-xl">{tournament.name}</CardTitle>
                            <CardDescription>{tournament.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Prêmio Total</p>
                            <p className="text-2xl font-bold text-amber-500">{tournament.prizePool.toLocaleString()} XP</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              <Users className="h-4 w-4 inline mr-1" />
                              {tournament.participants}/{tournament.maxParticipants} participantes
                            </span>
                            <span className="text-primary font-medium">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {getTimeRemaining(tournament.endDate)}
                            </span>
                          </div>
                          <Progress value={(tournament.participants / tournament.maxParticipants) * 100} />
                        </div>

                        {/* User Participation */}
                        {tournament.userParticipation?.isParticipating && (
                          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Sua Posição</p>
                                <p className="text-3xl font-bold">#{tournament.userParticipation.rank}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Seu Retorno</p>
                                <p className={`text-2xl font-bold ${tournament.userParticipation.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {tournament.userParticipation.return >= 0 ? '+' : ''}{tournament.userParticipation.return}%
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Trades</p>
                                <p className="text-2xl font-bold">{tournament.userParticipation.trades}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Leaderboard */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            Top 5
                          </h4>
                          <div className="space-y-2">
                            {tournament.topParticipants.map((participant, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    index === 0 ? 'bg-amber-500/20 text-amber-500' :
                                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                    index === 2 ? 'bg-orange-600/20 text-orange-600' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {participant.rank}
                                  </div>
                                  <span className="font-medium">{participant.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">{participant.trades} trades</span>
                                  <span className={`font-bold ${participant.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {participant.return >= 0 ? '+' : ''}{participant.return}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Prizes Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        Prêmios
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockTournaments.active[0]?.prizes.map((prize, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`text-2xl ${
                              index === 0 ? '' : index === 1 ? '' : index === 2 ? '' : 'opacity-50'
                            }`}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${prize.position}º`}
                            </div>
                            <div>
                              <p className="font-medium">{prize.position}º Lugar</p>
                              {prize.badge && (
                                <p className="text-xs text-muted-foreground">{prize.badge}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                            +{prize.xp} XP
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Regras
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p>• Saldo inicial: R$ 100.000 virtuais</p>
                      <p>• Opere qualquer ativo disponível</p>
                      <p>• Ranking baseado no retorno %</p>
                      <p>• Mínimo 5 trades para pontuar</p>
                      <p>• Alavancagem máxima: 2x</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Upcoming Tournaments */}
          <TabsContent value="upcoming">
            <div className="grid md:grid-cols-2 gap-6">
              {mockTournaments.upcoming.map((tournament) => (
                <Card key={tournament.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {getTimeUntilStart(tournament.startDate)}
                        </Badge>
                        <CardTitle>{tournament.name}</CardTitle>
                        <CardDescription>{tournament.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Prêmio Total</p>
                        <p className="text-xl font-bold text-amber-500">{tournament.prizePool.toLocaleString()} XP</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Taxa de Entrada</p>
                        <p className="text-xl font-bold">{tournament.entryFee} XP</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          {tournament.participants}/{tournament.maxParticipants} inscritos
                        </span>
                      </div>
                      <Progress value={(tournament.participants / tournament.maxParticipants) * 100} />
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <Zap className="h-4 w-4 mr-2" />
                        Inscrever-se
                      </Button>
                      <Button variant="outline">
                        Detalhes
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Tournaments */}
          <TabsContent value="completed">
            <div className="space-y-4">
              {mockTournaments.completed.map((tournament) => (
                <Card key={tournament.id}>
                  <CardContent className="py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <Trophy className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{tournament.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                            • {tournament.participants} participantes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Winners */}
                        <div className="flex -space-x-2">
                          {tournament.winners.slice(0, 3).map((winner, index) => (
                            <Avatar key={index} className="border-2 border-background">
                              <AvatarFallback className={`text-xs ${
                                index === 0 ? 'bg-amber-500/20' :
                                index === 1 ? 'bg-gray-400/20' :
                                'bg-orange-600/20'
                              }`}>
                                {winner.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>

                        {/* User Result */}
                        {tournament.userResult?.participated ? (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Sua posição</p>
                            <p className="font-bold">#{tournament.userResult.rank}</p>
                            <p className={`text-sm ${(tournament.userResult.return ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {(tournament.userResult.return ?? 0) >= 0 ? '+' : ''}{tournament.userResult.return ?? 0}%
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <XCircle className="h-3 w-3 mr-1" />
                            Não participou
                          </Badge>
                        )}

                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

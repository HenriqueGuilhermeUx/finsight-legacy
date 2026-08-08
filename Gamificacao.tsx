import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import LevelUpNotification, { useLevelUpNotification } from "@/components/LevelUpNotification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  Crown,
  Flame,
  Medal,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  LogIn,
  Loader2,
  ChevronRight,
  Gift,
  Users,
  BookOpen,
  Brain,
  Briefcase
} from "lucide-react";

const LEVEL_COLORS: Record<number, string> = {
  1: 'text-gray-400',
  2: 'text-emerald-400',
  3: 'text-blue-400',
  4: 'text-violet-400',
  5: 'text-amber-400',
  6: 'text-orange-400',
  7: 'text-red-400',
};

const LEVEL_BG_COLORS: Record<number, string> = {
  1: 'bg-gray-500/20',
  2: 'bg-emerald-500/20',
  3: 'bg-blue-500/20',
  4: 'bg-violet-500/20',
  5: 'bg-amber-500/20',
  6: 'bg-orange-500/20',
  7: 'bg-red-500/20',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  login: Calendar,
  quiz: Brain,
  portfolio: Briefcase,
  goals: Target,
  social: Users,
  exploration: TrendingUp,
  achievement: Award,
  bonus: Gift,
};

export default function Gamificacao() {
  const { user, loading: authLoading } = useAuth();
  const { notification, showLevelUp, hideLevelUp } = useLevelUpNotification();
  
  const { data: xpData, isLoading: xpLoading } = trpc.gamification.getXp.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: transactions } = trpc.gamification.getTransactions.useQuery(
    { limit: 20 },
    { enabled: !!user }
  );
  
  const { data: leaderboard } = trpc.gamification.getLeaderboard.useQuery(
    { limit: 10 }
  );
  
  const { data: badges } = trpc.gamification.getBadges.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const recordLoginMutation = trpc.gamification.recordLogin.useMutation();
  
  // Record login on page load
  useEffect(() => {
    if (user && !recordLoginMutation.isPending) {
      recordLoginMutation.mutate();
    }
  }, [user]);
  
  if (authLoading || xpLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <CardTitle>Sistema de Gamificação</CardTitle>
              <CardDescription>
                Faça login para acompanhar seu progresso, ganhar XP e desbloquear conquistas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <a href={getLoginUrl()}>
                <Button className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Fazer Login
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  const level = xpData?.level || 1;
  const levelName = xpData?.levelName || 'Iniciante';
  const totalXp = xpData?.totalXp || 0;
  const nextLevelXp = xpData?.nextLevelXp || 100;
  const xpProgress = nextLevelXp > 0 ? (totalXp / nextLevelXp) * 100 : 0;
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-500" />
              Gamificação
            </h1>
            <p className="text-muted-foreground mt-1">
              Ganhe XP, suba de nível e desbloqueie conquistas
            </p>
          </div>
        </div>
        
        {/* Level Card */}
        <Card className="mb-8 overflow-hidden">
          <div className={`h-2 ${LEVEL_BG_COLORS[level] || 'bg-gray-500/20'}`}>
            <div 
              className={`h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500`}
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${LEVEL_BG_COLORS[level] || 'bg-gray-500/20'}`}>
                  <Crown className={`h-10 w-10 ${LEVEL_COLORS[level] || 'text-gray-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${LEVEL_COLORS[level] || 'text-gray-400'}`}>
                      Nível {level}
                    </span>
                    <Badge className={`${LEVEL_BG_COLORS[level] || 'bg-gray-500/20'} ${LEVEL_COLORS[level] || 'text-gray-400'} border-0`}>
                      {levelName}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {totalXp.toLocaleString()} XP total
                  </p>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso para próximo nível</span>
                  <span className="font-medium">{totalXp} / {nextLevelXp} XP</span>
                </div>
                <Progress value={xpProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Faltam {nextLevelXp - totalXp} XP para o próximo nível
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2 text-amber-500">
                  <Flame className="h-5 w-5" />
                  <span className="text-2xl font-bold">{xpData?.loginStreak || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Dias seguidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Logins</p>
                  <p className="text-2xl font-bold">{xpData?.totalLogins || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes</p>
                  <p className="text-2xl font-bold">{xpData?.totalQuizzes || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Carteiras</p>
                  <p className="text-2xl font-bold">{xpData?.totalPortfolios || 0}</p>
                </div>
                <Briefcase className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Metas</p>
                  <p className="text-2xl font-bold">{xpData?.totalGoals || 0}</p>
                </div>
                <Target className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList>
            <TabsTrigger value="history">Histórico de XP</TabsTrigger>
            <TabsTrigger value="badges">Conquistas</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Histórico de XP
                </CardTitle>
                <CardDescription>
                  Suas últimas atividades que geraram XP
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((tx: any) => {
                      const Icon = CATEGORY_ICONS[tx.category] || Zap;
                      return (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{tx.description || tx.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                            +{tx.amount} XP
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma atividade registrada ainda</p>
                    <p className="text-sm">Explore a plataforma para ganhar XP!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Conquistas
                </CardTitle>
                <CardDescription>
                  Badges desbloqueados por suas atividades
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badges && badges.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {badges.map((ub: any) => (
                      <div key={ub.id} className="p-4 rounded-lg bg-muted/50 border border-amber-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-amber-500/20">
                            <Medal className="h-6 w-6 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-medium">{ub.badge?.name || ub.badgeId}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(ub.earnedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        {ub.badge?.description && (
                          <p className="text-sm text-muted-foreground">{ub.badge.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma conquista desbloqueada ainda</p>
                    <p className="text-sm">Continue usando a plataforma para desbloquear badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Ranking Global
                </CardTitle>
                <CardDescription>
                  Os usuários com mais XP na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard && leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.map((entry: any, index: number) => (
                      <div 
                        key={entry.userId} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          entry.userId === user?.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-amber-500/20 text-amber-500' :
                            index === 1 ? 'bg-gray-400/20 text-gray-400' :
                            index === 2 ? 'bg-orange-500/20 text-orange-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">
                              {entry.userName}
                              {entry.userId === user?.id && (
                                <Badge className="ml-2 bg-primary/20 text-primary border-0 text-xs">Você</Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Nível {entry.level} - {entry.levelName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{entry.totalXp.toLocaleString()} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ranking ainda não disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* How to Earn XP */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              Como Ganhar XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-cyan-500" />
                  <span className="font-medium">Login Diário</span>
                </div>
                <p className="text-sm text-muted-foreground">10-50 XP por dia (aumenta com streak)</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <span className="font-medium">Completar Quiz</span>
                </div>
                <p className="text-sm text-muted-foreground">30-100 XP por quiz (baseado na nota)</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">Criar Carteira</span>
                </div>
                <p className="text-sm text-muted-foreground">50 XP por carteira criada</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">Definir Meta</span>
                </div>
                <p className="text-sm text-muted-foreground">25 XP por meta + 100 XP ao atingir</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Explorar Páginas</span>
                </div>
                <p className="text-sm text-muted-foreground">10-30 XP por funcionalidade explorada</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Desbloquear Badge</span>
                </div>
                <p className="text-sm text-muted-foreground">25-200 XP por conquista</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Level Up Notification */}
      <LevelUpNotification
        isOpen={notification.isOpen}
        onClose={hideLevelUp}
        newLevel={notification.newLevel}
        levelName={notification.levelName}
        levelColor={notification.levelColor}
        xpGained={notification.xpGained}
        perks={notification.perks}
      />
    </MainLayout>
  );
}

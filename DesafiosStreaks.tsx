import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Target,
  Flame,
  Calendar,
  Trophy,
  Star,
  Zap,
  Gift,
  CheckCircle2,
  Clock,
  TrendingUp,
  Brain,
  Briefcase,
  Users,
  Search,
  LogIn,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const CHALLENGE_ICONS: Record<string, React.ElementType> = {
  analyze: Search,
  quiz: Brain,
  portfolio: Briefcase,
  explore: TrendingUp,
  social: Users,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-500/20 text-green-400",
  medium: "bg-amber-500/20 text-amber-400",
  hard: "bg-red-500/20 text-red-400",
};

// Generate calendar days for a month
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days: (number | null)[] = [];
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  return days;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function DesafiosStreaks() {
  const { user, loading: authLoading } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const { data: challenges, isLoading: challengesLoading } = trpc.dailyChallenges.today.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: streak } = trpc.streaks.get.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: streakHistory } = trpc.streaks.history.useQuery(
    { days: 90 },
    { enabled: !!user }
  );
  
  const recordLoginMutation = trpc.streaks.recordLogin.useMutation();
  
  // Record login on page load
  useEffect(() => {
    if (user && !recordLoginMutation.isPending) {
      recordLoginMutation.mutate();
    }
  }, [user]);
  
  const calendarDays = generateCalendarDays(currentYear, currentMonth);
  
  // Create a set of logged in dates for quick lookup
  const loggedInDates = new Set(
    streakHistory?.map(h => h.date) || []
  );
  
  const today = new Date().toISOString().split('T')[0];
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
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
            <CardContent className="pt-6 text-center">
              <Flame className="h-16 w-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-xl font-bold mb-2">Faça login para acessar</h2>
              <p className="text-muted-foreground mb-4">
                Acompanhe seus desafios diários e mantenha sua sequência de acessos!
              </p>
              <Button asChild>
                <a href={getLoginUrl()}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  const completedChallenges = challenges?.filter(c => c.completed).length || 0;
  const totalChallenges = challenges?.length || 0;
  const allCompleted = completedChallenges === totalChallenges && totalChallenges > 0;
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Flame className="h-8 w-8 text-orange-500" />
            Desafios & Streaks
          </h1>
          <p className="text-muted-foreground">
            Complete desafios diários e mantenha sua sequência de acessos para ganhar XP bônus!
          </p>
        </div>
        
        {/* Streak Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sequência Atual</p>
                  <p className="text-4xl font-bold text-orange-500">
                    {streak?.currentStreak || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">dias seguidos</p>
                </div>
                <Flame className="h-12 w-12 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maior Sequência</p>
                  <p className="text-4xl font-bold text-primary">
                    {streak?.longestStreak || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">recorde pessoal</p>
                </div>
                <Trophy className="h-12 w-12 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Multiplicador XP</p>
                  <p className="text-4xl font-bold text-green-500">
                    {streak?.streakMultiplier || "1.00"}x
                  </p>
                  <p className="text-xs text-muted-foreground">bônus ativo</p>
                </div>
                <Zap className="h-12 w-12 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Logins</p>
                  <p className="text-4xl font-bold text-blue-500">
                    {streak?.totalLogins || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">desde o início</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="challenges" className="gap-2">
              <Target className="h-4 w-4" />
              Desafios Diários
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendário de Streaks
            </TabsTrigger>
            <TabsTrigger value="milestones" className="gap-2">
              <Gift className="h-4 w-4" />
              Recompensas
            </TabsTrigger>
          </TabsList>
          
          {/* Daily Challenges Tab */}
          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Desafios de Hoje
                    </CardTitle>
                    <CardDescription>
                      Complete desafios para ganhar XP extra
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {completedChallenges}/{totalChallenges}
                    </p>
                    <p className="text-xs text-muted-foreground">completados</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <Progress 
                  value={(completedChallenges / Math.max(totalChallenges, 1)) * 100} 
                  className="h-2 mt-4"
                />
                
                {allCompleted && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-500">Todos os desafios completados!</p>
                      <p className="text-xs text-muted-foreground">Volte amanhã para novos desafios</p>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : challenges && challenges.length > 0 ? (
                  <div className="space-y-4">
                    {challenges.map((challenge: any) => {
                      const Icon = CHALLENGE_ICONS[challenge.type] || Target;
                      const progress = Math.min((challenge.progress / challenge.target) * 100, 100);
                      
                      return (
                        <div 
                          key={challenge.id}
                          className={`p-4 rounded-lg border ${
                            challenge.completed 
                              ? 'bg-green-500/10 border-green-500/30' 
                              : 'bg-muted/50 border-border'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${
                              challenge.completed ? 'bg-green-500/20' : 'bg-primary/10'
                            }`}>
                              {challenge.completed ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              ) : (
                                <Icon className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{challenge.title}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge className={DIFFICULTY_COLORS[challenge.difficulty]}>
                                    {challenge.difficulty === 'easy' ? 'Fácil' : 
                                     challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                                  </Badge>
                                  <Badge variant="outline" className="gap-1">
                                    <Star className="h-3 w-3" />
                                    {challenge.xpReward} XP
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {challenge.description}
                              </p>
                              
                              <div className="flex items-center gap-3">
                                <Progress value={progress} className="flex-1 h-2" />
                                <span className="text-sm font-medium min-w-[60px] text-right">
                                  {challenge.progress}/{challenge.target}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum desafio disponível no momento</p>
                    <p className="text-sm">Novos desafios serão adicionados em breve!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Calendário de Acessos
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[150px] text-center font-medium">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </span>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isLoggedIn = loggedInDates.has(dateStr);
                    const isToday = dateStr === today;
                    const isFuture = dateStr > today;
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          isToday 
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                            : ''
                        } ${
                          isLoggedIn 
                            ? 'bg-green-500 text-white' 
                            : isFuture 
                              ? 'bg-muted/30 text-muted-foreground' 
                              : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {isLoggedIn ? (
                          <Flame className="h-5 w-5" />
                        ) : (
                          day
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span className="text-sm text-muted-foreground">Acessou</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted/50" />
                    <span className="text-sm text-muted-foreground">Não acessou</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded ring-2 ring-primary" />
                    <span className="text-sm text-muted-foreground">Hoje</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Recompensas de Sequência
                </CardTitle>
                <CardDescription>
                  Mantenha sua sequência para desbloquear recompensas especiais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { days: 3, name: "Iniciante", xp: 50, multiplier: 0, unlocked: (streak?.longestStreak || 0) >= 3 },
                    { days: 7, name: "Dedicado", xp: 100, multiplier: 0.1, badge: "streak_7", unlocked: (streak?.longestStreak || 0) >= 7 },
                    { days: 14, name: "Comprometido", xp: 200, multiplier: 0.15, unlocked: (streak?.longestStreak || 0) >= 14 },
                    { days: 30, name: "Consistente", xp: 500, multiplier: 0.2, badge: "streak_30", unlocked: (streak?.longestStreak || 0) >= 30 },
                    { days: 60, name: "Veterano", xp: 1000, multiplier: 0.3, unlocked: (streak?.longestStreak || 0) >= 60 },
                    { days: 100, name: "Lendário", xp: 2000, multiplier: 0.5, badge: "streak_100", unlocked: (streak?.longestStreak || 0) >= 100 },
                    { days: 365, name: "Imortal", xp: 10000, multiplier: 1.0, badge: "streak_365", unlocked: (streak?.longestStreak || 0) >= 365 },
                  ].map((milestone) => (
                    <div 
                      key={milestone.days}
                      className={`p-4 rounded-lg border flex items-center justify-between ${
                        milestone.unlocked 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          milestone.unlocked ? 'bg-green-500/20' : 'bg-muted'
                        }`}>
                          {milestone.unlocked ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Flame className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {milestone.name}
                            {milestone.badge && (
                              <Badge variant="outline" className="text-xs">
                                +Badge
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {milestone.days} dias consecutivos
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Badge className="bg-amber-500/20 text-amber-400">
                            +{milestone.xp} XP
                          </Badge>
                          {milestone.multiplier > 0 && (
                            <Badge className="bg-green-500/20 text-green-400">
                              +{(milestone.multiplier * 100).toFixed(0)}% mult.
                            </Badge>
                          )}
                        </div>
                        {!milestone.unlocked && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Faltam {milestone.days - (streak?.currentStreak || 0)} dias
                          </p>
                        )}
                      </div>
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

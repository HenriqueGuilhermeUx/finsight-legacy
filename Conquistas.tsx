import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Trophy,
  Star,
  Zap,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Crown,
  Flame,
  Medal,
  Gift,
  Lock,
  Check,
  Sparkles,
  Rocket,
  Shield,
  Heart,
  DollarSign,
  BarChart3,
  Calendar,
  MessageSquare,
  Share2,
  Eye,
} from "lucide-react";

// Badge definitions
const allBadges = [
  // Trading badges
  {
    id: 1,
    code: "first_trade",
    name: "Primeira Operação",
    description: "Complete sua primeira operação no simulador",
    icon: Zap,
    category: "trading",
    rarity: "common",
    xpReward: 50,
    earned: true,
    earnedAt: "2024-01-15",
  },
  {
    id: 2,
    code: "profit_master",
    name: "Mestre do Lucro",
    description: "Obtenha 10% de retorno em uma única operação",
    icon: TrendingUp,
    category: "trading",
    rarity: "uncommon",
    xpReward: 100,
    earned: true,
    earnedAt: "2024-02-20",
  },
  {
    id: 3,
    code: "hundred_trades",
    name: "Centurião",
    description: "Complete 100 operações no simulador",
    icon: Medal,
    category: "trading",
    rarity: "rare",
    xpReward: 250,
    earned: true,
    earnedAt: "2024-03-10",
  },
  {
    id: 4,
    code: "diamond_hands",
    name: "Mãos de Diamante",
    description: "Mantenha uma posição por mais de 30 dias",
    icon: Shield,
    category: "trading",
    rarity: "rare",
    xpReward: 200,
    earned: false,
    progress: 65,
  },
  {
    id: 5,
    code: "portfolio_king",
    name: "Rei do Portfólio",
    description: "Alcance R$ 1.000.000 em valor de portfólio",
    icon: Crown,
    category: "trading",
    rarity: "legendary",
    xpReward: 1000,
    earned: false,
    progress: 45,
  },
  // Social badges
  {
    id: 6,
    code: "social_butterfly",
    name: "Borboleta Social",
    description: "Siga 10 traders diferentes",
    icon: Users,
    category: "social",
    rarity: "common",
    xpReward: 50,
    earned: true,
    earnedAt: "2024-01-20",
  },
  {
    id: 7,
    code: "influencer",
    name: "Influenciador",
    description: "Tenha 100 seguidores no seu portfólio",
    icon: Star,
    category: "social",
    rarity: "epic",
    xpReward: 500,
    earned: false,
    progress: 23,
  },
  {
    id: 8,
    code: "chat_champion",
    name: "Campeão do Chat",
    description: "Envie 500 mensagens no chat",
    icon: MessageSquare,
    category: "social",
    rarity: "uncommon",
    xpReward: 100,
    earned: false,
    progress: 78,
  },
  {
    id: 9,
    code: "referral_master",
    name: "Mestre das Indicações",
    description: "Indique 10 amigos para a plataforma",
    icon: Share2,
    category: "social",
    rarity: "rare",
    xpReward: 300,
    earned: false,
    progress: 40,
  },
  // Learning badges
  {
    id: 10,
    code: "first_analysis",
    name: "Analista Iniciante",
    description: "Complete sua primeira análise fundamentalista",
    icon: BookOpen,
    category: "learning",
    rarity: "common",
    xpReward: 50,
    earned: true,
    earnedAt: "2024-01-10",
  },
  {
    id: 11,
    code: "backtest_pro",
    name: "Mestre do Backtest",
    description: "Execute 50 backtests de estratégias",
    icon: BarChart3,
    category: "learning",
    rarity: "uncommon",
    xpReward: 150,
    earned: true,
    earnedAt: "2024-02-28",
  },
  {
    id: 12,
    code: "screener_expert",
    name: "Expert em Screener",
    description: "Use o screener com 10 filtros diferentes",
    icon: Eye,
    category: "learning",
    rarity: "uncommon",
    xpReward: 100,
    earned: false,
    progress: 60,
  },
  // Milestone badges
  {
    id: 13,
    code: "early_adopter",
    name: "Early Adopter",
    description: "Seja um dos primeiros 1000 usuários",
    icon: Rocket,
    category: "milestone",
    rarity: "epic",
    xpReward: 500,
    earned: true,
    earnedAt: "2024-01-01",
  },
  {
    id: 14,
    code: "streak_7",
    name: "Sequência de 7 Dias",
    description: "Acesse a plataforma por 7 dias consecutivos",
    icon: Flame,
    category: "milestone",
    rarity: "common",
    xpReward: 75,
    earned: true,
    earnedAt: "2024-01-22",
  },
  {
    id: 15,
    code: "streak_30",
    name: "Sequência de 30 Dias",
    description: "Acesse a plataforma por 30 dias consecutivos",
    icon: Flame,
    category: "milestone",
    rarity: "rare",
    xpReward: 300,
    earned: false,
    progress: 53,
  },
  {
    id: 16,
    code: "top_10",
    name: "Top 10 do Mês",
    description: "Fique entre os 10 melhores do leaderboard",
    icon: Trophy,
    category: "milestone",
    rarity: "legendary",
    xpReward: 1000,
    earned: false,
    progress: 0,
  },
];

// Level thresholds
const levels = [
  { level: 1, xpRequired: 0, title: "Iniciante" },
  { level: 2, xpRequired: 100, title: "Aprendiz" },
  { level: 3, xpRequired: 300, title: "Trader" },
  { level: 4, xpRequired: 600, title: "Investidor" },
  { level: 5, xpRequired: 1000, title: "Analista" },
  { level: 6, xpRequired: 1500, title: "Especialista" },
  { level: 7, xpRequired: 2200, title: "Expert" },
  { level: 8, xpRequired: 3000, title: "Mestre" },
  { level: 9, xpRequired: 4000, title: "Guru" },
  { level: 10, xpRequired: 5500, title: "Lenda" },
];

const rarityColors: Record<string, string> = {
  common: "bg-slate-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
};

const rarityLabels: Record<string, string> = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export default function Conquistas() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock user stats
  const userStats = {
    level: 5,
    currentXp: 1250,
    totalXp: 1250,
    earnedBadges: 8,
    totalBadges: allBadges.length,
    currentStreak: 16,
    longestStreak: 23,
  };

  const currentLevel = levels.find((l) => l.level === userStats.level)!;
  const nextLevel = levels.find((l) => l.level === userStats.level + 1);
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0;
  const xpProgress = nextLevel
    ? ((userStats.currentXp - currentLevel.xpRequired) / xpForNextLevel) * 100
    : 100;

  const filteredBadges =
    selectedCategory === "all"
      ? allBadges
      : allBadges.filter((b) => b.category === selectedCategory);

  const earnedBadges = filteredBadges.filter((b) => b.earned);
  const lockedBadges = filteredBadges.filter((b) => !b.earned);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-amber-500" />
              <h2 className="text-2xl font-bold mb-2">Conquistas e Badges</h2>
              <p className="text-muted-foreground mb-6">
                Faça login para desbloquear conquistas, ganhar XP e subir de nível!
              </p>
              <a href={getLoginUrl()}>
                <Button size="lg">Entrar para Conquistar</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Conquistas</h1>
        </div>

        {/* User Level Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-amber-500/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level Progress */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                      <span className="text-3xl font-bold text-black">{userStats.level}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                      <Crown className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold">{currentLevel.title}</span>
                      <Badge variant="outline" className="text-xs">
                        Nível {userStats.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>{userStats.totalXp.toLocaleString()} XP total</span>
                    </div>
                    {nextLevel && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progresso para Nível {nextLevel.level}</span>
                          <span>
                            {userStats.currentXp - currentLevel.xpRequired} / {xpForNextLevel} XP
                          </span>
                        </div>
                        <Progress value={xpProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <Award className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{userStats.earnedBadges}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                  <div className="text-2xl font-bold">{userStats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Dias Seguidos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="trading" onClick={() => setSelectedCategory("trading")}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="social" onClick={() => setSelectedCategory("social")}>
              <Users className="h-4 w-4 mr-1" />
              Social
            </TabsTrigger>
            <TabsTrigger value="learning" onClick={() => setSelectedCategory("learning")}>
              <BookOpen className="h-4 w-4 mr-1" />
              Aprendizado
            </TabsTrigger>
            <TabsTrigger value="milestone" onClick={() => setSelectedCategory("milestone")}>
              <Target className="h-4 w-4 mr-1" />
              Marcos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Conquistados ({earnedBadges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card key={badge.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-20 h-20 ${rarityColors[badge.rarity]} opacity-10 rounded-bl-full`} />
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg ${rarityColors[badge.rarity]}/20`}>
                          <Icon className={`h-6 w-6 ${badge.rarity === "legendary" ? "text-amber-500" : badge.rarity === "epic" ? "text-purple-500" : badge.rarity === "rare" ? "text-blue-500" : badge.rarity === "uncommon" ? "text-green-500" : "text-slate-400"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{badge.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-xs ${rarityColors[badge.rarity]}/20`}>
                              {rarityLabels[badge.rarity]}
                            </Badge>
                            <span className="text-xs text-amber-500 flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              +{badge.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Conquistado em {new Date(badge.earnedAt!).toLocaleDateString("pt-BR")}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Bloqueados ({lockedBadges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {lockedBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card key={badge.id} className="relative overflow-hidden opacity-75">
                    <div className={`absolute top-0 right-0 w-20 h-20 ${rarityColors[badge.rarity]} opacity-5 rounded-bl-full`} />
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-lg bg-muted">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{badge.name}</span>
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {rarityLabels[badge.rarity]}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              +{badge.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </div>
                      {badge.progress !== undefined && badge.progress > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progresso</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-1.5" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Levels Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Guia de Níveis
            </CardTitle>
            <CardDescription>
              Ganhe XP completando conquistas e suba de nível para desbloquear recompensas exclusivas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {levels.map((level) => (
                <div
                  key={level.level}
                  className={`p-3 rounded-lg text-center ${
                    level.level <= userStats.level
                      ? "bg-primary/20 border border-primary/40"
                      : "bg-muted"
                  }`}
                >
                  <div className={`text-lg font-bold ${level.level <= userStats.level ? "text-primary" : "text-muted-foreground"}`}>
                    {level.level}
                  </div>
                  <div className="text-xs truncate">{level.title}</div>
                  <div className="text-xs text-muted-foreground">{level.xpRequired} XP</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

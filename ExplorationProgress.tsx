import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  TrendingUp,
  Briefcase,
  Target,
  BarChart3,
  Calculator,
  BookOpen,
  GraduationCap,
  Brain,
  Bell,
  Trophy,
  Users,
  PieChart,
  Check,
  ChevronRight,
  Sparkles,
  Star,
  Rocket
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  path: string;
  xp: number;
}

const FEATURES: Feature[] = [
  { id: 'radar', name: 'Radar de Ativos', description: 'Explorar o radar', icon: TrendingUp, path: '/radar', xp: 10 },
  { id: 'simulador', name: 'Simulador de Carteira', description: 'Criar uma carteira', icon: Briefcase, path: '/simulador', xp: 20 },
  { id: 'metas', name: 'Metas Financeiras', description: 'Definir uma meta', icon: Target, path: '/metas', xp: 15 },
  { id: 'fundamentalista', name: 'Análise Fundamentalista', description: 'Analisar uma empresa', icon: BarChart3, path: '/fundamentalista', xp: 15 },
  { id: 'valuation', name: 'Valuation', description: 'Calcular preço justo', icon: Calculator, path: '/valuation', xp: 20 },
  { id: 'glossario', name: 'Glossário', description: 'Consultar termos', icon: BookOpen, path: '/glossario', xp: 10 },
  { id: 'cursos', name: 'Cursos', description: 'Iniciar um curso', icon: GraduationCap, path: '/cursos', xp: 25 },
  { id: 'quiz', name: 'Quiz', description: 'Completar um quiz', icon: Brain, path: '/quiz', xp: 30 },
  { id: 'sinais', name: 'Sinais Técnicos', description: 'Ver sinais', icon: Bell, path: '/sinais', xp: 10 },
  { id: 'ranking', name: 'Ranking Semanal', description: 'Ver rankings', icon: Trophy, path: '/ranking-semanal', xp: 10 },
  { id: 'comunidade', name: 'Comunidade', description: 'Visitar fórum', icon: Users, path: '/comunidade', xp: 15 },
  { id: 'dashboard', name: 'Dashboard Geral', description: 'Ver dashboard', icon: PieChart, path: '/dashboard-geral', xp: 10 },
];

const LEVELS = [
  { level: 1, name: 'Iniciante', minXp: 0, maxXp: 50, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
  { level: 2, name: 'Aprendiz', minXp: 50, maxXp: 100, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { level: 3, name: 'Intermediário', minXp: 100, maxXp: 150, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { level: 4, name: 'Avançado', minXp: 150, maxXp: 200, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  { level: 5, name: 'Expert', minXp: 200, maxXp: 999, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
];

export default function ExplorationProgress() {
  const [visitedFeatures, setVisitedFeatures] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('exploration_progress');
    if (saved) {
      const { visited, xp } = JSON.parse(saved);
      setVisitedFeatures(visited || []);
      setTotalXp(xp || 0);
    }
  }, []);

  // Track current page visit
  useEffect(() => {
    const currentPath = window.location.pathname;
    const feature = FEATURES.find(f => currentPath.startsWith(f.path));
    
    if (feature && !visitedFeatures.includes(feature.id)) {
      const newVisited = [...visitedFeatures, feature.id];
      const newXp = totalXp + feature.xp;
      
      setVisitedFeatures(newVisited);
      setTotalXp(newXp);
      
      localStorage.setItem('exploration_progress', JSON.stringify({
        visited: newVisited,
        xp: newXp
      }));
    }
  }, []);

  const progress = (visitedFeatures.length / FEATURES.length) * 100;
  const currentLevel = LEVELS.find(l => totalXp >= l.minXp && totalXp < l.maxXp) || LEVELS[LEVELS.length - 1];
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const xpToNextLevel = nextLevel ? nextLevel.minXp - totalXp : 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Rocket className="h-5 w-5 text-cyan-500" />
            Progresso de Exploração
          </CardTitle>
          <Badge className={`${currentLevel.bgColor} ${currentLevel.color} border-0`}>
            <Star className="h-3 w-3 mr-1" />
            Nível {currentLevel.level} - {currentLevel.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">XP Total</span>
            <span className="font-medium">{totalXp} XP</span>
          </div>
          <Progress value={(totalXp % 50) * 2} className="h-2" />
          {nextLevel && (
            <p className="text-xs text-muted-foreground">
              Faltam {xpToNextLevel} XP para o nível {nextLevel.name}
            </p>
          )}
        </div>

        {/* Features Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Funcionalidades Exploradas</span>
            <span className="font-medium">{visitedFeatures.length}/{FEATURES.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
          {FEATURES.map((feature) => {
            const isVisited = visitedFeatures.includes(feature.id);
            return (
              <Link key={feature.id} href={feature.path}>
                <div
                  className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                    isVisited
                      ? 'bg-emerald-500/20 border border-emerald-500/30'
                      : 'bg-muted/50 hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <feature.icon className={`h-5 w-5 mx-auto ${isVisited ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                    {isVisited && (
                      <Check className="h-3 w-3 text-emerald-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <p className={`text-xs mt-1 truncate ${isVisited ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {feature.name.split(' ')[0]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Next Suggestion */}
        {visitedFeatures.length < FEATURES.length && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Próxima sugestão:</p>
            {(() => {
              const nextFeature = FEATURES.find(f => !visitedFeatures.includes(f.id));
              if (!nextFeature) return null;
              return (
                <Link href={nextFeature.path}>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <nextFeature.icon className="h-4 w-4" />
                      {nextFeature.description}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      +{nextFeature.xp} XP
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              );
            })()}
          </div>
        )}

        {/* Completion Badge */}
        {visitedFeatures.length === FEATURES.length && (
          <div className="pt-2 border-t border-border/50 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
              <Trophy className="h-5 w-5 text-amber-400" />
              <span className="text-amber-400 font-medium">Explorador Completo!</span>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

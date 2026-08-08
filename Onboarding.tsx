import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import {
  TrendingUp,
  BarChart3,
  Target,
  Bell,
  BookOpen,
  Briefcase,
  LineChart,
  Calculator,
  Trophy,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Rocket,
  GraduationCap,
  PieChart,
  Zap,
  Shield,
  Star,
  ArrowRight,
  X,
  Play,
  Home
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  link: string;
  linkText: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Bem-vindo ao F-Insight!",
    description: "Sua plataforma completa de análise financeira. Vamos fazer um tour rápido pelas principais funcionalidades.",
    icon: Rocket,
    color: "bg-gradient-to-br from-cyan-500 to-blue-600",
    features: [
      "Análise de ações, FIIs, BDRs e ETFs",
      "Sinais técnicos em tempo real",
      "Simulador de carteira avançado",
      "Conteúdo educacional completo"
    ],
    link: "/",
    linkText: "Explorar Home"
  },
  {
    id: 2,
    title: "Radar de Ativos",
    description: "Encontre oportunidades de investimento com nosso radar inteligente. Filtre por setor, indicadores e sinais técnicos.",
    icon: TrendingUp,
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    features: [
      "Busca por ticker ou nome",
      "Filtros por setor e tipo",
      "Indicadores fundamentalistas",
      "Sinais de compra/venda"
    ],
    link: "/radar",
    linkText: "Acessar Radar"
  },
  {
    id: 3,
    title: "Sinais Técnicos",
    description: "Receba alertas automáticos quando nosso algoritmo detectar oportunidades de compra ou venda forte.",
    icon: Zap,
    color: "bg-gradient-to-br from-amber-500 to-orange-600",
    features: [
      "Análise de RSI, MACD, Médias Móveis",
      "Classificação de força do sinal",
      "Histórico de acertos",
      "Alertas por email"
    ],
    link: "/sinais",
    linkText: "Ver Sinais"
  },
  {
    id: 4,
    title: "Simulador de Carteira",
    description: "Monte sua carteira virtual e acompanhe a evolução do patrimônio com gráficos detalhados.",
    icon: Briefcase,
    color: "bg-gradient-to-br from-violet-500 to-purple-600",
    features: [
      "Adicione ações, FIIs, BDRs e ETFs",
      "Gráficos de alocação por tipo e setor",
      "Projeção de dividendos",
      "Salve múltiplas carteiras"
    ],
    link: "/simulador",
    linkText: "Criar Carteira"
  },
  {
    id: 5,
    title: "Metas Financeiras",
    description: "Defina objetivos de patrimônio, dividendos ou rentabilidade e acompanhe seu progresso.",
    icon: Target,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    features: [
      "Metas de patrimônio total",
      "Metas de dividendos mensais",
      "Milestones intermediários",
      "Alertas de meta atingida"
    ],
    link: "/metas",
    linkText: "Definir Metas"
  },
  {
    id: 6,
    title: "Análise Fundamentalista",
    description: "Avalie empresas com indicadores como P/L, P/VP, ROE, ROIC, margens e muito mais.",
    icon: BarChart3,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    features: [
      "Balanço patrimonial",
      "Demonstração de resultados",
      "Indicadores de rentabilidade",
      "Comparativo setorial"
    ],
    link: "/fundamentalista",
    linkText: "Analisar Empresa"
  },
  {
    id: 7,
    title: "Valuation Automatizado",
    description: "Calcule o preço justo de ações usando métodos consagrados como DCF, Graham e Bazin.",
    icon: Calculator,
    color: "bg-gradient-to-br from-teal-500 to-cyan-600",
    features: [
      "Fluxo de Caixa Descontado (DCF)",
      "Fórmula de Benjamin Graham",
      "Método Décio Bazin",
      "Fórmula de Peter Lynch"
    ],
    link: "/valuation",
    linkText: "Calcular Valuation"
  },
  {
    id: 8,
    title: "Conteúdo Educacional",
    description: "Aprenda sobre investimentos com nosso glossário, cursos e quiz interativo.",
    icon: GraduationCap,
    color: "bg-gradient-to-br from-yellow-500 to-amber-600",
    features: [
      "Glossário com 40+ termos",
      "3 cursos completos",
      "Quiz com conquistas",
      "Ranking de conhecimento"
    ],
    link: "/cursos",
    linkText: "Começar a Aprender"
  },
  {
    id: 9,
    title: "Dashboard Consolidado",
    description: "Visualize tudo em um só lugar: patrimônio, metas, dividendos e alertas.",
    icon: PieChart,
    color: "bg-gradient-to-br from-red-500 to-pink-600",
    features: [
      "Resumo do patrimônio total",
      "Progresso das metas",
      "Próximos dividendos",
      "Export de dados"
    ],
    link: "/dashboard-geral",
    linkText: "Ver Dashboard"
  },
  {
    id: 10,
    title: "Pronto para Começar!",
    description: "Você completou o tour! Agora é hora de explorar e começar sua jornada de investimentos.",
    icon: Trophy,
    color: "bg-gradient-to-br from-amber-400 to-yellow-500",
    features: [
      "Crie sua primeira carteira",
      "Defina suas metas financeiras",
      "Explore os sinais técnicos",
      "Faça o quiz de conhecimento"
    ],
    link: "/",
    linkText: "Ir para Home"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onboarding_progress');
    if (saved) {
      const { step, completed } = JSON.parse(saved);
      setCurrentStep(step);
      setCompletedSteps(completed);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding_progress', JSON.stringify({
      step: currentStep,
      completed: completedSteps
    }));
  }, [currentStep, completedSteps]);

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const goToNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setLocation('/');
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setCompletedSteps(ONBOARDING_STEPS.map(s => s.id));
    setLocation('/');
  };

  const restartOnboarding = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    localStorage.removeItem('onboarding_progress');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">F-Insight</h1>
                <p className="text-sm text-muted-foreground">Tour de Boas-Vindas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {currentStep + 1} de {ONBOARDING_STEPS.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={skipOnboarding}>
                <X className="h-4 w-4 mr-1" />
                Pular
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container py-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {ONBOARDING_STEPS.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground scale-110'
                  : completedSteps.includes(index)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {completedSteps.includes(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl">
            {/* Step Header */}
            <div className={`${step.color} p-8 text-white`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <step.icon className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{step.title}</h2>
                  <p className="text-white/80 mt-1">{step.description}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {step.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex justify-center mb-8">
                <Link href={step.link}>
                  <Button size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    {step.linkText}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={goToPrev}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={restartOnboarding}>
                    Reiniciar Tour
                  </Button>
                </div>

                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  <Button onClick={completeOnboarding} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Check className="h-4 w-4" />
                    Concluir Tour
                  </Button>
                ) : (
                  <Button onClick={goToNext} className="gap-2">
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link href="/radar">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="font-medium text-sm">Radar de Ativos</div>
                    <div className="text-xs text-muted-foreground">Encontre oportunidades</div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/simulador">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-violet-500" />
                  <div>
                    <div className="font-medium text-sm">Simulador</div>
                    <div className="text-xs text-muted-foreground">Monte sua carteira</div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/cursos">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="font-medium text-sm">Cursos</div>
                    <div className="text-xs text-muted-foreground">Aprenda a investir</div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4">
        <div className="container">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>© 2024 F-Insight. Todos os direitos reservados.</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground">
                <Home className="h-4 w-4" />
              </Link>
              {user && (
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Logado como {user.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { 
  Brain, 
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Target,
  Zap,
  Clock,
  BookOpen,
  TrendingUp,
  BarChart3,
  Crown,
  Medal,
  Flame,
  Users,
  LogIn
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'basico' | 'indicadores' | 'analise' | 'avancado';
  difficulty: 'facil' | 'medio' | 'dificil';
}

const QUESTIONS: Question[] = [
  // Básico - Fácil
  {
    id: 1,
    question: 'O que é uma ação?',
    options: [
      'Um empréstimo que você faz para uma empresa',
      'Uma fração do capital social de uma empresa',
      'Um título de renda fixa',
      'Uma moeda digital'
    ],
    correctIndex: 1,
    explanation: 'Uma ação representa uma fração do capital social de uma empresa. Ao comprar ações, você se torna sócio da empresa.',
    category: 'basico',
    difficulty: 'facil',
  },
  {
    id: 2,
    question: 'O que são dividendos?',
    options: [
      'Taxas cobradas pela corretora',
      'Juros pagos por títulos públicos',
      'Parte do lucro distribuída aos acionistas',
      'Multas por vender ações'
    ],
    correctIndex: 2,
    explanation: 'Dividendos são a parte do lucro líquido que a empresa distribui aos seus acionistas. No Brasil, empresas são obrigadas a distribuir no mínimo 25% do lucro.',
    category: 'basico',
    difficulty: 'facil',
  },
  {
    id: 3,
    question: 'O que é um FII?',
    options: [
      'Fundo de Investimento Internacional',
      'Fundo de Investimento Imobiliário',
      'Fundo de Índice Inflacionário',
      'Fundo de Investimento em Infraestrutura'
    ],
    correctIndex: 1,
    explanation: 'FII significa Fundo de Investimento Imobiliário. São fundos que investem em imóveis ou títulos imobiliários e distribuem 95% dos rendimentos aos cotistas.',
    category: 'basico',
    difficulty: 'facil',
  },
  {
    id: 4,
    question: 'O que é a B3?',
    options: [
      'Um banco digital',
      'Uma criptomoeda brasileira',
      'A bolsa de valores do Brasil',
      'Uma corretora de valores'
    ],
    correctIndex: 2,
    explanation: 'B3 (Brasil, Bolsa, Balcão) é a única bolsa de valores do Brasil, onde são negociadas ações, FIIs, ETFs e derivativos.',
    category: 'basico',
    difficulty: 'facil',
  },
  {
    id: 5,
    question: 'O que significa BDR?',
    options: [
      'Brazilian Depositary Receipt',
      'Bolsa de Depósitos e Rendimentos',
      'Banco de Dados de Rendimentos',
      'Bônus de Dividendos Reinvestidos'
    ],
    correctIndex: 0,
    explanation: 'BDR (Brazilian Depositary Receipt) são certificados que representam ações de empresas estrangeiras negociadas na B3.',
    category: 'basico',
    difficulty: 'facil',
  },
  // Indicadores - Médio
  {
    id: 6,
    question: 'O que indica um P/L de 10?',
    options: [
      'A empresa vale 10x seu patrimônio',
      'A empresa vale 10x seu lucro anual',
      'A empresa paga 10% de dividendos',
      'A ação subiu 10%'
    ],
    correctIndex: 1,
    explanation: 'P/L (Preço/Lucro) de 10 significa que o preço da ação é 10 vezes o lucro por ação. Ou seja, levaria 10 anos para recuperar o investimento apenas com lucros.',
    category: 'indicadores',
    difficulty: 'medio',
  },
  {
    id: 7,
    question: 'O que é o Dividend Yield?',
    options: [
      'Valor total de dividendos pagos',
      'Percentual de dividendos em relação ao preço da ação',
      'Crescimento dos dividendos',
      'Número de dividendos pagos no ano'
    ],
    correctIndex: 1,
    explanation: 'Dividend Yield é o percentual que os dividendos representam em relação ao preço atual da ação. Um DY de 6% significa que você recebe 6% do valor investido em dividendos por ano.',
    category: 'indicadores',
    difficulty: 'medio',
  },
  {
    id: 8,
    question: 'O que significa P/VP menor que 1?',
    options: [
      'Empresa está supervalorizada',
      'Empresa está sendo negociada abaixo do seu patrimônio',
      'Empresa tem prejuízo',
      'Empresa não paga dividendos'
    ],
    correctIndex: 1,
    explanation: 'P/VP (Preço/Valor Patrimonial) menor que 1 indica que a empresa está sendo negociada abaixo do seu valor patrimonial contábil, podendo indicar oportunidade.',
    category: 'indicadores',
    difficulty: 'medio',
  },
  {
    id: 9,
    question: 'ROE de 20% significa:',
    options: [
      'A empresa cresceu 20%',
      'A empresa retorna 20% sobre o patrimônio líquido',
      'A ação subiu 20%',
      'A empresa distribui 20% do lucro'
    ],
    correctIndex: 1,
    explanation: 'ROE (Return on Equity) de 20% significa que a empresa gera 20% de lucro sobre seu patrimônio líquido. É uma medida de eficiência na geração de valor.',
    category: 'indicadores',
    difficulty: 'medio',
  },
  {
    id: 10,
    question: 'O que é margem líquida?',
    options: [
      'Lucro bruto dividido pela receita',
      'Lucro líquido dividido pela receita',
      'EBITDA dividido pela receita',
      'Dividendos divididos pelo lucro'
    ],
    correctIndex: 1,
    explanation: 'Margem líquida é o percentual do lucro líquido em relação à receita total. Uma margem de 15% significa que a cada R$100 de receita, R$15 viram lucro.',
    category: 'indicadores',
    difficulty: 'medio',
  },
  // Análise Técnica - Médio
  {
    id: 11,
    question: 'O que é uma média móvel?',
    options: [
      'Preço médio de compra',
      'Média dos preços em um período',
      'Variação média diária',
      'Volume médio negociado'
    ],
    correctIndex: 1,
    explanation: 'Média móvel é a média dos preços de fechamento em um determinado período. MM de 21 dias é a média dos últimos 21 fechamentos.',
    category: 'analise',
    difficulty: 'medio',
  },
  {
    id: 12,
    question: 'RSI acima de 70 indica:',
    options: [
      'Ativo sobrevendido',
      'Ativo sobrecomprado',
      'Tendência de alta',
      'Volume alto'
    ],
    correctIndex: 1,
    explanation: 'RSI (Índice de Força Relativa) acima de 70 indica que o ativo está sobrecomprado, podendo haver correção. Abaixo de 30 indica sobrevendido.',
    category: 'analise',
    difficulty: 'medio',
  },
  {
    id: 13,
    question: 'O que indica o cruzamento da média móvel de 9 acima da de 21?',
    options: [
      'Sinal de venda',
      'Sinal de compra',
      'Mercado lateral',
      'Alta volatilidade'
    ],
    correctIndex: 1,
    explanation: 'Quando a média móvel mais curta (9) cruza acima da mais longa (21), é considerado um sinal de compra, indicando possível início de tendência de alta.',
    category: 'analise',
    difficulty: 'medio',
  },
  // Avançado - Difícil
  {
    id: 14,
    question: 'O que é o WACC?',
    options: [
      'Índice de volatilidade do mercado',
      'Custo médio ponderado de capital',
      'Taxa de crescimento de dividendos',
      'Retorno ajustado ao risco'
    ],
    correctIndex: 1,
    explanation: 'WACC (Weighted Average Cost of Capital) é o custo médio ponderado de capital, usado como taxa de desconto em valuations DCF.',
    category: 'avancado',
    difficulty: 'dificil',
  },
  {
    id: 15,
    question: 'Na fórmula de Graham, o multiplicador 22,5 representa:',
    options: [
      'P/L máximo de 22,5',
      'P/L máximo de 15 × P/VP máximo de 1,5',
      'Taxa de desconto de 22,5%',
      'Crescimento esperado de 22,5%'
    ],
    correctIndex: 1,
    explanation: 'O multiplicador 22,5 na fórmula de Graham vem de P/L máximo de 15 multiplicado por P/VP máximo de 1,5 (15 × 1,5 = 22,5).',
    category: 'avancado',
    difficulty: 'dificil',
  },
  {
    id: 16,
    question: 'O que é uma opção de compra (call)?',
    options: [
      'Obrigação de comprar um ativo a um preço fixo',
      'Direito de comprar um ativo a um preço fixo',
      'Obrigação de vender um ativo a um preço fixo',
      'Direito de vender um ativo a um preço fixo'
    ],
    correctIndex: 1,
    explanation: 'Uma call dá o DIREITO (não obrigação) de comprar um ativo pelo preço de exercício até a data de vencimento. Ganha valor quando o ativo sobe.',
    category: 'avancado',
    difficulty: 'dificil',
  },
  {
    id: 17,
    question: 'PEG Ratio menor que 1 indica:',
    options: [
      'Ação sobrevalorizada',
      'Ação subvalorizada considerando o crescimento',
      'Empresa com prejuízo',
      'Alta volatilidade'
    ],
    correctIndex: 1,
    explanation: 'PEG (P/L dividido pela taxa de crescimento) menor que 1 indica que a ação pode estar subvalorizada considerando seu potencial de crescimento.',
    category: 'avancado',
    difficulty: 'dificil',
  },
  {
    id: 18,
    question: 'O que é o valor terminal em um DCF?',
    options: [
      'Valor da empresa no último ano projetado',
      'Valor presente dos fluxos de caixa',
      'Valor da empresa após o período de projeção',
      'Taxa de desconto final'
    ],
    correctIndex: 2,
    explanation: 'O valor terminal representa o valor da empresa após o período de projeção explícita, assumindo crescimento perpétuo a uma taxa constante.',
    category: 'avancado',
    difficulty: 'dificil',
  },
];

type QuizState = 'start' | 'playing' | 'result';
type Category = 'todos' | 'basico' | 'indicadores' | 'analise' | 'avancado';

export default function Quiz() {
  const { user } = useAuth() as any;
  const [state, setState] = useState<QuizState>('start');
  const [category, setCategory] = useState<Category>('todos');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('quiz');

  // tRPC queries and mutations
  const { data: userScores, refetch: refetchScores } = trpc.quiz.getScores.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: bestScores } = trpc.quiz.getBestScores.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: achievements, refetch: refetchAchievements } = trpc.achievements.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: totalPoints } = trpc.achievements.totalPoints.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: availableAchievements } = trpc.achievements.available.useQuery();

  const { data: leaderboard } = trpc.quiz.leaderboard.useQuery({ limit: 10 });

  const saveScore = trpc.quiz.saveScore.useMutation({
    onSuccess: (data) => {
      if (data.achievements && data.achievements.length > 0) {
        setNewAchievements(data.achievements);
      }
      refetchScores();
      refetchAchievements();
    },
  });

  const filteredQuestions = useMemo(() => {
    if (category === 'todos') return QUESTIONS;
    return QUESTIONS.filter(q => q.category === category);
  }, [category]);

  const currentQuestion = filteredQuestions[currentIndex];
  const progress = ((currentIndex + 1) / filteredQuestions.length) * 100;

  const startQuiz = () => {
    setState('playing');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setStartTime(new Date());
    setNewAchievements([]);
  };

  const selectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswers(prev => [...prev, { questionId: currentQuestion.id, correct: isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz finished - save score
      const endTime = new Date();
      const timeSpent = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
      
      if (user) {
        saveScore.mutate({
          category: category === 'todos' ? 'geral' : category,
          score,
          totalQuestions: filteredQuestions.length,
          correctAnswers: score,
          timeSpent,
        });
      }
      
      setState('result');
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage >= 90) return { text: 'Excelente! Você é um expert!', icon: Trophy, color: 'text-yellow-500' };
    if (percentage >= 70) return { text: 'Muito bom! Continue estudando!', icon: Star, color: 'text-green-500' };
    if (percentage >= 50) return { text: 'Bom trabalho! Há espaço para melhorar.', icon: Target, color: 'text-blue-500' };
    return { text: 'Continue praticando! A prática leva à perfeição.', icon: BookOpen, color: 'text-orange-500' };
  };

  const getTimeTaken = () => {
    if (!startTime) return '0:00';
    const endTime = new Date();
    const diff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'basico': return <BookOpen className="h-4 w-4" />;
      case 'indicadores': return <BarChart3 className="h-4 w-4" />;
      case 'analise': return <TrendingUp className="h-4 w-4" />;
      case 'avancado': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'facil': return 'bg-green-500/10 text-green-500';
      case 'medio': return 'bg-yellow-500/10 text-yellow-500';
      case 'dificil': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      case 'crown': return <Crown className="h-6 w-6" />;
      default: return <Medal className="h-6 w-6" />;
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Quiz Financeiro</h1>
        </div>
        <p className="text-muted-foreground">
          Teste seus conhecimentos e ganhe conquistas
        </p>
        {user && totalPoints !== undefined && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-lg">{totalPoints} pontos</span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz">
          {state === 'start' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Escolha a Categoria
                </CardTitle>
                <CardDescription>
                  Selecione uma categoria para começar o quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'todos', label: 'Todos', count: QUESTIONS.length },
                    { value: 'basico', label: 'Básico', count: QUESTIONS.filter(q => q.category === 'basico').length },
                    { value: 'indicadores', label: 'Indicadores', count: QUESTIONS.filter(q => q.category === 'indicadores').length },
                    { value: 'analise', label: 'Análise Técnica', count: QUESTIONS.filter(q => q.category === 'analise').length },
                    { value: 'avancado', label: 'Avançado', count: QUESTIONS.filter(q => q.category === 'avancado').length },
                  ].map(cat => (
                    <Button
                      key={cat.value}
                      variant={category === cat.value ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col gap-1"
                      onClick={() => setCategory(cat.value as Category)}
                    >
                      {getCategoryIcon(cat.value)}
                      <span>{cat.label}</span>
                      <span className="text-xs opacity-70">{cat.count} questões</span>
                      {bestScores && bestScores[cat.value === 'todos' ? 'geral' : cat.value] && (
                        <Badge variant="secondary" className="mt-1">
                          Melhor: {bestScores[cat.value === 'todos' ? 'geral' : cat.value].score}/{cat.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>

                <div className="pt-4">
                  <Button onClick={startQuiz} className="w-full" size="lg">
                    <Zap className="h-5 w-5 mr-2" />
                    Começar Quiz
                  </Button>
                </div>

                {!user && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Faça login para salvar suas pontuações e ganhar conquistas!
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/api/oauth/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Fazer Login
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {state === 'playing' && currentQuestion && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questão {currentIndex + 1} de {filteredQuestions.length}</span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    {score} pontos
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getDifficultyColor(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty === 'facil' ? 'Fácil' : currentQuestion.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                    </Badge>
                    <Badge variant="outline">
                      {getCategoryIcon(currentQuestion.category)}
                      <span className="ml-1 capitalize">{currentQuestion.category}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'w-full justify-start text-left h-auto py-4 px-4';
                    
                    if (selectedAnswer !== null) {
                      if (index === currentQuestion.correctIndex) {
                        buttonClass += ' bg-green-500/20 border-green-500 hover:bg-green-500/20';
                      } else if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
                        buttonClass += ' bg-red-500/20 border-red-500 hover:bg-red-500/20';
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={buttonClass}
                        onClick={() => selectAnswer(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {selectedAnswer !== null && index === currentQuestion.correctIndex && (
                            <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                          )}
                          {selectedAnswer !== null && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                            <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                          )}
                        </span>
                      </Button>
                    );
                  })}

                  {showExplanation && (
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Explicação
                      </h4>
                      <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  )}

                  {selectedAnswer !== null && (
                    <Button onClick={nextQuestion} className="w-full mt-4">
                      {currentIndex < filteredQuestions.length - 1 ? (
                        <>
                          Próxima Questão
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Ver Resultado
                          <Trophy className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {state === 'result' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {(() => {
                    const result = getScoreMessage();
                    const Icon = result.icon;
                    return <Icon className={`h-16 w-16 ${result.color}`} />;
                  })()}
                </div>
                <CardTitle className="text-2xl">{getScoreMessage().text}</CardTitle>
                <CardDescription>
                  Você completou o quiz!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Acertos</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold">{filteredQuestions.length - score}</div>
                    <div className="text-sm text-muted-foreground">Erros</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-green-500">
                      {Math.round((score / filteredQuestions.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Aproveitamento</div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tempo: {getTimeTaken()}</span>
                </div>

                {/* New Achievements */}
                {newAchievements.length > 0 && (
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-500">
                      <Trophy className="h-5 w-5" />
                      Novas Conquistas Desbloqueadas!
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {newAchievements.map(id => (
                        <Badge key={id} className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          {id.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Conquistas deste Quiz</h4>
                  <div className="flex flex-wrap gap-2">
                    {score === filteredQuestions.length && (
                      <Badge className="bg-yellow-500">
                        <Trophy className="h-3 w-3 mr-1" />
                        Perfeito!
                      </Badge>
                    )}
                    {score >= filteredQuestions.length * 0.8 && (
                      <Badge className="bg-green-500">
                        <Star className="h-3 w-3 mr-1" />
                        Expert
                      </Badge>
                    )}
                    {answers.filter(a => a.correct).length >= 3 && (
                      <Badge className="bg-blue-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Sequência de 3+
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      Quiz Completo
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={startQuiz} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Button variant="outline" onClick={() => setState('start')} className="flex-1">
                    Mudar Categoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="conquistas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Suas Conquistas
              </CardTitle>
              <CardDescription>
                {user ? `${achievements?.length || 0} de ${availableAchievements?.length || 0} conquistas desbloqueadas` : 'Faça login para ver suas conquistas'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Faça login para desbloquear e acompanhar suas conquistas</p>
                  <Button asChild>
                    <a href="/api/oauth/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Fazer Login
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {availableAchievements?.map(achievement => {
                    const unlocked = achievements?.find(a => a.achievementId === achievement.id);
                    return (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 opacity-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {getAchievementIcon(achievement.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {achievement.name}
                              {unlocked && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </div>
                            <div className="text-sm text-muted-foreground">{achievement.description}</div>
                          </div>
                          <Badge variant={unlocked ? 'default' : 'outline'}>
                            +{achievement.points} pts
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ranking Global
              </CardTitle>
              <CardDescription>
                Os melhores jogadores do Quiz Financeiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard?.map((entry, index) => (
                  <div 
                    key={`${entry.userId}-${entry.completedAt}`}
                    className={`flex items-center gap-4 p-3 rounded-lg ${index < 3 ? 'bg-primary/5' : 'bg-muted/30'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-muted'
                    }`}>
                      {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.correctAnswers}/{entry.totalQuestions} acertos
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{entry.score} pts</div>
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!leaderboard || leaderboard.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma pontuação ainda. Seja o primeiro!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

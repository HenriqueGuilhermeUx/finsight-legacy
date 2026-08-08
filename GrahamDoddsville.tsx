import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BookOpen,
  Target,
  Shield,
  DollarSign,
  BarChart3,
  Info,
  ArrowUpRight,
  Loader2,
  RefreshCw
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAnalysisLimit } from "@/hooks/useAnalysisLimit";
import { RegisterModal } from "@/components/RegisterModal";
import { AnalysisLimitBadge } from "@/components/AnalysisLimitBadge";
import { Disclaimer } from "@/components/Disclaimer";

export default function GrahamDoddsville() {
  const [searchTicker, setSearchTicker] = useState("");
  const [minScore, setMinScore] = useState(50);
  const [activeTab, setActiveTab] = useState("screening");
  
  // Analysis limit system
  const { incrementCount, canAnalyze, showRegisterModal, setShowRegisterModal, remaining, isUnlimited } = useAnalysisLimit();

  // Get top picks
  const { data: topPicks, isLoading: loadingTopPicks, refetch: refetchTopPicks } = trpc.graham.topPicks.useQuery({ limit: 10 });
  
  // Get screening results
  const { data: screeningData, isLoading: loadingScreening, refetch: refetchScreening } = trpc.graham.screening.useQuery({
    minScore,
    sortBy: 'grahamScore',
    limit: 50,
  });

  // Analyze individual ticker
  const { data: analysis, isLoading: loadingAnalysis, refetch: refetchAnalysis } = trpc.graham.analyze.useQuery(
    { ticker: searchTicker.toUpperCase() },
    { enabled: searchTicker.length >= 3 }
  );

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Compra Forte</Badge>;
      case 'buy':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Compra</Badge>;
      case 'hold':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Manter</Badge>;
      case 'avoid':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Evitar</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getMarginColor = (margin: number | null) => {
    if (margin === null) return "text-muted-foreground";
    if (margin >= 30) return "text-emerald-400";
    if (margin >= 10) return "text-green-400";
    if (margin >= 0) return "text-amber-400";
    return "text-red-400";
  };

  const CriterionRow = ({ label, value, passed, description }: { label: string; value: string | number | null; passed: boolean; description: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
      <div className="flex items-center gap-2">
        {passed ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <XCircle className="h-4 w-4 text-red-400" />
        )}
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <div className={`text-sm font-mono ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
        {value !== null ? (typeof value === 'number' ? value.toFixed(2) : value) : 'N/A'}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-cyan-400" />
              Graham & Doddsville
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise de Value Investing baseada nos critérios de Benjamin Graham
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AnalysisLimitBadge />
            <Button variant="outline" size="sm" onClick={() => { refetchTopPicks(); refetchScreening(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-cyan-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-cyan-400">Metodologia Graham & Doddsville</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Baseada no livro "The Intelligent Investor" de Benjamin Graham, esta análise avalia 7 critérios fundamentalistas 
                  para identificar ações subvalorizadas com margem de segurança. O Graham Number calcula o valor intrínseco 
                  usando a fórmula √(22.5 × LPA × VPA).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Individual Ticker */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-cyan-400" />
              Analisar Ativo Individual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o ticker (ex: PETR4, VALE3, AAPL)"
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value.toUpperCase())}
                className="max-w-xs"
              />
              <Button 
                onClick={() => {
                  if (!canAnalyze()) return;
                  incrementCount();
                  refetchAnalysis();
                }} 
                disabled={searchTicker.length < 3}
              >
                {loadingAnalysis ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analisar"}
              </Button>
            </div>

            {analysis && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary Card */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{analysis.ticker}</CardTitle>
                        <CardDescription>{analysis.name}</CardDescription>
                      </div>
                      {getRecommendationBadge(analysis.recommendation)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Preço Atual</div>
                        <div className="text-lg font-bold">
                          {analysis.currency === 'BRL' ? 'R$' : '$'} {analysis.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Graham Number</div>
                        <div className="text-lg font-bold text-cyan-400">
                          {analysis.grahamNumber ? `${analysis.currency === 'BRL' ? 'R$' : '$'} ${analysis.grahamNumber.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Margem de Segurança</div>
                        <div className={`text-lg font-bold ${getMarginColor(analysis.marginOfSafety)}`}>
                          {analysis.marginOfSafety !== null ? `${analysis.marginOfSafety.toFixed(1)}%` : 'N/A'}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Score Graham</div>
                        <div className={`text-lg font-bold ${getScoreColor(analysis.grahamScore)}`}>
                          {analysis.grahamScore}/100
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Critérios atendidos: <span className="text-foreground font-medium">{analysis.criteriaMetCount}/{analysis.totalCriteria}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Criteria Details */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Critérios Graham</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <CriterionRow 
                        label="P/L < 15" 
                        value={analysis.criteria.peRatio} 
                        passed={analysis.criteria.peRatioPassed}
                        description="Preço/Lucro baixo indica subvalorização"
                      />
                      <CriterionRow 
                        label="P/VP < 1.5" 
                        value={analysis.criteria.pbRatio} 
                        passed={analysis.criteria.pbRatioPassed}
                        description="Preço/Valor Patrimonial conservador"
                      />
                      <CriterionRow 
                        label="Dividend Yield > 2.5%" 
                        value={analysis.criteria.dividendYield ? `${analysis.criteria.dividendYield.toFixed(1)}%` : null} 
                        passed={analysis.criteria.dividendYieldPassed}
                        description="Retorno em dividendos atrativo"
                      />
                      <CriterionRow 
                        label="Dívida/PL < 2" 
                        value={analysis.criteria.debtToEquity} 
                        passed={analysis.criteria.debtToEquityPassed}
                        description="Endividamento controlado"
                      />
                      <CriterionRow 
                        label="Liquidez Corrente > 2" 
                        value={analysis.criteria.currentRatio} 
                        passed={analysis.criteria.currentRatioPassed}
                        description="Capacidade de pagar dívidas de curto prazo"
                      />
                      <CriterionRow 
                        label="Crescimento de Lucros" 
                        value={analysis.criteria.earningsGrowth ? `${analysis.criteria.earningsGrowth.toFixed(1)}%` : null} 
                        passed={analysis.criteria.earningsGrowthPassed}
                        description="Lucros crescentes"
                      />
                      <CriterionRow 
                        label="Lucros Positivos" 
                        value={analysis.criteria.hasPositiveEarnings ? "Sim" : "Não"} 
                        passed={analysis.criteria.earningsStabilityPassed}
                        description="Sem prejuízos recentes"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Top Picks and Screening */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="topPicks" className="data-[state=active]:bg-cyan-500/20">
              <Target className="h-4 w-4 mr-2" />
              Top Oportunidades
            </TabsTrigger>
            <TabsTrigger value="screening" className="data-[state=active]:bg-cyan-500/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Screening Completo
            </TabsTrigger>
          </TabsList>

          {/* Top Picks */}
          <TabsContent value="topPicks" className="mt-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Melhores Oportunidades Graham
                </CardTitle>
                <CardDescription>
                  Ativos com maior score Graham e margem de segurança positiva
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTopPicks ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topPicks?.map((pick, index) => (
                      <Link key={pick.ticker} href={`/ativo/${pick.ticker}`}>
                        <Card className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-bold">{pick.ticker}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">{pick.name}</div>
                                </div>
                              </div>
                              {getRecommendationBadge(pick.recommendation)}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="text-xs text-muted-foreground">Score</div>
                                <div className={`font-bold ${getScoreColor(pick.grahamScore)}`}>
                                  {pick.grahamScore}/100
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Margem</div>
                                <div className={`font-bold ${getMarginColor(pick.marginOfSafety)}`}>
                                  {pick.marginOfSafety !== null ? `${pick.marginOfSafety.toFixed(0)}%` : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">P/L</div>
                                <div className="font-mono">{pick.criteria.peRatio?.toFixed(1) || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">P/VP</div>
                                <div className="font-mono">{pick.criteria.pbRatio?.toFixed(2) || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              {pick.criteriaMetCount}/{pick.totalCriteria} critérios
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screening */}
          <TabsContent value="screening" className="mt-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-cyan-400" />
                      Screening de Ativos
                    </CardTitle>
                    <CardDescription>
                      Filtre ativos por score Graham mínimo
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Score mínimo: <span className="text-foreground font-bold">{minScore}</span>
                    </div>
                    <Slider
                      value={[minScore]}
                      onValueChange={(v) => setMinScore(v[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-32"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingScreening ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">
                      {screeningData?.total || 0} ativos encontrados
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2 px-2">Ticker</th>
                            <th className="text-left py-2 px-2">Nome</th>
                            <th className="text-right py-2 px-2">Preço</th>
                            <th className="text-right py-2 px-2">Graham #</th>
                            <th className="text-right py-2 px-2">Margem</th>
                            <th className="text-right py-2 px-2">Score</th>
                            <th className="text-right py-2 px-2">P/L</th>
                            <th className="text-right py-2 px-2">P/VP</th>
                            <th className="text-center py-2 px-2">Recomendação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {screeningData?.results.map((item) => (
                            <tr key={item.ticker} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                              <td className="py-2 px-2">
                                <Link href={`/ativo/${item.ticker}`}>
                                  <span className="font-bold text-cyan-400 hover:underline cursor-pointer">
                                    {item.ticker}
                                  </span>
                                </Link>
                              </td>
                              <td className="py-2 px-2 text-muted-foreground truncate max-w-[150px]">{item.name}</td>
                              <td className="py-2 px-2 text-right font-mono">
                                {item.currency === 'BRL' ? 'R$' : '$'} {item.price.toFixed(2)}
                              </td>
                              <td className="py-2 px-2 text-right font-mono text-cyan-400">
                                {item.grahamNumber ? `${item.currency === 'BRL' ? 'R$' : '$'} ${item.grahamNumber.toFixed(2)}` : 'N/A'}
                              </td>
                              <td className={`py-2 px-2 text-right font-mono ${getMarginColor(item.marginOfSafety)}`}>
                                {item.marginOfSafety !== null ? `${item.marginOfSafety.toFixed(0)}%` : 'N/A'}
                              </td>
                              <td className={`py-2 px-2 text-right font-bold ${getScoreColor(item.grahamScore)}`}>
                                {item.grahamScore}
                              </td>
                              <td className="py-2 px-2 text-right font-mono">
                                {item.criteria.peRatio?.toFixed(1) || 'N/A'}
                              </td>
                              <td className="py-2 px-2 text-right font-mono">
                                {item.criteria.pbRatio?.toFixed(2) || 'N/A'}
                              </td>
                              <td className="py-2 px-2 text-center">
                                {getRecommendationBadge(item.recommendation)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Disclaimer variant="compact" className="mt-6" />
      </div>

      {/* Register Modal */}
      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </DashboardLayout>
  );
}

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DollarSign,
  Percent,
  Building2,
  Scale,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { TermWithTooltip } from "@/components/EducationalTooltip";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function AnaliseFundamentalista() {
  const [ticker, setTicker] = useState("PETR4");
  const [searchInput, setSearchInput] = useState("");
  
  // DCF Parameters
  const [dcfParams, setDcfParams] = useState({
    growthRate: 5,
    terminalGrowth: 2,
    discountRate: 12,
    years: 10,
  });

  const { data: assetData, isLoading } = trpc.assets.getByTicker.useQuery(
    { ticker },
    { enabled: !!ticker }
  );

  const handleSearch = () => {
    if (searchInput.trim()) {
      setTicker(searchInput.trim().toUpperCase());
    }
  };

  // Simulated financial data for DCF
  const getFinancialData = () => {
    const baseRevenue = 500000; // R$ 500B for large companies
    const baseFCF = 50000; // R$ 50B FCF
    const sharesOutstanding = 13000; // millions
    
    return {
      revenue: baseRevenue,
      ebitda: baseRevenue * 0.35,
      netIncome: baseRevenue * 0.15,
      fcf: baseFCF,
      totalDebt: baseRevenue * 0.4,
      cash: baseRevenue * 0.1,
      sharesOutstanding,
      bookValue: baseRevenue * 0.6,
    };
  };

  const financials = getFinancialData();

  // Calculate DCF Valuation
  const calculateDCF = () => {
    const { growthRate, terminalGrowth, discountRate, years } = dcfParams;
    let totalPV = 0;
    const projections = [];
    let currentFCF = financials.fcf;

    for (let year = 1; year <= years; year++) {
      currentFCF = currentFCF * (1 + growthRate / 100);
      const pv = currentFCF / Math.pow(1 + discountRate / 100, year);
      totalPV += pv;
      projections.push({
        year: `Ano ${year}`,
        fcf: currentFCF,
        pv: pv,
      });
    }

    // Terminal Value
    const terminalFCF = currentFCF * (1 + terminalGrowth / 100);
    const terminalValue = terminalFCF / (discountRate / 100 - terminalGrowth / 100);
    const terminalPV = terminalValue / Math.pow(1 + discountRate / 100, years);
    
    const enterpriseValue = totalPV + terminalPV;
    const equityValue = enterpriseValue - financials.totalDebt + financials.cash;
    const fairValue = equityValue / financials.sharesOutstanding;

    return {
      projections,
      totalPV,
      terminalValue,
      terminalPV,
      enterpriseValue,
      equityValue,
      fairValue,
      upside: assetData?.price ? ((fairValue - assetData.price) / assetData.price) * 100 : 0,
    };
  };

  const dcf = calculateDCF();

  // Quality Score Calculation
  const calculateQualityScore = () => {
    const fundamentals = assetData?.fundamentals as any;
    let score = 0;
    const criteria = [];

    // P/L Analysis
    const pl = fundamentals?.pl || 15;
    if (pl > 0 && pl < 10) {
      score += 20;
      criteria.push({ name: "P/L Atrativo", score: 20, status: "good", value: pl.toFixed(1) });
    } else if (pl >= 10 && pl < 20) {
      score += 15;
      criteria.push({ name: "P/L Moderado", score: 15, status: "neutral", value: pl.toFixed(1) });
    } else {
      score += 5;
      criteria.push({ name: "P/L Elevado", score: 5, status: "bad", value: pl.toFixed(1) });
    }

    // P/VP Analysis
    const pvp = fundamentals?.pvp || 1.5;
    if (pvp > 0 && pvp < 1) {
      score += 20;
      criteria.push({ name: "P/VP Atrativo", score: 20, status: "good", value: pvp.toFixed(2) });
    } else if (pvp >= 1 && pvp < 2) {
      score += 15;
      criteria.push({ name: "P/VP Moderado", score: 15, status: "neutral", value: pvp.toFixed(2) });
    } else {
      score += 5;
      criteria.push({ name: "P/VP Elevado", score: 5, status: "bad", value: pvp.toFixed(2) });
    }

    // Dividend Yield (simulated)
    const dy = 8.5;
    if (dy > 6) {
      score += 20;
      criteria.push({ name: "Dividend Yield Alto", score: 20, status: "good", value: `${dy.toFixed(1)}%` });
    } else if (dy >= 3) {
      score += 15;
      criteria.push({ name: "Dividend Yield Médio", score: 15, status: "neutral", value: `${dy.toFixed(1)}%` });
    } else {
      score += 5;
      criteria.push({ name: "Dividend Yield Baixo", score: 5, status: "bad", value: `${dy.toFixed(1)}%` });
    }

    // ROE (simulated)
    const roe = 22;
    if (roe > 15) {
      score += 20;
      criteria.push({ name: "ROE Excelente", score: 20, status: "good", value: `${roe.toFixed(1)}%` });
    } else if (roe >= 10) {
      score += 15;
      criteria.push({ name: "ROE Moderado", score: 15, status: "neutral", value: `${roe.toFixed(1)}%` });
    } else {
      score += 5;
      criteria.push({ name: "ROE Baixo", score: 5, status: "bad", value: `${roe.toFixed(1)}%` });
    }

    // Debt/Equity (simulated)
    const debtEquity = 0.8;
    if (debtEquity < 0.5) {
      score += 20;
      criteria.push({ name: "Baixo Endividamento", score: 20, status: "good", value: debtEquity.toFixed(2) });
    } else if (debtEquity < 1) {
      score += 15;
      criteria.push({ name: "Endividamento Moderado", score: 15, status: "neutral", value: debtEquity.toFixed(2) });
    } else {
      score += 5;
      criteria.push({ name: "Alto Endividamento", score: 5, status: "bad", value: debtEquity.toFixed(2) });
    }

    return { score, criteria };
  };

  const quality = calculateQualityScore();

  // Sector Multiples Comparison
  const sectorMultiples = [
    { name: ticker, pl: 8.5, pvp: 1.2, evEbitda: 4.2, dy: 8.5, roe: 22 },
    { name: "VALE3", pl: 6.2, pvp: 1.5, evEbitda: 3.8, dy: 12.3, roe: 28 },
    { name: "GGBR4", pl: 5.8, pvp: 0.9, evEbitda: 3.5, dy: 9.1, roe: 18 },
    { name: "CSNA3", pl: 4.2, pvp: 0.7, evEbitda: 2.9, dy: 15.2, roe: 25 },
    { name: "Média Setor", pl: 6.2, pvp: 1.1, evEbitda: 3.6, dy: 11.3, roe: 23 },
  ];

  // Radar chart data for quality
  const radarData = [
    { metric: "Valor", value: 85, fullMark: 100 },
    { metric: "Crescimento", value: 65, fullMark: 100 },
    { metric: "Rentabilidade", value: 90, fullMark: 100 },
    { metric: "Saúde Financeira", value: 75, fullMark: 100 },
    { metric: "Dividendos", value: 88, fullMark: 100 },
    { metric: "Momentum", value: 70, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excelente", variant: "default" as const, color: "bg-emerald-500" };
    if (score >= 60) return { label: "Bom", variant: "secondary" as const, color: "bg-yellow-500" };
    return { label: "Atenção", variant: "destructive" as const, color: "bg-red-500" };
  };

  const scoreBadge = getScoreBadge(quality.score);

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              Análise Fundamentalista Avançada
            </h1>
            <p className="text-muted-foreground mt-1">
              DCF, múltiplos setoriais, scoring de qualidade e análise de balanço
            </p>
          </div>
          
          {/* Search */}
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Digite o ticker..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full md:w-48"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Asset Header */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{ticker}</h2>
                      <p className="text-muted-foreground">{assetData?.name || "Empresa"}</p>
                      <p className="text-sm text-muted-foreground">{assetData?.sector || "Setor"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      R$ {assetData?.price?.toFixed(2) || "0.00"}
                    </div>
                    <div className={`flex items-center justify-end gap-1 ${(assetData?.change || 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {(assetData?.change || 0) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span>{(assetData?.change || 0) >= 0 ? "+" : ""}{assetData?.change?.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Score Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Score de Qualidade
                </CardTitle>
                <CardDescription>
                  Avaliação fundamentalista baseada em múltiplos critérios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Score Display */}
                  <div className="flex flex-col items-center justify-center">
                    <div className={`text-7xl font-bold ${getScoreColor(quality.score)}`}>
                      {quality.score}
                    </div>
                    <div className="text-xl text-muted-foreground">de 100 pontos</div>
                    <Badge className={`mt-2 ${scoreBadge.color}`}>
                      {scoreBadge.label}
                    </Badge>
                    
                    {/* Radar Chart */}
                    <div className="w-full h-64 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="metric" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                          <Radar
                            name="Score"
                            dataKey="value"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Criteria List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold mb-4">Critérios de Avaliação</h4>
                    {quality.criteria.map((criterion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {criterion.status === "good" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                          {criterion.status === "neutral" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          {criterion.status === "bad" && <XCircle className="h-5 w-5 text-red-500" />}
                          <div>
                            <div className="font-medium">{criterion.name}</div>
                            <div className="text-sm text-muted-foreground">Valor: {criterion.value}</div>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          criterion.status === "good" ? "text-emerald-500" :
                          criterion.status === "neutral" ? "text-yellow-500" : "text-red-500"
                        }`}>
                          +{criterion.score} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="dcf" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dcf">
                  <Calculator className="h-4 w-4 mr-2" />
                  Modelo DCF
                </TabsTrigger>
                <TabsTrigger value="multiples">
                  <Scale className="h-4 w-4 mr-2" />
                  Múltiplos Setoriais
                </TabsTrigger>
                <TabsTrigger value="balance">
                  <PieChart className="h-4 w-4 mr-2" />
                  Análise de Balanço
                </TabsTrigger>
              </TabsList>

              {/* DCF Tab */}
              <TabsContent value="dcf">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* DCF Parameters */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Parâmetros do DCF</CardTitle>
                      <CardDescription>Ajuste as premissas do modelo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium flex justify-between">
                          <span>Taxa de Crescimento</span>
                          <span className="text-primary">{dcfParams.growthRate}%</span>
                        </label>
                        <Slider
                          value={[dcfParams.growthRate]}
                          onValueChange={([v]) => setDcfParams({ ...dcfParams, growthRate: v })}
                          min={0}
                          max={20}
                          step={0.5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex justify-between">
                          <span>Crescimento Perpétuo</span>
                          <span className="text-primary">{dcfParams.terminalGrowth}%</span>
                        </label>
                        <Slider
                          value={[dcfParams.terminalGrowth]}
                          onValueChange={([v]) => setDcfParams({ ...dcfParams, terminalGrowth: v })}
                          min={0}
                          max={5}
                          step={0.25}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex justify-between">
                          <span>Taxa de Desconto (WACC)</span>
                          <span className="text-primary">{dcfParams.discountRate}%</span>
                        </label>
                        <Slider
                          value={[dcfParams.discountRate]}
                          onValueChange={([v]) => setDcfParams({ ...dcfParams, discountRate: v })}
                          min={5}
                          max={20}
                          step={0.5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex justify-between">
                          <span>Anos de Projeção</span>
                          <span className="text-primary">{dcfParams.years}</span>
                        </label>
                        <Slider
                          value={[dcfParams.years]}
                          onValueChange={([v]) => setDcfParams({ ...dcfParams, years: v })}
                          min={5}
                          max={15}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* DCF Results */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Resultado do Valuation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <div className="text-sm text-muted-foreground">Preço Atual</div>
                          <div className="text-xl font-bold">R$ {assetData?.price?.toFixed(2) || "0.00"}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10 text-center">
                          <div className="text-sm text-muted-foreground">Preço Justo (DCF)</div>
                          <div className="text-xl font-bold text-primary">R$ {dcf.fairValue.toFixed(2)}</div>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${dcf.upside >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                          <div className="text-sm text-muted-foreground">Upside/Downside</div>
                          <div className={`text-xl font-bold ${dcf.upside >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {dcf.upside >= 0 ? "+" : ""}{dcf.upside.toFixed(1)}%
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <div className="text-sm text-muted-foreground">Enterprise Value</div>
                          <div className="text-xl font-bold">R$ {(dcf.enterpriseValue / 1000).toFixed(0)}B</div>
                        </div>
                      </div>

                      {/* FCF Projection Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dcf.projections}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="year" tick={{ fill: "#9CA3AF" }} />
                            <YAxis tick={{ fill: "#9CA3AF" }} tickFormatter={(v) => `${(v/1000).toFixed(0)}B`} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                              formatter={(value: number) => [`R$ ${(value/1000).toFixed(1)}B`, ""]}
                            />
                            <Legend />
                            <Bar dataKey="fcf" name="FCF Projetado" fill="#3B82F6" />
                            <Bar dataKey="pv" name="Valor Presente" fill="#10B981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-4 p-4 rounded-lg bg-muted/30 flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <strong>Interpretação:</strong> O modelo DCF sugere que {ticker} está{" "}
                          {dcf.upside >= 10 ? (
                            <span className="text-emerald-500 font-medium">subvalorizado</span>
                          ) : dcf.upside <= -10 ? (
                            <span className="text-red-500 font-medium">sobrevalorizado</span>
                          ) : (
                            <span className="text-yellow-500 font-medium">próximo ao preço justo</span>
                          )}{" "}
                          com base nas premissas atuais. O valor terminal representa{" "}
                          {((dcf.terminalPV / dcf.enterpriseValue) * 100).toFixed(0)}% do valor total.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Multiples Tab */}
              <TabsContent value="multiples">
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação de Múltiplos Setoriais</CardTitle>
                    <CardDescription>
                      Compare {ticker} com empresas do mesmo setor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Empresa</th>
                            <th className="text-right py-3 px-4">
                              <TermWithTooltip term="P/L">P/L</TermWithTooltip>
                            </th>
                            <th className="text-right py-3 px-4">
                              <TermWithTooltip term="P/VP">P/VP</TermWithTooltip>
                            </th>
                            <th className="text-right py-3 px-4">
                              <TermWithTooltip term="EV/EBITDA">EV/EBITDA</TermWithTooltip>
                            </th>
                            <th className="text-right py-3 px-4">
                              <TermWithTooltip term="DY">Div. Yield</TermWithTooltip>
                            </th>
                            <th className="text-right py-3 px-4">
                              <TermWithTooltip term="ROE">ROE</TermWithTooltip>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sectorMultiples.map((company, index) => (
                            <tr
                              key={index}
                              className={`border-b ${company.name === ticker ? "bg-primary/10" : ""} ${company.name === "Média Setor" ? "font-semibold bg-muted/50" : ""}`}
                            >
                              <td className="py-3 px-4 font-medium">{company.name}</td>
                              <td className="text-right py-3 px-4">{company.pl.toFixed(1)}x</td>
                              <td className="text-right py-3 px-4">{company.pvp.toFixed(2)}x</td>
                              <td className="text-right py-3 px-4">{company.evEbitda.toFixed(1)}x</td>
                              <td className="text-right py-3 px-4">{company.dy.toFixed(1)}%</td>
                              <td className="text-right py-3 px-4">{company.roe.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Multiples Chart */}
                    <div className="h-64 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sectorMultiples.filter(c => c.name !== "Média Setor")} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis type="number" tick={{ fill: "#9CA3AF" }} />
                          <YAxis dataKey="name" type="category" tick={{ fill: "#9CA3AF" }} width={60} />
                          <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
                          <Legend />
                          <Bar dataKey="pl" name="P/L" fill="#3B82F6" />
                          <Bar dataKey="evEbitda" name="EV/EBITDA" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Balance Sheet Tab */}
              <TabsContent value="balance">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estrutura de Capital</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Patrimônio Líquido</span>
                          <span className="font-bold text-emerald-500">R$ {(financials.bookValue / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Dívida Total</span>
                          <span className="font-bold text-red-500">R$ {(financials.totalDebt / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Caixa e Equivalentes</span>
                          <span className="font-bold text-blue-500">R$ {(financials.cash / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                          <span>Dívida Líquida</span>
                          <span className="font-bold">R$ {((financials.totalDebt - financials.cash) / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <TermWithTooltip term="Dívida/PL">Dívida/PL</TermWithTooltip>
                          <span className="font-bold">{(financials.totalDebt / financials.bookValue).toFixed(2)}x</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Demonstração de Resultados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Receita Líquida</span>
                          <span className="font-bold">R$ {(financials.revenue / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>EBITDA</span>
                          <span className="font-bold">R$ {(financials.ebitda / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <TermWithTooltip term="Margem EBITDA">Margem EBITDA</TermWithTooltip>
                          <span className="font-bold text-emerald-500">{((financials.ebitda / financials.revenue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <span>Lucro Líquido</span>
                          <span className="font-bold text-emerald-500">R$ {(financials.netIncome / 1000).toFixed(0)}B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                          <span>Free Cash Flow</span>
                          <span className="font-bold text-primary">R$ {(financials.fcf / 1000).toFixed(0)}B</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
}

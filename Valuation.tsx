import { useState, useMemo } from 'react';
import { useSearch } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Info,
  DollarSign,
  Percent,
  Target,
  Scale,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PiggyBank,
  Coins,
  Sparkles
} from 'lucide-react';

// Dados das empresas para valuation
const COMPANY_DATA: Record<string, {
  name: string;
  sector: string;
  price: number;
  lpa: number; // Lucro por ação
  vpa: number; // Valor patrimonial por ação
  dpa: number; // Dividendo por ação
  crescimentoLucro5a: number; // % crescimento últimos 5 anos
  roe: number;
  dividendYield: number;
  pl: number;
  pvp: number;
}> = {
  'WEGE3': { name: 'WEG', sector: 'Industrial', price: 52.80, lpa: 1.50, vpa: 5.40, dpa: 0.80, crescimentoLucro5a: 17.1, roe: 28.5, dividendYield: 1.5, pl: 35.2, pvp: 9.8 },
  'ITUB4': { name: 'Itaú Unibanco', sector: 'Financeiro', price: 32.45, lpa: 3.96, vpa: 20.28, dpa: 2.01, crescimentoLucro5a: 9.2, roe: 19.8, dividendYield: 6.2, pl: 8.2, pvp: 1.6 },
  'PETR4': { name: 'Petrobras', sector: 'Petróleo', price: 36.80, lpa: 8.76, vpa: 27.26, dpa: 6.81, crescimentoLucro5a: 22.8, roe: 32.5, dividendYield: 18.5, pl: 4.2, pvp: 1.35 },
  'VALE3': { name: 'Vale', sector: 'Mineração', price: 62.50, lpa: 10.78, vpa: 48.08, dpa: 5.13, crescimentoLucro5a: 13.1, roe: 22.8, dividendYield: 8.2, pl: 5.8, pvp: 1.3 },
  'BBAS3': { name: 'Banco do Brasil', sector: 'Financeiro', price: 54.20, lpa: 11.29, vpa: 54.20, dpa: 5.31, crescimentoLucro5a: 10.5, roe: 21.2, dividendYield: 9.8, pl: 4.8, pvp: 1.0 },
  'RENT3': { name: 'Localiza', sector: 'Aluguel de Carros', price: 42.80, lpa: 2.82, vpa: 15.29, dpa: 1.07, crescimentoLucro5a: 14.3, roe: 18.5, dividendYield: 2.5, pl: 15.2, pvp: 2.8 },
  'RADL3': { name: 'Raia Drogasil', sector: 'Varejo Farmacêutico', price: 25.50, lpa: 0.89, vpa: 6.07, dpa: 0.31, crescimentoLucro5a: 11.8, roe: 15.2, dividendYield: 1.2, pl: 28.5, pvp: 4.2 },
  'EGIE3': { name: 'Engie Brasil', sector: 'Energia', price: 42.50, lpa: 5.00, vpa: 17.71, dpa: 3.61, crescimentoLucro5a: 7.7, roe: 28.5, dividendYield: 8.5, pl: 8.5, pvp: 2.4 },
  'TAEE11': { name: 'Taesa', sector: 'Energia', price: 35.20, lpa: 3.20, vpa: 18.53, dpa: 3.70, crescimentoLucro5a: 5.2, roe: 17.3, dividendYield: 10.5, pl: 11.0, pvp: 1.9 },
  'BBSE3': { name: 'BB Seguridade', sector: 'Seguros', price: 34.80, lpa: 4.35, vpa: 12.07, dpa: 3.20, crescimentoLucro5a: 8.5, roe: 36.0, dividendYield: 9.2, pl: 8.0, pvp: 2.9 },
};

type ValuationMethod = 'graham' | 'bazin' | 'dcf' | 'lynch';

export default function Valuation() {
  const searchParams = useSearch();
  const urlTicker = new URLSearchParams(searchParams).get('ticker') || '';
  
  const [ticker, setTicker] = useState(urlTicker.toUpperCase());
  const [method, setMethod] = useState<ValuationMethod>('graham');
  
  // Parâmetros DCF
  const [dcfGrowthRate, setDcfGrowthRate] = useState(10);
  const [dcfDiscountRate, setDcfDiscountRate] = useState(12);
  const [dcfTerminalGrowth, setDcfTerminalGrowth] = useState(3);
  const [dcfYears, setDcfYears] = useState(10);
  
  // Parâmetros Bazin
  const [bazinMinYield, setBazinMinYield] = useState(6);
  
  // Parâmetros Graham
  const [grahamMultiplier, setGrahamMultiplier] = useState(22.5);

  const company = COMPANY_DATA[ticker];

  // Cálculo Graham
  const grahamValue = useMemo(() => {
    if (!company) return null;
    
    // Fórmula de Graham: √(22.5 × LPA × VPA)
    const value = Math.sqrt(grahamMultiplier * company.lpa * company.vpa);
    const upside = ((value - company.price) / company.price) * 100;
    
    return {
      value,
      upside,
      formula: `√(${grahamMultiplier} × ${company.lpa.toFixed(2)} × ${company.vpa.toFixed(2)})`,
      components: {
        lpa: company.lpa,
        vpa: company.vpa,
        multiplier: grahamMultiplier,
      }
    };
  }, [company, grahamMultiplier]);

  // Cálculo Bazin
  const bazinValue = useMemo(() => {
    if (!company) return null;
    
    // Fórmula de Bazin: DPA / Yield Mínimo Desejado
    const value = company.dpa / (bazinMinYield / 100);
    const upside = ((value - company.price) / company.price) * 100;
    
    return {
      value,
      upside,
      formula: `${company.dpa.toFixed(2)} / ${bazinMinYield}%`,
      components: {
        dpa: company.dpa,
        yieldMinimo: bazinMinYield,
        yieldAtual: company.dividendYield,
      }
    };
  }, [company, bazinMinYield]);

  // Cálculo DCF Simplificado
  const dcfValue = useMemo(() => {
    if (!company) return null;
    
    let totalPV = 0;
    const cashFlows: number[] = [];
    let currentCF = company.lpa;
    
    // Projetar fluxos de caixa
    for (let i = 1; i <= dcfYears; i++) {
      currentCF = currentCF * (1 + dcfGrowthRate / 100);
      const pv = currentCF / Math.pow(1 + dcfDiscountRate / 100, i);
      totalPV += pv;
      cashFlows.push(currentCF);
    }
    
    // Valor terminal (Gordon Growth)
    const terminalValue = (currentCF * (1 + dcfTerminalGrowth / 100)) / 
                          ((dcfDiscountRate - dcfTerminalGrowth) / 100);
    const terminalPV = terminalValue / Math.pow(1 + dcfDiscountRate / 100, dcfYears);
    
    const value = totalPV + terminalPV;
    const upside = ((value - company.price) / company.price) * 100;
    
    return {
      value,
      upside,
      totalPV,
      terminalPV,
      terminalValue,
      cashFlows,
      formula: `Σ FC/(1+r)^n + TV/(1+r)^n`,
    };
  }, [company, dcfGrowthRate, dcfDiscountRate, dcfTerminalGrowth, dcfYears]);

  // Cálculo Peter Lynch (PEG)
  const lynchValue = useMemo(() => {
    if (!company) return null;
    
    // PEG = P/L / Taxa de Crescimento
    const peg = company.pl / company.crescimentoLucro5a;
    
    // Preço justo = LPA × Taxa de Crescimento
    const value = company.lpa * company.crescimentoLucro5a;
    const upside = ((value - company.price) / company.price) * 100;
    
    let rating: string;
    if (peg < 1) rating = 'Subvalorizada';
    else if (peg <= 1.5) rating = 'Preço Justo';
    else if (peg <= 2) rating = 'Ligeiramente Cara';
    else rating = 'Sobrevalorizada';
    
    return {
      value,
      upside,
      peg,
      rating,
      formula: `LPA × Taxa de Crescimento`,
      components: {
        pl: company.pl,
        crescimento: company.crescimentoLucro5a,
      }
    };
  }, [company]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getUpsideColor = (upside: number) => {
    if (upside > 30) return 'text-green-500';
    if (upside > 0) return 'text-green-400';
    if (upside > -15) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getUpsideIcon = (upside: number) => {
    if (upside > 0) return <ArrowUp className="h-4 w-4" />;
    if (upside < 0) return <ArrowDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getRecommendation = (upside: number) => {
    if (upside > 30) return { text: 'Forte Potencial de Alta', color: 'bg-green-500' };
    if (upside > 15) return { text: 'Potencial de Alta', color: 'bg-green-400' };
    if (upside > 0) return { text: 'Ligeiramente Subvalorizada', color: 'bg-yellow-500' };
    if (upside > -15) return { text: 'Preço Justo', color: 'bg-gray-500' };
    return { text: 'Sobrevalorizada', color: 'bg-red-500' };
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Valuation Automatizado</h1>
        </div>
        <p className="text-muted-foreground">
          Calcule o preço justo de ações usando métodos consagrados: Graham, Bazin, DCF e Peter Lynch
        </p>
      </div>

      {/* Seleção de Ativo */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Ticker da Ação</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Ex: WEGE3, ITUB4, PETR4..."
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Select value={ticker} onValueChange={setTicker}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPANY_DATA).map(([t, c]) => (
                      <SelectItem key={t} value={t}>{t} - {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {company && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  <Badge variant="outline">{company.sector}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatCurrency(company.price)}</div>
                  <div className="text-sm text-muted-foreground">
                    P/L: {company.pl.toFixed(1)} | P/VP: {company.pvp.toFixed(2)} | DY: {company.dividendYield.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {company ? (
        <Tabs value={method} onValueChange={(v) => setMethod(v as ValuationMethod)}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="graham" className="gap-2">
              <Scale className="h-4 w-4" />
              Graham
            </TabsTrigger>
            <TabsTrigger value="bazin" className="gap-2">
              <Coins className="h-4 w-4" />
              Bazin
            </TabsTrigger>
            <TabsTrigger value="dcf" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              DCF
            </TabsTrigger>
            <TabsTrigger value="lynch" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Lynch
            </TabsTrigger>
          </TabsList>

          {/* Graham */}
          <TabsContent value="graham">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fórmula de Benjamin Graham</CardTitle>
                  <CardDescription>
                    Método clássico de value investing que considera lucro e valor patrimonial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Multiplicador Graham (padrão: 22.5)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[grahamMultiplier]}
                        onValueChange={([v]) => setGrahamMultiplier(v)}
                        min={15}
                        max={30}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{grahamMultiplier}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      22.5 = P/L máximo de 15 × P/VP máximo de 1.5
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-2">Fórmula</div>
                    <div className="font-mono text-lg">
                      Preço Justo = √({grahamMultiplier} × LPA × VPA)
                    </div>
                    <div className="font-mono text-sm text-muted-foreground mt-1">
                      = √({grahamMultiplier} × {company.lpa.toFixed(2)} × {company.vpa.toFixed(2)})
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">LPA</div>
                      <div className="text-xl font-bold">{formatCurrency(company.lpa)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">VPA</div>
                      <div className="text-xl font-bold">{formatCurrency(company.vpa)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {grahamValue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-sm text-muted-foreground">Preço Justo (Graham)</div>
                      <div className="text-4xl font-bold text-primary">{formatCurrency(grahamValue.value)}</div>
                      <div className={`flex items-center justify-center gap-1 mt-2 ${getUpsideColor(grahamValue.upside)}`}>
                        {getUpsideIcon(grahamValue.upside)}
                        <span className="text-xl font-bold">
                          {grahamValue.upside > 0 ? '+' : ''}{grahamValue.upside.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Atual</span>
                        <span className="font-bold">{formatCurrency(company.price)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Justo</span>
                        <span className="font-bold text-primary">{formatCurrency(grahamValue.value)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Margem de Segurança</span>
                        <span className={`font-bold ${getUpsideColor(grahamValue.upside)}`}>
                          {grahamValue.upside.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <Badge className={`w-full justify-center mt-4 py-2 ${getRecommendation(grahamValue.upside).color}`}>
                      {getRecommendation(grahamValue.upside).text}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Bazin */}
          <TabsContent value="bazin">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Método Décio Bazin</CardTitle>
                  <CardDescription>
                    Focado em dividendos - ideal para investidores que buscam renda passiva
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Dividend Yield Mínimo Desejado (%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[bazinMinYield]}
                        onValueChange={([v]) => setBazinMinYield(v)}
                        min={4}
                        max={12}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{bazinMinYield}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bazin recomendava mínimo de 6% de yield
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-2">Fórmula</div>
                    <div className="font-mono text-lg">
                      Preço Justo = DPA / Yield Mínimo
                    </div>
                    <div className="font-mono text-sm text-muted-foreground mt-1">
                      = {company.dpa.toFixed(2)} / {bazinMinYield}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">DPA (Dividendo/Ação)</div>
                      <div className="text-xl font-bold">{formatCurrency(company.dpa)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">DY Atual</div>
                      <div className="text-xl font-bold text-green-500">{company.dividendYield.toFixed(1)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {bazinValue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-sm text-muted-foreground">Preço Justo (Bazin)</div>
                      <div className="text-4xl font-bold text-primary">{formatCurrency(bazinValue.value)}</div>
                      <div className={`flex items-center justify-center gap-1 mt-2 ${getUpsideColor(bazinValue.upside)}`}>
                        {getUpsideIcon(bazinValue.upside)}
                        <span className="text-xl font-bold">
                          {bazinValue.upside > 0 ? '+' : ''}{bazinValue.upside.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Atual</span>
                        <span className="font-bold">{formatCurrency(company.price)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Teto (Bazin)</span>
                        <span className="font-bold text-primary">{formatCurrency(bazinValue.value)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Yield no Preço Teto</span>
                        <span className="font-bold text-green-500">{bazinMinYield}%</span>
                      </div>
                    </div>

                    {company.dividendYield >= bazinMinYield ? (
                      <Badge className="w-full justify-center mt-4 py-2 bg-green-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Yield Atual Acima do Mínimo
                      </Badge>
                    ) : (
                      <Badge className="w-full justify-center mt-4 py-2 bg-yellow-500">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Yield Atual Abaixo do Mínimo
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* DCF */}
          <TabsContent value="dcf">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Caixa Descontado (DCF)</CardTitle>
                  <CardDescription>
                    Método mais completo que projeta lucros futuros e traz a valor presente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Taxa de Crescimento Anual (%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[dcfGrowthRate]}
                        onValueChange={([v]) => setDcfGrowthRate(v)}
                        min={0}
                        max={25}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{dcfGrowthRate}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Histórico: {company.crescimentoLucro5a.toFixed(1)}% a.a.
                    </p>
                  </div>

                  <div>
                    <Label>Taxa de Desconto (WACC) (%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[dcfDiscountRate]}
                        onValueChange={([v]) => setDcfDiscountRate(v)}
                        min={8}
                        max={20}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{dcfDiscountRate}%</span>
                    </div>
                  </div>

                  <div>
                    <Label>Crescimento na Perpetuidade (%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[dcfTerminalGrowth]}
                        onValueChange={([v]) => setDcfTerminalGrowth(v)}
                        min={0}
                        max={5}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{dcfTerminalGrowth}%</span>
                    </div>
                  </div>

                  <div>
                    <Label>Período de Projeção (anos)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[dcfYears]}
                        onValueChange={([v]) => setDcfYears(v)}
                        min={5}
                        max={15}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-mono w-12">{dcfYears}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {dcfValue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-sm text-muted-foreground">Preço Justo (DCF)</div>
                      <div className="text-4xl font-bold text-primary">{formatCurrency(dcfValue.value)}</div>
                      <div className={`flex items-center justify-center gap-1 mt-2 ${getUpsideColor(dcfValue.upside)}`}>
                        {getUpsideIcon(dcfValue.upside)}
                        <span className="text-xl font-bold">
                          {dcfValue.upside > 0 ? '+' : ''}{dcfValue.upside.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>VP dos Fluxos</span>
                        <span className="font-bold">{formatCurrency(dcfValue.totalPV)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>VP do Valor Terminal</span>
                        <span className="font-bold">{formatCurrency(dcfValue.terminalPV)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Justo Total</span>
                        <span className="font-bold text-primary">{formatCurrency(dcfValue.value)}</span>
                      </div>
                    </div>

                    <Badge className={`w-full justify-center mt-4 py-2 ${getRecommendation(dcfValue.upside).color}`}>
                      {getRecommendation(dcfValue.upside).text}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Peter Lynch */}
          <TabsContent value="lynch">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Método Peter Lynch (PEG)</CardTitle>
                  <CardDescription>
                    Relaciona o P/L com a taxa de crescimento - ideal para empresas de crescimento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-2">Fórmula PEG</div>
                    <div className="font-mono text-lg">
                      PEG = P/L / Taxa de Crescimento
                    </div>
                    <div className="font-mono text-sm text-muted-foreground mt-1">
                      = {company.pl.toFixed(1)} / {company.crescimentoLucro5a.toFixed(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">P/L</div>
                      <div className="text-xl font-bold">{company.pl.toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Crescimento (5a)</div>
                      <div className="text-xl font-bold">{company.crescimentoLucro5a.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Interpretação do PEG</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>PEG &lt; 1: Subvalorizada</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-yellow-500" />
                        <span>PEG 1-1.5: Preço justo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>PEG 1.5-2: Ligeiramente cara</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-red-500" />
                        <span>PEG &gt; 2: Sobrevalorizada</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {lynchValue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-sm text-muted-foreground">PEG Ratio</div>
                      <div className={`text-4xl font-bold ${lynchValue.peg < 1 ? 'text-green-500' : lynchValue.peg < 1.5 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {lynchValue.peg.toFixed(2)}
                      </div>
                      <Badge className={`mt-2 ${lynchValue.peg < 1 ? 'bg-green-500' : lynchValue.peg < 1.5 ? 'bg-yellow-500' : lynchValue.peg < 2 ? 'bg-orange-500' : 'bg-red-500'}`}>
                        {lynchValue.rating}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Atual</span>
                        <span className="font-bold">{formatCurrency(company.price)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Preço Justo (Lynch)</span>
                        <span className="font-bold text-primary">{formatCurrency(lynchValue.value)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span>Upside/Downside</span>
                        <span className={`font-bold ${getUpsideColor(lynchValue.upside)}`}>
                          {lynchValue.upside > 0 ? '+' : ''}{lynchValue.upside.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        {lynchValue.peg < 1 
                          ? 'Peter Lynch consideraria esta ação uma boa oportunidade de compra, pois o crescimento justifica o preço.'
                          : lynchValue.peg < 1.5
                          ? 'A ação está em um preço justo considerando seu crescimento.'
                          : 'O preço atual pode estar elevado em relação ao crescimento esperado.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Selecione uma ação</h3>
            <p className="text-muted-foreground">
              Digite o ticker ou selecione uma ação para calcular o preço justo
            </p>
          </CardContent>
        </Card>
      )}

      {/* Card Informativo */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sobre os Métodos de Valuation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-500" />
                Graham
              </h4>
              <p className="text-sm text-muted-foreground">
                Método conservador que considera lucro e patrimônio. Ideal para empresas 
                maduras e estáveis. Não funciona bem para empresas de crescimento ou com prejuízo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Coins className="h-4 w-4 text-green-500" />
                Bazin
              </h4>
              <p className="text-sm text-muted-foreground">
                Focado em dividendos, define o preço máximo para atingir um yield mínimo. 
                Ideal para investidores de renda passiva. Não considera crescimento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                DCF
              </h4>
              <p className="text-sm text-muted-foreground">
                Método mais completo que projeta lucros futuros. Muito sensível às premissas 
                de crescimento e taxa de desconto. Requer análise cuidadosa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Peter Lynch
              </h4>
              <p className="text-sm text-muted-foreground">
                Relaciona preço com crescimento através do PEG. Ideal para empresas de 
                crescimento. PEG abaixo de 1 indica oportunidade de compra.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-500">Aviso Importante</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Nenhum método de valuation é perfeito. Use múltiplos métodos e compare os resultados. 
                  Considere sempre os riscos do negócio, a qualidade da gestão e o cenário macroeconômico 
                  antes de investir. Este conteúdo é educacional e não constitui recomendação de investimento.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

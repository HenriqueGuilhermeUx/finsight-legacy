import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info,
  DollarSign,
  Percent,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const countries = [
  { id: "BR", name: "Brasil", flag: "🇧🇷" },
  { id: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { id: "EU", name: "Zona Euro", flag: "🇪🇺" },
  { id: "CN", name: "China", flag: "🇨🇳" },
  { id: "JP", name: "Japão", flag: "🇯🇵" },
];

// Mock macro data
const macroData = {
  BR: {
    inflation: { current: 4.82, previous: 4.65, trend: "up" },
    interestRate: { current: 13.75, previous: 13.25, trend: "up" },
    gdpGrowth: { current: 2.9, previous: 3.0, trend: "down" },
    exchangeRate: { current: 5.46, previous: 5.32, trend: "up" },
    unemployment: { current: 7.8, previous: 8.1, trend: "down" },
    history: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString("pt-BR", { month: "short" }),
      inflation: 4 + Math.random() * 2,
      interestRate: 12 + Math.random() * 2,
      gdpGrowth: 2 + Math.random() * 2,
    })),
    insight: "O cenário macroeconômico brasileiro apresenta inflação controlada em 4.82%, dentro da meta do Banco Central. A taxa Selic em 13.75% permanece elevada, favorecendo investimentos em renda fixa. O PIB cresceu 2.9% no último período, demonstrando resiliência da economia. O dólar em R$ 5.46 reflete incertezas globais e fiscais domésticas. Para investidores, o momento favorece diversificação entre renda fixa (aproveitando juros altos) e exposição seletiva à renda variável em setores defensivos.",
  },
  US: {
    inflation: { current: 3.2, previous: 3.4, trend: "down" },
    interestRate: { current: 5.25, previous: 5.50, trend: "down" },
    gdpGrowth: { current: 2.1, previous: 2.0, trend: "up" },
    exchangeRate: { current: 1.0, previous: 1.0, trend: "stable" },
    unemployment: { current: 3.7, previous: 3.8, trend: "down" },
    history: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString("pt-BR", { month: "short" }),
      inflation: 3 + Math.random() * 1,
      interestRate: 5 + Math.random() * 0.5,
      gdpGrowth: 1.5 + Math.random() * 1,
    })),
    insight: "A economia americana mostra sinais de desaceleração controlada (soft landing). A inflação em 3.2% está convergindo para a meta de 2%, permitindo que o Fed inicie cortes de juros. O mercado de trabalho permanece aquecido com desemprego em 3.7%. Para investidores brasileiros, o cenário sugere oportunidades em ativos americanos, especialmente com a perspectiva de corte de juros que tende a valorizar ações e enfraquecer o dólar.",
  },
};

const indicators = [
  { key: "inflation", label: "Inflação", icon: Percent, unit: "%" },
  { key: "interestRate", label: "Taxa de Juros", icon: TrendingUp, unit: "%" },
  { key: "gdpGrowth", label: "Crescimento PIB", icon: BarChart3, unit: "%" },
  { key: "exchangeRate", label: "Câmbio (USD)", icon: DollarSign, unit: "" },
  { key: "unemployment", label: "Desemprego", icon: TrendingDown, unit: "%" },
];

export default function PainelMacro() {
  const [selectedCountry, setSelectedCountry] = useState("BR");
  const [compareCountry, setCompareCountry] = useState("");

  const countryData = macroData[selectedCountry as keyof typeof macroData] || macroData.BR;
  const compareData = compareCountry ? macroData[compareCountry as keyof typeof macroData] : null;

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <span className="text-muted-foreground">—</span>;
  };

  const getTrendColor = (trend: string, indicator: string) => {
    // For unemployment and inflation, down is good
    const invertedIndicators = ["unemployment", "inflation"];
    if (invertedIndicators.includes(indicator)) {
      return trend === "down" ? "text-emerald-400" : trend === "up" ? "text-red-400" : "";
    }
    // For GDP and interest rate (for savers), up can be good
    return trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "";
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Macroeconômico</h1>
          <p className="text-muted-foreground">
            Acompanhe inflação, juros, PIB e câmbio ao redor do mundo.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={compareCountry} onValueChange={setCompareCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Comparar com..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem comparação</SelectItem>
                {countries.filter(c => c.id !== selectedCountry).map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {indicators.map((indicator) => {
            const data = countryData[indicator.key as keyof typeof countryData] as any;
            if (!data || typeof data !== "object") return null;
            
            return (
              <Card key={indicator.key}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <indicator.icon className="h-4 w-4" />
                    <span className="text-sm">{indicator.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">
                      {indicator.key === "exchangeRate" ? "R$ " : ""}
                      {data.current}
                      {indicator.unit}
                    </span>
                    <span className={getTrendColor(data.trend, indicator.key)}>
                      {getTrendIcon(data.trend)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Anterior: {data.previous}{indicator.unit}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Séries Históricas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="inflation">
                <TabsList className="mb-4">
                  <TabsTrigger value="inflation">Inflação</TabsTrigger>
                  <TabsTrigger value="interestRate">Juros</TabsTrigger>
                  <TabsTrigger value="gdpGrowth">PIB</TabsTrigger>
                </TabsList>

                {["inflation", "interestRate", "gdpGrowth"].map((metric) => (
                  <TabsContent key={metric} value={metric}>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={countryData.history}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey={metric}
                            name={countries.find(c => c.id === selectedCountry)?.name}
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                          />
                          {compareData && (
                            <Line
                              type="monotone"
                              dataKey={metric}
                              data={compareData.history}
                              name={countries.find(c => c.id === compareCountry)?.name}
                              stroke="hsl(var(--chart-2))"
                              strokeWidth={2}
                              dot={false}
                              strokeDasharray="5 5"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Resumo Macroeconômico
              </CardTitle>
              <CardDescription>
                Análise gerada por IA para {countries.find(c => c.id === selectedCountry)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{countryData.insight}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Esta análise é baseada em dados públicos e não constitui recomendação de investimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

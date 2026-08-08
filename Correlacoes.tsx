import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  GitBranch,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mock correlation data
const assets = ["PETR4", "VALE3", "ITUB4", "BBDC4", "WEGE3", "ABEV3", "RENT3", "SUZB3", "AAPL", "MSFT", "IBOV", "SPX"];

// Generate correlation matrix
const generateCorrelationMatrix = () => {
  const matrix: Record<string, Record<string, number>> = {};
  
  assets.forEach(asset1 => {
    matrix[asset1] = {};
    assets.forEach(asset2 => {
      if (asset1 === asset2) {
        matrix[asset1][asset2] = 1;
      } else if (matrix[asset2] && matrix[asset2][asset1] !== undefined) {
        matrix[asset1][asset2] = matrix[asset2][asset1];
      } else {
        // Generate realistic correlations
        let correlation = Math.random() * 2 - 1;
        
        // Same sector correlations tend to be higher
        if ((asset1.includes("PETR") && asset2.includes("VALE")) ||
            (asset1.includes("ITUB") && asset2.includes("BBDC"))) {
          correlation = 0.5 + Math.random() * 0.4;
        }
        
        // Index correlations
        if (asset1 === "IBOV" || asset2 === "IBOV") {
          correlation = 0.4 + Math.random() * 0.5;
        }
        if (asset1 === "SPX" || asset2 === "SPX") {
          correlation = 0.2 + Math.random() * 0.4;
        }
        
        // US stocks correlation
        if ((asset1 === "AAPL" && asset2 === "MSFT") || (asset1 === "MSFT" && asset2 === "AAPL")) {
          correlation = 0.7 + Math.random() * 0.2;
        }
        
        matrix[asset1][asset2] = Number(correlation.toFixed(2));
      }
    });
  });
  
  return matrix;
};

// Generate beta and volatility data
const generateRiskData = () => {
  return assets.filter(a => a !== "IBOV" && a !== "SPX").map(ticker => ({
    ticker,
    beta: Number((0.5 + Math.random() * 1.5).toFixed(2)),
    volatility: Number((15 + Math.random() * 35).toFixed(1)),
    return1y: Number((-20 + Math.random() * 60).toFixed(1)),
    sharpe: Number((-0.5 + Math.random() * 2.5).toFixed(2)),
    maxDrawdown: Number((-5 - Math.random() * 40).toFixed(1)),
    varDaily: Number((1 + Math.random() * 4).toFixed(2)),
  }));
};

// Get correlation color
const getCorrelationColor = (value: number) => {
  if (value >= 0.7) return "bg-emerald-600 text-white";
  if (value >= 0.4) return "bg-emerald-400 text-white";
  if (value >= 0.1) return "bg-emerald-200 text-emerald-900";
  if (value >= -0.1) return "bg-gray-200 text-gray-900";
  if (value >= -0.4) return "bg-red-200 text-red-900";
  if (value >= -0.7) return "bg-red-400 text-white";
  return "bg-red-600 text-white";
};

// Get beta interpretation
const getBetaInterpretation = (beta: number) => {
  if (beta > 1.5) return { label: "Muito Agressivo", color: "text-red-500", description: "Alta sensibilidade ao mercado" };
  if (beta > 1.2) return { label: "Agressivo", color: "text-orange-500", description: "Acima da média do mercado" };
  if (beta > 0.8) return { label: "Neutro", color: "text-yellow-500", description: "Próximo ao mercado" };
  if (beta > 0.5) return { label: "Defensivo", color: "text-blue-500", description: "Menor volatilidade que o mercado" };
  return { label: "Muito Defensivo", color: "text-emerald-500", description: "Baixa correlação com o mercado" };
};

export default function Correlacoes() {
  const [selectedTab, setSelectedTab] = useState("matrix");
  const [benchmark, setBenchmark] = useState("IBOV");
  
  const correlationMatrix = useMemo(() => generateCorrelationMatrix(), []);
  const riskData = useMemo(() => generateRiskData(), []);
  
  // Scatter plot data for risk/return
  const scatterData = riskData.map(d => ({
    x: d.volatility,
    y: d.return1y,
    z: d.beta * 100,
    ticker: d.ticker,
    sharpe: d.sharpe,
  }));
  
  // Find highly correlated and uncorrelated pairs
  const correlationPairs = useMemo(() => {
    const pairs: { asset1: string; asset2: string; correlation: number }[] = [];
    
    assets.forEach((asset1, i) => {
      assets.forEach((asset2, j) => {
        if (i < j) {
          pairs.push({
            asset1,
            asset2,
            correlation: correlationMatrix[asset1][asset2],
          });
        }
      });
    });
    
    return pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [correlationMatrix]);
  
  const highlyCorrelated = correlationPairs.filter(p => p.correlation > 0.6).slice(0, 5);
  const negativelyCorrelated = correlationPairs.filter(p => p.correlation < -0.3).slice(0, 5);
  const uncorrelated = correlationPairs.filter(p => Math.abs(p.correlation) < 0.2).slice(0, 5);

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <GitBranch className="h-8 w-8 text-primary" />
              Correlações e Análise de Risco
            </h1>
            <p className="text-muted-foreground mt-1">
              Matriz de correlações, Beta, volatilidade e análise risco/retorno
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={benchmark} onValueChange={setBenchmark}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Benchmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IBOV">IBOV</SelectItem>
                <SelectItem value="SPX">S&P 500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ativos Analisados</p>
                  <p className="text-2xl font-bold">{assets.length}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Correlação Média</p>
                  <p className="text-2xl font-bold">0.42</p>
                </div>
                <GitBranch className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beta Médio</p>
                  <p className="text-2xl font-bold">
                    {(riskData.reduce((sum, d) => sum + d.beta, 0) / riskData.length).toFixed(2)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Volatilidade Média</p>
                  <p className="text-2xl font-bold">
                    {(riskData.reduce((sum, d) => sum + d.volatility, 0) / riskData.length).toFixed(1)}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Matriz de Correlações
            </TabsTrigger>
            <TabsTrigger value="beta" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Beta e Volatilidade
            </TabsTrigger>
            <TabsTrigger value="scatter" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Risco x Retorno
            </TabsTrigger>
          </TabsList>

          {/* Correlation Matrix */}
          <TabsContent value="matrix">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Matriz de Correlações</CardTitle>
                    <CardDescription>
                      Correlação entre ativos nos últimos 12 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            <th className="p-1"></th>
                            {assets.map(asset => (
                              <th key={asset} className="p-1 font-medium text-center" style={{ writingMode: "vertical-rl" }}>
                                {asset}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {assets.map(asset1 => (
                            <tr key={asset1}>
                              <td className="p-1 font-medium">{asset1}</td>
                              {assets.map(asset2 => {
                                const value = correlationMatrix[asset1][asset2];
                                return (
                                  <td key={asset2} className="p-0.5">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded text-xs font-mono ${getCorrelationColor(value)}`}>
                                      {value.toFixed(1)}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                      <span className="text-xs text-muted-foreground">Correlação:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-red-600"></div>
                        <span className="text-xs">-1.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-red-200"></div>
                        <span className="text-xs">-0.5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-gray-200"></div>
                        <span className="text-xs">0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-emerald-200"></div>
                        <span className="text-xs">+0.5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-emerald-600"></div>
                        <span className="text-xs">+1.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Correlation Insights */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      Alta Correlação Positiva
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {highlyCorrelated.map((pair, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm">{pair.asset1} / {pair.asset2}</span>
                        <Badge className="bg-emerald-500">{pair.correlation.toFixed(2)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      Correlação Negativa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {negativelyCorrelated.length > 0 ? (
                      negativelyCorrelated.map((pair, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/50">
                          <span className="text-sm">{pair.asset1} / {pair.asset2}</span>
                          <Badge variant="destructive">{pair.correlation.toFixed(2)}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum par com correlação negativa significativa</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Baixa Correlação (Diversificação)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {uncorrelated.map((pair, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm">{pair.asset1} / {pair.asset2}</span>
                        <Badge variant="secondary">{pair.correlation.toFixed(2)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Beta and Volatility */}
          <TabsContent value="beta">
            <Card>
              <CardHeader>
                <CardTitle>Beta e Métricas de Risco</CardTitle>
                <CardDescription>
                  Análise de sensibilidade ao mercado e volatilidade (benchmark: {benchmark})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Ativo</th>
                        <th className="text-right py-3 px-2">Beta</th>
                        <th className="text-left py-3 px-2">Perfil</th>
                        <th className="text-right py-3 px-2">Volatilidade</th>
                        <th className="text-right py-3 px-2">Retorno 1A</th>
                        <th className="text-right py-3 px-2">Sharpe</th>
                        <th className="text-right py-3 px-2">Max Drawdown</th>
                        <th className="text-right py-3 px-2">VaR Diário</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskData.sort((a, b) => b.beta - a.beta).map((data) => {
                        const interpretation = getBetaInterpretation(data.beta);
                        return (
                          <tr key={data.ticker} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2 font-medium">{data.ticker}</td>
                            <td className="text-right py-3 px-2 font-mono">{data.beta.toFixed(2)}</td>
                            <td className="py-3 px-2">
                              <Badge variant="outline" className={interpretation.color}>
                                {interpretation.label}
                              </Badge>
                            </td>
                            <td className="text-right py-3 px-2 font-mono">{data.volatility.toFixed(1)}%</td>
                            <td className={`text-right py-3 px-2 font-mono ${data.return1y >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                              {data.return1y >= 0 ? "+" : ""}{data.return1y.toFixed(1)}%
                            </td>
                            <td className={`text-right py-3 px-2 font-mono ${data.sharpe >= 1 ? "text-emerald-500" : data.sharpe < 0 ? "text-red-500" : ""}`}>
                              {data.sharpe.toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 font-mono text-red-500">
                              {data.maxDrawdown.toFixed(1)}%
                            </td>
                            <td className="text-right py-3 px-2 font-mono">
                              {data.varDaily.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Beta Interpretation Guide */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4" />
                    Interpretação do Beta
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                    <div className="p-2 rounded bg-emerald-500/20">
                      <span className="font-medium text-emerald-500">β &lt; 0.5</span>
                      <p className="text-muted-foreground">Muito Defensivo</p>
                    </div>
                    <div className="p-2 rounded bg-blue-500/20">
                      <span className="font-medium text-blue-500">0.5 ≤ β &lt; 0.8</span>
                      <p className="text-muted-foreground">Defensivo</p>
                    </div>
                    <div className="p-2 rounded bg-yellow-500/20">
                      <span className="font-medium text-yellow-500">0.8 ≤ β ≤ 1.2</span>
                      <p className="text-muted-foreground">Neutro</p>
                    </div>
                    <div className="p-2 rounded bg-orange-500/20">
                      <span className="font-medium text-orange-500">1.2 &lt; β ≤ 1.5</span>
                      <p className="text-muted-foreground">Agressivo</p>
                    </div>
                    <div className="p-2 rounded bg-red-500/20">
                      <span className="font-medium text-red-500">β &gt; 1.5</span>
                      <p className="text-muted-foreground">Muito Agressivo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk/Return Scatter */}
          <TabsContent value="scatter">
            <Card>
              <CardHeader>
                <CardTitle>Gráfico Risco x Retorno</CardTitle>
                <CardDescription>
                  Dispersão de ativos por volatilidade (risco) e retorno em 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Volatilidade"
                        unit="%"
                        stroke="#888"
                        label={{ value: "Volatilidade (%)", position: "bottom", fill: "#888" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Retorno"
                        unit="%"
                        stroke="#888"
                        label={{ value: "Retorno 12M (%)", angle: -90, position: "left", fill: "#888" }}
                      />
                      <ZAxis type="number" dataKey="z" range={[100, 400]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                        formatter={(value: number, name: string) => {
                          if (name === "Volatilidade") return [`${value.toFixed(1)}%`, name];
                          if (name === "Retorno") return [`${value.toFixed(1)}%`, name];
                          return [value, name];
                        }}
                        labelFormatter={(label) => {
                          const point = scatterData.find(d => d.x === label);
                          return point ? point.ticker : "";
                        }}
                      />
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                      <Scatter
                        name="Ativos"
                        data={scatterData}
                        fill="#3b82f6"
                      >
                        {scatterData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.y >= 0 ? "#22c55e" : "#ef4444"}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Quadrant Labels */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card className="bg-emerald-500/10 border-emerald-500/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-emerald-500">Quadrante Ideal</h4>
                      <p className="text-sm text-muted-foreground">
                        Baixa volatilidade + Alto retorno
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-500/10 border-yellow-500/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-yellow-500">Alto Risco/Alto Retorno</h4>
                      <p className="text-sm text-muted-foreground">
                        Alta volatilidade + Alto retorno
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-500">Conservador</h4>
                      <p className="text-sm text-muted-foreground">
                        Baixa volatilidade + Baixo retorno
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-red-500">Evitar</h4>
                      <p className="text-sm text-muted-foreground">
                        Alta volatilidade + Baixo retorno
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Activity, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Info,
  AlertTriangle,
  BarChart3,
  Grid3X3
} from "lucide-react";
import { Link } from "wouter";

export default function CorrelacaoSetores() {
  const [activeTab, setActiveTab] = useState("matriz");
  
  const { data: correlationData, isLoading, refetch, isFetching } = 
    trpc.sectorVolatilityAlerts.sectorCorrelation.useQuery(undefined, {
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const getCorrelationColor = (correlation: number) => {
    if (correlation >= 0.7) return "bg-green-500";
    if (correlation >= 0.4) return "bg-green-400";
    if (correlation >= 0.1) return "bg-green-300";
    if (correlation >= -0.1) return "bg-gray-400";
    if (correlation >= -0.4) return "bg-red-300";
    if (correlation >= -0.7) return "bg-red-400";
    return "bg-red-500";
  };

  const getCorrelationTextColor = (correlation: number) => {
    if (Math.abs(correlation) >= 0.4) return "text-white";
    return "text-gray-900";
  };

  const getCorrelationLabel = (correlation: number) => {
    if (correlation >= 0.7) return "Forte Positiva";
    if (correlation >= 0.4) return "Moderada Positiva";
    if (correlation >= 0.1) return "Fraca Positiva";
    if (correlation >= -0.1) return "Sem Correlação";
    if (correlation >= -0.4) return "Fraca Negativa";
    if (correlation >= -0.7) return "Moderada Negativa";
    return "Forte Negativa";
  };

  const getCorrelationValue = (sector1: string, sector2: string) => {
    if (!correlationData?.correlations) return null;
    const found = correlationData.correlations.find(
      c => (c.sector1 === sector1 && c.sector2 === sector2) ||
           (c.sector1 === sector2 && c.sector2 === sector1)
    );
    return found?.correlation ?? null;
  };

  // Get unique sectors
  const sectors = correlationData?.sectors || [];

  // Get top correlations (excluding self-correlations)
  const topCorrelations = correlationData?.correlations
    ?.filter(c => c.sector1 !== c.sector2)
    ?.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    ?.slice(0, 10) || [];

  // Get positive correlations
  const positiveCorrelations = correlationData?.correlations
    ?.filter(c => c.sector1 !== c.sector2 && c.correlation > 0.3)
    ?.sort((a, b) => b.correlation - a.correlation) || [];

  // Get negative correlations
  const negativeCorrelations = correlationData?.correlations
    ?.filter(c => c.sector1 !== c.sector2 && c.correlation < -0.1)
    ?.sort((a, b) => a.correlation - b.correlation) || [];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Grid3X3 className="h-8 w-8 text-primary" />
            Correlação entre Setores
          </h1>
          <p className="text-muted-foreground mt-1">
            Analise como os setores se movem em relação uns aos outros
          </p>
        </div>
        
        <Button 
          onClick={() => refetch()} 
          disabled={isFetching}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>
      
      {/* Info Banner */}
      <Card className="mb-6 bg-blue-500/10 border-blue-500/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-500">O que é correlação?</p>
              <p className="text-sm text-muted-foreground">
                A correlação mede como dois setores se movem juntos. Valores próximos de +1 indicam que os setores 
                tendem a subir e cair juntos. Valores próximos de -1 indicam movimentos opostos. Valores próximos 
                de 0 indicam que os setores se movem independentemente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="matriz" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Matriz de Correlação
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="matriz">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Correlação</CardTitle>
                <CardDescription>
                  Heatmap mostrando a correlação entre cada par de setores (baseado nos últimos 5 dias)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sectors.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="p-2 text-left font-medium"></th>
                          {sectors.map(sector => (
                            <th key={sector} className="p-2 text-center font-medium" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', height: '120px' }}>
                              <span className="whitespace-nowrap">{sector}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sectors.map(sector1 => (
                          <tr key={sector1}>
                            <td className="p-2 font-medium whitespace-nowrap">{sector1}</td>
                            {sectors.map(sector2 => {
                              const correlation = getCorrelationValue(sector1, sector2);
                              return (
                                <td 
                                  key={`${sector1}-${sector2}`} 
                                  className={`p-2 text-center ${getCorrelationColor(correlation || 0)} ${getCorrelationTextColor(correlation || 0)}`}
                                  title={`${sector1} vs ${sector2}: ${correlation?.toFixed(3) || 'N/A'}`}
                                >
                                  {correlation !== null ? correlation.toFixed(2) : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Dados de correlação não disponíveis</p>
                    <p className="text-sm">Tente atualizar os dados</p>
                  </div>
                )}
                
                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Legenda:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs">-1.0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-300 rounded"></div>
                    <span className="text-xs">-0.5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-300 rounded"></div>
                    <span className="text-xs">+0.5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs">+1.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Correlations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Correlações Mais Fortes
                  </CardTitle>
                  <CardDescription>
                    Pares de setores com maior correlação (positiva ou negativa)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topCorrelations.length > 0 ? (
                    <div className="space-y-3">
                      {topCorrelations.map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{c.sector1}</div>
                            <div className="text-xs text-muted-foreground">vs {c.sector2}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {c.correlation >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <Badge 
                              variant="outline" 
                              className={c.correlation >= 0 ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
                            >
                              {c.correlation >= 0 ? "+" : ""}{c.correlation.toFixed(3)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Nenhuma correlação significativa encontrada</p>
                  )}
                </CardContent>
              </Card>

              {/* Positive Correlations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-500">
                    <TrendingUp className="h-5 w-5" />
                    Correlações Positivas
                  </CardTitle>
                  <CardDescription>
                    Setores que tendem a se mover na mesma direção
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {positiveCorrelations.length > 0 ? (
                    <div className="space-y-2">
                      {positiveCorrelations.slice(0, 8).map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-green-500/10">
                          <span className="text-sm">{c.sector1} ↔ {c.sector2}</span>
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            +{c.correlation.toFixed(2)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Nenhuma correlação positiva significativa</p>
                  )}
                </CardContent>
              </Card>

              {/* Negative Correlations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <TrendingDown className="h-5 w-5" />
                    Correlações Negativas
                  </CardTitle>
                  <CardDescription>
                    Setores que tendem a se mover em direções opostas (hedge natural)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {negativeCorrelations.length > 0 ? (
                    <div className="space-y-2">
                      {negativeCorrelations.slice(0, 8).map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-red-500/10">
                          <span className="text-sm">{c.sector1} ↔ {c.sector2}</span>
                          <Badge variant="outline" className="border-red-500 text-red-500">
                            {c.correlation.toFixed(2)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Nenhuma correlação negativa significativa</p>
                  )}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Como Usar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm mb-1">Diversificação</p>
                    <p className="text-xs text-muted-foreground">
                      Setores com baixa correlação ajudam a diversificar seu portfólio, reduzindo o risco geral.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm mb-1">Hedge Natural</p>
                    <p className="text-xs text-muted-foreground">
                      Setores com correlação negativa podem servir como hedge - quando um cai, o outro tende a subir.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm mb-1">Alertas de Divergência</p>
                    <p className="text-xs text-muted-foreground">
                      Use os <Link href="/alertas-volatilidade" className="text-primary hover:underline">alertas de divergência</Link> para 
                      ser notificado quando um ativo se comportar diferente do seu setor.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Timestamp */}
      {correlationData?.timestamp && (
        <p className="text-xs text-muted-foreground text-center mt-6">
          Última atualização: {new Date(correlationData.timestamp).toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  );
}

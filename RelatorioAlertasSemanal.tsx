import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  FileText, 
  Calendar, 
  Bell, 
  Mail,
  TrendingUp,
  TrendingDown,
  Activity,
  Building2,
  ArrowUpDown,
  DollarSign,
  RefreshCw,
  Download,
  Settings,
  History,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";

export default function RelatorioAlertasSemanal() {
  const { user, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<"config" | "history">("config");
  
  const utils = trpc.useUtils();
  
  // Queries
  const { data: config, isLoading: configLoading } = trpc.weeklyAlertReport.getConfig.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: reportHistory, isLoading: historyLoading } = trpc.weeklyAlertReport.history.useQuery(
    { limit: 10 },
    { enabled: !!user && activeView === "history" }
  );
  
  // Mutations
  const updateConfigMutation = trpc.weeklyAlertReport.updateConfig.useMutation({
    onSuccess: () => {
      toast.success("Configurações atualizadas!");
      utils.weeklyAlertReport.getConfig.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const generateReportMutation = trpc.weeklyAlertReport.generateReport.useMutation({
    onSuccess: (data) => {
      toast.success(`Relatório gerado! ${data.totalAlerts} alertas na última semana.`);
      utils.weeklyAlertReport.history.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const getDayName = (day: number) => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[day];
  };
  
  if (authLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Relatório Semanal de Alertas
            </CardTitle>
            <CardDescription>
              Receba um resumo semanal de todos os alertas disparados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Faça login para configurar seu relatório semanal.
            </p>
            <Button asChild>
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Relatório Semanal de Alertas
          </h1>
          <p className="text-muted-foreground mt-1">
            Receba um resumo semanal de todos os alertas disparados
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeView === "config" ? "default" : "outline"}
            onClick={() => setActiveView("config")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button
            variant={activeView === "history" ? "default" : "outline"}
            onClick={() => setActiveView("history")}
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>
      
      {activeView === "config" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Config Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Relatório
              </CardTitle>
              <CardDescription>
                Personalize quando e como receber seu relatório semanal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Relatório Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber relatório semanal automaticamente
                  </p>
                </div>
                <Switch
                  checked={config?.isEnabled ?? true}
                  onCheckedChange={(checked) => updateConfigMutation.mutate({ isEnabled: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Dia de Envio</Label>
                <Select
                  value={String(config?.dayOfWeek ?? 1)}
                  onValueChange={(v) => updateConfigMutation.mutate({ dayOfWeek: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Domingo</SelectItem>
                    <SelectItem value="1">Segunda-feira</SelectItem>
                    <SelectItem value="2">Terça-feira</SelectItem>
                    <SelectItem value="3">Quarta-feira</SelectItem>
                    <SelectItem value="4">Quinta-feira</SelectItem>
                    <SelectItem value="5">Sexta-feira</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base">Canais de Notificação</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email</span>
                  </div>
                  <Switch
                    checked={config?.sendEmail ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ sendEmail: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Notificação Push</span>
                  </div>
                  <Switch
                    checked={config?.sendPush ?? false}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ sendPush: checked })}
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base">Tipos de Alertas Incluídos</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-yellow-500" />
                    <span>Alertas de Volatilidade</span>
                  </div>
                  <Switch
                    checked={config?.includeVolatilityAlerts ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ includeVolatilityAlerts: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span>Alertas de Setor</span>
                  </div>
                  <Switch
                    checked={config?.includeSectorAlerts ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ includeSectorAlerts: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-purple-500" />
                    <span>Alertas de Divergência</span>
                  </div>
                  <Switch
                    checked={config?.includeDivergenceAlerts ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ includeDivergenceAlerts: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>Alertas de Preço</span>
                  </div>
                  <Switch
                    checked={config?.includePriceAlerts ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ includePriceAlerts: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Generate Report Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Gerar Relatório Agora
              </CardTitle>
              <CardDescription>
                Gere um relatório dos últimos 7 dias manualmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Clique no botão abaixo para gerar um relatório com todos os alertas disparados nos últimos 7 dias.
              </p>
              
              <Button
                className="w-full"
                onClick={() => generateReportMutation.mutate()}
                disabled={generateReportMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${generateReportMutation.isPending ? "animate-spin" : ""}`} />
                Gerar Relatório
              </Button>
              
              {generateReportMutation.data && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3">
                  <h4 className="font-semibold">Resumo do Relatório</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-background">
                      <div className="text-2xl font-bold">{generateReportMutation.data.totalAlerts}</div>
                      <div className="text-xs text-muted-foreground">Total de Alertas</div>
                    </div>
                    <div className="p-3 rounded bg-background">
                      <div className="text-2xl font-bold text-yellow-500">{generateReportMutation.data.volatilityAlerts}</div>
                      <div className="text-xs text-muted-foreground">Volatilidade</div>
                    </div>
                    <div className="p-3 rounded bg-background">
                      <div className="text-2xl font-bold text-blue-500">{generateReportMutation.data.sectorAlerts}</div>
                      <div className="text-xs text-muted-foreground">Setor</div>
                    </div>
                    <div className="p-3 rounded bg-background">
                      <div className="text-2xl font-bold text-purple-500">{generateReportMutation.data.divergenceAlerts}</div>
                      <div className="text-xs text-muted-foreground">Divergência</div>
                    </div>
                  </div>
                  
                  {generateReportMutation.data.topTickers && generateReportMutation.data.topTickers.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Top Tickers</h5>
                      <div className="flex flex-wrap gap-2">
                        {generateReportMutation.data.topTickers.map((t: { ticker: string; count: number }) => (
                          <Badge key={t.ticker} variant="outline">
                            {t.ticker}: {t.count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generateReportMutation.data.topSectors && generateReportMutation.data.topSectors.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Top Setores</h5>
                      <div className="flex flex-wrap gap-2">
                        {generateReportMutation.data.topSectors.map((s: { sector: string; count: number }) => (
                          <Badge key={s.sector} variant="secondary">
                            {s.sector}: {s.count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Links Rápidos</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/alertas-volatilidade">
                      <Activity className="h-4 w-4 mr-1" />
                      Alertas de Volatilidade
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/correlacao-setores">
                      <Building2 className="h-4 w-4 mr-1" />
                      Correlação de Setores
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/alertas-preco">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Alertas de Preço
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeView === "history" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Relatórios
            </CardTitle>
            <CardDescription>
              Relatórios semanais gerados anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : reportHistory && reportHistory.length > 0 ? (
              <div className="space-y-4">
                {reportHistory.map((report) => (
                  <div key={report.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(report.weekStartDate).toLocaleDateString('pt-BR')} - {new Date(report.weekEndDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {report.totalAlerts} alertas
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-yellow-500" />
                        <span>{report.volatilityAlerts}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-blue-500" />
                        <span>{report.sectorAlerts}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3 text-purple-500" />
                        <span>{report.divergenceAlerts}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-green-500" />
                        <span>{report.priceAlerts}</span>
                      </div>
                    </div>
                    
                    {(() => {
                      const tickers = report.topTickers as Array<{ ticker: string; count: number }> | null;
                      if (!tickers || !Array.isArray(tickers) || tickers.length === 0) return null;
                      return (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-xs text-muted-foreground">Top Tickers: </span>
                          {tickers.map((t, idx) => (
                            <Badge key={idx} variant="outline" className="ml-1 text-xs">
                              {t.ticker}
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum relatório gerado ainda</p>
                <p className="text-sm">Gere seu primeiro relatório na aba de configurações</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

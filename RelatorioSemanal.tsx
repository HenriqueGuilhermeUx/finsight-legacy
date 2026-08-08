import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Calendar, 
  Mail, 
  Bell, 
  Send, 
  FileText, 
  Settings, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";

const dayNames: Record<string, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function RelatorioSemanal() {
  const [activeTab, setActiveTab] = useState("config");
  
  const { data: config, isLoading: configLoading, refetch: refetchConfig } = trpc.weeklyReport.getConfig.useQuery();
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = trpc.weeklyReport.list.useQuery({ limit: 10 });
  
  const updateConfigMutation = trpc.weeklyReport.updateConfig.useMutation({
    onSuccess: () => {
      toast.success("Configurações salvas!");
      refetchConfig();
    },
    onError: (err) => toast.error(err.message),
  });
  
  const generateMutation = trpc.weeklyReport.generate.useMutation({
    onSuccess: () => {
      toast.success("Relatório gerado com sucesso!");
      refetchReports();
    },
    onError: (err) => toast.error(err.message),
  });
  
  const sendMutation = trpc.weeklyReport.send.useMutation({
    onSuccess: () => {
      toast.success("Relatório enviado!");
      refetchReports();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleConfigChange = (key: string, value: any) => {
    updateConfigMutation.mutate({ [key]: value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Relatório Semanal
            </h1>
            <p className="text-muted-foreground">
              Receba um resumo semanal da sua carteira, alertas e destaques do mercado
            </p>
          </div>
          <Button onClick={() => generateMutation.mutate({})} disabled={generateMutation.isPending}>
            <RefreshCw className={`h-4 w-4 mr-2 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            Gerar Agora
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="config">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            {configLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ) : config && (
              <>
                {/* Enable/Disable */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ativar Relatório Semanal</CardTitle>
                    <CardDescription>
                      Receba automaticamente um relatório com o resumo da semana
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enabled">Relatório ativo</Label>
                      <Switch
                        id="enabled"
                        checked={config.isEnabled}
                        onCheckedChange={(v) => handleConfigChange("isEnabled", v)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Agendamento
                    </CardTitle>
                    <CardDescription>
                      Escolha quando deseja receber o relatório
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dia da Semana</Label>
                        <Select
                          value={config.deliveryDay}
                          onValueChange={(v) => handleConfigChange("deliveryDay", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(dayNames).map(([key, name]) => (
                              <SelectItem key={key} value={key}>{name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Horário</Label>
                        <Select
                          value={String(config.deliveryHour)}
                          onValueChange={(v) => handleConfigChange("deliveryHour", parseInt(v))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={String(i)}>
                                {String(i).padStart(2, '0')}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Conteúdo do Relatório
                    </CardTitle>
                    <CardDescription>
                      Escolha quais seções incluir no relatório
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <Label>Resumo da Carteira</Label>
                      </div>
                      <Switch
                        checked={config.includePortfolioSummary}
                        onCheckedChange={(v) => handleConfigChange("includePortfolioSummary", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <Label>Resumo de Alertas</Label>
                      </div>
                      <Switch
                        checked={config.includeAlertsSummary}
                        onCheckedChange={(v) => handleConfigChange("includeAlertsSummary", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <Label>Destaques do Mercado</Label>
                      </div>
                      <Switch
                        checked={config.includeMarketHighlights}
                        onCheckedChange={(v) => handleConfigChange("includeMarketHighlights", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <Label>Top Movers (Altas e Baixas)</Label>
                      </div>
                      <Switch
                        checked={config.includeTopMovers}
                        onCheckedChange={(v) => handleConfigChange("includeTopMovers", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-500" />
                        <Label>Performance da Watchlist</Label>
                      </div>
                      <Switch
                        checked={config.includeWatchlistPerformance}
                        onCheckedChange={(v) => handleConfigChange("includeWatchlistPerformance", v)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Channels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Canais de Entrega
                    </CardTitle>
                    <CardDescription>
                      Escolha como deseja receber o relatório
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label>Email</Label>
                      </div>
                      <Switch
                        checked={config.notifyEmail}
                        onCheckedChange={(v) => handleConfigChange("notifyEmail", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <Label>Telegram</Label>
                      </div>
                      <Switch
                        checked={config.notifyTelegram}
                        onCheckedChange={(v) => handleConfigChange("notifyTelegram", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label>Notificação Push</Label>
                      </div>
                      <Switch
                        checked={config.notifyPush}
                        onCheckedChange={(v) => handleConfigChange("notifyPush", v)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {reportsLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              Semana de {new Date(report.weekStart).toLocaleDateString('pt-BR')}
                            </span>
                            <Badge variant={
                              report.deliveryStatus === 'sent' ? 'default' :
                              report.deliveryStatus === 'failed' ? 'destructive' : 'secondary'
                            }>
                              {report.deliveryStatus === 'sent' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {report.deliveryStatus === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                              {report.deliveryStatus === 'sent' ? 'Enviado' :
                               report.deliveryStatus === 'failed' ? 'Falhou' : 'Pendente'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(report.weekStart).toLocaleDateString('pt-BR')} - {new Date(report.weekEnd).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={Number(report.portfolioChange) >= 0 ? 'text-green-500' : 'text-red-500'}>
                              Carteira: {Number(report.portfolioChange) >= 0 ? '+' : ''}{Number(report.portfolioChange).toFixed(2)}%
                            </span>
                            <span className="text-muted-foreground">
                              {report.alertsTriggered} alertas disparados
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.deliveryStatus === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => sendMutation.mutate({ id: report.id })}
                              disabled={sendMutation.isPending}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Enviar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum relatório gerado</h3>
                  <p className="text-muted-foreground mb-4">
                    Clique em "Gerar Agora" para criar seu primeiro relatório semanal
                  </p>
                  <Button onClick={() => generateMutation.mutate({})}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

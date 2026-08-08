import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import ExplorationProgress from "@/components/ExplorationProgress";
import { AlertsWidget } from "@/components/AlertsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  FileJson,
  FileSpreadsheet,
  Loader2,
  LogIn,
  Eye,
  DollarSign,
  Percent,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";

export default function DashboardGeral() {
  const { user, loading: authLoading } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: summary, isLoading, refetch } = trpc.dashboardSummary.get.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: jsonData, refetch: refetchJSON } = trpc.exportData.exportJSON.useQuery(
    undefined,
    { enabled: false }
  );
  
  const { data: portfolioCSV, refetch: refetchPortfolioCSV } = trpc.exportData.exportPortfoliosCSV.useQuery(
    undefined,
    { enabled: false }
  );
  
  const { data: goalsCSV, refetch: refetchGoalsCSV } = trpc.exportData.exportGoalsCSV.useQuery(
    undefined,
    { enabled: false }
  );
  
  const { data: alertsData } = trpc.goalAlerts.checkAlerts.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };
  
  const handleExportJSON = async () => {
    setIsExporting(true);
    const result = await refetchJSON();
    if (result.data) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finsight-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };
  
  const handleExportPortfolioCSV = async () => {
    setIsExporting(true);
    const result = await refetchPortfolioCSV();
    if (result.data) {
      const blob = new Blob([result.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finsight-carteiras-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };
  
  const handleExportGoalsCSV = async () => {
    setIsExporting(true);
    const result = await refetchGoalsCSV();
    if (result.data) {
      const blob = new Blob([result.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finsight-metas-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };
  
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <LayoutDashboard className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Dashboard Consolidado</CardTitle>
              <CardDescription>
                Faça login para ver seu dashboard personalizado com resumo de carteiras, metas e dividendos.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <a href={getLoginUrl()}>
                <Button className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Fazer Login
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Dashboard Consolidado
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do seu patrimônio, metas e próximos dividendos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : summary ? (
          <>
            {/* Cards de Resumo */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Patrimônio Total</p>
                      <p className="text-2xl font-bold">{formatCurrency(summary.portfolios.totalValue)}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${summary.portfolios.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {summary.portfolios.totalReturn >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {summary.portfolios.returnPercent.toFixed(2)}% ({formatCurrency(summary.portfolios.totalReturn)})
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Carteiras</p>
                      <p className="text-2xl font-bold">{summary.portfolios.count}</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-full">
                      <Wallet className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Investido: {formatCurrency(summary.portfolios.totalInvested)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Metas Ativas</p>
                      <p className="text-2xl font-bold">{summary.goals.active}</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-full">
                      <Target className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {summary.goals.completed} concluídas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Watchlist</p>
                      <p className="text-2xl font-bold">{summary.watchlist.count}</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-full">
                      <Eye className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ativos monitorados
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Conteúdo Principal */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Metas em Progresso */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Metas em Progresso
                  </CardTitle>
                  <CardDescription>
                    Progresso médio: {summary.goals.avgProgress.toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {summary.goals.list.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma meta ativa</p>
                      <Link href="/metas">
                        <Button variant="outline" size="sm" className="mt-4">
                          Criar Meta
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {summary.goals.list.map((goal) => (
                        <div key={goal.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{goal.name}</div>
                            <Badge variant="outline">{goal.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                            <span>{formatCurrency(goal.currentValue)}</span>
                            <span>{formatCurrency(goal.targetValue)}</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <div className="text-right text-sm text-muted-foreground mt-1">
                            {goal.progress.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                      <Link href="/metas">
                        <Button variant="outline" className="w-full">
                          Ver Todas as Metas
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Próximos Dividendos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximos Dividendos
                  </CardTitle>
                  <CardDescription>
                    Proventos esperados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.upcomingDividends.map((div, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{div.ticker}</div>
                          <div className="text-sm text-muted-foreground">{div.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-500">
                            R$ {div.value.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(div.exDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/alertas-dividendos">
                    <Button variant="outline" className="w-full mt-4">
                      Ver Calendário Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            {/* Export Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Backup e Exportação
                </CardTitle>
                <CardDescription>
                  Exporte seus dados para backup ou análise externa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={handleExportJSON}
                    disabled={isExporting}
                  >
                    <FileJson className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-medium">Backup Completo</div>
                      <div className="text-xs text-muted-foreground">JSON com todos os dados</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={handleExportPortfolioCSV}
                    disabled={isExporting}
                  >
                    <FileSpreadsheet className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="font-medium">Carteiras CSV</div>
                      <div className="text-xs text-muted-foreground">Para Excel/Sheets</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={handleExportGoalsCSV}
                    disabled={isExporting}
                  >
                    <FileSpreadsheet className="h-8 w-8 text-amber-500" />
                    <div>
                      <div className="font-medium">Metas CSV</div>
                      <div className="text-xs text-muted-foreground">Para Excel/Sheets</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Widget de Alertas de Preço */}
            <div className="mt-6">
              <AlertsWidget />
            </div>
            
            {/* Widget de Progresso */}
            <div className="mt-6">
              <ExplorationProgress />
            </div>
            
            {/* Links Rápidos */}
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <Link href="/simulador">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Simulador</div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/metas">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <div className="font-medium">Metas</div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/watchlist">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="font-medium">Watchlist</div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/notificacoes">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="font-medium">Notificações</div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Erro ao carregar dados do dashboard</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Tentar Novamente
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

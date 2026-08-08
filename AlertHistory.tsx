import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Bell,
  BarChart3,
  Calendar,
  Loader2,
  ArrowRight,
  CheckCircle,
  Filter,
  Download,
  FileSpreadsheet,
  FileJson
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function AlertHistory() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [filterTicker, setFilterTicker] = useState<string>("all");
  
  const { data: history, isLoading: historyLoading } = trpc.alerts.history.useQuery(
    { limit: 100 },
    { enabled: isAuthenticated }
  );
  
  const { data: stats, isLoading: statsLoading } = trpc.alerts.historyStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const exportMutation = trpc.alerts.export.useMutation({
    onSuccess: (result) => {
      // Create blob and download
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Arquivo ${result.filename} baixado com sucesso.`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro na exportação");
    },
  });

  const handleExport = (format: "csv" | "json") => {
    exportMutation.mutate({ format });
  };

  // Filter history
  const filteredHistory = history?.filter(item => {
    if (filterCondition !== "all" && item.condition !== filterCondition) return false;
    if (filterTicker !== "all" && item.ticker !== filterTicker) return false;
    return true;
  }) || [];

  // Get unique tickers for filter
  const uniqueTickers = Array.from(new Set(history?.map(h => h.ticker) || [])).sort();

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-12">
          <Card className="max-w-lg mx-auto bg-slate-800/50 border-slate-700">
            <CardContent className="pt-8 text-center">
              <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Login Necessário</h2>
              <p className="text-slate-400 mb-6">
                Faça login para acessar o histórico de alertas disparados.
              </p>
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                <a href={getLoginUrl()}>Fazer Login</a>
              </Button>
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
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <History className="h-8 w-8 text-cyan-500" />
              Histórico de Alertas
            </h1>
            <p className="text-slate-400 mt-2">
              Registro de todos os alertas de preço que foram disparados
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-emerald-600 text-emerald-500 hover:bg-emerald-600/10"
                  disabled={exportMutation.isPending || !history?.length}
                >
                  {exportMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem 
                  onClick={() => handleExport("csv")}
                  className="cursor-pointer hover:bg-slate-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar CSV (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport("json")}
                  className="cursor-pointer hover:bg-slate-700"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Exportar JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/alertas-preco">
              <Button variant="outline" className="border-cyan-600 text-cyan-500 hover:bg-cyan-600/10">
                <Bell className="h-4 w-4 mr-2" />
                Gerenciar Alertas
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Disparados</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-cyan-500/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-cyan-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Alertas "Acima de"</p>
                    <p className="text-2xl font-bold text-emerald-400">{stats.aboveCount}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Alertas "Abaixo de"</p>
                    <p className="text-2xl font-bold text-red-400">{stats.belowCount}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Ativos Únicos</p>
                    <p className="text-2xl font-bold text-amber-400">{stats.tickers.length}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <BarChart3 className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Tickers */}
        {!statsLoading && stats && stats.tickers.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-500" />
                Ativos com Mais Alertas Disparados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.tickers.map(({ ticker, count }) => (
                  <Badge 
                    key={ticker} 
                    variant="outline" 
                    className="text-sm py-1 px-3 border-slate-600"
                  >
                    <span className="font-mono text-cyan-400">{ticker}</span>
                    <span className="ml-2 text-slate-400">({count}x)</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Filtros:</span>
              </div>
              
              <Select value={filterCondition} onValueChange={setFilterCondition}>
                <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Tipo de Alerta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="above">Acima de</SelectItem>
                  <SelectItem value="below">Abaixo de</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterTicker} onValueChange={setFilterTicker}>
                <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Ativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Ativos</SelectItem>
                  {uniqueTickers.map(ticker => (
                    <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(filterCondition !== "all" || filterTicker !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setFilterCondition("all");
                    setFilterTicker("all");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Limpar Filtros
                </Button>
              )}
              
              <div className="ml-auto text-sm text-slate-400">
                {filteredHistory.length} registro{filteredHistory.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-12 pb-12 text-center">
              <History className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {history?.length === 0 ? "Nenhum alerta disparado ainda" : "Nenhum resultado encontrado"}
              </h3>
              <p className="text-slate-400 mb-6">
                {history?.length === 0 
                  ? "Quando seus alertas de preço forem acionados, eles aparecerão aqui."
                  : "Tente ajustar os filtros para ver mais resultados."}
              </p>
              {history?.length === 0 && (
                <Link href="/alertas-preco">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    Criar Alerta de Preço
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        item.condition === "above" 
                          ? "bg-emerald-500/20" 
                          : "bg-red-500/20"
                      }`}>
                        {item.condition === "above" ? (
                          <TrendingUp className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg text-white">{item.ticker}</span>
                          {item.assetName && (
                            <span className="text-sm text-slate-400">({item.assetName})</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          Alerta: {item.condition === "above" ? "Acima de" : "Abaixo de"}{" "}
                          <span className="text-slate-300">
                            {item.alertType === "percent" 
                              ? `${parseFloat(item.targetPercent || "0").toFixed(1)}%`
                              : `R$ ${parseFloat(item.targetPrice || "0").toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">
                        R$ {parseFloat(item.actualPrice).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.triggeredAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Price comparison */}
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Diferença do alvo:</span>
                      <Badge className={`${
                        item.condition === "above"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {item.condition === "above" ? "+" : "-"}
                        {item.alertType === "percent" && item.actualPercent
                          ? `${Math.abs(parseFloat(item.actualPercent)).toFixed(2)}%`
                          : item.targetPrice 
                            ? `${Math.abs(
                                ((parseFloat(item.actualPrice) - parseFloat(item.targetPrice)) / parseFloat(item.targetPrice)) * 100
                              ).toFixed(2)}%`
                            : "N/A"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

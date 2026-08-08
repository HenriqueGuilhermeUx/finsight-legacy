import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  Download, 
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Scale
} from "lucide-react";

export default function ComparadorBacktest() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBacktests, setSelectedBacktests] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [viewingComparison, setViewingComparison] = useState<number | null>(null);
  
  const { data: comparisons, isLoading: comparisonsLoading, refetch } = trpc.backtestComparison.list.useQuery();
  const { data: backtests } = trpc.backtesting2.list.useQuery();
  const { data: comparisonDetail } = trpc.backtestComparison.getById.useQuery(
    { id: viewingComparison! },
    { enabled: !!viewingComparison }
  );
  
  const createMutation = trpc.backtestComparison.create.useMutation({
    onSuccess: () => {
      toast.success("Comparação criada!");
      setIsCreateOpen(false);
      setSelectedBacktests([]);
      setName("");
      setDescription("");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  
  const deleteMutation = trpc.backtestComparison.delete.useMutation({
    onSuccess: () => {
      toast.success("Comparação excluída!");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  
  const exportMutation = trpc.backtestComparison.export.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([data.data], { type: data.filename.endsWith('.json') ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exportação concluída!");
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleBacktest = (id: number) => {
    if (selectedBacktests.includes(id)) {
      setSelectedBacktests(selectedBacktests.filter(b => b !== id));
    } else if (selectedBacktests.length < 4) {
      setSelectedBacktests([...selectedBacktests, id]);
    } else {
      toast.error("Máximo de 4 backtests por comparação");
    }
  };

  const handleCreate = () => {
    if (selectedBacktests.length < 2) {
      toast.error("Selecione pelo menos 2 backtests");
      return;
    }
    if (!name.trim()) {
      toast.error("Digite um nome para a comparação");
      return;
    }
    createMutation.mutate({
      name,
      description: description || undefined,
      backtestIds: selectedBacktests,
    });
  };

  const getMetricColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value >= 0 ? "text-green-500" : "text-red-500";
    }
    return value <= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              Comparador de Estratégias
            </h1>
            <p className="text-muted-foreground">
              Compare diferentes configurações de backtest lado a lado
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Comparação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Comparação</DialogTitle>
                <DialogDescription>
                  Selecione de 2 a 4 backtests para comparar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Comparação</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: RSI vs MACD em PETR4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo desta comparação..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selecione os Backtests ({selectedBacktests.length}/4)</Label>
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {backtests && backtests.length > 0 ? (
                      backtests.map((bt) => (
                        <div
                          key={bt.id}
                          className={`flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                            selectedBacktests.includes(bt.id) ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => toggleBacktest(bt.id)}
                        >
                          <Checkbox
                            checked={selectedBacktests.includes(bt.id)}
                            onCheckedChange={() => toggleBacktest(bt.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{bt.ticker}</span>
                              <Badge variant="outline">{bt.indicatorType.toUpperCase()}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Win Rate: {bt.winRate}% | Retorno: {Number(bt.avgReturn) >= 0 ? '+' : ''}{bt.avgReturn}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Nenhum backtest disponível. Execute alguns backtests primeiro.
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending || selectedBacktests.length < 2}
                  className="w-full"
                >
                  {createMutation.isPending ? "Criando..." : "Criar Comparação"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Comparisons List */}
        {comparisonsLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : comparisons && comparisons.length > 0 ? (
          <div className="space-y-4">
            {comparisons.map((comparison) => {
              const results = comparison.comparisonResults 
                ? JSON.parse(comparison.comparisonResults as string) 
                : [];
              
              return (
                <Card key={comparison.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          {comparison.name}
                        </CardTitle>
                        {comparison.description && (
                          <CardDescription>{comparison.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingComparison(comparison.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportMutation.mutate({ id: comparison.id, format: "csv" })}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate({ id: comparison.id })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Winners Summary */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground mb-1">Melhor Retorno</div>
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {results.find((r: any) => r.id === comparison.winnerByReturn)?.ticker || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground mb-1">Menor Drawdown</div>
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {results.find((r: any) => r.id === comparison.winnerByDrawdown)?.ticker || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground mb-1">Melhor Sharpe</div>
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {results.find((r: any) => r.id === comparison.winnerBySharpe)?.ticker || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground mb-1">Maior Win Rate</div>
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {results.find((r: any) => r.id === comparison.winnerByWinRate)?.ticker || '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Ativo</th>
                            <th className="text-left py-2 px-2">Indicador</th>
                            <th className="text-right py-2 px-2">Win Rate</th>
                            <th className="text-right py-2 px-2">Retorno Médio</th>
                            <th className="text-right py-2 px-2">Max Drawdown</th>
                            <th className="text-right py-2 px-2">Sharpe</th>
                            <th className="text-right py-2 px-2">Sinais</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result: any) => (
                            <tr key={result.id} className="border-b last:border-b-0">
                              <td className="py-2 px-2 font-medium">{result.ticker}</td>
                              <td className="py-2 px-2">
                                <Badge variant="outline">{result.indicatorType.toUpperCase()}</Badge>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className={getMetricColor(result.winRate - 50)}>
                                  {result.winRate.toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className={getMetricColor(result.avgReturn)}>
                                  {result.avgReturn >= 0 ? '+' : ''}{result.avgReturn.toFixed(2)}%
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className={getMetricColor(result.maxDrawdown, false)}>
                                  {result.maxDrawdown.toFixed(2)}%
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right">
                                <span className={getMetricColor(result.sharpeRatio)}>
                                  {result.sharpeRatio.toFixed(2)}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right">{result.totalSignals}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma comparação criada</h3>
              <p className="text-muted-foreground mb-4">
                Compare diferentes estratégias de backtest para encontrar a melhor configuração
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Comparação
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!viewingComparison} onOpenChange={() => setViewingComparison(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Comparação</DialogTitle>
            </DialogHeader>
            {comparisonDetail && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">{comparisonDetail.name}</h3>
                  {comparisonDetail.description && (
                    <p className="text-sm text-muted-foreground">{comparisonDetail.description}</p>
                  )}
                </div>

                {/* Detailed comparison cards */}
                <div className="grid grid-cols-2 gap-4">
                  {comparisonDetail.backtests?.map((bt) => (
                    <Card key={bt.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          {bt.ticker}
                          <Badge variant="outline">{bt.indicatorType.toUpperCase()}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>Win Rate:</span>
                            <span className={getMetricColor(Number(bt.winRate) - 50)}>
                              {bt.winRate}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span>Retorno:</span>
                            <span className={getMetricColor(Number(bt.avgReturn))}>
                              {Number(bt.avgReturn) >= 0 ? '+' : ''}{bt.avgReturn}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            <span>Drawdown:</span>
                            <span className={getMetricColor(Number(bt.maxDrawdown), false)}>
                              {bt.maxDrawdown}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>Sharpe:</span>
                            <span className={getMetricColor(Number(bt.sharpeRatio))}>
                              {bt.sharpeRatio}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {bt.totalSignals} sinais | {bt.winningSignals} vitórias | {bt.losingSignals} derrotas
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => exportMutation.mutate({ id: comparisonDetail.id, format: "csv" })}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportMutation.mutate({ id: comparisonDetail.id, format: "json" })}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar JSON
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

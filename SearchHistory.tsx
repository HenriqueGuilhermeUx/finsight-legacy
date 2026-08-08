import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SearchHistory() {
  const { isAuthenticated } = useAuth();
  
  const { data: history, refetch } = trpc.history.list.useQuery(
    { limit: 5 },
    { enabled: isAuthenticated }
  );

  const clearHistoryMutation = trpc.history.clear.useMutation({
    onSuccess: () => {
      toast.success("Histórico limpo");
      refetch();
    },
  });

  if (!isAuthenticated || !history || history.length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="border-b border-slate-700/50 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-cyan-400" />
            Pesquisas Recentes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearHistoryMutation.mutate()}
            className="text-slate-400 hover:text-red-400 h-8 px-2"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-700/30">
          {history.map((item) => (
            <Link key={item.id} href={`/radar/${item.ticker}`}>
              <div className="flex items-center justify-between py-2 px-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-slate-700/50 flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm font-mono">{item.ticker}</div>
                    <div className="text-xs text-muted-foreground">{item.assetName || item.ticker}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.assetType === "stock" ? "Ação" : item.assetType === "etf" ? "ETF" : "Cripto"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

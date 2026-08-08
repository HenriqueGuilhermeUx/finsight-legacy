import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Trophy, 
  Flame, 
  ArrowRight,
  Crown,
  Medal,
  Award,
  Zap
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

function getSignalDisplay(signal: string) {
  switch (signal) {
    case 'strong_buy':
      return { text: 'Compra Forte', className: 'bg-emerald-500 text-white' };
    case 'buy':
      return { text: 'Compra', className: 'bg-emerald-500/70 text-white' };
    default:
      return { text: 'Neutro', className: 'bg-slate-500 text-white' };
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-amber-400" />;
    case 2:
      return <Medal className="h-5 w-5 text-slate-300" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
}

function getRegionFlag(ticker: string) {
  const brazilTickers = ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "RENT3", "BBAS3", "MGLU3", "LREN3", "SUZB3", "JBSS3", "GGBR4", "CSNA3", "EMBR3"];
  const cryptoTickers = ["BTC", "ETH", "SOL", "XRP", "ADA"];
  
  if (brazilTickers.includes(ticker)) return "🇧🇷";
  if (cryptoTickers.includes(ticker)) return "₿";
  return "🇺🇸";
}

export default function TopSignalsWidget() {
  const { data: topSignals, isLoading } = trpc.signalAlerts.getTopSignals.useQuery(
    { limit: 3, region: "all" },
    { staleTime: 60000 }
  );

  const buySignals = topSignals?.filter(s => s.score > 0).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-400" />
            Top Sinais de Compra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (buySignals.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-400" />
            Top Sinais de Compra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum sinal de compra forte no momento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-400" />
            Top Sinais de Compra
          </CardTitle>
          <Link href="/top-sinais">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 gap-1">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {buySignals.map((signal, index) => {
          const display = getSignalDisplay(signal.signal);
          const rank = index + 1;

          return (
            <Link key={signal.ticker} href={`/radar/${signal.ticker}`}>
              <div className={cn(
                "flex items-center gap-3 p-4 transition-colors hover:bg-slate-800/50 cursor-pointer",
                index < buySignals.length - 1 && "border-b border-slate-700/30"
              )}>
                {/* Rank */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>

                {/* Asset Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getRegionFlag(signal.ticker)}</span>
                    <span className="font-mono font-bold">{signal.ticker}</span>
                    <Badge className={cn("text-xs", display.className)}>
                      {display.text}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {signal.name}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={cn(
                    "font-bold",
                    signal.score > 3 ? "text-emerald-400" : "text-emerald-500/70"
                  )}>
                    +{signal.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    RSI {signal.rsi?.toFixed(0)}
                  </div>
                </div>

                {/* Arrow */}
                <TrendingUp className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

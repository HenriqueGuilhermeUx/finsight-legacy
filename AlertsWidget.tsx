import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  Target
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AlertWithDistance {
  id: number;
  ticker: string;
  targetPrice: number;
  condition: string;
  currentPrice: number;
  distance: number; // percentage distance to target
  isClose: boolean; // within 10% of target
}

export function AlertsWidget() {
  const [alertsWithPrices, setAlertsWithPrices] = useState<AlertWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define type for price alert
  type PriceAlertItem = {
    id: number;
    ticker: string;
    targetPrice: string;
    condition: string;
    isActive: boolean;
    isTriggered: boolean;
  };

  const { data: alerts } = trpc.alerts.list.useQuery() as { data: PriceAlertItem[] | undefined };
  const activeTickers = alerts?.filter((a: PriceAlertItem) => a.isActive).map((a: PriceAlertItem) => a.ticker) || [];
  
  // Fetch quotes for each active ticker
  const [quotesData, setQuotesData] = useState<Record<string, { price: number }>>({});
  const [quotesLoading, setQuotesLoading] = useState(false);
  
  // Fetch quotes when we have active tickers
  useEffect(() => {
    if (activeTickers.length === 0) return;
    
    const fetchQuotes = async () => {
      setQuotesLoading(true);
      const quotes: Record<string, { price: number }> = {};
      
      // Fetch in parallel
      await Promise.all(
        activeTickers.map(async (ticker) => {
          try {
            const response = await fetch(`/api/trpc/assets.getQuote?input=${encodeURIComponent(JSON.stringify({ ticker }))}`);
            const data = await response.json();
            if (data?.result?.data?.price) {
              quotes[ticker] = { price: data.result.data.price };
            }
          } catch (error) {
            console.error(`Error fetching quote for ${ticker}:`, error);
          }
        })
      );
      
      setQuotesData(quotes);
      setQuotesLoading(false);
    };
    
    fetchQuotes();
  }, [activeTickers.join(',')]);

  useEffect(() => {
    if (alerts && quotesData) {
      const activeAlerts = alerts.filter((a: PriceAlertItem) => a.isActive);
      const enrichedAlerts: AlertWithDistance[] = [];

      for (const alert of activeAlerts) {
        const quote = quotesData[alert.ticker];
        if (quote && quote.price) {
          const currentPrice = quote.price;
          const targetPrice = parseFloat(alert.targetPrice);
          
          // Calculate percentage distance
          const distance = ((currentPrice - targetPrice) / currentPrice) * 100;
          const absDistance = Math.abs(distance);
          
          // Check if alert is close to triggering (within 10%)
          const isClose = absDistance <= 10;

          enrichedAlerts.push({
            id: alert.id,
            ticker: alert.ticker,
            targetPrice: targetPrice,
            condition: alert.condition,
            currentPrice: currentPrice,
            distance: distance,
            isClose: isClose
          });
        }
      }

      // Sort by closest to target (smallest absolute distance first)
      enrichedAlerts.sort((a, b) => Math.abs(a.distance) - Math.abs(b.distance));
      
      setAlertsWithPrices(enrichedAlerts);
      setIsLoading(false);
    } else if (alerts && alerts.filter((a: PriceAlertItem) => a.isActive).length === 0) {
      setAlertsWithPrices([]);
      setIsLoading(false);
    }
  }, [alerts, quotesData]);

  const closeAlerts = alertsWithPrices.filter(a => a.isClose);
  const topAlerts = alertsWithPrices.slice(0, 5);

  if (isLoading || quotesLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-amber-500" />
            Alertas de Preço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.filter((a: PriceAlertItem) => a.isActive).length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-amber-500" />
            Alertas de Preço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Target className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-4">
              Nenhum alerta de preço configurado
            </p>
            <Link href="/alertas-preco">
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                Criar Alerta
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-amber-500" />
            Alertas de Preço
            {closeAlerts.length > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                {closeAlerts.length} próximo{closeAlerts.length > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <Link href="/alertas-preco">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Close alerts warning */}
        {closeAlerts.length > 0 && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas Próximos de Disparar
            </div>
            <div className="space-y-2">
              {closeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white">{alert.ticker}</span>
                    {alert.condition === "above" ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className="text-slate-400">
                      R$ {alert.targetPrice.toFixed(2)}
                    </span>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      Math.abs(alert.distance) <= 5 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {Math.abs(alert.distance).toFixed(1)}% restante
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All alerts list */}
        <div className="space-y-2">
          {topAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                alert.isClose ? 'bg-slate-700/50' : 'bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${
                  alert.condition === "above" 
                    ? 'bg-emerald-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  {alert.condition === "above" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-mono text-white text-sm">{alert.ticker}</p>
                  <p className="text-xs text-slate-500">
                    Atual: R$ {alert.currentPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-300">
                  R$ {alert.targetPrice.toFixed(2)}
                </p>
                <p className={`text-xs ${
                  alert.distance > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {alert.distance > 0 ? '+' : ''}{alert.distance.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {alertsWithPrices.length > 5 && (
          <div className="mt-3 text-center">
            <Link href="/alertas-preco">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Ver mais {alertsWithPrices.length - 5} alertas
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, X, TrendingUp, TrendingDown, Scale, Search, ArrowRight, Download } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface AssetData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  fundamentals: {
    pl: number | null;
    pvp: number | null;
    marketCap: number | null;
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
    volume: number | null;
  } | null;
  priceHistory: Array<{ date: string; price: number }>;
}

const CHART_COLORS = ["#06b6d4", "#f59e0b", "#10b981"];

export default function Comparador() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [assetsData, setAssetsData] = useState<AssetData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAssetQuery = trpc.assets.getByTicker.useQuery(
    { ticker: inputValue },
    { enabled: false }
  );

  const addTicker = async () => {
    if (!inputValue.trim()) return;
    if (tickers.length >= 3) {
      toast.error("Máximo de 3 ativos para comparação");
      return;
    }
    if (tickers.includes(inputValue.toUpperCase())) {
      toast.error("Ativo já adicionado");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getAssetQuery.refetch();
      if (result.data) {
        setTickers([...tickers, inputValue.toUpperCase()]);
        setAssetsData([...assetsData, result.data as AssetData]);
        setInputValue("");
      } else {
        toast.error("Ativo não encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar ativo");
    }
    setIsLoading(false);
  };

  const removeTicker = (ticker: string) => {
    setTickers(tickers.filter((t) => t !== ticker));
    setAssetsData(assetsData.filter((a) => a.ticker !== ticker));
  };

  const formatNumber = (num: number | null | undefined, decimals = 2) => {
    if (num === null || num === undefined) return "N/A";
    return num.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatLargeNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "N/A";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return formatNumber(num);
  };

  // Export comparison to CSV
  const exportToCSV = () => {
    if (assetsData.length === 0) {
      toast.error("Adicione ativos para exportar");
      return;
    }

    const headers = ["Métrica", ...assetsData.map(a => a.ticker)];
    const rows = [
      ["Nome", ...assetsData.map(a => a.name)],
      ["Preço Atual (R$)", ...assetsData.map(a => formatNumber(a.price))],
      ["Variação (%)", ...assetsData.map(a => formatNumber(a.change))],
      ["P/L", ...assetsData.map(a => formatNumber(a.fundamentals?.pl))],
      ["P/VP", ...assetsData.map(a => formatNumber(a.fundamentals?.pvp))],
      ["Market Cap", ...assetsData.map(a => formatLargeNumber(a.fundamentals?.marketCap))],
      ["52W High (R$)", ...assetsData.map(a => formatNumber(a.fundamentals?.fiftyTwoWeekHigh))],
      ["52W Low (R$)", ...assetsData.map(a => formatNumber(a.fundamentals?.fiftyTwoWeekLow))],
      ["Volume", ...assetsData.map(a => formatLargeNumber(a.fundamentals?.volume))],
    ];

    const csvContent = [
      `# Comparação de Ativos - F-Insight`,
      `# Data: ${new Date().toLocaleDateString("pt-BR")}`,
      "",
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `comparacao_${tickers.join("_")}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success("Comparação exportada com sucesso!");
  };

  // Normalize price history for comparison (percentage change from first day)
  const normalizedChartData = () => {
    if (assetsData.length === 0) return [];
    
    const maxLength = Math.max(...assetsData.map((a) => a.priceHistory?.length || 0));
    const data: any[] = [];

    for (let i = 0; i < maxLength; i++) {
      const point: any = {};
      assetsData.forEach((asset, idx) => {
        if (asset.priceHistory && asset.priceHistory[i]) {
          const firstPrice = asset.priceHistory[0]?.price || 1;
          const currentPrice = asset.priceHistory[i].price;
          point.date = new Date(asset.priceHistory[i].date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
          point[asset.ticker] = ((currentPrice - firstPrice) / firstPrice) * 100;
        }
      });
      if (Object.keys(point).length > 1) {
        data.push(point);
      }
    }
    return data;
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Scale className="h-8 w-8 text-cyan-500" />
              Comparador de Ativos
            </h1>
            <p className="text-slate-400 mt-2">
              Compare até 3 ativos lado a lado com métricas fundamentalistas.
            </p>
          </div>
          {assetsData.length > 0 && (
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="border-emerald-600 text-emerald-500 hover:bg-emerald-600/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          )}
        </div>

        {/* Input Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Digite o ticker (ex: PETR4, AAPL, BTC)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && addTicker()}
                  className="bg-slate-700 border-slate-600 text-white pl-10"
                />
              </div>
              <Button
                onClick={addTicker}
                disabled={isLoading || tickers.length >= 3}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </>
                )}
              </Button>
            </div>
            {tickers.length > 0 && (
              <div className="flex gap-2 mt-4">
                {tickers.map((ticker, idx) => (
                  <Badge
                    key={ticker}
                    className="px-3 py-1 text-sm"
                    style={{ backgroundColor: `${CHART_COLORS[idx]}20`, color: CHART_COLORS[idx], borderColor: CHART_COLORS[idx] }}
                  >
                    {ticker}
                    <button onClick={() => removeTicker(ticker)} className="ml-2 hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {assetsData.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <Scale className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Adicione ativos para comparar</h3>
              <p className="text-slate-400 mb-4">
                Digite o ticker de até 3 ativos para ver uma comparação detalhada.
              </p>
              <div className="flex justify-center gap-2 text-slate-500">
                <Badge variant="outline">PETR4</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">VALE3</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">ITUB4</Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Price Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {assetsData.map((asset, idx) => (
                <Card key={asset.ticker} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg" style={{ color: CHART_COLORS[idx] }}>
                        {asset.ticker}
                      </CardTitle>
                      <button onClick={() => removeTicker(asset.ticker)} className="text-slate-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-400">{asset.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">
                        R$ {formatNumber(asset.price)}
                      </span>
                      <span className={`flex items-center text-sm ${asset.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {asset.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {formatNumber(asset.change)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Chart */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Performance Comparativa (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={normalizedChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v.toFixed(1)}%`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
                      />
                      <Legend />
                      {assetsData.map((asset, idx) => (
                        <Line
                          key={asset.ticker}
                          type="monotone"
                          dataKey={asset.ticker}
                          stroke={CHART_COLORS[idx]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Análise Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: "Preço vs 52W", ...Object.fromEntries(assetsData.map((a, i) => [a.ticker, a.fundamentals?.fiftyTwoWeekHigh && a.fundamentals?.fiftyTwoWeekLow ? Math.round(((a.price - a.fundamentals.fiftyTwoWeekLow) / (a.fundamentals.fiftyTwoWeekHigh - a.fundamentals.fiftyTwoWeekLow)) * 100) : 50])) },
                      { metric: "P/L Score", ...Object.fromEntries(assetsData.map((a, i) => [a.ticker, a.fundamentals?.pl ? Math.max(0, Math.min(100, 100 - (a.fundamentals.pl / 50) * 100)) : 50])) },
                      { metric: "P/VP Score", ...Object.fromEntries(assetsData.map((a, i) => [a.ticker, a.fundamentals?.pvp ? Math.max(0, Math.min(100, 100 - (a.fundamentals.pvp / 5) * 100)) : 50])) },
                      { metric: "Volume", ...Object.fromEntries(assetsData.map((a, i) => [a.ticker, 50])) },
                      { metric: "Variação", ...Object.fromEntries(assetsData.map((a, i) => [a.ticker, Math.max(0, Math.min(100, 50 + a.change * 5))])) },
                    ]}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                      {assetsData.map((asset, idx) => (
                        <Radar
                          key={asset.ticker}
                          name={asset.ticker}
                          dataKey={asset.ticker}
                          stroke={CHART_COLORS[idx]}
                          fill={CHART_COLORS[idx]}
                          fillOpacity={0.2}
                        />
                      ))}
                      <Legend />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Fundamentals Comparison Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Comparação Fundamentalista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Métrica</th>
                        {assetsData.map((asset, idx) => (
                          <th key={asset.ticker} className="text-right py-3 px-4 font-medium" style={{ color: CHART_COLORS[idx] }}>
                            {asset.ticker}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">Preço Atual</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white font-medium">
                            R$ {formatNumber(asset.price)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">Variação</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className={`text-right py-3 px-4 font-medium ${asset.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {formatNumber(asset.change)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">P/L</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white">
                            {formatNumber(asset.fundamentals?.pl)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">P/VP</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white">
                            {formatNumber(asset.fundamentals?.pvp)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">Market Cap</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white">
                            {formatLargeNumber(asset.fundamentals?.marketCap)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">52W High</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white">
                            R$ {formatNumber(asset.fundamentals?.fiftyTwoWeekHigh)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-slate-400">52W Low</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white">
                            R$ {formatNumber(asset.fundamentals?.fiftyTwoWeekLow)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-400">Volume</td>
                        {assetsData.map((asset) => (
                          <td key={asset.ticker} className="text-right py-3 px-4 text-white">
                            {formatLargeNumber(asset.fundamentals?.volume)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}

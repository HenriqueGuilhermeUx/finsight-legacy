import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Command,
  Maximize2,
  Minimize2,
  Layout,
  BarChart3,
  Globe,
  Calendar,
  Bell,
  Settings,
  X,
  Plus,
  RefreshCw,
  Loader2,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  Percent,
  Clock,
  Zap,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

// Panel types for the terminal
type PanelType = "quote" | "chart" | "fundamentals" | "news" | "watchlist" | "macro" | "screener" | "calendar";

interface Panel {
  id: string;
  type: PanelType;
  ticker?: string;
  title: string;
  minimized: boolean;
}

// Command palette commands
const commands = [
  { cmd: "/quote", desc: "Cotação de ativo", example: "/quote PETR4" },
  { cmd: "/chart", desc: "Gráfico de ativo", example: "/chart VALE3" },
  { cmd: "/compare", desc: "Comparar ativos", example: "/compare PETR4 VALE3" },
  { cmd: "/screener", desc: "Abrir screener", example: "/screener" },
  { cmd: "/macro", desc: "Painel macro", example: "/macro" },
  { cmd: "/news", desc: "Notícias", example: "/news" },
  { cmd: "/calendar", desc: "Calendário", example: "/calendar" },
  { cmd: "/watchlist", desc: "Watchlist", example: "/watchlist" },
  { cmd: "/clear", desc: "Limpar painéis", example: "/clear" },
  { cmd: "/help", desc: "Ajuda", example: "/help" },
];

// Keyboard shortcuts
const shortcuts = [
  { key: "/", desc: "Abrir barra de comandos" },
  { key: "Esc", desc: "Fechar painel/modal" },
  { key: "F", desc: "Tela cheia" },
  { key: "R", desc: "Atualizar dados" },
  { key: "1-9", desc: "Navegar para painel" },
  { key: "N", desc: "Novo painel" },
  { key: "?", desc: "Mostrar atalhos" },
];

export default function Terminal() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [commandInput, setCommandInput] = useState("");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [panels, setPanels] = useState<Panel[]>([
    { id: "1", type: "quote", ticker: "PETR4", title: "PETR4", minimized: false },
    { id: "2", type: "chart", ticker: "PETR4", title: "Gráfico PETR4", minimized: false },
    { id: "3", type: "watchlist", title: "Watchlist", minimized: false },
    { id: "4", type: "macro", title: "Macro Global", minimized: false },
  ]);
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Fetch market data
  const { data: marketData, isLoading: marketLoading, refetch: refetchMarket } = trpc.assets.getPopular.useQuery();
  const { data: macroData } = trpc.macro.getIndicators.useQuery({ country: "brazil" });

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") {
          setShowCommandPalette(false);
          (e.target as HTMLElement).blur();
        }
        return;
      }

      switch (e.key) {
        case "/":
          e.preventDefault();
          setShowCommandPalette(true);
          setTimeout(() => commandInputRef.current?.focus(), 100);
          break;
        case "Escape":
          setShowCommandPalette(false);
          setShowShortcuts(false);
          setFullscreenPanel(null);
          break;
        case "?":
          setShowShortcuts(!showShortcuts);
          break;
        case "f":
        case "F":
          if (panels.length > 0 && !fullscreenPanel) {
            setFullscreenPanel(panels[0].id);
          } else {
            setFullscreenPanel(null);
          }
          break;
        case "r":
        case "R":
          refetchMarket();
          break;
        case "n":
        case "N":
          addPanel("quote");
          break;
      }

      // Number keys for panel navigation
      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (panels[index]) {
          setFullscreenPanel(panels[index].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panels, fullscreenPanel, showShortcuts]);

  // Execute command
  const executeCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case "/quote":
        if (args[0]) {
          addPanel("quote", args[0].toUpperCase());
        }
        break;
      case "/chart":
        if (args[0]) {
          addPanel("chart", args[0].toUpperCase());
        }
        break;
      case "/compare":
        // Navigate to comparador with tickers
        setLocation(`/comparador?tickers=${args.join(",").toUpperCase()}`);
        break;
      case "/screener":
        addPanel("screener");
        break;
      case "/macro":
        addPanel("macro");
        break;
      case "/news":
        addPanel("news");
        break;
      case "/calendar":
        addPanel("calendar");
        break;
      case "/watchlist":
        addPanel("watchlist");
        break;
      case "/clear":
        setPanels([]);
        break;
      case "/help":
        setShowShortcuts(true);
        break;
      default:
        // If it's just a ticker, open quote
        if (cmd.trim() && !cmd.startsWith("/")) {
          addPanel("quote", cmd.trim().toUpperCase());
        }
    }

    setCommandInput("");
    setShowCommandPalette(false);
  }, []);

  // Add new panel
  const addPanel = (type: PanelType, ticker?: string) => {
    const id = Date.now().toString();
    const titles: Record<PanelType, string> = {
      quote: ticker || "Cotação",
      chart: `Gráfico ${ticker || ""}`,
      fundamentals: `Fundamentos ${ticker || ""}`,
      news: "Notícias",
      watchlist: "Watchlist",
      macro: "Macro Global",
      screener: "Screener",
      calendar: "Calendário",
    };

    setPanels([...panels, {
      id,
      type,
      ticker,
      title: titles[type],
      minimized: false,
    }]);
  };

  // Remove panel
  const removePanel = (id: string) => {
    setPanels(panels.filter(p => p.id !== id));
    if (fullscreenPanel === id) {
      setFullscreenPanel(null);
    }
  };

  // Toggle minimize
  const toggleMinimize = (id: string) => {
    setPanels(panels.map(p => 
      p.id === id ? { ...p, minimized: !p.minimized } : p
    ));
  };

  // Render panel content
  const renderPanelContent = (panel: Panel) => {
    if (panel.minimized) return null;

    switch (panel.type) {
      case "quote":
        return <QuotePanel ticker={panel.ticker} />;
      case "chart":
        return <ChartPanel ticker={panel.ticker} />;
      case "watchlist":
        return <WatchlistPanel />;
      case "macro":
        return <MacroPanel />;
      case "news":
        return <NewsPanel />;
      case "screener":
        return <ScreenerPanel />;
      case "calendar":
        return <CalendarPanel />;
      default:
        return <div className="p-4 text-muted-foreground">Painel não implementado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar - Bloomberg Style */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="text-cyan-400 font-bold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              FinSight
              <Badge className="bg-amber-500/20 text-amber-400 text-xs">PRO</Badge>
            </span>
          </Link>
          <div className="h-4 w-px bg-slate-700" />
          <span className="text-xs text-slate-400">Terminal Profissional</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">IBOV</span>
              <span className="text-emerald-400">128.450</span>
              <ArrowUp className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">USD/BRL</span>
              <span className="text-red-400">6.12</span>
              <ArrowDown className="h-3 w-3 text-red-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">BTC</span>
              <span className="text-emerald-400">$97,450</span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>

          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowCommandPalette(true)}
          >
            <Command className="h-3 w-3 mr-1" />
            <span className="text-slate-400">/</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowShortcuts(true)}
          >
            <span className="text-slate-400">?</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => refetchMarket()}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Command className="h-5 w-5 text-cyan-400" />
                <Input
                  ref={commandInputRef}
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      executeCommand(commandInput);
                    }
                    if (e.key === "Escape") {
                      setShowCommandPalette(false);
                    }
                  }}
                  placeholder="Digite um comando ou ticker... (ex: /quote PETR4 ou VALE3)"
                  className="bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-slate-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {commands
                .filter(c => c.cmd.includes(commandInput.toLowerCase()) || c.desc.toLowerCase().includes(commandInput.toLowerCase()))
                .map((cmd) => (
                  <button
                    key={cmd.cmd}
                    onClick={() => executeCommand(cmd.cmd)}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <code className="text-cyan-400 font-mono">{cmd.cmd}</code>
                      <span className="text-slate-400">{cmd.desc}</span>
                    </div>
                    <span className="text-xs text-slate-500">{cmd.example}</span>
                  </button>
                ))}
            </div>
            <div className="p-3 border-t border-slate-700 text-xs text-slate-500 flex items-center justify-between">
              <span>Pressione Enter para executar</span>
              <span>Esc para fechar</span>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold">Atalhos de Teclado</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between py-2">
                  <span className="text-slate-400">{s.desc}</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-cyan-400">{s.key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Panel Grid */}
      <div className="p-2">
        {fullscreenPanel ? (
          // Fullscreen mode
          <div className="h-[calc(100vh-56px)]">
            {panels.filter(p => p.id === fullscreenPanel).map(panel => (
              <Card key={panel.id} className="h-full bg-slate-900/50 border-slate-800">
                <CardHeader className="py-2 px-4 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {panel.title}
                      {panel.ticker && <Badge variant="outline" className="text-xs">{panel.ticker}</Badge>}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFullscreenPanel(null)}>
                        <Minimize2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removePanel(panel.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 h-[calc(100%-48px)] overflow-auto">
                  {renderPanelContent(panel)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Grid mode
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 auto-rows-min">
            {panels.map((panel, index) => (
              <Card 
                key={panel.id} 
                className={`bg-slate-900/50 border-slate-800 ${panel.minimized ? "h-12" : "min-h-[300px]"}`}
              >
                <CardHeader className="py-2 px-4 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{index + 1}</span>
                      {panel.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleMinimize(panel.id)}>
                        {panel.minimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFullscreenPanel(panel.id)}>
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removePanel(panel.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {!panel.minimized && (
                  <CardContent className="p-2 h-[calc(100%-48px)] overflow-auto">
                    {renderPanelContent(panel)}
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Add Panel Button */}
            <Card 
              className="bg-slate-900/30 border-slate-800 border-dashed min-h-[300px] flex items-center justify-center cursor-pointer hover:bg-slate-900/50 transition-colors"
              onClick={() => setShowCommandPalette(true)}
            >
              <div className="text-center text-slate-500">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Adicionar Painel</p>
                <p className="text-xs">Pressione / para comandos</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Painéis: {panels.length}</span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">Conectado</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Dados: Yahoo Finance</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-500">FinSight Terminal v1.0</span>
        </div>
      </div>
    </div>
  );
}

// Quote Panel Component
function QuotePanel({ ticker }: { ticker?: string }) {
  const { data, isLoading } = trpc.assets.getByTicker.useQuery(
    { ticker: ticker || "PETR4" },
    { enabled: !!ticker }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-slate-500 text-center">Ativo não encontrado</div>;
  }

  const isPositive = (data.change || 0) >= 0;
  const fundamentals = data.fundamentals as any;

  return (
    <div className="space-y-4">
      {/* Main Price */}
      <div className="text-center py-4">
        <div className="text-4xl font-bold font-mono">
          R$ {data.price?.toFixed(2) || "N/A"}
        </div>
        <div className={`flex items-center justify-center gap-2 mt-2 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span className="font-mono">{isPositive ? "+" : ""}{data.change?.toFixed(2)}%</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">P/L</div>
          <div className="font-mono">{fundamentals?.pl?.toFixed(2) || "N/A"}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">P/VP</div>
          <div className="font-mono">{fundamentals?.pvp?.toFixed(2) || "N/A"}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">52W High</div>
          <div className="font-mono text-emerald-400">{fundamentals?.fiftyTwoWeekHigh?.toFixed(2) || "N/A"}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">52W Low</div>
          <div className="font-mono text-red-400">{fundamentals?.fiftyTwoWeekLow?.toFixed(2) || "N/A"}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">Volume</div>
          <div className="font-mono">{fundamentals?.volume ? `${(fundamentals.volume / 1000000).toFixed(1)}M` : "N/A"}</div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">Setor</div>
          <div className="font-mono text-xs">{data.sector || "N/A"}</div>
        </div>
      </div>

      {/* Company Info */}
      <div className="text-xs text-slate-500 text-center">
        {data.name} • {data.sector}
      </div>
    </div>
  );
}

// Chart Panel Component
function ChartPanel({ ticker }: { ticker?: string }) {
  const { data, isLoading } = trpc.assets.getByTicker.useQuery(
    { ticker: ticker || "PETR4" },
    { enabled: !!ticker }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  const chartData = (data?.priceHistory || []).map((p: any) => ({
    date: p.date,
    close: p.price,
  }));

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          />
          <YAxis 
            tick={{ fill: "#64748b", fontSize: 10 }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `R$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
            labelStyle={{ color: "#94a3b8" }}
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Preço"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString("pt-BR")}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Watchlist Panel Component
function WatchlistPanel() {
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  const watchlistItems = favorites || [];

  return (
    <div className="space-y-1">
      {watchlistItems.length === 0 ? (
        <div className="text-center text-slate-500 py-8">
          <p>Nenhum ativo na watchlist</p>
          <p className="text-xs mt-1">Use /quote TICKER para adicionar</p>
        </div>
      ) : (
        watchlistItems.map((item: any) => (
          <div key={item.ticker} className="flex items-center justify-between p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors">
            <div>
              <div className="font-medium text-sm">{item.ticker}</div>
              <div className="text-xs text-slate-500">{item.name}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">R$ {item.price?.toFixed(2) || "N/A"}</div>
              <div className={`text-xs ${(item.changePercent || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {(item.changePercent || 0) >= 0 ? "+" : ""}{item.changePercent?.toFixed(2)}%
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Macro Panel Component
function MacroPanel() {
  const { data, isLoading } = trpc.macro.getIndicators.useQuery({ country: "brazil" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  const indicators = [
    { name: "SELIC", value: data?.selic || 11.25, unit: "%", trend: "stable" },
    { name: "IPCA", value: data?.ipca || 4.82, unit: "%", trend: "up" },
    { name: "PIB", value: data?.pib || 2.9, unit: "%", trend: "up" },
    { name: "Desemprego", value: data?.unemployment || 6.8, unit: "%", trend: "down" },
    { name: "USD/BRL", value: data?.usdBrl || 6.12, unit: "", trend: "up" },
    { name: "EUR/BRL", value: data?.eurBrl || 6.38, unit: "", trend: "up" },
  ];

  return (
    <div className="space-y-2">
      {indicators.map((ind) => (
        <div key={ind.name} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
          <span className="text-sm text-slate-400">{ind.name}</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">{ind.value.toFixed(2)}{ind.unit}</span>
            {ind.trend === "up" && <ArrowUp className="h-3 w-3 text-red-400" />}
            {ind.trend === "down" && <ArrowDown className="h-3 w-3 text-emerald-400" />}
            {ind.trend === "stable" && <span className="text-slate-500">—</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// News Panel Component
function NewsPanel() {
  const news = [
    { title: "Petrobras anuncia dividendos extraordinários", time: "2h", source: "InfoMoney" },
    { title: "Fed mantém juros e sinaliza cortes em 2025", time: "4h", source: "Bloomberg" },
    { title: "Bitcoin atinge nova máxima histórica", time: "6h", source: "CoinDesk" },
    { title: "Vale reporta produção recorde de minério", time: "8h", source: "Reuters" },
  ];

  return (
    <div className="space-y-2">
      {news.map((item, i) => (
        <div key={i} className="p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="text-sm">{item.title}</div>
          <div className="text-xs text-slate-500 mt-1">
            {item.source} • {item.time}
          </div>
        </div>
      ))}
    </div>
  );
}

// Screener Panel Component
function ScreenerPanel() {
  return (
    <div className="text-center py-8">
      <BarChart3 className="h-12 w-12 mx-auto text-slate-600 mb-4" />
      <p className="text-slate-400">Screener Profissional</p>
      <p className="text-xs text-slate-500 mt-1">Em desenvolvimento</p>
      <Link href="/radar">
        <Button variant="outline" size="sm" className="mt-4">
          Ir para Radar
        </Button>
      </Link>
    </div>
  );
}

// Calendar Panel Component
function CalendarPanel() {
  const events = [
    { date: "23/12", event: "Resultados PETR4 4T24", type: "earnings" },
    { date: "26/12", event: "Dividendos VALE3", type: "dividend" },
    { date: "08/01", event: "IPCA Dezembro", type: "macro" },
    { date: "15/01", event: "Reunião COPOM", type: "macro" },
  ];

  return (
    <div className="space-y-2">
      {events.map((event, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded">
          <div className="text-xs font-mono text-cyan-400 w-12">{event.date}</div>
          <div className="flex-1">
            <div className="text-sm">{event.event}</div>
          </div>
          <Badge variant="outline" className="text-xs">
            {event.type}
          </Badge>
        </div>
      ))}
    </div>
  );
}

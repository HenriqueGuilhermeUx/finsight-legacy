import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  BarChart3,
  LineChart,
  Bell,
  Globe,
  BookOpen,
  FileText,
  Briefcase,
  Target,
  Activity,
  Zap,
  DollarSign,
  PieChart,
  Calendar,
  Users,
  Settings,
  Crown,
  MessageSquare,
  Trophy,
  Map,
  Newspaper,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Navegação" | "Ativos" | "Análise" | "Trading" | "Alertas" | "Mercado" | "Aprender";
  keywords: string[];
}

const commands: CommandItem[] = [
  // Navegação
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Painel personalizado com widgets",
    path: "/dashboard",
    icon: LayoutDashboard,
    category: "Navegação",
    keywords: ["dashboard", "painel", "home", "início"],
  },
  {
    id: "radar",
    title: "Radar de Ativos",
    description: "Buscar e analisar ativos",
    path: "/radar",
    icon: Target,
    category: "Ativos",
    keywords: ["radar", "buscar", "ativos", "ações", "search"],
  },
  {
    id: "watchlist",
    title: "Watchlist",
    description: "Lista de ativos favoritos",
    path: "/watchlist",
    icon: Briefcase,
    category: "Ativos",
    keywords: ["watchlist", "favoritos", "lista", "acompanhar"],
  },
  {
    id: "comparador",
    title: "Comparador",
    description: "Comparar ativos lado a lado",
    path: "/comparador",
    icon: BarChart3,
    category: "Ativos",
    keywords: ["comparador", "comparar", "ativos", "análise"],
  },
  
  // Análise
  {
    id: "screener",
    title: "Screener",
    description: "Filtrar ativos por critérios",
    path: "/screener",
    icon: Search,
    category: "Análise",
    keywords: ["screener", "filtrar", "buscar", "critérios"],
  },
  {
    id: "fundamentalista",
    title: "Análise Fundamentalista",
    description: "DCF, múltiplos e scoring",
    path: "/analise-fundamentalista",
    icon: FileText,
    category: "Análise",
    keywords: ["fundamentalista", "dcf", "valuation", "múltiplos"],
  },
  {
    id: "tecnica",
    title: "Análise Técnica",
    description: "Indicadores e padrões",
    path: "/analise-tecnica",
    icon: LineChart,
    category: "Análise",
    keywords: ["técnica", "indicadores", "gráficos", "candlestick"],
  },
  {
    id: "heatmap",
    title: "Heatmap",
    description: "Visualização por setor",
    path: "/heatmap",
    icon: Map,
    category: "Análise",
    keywords: ["heatmap", "setores", "visualização", "mapa"],
  },
  {
    id: "correlacoes",
    title: "Correlações",
    description: "Matriz de correlações",
    path: "/correlacoes",
    icon: Activity,
    category: "Análise",
    keywords: ["correlações", "risco", "matriz", "beta"],
  },
  {
    id: "correlacao-setores",
    title: "Correlação de Setores",
    description: "Heatmap de correlação entre setores",
    path: "/correlacao-setores",
    icon: PieChart,
    category: "Análise",
    keywords: ["setores", "correlação", "heatmap"],
  },
  
  // Trading
  {
    id: "backtesting",
    title: "Backtesting",
    description: "Testar estratégias",
    path: "/backtesting",
    icon: Zap,
    category: "Trading",
    keywords: ["backtesting", "estratégias", "simulação", "teste"],
  },
  {
    id: "portfolios",
    title: "Portfólios",
    description: "Gerenciar carteiras",
    path: "/portfolios",
    icon: Briefcase,
    category: "Trading",
    keywords: ["portfólios", "carteiras", "posições"],
  },
  {
    id: "leaderboard",
    title: "Leaderboard",
    description: "Ranking de traders",
    path: "/leaderboard",
    icon: Trophy,
    category: "Trading",
    keywords: ["leaderboard", "ranking", "traders", "copy trading"],
  },
  {
    id: "copy-trading",
    title: "Copy Trading",
    description: "Copiar operações",
    path: "/copy-trading",
    icon: Users,
    category: "Trading",
    keywords: ["copy trading", "copiar", "seguir", "traders"],
  },
  
  // Alertas
  {
    id: "alertas-preco",
    title: "Alertas de Preço",
    description: "Notificações de preço",
    path: "/alertas",
    icon: Bell,
    category: "Alertas",
    keywords: ["alertas", "preço", "notificações"],
  },
  {
    id: "alertas-volatilidade",
    title: "Alertas de Volatilidade",
    description: "Alertas de variação",
    path: "/alertas-volatilidade",
    icon: TrendingUp,
    category: "Alertas",
    keywords: ["volatilidade", "variação", "alertas"],
  },
  
  // Mercado
  {
    id: "macro",
    title: "Painel Macroeconômico",
    description: "Indicadores econômicos",
    path: "/macro",
    icon: Globe,
    category: "Mercado",
    keywords: ["macro", "economia", "indicadores", "pib", "inflação"],
  },
  {
    id: "calendario",
    title: "Calendário Econômico",
    description: "Eventos e earnings",
    path: "/calendario",
    icon: Calendar,
    category: "Mercado",
    keywords: ["calendário", "eventos", "earnings", "dividendos"],
  },
  {
    id: "noticias",
    title: "Notícias",
    description: "Feed de notícias",
    path: "/noticias",
    icon: Newspaper,
    category: "Mercado",
    keywords: ["notícias", "news", "feed"],
  },
  {
    id: "relatorios-mercado",
    title: "Relatórios de Mercado",
    description: "White papers semanais",
    path: "/relatorios-mercado",
    icon: FileText,
    category: "Mercado",
    keywords: ["relatórios", "white papers", "análise", "mercado"],
  },
  
  // Aprender
  {
    id: "artigos",
    title: "Artigos Educativos",
    description: "Aprenda sobre investimentos",
    path: "/artigos",
    icon: GraduationCap,
    category: "Aprender",
    keywords: ["artigos", "educação", "aprender", "tutoriais"],
  },
  {
    id: "glossario",
    title: "Glossário",
    description: "Termos financeiros",
    path: "/glossario",
    icon: BookOpen,
    category: "Aprender",
    keywords: ["glossário", "termos", "definições", "dicionário"],
  },
  {
    id: "assistente-ia",
    title: "Assistente IA",
    description: "Chat com IA financeira",
    path: "/assistente-ia",
    icon: MessageSquare,
    category: "Aprender",
    keywords: ["assistente", "ia", "chat", "perguntas"],
  },
  
  // Outros
  {
    id: "premium",
    title: "Premium",
    description: "Planos e assinaturas",
    path: "/premium",
    icon: Crown,
    category: "Navegação",
    keywords: ["premium", "planos", "assinatura", "upgrade"],
  },
  {
    id: "relatorios",
    title: "Relatórios Profissionais",
    description: "Gerar relatórios PDF",
    path: "/relatorios",
    icon: FileText,
    category: "Análise",
    keywords: ["relatórios", "pdf", "exportar"],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [location] = useLocation();

  // Atalho Command+K ou Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Busca fuzzy simples
  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      const titleMatch = cmd.title.toLowerCase().includes(searchLower);
      const descMatch = cmd.description.toLowerCase().includes(searchLower);
      const keywordMatch = cmd.keywords.some((kw) => kw.includes(searchLower));
      return titleMatch || descMatch || keywordMatch;
    });
  }, [search]);

  // Resetar índice quando busca mudar
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Navegação com teclado
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredCommands[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  const handleSelect = (item: CommandItem) => {
    window.location.href = item.path;
    setOpen(false);
    setSearch("");
  };

  // Resetar ao fechar
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Agrupar por categoria
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Buscar páginas, ativos, funcionalidades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ESC
          </kbd>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-4">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {category}
                </div>
                {items.map((item, idx) => {
                  const globalIdx = filteredCommands.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  const Icon = item.icon;
                  const isCurrentPage = location === item.path;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      } ${isCurrentPage ? "opacity-50" : ""}`}
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                      {isCurrentPage && (
                        <span className="text-xs text-muted-foreground">
                          Atual
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ↑↓
            </kbd>
            Navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              Enter
            </kbd>
            Selecionar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ESC
            </kbd>
            Fechar
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

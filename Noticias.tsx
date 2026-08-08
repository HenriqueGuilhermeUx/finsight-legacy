import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  TrendingUp,
  Bitcoin,
  Globe,
  Building2,
  Clock,
  ExternalLink,
  Search,
  RefreshCw,
  Loader2,
  Bookmark,
  Share2,
  Crown,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: "acoes" | "cripto" | "macro" | "empresas";
  publishedAt: Date;
  imageUrl?: string;
  url: string;
  relatedTickers: string[];
  isPremium?: boolean;
}

// Simulated news data - in production, this would come from a news API
const generateNewsData = (): NewsItem[] => {
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Petrobras anuncia dividendos extraordinários e ações disparam na B3",
      summary: "A estatal brasileira anunciou distribuição de R$ 15 bilhões em dividendos extraordinários, impulsionando as ações PETR4 para alta de 5% no pregão.",
      source: "InfoMoney",
      category: "acoes",
      publishedAt: new Date(Date.now() - 1000 * 60 * 30),
      url: "#",
      relatedTickers: ["PETR4", "PETR3"],
    },
    {
      id: "2",
      title: "Bitcoin ultrapassa US$ 100 mil pela primeira vez na história",
      summary: "A maior criptomoeda do mundo atingiu novo recorde histórico, impulsionada pela aprovação de ETFs nos EUA e adoção institucional crescente.",
      source: "CoinDesk",
      category: "cripto",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60),
      url: "#",
      relatedTickers: ["BTC", "ETH"],
      isPremium: true,
    },
    {
      id: "3",
      title: "Fed mantém juros e sinaliza cortes em 2025",
      summary: "O Federal Reserve decidiu manter a taxa de juros entre 5,25% e 5,50%, mas sinalizou possíveis cortes ao longo de 2025 caso a inflação continue cedendo.",
      source: "Reuters",
      category: "macro",
      publishedAt: new Date(Date.now() - 1000 * 60 * 120),
      url: "#",
      relatedTickers: [],
    },
    {
      id: "4",
      title: "Vale reporta produção recorde de minério de ferro no 4º trimestre",
      summary: "A mineradora brasileira superou expectativas com produção de 95 milhões de toneladas, beneficiada pela demanda chinesa e eficiência operacional.",
      source: "Valor Econômico",
      category: "empresas",
      publishedAt: new Date(Date.now() - 1000 * 60 * 180),
      url: "#",
      relatedTickers: ["VALE3"],
    },
    {
      id: "5",
      title: "Ethereum completa atualização Dencun e taxas despencam",
      summary: "A segunda maior criptomoeda implementou com sucesso a atualização que reduz drasticamente as taxas de transação na rede.",
      source: "The Block",
      category: "cripto",
      publishedAt: new Date(Date.now() - 1000 * 60 * 240),
      url: "#",
      relatedTickers: ["ETH"],
    },
    {
      id: "6",
      title: "Copom eleva Selic para 12,25% e indica mais altas em 2025",
      summary: "O Banco Central brasileiro aumentou a taxa básica de juros em 1 ponto percentual, citando pressões inflacionárias e câmbio desvalorizado.",
      source: "BCB",
      category: "macro",
      publishedAt: new Date(Date.now() - 1000 * 60 * 300),
      url: "#",
      relatedTickers: [],
      isPremium: true,
    },
    {
      id: "7",
      title: "Magazine Luiza anuncia parceria estratégica com Amazon",
      summary: "As duas gigantes do varejo firmaram acordo para integração logística, o que pode revolucionar o e-commerce brasileiro.",
      source: "Exame",
      category: "empresas",
      publishedAt: new Date(Date.now() - 1000 * 60 * 360),
      url: "#",
      relatedTickers: ["MGLU3", "AMZN"],
    },
    {
      id: "8",
      title: "NVIDIA supera expectativas e ações sobem 10% no after-market",
      summary: "A fabricante de chips reportou receita de US$ 35 bilhões no trimestre, impulsionada pela demanda por GPUs para inteligência artificial.",
      source: "Bloomberg",
      category: "acoes",
      publishedAt: new Date(Date.now() - 1000 * 60 * 420),
      url: "#",
      relatedTickers: ["NVDA"],
      isPremium: true,
    },
    {
      id: "9",
      title: "Solana atinge novo recorde de transações por segundo",
      summary: "A blockchain processou mais de 65.000 TPS, consolidando sua posição como uma das redes mais rápidas do mercado cripto.",
      source: "Decrypt",
      category: "cripto",
      publishedAt: new Date(Date.now() - 1000 * 60 * 480),
      url: "#",
      relatedTickers: ["SOL"],
    },
    {
      id: "10",
      title: "Dólar fecha em queda com fluxo estrangeiro positivo",
      summary: "A moeda americana recuou 1,2% frente ao real, fechando a R$ 4,85, com entrada de US$ 2 bilhões em investimentos estrangeiros.",
      source: "G1",
      category: "macro",
      publishedAt: new Date(Date.now() - 1000 * 60 * 540),
      url: "#",
      relatedTickers: [],
    },
  ];

  return newsItems;
};

const categoryConfig = {
  acoes: { label: "Ações", icon: TrendingUp, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cripto: { label: "Cripto", icon: Bitcoin, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  macro: { label: "Macro", icon: Globe, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  empresas: { label: "Empresas", icon: Building2, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  return `${diffDays}d atrás`;
}

function NewsCard({ news }: { news: NewsItem }) {
  const config = categoryConfig[news.category];
  const CategoryIcon = config.icon;

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={`p-3 rounded-lg ${config.color} shrink-0`}>
            <CategoryIcon className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
              <span className="text-xs text-slate-500">{news.source}</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(news.publishedAt)}
              </span>
              {news.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-white mb-2 line-clamp-2">
              {news.title}
            </h3>

            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
              {news.summary}
            </p>

            {/* Related Tickers */}
            {news.relatedTickers.length > 0 && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {news.relatedTickers.map((ticker) => (
                  <Link key={ticker} href={`/radar/${ticker}`}>
                    <Badge variant="outline" className="text-xs cursor-pointer hover:bg-slate-700">
                      {ticker}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ler mais
                </Button>
              </a>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Noticias() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setNews(generateNewsData());
      setIsLoading(false);
    }, 800);
  }, []);

  const refreshNews = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNews(generateNewsData());
      setIsLoading(false);
    }, 500);
  };

  const filteredNews = news.filter((item) => {
    const matchesTab = activeTab === "todas" || item.category === activeTab;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedTickers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-cyan-500" />
              Notícias Financeiras
            </h1>
            <p className="text-slate-400 mt-2">
              Fique por dentro das últimas notícias do mercado financeiro.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshNews}
            disabled={isLoading}
            className="border-slate-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Buscar notícias por título, resumo ou ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="todas" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="acoes" className="data-[state=active]:bg-emerald-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ações
            </TabsTrigger>
            <TabsTrigger value="cripto" className="data-[state=active]:bg-amber-600">
              <Bitcoin className="h-4 w-4 mr-2" />
              Cripto
            </TabsTrigger>
            <TabsTrigger value="macro" className="data-[state=active]:bg-cyan-600">
              <Globe className="h-4 w-4 mr-2" />
              Macro
            </TabsTrigger>
            <TabsTrigger value="empresas" className="data-[state=active]:bg-purple-600">
              <Building2 className="h-4 w-4 mr-2" />
              Empresas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* News Feed */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : filteredNews.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <Newspaper className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhuma notícia encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}

        {/* Ad Banner */}
        <Card className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-700/50 mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Quer análises exclusivas e notícias em primeira mão?
                </h3>
                <p className="text-slate-300 text-sm">
                  Assine o FinSight Premium e tenha acesso a conteúdos exclusivos.
                </p>
              </div>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 font-semibold">
                  <Crown className="h-4 w-4 mr-2" />
                  Assinar Premium
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

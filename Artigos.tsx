import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { BookOpen, Clock, Eye, Search, TrendingUp, BarChart3, Bitcoin, Globe, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/MainLayout";

const categories = [
  { id: "fundamentalista", name: "Análise Fundamentalista", icon: BarChart3, color: "text-blue-500" },
  { id: "tecnica", name: "Análise Técnica", icon: TrendingUp, color: "text-green-500" },
  { id: "cripto", name: "Criptomoedas", icon: Bitcoin, color: "text-orange-500" },
  { id: "macro", name: "Macroeconomia", icon: Globe, color: "text-purple-500" },
  { id: "iniciante", name: "Para Iniciantes", icon: GraduationCap, color: "text-yellow-500" },
] as const;

// Sample articles for initial display (will be replaced by database content)
const sampleArticles = [
  {
    id: 1,
    slug: "o-que-e-pl-como-usar",
    title: "O que é P/L e como usar na análise de ações",
    summary: "Entenda o indicador Preço/Lucro (P/L), como calculá-lo e interpretá-lo para tomar melhores decisões de investimento em ações.",
    category: "fundamentalista" as const,
    readTime: 8,
    views: 1250,
    publishedAt: new Date("2024-12-15"),
  },
  {
    id: 2,
    slug: "medias-moveis-guia-completo",
    title: "Médias Móveis: Guia Completo para Traders",
    summary: "Aprenda a usar médias móveis simples e exponenciais para identificar tendências e pontos de entrada e saída no mercado.",
    category: "tecnica" as const,
    readTime: 12,
    views: 980,
    publishedAt: new Date("2024-12-10"),
  },
  {
    id: 3,
    slug: "bitcoin-para-iniciantes",
    title: "Bitcoin para Iniciantes: Tudo que você precisa saber",
    summary: "Um guia completo sobre Bitcoin: o que é, como funciona, como comprar e armazenar de forma segura.",
    category: "cripto" as const,
    readTime: 15,
    views: 2100,
    publishedAt: new Date("2024-12-08"),
  },
  {
    id: 4,
    slug: "como-a-selic-afeta-investimentos",
    title: "Como a Taxa Selic afeta seus investimentos",
    summary: "Entenda a relação entre a taxa básica de juros e diferentes classes de ativos: renda fixa, ações e fundos imobiliários.",
    category: "macro" as const,
    readTime: 10,
    views: 1500,
    publishedAt: new Date("2024-12-05"),
  },
  {
    id: 5,
    slug: "primeiros-passos-investir",
    title: "Primeiros Passos para Começar a Investir",
    summary: "Um guia prático para quem está começando: como montar sua reserva de emergência e dar os primeiros passos no mundo dos investimentos.",
    category: "iniciante" as const,
    readTime: 7,
    views: 3200,
    publishedAt: new Date("2024-12-01"),
  },
  {
    id: 6,
    slug: "roe-indicador-rentabilidade",
    title: "ROE: O Indicador de Rentabilidade que Todo Investidor Deve Conhecer",
    summary: "Descubra como o Retorno sobre Patrimônio Líquido (ROE) pode ajudar a identificar empresas eficientes e lucrativas.",
    category: "fundamentalista" as const,
    readTime: 9,
    views: 890,
    publishedAt: new Date("2024-11-28"),
  },
];

export default function Artigos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: dbArticles } = trpc.articles.list.useQuery({ 
    category: selectedCategory as any,
    limit: 20 
  });

  const { data: popularArticles } = trpc.articles.getPopular.useQuery({ limit: 5 });

  // Use database articles if available, otherwise use sample articles
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : sampleArticles;
  const popular = popularArticles && popularArticles.length > 0 ? popularArticles : sampleArticles.slice(0, 3);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Educação Financeira</h1>
          <p className="text-muted-foreground">
            Artigos e guias para ajudar você a tomar melhores decisões de investimento
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className={`h-4 w-4 mr-1 ${selectedCategory === category.id ? "" : category.color}`} />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              filteredArticles.map(article => {
                const categoryInfo = getCategoryInfo(article.category);
                return (
                  <Link key={article.id} href={`/artigos/${article.slug}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`flex items-center gap-1 text-sm ${categoryInfo.color}`}>
                            <categoryInfo.icon className="h-4 w-4" />
                            {categoryInfo.name}
                          </span>
                        </div>
                        <CardTitle className="text-xl hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {article.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime} min de leitura
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {article.views.toLocaleString()} visualizações
                          </span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mais Populares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popular.map((article, index) => (
                  <Link key={article.id} href={`/artigos/${article.slug}`}>
                    <div className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.views.toLocaleString()} visualizações
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className={`h-4 w-4 mr-2 ${category.color}`} />
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">Quer mais conteúdo?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Assine o FinSight Pro e tenha acesso a análises exclusivas e relatórios premium.
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/premium">Conhecer Planos</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

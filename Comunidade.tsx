import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessagesSquare, 
  Users,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Flame,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Star,
  Award,
  CheckCircle,
  Send
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
    reputation: number;
  };
  title: string;
  content: string;
  ticker?: string;
  category: 'analise' | 'duvida' | 'noticia' | 'estrategia' | 'geral';
  likes: number;
  dislikes: number;
  comments: number;
  views: number;
  createdAt: string;
  isPinned?: boolean;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    author: { name: 'Carlos Investidor', badge: 'Expert', reputation: 4850 },
    title: 'Análise completa de PETR4: Por que estou otimista para 2025',
    content: 'Fiz uma análise detalhada dos fundamentos da Petrobras considerando o cenário de petróleo, política de dividendos e investimentos. O P/L está em 4.5x, bem abaixo da média histórica...',
    ticker: 'PETR4',
    category: 'analise',
    likes: 156,
    dislikes: 12,
    comments: 48,
    views: 2340,
    createdAt: '2h atrás',
    isPinned: true,
  },
  {
    id: '2',
    author: { name: 'Maria Santos', badge: 'Analista', reputation: 3200 },
    title: 'FIIs de logística: HGLG11 vs XPLG11 - Qual escolher?',
    content: 'Estou montando uma carteira de FIIs focada em logística e gostaria de compartilhar minha análise comparativa entre esses dois fundos. Ambos têm boa liquidez, mas...',
    ticker: 'HGLG11',
    category: 'analise',
    likes: 89,
    dislikes: 5,
    comments: 32,
    views: 1560,
    createdAt: '4h atrás',
  },
  {
    id: '3',
    author: { name: 'João Iniciante', reputation: 150 },
    title: 'Dúvida: Como calcular o preço teto pelo método Bazin?',
    content: 'Estou começando a estudar valuation e vi que o método Bazin é bom para quem foca em dividendos. Alguém pode me explicar passo a passo como calcular?',
    category: 'duvida',
    likes: 45,
    dislikes: 2,
    comments: 18,
    views: 890,
    createdAt: '6h atrás',
  },
  {
    id: '4',
    author: { name: 'Ana Trader', badge: 'Pro', reputation: 5600 },
    title: 'Estratégia de dividendos: Como montei uma carteira que rende R$ 3k/mês',
    content: 'Depois de 5 anos investindo, finalmente alcancei minha meta de renda passiva. Vou compartilhar como estruturei minha carteira, os critérios de seleção e os erros que cometi...',
    category: 'estrategia',
    likes: 234,
    dislikes: 8,
    comments: 87,
    views: 4520,
    createdAt: '1d atrás',
  },
  {
    id: '5',
    author: { name: 'Pedro Macro', badge: 'Analista', reputation: 2800 },
    title: 'Impacto da decisão do Copom nos FIIs de papel',
    content: 'Com a Selic em 12.25%, os FIIs de papel tendem a se beneficiar. Vamos analisar como isso afeta MXRF11, KNCR11 e outros fundos de CRI...',
    category: 'noticia',
    likes: 67,
    dislikes: 3,
    comments: 24,
    views: 1230,
    createdAt: '1d atrás',
  },
  {
    id: '6',
    author: { name: 'Lucas Value', reputation: 980 },
    title: 'WEGE3 está cara demais? Análise do P/L histórico',
    content: 'WEG sempre negociou com múltiplos elevados, mas o P/L atual de 35x me preocupa. Será que ainda vale a pena entrar agora ou é melhor esperar uma correção?',
    ticker: 'WEGE3',
    category: 'analise',
    likes: 78,
    dislikes: 15,
    comments: 42,
    views: 1680,
    createdAt: '2d atrás',
  },
];

const CATEGORIES = [
  { value: 'todos', label: 'Todos', icon: MessagesSquare },
  { value: 'analise', label: 'Análises', icon: TrendingUp },
  { value: 'duvida', label: 'Dúvidas', icon: MessageCircle },
  { value: 'estrategia', label: 'Estratégias', icon: Star },
  { value: 'noticia', label: 'Notícias', icon: Flame },
  { value: 'geral', label: 'Geral', icon: Users },
];

export default function Comunidade() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('geral');

  const filteredPosts = SAMPLE_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analise': return 'bg-blue-500/10 text-blue-500';
      case 'duvida': return 'bg-yellow-500/10 text-yellow-500';
      case 'estrategia': return 'bg-green-500/10 text-green-500';
      case 'noticia': return 'bg-orange-500/10 text-orange-500';
      case 'geral': return 'bg-gray-500/10 text-gray-500';
      default: return '';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'analise': return 'Análise';
      case 'duvida': return 'Dúvida';
      case 'estrategia': return 'Estratégia';
      case 'noticia': return 'Notícia';
      case 'geral': return 'Geral';
      default: return category;
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Expert': return 'bg-purple-500';
      case 'Pro': return 'bg-yellow-500';
      case 'Analista': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessagesSquare className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Comunidade</h1>
            </div>
            <p className="text-muted-foreground">
              Discuta estratégias, tire dúvidas e compartilhe análises com outros investidores
            </p>
          </div>
          <Button onClick={() => setShowNewPost(!showNewPost)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Discussão
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">2.5k</div>
                <div className="text-sm text-muted-foreground">Membros ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <MessagesSquare className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">856</div>
                <div className="text-sm text-muted-foreground">Discussões</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">4.2k</div>
                <div className="text-sm text-muted-foreground">Comentários</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">128</div>
                <div className="text-sm text-muted-foreground">Experts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nova Discussão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Título da discussão"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                placeholder="Escreva sua mensagem..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="h-10 px-3 rounded-md border bg-background text-sm"
              >
                <option value="geral">Geral</option>
                <option value="analise">Análise</option>
                <option value="duvida">Dúvida</option>
                <option value="estrategia">Estratégia</option>
                <option value="noticia">Notícia</option>
              </select>
              <Button className="ml-auto">
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar discussões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Categorias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {cat.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                Top Contribuidores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Ana Trader', badge: 'Pro', reputation: 5600 },
                { name: 'Carlos Investidor', badge: 'Expert', reputation: 4850 },
                { name: 'Maria Santos', badge: 'Analista', reputation: 3200 },
                { name: 'Pedro Macro', badge: 'Analista', reputation: 2800 },
                { name: 'Lucas Value', reputation: 980 },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 text-sm font-bold text-muted-foreground">#{i + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.reputation} rep</div>
                  </div>
                  {user.badge && (
                    <Badge className={`text-xs ${getBadgeColor(user.badge)}`}>
                      {user.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Posts */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ordenar:</span>
            {[
              { value: 'hot', label: 'Em alta', icon: Flame },
              { value: 'new', label: 'Recentes', icon: Clock },
              { value: 'top', label: 'Top', icon: TrendingUp },
            ].map((sort) => {
              const Icon = sort.icon;
              return (
                <Button
                  key={sort.value}
                  variant={sortBy === sort.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy(sort.value as any)}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {sort.label}
                </Button>
              );
            })}
          </div>

          {/* Post List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className={post.isPinned ? 'border-primary/50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex gap-4">
                    {/* Votes */}
                    <div className="flex flex-col items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-bold">{post.likes - post.dislikes}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <Badge variant="outline" className="text-xs">
                            📌 Fixado
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(post.category)}>
                          {getCategoryLabel(post.category)}
                        </Badge>
                        {post.ticker && (
                          <Link href={`/ativo/${post.ticker}`}>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                              {post.ticker}
                            </Badge>
                          </Link>
                        )}
                      </div>

                      <h3 className="font-bold text-lg mb-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{post.author.name}</span>
                          {post.author.badge && (
                            <Badge className={`text-xs ${getBadgeColor(post.author.badge)}`}>
                              {post.author.badge}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma discussão encontrada
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

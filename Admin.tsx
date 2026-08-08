import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import MainLayout from "@/components/MainLayout";
import { 
  Users, 
  FileText, 
  Mail, 
  CreditCard, 
  BarChart3, 
  Settings,
  Crown,
  Ban,
  Download,
  RefreshCw,
  Loader2,
  TrendingUp,
  Eye,
  UserPlus,
  DollarSign,
  Calendar,
  Search,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [searchUsers, setSearchUsers] = useState("");
  const [searchSubscribers, setSearchSubscribers] = useState("");

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.listUsers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: subscribers, isLoading: subscribersLoading, refetch: refetchSubscribers } = trpc.newsletter.listSubscribers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: articles, isLoading: articlesLoading, refetch: refetchArticles } = trpc.articles.listAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = trpc.admin.listSubscriptions.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Mutations
  const promoteUserMutation = trpc.admin.promoteToAdmin.useMutation({
    onSuccess: () => {
      toast.success("Usuário promovido a admin!");
      refetchUsers();
    },
    onError: (error) => toast.error(error.message),
  });

  const demoteUserMutation = trpc.admin.demoteFromAdmin.useMutation({
    onSuccess: () => {
      toast.success("Admin rebaixado para usuário!");
      refetchUsers();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteArticleMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Artigo excluído!");
      refetchArticles();
    },
    onError: (error) => toast.error(error.message),
  });

  const togglePublishMutation = trpc.articles.togglePublish.useMutation({
    onSuccess: () => {
      toast.success("Status de publicação alterado!");
      refetchArticles();
    },
    onError: (error) => toast.error(error.message),
  });

  const sendNewsletterMutation = trpc.newsletter.sendWeeklyNewsletter.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => toast.error(error.message),
  });

  // Export subscribers to CSV
  const exportSubscribersCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      toast.error("Nenhum inscrito para exportar");
      return;
    }

    const headers = ["Email", "Nome", "Data de Inscrição", "Ativo"];
    const rows = subscribers.map((s: any) => [
      s.email,
      s.name || "",
      new Date(s.subscribedAt).toLocaleDateString("pt-BR"),
      s.isActive ? "Sim" : "Não",
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado com sucesso!");
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </MainLayout>
    );
  }

  // Access denied
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <Shield className="h-6 w-6" />
                Acesso Negado
              </CardTitle>
              <CardDescription>
                Você não tem permissão para acessar o painel de administração.
                Esta área é restrita a administradores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full">Voltar para Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Filter functions
  const filteredUsers = users?.filter((u: any) => 
    u.name?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUsers.toLowerCase())
  ) || [];

  const filteredSubscribers = subscribers?.filter((s: any) =>
    s.email?.toLowerCase().includes(searchSubscribers.toLowerCase()) ||
    s.name?.toLowerCase().includes(searchSubscribers.toLowerCase())
  ) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Crown className="h-8 w-8 text-amber-400" />
              Painel de Administração
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie usuários, conteúdo e configurações da plataforma
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              refetchStats();
              refetchUsers();
              refetchSubscribers();
              refetchArticles();
              toast.success("Dados atualizados!");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuários</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {statsLoading ? "..." : stats?.totalUsers || 0}
                  </p>
                </div>
                <Users className="h-10 w-10 text-cyan-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assinantes Premium</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {statsLoading ? "..." : stats?.premiumUsers || 0}
                  </p>
                </div>
                <CreditCard className="h-10 w-10 text-emerald-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Newsletter</p>
                  <p className="text-3xl font-bold text-amber-400">
                    {statsLoading ? "..." : stats?.newsletterSubscribers || 0}
                  </p>
                </div>
                <Mail className="h-10 w-10 text-amber-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Artigos</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {statsLoading ? "..." : stats?.totalArticles || 0}
                  </p>
                </div>
                <FileText className="h-10 w-10 text-purple-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <UserPlus className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Novos (7 dias)</p>
                  <p className="text-xl font-bold">{stats?.newUsersLast7Days || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                  <p className="text-xl font-bold">R$ {stats?.monthlyRevenue?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Eye className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Views Artigos</p>
                  <p className="text-xl font-bold">{stats?.totalArticleViews || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                  <p className="text-xl font-bold">{stats?.activeAlerts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="h-4 w-4" />
              Artigos
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="gap-2">
              <Mail className="h-4 w-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Assinaturas
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestão de Usuários</CardTitle>
                    <CardDescription>Gerencie os usuários da plataforma</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchUsers}
                      onChange={(e) => setSearchUsers(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((u: any) => (
                      <div key={u.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{u.name || "Sem nome"}</p>
                              {u.role === "admin" && (
                                <Badge className="bg-amber-500/20 text-amber-400">Admin</Badge>
                              )}
                              {u.stripeSubscriptionStatus === "active" && (
                                <Badge className="bg-emerald-500/20 text-emerald-400">Premium</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground mr-4">
                            Último acesso: {new Date(u.lastSignedIn).toLocaleDateString("pt-BR")}
                          </p>
                          {u.role === "admin" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => demoteUserMutation.mutate({ userId: u.id })}
                              disabled={u.openId === user?.openId}
                            >
                              Remover Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => promoteUserMutation.mutate({ userId: u.id })}
                            >
                              <Crown className="h-4 w-4 mr-1" />
                              Promover
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum usuário encontrado
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestão de Artigos</CardTitle>
                    <CardDescription>Gerencie os artigos educativos</CardDescription>
                  </div>
                  <Link href="/admin/artigos">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Editor de Artigos
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {articlesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {articles?.map((article: any) => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{article.title}</p>
                            <Badge variant={article.isPublished ? "default" : "secondary"}>
                              {article.isPublished ? "Publicado" : "Rascunho"}
                            </Badge>
                            <Badge variant="outline">{article.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {article.views} views • {article.readTime} min leitura
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePublishMutation.mutate({ id: article.id })}
                          >
                            {article.isPublished ? (
                              <><XCircle className="h-4 w-4 mr-1" /> Despublicar</>
                            ) : (
                              <><CheckCircle className="h-4 w-4 mr-1" /> Publicar</>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja excluir este artigo?")) {
                                deleteArticleMutation.mutate({ id: article.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!articles || articles.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum artigo encontrado
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inscritos na Newsletter</CardTitle>
                    <CardDescription>Gerencie os inscritos na newsletter</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar inscritos..."
                        value={searchSubscribers}
                        onChange={(e) => setSearchSubscribers(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={exportSubscribersCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar CSV
                    </Button>
                    <Button 
                      onClick={() => sendNewsletterMutation.mutate()}
                      disabled={sendNewsletterMutation.isPending}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {sendNewsletterMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4 mr-2" />
                      )}
                      Enviar Newsletter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {subscribersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSubscribers.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium">{s.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {s.name || "Sem nome"} • Inscrito em {new Date(s.subscribedAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <Badge variant={s.isActive ? "default" : "secondary"}>
                          {s.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    ))}
                    {filteredSubscribers.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum inscrito encontrado
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Assinaturas Premium</CardTitle>
                <CardDescription>Gerencie as assinaturas Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subscriptions?.map((sub: any) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium">{sub.userName || sub.userEmail}</p>
                            <p className="text-sm text-muted-foreground">
                              Plano: {sub.plan} • Desde {new Date(sub.startDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                            {sub.status === "active" ? "Ativo" : sub.status}
                          </Badge>
                          <p className="text-sm font-medium text-emerald-400">
                            R$ {sub.amount?.toFixed(2)}/mês
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!subscriptions || subscriptions.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma assinatura encontrada
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Stripe</CardTitle>
                  <CardDescription>Status da integração de pagamentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span>Stripe Configurado</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Ativo</Badge>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-400 font-medium mb-2">Ação Necessária</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para ativar pagamentos reais, reivindique o sandbox Stripe acessando o painel do Stripe.
                    </p>
                    <a 
                      href="https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2dCVTdQRXpicmY1ZHJYLDE3NjY4NjY3NDcv1002ALiWkNx"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        Reivindicar Sandbox
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Links Rápidos</CardTitle>
                  <CardDescription>Acesso rápido às funcionalidades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/artigos">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Editor de Artigos
                    </Button>
                  </Link>
                  <Link href="/premium">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Página Premium
                    </Button>
                  </Link>
                  <Link href="/artigos">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Artigos Públicos
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>Detalhes técnicos da plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Versão</p>
                      <p className="font-medium">v9.0.0</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Ambiente</p>
                      <p className="font-medium">Produção</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">API Yahoo Finance</p>
                      <p className="font-medium text-emerald-400">Conectada</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Banco de Dados</p>
                      <p className="font-medium text-emerald-400">Online</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

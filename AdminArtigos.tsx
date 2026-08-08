import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, Save, BookOpen, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const categories = [
  { id: "fundamentalista", name: "Análise Fundamentalista" },
  { id: "tecnica", name: "Análise Técnica" },
  { id: "cripto", name: "Criptomoedas" },
  { id: "macro", name: "Macroeconomia" },
  { id: "iniciante", name: "Para Iniciantes" },
] as const;

interface ArticleForm {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  authorName: string;
  readTime: number;
  isPublished: boolean;
}

const emptyForm: ArticleForm = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  category: "iniciante",
  authorName: "Equipe FinSight",
  readTime: 5,
  isPublished: true,
};

export default function AdminArtigos() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const utils = trpc.useUtils();

  const { data: articles, isLoading: loadingArticles } = trpc.articles.listAll.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("Artigo criado com sucesso!");
      utils.articles.listAll.invalidate();
      setShowForm(false);
      setEditingArticle(emptyForm);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("Artigo atualizado com sucesso!");
      utils.articles.listAll.invalidate();
      setShowForm(false);
      setEditingArticle(emptyForm);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Artigo excluído com sucesso!");
      utils.articles.listAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const togglePublishMutation = trpc.articles.togglePublish.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado!");
      utils.articles.listAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingArticle.title || !editingArticle.content || !editingArticle.summary) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const slug = editingArticle.slug || editingArticle.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (isEditing && editingArticle.id) {
      updateMutation.mutate({
        id: editingArticle.id,
        slug,
        title: editingArticle.title,
        summary: editingArticle.summary,
        content: editingArticle.content,
        category: editingArticle.category as any,
        authorName: editingArticle.authorName,
        readTime: editingArticle.readTime,
        isPublished: editingArticle.isPublished,
      });
    } else {
      createMutation.mutate({
        slug,
        title: editingArticle.title,
        summary: editingArticle.summary,
        content: editingArticle.content,
        category: editingArticle.category as any,
        authorName: editingArticle.authorName,
        readTime: editingArticle.readTime,
        isPublished: editingArticle.isPublished,
      });
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      authorName: article.authorName || "Equipe FinSight",
      readTime: article.readTime,
      isPublished: article.isPublished,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-8">
            Faça login para acessar o painel de administração.
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (user?.role !== "admin") {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground mb-8">
            Você não tem permissão para acessar esta página.
          </p>
          <Button asChild>
            <Link href="/">Voltar para Home</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/artigos">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Gerenciar Artigos</h1>
            <p className="text-muted-foreground">
              Crie e edite artigos educativos para a plataforma
            </p>
          </div>
          <Button onClick={() => { setShowForm(true); setIsEditing(false); setEditingArticle(emptyForm); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{isEditing ? "Editar Artigo" : "Novo Artigo"}</CardTitle>
              <CardDescription>
                {isEditing ? "Atualize as informações do artigo" : "Preencha os campos para criar um novo artigo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      placeholder="Ex: O que é P/L e como usar"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={editingArticle.slug}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                      placeholder="Gerado automaticamente se vazio"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Resumo *</Label>
                  <Textarea
                    id="summary"
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    placeholder="Uma breve descrição do artigo (exibida na listagem)"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo (Markdown) *</Label>
                  <Textarea
                    id="content"
                    value={editingArticle.content}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    placeholder="# Título&#10;&#10;Seu conteúdo em Markdown..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={editingArticle.category}
                      onValueChange={(value) => setEditingArticle({ ...editingArticle, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorName">Autor</Label>
                    <Input
                      id="authorName"
                      value={editingArticle.authorName}
                      onChange={(e) => setEditingArticle({ ...editingArticle, authorName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Tempo de leitura (min)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      min={1}
                      value={editingArticle.readTime}
                      onChange={(e) => setEditingArticle({ ...editingArticle, readTime: parseInt(e.target.value) || 5 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Publicado</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <Switch
                        checked={editingArticle.isPublished}
                        onCheckedChange={(checked) => setEditingArticle({ ...editingArticle, isPublished: checked })}
                      />
                      <span className="text-sm text-muted-foreground">
                        {editingArticle.isPublished ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Atualizar" : "Criar"} Artigo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowForm(false); setEditingArticle(emptyForm); setIsEditing(false); }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Articles List */}
        <Card>
          <CardHeader>
            <CardTitle>Artigos ({articles?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingArticles ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{article.title}</h3>
                        {!article.isPublished && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-500 rounded">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.summary}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{categories.find(c => c.id === article.category)?.name}</span>
                        <span>{article.readTime} min</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePublishMutation.mutate({ id: article.id })}
                        title={article.isPublished ? "Despublicar" : "Publicar"}
                      >
                        {article.isPublished ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum artigo cadastrado.</p>
                <p className="text-sm">Clique em "Novo Artigo" para começar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

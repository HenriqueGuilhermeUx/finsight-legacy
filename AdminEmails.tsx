import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, Users, Download, Send, Search, CheckCircle, 
  Clock, AlertCircle, TrendingUp, Calendar, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export default function AdminEmails() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementSubject, setAnnouncementSubject] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");

  // Queries
  const { data: stats, refetch: refetchStats } = trpc.emails.stats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: emails, refetch: refetchEmails } = trpc.emails.list.useQuery(
    { limit: 100, search: search || undefined },
    { enabled: !!user }
  );

  const { data: emailHistory } = trpc.emails.history.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  // Mutations
  const exportEmails = trpc.emails.export.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([data.data], { type: data.filename.endsWith('.csv') ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exportação concluída!");
    },
    onError: () => toast.error("Erro ao exportar emails"),
  });

  const sendAnnouncement = trpc.emails.sendAnnouncement.useMutation({
    onSuccess: (data) => {
      toast.success(`Comunicado enviado! ${data.sent} enviados, ${data.failed} falhas`);
      setShowAnnouncement(false);
      setAnnouncementSubject("");
      setAnnouncementContent("");
      refetchStats();
    },
    onError: () => toast.error("Erro ao enviar comunicado"),
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">Faça login para acessar esta página.</p>
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
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              Gerenciamento de Emails
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie emails cadastrados e envie comunicados
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportEmails.mutate({ format: "csv" })}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={() => setShowAnnouncement(true)}>
              <Send className="h-4 w-4 mr-2" />
              Enviar Comunicado
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Cadastrados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.verified || 0}</p>
                  <p className="text-sm text-muted-foreground">Verificados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.welcomeSent || 0}</p>
                  <p className="text-sm text-muted-foreground">Welcome Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-cyan-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.today || 0}</p>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.thisWeek || 0}</p>
                  <p className="text-sm text-muted-foreground">Esta Semana</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcement Modal */}
        {showAnnouncement && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle>Enviar Comunicado</CardTitle>
              <CardDescription>
                Envie um comunicado para todos os {stats?.total || 0} emails cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Assunto</Label>
                <Input
                  value={announcementSubject}
                  onChange={(e) => setAnnouncementSubject(e.target.value)}
                  placeholder="Ex: Novidades do FinSight - Dezembro 2024"
                />
              </div>
              <div>
                <Label>Conteúdo</Label>
                <Textarea
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  placeholder="Digite o conteúdo do comunicado..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => sendAnnouncement.mutate({ 
                    subject: announcementSubject, 
                    content: announcementContent 
                  })}
                  disabled={!announcementSubject || !announcementContent || sendAnnouncement.isPending}
                >
                  {sendAnnouncement.isPending ? "Enviando..." : "Enviar para Todos"}
                </Button>
                <Button variant="outline" onClick={() => setShowAnnouncement(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por email ou nome..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => { refetchEmails(); refetchStats(); }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email List */}
        <Card>
          <CardHeader>
            <CardTitle>Emails Cadastrados</CardTitle>
            <CardDescription>
              {emails?.length || 0} emails encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Fonte</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Análises</th>
                    <th className="text-left py-3 px-4">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {emails?.map((email) => (
                    <tr key={email.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{email.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{email.name || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{email.source}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {email.verified && (
                            <Badge variant="default" className="bg-green-500">Verificado</Badge>
                          )}
                          {email.welcomeEmailSent && (
                            <Badge variant="secondary">Welcome</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{email.analysisCount}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {new Date(email.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(!emails || emails.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum email encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Histórico de Envios</CardTitle>
            <CardDescription>
              Últimos emails enviados pelo sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailHistory?.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {email.status === "sent" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : email.status === "failed" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{email.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        Para: {email.recipientEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={email.status === "sent" ? "default" : email.status === "failed" ? "destructive" : "secondary"}>
                      {email.emailType}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {email.sentAt ? new Date(email.sentAt).toLocaleString('pt-BR') : "-"}
                    </p>
                  </div>
                </div>
              ))}

              {(!emailHistory || emailHistory.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum email enviado ainda
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

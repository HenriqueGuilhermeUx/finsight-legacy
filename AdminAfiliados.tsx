import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Globe,
  Instagram,
  Youtube,
  ArrowLeft,
  FileText,
  AlertCircle,
} from "lucide-react";

// Mock data para candidaturas de afiliados
const mockApplications = [
  {
    id: 1,
    fullName: "Carlos Mendes",
    email: "carlos@email.com",
    phone: "(11) 99999-1111",
    website: "https://carlosfinancas.com.br",
    instagram: "@carlosfinancas",
    youtube: "CarlosFinancas",
    audienceSize: "10k-50k",
    niche: "investimentos",
    experience: "3 anos como afiliado de corretoras. Já trabalhei com XP, Rico e NuInvest.",
    promotionPlan: "Vou criar conteúdo no YouTube e Instagram sobre análise de ações, incluindo reviews da plataforma.",
    status: "pending" as const,
    createdAt: new Date("2024-12-18"),
  },
  {
    id: 2,
    fullName: "Ana Paula Silva",
    email: "ana@email.com",
    phone: "(21) 98888-2222",
    website: "",
    instagram: "@anafinanceira",
    youtube: "",
    audienceSize: "1k-10k",
    niche: "financas-pessoais",
    experience: "Iniciante em afiliados, mas tenho 5k seguidores engajados no Instagram.",
    promotionPlan: "Stories diários sobre finanças pessoais e posts sobre ferramentas úteis.",
    status: "pending" as const,
    createdAt: new Date("2024-12-19"),
  },
  {
    id: 3,
    fullName: "Roberto Santos",
    email: "roberto@email.com",
    phone: "(31) 97777-3333",
    website: "https://tradingbr.com",
    instagram: "@tradingbr",
    youtube: "TradingBR",
    audienceSize: "50k-100k",
    niche: "trading",
    experience: "5 anos como trader e educador. Já fui afiliado de várias plataformas de trading.",
    promotionPlan: "Lives semanais de análise técnica usando a plataforma, tutoriais no YouTube.",
    status: "approved" as const,
    createdAt: new Date("2024-12-10"),
    reviewedAt: new Date("2024-12-11"),
    reviewNotes: "Excelente perfil, grande audiência no nicho.",
  },
  {
    id: 4,
    fullName: "Mariana Costa",
    email: "mariana@email.com",
    phone: "(41) 96666-4444",
    website: "",
    instagram: "@maricripto",
    youtube: "",
    audienceSize: "0-1k",
    niche: "cripto",
    experience: "Nenhuma experiência prévia.",
    promotionPlan: "Vou postar no Instagram.",
    status: "rejected" as const,
    createdAt: new Date("2024-12-15"),
    reviewedAt: new Date("2024-12-16"),
    reviewNotes: "Audiência muito pequena e plano de divulgação pouco detalhado.",
    rejectionReason: "Audiência insuficiente para o programa. Sugerimos crescer a base de seguidores e reaplicar.",
  },
];

// Mock data para afiliados ativos
const mockAffiliates = [
  {
    id: 1,
    userId: 5,
    fullName: "Roberto Santos",
    email: "roberto@email.com",
    code: "ROBERTO2024",
    tier: "gold" as const,
    totalClicks: 15420,
    totalConversions: 342,
    totalEarnings: 3420.00,
    pendingBalance: 450.00,
    status: "active" as const,
    verificationStatus: "approved" as const,
    createdAt: new Date("2024-12-11"),
  },
  {
    id: 2,
    userId: 8,
    fullName: "Pedro Almeida",
    email: "pedro@email.com",
    code: "PEDRO2024",
    tier: "silver" as const,
    totalClicks: 5230,
    totalConversions: 87,
    totalEarnings: 652.50,
    pendingBalance: 125.00,
    status: "active" as const,
    verificationStatus: "approved" as const,
    createdAt: new Date("2024-11-20"),
  },
  {
    id: 3,
    userId: 12,
    fullName: "Julia Ferreira",
    email: "julia@email.com",
    code: "JULIA2024",
    tier: "bronze" as const,
    totalClicks: 1250,
    totalConversions: 18,
    totalEarnings: 89.82,
    pendingBalance: 89.82,
    status: "active" as const,
    verificationStatus: "pending" as const,
    createdAt: new Date("2024-12-05"),
  },
];

export default function AdminAfiliados() {
  const [applications, setApplications] = useState(mockApplications);
  const [affiliates] = useState(mockAffiliates);
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;
  const rejectedCount = applications.filter(a => a.status === "rejected").length;

  const totalEarnings = affiliates.reduce((sum, a) => sum + a.totalEarnings, 0);
  const totalConversions = affiliates.reduce((sum, a) => sum + a.totalConversions, 0);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (app: typeof mockApplications[0]) => {
    setSelectedApplication(app);
    setReviewNotes("");
    setRejectionReason("");
    setIsReviewDialogOpen(true);
  };

  const handleReject = (app: typeof mockApplications[0]) => {
    setSelectedApplication(app);
    setReviewNotes("");
    setRejectionReason("");
    setIsReviewDialogOpen(true);
  };

  const confirmApproval = () => {
    if (selectedApplication) {
      setApplications(apps => apps.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: "approved" as const, reviewedAt: new Date(), reviewNotes, rejectionReason: undefined }
          : app
      ) as typeof mockApplications);
      setIsReviewDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const confirmRejection = () => {
    if (selectedApplication) {
      setApplications(apps => apps.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: "rejected" as const, reviewedAt: new Date(), reviewNotes, rejectionReason }
          : app
      ) as typeof mockApplications);
      setIsReviewDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return null;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "gold":
        return <Badge className="bg-yellow-500/20 text-yellow-400">🥇 Ouro</Badge>;
      case "silver":
        return <Badge className="bg-slate-500/20 text-slate-300">🥈 Prata</Badge>;
      case "bronze":
        return <Badge className="bg-orange-500/20 text-orange-400">🥉 Bronze</Badge>;
      default:
        return null;
    }
  };

  const getAudienceSizeLabel = (size: string) => {
    const labels: Record<string, string> = {
      "0-1k": "0 - 1.000",
      "1k-10k": "1.000 - 10.000",
      "10k-50k": "10.000 - 50.000",
      "50k-100k": "50.000 - 100.000",
      "100k+": "100.000+",
    };
    return labels[size] || size;
  };

  const getNicheLabel = (niche: string) => {
    const labels: Record<string, string> = {
      "investimentos": "Investimentos",
      "financas-pessoais": "Finanças Pessoais",
      "trading": "Trading/Day Trade",
      "cripto": "Criptomoedas",
      "educacao-financeira": "Educação Financeira",
      "outro": "Outro",
    };
    return labels[niche] || niche;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Gestão de Afiliados</h1>
              <p className="text-muted-foreground">Gerencie candidaturas e afiliados ativos</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{affiliates.length}</div>
                  <div className="text-xs text-muted-foreground">Afiliados Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalConversions}</div>
                  <div className="text-xs text-muted-foreground">Conversões Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">R$ {totalEarnings.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Comissões Pagas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="w-4 h-4" />
              Candidaturas
              {pendingCount > 0 && (
                <Badge className="ml-1 bg-yellow-500/20 text-yellow-400">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="gap-2">
              <Users className="w-4 h-4" />
              Afiliados Ativos
            </TabsTrigger>
          </TabsList>

          {/* Candidaturas Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Candidaturas de Afiliados</CardTitle>
                    <CardDescription>Revise e aprove novas candidaturas</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                      className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="all">Todos</option>
                      <option value="pending">Pendentes</option>
                      <option value="approved">Aprovados</option>
                      <option value="rejected">Rejeitados</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidato</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Audiência</TableHead>
                      <TableHead>Nicho</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.fullName}</div>
                            <div className="text-xs text-muted-foreground">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {app.website && (
                              <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                <Globe className="w-4 h-4" />
                              </a>
                            )}
                            {app.instagram && (
                              <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                                <Instagram className="w-4 h-4" />
                              </span>
                            )}
                            {app.youtube && (
                              <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                                <Youtube className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getAudienceSizeLabel(app.audienceSize)}</TableCell>
                        <TableCell>{getNicheLabel(app.niche)}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.createdAt.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsReviewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-400 hover:text-emerald-300"
                                  onClick={() => handleApprove(app)}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleReject(app)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Afiliados Ativos Tab */}
          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle>Afiliados Ativos</CardTitle>
                <CardDescription>Gerencie afiliados aprovados e suas métricas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Afiliado</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Cliques</TableHead>
                      <TableHead>Conversões</TableHead>
                      <TableHead>Ganhos Totais</TableHead>
                      <TableHead>Saldo Pendente</TableHead>
                      <TableHead>Verificação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates.map((affiliate) => (
                      <TableRow key={affiliate.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{affiliate.fullName}</div>
                            <div className="text-xs text-muted-foreground">{affiliate.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-xs">{affiliate.code}</code>
                        </TableCell>
                        <TableCell>{getTierBadge(affiliate.tier)}</TableCell>
                        <TableCell>{affiliate.totalClicks.toLocaleString()}</TableCell>
                        <TableCell>{affiliate.totalConversions}</TableCell>
                        <TableCell className="text-emerald-400 font-medium">
                          R$ {affiliate.totalEarnings.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-yellow-400">
                          R$ {affiliate.pendingBalance.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {affiliate.verificationStatus === "approved" ? (
                            <Badge className="bg-emerald-500/20 text-emerald-400">Verificado</Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400">Pendente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <DialogTitle>Candidatura de {selectedApplication.fullName}</DialogTitle>
                  <DialogDescription>
                    Revise os detalhes da candidatura e tome uma decisão
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Status atual */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(selectedApplication.status)}
                  </div>

                  {/* Informações de contato */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedApplication.email}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Telefone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedApplication.phone || "Não informado"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Redes sociais */}
                  <div>
                    <Label className="text-muted-foreground">Presença Online</Label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {selectedApplication.website && (
                        <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-cyan-400 hover:underline">
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {selectedApplication.instagram && (
                        <span className="flex items-center gap-1 text-sm">
                          <Instagram className="w-4 h-4" />
                          {selectedApplication.instagram}
                        </span>
                      )}
                      {selectedApplication.youtube && (
                        <span className="flex items-center gap-1 text-sm">
                          <Youtube className="w-4 h-4" />
                          {selectedApplication.youtube}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Audiência e Nicho */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Tamanho da Audiência</Label>
                      <div className="mt-1 font-medium">{getAudienceSizeLabel(selectedApplication.audienceSize)}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Nicho</Label>
                      <div className="mt-1 font-medium">{getNicheLabel(selectedApplication.niche)}</div>
                    </div>
                  </div>

                  {/* Experiência */}
                  <div>
                    <Label className="text-muted-foreground">Experiência com Afiliados</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">
                      {selectedApplication.experience || "Não informado"}
                    </div>
                  </div>

                  {/* Plano de divulgação */}
                  <div>
                    <Label className="text-muted-foreground">Plano de Divulgação</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">
                      {selectedApplication.promotionPlan}
                    </div>
                  </div>

                  {/* Notas de revisão anteriores */}
                  {selectedApplication.reviewNotes && (
                    <div>
                      <Label className="text-muted-foreground">Notas da Revisão</Label>
                      <div className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">
                        {selectedApplication.reviewNotes}
                      </div>
                    </div>
                  )}

                  {/* Motivo da rejeição */}
                  {selectedApplication.rejectionReason && (
                    <div>
                      <Label className="text-muted-foreground text-red-400">Motivo da Rejeição</Label>
                      <div className="mt-1 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                        {selectedApplication.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* Campos de revisão (apenas para pendentes) */}
                  {selectedApplication.status === "pending" && (
                    <>
                      <div>
                        <Label htmlFor="reviewNotes">Notas Internas (opcional)</Label>
                        <Textarea
                          id="reviewNotes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Adicione notas sobre esta candidatura..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="rejectionReason">Motivo da Rejeição (se aplicável)</Label>
                        <Textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Explique o motivo da rejeição (será enviado ao candidato)..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  {selectedApplication.status === "pending" ? (
                    <>
                      <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={confirmRejection}
                        disabled={!rejectionReason}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={confirmApproval}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsReviewDialogOpen(false)}>
                      Fechar
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

import { useRoute, Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Download,
  Calendar,
  Eye,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Share2,
  Clock,
  BarChart3,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function RelatorioDetalhes() {
  const [, params] = useRoute("/relatorios/:slug");
  const slug = params?.slug || "";

  const { data: report, isLoading } = trpc.marketReports.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const trackDownload = trpc.marketReports.trackDownload.useMutation();

  const handleDownload = () => {
    if (report?.pdfUrl) {
      trackDownload.mutate({ reportId: report.id });
      window.open(report.pdfUrl, "_blank");
      toast.success("Download iniciado");
    } else {
      toast.error("PDF não disponível");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: report?.title || "Relatório F-Insight",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weekly":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "monthly":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "special":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="border-b border-border bg-gradient-to-r from-zinc-900 to-zinc-900/50">
            <div className="container py-8">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="container py-8">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!report) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Relatório não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O relatório que você está procurando não existe ou foi removido.
              </p>
              <Link href="/relatorios-mercado">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Relatórios
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Bloomberg-style Header */}
        <div className="border-b border-border bg-gradient-to-r from-zinc-900 to-zinc-900/50">
          <div className="container py-8">
            <Link href="/relatorios-mercado">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>

            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`${getTypeColor(report.reportType)} border`}>
                    {report.typeLabel}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(report.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {report.viewCount} visualizações
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {report.downloadCount} downloads
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{report.title}</h1>
                <p className="text-lg text-muted-foreground">{report.summary}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleDownload} size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Download PDF
                </Button>
                <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                  <Share2 className="h-5 w-5" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Market Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">IBOVESPA</div>
                  <div className="text-xl font-bold">
                    {report.ibovValue?.toLocaleString("pt-BR")}
                  </div>
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      (report.ibovChange || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {(report.ibovChange || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {(report.ibovChange || 0) >= 0 ? "+" : ""}
                    {report.ibovChange?.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">S&P 500</div>
                  <div className="text-xl font-bold">
                    {report.sp500Value?.toLocaleString("pt-BR")}
                  </div>
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      (report.sp500Change || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {(report.sp500Change || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {(report.sp500Change || 0) >= 0 ? "+" : ""}
                    {report.sp500Change?.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Dólar</div>
                  <div className="text-xl font-bold">
                    R$ {report.dolarValue?.toFixed(2)}
                  </div>
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      (report.dolarChange || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {(report.dolarChange || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {(report.dolarChange || 0) >= 0 ? "+" : ""}
                    {report.dolarChange?.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Bitcoin</div>
                  <div className="text-xl font-bold">
                    ${report.btcValue?.toLocaleString("pt-BR")}
                  </div>
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      (report.btcChange || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {(report.btcChange || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {(report.btcChange || 0) >= 0 ? "+" : ""}
                    {report.btcChange?.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{report.content || ""}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Top Movers */}
              {report.topMovers && report.topMovers.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Principais Movimentações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Top Gainers */}
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                          Maiores Altas
                        </h4>
                        <div className="space-y-2">
                          {report.topMovers
                            .filter((m: any) => m.moverType === "gainer")
                            .slice(0, 5)
                            .map((mover: any) => (
                              <div
                                key={mover.ticker}
                                className="flex justify-between items-center p-2 rounded bg-emerald-500/10"
                              >
                                <div>
                                  <div className="font-semibold">{mover.ticker}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {mover.name}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-emerald-400">
                                    +{mover.changePercent?.toFixed(2)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    R$ {mover.price?.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Top Losers */}
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-3">
                          Maiores Baixas
                        </h4>
                        <div className="space-y-2">
                          {report.topMovers
                            .filter((m: any) => m.moverType === "loser")
                            .slice(0, 5)
                            .map((mover: any) => (
                              <div
                                key={mover.ticker}
                                className="flex justify-between items-center p-2 rounded bg-red-500/10"
                              >
                                <div>
                                  <div className="font-semibold">{mover.ticker}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {mover.name}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-red-400">
                                    {mover.changePercent?.toFixed(2)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    R$ {mover.price?.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sector Performance */}
              {report.sectorPerformance && report.sectorPerformance.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Setorial
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.sectorPerformance.map((sector: any) => (
                        <div key={sector.sectorName} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{sector.sectorName}</span>
                            <span
                              className={`font-semibold ${
                                sector.changePercent >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {sector.changePercent >= 0 ? "+" : ""}
                              {sector.changePercent?.toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                sector.changePercent >= 0
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  Math.abs(sector.changePercent) * 10,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download CTA */}
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Baixe o Relatório Completo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Acesse a versão em PDF com gráficos e análises detalhadas.
                  </p>
                  <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              {/* Report Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informações do Relatório</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo</span>
                    <Badge className={`${getTypeColor(report.reportType)} border`}>
                      {report.typeLabel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publicado em</span>
                    <span>{formatDate(report.publishedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Período</span>
                    <span>
                      {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visualizações</span>
                    <span>{report.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads</span>
                    <span>{report.downloadCount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {report.tags && report.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {report.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground">
                    <strong>Aviso Legal:</strong> Este relatório é fornecido apenas para fins
                    informativos e educacionais. Não constitui recomendação de investimento.
                    Consulte um profissional qualificado antes de tomar decisões de
                    investimento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

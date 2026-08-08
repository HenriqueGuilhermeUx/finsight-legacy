import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
// Toast simples usando estado local
import {
  FileText,
  Download,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  Settings,
  Eye,
  Share2,
} from "lucide-react";

// Report types
const reportTypes = [
  {
    id: "fundamental",
    name: "Análise Fundamentalista",
    description: "Relatório completo com DCF, múltiplos e demonstrações financeiras",
    icon: Building2,
    sections: ["Resumo Executivo", "Valuation DCF", "Análise de Múltiplos", "Demonstrações Financeiras", "Projeções"],
  },
  {
    id: "technical",
    name: "Análise Técnica",
    description: "Gráficos, indicadores técnicos e níveis de suporte/resistência",
    icon: TrendingUp,
    sections: ["Resumo Técnico", "Gráfico de Preços", "Indicadores", "Fibonacci", "Padrões de Candlestick"],
  },
  {
    id: "portfolio",
    name: "Relatório de Carteira",
    description: "Performance, alocação e análise de risco do portfólio",
    icon: PieChart,
    sections: ["Resumo da Carteira", "Alocação por Setor", "Performance", "Análise de Risco", "Recomendações"],
  },
  {
    id: "market",
    name: "Panorama de Mercado",
    description: "Visão geral do mercado, setores e tendências",
    icon: FileSpreadsheet,
    sections: ["Resumo de Mercado", "Análise Setorial", "Heatmap", "Calendário Econômico", "Perspectivas"],
  },
];

// Mock generated reports
const generatedReports = [
  { id: 1, name: "Análise PETR4 - Q4 2024", type: "fundamental", date: "2024-12-20", status: "ready" },
  { id: 2, name: "Carteira Dividendos - Dez/24", type: "portfolio", date: "2024-12-19", status: "ready" },
  { id: 3, name: "Panorama Semanal - Semana 51", type: "market", date: "2024-12-18", status: "ready" },
  { id: 4, name: "Análise Técnica VALE3", type: "technical", date: "2024-12-17", status: "ready" },
];

// Available stocks for reports
const availableStocks = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "WEGE3", "ABEV3", "RENT3", "SUZB3",
  "ELET3", "BBAS3", "JBSS3", "RDOR3", "TOTS3", "CYRE3", "MGLU3", "LREN3",
];

export default function Relatorios() {
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string } | null>(null);
  
  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    setToastMessage({ title, description });
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [selectedTab, setSelectedTab] = useState("create");
  const [selectedReportType, setSelectedReportType] = useState("fundamental");
  const [selectedStock, setSelectedStock] = useState("PETR4");
  const [reportTitle, setReportTitle] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const currentReportType = reportTypes.find(r => r.id === selectedReportType);
  
  // Initialize sections when report type changes
  const handleReportTypeChange = (type: string) => {
    setSelectedReportType(type);
    const report = reportTypes.find(r => r.id === type);
    if (report) {
      setSelectedSections(report.sections);
    }
  };
  
  // Toggle section selection
  const toggleSection = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  // Generate report
  const handleGenerateReport = async () => {
    if (!reportTitle) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o relatório.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedSections.length === 0) {
      toast({
        title: "Seções obrigatórias",
        description: "Selecione pelo menos uma seção para o relatório.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    
    toast({
      title: "Relatório gerado com sucesso!",
      description: `O relatório "${reportTitle}" está pronto para download.`,
    });
    
    setSelectedTab("history");
  };
  
  // Download report (mock)
  const handleDownload = (format: "pdf" | "xlsx") => {
    toast({
      title: `Download iniciado`,
      description: `O relatório será baixado em formato ${format.toUpperCase()}.`,
    });
  };

  return (
    <MainLayout>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-card border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-top-2">
          <h4 className="font-medium">{toastMessage.title}</h4>
          <p className="text-sm text-muted-foreground">{toastMessage.description}</p>
        </div>
      )}
      
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Relatórios Profissionais
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere relatórios personalizados em PDF com análises detalhadas
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Criar Relatório
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Create Report */}
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Type Selection */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tipo de Relatório</CardTitle>
                    <CardDescription>
                      Selecione o tipo de análise que deseja gerar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <Card
                            key={type.id}
                            className={`cursor-pointer transition-all hover:border-primary ${
                              selectedReportType === type.id ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => handleReportTypeChange(type.id)}
                          >
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{type.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {type.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Report Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configuração do Relatório</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título do Relatório</Label>
                        <Input
                          id="title"
                          placeholder="Ex: Análise PETR4 - Q4 2024"
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ativo Principal</Label>
                        <Select value={selectedStock} onValueChange={setSelectedStock}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStocks.map(stock => (
                              <SelectItem key={stock} value={stock}>{stock}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Seções do Relatório</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {currentReportType?.sections.map(section => (
                          <div key={section} className="flex items-center space-x-2">
                            <Checkbox
                              id={section}
                              checked={selectedSections.includes(section)}
                              onCheckedChange={() => toggleSection(section)}
                            />
                            <label htmlFor={section} className="text-sm cursor-pointer">
                              {section}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas Adicionais</Label>
                      <Textarea
                        id="notes"
                        placeholder="Adicione observações ou comentários personalizados..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview and Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[3/4] bg-muted rounded-lg flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="font-medium">{reportTitle || "Título do Relatório"}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {currentReportType?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStock}
                      </p>
                      <div className="mt-4 text-xs text-muted-foreground">
                        {selectedSections.length} seções selecionadas
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gerar Relatório</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Gerando...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Gerar Relatório PDF
                        </>
                      )}
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleDownload("xlsx")}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Gerados</CardTitle>
                <CardDescription>
                  Histórico de relatórios criados recentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedReports.map(report => {
                    const reportType = reportTypes.find(r => r.id === report.type);
                    const Icon = reportType?.icon || FileText;
                    
                    return (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{report.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(report.date).toLocaleDateString("pt-BR")}
                              <span>•</span>
                              <span>{reportType?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pronto
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload("pdf")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload("pdf")}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Relatório Semanal", description: "Panorama completo do mercado com análise setorial", uses: 45 },
                { name: "Due Diligence", description: "Análise completa para tomada de decisão de investimento", uses: 32 },
                { name: "Comparativo Setorial", description: "Comparação entre empresas do mesmo setor", uses: 28 },
                { name: "Análise de Dividendos", description: "Foco em empresas pagadoras de dividendos", uses: 56 },
                { name: "Growth Stocks", description: "Análise de empresas de crescimento", uses: 23 },
                { name: "Value Investing", description: "Empresas subvalorizadas pelo mercado", uses: 41 },
              ].map((template, i) => (
                <Card key={i} className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      <Badge variant="secondary">{template.uses} usos</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

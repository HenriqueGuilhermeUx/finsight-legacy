import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download,
  FileDown,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Loader2,
  Search,
  Plus,
  X,
  FileSpreadsheet,
  File
} from 'lucide-react';


interface ReportSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
}

export default function ExportarRelatorio() {

  const [ticker, setTicker] = useState('');
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['PETR4', 'VALE3', 'ITUB4']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');

  const [sections, setSections] = useState<ReportSection[]>([
    { id: 'resumo', name: 'Resumo Executivo', description: 'Visão geral do ativo com principais indicadores', icon: <FileText className="h-4 w-4" />, selected: true },
    { id: 'cotacao', name: 'Cotação e Histórico', description: 'Preço atual, variação e gráfico histórico', icon: <TrendingUp className="h-4 w-4" />, selected: true },
    { id: 'fundamentalista', name: 'Análise Fundamentalista', description: 'P/L, P/VP, ROE, ROIC e outros indicadores', icon: <BarChart3 className="h-4 w-4" />, selected: true },
    { id: 'dividendos', name: 'Dividendos', description: 'Histórico de proventos e Dividend Yield', icon: <DollarSign className="h-4 w-4" />, selected: true },
    { id: 'tecnica', name: 'Análise Técnica', description: 'Médias móveis, RSI, MACD e sinais', icon: <TrendingUp className="h-4 w-4" />, selected: false },
    { id: 'valuation', name: 'Valuation', description: 'Preço justo por Graham, Bazin e DCF', icon: <PieChart className="h-4 w-4" />, selected: false },
  ]);

  const addTicker = () => {
    if (!ticker) return;
    const t = ticker.toUpperCase();
    if (selectedTickers.includes(t)) {
      alert('Ativo já adicionado');
      return;
    }
    if (selectedTickers.length >= 10) {
      alert('Máximo de 10 ativos por relatório');
      return;
    }
    setSelectedTickers([...selectedTickers, t]);
    setTicker('');
  };

  const removeTicker = (t: string) => {
    setSelectedTickers(selectedTickers.filter(x => x !== t));
  };

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const generateReport = async () => {
    if (selectedTickers.length === 0) {
      alert('Adicione pelo menos um ativo');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simular geração do relatório
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(i);
    }

    setIsGenerating(false);
    alert(`Relatório gerado com sucesso! ${selectedTickers.length} ativo(s) analisado(s)`);
  };

  const selectedSectionsCount = sections.filter(s => s.selected).length;

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileDown className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Exportar Relatório</h1>
        </div>
        <p className="text-muted-foreground">
          Gere relatórios completos de análise para download em PDF ou Excel
        </p>
      </div>

      <div className="grid gap-6">
        {/* Selecionar Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>1. Selecione os Ativos</CardTitle>
            <CardDescription>
              Adicione até 10 ativos para incluir no relatório
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o ticker (ex: PETR4)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                  className="pl-9"
                />
              </div>
              <Button onClick={addTicker}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTickers.map((t) => (
                <Badge key={t} variant="secondary" className="text-sm py-1 px-3">
                  {t}
                  <button onClick={() => removeTicker(t)} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedTickers.length === 0 && (
                <span className="text-sm text-muted-foreground">Nenhum ativo selecionado</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Seções do Relatório */}
        <Card>
          <CardHeader>
            <CardTitle>2. Escolha as Seções</CardTitle>
            <CardDescription>
              Selecione o que deseja incluir no relatório ({selectedSectionsCount} selecionadas)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    section.selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={section.selected} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {section.icon}
                        <span className="font-medium">{section.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formato */}
        <Card>
          <CardHeader>
            <CardTitle>3. Formato do Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={reportFormat === 'pdf' ? 'default' : 'outline'}
                className="flex-1 h-auto py-4"
                onClick={() => setReportFormat('pdf')}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8" />
                  <span>PDF</span>
                  <span className="text-xs opacity-70">Relatório formatado</span>
                </div>
              </Button>
              <Button
                variant={reportFormat === 'excel' ? 'default' : 'outline'}
                className="flex-1 h-auto py-4"
                onClick={() => setReportFormat('excel')}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8" />
                  <span>Excel</span>
                  <span className="text-xs opacity-70">Dados em planilha</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gerar */}
        <Card>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Gerando relatório...</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Processando {selectedTickers.length} ativo(s) com {selectedSectionsCount} seção(ões)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Resumo</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTickers.length} ativo(s) • {selectedSectionsCount} seção(ões) • {reportFormat.toUpperCase()}
                  </p>
                </div>
                <Button onClick={generateReport} size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Relatórios Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Análise PETR4, VALE3, ITUB4', date: 'Hoje, 14:30', format: 'PDF', size: '2.4 MB' },
                { name: 'Carteira de Dividendos', date: 'Ontem, 09:15', format: 'Excel', size: '1.8 MB' },
                { name: 'FIIs Logística', date: '18/12/2024', format: 'PDF', size: '1.2 MB' },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {report.format === 'PDF' ? (
                      <FileText className="h-8 w-8 text-red-500" />
                    ) : (
                      <FileSpreadsheet className="h-8 w-8 text-green-500" />
                    )}
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.date} • {report.size}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

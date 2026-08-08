import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link2, 
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  Shield,
  Zap,
  RefreshCw,
  Download,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  FileText,
  Loader2
} from 'lucide-react';

interface Corretora {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
  accounts?: number;
}

const CORRETORAS: Corretora[] = [
  { id: 'xp', name: 'XP Investimentos', logo: '🏦', status: 'disconnected' },
  { id: 'clear', name: 'Clear Corretora', logo: '💹', status: 'disconnected' },
  { id: 'rico', name: 'Rico', logo: '📈', status: 'disconnected' },
  { id: 'nuinvest', name: 'NuInvest', logo: '💜', status: 'disconnected' },
  { id: 'btg', name: 'BTG Pactual', logo: '🏛️', status: 'disconnected' },
  { id: 'inter', name: 'Inter Invest', logo: '🟠', status: 'disconnected' },
  { id: 'modal', name: 'Modal Mais', logo: '📊', status: 'disconnected' },
  { id: 'genial', name: 'Genial Investimentos', logo: '🔵', status: 'disconnected' },
];

export default function Corretoras() {
  const [corretoras, setCorretoras] = useState(CORRETORAS);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleConnect = (id: string) => {
    setCorretoras(corretoras.map(c => 
      c.id === id ? { ...c, status: 'pending' as const } : c
    ));
    
    // Simular conexão
    setTimeout(() => {
      setCorretoras(corretoras.map(c => 
        c.id === id ? { 
          ...c, 
          status: 'connected' as const, 
          lastSync: 'Agora',
          accounts: Math.floor(Math.random() * 3) + 1
        } : c
      ));
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    setCorretoras(corretoras.map(c => 
      c.id === id ? { ...c, status: 'disconnected' as const, lastSync: undefined, accounts: undefined } : c
    ));
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setImportProgress(i);
    }
    
    setIsImporting(false);
    setSelectedFile(null);
    alert('Carteira importada com sucesso! 15 ativos encontrados.');
  };

  const connectedCount = corretoras.filter(c => c.status === 'connected').length;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Integração com Corretoras</h1>
        </div>
        <p className="text-muted-foreground">
          Conecte suas corretoras ou importe sua carteira para acompanhar seus investimentos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{connectedCount}</div>
                <div className="text-sm text-muted-foreground">Conectadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Seguro</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">Auto</div>
                <div className="text-sm text-muted-foreground">Sincronização</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-muted-foreground">Atualização</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="corretoras" className="space-y-6">
        <TabsList>
          <TabsTrigger value="corretoras">Corretoras</TabsTrigger>
          <TabsTrigger value="importar">Importar Arquivo</TabsTrigger>
          <TabsTrigger value="manual">Entrada Manual</TabsTrigger>
        </TabsList>

        {/* Corretoras Tab */}
        <TabsContent value="corretoras">
          <div className="grid md:grid-cols-2 gap-4">
            {corretoras.map((corretora) => (
              <Card key={corretora.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{corretora.logo}</div>
                      <div>
                        <div className="font-bold">{corretora.name}</div>
                        {corretora.status === 'connected' && (
                          <div className="text-sm text-muted-foreground">
                            {corretora.accounts} conta(s) • Sync: {corretora.lastSync}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {corretora.status === 'connected' && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectada
                        </Badge>
                      )}
                      {corretora.status === 'pending' && (
                        <Badge className="bg-yellow-500">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Conectando
                        </Badge>
                      )}
                      {corretora.status === 'disconnected' && (
                        <Badge variant="outline">Desconectada</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {corretora.status === 'connected' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sincronizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(corretora.id)}
                        >
                          Desconectar
                        </Button>
                      </>
                    ) : corretora.status === 'pending' ? (
                      <Button disabled className="flex-1">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Conectando...
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => handleConnect(corretora.id)}
                      >
                        Conectar
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">Como funciona a integração?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ao conectar sua corretora, você autoriza o F-Insight a acessar apenas os dados de sua carteira (posições e operações). 
                    Não temos acesso a senhas ou permissão para realizar operações. A conexão usa OAuth 2.0, o mesmo padrão de segurança 
                    usado por bancos e grandes empresas de tecnologia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Importar Tab */}
        <TabsContent value="importar">
          <Card>
            <CardHeader>
              <CardTitle>Importar Carteira via Arquivo</CardTitle>
              <CardDescription>
                Faça upload de um arquivo Excel ou CSV com suas posições
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="mb-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-primary hover:underline">Clique para selecionar</span>
                    <span className="text-muted-foreground"> ou arraste um arquivo</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Formatos aceitos: Excel (.xlsx, .xls) ou CSV
                </p>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-muted rounded-lg inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                )}
              </div>

              {isImporting ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Importando carteira...</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  disabled={!selectedFile}
                  onClick={handleFileUpload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Carteira
                </Button>
              )}

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Formato esperado do arquivo:</h4>
                <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                  <table className="text-sm w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Ticker</th>
                        <th className="text-left p-2">Quantidade</th>
                        <th className="text-left p-2">Preço Médio</th>
                        <th className="text-left p-2">Data Compra</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">PETR4</td>
                        <td className="p-2">100</td>
                        <td className="p-2">28.50</td>
                        <td className="p-2">15/03/2024</td>
                      </tr>
                      <tr>
                        <td className="p-2">VALE3</td>
                        <td className="p-2">50</td>
                        <td className="p-2">68.20</td>
                        <td className="p-2">20/04/2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" className="mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Modelo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Tab */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Posição Manualmente</CardTitle>
              <CardDescription>
                Cadastre suas posições uma a uma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ticker</Label>
                  <Input placeholder="Ex: PETR4" />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input type="number" placeholder="Ex: 100" />
                </div>
                <div className="space-y-2">
                  <Label>Preço Médio (R$)</Label>
                  <Input type="number" step="0.01" placeholder="Ex: 28.50" />
                </div>
                <div className="space-y-2">
                  <Label>Data da Compra</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="mt-6">
                Adicionar Posição
              </Button>
            </CardContent>
          </Card>

          {/* Posições Manuais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Posições Cadastradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma posição cadastrada manualmente ainda.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

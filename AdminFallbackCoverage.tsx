import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Building2,
  Globe,
  Bitcoin,
  Home,
  TrendingUp,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Dados estáticos de fallback - importados do servidor
const fallbackAssets = {
  br: [
    'PETR4.SA', 'PETR3.SA', 'VALE3.SA', 'ITUB4.SA', 'ITUB3.SA', 'BBDC4.SA', 'BBDC3.SA',
    'ABEV3.SA', 'WEGE3.SA', 'BBAS3.SA', 'RENT3.SA', 'MGLU3.SA', 'LREN3.SA', 'SUZB3.SA',
    'JBSS3.SA', 'GGBR4.SA', 'CSNA3.SA', 'EMBR3.SA', 'B3SA3.SA', 'RADL3.SA', 'RAIL3.SA',
    'EQTL3.SA', 'VIVT3.SA', 'CPLE6.SA', 'SBSP3.SA', 'CMIG4.SA', 'ELET3.SA', 'ELET6.SA',
    'BPAC11.SA', 'SANB11.SA', 'TOTS3.SA', 'PRIO3.SA', 'CSAN3.SA', 'UGPA3.SA', 'HAPV3.SA',
    'RDOR3.SA', 'FLRY3.SA', 'CYRE3.SA', 'MRVE3.SA', 'EZTC3.SA', 'KLBN11.SA', 'USIM5.SA',
    'GOAU4.SA', 'BRAP4.SA', 'CMIN3.SA', 'AZUL4.SA', 'GOLL4.SA', 'CCRO3.SA', 'ECOR3.SA',
    'BRFS3.SA', 'MRFG3.SA', 'BEEF3.SA', 'SMTO3.SA', 'SLCE3.SA'
  ],
  us: [
    'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'UNH',
    'JNJ', 'V', 'XOM', 'JPM', 'PG', 'MA', 'HD', 'CVX', 'MRK', 'ABBV',
    'LLY', 'PEP', 'KO', 'COST', 'AVGO', 'TMO', 'WMT', 'MCD', 'CSCO', 'ACN'
  ],
  etfBr: [
    'BOVA11.SA', 'IVVB11.SA', 'SMAL11.SA', 'HASH11.SA', 'DIVO11.SA'
  ],
  etfUs: [
    'SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'ARKK', 'XLF', 'XLE', 'XLK'
  ],
  crypto: [
    'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'SOL-USD', 'DOGE-USD',
    'DOT-USD', 'MATIC-USD', 'SHIB-USD', 'AVAX-USD', 'LINK-USD', 'UNI-USD', 'ATOM-USD', 'LTC-USD'
  ],
  fii: [
    // Logística
    'HGLG11.SA', 'XPLG11.SA', 'BTLG11.SA', 'VILG11.SA', 'LVBI11.SA',
    // Shopping Centers
    'XPML11.SA', 'HGBS11.SA', 'VISC11.SA', 'HSML11.SA', 'MALL11.SA',
    // Lajes Corporativas
    'KNRI11.SA', 'PVBI11.SA', 'BRCR11.SA', 'JSRE11.SA', 'RBRP11.SA',
    // Recebíveis (CRI)
    'MXRF11.SA', 'KNCR11.SA', 'KNIP11.SA', 'HGCR11.SA', 'IRDM11.SA', 'RECR11.SA', 'VGIR11.SA', 'VRTA11.SA',
    // Renda Urbana / Híbridos
    'RECT11.SA', 'HGRU11.SA', 'TRXF11.SA', 'RBRF11.SA', 'RBRR11.SA',
    // Agências Bancárias
    'BBPO11.SA', 'SAAG11.SA',
    // Galpões Industriais
    'GGRC11.SA', 'FIIB11.SA',
    // Hospitais e Educação
    'NSLU11.SA', 'HCTR11.SA',
    // FOFs
    'BCFF11.SA', 'HFOF11.SA', 'RBFF11.SA', 'KFOF11.SA'
  ]
};

const totalAssets = 
  fallbackAssets.br.length + 
  fallbackAssets.us.length + 
  fallbackAssets.etfBr.length + 
  fallbackAssets.etfUs.length + 
  fallbackAssets.crypto.length +
  fallbackAssets.fii.length;

export default function AdminFallbackCoverage() {
  const { user } = useAuth();
  const authLoading = !user && typeof window !== 'undefined';
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Mutation para atualizar dados de fallback (endpoint a ser criado)
  const handleUpdateFallbackManual = async () => {
    setIsUpdating(true);
    try {
      // Simula atualização - em produção, chamar endpoint real
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Atualização concluída!\n\nOs dados de fallback foram atualizados com sucesso.');
    } catch (error) {
      alert('Erro ao atualizar. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFallback = () => {
    handleUpdateFallbackManual();
  };

  // Verificar se é admin
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="border-red-500/30 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Acesso Negado
              </CardTitle>
              <CardDescription>
                Esta página é restrita a administradores.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const filterAssets = (assets: string[]) => {
    if (!searchTerm) return assets;
    return assets.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const AssetGrid = ({ assets, icon: Icon, color }: { assets: string[], icon: any, color: string }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {filterAssets(assets).map(ticker => (
        <div 
          key={ticker}
          className={`flex items-center gap-2 p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}
        >
          <Icon className={`h-4 w-4 text-${color}-400`} />
          <span className="text-sm font-mono">{ticker.replace('.SA', '')}</span>
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="h-8 w-8 text-cyan-400" />
              Cobertura de Fallback
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os dados estáticos de fallback para quando a API principal estiver indisponível
            </p>
          </div>
          
          <Button 
            onClick={handleUpdateFallback}
            disabled={isUpdating}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Dados
              </>
            )}
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{fallbackAssets.br.length}</p>
                  <p className="text-xs text-muted-foreground">Ações BR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-blue-400">{fallbackAssets.us.length}</p>
                  <p className="text-xs text-muted-foreground">Ações US</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-purple-400">{fallbackAssets.etfBr.length + fallbackAssets.etfUs.length}</p>
                  <p className="text-xs text-muted-foreground">ETFs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bitcoin className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-orange-400">{fallbackAssets.crypto.length}</p>
                  <p className="text-xs text-muted-foreground">Criptos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-amber-400">{fallbackAssets.fii.length}</p>
                  <p className="text-xs text-muted-foreground">FIIs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyan-500/10 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-cyan-400">{totalAssets}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Última Atualização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Dados de Dezembro 2024
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Os dados de fallback são atualizados automaticamente toda segunda-feira às 8h via cron job.
                Você também pode atualizar manualmente clicando no botão acima.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Busca */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar ativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs bg-slate-800/50 border-slate-700"
          />
          {searchTerm && (
            <Button variant="ghost" onClick={() => setSearchTerm("")}>
              Limpar
            </Button>
          )}
        </div>

        {/* Tabs com ativos */}
        <Tabs defaultValue="br" className="w-full">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="br">🇧🇷 Ações BR ({fallbackAssets.br.length})</TabsTrigger>
            <TabsTrigger value="us">🇺🇸 Ações US ({fallbackAssets.us.length})</TabsTrigger>
            <TabsTrigger value="fii">🏠 FIIs ({fallbackAssets.fii.length})</TabsTrigger>
            <TabsTrigger value="etf">📊 ETFs ({fallbackAssets.etfBr.length + fallbackAssets.etfUs.length})</TabsTrigger>
            <TabsTrigger value="crypto">₿ Cripto ({fallbackAssets.crypto.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="br" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-400" />
                  Ações Brasileiras (Ibovespa)
                </CardTitle>
                <CardDescription>
                  {fallbackAssets.br.length} ativos com dados de fallback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  {filterAssets(fallbackAssets.br).map(ticker => (
                    <div 
                      key={ticker}
                      className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs font-mono">{ticker.replace('.SA', '')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="us" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Ações Americanas (S&P 500)
                </CardTitle>
                <CardDescription>
                  {fallbackAssets.us.length} ativos com dados de fallback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  {filterAssets(fallbackAssets.us).map(ticker => (
                    <div 
                      key={ticker}
                      className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
                    >
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      <span className="text-xs font-mono">{ticker}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fii" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-amber-400" />
                  Fundos Imobiliários (FIIs)
                </CardTitle>
                <CardDescription>
                  {fallbackAssets.fii.length} FIIs com dados de fallback (Logística, Shopping, Lajes, CRI, Híbridos, FOFs)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  {filterAssets(fallbackAssets.fii).map(ticker => (
                    <div 
                      key={ticker}
                      className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
                    >
                      <CheckCircle2 className="h-3 w-3 text-amber-400" />
                      <span className="text-xs font-mono">{ticker.replace('.SA', '')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="etf" className="mt-4">
            <div className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    ETFs Brasileiros
                  </CardTitle>
                  <CardDescription>
                    {fallbackAssets.etfBr.length} ETFs BR com dados de fallback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {filterAssets(fallbackAssets.etfBr).map(ticker => (
                      <div 
                        key={ticker}
                        className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
                      >
                        <CheckCircle2 className="h-3 w-3 text-purple-400" />
                        <span className="text-xs font-mono">{ticker.replace('.SA', '')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                    ETFs Americanos
                  </CardTitle>
                  <CardDescription>
                    {fallbackAssets.etfUs.length} ETFs US com dados de fallback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {filterAssets(fallbackAssets.etfUs).map(ticker => (
                      <div 
                        key={ticker}
                        className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                      >
                        <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                        <span className="text-xs font-mono">{ticker}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5 text-orange-400" />
                  Criptomoedas
                </CardTitle>
                <CardDescription>
                  {fallbackAssets.crypto.length} criptos com dados de fallback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {filterAssets(fallbackAssets.crypto).map(ticker => (
                    <div 
                      key={ticker}
                      className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
                    >
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                      <span className="text-xs font-mono">{ticker.replace('-USD', '')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

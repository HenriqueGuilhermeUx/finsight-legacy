import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Copy,
  Users,
  TrendingUp,
  TrendingDown,
  Settings,
  History,
  DollarSign,
  Percent,
  Play,
  Pause,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Shield,
} from "lucide-react";

// Mock data for followed portfolios
const mockFollowing = [
  {
    id: 1,
    portfolioId: 1,
    portfolioName: "Alpha Growth",
    traderName: "Carlos Silva",
    copyTrading: true,
    maxCopyAmount: 5000,
    copyPercentage: 50,
    totalCopied: 12500,
    totalProfit: 3250,
    returnPercent: 26,
    lastTrade: "2024-12-20T10:30:00",
    status: "active",
  },
  {
    id: 2,
    portfolioId: 2,
    portfolioName: "Dividend Master",
    traderName: "Ana Rodrigues",
    copyTrading: true,
    maxCopyAmount: 3000,
    copyPercentage: 100,
    totalCopied: 8400,
    totalProfit: 1680,
    returnPercent: 20,
    lastTrade: "2024-12-19T15:45:00",
    status: "active",
  },
  {
    id: 3,
    portfolioId: 5,
    portfolioName: "Crypto Hunter",
    traderName: "Lucas Ferreira",
    copyTrading: false,
    maxCopyAmount: 0,
    copyPercentage: 0,
    totalCopied: 0,
    totalProfit: 0,
    returnPercent: 0,
    lastTrade: null,
    status: "following",
  },
];

// Mock copy trade history
const mockCopyHistory = [
  {
    id: 1,
    sourcePortfolio: "Alpha Growth",
    ticker: "PETR4",
    type: "buy",
    originalQuantity: 100,
    copiedQuantity: 50,
    price: 36.80,
    totalValue: 1840,
    status: "executed",
    createdAt: "2024-12-20T10:30:00",
  },
  {
    id: 2,
    sourcePortfolio: "Alpha Growth",
    ticker: "VALE3",
    type: "sell",
    originalQuantity: 50,
    copiedQuantity: 25,
    price: 72.40,
    totalValue: 1810,
    status: "executed",
    createdAt: "2024-12-19T14:20:00",
  },
  {
    id: 3,
    sourcePortfolio: "Dividend Master",
    ticker: "ITUB4",
    type: "buy",
    originalQuantity: 200,
    copiedQuantity: 200,
    price: 32.45,
    totalValue: 6490,
    status: "executed",
    createdAt: "2024-12-19T11:15:00",
  },
  {
    id: 4,
    sourcePortfolio: "Alpha Growth",
    ticker: "WEGE3",
    type: "buy",
    originalQuantity: 80,
    copiedQuantity: 40,
    price: 42.80,
    totalValue: 1712,
    status: "pending",
    createdAt: "2024-12-20T11:00:00",
  },
];

export default function CopyTrading() {
  const { user } = useAuth();
  const [selectedFollow, setSelectedFollow] = useState<typeof mockFollowing[0] | null>(null);
  const [copySettings, setCopySettings] = useState({
    enabled: false,
    maxAmount: 5000,
    percentage: 100,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Nunca";
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalStats = {
    totalCopied: mockFollowing.reduce((sum, f) => sum + f.totalCopied, 0),
    totalProfit: mockFollowing.reduce((sum, f) => sum + f.totalProfit, 0),
    activeCopies: mockFollowing.filter(f => f.copyTrading).length,
    totalFollowing: mockFollowing.length,
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Copy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Copy Trading</h1>
            </div>
            <p className="text-muted-foreground">
              Copie automaticamente as operações dos melhores traders da plataforma.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Copiado</p>
                  <p className="text-lg font-bold">{formatCurrency(totalStats.totalCopied)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lucro Total</p>
                  <p className="text-lg font-bold text-green-500">{formatCurrency(totalStats.totalProfit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Play className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cópias Ativas</p>
                  <p className="text-lg font-bold">{totalStats.activeCopies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seguindo</p>
                  <p className="text-lg font-bold">{totalStats.totalFollowing} traders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="following" className="space-y-6">
          <TabsList>
            <TabsTrigger value="following">
              <Users className="h-4 w-4 mr-2" />
              Traders Seguidos
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Histórico de Cópias
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Following Tab */}
          <TabsContent value="following">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Following List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Traders que você segue</CardTitle>
                    <CardDescription>
                      Gerencie suas cópias automáticas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockFollowing.map((follow) => (
                        <div
                          key={follow.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                            selectedFollow?.id === follow.id ? "bg-accent border-primary" : "bg-card"
                          }`}
                          onClick={() => setSelectedFollow(follow)}
                        >
                          <Avatar>
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {follow.traderName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{follow.portfolioName}</p>
                              {follow.copyTrading ? (
                                <Badge variant="default" className="bg-green-500">
                                  <Play className="h-3 w-3 mr-1" />
                                  Ativo
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Pause className="h-3 w-3 mr-1" />
                                  Seguindo
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{follow.traderName}</p>
                          </div>

                          {follow.copyTrading && (
                            <div className="text-right">
                              <p className={`font-bold ${follow.totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {formatCurrency(follow.totalProfit)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {follow.copyPercentage}% • Max {formatCurrency(follow.maxCopyAmount)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Panel */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configurar Cópia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFollow ? (
                      <div className="space-y-6">
                        {/* Trader Info */}
                        <div className="flex items-center gap-4 pb-4 border-b">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {selectedFollow.traderName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{selectedFollow.portfolioName}</p>
                            <p className="text-sm text-muted-foreground">{selectedFollow.traderName}</p>
                          </div>
                        </div>

                        {/* Copy Trading Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Copy className="h-4 w-4 text-muted-foreground" />
                            <Label>Copy Trading</Label>
                          </div>
                          <Switch
                            checked={selectedFollow.copyTrading}
                            onCheckedChange={() => {}}
                          />
                        </div>

                        {/* Max Amount */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            Valor Máximo por Operação
                          </Label>
                          <Input
                            type="number"
                            value={selectedFollow.maxCopyAmount}
                            onChange={() => {}}
                            placeholder="5000"
                          />
                          <p className="text-xs text-muted-foreground">
                            Limite máximo que será copiado em cada operação
                          </p>
                        </div>

                        {/* Copy Percentage */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            Porcentagem de Cópia: {selectedFollow.copyPercentage}%
                          </Label>
                          <Slider
                            value={[selectedFollow.copyPercentage]}
                            onValueChange={() => {}}
                            max={100}
                            min={10}
                            step={10}
                          />
                          <p className="text-xs text-muted-foreground">
                            Porcentagem do valor original que será copiado
                          </p>
                        </div>

                        {/* Stats */}
                        {selectedFollow.copyTrading && (
                          <div className="space-y-3 pt-4 border-t">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Copiado</span>
                              <span className="font-medium">{formatCurrency(selectedFollow.totalCopied)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lucro/Prejuízo</span>
                              <span className={`font-medium ${selectedFollow.totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {formatCurrency(selectedFollow.totalProfit)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Retorno</span>
                              <span className={`font-medium ${selectedFollow.returnPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {selectedFollow.returnPercent >= 0 ? "+" : ""}{selectedFollow.returnPercent}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Última Operação</span>
                              <span className="font-medium">{formatDate(selectedFollow.lastTrade)}</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2 pt-4">
                          <Button className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Salvar Configurações
                          </Button>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Parar de Seguir
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Selecione um trader para configurar</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Operações Copiadas</CardTitle>
                <CardDescription>
                  Todas as operações que foram copiadas automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Data</th>
                        <th className="text-left py-3 px-4">Origem</th>
                        <th className="text-left py-3 px-4">Ativo</th>
                        <th className="text-left py-3 px-4">Tipo</th>
                        <th className="text-right py-3 px-4">Qtd Original</th>
                        <th className="text-right py-3 px-4">Qtd Copiada</th>
                        <th className="text-right py-3 px-4">Preço</th>
                        <th className="text-right py-3 px-4">Total</th>
                        <th className="text-center py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCopyHistory.map((trade) => (
                        <tr key={trade.id} className="border-b hover:bg-accent/50">
                          <td className="py-3 px-4 text-sm">{formatDate(trade.createdAt)}</td>
                          <td className="py-3 px-4 font-medium">{trade.sourcePortfolio}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{trade.ticker}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {trade.type === "buy" ? (
                                <>
                                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                                  <span className="text-green-500">Compra</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                                  <span className="text-red-500">Venda</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">{trade.originalQuantity}</td>
                          <td className="py-3 px-4 text-right">{trade.copiedQuantity}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(trade.price)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(trade.totalValue)}</td>
                          <td className="py-3 px-4 text-center">
                            {trade.status === "executed" ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Executado
                              </Badge>
                            ) : trade.status === "pending" ? (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pendente
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Falhou
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configurações Globais
                  </CardTitle>
                  <CardDescription>
                    Configurações que se aplicam a todas as cópias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Copy Trading Global</Label>
                      <p className="text-sm text-muted-foreground">
                        Ativar/desativar todas as cópias
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="space-y-2">
                    <Label>Limite Diário Total</Label>
                    <Input type="number" placeholder="10000" defaultValue="10000" />
                    <p className="text-xs text-muted-foreground">
                      Valor máximo total de cópias por dia
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Limite por Operação</Label>
                    <Input type="number" placeholder="5000" defaultValue="5000" />
                    <p className="text-xs text-muted-foreground">
                      Valor máximo por operação individual
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Copiar Apenas Compras</Label>
                      <p className="text-sm text-muted-foreground">
                        Ignorar operações de venda
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber alertas de novas cópias
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <Button className="w-full">Salvar Configurações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Filtros de Ativos
                  </CardTitle>
                  <CardDescription>
                    Defina quais tipos de ativos serão copiados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Ações Brasileiras</Label>
                      <p className="text-sm text-muted-foreground">
                        PETR4, VALE3, ITUB4, etc.
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Ações Americanas</Label>
                      <p className="text-sm text-muted-foreground">
                        AAPL, MSFT, GOOGL, etc.
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>ETFs</Label>
                      <p className="text-sm text-muted-foreground">
                        BOVA11, IVVB11, etc.
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Criptomoedas</Label>
                      <p className="text-sm text-muted-foreground">
                        BTC, ETH, etc.
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>FIIs</Label>
                      <p className="text-sm text-muted-foreground">
                        HGLG11, XPLG11, etc.
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <Button className="w-full">Salvar Filtros</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

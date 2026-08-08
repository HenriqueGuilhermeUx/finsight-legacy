import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing,
  Calendar,
  DollarSign,
  TrendingUp,
  Building2,
  Search,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  ArrowUpRight,
  Coins
} from 'lucide-react';

interface DividendEvent {
  ticker: string;
  name: string;
  type: 'dividendo' | 'jcp' | 'rendimento';
  value: number;
  dataCom: string;
  dataEx: string;
  dataPagamento: string;
  dy: number;
  status: 'agendado' | 'ex' | 'pago';
}

// Dados de exemplo de dividendos
const DIVIDEND_EVENTS: DividendEvent[] = [
  // Próximos dividendos
  { ticker: 'PETR4', name: 'Petrobras', type: 'dividendo', value: 1.45, dataCom: '2025-01-15', dataEx: '2025-01-16', dataPagamento: '2025-02-15', dy: 18.5, status: 'agendado' },
  { ticker: 'VALE3', name: 'Vale', type: 'dividendo', value: 2.10, dataCom: '2025-01-20', dataEx: '2025-01-21', dataPagamento: '2025-03-10', dy: 8.2, status: 'agendado' },
  { ticker: 'BBAS3', name: 'Banco do Brasil', type: 'jcp', value: 0.85, dataCom: '2025-01-10', dataEx: '2025-01-11', dataPagamento: '2025-02-28', dy: 9.8, status: 'agendado' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco', type: 'jcp', value: 0.42, dataCom: '2025-01-08', dataEx: '2025-01-09', dataPagamento: '2025-02-05', dy: 6.2, status: 'agendado' },
  { ticker: 'TAEE11', name: 'Taesa', type: 'dividendo', value: 0.95, dataCom: '2025-01-25', dataEx: '2025-01-26', dataPagamento: '2025-02-20', dy: 10.5, status: 'agendado' },
  { ticker: 'BBSE3', name: 'BB Seguridade', type: 'dividendo', value: 0.78, dataCom: '2025-01-18', dataEx: '2025-01-19', dataPagamento: '2025-02-25', dy: 9.2, status: 'agendado' },
  { ticker: 'EGIE3', name: 'Engie Brasil', type: 'dividendo', value: 1.20, dataCom: '2025-01-22', dataEx: '2025-01-23', dataPagamento: '2025-03-05', dy: 8.5, status: 'agendado' },
  // FIIs - rendimentos mensais
  { ticker: 'HGLG11', name: 'CSHG Logística', type: 'rendimento', value: 1.10, dataCom: '2025-01-14', dataEx: '2025-01-15', dataPagamento: '2025-01-25', dy: 8.5, status: 'agendado' },
  { ticker: 'XPML11', name: 'XP Malls', type: 'rendimento', value: 0.72, dataCom: '2025-01-14', dataEx: '2025-01-15', dataPagamento: '2025-01-25', dy: 9.2, status: 'agendado' },
  { ticker: 'KNRI11', name: 'Kinea Renda', type: 'rendimento', value: 1.00, dataCom: '2025-01-14', dataEx: '2025-01-15', dataPagamento: '2025-01-25', dy: 8.8, status: 'agendado' },
  { ticker: 'MXRF11', name: 'Maxi Renda', type: 'rendimento', value: 0.11, dataCom: '2025-01-14', dataEx: '2025-01-15', dataPagamento: '2025-01-25', dy: 12.5, status: 'agendado' },
  { ticker: 'VISC11', name: 'Vinci Shopping', type: 'rendimento', value: 0.80, dataCom: '2025-01-14', dataEx: '2025-01-15', dataPagamento: '2025-01-25', dy: 8.9, status: 'agendado' },
  // Passados
  { ticker: 'PETR4', name: 'Petrobras', type: 'dividendo', value: 1.30, dataCom: '2024-12-10', dataEx: '2024-12-11', dataPagamento: '2025-01-10', dy: 18.5, status: 'pago' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco', type: 'jcp', value: 0.38, dataCom: '2024-12-05', dataEx: '2024-12-06', dataPagamento: '2025-01-05', dy: 6.2, status: 'pago' },
];

interface WatchedTicker {
  ticker: string;
  name: string;
  alertDividend: boolean;
  alertDataCom: boolean;
  alertPayment: boolean;
}

export default function AlertasDividendos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'dividendo' | 'jcp' | 'rendimento'>('todos');
  const [watchedTickers, setWatchedTickers] = useState<WatchedTicker[]>([
    { ticker: 'PETR4', name: 'Petrobras', alertDividend: true, alertDataCom: true, alertPayment: true },
    { ticker: 'ITUB4', name: 'Itaú Unibanco', alertDividend: true, alertDataCom: true, alertPayment: false },
    { ticker: 'HGLG11', name: 'CSHG Logística', alertDividend: true, alertDataCom: false, alertPayment: true },
  ]);
  const [newTicker, setNewTicker] = useState('');

  const filteredEvents = useMemo(() => {
    return DIVIDEND_EVENTS.filter(event => {
      const matchesSearch = event.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'todos' || event.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(a.dataCom).getTime() - new Date(b.dataCom).getTime());
  }, [searchTerm, filterType]);

  const upcomingEvents = filteredEvents.filter(e => e.status === 'agendado');
  const pastEvents = filteredEvents.filter(e => e.status === 'pago');

  const addWatchedTicker = () => {
    if (!newTicker) return;
    const ticker = newTicker.toUpperCase();
    if (watchedTickers.find(w => w.ticker === ticker)) {
      alert('Ativo já está na lista');
      return;
    }
    setWatchedTickers(prev => [...prev, {
      ticker,
      name: ticker,
      alertDividend: true,
      alertDataCom: true,
      alertPayment: true,
    }]);
    setNewTicker('');
  };

  const removeWatchedTicker = (ticker: string) => {
    setWatchedTickers(prev => prev.filter(w => w.ticker !== ticker));
  };

  const toggleAlert = (ticker: string, field: keyof WatchedTicker) => {
    setWatchedTickers(prev => prev.map(w => 
      w.ticker === ticker ? { ...w, [field]: !w[field] } : w
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dividendo': return 'bg-green-500/10 text-green-500';
      case 'jcp': return 'bg-blue-500/10 text-blue-500';
      case 'rendimento': return 'bg-purple-500/10 text-purple-500';
      default: return '';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dividendo': return 'Dividendo';
      case 'jcp': return 'JCP';
      case 'rendimento': return 'Rendimento';
      default: return type;
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calcular estatísticas
  const totalDividendos = upcomingEvents.reduce((acc, e) => acc + e.value, 0);
  const avgDY = upcomingEvents.length > 0 
    ? upcomingEvents.reduce((acc, e) => acc + e.dy, 0) / upcomingEvents.length 
    : 0;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BellRing className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Alertas de Dividendos</h1>
        </div>
        <p className="text-muted-foreground">
          Acompanhe os próximos dividendos e configure alertas para não perder nenhuma data
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                <div className="text-sm text-muted-foreground">Próximos eventos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(totalDividendos)}</div>
                <div className="text-sm text-muted-foreground">Total anunciado</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-500">{avgDY.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">DY médio</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{watchedTickers.length}</div>
                <div className="text-sm text-muted-foreground">Ativos monitorados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendário de Dividendos */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Calendário de Proventos</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar ativo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="h-10 px-3 rounded-md border bg-background text-sm"
                  >
                    <option value="todos">Todos</option>
                    <option value="dividendo">Dividendos</option>
                    <option value="jcp">JCP</option>
                    <option value="rendimento">Rendimentos</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="proximos">
                <TabsList className="mb-4">
                  <TabsTrigger value="proximos">Próximos ({upcomingEvents.length})</TabsTrigger>
                  <TabsTrigger value="pagos">Pagos ({pastEvents.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="proximos">
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => {
                      const daysUntilCom = getDaysUntil(event.dataCom);
                      return (
                        <div 
                          key={`${event.ticker}-${index}`}
                          className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                {event.ticker.includes('11') ? (
                                  <Building2 className="h-6 w-6 text-primary" />
                                ) : (
                                  <Coins className="h-6 w-6 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{event.ticker}</span>
                                  <Badge className={getTypeColor(event.type)}>
                                    {getTypeLabel(event.type)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">{event.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-500">
                                {formatCurrency(event.value)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                DY: {event.dy.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Data Com</div>
                              <div className="font-medium flex items-center gap-1">
                                {formatDate(event.dataCom)}
                                {daysUntilCom <= 7 && daysUntilCom > 0 && (
                                  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500">
                                    {daysUntilCom}d
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Data Ex</div>
                              <div className="font-medium">{formatDate(event.dataEx)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Pagamento</div>
                              <div className="font-medium">{formatDate(event.dataPagamento)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {upcomingEvents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum evento encontrado
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pagos">
                  <div className="space-y-3">
                    {pastEvents.map((event, index) => (
                      <div 
                        key={`${event.ticker}-${index}`}
                        className="p-4 rounded-lg border opacity-70"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="font-bold">{event.ticker}</span>
                              <span className="text-sm text-muted-foreground ml-2">{event.name}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-500">{formatCurrency(event.value)}</div>
                            <div className="text-sm text-muted-foreground">
                              Pago em {formatDate(event.dataPagamento)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Configuração de Alertas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Meus Alertas
              </CardTitle>
              <CardDescription>
                Configure alertas para seus ativos favoritos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar novo */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: PETR4"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={addWatchedTicker} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Lista de alertas */}
              <div className="space-y-3">
                {watchedTickers.map((watched) => (
                  <div key={watched.ticker} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold">{watched.ticker}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeWatchedTicker(watched.ticker)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Novo dividendo</Label>
                        <Switch
                          checked={watched.alertDividend}
                          onCheckedChange={() => toggleAlert(watched.ticker, 'alertDividend')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Data Com</Label>
                        <Switch
                          checked={watched.alertDataCom}
                          onCheckedChange={() => toggleAlert(watched.ticker, 'alertDataCom')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Pagamento</Label>
                        <Switch
                          checked={watched.alertPayment}
                          onCheckedChange={() => toggleAlert(watched.ticker, 'alertPayment')}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {watchedTickers.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Adicione ativos para receber alertas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Dicas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p><strong>Data Com:</strong> Último dia para comprar e ter direito ao provento</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p><strong>Data Ex:</strong> Primeiro dia que a ação negocia sem o direito</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p><strong>JCP:</strong> Tem 15% de IR retido na fonte, diferente dos dividendos</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p><strong>FIIs:</strong> Rendimentos são isentos de IR para pessoa física</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

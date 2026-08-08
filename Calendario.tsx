import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Building2,
  Globe,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bell,
  Star,
  Flag,
} from "lucide-react";

// Generate mock economic events
const generateEconomicEvents = () => {
  const events = [
    // Brazil
    { date: "2024-12-20", time: "09:00", country: "BR", event: "Decisão Taxa Selic", impact: "high", previous: "11.25%", forecast: "12.25%", actual: "12.25%" },
    { date: "2024-12-23", time: "09:00", country: "BR", event: "IPCA-15 (Mensal)", impact: "high", previous: "0.62%", forecast: "0.45%", actual: null },
    { date: "2024-12-27", time: "10:00", country: "BR", event: "Taxa de Desemprego", impact: "medium", previous: "6.2%", forecast: "6.1%", actual: null },
    { date: "2024-12-30", time: "09:00", country: "BR", event: "IGP-M (Mensal)", impact: "medium", previous: "1.30%", forecast: "0.85%", actual: null },
    // USA
    { date: "2024-12-20", time: "10:30", country: "US", event: "PIB (Trimestral)", impact: "high", previous: "2.8%", forecast: "3.1%", actual: "3.1%" },
    { date: "2024-12-23", time: "10:30", country: "US", event: "PCE Core (Mensal)", impact: "high", previous: "0.3%", forecast: "0.2%", actual: null },
    { date: "2024-12-26", time: "10:30", country: "US", event: "Pedidos de Seguro-Desemprego", impact: "medium", previous: "220K", forecast: "218K", actual: null },
    { date: "2024-12-27", time: "11:00", country: "US", event: "Confiança do Consumidor", impact: "medium", previous: "111.7", forecast: "113.0", actual: null },
    // Europe
    { date: "2024-12-20", time: "06:00", country: "EU", event: "IPC Zona Euro (Anual)", impact: "high", previous: "2.3%", forecast: "2.2%", actual: "2.2%" },
    { date: "2024-12-23", time: "05:00", country: "DE", event: "Índice IFO Alemanha", impact: "medium", previous: "87.3", forecast: "87.8", actual: null },
    // China
    { date: "2024-12-26", time: "22:30", country: "CN", event: "PMI Manufatura", impact: "high", previous: "50.3", forecast: "50.5", actual: null },
    // Japan
    { date: "2024-12-27", time: "00:30", country: "JP", event: "IPC Tóquio (Anual)", impact: "medium", previous: "2.2%", forecast: "2.3%", actual: null },
  ];
  
  return events;
};

// Generate mock earnings calendar
const generateEarningsEvents = () => {
  const earnings = [
    { date: "2024-12-20", ticker: "PETR4", company: "Petrobras", time: "after", estimate: "1.85", previous: "1.72" },
    { date: "2024-12-23", ticker: "VALE3", company: "Vale", time: "before", estimate: "2.15", previous: "2.08" },
    { date: "2024-12-23", ticker: "ITUB4", company: "Itaú Unibanco", time: "after", estimate: "0.92", previous: "0.88" },
    { date: "2024-12-26", ticker: "BBDC4", company: "Bradesco", time: "before", estimate: "0.45", previous: "0.42" },
    { date: "2024-12-27", ticker: "WEGE3", company: "WEG", time: "after", estimate: "0.38", previous: "0.35" },
    { date: "2024-12-27", ticker: "ABEV3", company: "Ambev", time: "before", estimate: "0.22", previous: "0.20" },
    { date: "2024-12-30", ticker: "RENT3", company: "Localiza", time: "after", estimate: "0.85", previous: "0.78" },
    { date: "2024-12-30", ticker: "SUZB3", company: "Suzano", time: "before", estimate: "1.25", previous: "1.18" },
    // US Stocks
    { date: "2024-12-23", ticker: "AAPL", company: "Apple", time: "after", estimate: "2.35", previous: "2.18" },
    { date: "2024-12-26", ticker: "MSFT", company: "Microsoft", time: "after", estimate: "2.82", previous: "2.69" },
    { date: "2024-12-27", ticker: "NVDA", company: "NVIDIA", time: "after", estimate: "4.15", previous: "3.71" },
  ];
  
  return earnings;
};

// Generate mock dividend calendar
const generateDividendEvents = () => {
  const dividends = [
    { date: "2024-12-20", ticker: "PETR4", company: "Petrobras", type: "ex-dividend", amount: "1.45", yield: "4.68%" },
    { date: "2024-12-23", ticker: "ITUB4", company: "Itaú Unibanco", type: "payment", amount: "0.35", yield: "1.08%" },
    { date: "2024-12-26", ticker: "BBDC4", company: "Bradesco", type: "ex-dividend", amount: "0.18", yield: "1.40%" },
    { date: "2024-12-27", ticker: "VALE3", company: "Vale", type: "payment", amount: "2.10", yield: "3.56%" },
    { date: "2024-12-27", ticker: "TAEE11", company: "Taesa", type: "ex-dividend", amount: "0.85", yield: "2.35%" },
    { date: "2024-12-30", ticker: "BBAS3", company: "Banco do Brasil", type: "payment", amount: "0.52", yield: "1.82%" },
    { date: "2024-12-30", ticker: "EGIE3", company: "Engie Brasil", type: "ex-dividend", amount: "1.20", yield: "2.85%" },
    { date: "2025-01-02", ticker: "CPLE6", company: "Copel", type: "payment", amount: "0.42", yield: "1.95%" },
  ];
  
  return dividends;
};

// Country flag component
const CountryFlag = ({ country }: { country: string }) => {
  const flags: Record<string, string> = {
    BR: "🇧🇷",
    US: "🇺🇸",
    EU: "🇪🇺",
    DE: "🇩🇪",
    CN: "🇨🇳",
    JP: "🇯🇵",
    UK: "🇬🇧",
  };
  
  return <span className="text-lg">{flags[country] || "🌍"}</span>;
};

// Impact badge component
const ImpactBadge = ({ impact }: { impact: string }) => {
  if (impact === "high") {
    return <Badge className="bg-red-500">Alto</Badge>;
  } else if (impact === "medium") {
    return <Badge className="bg-yellow-500">Médio</Badge>;
  }
  return <Badge variant="secondary">Baixo</Badge>;
};

export default function Calendario() {
  const [selectedTab, setSelectedTab] = useState("economic");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [countryFilter, setCountryFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");
  
  const economicEvents = useMemo(() => generateEconomicEvents(), []);
  const earningsEvents = useMemo(() => generateEarningsEvents(), []);
  const dividendEvents = useMemo(() => generateDividendEvents(), []);
  
  // Get week dates
  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  
  const weekDates = getWeekDates(selectedWeek);
  const weekStart = weekDates[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const weekEnd = weekDates[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  
  // Filter events
  const filteredEconomicEvents = economicEvents.filter(event => {
    if (countryFilter !== "all" && event.country !== countryFilter) return false;
    if (impactFilter !== "all" && event.impact !== impactFilter) return false;
    return true;
  });
  
  // Group events by date
  const groupEventsByDate = (events: any[]) => {
    const grouped: Record<string, any[]> = {};
    events.forEach(event => {
      if (!grouped[event.date]) grouped[event.date] = [];
      grouped[event.date].push(event);
    });
    return grouped;
  };
  
  const economicByDate = groupEventsByDate(filteredEconomicEvents);
  const earningsByDate = groupEventsByDate(earningsEvents);
  const dividendsByDate = groupEventsByDate(dividendEvents);
  
  // Count events for today
  const today = new Date().toISOString().split("T")[0];
  const todayEconomic = economicEvents.filter(e => e.date === today).length;
  const todayEarnings = earningsEvents.filter(e => e.date === today).length;
  const todayDividends = dividendEvents.filter(e => e.date === today).length;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Calendário Econômico
            </h1>
            <p className="text-muted-foreground mt-1">
              Eventos econômicos, resultados de empresas e dividendos
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={() => setSelectedWeek(prev => prev - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              {weekStart} - {weekEnd}
            </span>
            <Button variant="outline" onClick={() => setSelectedWeek(prev => prev + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setSelectedWeek(0)}>
              Hoje
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Eventos Econômicos Hoje</p>
                  <p className="text-2xl font-bold">{todayEconomic}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resultados Hoje</p>
                  <p className="text-2xl font-bold">{todayEarnings}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dividendos Hoje</p>
                  <p className="text-2xl font-bold">{todayDividends}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="economic" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Econômico
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Resultados
              </TabsTrigger>
              <TabsTrigger value="dividends" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Dividendos
              </TabsTrigger>
            </TabsList>
            
            {selectedTab === "economic" && (
              <div className="flex gap-2">
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="País" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Países</SelectItem>
                    <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
                    <SelectItem value="US">🇺🇸 EUA</SelectItem>
                    <SelectItem value="EU">🇪🇺 Zona Euro</SelectItem>
                    <SelectItem value="CN">🇨🇳 China</SelectItem>
                    <SelectItem value="JP">🇯🇵 Japão</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={impactFilter} onValueChange={setImpactFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Impacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="high">Alto Impacto</SelectItem>
                    <SelectItem value="medium">Médio Impacto</SelectItem>
                    <SelectItem value="low">Baixo Impacto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Economic Events */}
          <TabsContent value="economic">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDates.map((date, index) => {
                const dateStr = date.toISOString().split("T")[0];
                const events = economicByDate[dateStr] || [];
                const isToday = dateStr === today;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <Card key={index} className={`${isToday ? "ring-2 ring-primary" : ""} ${isWeekend ? "opacity-60" : ""}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{date.toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                        <span className={isToday ? "text-primary font-bold" : ""}>
                          {date.getDate()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {events.length > 0 ? (
                        events.map((event, i) => (
                          <div key={i} className="p-2 rounded bg-muted/50 text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <CountryFlag country={event.country} />
                              <ImpactBadge impact={event.impact} />
                            </div>
                            <div className="font-medium">{event.event}</div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                            {event.actual ? (
                              <div className="text-emerald-500">
                                Atual: {event.actual}
                              </div>
                            ) : (
                              <div className="text-muted-foreground">
                                Prev: {event.forecast}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground text-xs py-4">
                          Sem eventos
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Earnings Events */}
          <TabsContent value="earnings">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDates.map((date, index) => {
                const dateStr = date.toISOString().split("T")[0];
                const events = earningsByDate[dateStr] || [];
                const isToday = dateStr === today;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <Card key={index} className={`${isToday ? "ring-2 ring-primary" : ""} ${isWeekend ? "opacity-60" : ""}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{date.toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                        <span className={isToday ? "text-primary font-bold" : ""}>
                          {date.getDate()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {events.length > 0 ? (
                        events.map((event, i) => (
                          <div key={i} className="p-2 rounded bg-muted/50 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary">{event.ticker}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.time === "before" ? "Pré" : "Pós"}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground">{event.company}</div>
                            <div className="flex justify-between">
                              <span>Est: ${event.estimate}</span>
                              <span className="text-muted-foreground">Ant: ${event.previous}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground text-xs py-4">
                          Sem resultados
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Dividend Events */}
          <TabsContent value="dividends">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDates.map((date, index) => {
                const dateStr = date.toISOString().split("T")[0];
                const events = dividendsByDate[dateStr] || [];
                const isToday = dateStr === today;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <Card key={index} className={`${isToday ? "ring-2 ring-primary" : ""} ${isWeekend ? "opacity-60" : ""}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{date.toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                        <span className={isToday ? "text-primary font-bold" : ""}>
                          {date.getDate()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {events.length > 0 ? (
                        events.map((event, i) => (
                          <div key={i} className="p-2 rounded bg-muted/50 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary">{event.ticker}</span>
                              <Badge variant={event.type === "ex-dividend" ? "default" : "secondary"} className="text-xs">
                                {event.type === "ex-dividend" ? "Ex" : "Pgto"}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground">{event.company}</div>
                            <div className="flex justify-between">
                              <span className="text-emerald-500">R$ {event.amount}</span>
                              <span className="text-yellow-500">{event.yield}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground text-xs py-4">
                          Sem dividendos
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Upcoming High Impact Events */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Próximos Eventos de Alto Impacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Data/Hora</th>
                    <th className="text-left py-3 px-2">País</th>
                    <th className="text-left py-3 px-2">Evento</th>
                    <th className="text-right py-3 px-2">Anterior</th>
                    <th className="text-right py-3 px-2">Previsão</th>
                    <th className="text-right py-3 px-2">Atual</th>
                  </tr>
                </thead>
                <tbody>
                  {economicEvents
                    .filter(e => e.impact === "high")
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 10)
                    .map((event, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div className="font-medium">
                            {new Date(event.date).toLocaleDateString("pt-BR")}
                          </div>
                          <div className="text-xs text-muted-foreground">{event.time}</div>
                        </td>
                        <td className="py-3 px-2">
                          <CountryFlag country={event.country} />
                        </td>
                        <td className="py-3 px-2 font-medium">{event.event}</td>
                        <td className="text-right py-3 px-2 font-mono">{event.previous}</td>
                        <td className="text-right py-3 px-2 font-mono">{event.forecast}</td>
                        <td className="text-right py-3 px-2 font-mono">
                          {event.actual ? (
                            <span className="text-emerald-500">{event.actual}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

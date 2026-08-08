import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Key,
  Copy,
  CheckCircle,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  BarChart3,
  TrendingUp,
  DollarSign,
  FileJson,
  Terminal,
  BookOpen
} from 'lucide-react';

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/quote/{ticker}',
    description: 'Retorna a cotação atual de um ativo',
    params: [{ name: 'ticker', type: 'string', required: true, description: 'Código do ativo (ex: PETR4)' }],
    response: `{
  "ticker": "PETR4",
  "name": "Petrobras",
  "price": 36.80,
  "change": 1.25,
  "changePercent": 3.52,
  "volume": 45000000,
  "marketCap": 480000000000,
  "updatedAt": "2024-12-21T15:30:00Z"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/fundamentals/{ticker}',
    description: 'Retorna indicadores fundamentalistas de um ativo',
    params: [{ name: 'ticker', type: 'string', required: true, description: 'Código do ativo' }],
    response: `{
  "ticker": "PETR4",
  "pl": 4.5,
  "pvp": 1.2,
  "roe": 28.5,
  "roic": 22.3,
  "dividendYield": 18.5,
  "margemLiquida": 15.2,
  "dividaLiquidaEbitda": 0.8
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/dividends/{ticker}',
    description: 'Retorna histórico de dividendos de um ativo',
    params: [
      { name: 'ticker', type: 'string', required: true, description: 'Código do ativo' },
      { name: 'limit', type: 'number', required: false, description: 'Quantidade de registros (padrão: 12)' },
    ],
    response: `{
  "ticker": "PETR4",
  "dividends": [
    { "type": "dividendo", "value": 1.45, "dataCom": "2024-12-10", "dataPagamento": "2025-01-15" },
    { "type": "jcp", "value": 0.85, "dataCom": "2024-09-15", "dataPagamento": "2024-10-20" }
  ],
  "totalLastYear": 6.80,
  "dividendYield": 18.5
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/signals/{ticker}',
    description: 'Retorna sinais de análise técnica',
    params: [{ name: 'ticker', type: 'string', required: true, description: 'Código do ativo' }],
    response: `{
  "ticker": "PETR4",
  "signal": "COMPRA",
  "strength": "FORTE",
  "rsi": 45.2,
  "macd": { "value": 0.52, "signal": 0.35, "histogram": 0.17 },
  "sma20": 35.50,
  "sma50": 34.20,
  "support": 34.00,
  "resistance": 38.50
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/ranking',
    description: 'Retorna ranking de ativos por critério',
    params: [
      { name: 'type', type: 'string', required: true, description: 'Tipo: gainers, losers, volume, dividends' },
      { name: 'limit', type: 'number', required: false, description: 'Quantidade (padrão: 10)' },
    ],
    response: `{
  "type": "gainers",
  "period": "day",
  "data": [
    { "ticker": "MGLU3", "name": "Magazine Luiza", "change": 8.5, "price": 12.45 },
    { "ticker": "VIIA3", "name": "Via", "change": 7.2, "price": 2.85 }
  ]
}`,
  },
];

export default function ApiPublica() {
  const [copied, setCopied] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('finsight_api_xxxxxxxxxxxxxxxx');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500';
      case 'POST': return 'bg-blue-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Code className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">API Pública</h1>
        </div>
        <p className="text-muted-foreground">
          Integre dados do F-Insight em suas aplicações com nossa API RESTful
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-bold">Rápida</div>
                <div className="text-sm text-muted-foreground">Latência &lt; 100ms</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-bold">Segura</div>
                <div className="text-sm text-muted-foreground">HTTPS + API Key</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-bold">Atualizada</div>
                <div className="text-sm text-muted-foreground">Dados em tempo real</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-bold">JSON</div>
                <div className="text-sm text-muted-foreground">Formato padrão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Sua API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={apiKey}
                  readOnly
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => copyToClipboard(apiKey, 'apikey')}
                >
                  {copied === 'apikey' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Inclua no header: <code className="bg-muted px-1 rounded">Authorization: Bearer {'{api_key}'}</code>
              </p>
              <Button variant="outline" className="w-full">
                Gerar Nova Key
              </Button>
            </CardContent>
          </Card>

          {/* Rate Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Limites de Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Requisições/minuto</span>
                <Badge>60</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Requisições/dia</span>
                <Badge>10.000</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ativos simultâneos</span>
                <Badge>100</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Links Úteis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentação Completa
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Terminal className="h-4 w-4 mr-2" />
                Exemplos de Código
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Endpoints */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Endpoints Disponíveis</h2>
          
          {API_ENDPOINTS.map((endpoint, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Badge className={getMethodColor(endpoint.method)}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="params">
                  <TabsList className="mb-3">
                    <TabsTrigger value="params">Parâmetros</TabsTrigger>
                    <TabsTrigger value="response">Resposta</TabsTrigger>
                    <TabsTrigger value="example">Exemplo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="params">
                    <div className="space-y-2">
                      {endpoint.params.map((param, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <code className="bg-muted px-2 py-1 rounded">{param.name}</code>
                          <Badge variant="outline">{param.type}</Badge>
                          {param.required && <Badge variant="destructive">obrigatório</Badge>}
                          <span className="text-muted-foreground">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="response">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                        <code>{endpoint.response}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8"
                        onClick={() => copyToClipboard(endpoint.response, `response-${index}`)}
                      >
                        {copied === `response-${index}` ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="example">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1">cURL</div>
                        <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                          <code>curl -X {endpoint.method} "https://api.finsight.com.br{endpoint.path.replace('{ticker}', 'PETR4').replace('{type}', 'gainers')}" \
  -H "Authorization: Bearer {'{api_key}'}"</code>
                        </pre>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">JavaScript</div>
                        <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                          <code>{`const response = await fetch(
  'https://api.finsight.com.br${endpoint.path.replace('{ticker}', 'PETR4').replace('{type}', 'gainers')}',
  { headers: { 'Authorization': 'Bearer ' + apiKey } }
);
const data = await response.json();`}</code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

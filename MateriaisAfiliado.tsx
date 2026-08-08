import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Image,
  FileText,
  Mail,
  Video,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

// Banners disponíveis
const banners = [
  {
    id: 1,
    name: "Banner Horizontal Grande",
    size: "728x90",
    description: "Ideal para headers de sites e blogs",
    preview: "https://placehold.co/728x90/0d9488/ffffff?text=F-Insight+|+Analise+Financeira+Inteligente",
  },
  {
    id: 2,
    name: "Banner Retangular",
    size: "300x250",
    description: "Perfeito para sidebars e areas de destaque",
    preview: "https://placehold.co/300x250/0d9488/ffffff?text=F-Insight%0AAnalise+Financeira",
  },
  {
    id: 3,
    name: "Banner Vertical",
    size: "160x600",
    description: "Otimo para sidebars verticais",
    preview: "https://placehold.co/160x600/0d9488/ffffff?text=F-Insight",
  },
  {
    id: 4,
    name: "Banner Quadrado",
    size: "250x250",
    description: "Versatil para diversas posicoes",
    preview: "https://placehold.co/250x250/0d9488/ffffff?text=F-Insight",
  },
  {
    id: 5,
    name: "Banner Mobile",
    size: "320x50",
    description: "Otimizado para dispositivos moveis",
    preview: "https://placehold.co/320x50/0d9488/ffffff?text=F-Insight",
  },
  {
    id: 6,
    name: "Banner Leaderboard",
    size: "970x90",
    description: "Para sites com layout largo",
    preview: "https://placehold.co/970x90/0d9488/ffffff?text=F-Insight+|+Analise+Financeira+Inteligente+|+Comece+Gratis",
  },
];

// Posts prontos para redes sociais
const socialPosts = [
  {
    id: 1,
    platform: "instagram",
    icon: Instagram,
    title: "Post Instagram - Descoberta",
    content: `Voce sabia que pode analisar acoes como um profissional sem pagar nada?

A F-Insight oferece:
- Analise fundamentalista completa
- Indicadores tecnicos avancados
- Screener com +50 filtros
- Backtesting de estrategias

E o melhor: e GRATIS para comecar!

Link na bio

#investimentos #bolsadevalores #acoes #financas #trading`,
  },
  {
    id: 2,
    platform: "instagram",
    icon: Instagram,
    title: "Post Instagram - Funcionalidades",
    content: `5 funcionalidades da F-Insight que vao mudar sua forma de investir:

1. Terminal profissional estilo Bloomberg
2. Analise tecnica com Fibonacci e Ichimoku
3. Heatmap de mercado em tempo real
4. Sistema de alertas inteligentes
5. Backtesting de estrategias

Tudo isso por uma fracao do preco de um Bloomberg Terminal.

#finsight #investimentos #analisedeacoes #trader`,
  },
  {
    id: 3,
    platform: "twitter",
    icon: Twitter,
    title: "Thread Twitter - Comparacao",
    content: `Bloomberg Terminal: R$ 10.000/mes
F-Insight: R$ 0 (gratis) ou R$ 49/mes (Premium)

Mesmas funcionalidades:
- Analise fundamentalista
- Indicadores tecnicos
- Screener de acoes
- Dados em tempo real

A diferenca? Acessibilidade.

[SEU LINK DE AFILIADO]`,
  },
  {
    id: 4,
    platform: "linkedin",
    icon: Linkedin,
    title: "Post LinkedIn - Profissional",
    content: `Analistas e investidores: conhecam a F-Insight.

Uma plataforma brasileira que democratiza o acesso a ferramentas de analise financeira de nivel institucional.

Principais recursos:
- DCF interativo
- Multiplos setoriais
- Matriz de correlacoes
- Relatorios profissionais em PDF

Ideal para:
- Analistas independentes
- Gestores de patrimonio
- Investidores pessoa fisica

Teste gratuitamente: [SEU LINK]`,
  },
  {
    id: 5,
    platform: "youtube",
    icon: Youtube,
    title: "Roteiro Video YouTube",
    content: `TITULO: F-Insight: O Bloomberg Terminal Brasileiro (Review Completo)

INTRO (0:00-0:30):
"E se eu te dissesse que existe uma plataforma brasileira com funcionalidades de um Bloomberg Terminal, mas que custa uma fracao do preco? Hoje vou mostrar a F-Insight."

DEMONSTRACAO (0:30-5:00):
- Mostrar dashboard
- Analise fundamentalista
- Graficos tecnicos
- Screener de acoes
- Backtesting

CONCLUSAO (5:00-6:00):
"Se voce quer elevar seu nivel de analise sem gastar uma fortuna, a F-Insight e a solucao. Link na descricao com desconto exclusivo."

CTA: Link de afiliado na descricao`,
  },
];

// Templates de email
const emailTemplates = [
  {
    id: 1,
    title: "Email de Introducao",
    subject: "Descubra a plataforma que esta revolucionando a analise de acoes no Brasil",
    body: `Ola [NOME],

Voce ja imaginou ter acesso as mesmas ferramentas de analise que os grandes fundos de investimento usam?

A F-Insight e uma plataforma brasileira que oferece:

- Analise fundamentalista completa (DCF, multiplos, scoring)
- Indicadores tecnicos avancados (Fibonacci, Ichimoku, Volume Profile)
- Screener com mais de 50 filtros
- Backtesting de estrategias
- Relatorios profissionais em PDF

E o melhor: voce pode comecar GRATIS.

Clique aqui para conhecer: [SEU LINK DE AFILIADO]

Abracos,
[SEU NOME]`,
  },
  {
    id: 2,
    title: "Email de Follow-up",
    subject: "Voce viu isso? Analise de acoes de nivel profissional",
    body: `Ola [NOME],

Na semana passada te falei sobre a F-Insight. Queria compartilhar algumas novidades:

NOVOS RECURSOS:
- Torneios semanais com premios
- Copy trading (copie os melhores traders)
- Chat entre investidores
- Sistema de conquistas e gamificacao

DEPOIMENTO DE USUARIO:
"Antes eu pagava R$ 200/mes em outras plataformas. A F-Insight me da tudo isso e mais por R$ 49/mes." - Carlos M.

Teste gratis por 7 dias: [SEU LINK DE AFILIADO]

Qualquer duvida, estou a disposicao.

[SEU NOME]`,
  },
  {
    id: 3,
    title: "Email de Urgencia",
    subject: "ULTIMO DIA: Desconto exclusivo na F-Insight Premium",
    body: `[NOME], essa e sua ultima chance!

O desconto de 20% no plano anual da F-Insight termina HOJE.

De R$ 588/ano por apenas R$ 470/ano.

Isso da menos de R$ 40/mes para ter acesso a:
- Todas as funcionalidades premium
- Alertas ilimitados
- Relatorios ilimitados
- Suporte prioritario
- Sem anuncios

Garanta seu desconto agora: [SEU LINK DE AFILIADO]

Nao perca essa oportunidade!

[SEU NOME]`,
  },
];

// Guias e recursos
const guides = [
  {
    id: 1,
    title: "Guia Completo do Afiliado",
    description: "Tudo que voce precisa saber para ter sucesso como afiliado F-Insight",
    type: "PDF",
    pages: 25,
  },
  {
    id: 2,
    title: "Estrategias de Conversao",
    description: "Tecnicas comprovadas para aumentar suas conversoes",
    type: "PDF",
    pages: 15,
  },
  {
    id: 3,
    title: "FAQ para Afiliados",
    description: "Respostas para as perguntas mais frequentes",
    type: "PDF",
    pages: 10,
  },
  {
    id: 4,
    title: "Calendario de Conteudo",
    description: "30 dias de ideias de posts para suas redes sociais",
    type: "Excel",
    pages: 0,
  },
];

export default function MateriaisAfiliado() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [affiliateCode, setAffiliateCode] = useState("SEUCODIGO");
  const [affiliateLink, setAffiliateLink] = useState("https://f-insight.org/?ref=SEUCODIGO");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const replaceAffiliateLink = (text: string) => {
    return text.replace(/\[SEU LINK DE AFILIADO\]|\[SEU LINK\]/g, affiliateLink);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/afiliados">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                Materiais de Marketing
              </h1>
              <p className="text-muted-foreground">Recursos prontos para divulgar a F-Insight</p>
            </div>
          </div>

          {/* Configuracao do Link */}
          <Card className="mb-8 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Configure seu Link de Afiliado</CardTitle>
              <CardDescription>Insira seu codigo para personalizar os materiais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Seu Codigo de Afiliado</Label>
                  <Input
                    id="code"
                    value={affiliateCode}
                    onChange={(e) => {
                      setAffiliateCode(e.target.value.toUpperCase());
                      setAffiliateLink(`https://f-insight.org/?ref=${e.target.value.toUpperCase()}`);
                    }}
                    placeholder="Ex: JOAO2024"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Seu Link Personalizado</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={affiliateLink} readOnly className="bg-muted" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(affiliateLink, "link")}
                    >
                      {copiedId === "link" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="banners" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="banners" className="gap-2">
                <Image className="w-4 h-4" />
                Banners
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="emails" className="gap-2">
                <Mail className="w-4 h-4" />
                Emails
              </TabsTrigger>
              <TabsTrigger value="guides" className="gap-2">
                <FileText className="w-4 h-4" />
                Guias
              </TabsTrigger>
            </TabsList>

            {/* Banners Tab */}
            <TabsContent value="banners">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center p-4">
                      <img
                        src={banner.preview}
                        alt={banner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{banner.name}</h3>
                        <Badge variant="outline">{banner.size}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{banner.description}</p>
                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Banner
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <div className="space-y-6">
                {socialPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <post.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <CardDescription className="capitalize">{post.platform}</CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(replaceAffiliateLink(post.content), `post-${post.id}`)}
                        >
                          {copiedId === `post-${post.id}` ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-emerald-400" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={replaceAffiliateLink(post.content)}
                        readOnly
                        className="min-h-[200px] bg-muted/50 font-mono text-sm"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Emails Tab */}
            <TabsContent value="emails">
              <div className="space-y-6">
                {emailTemplates.map((email) => (
                  <Card key={email.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{email.title}</CardTitle>
                          <CardDescription>Assunto: {email.subject}</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(replaceAffiliateLink(email.body), `email-${email.id}`)}
                        >
                          {copiedId === `email-${email.id}` ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-emerald-400" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-muted-foreground">Assunto:</Label>
                          <Input value={email.subject} readOnly className="bg-muted/50" />
                        </div>
                        <Textarea
                          value={replaceAffiliateLink(email.body)}
                          readOnly
                          className="min-h-[250px] bg-muted/50 font-mono text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides">
              <div className="grid md:grid-cols-2 gap-6">
                {guides.map((guide) => (
                  <Card key={guide.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cyan-500/20 rounded-lg">
                          <FileText className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {guide.type} {guide.pages > 0 && `- ${guide.pages} paginas`}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Baixar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Video Tutorial Card */}
                <Card className="md:col-span-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Video className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Video Tutorial: Como Divulgar a F-Insight</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Aprenda as melhores estrategias para promover a plataforma e aumentar suas conversoes
                        </p>
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Assistir no YouTube
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tips Section */}
          <Card className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Dicas para Aumentar suas Conversoes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">1. Seja Autentico</h4>
                  <p className="text-sm text-muted-foreground">
                    Use a plataforma voce mesmo e compartilhe suas experiencias reais. Depoimentos genuinos convertem mais.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Foque no Valor</h4>
                  <p className="text-sm text-muted-foreground">
                    Destaque como a F-Insight resolve problemas reais dos investidores, nao apenas liste funcionalidades.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Use Urgencia</h4>
                  <p className="text-sm text-muted-foreground">
                    Promocoes por tempo limitado e ofertas exclusivas aumentam a taxa de conversao significativamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

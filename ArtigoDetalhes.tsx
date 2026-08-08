import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, Eye, Share2, BookOpen, BarChart3, TrendingUp, Bitcoin, Globe, GraduationCap } from "lucide-react";
import { Link, useParams } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const categories = {
  fundamentalista: { name: "Análise Fundamentalista", icon: BarChart3, color: "text-blue-500" },
  tecnica: { name: "Análise Técnica", icon: TrendingUp, color: "text-green-500" },
  cripto: { name: "Criptomoedas", icon: Bitcoin, color: "text-orange-500" },
  macro: { name: "Macroeconomia", icon: Globe, color: "text-purple-500" },
  iniciante: { name: "Para Iniciantes", icon: GraduationCap, color: "text-yellow-500" },
};

// Sample article content for demonstration
const sampleArticleContent: Record<string, { title: string; category: keyof typeof categories; readTime: number; views: number; publishedAt: Date; content: string }> = {
  "o-que-e-pl-como-usar": {
    title: "O que é P/L e como usar na análise de ações",
    category: "fundamentalista",
    readTime: 8,
    views: 1250,
    publishedAt: new Date("2024-12-15"),
    content: `
# O que é P/L e como usar na análise de ações

O **Preço/Lucro (P/L)** é um dos indicadores mais utilizados na análise fundamentalista de ações. Ele representa quantos anos de lucro seriam necessários para "pagar" o preço atual da ação, assumindo que o lucro se mantenha constante.

## Como calcular o P/L

A fórmula é simples:

**P/L = Preço da Ação ÷ Lucro por Ação (LPA)**

Por exemplo, se uma ação custa R$ 50 e o LPA é R$ 5, o P/L será 10.

## Como interpretar o P/L

### P/L baixo (< 10)
- Pode indicar que a empresa está **subvalorizada**
- Pode também indicar **problemas** na empresa ou no setor
- Comum em setores maduros como bancos e utilities

### P/L médio (10-20)
- Faixa considerada **normal** para a maioria das empresas
- Indica expectativas moderadas de crescimento

### P/L alto (> 20)
- Indica **altas expectativas** de crescimento futuro
- Comum em empresas de tecnologia e growth stocks
- Pode indicar **sobrevalorização**

## Limitações do P/L

1. **Não funciona para empresas com prejuízo** - o P/L fica negativo ou indefinido
2. **Não considera a dívida** - empresas muito alavancadas podem parecer baratas
3. **Varia muito entre setores** - compare sempre com empresas do mesmo setor
4. **Baseado em lucro contábil** - pode ser manipulado

## Dicas práticas

- Compare o P/L atual com a **média histórica** da empresa
- Compare com **concorrentes** do mesmo setor
- Considere o **P/L projetado** (forward P/L) para empresas em crescimento
- Use em conjunto com outros indicadores como **P/VP** e **ROE**

## Conclusão

O P/L é uma ferramenta poderosa, mas deve ser usado em conjunto com outros indicadores e uma análise qualitativa da empresa. Nunca tome decisões baseado apenas em um único número.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*
    `,
  },
  "medias-moveis-guia-completo": {
    title: "Médias Móveis: Guia Completo para Traders",
    category: "tecnica",
    readTime: 12,
    views: 980,
    publishedAt: new Date("2024-12-10"),
    content: `
# Médias Móveis: Guia Completo para Traders

As **médias móveis** são um dos indicadores técnicos mais populares e versáteis. Elas ajudam a suavizar os movimentos de preço e identificar tendências.

## Tipos de Médias Móveis

### Média Móvel Simples (SMA)
A SMA calcula a média aritmética dos preços em um período específico.

**Fórmula:** SMA = (P1 + P2 + ... + Pn) / n

### Média Móvel Exponencial (EMA)
A EMA dá mais peso aos preços recentes, reagindo mais rapidamente às mudanças.

## Períodos mais utilizados

| Período | Uso comum |
|---------|-----------|
| 9 | Curto prazo, day trade |
| 21 | Curto/médio prazo |
| 50 | Médio prazo |
| 200 | Longo prazo, tendência principal |

## Estratégias com Médias Móveis

### 1. Cruzamento de Médias
- **Golden Cross:** MA curta cruza acima da MA longa → sinal de compra
- **Death Cross:** MA curta cruza abaixo da MA longa → sinal de venda

### 2. Suporte e Resistência Dinâmicos
As médias móveis funcionam como níveis de suporte e resistência que se movem com o preço.

### 3. Filtro de Tendência
- Preço acima da MA200 → tendência de alta
- Preço abaixo da MA200 → tendência de baixa

## Dicas importantes

1. Use múltiplas médias para confirmar sinais
2. Combine com outros indicadores (RSI, MACD)
3. Considere o volume nas análises
4. Teste diferentes períodos para cada ativo

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*
    `,
  },
  "bitcoin-para-iniciantes": {
    title: "Bitcoin para Iniciantes: Tudo que você precisa saber",
    category: "cripto",
    readTime: 15,
    views: 2100,
    publishedAt: new Date("2024-12-08"),
    content: `
# Bitcoin para Iniciantes: Tudo que você precisa saber

O **Bitcoin** é a primeira e mais conhecida criptomoeda do mundo, criada em 2009 por uma pessoa ou grupo sob o pseudônimo Satoshi Nakamoto.

## O que é Bitcoin?

Bitcoin é uma moeda digital descentralizada que funciona em uma rede peer-to-peer, sem a necessidade de intermediários como bancos ou governos.

### Características principais:

- **Descentralizado:** Não é controlado por nenhuma entidade central
- **Limitado:** Apenas 21 milhões de bitcoins serão criados
- **Transparente:** Todas as transações são públicas na blockchain
- **Imutável:** Transações não podem ser revertidas

## Como funciona a Blockchain?

A blockchain é um livro-razão digital distribuído que registra todas as transações de Bitcoin. Cada bloco contém:

1. Transações validadas
2. Hash do bloco anterior
3. Timestamp
4. Nonce (número usado na mineração)

## Como comprar Bitcoin no Brasil

1. **Exchanges centralizadas:** Mercado Bitcoin, Binance, Foxbit
2. **P2P:** Negociação direta entre pessoas
3. **ETFs de Bitcoin:** Disponíveis na B3

## Como armazenar de forma segura

### Hot Wallets (online)
- Mais convenientes
- Menor segurança
- Exemplos: Exodus, Trust Wallet

### Cold Wallets (offline)
- Máxima segurança
- Menos convenientes
- Exemplos: Ledger, Trezor

## Riscos do Bitcoin

- **Volatilidade:** Preços podem variar drasticamente
- **Regulação:** Incertezas regulatórias
- **Segurança:** Perda de chaves privadas é irreversível
- **Golpes:** Muitos esquemas fraudulentos no mercado

## Conclusão

Bitcoin representa uma revolução tecnológica e financeira, mas requer estudo e cautela. Nunca invista mais do que pode perder.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*
    `,
  },
  "como-a-selic-afeta-investimentos": {
    title: "Como a Taxa Selic afeta seus investimentos",
    category: "macro",
    readTime: 10,
    views: 1500,
    publishedAt: new Date("2024-12-05"),
    content: `
# Como a Taxa Selic afeta seus investimentos

A **Taxa Selic** é a taxa básica de juros da economia brasileira, definida pelo Comitê de Política Monetária (Copom) do Banco Central.

## O que é a Selic?

A Selic (Sistema Especial de Liquidação e Custódia) é a taxa de referência para todas as outras taxas de juros do país.

## Impacto nos investimentos

### Renda Fixa

| Selic | Impacto |
|-------|---------|
| Alta | Maior rentabilidade em CDBs, Tesouro Selic |
| Baixa | Menor rentabilidade, busca por alternativas |

### Ações

- **Selic alta:** Pressiona valuations, investidores migram para renda fixa
- **Selic baixa:** Favorece ações, custo de capital menor

### Fundos Imobiliários

- **Selic alta:** Competição com renda fixa, pressão nos preços
- **Selic baixa:** Maior atratividade, valorização das cotas

### Dólar

- **Selic alta:** Atrai capital estrangeiro, real se valoriza
- **Selic baixa:** Fuga de capital, real se desvaloriza

## Estratégias por cenário

### Selic em alta
1. Aumentar exposição a pós-fixados
2. Reduzir duration em prefixados
3. Cautela com ações de crescimento

### Selic em baixa
1. Buscar prefixados longos
2. Aumentar exposição a ações
3. Considerar FIIs

## Conclusão

Entender a Selic é fundamental para tomar decisões de investimento alinhadas com o cenário macroeconômico.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*
    `,
  },
  "primeiros-passos-investir": {
    title: "Primeiros Passos para Começar a Investir",
    category: "iniciante",
    readTime: 7,
    views: 3200,
    publishedAt: new Date("2024-12-01"),
    content: `
# Primeiros Passos para Começar a Investir

Começar a investir pode parecer intimidador, mas com os passos certos, qualquer pessoa pode construir um patrimônio sólido ao longo do tempo.

## Passo 1: Organize suas finanças

Antes de investir, você precisa:

1. **Conhecer seus gastos:** Faça um orçamento mensal
2. **Eliminar dívidas caras:** Cartão de crédito, cheque especial
3. **Criar uma reserva de emergência:** 6-12 meses de despesas

## Passo 2: Defina seus objetivos

Pergunte-se:
- Para que estou investindo?
- Qual o prazo?
- Quanto risco posso aceitar?

### Exemplos de objetivos:

| Objetivo | Prazo | Risco |
|----------|-------|-------|
| Reserva de emergência | Curto | Baixo |
| Viagem | Médio | Baixo/Médio |
| Aposentadoria | Longo | Médio/Alto |

## Passo 3: Conheça os tipos de investimento

### Renda Fixa
- Tesouro Direto
- CDBs
- LCIs/LCAs

### Renda Variável
- Ações
- Fundos Imobiliários
- ETFs

## Passo 4: Abra conta em uma corretora

Escolha uma corretora confiável e com boas taxas. Principais opções no Brasil:
- XP Investimentos
- Rico
- NuInvest
- BTG Pactual

## Passo 5: Comece pequeno e aprenda

1. Invista valores que não comprometam seu orçamento
2. Diversifique desde o início
3. Estude continuamente
4. Não tente "ficar rico rápido"

## Erros comuns a evitar

- Investir sem reserva de emergência
- Seguir dicas de "gurus" sem questionar
- Não diversificar
- Vender no pânico
- Não ter paciência

## Conclusão

Investir é uma maratona, não uma corrida de 100 metros. Comece hoje, mesmo que com pouco, e deixe o tempo trabalhar a seu favor.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*
    `,
  },
};

export default function ArtigoDetalhes() {
  const { slug } = useParams<{ slug: string }>();

  const { data: dbArticle, isLoading } = trpc.articles.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Use database article if available, otherwise use sample content
  const article = dbArticle || (slug ? sampleArticleContent[slug] : null);

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link href="/artigos">Ver todos os artigos</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const categoryInfo = categories[article.category as keyof typeof categories] || categories.iniciante;
  const CategoryIcon = categoryInfo.icon;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/artigos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para artigos
            </Link>
          </Button>

          {/* Article header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`flex items-center gap-1 text-sm ${categoryInfo.color}`}>
                <CategoryIcon className="h-4 w-4" />
                {categoryInfo.name}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min de leitura
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.views.toLocaleString()} visualizações
              </span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Article content */}
          <Card className="mb-8">
            <CardContent className="pt-6 prose prose-neutral dark:prose-invert max-w-none">
              <Streamdown>
                {"content" in article ? article.content : (article as any).content || ""}
              </Streamdown>
            </CardContent>
          </Card>

          {/* Share and actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={shareArticle}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/artigos">Mais artigos</Link>
              </Button>
              <Button asChild>
                <Link href="/premium">Assinar Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

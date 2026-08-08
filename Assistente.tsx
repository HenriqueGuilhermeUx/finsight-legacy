import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Sparkles,
  Info,
  User,
  Bot,
  Lightbulb,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";
import { Crown, Lock } from "lucide-react";
import { Link } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "O cenário atual favorece renda fixa ou variável?",
  "Compare os principais bancos brasileiros",
  "Como os juros impactam o mercado de ações?",
  "Qual a diferença entre P/L e P/VP?",
  "O que é o índice Sharpe?",
  "Como funciona o dividend yield?",
];

// Mock AI responses based on keywords
const generateAIResponse = (question: string): string => {
  const q = question.toLowerCase();
  
  if (q.includes("renda fixa") || q.includes("renda variável") || q.includes("cenário")) {
    return `**Análise do Cenário Atual**

Com base nos dados macroeconômicos atuais:

**Taxa Selic:** 13,75% ao ano
**Inflação (IPCA):** 4,82%
**Taxa Real:** ~8,93%

O cenário atual apresenta características favoráveis para **renda fixa**, considerando:

1. **Juros Reais Elevados:** Com a Selic em 13,75% e inflação em 4,82%, os juros reais estão em patamares historicamente atrativos.

2. **Risco-Retorno:** Títulos públicos e CDBs oferecem retornos expressivos com baixo risco de crédito.

3. **Renda Variável:** Pode ser interessante para exposição de longo prazo, especialmente em empresas com fundamentos sólidos e dividend yield elevado.

**Sugestão de Alocação (perfil moderado):**
- 60% Renda Fixa (Tesouro IPCA+, CDBs)
- 30% Renda Variável (ações de valor, FIIs)
- 10% Reserva de liquidez

*Esta análise é baseada em dados públicos e não constitui recomendação de investimento.*`;
  }
  
  if (q.includes("banco") || q.includes("itaú") || q.includes("bradesco") || q.includes("santander")) {
    return `**Comparativo: Principais Bancos Brasileiros**

| Indicador | ITUB4 | BBDC4 | SANB11 | BBAS3 |
|-----------|-------|-------|--------|-------|
| P/L | 8,5 | 7,8 | 6,2 | 5,1 |
| P/VP | 1,8 | 1,2 | 1,0 | 0,9 |
| ROE | 18,2% | 12,5% | 14,8% | 21,3% |
| Dividend Yield | 4,5% | 6,2% | 5,8% | 8,2% |

**Destaques:**

- **Itaú (ITUB4):** Maior banco privado, ROE consistente, múltiplos mais elevados refletem qualidade percebida.

- **Bradesco (BBDC4):** Recuperação em andamento, múltiplos descontados podem representar oportunidade.

- **Banco do Brasil (BBAS3):** Melhor ROE do setor, dividend yield atrativo, mas exposição a risco político.

- **Santander (SANB11):** Posição intermediária, foco em varejo de alta renda.

*Dados fundamentalistas são de fontes públicas. Análise não constitui recomendação.*`;
  }
  
  if (q.includes("juros") || q.includes("selic") || q.includes("impacta")) {
    return `**Como os Juros Impactam o Mercado de Ações**

A taxa de juros é uma das variáveis mais importantes para o mercado de ações. Veja como:

**1. Custo de Oportunidade**
Juros altos tornam a renda fixa mais atrativa, reduzindo o apetite por risco em ações.

**2. Valuation (Fluxo de Caixa Descontado)**
Taxas maiores aumentam a taxa de desconto, reduzindo o valor presente das empresas.

**3. Custo da Dívida**
Empresas alavancadas sofrem com aumento das despesas financeiras.

**4. Consumo e Crédito**
Juros altos reduzem consumo e crédito, impactando receitas de empresas cíclicas.

**Setores mais sensíveis:**
- Varejo
- Construção Civil
- Small Caps em geral

**Setores mais resilientes:**
- Utilities (energia, saneamento)
- Bancos (spread pode aumentar)
- Exportadoras

*Esta é uma análise educacional baseada em teoria financeira.*`;
  }
  
  if (q.includes("p/l") || q.includes("p/vp") || q.includes("preço/lucro")) {
    return `**P/L vs P/VP: Entenda a Diferença**

**P/L (Preço/Lucro)**
- Mede quantos anos de lucro seriam necessários para "pagar" o preço da ação
- P/L = Preço da Ação ÷ Lucro por Ação
- P/L baixo pode indicar empresa barata ou problemas
- P/L alto pode indicar expectativa de crescimento

**P/VP (Preço/Valor Patrimonial)**
- Compara o preço de mercado com o patrimônio líquido
- P/VP = Preço da Ação ÷ Valor Patrimonial por Ação
- P/VP < 1 significa que a empresa vale menos que seu patrimônio
- Útil para bancos e empresas intensivas em capital

**Quando usar cada um:**
- P/L: Empresas lucrativas e estáveis
- P/VP: Bancos, seguradoras, holdings
- Ambos: Análise comparativa setorial

*Indicadores devem ser analisados em conjunto, nunca isoladamente.*`;
  }
  
  if (q.includes("sharpe") || q.includes("índice")) {
    return `**Índice Sharpe: O que é e como interpretar**

O Índice Sharpe mede o retorno ajustado ao risco de um investimento.

**Fórmula:**
Sharpe = (Retorno do Ativo - Taxa Livre de Risco) ÷ Volatilidade

**Interpretação:**
- **Sharpe > 1:** Excelente relação risco-retorno
- **Sharpe 0,5 - 1:** Boa relação
- **Sharpe < 0,5:** Relação questionável
- **Sharpe < 0:** Retorno inferior à renda fixa

**Exemplo Prático:**
- Ativo A: Retorno 15%, Volatilidade 20%, Selic 13%
- Sharpe = (15% - 13%) ÷ 20% = 0,10

Neste caso, o risco assumido não compensou o retorno adicional sobre a renda fixa.

*O Sharpe é útil para comparar estratégias, mas não deve ser o único critério.*`;
  }
  
  if (q.includes("dividend") || q.includes("dividendo")) {
    return `**Dividend Yield: Guia Completo**

**O que é:**
Dividend Yield = Dividendos por Ação ÷ Preço da Ação × 100

**Como interpretar:**
- Indica quanto a empresa paga em dividendos em relação ao preço
- DY alto pode ser atrativo, mas requer análise

**Cuidados importantes:**
1. DY alto por queda de preço pode indicar problemas
2. Dividendos passados não garantem futuros
3. Empresas em crescimento tendem a ter DY menor

**Setores com alto DY no Brasil:**
- Bancos: 4-8%
- Utilities: 5-10%
- FIIs: 8-12%

**Estratégia de Dividendos:**
Busque empresas com:
- Histórico consistente de pagamentos
- Payout sustentável (< 80%)
- Fundamentos sólidos

*Dividendos são apenas uma forma de retorno. Considere também valorização.*`;
  }
  
  return `Obrigado pela sua pergunta sobre "${question}".

Com base nos dados disponíveis, posso oferecer a seguinte análise:

**Contexto Geral:**
O mercado financeiro brasileiro apresenta características específicas que devem ser consideradas em qualquer análise. A taxa Selic em 13,75% e a inflação controlada em torno de 4,8% criam um ambiente de juros reais elevados.

**Considerações:**
1. Sempre analise múltiplos indicadores em conjunto
2. Compare ativos dentro do mesmo setor
3. Considere o cenário macroeconômico
4. Avalie seu perfil de risco e horizonte de investimento

**Próximos Passos:**
- Utilize o **Radar de Ativos** para análise fundamentalista
- Teste estratégias no **Simulador** antes de investir
- Acompanhe o **Painel Macro** para contexto econômico

*Esta análise é educacional e não constitui recomendação de investimento. Consulte um profissional certificado para decisões financeiras.*`;
};

const FREE_QUESTIONS_LIMIT = 5;
const PRO_QUESTIONS_LIMIT = 100;

export default function Assistente() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionsToday, setQuestionsToday] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const isPremium = user?.subscriptionStatus === "pro" || user?.subscriptionStatus === "enterprise";
  const questionsLimit = isPremium ? PRO_QUESTIONS_LIMIT : FREE_QUESTIONS_LIMIT;
  const questionsRemaining = questionsLimit - questionsToday;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Check question limit
    if (questionsToday >= questionsLimit) {
      return;
    }
    
    setQuestionsToday(prev => prev + 1);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Assistente Financeiro</h1>
            <p className="text-muted-foreground">
              Tire suas dúvidas sobre investimentos com um assistente inteligente baseado em dados reais.
            </p>
          </div>

          {/* Chat Container */}
          <Card className="h-[600px] flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Como posso ajudar?</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md">
                    Faça perguntas sobre o mercado financeiro, indicadores, estratégias de investimento e muito mais.
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                    {suggestedQuestions.slice(0, 4).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => sendMessage(question)}
                      >
                        <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                        <span className="text-sm">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-card border border-border rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua pergunta sobre investimentos..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  O assistente analisa dados, mas não fornece recomendações de investimento.
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${questionsRemaining <= 1 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {questionsRemaining}/{questionsLimit} perguntas restantes
                  </span>
                  {!isPremium && (
                    <Link href="/premium">
                      <span className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                        <Crown className="h-3 w-3" />
                        Upgrade
                      </span>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Premium upgrade prompt when limit reached */}
              {questionsToday >= questionsLimit && !isPremium && (
                <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Limite diário atingido</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Você usou suas {FREE_QUESTIONS_LIMIT} perguntas gratuitas de hoje.
                  </p>
                  <Link href="/premium">
                    <button className="mt-2 text-xs bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1 rounded font-medium hover:from-amber-600 hover:to-yellow-500">
                      Desbloquear 100 perguntas/dia
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

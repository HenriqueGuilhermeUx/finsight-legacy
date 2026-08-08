import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Wallet,
  Building2,
  Coins,
  ArrowRight,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: 'iniciante' | 'intermediario' | 'avancado';
  duration: string;
  lessons: Lesson[];
  progress: number;
}

const COURSES: Course[] = [
  {
    id: 'fundamentos',
    title: 'Fundamentos do Mercado',
    description: 'Aprenda os conceitos básicos para começar a investir com segurança',
    icon: <BookOpen className="h-6 w-6" />,
    level: 'iniciante',
    duration: '2h 30min',
    progress: 0,
    lessons: [
      {
        id: 'f1',
        title: 'O que são ações e como funcionam',
        duration: '15 min',
        completed: false,
        content: `# O que são Ações?

Uma **ação** representa uma pequena fração do capital social de uma empresa. Ao comprar ações, você se torna sócio da empresa, mesmo que seja uma participação mínima.

## Por que empresas emitem ações?

As empresas abrem capital (fazem IPO) para captar recursos e financiar seu crescimento. Em troca, os investidores ganham:

- **Direito a dividendos**: parte do lucro distribuída aos acionistas
- **Valorização**: se a empresa cresce, suas ações tendem a valer mais
- **Voto em assembleias**: dependendo do tipo de ação

## Tipos de Ações

### Ações Ordinárias (ON) - Terminam em 3
- Dão direito a voto nas assembleias
- Exemplo: PETR3, VALE3, ITUB3

### Ações Preferenciais (PN) - Terminam em 4
- Prioridade no recebimento de dividendos
- Geralmente não têm direito a voto
- Exemplo: PETR4, ITUB4, BBDC4

## Como ganhar dinheiro com ações?

1. **Dividendos**: receba parte do lucro periodicamente
2. **Valorização**: compre barato e venda mais caro
3. **Juros sobre Capital Próprio (JCP)**: similar aos dividendos

## Riscos

- O preço pode cair e você pode perder dinheiro
- Empresas podem falir
- Volatilidade do mercado

**Dica**: Nunca invista dinheiro que você pode precisar no curto prazo!`,
      },
      {
        id: 'f2',
        title: 'Entendendo a B3 e o Home Broker',
        duration: '12 min',
        completed: false,
        content: `# A B3 e o Home Broker

## O que é a B3?

A **B3** (Brasil, Bolsa, Balcão) é a única bolsa de valores do Brasil. É onde são negociadas:

- Ações de empresas
- Fundos Imobiliários (FIIs)
- ETFs
- Derivativos (opções e futuros)
- BDRs

## Como funciona o pregão?

O pregão da B3 funciona das 10h às 17h (horário de Brasília), com after-market até 18h.

Durante esse período, compradores e vendedores enviam ordens que são casadas automaticamente pelo sistema.

## O que é Home Broker?

O **Home Broker** é a plataforma online da sua corretora que permite:

- Comprar e vender ativos
- Acompanhar cotações em tempo real
- Analisar gráficos
- Gerenciar sua carteira

## Tipos de Ordens

### Ordem a Mercado
Executa imediatamente pelo melhor preço disponível.

### Ordem Limitada
Você define o preço máximo (compra) ou mínimo (venda).

### Ordem Stop
Dispara automaticamente quando o preço atinge um valor definido.

## Custos de Operação

- **Corretagem**: taxa cobrada pela corretora (muitas oferecem taxa zero)
- **Emolumentos**: taxa da B3 (cerca de 0,03%)
- **ISS**: imposto sobre serviços

## Dica Importante

Antes de operar, pratique em simuladores ou com valores pequenos para entender como funciona!`,
      },
      {
        id: 'f3',
        title: 'Dividendos e JCP explicados',
        duration: '10 min',
        completed: false,
        content: `# Dividendos e JCP

## O que são Dividendos?

**Dividendos** são a parte do lucro líquido que a empresa distribui aos acionistas. No Brasil, empresas são obrigadas a distribuir no mínimo 25% do lucro.

## Dividend Yield (DY)

O **Dividend Yield** mostra quanto você recebe de dividendos em relação ao preço da ação:

\`\`\`
DY = (Dividendos por Ação / Preço da Ação) × 100
\`\`\`

**Exemplo**: Se uma ação custa R$ 50 e paga R$ 5 de dividendos por ano, o DY é 10%.

## O que é JCP?

**Juros sobre Capital Próprio (JCP)** é outra forma de distribuir lucros, com benefício fiscal para a empresa.

### Diferenças:

| Aspecto | Dividendos | JCP |
|---------|-----------|-----|
| IR para investidor | Isento | 15% na fonte |
| Benefício para empresa | Não dedutível | Dedutível do IR |

## Datas Importantes

- **Data Com**: último dia para comprar e ter direito ao provento
- **Data Ex**: primeiro dia que a ação negocia sem o direito
- **Data de Pagamento**: quando o dinheiro cai na conta

## Estratégia de Dividendos

Muitos investidores focam em empresas que pagam dividendos consistentes para gerar renda passiva. Setores conhecidos por bons dividendos:

- Bancos
- Utilities (energia, saneamento)
- Seguradoras
- Telecomunicações`,
      },
      {
        id: 'f4',
        title: 'FIIs: Fundos Imobiliários',
        duration: '15 min',
        completed: false,
        content: `# Fundos Imobiliários (FIIs)

## O que são FIIs?

**FIIs** são fundos que investem em imóveis ou títulos imobiliários. Ao comprar cotas, você se torna "dono" de uma fração dos imóveis do fundo.

## Vantagens dos FIIs

1. **Renda mensal**: distribuem 95% dos rendimentos
2. **Isenção de IR**: dividendos isentos para pessoa física
3. **Diversificação**: acesso a vários imóveis com pouco dinheiro
4. **Liquidez**: negocie na bolsa como ações
5. **Gestão profissional**: especialistas cuidam dos imóveis

## Tipos de FIIs

### Fundos de Tijolo
Investem em imóveis físicos:
- **Logística**: galpões e centros de distribuição
- **Shopping**: participação em shopping centers
- **Lajes corporativas**: escritórios comerciais
- **Hospitais, escolas, agências bancárias**

### Fundos de Papel
Investem em títulos imobiliários:
- CRI (Certificados de Recebíveis Imobiliários)
- LCI (Letras de Crédito Imobiliário)

### Fundos de Fundos (FOFs)
Investem em cotas de outros FIIs.

## Indicadores Importantes

- **P/VP**: Preço/Valor Patrimonial (ideal próximo de 1)
- **DY**: Dividend Yield (rendimento mensal)
- **Vacância**: % de imóveis desocupados (quanto menor, melhor)

## Riscos

- Vacância alta
- Inadimplência de inquilinos
- Desvalorização dos imóveis
- Risco de crédito (fundos de papel)`,
      },
      {
        id: 'f5',
        title: 'ETFs e diversificação',
        duration: '12 min',
        completed: false,
        content: `# ETFs: Fundos de Índice

## O que são ETFs?

**ETF** (Exchange Traded Fund) é um fundo que replica um índice e é negociado na bolsa como uma ação.

## Vantagens

1. **Diversificação instantânea**: uma cota = várias empresas
2. **Baixo custo**: taxas menores que fundos tradicionais
3. **Transparência**: você sabe exatamente o que está comprando
4. **Liquidez**: compre e venda a qualquer momento

## Principais ETFs no Brasil

### Renda Variável Brasil
- **BOVA11**: replica o Ibovespa
- **SMAL11**: small caps brasileiras
- **DIVO11**: empresas pagadoras de dividendos

### Renda Variável EUA
- **IVVB11**: replica o S&P 500
- **NASD11**: replica o Nasdaq 100

### Renda Fixa
- **IMAB11**: títulos atrelados à inflação
- **IRFM11**: títulos prefixados

### Criptomoedas
- **HASH11**: cesta de criptomoedas

## ETF vs Ações Individuais

| Aspecto | ETF | Ações |
|---------|-----|-------|
| Diversificação | Alta | Baixa (por ativo) |
| Gestão | Passiva | Você decide |
| Custos | Taxa de administração | Só corretagem |
| Dividendos | Reinvestidos | Pagos ao investidor |

## Estratégia com ETFs

ETFs são ideais para:
- Iniciantes que querem diversificar
- Investidores que não têm tempo para analisar empresas
- Complementar uma carteira de ações individuais`,
      },
      {
        id: 'f6',
        title: 'BDRs: Investindo no exterior',
        duration: '10 min',
        completed: false,
        content: `# BDRs: Investindo no Exterior

## O que são BDRs?

**BDR** (Brazilian Depositary Receipt) é um certificado que representa ações de empresas estrangeiras, negociado na B3.

## Como funciona?

1. Uma instituição compra ações no exterior
2. Deposita em um banco custodiante
3. Emite BDRs lastreados nessas ações
4. Você compra os BDRs na B3 em reais

## Vantagens

- Invista em Apple, Google, Amazon sem abrir conta no exterior
- Opere em reais, sem câmbio
- Mesma facilidade de comprar ações brasileiras
- Diversificação geográfica

## BDRs Populares

| BDR | Empresa | Setor |
|-----|---------|-------|
| AAPL34 | Apple | Tecnologia |
| MSFT34 | Microsoft | Tecnologia |
| AMZO34 | Amazon | E-commerce |
| GOGL34 | Alphabet (Google) | Tecnologia |
| TSLA34 | Tesla | Automotivo |
| COCA34 | Coca-Cola | Consumo |

## Tributação

- **Dividendos**: 15% de IR retido na fonte
- **Ganho de capital**: 15% sobre o lucro na venda

## Riscos

- Variação cambial (dólar sobe = BDR sobe em reais)
- Risco da empresa estrangeira
- Menor liquidez que ações brasileiras

## Dica

BDRs são ótimos para diversificar internacionalmente sem a complexidade de abrir conta em corretora estrangeira!`,
      },
    ],
  },
  {
    id: 'analise-fundamentalista',
    title: 'Análise Fundamentalista',
    description: 'Aprenda a avaliar empresas pelos seus fundamentos e indicadores',
    icon: <BarChart3 className="h-6 w-6" />,
    level: 'intermediario',
    duration: '3h 45min',
    progress: 0,
    lessons: [
      {
        id: 'af1',
        title: 'Indicadores de Rentabilidade (ROE, ROIC, ROA)',
        duration: '20 min',
        completed: false,
        content: `# Indicadores de Rentabilidade

## Por que são importantes?

Indicadores de rentabilidade mostram a eficiência da empresa em gerar lucro. São fundamentais para comparar empresas e identificar as mais eficientes.

## ROE (Return on Equity)

**Retorno sobre o Patrimônio Líquido**

\`\`\`
ROE = (Lucro Líquido / Patrimônio Líquido) × 100
\`\`\`

### Interpretação:
- ROE > 15%: Bom
- ROE > 20%: Excelente
- ROE < 10%: Atenção

### Exemplo:
Se uma empresa tem PL de R$ 100 milhões e lucra R$ 20 milhões, seu ROE é 20%.

## ROIC (Return on Invested Capital)

**Retorno sobre o Capital Investido**

\`\`\`
ROIC = NOPAT / Capital Investido
\`\`\`

Onde:
- NOPAT = Lucro operacional após impostos
- Capital Investido = PL + Dívida Líquida

### Por que usar ROIC?
O ROIC é mais completo que o ROE porque considera tanto o capital próprio quanto o de terceiros.

## ROA (Return on Assets)

**Retorno sobre os Ativos**

\`\`\`
ROA = (Lucro Líquido / Ativo Total) × 100
\`\`\`

### Quando usar?
Útil para comparar empresas com diferentes níveis de alavancagem.

## Comparativo

| Indicador | Foco | Melhor para |
|-----------|------|-------------|
| ROE | Capital dos sócios | Comparar empresas similares |
| ROIC | Todo capital investido | Análise mais completa |
| ROA | Todos os ativos | Setores intensivos em ativos |`,
      },
      {
        id: 'af2',
        title: 'Indicadores de Valuation (P/L, P/VP, EV/EBITDA)',
        duration: '25 min',
        completed: false,
        content: `# Indicadores de Valuation

## O que é Valuation?

**Valuation** é o processo de determinar o valor justo de uma empresa ou ação. Os múltiplos ajudam a identificar se uma ação está cara ou barata.

## P/L (Preço/Lucro)

\`\`\`
P/L = Preço da Ação / Lucro por Ação (LPA)
\`\`\`

### Interpretação:
- P/L 10 = 10 anos de lucro para recuperar o investimento
- P/L baixo pode indicar oportunidade OU problemas
- Compare sempre com empresas do mesmo setor

### Referências:
- P/L < 10: Pode estar barata
- P/L 10-15: Preço justo
- P/L > 20: Pode estar cara

## P/VP (Preço/Valor Patrimonial)

\`\`\`
P/VP = Preço da Ação / Valor Patrimonial por Ação
\`\`\`

### Interpretação:
- P/VP < 1: Pagando menos que o patrimônio
- P/VP = 1: Pagando o valor contábil
- P/VP > 1: Pagando prêmio pelo crescimento

## EV/EBITDA

\`\`\`
EV/EBITDA = Valor da Empresa / EBITDA
\`\`\`

Onde:
- EV = Valor de Mercado + Dívida Líquida

### Por que usar?
- Elimina diferenças de estrutura de capital
- Útil para comparar empresas de setores diferentes
- EV/EBITDA < 8 geralmente é atrativo

## Dividend Yield

\`\`\`
DY = (Dividendos por Ação / Preço) × 100
\`\`\`

### Referências:
- DY > 6%: Bom para renda
- DY > 10%: Verificar sustentabilidade`,
      },
      {
        id: 'af3',
        title: 'Análise de Balanço Patrimonial',
        duration: '20 min',
        completed: false,
        content: `# Análise de Balanço Patrimonial

## Estrutura do Balanço

O balanço patrimonial mostra a "fotografia" financeira da empresa em um momento específico.

### Ativo (o que a empresa TEM)
- **Ativo Circulante**: caixa, estoques, contas a receber
- **Ativo Não Circulante**: imóveis, máquinas, investimentos

### Passivo (o que a empresa DEVE)
- **Passivo Circulante**: dívidas de curto prazo
- **Passivo Não Circulante**: dívidas de longo prazo

### Patrimônio Líquido
- Capital dos sócios + Lucros acumulados

## Indicadores de Endividamento

### Dívida Líquida/EBITDA
\`\`\`
Dívida Líquida = Dívida Total - Caixa
DL/EBITDA = Dívida Líquida / EBITDA
\`\`\`

**Interpretação:**
- < 1x: Baixo endividamento
- 1-2x: Moderado
- > 3x: Alto risco

### Dívida Líquida/PL
Mostra quanto da empresa é financiada por dívida vs capital próprio.

## Liquidez Corrente

\`\`\`
LC = Ativo Circulante / Passivo Circulante
\`\`\`

**Interpretação:**
- LC > 1: Pode pagar dívidas de curto prazo
- LC < 1: Risco de liquidez

## Sinais de Alerta

⚠️ Dívida crescendo mais que receita
⚠️ Caixa diminuindo consistentemente
⚠️ Liquidez corrente < 1
⚠️ DL/EBITDA > 3x`,
      },
      {
        id: 'af4',
        title: 'DRE: Demonstração de Resultado',
        duration: '18 min',
        completed: false,
        content: `# Análise da DRE

## O que é a DRE?

A **Demonstração do Resultado do Exercício** mostra o desempenho da empresa em um período (trimestre ou ano).

## Estrutura da DRE

\`\`\`
Receita Bruta
(-) Deduções (impostos sobre vendas)
= Receita Líquida
(-) Custo dos Produtos/Serviços
= Lucro Bruto
(-) Despesas Operacionais
= Lucro Operacional (EBIT)
(+/-) Resultado Financeiro
= Lucro Antes do IR
(-) IR e CSLL
= Lucro Líquido
\`\`\`

## Margens

### Margem Bruta
\`\`\`
MB = (Lucro Bruto / Receita Líquida) × 100
\`\`\`
Mostra eficiência na produção.

### Margem EBITDA
\`\`\`
ME = (EBITDA / Receita Líquida) × 100
\`\`\`
Mostra geração de caixa operacional.

### Margem Líquida
\`\`\`
ML = (Lucro Líquido / Receita Líquida) × 100
\`\`\`
Mostra eficiência geral.

## O que analisar?

1. **Crescimento da receita**: empresa está vendendo mais?
2. **Evolução das margens**: está ficando mais eficiente?
3. **Resultado financeiro**: dívida está pesando?
4. **Consistência**: lucros são recorrentes?

## Comparativo Setorial

| Setor | Margem Líquida Típica |
|-------|----------------------|
| Bancos | 15-25% |
| Varejo | 2-5% |
| Tecnologia | 15-30% |
| Energia | 10-20% |`,
      },
      {
        id: 'af5',
        title: 'Valuation: Graham, Bazin e DCF',
        duration: '30 min',
        completed: false,
        content: `# Métodos de Valuation

## Fórmula de Graham

Benjamin Graham, o pai do value investing, criou uma fórmula simples:

\`\`\`
Preço Justo = √(22,5 × LPA × VPA)
\`\`\`

Onde:
- 22,5 = P/L máximo de 15 × P/VP máximo de 1,5
- LPA = Lucro por Ação
- VPA = Valor Patrimonial por Ação

### Quando usar?
Ideal para empresas maduras e estáveis.

## Método Bazin

Décio Bazin focava em dividendos:

\`\`\`
Preço Teto = DPA / Yield Mínimo
\`\`\`

### Exemplo:
Se uma ação paga R$ 5 de dividendos e você quer 6% de yield:
Preço Teto = 5 / 0,06 = R$ 83,33

### Quando usar?
Ideal para investidores focados em renda passiva.

## DCF (Fluxo de Caixa Descontado)

O método mais completo, projeta fluxos de caixa futuros:

\`\`\`
Valor = Σ FC/(1+r)^n + Valor Terminal
\`\`\`

Onde:
- FC = Fluxo de Caixa projetado
- r = Taxa de desconto (WACC)
- n = Período

### Passos:
1. Projete os fluxos de caixa (5-10 anos)
2. Calcule o valor terminal
3. Desconte tudo a valor presente
4. Divida pelo número de ações

### Cuidados:
- Muito sensível às premissas
- Requer conhecimento profundo da empresa

## Qual método usar?

| Método | Melhor para |
|--------|-------------|
| Graham | Empresas maduras |
| Bazin | Foco em dividendos |
| DCF | Análise completa |

**Dica**: Use múltiplos métodos e compare os resultados!`,
      },
    ],
  },
  {
    id: 'analise-tecnica',
    title: 'Análise Técnica',
    description: 'Domine gráficos, indicadores e padrões para timing de mercado',
    icon: <TrendingUp className="h-6 w-6" />,
    level: 'intermediario',
    duration: '4h',
    progress: 0,
    lessons: [
      {
        id: 'at1',
        title: 'Introdução aos Gráficos',
        duration: '15 min',
        completed: false,
        content: `# Introdução aos Gráficos

## Tipos de Gráficos

### Gráfico de Linha
- Conecta preços de fechamento
- Simples e limpo
- Bom para visão geral

### Gráfico de Barras (OHLC)
Cada barra mostra:
- Open (abertura)
- High (máxima)
- Low (mínima)
- Close (fechamento)

### Gráfico de Candlestick
O mais popular entre traders:
- **Corpo**: diferença entre abertura e fechamento
- **Sombras**: máxima e mínima
- **Verde/Branco**: fechou acima da abertura (alta)
- **Vermelho/Preto**: fechou abaixo da abertura (baixa)

## Timeframes

| Timeframe | Uso |
|-----------|-----|
| 1min, 5min | Day trade |
| 15min, 1h | Swing trade curto |
| Diário | Swing trade |
| Semanal | Position trade |
| Mensal | Longo prazo |

## Conceitos Básicos

### Tendência de Alta
- Topos e fundos ascendentes
- Preço acima das médias móveis

### Tendência de Baixa
- Topos e fundos descendentes
- Preço abaixo das médias móveis

### Mercado Lateral
- Preço oscila em uma faixa
- Sem direção definida`,
      },
      {
        id: 'at2',
        title: 'Suportes e Resistências',
        duration: '18 min',
        completed: false,
        content: `# Suportes e Resistências

## O que é Suporte?

**Suporte** é uma região de preço onde há concentração de compradores, impedindo que o preço caia mais.

### Como identificar:
- Fundos anteriores
- Médias móveis
- Números redondos
- Retrações de Fibonacci

## O que é Resistência?

**Resistência** é uma região de preço onde há concentração de vendedores, impedindo que o preço suba mais.

### Como identificar:
- Topos anteriores
- Médias móveis
- Números redondos
- Extensões de Fibonacci

## Rompimentos

### Rompimento de Resistência
- Sinal de força compradora
- Pode indicar continuação da alta
- Resistência vira suporte

### Rompimento de Suporte
- Sinal de força vendedora
- Pode indicar continuação da queda
- Suporte vira resistência

## Pullback

Após um rompimento, é comum o preço voltar para testar a região rompida antes de continuar o movimento.

## Dicas Práticas

1. Quanto mais vezes testado, mais forte o nível
2. Volume alto no rompimento confirma o movimento
3. Espere o pullback para entrar com menor risco
4. Use stop loss abaixo do suporte (compra) ou acima da resistência (venda)`,
      },
      {
        id: 'at3',
        title: 'Médias Móveis',
        duration: '20 min',
        completed: false,
        content: `# Médias Móveis

## O que são?

**Médias móveis** suavizam os preços calculando a média de um período, ajudando a identificar tendências.

## Tipos de Médias

### Média Móvel Simples (SMA)
Soma dos preços / Número de períodos

### Média Móvel Exponencial (EMA)
Dá mais peso aos preços recentes, reagindo mais rápido.

## Períodos Comuns

| Período | Uso |
|---------|-----|
| 9 | Curto prazo |
| 21 | Curto/médio prazo |
| 50 | Médio prazo |
| 200 | Longo prazo |

## Estratégias

### Preço vs Média
- Preço acima da MM = tendência de alta
- Preço abaixo da MM = tendência de baixa

### Cruzamento de Médias
- MM curta cruza acima da longa = sinal de compra
- MM curta cruza abaixo da longa = sinal de venda

### Golden Cross
MM50 cruza acima da MM200 = forte sinal de alta

### Death Cross
MM50 cruza abaixo da MM200 = forte sinal de baixa

## Dicas

1. Use múltiplas médias para confirmar
2. Médias funcionam melhor em tendências
3. Em mercado lateral, geram muitos sinais falsos
4. Combine com outros indicadores`,
      },
      {
        id: 'at4',
        title: 'RSI e MACD',
        duration: '22 min',
        completed: false,
        content: `# RSI e MACD

## RSI (Índice de Força Relativa)

O RSI mede a velocidade e magnitude dos movimentos de preço, variando de 0 a 100.

### Fórmula:
\`\`\`
RSI = 100 - (100 / (1 + RS))
RS = Média de Ganhos / Média de Perdas
\`\`\`

### Interpretação:
- RSI > 70: Sobrecomprado (possível correção)
- RSI < 30: Sobrevendido (possível recuperação)
- RSI = 50: Neutro

### Divergências:
- **Divergência de Alta**: Preço faz fundo menor, RSI faz fundo maior
- **Divergência de Baixa**: Preço faz topo maior, RSI faz topo menor

## MACD

O MACD mostra a relação entre duas médias móveis exponenciais.

### Componentes:
- **Linha MACD**: EMA(12) - EMA(26)
- **Linha de Sinal**: EMA(9) do MACD
- **Histograma**: MACD - Sinal

### Sinais:
- MACD cruza acima do Sinal = Compra
- MACD cruza abaixo do Sinal = Venda
- Histograma positivo = Força compradora
- Histograma negativo = Força vendedora

## Combinando RSI e MACD

1. RSI sobrevendido + MACD cruzando para cima = Forte sinal de compra
2. RSI sobrecomprado + MACD cruzando para baixo = Forte sinal de venda
3. Divergências em ambos = Sinal muito forte`,
      },
    ],
  },
];

export default function Cursos() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediario': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'avancado': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return level;
    }
  };

  const currentCourse = COURSES.find(c => c.id === selectedCourse);
  const currentLesson = currentCourse?.lessons.find(l => l.id === selectedLesson);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Cursos e Trilhas</h1>
        </div>
        <p className="text-muted-foreground">
          Aprenda sobre investimentos com conteúdo estruturado e progressivo
        </p>
      </div>

      {!selectedLesson ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{COURSES.length}</div>
                <div className="text-sm text-muted-foreground">Cursos disponíveis</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">
                  {COURSES.reduce((acc, c) => acc + c.lessons.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Aulas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">10h+</div>
                <div className="text-sm text-muted-foreground">De conteúdo</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-500">Grátis</div>
                <div className="text-sm text-muted-foreground">100% gratuito</div>
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div className="space-y-4">
            {COURSES.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <Badge variant="outline" className={getLevelColor(course.level)}>
                          {getLevelLabel(course.level)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons.length} aulas
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expandedCourses.has(course.id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedCourses.has(course.id) && (
                  <div className="border-t px-6 py-4 bg-muted/30">
                    <div className="space-y-2">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-background cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedCourse(course.id);
                            setSelectedLesson(lesson.id);
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                          </div>
                          <Play className="h-4 w-4 text-primary" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Lesson View */
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedLesson(null);
              setSelectedCourse(null);
            }}
          >
            ← Voltar aos cursos
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{currentCourse?.title}</span>
                <span>•</span>
                <span>{currentLesson?.duration}</span>
              </div>
              <CardTitle>{currentLesson?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {currentLesson?.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold mt-5 mb-3">{line.slice(3)}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
                    }
                    if (line.startsWith('```')) {
                      return null;
                    }
                    if (line.startsWith('|')) {
                      return <p key={i} className="font-mono text-xs bg-muted p-1 my-1">{line}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4 my-1">{line.slice(2)}</li>;
                    }
                    if (line.startsWith('⚠️')) {
                      return <p key={i} className="text-yellow-500 my-2">{line}</p>;
                    }
                    if (line.trim() === '') {
                      return <br key={i} />;
                    }
                    return <p key={i} className="my-2">{line}</p>;
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button variant="outline" disabled>
                  Aula Anterior
                </Button>
                <Button>
                  Próxima Aula
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

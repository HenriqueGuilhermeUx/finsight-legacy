import { drizzle } from "drizzle-orm/mysql2";
import { articles } from "../drizzle/schema.ts";

const additionalArticles = [
  {
    slug: "analise-tecnica-avancada-indicadores",
    title: "Análise Técnica Avançada: Dominando os Indicadores",
    summary: "Aprenda a usar RSI, MACD, Bandas de Bollinger e outros indicadores técnicos para identificar oportunidades de trading.",
    content: `# Análise Técnica Avançada: Dominando os Indicadores

A análise técnica é uma metodologia que utiliza gráficos e indicadores matemáticos para prever movimentos futuros de preços. Neste artigo, vamos explorar os principais indicadores usados por traders profissionais.

## RSI (Índice de Força Relativa)

O RSI mede a velocidade e magnitude das mudanças de preço. Varia de 0 a 100:
- **Acima de 70**: Ativo sobrecomprado (possível queda)
- **Abaixo de 30**: Ativo sobrevendido (possível alta)

### Como usar o RSI
1. Identifique divergências entre preço e RSI
2. Combine com suportes e resistências
3. Use em conjunto com outros indicadores

## MACD (Convergência/Divergência de Médias Móveis)

O MACD é composto por:
- **Linha MACD**: Diferença entre EMA 12 e EMA 26
- **Linha de Sinal**: EMA 9 da linha MACD
- **Histograma**: Diferença entre as duas linhas

### Sinais do MACD
- Cruzamento para cima: sinal de compra
- Cruzamento para baixo: sinal de venda
- Divergências: possível reversão de tendência

## Bandas de Bollinger

As Bandas de Bollinger consistem em:
- Banda superior: Média móvel + 2 desvios padrão
- Banda média: Média móvel de 20 períodos
- Banda inferior: Média móvel - 2 desvios padrão

### Interpretação
- Preço tocando banda superior: possível resistência
- Preço tocando banda inferior: possível suporte
- Estreitamento das bandas: volatilidade baixa, possível movimento forte

## Fibonacci

Os níveis de Fibonacci são usados para identificar suportes e resistências:
- 23.6%
- 38.2%
- 50%
- 61.8%
- 78.6%

### Aplicação prática
1. Identifique um movimento significativo (alta ou baixa)
2. Trace os níveis de Fibonacci
3. Use os níveis como pontos de entrada/saída

## Combinando Indicadores

A chave para o sucesso na análise técnica é combinar múltiplos indicadores:

1. **Tendência**: Use médias móveis para identificar a direção
2. **Momentum**: RSI ou MACD para timing
3. **Volatilidade**: Bandas de Bollinger para stops
4. **Suporte/Resistência**: Fibonacci para alvos

## Conclusão

A análise técnica é uma ferramenta poderosa, mas não é infalível. Sempre:
- Use stop loss
- Gerencie seu risco
- Não dependa de um único indicador
- Pratique em conta demo antes de operar com dinheiro real

**Disclaimer**: Este artigo é apenas educacional e não constitui recomendação de investimento.`,
    category: "tecnica",
    authorName: "Equipe FinSight",
    readTime: 12,
    isPublished: true,
  },
  {
    slug: "dividendos-renda-passiva-guia-completo",
    title: "Dividendos e Renda Passiva: Guia Completo para Investidores",
    summary: "Descubra como construir uma carteira de dividendos sólida e gerar renda passiva consistente ao longo do tempo.",
    content: `# Dividendos e Renda Passiva: Guia Completo

Investir em ações que pagam dividendos é uma das estratégias mais populares para construir renda passiva. Neste guia, você aprenderá tudo sobre dividendos.

## O que são Dividendos?

Dividendos são a parcela do lucro que as empresas distribuem aos acionistas. No Brasil, as empresas são obrigadas a distribuir pelo menos 25% do lucro líquido.

### Tipos de Proventos
- **Dividendos**: Isentos de IR para pessoa física
- **JCP (Juros sobre Capital Próprio)**: Tributados em 15% na fonte
- **Bonificações**: Distribuição de novas ações

## Indicadores Importantes

### Dividend Yield (DY)
\`\`\`
DY = (Dividendos por Ação / Preço da Ação) × 100
\`\`\`

Um DY de 6% significa que você recebe 6% do valor investido em dividendos por ano.

### Payout Ratio
\`\`\`
Payout = (Dividendos Pagos / Lucro Líquido) × 100
\`\`\`

Indica quanto do lucro é distribuído. Payout muito alto pode ser insustentável.

### Dividend Growth Rate
Taxa de crescimento dos dividendos ao longo do tempo. Empresas que aumentam dividendos consistentemente são preferíveis.

## Setores com Bons Dividendos

### Utilities (Energia Elétrica)
- Receita previsível
- Contratos de longo prazo
- Exemplos: TAEE11, EGIE3, CMIG4

### Bancos
- Lucros consistentes
- Alta geração de caixa
- Exemplos: BBAS3, ITUB4, BBDC4

### Telecomunicações
- Receita recorrente
- Baixa necessidade de investimento
- Exemplos: VIVT3

### Seguradoras
- Float (dinheiro dos prêmios)
- Baixa ciclicidade
- Exemplos: BBSE3

## Estratégia de Reinvestimento

O poder dos juros compostos aplicado aos dividendos:

| Ano | Investimento | Dividendos (6%) | Total |
|-----|--------------|-----------------|-------|
| 1   | R$ 10.000    | R$ 600          | R$ 10.600 |
| 5   | R$ 10.000    | R$ 3.382        | R$ 13.382 |
| 10  | R$ 10.000    | R$ 7.908        | R$ 17.908 |
| 20  | R$ 10.000    | R$ 22.071       | R$ 32.071 |

## Como Montar uma Carteira de Dividendos

### 1. Diversificação
- Mínimo 10-15 empresas
- Diferentes setores
- Diferentes tamanhos

### 2. Critérios de Seleção
- DY consistente (não apenas alto)
- Histórico de pagamentos
- Payout sustentável (< 80%)
- Crescimento de lucros

### 3. Acompanhamento
- Revise trimestralmente
- Acompanhe resultados
- Rebalanceie quando necessário

## Armadilhas a Evitar

1. **DY muito alto**: Pode indicar queda no preço ou distribuição insustentável
2. **Empresa em declínio**: Dividendos passados não garantem futuros
3. **Concentração excessiva**: Não coloque tudo em um setor
4. **Ignorar fundamentos**: Dividendos são consequência de bons resultados

## Tributação

- **Dividendos**: Isentos de IR
- **JCP**: 15% retido na fonte
- **Ganho de capital**: 15% sobre lucro na venda

## Conclusão

Investir em dividendos é uma estratégia de longo prazo. Foque em:
- Empresas de qualidade
- Reinvestimento consistente
- Paciência e disciplina

**Disclaimer**: Este artigo é apenas educacional e não constitui recomendação de investimento.`,
    category: "fundamentalista",
    authorName: "Equipe FinSight",
    readTime: 15,
    isPublished: true,
  },
  {
    slug: "diversificacao-carteira-alocacao-ativos",
    title: "Diversificação de Carteira: A Arte da Alocação de Ativos",
    summary: "Aprenda a construir uma carteira diversificada que equilibra risco e retorno de acordo com seu perfil de investidor.",
    content: `# Diversificação de Carteira: A Arte da Alocação de Ativos

"Não coloque todos os ovos na mesma cesta" - este ditado resume a essência da diversificação. Neste artigo, você aprenderá como construir uma carteira equilibrada.

## Por que Diversificar?

A diversificação reduz o risco sem necessariamente reduzir o retorno esperado. Isso acontece porque diferentes ativos reagem de formas diferentes aos mesmos eventos.

### Correlação entre Ativos
- **Correlação +1**: Ativos se movem juntos
- **Correlação 0**: Movimentos independentes
- **Correlação -1**: Movimentos opostos

O ideal é combinar ativos com baixa correlação.

## Classes de Ativos

### Renda Fixa
- Tesouro Direto
- CDBs
- LCIs/LCAs
- Debêntures

### Renda Variável
- Ações
- ETFs
- BDRs
- Fundos de Ações

### Fundos Imobiliários (FIIs)
- Tijolo (imóveis físicos)
- Papel (CRIs e CRAs)
- Híbridos

### Investimentos Internacionais
- ETFs globais
- BDRs
- Fundos internacionais

### Alternativos
- Criptomoedas
- Commodities
- Private Equity

## Perfis de Investidor

### Conservador
- 70-80% Renda Fixa
- 10-20% FIIs
- 10% Ações

### Moderado
- 50% Renda Fixa
- 20% FIIs
- 30% Ações

### Arrojado
- 20-30% Renda Fixa
- 20% FIIs
- 50-60% Ações

## Estratégias de Alocação

### 1. Alocação Estratégica
Define percentuais fixos e rebalanceia periodicamente.

### 2. Alocação Tática
Ajusta percentuais baseado em condições de mercado.

### 3. Core-Satellite
- Core (70-80%): ETFs e fundos passivos
- Satellite (20-30%): Apostas específicas

## Rebalanceamento

O rebalanceamento mantém sua alocação alinhada com seus objetivos:

### Quando Rebalancear?
- Periodicamente (trimestral/semestral)
- Quando desvio > 5% do alvo
- Após eventos significativos

### Como Rebalancear?
1. Vender ativos acima do alvo
2. Comprar ativos abaixo do alvo
3. Usar novos aportes para equilibrar

## Diversificação por Setores

Dentro de ações, diversifique entre setores:

| Setor | Característica |
|-------|---------------|
| Financeiro | Sensível a juros |
| Utilities | Defensivo |
| Consumo | Cíclico |
| Tecnologia | Crescimento |
| Commodities | Inflação |

## Diversificação Geográfica

Não concentre apenas no Brasil:
- EUA: Maior mercado do mundo
- Europa: Empresas consolidadas
- Emergentes: Maior crescimento

## Erros Comuns

1. **Diversificação excessiva**: Muitos ativos diluem retornos
2. **Falsa diversificação**: Ativos correlacionados
3. **Ignorar custos**: Taxas corroem retornos
4. **Não rebalancear**: Deriva da alocação original

## Conclusão

Uma carteira bem diversificada:
- Reduz volatilidade
- Protege contra eventos específicos
- Permite dormir tranquilo

Lembre-se: diversificação não elimina risco, apenas o gerencia.

**Disclaimer**: Este artigo é apenas educacional e não constitui recomendação de investimento.`,
    category: "iniciante",
    authorName: "Equipe FinSight",
    readTime: 14,
    isPublished: true,
  },
  {
    slug: "fundos-imobiliarios-fiis-guia-iniciantes",
    title: "Fundos Imobiliários (FIIs): Guia Completo para Iniciantes",
    summary: "Entenda como funcionam os FIIs, seus tipos, vantagens e como escolher os melhores fundos para sua carteira.",
    content: `# Fundos Imobiliários (FIIs): Guia Completo

Os Fundos de Investimento Imobiliário (FIIs) permitem investir em imóveis de forma acessível e diversificada. Neste guia, você aprenderá tudo sobre essa classe de ativos.

## O que são FIIs?

FIIs são fundos que investem em empreendimentos imobiliários ou títulos relacionados ao setor. As cotas são negociadas na B3 como ações.

### Vantagens dos FIIs
- Investimento acessível (a partir de R$ 10)
- Diversificação imobiliária
- Rendimentos mensais isentos de IR
- Liquidez (compra e venda na bolsa)
- Gestão profissional

## Tipos de FIIs

### FIIs de Tijolo
Investem diretamente em imóveis físicos:

**Lajes Corporativas**
- Escritórios de alto padrão
- Exemplos: HGRE11, BRCR11

**Shoppings**
- Participação em shopping centers
- Exemplos: XPML11, VISC11

**Logística**
- Galpões e centros de distribuição
- Exemplos: HGLG11, BTLG11

**Hospitais**
- Imóveis hospitalares
- Exemplos: NSLU11

**Educacional**
- Universidades e escolas
- Exemplos: FCFL11

### FIIs de Papel
Investem em títulos imobiliários:

**CRIs (Certificados de Recebíveis Imobiliários)**
- Renda fixa atrelada a imóveis
- Exemplos: KNCR11, CPTS11

**LCIs (Letras de Crédito Imobiliário)**
- Títulos bancários

### FIIs Híbridos
Combinam tijolo e papel para diversificação.

### FOFs (Fundos de Fundos)
Investem em cotas de outros FIIs:
- Exemplos: BCFF11, KFOF11

## Indicadores Importantes

### Dividend Yield (DY)
\`\`\`
DY = (Rendimento Mensal × 12) / Preço da Cota × 100
\`\`\`

### P/VP (Preço/Valor Patrimonial)
\`\`\`
P/VP = Preço da Cota / Valor Patrimonial por Cota
\`\`\`
- P/VP < 1: Desconto
- P/VP > 1: Ágio

### Vacância
Percentual de área não alugada. Menor é melhor.

### Cap Rate
Taxa de capitalização do imóvel:
\`\`\`
Cap Rate = Receita Líquida Anual / Valor do Imóvel
\`\`\`

## Como Analisar um FII

### 1. Qualidade dos Imóveis
- Localização
- Padrão construtivo
- Idade do imóvel

### 2. Inquilinos
- Qualidade de crédito
- Diversificação
- Prazo dos contratos

### 3. Gestão
- Track record
- Taxas cobradas
- Transparência

### 4. Liquidez
- Volume negociado
- Número de cotistas

## Tributação

### Rendimentos Mensais
- **Pessoa Física**: Isentos de IR
- **Pessoa Jurídica**: Tributados

### Ganho de Capital
- 20% sobre o lucro na venda

### Requisitos para Isenção
- Fundo com mínimo 50 cotistas
- Cotas negociadas em bolsa
- Cotista com menos de 10% do fundo

## Riscos dos FIIs

1. **Vacância**: Imóveis vazios não geram renda
2. **Inadimplência**: Inquilinos não pagam
3. **Mercado**: Preço das cotas pode cair
4. **Juros**: Alta de juros desvaloriza FIIs
5. **Concentração**: Poucos imóveis ou inquilinos

## Montando uma Carteira de FIIs

### Diversificação Recomendada
- 3-5 segmentos diferentes
- 8-15 FIIs no total
- Máximo 15% em um único FII

### Exemplo de Carteira
| Segmento | Alocação |
|----------|----------|
| Logística | 25% |
| Lajes | 20% |
| Shopping | 20% |
| Papel | 25% |
| FOF | 10% |

## Conclusão

FIIs são excelentes para:
- Renda passiva mensal
- Exposição ao setor imobiliário
- Diversificação de carteira

Comece aos poucos, estude os fundos e construa sua carteira gradualmente.

**Disclaimer**: Este artigo é apenas educacional e não constitui recomendação de investimento.`,
    category: "fundamentalista",
    authorName: "Equipe FinSight",
    readTime: 16,
    isPublished: true,
  },
  {
    slug: "etfs-investir-indices-guia-completo",
    title: "ETFs: Como Investir em Índices de Forma Simples e Barata",
    summary: "Descubra como os ETFs funcionam, suas vantagens sobre fundos tradicionais e como usá-los para diversificar sua carteira.",
    content: `# ETFs: Como Investir em Índices de Forma Simples

ETFs (Exchange Traded Funds) são fundos negociados em bolsa que replicam índices. São uma das formas mais eficientes de investir.

## O que são ETFs?

ETFs são fundos que buscam replicar a performance de um índice de referência. Diferente de fundos tradicionais, são negociados na bolsa como ações.

### Vantagens dos ETFs
- **Baixo custo**: Taxas menores que fundos ativos
- **Diversificação**: Um ETF = dezenas de ativos
- **Transparência**: Composição conhecida
- **Liquidez**: Compra e venda instantânea
- **Acessibilidade**: Valores baixos para começar

## Tipos de ETFs

### ETFs de Ações
Replicam índices de ações:

**Brasil**
- BOVA11: Ibovespa
- SMAL11: Small Caps
- DIVO11: Dividendos

**EUA**
- IVVB11: S&P 500
- NASD11: Nasdaq 100
- SPXI11: S&P 500

**Global**
- ACWI11: Ações globais

### ETFs de Renda Fixa
- IMAB11: Títulos IPCA+
- IRFM11: Títulos prefixados
- FIXA11: Renda fixa diversificada

### ETFs de Criptomoedas
- HASH11: Cesta de criptos
- QBTC11: Bitcoin
- QETH11: Ethereum

### ETFs Setoriais
- FIND11: Financeiro
- MATB11: Materiais básicos
- TECK11: Tecnologia

## ETFs vs Fundos Tradicionais

| Aspecto | ETF | Fundo Tradicional |
|---------|-----|-------------------|
| Taxa de administração | 0,1% - 0,5% | 1% - 2% |
| Negociação | Bolsa (tempo real) | D+1 a D+30 |
| Valor mínimo | 1 cota (~R$10-100) | R$100 - R$5.000 |
| Transparência | Total | Parcial |
| Gestão | Passiva | Ativa ou Passiva |

## Como Escolher um ETF

### 1. Índice de Referência
Escolha o índice que faz sentido para seus objetivos:
- Ibovespa para Brasil
- S&P 500 para EUA
- MSCI World para global

### 2. Taxa de Administração
Quanto menor, melhor. Compare ETFs similares.

### 3. Liquidez
Volume diário negociado. Maior liquidez = menor spread.

### 4. Tracking Error
Diferença entre ETF e índice. Menor é melhor.

### 5. Patrimônio
Fundos maiores tendem a ser mais eficientes.

## Estratégias com ETFs

### 1. Buy and Hold
Compre e mantenha por longo prazo:
- BOVA11 + IVVB11 = Brasil + EUA
- Rebalanceie anualmente

### 2. Dollar Cost Averaging
Aportes mensais regulares:
- Reduz impacto da volatilidade
- Disciplina de investimento

### 3. Core-Satellite
- Core (80%): ETFs amplos (BOVA11, IVVB11)
- Satellite (20%): ETFs setoriais ou ações

### 4. Alocação por Idade
Regra simples: (100 - idade)% em renda variável
- 30 anos: 70% ações, 30% renda fixa
- 50 anos: 50% ações, 50% renda fixa

## Tributação

### Ganho de Capital
- Alíquota de 15% sobre lucro
- Não há isenção para vendas até R$ 20.000/mês (diferente de ações)

### Come-Cotas
ETFs de renda fixa têm come-cotas semestral (15% ou 20%)

## Principais ETFs do Brasil

| ETF | Índice | Taxa |
|-----|--------|------|
| BOVA11 | Ibovespa | 0,10% |
| IVVB11 | S&P 500 | 0,23% |
| SMAL11 | Small Caps | 0,50% |
| DIVO11 | Dividendos | 0,50% |
| HASH11 | Criptos | 0,70% |

## Montando Carteira com ETFs

### Carteira Simples (2 ETFs)
- 70% BOVA11 (Brasil)
- 30% IVVB11 (EUA)

### Carteira Diversificada (4 ETFs)
- 40% BOVA11
- 30% IVVB11
- 15% SMAL11
- 15% IMAB11

### Carteira Global (5 ETFs)
- 30% BOVA11
- 25% IVVB11
- 15% SMAL11
- 15% IMAB11
- 15% HASH11

## Conclusão

ETFs são ideais para:
- Investidores iniciantes
- Quem busca baixo custo
- Diversificação simples
- Estratégias de longo prazo

Comece com ETFs amplos e adicione complexidade conforme aprende.

**Disclaimer**: Este artigo é apenas educacional e não constitui recomendação de investimento.`,
    category: "iniciante",
    authorName: "Equipe FinSight",
    readTime: 13,
    isPublished: true,
  },
];

async function seedArticles() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set, skipping seed");
    return;
  }

  const db = drizzle(process.env.DATABASE_URL);

  for (const article of additionalArticles) {
    try {
      await db.insert(articles).values(article);
      console.log(`✓ Inserted: ${article.title}`);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`⊘ Already exists: ${article.title}`);
      } else {
        console.error(`✗ Error inserting ${article.title}:`, error.message);
      }
    }
  }

  console.log("\nSeed completed!");
  process.exit(0);
}

seedArticles();

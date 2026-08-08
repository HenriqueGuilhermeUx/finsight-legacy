import { createConnection } from 'mysql2/promise';

const newArticles = [
  {
    slug: "como-comecar-investir-bolsa-valores",
    title: "Como Começar a Investir na Bolsa de Valores: Guia Completo para Iniciantes",
    summary: "Aprenda passo a passo como dar os primeiros passos no mercado de ações, desde abrir conta em corretora até fazer sua primeira compra.",
    content: `# Como Começar a Investir na Bolsa de Valores

## Introdução

Investir na bolsa de valores pode parecer intimidador no início, mas com o conhecimento certo, qualquer pessoa pode começar. Este guia vai te mostrar o caminho desde o zero até sua primeira compra de ações.

## 1. Entenda o Básico

### O que é a Bolsa de Valores?

A bolsa de valores é um mercado organizado onde são negociadas ações de empresas, fundos imobiliários, ETFs e outros ativos. No Brasil, a principal bolsa é a B3 (Brasil, Bolsa, Balcão).

### O que são Ações?

Ações são pequenas partes de uma empresa. Quando você compra uma ação, você se torna sócio daquela empresa, mesmo que seja uma participação muito pequena.

## 2. Defina seus Objetivos

Antes de investir, pergunte-se:
- Qual é meu objetivo? (aposentadoria, comprar um imóvel, viagem)
- Qual é meu prazo? (curto, médio ou longo prazo)
- Quanto posso investir por mês?
- Qual meu perfil de risco?

## 3. Abra uma Conta em uma Corretora

### Passos para abrir conta:
1. Escolha uma corretora (XP, Rico, NuInvest, BTG, etc.)
2. Faça o cadastro online com seus documentos
3. Aguarde a aprovação (geralmente em 1-2 dias úteis)
4. Transfira dinheiro para sua conta

### O que considerar na escolha:
- Taxas de corretagem
- Plataforma de negociação
- Atendimento ao cliente
- Variedade de produtos

## 4. Estude Antes de Investir

### Análise Fundamentalista
Avalia a saúde financeira da empresa através de indicadores como:
- **P/L (Preço/Lucro)**: Quanto você paga por cada real de lucro
- **P/VP (Preço/Valor Patrimonial)**: Relação entre preço e patrimônio
- **ROE (Return on Equity)**: Rentabilidade sobre o patrimônio
- **Dividend Yield**: Porcentagem de dividendos pagos

### Análise Técnica
Estuda gráficos e padrões de preço para identificar tendências e pontos de entrada/saída.

## 5. Comece Pequeno

**Dica de ouro**: Comece com pouco dinheiro para aprender sem grandes riscos.

### Sugestões para iniciantes:
- ETFs como BOVA11 (replica o Ibovespa)
- Ações de empresas sólidas e conhecidas
- Fundos Imobiliários (FIIs) para renda mensal

## 6. Diversifique sua Carteira

Nunca coloque todos os ovos na mesma cesta. Distribua seus investimentos entre:
- Diferentes setores (bancos, energia, varejo, etc.)
- Diferentes tipos de ativos (ações, FIIs, renda fixa)
- Diferentes regiões (Brasil e exterior)

## 7. Mantenha a Disciplina

- Invista regularmente (todo mês, por exemplo)
- Não tome decisões por emoção
- Tenha paciência - investimentos são para longo prazo
- Reinvista os dividendos

## Conclusão

Investir na bolsa é uma jornada de aprendizado contínuo. Comece devagar, estude bastante e seja consistente. Com o tempo, você vai desenvolver sua própria estratégia e alcançar seus objetivos financeiros.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*`,
    category: "iniciante",
    coverImage: null,
    author: "F-Insight",
    isPublished: true
  },
  {
    slug: "indicadores-fundamentalistas-essenciais",
    title: "Os 10 Indicadores Fundamentalistas Essenciais para Avaliar Ações",
    summary: "Conheça os principais indicadores usados por investidores profissionais para analisar empresas e tomar decisões de investimento.",
    content: `# Os 10 Indicadores Fundamentalistas Essenciais

## Introdução

A análise fundamentalista é a base para investimentos de longo prazo. Conhecer os principais indicadores te ajuda a identificar empresas saudáveis e com potencial de valorização.

## 1. P/L (Preço/Lucro)

### O que é?
Mostra quantos anos levaria para recuperar o investimento com base no lucro atual.

### Como interpretar:
- **P/L baixo (< 10)**: Pode indicar ação barata ou problemas na empresa
- **P/L médio (10-20)**: Faixa considerada normal
- **P/L alto (> 20)**: Empresa cara ou com grande expectativa de crescimento

### Fórmula:
\`P/L = Preço da Ação / Lucro por Ação\`

## 2. P/VP (Preço/Valor Patrimonial)

### O que é?
Compara o preço de mercado com o valor contábil da empresa.

### Como interpretar:
- **P/VP < 1**: Ação negociada abaixo do valor patrimonial
- **P/VP = 1**: Preço igual ao valor contábil
- **P/VP > 1**: Mercado paga prêmio pelo potencial da empresa

## 3. ROE (Return on Equity)

### O que é?
Mede a rentabilidade sobre o patrimônio líquido.

### Como interpretar:
- **ROE > 15%**: Considerado bom
- **ROE > 20%**: Excelente
- Compare com empresas do mesmo setor

### Fórmula:
\`ROE = Lucro Líquido / Patrimônio Líquido × 100\`

## 4. ROIC (Return on Invested Capital)

### O que é?
Mede o retorno sobre todo capital investido (próprio + terceiros).

### Por que é importante:
- Mais completo que o ROE
- Mostra eficiência na alocação de capital
- ROIC > Custo de Capital = Criação de valor

## 5. Dividend Yield (DY)

### O que é?
Porcentagem de dividendos pagos em relação ao preço da ação.

### Como interpretar:
- **DY > 6%**: Alto (comum em empresas maduras)
- **DY 3-6%**: Médio
- **DY < 3%**: Baixo (empresas em crescimento)

### Fórmula:
\`DY = Dividendos por Ação / Preço da Ação × 100\`

## 6. Margem Líquida

### O que é?
Porcentagem do faturamento que sobra como lucro.

### Como interpretar:
- Varia muito por setor
- Compare com concorrentes
- Tendência de alta é positiva

### Fórmula:
\`Margem Líquida = Lucro Líquido / Receita Líquida × 100\`

## 7. Dívida Líquida/EBITDA

### O que é?
Mostra quantos anos de geração de caixa seriam necessários para pagar a dívida.

### Como interpretar:
- **< 1x**: Baixo endividamento
- **1-2x**: Saudável
- **> 3x**: Alto endividamento (atenção!)

## 8. EV/EBITDA

### O que é?
Valor da empresa dividido pelo lucro operacional.

### Por que usar:
- Melhor que P/L para comparar empresas com diferentes estruturas de capital
- Útil para setores intensivos em capital

## 9. Payout

### O que é?
Porcentagem do lucro distribuída como dividendos.

### Como interpretar:
- **Payout alto (> 80%)**: Empresa madura, pouco reinvestimento
- **Payout baixo (< 30%)**: Empresa em crescimento
- **Payout > 100%**: Insustentável no longo prazo

## 10. LPA (Lucro por Ação)

### O que é?
Quanto de lucro cada ação representa.

### Como usar:
- Acompanhe a evolução ao longo dos anos
- Crescimento consistente é positivo
- Base para calcular o P/L

## Como Usar na Prática

### Checklist de Análise:
1. P/L razoável para o setor
2. ROE > 15%
3. Dívida/EBITDA < 3x
4. Margem líquida estável ou crescente
5. Dividend Yield atrativo (se busca renda)

### Ferramentas Úteis:
- Use o **Screener** do F-Insight para filtrar ações
- Compare indicadores no **Comparador de Ativos**
- Acompanhe tendências no **Radar de Ativos**

## Conclusão

Dominar esses indicadores é fundamental para fazer análises sólidas. Lembre-se: nenhum indicador deve ser analisado isoladamente. O contexto e a comparação setorial são essenciais.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*`,
    category: "fundamentalista",
    coverImage: null,
    author: "F-Insight",
    isPublished: true
  },
  {
    slug: "bitcoin-ethereum-criptomoedas-guia",
    title: "Bitcoin, Ethereum e Criptomoedas: Guia Completo para Investidores",
    summary: "Entenda o que são criptomoedas, como funcionam, riscos e oportunidades para quem quer investir nesse mercado.",
    content: `# Bitcoin, Ethereum e Criptomoedas

## O que são Criptomoedas?

Criptomoedas são moedas digitais descentralizadas que utilizam criptografia para garantir segurança nas transações. Diferente do dinheiro tradicional, não são controladas por governos ou bancos centrais.

## Bitcoin (BTC)

### História
- Criado em 2009 por Satoshi Nakamoto (pseudônimo)
- Primeira criptomoeda do mundo
- Limite máximo: 21 milhões de unidades

### Características:
- **Descentralizado**: Não depende de autoridade central
- **Escasso**: Quantidade limitada (como ouro digital)
- **Seguro**: Blockchain imutável
- **Transparente**: Todas transações são públicas

### Para que serve:
- Reserva de valor
- Transferências internacionais
- Proteção contra inflação
- Diversificação de portfólio

## Ethereum (ETH)

### O que é?
Plataforma para contratos inteligentes e aplicações descentralizadas (DApps).

### Diferenças do Bitcoin:
- **Smart Contracts**: Contratos que se executam automaticamente
- **DeFi**: Finanças descentralizadas
- **NFTs**: Tokens não fungíveis
- **Ethereum 2.0**: Migração para Proof of Stake

### Casos de uso:
- Finanças descentralizadas (DeFi)
- Jogos blockchain
- Identidade digital
- Supply chain

## Outras Criptomoedas Importantes

### Stablecoins
- **USDT (Tether)**: Pareada ao dólar
- **USDC**: Regulamentada nos EUA
- Úteis para trading e proteção

### Altcoins Relevantes
- **BNB**: Token da Binance
- **SOL (Solana)**: Alta velocidade
- **ADA (Cardano)**: Foco em sustentabilidade
- **XRP (Ripple)**: Pagamentos internacionais

## Como Investir em Criptomoedas

### 1. Escolha uma Exchange
- Binance
- Coinbase
- Mercado Bitcoin
- Foxbit

### 2. Faça seu Cadastro
- Documentos pessoais
- Verificação de identidade (KYC)
- Autenticação em dois fatores (2FA)

### 3. Deposite Fundos
- PIX
- TED
- Cartão de crédito (taxas maiores)

### 4. Compre suas Criptos
- Ordem a mercado (execução imediata)
- Ordem limitada (preço específico)

## Estratégias de Investimento

### HODL (Hold On for Dear Life)
- Comprar e manter por longo prazo
- Ignorar volatilidade de curto prazo
- Ideal para iniciantes

### DCA (Dollar Cost Averaging)
- Comprar valores fixos periodicamente
- Reduz impacto da volatilidade
- Exemplo: R$ 500/mês em Bitcoin

### Trading
- Compra e venda frequente
- Requer conhecimento técnico
- Alto risco

## Riscos das Criptomoedas

### Volatilidade
- Preços podem variar 20%+ em um dia
- Não invista o que não pode perder

### Segurança
- Hacks em exchanges
- Perda de chaves privadas
- Golpes e fraudes

### Regulamentação
- Incerteza regulatória
- Possíveis restrições governamentais

### Tecnológicos
- Bugs em smart contracts
- Ataques de 51%
- Obsolescência

## Segurança: Proteja seus Ativos

### Carteiras (Wallets)

**Hot Wallets** (Online):
- Mais práticas
- Menos seguras
- Para valores menores

**Cold Wallets** (Offline):
- Ledger, Trezor
- Máxima segurança
- Para valores maiores

### Boas Práticas:
1. Ative 2FA em todas contas
2. Use senhas fortes e únicas
3. Nunca compartilhe sua seed phrase
4. Desconfie de promessas de retorno garantido
5. Diversifique entre exchanges e wallets

## Tributação no Brasil

### Regras Atuais:
- Ganhos acima de R$ 35.000/mês são tributados
- Alíquotas de 15% a 22,5%
- Declaração obrigatória no IR

### Dicas:
- Mantenha registro de todas operações
- Use planilhas ou apps de controle
- Consulte um contador especializado

## Conclusão

Criptomoedas são uma classe de ativos com alto potencial, mas também alto risco. Estude bastante antes de investir, comece com valores pequenos e nunca invista mais do que pode perder.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*`,
    category: "cripto",
    coverImage: null,
    author: "F-Insight",
    isPublished: true
  },
  {
    slug: "taxa-selic-impacto-investimentos",
    title: "Taxa Selic: Como Ela Impacta Seus Investimentos",
    summary: "Entenda o que é a Taxa Selic, como ela é definida e de que forma afeta renda fixa, ações, fundos imobiliários e outros investimentos.",
    content: `# Taxa Selic: Como Ela Impacta Seus Investimentos

## O que é a Taxa Selic?

A Taxa Selic (Sistema Especial de Liquidação e de Custódia) é a taxa básica de juros da economia brasileira. Ela serve como referência para todas as outras taxas de juros do país.

## Como a Selic é Definida?

### COPOM (Comitê de Política Monetária)
- Reúne-se a cada 45 dias
- Composto por diretores do Banco Central
- Analisa cenário econômico
- Define a meta da Selic

### Fatores Considerados:
- Inflação atual e projetada
- Atividade econômica
- Cenário internacional
- Câmbio
- Expectativas do mercado

## Impacto na Renda Fixa

### Tesouro Selic
- Rendimento acompanha diretamente a Selic
- Selic alta = maior rendimento
- Baixo risco

### CDBs e LCIs/LCAs
- Geralmente pagam % do CDI (próximo à Selic)
- Selic alta = melhores taxas
- Atenção ao prazo e liquidez

### Tesouro Prefixado e IPCA+
- **Selic subindo**: Preços caem (marcação a mercado negativa)
- **Selic caindo**: Preços sobem (marcação a mercado positiva)
- Importante para quem vende antes do vencimento

## Impacto nas Ações

### Selic Alta
- **Negativo para ações**: Renda fixa mais atrativa
- Custo de capital maior para empresas
- Consumo tende a cair
- Setores mais afetados: varejo, construção civil

### Selic Baixa
- **Positivo para ações**: Migração da renda fixa
- Empresas captam mais barato
- Estímulo ao consumo
- Valorização geral do mercado

### Setores Defensivos
- Utilities (energia, saneamento)
- Bancos (ganham com spread)
- Exportadoras (menos dependentes do mercado interno)

## Impacto nos Fundos Imobiliários

### Selic Alta
- FIIs ficam menos atrativos vs renda fixa
- Preços tendem a cair
- Dividend Yield sobe (preço cai, dividendo mantém)
- Oportunidade de compra para longo prazo

### Selic Baixa
- FIIs mais atrativos
- Valorização das cotas
- Migração de investidores da renda fixa

## Impacto no Câmbio

### Selic Alta
- Atrai capital estrangeiro
- Tende a valorizar o Real
- Bom para quem viaja ou importa

### Selic Baixa
- Capital busca outros países
- Tende a desvalorizar o Real
- Bom para exportadores

## Estratégias por Cenário

### Cenário de Selic Alta

**Renda Fixa:**
- Aproveitar taxas elevadas
- Tesouro Selic para liquidez
- CDBs de bancos médios (maior retorno)

**Renda Variável:**
- Foco em empresas com baixa dívida
- Setores defensivos
- Ações de dividendos

### Cenário de Selic em Queda

**Renda Fixa:**
- Prefixados e IPCA+ para ganhar com marcação
- Travar taxas antes da queda

**Renda Variável:**
- Aumentar exposição em ações
- FIIs de tijolo
- Small caps

### Cenário de Selic Estável

- Manter diversificação equilibrada
- Foco em fundamentos das empresas
- Aproveitar oportunidades pontuais

## Histórico da Selic

| Período | Selic | Contexto |
|---------|-------|----------|
| 2016 | 14,25% | Crise econômica |
| 2020 | 2,00% | Pandemia COVID-19 |
| 2022 | 13,75% | Combate à inflação |
| 2024 | 10,50% | Ciclo de cortes |

## Como Acompanhar

### Calendário do COPOM
- Datas das reuniões são divulgadas com antecedência
- Atas publicadas após cada reunião
- Comunicados explicam as decisões

### Indicadores Relacionados
- **IPCA**: Principal índice de inflação
- **CDI**: Taxa interbancária (próxima à Selic)
- **Focus**: Expectativas do mercado

## Conclusão

A Taxa Selic é fundamental para qualquer investidor brasileiro. Entender seu funcionamento e impactos permite tomar decisões mais informadas e ajustar sua carteira conforme o cenário econômico.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*`,
    category: "macro",
    coverImage: null,
    author: "F-Insight",
    isPublished: true
  },
  {
    slug: "medias-moveis-estrategias-trading",
    title: "Médias Móveis: Estratégias de Trading para Iniciantes e Avançados",
    summary: "Aprenda a usar médias móveis simples e exponenciais para identificar tendências, pontos de entrada e saída no mercado.",
    content: `# Médias Móveis: Estratégias de Trading

## O que são Médias Móveis?

Médias móveis são indicadores técnicos que suavizam os preços ao longo de um período, ajudando a identificar tendências e filtrar ruídos do mercado.

## Tipos de Médias Móveis

### Média Móvel Simples (SMA)
- Soma dos preços dividida pelo número de períodos
- Todos os preços têm o mesmo peso
- Mais lenta para reagir a mudanças

**Fórmula:**
\`SMA = (P1 + P2 + ... + Pn) / n\`

### Média Móvel Exponencial (EMA)
- Dá mais peso aos preços recentes
- Reage mais rápido às mudanças
- Preferida por traders de curto prazo

### Média Móvel Ponderada (WMA)
- Pesos diferentes para cada período
- Meio termo entre SMA e EMA

## Períodos Mais Usados

| Período | Uso | Timeframe |
|---------|-----|-----------|
| 9 | Curto prazo | Day trade |
| 20 | Curto prazo | Swing trade |
| 50 | Médio prazo | Position |
| 200 | Longo prazo | Investimento |

## Estratégias com Médias Móveis

### 1. Cruzamento de Médias (Golden/Death Cross)

**Golden Cross (Sinal de Compra):**
- Média curta cruza acima da média longa
- Exemplo: EMA 9 cruza acima da EMA 21
- Indica início de tendência de alta

**Death Cross (Sinal de Venda):**
- Média curta cruza abaixo da média longa
- Exemplo: SMA 50 cruza abaixo da SMA 200
- Indica início de tendência de baixa

### 2. Preço vs Média Móvel

**Compra:**
- Preço cruza acima da média
- Pullback até a média em tendência de alta

**Venda:**
- Preço cruza abaixo da média
- Rally até a média em tendência de baixa

### 3. Múltiplas Médias (Rainbow)

- Use 3 ou mais médias de períodos diferentes
- Quando todas alinham na mesma direção = tendência forte
- Exemplo: EMA 9, 21, 50, 200

### 4. Envelope de Médias

- Bandas acima e abaixo da média (ex: 2%)
- Preço tocando banda superior = sobrecomprado
- Preço tocando banda inferior = sobrevendido

## Configurações por Estilo de Trading

### Day Trade
- EMA 9 e EMA 21
- Gráficos de 5, 15 ou 60 minutos
- Foco em cruzamentos rápidos

### Swing Trade
- EMA 20 e SMA 50
- Gráficos diários
- Operações de dias a semanas

### Position Trade
- SMA 50 e SMA 200
- Gráficos diários/semanais
- Operações de semanas a meses

## Combinando com Outros Indicadores

### Médias + RSI
- Cruzamento de médias + RSI saindo de sobrevenda
- Confirmação mais forte do sinal

### Médias + MACD
- Cruzamento de médias + MACD cruzando linha de sinal
- Dupla confirmação de tendência

### Médias + Volume
- Cruzamento com volume acima da média
- Maior probabilidade de sucesso

## Erros Comuns

### 1. Usar em Mercado Lateral
- Médias funcionam melhor em tendências
- Em consolidação, geram muitos sinais falsos

### 2. Ignorar o Contexto
- Sempre considere suportes/resistências
- Analise múltiplos timeframes

### 3. Over-optimization
- Não ajuste demais os parâmetros
- Configurações simples costumam funcionar melhor

### 4. Não Usar Stop Loss
- Sempre defina seu risco máximo
- Médias atrasam - o preço pode cair muito antes do sinal

## Backtesting no F-Insight

Use o **Simulador de Estratégias** do F-Insight para testar:

1. Selecione a estratégia "SMA Crossover" ou "EMA Crossover"
2. Escolha o ativo e período
3. Ajuste os parâmetros das médias
4. Analise os resultados (retorno, drawdown, win rate)

## Exemplo Prático

### Setup: EMA 9 x EMA 21 em PETR4

**Regras de Entrada (Compra):**
1. EMA 9 cruza acima da EMA 21
2. Preço acima de ambas as médias
3. Volume acima da média de 20 períodos

**Regras de Saída:**
1. EMA 9 cruza abaixo da EMA 21
2. Stop loss: 2% abaixo do preço de entrada
3. Take profit: 2x o risco (4%)

## Conclusão

Médias móveis são ferramentas poderosas quando usadas corretamente. Comece com configurações simples, teste suas estratégias e sempre gerencie seu risco.

---

*Este artigo é apenas educacional e não constitui recomendação de investimento.*`,
    category: "tecnica",
    coverImage: null,
    author: "F-Insight",
    isPublished: true
  }
];

async function addArticles() {
  const connection = await createConnection(process.env.DATABASE_URL);
  
  for (const article of newArticles) {
    try {
      // Check if article already exists
      const [existing] = await connection.execute(
        'SELECT id FROM articles WHERE slug = ?',
        [article.slug]
      );
      
      if (existing.length > 0) {
        console.log(`Article "${article.slug}" already exists, skipping...`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO articles (slug, title, summary, content, category, authorName, isPublished, views, createdAt, publishedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
        [article.slug, article.title, article.summary, article.content, article.category, article.author, article.isPublished]
      );
      console.log(`Added article: ${article.title}`);
    } catch (error) {
      console.error(`Error adding article ${article.slug}:`, error.message);
    }
  }
  
  await connection.end();
  console.log('Done!');
}

addArticles();

# Comparativo de APIs de Dados Financeiros

Este documento apresenta uma análise detalhada dos custos e funcionalidades das principais APIs de dados financeiros disponíveis no mercado, além de identificar os 20% de funcionalidades que faltam para a F-Insight igualar o Bloomberg Terminal.

---

## Resumo Executivo

Para a F-Insight, recomendamos continuar com **OpenBB** (gratuito) para a maioria dos casos de uso, complementando com **Finnhub Free** ou **Twelve Data** para dados específicos. Para escalar com dados em tempo real, a melhor opção custo-benefício é **Polygon.io Starter** (US$ 29/mês).

---

## Comparativo de Preços

### Tabela Resumo de Custos

| Provedor | Plano Gratuito | Plano Básico | Plano Intermediário | Plano Avançado |
|----------|---------------|--------------|---------------------|----------------|
| **Alpha Vantage** | 25 req/dia | US$ 50/mês (75 req/min) | US$ 150/mês (150 req/min) | US$ 300/mês (1200 req/min) |
| **Polygon.io (Massive)** | 5 req/min, EOD | US$ 29/mês (ilimitado, 15min delay) | US$ 79/mês (10 anos histórico) | US$ 199/mês (tempo real) |
| **Finnhub** | 60 req/min, US only | - | - | US$ 3.000/mês (global) |
| **Twelve Data** | 800 req/dia | US$ 29/mês | US$ 79/mês | US$ 299/mês |
| **Yahoo Finance** | Ilimitado (não oficial) | - | - | - |
| **OpenBB** | Gratuito (agregador) | - | - | - |
| **Tiingo** | 500 req/dia | US$ 10/mês | US$ 30/mês | US$ 100/mês |
| **Marketstack** | 100 req/mês | US$ 10/mês (10k req) | US$ 50/mês (50k req) | US$ 100/mês (ilimitado) |

### Conversão para Reais (cotação US$ 1 = R$ 5,00)

| Provedor | Gratuito | Básico | Intermediário | Avançado |
|----------|----------|--------|---------------|----------|
| **Alpha Vantage** | R$ 0 | R$ 250/mês | R$ 750/mês | R$ 1.500/mês |
| **Polygon.io** | R$ 0 | R$ 145/mês | R$ 395/mês | R$ 995/mês |
| **Finnhub** | R$ 0 | - | - | R$ 15.000/mês |
| **Twelve Data** | R$ 0 | R$ 145/mês | R$ 395/mês | R$ 1.495/mês |
| **Tiingo** | R$ 0 | R$ 50/mês | R$ 150/mês | R$ 500/mês |
| **Marketstack** | R$ 0 | R$ 50/mês | R$ 250/mês | R$ 500/mês |

---

## Análise Detalhada por Provedor

### 1. Alpha Vantage

**Pontos Fortes:**
- API bem documentada e estável
- Suporte a ações, forex, crypto e indicadores técnicos
- Dados fundamentalistas incluídos

**Limitações:**
- Plano gratuito muito limitado (25 req/dia)
- Sem dados em tempo real no plano gratuito
- Preços altos para volume alto

**Recomendação:** Bom para prototipagem, caro para produção.

### 2. Polygon.io (agora Massive)

**Pontos Fortes:**
- API muito rápida e confiável
- Dados tick-level disponíveis
- WebSocket para streaming
- Histórico de 20+ anos no plano avançado

**Limitações:**
- Apenas mercado americano
- Plano gratuito muito limitado (5 req/min, EOD only)
- Dados em tempo real apenas no plano US$ 199/mês

**Recomendação:** Melhor custo-benefício para dados americanos em produção.

### 3. Finnhub

**Pontos Fortes:**
- Plano gratuito generoso (60 req/min)
- Dados fundamentalistas completos
- Sentimento social e dados alternativos
- WebSocket gratuito (50 símbolos)

**Limitações:**
- Plano pago muito caro (US$ 3.000/mês)
- Cobertura global apenas no plano pago
- Sem opção intermediária

**Recomendação:** Excelente para uso gratuito, inviável para upgrade.

### 4. Twelve Data

**Pontos Fortes:**
- Boa cobertura global
- Preços competitivos
- API simples e bem documentada
- Suporte a forex e crypto

**Limitações:**
- Plano gratuito com limite diário (800 req)
- Dados fundamentalistas limitados

**Recomendação:** Boa alternativa intermediária.

### 5. Yahoo Finance (via yfinance)

**Pontos Fortes:**
- Gratuito e sem limites oficiais
- Cobertura global excelente
- Dados fundamentalistas incluídos
- Biblioteca Python madura

**Limitações:**
- API não oficial (pode quebrar)
- Sem SLA ou suporte
- Rate limiting não documentado
- Não recomendado para uso comercial

**Recomendação:** Ideal para projetos pessoais e MVPs.

### 6. OpenBB (Recomendado Atual)

**Pontos Fortes:**
- Completamente gratuito
- Agregador de múltiplas fontes
- Código aberto
- Comunidade ativa
- Suporte a ações BR via Yahoo Finance

**Limitações:**
- Depende de APIs de terceiros
- Pode ter inconsistências entre fontes
- Sem SLA

**Recomendação:** **Melhor opção para a F-Insight atualmente.**

---

## Recomendação para F-Insight

### Cenário Atual (Gratuito)
Manter **OpenBB** + **Yahoo Finance** + **Finnhub Free**

**Custo:** R$ 0/mês
**Limitações:** Dados com delay de 15-20 minutos, sem SLA

### Cenário Escala Inicial
Adicionar **Polygon.io Starter** ou **Twelve Data Basic**

**Custo:** ~R$ 145/mês
**Benefícios:** API calls ilimitadas, histórico maior, mais estabilidade

### Cenário Escala Avançada
**Polygon.io Advanced** + **Finnhub Free** (para fundamentalistas)

**Custo:** ~R$ 995/mês
**Benefícios:** Dados em tempo real, tick-level, WebSocket ilimitado

### Comparativo com Bloomberg

| Solução | Custo Anual | % do Bloomberg |
|---------|-------------|----------------|
| F-Insight (OpenBB) | R$ 0 | 0% |
| F-Insight + Polygon Starter | R$ 1.740 | 1,5% |
| F-Insight + Polygon Advanced | R$ 11.940 | 10% |
| Bloomberg Terminal | R$ 120.000 | 100% |

---

## Os 20% que Faltam para Igualar o Bloomberg

A F-Insight atualmente entrega aproximadamente **80% das funcionalidades** do Bloomberg Terminal. Os 20% restantes são:

### 1. Dados Tick-by-Tick em Tempo Real (5%)

**O que falta:**
- Cotações com latência de milissegundos
- Order book (Level 2 data)
- Time & Sales em tempo real

**Por que importa:**
Essencial para day traders e algoritmos de alta frequência.

**Como resolver:**
- Polygon.io Advanced (US$ 199/mês) para ações US
- B3 Market Data (contrato direto) para ações BR
- **Custo estimado:** R$ 2.000-5.000/mês

### 2. Bloomberg News e Conteúdo Exclusivo (4%)

**O que falta:**
- Notícias exclusivas da Bloomberg News
- Análises proprietárias
- Furos de reportagem

**Por que importa:**
Informação privilegiada pode significar vantagem competitiva.

**Como resolver:**
- Não há substituto direto
- Alternativa: Agregar múltiplas fontes (Reuters, Dow Jones, etc.)
- **Custo estimado:** R$ 500-2.000/mês (assinaturas de notícias)

### 3. Cobertura de Ativos Exóticos (3%)

**O que falta:**
- Bonds corporativos globais
- Derivativos exóticos (swaps, forwards)
- Mercados emergentes menores
- Commodities físicas

**Por que importa:**
Gestores de fundos multimercado precisam de cobertura ampla.

**Como resolver:**
- Refinitiv/LSEG Data (ex-Thomson Reuters)
- ICE Data Services
- **Custo estimado:** R$ 5.000-20.000/mês

### 4. Terminal de Mensagens Institucional (3%)

**O que falta:**
- Bloomberg MSG (chat entre instituições)
- Diretório de contatos institucional
- Integração com mesas de operação

**Por que importa:**
Networking e execução de ordens entre instituições.

**Como resolver:**
- Symphony (alternativa open source)
- Slack/Teams para comunidades
- **Custo estimado:** R$ 0-500/mês

### 5. Integração com Back-Office (3%)

**O que falta:**
- SSEOMS (Sistema de execução de ordens)
- Integração com custodiantes
- Compliance automatizado
- Relatórios regulatórios

**Por que importa:**
Gestoras precisam de integração completa com operações.

**Como resolver:**
- Desenvolvimento customizado
- Parcerias com corretoras
- **Custo estimado:** R$ 10.000-50.000 (desenvolvimento)

### 6. Suporte Enterprise 24/7 (2%)

**O que falta:**
- Suporte técnico 24/7
- Gerente de conta dedicado
- Treinamento presencial
- SLA garantido

**Por que importa:**
Instituições exigem suporte imediato para operações críticas.

**Como resolver:**
- Contratar equipe de suporte
- Implementar monitoramento 24/7
- **Custo estimado:** R$ 15.000-30.000/mês

---

## Roadmap para Fechar o Gap

### Fase 1: Curto Prazo (0-3 meses)
- [ ] Integrar Polygon.io Starter para dados mais estáveis
- [ ] Adicionar agregador de notícias (NewsAPI, etc.)
- **Investimento:** ~R$ 200/mês
- **Gap fechado:** 82% → 85%

### Fase 2: Médio Prazo (3-6 meses)
- [ ] Implementar WebSocket para dados em tempo real
- [ ] Adicionar cobertura de bonds e ETFs internacionais
- [ ] Criar sistema de chat entre usuários premium
- **Investimento:** ~R$ 1.500/mês
- **Gap fechado:** 85% → 90%

### Fase 3: Longo Prazo (6-12 meses)
- [ ] Parcerias com B3 para dados oficiais
- [ ] Integração com corretoras para execução
- [ ] Suporte premium com SLA
- **Investimento:** ~R$ 10.000/mês
- **Gap fechado:** 90% → 95%

### Nota sobre os 5% Finais

Os últimos 5% (notícias exclusivas Bloomberg, rede institucional MSG, cobertura de derivativos exóticos) são praticamente impossíveis de replicar sem investimentos de dezenas de milhões de dólares. Esses são os diferenciais que justificam o preço do Bloomberg para grandes instituições.

**Para investidores individuais e pequenas gestoras, 95% é mais do que suficiente.**

---

## Conclusão

A F-Insight já oferece uma proposta de valor excepcional com 80% das funcionalidades do Bloomberg por uma fração do custo. Com investimentos modestos (R$ 200-1.500/mês em APIs), é possível chegar a 90% das funcionalidades.

Os 10% restantes exigem investimentos significativos e são relevantes apenas para instituições de grande porte que, de qualquer forma, já possuem orçamento para o Bloomberg Terminal.

**Recomendação:** Manter OpenBB como base gratuita e oferecer plano "Pro" com Polygon.io para usuários que precisam de dados mais robustos.

---

*Última atualização: Dezembro 2024*

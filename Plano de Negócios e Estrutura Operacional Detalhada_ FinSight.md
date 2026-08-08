# Plano de Negócios e Estrutura Operacional Detalhada: FinSight

**Autor:** Manus AI
**Data:** 16 de Dezembro de 2025
**Afiliação:** Unidade de Negócio do Grupo Notarize X

## 1. Resumo Executivo

A **FinSight** é uma plataforma de análise financeira baseada em dados públicos (OpenBB) e Inteligência Artificial (IA), concebida para democratizar o acesso a informações complexas do mercado. O negócio será estruturado como uma **Unidade de Negócio Estratégica** do **Grupo Notarize X**, aproveitando a infraestrutura legal e administrativa existente, mas mantendo total independência operacional para garantir agilidade e foco na inovação.

A proposta de valor central é oferecer uma ferramenta gratuita, sem a necessidade de login no MVP (Produto Mínimo Viável), que transforma dados brutos em *insights* claros e acionáveis. A monetização será indireta, focada em programas de afiliação contextual com corretoras e *fintechs*, e publicidade segmentada.

## 2. Análise de Mercado e Posicionamento Estratégico

O mercado brasileiro de ferramentas de análise financeira é maduro, mas carece de soluções que unam **gratuidade, profundidade de dados (macro e cripto)** e **simplicidade via IA**.

### 2.1. Cenário Competitivo

O principal concorrente é o Status Invest, que se estabeleceu como referência em indicadores fundamentalistas de ativos da B3. No entanto, a FinSight se diferencia ao focar em três pilares:

| Diferencial Competitivo | Descrição | Vantagem Estratégica |
| :--- | :--- | :--- |
| **Inteligência Artificial Explicável** | Uso de LLMs para gerar *insights* em linguagem natural e um assistente financeiro que analisa dados, mas não recomenda investimentos. | Reduz a barreira de entrada para investidores iniciantes e intermediários, aumentando a retenção e o tráfego orgânico (SEO). |
| **Base de Dados OpenBB** | Integração nativa de dados de ações, ETFs, criptomoedas e indicadores macroeconômicos globais. | Oferece uma visão mais holística e diversificada, superando o foco primário em B3 de muitos concorrentes. |
| **Modelo de Acesso** | Gratuito e sem login obrigatório no MVP. | Maximiza a captação de tráfego orgânico e viralidade, essencial para o modelo de monetização por volume (afiliação/publicidade). |

## 3. Estrutura Organizacional e Operacional

A FinSight será tratada como um **Centro de Custo e Receita** separado dentro da Notarize X, permitindo a medição precisa de seu desempenho financeiro (P&L).

### 3.1. Governança e Afiliação ao Grupo

A decisão de operar como Unidade de Negócio (Modelo 1) implica:

*   **Estrutura Legal:** Utilização do CNPJ e estrutura legal da Notarize X.
*   **Branding:** A marca **FinSight** será sempre acompanhada da menção "Uma empresa do Grupo Notarize X", garantindo a transferência de credibilidade e confiança.
*   **Sinergias:** O Grupo Notarize X fornecerá serviços de suporte (jurídico, contábil, RH) via Acordos de Nível de Serviço (SLAs) internos, otimizando custos fixos.

### 3.2. Estrutura de Equipe (MVP)

A independência operacional será garantida por uma equipe dedicada e enxuta:

| Função | Responsabilidade Principal | Dedicação |
| :--- | :--- | :--- |
| **Product Owner (PO)** | Visão do produto, priorização do *roadmap*, gestão de requisitos. | 100% |
| **Desenvolvedor Full-Stack** | Implementação do Backend (Python/FastAPI) e Frontend (Next.js). | 100% |
| **Designer/UX** | Design System, usabilidade e interface dos 4 módulos. | 50% (Compartilhado) |
| **Especialista em IA/Dados** | Desenvolvimento dos prompts, integração OpenBB e geração de *insights*. | 50% (Compartilhado) |

## 4. Plano de Produto: Os 4 Módulos

O produto será lançado em fases, com foco nos quatro módulos centrais:

| Módulo | Objetivo | Funcionalidades Chave |
| :--- | :--- | :--- |
| **1. Radar de Ativos** | Entender se um ativo está caro, barato ou arriscado. | Dados fundamentalistas, preço histórico, comparação setorial, *Insight* automático em texto (IA). |
| **2. Simulador de Estratégias** | Ensinar estratégias sem exigir conhecimento técnico. | *Backtesting* simplificado (Médias Móveis, RSI), curva de capital, *drawdown*, interpretação automática do resultado. |
| **3. Painel Macroeconômico** | Dar contexto econômico às decisões de investimento. | Indicadores (Inflação, Juros, PIB, Câmbio), séries históricas interativas, resumo textual gerado por IA. |
| **4. Assistente Financeiro IA** | Permitir perguntas em linguagem natural baseadas em dados. | Respostas contextuais e explicáveis, com prompts baseados em dados do OpenBB. |

## 5. Plano de Marketing e Monetização

A estratégia de marketing será focada em **SEO (Search Engine Optimization)**, utilizando o conteúdo gerado pela IA (insights e resumos macro) para atrair tráfego orgânico de alta intenção.

### 5.1. Estratégia de Monetização

O modelo de receita é baseado em volume de tráfego e conversão contextual:

1.  **Afiliação Contextual (Principal):** Inserção de links de afiliados de corretoras, *exchanges* e plataformas educacionais em pontos de alta conversão (ex: após a análise de um ativo ou o resultado de um *backtest*).
2.  **Publicidade Segmentada:** Venda de espaços publicitários para *fintechs* e empresas do setor financeiro, aproveitando o alto valor do público-alvo.
3.  **Dados Agregados (Fase 2):** Comercialização de relatórios de tendências de busca e análise de mercado (anonimizados e agregados) para instituições financeiras.

## 6. Plano de Execução (Roadmap de 90 Dias)

O desenvolvimento será dividido em três fases de 30 dias, visando o lançamento do MVP em 90 dias:

| Fase | Período | Foco Principal | Entregáveis Chave |
| :--- | :--- | :--- | :--- |
| **Fase 1: Fundamentos** | 0 – 30 dias | Setup de Infraestrutura e Design System. | Repositório configurado, Backend FastAPI com OpenBB integrado, Frontend base (Next.js/Tailwind), Home e Página de Ativo (dados estáticos). |
| **Fase 2: Core do Produto** | 30 – 60 dias | Implementação dos módulos centrais. | Radar de Ativos completo, Simulador simples (1-2 estratégias), Painel Macroeconômico, Geração de *insights* automáticos (texto). |
| **Fase 3: IA e Monetização** | 60 – 90 dias | Lançamento e Otimização. | Assistente IA funcional, Otimização SEO (SSR), Integração completa dos links de afiliados. |

## 7. Plano Financeiro (Estrutura de Custos e Receitas)

Embora os valores exatos dependam da cotação de serviços e salários, a estrutura financeira da FinSight será a seguinte:

### 7.1. Custos Principais (Capex/Opex)

| Categoria de Custo | Detalhamento | Natureza |
| :--- | :--- | :--- |
| **Desenvolvimento** | Salários da equipe dedicada (PO, Desenvolvedor, % de IA/Design). | Opex (Operacional) |
| **Infraestrutura** | Servidores (Backend/Frontend), Banco de Dados (PostgreSQL), Cache (Redis), CDN. | Opex (Operacional) |
| **Serviços de Terceiros** | Licenças de LLM (OpenAI, Gemini, etc.), APIs complementares ao OpenBB (se necessário). | Opex (Operacional) |
| **Marketing** | Custos iniciais de SEO e produção de conteúdo. | Opex (Operacional) |

### 7.2. Fontes de Receita

| Fonte de Receita | Estratégia | Potencial de Escala |
| :--- | :--- | :--- |
| **Afiliação** | Comissão por novos clientes ou volume de negociação gerado para parceiros (corretoras/exchanges). | Alto (Diretamente ligado ao volume de tráfego e qualidade dos *insights*). |
| **Publicidade** | Venda de espaços para anunciantes do nicho financeiro. | Médio/Alto (Dependente do CPM e volume de impressões). |
| **Relatórios de Dados** | Venda de relatórios de tendências (Fase 2). | Médio (Receita B2B, mais estável, mas menor volume). |

## 8. Conclusão

A FinSight é um projeto de alto potencial que se beneficia da estrutura e credibilidade do Grupo Notarize X, ao mesmo tempo em que adota uma abordagem de mercado inovadora e tecnologicamente avançada. A execução do *roadmap* de 90 dias, focada na experiência do usuário e na monetização contextual, é o caminho para estabelecer a FinSight como uma referência em análise financeira acessível no Brasil.

# Documento de Estrutura e Plano Inicial: FinSight

**Unidade de Negócio do Grupo Notarize X**

## 1. Contexto e Alinhamento Estratégico

A **FinSight** é estabelecida como uma nova unidade de negócio estratégica dentro do **Grupo Notarize X**. Esta estrutura visa alavancar a solidez e a credibilidade do grupo, ao mesmo tempo em que garante a agilidade e a independência operacional necessárias para inovar no mercado de tecnologia financeira (Fintech).

A afiliação ao Grupo Notarize X será mencionada em toda a comunicação institucional e legal da FinSight, posicionando-a como um braço de inovação focado em democratizar o acesso a dados e análises financeiras complexas.

## 2. Visão e Proposta de Valor

A FinSight nasce com a missão de transformar informações financeiras complexas em análises claras e acessíveis para o público em geral.

| Componente | Descrição |
| :--- | :--- |
| **Nome** | FinSight |
| **Visão** | Uma plataforma financeira gratuita, baseada em dados públicos, que transforma informações financeiras complexas em análises claras, simulações de estratégias e insights macroeconômicos. |
| **Proposta de Valor** | "Entenda o mercado financeiro de forma simples, visual e inteligente — sem precisar ser especialista." |
| **Diferencial** | Gratuita, sem exigência de login (no MVP) e baseada integralmente em dados públicos (OpenBB), com monetização indireta e foco em educação e transparência. |

## 3. Estrutura Operacional e Governança

A FinSight operará com **independência operacional** total, conforme solicitado, mas sob a **supervisão estratégica** do Grupo Notarize X.

### 3.1. Estrutura de Unidade de Negócio (Modelo 1)

| Aspecto | Detalhamento | Implicação para Notarize X |
| :--- | :--- | :--- |
| **Estrutura Jurídica** | Não haverá nova entidade legal. A FinSight é um produto/serviço da Notarize X. | Simplificação legal e fiscal. Responsabilidade e passivos são da Notarize X. |
| **Gestão** | Equipe dedicada (Product Owner, Desenvolvedor, Designer) com autonomia para execução do *roadmap*. | Necessidade de alocação de orçamento e recursos humanos específicos. |
| **Recursos** | **Independentes** para desenvolvimento (servidores, licenças, APIs). | Os custos devem ser segregados e rastreados internamente para avaliação de desempenho (P&L da unidade). |
| **Branding** | Marca **FinSight** com a menção "Uma empresa do Grupo Notarize X". | Fortalecimento da marca corporativa do grupo. |
| **Sinergias** | Possível compartilhamento de serviços de suporte (ex: contabilidade, jurídico, RH) para otimização de custos. | Acordos de serviço interno (SLA) devem ser estabelecidos. |

### 3.2. Módulos Principais (Core do Produto)

A plataforma será construída em torno de quatro módulos integrados:

1.  **Radar de Ativos:** Análise fundamentalista e técnica de Ações, ETFs e Criptomoedas, com insights automáticos gerados por IA.
2.  **Simulador de Estratégias:** Backtesting simplificado de estratégias financeiras (e.g., Médias Móveis, RSI), com interpretação automática de resultados.
3.  **Painel Macroeconômico Global:** Visualização de indicadores (Inflação, Juros, PIB, Câmbio) com séries históricas e resumos textuais gerados por IA.
4.  **Assistente Financeiro com IA:** Interface de perguntas e respostas em linguagem natural, estritamente baseada em dados reais e sem fornecer recomendações de investimento.

## 4. Arquitetura Técnica e Roadmap (Resumo Executivo)

| Aspecto | Detalhamento |
| :--- | :--- |
| **Backend** | Python, OpenBB SDK, FastAPI (API REST). |
| **Frontend** | Next.js, Tailwind CSS, Gráficos (Recharts/ECharts), Server-Side Rendering (SSR) para SEO. |
| **Banco de Dados** | PostgreSQL, Cache com Redis. |
| **Inteligência Artificial** | LLM para geração de insights, resumos macro e assistência, com prompts baseados em dados do OpenBB. |
| **Roadmap (90 dias - MVP)** | **Fase 1 (0-30 dias):** Setup, Integração OpenBB, Home e Página de Ativo. **Fase 2 (30-60 dias):** Core do Produto (Radar, Simulador Simples, Painel Macro, Insights Automáticos). **Fase 3 (60-90 dias):** Assistente IA, Otimização SEO, Integração Afiliados. |

## 5. Estratégia de Monetização

A monetização será indireta, alinhada com a proposta de valor de acesso gratuito e sem atrito:

1.  **Afiliados (Principal):** Links contextuais para Corretoras, Exchanges e Plataformas Educacionais.
2.  **Publicidade Segmentada:** Anúncios de nicho (Financeiro, Educacional, Fintech).
3.  **Dados Agregados (Fase 2):** Venda de relatórios de tendências de busca/análise (anonimizados e agregados).

## 6. Próximos Passos

Com a estrutura e o plano inicial definidos, os próximos passos envolvem a validação e o detalhamento da execução:

1.  **Validação de Mercado:** Pesquisa aprofundada para confirmar a Proposta de Valor e o potencial de monetização.
2.  **Detalhe Técnico:** Elaboração de especificações técnicas detalhadas para o time de desenvolvimento.
3.  **Plano Financeiro:** Projeção de custos (desenvolvimento, infraestrutura) e receitas (afiliados, publicidade) para os primeiros 12 meses.

## 7. Análise de Mercado e Viabilidade Competitiva

A FinSight se insere no mercado de plataformas de análise financeira, que no Brasil é dominado por grandes *players* que utilizam um modelo híbrido (gratuito com dados básicos e pago para recursos avançados) ou são mantidos por corretoras.

### 7.1. Cenário Competitivo

O principal concorrente a ser considerado é o **Status Invest**, que oferece uma vasta gama de dados fundamentalistas e indicadores de mercado (Ações, FIIs, BDRs, etc.) de forma gratuita, monetizando através de publicidade e planos *premium*.

| Característica | FinSight (Proposta) | Status Invest (Concorrente) | Diferencial FinSight |
| :--- | :--- | :--- | :--- |
| **Fonte de Dados** | OpenBB (Agregação de dados públicos, incluindo macro e cripto) | Fontes proprietárias e de mercado (Foco em B3 e EUA) | **Abrangência de Dados:** Maior foco em dados macroeconômicos e criptoativos, integrados desde o início. |
| **Proposta de Valor** | Simplificação e Educação via IA. | Indicadores e Comparação de Ativos. | **Inteligência Artificial:** Uso de LLM para insights em linguagem natural e assistente explicável, tornando a análise mais acessível. |
| **Modelo de Acesso** | Gratuito, sem login (MVP). | Gratuito (dados básicos) e Premium (recursos avançados). | **Acesso Livre:** Maior atratividade inicial e foco na construção de tráfego para monetização indireta. |
| **Monetização** | Afiliação Contextual e Publicidade. | Publicidade e Planos Premium. | **Foco em Afiliação:** Monetização mais orgânica e menos intrusiva, alinhada com a proposta de valor de educação. |

### 7.2. Viabilidade do Modelo de Monetização

O modelo de monetização indireta da FinSight é **viável** e possui alto potencial de escala:

1.  **Afiliação:** O mercado brasileiro de corretoras e *exchanges* de criptomoedas possui programas de afiliados robustos, com comissões competitivas (alguns chegam a oferecer até 80% de *revenue share*). A estratégia de **links contextuais** (ex: "Se este ativo te interessa, abra sua conta na Corretora X") é mais eficaz do que *banners* genéricos, pois aproveita o momento de decisão do usuário.
2.  **Publicidade:** O tráfego gerado por uma plataforma gratuita de alta qualidade é um ativo valioso. A publicidade segmentada para o nicho financeiro (fintechs, cursos, consultorias) possui um CPM (Custo por Mil Impressões) elevado, garantindo receita substancial com o crescimento da base de usuários.

### 7.3. Conclusão da Viabilidade

A FinSight apresenta um **diferencial competitivo claro** no mercado brasileiro, focado na **acessibilidade e inteligência artificial explicável**, utilizando o OpenBB como base técnica robusta. A viabilidade é alta, desde que o *roadmap* de execução seja seguido, priorizando a experiência do usuário e a geração de tráfego orgânico (SEO) através do conteúdo gerado por IA (insights indexáveis).

## 8. Estrutura de Implementação (Checklist para o Desenvolvedor)

O documento original já fornece um excelente checklist de execução. Este é o resumo a ser entregue ao time técnico:

| Item | Detalhe | Status |
| :--- | :--- | :--- |
| **Visão do Produto** | Plataforma FinSight: Análise financeira gratuita via IA e OpenBB. | Concluído |
| **Estrutura** | Unidade de Negócio do Grupo Notarize X. | Definido |
| **Stack Técnica** | Backend: Python/FastAPI/OpenBB. Frontend: Next.js/Tailwind. DB: PostgreSQL/Redis. | Definido |
| **Roadmap (MVP)** | 90 dias (Fase 1: Setup; Fase 2: Core; Fase 3: IA/SEO/Afiliados). | Definido |
| **Restrições** | Sem login obrigatório (MVP), Sem recomendação financeira, IA sempre explicável. | Definido |
| **Monetização** | Afiliação Contextual e Publicidade. | Definido |
| **Branding** | FinSight - Uma empresa do Grupo Notarize X. | Definido |

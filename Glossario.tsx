import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  Building2,
  Scale,
  Target,
  Calculator,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Bookmark
} from 'lucide-react';

type Category = 'all' | 'basico' | 'indicadores' | 'analise' | 'mercado' | 'derivativos' | 'renda-fixa';

interface Term {
  id: string;
  term: string;
  definition: string;
  category: Category;
  example?: string;
  formula?: string;
  relatedTerms?: string[];
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
}

const GLOSSARY_TERMS: Term[] = [
  // Básico
  {
    id: 'acao',
    term: 'Ação',
    definition: 'Menor fração do capital social de uma empresa. Ao comprar uma ação, você se torna sócio da empresa e tem direito a participar dos lucros (dividendos) e da valorização do negócio.',
    category: 'basico',
    example: 'Se você compra 100 ações da Petrobras (PETR4), você se torna sócio da empresa e tem direito a receber dividendos proporcionais.',
    relatedTerms: ['Dividendo', 'Capital Social', 'Acionista'],
    difficulty: 'iniciante',
  },
  {
    id: 'dividendo',
    term: 'Dividendo',
    definition: 'Parte do lucro líquido de uma empresa distribuída aos acionistas. No Brasil, empresas são obrigadas a distribuir no mínimo 25% do lucro líquido.',
    category: 'basico',
    example: 'Se uma empresa lucrou R$ 1 bilhão e distribui 50%, serão R$ 500 milhões divididos entre todos os acionistas.',
    formula: 'Dividendo por Ação = Lucro Distribuído / Número de Ações',
    relatedTerms: ['Dividend Yield', 'Payout', 'JCP'],
    difficulty: 'iniciante',
  },
  {
    id: 'jcp',
    term: 'JCP (Juros sobre Capital Próprio)',
    definition: 'Forma alternativa de distribuir lucros aos acionistas com benefício fiscal para a empresa. O acionista paga 15% de IR na fonte.',
    category: 'basico',
    example: 'Itaú distribui parte dos proventos como JCP para reduzir sua carga tributária.',
    relatedTerms: ['Dividendo', 'Imposto de Renda'],
    difficulty: 'iniciante',
  },
  {
    id: 'fii',
    term: 'FII (Fundo de Investimento Imobiliário)',
    definition: 'Fundo que investe em imóveis ou títulos imobiliários. Distribui 95% dos rendimentos aos cotistas, geralmente mensalmente, isentos de IR para pessoa física.',
    category: 'basico',
    example: 'HGLG11 é um FII de galpões logísticos que paga dividendos mensais aos cotistas.',
    relatedTerms: ['Cota', 'Dividend Yield', 'Vacância'],
    difficulty: 'iniciante',
  },
  {
    id: 'bdr',
    term: 'BDR (Brazilian Depositary Receipt)',
    definition: 'Certificado que representa ações de empresas estrangeiras negociadas na B3. Permite investir em empresas como Apple, Google e Amazon sem abrir conta no exterior.',
    category: 'basico',
    example: 'AAPL34 é o BDR da Apple. Cada BDR representa uma fração da ação original negociada nos EUA.',
    relatedTerms: ['ADR', 'Ação', 'B3'],
    difficulty: 'iniciante',
  },
  {
    id: 'etf',
    term: 'ETF (Exchange Traded Fund)',
    definition: 'Fundo de índice negociado em bolsa que replica a performance de um índice de referência. Oferece diversificação com baixo custo.',
    category: 'basico',
    example: 'BOVA11 replica o Ibovespa. Ao comprar uma cota, você investe em todas as empresas do índice.',
    relatedTerms: ['Índice', 'Diversificação', 'Taxa de Administração'],
    difficulty: 'iniciante',
  },
  
  // Indicadores
  {
    id: 'pl',
    term: 'P/L (Preço/Lucro)',
    definition: 'Indica quantos anos de lucro atual seriam necessários para recuperar o investimento. P/L baixo pode indicar ação barata, mas também problemas na empresa.',
    category: 'indicadores',
    formula: 'P/L = Preço da Ação / Lucro por Ação (LPA)',
    example: 'Se uma ação custa R$ 50 e o LPA é R$ 5, o P/L é 10. Significa que em 10 anos de lucro constante você recuperaria o investimento.',
    relatedTerms: ['LPA', 'Valuation', 'Múltiplo'],
    difficulty: 'iniciante',
  },
  {
    id: 'pvp',
    term: 'P/VP (Preço/Valor Patrimonial)',
    definition: 'Compara o preço de mercado com o valor contábil da empresa. P/VP abaixo de 1 indica que a empresa vale menos que seu patrimônio líquido.',
    category: 'indicadores',
    formula: 'P/VP = Preço da Ação / Valor Patrimonial por Ação (VPA)',
    example: 'Se P/VP = 0,8, você está pagando R$ 0,80 por cada R$ 1,00 de patrimônio da empresa.',
    relatedTerms: ['VPA', 'Patrimônio Líquido', 'Valuation'],
    difficulty: 'iniciante',
  },
  {
    id: 'dy',
    term: 'Dividend Yield (DY)',
    definition: 'Retorno em dividendos em relação ao preço da ação. Indica quanto você recebe de dividendos por cada real investido.',
    category: 'indicadores',
    formula: 'DY = (Dividendos por Ação / Preço da Ação) × 100',
    example: 'Se uma ação paga R$ 5 de dividendos por ano e custa R$ 50, o DY é 10%.',
    relatedTerms: ['Dividendo', 'Payout', 'Renda Passiva'],
    difficulty: 'iniciante',
  },
  {
    id: 'roe',
    term: 'ROE (Return on Equity)',
    definition: 'Retorno sobre o patrimônio líquido. Mede a eficiência da empresa em gerar lucro com o capital dos acionistas. ROE acima de 15% é considerado bom.',
    category: 'indicadores',
    formula: 'ROE = (Lucro Líquido / Patrimônio Líquido) × 100',
    example: 'Se uma empresa tem PL de R$ 100 milhões e lucra R$ 20 milhões, seu ROE é 20%.',
    relatedTerms: ['ROIC', 'ROA', 'Rentabilidade'],
    difficulty: 'intermediario',
  },
  {
    id: 'roic',
    term: 'ROIC (Return on Invested Capital)',
    definition: 'Retorno sobre o capital investido. Considera tanto o capital próprio quanto o de terceiros. Mais completo que o ROE.',
    category: 'indicadores',
    formula: 'ROIC = NOPAT / Capital Investido',
    example: 'ROIC de 15% significa que a empresa gera R$ 0,15 de lucro operacional para cada R$ 1 investido.',
    relatedTerms: ['ROE', 'WACC', 'Capital Investido'],
    difficulty: 'intermediario',
  },
  {
    id: 'ebitda',
    term: 'EBITDA',
    definition: 'Lucro antes de juros, impostos, depreciação e amortização. Mostra a geração de caixa operacional da empresa, sem efeitos financeiros e contábeis.',
    category: 'indicadores',
    formula: 'EBITDA = Lucro Operacional + Depreciação + Amortização',
    example: 'Usado para comparar empresas de setores diferentes, pois elimina diferenças de estrutura de capital e tributação.',
    relatedTerms: ['Margem EBITDA', 'EV/EBITDA', 'Lucro Operacional'],
    difficulty: 'intermediario',
  },
  {
    id: 'margem-liquida',
    term: 'Margem Líquida',
    definition: 'Percentual do faturamento que sobra como lucro líquido após todas as despesas. Indica a eficiência geral da empresa.',
    category: 'indicadores',
    formula: 'Margem Líquida = (Lucro Líquido / Receita Líquida) × 100',
    example: 'Margem de 15% significa que de cada R$ 100 em vendas, R$ 15 viram lucro.',
    relatedTerms: ['Margem Bruta', 'Margem EBITDA', 'Lucro Líquido'],
    difficulty: 'intermediario',
  },
  
  // Análise Técnica
  {
    id: 'suporte',
    term: 'Suporte',
    definition: 'Região de preço onde há concentração de compradores, impedindo que o preço caia mais. Quando rompido, pode indicar queda adicional.',
    category: 'analise',
    example: 'Se PETR4 sempre volta a subir quando chega em R$ 35, esse é um suporte importante.',
    relatedTerms: ['Resistência', 'Rompimento', 'Pullback'],
    difficulty: 'iniciante',
  },
  {
    id: 'resistencia',
    term: 'Resistência',
    definition: 'Região de preço onde há concentração de vendedores, impedindo que o preço suba mais. Quando rompida, pode indicar alta adicional.',
    category: 'analise',
    example: 'Se VALE3 sempre recua quando chega em R$ 70, esse é uma resistência importante.',
    relatedTerms: ['Suporte', 'Rompimento', 'Breakout'],
    difficulty: 'iniciante',
  },
  {
    id: 'media-movel',
    term: 'Média Móvel',
    definition: 'Indicador que suaviza os preços calculando a média de um período. Ajuda a identificar tendências e pontos de entrada/saída.',
    category: 'analise',
    formula: 'MM = Soma dos preços do período / Número de períodos',
    example: 'A MM200 (média de 200 dias) é usada para identificar a tendência de longo prazo. Preço acima = tendência de alta.',
    relatedTerms: ['MM Exponencial', 'Cruzamento de Médias', 'Tendência'],
    difficulty: 'iniciante',
  },
  {
    id: 'rsi',
    term: 'RSI (Índice de Força Relativa)',
    definition: 'Oscilador que mede a velocidade e magnitude dos movimentos de preço. Varia de 0 a 100. Acima de 70 = sobrecomprado, abaixo de 30 = sobrevendido.',
    category: 'analise',
    formula: 'RSI = 100 - (100 / (1 + RS)), onde RS = Média de ganhos / Média de perdas',
    example: 'RSI em 25 pode indicar que a ação está sobrevendida e pode haver oportunidade de compra.',
    relatedTerms: ['Sobrecomprado', 'Sobrevendido', 'Divergência'],
    difficulty: 'intermediario',
  },
  {
    id: 'macd',
    term: 'MACD',
    definition: 'Indicador de tendência que mostra a relação entre duas médias móveis exponenciais. Usado para identificar mudanças de tendência.',
    category: 'analise',
    formula: 'MACD = EMA(12) - EMA(26), Sinal = EMA(9) do MACD',
    example: 'Quando a linha MACD cruza acima da linha de sinal, é um sinal de compra.',
    relatedTerms: ['Média Móvel', 'Cruzamento', 'Histograma'],
    difficulty: 'intermediario',
  },
  {
    id: 'fibonacci',
    term: 'Fibonacci (Retrações)',
    definition: 'Níveis de suporte e resistência baseados na sequência de Fibonacci (23.6%, 38.2%, 50%, 61.8%). Usados para prever até onde um preço pode corrigir.',
    category: 'analise',
    example: 'Após uma alta de R$ 10 para R$ 20, a retração de 50% seria R$ 15.',
    relatedTerms: ['Suporte', 'Resistência', 'Correção'],
    difficulty: 'intermediario',
  },
  
  // Mercado
  {
    id: 'ibovespa',
    term: 'Ibovespa',
    definition: 'Principal índice da bolsa brasileira (B3). Composto pelas ações mais negociadas, representa aproximadamente 80% do volume de negócios.',
    category: 'mercado',
    example: 'Se o Ibovespa subiu 2%, significa que, em média, as principais ações brasileiras valorizaram 2%.',
    relatedTerms: ['B3', 'Índice', 'Blue Chips'],
    difficulty: 'iniciante',
  },
  {
    id: 'b3',
    term: 'B3',
    definition: 'Brasil, Bolsa, Balcão. É a bolsa de valores brasileira, resultado da fusão entre BM&FBovespa e Cetip. Única bolsa de valores do Brasil.',
    category: 'mercado',
    example: 'Todas as ações, FIIs, ETFs e derivativos no Brasil são negociados na B3.',
    relatedTerms: ['Ibovespa', 'Pregão', 'Home Broker'],
    difficulty: 'iniciante',
  },
  {
    id: 'liquidez',
    term: 'Liquidez',
    definition: 'Facilidade de comprar ou vender um ativo sem afetar significativamente seu preço. Alta liquidez = fácil negociar, baixa liquidez = difícil negociar.',
    category: 'mercado',
    example: 'PETR4 tem alta liquidez (milhões negociados por dia). Uma small cap pode ter baixa liquidez.',
    relatedTerms: ['Volume', 'Spread', 'Book de Ofertas'],
    difficulty: 'iniciante',
  },
  {
    id: 'volatilidade',
    term: 'Volatilidade',
    definition: 'Medida de variação dos preços de um ativo. Alta volatilidade = grandes oscilações, baixa volatilidade = preços mais estáveis.',
    category: 'mercado',
    example: 'Criptomoedas têm alta volatilidade (podem variar 10% em um dia). Títulos públicos têm baixa volatilidade.',
    relatedTerms: ['Risco', 'Desvio Padrão', 'VIX'],
    difficulty: 'iniciante',
  },
  {
    id: 'blue-chip',
    term: 'Blue Chip',
    definition: 'Ações de empresas grandes, consolidadas, com alta liquidez e histórico de bons resultados. Consideradas mais seguras.',
    category: 'mercado',
    example: 'Petrobras, Vale, Itaú e Ambev são exemplos de blue chips brasileiras.',
    relatedTerms: ['Small Cap', 'Mid Cap', 'Liquidez'],
    difficulty: 'iniciante',
  },
  {
    id: 'small-cap',
    term: 'Small Cap',
    definition: 'Empresas de menor capitalização de mercado. Geralmente têm maior potencial de crescimento, mas também maior risco e menor liquidez.',
    category: 'mercado',
    example: 'Empresas com valor de mercado abaixo de R$ 5 bilhões são geralmente consideradas small caps.',
    relatedTerms: ['Blue Chip', 'Mid Cap', 'Capitalização'],
    difficulty: 'iniciante',
  },
  
  // Derivativos
  {
    id: 'opcao',
    term: 'Opção',
    definition: 'Contrato que dá o direito (não obrigação) de comprar (call) ou vender (put) um ativo a um preço predeterminado até uma data específica.',
    category: 'derivativos',
    example: 'Uma call de PETR4 com strike R$ 40 dá o direito de comprar PETR4 por R$ 40, independente do preço de mercado.',
    relatedTerms: ['Call', 'Put', 'Strike', 'Prêmio'],
    difficulty: 'avancado',
  },
  {
    id: 'call',
    term: 'Call (Opção de Compra)',
    definition: 'Opção que dá o direito de comprar um ativo pelo preço de exercício. Ganha valor quando o ativo sobe.',
    category: 'derivativos',
    example: 'Se você compra uma call de VALE3 strike R$ 60 e a ação vai para R$ 70, você pode comprar por R$ 60 e lucrar R$ 10.',
    relatedTerms: ['Put', 'Strike', 'Prêmio', 'Exercício'],
    difficulty: 'avancado',
  },
  {
    id: 'put',
    term: 'Put (Opção de Venda)',
    definition: 'Opção que dá o direito de vender um ativo pelo preço de exercício. Ganha valor quando o ativo cai. Usada para proteção (hedge).',
    category: 'derivativos',
    example: 'Se você tem PETR4 e compra uma put strike R$ 35, você garante que pode vender por R$ 35 mesmo se a ação cair para R$ 25.',
    relatedTerms: ['Call', 'Strike', 'Hedge', 'Proteção'],
    difficulty: 'avancado',
  },
  {
    id: 'contrato-futuro',
    term: 'Contrato Futuro',
    definition: 'Acordo para comprar ou vender um ativo em data futura por preço acordado hoje. Diferente de opções, há obrigação de cumprir o contrato.',
    category: 'derivativos',
    example: 'Mini índice (WIN) e mini dólar (WDO) são contratos futuros populares entre day traders.',
    relatedTerms: ['Mini Índice', 'Mini Dólar', 'Margem', 'Alavancagem'],
    difficulty: 'avancado',
  },
  
  // Renda Fixa
  {
    id: 'tesouro-direto',
    term: 'Tesouro Direto',
    definition: 'Programa do governo federal que permite pessoas físicas comprarem títulos públicos. Considerado o investimento mais seguro do Brasil.',
    category: 'renda-fixa',
    example: 'Tesouro Selic é ideal para reserva de emergência. Tesouro IPCA+ protege contra inflação.',
    relatedTerms: ['Selic', 'IPCA', 'Título Público'],
    difficulty: 'iniciante',
  },
  {
    id: 'cdb',
    term: 'CDB (Certificado de Depósito Bancário)',
    definition: 'Título de renda fixa emitido por bancos. Você empresta dinheiro ao banco e recebe juros. Protegido pelo FGC até R$ 250 mil.',
    category: 'renda-fixa',
    example: 'CDB que paga 110% do CDI rende mais que a poupança e tem a mesma segurança.',
    relatedTerms: ['CDI', 'FGC', 'Renda Fixa'],
    difficulty: 'iniciante',
  },
  {
    id: 'lci-lca',
    term: 'LCI/LCA',
    definition: 'Letras de Crédito Imobiliário e do Agronegócio. Títulos de renda fixa isentos de IR para pessoa física. Protegidos pelo FGC.',
    category: 'renda-fixa',
    example: 'Uma LCI que paga 90% do CDI pode render mais que um CDB de 100% do CDI após o IR.',
    relatedTerms: ['CDB', 'CDI', 'Isenção de IR'],
    difficulty: 'iniciante',
  },
  {
    id: 'debenture',
    term: 'Debênture',
    definition: 'Título de dívida emitido por empresas para captar recursos. Geralmente paga mais que títulos bancários, mas tem maior risco.',
    category: 'renda-fixa',
    example: 'Debêntures incentivadas de infraestrutura são isentas de IR para pessoa física.',
    relatedTerms: ['Renda Fixa', 'Crédito Privado', 'Rating'],
    difficulty: 'intermediario',
  },
  {
    id: 'cdi',
    term: 'CDI (Certificado de Depósito Interbancário)',
    definition: 'Taxa de juros usada em empréstimos entre bancos. Serve como referência para investimentos de renda fixa. Muito próxima da Selic.',
    category: 'renda-fixa',
    formula: 'CDI ≈ Selic - 0,10%',
    example: 'Um CDB que paga 100% do CDI rende aproximadamente a taxa Selic.',
    relatedTerms: ['Selic', 'Renda Fixa', 'Benchmark'],
    difficulty: 'iniciante',
  },
  {
    id: 'selic',
    term: 'Selic',
    definition: 'Taxa básica de juros da economia brasileira, definida pelo Copom. Influencia todas as outras taxas de juros do país.',
    category: 'renda-fixa',
    example: 'Quando a Selic sobe, investimentos de renda fixa rendem mais, mas financiamentos ficam mais caros.',
    relatedTerms: ['CDI', 'Copom', 'Política Monetária'],
    difficulty: 'iniciante',
  },
];

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Todos', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'basico', label: 'Básico', icon: <Star className="h-4 w-4" /> },
  { value: 'indicadores', label: 'Indicadores', icon: <BarChart3 className="h-4 w-4" /> },
  { value: 'analise', label: 'Análise Técnica', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'mercado', label: 'Mercado', icon: <Building2 className="h-4 w-4" /> },
  { value: 'derivativos', label: 'Derivativos', icon: <Scale className="h-4 w-4" /> },
  { value: 'renda-fixa', label: 'Renda Fixa', icon: <Wallet className="h-4 w-4" /> },
];

export default function Glossario() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<'all' | 'iniciante' | 'intermediario' | 'avancado'>('all');

  const filteredTerms = useMemo(() => {
    let result = GLOSSARY_TERMS;

    if (category !== 'all') {
      result = result.filter(term => term.category === category);
    }

    if (difficulty !== 'all') {
      result = result.filter(term => term.difficulty === difficulty);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(term => 
        term.term.toLowerCase().includes(searchLower) ||
        term.definition.toLowerCase().includes(searchLower)
      );
    }

    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [category, difficulty, search]);

  const toggleExpand = (id: string) => {
    setExpandedTerms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'iniciante': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediario': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'avancado': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return diff;
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Glossário Financeiro</h1>
        </div>
        <p className="text-muted-foreground">
          Aprenda os principais termos do mercado financeiro com exemplos práticos
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar termo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={difficulty === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('all')}
          >
            Todos
          </Button>
          <Button
            variant={difficulty === 'iniciante' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('iniciante')}
            className={difficulty === 'iniciante' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Iniciante
          </Button>
          <Button
            variant={difficulty === 'intermediario' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('intermediario')}
            className={difficulty === 'intermediario' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            Intermediário
          </Button>
          <Button
            variant={difficulty === 'avancado' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty('avancado')}
            className={difficulty === 'avancado' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Avançado
          </Button>
        </div>
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <Button
            key={cat.value}
            variant={category === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat.value)}
            className="gap-2"
          >
            {cat.icon}
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{GLOSSARY_TERMS.length}</div>
            <div className="text-sm text-muted-foreground">Termos no glossário</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-500">
              {GLOSSARY_TERMS.filter(t => t.difficulty === 'iniciante').length}
            </div>
            <div className="text-sm text-muted-foreground">Para iniciantes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-500">
              {GLOSSARY_TERMS.filter(t => t.difficulty === 'intermediario').length}
            </div>
            <div className="text-sm text-muted-foreground">Intermediários</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-500">
              {GLOSSARY_TERMS.filter(t => t.difficulty === 'avancado').length}
            </div>
            <div className="text-sm text-muted-foreground">Avançados</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Termos */}
      <div className="space-y-3">
        {filteredTerms.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum termo encontrado</h3>
              <p className="text-muted-foreground">
                Tente buscar por outro termo ou altere os filtros
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTerms.map((term) => {
            const isExpanded = expandedTerms.has(term.id);
            
            return (
              <Card 
                key={term.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => toggleExpand(term.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{term.term}</h3>
                        <Badge variant="outline" className={getDifficultyColor(term.difficulty)}>
                          {getDifficultyLabel(term.difficulty)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {isExpanded ? term.definition : term.definition.substring(0, 150) + (term.definition.length > 150 ? '...' : '')}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      {term.formula && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Fórmula
                          </div>
                          <code className="text-sm">{term.formula}</code>
                        </div>
                      )}

                      {term.example && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Exemplo Prático
                          </div>
                          <p className="text-sm text-muted-foreground">{term.example}</p>
                        </div>
                      )}

                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div>
                          <div className="text-sm font-semibold mb-2">Termos Relacionados</div>
                          <div className="flex flex-wrap gap-2">
                            {term.relatedTerms.map(related => (
                              <Badge 
                                key={related} 
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearch(related);
                                }}
                              >
                                {related}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Rodapé Informativo */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Sobre o Glossário</h4>
              <p className="text-sm text-muted-foreground">
                Este glossário foi criado para ajudar investidores iniciantes e intermediários a entenderem 
                os principais termos do mercado financeiro. Os exemplos são ilustrativos e não constituem 
                recomendação de investimento. Sempre faça sua própria análise antes de investir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

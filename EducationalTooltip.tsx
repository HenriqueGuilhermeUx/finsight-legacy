import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface EducationalTooltipProps {
  term: string;
  definition: string;
  articleSlug?: string;
  children?: ReactNode;
  showIcon?: boolean;
}

// Glossário de termos financeiros
const glossary: Record<string, { definition: string; articleSlug?: string }> = {
  "P/L": {
    definition: "Preço sobre Lucro. Indica quantos anos levaria para recuperar o investimento com base no lucro atual da empresa. Quanto menor, mais barata a ação em relação ao lucro.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "P/VP": {
    definition: "Preço sobre Valor Patrimonial. Compara o preço da ação com o valor contábil da empresa. Valores abaixo de 1 podem indicar ação descontada.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "ROE": {
    definition: "Return on Equity (Retorno sobre Patrimônio). Mede a rentabilidade da empresa em relação ao capital próprio. Quanto maior, melhor a empresa gera lucro com o capital dos acionistas.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "ROIC": {
    definition: "Return on Invested Capital (Retorno sobre Capital Investido). Mede a eficiência da empresa em gerar retorno sobre todo o capital investido (próprio + terceiros).",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "DY": {
    definition: "Dividend Yield (Rendimento de Dividendos). Percentual de retorno em dividendos em relação ao preço da ação. Quanto maior, mais a ação paga em dividendos.",
    articleSlug: "dividendos-renda-passiva",
  },
  "EV/EBITDA": {
    definition: "Enterprise Value sobre EBITDA. Múltiplo que considera o valor total da empresa (incluindo dívidas) em relação ao lucro operacional. Usado para comparar empresas de setores diferentes.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "Dívida/PL": {
    definition: "Dívida Líquida sobre Patrimônio Líquido. Indica o nível de endividamento da empresa. Valores muito altos podem indicar risco financeiro.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "Margem EBITDA": {
    definition: "Percentual do EBITDA em relação à receita. Indica a eficiência operacional da empresa. Quanto maior, melhor a empresa converte receita em lucro operacional.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "Margem Líquida": {
    definition: "Percentual do lucro líquido em relação à receita. Indica quanto a empresa lucra de cada real de receita após todos os custos e impostos.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "RSI": {
    definition: "Relative Strength Index (Índice de Força Relativa). Oscilador que mede a velocidade e magnitude das mudanças de preço. Valores acima de 70 indicam sobrecompra, abaixo de 30 sobrevenda.",
    articleSlug: "analise-tecnica-avancada",
  },
  "MACD": {
    definition: "Moving Average Convergence Divergence. Indicador de tendência que mostra a relação entre duas médias móveis. Cruzamentos indicam mudanças de tendência.",
    articleSlug: "analise-tecnica-avancada",
  },
  "Bollinger Bands": {
    definition: "Bandas de Bollinger. Indicador de volatilidade que mostra faixas de preço baseadas em desvio padrão. Preços nas extremidades indicam possível reversão.",
    articleSlug: "analise-tecnica-avancada",
  },
  "SMA": {
    definition: "Simple Moving Average (Média Móvel Simples). Média dos preços em um período. Usada para identificar tendências e suportes/resistências.",
    articleSlug: "analise-tecnica-medias-moveis",
  },
  "EMA": {
    definition: "Exponential Moving Average (Média Móvel Exponencial). Média que dá mais peso aos preços recentes. Mais sensível a mudanças de preço que a SMA.",
    articleSlug: "analise-tecnica-medias-moveis",
  },
  "Beta": {
    definition: "Mede a volatilidade de um ativo em relação ao mercado. Beta > 1 indica maior volatilidade que o mercado, Beta < 1 indica menor volatilidade.",
    articleSlug: "diversificacao-alocacao-ativos",
  },
  "Sharpe Ratio": {
    definition: "Índice de Sharpe. Mede o retorno ajustado ao risco. Quanto maior, melhor o retorno em relação ao risco assumido.",
    articleSlug: "diversificacao-alocacao-ativos",
  },
  "Drawdown": {
    definition: "Máxima perda acumulada de um investimento do pico até o vale. Indica o risco de queda máxima que o investidor pode enfrentar.",
    articleSlug: "diversificacao-alocacao-ativos",
  },
  "DCF": {
    definition: "Discounted Cash Flow (Fluxo de Caixa Descontado). Método de valuation que estima o valor presente dos fluxos de caixa futuros da empresa.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "WACC": {
    definition: "Weighted Average Cost of Capital (Custo Médio Ponderado de Capital). Taxa de desconto usada no DCF que representa o custo de capital da empresa.",
    articleSlug: "analise-fundamentalista-pl-roe",
  },
  "Market Cap": {
    definition: "Capitalização de Mercado. Valor total da empresa calculado multiplicando o preço da ação pelo número de ações em circulação.",
    articleSlug: "primeiros-passos-investimentos",
  },
  "Volume": {
    definition: "Quantidade de ações negociadas em um período. Alto volume indica maior liquidez e interesse no ativo.",
    articleSlug: "primeiros-passos-investimentos",
  },
  "Liquidez": {
    definition: "Facilidade de comprar ou vender um ativo sem afetar significativamente seu preço. Ativos com alto volume têm maior liquidez.",
    articleSlug: "primeiros-passos-investimentos",
  },
  "Payout": {
    definition: "Percentual do lucro distribuído como dividendos. Payout alto indica que a empresa distribui mais lucro aos acionistas.",
    articleSlug: "dividendos-renda-passiva",
  },
  "FII": {
    definition: "Fundo de Investimento Imobiliário. Fundo que investe em imóveis ou títulos do setor imobiliário e distribui rendimentos mensais.",
    articleSlug: "fundos-imobiliarios-fiis",
  },
  "ETF": {
    definition: "Exchange Traded Fund (Fundo de Índice). Fundo que replica um índice e é negociado em bolsa como uma ação.",
    articleSlug: "etfs-exchange-traded-funds",
  },
  "Selic": {
    definition: "Taxa básica de juros da economia brasileira. Influencia todas as outras taxas de juros e o custo do crédito.",
    articleSlug: "taxa-selic-impacto-investimentos",
  },
  "IPCA": {
    definition: "Índice de Preços ao Consumidor Amplo. Principal indicador de inflação no Brasil, medido pelo IBGE.",
    articleSlug: "taxa-selic-impacto-investimentos",
  },
};

export function EducationalTooltip({
  term,
  definition: customDefinition,
  articleSlug: customArticleSlug,
  children,
  showIcon = true,
}: EducationalTooltipProps) {
  // Buscar no glossário ou usar definição customizada
  const glossaryEntry = glossary[term];
  const definition = customDefinition || glossaryEntry?.definition || "Definição não disponível.";
  const articleSlug = customArticleSlug || glossaryEntry?.articleSlug;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children ? (
          <span className="cursor-help border-b border-dashed border-muted-foreground/50 hover:border-primary transition-colors">
            {children}
          </span>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            {showIcon && <HelpCircle className="w-4 h-4" />}
            <span className="border-b border-dashed border-muted-foreground/50">
              {term}
            </span>
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent className="max-w-sm p-4" side="top">
        <div className="space-y-2">
          <div className="font-semibold text-sm">{term}</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {definition}
          </div>
          {articleSlug && (
            <Link href={`/artigos/${articleSlug}`}>
              <a className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                Saiba mais
                <ExternalLink className="w-3 h-3" />
              </a>
            </Link>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Hook para facilitar o uso
export function useEducationalTooltip(term: string) {
  const glossaryEntry = glossary[term];
  return {
    definition: glossaryEntry?.definition || "Definição não disponível.",
    articleSlug: glossaryEntry?.articleSlug,
    hasArticle: !!glossaryEntry?.articleSlug,
  };
}

// Componente para exibir termo com tooltip inline
export function TermWithTooltip({ term, children }: { term: string; children?: ReactNode }) {
  return (
    <EducationalTooltip term={term} definition="" showIcon={false}>
      {children || term}
    </EducationalTooltip>
  );
}

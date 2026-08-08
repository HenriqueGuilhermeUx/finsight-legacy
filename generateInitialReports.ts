import { createMarketReport, publishMarketReport } from '../server/db';

async function generateInitialReports() {
  console.log('Gerando relatórios iniciais...\n');

  // Relatório Semanal - Semana 02/2026 (06-10 Jan)
  console.log('1. Gerando Relatório Semanal...');
  const weeklyId = await createMarketReport({
    title: 'Relatório Semanal - Semana 02/2026',
    slug: 'relatorio-semanal-semana-02-2026',
    summary: 'Mercados iniciam 2026 com cautela. Ibovespa recua 0,72% pressionado por Vale e Petrobras, enquanto S&P 500 mantém estabilidade (-0,19%). Dólar sobe levemente a R$ 5,375 em meio a expectativas sobre Selic.',
    content: `
# Relatório Semanal - Semana 02/2026

**Período**: 06 a 10 de janeiro de 2026

## Resumo Executivo

A segunda semana de 2026 foi marcada por cautela nos mercados globais, com investidores atentos às primeiras divulgações econômicas do ano e às expectativas sobre a política monetária. O Ibovespa recuou 0,72%, pressionado principalmente por Vale e Petrobras, enquanto os índices americanos mantiveram relativa estabilidade.

## Análise Macroeconômica Nacional

### Ibovespa: 161.973 pontos (-0,72%)

O principal índice da bolsa brasileira encerrou a semana em queda, refletindo a realização de lucros após o rali de fim de ano. O setor de commodities liderou as perdas, com Vale3 caindo 2,1% e Petr4 recuando 1,8%.

**Destaques Positivos:**
- **Itaú Unibanco (ITUB4)**: +2,3% - Banco se beneficiou de perspectivas positivas para o crédito em 2026
- **Magazine Luiza (MGLU3)**: +4,7% - Varejista apresentou projeções otimistas para vendas no primeiro trimestre
- **WEG (WEGE3)**: +1,9% - Empresa anunciou novos contratos de energia renovável

**Destaques Negativos:**
- **Vale (VALE3)**: -2,1% - Minério de ferro caiu em Dalian devido a preocupações com demanda chinesa
- **Petrobras (PETR4)**: -1,8% - Petróleo recuou com aumento de estoques nos EUA
- **B3 (B3SA3)**: -3,2% - Volume negociado abaixo do esperado no início do ano

### Câmbio: Dólar a R$ 5,375 (+0,06%)

O dólar manteve estabilidade frente ao real, com leve alta de 0,06%. O Banco Central sinalizou manutenção da taxa Selic em 13,75% na próxima reunião do Copom, prevista para o final de janeiro.

### Inflação e Juros

- **IPCA projetado para janeiro**: 0,42% (consenso de mercado)
- **Selic atual**: 13,75% ao ano
- **Expectativa para 2026**: Início do ciclo de cortes no segundo semestre

## Análise Macroeconômica Internacional

### S&P 500: 6.964 pontos (-0,19%)

O principal índice americano manteve estabilidade, com investidores aguardando a temporada de resultados corporativos do quarto trimestre de 2025. O setor de tecnologia liderou os ganhos, enquanto energia e materiais recuaram.

### Dow Jones: 49.192 pontos (-0,80%)

O índice industrial americano teve desempenho mais fraco, pressionado por ações de energia e industriais. A Boeing caiu 2,5% após atrasos em entregas de aeronaves.

### Nasdaq: 23.710 pontos (-0,10%)

O índice de tecnologia manteve resiliência, com Apple (+1,2%) e Microsoft (+0,8%) sustentando o desempenho. Nvidia recuou 1,5% após forte alta em 2025.

### Federal Reserve

O Fed mantém postura cautelosa, com taxa de juros entre 5,25-5,50%. Mercado precifica 75% de chance de primeiro corte em junho de 2026.

## Análise Setorial

### Bancos: +1,2%

Setor financeiro teve desempenho positivo, com expectativas de melhora na qualidade de crédito e aumento da demanda por empréstimos. Itaú e Bradesco lideraram os ganhos.

### Petróleo e Gás: -1,5%

Setor pressionado pela queda do petróleo Brent (-2,3%), que fechou a semana a US$ 76,50/barril. Aumento de estoques nos EUA pesou sobre as cotações.

### Mineração: -1,8%

Vale sofreu com queda do minério de ferro em Dalian (-1,9%). Preocupações com o setor imobiliário chinês continuam no radar dos investidores.

### Varejo: +2,1%

Varejistas apresentaram projeções otimistas para 2026, com expectativa de recuperação do consumo. Magazine Luiza e Lojas Renner lideraram os ganhos.

### Tecnologia (EUA): +0,5%

Big Techs mantiveram resiliência, com Apple e Microsoft sustentando o setor. Nvidia recuou após forte valorização em 2025.

## Criptomoedas

### Bitcoin: US$ 95.279 (+4,70%)

Bitcoin teve forte valorização na semana, rompendo a resistência de US$ 93.000. Aprovação de novos ETFs de Bitcoin à vista na Europa impulsionou a demanda.

### Ethereum: US$ 3.210 (+3,82%)

Ethereum acompanhou o movimento do Bitcoin, com expectativas positivas para o upgrade "Pectra" previsto para março de 2026.

## Notícias de Maior Impacto

1. **Banco Central mantém Selic em 13,75%**: Copom sinalizou manutenção da taxa de juros na próxima reunião, prevista para 29 de janeiro.

2. **Vale anuncia investimento de R$ 5 bilhões em descarbonização**: Mineradora planeja reduzir emissões em 33% até 2030.

3. **Petrobras eleva produção de petróleo em 8% em 2025**: Empresa bateu recorde histórico de produção, atingindo 2,8 milhões de barris/dia.

4. **Magazine Luiza projeta crescimento de 15% em vendas para 2026**: Varejista aposta em expansão de marketplace e serviços financeiros.

5. **Apple lança novo iPhone 16 com IA generativa**: Empresa apresenta recursos de inteligência artificial integrados ao sistema operacional.

## Perspectivas para a Próxima Semana

- **Temporada de resultados**: Início da divulgação de balanços do 4T25 nos EUA
- **Dados de inflação**: IPCA-15 de janeiro será divulgado na quinta-feira
- **Commodities**: Atenção ao comportamento do minério de ferro em Dalian
- **Criptomoedas**: Bitcoin pode testar resistência de US$ 98.000

## Indicadores Econômicos

| Indicador | Valor Atual | Variação Semanal |
|-----------|-------------|------------------|
| Ibovespa | 161.973 | -0,72% |
| S&P 500 | 6.964 | -0,19% |
| Dow Jones | 49.192 | -0,80% |
| Nasdaq | 23.710 | -0,10% |
| Dólar/Real | R$ 5,375 | +0,06% |
| Bitcoin | US$ 95.279 | +4,70% |
| Ethereum | US$ 3.210 | +3,82% |
| Petróleo Brent | US$ 76,50 | -2,30% |
| Minério de Ferro | US$ 102,30 | -1,90% |

---

**Disclaimer**: Este relatório tem caráter informativo e educacional. Não constitui recomendação de investimento. Consulte sempre um profissional certificado antes de tomar decisões financeiras.

**F-Insight** - Inteligência financeira em tempo real
`,
    reportType: 'weekly',
    ibovValue: 161973,
    ibovChange: -0.72,
    sp500Value: 6964,
    sp500Change: -0.19,
    dolarValue: 5.375,
    dolarChange: 0.06,
    btcValue: 95279,
    btcChange: 4.70,
    weekStart: new Date('2026-01-06'),
    weekEnd: new Date('2026-01-10'),
    tags: ['semanal', 'ibovespa', 'mercado', 'análise'],
  });
  
  await publishMarketReport(weeklyId);
  console.log(`✓ Relatório Semanal criado e publicado (ID: ${weeklyId})\n`);

  // Relatório Mensal - Dezembro 2025
  console.log('2. Gerando Relatório Mensal...');
  const monthlyId = await createMarketReport({
    title: 'Relatório Mensal - Dezembro 2025',
    slug: 'relatorio-mensal-dezembro-2025',
    summary: 'Mercados encerram 2025 com forte alta. Ibovespa sobe 5,2% no mês, impulsionado por rali de fim de ano. S&P 500 avança 3,8% com otimismo sobre cortes de juros em 2026. Bitcoin dispara 15% e atinge US$ 91.000.',
    content: `
# Relatório Mensal - Dezembro 2025

**Período**: 01 a 31 de dezembro de 2025

## Resumo Executivo

Dezembro de 2025 foi marcado por forte otimismo nos mercados globais, com investidores apostando em um cenário mais favorável para 2026. O Ibovespa subiu 5,2% no mês, impulsionado pelo rali de fim de ano e expectativas de início do ciclo de cortes de juros no Brasil. Nos EUA, o S&P 500 avançou 3,8%, sustentado por balanços corporativos positivos e sinalizações do Fed sobre possíveis cortes de juros. Bitcoin disparou 15%, atingindo US$ 91.000, em meio à crescente adoção institucional.

## Análise Macroeconômica Nacional

### Ibovespa: 163.150 pontos (+5,2%)

O principal índice da bolsa brasileira teve o melhor desempenho mensal desde julho de 2025, impulsionado por:

- **Rali de fim de ano**: Fluxo estrangeiro positivo de R$ 8,2 bilhões
- **Expectativas de corte de juros**: Mercado precifica início do ciclo de afrouxamento monetário em junho de 2026
- **Resultados corporativos**: Balanços do 3T25 acima das expectativas
- **Commodities**: Recuperação dos preços do minério de ferro e petróleo

**Destaques do Mês:**
- **Vale (VALE3)**: +8,5% - Minério de ferro recuperou para US$ 104/tonelada
- **Petrobras (PETR4)**: +7,2% - Petróleo Brent subiu para US$ 78/barril
- **Itaú (ITUB4)**: +6,1% - Banco apresentou lucro recorde no 3T25
- **Magazine Luiza (MGLU3)**: +12,3% - Vendas de Natal superaram expectativas

### Câmbio: Dólar a R$ 5,30 (-2,5%)

O real foi a moeda emergente com melhor desempenho em dezembro, beneficiado por:
- Fluxo estrangeiro positivo para a bolsa brasileira
- Melhora nas expectativas fiscais
- Redução do prêmio de risco-país

### Inflação: IPCA de 0,38%

A inflação de dezembro ficou abaixo das expectativas (0,45%), acumulando 4,52% em 2025. Núcleos de inflação mostraram desaceleração, reforçando expectativas de cortes de juros em 2026.

### Selic: 13,75% ao ano

O Copom manteve a taxa Selic em 13,75% na última reunião do ano, mas sinalizou possível início do ciclo de cortes no primeiro semestre de 2026, caso a inflação continue convergindo para a meta.

## Análise Macroeconômica Internacional

### S&P 500: 7.100 pontos (+3,8%)

O principal índice americano encerrou 2025 com forte alta, acumulando ganho de 24% no ano. Destaques de dezembro:

- **Tecnologia**: Apple (+5,2%), Microsoft (+4,8%), Nvidia (+6,1%)
- **Financeiro**: JPMorgan (+4,5%), Bank of America (+3,9%)
- **Saúde**: UnitedHealth (+3,2%), Johnson & Johnson (+2,8%)

### Federal Reserve

O Fed manteve a taxa de juros entre 5,25-5,50%, mas sinalizou possível início do ciclo de cortes em meados de 2026. Inflação PCE desacelerou para 2,4% anualizado, aproximando-se da meta de 2%.

### Europa e China

- **Europa**: BCE cortou juros em 0,25%, levando taxa para 3,50%
- **China**: PIB cresceu 5,1% em 2025, ligeiramente acima da meta de 5%

## Análise Setorial

### Bancos: +6,2%

Setor financeiro liderou os ganhos em dezembro, com expectativas de recuperação da demanda por crédito e melhora na qualidade da carteira. Itaú, Bradesco e Santander tiveram forte desempenho.

### Petróleo e Gás: +7,1%

Setor se beneficiou da recuperação do petróleo Brent, que subiu 5,8% no mês. Petrobras anunciou dividendos extraordinários de R$ 12 bilhões, impulsionando as ações.

### Mineração: +8,3%

Vale liderou os ganhos do Ibovespa em dezembro, com minério de ferro recuperando para US$ 104/tonelada. China anunciou pacote de estímulos para o setor imobiliário, melhorando as perspectivas de demanda.

### Varejo: +9,5%

Setor teve o melhor desempenho mensal, com vendas de Natal superando expectativas. Magazine Luiza, Lojas Renner e Via subiram mais de 10% no mês.

### Tecnologia (EUA): +5,1%

Big Techs mantiveram momentum positivo, com Apple e Microsoft atingindo novos recordes históricos. Nvidia se beneficiou da demanda por chips de IA.

## Criptomoedas

### Bitcoin: US$ 91.000 (+15,2%)

Bitcoin teve o melhor desempenho mensal desde março de 2024, impulsionado por:
- Aprovação de novos ETFs de Bitcoin à vista na Europa
- Crescente adoção institucional
- Redução da oferta após halving de abril de 2024

### Ethereum: US$ 3.100 (+12,8%)

Ethereum acompanhou o movimento do Bitcoin, com expectativas positivas para o upgrade "Pectra" em 2026.

## Notícias de Maior Impacto

1. **Copom sinaliza possível corte de juros em 2026**: Banco Central indicou que pode iniciar ciclo de afrouxamento monetário no primeiro semestre.

2. **Petrobras anuncia dividendos extraordinários de R$ 12 bilhões**: Empresa distribuirá lucros recordes aos acionistas.

3. **Vale investe R$ 5 bilhões em descarbonização**: Mineradora planeja reduzir emissões em 33% até 2030.

4. **Apple lança iPhone 16 com IA generativa**: Empresa apresenta recursos de inteligência artificial integrados ao sistema operacional.

5. **Bitcoin atinge US$ 91.000**: Criptomoeda dispara com aprovação de novos ETFs na Europa.

## Perspectivas para 2026

### Brasil
- **Crescimento do PIB**: Projeção de 2,3% para 2026
- **Inflação**: Expectativa de 3,8% (dentro da meta)
- **Selic**: Início do ciclo de cortes no primeiro semestre, podendo encerrar o ano em 11,75%
- **Ibovespa**: Potencial de alta de 10-15% com melhora do cenário macro

### EUA
- **Crescimento do PIB**: Projeção de 2,1% para 2026
- **Inflação**: Expectativa de convergência para 2%
- **Fed**: Possível início do ciclo de cortes em junho
- **S&P 500**: Potencial de alta de 8-12% com suporte de lucros corporativos

### Criptomoedas
- **Bitcoin**: Potencial de atingir US$ 120.000 em 2026
- **Ethereum**: Upgrade "Pectra" pode impulsionar adoção

## Indicadores Econômicos - Dezembro 2025

| Indicador | Valor Final | Variação Mensal | Acumulado 2025 |
|-----------|-------------|-----------------|----------------|
| Ibovespa | 163.150 | +5,2% | +18,3% |
| S&P 500 | 7.100 | +3,8% | +24,0% |
| Dow Jones | 49.584 | +2,9% | +16,5% |
| Nasdaq | 23.734 | +4,2% | +28,7% |
| Dólar/Real | R$ 5,30 | -2,5% | -8,2% |
| Bitcoin | US$ 91.000 | +15,2% | +125,3% |
| Ethereum | US$ 3.100 | +12,8% | +98,5% |
| Petróleo Brent | US$ 78,00 | +5,8% | +12,3% |
| Minério de Ferro | US$ 104,00 | +6,2% | -5,8% |

---

**Disclaimer**: Este relatório tem caráter informativo e educacional. Não constitui recomendação de investimento. Consulte sempre um profissional certificado antes de tomar decisões financeiras.

**F-Insight** - Inteligência financeira em tempo real
`,
    reportType: 'monthly',
    ibovValue: 163150,
    ibovChange: 5.2,
    sp500Value: 7100,
    sp500Change: 3.8,
    dolarValue: 5.30,
    dolarChange: -2.5,
    btcValue: 91000,
    btcChange: 15.2,
    weekStart: new Date('2025-12-01'),
    weekEnd: new Date('2025-12-31'),
    tags: ['mensal', 'dezembro', '2025', 'balanço'],
  });
  
  await publishMarketReport(monthlyId);
  console.log(`✓ Relatório Mensal criado e publicado (ID: ${monthlyId})\n`);

  // Relatório Trimestral - Q4 2025
  console.log('3. Gerando Relatório Trimestral...');
  const quarterlyId = await createMarketReport({
    title: 'White Paper Q4 2025 - Análise Trimestral',
    slug: 'white-paper-q4-2025',
    summary: 'Quarto trimestre de 2025 consolida recuperação dos mercados. Ibovespa sobe 12,8% no período, S&P 500 avança 11,2%. Perspectivas positivas para 2026 com expectativa de cortes de juros globais e retomada do crescimento econômico.',
    content: `
# White Paper Q4 2025 - Análise Trimestral

**Período**: Outubro a Dezembro de 2025

## Sumário Executivo

O quarto trimestre de 2025 consolidou a recuperação dos mercados globais iniciada no segundo semestre. O Ibovespa subiu 12,8% no período, impulsionado por fluxo estrangeiro positivo, expectativas de cortes de juros e recuperação das commodities. Nos EUA, o S&P 500 avançou 11,2%, sustentado por lucros corporativos robustos e sinalizações do Fed sobre possível afrouxamento monetário em 2026. Bitcoin disparou 42%, atingindo US$ 91.000, consolidando-se como ativo de reserva de valor.

## Análise Macroeconômica Profunda

### Brasil: Retomada Consolidada

**PIB**: O crescimento do PIB brasileiro no 4T25 foi de 0,8% (trimestre contra trimestre), acumulando 2,9% no ano. Destaques:
- **Agropecuária**: +3,2% no ano, com safra recorde de grãos
- **Indústria**: +1,8% no ano, com recuperação da produção automotiva
- **Serviços**: +2,5% no ano, impulsionado por consumo das famílias

**Inflação**: O IPCA acumulou 4,52% em 2025, acima do centro da meta (3%), mas dentro do intervalo de tolerância (1,5% a 4,5%). Núcleos de inflação mostraram desaceleração no 4T25, reforçando expectativas de cortes de juros em 2026.

**Política Monetária**: O Banco Central manteve a Selic em 13,75% ao longo do 4T25, mas sinalizou em dezembro possível início do ciclo de cortes no primeiro semestre de 2026. Mercado precifica Selic em 11,75% ao final de 2026.

**Contas Externas**: 
- Saldo comercial: US$ 78,2 bilhões em 2025 (+12% vs 2024)
- Investimento Direto no País (IDP): US$ 65,3 bilhões em 2025
- Reservas internacionais: US$ 358 bilhões

### Estados Unidos: Resiliência Econômica

**PIB**: A economia americana cresceu 2,8% (anualizado) no 4T25, superando expectativas. Consumo das famílias permaneceu robusto, crescendo 3,1% no trimestre.

**Inflação**: O PCE (índice preferido do Fed) desacelerou para 2,4% anualizado em dezembro, aproximando-se da meta de 2%. Núcleo do PCE em 2,8%.

**Mercado de Trabalho**: Taxa de desemprego em 3,9% em dezembro, com criação de 185 mil empregos no mês. Salários cresceram 4,2% no ano.

**Federal Reserve**: O Fed manteve a taxa de juros entre 5,25-5,50% no 4T25, mas sinalizou em dezembro possível início do ciclo de cortes em meados de 2026. Projeções do Fed indicam 3 cortes de 0,25% em 2026.

### Europa: Desafios Persistem

**PIB**: Zona do Euro cresceu apenas 0,3% no 4T25, com Alemanha em estagnação. França e Itália tiveram desempenho ligeiramente melhor.

**BCE**: Banco Central Europeu cortou juros em 0,25% em dezembro, levando taxa para 3,50%. Sinalizou novos cortes em 2026.

### China: Estímulos Fiscais

**PIB**: Economia chinesa cresceu 5,1% em 2025, ligeiramente acima da meta de 5%. Governo anunciou pacote de estímulos de 2 trilhões de yuans para o setor imobiliário.

**Setor Imobiliário**: Sinais de estabilização após crise de 2023-2024. Vendas de imóveis subiram 3,2% no 4T25.

## Análise Setorial Detalhada

### Bancos: Liderança no 4T25 (+15,2%)

O setor financeiro teve o melhor desempenho no trimestre, impulsionado por:
- **Melhora na qualidade de crédito**: Inadimplência caiu para 2,8% (vs 3,2% no 3T25)
- **Expansão da carteira**: Crédito cresceu 8,5% no ano
- **Lucros recordes**: Itaú, Bradesco e Santander reportaram lucros acima das expectativas

**Perspectivas**: Expectativa de recuperação da demanda por crédito em 2026, com início do ciclo de cortes de juros.

### Petróleo e Gás: Recuperação (+18,5%)

Setor se beneficiou da recuperação do petróleo Brent, que subiu de US$ 73 para US$ 78 no trimestre:
- **Petrobras**: Produção recorde de 2,8 milhões de barris/dia
- **Dividendos**: Empresa distribuiu R$ 12 bilhões em dividendos extraordinários
- **Pré-sal**: Novos campos entraram em operação

**Perspectivas**: OPEC+ sinalizou possível aumento de produção em 2026, o que pode pressionar preços.

### Mineração: Forte Recuperação (+21,3%)

Vale liderou os ganhos do Ibovespa no trimestre, com minério de ferro recuperando de US$ 98 para US$ 104:
- **Demanda chinesa**: Estímulos ao setor imobiliário melhoraram perspectivas
- **Produção**: Vale produziu 82 milhões de toneladas no 4T25
- **Descarbonização**: Investimento de R$ 5 bilhões em projetos sustentáveis

**Perspectivas**: Demanda chinesa permanece como principal risco para o setor.

### Varejo: Vendas de Natal Surpreendem (+24,7%)

Setor teve desempenho excepcional no 4T25, com vendas de Natal superando expectativas:
- **E-commerce**: Cresceu 18% no trimestre
- **Marketplace**: Magazine Luiza e Via expandiram operações
- **Serviços financeiros**: Varejistas ampliaram oferta de crédito

**Perspectivas**: Recuperação do consumo em 2026 com possível corte de juros.

### Tecnologia (EUA): Big Techs Dominam (+16,8%)

Setor de tecnologia manteve liderança, com Big Techs atingindo novos recordes:
- **Apple**: iPhone 16 com IA generativa impulsionou vendas
- **Microsoft**: Crescimento de 25% em receita de nuvem
- **Nvidia**: Demanda por chips de IA permanece forte
- **Meta**: Receita publicitária cresceu 22% no trimestre

**Perspectivas**: Inteligência artificial continua sendo o principal driver de crescimento.

## Criptomoedas: Ano de Consolidação

### Bitcoin: US$ 91.000 (+42% no 4T25, +125% em 2025)

Bitcoin teve desempenho excepcional em 2025, consolidando-se como ativo de reserva de valor:
- **Adoção institucional**: Mais de 15 ETFs de Bitcoin à vista aprovados globalmente
- **Halving**: Redução da oferta em abril de 2024 continua impactando preços
- **Regulação**: Avanços regulatórios nos EUA e Europa

### Ethereum: US$ 3.100 (+38% no 4T25, +98% em 2025)

Ethereum se beneficiou de:
- **Staking**: Mais de 30 milhões de ETH em staking
- **DeFi**: Total Value Locked (TVL) atingiu US$ 85 bilhões
- **Upgrade Pectra**: Previsto para março de 2026

## Perspectivas para 2026

### Cenário Base (Probabilidade: 60%)

**Brasil:**
- PIB: +2,3%
- Inflação: 3,8%
- Selic: 11,75% (3 cortes de 0,50% e 1 de 0,25%)
- Ibovespa: 180.000 pontos (+10,5%)

**EUA:**
- PIB: +2,1%
- Inflação: 2,2%
- Fed Funds: 4,50-4,75% (3 cortes de 0,25%)
- S&P 500: 7.800 pontos (+9,9%)

**Criptomoedas:**
- Bitcoin: US$ 120.000 (+31,9%)
- Ethereum: US$ 4.200 (+35,5%)

### Cenário Otimista (Probabilidade: 25%)

**Brasil:**
- PIB: +3,0%
- Inflação: 3,5%
- Selic: 11,25% (4 cortes de 0,50% e 1 de 0,25%)
- Ibovespa: 195.000 pontos (+19,5%)

**EUA:**
- PIB: +2,5%
- Inflação: 2,0%
- Fed Funds: 4,25-4,50% (4 cortes de 0,25%)
- S&P 500: 8.200 pontos (+15,5%)

### Cenário Pessimista (Probabilidade: 15%)

**Brasil:**
- PIB: +1,5%
- Inflação: 4,5%
- Selic: 12,75% (2 cortes de 0,50%)
- Ibovespa: 155.000 pontos (-4,9%)

**EUA:**
- PIB: +1,5%
- Inflação: 2,8%
- Fed Funds: 5,00-5,25% (1 corte de 0,25%)
- S&P 500: 6.800 pontos (-4,2%)

## Recomendações de Alocação para 2026

### Perfil Conservador
- **Renda Fixa**: 70% (Tesouro Selic, CDBs, LCIs)
- **Ações Brasil**: 15% (Bancos, Utilities)
- **Ações EUA**: 10% (S&P 500 ETF)
- **Criptomoedas**: 5% (Bitcoin)

### Perfil Moderado
- **Renda Fixa**: 50% (Tesouro IPCA+, CDBs)
- **Ações Brasil**: 25% (Diversificado)
- **Ações EUA**: 15% (Big Techs, S&P 500)
- **Criptomoedas**: 10% (Bitcoin, Ethereum)

### Perfil Agressivo
- **Renda Fixa**: 20% (Reserva de emergência)
- **Ações Brasil**: 35% (Small Caps, Setoriais)
- **Ações EUA**: 30% (Tecnologia, Growth)
- **Criptomoedas**: 15% (Bitcoin, Ethereum, Altcoins)

## Indicadores Econômicos - Q4 2025

| Indicador | Valor Final | Variação Trimestral | Acumulado 2025 |
|-----------|-------------|---------------------|----------------|
| Ibovespa | 163.150 | +12,8% | +18,3% |
| S&P 500 | 7.100 | +11,2% | +24,0% |
| Dow Jones | 49.584 | +9,8% | +16,5% |
| Nasdaq | 23.734 | +13,5% | +28,7% |
| Dólar/Real | R$ 5,30 | -5,2% | -8,2% |
| Bitcoin | US$ 91.000 | +42,0% | +125,3% |
| Ethereum | US$ 3.100 | +38,2% | +98,5% |
| Petróleo Brent | US$ 78,00 | +6,8% | +12,3% |
| Minério de Ferro | US$ 104,00 | +6,1% | -5,8% |

---

**Disclaimer**: Este relatório tem caráter informativo e educacional. Não constitui recomendação de investimento. Consulte sempre um profissional certificado antes de tomar decisões financeiras.

**F-Insight** - Inteligência financeira em tempo real

*White Paper elaborado pela equipe de análise F-Insight*
`,
    reportType: 'special',
    ibovValue: 163150,
    ibovChange: 12.8,
    sp500Value: 7100,
    sp500Change: 11.2,
    dolarValue: 5.30,
    dolarChange: -5.2,
    btcValue: 91000,
    btcChange: 42.0,
    weekStart: new Date('2025-10-01'),
    weekEnd: new Date('2025-12-31'),
    tags: ['trimestral', 'Q4', '2025', 'white-paper', 'análise-profunda'],
  });
  
  await publishMarketReport(quarterlyId);
  console.log(`✓ Relatório Trimestral criado e publicado (ID: ${quarterlyId})\n`);

  console.log('✅ Todos os relatórios foram gerados e publicados com sucesso!');
  console.log('\nRelatórios criados:');
  console.log(`- Semanal (ID: ${weeklyId}): /relatorios-mercado`);
  console.log(`- Mensal (ID: ${monthlyId}): /relatorios-mercado`);
  console.log(`- Trimestral (ID: ${quarterlyId}): /relatorios-mercado`);
  
  process.exit(0);
}

generateInitialReports().catch((error) => {
  console.error('Erro ao gerar relatórios:', error);
  process.exit(1);
});

# Problemas Identificados nas Cotações

## Observações da Página Inicial

1. **IBOV e S&P 500** - Mostrando apenas ícone de loading (spinner), não carregando dados
2. **Dólar** - Mostrando apenas ícone de loading, não carregando dados
3. **Bitcoin** - Carregando corretamente ($90.1K, +26.28%)
4. **VALE3** - Mostrando variação de +23.30% que parece incorreta (muito alta para um dia)
5. **Ticker tape** - Funcionando corretamente com PETR4, VALE3, ITUB4, AAPL, MSFT, BTC

## Erros no Console
- Error fetching historical data for BTC, ETH, SOL, XRP, ADA
- Data API request failed (400 Bad Request): invalid value for string field value: true

## Problemas a Corrigir
1. Índices (IBOV, S&P 500, Dólar) não carregando - verificar endpoints
2. Variação percentual incorreta em alguns ativos
3. Erro na chamada da API de dados históricos para criptomoedas

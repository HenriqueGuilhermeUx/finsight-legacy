# Configuração de Cron Jobs para F-Insight

Este guia explica como configurar os cron jobs externos necessários para o funcionamento completo da plataforma F-Insight. São dois cron jobs principais: um para processar alertas de sinal (horário) e outro para atualizar os dados de fallback (semanal).

## Visão Geral dos Cron Jobs

A F-Insight utiliza dois cron jobs para automação:

| Cron Job | Frequência | Função |
|----------|------------|--------|
| **Alertas de Sinal** | A cada 1 hora | Processa alertas de mudança de sinal e notifica usuários |
| **Atualização de Fallback** | Segunda-feira às 8h | Atualiza dados estáticos de 190+ ativos |

## Cron Job 1: Alertas de Sinal (Horário)

### Endpoint

| Propriedade | Valor |
|-------------|-------|
| **URL** | `https://finsightai-hytg7e8e.manus.space/api/trpc/signalAlerts.runCron` |
| **Método** | POST |
| **Content-Type** | application/json |
| **Body** | `{}` |

### O que este cron faz?

Quando executado, o endpoint realiza as seguintes ações:

1. **Busca todos os alertas ativos** dos usuários cadastrados
2. **Calcula os indicadores técnicos** (RSI, MACD, Bollinger, SMAs) para cada ativo monitorado
3. **Compara o sinal atual** com o sinal anterior salvo
4. **Cria notificações** para os usuários cujos alertas foram disparados
5. **Envia emails** para os usuários notificados
6. **Salva o histórico de sinais** dos 20 ativos mais populares

### Resposta de sucesso

```json
{
  "result": {
    "data": {
      "processed": 5,
      "notified": 2,
      "errors": [],
      "savedPopularSignals": 20
    }
  }
}
```

## Cron Job 2: Atualização de Fallback (Semanal)

### Endpoint

| Propriedade | Valor |
|-------------|-------|
| **URL** | `https://finsightai-hytg7e8e.manus.space/api/trpc/signalAlerts.updateFallbackData` |
| **Método** | POST |
| **Content-Type** | application/json |
| **Body** | `{}` |

### O que este cron faz?

1. **Busca preços reais** de todos os 190+ ativos no sistema de fallback
2. **Atualiza os dados estáticos** com valores atualizados (preço, variação, volume, 52W high/low)
3. **Garante que o fallback** tenha dados recentes quando a API principal estiver com rate limit

### Ativos cobertos pelo fallback

| Categoria | Quantidade | Exemplos |
|-----------|------------|----------|
| Ações BR | 50+ | PETR4, VALE3, ITUB4, BBDC4 |
| Ações US | 50+ | AAPL, MSFT, GOOGL, AMZN |
| BDRs | 47 | AAPL34, MSFT34, AMZO34, NVDC34 |
| FIIs | 37 | HGLG11, XPML11, MXRF11, KNCR11 |
| ETFs BR | 5 | BOVA11, IVVB11, HASH11 |
| ETFs US | 10 | SPY, QQQ, IWM, VOO |
| Criptomoedas | 25 | BTC, ETH, SOL, XRP |

### Resposta de sucesso

```json
{
  "result": {
    "data": {
      "updated": 185,
      "failed": 5,
      "errors": ["TICKER: error message"]
    }
  }
}
```

## Passo a Passo: Configurar no cron-job.org

O cron-job.org é um serviço gratuito e confiável para agendar chamadas HTTP. Siga os passos abaixo para configurar ambos os cron jobs.

### Passo 1: Criar uma conta

1. Acesse [https://cron-job.org](https://cron-job.org)
2. Clique em **"Sign Up"** no canto superior direito
3. Preencha o formulário com seu email e senha
4. Confirme seu email clicando no link enviado

### Passo 2: Configurar o Cron de Alertas (Horário)

1. Após fazer login, clique no botão **"Create cronjob"** (ou "Cronjobs" > "Create")

2. Preencha os campos básicos:

   | Campo | Valor |
   |-------|-------|
   | **Title** | F-Insight Alertas de Sinal |
   | **URL** | `https://finsightai-hytg7e8e.manus.space/api/trpc/signalAlerts.runCron` |

3. Na seção **"Execution schedule"**:
   - Selecione **"Every hour"** (a cada hora)
   - Ou use a expressão cron: `0 * * * *`

4. Na seção **"Request settings"**:
   - **Request method:** POST
   - Clique em **"Show advanced settings"**
   - Em **"Request headers"**, adicione:
     - Name: `Content-Type`
     - Value: `application/json`
   - Em **"Request body"**, digite: `{}`

5. Na seção **"Notifications"** (opcional):
   - ✅ Marque "Notify on failure" para receber alertas de erro
   - ❌ Desmarque "Notify on success" para evitar spam

6. Clique em **"Create"** para salvar

### Passo 3: Configurar o Cron de Fallback (Semanal)

1. Clique novamente em **"Create cronjob"**

2. Preencha os campos básicos:

   | Campo | Valor |
   |-------|-------|
   | **Title** | F-Insight Atualização Fallback Semanal |
   | **URL** | `https://finsightai-hytg7e8e.manus.space/api/trpc/signalAlerts.updateFallbackData` |

3. Na seção **"Execution schedule"**:
   - Selecione **"Custom"**
   - Use a expressão cron: `0 8 * * 1`
   - Isso significa: **toda segunda-feira às 8:00 da manhã**

4. Na seção **"Request settings"**:
   - **Request method:** POST
   - Clique em **"Show advanced settings"**
   - Em **"Request headers"**, adicione:
     - Name: `Content-Type`
     - Value: `application/json`
   - Em **"Request body"**, digite: `{}`

5. Na seção **"Notifications"** (opcional):
   - ✅ Marque "Notify on failure"
   - ❌ Desmarque "Notify on success"

6. Clique em **"Create"** para salvar

### Passo 4: Verificar os Cron Jobs

1. Vá para **"Cronjobs"** no menu
2. Você deve ver os dois cron jobs listados:
   - F-Insight Alertas de Sinal (status: Enabled)
   - F-Insight Atualização Fallback Semanal (status: Enabled)
3. Certifique-se de que ambos estão com status **"Enabled"** (verde)

## Expressões Cron Explicadas

| Expressão | Significado |
|-----------|-------------|
| `0 * * * *` | A cada hora, no minuto 0 |
| `0 8 * * 1` | Segunda-feira às 8:00 |
| `*/30 * * * *` | A cada 30 minutos |
| `0 9-18 * * 1-5` | Das 9h às 18h, de segunda a sexta |

Formato: `minuto hora dia mês dia_da_semana`

## Testando Manualmente

Você pode testar os endpoints manualmente usando curl ou qualquer cliente HTTP:

### Testar Alertas de Sinal

```bash
curl -X POST \
  https://finsightai-hytg7e8e.manus.space/api/trpc/signalAlerts.runCron \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Testar Atualização de Fallback

```bash
curl -X POST \
  https://finsightai-hytg7e8e.manus.space/api/trpc/signalAlerts.updateFallbackData \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Frequências Recomendadas

### Para o Cron de Alertas

| Frequência | Uso Recomendado |
|------------|-----------------|
| **A cada 1 hora** | Recomendado para a maioria dos usuários |
| **A cada 30 min** | Para traders mais ativos |
| **A cada 15 min** | Para day traders (pode gerar muitas notificações) |

### Para o Cron de Fallback

| Frequência | Uso Recomendado |
|------------|-----------------|
| **Semanal (segunda 8h)** | Recomendado - mantém dados atualizados |
| **Diário** | Opcional - para dados mais frescos |

## Alternativas ao cron-job.org

Se preferir, você pode usar outros serviços de cron:

| Serviço | Plano Gratuito | Link |
|---------|----------------|------|
| cron-job.org | Ilimitado | [cron-job.org](https://cron-job.org) |
| EasyCron | 200 execuções/dia | [easycron.com](https://easycron.com) |
| Cronhub | 5 jobs | [cronhub.io](https://cronhub.io) |
| UptimeRobot | 50 monitores | [uptimerobot.com](https://uptimerobot.com) |

## Solução de Problemas

### O cron não está executando

1. Verifique se o status está **"Enabled"** no painel do cron-job.org
2. Confira se a URL está correta (sem espaços ou caracteres extras)
3. Teste manualmente com curl para verificar se o endpoint responde
4. Verifique o histórico de execuções no cron-job.org

### Erro 429 (Too Many Requests)

A API do Yahoo Finance tem rate limits. Se você receber muitos erros 429:

1. Aumente o intervalo do cron de alertas para 2 horas
2. O sistema de cache interno ajuda a reduzir chamadas
3. O sistema de fallback será usado automaticamente quando houver rate limit

### Erro 500 (Internal Server Error)

1. Pode ser um problema temporário da API de dados
2. O cron tentará novamente na próxima execução
3. Verifique a página de status: `https://finsightai-hytg7e8e.manus.space/status`

### Timeout na execução

O cron de fallback pode demorar alguns minutos para atualizar todos os 190+ ativos:

1. Configure um timeout maior no cron-job.org (se disponível)
2. O sistema processa os ativos em lotes para evitar timeouts
3. Mesmo que timeout ocorra, os ativos já processados serão salvos

## Monitoramento

Você pode monitorar o status das APIs e do cache na página de status:

**URL:** [https://finsightai-hytg7e8e.manus.space/status](https://finsightai-hytg7e8e.manus.space/status)

Esta página mostra:
- Status das APIs (online/degraded/offline)
- Estatísticas do cache
- Gráfico de uptime dos últimos 7 dias
- Última atualização dos dados de fallback

## Suporte

Se tiver problemas com a configuração dos cron jobs:

1. Verifique este guia novamente
2. Teste os endpoints manualmente
3. Consulte a página de status
4. Entre em contato através do email de suporte

---

**Última atualização:** Dezembro 2024

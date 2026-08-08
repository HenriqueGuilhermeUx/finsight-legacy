import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, FileText, AlertTriangle, Shield, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-slate-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold">Termos de Uso</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Aviso Importante */}
        <Card className="bg-amber-500/10 border-amber-500/30 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-amber-400 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-amber-400 mb-2">Aviso Importante</h2>
                <p className="text-sm text-muted-foreground">
                  O FinSight é uma plataforma de <strong>caráter exclusivamente informativo e educacional</strong>. 
                  Não somos uma instituição financeira, corretora de valores, ou analista de investimentos 
                  registrado na Comissão de Valores Mobiliários (CVM). As informações apresentadas neste 
                  site <strong>não constituem recomendação de investimento</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Última atualização */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Badge variant="outline">Última atualização: 30 de dezembro de 2024</Badge>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          {/* 1. Aceitação dos Termos */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-cyan-400" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Ao acessar e utilizar o FinSight ("Plataforma", "Site", "Serviço"), você concorda 
                integralmente com estes Termos de Uso. Se você não concordar com qualquer parte 
                destes termos, não utilize nossos serviços.
              </p>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento, sendo sua 
                responsabilidade verificar periodicamente as atualizações.
              </p>
            </CardContent>
          </Card>

          {/* 2. Natureza do Serviço */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                2. Natureza do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                O FinSight é uma plataforma de <strong>informações financeiras e ferramentas educacionais</strong>. 
                Nossos serviços incluem:
              </p>
              <ul>
                <li>Exibição de cotações e dados de mercado de fontes públicas</li>
                <li>Ferramentas de análise técnica e fundamentalista</li>
                <li>Simuladores de estratégias de investimento (backtesting)</li>
                <li>Indicadores macroeconômicos</li>
                <li>Conteúdo educacional sobre finanças e investimentos</li>
                <li>Alertas de preço configurados pelo usuário</li>
              </ul>
              <p className="text-amber-400 font-semibold">
                Todas as funcionalidades são fornecidas exclusivamente para fins informativos e 
                educacionais, não constituindo assessoria, consultoria ou recomendação de investimentos.
              </p>
            </CardContent>
          </Card>

          {/* 3. Isenção de Responsabilidade - Investimentos */}
          <Card className="bg-red-500/10 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                3. Isenção de Responsabilidade sobre Investimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p className="font-semibold text-red-400">
                LEIA COM ATENÇÃO:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Não somos analistas de valores mobiliários</strong> registrados na Comissão 
                  de Valores Mobiliários (CVM) conforme a Resolução CVM nº 20/2021.
                </li>
                <li>
                  <strong>Não fornecemos recomendações de investimento</strong>. Qualquer análise, 
                  score, ranking ou indicador apresentado é meramente informativo.
                </li>
                <li>
                  <strong>Não nos responsabilizamos por decisões de investimento</strong> tomadas 
                  com base nas informações disponibilizadas nesta plataforma.
                </li>
                <li>
                  <strong>Investimentos envolvem riscos</strong>, incluindo a possibilidade de 
                  perda total do capital investido.
                </li>
                <li>
                  <strong>Rentabilidade passada não garante rentabilidade futura</strong>. 
                  Resultados de backtesting são simulações e não garantem resultados reais.
                </li>
                <li>
                  <strong>Consulte sempre um profissional qualificado</strong> antes de tomar 
                  qualquer decisão de investimento.
                </li>
              </ul>
              <p className="mt-4 p-4 bg-red-500/20 rounded-lg">
                O usuário reconhece que é o único responsável por suas decisões de investimento 
                e que o FinSight não pode ser responsabilizado por quaisquer perdas financeiras 
                decorrentes do uso das informações disponibilizadas.
              </p>
            </CardContent>
          </Card>

          {/* 4. Dados e Informações */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                4. Dados e Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                As informações exibidas no FinSight são obtidas de fontes públicas consideradas 
                confiáveis, incluindo:
              </p>
              <ul>
                <li>Yahoo Finance</li>
                <li>Banco Central do Brasil</li>
                <li>Outras fontes públicas de dados financeiros</li>
              </ul>
              <p>
                <strong>Não garantimos</strong> a precisão, completude, atualidade ou adequação 
                das informações para qualquer finalidade específica. Os dados podem conter erros, 
                atrasos ou imprecisões.
              </p>
              <p>
                Cotações e dados de mercado podem ter atraso de até 15 minutos ou mais, dependendo 
                da fonte. Para operações em tempo real, consulte sua corretora.
              </p>
            </CardContent>
          </Card>

          {/* 5. Análises e Indicadores */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                5. Análises e Indicadores
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                As análises disponibilizadas no FinSight, incluindo mas não se limitando a:
              </p>
              <ul>
                <li>Análise Graham & Doddsville (Value Investing)</li>
                <li>Indicadores técnicos (RSI, MACD, Médias Móveis, etc.)</li>
                <li>Screener de ativos</li>
                <li>Backtesting de estratégias</li>
                <li>Scores e rankings</li>
              </ul>
              <p>
                São <strong>ferramentas educacionais</strong> baseadas em metodologias conhecidas 
                do mercado financeiro. Elas <strong>não constituem recomendação de compra ou venda</strong> 
                de qualquer ativo.
              </p>
              <p>
                Os resultados de backtesting são <strong>simulações baseadas em dados históricos</strong> 
                e não garantem resultados futuros. Condições de mercado passadas não se repetem 
                necessariamente.
              </p>
            </CardContent>
          </Card>

          {/* 6. Uso Permitido */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-cyan-400" />
                6. Uso Permitido
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>Ao utilizar o FinSight, você concorda em:</p>
              <ul>
                <li>Utilizar a plataforma apenas para fins pessoais e educacionais</li>
                <li>Não redistribuir ou comercializar os dados sem autorização</li>
                <li>Não utilizar bots ou scripts para coleta automatizada de dados</li>
                <li>Não tentar burlar medidas de segurança da plataforma</li>
                <li>Fornecer informações verdadeiras ao criar uma conta</li>
              </ul>
            </CardContent>
          </Card>

          {/* 7. Limitação de Responsabilidade */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                7. Limitação de Responsabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Na extensão máxima permitida pela lei aplicável, o FinSight e seus criadores 
                não serão responsáveis por:
              </p>
              <ul>
                <li>Perdas financeiras decorrentes de decisões de investimento</li>
                <li>Erros, imprecisões ou atrasos nas informações</li>
                <li>Indisponibilidade temporária ou permanente do serviço</li>
                <li>Danos diretos, indiretos, incidentais ou consequenciais</li>
                <li>Uso indevido das informações por terceiros</li>
              </ul>
            </CardContent>
          </Card>

          {/* 8. Propriedade Intelectual */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                8. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Todo o conteúdo do FinSight, incluindo textos, gráficos, logos, ícones, imagens, 
                código-fonte e software, é protegido por direitos autorais e outras leis de 
                propriedade intelectual.
              </p>
              <p>
                O uso da plataforma não concede ao usuário qualquer direito de propriedade sobre 
                o conteúdo ou funcionalidades.
              </p>
            </CardContent>
          </Card>

          {/* 9. Legislação Aplicável */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-cyan-400" />
                9. Legislação Aplicável
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa será submetida ao foro da comarca do domicílio do usuário.
              </p>
            </CardContent>
          </Card>

          {/* 10. Contato */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                10. Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Para dúvidas sobre estes Termos de Uso ou sobre a plataforma, entre em contato 
                através dos canais disponíveis no site.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Links relacionados */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/privacidade">
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Política de Privacidade
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

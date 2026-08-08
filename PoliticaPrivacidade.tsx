import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PoliticaPrivacidade() {
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
              <Shield className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold">Política de Privacidade</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Última atualização */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Badge variant="outline">Última atualização: 30 de dezembro de 2024</Badge>
        </div>

        {/* Introdução */}
        <Card className="bg-cyan-500/10 border-cyan-500/30 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Lock className="h-8 w-8 text-cyan-400 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-cyan-400 mb-2">Seu Compromisso com a Privacidade</h2>
                <p className="text-sm text-muted-foreground">
                  O FinSight respeita sua privacidade e está comprometido em proteger seus dados pessoais. 
                  Esta política explica como coletamos, usamos e protegemos suas informações em conformidade 
                  com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo */}
        <div className="space-y-8">
          {/* 1. Dados Coletados */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                1. Dados que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p><strong>Dados fornecidos por você:</strong></p>
              <ul>
                <li>Informações de conta (nome, email) ao fazer login via Manus OAuth</li>
                <li>Preferências de uso (favoritos, alertas, configurações)</li>
                <li>Email para newsletter (quando você se inscreve voluntariamente)</li>
              </ul>
              
              <p><strong>Dados coletados automaticamente:</strong></p>
              <ul>
                <li>Informações de navegação (páginas visitadas, tempo de uso)</li>
                <li>Dados técnicos (tipo de navegador, sistema operacional, IP)</li>
                <li>Cookies essenciais para funcionamento do site</li>
              </ul>
              
              <p><strong>Dados que NÃO coletamos:</strong></p>
              <ul>
                <li>Informações financeiras pessoais (conta bancária, CPF, cartão de crédito)</li>
                <li>Dados de investimentos reais</li>
                <li>Informações sensíveis conforme LGPD</li>
              </ul>
            </CardContent>
          </Card>

          {/* 2. Uso dos Dados */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyan-400" />
                2. Como Usamos seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>Utilizamos seus dados para:</p>
              <ul>
                <li>Fornecer e personalizar nossos serviços</li>
                <li>Salvar suas preferências (favoritos, alertas, watchlist)</li>
                <li>Enviar notificações de alertas de preço configurados por você</li>
                <li>Enviar newsletter (apenas se você se inscreveu)</li>
                <li>Melhorar a experiência do usuário</li>
                <li>Análises estatísticas agregadas (não identificáveis)</li>
              </ul>
              
              <p className="text-cyan-400 font-semibold">
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros 
                para fins de marketing.
              </p>
            </CardContent>
          </Card>

          {/* 3. Cookies */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                3. Cookies e Tecnologias Similares
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>Utilizamos cookies para:</p>
              <ul>
                <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento do site (autenticação, sessão)</li>
                <li><strong>Cookies de preferências:</strong> Salvam suas configurações (tema, idioma)</li>
                <li><strong>Cookies analíticos:</strong> Nos ajudam a entender como o site é usado</li>
              </ul>
              <p>
                Você pode gerenciar cookies nas configurações do seu navegador. Desativar 
                cookies essenciais pode afetar o funcionamento do site.
              </p>
            </CardContent>
          </Card>

          {/* 4. Segurança */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-cyan-400" />
                4. Segurança dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>Implementamos medidas de segurança para proteger seus dados:</p>
              <ul>
                <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                <li>Autenticação segura via OAuth</li>
                <li>Acesso restrito aos dados por pessoal autorizado</li>
                <li>Monitoramento de segurança contínuo</li>
              </ul>
              <p>
                Embora nos esforcemos para proteger seus dados, nenhum sistema é 100% seguro. 
                Em caso de incidente de segurança, notificaremos os usuários afetados conforme 
                exigido pela LGPD.
              </p>
            </CardContent>
          </Card>

          {/* 5. Seus Direitos */}
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-5 w-5" />
                5. Seus Direitos (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>Conforme a LGPD, você tem direito a:</p>
              <ul>
                <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                <li><strong>Acesso:</strong> Obter cópia dos seus dados pessoais</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
                <li><strong>Anonimização:</strong> Solicitar anonimização de dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Transferir seus dados para outro serviço</li>
                <li><strong>Eliminação:</strong> Solicitar exclusão dos seus dados</li>
                <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
              </ul>
              <p>
                Para exercer seus direitos, entre em contato através dos canais disponíveis no site.
              </p>
            </CardContent>
          </Card>

          {/* 6. Retenção de Dados */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-cyan-400" />
                6. Retenção e Exclusão de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços 
                ou conforme exigido por lei.
              </p>
              <ul>
                <li>Dados de conta: Enquanto sua conta estiver ativa</li>
                <li>Dados de navegação: Até 12 meses</li>
                <li>Newsletter: Até você cancelar a inscrição</li>
              </ul>
              <p>
                Ao excluir sua conta, seus dados pessoais serão removidos em até 30 dias, 
                exceto quando houver obrigação legal de retenção.
              </p>
            </CardContent>
          </Card>

          {/* 7. Compartilhamento */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyan-400" />
                7. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>Podemos compartilhar dados apenas com:</p>
              <ul>
                <li><strong>Provedores de serviço:</strong> Empresas que nos ajudam a operar o site (hospedagem, análise)</li>
                <li><strong>Obrigações legais:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos legais</li>
              </ul>
              <p>
                Todos os parceiros são obrigados a manter a confidencialidade dos dados.
              </p>
            </CardContent>
          </Card>

          {/* 8. Menores de Idade */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                8. Menores de Idade
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                O FinSight não é destinado a menores de 18 anos. Não coletamos intencionalmente 
                dados de menores. Se tomarmos conhecimento de que coletamos dados de um menor, 
                excluiremos essas informações imediatamente.
              </p>
            </CardContent>
          </Card>

          {/* 9. Alterações */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-cyan-400" />
                9. Alterações nesta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Podemos atualizar esta política periodicamente. Alterações significativas serão 
                comunicadas através do site ou por email. Recomendamos revisar esta página 
                regularmente.
              </p>
            </CardContent>
          </Card>

          {/* 10. Contato */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                10. Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert prose-sm max-w-none">
              <p>
                Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos, 
                entre em contato através dos canais disponíveis no site.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Links relacionados */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/termos">
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Termos de Uso
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

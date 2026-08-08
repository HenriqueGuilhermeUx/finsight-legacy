import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Copy, Gift, Users, DollarSign, Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MainLayout from "@/components/MainLayout";
import { getLoginUrl } from "@/const";

export default function Referral() {
  const { user, isAuthenticated, loading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState("");

  const { data: myCode, isLoading: loadingCode } = trpc.referral.getMyCode.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: stats, isLoading: loadingStats } = trpc.referral.getStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const applyCodeMutation = trpc.referral.applyCode.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setReferralInput("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const copyToClipboard = async () => {
    if (myCode?.code) {
      await navigator.clipboard.writeText(myCode.code);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLink = () => {
    const url = `${window.location.origin}/premium?ref=${myCode?.code}`;
    if (navigator.share) {
      navigator.share({
        title: "FinSight - Análise Financeira Inteligente",
        text: `Use meu código ${myCode?.code} e ganhe 25% de desconto na assinatura!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <Gift className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Programa de Indicação</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Faça login para acessar seu código de indicação e ganhar recompensas por cada amigo que assinar.
          </p>
          <Button asChild size="lg">
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Programa de Indicação</h1>
          <p className="text-muted-foreground">
            Convide amigos e ganhe recompensas. Seus amigos ganham 25% de desconto na primeira assinatura!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Indicações</p>
                  <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Convertidas</p>
                  <p className="text-2xl font-bold">{stats?.completedReferrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <Gift className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats?.pendingReferrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total em Recompensas</p>
                  <p className="text-2xl font-bold">R$ {(stats?.totalRewards || 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Referral Code */}
          <Card>
            <CardHeader>
              <CardTitle>Seu Código de Indicação</CardTitle>
              <CardDescription>
                Compartilhe este código com seus amigos para que eles ganhem 25% de desconto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 p-4 bg-muted rounded-lg text-center">
                  <span className="text-2xl font-mono font-bold tracking-wider">
                    {loadingCode ? "..." : myCode?.code || "N/A"}
                  </span>
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Button className="w-full" onClick={shareLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar Link
              </Button>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2">Como funciona:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Compartilhe seu código com amigos</li>
                  <li>2. Eles ganham 25% de desconto na primeira assinatura</li>
                  <li>3. Você ganha R$ 10 de crédito por cada conversão</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Apply Referral Code */}
          <Card>
            <CardHeader>
              <CardTitle>Usar Código de Indicação</CardTitle>
              <CardDescription>
                Tem um código de indicação? Aplique aqui para ganhar 25% de desconto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <Button 
                  onClick={() => applyCodeMutation.mutate({ code: referralInput })}
                  disabled={!referralInput || applyCodeMutation.isPending}
                >
                  Aplicar
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Benefícios:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ 25% de desconto na primeira assinatura</li>
                  <li>✓ Válido para planos Pro e Enterprise</li>
                  <li>✓ Aplicável em pagamentos mensais ou anuais</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Histórico de Indicações</CardTitle>
            <CardDescription>
              Acompanhe o status das suas indicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(stats?.totalReferrals || 0) === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Você ainda não tem indicações.</p>
                <p className="text-sm">Compartilhe seu código e comece a ganhar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{stats?.totalReferrals} indicações no total</p>
                      <p className="text-sm text-muted-foreground">
                        {stats?.completedReferrals} convertidas, {stats?.pendingReferrals} pendentes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">+R$ {(stats?.totalRewards || 0).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">em recompensas</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

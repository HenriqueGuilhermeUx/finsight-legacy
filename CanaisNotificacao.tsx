import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Bell, Plus, Trash2, CheckCircle, XCircle, Send, 
  MessageCircle, Smartphone, Mail, BellRing, Clock, Settings
} from "lucide-react";
import { toast } from "sonner";

type ChannelType = "telegram" | "whatsapp" | "email" | "push";

const channelIcons: Record<ChannelType, any> = {
  telegram: Send,
  whatsapp: MessageCircle,
  email: Mail,
  push: BellRing,
};

const channelNames: Record<ChannelType, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  email: "E-mail",
  push: "Push",
};

export default function CanaisNotificacao() {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [channelType, setChannelType] = useState<ChannelType>("telegram");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingChannelId, setPendingChannelId] = useState<number | null>(null);
  const [instructions, setInstructions] = useState("");

  const { data: channels, refetch } = trpc.notificationChannels.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createChannel = trpc.notificationChannels.create.useMutation({
    onSuccess: (data) => {
      setPendingChannelId(data.id);
      setInstructions(data.instructions);
      setShowAddDialog(false);
      setShowVerifyDialog(true);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyChannel = trpc.notificationChannels.verify.useMutation({
    onSuccess: () => {
      toast.success("Canal verificado com sucesso!");
      setShowVerifyDialog(false);
      setVerificationCode("");
      setPendingChannelId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateChannel = trpc.notificationChannels.update.useMutation({
    onSuccess: () => {
      toast.success("Configurações salvas!");
      refetch();
    },
  });

  const deleteChannel = trpc.notificationChannels.delete.useMutation({
    onSuccess: () => {
      toast.success("Canal removido!");
      refetch();
    },
  });

  const testChannel = trpc.notificationChannels.test.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddChannel = () => {
    createChannel.mutate({
      channelType,
      telegramUsername: channelType === "telegram" ? telegramUsername : undefined,
      whatsappPhone: channelType === "whatsapp" ? whatsappPhone : undefined,
    });
  };

  const handleVerify = () => {
    if (!pendingChannelId || !verificationCode) return;
    verifyChannel.mutate({ id: pendingChannelId, code: verificationCode });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Canais de Notificação
              </CardTitle>
              <CardDescription>
                Configure Telegram, WhatsApp e outros canais para receber alertas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Faça login para configurar seus canais de notificação.
              </p>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Fazer Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const verifiedChannels = channels?.filter(c => c.isVerified) || [];
  const pendingChannels = channels?.filter(c => !c.isVerified) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-purple-500" />
              Canais de Notificação
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure onde você quer receber seus alertas
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Canal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Canal de Notificação</DialogTitle>
                <DialogDescription>
                  Escolha o tipo de canal e configure as informações necessárias.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Tipo de Canal</Label>
                  <Select value={channelType} onValueChange={(v: ChannelType) => setChannelType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telegram">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Telegram
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {channelType === "telegram" && (
                  <div className="space-y-2">
                    <Label>Username do Telegram</Label>
                    <Input
                      placeholder="@seu_username"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Seu username do Telegram (sem o @)
                    </p>
                  </div>
                )}

                {channelType === "whatsapp" && (
                  <div className="space-y-2">
                    <Label>Número do WhatsApp</Label>
                    <Input
                      placeholder="+55 11 99999-9999"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Número com código do país
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleAddChannel} 
                  disabled={createChannel.isPending}
                  className="w-full"
                >
                  {createChannel.isPending ? "Adicionando..." : "Adicionar Canal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Verification Dialog */}
        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verificar Canal</DialogTitle>
              <DialogDescription>
                Siga as instruções para verificar seu canal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="whitespace-pre-line text-sm">{instructions}</p>
              </div>
              <div className="space-y-2">
                <Label>Código de Verificação</Label>
                <Input
                  placeholder="ABC123"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerify} 
                disabled={verifyChannel.isPending || !verificationCode}
                className="w-full"
              >
                {verifyChannel.isPending ? "Verificando..." : "Verificar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Bell className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{channels?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Canais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{verifiedChannels.length}</p>
                  <p className="text-sm text-muted-foreground">Verificados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingChannels.length}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verified Channels */}
        {verifiedChannels.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Canais Verificados
            </h2>
            <div className="grid gap-4">
              {verifiedChannels.map((channel: any) => {
                const Icon = channelIcons[channel.channelType as ChannelType];
                return (
                  <Card key={channel.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-800 rounded-full">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">
                                {channelNames[channel.channelType as ChannelType]}
                              </span>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                                Verificado
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {channel.telegramUsername || channel.whatsappPhone || "Configurado"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={channel.isActive}
                              onCheckedChange={(checked) =>
                                updateChannel.mutate({ id: channel.id, isActive: checked })
                              }
                            />
                            <span className="text-sm text-muted-foreground">
                              {channel.isActive ? "Ativo" : "Pausado"}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testChannel.mutate({ id: channel.id })}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteChannel.mutate({ id: channel.id })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      {/* Channel Settings */}
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Alertas de Preço</span>
                            <Switch
                              checked={channel.notifyPriceAlerts}
                              onCheckedChange={(checked) =>
                                updateChannel.mutate({ id: channel.id, notifyPriceAlerts: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Alertas Técnicos</span>
                            <Switch
                              checked={channel.notifyTechnicalAlerts}
                              onCheckedChange={(checked) =>
                                updateChannel.mutate({ id: channel.id, notifyTechnicalAlerts: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Alertas Combinados</span>
                            <Switch
                              checked={channel.notifyCombinedAlerts}
                              onCheckedChange={(checked) =>
                                updateChannel.mutate({ id: channel.id, notifyCombinedAlerts: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {channel.quietHoursStart != null 
                                ? `Silêncio: ${channel.quietHoursStart}h - ${channel.quietHoursEnd}h`
                                : "Sem horário de silêncio"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Pending Channels */}
        {pendingChannels.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pendentes de Verificação
            </h2>
            <div className="grid gap-4">
              {pendingChannels.map((channel: any) => {
                const Icon = channelIcons[channel.channelType as ChannelType];
                return (
                  <Card key={channel.id} className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-800 rounded-full">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">
                                {channelNames[channel.channelType as ChannelType]}
                              </span>
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                                Pendente
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {channel.telegramUsername || channel.whatsappPhone || "Aguardando verificação"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPendingChannelId(channel.id);
                              setInstructions(
                                channel.channelType === "telegram"
                                  ? `Para verificar seu Telegram:\n1. Abra o Telegram e busque por @FinSightAlertBot\n2. Envie o código: ${channel.verificationCode}\n3. Aguarde a confirmação`
                                  : `Para verificar seu WhatsApp:\n1. Envie o código ${channel.verificationCode} para +55 11 99999-9999\n2. Aguarde a confirmação`
                              );
                              setShowVerifyDialog(true);
                            }}
                          >
                            Verificar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteChannel.mutate({ id: channel.id })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!channels || channels.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum canal configurado</h3>
              <p className="text-muted-foreground mb-4">
                Adicione Telegram ou WhatsApp para receber alertas em tempo real.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Canal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-slate-800/30">
          <CardHeader>
            <CardTitle className="text-lg">Como funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Send className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Telegram</p>
                <p className="text-sm text-muted-foreground">
                  Receba alertas instantâneos via bot do Telegram. Rápido e sem custos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <MessageCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">
                  Alertas direto no seu WhatsApp. Ideal para quem usa o app diariamente.
                </p>
              </div>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-sm text-amber-400">
                <strong>Nota:</strong> A integração com Telegram e WhatsApp está em fase beta. 
                Por enquanto, os alertas são enviados apenas pelo sistema de notificações interno.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

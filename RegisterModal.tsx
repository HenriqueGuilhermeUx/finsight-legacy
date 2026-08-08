import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Lock, Mail, TrendingUp, Bell, BarChart3, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newsletterMutation = trpc.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, insira seu email");
      return;
    }

    if (!acceptTerms) {
      toast.error("Você precisa aceitar os termos de uso");
      return;
    }

    setIsSubmitting(true);

    try {
      // Subscribe to newsletter if opted in
      if (acceptNewsletter) {
        await newsletterMutation.mutateAsync({ email });
      }

      // Store email in localStorage to unlock features
      localStorage.setItem("finsight_registered_email", email);
      localStorage.removeItem("finsight_analysis_count"); // Reset count

      toast.success("Cadastro realizado com sucesso! Acesso liberado.");
      onOpenChange(false);
      
      // Reload to apply changes
      window.location.reload();
    } catch (error) {
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-cyan-400" />
            Cadastre-se para Continuar
          </DialogTitle>
          <DialogDescription>
            Você utilizou suas 3 análises gratuitas. Cadastre-se para acesso ilimitado!
          </DialogDescription>
        </DialogHeader>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Análises ilimitadas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4 text-amber-400" />
            <span>Alertas de preço</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <span>Backtesting completo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Assistente IA</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                Li e aceito os{" "}
                <Link href="/termos" className="text-cyan-400 hover:underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="text-cyan-400 hover:underline">
                  Política de Privacidade
                </Link>
              </Label>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="newsletter"
                checked={acceptNewsletter}
                onCheckedChange={(checked) => setAcceptNewsletter(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="newsletter" className="text-sm text-muted-foreground leading-tight">
                Quero receber análises e novidades por email (opcional)
              </Label>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              disabled={isSubmitting || !acceptTerms}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar e Liberar Acesso"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleLoginClick}
            >
              Entrar com sua conta
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Ao se cadastrar, você concorda que as informações são educacionais e não constituem recomendação de investimento.
        </p>
      </DialogContent>
    </Dialog>
  );
}

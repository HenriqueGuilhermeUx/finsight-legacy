import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Crown, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface AdBannerProps {
  variant?: "affiliate" | "premium" | "sponsor";
  className?: string;
}

// Affiliate partners data
const affiliatePartners = [
  {
    name: "XP Investimentos",
    description: "Abra sua conta e invista com taxa zero",
    url: "https://www.xpi.com.br",
    color: "border-emerald-600 text-emerald-400 hover:bg-emerald-600/10",
  },
  {
    name: "Rico",
    description: "Corretora digital com as melhores taxas",
    url: "https://www.rico.com.vc",
    color: "border-orange-600 text-orange-400 hover:bg-orange-600/10",
  },
  {
    name: "NuInvest",
    description: "Invista de forma simples e descomplicada",
    url: "https://www.nuinvest.com.br",
    color: "border-purple-600 text-purple-400 hover:bg-purple-600/10",
  },
  {
    name: "BTG Pactual",
    description: "O maior banco de investimentos da América Latina",
    url: "https://www.btgpactual.com",
    color: "border-blue-600 text-blue-400 hover:bg-blue-600/10",
  },
];

export function AffiliateBanner({ className }: { className?: string }) {
  return (
    <Card className={`bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          <span className="text-sm text-slate-400">Parceiros Recomendados</span>
          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
            Publicidade
          </Badge>
        </div>
        <p className="text-white font-semibold mb-4">
          Abra sua conta em uma corretora parceira e comece a investir
        </p>
        <div className="flex flex-wrap gap-3">
          {affiliatePartners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.description}
            >
              <Button variant="outline" size="sm" className={partner.color}>
                {partner.name}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PremiumBanner({ className }: { className?: string }) {
  return (
    <Card className={`bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-500/30 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400">
              <Crown className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Desbloqueie todo o potencial do FinSight
              </h3>
              <p className="text-slate-300 text-sm">
                Análises exclusivas, alertas ilimitados e sem publicidade.
              </p>
            </div>
          </div>
          <Link href="/premium">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 font-semibold whitespace-nowrap">
              <Sparkles className="h-4 w-4 mr-2" />
              Assinar Premium
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function SponsorBanner({ className }: { className?: string }) {
  return (
    <Card className={`bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs border-cyan-600/50 text-cyan-400">
              Patrocinado
            </Badge>
            <span className="text-slate-300 text-sm">
              Conteúdo patrocinado por nossos parceiros
            </span>
          </div>
          <a href="mailto:comercial@finsight.com.br" className="text-xs text-cyan-400 hover:underline">
            Anuncie aqui
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdBanner({ variant = "affiliate", className }: AdBannerProps) {
  switch (variant) {
    case "premium":
      return <PremiumBanner className={className} />;
    case "sponsor":
      return <SponsorBanner className={className} />;
    case "affiliate":
    default:
      return <AffiliateBanner className={className} />;
  }
}

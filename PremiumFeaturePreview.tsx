import { ReactNode } from "react";
import { Link } from "wouter";
import { Lock, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

interface PremiumFeaturePreviewProps {
  children: ReactNode;
  featureName: string;
  description?: string;
  showPreview?: boolean; // If true, shows blurred preview; if false, shows placeholder
}

export default function PremiumFeaturePreview({
  children,
  featureName,
  description = "Desbloqueie esta funcionalidade com o plano Premium",
  showPreview = true,
}: PremiumFeaturePreviewProps) {
  const { user } = useAuth();
  const isPremium = user?.subscriptionStatus === "pro" || user?.subscriptionStatus === "enterprise";

  // If user is premium, show the full content
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred/Preview Content */}
      {showPreview ? (
        <div className="relative overflow-hidden rounded-lg">
          {/* The actual content with blur */}
          <div className="filter blur-sm pointer-events-none select-none opacity-60">
            {children}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-slate-900/60 flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
                <Lock className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                {featureName}
              </h3>
              <p className="text-slate-300 mb-6">{description}</p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 font-semibold gap-2">
                  <Sparkles className="h-4 w-4" />
                  Desbloquear Premium
                </Button>
              </Link>
              <p className="text-xs text-slate-400 mt-3">
                A partir de R$ 39,17/mês no plano anual
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder without preview */
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
              <Lock className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              {featureName}
            </h3>
            <p className="text-slate-300 mb-6">{description}</p>
            <Link href="/premium">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 font-semibold gap-2">
                <Sparkles className="h-4 w-4" />
                Desbloquear Premium
              </Button>
            </Link>
            <p className="text-xs text-slate-400 mt-3">
              A partir de R$ 39,17/mês no plano anual
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Badge component to show premium features inline
export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium ${className}`}>
      <Crown className="h-3 w-3" />
      Premium
    </span>
  );
}

// Small lock icon for menu items
export function PremiumLock({ className = "" }: { className?: string }) {
  return (
    <Lock className={`h-3.5 w-3.5 text-amber-400 ${className}`} />
  );
}

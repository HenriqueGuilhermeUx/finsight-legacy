import { useAnalysisLimit } from "@/hooks/useAnalysisLimit";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Infinity } from "lucide-react";

export function AnalysisLimitBadge() {
  const { remaining, isUnlimited, isLimitReached } = useAnalysisLimit();

  if (isUnlimited) {
    return (
      <Badge variant="outline" className="gap-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
        <Infinity className="h-3 w-3" />
        Ilimitado
      </Badge>
    );
  }

  if (isLimitReached) {
    return (
      <Badge variant="outline" className="gap-1 bg-red-500/10 border-red-500/30 text-red-400">
        <Sparkles className="h-3 w-3" />
        Limite atingido
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 bg-amber-500/10 border-amber-500/30 text-amber-400">
      <Sparkles className="h-3 w-3" />
      {remaining} análise{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""}
    </Badge>
  );
}

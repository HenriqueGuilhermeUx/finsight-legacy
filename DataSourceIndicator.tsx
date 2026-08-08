import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, Wifi, WifiOff } from "lucide-react";

interface DataSourceIndicatorProps {
  source?: string;
  className?: string;
  showLabel?: boolean;
}

export default function DataSourceIndicator({ source, className = "", showLabel = true }: DataSourceIndicatorProps) {
  if (!source || source === 'api' || source === 'live') {
    // Dados em tempo real - não mostra nada
    return null;
  }
  
  if (source === 'fallback' || source === 'cache') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1 text-xs text-amber-400 ${className}`}>
              <Database className="h-3 w-3" />
              {showLabel && <span>Cache</span>}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              Dados em cache (API temporariamente indisponível)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Os dados podem estar alguns minutos desatualizados
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (source === 'offline') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1 text-xs text-red-400 ${className}`}>
              <WifiOff className="h-3 w-3" />
              {showLabel && <span>Offline</span>}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              API offline - dados podem estar desatualizados
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return null;
}

// Badge variant for tables
export function DataSourceBadge({ source }: { source?: string }) {
  if (!source || source === 'api' || source === 'live') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
        <Wifi className="h-3 w-3" />
        <span>Ao vivo</span>
      </span>
    );
  }
  
  if (source === 'fallback' || source === 'cache') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-400">
        <Database className="h-3 w-3" />
        <span>Cache</span>
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-400">
      <WifiOff className="h-3 w-3" />
      <span>Offline</span>
    </span>
  );
}

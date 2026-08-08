import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ApiStatusBanner() {
  const [dismissed, setDismissed] = useState(false);
  
  const { data: status } = trpc.apiStatus.getAll.useQuery(undefined, {
    refetchInterval: 60000, // Check every minute
    staleTime: 30000,
  });

  // Check if any API is degraded or offline
  const hasDegradedApis = status?.apis.some(
    api => api.status === "degraded" || api.status === "offline"
  );

  // Don't show if dismissed or no issues
  if (dismissed || !hasDegradedApis) {
    return null;
  }

  const offlineApis = status?.apis.filter(api => api.status === "offline") || [];
  const degradedApis = status?.apis.filter(api => api.status === "degraded") || [];

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-200">
            {offlineApis.length > 0 ? (
              <>
                <strong>Serviço temporariamente indisponível.</strong> Alguns dados podem estar desatualizados.
              </>
            ) : (
              <>
                <strong>Lentidão detectada.</strong> Os dados podem demorar mais para carregar.
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/status">
            <Button variant="ghost" size="sm" className="text-yellow-200 hover:text-yellow-100 h-7 px-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver status
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-yellow-200 hover:text-yellow-100 h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

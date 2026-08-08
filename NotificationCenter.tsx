import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import {
  Bell,
  BellRing,
  TrendingUp,
  TrendingDown,
  Users,
  Copy,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
} from "lucide-react";

interface Notification {
  id: number;
  type: "price_alert" | "portfolio_update" | "copy_trade" | "follower" | "system";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "price_alert",
    title: "Alerta de Preço: PETR4",
    message: "PETR4 atingiu R$ 37,50 (acima de R$ 37,00)",
    data: { ticker: "PETR4", price: 37.50, targetPrice: 37.00 },
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 2,
    type: "copy_trade",
    title: "Operação Copiada",
    message: "Compra de 50 VALE3 copiada de Alpha Growth",
    data: { ticker: "VALE3", quantity: 50, source: "Alpha Growth" },
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 3,
    type: "follower",
    title: "Novo Seguidor!",
    message: "Maria Silva começou a seguir seu portfólio",
    data: { followerName: "Maria Silva" },
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 4,
    type: "portfolio_update",
    title: "Portfólio Atualizado",
    message: "Seu portfólio 'Carteira Principal' subiu 2.5% hoje",
    data: { portfolioName: "Carteira Principal", change: 2.5 },
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 5,
    type: "price_alert",
    title: "Alerta de Preço: BTC",
    message: "Bitcoin caiu abaixo de $95.000",
    data: { ticker: "BTC", price: 94500, targetPrice: 95000 },
    isRead: true,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 6,
    type: "system",
    title: "Bem-vindo ao FinSight!",
    message: "Explore todas as funcionalidades da plataforma",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "price_alert":
      return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    case "portfolio_update":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "copy_trade":
      return <Copy className="h-4 w-4 text-blue-500" />;
    case "follower":
      return <Users className="h-4 w-4 text-purple-500" />;
    case "system":
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to add a new notification
      if (Math.random() < 0.1) {
        const types: Notification["type"][] = ["price_alert", "portfolio_update", "copy_trade"];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: Date.now(),
          type,
          title: type === "price_alert" 
            ? "Alerta de Preço" 
            : type === "portfolio_update" 
            ? "Atualização de Portfólio"
            : "Operação Copiada",
          message: type === "price_alert"
            ? `VALE3 atingiu R$ ${(70 + Math.random() * 5).toFixed(2)}`
            : type === "portfolio_update"
            ? `Seu portfólio subiu ${(Math.random() * 3).toFixed(2)}%`
            : "Nova operação copiada com sucesso",
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <div className="flex items-center gap-1 mt-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-xs text-primary">Nova</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full text-sm" asChild>
            <a href="/alertas-avancados">
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar Alertas
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

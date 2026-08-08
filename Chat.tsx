import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  MessageSquare,
  Send,
  Search,
  Users,
  Circle,
  Check,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Image,
  Star,
  TrendingUp,
} from "lucide-react";

// Mock conversations
const mockConversations = [
  {
    id: "conv1",
    user: {
      id: 2,
      name: "Carlos Silva",
      avatar: "CS",
      isOnline: true,
      portfolioReturn: 156.8,
    },
    lastMessage: "Qual sua opinião sobre PETR4 agora?",
    lastMessageTime: "10:30",
    unreadCount: 2,
  },
  {
    id: "conv2",
    user: {
      id: 3,
      name: "Ana Rodrigues",
      avatar: "AR",
      isOnline: true,
      portfolioReturn: 89.4,
    },
    lastMessage: "Obrigado pela dica! Funcionou muito bem.",
    lastMessageTime: "09:15",
    unreadCount: 0,
  },
  {
    id: "conv3",
    user: {
      id: 4,
      name: "Pedro Santos",
      avatar: "PS",
      isOnline: false,
      portfolioReturn: 78.2,
    },
    lastMessage: "Vou analisar essa estratégia de momentum",
    lastMessageTime: "Ontem",
    unreadCount: 0,
  },
  {
    id: "conv4",
    user: {
      id: 5,
      name: "Maria Oliveira",
      avatar: "MO",
      isOnline: false,
      portfolioReturn: 65.3,
    },
    lastMessage: "Interessante sua análise sobre o setor bancário",
    lastMessageTime: "Seg",
    unreadCount: 0,
  },
];

// Mock messages
const mockMessages: Record<string, any[]> = {
  conv1: [
    {
      id: 1,
      senderId: 2,
      message: "Oi! Vi que você está acompanhando PETR4 também",
      time: "10:00",
      isRead: true,
    },
    {
      id: 2,
      senderId: 1,
      message: "Sim! Estou de olho nos resultados do trimestre",
      time: "10:05",
      isRead: true,
    },
    {
      id: 3,
      senderId: 2,
      message: "Os indicadores técnicos estão mostrando força",
      time: "10:15",
      isRead: true,
    },
    {
      id: 4,
      senderId: 2,
      message: "RSI ainda não está em sobrecompra",
      time: "10:20",
      isRead: true,
    },
    {
      id: 5,
      senderId: 2,
      message: "Qual sua opinião sobre PETR4 agora?",
      time: "10:30",
      isRead: false,
    },
  ],
  conv2: [
    {
      id: 1,
      senderId: 1,
      message: "Olha essa estratégia de dividendos que montei",
      time: "08:30",
      isRead: true,
    },
    {
      id: 2,
      senderId: 3,
      message: "Muito interessante! Qual o yield médio?",
      time: "08:45",
      isRead: true,
    },
    {
      id: 3,
      senderId: 1,
      message: "Está em torno de 8% ao ano",
      time: "09:00",
      isRead: true,
    },
    {
      id: 4,
      senderId: 3,
      message: "Obrigado pela dica! Funcionou muito bem.",
      time: "09:15",
      isRead: true,
    },
  ],
};

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>("conv1");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation && mockMessages[selectedConversation]) {
      setMessages(mockMessages[selectedConversation]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 1, // Current user
      message: newMessage,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const selectedConv = mockConversations.find((c) => c.id === selectedConversation);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Chat entre Traders</h2>
              <p className="text-muted-foreground mb-6">
                Faça login para conversar com outros traders e trocar ideias sobre investimentos.
              </p>
              <a href={getLoginUrl()}>
                <Button size="lg">Entrar para Conversar</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Chat entre Traders</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar conversas..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-4 pt-0">
                  {mockConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conv.id
                          ? "bg-primary/20 border border-primary/40"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {conv.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conv.user.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{conv.user.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {selectedConv.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConv.user.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{selectedConv.user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                            +{selectedConv.user.portfolioReturn}%
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {selectedConv.user.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.senderId === 1;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent"
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
                                <span className="text-xs opacity-70">{msg.time}</span>
                                {isOwn && (
                                  msg.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-blue-400" />
                                  ) : (
                                    <Check className="h-3 w-3 opacity-70" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

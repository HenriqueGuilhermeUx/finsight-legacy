import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Percent, 
  Star,
  Calendar,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trophy,
  Flame,
  Zap
} from "lucide-react";

const goalTypes = [
  { value: "patrimony", label: "Patrimônio", icon: Wallet, description: "Acumular um valor total" },
  { value: "dividends", label: "Dividendos", icon: TrendingUp, description: "Receber X em dividendos/mês" },
  { value: "return", label: "Rentabilidade", icon: Percent, description: "Atingir X% de retorno" },
  { value: "savings", label: "Poupança", icon: PiggyBank, description: "Economizar um valor" },
  { value: "custom", label: "Personalizado", icon: Star, description: "Meta customizada" },
];

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

const statusIcons = {
  active: Clock,
  completed: CheckCircle2,
  paused: AlertCircle,
  cancelled: Trash2,
};

const colorOptions = [
  { value: "blue", class: "bg-blue-500" },
  { value: "green", class: "bg-green-500" },
  { value: "purple", class: "bg-purple-500" },
  { value: "orange", class: "bg-orange-500" },
  { value: "pink", class: "bg-pink-500" },
  { value: "cyan", class: "bg-cyan-500" },
];

export default function Metas() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("patrimony");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [color, setColor] = useState("blue");
  
  const { data: goals, isLoading, refetch } = trpc.goals.list.useQuery(undefined, {
    enabled: !!user,
  });
  
  const createMutation = trpc.goals.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
  });
  
  const updateMutation = trpc.goals.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingGoal(null);
      resetForm();
    },
  });
  
  const deleteMutation = trpc.goals.delete.useMutation({
    onSuccess: () => refetch(),
  });
  
  const updateProgressMutation = trpc.goals.updateProgress.useMutation({
    onSuccess: () => refetch(),
  });
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setType("patrimony");
    setTargetValue("");
    setCurrentValue("");
    setDeadline("");
    setPriority("medium");
    setColor("blue");
  };
  
  const handleCreate = () => {
    createMutation.mutate({
      name,
      description: description || undefined,
      type: type as any,
      targetValue: parseFloat(targetValue) || 0,
      currentValue: parseFloat(currentValue) || 0,
      deadline: deadline || undefined,
      priority: priority as any,
      color,
    });
  };
  
  const handleUpdate = () => {
    if (!editingGoal) return;
    updateMutation.mutate({
      id: editingGoal.id,
      name,
      description: description || undefined,
      targetValue: parseFloat(targetValue) || undefined,
      deadline: deadline || undefined,
      priority: priority as any,
      color,
    });
  };
  
  const openEdit = (goal: any) => {
    setEditingGoal(goal);
    setName(goal.name);
    setDescription(goal.description || "");
    setType(goal.type);
    setTargetValue(goal.targetValue);
    setCurrentValue(goal.currentValue);
    setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "");
    setPriority(goal.priority);
    setColor(goal.color || "blue");
  };
  
  const calculateProgress = (current: string, target: string) => {
    const c = parseFloat(current) || 0;
    const t = parseFloat(target) || 1;
    return Math.min((c / t) * 100, 100);
  };
  
  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };
  
  const getDaysRemaining = (deadline: string | Date | null) => {
    if (!deadline) return null;
    const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const diff = d.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Target className="h-12 w-12 mx-auto text-cyan-500 mb-4" />
              <CardTitle>Metas Financeiras</CardTitle>
              <CardDescription>
                Faça login para criar e acompanhar suas metas financeiras
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                <a href={getLoginUrl()}>Fazer Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  const activeGoals = goals?.filter(g => g.status === "active") || [];
  const completedGoals = goals?.filter(g => g.status === "completed") || [];
  const totalProgress = activeGoals.length > 0
    ? activeGoals.reduce((acc, g) => acc + calculateProgress(g.currentValue, g.targetValue), 0) / activeGoals.length
    : 0;
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-cyan-500" />
              Metas Financeiras
            </h1>
            <p className="text-muted-foreground mt-1">
              Defina objetivos e acompanhe seu progresso
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>
                  Defina um objetivo financeiro para acompanhar
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Nome da Meta</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Reserva de emergência"
                  />
                </div>
                
                <div>
                  <Label>Tipo</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <t.icon className="h-4 w-4" />
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor Alvo (R$)</Label>
                    <Input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label>Valor Atual (R$)</Label>
                    <Input
                      type="number"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      placeholder="25000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Prazo (opcional)</Label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Prioridade</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Cor</Label>
                  <div className="flex gap-2 mt-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`w-8 h-8 rounded-full ${c.class} ${
                          color === c.value ? "ring-2 ring-offset-2 ring-white" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes sobre sua meta..."
                    rows={2}
                  />
                </div>
                
                <Button
                  onClick={handleCreate}
                  disabled={!name || !targetValue || createMutation.isPending}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {createMutation.isPending ? "Criando..." : "Criar Meta"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-cyan-500/10">
                  <Target className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Metas Ativas</p>
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                  <p className="text-2xl font-bold">{completedGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Flame className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                  <p className="text-2xl font-bold">{totalProgress.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                  <p className="text-2xl font-bold">
                    {activeGoals.filter(g => g.priority === "high").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Goals List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : activeGoals.length === 0 && completedGoals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma meta criada</h3>
              <p className="text-muted-foreground mb-4">
                Comece definindo seus objetivos financeiros
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-500" />
                  Metas em Andamento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeGoals.map((goal) => {
                    const progress = calculateProgress(goal.currentValue, goal.targetValue);
                    const daysRemaining = getDaysRemaining(goal.deadline);
                    const TypeIcon = goalTypes.find(t => t.value === goal.type)?.icon || Target;
                    
                    return (
                      <Card key={goal.id} className="relative overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 w-1 h-full bg-${goal.color || "cyan"}-500`}
                          style={{ backgroundColor: `var(--${goal.color || "cyan"}-500, #06b6d4)` }}
                        />
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg bg-${goal.color || "cyan"}-500/10`}>
                                <TypeIcon className={`h-5 w-5 text-${goal.color || "cyan"}-500`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{goal.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[goal.priority as keyof typeof priorityColors]} text-white`}>
                                    {goal.priority === "high" ? "Alta" : goal.priority === "medium" ? "Média" : "Baixa"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(goal)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMutation.mutate({ id: goal.id })}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                          )}
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>{formatCurrency(goal.currentValue)}</span>
                              <span className="text-muted-foreground">{formatCurrency(goal.targetValue)}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-cyan-500">{progress.toFixed(1)}%</span>
                              {daysRemaining !== null && (
                                <span className={`text-sm flex items-center gap-1 ${daysRemaining < 30 ? "text-red-500" : "text-muted-foreground"}`}>
                                  <Calendar className="h-4 w-4" />
                                  {daysRemaining > 0 ? `${daysRemaining} dias` : "Vencido"}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Quick update */}
                          <div className="mt-4 pt-4 border-t">
                            <Label className="text-xs">Atualizar progresso</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="number"
                                placeholder="Novo valor"
                                className="h-8 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value) {
                                      updateProgressMutation.mutate({
                                        id: goal.id,
                                        currentValue: parseFloat(input.value),
                                      });
                                      input.value = "";
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  const input = (e.target as HTMLElement).parentElement?.querySelector("input");
                                  if (input?.value) {
                                    updateProgressMutation.mutate({
                                      id: goal.id,
                                      currentValue: parseFloat(input.value),
                                    });
                                    input.value = "";
                                  }
                                }}
                              >
                                Atualizar
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
            
            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-500" />
                  Metas Concluídas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedGoals.map((goal) => {
                    const TypeIcon = goalTypes.find(t => t.value === goal.type)?.icon || Target;
                    
                    return (
                      <Card key={goal.id} className="bg-green-500/5 border-green-500/20">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-green-500/10">
                              <TypeIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {goal.name}
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              </CardTitle>
                              <CardDescription>
                                Concluída em {goal.completedAt ? new Date(goal.completedAt).toLocaleDateString("pt-BR") : ""}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-green-500">
                              {formatCurrency(goal.targetValue)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate({ id: goal.id })}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Meta</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label>Nome da Meta</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Valor Alvo (R$)</Label>
                <Input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Prazo</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Prioridade</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Cor</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      className={`w-8 h-8 rounded-full ${c.class} ${
                        color === c.value ? "ring-2 ring-offset-2 ring-white" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
              
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

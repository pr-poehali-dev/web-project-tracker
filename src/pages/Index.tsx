import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Comment {
  id: string;
  projectId: string;
  text: string;
  timestamp: string;
}

interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: string;
  timestamp: string;
  url: string;
}

type ProjectStatus = 
  | 'contract' 
  | 'advance' 
  | 'order' 
  | 'shipment' 
  | 'launch' 
  | 'closing' 
  | 'final_payment' 
  | 'completed' 
  | 'cancelled';

interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  duration?: number;
  totalCost: number;
  status: ProjectStatus;
}

interface Client {
  id: string;
  name: string;
  projectsCount: number;
  totalRevenue: number;
}

interface ProjectExpense {
  id: string;
  projectId: string;
  category: string;
  amount: number;
}

const EXPENSE_CATEGORIES = [
  'Стоимость товара',
  'Комиссия банка за перевод',
  'Доставка из-за рубежа',
  'Таможенное оформление',
  'Оформление ДС',
  'Пошлины',
  'Доставка Аэропорт-Склад',
  'Хранение на складе',
  'Доставка по РФ',
  'Комиссия банка за перевод клиенту',
] as const;

const PROJECT_STATUSES: Record<ProjectStatus, { label: string; color: string; icon: string; progress: number }> = {
  contract: { label: 'Договор', color: 'bg-blue-500', icon: 'FileText', progress: 10 },
  advance: { label: 'Аванс', color: 'bg-yellow-500', icon: 'DollarSign', progress: 20 },
  order: { label: 'Заказ', color: 'bg-amber-500', icon: 'ShoppingCart', progress: 30 },
  shipment: { label: 'Отгрузка', color: 'bg-orange-500', icon: 'Truck', progress: 50 },
  launch: { label: 'Запуск', color: 'bg-cyan-500', icon: 'Rocket', progress: 65 },
  closing: { label: 'Закрывающие', color: 'bg-purple-500', icon: 'FileCheck', progress: 80 },
  final_payment: { label: 'Финальная оплата', color: 'bg-indigo-500', icon: 'Banknote', progress: 90 },
  completed: { label: 'Завершено', color: 'bg-green-500', icon: 'CheckCircle2', progress: 100 },
  cancelled: { label: 'Отменено', color: 'bg-red-500', icon: 'XCircle', progress: 0 },
};

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Редизайн корпоративного сайта',
      client: 'ООО "ТехноСтрой"',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      totalCost: 850000,
      status: 'launch'
    },
    {
      id: '2',
      name: 'Мобильное приложение',
      client: 'ИП Иванов',
      startDate: '2024-02-01',
      endDate: '2024-05-15',
      totalCost: 1200000,
      status: 'advance'
    }
  ]);

  const [clients] = useState<Client[]>([
    { id: '1', name: 'ООО "ТехноСтрой"', projectsCount: 3, totalRevenue: 2450000 },
    { id: '2', name: 'ИП Иванов', projectsCount: 1, totalRevenue: 1200000 },
    { id: '3', name: 'ООО "Инновации+"', projectsCount: 2, totalRevenue: 980000 }
  ]);

  const [projectExpenses, setProjectExpenses] = useState<ProjectExpense[]>([
    { id: '1', projectId: '1', category: 'Стоимость товара', amount: 450000 },
    { id: '2', projectId: '1', category: 'Комиссия банка за перевод', amount: 18000 },
    { id: '3', projectId: '1', category: 'Доставка из-за рубежа', amount: 85000 },
    { id: '4', projectId: '1', category: 'Таможенное оформление', amount: 35000 },
    { id: '5', projectId: '1', category: 'Пошлины', amount: 67500 },
    { id: '6', projectId: '2', category: 'Стоимость товара', amount: 780000 },
    { id: '7', projectId: '2', category: 'Доставка по РФ', amount: 42000 },
  ]);
  
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', projectId: '1', text: 'Согласован дизайн главной страницы', timestamp: '2024-02-10T10:30:00' },
    { id: '2', projectId: '1', text: 'Ожидаем утверждение макетов от клиента', timestamp: '2024-02-12T14:15:00' },
  ]);
  
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([
    { id: '1', projectId: '1', name: 'Договор_ТехноСтрой.pdf', size: '2.4 MB', timestamp: '2024-01-20T09:00:00', url: '#' },
    { id: '2', projectId: '1', name: 'Смета_проект.pdf', size: '1.8 MB', timestamp: '2024-01-22T11:30:00', url: '#' },
  ]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    name: string;
    startDate: string;
    duration: number;
  } | null>(null);
  
  const { toast } = useToast();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const margin = calcProjectCost - totalExpenses;
  const marginPercent = calcProjectCost > 0 ? ((margin / calcProjectCost) * 100).toFixed(1) : '0';



  const updateExpenseAmount = (expenseId: string, amount: number) => {
    setProjectExpenses(projectExpenses.map(exp => 
      exp.id === expenseId ? { ...exp, amount } : exp
    ));
    
    toast({
      title: 'Затрата обновлена',
      description: 'Сумма затраты успешно изменена',
    });
  };

  const totalRevenue = projects.reduce((sum, p) => sum + p.totalCost, 0);
  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;
  
  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    ));
    
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, status: newStatus });
    }
    
    toast({
      title: 'Статус обновлён',
      description: `Статус изменён на "${PROJECT_STATUSES[newStatus].label}"`,
    });
  };
  
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    setEditingProject({
      name: project.name,
      startDate: project.startDate,
      duration: project.duration || durationDays,
    });
  };
  
  const calculateEndDate = (startDate: string, durationDays: number): string => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + durationDays);
    return end.toISOString().split('T')[0];
  };
  
  const updateProject = (field: 'name' | 'startDate' | 'duration', value: string | number) => {
    if (!selectedProject || !editingProject) return;
    
    const updated = { ...editingProject };
    
    if (field === 'name') {
      updated.name = value as string;
    } else if (field === 'startDate') {
      updated.startDate = value as string;
    } else if (field === 'duration') {
      updated.duration = parseInt(value as string) || 0;
    }
    
    setEditingProject(updated);
    
    const endDate = calculateEndDate(updated.startDate, updated.duration);
    
    setProjects(projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, name: updated.name, startDate: updated.startDate, endDate, duration: updated.duration }
        : p
    ));
    
    setSelectedProject({
      ...selectedProject,
      name: updated.name,
      startDate: updated.startDate,
      endDate,
      duration: updated.duration,
    });
    
    toast({
      title: 'Проект обновлён',
      description: 'Изменения успешно сохранены',
    });
  };
  
  const addComment = () => {
    if (newComment.trim() && selectedProject) {
      const comment: Comment = {
        id: Date.now().toString(),
        projectId: selectedProject.id,
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment('');
      toast({
        title: 'Комментарий добавлен',
        description: 'Комментарий успешно сохранён',
      });
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedProject) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Ошибка',
          description: 'Можно загружать только PDF файлы',
          variant: 'destructive',
        });
        return;
      }
      
      const newFile: ProjectFile = {
        id: Date.now().toString(),
        projectId: selectedProject.id,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        timestamp: new Date().toISOString(),
        url: URL.createObjectURL(file),
      };
      setProjectFiles([...projectFiles, newFile]);
      toast({
        title: 'Файл загружен',
        description: `${file.name} успешно прикреплён к проекту`,
      });
      event.target.value = '';
    }
  };
  
  const deleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    toast({
      title: 'Комментарий удалён',
      description: 'Комментарий успешно удалён',
    });
  };
  
  const deleteFile = (fileId: string) => {
    setProjectFiles(projectFiles.filter(f => f.id !== fileId));
    toast({
      title: 'Файл удалён',
      description: 'Файл успешно удалён из проекта',
    });
  };
  
  const projectComments = selectedProject ? comments.filter(c => c.projectId === selectedProject.id) : [];
  const projectFilesForSelected = selectedProject ? projectFiles.filter(f => f.projectId === selectedProject.id) : [];
  const currentProjectExpenses = selectedProject ? projectExpenses.filter(e => e.projectId === selectedProject.id) : [];
  
  const getProjectTotalExpenses = (projectId: string) => {
    return projectExpenses
      .filter(e => e.projectId === projectId)
      .reduce((sum, e) => sum + e.amount, 0);
  };
  
  const getProjectMargin = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 0;
    return project.totalCost - getProjectTotalExpenses(projectId);
  };
  
  const getProjectMarginPercent = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.totalCost === 0) return 0;
    return ((getProjectMargin(projectId) / project.totalCost) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Управление проектами
            </h1>
            <p className="text-muted-foreground mt-2">Контроль проектов, финансов и маржинальности</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Новый проект
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-scale-in">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-100 flex items-center">
                <Icon name="FolderKanban" className="mr-2 h-4 w-4" />
                Активных проектов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeProjects}</div>
              <p className="text-xs text-purple-100 mt-1">из {projects.length} всего</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-pink-100 flex items-center">
                <Icon name="TrendingUp" className="mr-2 h-4 w-4" />
                Общая выручка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(totalRevenue / 1000000).toFixed(1)}М ₽</div>
              <p className="text-xs text-pink-100 mt-1">без НДС</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-100 flex items-center">
                <Icon name="Users" className="mr-2 h-4 w-4" />
                Клиентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clients.length}</div>
              <p className="text-xs text-blue-100 mt-1">активных</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="FolderKanban" className="mr-2 h-4 w-4" />
              Проекты
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Клиенты
            </TabsTrigger>
            <TabsTrigger value="finances" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="Wallet" className="mr-2 h-4 w-4" />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="Calculator" className="mr-2 h-4 w-4" />
              Калькулятор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6 space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all animate-fade-in backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Icon name="Building2" className="mr-2 h-4 w-4" />
                        {project.client}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${PROJECT_STATUSES[project.status].color} text-white border-0 flex items-center gap-1`}
                      >
                        <Icon name={PROJECT_STATUSES[project.status].icon} className="h-3 w-3" />
                        {PROJECT_STATUSES[project.status].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Icon name="Calendar" className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Начало:</span>
                      <span className="ml-2 font-medium">{new Date(project.startDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Icon name="CalendarCheck" className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Окончание:</span>
                      <span className="ml-2 font-medium">{new Date(project.endDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Прогресс проекта</span>
                      <span className="font-semibold">{PROJECT_STATUSES[project.status].progress}%</span>
                    </div>
                    <Progress value={PROJECT_STATUSES[project.status].progress} className="h-2" />
                  </div>
                  
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon name="Coins" className="mr-2 h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Стоимость проекта</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {project.totalCost.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                      onClick={() => openProjectDetails(project)}
                    >
                      <Icon name="Eye" className="mr-2 h-4 w-4" />
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="clients" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-all animate-fade-in backdrop-blur-sm bg-white/90">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg mr-3">
                        {client.name.charAt(0)}
                      </div>
                      {client.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Проектов:</span>
                      <Badge variant="secondary">{client.projectsCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Общая выручка:</span>
                      <span className="font-semibold text-purple-600">
                        {(client.totalRevenue / 1000000).toFixed(2)}М ₽
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PieChart" className="mr-2 h-5 w-5 text-purple-600" />
                    Распределение затрат
                  </CardTitle>
                  <CardDescription>Структура расходов по категориям</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectExpenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="PieChart" className="mx-auto h-12 w-12 mb-2 opacity-50" />
                      <p>Затрат пока нет</p>
                    </div>
                  ) : (
                    (() => {
                      const totalExp = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                      const colors = ['from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-blue-500 to-blue-600', 'from-indigo-500 to-indigo-600', 'from-orange-500 to-orange-600', 'from-cyan-500 to-cyan-600'];
                      
                      const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
                        category: cat,
                        total: projectExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
                      })).filter(item => item.total > 0);
                      
                      return categoryTotals.map((item, index) => {
                        const percentage = totalExp > 0 ? (item.total / totalExp) * 100 : 0;
                        return (
                          <div key={item.category} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{item.category}</span>
                              <span className="text-muted-foreground">{item.total.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% от общих затрат</p>
                          </div>
                        );
                      });
                    })()
                  )}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="TrendingUp" className="mr-2 h-5 w-5 text-green-600" />
                    Финансовые показатели
                  </CardTitle>
                  <CardDescription>Общая статистика по проектам</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Общая выручка:</span>
                      <span className="text-xl font-bold text-purple-600">
                        {(totalRevenue / 1000000).toFixed(2)}М ₽
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Затраты:</span>
                      <span className="text-xl font-bold text-pink-600">
                        {(projectExpenses.reduce((sum, e) => sum + e.amount, 0) / 1000000).toFixed(2)}М ₽
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Маржа:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {((totalRevenue - projectExpenses.reduce((sum, e) => sum + e.amount, 0)) / 1000000).toFixed(2)}М ₽
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Маржинальность</span>
                      <span className="text-2xl font-bold text-green-700">
                        {totalRevenue > 0 ? (((totalRevenue - projectExpenses.reduce((sum, e) => sum + e.amount, 0)) / totalRevenue) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <Progress 
                      value={totalRevenue > 0 ? ((totalRevenue - projectExpenses.reduce((sum, e) => sum + e.amount, 0)) / totalRevenue) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-6">
            <p className="text-center text-muted-foreground py-8">
              Калькулятор маржи теперь доступен в каждом проекте отдельно.
              <br />
              Откройте проект для расчёта затрат и маржинальности.
            </p>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {selectedProject.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={selectedProject.status === 'active' ? 'default' : 'secondary'}
                      className={selectedProject.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
                    >
                      {selectedProject.status === 'active' ? 'Активен' : selectedProject.status === 'completed' ? 'Завершен' : 'Планирование'}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Icon name="Building2" className="mr-1 h-4 w-4" />
                      {selectedProject.client}
                    </span>
                  </div>
                </DialogHeader>

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 space-y-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name" className="text-sm font-medium flex items-center">
                        <Icon name="Edit3" className="mr-1 h-3 w-3" />
                        Название проекта
                      </Label>
                      <Input
                        id="project-name"
                        value={editingProject?.name || ''}
                        onChange={(e) => updateProject('name', e.target.value)}
                        className="bg-white border-2 focus:border-purple-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-status" className="text-sm font-medium flex items-center">
                        <Icon name="Activity" className="mr-1 h-3 w-3" />
                        Статус проекта
                      </Label>
                      <Select
                        value={selectedProject?.status}
                        onValueChange={(value) => updateProjectStatus(selectedProject!.id, value as ProjectStatus)}
                      >
                        <SelectTrigger className="bg-white border-2 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROJECT_STATUSES).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                                <Icon name={config.icon} className="h-3 w-3" />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-sm font-medium flex items-center">
                        <Icon name="Calendar" className="mr-1 h-3 w-3" />
                        Дата начала
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={editingProject?.startDate || ''}
                        onChange={(e) => updateProject('startDate', e.target.value)}
                        className="bg-white border-2 focus:border-purple-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm font-medium flex items-center">
                        <Icon name="Clock" className="mr-1 h-3 w-3" />
                        Длительность (дней)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={editingProject?.duration || ''}
                        onChange={(e) => updateProject('duration', e.target.value)}
                        className="bg-white border-2 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="CalendarCheck" className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Дата окончания:</span>
                      </div>
                      <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {editingProject && new Date(calculateEndDate(editingProject.startDate, editingProject.duration)).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">Прогресс выполнения</span>
                        <span className="font-bold text-purple-700">
                          {selectedProject && PROJECT_STATUSES[selectedProject.status].progress}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedProject ? PROJECT_STATUSES[selectedProject.status].progress : 0} 
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="expenses" className="flex-1 overflow-hidden flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="expenses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Icon name="DollarSign" className="mr-2 h-4 w-4" />
                      Затраты ({currentProjectExpenses.length})
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Icon name="MessageSquare" className="mr-2 h-4 w-4" />
                      Комментарии ({projectComments.length})
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Icon name="FileText" className="mr-2 h-4 w-4" />
                      Файлы ({projectFilesForSelected.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="expenses" className="flex-1 overflow-hidden flex flex-col space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Стоимость проекта</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {selectedProject?.totalCost.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Всего затрат</p>
                        <p className="text-2xl font-bold text-pink-600">
                          {selectedProject && getProjectTotalExpenses(selectedProject.id).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Маржа</p>
                        <p className={`text-2xl font-bold ${selectedProject && getProjectMargin(selectedProject.id) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedProject && getProjectMargin(selectedProject.id).toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedProject && getProjectMarginPercent(selectedProject.id)}%
                        </p>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-3">
                        {EXPENSE_CATEGORIES.map((category) => {
                          const expense = currentProjectExpenses.find(e => e.category === category);
                          const expenseId = expense?.id || '';
                          const amount = expense?.amount || 0;
                          
                          return (
                            <div 
                              key={category}
                              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 animate-fade-in hover:shadow-md transition-all"
                            >
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{category}</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                      const newAmount = parseFloat(e.target.value) || 0;
                                      if (expense) {
                                        updateExpenseAmount(expenseId, newAmount);
                                      } else {
                                        const newExpense: ProjectExpense = {
                                          id: Date.now().toString(),
                                          projectId: selectedProject!.id,
                                          category,
                                          amount: newAmount,
                                        };
                                        setProjectExpenses([...projectExpenses, newExpense]);
                                      }
                                    }}
                                    className="flex-1 bg-white border-2 focus:border-purple-500"
                                    placeholder="0"
                                  />
                                  <span className="text-muted-foreground font-medium whitespace-nowrap">₽</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="comments" className="flex-1 overflow-hidden flex flex-col space-y-4 mt-4">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-3">
                        {projectComments.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Icon name="MessageSquare" className="mx-auto h-12 w-12 mb-2 opacity-50" />
                            <p>Комментариев пока нет</p>
                          </div>
                        ) : (
                          projectComments.map((comment) => (
                            <div 
                              key={comment.id} 
                              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 animate-fade-in group hover:shadow-md transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800 mb-2">{comment.text}</p>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Icon name="Clock" className="mr-1 h-3 w-3" />
                                    {new Date(comment.timestamp).toLocaleString('ru-RU')}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteComment(comment.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                                >
                                  <Icon name="Trash2" className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="new-comment">Новый комментарий</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="new-comment"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Введите ваш комментарий..."
                          className="resize-none"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                              addComment();
                            }
                          }}
                        />
                      </div>
                      <Button 
                        onClick={addComment}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={!newComment.trim()}
                      >
                        <Icon name="Send" className="mr-2 h-4 w-4" />
                        Добавить комментарий
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="flex-1 overflow-hidden flex flex-col space-y-4 mt-4">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-3">
                        {projectFilesForSelected.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Icon name="FileText" className="mx-auto h-12 w-12 mb-2 opacity-50" />
                            <p>Файлов пока нет</p>
                          </div>
                        ) : (
                          projectFilesForSelected.map((file) => (
                            <div 
                              key={file.id}
                              className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 animate-fade-in group hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
                                    <Icon name="FileText" className="h-6 w-6" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm text-gray-800">{file.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center">
                                        <Icon name="HardDrive" className="mr-1 h-3 w-3" />
                                        {file.size}
                                      </span>
                                      <span className="flex items-center">
                                        <Icon name="Clock" className="mr-1 h-3 w-3" />
                                        {new Date(file.timestamp).toLocaleString('ru-RU')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(file.url, '_blank')}
                                    className="hover:bg-blue-100"
                                  >
                                    <Icon name="Download" className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteFile(file.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                                  >
                                    <Icon name="Trash2" className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="file-upload">Загрузить PDF файл</Label>
                      <div className="flex gap-2">
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Поддерживаются только PDF файлы
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
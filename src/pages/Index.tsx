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

interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  duration?: number;
  totalCost: number;
  status: 'active' | 'completed' | 'planning';
}

interface Client {
  id: string;
  name: string;
  projectsCount: number;
  totalRevenue: number;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
}

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Редизайн корпоративного сайта',
      client: 'ООО "ТехноСтрой"',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      totalCost: 850000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Мобильное приложение',
      client: 'ИП Иванов',
      startDate: '2024-02-01',
      endDate: '2024-05-15',
      totalCost: 1200000,
      status: 'active'
    }
  ]);

  const [clients] = useState<Client[]>([
    { id: '1', name: 'ООО "ТехноСтрой"', projectsCount: 3, totalRevenue: 2450000 },
    { id: '2', name: 'ИП Иванов', projectsCount: 1, totalRevenue: 1200000 },
    { id: '3', name: 'ООО "Инновации+"', projectsCount: 2, totalRevenue: 980000 }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Разработка', amount: 450000 },
    { id: '2', category: 'Дизайн', amount: 180000 },
    { id: '3', category: 'Тестирование', amount: 95000 }
  ]);

  const [calcProjectCost, setCalcProjectCost] = useState(850000);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  
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

  const addExpense = () => {
    if (newCategory && newAmount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now().toString(),
          category: newCategory,
          amount: parseFloat(newAmount)
        }
      ]);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalRevenue = projects.reduce((sum, p) => sum + p.totalCost, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  
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
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className={project.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
                    >
                      {project.status === 'active' ? 'Активен' : project.status === 'completed' ? 'Завершен' : 'Планирование'}
                    </Badge>
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
                  {expenses.map((expense, index) => {
                    const percentage = totalExpenses > 0 ? (expense.amount / totalExpenses) * 100 : 0;
                    const colors = ['from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-blue-500 to-blue-600', 'from-indigo-500 to-indigo-600'];
                    return (
                      <div key={expense.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{expense.category}</span>
                          <span className="text-muted-foreground">{expense.amount.toLocaleString('ru-RU')} ₽</span>
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
                  })}
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
                        {(totalExpenses / 1000000).toFixed(2)}М ₽
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Маржа:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {((totalRevenue - totalExpenses) / 1000000).toFixed(2)}М ₽
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Маржинальность</span>
                      <span className="text-2xl font-bold text-green-700">
                        {totalRevenue > 0 ? (((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <Progress 
                      value={totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-6">
            <Card className="backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Icon name="Calculator" className="mr-3 h-6 w-6 text-purple-600" />
                  Калькулятор маржи проекта
                </CardTitle>
                <CardDescription>Рассчитайте маржинальность, добавив категории затрат</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="project-cost" className="text-base">Общая стоимость проекта (без НДС)</Label>
                  <div className="relative">
                    <Input
                      id="project-cost"
                      type="number"
                      value={calcProjectCost}
                      onChange={(e) => setCalcProjectCost(parseFloat(e.target.value) || 0)}
                      className="text-xl font-semibold h-14 pr-12 border-2 focus:border-purple-500"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₽</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Категории затрат</h3>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      Всего: {totalExpenses.toLocaleString('ru-RU')} ₽
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 animate-scale-in">
                        <Icon name="Tag" className="h-5 w-5 text-purple-600" />
                        <span className="flex-1 font-medium">{expense.category}</span>
                        <span className="font-semibold text-purple-700">{expense.amount.toLocaleString('ru-RU')} ₽</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExpense(expense.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1 space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Input
                        id="category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Например: Разработка"
                        className="border-2"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <Label htmlFor="amount">Сумма (₽)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="0"
                        className="border-2"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <Button 
                        onClick={addExpense} 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Icon name="Plus" className="mr-2 h-4 w-4" />
                        Добавить затрату
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-center">Результаты расчета</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Стоимость проекта</p>
                      <p className="text-2xl font-bold text-purple-700">{calcProjectCost.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Всего затрат</p>
                      <p className="text-2xl font-bold text-pink-600">{totalExpenses.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    
                    <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Маржа</p>
                      <p className={`text-2xl font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {margin.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-center">
                    <p className="text-sm opacity-90 mb-2">Маржинальность проекта</p>
                    <p className="text-5xl font-bold">{marginPercent}%</p>
                    <p className="text-sm opacity-90 mt-2">
                      {parseFloat(marginPercent) >= 30 ? '✨ Отличная маржа!' : parseFloat(marginPercent) >= 15 ? '👍 Хорошая маржа' : '⚠️ Низкая маржа'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="CalendarCheck" className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Дата окончания:</span>
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {editingProject && new Date(calculateEndDate(editingProject.startDate, editingProject.duration)).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="comments" className="flex-1 overflow-hidden flex flex-col">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Icon name="MessageSquare" className="mr-2 h-4 w-4" />
                      Комментарии ({projectComments.length})
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Icon name="FileText" className="mr-2 h-4 w-4" />
                      Файлы ({projectFilesForSelected.length})
                    </TabsTrigger>
                  </TabsList>

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
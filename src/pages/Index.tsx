import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Project, Client, Comment, ProjectFile, ProjectExpense, ProjectStatus } from '@/types/project';
import StatsCards from '@/components/StatsCards';
import ProjectCard from '@/components/ProjectCard';
import ProjectDialog from '@/components/ProjectDialog';

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
      description: `Статус изменён на "${newStatus}"`,
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

  const getProjectTotalExpenses = (projectId: string): number => {
    return projectExpenses
      .filter(exp => exp.projectId === projectId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getProjectMargin = (projectId: string): number => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 0;
    const totalExpenses = getProjectTotalExpenses(projectId);
    return project.totalCost - totalExpenses;
  };

  const getProjectMarginPercent = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return '0';
    const margin = getProjectMargin(projectId);
    return project.totalCost > 0 ? ((margin / project.totalCost) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2 animate-fade-in">
            Project Tracker
          </h1>
          <p className="text-muted-foreground text-lg">Управление проектами и финансами</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="LayoutDashboard" className="mr-2 h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Клиенты
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="Calculator" className="mr-2 h-4 w-4" />
              Калькулятор
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <StatsCards 
              projects={projects}
              clients={clients}
              projectExpenses={projectExpenses}
            />

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Icon name="FolderKanban" className="mr-2 h-6 w-6 text-purple-600" />
                Активные проекты
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  projectExpenses={projectExpenses}
                  onOpenDetails={openProjectDetails}
                  onUpdateStatus={updateProjectStatus}
                  getProjectTotalExpenses={getProjectTotalExpenses}
                  getProjectMargin={getProjectMargin}
                  getProjectMarginPercent={getProjectMarginPercent}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3">
                        <Icon name="Building2" className="h-6 w-6" />
                      </div>
                      {client.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="FolderOpen" className="h-4 w-4" />
                        Проектов
                      </span>
                      <span className="font-bold text-blue-700">{client.projectsCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="TrendingUp" className="h-4 w-4" />
                        Выручка
                      </span>
                      <span className="font-bold text-green-700">{client.totalRevenue.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
      </div>

      <ProjectDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedProject={selectedProject}
        editingProject={editingProject}
        projectExpenses={projectExpenses}
        comments={comments}
        projectFiles={projectFiles}
        newComment={newComment}
        setNewComment={setNewComment}
        setProjectExpenses={setProjectExpenses}
        updateProject={updateProject}
        calculateEndDate={calculateEndDate}
        addComment={addComment}
        updateExpenseAmount={updateExpenseAmount}
        getProjectTotalExpenses={getProjectTotalExpenses}
        getProjectMargin={getProjectMargin}
        getProjectMarginPercent={getProjectMarginPercent}
      />
    </div>
  );
}

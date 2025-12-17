import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project, Client, Comment, ProjectFile, ProjectExpense, ProjectStatus } from '@/types/project';

export function useProjectData() {
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

  const [clients, setClients] = useState<Client[]>([
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
  
  const [deletedProjects, setDeletedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    name: string;
    startDate: string;
    duration: number;
  } | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const clientMap = new Map<string, { projectsCount: number; totalRevenue: number }>();
    
    projects.forEach(project => {
      const existing = clientMap.get(project.client) || { projectsCount: 0, totalRevenue: 0 };
      clientMap.set(project.client, {
        projectsCount: existing.projectsCount + 1,
        totalRevenue: existing.totalRevenue + project.totalCost,
      });
    });

    const updatedClients = clients.map(client => {
      const stats = clientMap.get(client.name);
      if (stats) {
        return { ...client, projectsCount: stats.projectsCount, totalRevenue: stats.totalRevenue };
      }
      return { ...client, projectsCount: 0, totalRevenue: 0 };
    });

    clientMap.forEach((stats, clientName) => {
      if (!clients.find(c => c.name === clientName)) {
        updatedClients.push({
          id: Date.now().toString() + Math.random(),
          name: clientName,
          projectsCount: stats.projectsCount,
          totalRevenue: stats.totalRevenue,
        });
      }
    });

    setClients(updatedClients);
  }, [projects]);

  const updateExpenseAmount = (expenseId: string, amount: number) => {
    setProjectExpenses(projectExpenses.map(exp => 
      exp.id === expenseId ? { ...exp, amount } : exp
    ));
    
    toast({
      title: 'Затрата обновлена',
      description: 'Сумма затраты успешно изменена',
    });
  };

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

  const updateProjectInCard = (projectId: string, field: 'name' | 'startDate' | 'duration' | 'totalCost', value: string | number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const currentDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const updated = {
      name: project.name,
      startDate: project.startDate,
      duration: project.duration || currentDuration,
      totalCost: project.totalCost,
    };

    if (field === 'name') {
      updated.name = value as string;
    } else if (field === 'startDate') {
      updated.startDate = value as string;
    } else if (field === 'duration') {
      updated.duration = parseInt(value as string) || 0;
    } else if (field === 'totalCost') {
      updated.totalCost = parseInt(value as string) || 0;
    }

    const endDate = calculateEndDate(updated.startDate, updated.duration);

    setProjects(projects.map(p => 
      p.id === projectId
        ? { ...p, name: updated.name, startDate: updated.startDate, endDate, duration: updated.duration, totalCost: updated.totalCost }
        : p
    ));

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

  const addCommentToProject = (projectId: string, text: string) => {
    const comment: Comment = {
      id: Date.now().toString(),
      projectId,
      text,
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    toast({
      title: 'Комментарий добавлен',
      description: 'Комментарий успешно сохранён',
    });
  };

  const addFile = (file: File) => {
    if (!selectedProject) return;
    
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Ошибка',
        description: 'Можно загружать только PDF файлы',
        variant: 'destructive',
      });
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    
    const newFile: ProjectFile = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      name: file.name,
      size: `${fileSizeMB} MB`,
      timestamp: new Date().toISOString(),
      url: URL.createObjectURL(file),
    };
    
    setProjectFiles([...projectFiles, newFile]);
    
    toast({
      title: 'Файл загружен',
      description: `${file.name} успешно добавлен к проекту`,
    });
  };

  const addFileToProject = (projectId: string, file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Ошибка',
        description: 'Можно загружать только PDF файлы',
        variant: 'destructive',
      });
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    
    const newFile: ProjectFile = {
      id: Date.now().toString(),
      projectId,
      name: file.name,
      size: `${fileSizeMB} MB`,
      timestamp: new Date().toISOString(),
      url: URL.createObjectURL(file),
    };
    
    setProjectFiles([...projectFiles, newFile]);
    
    toast({
      title: 'Файл загружен',
      description: `${file.name} успешно добавлен к проекту`,
    });
  };

  const deleteFile = (fileId: string) => {
    const file = projectFiles.find(f => f.id === fileId);
    if (!file) return;

    setProjectFiles(projectFiles.filter(f => f.id !== fileId));

    toast({
      title: 'Файл удалён',
      description: `Файл "${file.name}" удалён из проекта`,
    });
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



  const updateClientName = (clientId: string, newName: string) => {
    const oldClient = clients.find(c => c.id === clientId);
    if (!oldClient) return;

    setClients(clients.map(c => 
      c.id === clientId ? { ...c, name: newName } : c
    ));

    setProjects(projects.map(p => 
      p.client === oldClient.name ? { ...p, client: newName } : p
    ));

    toast({
      title: 'Клиент обновлён',
      description: 'Название клиента успешно изменено',
    });
  };

  const deleteClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const clientProjects = projects.filter(p => p.client === client.name);
    
    if (clientProjects.length > 0) {
      toast({
        title: 'Невозможно удалить',
        description: `У клиента "${client.name}" есть ${clientProjects.length} активных проектов`,
        variant: 'destructive',
      });
      return;
    }

    setClients(clients.filter(c => c.id !== clientId));

    toast({
      title: 'Клиент удалён',
      description: `Клиент "${client.name}" успешно удалён`,
    });
  };

  const createNewProject = (projectData: {
    name: string;
    client: string;
    startDate: string;
    duration: number;
    totalCost: number;
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      client: projectData.client,
      startDate: projectData.startDate,
      endDate: calculateEndDate(projectData.startDate, projectData.duration),
      totalCost: projectData.totalCost,
      status: 'contract',
      duration: projectData.duration,
    };

    setProjects([...projects, newProject]);

    toast({
      title: 'Проект создан',
      description: `Проект "${projectData.name}" успешно добавлен`,
    });
  };

  const deleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setProjects(projects.filter(p => p.id !== projectId));
    setDeletedProjects([...deletedProjects, project]);

    toast({
      title: 'Проект удалён',
      description: `Проект "${project.name}" перемещён в удалённые`,
    });
  };

  const restoreProject = (projectId: string) => {
    const project = deletedProjects.find(p => p.id === projectId);
    if (!project) return;

    setDeletedProjects(deletedProjects.filter(p => p.id !== projectId));
    setProjects([...projects, project]);

    toast({
      title: 'Проект восстановлен',
      description: `Проект "${project.name}" возвращён в активные`,
    });
  };

  const permanentlyDeleteProject = (projectId: string) => {
    const project = deletedProjects.find(p => p.id === projectId);
    if (!project) return;

    setDeletedProjects(deletedProjects.filter(p => p.id !== projectId));
    
    setProjectExpenses(projectExpenses.filter(e => e.projectId !== projectId));
    setComments(comments.filter(c => c.projectId !== projectId));
    setProjectFiles(projectFiles.filter(f => f.projectId !== projectId));

    toast({
      title: 'Проект удалён навсегда',
      description: `Проект "${project.name}" окончательно удалён`,
      variant: 'destructive',
    });
  };

  return {
    projects,
    clients,
    projectExpenses,
    comments,
    projectFiles,
    deletedProjects,
    selectedProject,
    newComment,
    isDialogOpen,
    editingProject,
    setProjectExpenses,
    setNewComment,
    setIsDialogOpen,
    updateExpenseAmount,
    updateProjectStatus,
    openProjectDetails,
    calculateEndDate,
    updateProject,
    updateProjectInCard,
    addComment,
    addCommentToProject,
    addFile,
    addFileToProject,
    deleteFile,
    getProjectTotalExpenses,
    getProjectMargin,
    getProjectMarginPercent,
    createNewProject,
    deleteProject,
    restoreProject,
    permanentlyDeleteProject,
    updateClientName,
    deleteClient,
  };
}
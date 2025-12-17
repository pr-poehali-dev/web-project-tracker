import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project, Client, Comment, ProjectFile, ProjectExpense, ProjectStatus } from '@/types/project';

const API_URL = 'https://functions.poehali.dev/7e644700-fa39-40ee-8f0a-9db41463da38';

const convertFromAPI = (data: any): {
  projects: Project[];
  clients: Client[];
  expenses: ProjectExpense[];
  comments: Comment[];
  files: ProjectFile[];
  removedProjects: Project[];
} => {
  return {
    projects: (data.projects || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      client: p.client,
      startDate: p.start_date,
      endDate: p.end_date,
      totalCost: p.total_cost,
      status: p.status,
      duration: p.duration,
    })),
    clients: (data.clients || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      projectsCount: c.projects_count,
      totalRevenue: c.total_revenue,
    })),
    expenses: (data.expenses || []).map((e: any) => ({
      id: e.id,
      projectId: e.project_id,
      category: e.category,
      amount: e.amount,
    })),
    comments: (data.comments || []).map((c: any) => ({
      id: c.id,
      projectId: c.project_id,
      text: c.text,
      timestamp: c.timestamp,
    })),
    files: (data.files || []).map((f: any) => ({
      id: f.id,
      projectId: f.project_id,
      name: f.name,
      size: f.size,
      timestamp: f.timestamp,
      url: f.url,
    })),
    removedProjects: (data.removedProjects || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      client: p.client,
      startDate: p.start_date,
      endDate: p.end_date,
      totalCost: p.total_cost,
      status: p.status,
      duration: p.duration,
    })),
  };
};

export function useProjectData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpense[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [deletedProjects, setDeletedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    name: string;
    startDate: string;
    duration: number;
  } | null>(null);
  
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const response = await fetch(`${API_URL}?action=get_all`);
      const data = await response.json();
      const converted = convertFromAPI(data);
      
      setProjects(converted.projects);
      setClients(converted.clients);
      setProjectExpenses(converted.expenses);
      setComments(converted.comments);
      setProjectFiles(converted.files);
      setDeletedProjects(converted.removedProjects);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveProject = async (project: Project) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_project',
          data: {
            id: project.id,
            name: project.name,
            client: project.client,
            startDate: project.startDate,
            endDate: project.endDate,
            totalCost: project.totalCost,
            status: project.status,
            duration: project.duration,
            isRemoved: deletedProjects.some(p => p.id === project.id),
          }
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
    }
  };

  const saveClient = async (client: Client) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_client',
          data: {
            id: client.id,
            name: client.name,
            projectsCount: client.projectsCount,
            totalRevenue: client.totalRevenue,
          }
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения клиента:', error);
    }
  };

  const saveExpense = async (expense: ProjectExpense) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_expense',
          data: {
            id: expense.id,
            projectId: expense.projectId,
            category: expense.category,
            amount: expense.amount,
          }
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения затраты:', error);
    }
  };

  const saveComment = async (comment: Comment) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_comment',
          data: {
            id: comment.id,
            projectId: comment.projectId,
            text: comment.text,
            timestamp: comment.timestamp,
          }
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения комментария:', error);
    }
  };

  const saveFile = async (file: ProjectFile) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_file',
          data: {
            id: file.id,
            projectId: file.projectId,
            name: file.name,
            size: file.size,
            timestamp: file.timestamp,
            url: file.url,
          }
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения файла:', error);
    }
  };

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

  const createExpense = (expense: ProjectExpense) => {
    setProjectExpenses([...projectExpenses, expense]);
    saveExpense(expense);
  };

  const updateExpenseAmount = (expenseId: string, amount: number) => {
    const updatedExpenses = projectExpenses.map(exp => 
      exp.id === expenseId ? { ...exp, amount } : exp
    );
    setProjectExpenses(updatedExpenses);
    
    const expense = updatedExpenses.find(e => e.id === expenseId);
    if (expense) saveExpense(expense);
    
    toast({
      title: 'Затрата обновлена',
      description: 'Сумма затраты успешно изменена',
    });
  };

  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    );
    setProjects(updatedProjects);
    
    const project = updatedProjects.find(p => p.id === projectId);
    if (project) saveProject(project);
    
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
    
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, name: updated.name, startDate: updated.startDate, endDate, duration: updated.duration }
        : p
    );
    setProjects(updatedProjects);
    
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
    if (updatedProject) saveProject(updatedProject);
    
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

    const updatedProjects = projects.map(p => 
      p.id === projectId
        ? { ...p, name: updated.name, startDate: updated.startDate, endDate, duration: updated.duration, totalCost: updated.totalCost }
        : p
    );
    setProjects(updatedProjects);

    const updatedProject = updatedProjects.find(p => p.id === projectId);
    if (updatedProject) saveProject(updatedProject);

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
      saveComment(comment);
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
    saveComment(comment);
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
    saveFile(newFile);
    
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
    saveFile(newFile);
    
    toast({
      title: 'Файл загружен',
      description: `${file.name} успешно добавлен к проекту`,
    });
  };

  const deleteFile = async (fileId: string) => {
    const file = projectFiles.find(f => f.id === fileId);
    if (!file) return;

    setProjectFiles(projectFiles.filter(f => f.id !== fileId));

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_file',
          fileId: fileId,
        })
      });
    } catch (error) {
      console.error('Ошибка удаления файла:', error);
    }

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

    const updatedClients = clients.map(c => 
      c.id === clientId ? { ...c, name: newName } : c
    );
    setClients(updatedClients);

    const updatedClient = updatedClients.find(c => c.id === clientId);
    if (updatedClient) saveClient(updatedClient);

    const updatedProjects = projects.map(p => 
      p.client === oldClient.name ? { ...p, client: newName } : p
    );
    setProjects(updatedProjects);
    
    updatedProjects.forEach(p => {
      if (p.client === newName) saveProject(p);
    });

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
    saveProject(newProject);

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
    
    saveProject({ ...project, status: project.status });

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
    
    saveProject(project);

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
    isLoading,
    setProjectExpenses,
    setNewComment,
    setIsDialogOpen,
    createExpense,
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
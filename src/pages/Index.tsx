import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ProjectDialog from '@/components/ProjectDialog';
import OverviewTab from '@/components/OverviewTab';
import ClientsTab from '@/components/ClientsTab';
import DeletedTab from '@/components/DeletedTab';
import { useProjectData } from '@/hooks/useProjectData';

export default function Index() {
  const {
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
    calculateEndDate,
    updateProject,
    updateProjectInCard,
    addCommentToProject,
    addFileToProject,
    getProjectTotalExpenses,
    getProjectMargin,
    getProjectMarginPercent,
    createNewProject,
    deleteProject,
    restoreProject,
    permanentlyDeleteProject,
    updateClientName,
    deleteClient,
  } = useProjectData();

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
            <TabsTrigger value="deleted" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Icon name="Trash2" className="mr-2 h-4 w-4" />
              Удалённые ({deletedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab
              projects={projects}
              clients={clients}
              projectExpenses={projectExpenses}
              comments={comments}
              projectFiles={projectFiles}
              onUpdateStatus={updateProjectStatus}
              onUpdateProject={updateProjectInCard}
              onDeleteProject={deleteProject}
              onUpdateExpense={updateExpenseAmount}
              onCreateExpense={(expense) => setProjectExpenses([...projectExpenses, expense])}
              onAddComment={addCommentToProject}
              onAddFile={addFileToProject}
              getProjectTotalExpenses={getProjectTotalExpenses}
              getProjectMargin={getProjectMargin}
              getProjectMarginPercent={getProjectMarginPercent}
              createNewProject={createNewProject}
            />
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <ClientsTab clients={clients} onUpdateClientName={updateClientName} onDeleteClient={deleteClient} />
          </TabsContent>

          <TabsContent value="deleted" className="mt-6">
            <DeletedTab
              deletedProjects={deletedProjects}
              onRestore={restoreProject}
              onPermanentDelete={permanentlyDeleteProject}
            />
          </TabsContent>

        </Tabs>
      </div>

      <ProjectDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedProject={selectedProject}
        editingProject={editingProject}
        projectExpenses={projectExpenses}
        setProjectExpenses={setProjectExpenses}
        updateProject={updateProject}
        calculateEndDate={calculateEndDate}
        updateExpenseAmount={updateExpenseAmount}
        getProjectTotalExpenses={getProjectTotalExpenses}
        getProjectMargin={getProjectMargin}
        getProjectMarginPercent={getProjectMarginPercent}
      />
    </div>
  );
}
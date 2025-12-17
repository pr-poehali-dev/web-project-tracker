import Icon from '@/components/ui/icon';
import ProjectCard from '@/components/ProjectCard';
import NewProjectForm from '@/components/NewProjectForm';
import { Project, ProjectExpense, Comment, ProjectFile, ProjectStatus } from '@/types/project';

interface ActiveProjectsTabProps {
  projects: Project[];
  projectExpenses: ProjectExpense[];
  comments: Comment[];
  projectFiles: ProjectFile[];
  onUpdateStatus: (projectId: string, status: ProjectStatus) => void;
  onUpdateProject: (projectId: string, field: 'name' | 'startDate' | 'duration' | 'totalCost', value: string | number) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateExpense: (expenseId: string, amount: number) => void;
  onCreateExpense: (expense: ProjectExpense) => void;
  onAddComment: (projectId: string, text: string) => void;
  onAddFile: (projectId: string, file: File) => void;
  getProjectTotalExpenses: (projectId: string) => number;
  getProjectMargin: (projectId: string) => number;
  getProjectMarginPercent: (projectId: string) => string;
  createNewProject: (projectData: {
    name: string;
    client: string;
    startDate: string;
    duration: number;
    totalCost: number;
  }) => void;
}

export default function ActiveProjectsTab({
  projects,
  projectExpenses,
  comments,
  projectFiles,
  onUpdateStatus,
  onUpdateProject,
  onDeleteProject,
  onUpdateExpense,
  onCreateExpense,
  onAddComment,
  onAddFile,
  getProjectTotalExpenses,
  getProjectMargin,
  getProjectMarginPercent,
  createNewProject,
}: ActiveProjectsTabProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Icon name="FolderKanban" className="mr-2 h-6 w-6 text-purple-600" />
          Активные проекты
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewProjectForm onCreateProject={createNewProject} />
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            projectExpenses={projectExpenses}
            comments={comments}
            projectFiles={projectFiles}
            onUpdateStatus={onUpdateStatus}
            onUpdateProject={onUpdateProject}
            onDeleteProject={onDeleteProject}
            onUpdateExpense={onUpdateExpense}
            onCreateExpense={onCreateExpense}
            onAddComment={onAddComment}
            onAddFile={onAddFile}
            getProjectTotalExpenses={getProjectTotalExpenses}
            getProjectMargin={getProjectMargin}
            getProjectMarginPercent={getProjectMarginPercent}
          />
        ))}
      </div>
    </>
  );
}

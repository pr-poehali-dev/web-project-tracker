import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, ProjectStatus, PROJECT_STATUSES, ProjectExpense, Comment, ProjectFile } from '@/types/project';
import ProjectCardHeader from '@/components/ProjectCardHeader';
import ProjectCardFinancials from '@/components/ProjectCardFinancials';
import ProjectCardExpenses from '@/components/ProjectCardExpenses';
import ProjectCardActivity from '@/components/ProjectCardActivity';

interface ProjectCardProps {
  project: Project;
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
  isDeleted?: boolean;
}

export default function ProjectCard({
  project,
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
  isDeleted = false
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusInfo = PROJECT_STATUSES[project.status];
  const totalExpenses = getProjectTotalExpenses(project.id);
  const margin = getProjectMargin(project.id);
  const marginPercent = getProjectMarginPercent(project.id);
  const currentProjectExpenses = projectExpenses.filter(e => e.projectId === project.id);
  const projectComments = comments.filter(c => c.projectId === project.id);
  const projectFilesForProject = projectFiles.filter(f => f.projectId === project.id);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 animate-fade-in overflow-hidden bg-gradient-to-br from-white to-purple-50/30">
      <div className={`h-2 ${statusInfo.color}`}></div>
      
      <ProjectCardHeader
        project={project}
        isDeleted={isDeleted}
        isExpanded={isExpanded}
        onUpdateProject={onUpdateProject}
        onDeleteProject={onDeleteProject}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          <ProjectCardFinancials
            project={project}
            totalExpenses={totalExpenses}
            margin={margin}
            marginPercent={marginPercent}
            onUpdateProject={onUpdateProject}
          />

          <ProjectCardExpenses
            projectId={project.id}
            currentProjectExpenses={currentProjectExpenses}
            onUpdateExpense={onUpdateExpense}
            onCreateExpense={onCreateExpense}
          />

          <ProjectCardActivity
            projectId={project.id}
            projectComments={projectComments}
            projectFilesForProject={projectFilesForProject}
            onAddComment={onAddComment}
            onAddFile={onAddFile}
          />

          <div className="space-y-3 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
            <label className="text-base font-semibold">Изменить статус</label>
            <Select
              value={project.status}
              onValueChange={(value) => onUpdateStatus(project.id, value as ProjectStatus)}
            >
              <SelectTrigger className="w-full h-12 text-base font-medium border-2 hover:border-purple-400 transition-colors shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_STATUSES).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-base py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${value.color}`}></div>
                      {value.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
import StatsCards from '@/components/StatsCards';
import { Project, Client, ProjectExpense } from '@/types/project';

interface OverviewTabProps {
  projects: Project[];
  clients: Client[];
  projectExpenses: ProjectExpense[];
}

export default function OverviewTab({
  projects,
  clients,
  projectExpenses,
}: OverviewTabProps) {
  return (
    <StatsCards 
      projects={projects}
      clients={clients}
      projectExpenses={projectExpenses}
    />
  );
}

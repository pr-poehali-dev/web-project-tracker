import Icon from '@/components/ui/icon';
import DeletedProjectCard from '@/components/DeletedProjectCard';
import { Project } from '@/types/project';

interface DeletedTabProps {
  deletedProjects: Project[];
  onRestore: (projectId: string) => void;
  onPermanentDelete: (projectId: string) => void;
}

export default function DeletedTab({ deletedProjects, onRestore, onPermanentDelete }: DeletedTabProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Icon name="Trash2" className="mr-2 h-6 w-6 text-red-600" />
          Удалённые проекты
        </h2>
        {deletedProjects.length === 0 && (
          <p className="text-muted-foreground text-center py-12 bg-white rounded-lg border-2 border-dashed">
            Нет удалённых проектов
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deletedProjects.map((project) => (
          <DeletedProjectCard
            key={project.id}
            project={project}
            onRestore={onRestore}
            onPermanentDelete={onPermanentDelete}
          />
        ))}
      </div>
    </>
  );
}

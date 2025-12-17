import { useState } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Project, PROJECT_STATUSES } from '@/types/project';

interface ProjectCardHeaderProps {
  project: Project;
  isDeleted: boolean;
  isExpanded: boolean;
  onUpdateProject: (projectId: string, field: 'name', value: string) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleExpand: () => void;
}

export default function ProjectCardHeader({
  project,
  isDeleted,
  isExpanded,
  onUpdateProject,
  onDeleteProject,
  onToggleExpand,
}: ProjectCardHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteProject(project.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const statusInfo = PROJECT_STATUSES[project.status];

  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={() => {
                  if (editedName.trim() && editedName !== project.name) {
                    onUpdateProject(project.id, 'name', editedName.trim());
                  }
                  setIsEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (editedName.trim() && editedName !== project.name) {
                      onUpdateProject(project.id, 'name', editedName.trim());
                    }
                    setIsEditingName(false);
                  } else if (e.key === 'Escape') {
                    setEditedName(project.name);
                    setIsEditingName(false);
                  }
                }}
                className="text-xl font-semibold"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <CardTitle
              className="text-xl mb-2 group-hover:text-purple-600 transition-colors truncate cursor-pointer hover:bg-purple-50 rounded px-2 py-1 -mx-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingName(true);
              }}
            >
              {project.name}
            </CardTitle>
          )}
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Icon name="Building2" className="h-4 w-4" />
            {project.client}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Badge className={`${statusInfo.color} text-white shrink-0 text-base px-4 py-2 font-semibold shadow-md`}>
            {statusInfo.label}
          </Badge>
          {!isDeleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="h-8 w-8 p-0 shrink-0 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Удалить проект"
            >
              <Icon name="Trash2" className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="h-8 w-8 p-0 shrink-0"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="px-6 pb-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-red-800 mb-3 font-medium">Удалить проект "{project.name}"?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleConfirmDelete}
                className="flex-1"
              >
                <Icon name="Trash2" className="mr-1 h-3 w-3" />
                Удалить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelDelete}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </CardHeader>
  );
}
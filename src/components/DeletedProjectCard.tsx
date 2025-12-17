import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Project } from '@/types/project';

interface DeletedProjectCardProps {
  project: Project;
  onRestore: (projectId: string) => void;
  onPermanentDelete: (projectId: string) => void;
}

export default function DeletedProjectCard({ project, onRestore, onPermanentDelete }: DeletedProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePermanentDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmPermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPermanentDelete(project.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelPermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 border-2 border-red-200 animate-fade-in overflow-hidden bg-gradient-to-br from-white to-red-50/30"
    >
      <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2 text-red-700 truncate">
              {project.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Icon name="Building2" className="h-4 w-4" />
              {project.client}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(project.id)}
              className="shrink-0 border-green-300 text-green-700 hover:bg-green-50"
              title="Восстановить проект"
            >
              <Icon name="RotateCcw" className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePermanentDeleteClick}
              className="shrink-0 border-red-300 text-red-700 hover:bg-red-50"
              title="Удалить навсегда"
            >
              <Icon name="X" className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {showDeleteConfirm && (
          <div className="mt-3">
            <div className="bg-red-100 border border-red-300 rounded-lg p-3" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-red-900 mb-3 font-medium">
                Удалить проект навсегда? Это действие необратимо!
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleConfirmPermanentDelete}
                  className="flex-1"
                >
                  <Icon name="Trash2" className="mr-1 h-3 w-3" />
                  Удалить навсегда
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelPermanentDelete}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-xs text-muted-foreground mb-1">Бюджет</p>
            <p className="font-bold text-blue-700">{project.totalCost.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
            <p className="text-xs text-muted-foreground mb-1">Период</p>
            <p className="font-bold text-gray-700 text-xs">
              {new Date(project.startDate).toLocaleDateString('ru-RU')} - {new Date(project.endDate).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Project, PROJECT_STATUSES } from '@/types/project';

interface ProjectCardFinancialsProps {
  project: Project;
  totalExpenses: number;
  margin: number;
  marginPercent: string;
  onUpdateProject: (projectId: string, field: 'startDate' | 'duration' | 'totalCost', value: string | number) => void;
}

export default function ProjectCardFinancials({
  project,
  totalExpenses,
  margin,
  marginPercent,
  onUpdateProject,
}: ProjectCardFinancialsProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedBudget, setEditedBudget] = useState(project.totalCost.toString());

  const statusInfo = PROJECT_STATUSES[project.status];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-sm" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Calendar" className="h-3 w-3" />
            Дата начала
          </Label>
          <Input
            type="date"
            value={project.startDate}
            onChange={(e) => onUpdateProject(project.id, 'startDate', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Clock" className="h-3 w-3" />
            Длительность (дней)
          </Label>
          <Input
            type="number"
            min="1"
            value={project.duration || 0}
            onChange={(e) => onUpdateProject(project.id, 'duration', parseInt(e.target.value) || 0)}
            className="h-8 text-sm"
          />
        </div>
      </div>
      
      <div className="text-sm p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
          <Icon name="CalendarCheck" className="h-3 w-3" />
          Дата окончания
        </p>
        <p className="font-medium text-green-700">{new Date(project.endDate).toLocaleDateString('ru-RU')}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Прогресс</span>
          <span className="font-semibold">{statusInfo.progress}%</span>
        </div>
        <Progress value={statusInfo.progress} className="h-2" />
      </div>

      <div className="pt-4 border-t space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-xs text-muted-foreground mb-1">Бюджет</p>
            {isEditingBudget ? (
              <Input
                type="number"
                min="0"
                value={editedBudget}
                onChange={(e) => setEditedBudget(e.target.value)}
                onBlur={() => {
                  const newBudget = parseInt(editedBudget) || 0;
                  if (newBudget !== project.totalCost) {
                    onUpdateProject(project.id, 'totalCost', newBudget);
                  }
                  setIsEditingBudget(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newBudget = parseInt(editedBudget) || 0;
                    if (newBudget !== project.totalCost) {
                      onUpdateProject(project.id, 'totalCost', newBudget);
                    }
                    setIsEditingBudget(false);
                  } else if (e.key === 'Escape') {
                    setEditedBudget(project.totalCost.toString());
                    setIsEditingBudget(false);
                  }
                }}
                className="h-7 text-sm font-bold text-blue-700 bg-white"
                autoFocus
              />
            ) : (
              <p
                className="font-bold text-blue-700 cursor-pointer hover:bg-blue-200 rounded px-1 -mx-1 transition-colors"
                onClick={() => setIsEditingBudget(true)}
              >
                {project.totalCost.toLocaleString('ru-RU')} ₽
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-xs text-muted-foreground mb-1">Затраты</p>
            <p className="font-bold text-purple-700">{totalExpenses.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${margin >= 0 ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-red-50 to-red-100'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Маржа</span>
            <span className="text-xs font-medium">{marginPercent}%</span>
          </div>
          <p className={`font-bold ${margin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {margin.toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </div>
    </>
  );
}

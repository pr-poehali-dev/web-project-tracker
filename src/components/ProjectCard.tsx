import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Project, ProjectStatus, PROJECT_STATUSES, ProjectExpense, EXPENSE_CATEGORIES } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  projectExpenses: ProjectExpense[];
  onOpenDetails: (project: Project) => void;
  onUpdateStatus: (projectId: string, status: ProjectStatus) => void;
  onUpdateExpense: (expenseId: string, amount: number) => void;
  onCreateExpense: (expense: ProjectExpense) => void;
  getProjectTotalExpenses: (projectId: string) => number;
  getProjectMargin: (projectId: string) => number;
  getProjectMarginPercent: (projectId: string) => string;
}

export default function ProjectCard({ 
  project, 
  projectExpenses,
  onOpenDetails, 
  onUpdateStatus,
  onUpdateExpense,
  onCreateExpense,
  getProjectTotalExpenses,
  getProjectMargin,
  getProjectMarginPercent
}: ProjectCardProps) {
  const [isExpensesOpen, setIsExpensesOpen] = useState(false);
  const statusInfo = PROJECT_STATUSES[project.status];
  const totalExpenses = getProjectTotalExpenses(project.id);
  const margin = getProjectMargin(project.id);
  const marginPercent = getProjectMarginPercent(project.id);
  const currentProjectExpenses = projectExpenses.filter(e => e.projectId === project.id);

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 animate-fade-in overflow-hidden bg-gradient-to-br from-white to-purple-50/30"
    >
      <div className={`h-2 ${statusInfo.color}`}></div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors truncate">
              {project.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Icon name="Building2" className="h-4 w-4" />
              {project.client}
            </p>
          </div>
          <Badge className={`${statusInfo.color} text-white shrink-0`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Icon name="Calendar" className="h-3 w-3" />
              Начало
            </p>
            <p className="font-medium">{new Date(project.startDate).toLocaleDateString('ru-RU')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Icon name="CalendarCheck" className="h-3 w-3" />
              Окончание
            </p>
            <p className="font-medium">{new Date(project.endDate).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-semibold">{statusInfo.progress}%</span>
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-xs text-muted-foreground mb-1">Бюджет</p>
              <p className="font-bold text-blue-700">{project.totalCost.toLocaleString('ru-RU')} ₽</p>
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

        <div className="pt-4 border-t space-y-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpensesOpen(!isExpensesOpen);
            }}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Icon name="DollarSign" className="h-4 w-4 text-purple-600" />
              Категории затрат
            </h3>
            <Icon 
              name={isExpensesOpen ? "ChevronUp" : "ChevronDown"} 
              className="h-4 w-4 text-purple-600 transition-transform" 
            />
          </button>
          
          {isExpensesOpen && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 animate-fade-in">
              {EXPENSE_CATEGORIES.map((category) => {
                const expense = currentProjectExpenses.find(e => e.category === category);
                const expenseId = expense?.id || '';
                const amount = expense?.amount || 0;
                
                return (
                  <div 
                    key={category}
                    className="p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">{category}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            const newAmount = parseFloat(e.target.value) || 0;
                            if (expense) {
                              onUpdateExpense(expenseId, newAmount);
                            } else {
                              const newExpense: ProjectExpense = {
                                id: Date.now().toString() + Math.random(),
                                projectId: project.id,
                                category,
                                amount: newAmount,
                              };
                              onCreateExpense(newExpense);
                            }
                          }}
                          className="h-8 text-sm bg-white border-2 focus:border-purple-500"
                          placeholder="0"
                        />
                        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">₽</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
          <label className="text-sm font-medium">Изменить статус</label>
          <Select
            value={project.status}
            onValueChange={(value) => onUpdateStatus(project.id, value as ProjectStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROJECT_STATUSES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${value.color}`}></div>
                    {value.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(project);
          }}
        >
          <Icon name="Info" className="mr-2 h-4 w-4" />
          Подробнее
        </Button>
      </CardContent>
    </Card>
  );
}
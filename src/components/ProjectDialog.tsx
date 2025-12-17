import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Project, ProjectExpense, EXPENSE_CATEGORIES, PROJECT_STATUSES } from '@/types/project';

interface ProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  editingProject: { name: string; startDate: string; duration: number } | null;
  projectExpenses: ProjectExpense[];
  setProjectExpenses: (expenses: ProjectExpense[]) => void;
  updateProject: (field: 'name' | 'startDate' | 'duration', value: string | number) => void;
  calculateEndDate: (startDate: string, durationDays: number) => string;
  updateExpenseAmount: (expenseId: string, amount: number) => void;
  getProjectTotalExpenses: (projectId: string) => number;
  getProjectMargin: (projectId: string) => number;
  getProjectMarginPercent: (projectId: string) => string;
}

export default function ProjectDialog({
  isOpen,
  onOpenChange,
  selectedProject,
  editingProject,
  projectExpenses,
  setProjectExpenses,
  updateProject,
  calculateEndDate,
  updateExpenseAmount,
  getProjectTotalExpenses,
  getProjectMargin,
  getProjectMarginPercent,
}: ProjectDialogProps) {
  if (!selectedProject) return null;

  const currentProjectExpenses = projectExpenses.filter(e => e.projectId === selectedProject.id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {selectedProject.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <Icon name="Building2" className="h-4 w-4" />
            {selectedProject.client}
          </p>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-sm font-medium flex items-center">
                <Icon name="FileText" className="mr-1 h-3 w-3" />
                Название проекта
              </Label>
              <Input
                id="project-name"
                value={editingProject?.name || ''}
                onChange={(e) => updateProject('name', e.target.value)}
                className="bg-white border-2 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium flex items-center">
                <Icon name="Calendar" className="mr-1 h-3 w-3" />
                Дата начала
              </Label>
              <Input
                id="start-date"
                type="date"
                value={editingProject?.startDate || ''}
                onChange={(e) => updateProject('startDate', e.target.value)}
                className="bg-white border-2 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium flex items-center">
                <Icon name="Clock" className="mr-1 h-3 w-3" />
                Длительность (дней)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={editingProject?.duration || ''}
                onChange={(e) => updateProject('duration', e.target.value)}
                className="bg-white border-2 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="CalendarCheck" className="h-4 w-4 text-green-600" />
                <span className="font-medium">Дата окончания:</span>
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {editingProject && new Date(calculateEndDate(editingProject.startDate, editingProject.duration)).toLocaleDateString('ru-RU')}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Прогресс выполнения</span>
                <span className="font-bold text-purple-700">
                  {PROJECT_STATUSES[selectedProject.status].progress}%
                </span>
              </div>
              <Progress 
                value={PROJECT_STATUSES[selectedProject.status].progress} 
                className="h-3"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700">
              <Icon name="DollarSign" className="h-5 w-5" />
              Затраты ({currentProjectExpenses.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Стоимость проекта</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {selectedProject.totalCost.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Всего затрат</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {getProjectTotalExpenses(selectedProject.id).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Маржа</p>
                  <p className={`text-2xl font-bold ${getProjectMargin(selectedProject.id) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {getProjectMargin(selectedProject.id).toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getProjectMarginPercent(selectedProject.id)}%
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3">
                  {EXPENSE_CATEGORIES.map((category) => {
                    const expense = currentProjectExpenses.find(e => e.category === category);
                    const expenseId = expense?.id || '';
                    const amount = expense?.amount || 0;
                    
                    return (
                      <div 
                        key={category}
                        className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 animate-fade-in hover:shadow-md transition-all"
                      >
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">{category}</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => {
                                const newAmount = parseFloat(e.target.value) || 0;
                                if (expense) {
                                  updateExpenseAmount(expenseId, newAmount);
                                } else {
                                  const newExpense: ProjectExpense = {
                                    id: Date.now().toString(),
                                    projectId: selectedProject.id,
                                    category,
                                    amount: newAmount,
                                  };
                                  setProjectExpenses([...projectExpenses, newExpense]);
                                }
                              }}
                              className="flex-1 bg-white border-2 focus:border-purple-500"
                              placeholder="0"
                            />
                            <span className="text-muted-foreground font-medium whitespace-nowrap">₽</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
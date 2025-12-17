import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Project, Comment, ProjectFile, ProjectExpense, EXPENSE_CATEGORIES, PROJECT_STATUSES } from '@/types/project';

interface ProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  editingProject: { name: string; startDate: string; duration: number } | null;
  projectExpenses: ProjectExpense[];
  comments: Comment[];
  projectFiles: ProjectFile[];
  newComment: string;
  setNewComment: (text: string) => void;
  setProjectExpenses: (expenses: ProjectExpense[]) => void;
  updateProject: (field: 'name' | 'startDate' | 'duration', value: string | number) => void;
  calculateEndDate: (startDate: string, durationDays: number) => string;
  addComment: () => void;
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
  comments,
  projectFiles,
  newComment,
  setNewComment,
  setProjectExpenses,
  updateProject,
  calculateEndDate,
  addComment,
  updateExpenseAmount,
  getProjectTotalExpenses,
  getProjectMargin,
  getProjectMarginPercent,
}: ProjectDialogProps) {
  if (!selectedProject) return null;

  const projectComments = comments.filter(c => c.projectId === selectedProject.id);
  const projectFilesForSelected = projectFiles.filter(f => f.projectId === selectedProject.id);
  const currentProjectExpenses = projectExpenses.filter(e => e.projectId === selectedProject.id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {selectedProject.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <Icon name="Building2" className="h-4 w-4" />
            {selectedProject.client}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 space-y-4">
          <div className="space-y-4">
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

          <Tabs defaultValue="expenses" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expenses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Icon name="DollarSign" className="mr-2 h-4 w-4" />
                Затраты ({currentProjectExpenses.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Icon name="Activity" className="mr-2 h-4 w-4" />
                Активность ({projectComments.length + projectFilesForSelected.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="flex-1 overflow-hidden flex flex-col space-y-4 mt-4">
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
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-hidden flex flex-col space-y-4 mt-4">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3">
                  {projectComments.length === 0 && projectFilesForSelected.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Activity" className="mx-auto h-12 w-12 mb-2 opacity-50" />
                      <p>Активности пока нет</p>
                    </div>
                  ) : (
                    [...projectComments.map(c => ({ ...c, type: 'comment' as const })), 
                     ...projectFilesForSelected.map(f => ({ ...f, type: 'file' as const }))]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((item) => (
                        item.type === 'comment' ? (
                          <div 
                            key={item.id} 
                            className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 animate-fade-in hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                                <Icon name="MessageSquare" className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 mb-1">Комментарий</p>
                                <p className="text-sm text-gray-700 mb-2">{item.text}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Icon name="Clock" className="h-3 w-3" />
                                  {new Date(item.timestamp).toLocaleString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            key={item.id}
                            className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 animate-fade-in hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                                <Icon name="FileText" className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 mb-1">Файл добавлен</p>
                                <p className="text-sm text-gray-700 truncate font-medium mb-1">{item.name}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground">{item.size}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Icon name="Clock" className="h-3 w-3" />
                                    {new Date(item.timestamp).toLocaleString('ru-RU', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                asChild
                              >
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                  <Icon name="Download" className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        )
                      ))
                  )}
                </div>
              </ScrollArea>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="new-comment">Добавить комментарий</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="new-comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Введите ваш комментарий..."
                    className="resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        addComment();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={addComment}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!newComment.trim()}
                >
                  <Icon name="Send" className="mr-2 h-4 w-4" />
                  Добавить комментарий
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
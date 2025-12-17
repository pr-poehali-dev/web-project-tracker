import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Project, Client, ProjectExpense } from '@/types/project';

interface StatsCardsProps {
  projects: Project[];
  clients: Client[];
  projectExpenses: ProjectExpense[];
}

export default function StatsCards({ projects, clients, projectExpenses }: StatsCardsProps) {
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalCost, 0);
  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;
  
  const totalExpensesSum = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalMargin = totalRevenue - totalExpensesSum;
  const totalMarginPercent = totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Активные проекты</CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Icon name="FolderOpen" className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700">{activeProjects}</div>
          <p className="text-xs text-muted-foreground mt-1">Проектов в работе</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Общий доход</CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
            <Icon name="TrendingUp" className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700">{totalRevenue.toLocaleString('ru-RU')} ₽</div>
          <p className="text-xs text-muted-foreground mt-1">Из всех проектов</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Клиенты</CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
            <Icon name="Users" className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700">{clients.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Активных клиентов</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Затраты</CardTitle>
          <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center">
            <Icon name="DollarSign" className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-pink-700">{totalExpensesSum.toLocaleString('ru-RU')} ₽</div>
          <p className="text-xs text-muted-foreground mt-1">Общие расходы</p>
        </CardContent>
      </Card>

      <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${totalMargin >= 0 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100' : 'bg-gradient-to-br from-red-50 to-red-100'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Маржа</CardTitle>
          <div className={`h-10 w-10 rounded-full ${totalMargin >= 0 ? 'bg-emerald-500' : 'bg-red-500'} flex items-center justify-center`}>
            <Icon name={totalMargin >= 0 ? "TrendingUp" : "TrendingDown"} className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${totalMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {totalMargin.toLocaleString('ru-RU')} ₽
          </div>
          <p className="text-xs text-muted-foreground mt-1">{totalMarginPercent}% маржинальность</p>
        </CardContent>
      </Card>
    </div>
  );
}

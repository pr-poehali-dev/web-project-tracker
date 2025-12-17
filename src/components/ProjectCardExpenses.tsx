import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { ProjectExpense, EXPENSE_CATEGORIES } from '@/types/project';

interface ProjectCardExpensesProps {
  projectId: string;
  currentProjectExpenses: ProjectExpense[];
  onUpdateExpense: (expenseId: string, amount: number) => void;
  onCreateExpense: (expense: ProjectExpense) => void;
}

export default function ProjectCardExpenses({
  projectId,
  currentProjectExpenses,
  onUpdateExpense,
  onCreateExpense,
}: ProjectCardExpensesProps) {
  const [isExpensesOpen, setIsExpensesOpen] = useState(false);

  return (
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
                            projectId: projectId,
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
  );
}

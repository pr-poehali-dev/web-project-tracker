import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NewProjectFormProps {
  onCreateProject: (project: {
    name: string;
    client: string;
    startDate: string;
    duration: number;
    totalCost: number;
  }) => void;
}

export default function NewProjectForm({ onCreateProject }: NewProjectFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 30,
    totalCost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.client.trim() || formData.totalCost <= 0) {
      return;
    }

    onCreateProject(formData);
    
    setFormData({
      name: '',
      client: '',
      startDate: new Date().toISOString().split('T')[0],
      duration: 30,
      totalCost: 0,
    });
    
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Card 
        className="group hover:shadow-xl transition-all duration-300 border-2 border-dashed border-purple-300 hover:border-purple-500 animate-fade-in overflow-hidden bg-gradient-to-br from-white to-purple-50/30 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
              <Icon name="Plus" className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-purple-600 mb-1">Добавить новый проект</h3>
            <p className="text-sm text-muted-foreground">Нажмите, чтобы создать проект</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-300 animate-fade-in overflow-hidden bg-gradient-to-br from-white to-purple-50/30">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-purple-600">Новый проект</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 p-0"
          >
            <Icon name="X" className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название проекта *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например: Редизайн сайта"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Клиент *</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="Например: ООО Компания"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Дата начала</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Длительность (дней)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCost">Бюджет проекта (₽) *</Label>
            <Input
              id="totalCost"
              type="number"
              min="0"
              value={formData.totalCost || ''}
              onChange={(e) => setFormData({ ...formData, totalCost: parseInt(e.target.value) || 0 })}
              placeholder="0"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!formData.name.trim() || !formData.client.trim() || formData.totalCost <= 0}
            >
              <Icon name="Check" className="mr-2 h-4 w-4" />
              Создать проект
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

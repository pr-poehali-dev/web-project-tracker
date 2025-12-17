import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Client } from '@/types/project';

interface ClientsTabProps {
  clients: Client[];
  onUpdateClientName: (clientId: string, newName: string) => void;
  onDeleteClient: (clientId: string) => void;
}

export default function ClientsTab({ clients, onUpdateClientName, onDeleteClient }: ClientsTabProps) {
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Card key={client.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center text-xl flex-1 min-w-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3 shrink-0">
                <Icon name="Building2" className="h-6 w-6" />
              </div>
              {editingClientId === client.id ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={() => {
                    if (editedName.trim() && editedName !== client.name) {
                      onUpdateClientName(client.id, editedName.trim());
                    }
                    setEditingClientId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editedName.trim() && editedName !== client.name) {
                        onUpdateClientName(client.id, editedName.trim());
                      }
                      setEditingClientId(null);
                    } else if (e.key === 'Escape') {
                      setEditedName(client.name);
                      setEditingClientId(null);
                    }
                  }}
                  className="text-lg font-semibold"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="cursor-pointer hover:text-purple-600 transition-colors flex-1 min-w-0 truncate"
                  onClick={() => {
                    setEditingClientId(client.id);
                    setEditedName(client.name);
                  }}
                >
                  {client.name}
                </span>
              )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeletingClientId(client.id)}
                className="h-8 w-8 p-0 shrink-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Удалить клиента"
              >
                <Icon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
            {deletingClientId === client.id && (
              <div className="mt-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3" onClick={(e) => e.stopPropagation()}>
                  <p className="text-sm text-red-800 mb-3 font-medium">
                    Удалить клиента "{client.name}"?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onDeleteClient(client.id);
                        setDeletingClientId(null);
                      }}
                      className="flex-1"
                    >
                      <Icon name="Trash2" className="mr-1 h-3 w-3" />
                      Удалить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingClientId(null)}
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="FolderOpen" className="h-4 w-4" />
                Проектов
              </span>
              <span className="font-bold text-blue-700">{client.projectsCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="TrendingUp" className="h-4 w-4" />
                Выручка
              </span>
              <span className="font-bold text-green-700">{client.totalRevenue.toLocaleString('ru-RU')} ₽</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
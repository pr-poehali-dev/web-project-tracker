import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Client } from '@/types/project';

interface ClientsTabProps {
  clients: Client[];
  onUpdateClientName: (clientId: string, newName: string) => void;
}

export default function ClientsTab({ clients, onUpdateClientName }: ClientsTabProps) {
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Card key={client.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
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

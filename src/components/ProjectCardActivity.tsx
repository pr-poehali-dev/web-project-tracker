import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Comment, ProjectFile } from '@/types/project';

interface ProjectCardActivityProps {
  projectId: string;
  projectComments: Comment[];
  projectFilesForProject: ProjectFile[];
  onAddComment: (projectId: string, text: string) => void;
  onAddFile: (projectId: string, file: File) => void;
}

export default function ProjectCardActivity({
  projectId,
  projectComments,
  projectFilesForProject,
  onAddComment,
  onAddFile,
}: ProjectCardActivityProps) {
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  return (
    <div className="pt-4 border-t space-y-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsActivityOpen(!isActivityOpen);
        }}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors"
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Icon name="Activity" className="h-4 w-4 text-purple-600" />
          Активность ({projectComments.length + projectFilesForProject.length})
        </h3>
        <Icon
          name={isActivityOpen ? "ChevronUp" : "ChevronDown"}
          className="h-4 w-4 text-purple-600 transition-transform"
        />
      </button>
      
      {isActivityOpen && (
        <div className="space-y-3 animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <ScrollArea className="max-h-[300px] pr-2">
            <div className="space-y-2">
              {projectComments.length === 0 && projectFilesForProject.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  <Icon name="Activity" className="mx-auto h-8 w-8 mb-1 opacity-50" />
                  <p>Активности пока нет</p>
                </div>
              ) : (
                [...projectComments.map(c => ({ ...c, type: 'comment' as const })),
                 ...projectFilesForProject.map(f => ({ ...f, type: 'file' as const }))]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((item) => (
                    item.type === 'comment' ? (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                      >
                        <div className="flex items-start gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                            <Icon name="MessageSquare" className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 mb-1">{item.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
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
                        className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
                      >
                        <div className="flex items-start gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                            <Icon name="FileText" className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{item.size}</span>
                              <span>•</span>
                              <span>
                                {new Date(item.timestamp).toLocaleString('ru-RU', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))
              )}
            </div>
          </ScrollArea>

          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor={`comment-${projectId}`} className="text-xs">Добавить комментарий</Label>
            <Textarea
              id={`comment-${projectId}`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Введите комментарий..."
              className="resize-none text-sm"
              rows={2}
            />
            <Button
              onClick={() => {
                if (newComment.trim()) {
                  onAddComment(projectId, newComment.trim());
                  setNewComment('');
                }
              }}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!newComment.trim()}
            >
              <Icon name="Send" className="mr-2 h-3 w-3" />
              Отправить
            </Button>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor={`file-${projectId}`} className="text-xs">Загрузить PDF файл</Label>
            <Input
              id={`file-${projectId}`}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onAddFile(projectId, file);
                  e.target.value = '';
                }
              }}
              className="cursor-pointer text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}

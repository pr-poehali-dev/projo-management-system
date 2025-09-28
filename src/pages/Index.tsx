import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'review' | 'progress' | 'testing' | 'done';
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  project: string;
  createdAt: string;
  timeInStatus: string;
  comments: Comment[];
  priority: 'low' | 'medium' | 'high';
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Создать API для аутентификации',
    description: 'Необходимо разработать RESTful API для регистрации и авторизации пользователей с использованием JWT токенов.',
    status: 'open',
    assignee: { name: 'Анна Смирнова', avatar: '', initials: 'АС' },
    project: 'Backend API',
    createdAt: '2024-03-15',
    timeInStatus: '2 дня',
    priority: 'high',
    comments: [
      { id: '1', author: 'Петр Иванов', text: 'Нужно также предусмотреть восстановление пароля', timestamp: '10:30' }
    ]
  },
  {
    id: '2',
    title: 'Оптимизация загрузки страниц',
    description: 'Провести анализ производительности и оптимизировать время загрузки главной страницы.',
    status: 'progress',
    assignee: { name: 'Дмитрий Козлов', avatar: '', initials: 'ДК' },
    project: 'Frontend',
    createdAt: '2024-03-14',
    timeInStatus: '1 день',
    priority: 'medium',
    comments: []
  },
  {
    id: '3',
    title: 'Настройка CI/CD pipeline',
    description: 'Автоматизировать процесс сборки и деплоя приложения через GitHub Actions.',
    status: 'testing',
    assignee: { name: 'Елена Васильева', avatar: '', initials: 'ЕВ' },
    project: 'DevOps',
    createdAt: '2024-03-13',
    timeInStatus: '3 часа',
    priority: 'high',
    comments: [
      { id: '2', author: 'Анна Смирнова', text: 'Тесты проходят успешно на staging', timestamp: '14:20' }
    ]
  },
  {
    id: '4',
    title: 'Исправить баг с уведомлениями',
    description: 'Push-уведомления не приходят на iOS устройства в production среде.',
    status: 'review',
    assignee: { name: 'Михаил Петров', avatar: '', initials: 'МП' },
    project: 'Mobile App',
    createdAt: '2024-03-12',
    timeInStatus: '4 часа',
    priority: 'high',
    comments: []
  },
  {
    id: '5',
    title: 'Рефакторинг компонентов UI',
    description: 'Обновить устаревшие компоненты и привести к единому стилю.',
    status: 'done',
    assignee: { name: 'Ольга Николаева', avatar: '', initials: 'ОН' },
    project: 'Frontend',
    createdAt: '2024-03-10',
    timeInStatus: 'Завершено',
    priority: 'low',
    comments: [
      { id: '3', author: 'Дмитрий Козлов', text: 'Отличная работа! Компоненты стали намного чище', timestamp: '16:45' }
    ]
  }
];

const statusConfig = {
  open: { label: 'Открыта', color: 'bg-gray-100 text-gray-700', icon: 'Circle' },
  review: { label: 'Оценивается', color: 'bg-yellow-100 text-yellow-700', icon: 'Clock' },
  progress: { label: 'В работе', color: 'bg-blue-100 text-blue-700', icon: 'Play' },
  testing: { label: 'Тестируется', color: 'bg-purple-100 text-purple-700', icon: 'TestTube' },
  done: { label: 'Завершено', color: 'bg-green-100 text-green-700', icon: 'CheckCircle' }
};

const priorityConfig = {
  low: { label: 'Низкий', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Средний', color: 'bg-orange-100 text-orange-600' },
  high: { label: 'Высокий', color: 'bg-red-100 text-red-600' }
};

function Index() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status, timeInStatus: 'Только что' }
          : task
      ));
      
      toast({
        title: "Статус обновлен",
        description: `Задача "${draggedTask.title}" перемещена в "${statusConfig[status].label}"`,
      });
      
      setDraggedTask(null);
    }
  };

  const addComment = () => {
    if (newComment.trim() && selectedTask) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Текущий пользователь',
        text: newComment,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };

      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, comments: [...task.comments, comment] }
          : task
      ));

      setSelectedTask(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
      setNewComment('');
      
      toast({
        title: "Комментарий добавлен",
        description: "Ваш комментарий успешно добавлен к задаче",
      });
    }
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Projo</h1>
              <Select defaultValue="backend-api">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backend-api">Backend API</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать задачу
              </Button>
              <Avatar>
                <AvatarFallback>АП</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} />
              <span>Руководитель: Анна Смирнова</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>Создан: 15 марта 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>Участников: 5</span>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-5 gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div
              key={status}
              className="flex flex-col"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status as Task['status'])}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={config.icon as any} size={16} className="text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">{config.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getTasksByStatus(status as Task['status']).length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {getTasksByStatus(status as Task['status']).map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover-scale group"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDoubleClick={() => openTaskModal(task)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight text-card-foreground group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                        <Icon name="GripVertical" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity drag-handle" />
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                          </Avatar>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${priorityConfig[task.priority].color}`}
                          >
                            {priorityConfig[task.priority].label}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.comments.length > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Icon name="MessageCircle" size={12} />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {task.timeInStatus}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Task Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-2xl animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTask?.title}</span>
              <Badge 
                className={statusConfig[selectedTask?.status || 'open'].color}
              >
                {statusConfig[selectedTask?.status || 'open'].label}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Описание</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Исполнитель</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{selectedTask.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedTask.assignee.name}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Проект</Label>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedTask.project}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Дата создания</Label>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedTask.createdAt}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Время в статусе</Label>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedTask.timeInStatus}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Комментарии</Label>
                <div className="mt-2 space-y-3 max-h-40 overflow-y-auto">
                  {selectedTask.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Комментариев пока нет</p>
                  ) : (
                    selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="border rounded p-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Добавить комментарий</Label>
                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Введите ваш комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={addComment} className="w-full">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Добавить комментарий
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;
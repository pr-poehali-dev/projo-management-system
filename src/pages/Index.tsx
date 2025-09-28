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
  assignees: {
    name: string;
    avatar: string;
    initials: string;
  }[];
  project: string;
  createdAt: string;
  timeInStatus: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Project {
  id: string;
  name: string;
  manager: string;
  createdAt: string;
  participants: number;
  description: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Backend API',
    manager: 'Анна Смирнова',
    createdAt: '15 марта 2024',
    participants: 5,
    description: 'Разработка серверной части приложения'
  },
  {
    id: '2',
    name: 'Frontend App',
    manager: 'Дмитрий Козлов',
    createdAt: '10 марта 2024',
    participants: 3,
    description: 'Пользовательский интерфейс'
  },
  {
    id: '3',
    name: 'Mobile App',
    manager: 'Елена Васильева',
    createdAt: '20 февраля 2024',
    participants: 4,
    description: 'Мобильное приложение для iOS и Android'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'INDEX-1 Название задачи',
    description: 'Необходимо разработать RESTful API для регистрации и авторизации пользователей с использованием JWT токенов.',
    status: 'open',
    assignees: [
      { name: 'Анна Смирнова', avatar: '', initials: 'АС' },
      { name: 'Петр Иванов', avatar: '', initials: 'ПИ' }
    ],
    project: 'Backend API',
    createdAt: '2024-03-15',
    timeInStatus: '2 дня',
    comments: [
      { id: '1', author: 'Петр Иванов', text: 'Нужно также предусмотреть восстановление пароля', timestamp: '10:30' }
    ]
  },
  {
    id: '2',
    title: 'INDEX-2 Название задачи',
    description: 'Провести анализ производительности и оптимизировать время загрузки главной страницы.',
    status: 'progress',
    assignees: [
      { name: 'Дмитрий Козлов', avatar: '', initials: 'ДК' }
    ],
    project: 'Backend API',
    createdAt: '2024-03-14',
    timeInStatus: '1 день',
    comments: []
  },
  {
    id: '3',
    title: 'INDEX-3 Название задачи',
    description: 'Автоматизировать процесс сборки и деплоя приложения через GitHub Actions.',
    status: 'testing',
    assignees: [
      { name: 'Елена Васильева', avatar: '', initials: 'ЕВ' },
      { name: 'Михаил Петров', avatar: '', initials: 'МП' },
      { name: 'Ольга Николаева', avatar: '', initials: 'ОН' }
    ],
    project: 'Backend API',
    createdAt: '2024-03-13',
    timeInStatus: '3 часа',
    comments: [
      { id: '2', author: 'Анна Смирнова', text: 'Тесты проходят успешно на staging', timestamp: '14:20' }
    ]
  },
  {
    id: '4',
    title: 'INDEX-4 Название задачи',
    description: 'Push-уведомления не приходят на iOS устройства в production среде.',
    status: 'review',
    assignees: [
      { name: 'Михаил Петров', avatar: '', initials: 'МП' }
    ],
    project: 'Backend API',
    createdAt: '2024-03-12',
    timeInStatus: '4 часа',
    comments: []
  },
  {
    id: '5',
    title: 'INDEX-5 Название задачи',
    description: 'Обновить устаревшие компоненты и привести к единому стилю.',
    status: 'done',
    assignees: [
      { name: 'Ольга Николаева', avatar: '', initials: 'ОН' },
      { name: 'Анна Смирнова', avatar: '', initials: 'АС' }
    ],
    project: 'Backend API',
    createdAt: '2024-03-10',
    timeInStatus: 'Завершено',
    comments: [
      { id: '3', author: 'Дмитрий Козлов', text: 'Отличная работа! Компоненты стали намного чище', timestamp: '16:45' }
    ]
  }
];

const statusConfig = {
  open: { 
    label: 'Открыт', 
    color: 'bg-gray-100 text-gray-700', 
    icon: 'Circle', 
    bgColor: 'bg-white', 
    headerColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  },
  review: { 
    label: 'В оценке', 
    color: 'bg-yellow-100 text-yellow-700', 
    icon: 'Clock', 
    bgColor: 'bg-yellow-50', 
    headerColor: 'bg-yellow-400',
    textColor: 'text-white'
  },
  progress: { 
    label: 'В работе', 
    color: 'bg-red-100 text-red-700', 
    icon: 'Play', 
    bgColor: 'bg-red-50', 
    headerColor: 'bg-red-500',
    textColor: 'text-white'
  },
  testing: { 
    label: 'Тестируется', 
    color: 'bg-orange-100 text-orange-700', 
    icon: 'TestTube', 
    bgColor: 'bg-orange-50', 
    headerColor: 'bg-orange-400',
    textColor: 'text-white'
  },
  done: { 
    label: 'Завершено', 
    color: 'bg-green-100 text-green-700', 
    icon: 'CheckCircle', 
    bgColor: 'bg-green-50', 
    headerColor: 'bg-green-500',
    textColor: 'text-white'
  }
};

function Index() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string>('1');
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
    const currentProject = projects.find(p => p.id === selectedProject);
    return tasks.filter(task => task.status === status && task.project === currentProject?.name);
  };

  const getCurrentProject = () => {
    return projects.find(p => p.id === selectedProject) || projects[0];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Icon name="Menu" size={20} className="text-foreground" />
                <h1 className="text-xl font-bold text-foreground">Proja</h1>
              </div>
              
              <nav className="flex items-center space-x-6">
                <a href="#" className="text-foreground font-medium border-b-2 border-primary pb-1">Задачи</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Проекты</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Пользователи</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Icon name="Bell" size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Имя пользователя</span>
              <Avatar>
                <AvatarFallback>ИП</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Project Header */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-80 text-xl font-bold h-auto py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Project Info */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} />
            <span>Руководитель: {getCurrentProject().manager}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} />
            <span>Создан: {getCurrentProject().createdAt}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} />
            <span>Участников: {getCurrentProject().participants}</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div
              key={status}
              className={`flex flex-col ${config.bgColor} min-h-[600px] rounded-lg overflow-hidden shadow-sm`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status as Task['status'])}
            >
              <div className={`${config.headerColor} ${config.textColor} px-4 py-3 flex items-center justify-between font-medium`}>
                <span>{config.label}</span>
                <Icon name="Plus" size={16} className="cursor-pointer hover:bg-white/20 rounded p-1" />
              </div>

              <div className="p-4 space-y-3 flex-1">
                {getTasksByStatus(status as Task['status']).map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover-scale group bg-white border"
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
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>Исполнители</span>
                        <span>1ч</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {task.assignees.slice(0, 3).map((assignee, index) => (
                            <Avatar key={index} className="h-6 w-6">
                              <AvatarFallback className="text-xs">{assignee.initials}</AvatarFallback>
                            </Avatar>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              +{task.assignees.length - 3}
                            </div>
                          )}
                          {task.comments.length > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground ml-2">
                              <Icon name="MessageCircle" size={12} />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          2+
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add Task Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400 hover:border-gray-400 cursor-pointer transition-colors">
                  <Icon name="Plus" size={24} className="mx-auto mb-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                  <Label className="text-sm font-medium">Исполнители</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedTask.assignees.map((assignee, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-muted rounded-full px-2 py-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{assignee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{assignee.name}</span>
                      </div>
                    ))}
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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, FileText, Users, AlertCircle, Plus } from 'lucide-react';
import { PageProps } from '@/types';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

// Add JSX namespace for TypeScript
declare global {
  namespace JSX {
    interface Element extends React.ReactElement {}
  }
}

interface TaskFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

interface DashboardProps extends PageProps {
  [key: string]: any; // Add index signature to satisfy PageProps constraint
  stats: {
    totalLeads: number;
    pendingTasks: number;
    completedTasks: number;
    newLeads: number;
  };
  reminders: Array<{
    id: number;
    title: string;
    due_date: string;
    type: string;
  }>;
  todos: Array<{
    id: number;
    title: string;
    completed: boolean;
    due_date?: string;
  }>;
  assignedLeads: Array<{
    id: number;
    name: string;
    status: string;
    created_at: string;
  }>;
  pendingTasksList: Array<{
    id: number;
    title: string;
    priority: string;
    due_date: string;
  }>;
  quoteOfTheDay: {
    text: string;
    author: string;
  };
}

export default function Dashboard() {
  const { props } = usePage<DashboardProps>();
  const [showAddTask, setShowAddTask] = useState(false);
  const addTaskForm = useForm<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });
  const addTaskInputRef = useRef<HTMLInputElement>(null);

  // Get initial data from server
  const { stats, reminders, todos, assignedLeads, pendingTasksList, quoteOfTheDay } = props;

  const handleCompleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        // Refresh the page to get updated data
        router.reload();
        toast.success('Task completed!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete task');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title: addTaskForm.data.title,
          description: addTaskForm.data.description,
          priority: addTaskForm.data.priority,
          due_date: addTaskForm.data.due_date || undefined,
        }),
      });

      if (response.ok) {
        // Refresh the page to get updated data
        router.reload();
        toast.success('Task added successfully!');
        setShowAddTask(false);
        addTaskForm.reset();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add task');
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
  ];

  // Icon mapping for stats
  const iconMap: Record<string, JSX.Element> = {
    'users': <Users className="h-5 w-5" />,
    'clock': <Clock className="h-5 w-5" />,
    'check-circle': <CheckCircle className="h-5 w-5" />,
    'file-text': <FileText className="h-5 w-5" />,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="space-y-6 p-4 md:p-6">
        {/* Stats Bar with Quick Links */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">0</div>
                <div className="text-xs text-muted-foreground">Leads</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">0</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">0</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">0</div>
                <div className="text-xs text-muted-foreground">New Leads</div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <Button variant="outline" size="sm" className="gap-1">
              Quick Links
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </Button>
            <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
              <div className="py-1">
                <a href="/leads" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Leads</a>
                <a href="/tasks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tasks</a>
                <a href="/calendar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Calendar</a>
                <a href="/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reports</a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Quote of the Day */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardHeader>
              <CardTitle>Travel Quote of the Day</CardTitle>
              <CardDescription>Get inspired for your next journey</CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="space-y-2">
                <p className="text-lg italic">"{quoteOfTheDay.text}"</p>
                <footer className="text-sm font-medium">— {quoteOfTheDay.author}</footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}

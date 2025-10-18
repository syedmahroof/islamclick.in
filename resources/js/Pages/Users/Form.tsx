import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, User, Mail, Lock, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface UserFormData {
  id?: number;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  roles: string[];
}

interface Props extends PageProps {
  user?: UserFormData;
  roles: string[];
}

const breadcrumbs = (isEdit = false): BreadcrumbItem[] => [
  { title: 'Users', href: '/users' },
  { title: isEdit ? 'Edit User' : 'Create User', href: '#' },
];

export default function UserForm({ user, roles }: Props) {
  const isEdit = !!user?.id;
  const { errors } = usePage().props;
  
  const { data, setData, post, put, processing } = useForm<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    roles: user?.roles || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      put(`/users/${user.id}`, {
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    } else {
      post('/users', {
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    }
  };

  const toggleRole = (role: string) => {
    setData('roles', 
      data.roles.includes(role)
        ? data.roles.filter(r => r !== role)
        : [...data.roles, role]
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
      <Head title={isEdit ? 'Edit User' : 'Create User'} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/users">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Edit User' : 'Create New User'}
                </h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    className={cn('pl-10', errors?.name && 'border-red-500')}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className={cn('pl-10', errors?.email && 'border-red-500')}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {isEdit ? 'New Password' : 'Password'}
                    {!isEdit && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      className={cn('pl-10', errors?.password && 'border-red-500')}
                      value={data.password || ''}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors?.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    {isEdit ? 'Confirm New Password' : 'Confirm Password'}
                    {!isEdit && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password_confirmation"
                      type="password"
                      className={cn('pl-10', errors?.password_confirmation && 'border-red-500')}
                      value={data.password_confirmation || ''}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors?.password_confirmation && (
                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Roles
                </Label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={data.roles.includes(role)}
                        onCheckedChange={() => toggleRole(role)}
                      />
                      <Label htmlFor={`role-${role}`} className="font-normal">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors?.roles && <p className="text-sm text-red-500">{errors.roles}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/users">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {processing ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

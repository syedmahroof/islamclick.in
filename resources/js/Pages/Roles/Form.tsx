import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Shield, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface RoleFormData {
  id?: number;
  name: string;
  permissions: string[];
}

interface Permission {
  id: number;
  name: string;
}

interface Props extends PageProps {
  role?: RoleFormData;
  permissions: Permission[];
}

const breadcrumbs = (isEdit = false): BreadcrumbItem[] => [
  { title: 'Roles', href: '/roles' },
  { title: isEdit ? 'Edit Role' : 'Create Role', href: '#' },
];

export default function RoleForm({ role, permissions }: Props) {
  const isEdit = !!role?.id;
  const { errors } = usePage().props;
  
  const { data, setData, post, put, processing } = useForm<RoleFormData>({
    name: role?.name || '',
    permissions: role?.permissions || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      put(`/roles/${role.id}`, {
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    } else {
      post('/roles', {
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    }
  };

  const togglePermission = (permission: string) => {
    setData('permissions', 
      data.permissions.includes(permission)
        ? data.permissions.filter(p => p !== permission)
        : [...data.permissions, permission]
    );
  };

  // Group permissions by their module/prefix for better organization
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const [module] = permission.name.split('.');
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  return (
    <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
      <Head title={isEdit ? 'Edit Role' : 'Create Role'} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/roles">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Edit Role' : 'Create New Role'}
                </h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    className={cn('pl-10', errors?.name && 'border-red-500')}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g., admin, editor"
                  />
                </div>
                {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="rounded-md border p-4">
                  {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <div key={module} className="mb-4 last:mb-0">
                      <h3 className="mb-2 text-sm font-medium capitalize">{module}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {modulePermissions.map((permission) => (
                          <div 
                            key={permission.id}
                            className={cn(
                              'flex items-center space-x-2 p-2 rounded-md border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
                              data.permissions.includes(permission.name) && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            )}
                            onClick={() => togglePermission(permission.name)}
                          >
                            <div className="flex items-center h-5">
                              <div className={cn(
                                'flex items-center justify-center h-4 w-4 rounded border',
                                data.permissions.includes(permission.name)
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-300 dark:border-gray-600'
                              )}>
                                {data.permissions.includes(permission.name) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                            <Label className="text-sm font-normal cursor-pointer">
                              {permission.name.split('.')[1] || permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {errors?.permissions && (
                  <p className="text-sm text-red-500">{errors.permissions}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/roles">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {processing ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Role' : 'Create Role')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

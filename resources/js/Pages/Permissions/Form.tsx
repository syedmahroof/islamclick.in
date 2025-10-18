import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Key, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PermissionFormData {
  id?: number;
  name: string;
  guard_name: string;
}

interface Props extends PageProps {
  permission?: PermissionFormData;
}

const breadcrumbs = (isEdit = false): BreadcrumbItem[] => [
  { title: 'Permissions', href: '/permissions' },
  { title: isEdit ? 'Edit Permission' : 'Create Permission', href: '#' },
];

export default function PermissionForm({ permission }: Props) {
  const isEdit = !!permission?.id;
  const { errors } = usePage().props;
  
  const { data, setData, post, put, processing } = useForm<PermissionFormData>({
    name: permission?.name || '',
    guard_name: permission?.guard_name || 'web',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      put(`/permissions/${permission.id}`, {
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    } else {
      post('/permissions', {
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
      <Head title={isEdit ? 'Edit Permission' : 'Create Permission'} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/permissions">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Edit Permission' : 'Create New Permission'}
                </h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Permission Name</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    className={cn('pl-10', errors?.name && 'border-red-500')}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g., users.view, users.create"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Use dot notation for grouping (e.g., users.view, users.create)
                </p>
                {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guard_name">Guard Name</Label>
                <Select
                  value={data.guard_name}
                  onChange={(e) => setData('guard_name', e.target.value)}
                  className="w-[180px]"
                >
                  <option value="">Select guard</option>
                  <option value="web">Web</option>
                  <option value="api">API</option>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The guard that the permission applies to
                </p>
                {errors?.guard_name && <p className="text-sm text-red-500">{errors.guard_name}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/permissions">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {processing ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Permission' : 'Create Permission')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

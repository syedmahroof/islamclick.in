import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Key, Search, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

interface Props extends PageProps {
  permissions: {
    data: Permission[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permissions', href: '/permissions' },
];

export default function PermissionsIndex({ permissions }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this permission? This action cannot be undone.')) {
      router.delete(`/permissions/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Key className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
            </div>
            <Button asChild>
              <Link href="/permissions/create">
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Link>
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search permissions..."
                onChange={(e) => {
                  router.get(
                    '/permissions',
                    { search: e.target.value },
                    { preserveState: true, preserveScroll: true }
                  );
                }}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Guard</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.data.length > 0 ? (
                  permissions.data.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                          {permission.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {permission.guard_name}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(permission.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/permissions/${permission.id}/edit`} className="w-full cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                              onClick={() => handleDelete(permission.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No permissions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {permissions.links.length > 3 && (
            <div className="mt-4">
              <div className="flex items-center justify-end space-x-2">
                {permissions.links.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    onClick={() => {
                      if (link.url) {
                        router.get(link.url, {}, { preserveScroll: true });
                      }
                    }}
                  >
                    {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

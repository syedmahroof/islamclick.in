import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Shield, Search, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Role {
  id: number;
  name: string;
  permissions: string[];
  created_at: string;
}

interface Props extends PageProps {
  roles: {
    data: Role[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
];

export default function RolesIndex({ roles }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      router.delete(`/roles/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
            </div>
            <Button asChild>
              <Link href="/roles/create">
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Link>
            </Button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search roles..."
                onChange={(e) => {
                  router.get(
                    '/roles',
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
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.data.length > 0 ? (
                  roles.data.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions?.map((permission) => (
                            <Badge key={permission} variant="secondary">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/roles/${role.id}/edit`} className="w-full cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                              onClick={() => handleDelete(role.id)}
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
                      No roles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {roles.links.length > 3 && (
            <div className="mt-4">
              {/* Pagination component would go here */}
              <div className="flex items-center justify-end space-x-2">
                {roles.links.map((link, index) => (
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

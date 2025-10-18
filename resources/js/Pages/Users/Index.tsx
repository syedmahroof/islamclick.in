import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Users, Filter, Search, MoreVertical, Loader2, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import { UserFormModal } from '@/components/users/UserFormModal';
import { RolesAndPermissionsModal } from '@/components/users/RolesAndPermissionsModal';
import { useState } from 'react';
import { Role, Permission } from '@/types/roles';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: string[];
  permissions: string[];
}

interface Props extends PageProps {
  users: {
    data: User[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  roles: Role[];
  allPermissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Users', href: '/users' },
];

export default function UsersIndex({ users, roles: rolesData, allPermissions }: Props) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id?: number;
    name: string;
    email: string;
    roles: string[];
  } | null>(null);
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(`/users/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Handle success (e.g., show toast)
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => {
                setSelectedUser(null);
                setIsUserModalOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
              <Link href="/roles-permissions">
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Roles & Permissions
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search users..."
                onChange={(e) => {
                  router.get(
                    '/users',
                    { search: e.target.value },
                    { preserveState: true, preserveScroll: true }
                  );
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.length > 0 ? (
                  users.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <button 
                                type="button" 
                                className="w-full cursor-pointer flex items-center px-2 py-1.5 text-sm"
                                onClick={() => {
                                  setSelectedUser({
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    roles: user.roles || []
                                  });
                                  setIsUserModalOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                              onClick={() => handleDelete(user.id)}
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {users.links.length > 3 && (
            <div className="mt-4">
              <Pagination links={users.links} />
            </div>
          )}
        </div>
      </div>

<UserFormModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={selectedUser}
        roles={rolesData.map(role => ({
          id: role.id,
          name: role.name
        }))}
        onSuccess={() => {
          router.reload({ only: ['users'] });
        }}
      />
      
      <RolesAndPermissionsModal
        open={isRolesModalOpen}
        onOpenChange={setIsRolesModalOpen}
        roles={Array.isArray(rolesData) ? rolesData : []}
        allPermissions={Array.isArray(allPermissions) ? allPermissions : []}
        onSuccess={() => {
          router.reload({ only: ['users', 'roles'] });
        }}
      />
    </AppLayout>
  );
}

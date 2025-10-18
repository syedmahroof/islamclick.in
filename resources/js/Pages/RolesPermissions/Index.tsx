import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Role, Permission } from '@/types/roles';

interface Props extends PageProps {
  roles: Role[];
  allPermissions: Record<string, Permission[]>;
}

export default function RolesPermissions({ auth, roles: initialRoles, allPermissions }: Props) {
  const [roles, setRoles] = useState<Role[]>(initialRoles || []);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const handleSaveRole = () => {
    if (!selectedRole || !newRoleName.trim()) return;
    
    const roleData = {
      name: newRoleName.trim(),
      permissions: (Array.isArray(selectedRole.permissions) ? selectedRole.permissions : [])
        .filter((p): p is Permission => typeof p === 'object' && p !== null)
        .map(p => p.id)
    };
    
    const url = selectedRole.id 
      ? route('roles.update', selectedRole.id)
      : route('roles.store');
      
    const method = selectedRole.id ? 'put' : 'post';
    
    router[method](url, roleData, {
      onSuccess: () => {
        router.reload({ only: ['roles'] });
        setSelectedRole(null);
        setNewRoleName('');
        setIsEditing(false);
      },
      preserveScroll: true
    });
  };

  const handleDeleteRole = (role: Role) => {
    if (!role.id) return;
    
    if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      router.delete(route('roles.destroy', role.id), {
        onSuccess: () => {
          router.reload({ only: ['roles'] });
        },
        preserveScroll: true
      });
    }
  };

  const togglePermission = (permission: Permission) => {
    if (!selectedRole) return;
    
    const currentPermissions = Array.isArray(selectedRole.permissions) ? selectedRole.permissions : [];
    const hasPermission = currentPermissions.some(p => p && p.id === permission.id);
    
    setSelectedRole({
      ...selectedRole,
      permissions: hasPermission
        ? currentPermissions.filter(p => p && p.id !== permission.id)
        : [...currentPermissions, permission]
    });
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole({
      ...role,
      permissions: Array.isArray(role.permissions) ? role.permissions : []
    });
    setNewRoleName(role.name || '');
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setSelectedRole({
      id: 0,
      name: '',
      guard_name: 'web',
      permissions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setNewRoleName('');
    setIsEditing(true);
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-semibold text-2xl text-gray-900 dark:text-white leading-tight">
              Roles & Permissions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage user roles and their permissions
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            size="lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Role
          </Button>
        </div>
      }
    >
      <Head title="Roles & Permissions" />

      <div className="p-4 sm:p-6 relative">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Roles List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div 
                        key={role.id}
                        className={`p-3 rounded-md cursor-pointer ${selectedRole?.id === role.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        onClick={() => handleEditRole(role)}
                      >
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-gray-500">
                          {Array.isArray(role.permissions) ? role.permissions.length : 0} permissions
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Permissions */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEditing ? (selectedRole?.id ? 'Edit Role' : 'Create New Role') : 'Select a role to edit'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing && selectedRole ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <Input
                              id="roleName"
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                              placeholder="Enter role name"
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={handleSaveRole}>
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsEditing(false);
                                setSelectedRole(null);
                              }}
                            >
                              Cancel
                            </Button>
                            {selectedRole?.id && (
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteRole(selectedRole)}
                                className="w-full sm:w-auto"
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Permissions</h3>
                        <div className="space-y-6">
                          {Object.entries(allPermissions || {}).map(([group, permissions]) => (
                            <div key={group}>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {group}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                {permissions.map((permission) => {
                                  const hasPermission = selectedRole.permissions.some(
                                    p => p && p.id === permission.id
                                  );
                                  
                                  return (
                                    <div key={permission.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                      <Checkbox
                                        id={`perm-${permission.id}`}
                                        checked={hasPermission}
                                        onCheckedChange={() => togglePermission(permission)}
                                      />
                                      <label
                                        htmlFor={`perm-${permission.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {permission.name}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {roles.length === 0 ? (
                        <div className="space-y-4">
                          <p>No roles found. Create your first role to get started.</p>
                          <Button onClick={handleCreateNew}>
                            Create New Role
                          </Button>
                        </div>
                      ) : (
                        <p>Select a role to edit or create a new one.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-10 sm:hidden">
        <Button 
          onClick={handleCreateNew}
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="sr-only">Create New Role</span>
        </Button>
      </div>
    </AppLayout>
  );
}

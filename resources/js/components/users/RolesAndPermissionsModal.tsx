import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import { Role, Permission } from '@/types/roles';

export function RolesAndPermissionsModal({
  open,
  onOpenChange,
  roles: initialRoles = [],
  allPermissions = [],
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  allPermissions: Permission[];
  onSuccess?: () => void;
}) {
  const [roles, setRoles] = useState<Role[]>(Array.isArray(initialRoles) ? initialRoles : []);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  
  // Ensure roles is always an array
  useEffect(() => {
    setRoles(Array.isArray(initialRoles) ? initialRoles : []);
  }, [initialRoles]);
  
  // Group permissions by their group name with proper initialization and error handling
  const groupedPermissions = React.useMemo(() => {
    try {
      if (!Array.isArray(allPermissions)) {
        console.warn('allPermissions is not an array:', allPermissions);
        return {};
      }
      
      return allPermissions.reduce<Record<string, Permission[]>>((acc, permission) => {
        if (!permission || typeof permission !== 'object') return acc;
        
        const group = permission.group || 'Other';
        
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error grouping permissions:', error);
      return {};
    }
  }, [allPermissions]);

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
        onOpenChange(false);
        onSuccess?.();
      },
      preserveScroll: true
    });
  };

  const handleDeleteRole = (roleId: number) => {
    if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      router.delete(route('roles.destroy', roleId), {
        onSuccess: () => {
          onSuccess?.();
          if (selectedRole?.id === roleId) {
            setSelectedRole(null);
          }
        }
      });
    }
  };

  const togglePermission = (permission: Permission) => {
    if (!selectedRole) return;
    
    const currentPermissions = Array.isArray(selectedRole.permissions) ? selectedRole.permissions : [];
    
    // Handle both string and Permission object formats
    const hasPermission = currentPermissions.some(p => {
      if (!p) return false;
      if (typeof p === 'string') return p === permission.name;
      return p.id === permission.id;
    });
    
    setSelectedRole({
      ...selectedRole,
      permissions: hasPermission
        ? currentPermissions.filter(p => {
            if (!p) return false;
            if (typeof p === 'string') return p !== permission.name;
            return p.id !== permission.id;
          })
        : [...currentPermissions, permission]
    });
  };

  const handleCreateNew = () => {
    const newRole: Role = {
      id: 0,
      name: '',
      guard_name: 'web',
      permissions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSelectedRole(newRole);
    setNewRoleName('');
    setIsEditing(false);
    
    // Ensure the roles list is properly initialized
    setRoles(prevRoles => Array.isArray(prevRoles) ? prevRoles : []);
  };

  const handleEditRole = (role: Role) => {
    if (!role) return;
    
    // Ensure permissions is always an array
    const safeRole = {
      ...role,
      permissions: Array.isArray(role.permissions) ? role.permissions : []
    };
    
    setSelectedRole(safeRole);
    setNewRoleName(role.name || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedRole(null);
    setNewRoleName('');
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Roles & Permissions</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-6">
          {/* Roles List */}
          <div className="col-span-1 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Roles</h3>
              <Button size="sm" onClick={handleCreateNew}>
                + New Role
              </Button>
            </div>
            <div className="border rounded-md divide-y">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedRole?.id === role.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  onClick={() => handleEditRole(role)}
                >
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm text-gray-500">
                    {Array.isArray(role.permissions) ? role.permissions.length : 0} permissions
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="col-span-3">
            {selectedRole ? (
              <div className="space-y-6">
                <div>
                  <Label>Role Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Enter role name"
                    />
                    <Button onClick={handleSaveRole}>
                      {isEditing ? 'Update' : 'Create'} Role
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    {isEditing && selectedRole.id > 0 && (
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteRole(selectedRole.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Permissions</h3>
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                      <div key={group}>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {group}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {perms.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`perm-${permission.id}`}
                                checked={Array.isArray(selectedRole.permissions) && selectedRole.permissions.some(p => 
                                  p && typeof p === 'object' ? p.id === permission.id : p === permission.id
                                )}
                                onChange={() => togglePermission(permission)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label 
                                key={`label-${permission.id}`}
                                htmlFor={`perm-${permission.id}`}
                                className="text-sm text-gray-700 dark:text-gray-300"
                              >
                                {permission.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a role or create a new one to manage permissions
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface Permission {
  id: number;
  name: string;
  group: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface RoleWithPermissions extends Omit<Role, 'permissions'> {
  permissions: number[]; // Just the permission IDs
}

export interface User {
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

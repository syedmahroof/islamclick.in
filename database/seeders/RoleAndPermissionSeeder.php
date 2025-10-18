<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            
            // Role permissions
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'assign roles',
            
            // Permission permissions
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            'assign permissions',
            'manage_roles',
            
            // Lead permissions
            'view leads',
            'create leads',
            'edit leads',
            'delete leads',
            'export leads',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign created permissions
        
        // Create roles if they don't exist
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super-admin'],
            ['guard_name' => 'web']
        );
        
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['guard_name' => 'web']
        );
        
        $managerRole = Role::firstOrCreate(
            ['name' => 'manager'],
            ['guard_name' => 'web']
        );
        
        $agentRole = Role::firstOrCreate(
            ['name' => 'agent'],
            ['guard_name' => 'web']
        );
        
        // Assign all permissions to super admin
        $superAdminRole->syncPermissions(Permission::all());
        
        // Assign specific permissions to admin
        $adminRole->syncPermissions([
            'view users', 'create users', 'edit users', 'delete users',
            'view roles', 'view permissions', 'manage_roles',
            'view leads', 'create leads', 'edit leads', 'delete leads', 'export leads'
        ]);
        
        // Assign specific permissions to manager
        $managerRole->syncPermissions([
            'view users',
            'view leads', 'create leads', 'edit leads', 'export leads'
        ]);
        
        // Assign specific permissions to agent
        $agentRole->syncPermissions([
            'view leads', 'create leads', 'edit leads'
        ]);
        
        // Create a super admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->syncRoles([$superAdminRole->name]);
        
        // Create an admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles([$adminRole->name]);
        
        // Create a manager user
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $manager->syncRoles([$managerRole]);
        
        // Create an agent user
        $agent = User::firstOrCreate(
            ['email' => 'agent@example.com'],
            [
                'name' => 'Agent User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $agent->syncRoles([$agentRole]);
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionMethod;

class GeneratePermissionsList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a list of all permissions used in the application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $permissions = [];
        
        // Get all policy files
        $policyPath = app_path('Policies');
        $policyFiles = File::allFiles($policyPath);
        
        foreach ($policyFiles as $file) {
            $className = 'App\\Policies\\' . str_replace(['.php', '/'], ['', '\\'], $file->getRelativePathname());
            
            if (!class_exists($className)) {
                continue;
            }
            
            $reflection = new ReflectionClass($className);
            $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
            
            foreach ($methods as $method) {
                if (in_array($method->name, [
                    '__construct', 'before', 'after', 'denyWithStatus', 'denyAsNotFound',
                ])) {
                    continue;
                }
                
                // Convert method name to permission name
                $permission = Str::kebab($method->name) . ' ' . Str::kebab(Str::plural(Str::before(class_basename($className), 'Policy')));
                $permissions[] = $permission;
            }
        }
        
        // Get permissions from RoleAndPermissionSeeder
        $seederFile = database_path('seeders/RoleAndPermissionSeeder.php');
        if (File::exists($seederFile)) {
            $content = File::get($seederFile);
            
            // Extract permissions defined in the seeder
            if (preg_match('/\$permissions\s*=\s*\[(.*?)\]/s', $content, $matches)) {
                $permissionLines = explode("\n", $matches[1]);
                foreach ($permissionLines as $line) {
                    if (preg_match("/'([^']+)'/", $line, $matches)) {
                        $permissions[] = $matches[1];
                    }
                }
            }
        }
        
        // Remove duplicates and sort
        $permissions = array_unique($permissions);
        sort($permissions);
        
        // Generate markdown documentation
        $markdown = "# Application Permissions\n\n";
        $markdown .= "This document lists all the permissions used in the application.\n\n";
        $markdown .= "## Permission List\n\n";
        
        $currentGroup = '';
        
        foreach ($permissions as $permission) {
            $parts = explode(' ', $permission, 2);
            $action = $parts[0];
            $resource = $parts[1] ?? '';
            
            // Group by resource
            if ($resource !== $currentGroup) {
                if ($currentGroup !== '') {
                    $markdown .= "\n";
                }
                $currentGroup = $resource;
                $markdown .= "### " . ucfirst(str_replace('-', ' ', $resource)) . "\n\n";
            }
            
            $markdown .= "- `$permission` - Allows a user to " . $this->getPermissionDescription($action, $resource) . "\n";
        }
        
        // Save to file
        $docsPath = base_path('docs');
        if (!File::exists($docsPath)) {
            File::makeDirectory($docsPath, 0755, true);
        }
        
        File::put($docsPath . '/permissions.md', $markdown);
        
        $this->info('Permissions documentation generated successfully at docs/permissions.md');
    }
    
    /**
     * Get a human-readable description for a permission
     */
    protected function getPermissionDescription(string $action, string $resource): string
    {
        $actionMap = [
            'view-any' => 'view all',
            'view' => 'view',
            'create' => 'create',
            'update' => 'update',
            'delete' => 'delete',
            'restore' => 'restore',
            'force-delete' => 'permanently delete',
            'export' => 'export',
            'import' => 'import',
            'assign' => 'assign',
            'revoke' => 'revoke',
        ];
        
        $action = $actionMap[$action] ?? $action;
        $resource = str_replace('-', ' ', $resource);
        
        return "$action $resource";
    }
}

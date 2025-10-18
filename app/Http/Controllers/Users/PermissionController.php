<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Permission::class, 'permission');
    }

    public function index()
    {
        $permissions = Permission::latest()
            ->paginate(10);
            
        return Inertia::render('Permissions/Index', [
            'permissions' => PermissionResource::collection($permissions),
        ]);
    }

    public function create()
    {
        return Inertia::render('Permissions/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'sometimes|string|in:web,api',
        ]);

        try {
            DB::beginTransaction();
            
            Permission::create([
                'name' => $validated['name'],
                'guard_name' => $validated['guard_name'] ?? 'web',
            ]);
            
            DB::commit();
            
            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission created successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create permission');
        }
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('Permissions/Form', [
            'permission' => new PermissionResource($permission),
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'guard_name' => 'sometimes|string|in:web,api',
        ]);

        try {
            DB::beginTransaction();
            
            $permission->update([
                'name' => $validated['name'],
                'guard_name' => $validated['guard_name'] ?? $permission->guard_name,
            ]);
            
            DB::commit();
            
            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission updated successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update permission');
        }
    }

    public function destroy(Permission $permission)
    {
        try {
            // Don't allow deletion if permission is assigned to roles
            if ($permission->roles()->count() > 0) {
                return back()
                    ->with('error', 'Cannot delete permission assigned to roles');
            }
            
            $permission->delete();
            
            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission deleted successfully');
                
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete permission');
        }
    }
}
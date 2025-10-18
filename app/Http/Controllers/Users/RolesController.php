<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Http\Resources\PermissionResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Role::class, 'role');
    }

    public function index()
    {
        $roles = Role::with('permissions')
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Roles/Index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Form', [
            'permissions' => PermissionResource::collection(Permission::all()),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        try {
            DB::beginTransaction();
            
            $role = Role::create(['name' => $validated['name']]);
            
            if (isset($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }
            
            DB::commit();
            
            return redirect()
                ->route('roles.index')
                ->with('success', 'Role created successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create role');
        }
    }

    public function edit(Role $role)
    {
        return Inertia::render('Roles/Form', [
            'role' => new RoleResource($role->load('permissions')),
            'permissions' => PermissionResource::collection(Permission::all()),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        try {
            DB::beginTransaction();
            
            $role->update(['name' => $validated['name']]);
            
            if (isset($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }
            
            DB::commit();
            
            return redirect()
                ->route('roles.index')
                ->with('success', 'Role updated successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update role');
        }
    }

    public function destroy(Role $role)
    {
        try {
            $role->delete();
            
            return redirect()
                ->route('roles.index')
                ->with('success', 'Role deleted successfully');
                
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete role');
        }
    }
}

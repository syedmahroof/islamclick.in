<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::with(['roles', 'permissions'])
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Users/Index', [
            'users' => UserResource::collection($users),
            'roles' => Role::all()->pluck('name')
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);
        
        return Inertia::render('Users/Form', [
            'roles' => Role::all()->pluck('name')
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'sometimes|array',
            'roles.*' => 'string|exists:roles,name'
        ]);

        try {
            DB::beginTransaction();
            
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
            ]);
            
            if (isset($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }
            
            DB::commit();
            
            return redirect()
                ->route('users.index')
                ->with('success', 'User created successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create user');
        }
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        return Inertia::render('Users/Form', [
            'user' => new UserResource($user->load('roles')),
            'roles' => Role::all()->pluck('name')
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'sometimes|array',
            'roles.*' => 'string|exists:roles,name'
        ]);

        try {
            DB::beginTransaction();
            
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            
            if (!empty($validated['password'])) {
                $updateData['password'] = bcrypt($validated['password']);
            }
            
            $user->update($updateData);
            
            if (isset($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }
            
            DB::commit();
            
            return redirect()
                ->route('users.index')
                ->with('success', 'User updated successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update user');
        }
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        
        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account');
        }
        
        $user->delete();
        
        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully');
    }

}


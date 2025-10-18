<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Show the user's dashboard.
     */
    public function dashboard()
    {
        return Inertia::render('Dashboard', [
            'recentActivity' => [],
            'stats' => [
                'articles' => 0,
                'comments' => 0,
                'likes' => 0,
            ],
        ]);
    }

    /**
     * Show the user's profile.
     */
    public function profile()
    {
        $user = auth()->user();
        
        return Inertia::render('Profile/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'avatar' => $user->avatar_url,
                'bio' => $user->bio,
                'joined_at' => $user->created_at->diffForHumans(),
            ],
        ]);
    }

    /**
     * Update the user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'bio' => ['nullable', 'string', 'max:500'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        // Handle avatar upload if present
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar_url'] = asset('storage/' . $path);
        }

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}

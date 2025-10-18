<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'priority' => $validated['priority'] ?? 'medium',
            'assigned_to' => Auth::id(),
            'created_by' => Auth::id(),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load('assignee'),
        ], 201);
    }

    public function complete(Task $task)
    {
        $this->authorize('update', $task);
        
        $task->complete();

        return response()->json([
            'message' => 'Task marked as complete',
            'task' => $task->load('assignee'),
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LeadNoteController extends Controller
{
    /**
     * Display a listing of the notes for a lead.
     */
    public function index(Lead $lead)
    {
        $this->authorize('view', $lead);
        
        $notes = $lead->notes()
            ->with('creator')
            ->latest()
            ->get();
            
        return response()->json($notes);
    }

    /**
     * Store a newly created note in storage.
     */
    public function store(Request $request, Lead $lead)
    {
        $this->authorize('update', $lead);
        
        $validated = $request->validate([
            'content' => 'required|string|max:10000',
        ]);
        
        $note = $lead->notes()->create([
            'content' => $validated['content'],
            'created_by' => Auth::id(),
        ]);
        
        $note->load('creator');
        
        return response()->json($note, 201);
    }

    /**
     * Update the specified note in storage.
     */
    public function update(Request $request, Lead $lead, LeadNote $note)
    {
        $this->authorize('update', $lead);
        
        $validated = $request->validate([
            'content' => 'required|string|max:10000',
        ]);
        
        // Ensure the note belongs to the lead
        if ($note->lead_id !== $lead->id) {
            abort(404);
        }
        
        $note->update([
            'content' => $validated['content'],
        ]);
        
        $note->load('creator');
        
        return response()->json($note);
    }

    /**
     * Remove the specified note from storage.
     */
    public function destroy(Lead $lead, LeadNote $note)
    {
        $this->authorize('update', $lead);
        
        // Ensure the note belongs to the lead
        if ($note->lead_id !== $lead->id) {
            abort(404);
        }
        
        $note->delete();
        
        return response()->json(null, 204);
    }
}

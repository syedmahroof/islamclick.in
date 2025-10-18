<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadFollowUp;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LeadFollowUpController extends Controller
{
    /**
     * Display a listing of the follow-ups for a lead.
     */
    public function index(Lead $lead)
    {
        $this->authorize('view', $lead);
        
        $followUps = $lead->follow_ups()
            ->with('creator')
            ->latest('scheduled_at')
            ->get();
            
        return response()->json($followUps);
    }

    /**
     * Store a newly created follow-up in storage.
     */
    public function store(Request $request, Lead $lead)
    {
        $this->authorize('update', $lead);
        
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:10000'],
            'scheduled_at' => ['required', 'date'],
            'status' => ['required', 'string', Rule::in(['scheduled', 'completed', 'cancelled'])],
        ]);
        
        // Convert scheduled_at to proper datetime format
        $scheduledAt = Carbon::parse($validated['scheduled_at']);
        
        $followUp = $lead->follow_ups()->create([
            'type' => $validated['type'],
            'notes' => $validated['notes'] ?? null,
            'scheduled_at' => $scheduledAt,
            'status' => $validated['status'],
            'created_by' => Auth::id(),
        ]);
        
        $followUp->load('creator');
        
        return response()->json($followUp, 201);
    }

    /**
     * Update the specified follow-up in storage.
     */
    public function update(Request $request, Lead $lead, LeadFollowUp $followUp)
    {
        $this->authorize('update', $lead);
        
        // Ensure the follow-up belongs to the lead
        if ($followUp->lead_id !== $lead->id) {
            abort(404);
        }
        
        $validated = $request->validate([
            'type' => ['sometimes', 'required', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:10000'],
            'scheduled_at' => ['sometimes', 'required', 'date'],
            'status' => ['sometimes', 'required', 'string', Rule::in(['scheduled', 'completed', 'cancelled'])],
        ]);
        
        // Convert scheduled_at to proper datetime format if provided
        if (isset($validated['scheduled_at'])) {
            $validated['scheduled_at'] = Carbon::parse($validated['scheduled_at']);
        }
        
        // Update completed_at if status is being changed to completed
        if (isset($validated['status']) && $validated['status'] === 'completed' && $followUp->status !== 'completed') {
            $validated['completed_at'] = now();
        }
        
        $followUp->update($validated);
        
        $followUp->load('creator');
        
        return response()->json($followUp);
    }

    /**
     * Remove the specified follow-up from storage.
     */
    public function destroy(Lead $lead, LeadFollowUp $followUp)
    {
        $this->authorize('update', $lead);
        
        // Ensure the follow-up belongs to the lead
        if ($followUp->lead_id !== $lead->id) {
            abort(404);
        }
        
        $followUp->delete();
        
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::latest()->paginate(15);
        $unreadCount = Lead::where('is_read', false)->count();
        return view('admin.leads.index', compact('leads', 'unreadCount'));
    }

    public function show(Lead $lead)
    {
        // Mark as read when viewing
        if (!$lead->is_read) {
            $lead->update(['is_read' => true]);
        }
        return view('admin.leads.show', compact('lead'));
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return redirect()->route('admin.leads.index')->with('success', 'Lead deleted successfully.');
    }
}

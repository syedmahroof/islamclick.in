<?php

use App\Http\Controllers\LeadController;
use App\Http\Controllers\LeadSourceController;
use App\Http\Controllers\LeadPriorityController;
use App\Http\Controllers\LeadAgentController;
use Illuminate\Support\Facades\Route;

// Lead Routes
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Main leads resource
    Route::resource('leads', LeadController::class);
    
    // Lead status updates
    Route::post('leads/{lead}/convert', [LeadController::class, 'convert'])
        ->name('leads.convert');
    Route::post('leads/{lead}/mark-as-lost', [LeadController::class, 'markAsLost'])
        ->name('leads.mark-as-lost');
    
    // Lead analytics
    Route::get('leads/analytics', [LeadController::class, 'analytics'])
        ->name('leads.analytics');
    
    // Lead Sources
    Route::resource('lead-sources', LeadSourceController::class)
        ->except(['show']);
    
    // Lead Priorities routes are defined in web.php to avoid conflicts
    
    // Lead Agents
    Route::resource('lead-agents', LeadAgentController::class)
        ->except(['show', 'update']);
    Route::post('lead-agents/{agent}/toggle-status', [LeadAgentController::class, 'toggleStatus'])
        ->name('lead-agents.toggle-status');
});

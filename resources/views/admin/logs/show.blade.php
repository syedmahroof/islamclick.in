@extends('admin.layout')

@section('page-title', 'Title')@section('content')
<div class="p-6">
    <div class="mb-6">
        <a href="{{ route('admin.logs.index') }}" class="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Back to Logs
        </a>
        <h1 class="text-3xl font-bold text-gray-800">Log Details</h1>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ $log->created_at->format('F d, Y \a\t H:i:s') }}</p>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">User</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ $log->user->name ?? 'System' }}</p>
                    @if($log->user)
                        <p class="text-sm text-gray-500">{{ $log->user->email }}</p>
                    @endif
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Action</h3>
                    @php
                        $actionColors = [
                            'created' => 'bg-green-100 text-green-800',
                            'updated' => 'bg-blue-100 text-blue-800',
                            'deleted' => 'bg-red-100 text-red-800',
                            'published' => 'bg-purple-100 text-purple-800',
                            'unpublished' => 'bg-gray-100 text-gray-800',
                        ];
                        $color = $actionColors[$log->action] ?? 'bg-gray-100 text-gray-800';
                    @endphp
                    <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full {{ $color }}">
                        {{ ucfirst($log->action) }}
                    </span>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Model</h3>
                    <p class="text-lg font-semibold text-gray-900">
                        {{ $log->model }}
                        @if($log->model_id)
                            <span class="text-gray-500">#{{ $log->model_id }}</span>
                        @endif
                    </p>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">IP Address</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ $log->ip_address }}</p>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">User Agent</h3>
                    <p class="text-sm text-gray-900">{{ $log->user_agent }}</p>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p class="text-gray-900">{{ $log->description }}</p>
            </div>

            @if($log->old_values || $log->new_values)
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @if($log->old_values)
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-2">Old Values</h3>
                    <div class="bg-red-50 border border-red-200 rounded p-4">
                        <pre class="text-xs text-gray-700 overflow-auto">{{ json_encode($log->old_values, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                    </div>
                </div>
                @endif

                @if($log->new_values)
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-2">New Values</h3>
                    <div class="bg-green-50 border border-green-200 rounded p-4">
                        <pre class="text-xs text-gray-700 overflow-auto">{{ json_encode($log->new_values, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                    </div>
                </div>
                @endif
            </div>
            @endif
        </div>
    </div>
</div>
@endsection


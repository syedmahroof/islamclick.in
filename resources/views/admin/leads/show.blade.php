@extends('admin.layout')

@section('page-title', 'Lead Details')
@section('page-title', 'Title')@section('content')
<div class="p-6">
    <div class="mb-6">
        <a href="{{ route('admin.leads.index') }}" class="text-[#bd9966] hover:text-[#a88455] mb-4 inline-block">
            ← Back to Leads
        </a>
        <h1 class="text-3xl font-light text-gray-800">Lead Details</h1>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Name</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ $lead->name }}</p>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
                    <p class="text-lg font-semibold text-gray-900">
                        <a href="mailto:{{ $lead->email }}" class="text-[#bd9966] hover:text-[#a88455]">
                            {{ $lead->email }}
                        </a>
                    </p>
                </div>
                <div class="md:col-span-2">
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Subject</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ $lead->subject }}</p>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                    <p class="text-lg font-semibold text-gray-900">{{ $lead->created_at->format('F d, Y \a\t H:i:s') }}</p>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    @if($lead->is_read)
                        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Read</span>
                    @else
                        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Unread</span>
                    @endif
                </div>
            </div>

            <div class="mb-6 border-t border-gray-200 pt-6">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Message</h3>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p class="text-gray-900 whitespace-pre-wrap">{{ $lead->message }}</p>
                </div>
            </div>

            <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                <div class="flex space-x-3">
                    <a href="mailto:{{ $lead->email }}?subject=Re: {{ $lead->subject }}" class="bg-[#bd9966] hover:bg-[#a88455] text-white font-medium py-2 px-4 rounded transition">
                        Reply via Email
                    </a>
                </div>
                <form action="{{ route('admin.leads.destroy', $lead) }}" method="POST" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition" onclick="return confirm('Are you sure you want to delete this lead?')">
                        Delete Lead
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection


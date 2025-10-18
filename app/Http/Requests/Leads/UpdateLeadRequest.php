<?php

namespace App\Http\Requests\Leads;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Lead;
use Illuminate\Validation\Rule;

class UpdateLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('leads', 'email')->ignore($this->route('lead'))
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('leads', 'phone')->ignore($this->route('lead'))
            ],
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'status' => 'sometimes|required|string|in:' . implode(',', array_keys(Lead::statuses())),
            'source_id' => 'nullable|exists:lead_sources,id',
            'priority_id' => 'nullable|exists:lead_priorities,id',
            'agent_id' => 'nullable|exists:lead_agents,id',
            'description' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'A lead with this email already exists.',
            'phone.unique' => 'A lead with this phone number already exists.',
            'status.in' => 'The selected status is invalid.',
            'source_id.exists' => 'The selected lead source is invalid.',
            'priority_id.exists' => 'The selected priority is invalid.',
            'agent_id.exists' => 'The selected agent is invalid.',
        ];
    }
}

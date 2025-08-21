<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermissionRequest extends FormRequest
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
            'department_id' => 'required|exists:departments,id',
            'date' => 'required|date|after_or_equal:today',
            'exit_time' => 'required|date_format:H:i',
            'return_time' => 'required|date_format:H:i|after:exit_time',
            'reason' => 'required|string|max:500',
            'location' => 'required|string|max:255',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'department_id.required' => 'Department is required.',
            'department_id.exists' => 'Selected department is invalid.',
            'date.required' => 'Date is required.',
            'date.date' => 'Please provide a valid date.',
            'date.after_or_equal' => 'Date cannot be in the past.',
            'exit_time.required' => 'Exit time is required.',
            'exit_time.date_format' => 'Exit time must be in HH:MM format.',
            'return_time.required' => 'Return time is required.',
            'return_time.date_format' => 'Return time must be in HH:MM format.',
            'return_time.after' => 'Return time must be after exit time.',
            'reason.required' => 'Reason is required.',
            'reason.max' => 'Reason cannot exceed 500 characters.',
            'location.required' => 'Location is required.',
            'location.max' => 'Location cannot exceed 255 characters.',
        ];
    }
}
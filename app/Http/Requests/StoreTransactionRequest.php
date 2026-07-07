<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'customer_id'               => ['nullable', 'exists:customers,id'],
            'payment_method'            => ['required', 'in:cash,zaad,evc,jeeb,card'],
            'discount'                  => ['numeric', 'min:0'],
            'tax'                       => ['numeric', 'min:0'],
            'items'                     => ['required', 'array', 'min:1'],
            'items.*.product_id'        => ['required', 'exists:products,id'],
            'items.*.quantity'          => ['required', 'integer', 'min:1'],
        ];
    }
}

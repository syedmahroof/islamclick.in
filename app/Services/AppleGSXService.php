<?php

declare(strict_types=1);

namespace App\Services;

final class AppleGSXService
{
    public function getProductDetails($params = []): array
    {
      
        return ['product' => 'Sample Product', 'params' => $params];
    }

    public function getSuits($params = [])
    {
        $baseUrl = config('services.apple_gsx.base_url');
        $endpoint = '/diagnostics/suites';

        $headers = [
            'X-Apple-SoldTo' => config('services.apple_gsx.sold_to'),
            'X-Apple-ShipTo' => config('services.apple_gsx.ship_to'),
            'X-Apple-Trace-ID' => $params['trace_id'] ?? (string) \Illuminate\Support\Str::uuid(),
            'X-Apple-Auth-Token' => $params['auth_token'] ?? '',
            'X-Apple-Service-Version' => config('services.apple_gsx.service_version'),
        ];

        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)->get($baseUrl.$endpoint);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'status' => $response->status(),
            'body' => $response->body(),
        ];

    }

    public function initiateDiagnose($params = [])
    {
        $baseUrl = config('services.apple_gsx.base_url');
        $endpoint = '/diagnostics/initiate-test';

        $headers = [
            'X-Apple-SoldTo' => config('services.apple_gsx.sold_to'),
            'X-Apple-ShipTo' => config('services.apple_gsx.ship_to'),
            'X-Apple-Trace-ID' => $params['trace_id'] ?? (string) \Illuminate\Support\Str::uuid(),
            'X-Apple-Auth-Token' => $params['auth_token'] ?? '',
            'X-Apple-Service-Version' => config('services.apple_gsx.service_version'),
            'X-Operator-User-ID' => config('services.apple_gsx.operator_user_id'),
            'X-Apple-Client-Locale' => config('services.apple_gsx.client_locale'),
            'X-Apple-Client-Timezone' => config('services.apple_gsx.client_timezone'),
        ];

        $body = $params['body'] ?? [];

        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)->post($baseUrl.$endpoint, $body);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'status' => $response->status(),
            'body' => $response->body(),
        ];

    }

    public function getStatus($params = [])
    {
        $baseUrl = config('services.apple_gsx.base_url');
        $endpoint = '/diagnostics/status'; // Adjust endpoint as needed

        $headers = [
            'X-Apple-SoldTo' => config('services.apple_gsx.sold_to'),
            'X-Apple-ShipTo' => config('services.apple_gsx.ship_to'),
            'X-Apple-Trace-ID' => $params['trace_id'] ?? (string) \Illuminate\Support\Str::uuid(),
            'X-Apple-Auth-Token' => $params['auth_token'] ?? '',
            'X-Apple-Service-Version' => config('services.apple_gsx.service_version'),
            'X-Operator-User-ID' => config('services.apple_gsx.operator_user_id'),
            'X-Apple-Client-Locale' => config('services.apple_gsx.client_locale'),
            'X-Apple-Client-Timezone' => config('services.apple_gsx.client_timezone'),
        ];

        $body = $params['body'] ?? [];

        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)->post($baseUrl.$endpoint, $body);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'status' => $response->status(),
            'body' => $response->body(),
        ];

    }

    public function lookup($params = [])
    {
        $baseUrl = config('services.apple_gsx.base_url');
        $endpoint = '/diagnostics/lookup'; // Adjust endpoint as needed

        $headers = [
            'X-Apple-SoldTo' => config('services.apple_gsx.sold_to'),
            'X-Apple-ShipTo' => config('services.apple_gsx.ship_to'),
            'X-Apple-Trace-ID' => $params['trace_id'] ?? (string) \Illuminate\Support\Str::uuid(),
            'X-Apple-Auth-Token' => $params['auth_token'] ?? '',
            'X-Apple-Service-Version' => config('services.apple_gsx.service_version'),
            'X-Operator-User-ID' => config('services.apple_gsx.operator_user_id'),
            'X-Apple-Client-Locale' => config('services.apple_gsx.client_locale'),
            'X-Apple-Client-Timezone' => config('services.apple_gsx.client_timezone'),
        ];

        $body = $params['body'] ?? [];

        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)->post($baseUrl.$endpoint, $body);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'status' => $response->status(),
            'body' => $response->body(),
        ];

    }
}

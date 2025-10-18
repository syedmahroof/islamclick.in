<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'apple_gsx' => [
        'base_url' => env('APPLE_GSX_BASE_URL', 'https://gsxapi.apple.com'),
        'sold_to' => env('APPLE_SOLD_TO'),
        'service_version' => env('APPLE_SERVICE_VERSION', '1.0'),
        'ship_to' => env('APPLE_SHIP_TO'),
        'operator_user_id' => env('APPLE_OPERATOR_USER_ID'),
        'client_locale' => env('APPLE_CLIENT_LOCALE', 'en-US'),
        'client_timezone' => env('APPLE_CLIENT_TIMEZONE', 'UTC'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];

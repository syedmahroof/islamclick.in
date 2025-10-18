<?php

return [
    'only' => ['web.*', 'api.*'],
    'except' => ['telescope*', 'horizon*', 'ignition.*', 'sanctum.*'],
    'groups' => [
        'web' => ['web.*'],
        'api' => ['api.*'],
    ],
    'url' => env('APP_URL'),
    'routes_path' => base_path('routes'),
    'middleware' => ['web'],
    'base_url' => null,
    'default_parameters' => [],
];

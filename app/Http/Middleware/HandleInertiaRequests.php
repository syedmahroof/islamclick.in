<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;
use Override;
use Tighten\Ziggy\Ziggy;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    #[Override]
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    #[Override]
    public function share(Request $request): array
    {
        /** @var string $quote */
        $quote = Inspiring::quotes()->random();
        [$message, $author] = explode(' - ', $quote);
        
        // Get the authenticated user if available
        $user = $request->user();
        
        // Prepare user data to share
        $userData = $user ? [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin ?? false,
        ] : null;

        // Get Ziggy routes
        $ziggy = new Ziggy();
        
        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'inspiring' => [
                'message' => $message,
                'author' => $author,
            ],
            'auth' => [
                'user' => $userData,
            ],
            'ziggy' => function () use ($request, $ziggy) {
                return array_merge($ziggy->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}

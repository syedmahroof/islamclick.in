<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    /**
     * Display the About page.
     */
    public function about()
    {
        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Static/About', [
            'meta' => [
                'title' => 'About Us - Islamic Content',
                'description' => 'Learn more about our mission to provide authentic Islamic content and resources.',
            ],
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Display the Contact page.
     */
    public function contact()
    {
        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Static/Contact', [
            'meta' => [
                'title' => 'Contact Us - Islamic Content',
                'description' => 'Get in touch with us for questions, feedback, or support.',
            ],
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Display the Privacy Policy page.
     */
    public function privacy()
    {
        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Static/Privacy', [
            'meta' => [
                'title' => 'Privacy Policy - Islamic Content',
                'description' => 'Our privacy policy explains how we collect, use, and protect your information.',
            ],
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Display the Terms and Conditions page.
     */
    public function terms()
    {
        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Static/Terms', [
            'meta' => [
                'title' => 'Terms and Conditions - Islamic Content',
                'description' => 'Terms and conditions for using our Islamic content platform.',
            ],
            'navigationCategories' => $navigationCategories,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Media;
use App\Models\Subcategory;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends \App\Http\Controllers\Controller
{
    /**
     * Display the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get basic statistics
        $stats = [
            'articles' => [
                'total' => Article::count(),
                'published' => Article::published()->count(),
                'drafts' => Article::draft()->count(),
            ],
            'categories' => [
                'total' => Category::count(),
            ],
            'tags' => [
                'total' => Tag::count(),
            ],
            'users' => [
                'total' => User::count(),
                'new_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            ],
            'media' => [
                'total' => Media::count(),
                'total_size' => Media::sum('size'),
            ],
        ];

        // Get recent activity
        $recentActivities = [
            'articles' => Article::with('author')
                ->latest()
                ->take(5)
                ->get()
                ->map(function($article) {
                    return [
                        'id' => $article->id,
                        'title' => $article->title,
                        'author' => $article->author->name,
                        'created_at' => $article->created_at->diffForHumans(),
                        'status' => $article->status,
                    ];
                }),
            'users' => User::latest()
                ->take(5)
                ->get()
                ->map(function($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at->diffForHumans(),
                    ];
                }),
        ];

        return Inertia::render('Admin/dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'chartData' => $this->getChartData(),
        ]);
    }
    /**
     * Get dashboard statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * Get chart data for the dashboard.
     *
     * @return array
     */
    protected function getChartData(): array
    {
        $data = [];
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subMonths(6);
        
        // Generate monthly data for the last 6 months
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $month = $currentDate->format('M');
            
            $data[] = [
                'name' => $month,
                'articles' => Article::whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->count(),
                'users' => User::whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->count(),
            ];
            
            $currentDate->addMonth();
        }
        
        return $data;
    }
    
    /**
     * Get dashboard statistics via API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());
        
        // Basic counts
        $stats = [
            'total_articles' => Article::count(),
            'total_categories' => Category::count(),
            'total_subcategories' => Subcategory::count(),
            'total_authors' => Author::count(),
            'total_media' => Media::count(),
            'total_tags' => Tag::count(),
        ];
        
        // Article statistics
        $stats['articles'] = [
            'published' => Article::published()->count(),
            'drafts' => Article::draft()->count(),
            'featured' => Article::featured()->count(),
            'recent' => Article::where('created_at', '>=', now()->subDays(7))->count(),
        ];
        
        // Media statistics
        $stats['media'] = [
            'total_size' => Media::sum('size'),
            'by_type' => Media::selectRaw('mime_type, COUNT(*) as count')
                ->groupBy('mime_type')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->pluck('count', 'mime_type'),
        ];
        
        // Recent activities (last 10)
        $recentActivities = [];
        
        // Get recent articles
        $recentArticles = Article::with('author')
            ->latest()
            ->limit(5)
            ->get(['id', 'title', 'author_id', 'created_at']);
            
        foreach ($recentArticles as $article) {
            $recentActivities[] = [
                'type' => 'article',
                'title' => $article->title,
                'author' => $article->author?->name,
                'date' => $article->created_at->format('Y-m-d H:i:s'),
                'url' => route('admin.articles.edit', $article->id),
            ];
        }
        
        // Get recent media
        $recentMedia = Media::latest()
            ->limit(5)
            ->get(['id', 'name', 'mime_type', 'created_at']);
            
        foreach ($recentMedia as $media) {
            $recentActivities[] = [
                'type' => 'media',
                'title' => $media->name,
                'mime_type' => $media->mime_type,
                'date' => $media->created_at->format('Y-m-d H:i:s'),
                'url' => route('admin.media.edit', $media->id),
            ];
        }
        
        // Sort activities by date
        usort($recentActivities, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        $stats['recent_activities'] = array_slice($recentActivities, 0, 10);
        
        // Article views trend (last 30 days)
        $viewsTrend = [];
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        
        // If the date range is more than 30 days, group by week, otherwise by day
        if ($start->diffInDays($end) > 30) {
            $current = $start->copy()->startOfWeek();
            
            while ($current <= $end) {
                $weekEnd = $current->copy()->endOfWeek();
                $weekRange = $current->format('M j') . ' - ' . $weekEnd->format('M j');
                
                $viewsTrend[] = [
                    'date' => $weekRange,
                    'views' => 0, // Replace with actual views if you have a views tracking system
                    'articles' => Article::whereBetween('created_at', [
                        $current->toDateTimeString(),
                        $weekEnd->toDateTimeString()
                    ])->count(),
                ];
                
                $current->addWeek();
            }
        } else {
            $current = $start->copy();
            
            while ($current <= $end) {
                $viewsTrend[] = [
                    'date' => $current->format('M j'),
                    'views' => 0, // Replace with actual views if you have a views tracking system
                    'articles' => Article::whereDate('created_at', $current->toDateString())->count(),
                ];
                
                $current->addDay();
            }
        }
        
        $stats['views_trend'] = $viewsTrend;
        
        return response()->json([
            'data' => $stats,
            'meta' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}

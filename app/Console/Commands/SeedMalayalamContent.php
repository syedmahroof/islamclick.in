<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\MalayalamIslamicArticleSeeder;

class SeedMalayalamContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:malayalam-content {--fresh : Clear existing articles before seeding}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with Malayalam Islamic content (100 articles per category)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('fresh')) {
            $this->info('Clearing existing articles...');
            \App\Models\Article::truncate();
        }

        $this->info('Seeding Malayalam Islamic content...');
        
        $seeder = new MalayalamIslamicArticleSeeder();
        $seeder->run();
        
        $this->info('✅ Malayalam Islamic content seeded successfully!');
        
        // Show statistics
        $totalArticles = \App\Models\Article::count();
        $this->info("📊 Total Articles: {$totalArticles}");
        
        $this->info('📋 Articles by Category:');
        foreach (\App\Models\Category::withCount('articles')->get() as $category) {
            $this->line("  • {$category->name}: {$category->articles_count}");
        }
    }
}

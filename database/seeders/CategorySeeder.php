<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'കുറ്ആൻ പഠനം',
                'slug' => 'quran-study',
                'description' => 'കുറ്ആനിലെ വെയ്യാത്തങ്ങളും അവയുടെ വ്യാഖ്യാനങ്ങളും പഠിക്കാം',
                'is_active' => true,
            ],
            [
                'name' => 'ഹദീസ് പഠനം',
                'slug' => 'hadith-study',
                'description' => 'പ്രവാചകന്റെ വചനങ്ങളും ജീവിതചരിത്രവും',
                'is_active' => true,
            ],
            [
                'name' => 'ഇസ്ലാമിക ചരിത്രം',
                'slug' => 'islamic-history',
                'description' => 'ഇസ്ലാമിക ചരിത്രവും മുസ്‌ലിം സാമ്രാജ്യങ്ങളും',
                'is_active' => true,
            ],
            [
                'name' => 'ഫിഖ്',
                'slug' => 'fiqh',
                'description' => 'ഇസ്ലാമിക നിയമങ്ങളും വിധികളും',
                'is_active' => true,
            ],
            [
                'name' => 'ആക്ക്ദാഹ്',
                'slug' => 'aqeedah',
                'description' => 'ഇസ്ലാമിക വിശ്വാസങ്ങളും തിയോളജിയും',
                'is_active' => true,
            ],
            [
                'name' => 'തസ്വീഫ്',
                'slug' => 'tasawwuf',
                'description' => 'ആത്മീക പുരോഗതിയും ധ്യാനവും',
                'is_active' => true,
            ],
            [
                'name' => 'അല്ലാഹുവിനെ പറ്റി',
                'slug' => 'about-allah',
                'description' => 'അല്ലാഹുവിന്റെ പേരുകളും ഗുണങ്ങളും',
                'is_active' => true,
            ],
            [
                'name' => 'പ്രവാചകന്റെ ജീവിതം',
                'slug' => 'prophet-life',
                'description' => 'പ്രവാചക മുഹമ്മദ് (സ) ന്റെ ജീവിതവും സുന്നഹും',
                'is_active' => true,
            ],
            [
                'name' => 'ഇസ്ലാമിക സാഹിത്യം',
                'slug' => 'islamic-literature',
                'description' => 'ഇസ്ലാമിക കവിതകളും സാഹിത്യകൃതികളും',
                'is_active' => true,
            ],
            [
                'name' => 'നൂതന ചോദ്യങ്ങൾ',
                'slug' => 'contemporary-issues',
                'description' => 'നൂതന സാഹചര്യങ്ങളിലെ ഇസ്ലാമിക കാഴ്ചപ്പാടുകൾ',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}

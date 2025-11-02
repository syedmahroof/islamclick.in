<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;

class SubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quranCategory = Category::where('slug', 'quran-study')->first();
        $hadithCategory = Category::where('slug', 'hadith-study')->first();
        $historyCategory = Category::where('slug', 'islamic-history')->first();
        $fiqhCategory = Category::where('slug', 'fiqh')->first();
        $aqeedahCategory = Category::where('slug', 'aqeedah')->first();

        $subcategories = [
            // കുറ്ആൻ പഠനം subcategories
            [
                'category_id' => $quranCategory->id,
                'name' => 'സൂറത്ത് അൽ-ബഖറ',
                'slug' => 'surah-al-baqarah',
                'description' => 'കുറ്ആനിലെ ഏറ്റവും നീളമുള്ള സൂറത്ത്',
                'is_active' => true,
            ],
            [
                'category_id' => $quranCategory->id,
                'name' => 'സൂറത്ത് അൽ-ഫാത്തിഹ',
                'slug' => 'surah-al-fatihah',
                'description' => 'കുറ്ആനിലെ ആദ്യ സൂറത്ത്',
                'is_active' => true,
            ],
            [
                'category_id' => $quranCategory->id,
                'name' => 'യാസീൻ',
                'slug' => 'surah-yaseen',
                'description' => 'കുറ്ആനിലെ ഹൃദയം',
                'is_active' => true,
            ],
            [
                'category_id' => $quranCategory->id,
                'name' => 'അൽ-മുൽക്ക്',
                'slug' => 'surah-al-mulk',
                'description' => 'രാജ്യത്തിന്റെ സൂറത്ത്',
                'is_active' => true,
            ],

            // ഹദീസ് പഠനം subcategories
            [
                'category_id' => $hadithCategory->id,
                'name' => 'സഹീഹ് അൽ-ബുഖാരി',
                'slug' => 'sahih-al-bukhari',
                'description' => 'സഹീഹ് ഹദീസ് സമാഹാരം',
                'is_active' => true,
            ],
            [
                'category_id' => $hadithCategory->id,
                'name' => 'സഹീഹ് മുസ്ലിം',
                'slug' => 'sahih-muslim',
                'description' => 'സഹീഹ് ഹദീസ് സമാഹാരം',
                'is_active' => true,
            ],
            [
                'category_id' => $hadithCategory->id,
                'name' => 'സുന്നൻ അബൂ ദാവൂദ്',
                'slug' => 'sunan-abu-dawud',
                'description' => 'ഹദീസ് സമാഹാരം',
                'is_active' => true,
            ],

            // ഇസ്ലാമിക ചരിത്രം subcategories
            [
                'category_id' => $historyCategory->id,
                'name' => 'ഖലീഫാക്കളുടെ കാലം',
                'slug' => 'caliphs-era',
                'description' => 'റശീദീൻ ഖലീഫാക്കളുടെ കാലം',
                'is_active' => true,
            ],
            [
                'category_id' => $historyCategory->id,
                'name' => 'ഉമയ്യദ് കാലം',
                'slug' => 'umayyad-era',
                'description' => 'ഉമയ്യദ് സാമ്രാജ്യത്തിന്റെ കാലം',
                'is_active' => true,
            ],
            [
                'category_id' => $historyCategory->id,
                'name' => 'അബ്ബാസീദ് കാലം',
                'slug' => 'abbasid-era',
                'description' => 'അബ്ബാസീദ് സാമ്രാജ്യത്തിന്റെ കാലം',
                'is_active' => true,
            ],

            // ഫിഖ് subcategories
            [
                'category_id' => $fiqhCategory->id,
                'name' => 'നമസ്‌കാരം',
                'slug' => 'salah',
                'description' => 'നമസ്‌കാരത്തെ കുറിച്ച്',
                'is_active' => true,
            ],
            [
                'category_id' => $fiqhCategory->id,
                'name' => 'സകാത്ത്',
                'slug' => 'zakat',
                'description' => 'സകാത്തിനെ കുറിച്ച്',
                'is_active' => true,
            ],
            [
                'category_id' => $fiqhCategory->id,
                'name' => 'ഹജ്',
                'slug' => 'hajj',
                'description' => 'ഹജ് പ്രവർത്തനങ്ങൾ',
                'is_active' => true,
            ],
            [
                'category_id' => $fiqhCategory->id,
                'name' => 'നോമ്പ്',
                'slug' => 'fasting',
                'description' => 'റമളാൻ നോമ്പ്',
                'is_active' => true,
            ],

            // ആക്ക്ദാഹ് subcategories
            [
                'category_id' => $aqeedahCategory->id,
                'name' => 'തൗഹീദ്',
                'slug' => 'tawheed',
                'description' => 'അല്ലാഹുവിന്റെ ഏകത',
                'is_active' => true,
            ],
            [
                'category_id' => $aqeedahCategory->id,
                'name' => 'റിസാലത്ത്',
                'slug' => 'risalah',
                'description' => 'പ്രവാചകത്വം',
                'is_active' => true,
            ],
            [
                'category_id' => $aqeedahCategory->id,
                'name' => 'ആഖിറത്ത്',
                'slug' => 'akhirah',
                'description' => 'അന്ത്യദിനം',
                'is_active' => true,
            ],
        ];

        foreach ($subcategories as $subcategory) {
            Subcategory::updateOrCreate(
                ['slug' => $subcategory['slug']],
                $subcategory
            );
        }
    }
}

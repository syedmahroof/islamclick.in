<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::where('role', 'admin')->first() ?? User::first();

        $posts = [
            // കുറ്ആൻ പഠനം posts
            [
                'title' => 'സൂറത്ത് അൽ-ഫാത്തിഹയുടെ മഹത്ത്വം',
                'excerpt' => 'കുറ്ആനിലെ ഏറ്റവും പ്രധാനപ്പെട്ട സൂറത്ത്',
                'content' => 'സൂറത്ത് അൽ-ഫാത്തിഹ ഇസ്ലാമിലെ ഏറ്റവും പ്രധാനപ്പെട്ട സൂറത്തുകളിലൊന്നാണ്. ഇത് കുറ്ആനിലെ ആദ്യ സൂറത്തും എല്ലാ നമസ്‌കാരത്തിലും വായിക്കേണ്ടതുമാണ്.',
                'category_id' => Category::where('slug', 'quran-study')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'surah-al-fatihah')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            [
                'title' => 'സൂറത്ത് അൽ-ബഖറ: വിവരണവും പഠനവും',
                'excerpt' => 'കുറ്ആനിലെ ഏറ്റവും നീളമുള്ള സൂറത്തിനെക്കുറിച്ച്',
                'content' => 'സൂറത്ത് അൽ-ബഖറ 286 വേയ്യാത്തങ്ങൾ ഉൾക്കൊള്ളുന്നു. ഇതിൽ പല വിഷയങ്ങളും ഉൾപ്പെടുന്നു. ഇസ്ലാമിക ചരിത്രം, നിയമങ്ങൾ, കഥകൾ എന്നിവ ഇതിൽ ഉണ്ട്.',
                'category_id' => Category::where('slug', 'quran-study')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'surah-al-baqarah')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            [
                'title' => 'യാസീൻ സൂറത്തിന്റെ അർത്ഥവും മഹത്ത്വവും',
                'excerpt' => 'കുറ്ആനിലെ ഹൃദയമായ യാസീൻ',
                'content' => 'യാസീൻ സൂറത്ത് ഇസ്ലാമിലെ വളരെ പ്രധാനപ്പെട്ട സൂറത്തുകളിലൊന്നാണ്. പ്രവാചകൻ (സ) ഇതിനെ കുറ്ആനിന്റെ ഹൃദയം എന്ന് വിളിച്ചിട്ടുണ്ട്.',
                'category_id' => Category::where('slug', 'quran-study')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'surah-yaseen')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            // ഹദീസ് posts
            [
                'title' => 'സഹീഹ് അൽ-ബുഖാരിയുടെ പ്രാധാന്യം',
                'excerpt' => 'ഏറ്റവും വിശ്വസനീയമായ ഹദീസ് സമാഹാരം',
                'content' => 'സഹീഹ് അൽ-ബുഖാരി ഇമാം ബുഖാരി സമാഹരിച്ച ഏറ്റവും വിശ്വസനീയമായ ഹദീസ് സമാഹാരമാണ്. ഇതിൽ 7563 ഹദീസുകൾ അടങ്ങിയിരിക്കുന്നു.',
                'category_id' => Category::where('slug', 'hadith-study')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'sahih-al-bukhari')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            [
                'title' => 'പ്രവാചകന്റെ സുന്നത്ത്',
                'excerpt' => 'പ്രവാചക മുഹമ്മദ് (സ) ന്റെ ജീവിതരീതി',
                'content' => 'പ്രവാചക മുഹമ്മദ് (സ) ന്റെ സുന്നത്ത് മുസ്‌ലിംകൾക്ക് ഒരു മാതൃകയാണ്. അദ്ദേഹത്തിന്റെ ജീവിതരീതിയും പ്രവൃത്തികളും നമ്മുടെ മാർഗദർശനമാണ്.',
                'category_id' => Category::where('slug', 'prophet-life')->first()->id,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            // ഫിഖ് posts
            [
                'title' => 'നമസ്‌കാരത്തിന്റെ രീതികൾ',
                'excerpt' => 'ശരിയായ നമസ്‌കാരം എങ്ങനെ നിർവഹിക്കാം',
                'content' => 'നമസ്‌കാരം ഇസ്ലാമിലെ അഞ്ച് തൂണുകളിലൊന്നാണ്. ശരിയായ രീതിയിൽ നമസ്‌കാരം നിർവഹിക്കുന്നത് ഏറ്റവും പ്രധാനമാണ്.',
                'category_id' => Category::where('slug', 'fiqh')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'salah')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            [
                'title' => 'റമളാൻ നോമ്പിന്റെ പ്രാധാന്യം',
                'excerpt' => 'പുണ്യമാസമായ റമളാനിലെ നോമ്പ്',
                'content' => 'റമളാൻ മാസത്തിലെ നോമ്പ് ഇസ്ലാമിലെ അഞ്ച് തൂണുകളിലൊന്നാണ്. ഈ മാസം തീരുമാനത്തിന്റെ മാസമാണ്. മുസ്‌ലിംകൾ ഈ മാസത്തിൽ നോമ്പ് നിർവഹിക്കണം.',
                'category_id' => Category::where('slug', 'fiqh')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'fasting')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            [
                'title' => 'സകാത്തിന്റെ കാര്യങ്ങൾ',
                'excerpt' => 'സമ്പത്തിന്റെ ദാനമായ സകാത്ത്',
                'content' => 'സകാത്ത് ഇസ്ലാമിലെ അഞ്ച് തൂണുകളിലൊന്നാണ്. ഒരാളുടെ സമ്പത്തിൽ നിന്ന് കാലാവധി തികഞ്ഞാൽ നിശ്ചിത ശതമാനം ദാനം ചെയ്യേണ്ടതാണ്.',
                'category_id' => Category::where('slug', 'fiqh')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'zakat')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            // ആക്ക്ദാഹ് posts
            [
                'title' => 'തൗഹീദിന്റെ അടിസ്ഥാനം',
                'excerpt' => 'അല്ലാഹുവിന്റെ ഏകതയെക്കുറിച്ച്',
                'content' => 'തൗഹീദ് എന്നത് അല്ലാഹുവിനെ മാത്രം ആരാധിക്കണമെന്നതാണ്. അല്ലാഹു ഒരുവനാണ്, അവന്ന് കൂട്ടാളികളില്ല. ഇതാണ് ഇസ്ലാമിന്റെ അടിസ്ഥാനം.',
                'category_id' => Category::where('slug', 'aqeedah')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'tawheed')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
            // ചരിത്രം posts
            [
                'title' => 'റശീദീൻ ഖലീഫാക്കളുടെ കാലം',
                'excerpt' => 'ഇസ്ലാമിക ചരിത്രത്തിലെ പൊൻകാലം',
                'content' => 'റശീദീൻ ഖലീഫാക്കളുടെ കാലം ഇസ്ലാമിക ചരിത്രത്തിലെ ഏറ്റവും പ്രധാനപ്പെട്ട കാലഘട്ടമാണ്. അബൂ ബക്കർ, ഉമർ, ഉസ്മാൻ, അലി എന്നിവരായിരുന്നു റശീദീൻ ഖലീഫാക്കൾ.',
                'category_id' => Category::where('slug', 'islamic-history')->first()->id,
                'subcategory_id' => Subcategory::where('slug', 'caliphs-era')->first()->id ?? null,
                'is_published' => true,
                'views' => rand(100, 1000),
            ],
        ];

        // Get all categories and subcategories
        $allCategories = Category::where('is_active', true)->get();
        $allSubcategories = Subcategory::where('is_active', true)->get();

        // Malayalam post titles for generating more posts
        $malayalamTitles = [
            'കുറ്ആനിലെ അത്ഭുതങ്ങൾ', 'ഹദീസുകളുടെ പഠനം', 'പ്രവാചകന്റെ സുന്നത്ത്',
            'ഇസ്ലാമിക മൂല്യങ്ങൾ', 'ആത്മീക പുരോഗതി', 'നമസ്‌കാരത്തിന്റെ രീതി',
            'സകാത്തിന്റെ പ്രാധാന്യം', 'ഹജ് പ്രവർത്തനങ്ങൾ', 'റമളാന്റെ മഹത്ത്വം',
            'തൗഹീദിന്റെ അടിസ്ഥാനം', 'റിസാലത്തിന്റെ അർത്ഥം', 'ആഖിറത്തിലെ വിശ്വാസം',
            'അല്ലാഹുവിന്റെ പേരുകൾ', 'അല്ലാഹുവിന്റെ ഗുണങ്ങൾ', 'പ്രാർത്ഥനയുടെ പ്രാധാന്യം',
            'ദുആയുടെ മഹത്ത്വം', 'സബർ ചെയ്യുന്നതിന്റെ പ്രാധാന്യം', 'ഷുക്ര് ചെയ്യുന്നതിന്റെ അർത്ഥം',
            'ഇഖ്ലാസിന്റെ അർത്ഥം', 'തവാക്ക്കുൽ ചെയ്യൽ', 'ഇഹ്‌സാനിന്റെ പ്രാധാന്യം',
        ];

        $malayalamContents = [
            'ഇസ്ലാം മതത്തിലെ ഈ വിഷയം വളരെ പ്രധാനപ്പെട്ടതാണ്. മുസ്‌ലിംകൾ ഇത് നന്നായി പഠിക്കേണ്ടതാണ്.',
            'പ്രവാചക മുഹമ്മദ് (സ) ഈ വിഷയത്തെക്കുറിച്ച് വിശദമായി വിശദീകരിച്ചിട്ടുണ്ട്.',
            'കുറ്ആനും സുന്നഹും ഈ വിഷയത്തെക്കുറിച്ച് വ്യക്തമായ മാർഗദർശനം നൽകുന്നു.',
            'ഈ വിഷയം മുസ്‌ലിംകളുടെ ദൈനംദിന ജീവിതവുമായി നേരിട്ട് ബന്ധപ്പെട്ടിരിക്കുന്നു.',
            'ഇസ്ലാമിക പണ്ഡിതന്മാർ ഈ വിഷയത്തെക്കുറിച്ച് വിശദമായി എഴുതിയിട്ടുണ്ട്.',
            'ഈ വിഷയത്തിന്റെ പഠനം മുസ്‌ലിംകൾക്ക് ആത്മീക പുരോഗതിയിലേക്ക് നയിക്കുന്നു.',
            'അല്ലാഹു താആല ഈ വിഷയത്തെക്കുറിച്ച് കുറ്ആനിൽ വിവരിച്ചിട്ടുണ്ട്.',
            'പ്രവാചകന്റെ വചനങ്ങളിലും ഇതിനെക്കുറിച്ച് വിവരങ്ങൾ ലഭ്യമാണ്.',
            'ഈ വിഷയം മുസ്‌ലിം സമൂഹത്തിന് വളരെ പ്രാധാന്യമുള്ളതാണ്.',
            'ഇസ്ലാമിക വിജ്ഞാനത്തിൽ ഈ വിഷയത്തിന് പ്രത്യേക സ്ഥാനമുണ്ട്.',
        ];

        // Create 100 posts
        for ($i = 0; $i < 100; $i++) {
            $category = $allCategories->random();
            $categorySubcategories = $allSubcategories->where('category_id', $category->id);
            $subcategory = ($categorySubcategories->count() > 0 && rand(0, 1)) 
                ? $categorySubcategories->random() 
                : null;
            
            $title = $malayalamTitles[array_rand($malayalamTitles)] . ' - ഭാഗം ' . ($i + 1);
            $content = $malayalamContents[array_rand($malayalamContents)];
            
            // Add more detailed content
            $detailedContent = $content . "\n\n" . 
                'ഈ വിഷയത്തെക്കുറിച്ച് കൂടുതൽ വിവരങ്ങൾ പഠിക്കണമെങ്കിൽ ഇസ്ലാമിക പുസ്തകങ്ങൾ പഠിക്കാം. ' .
                'കുറ്ആനും സുന്നഹും നമ്മുടെ മാർഗദർശനമാണ്. ' .
                'പ്രവാചക മുഹമ്മദ് (സ) ന്റെ ജീവിതവും വചനങ്ങളും നമ്മുടെ മാതൃകയാണ്. ' .
                'ഇസ്ലാമിക പണ്ഡിതന്മാരുടെ രചനകൾ പഠിക്കുന്നത് നമ്മുടെ അറിവ് വർധിപ്പിക്കും.';

            Post::create([
                'user_id' => $adminUser->id,
                'category_id' => $category->id,
                'subcategory_id' => $subcategory?->id,
                'title' => $title,
                'slug' => \Illuminate\Support\Str::slug($title . '-' . ($i + 1)),
                'excerpt' => $malayalamContents[array_rand($malayalamContents)],
                'content' => $detailedContent,
                'is_published' => true,
                'views' => rand(50, 2000),
                'published_at' => Carbon::now()->subDays(rand(0, 365)),
            ]);
        }

        // Add the predefined posts
        foreach ($posts as $index => $post) {
            Post::create([
                'user_id' => $adminUser->id,
                'title' => $post['title'],
                'slug' => \Illuminate\Support\Str::slug($post['title']) . '-' . ($index + 1),
                'excerpt' => $post['excerpt'],
                'content' => $post['content'],
                'category_id' => $post['category_id'],
                'subcategory_id' => $post['subcategory_id'] ?? null,
                'is_published' => $post['is_published'],
                'views' => $post['views'],
                'published_at' => Carbon::now()->subDays(rand(0, 365)),
            ]);
        }
    }
}

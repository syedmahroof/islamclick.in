<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;
    
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
        // Create an admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole($adminRole);
        
        $this->actingAs($this->admin);
    }

    /** @test */
    public function it_can_create_a_category()
    {
        $response = $this->post(route('admin.categories.store'), [
            'name' => 'Test Category',
            'en_name' => 'Test Category',
            'slug' => 'test-category',
            'description' => 'Test description',
            'is_active' => true,
            'order' => 1,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', ['name' => 'Test Category']);
    }

    /** @test */
    public function it_requires_name_and_slug()
    {
        $response = $this->post(route('admin.categories.store'), []);

        $response->assertStatus(302); // Should redirect back with errors
        $response->assertSessionHasErrors(['name', 'en_name']);
    }

    /** @test */
    public function it_can_update_a_category()
    {
        $category = \App\Models\Category::factory()->create();

        $response = $this->put(route('admin.categories.update', $category->id), [
            'name' => 'Updated Category',
            'en_name' => 'Updated Category',
            'slug' => 'updated-category',
            'description' => 'Updated description',
            'is_active' => false,
            'order' => 2,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
            'is_active' => 0,
        ]);
    }

    /** @test */
    public function it_can_delete_a_category()
    {
        $category = \App\Models\Category::factory()->create();

        $response = $this->delete(route('admin.categories.destroy', $category->id));

        // The controller returns a redirect with status 302
        $response->assertStatus(302);
        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    /** @test */
    public function it_cannot_delete_category_with_children()
    {
        $parent = \App\Models\Category::factory()->create();
        $child = \App\Models\Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->delete(route('admin.categories.destroy', $parent->id));

        // The controller returns a redirect with status 302 and an error message
        $response->assertStatus(302);
        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', ['id' => $parent->id]);
    }

    /** @test */
    public function it_can_toggle_category_status()
    {
        $category = \App\Models\Category::factory()->create(['is_active' => true]);

        $response = $this->put(route('admin.categories.update', $category->id), [
            'name' => $category->name,
            'en_name' => $category->en_name,
            'slug' => $category->slug,
            'is_active' => false,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'is_active' => 0,
        ]);
    }
}

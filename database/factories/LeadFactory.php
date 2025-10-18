<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Lead::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'company' => $this->faker->company,
            'title' => $this->faker->jobTitle,
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost']),
            'source_id' => 1, // Assuming there's at least one source
            'priority_id' => 1, // Assuming there's at least one priority
            'agent_id' => User::factory(),
            'created_by' => 1, // Assuming user with ID 1 exists
            'updated_by' => 1, // Assuming user with ID 1 exists
            'converted_at' => $this->faker->optional(0.3)->dateTimeThisYear(),
            'lost_reason' => $this->faker->optional(0.2)->sentence,
            'lost_at' => $this->faker->optional(0.1)->dateTimeThisYear(),
            'won_at' => $this->faker->optional(0.1)->dateTimeThisYear(),
            'expected_close_date' => $this->faker->dateTimeBetween('now', '+3 months'),
            'value' => $this->faker->randomFloat(2, 1000, 100000),
            'currency' => 'USD',
            'notes' => $this->faker->optional()->paragraph,
            'is_public' => $this->faker->boolean(80), // 80% chance of being public
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\LeadAgent;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Create manager user
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $manager->assignRole('manager');

        // Create agent users
        $agents = [
            [
                'name' => 'Agent One',
                'email' => 'agent1@example.com',
            ],
            [
                'name' => 'Agent Two',
                'email' => 'agent2@example.com',
            ],
            [
                'name' => 'Agent Three',
                'email' => 'agent3@example.com',
            ],
        ];

        foreach ($agents as $agentData) {
            $user = User::firstOrCreate(
                ['email' => $agentData['email']],
                [
                    'name' => $agentData['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            
            // Assign agent role
            $user->assignRole('agent');
            
            // Create lead agent record
            LeadAgent::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'is_active' => true,
                    'leads_count' => 0,
                    'converted_leads_count' => 0,
                ]
            );
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin Login: admin@example.com / password');
        $this->command->info('Manager Login: manager@example.com / password');
        $this->command->info('Agents Login: agent1@example.com, agent2@example.com, agent3@example.com / password');
    }
}

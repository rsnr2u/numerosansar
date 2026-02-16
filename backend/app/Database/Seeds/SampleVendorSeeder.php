<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SampleVendorSeeder extends Seeder
{
    public function run()
    {
        $userData = [
            [
                'username' => 'astro_jane',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'numerologist',
                'full_name' => 'Jane Smith',
                'email' => 'jane@astroinsights.com',
                'mobile' => '+91 98765 43210',
                'business_name' => 'Astro Insights',
                'city' => 'Mumbai'
            ],
            [
                'username' => 'vibe_master',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'numerologist',
                'full_name' => 'Master K',
                'email' => 'contact@vibemaster.in',
                'mobile' => '+91 88888 77777',
                'business_name' => 'Vibrational Mastery',
                'city' => 'Delhi'
            ],
            [
                'username' => 'quantum_num',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'numerologist',
                'full_name' => 'Dr. Aris',
                'email' => 'dr.aris@quantumnum.com',
                'mobile' => '+91 77776 66665',
                'business_name' => 'Quantum Numerology',
                'city' => 'Bangalore'
            ]
        ];

        foreach ($userData as $user) {
            if ($this->db->table('users')->where('username', $user['username'])->get()->getRow()) {
                continue;
            }
            $this->db->table('users')->insert($user);
            $userId = $this->db->insertID();

            // Add Subscription (Random mix of Starter/Pro)
            $planId = ($userId % 2 == 0) ? 2 : 1;
            $this->db->table('subscriptions')->insert([
                'user_id' => $userId,
                'plan_id' => $planId,
                'billing_cycle' => 'monthly',
                'status' => 'active',
                'starts_at' => date('Y-m-d H:i:s'),
                'ends_at' => date('Y-m-d H:i:s', strtotime('+1 month'))
            ]);

            // Add Sample Clients for each vendor
            for ($i = 1; $i <= 3; $i++) {
                $this->db->table('clients')->insert([
                    'user_id' => $userId,
                    'full_name' => "Client $i of " . $user['full_name'],
                    'calling_name' => "Name $i",
                    'dob' => date('Y-m-d', strtotime('-' . (20 + $i) . ' years')),
                    'mobile_number' => '900000000' . $i,
                    'city' => $user['city']
                ]);
            }
        }
    }
}

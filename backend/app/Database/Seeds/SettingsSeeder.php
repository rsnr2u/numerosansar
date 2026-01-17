<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // General
            ['setting_key' => 'site_title', 'setting_value' => 'Numerology Admin', 'setting_group' => 'general'],
            ['setting_key' => 'site_logo', 'setting_value' => '', 'setting_group' => 'general'], // URL to logo
            ['setting_key' => 'contact_email', 'setting_value' => 'admin@example.com', 'setting_group' => 'general'],

            // SEO
            ['setting_key' => 'meta_description', 'setting_value' => 'Advanced Numerology Calculator and Insights', 'setting_group' => 'seo'],
            ['setting_key' => 'meta_keywords', 'setting_value' => 'numerology, chaldean, pythagorean, calculator', 'setting_group' => 'seo'],

            // Social/Other
            ['setting_key' => 'facebook_url', 'setting_value' => '', 'setting_group' => 'social'],
            ['setting_key' => 'instagram_url', 'setting_value' => '', 'setting_group' => 'social'],
        ];

        // Insert or Ignore (to avoid overwriting changed settings on re-seed, but mostly for fresh install)
        // Using replace/insertBatch
        $this->db->table('settings')->ignore(true)->insertBatch($data);
    }
}

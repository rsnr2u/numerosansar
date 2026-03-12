<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class NumerologySeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();

        // 1. Numerology Letters (Chaldean & Pythagorean)
        $pythagorean = [
            1 => ['A', 'J', 'S'],
            2 => ['B', 'K', 'T'],
            3 => ['C', 'L', 'U'],
            4 => ['D', 'M', 'V'],
            5 => ['E', 'N', 'W'],
            6 => ['F', 'O', 'X'],
            7 => ['G', 'P', 'Y'],
            8 => ['H', 'Q', 'Z'],
            9 => ['I', 'R'],
        ];

        $chaldean = [
            1 => ['A', 'I', 'J', 'Q', 'Y'],
            2 => ['B', 'K', 'R'],
            3 => ['C', 'G', 'L', 'S'],
            4 => ['D', 'M', 'T'],
            5 => ['E', 'H', 'N', 'X'],
            6 => ['U', 'V', 'W'],
            7 => ['O', 'Z'],
            8 => ['F', 'P'],
        ];

        $all_letters = range('A', 'Z');
        $letter_data = [];

        foreach ($all_letters as $letter) {
            $p_val = 0;
            foreach ($pythagorean as $val => $letters) {
                if (in_array($letter, $letters)) {
                    $p_val = $val;
                    break;
                }
            }

            $c_val = 0;
            foreach ($chaldean as $val => $letters) {
                if (in_array($letter, $letters)) {
                    $c_val = $val;
                    break;
                }
            }

            $letter_data[] = [
                'letter' => $letter,
                'pythagorean_number' => $p_val,
                'chaldean_number' => $c_val,
                'numerology_number' => $c_val, // Placeholder: using Chaldean for now
            ];
        }

        $db->table('numerology_letters')->emptyTable();
        $db->table('numerology_letters')->insertBatch($letter_data);

        // 2. Numerology Planets
        $planets = [
            ['number' => 1, 'planet_name' => 'Sun'],
            ['number' => 2, 'planet_name' => 'Moon'],
            ['number' => 3, 'planet_name' => 'Jupiter'],
            ['number' => 4, 'planet_name' => 'Rahu (Uranus)'],
            ['number' => 5, 'planet_name' => 'Mercury'],
            ['number' => 6, 'planet_name' => 'Venus'],
            ['number' => 7, 'planet_name' => 'Ketu (Neptune)'],
            ['number' => 8, 'planet_name' => 'Saturn'],
            ['number' => 9, 'planet_name' => 'Mars'],
        ];
        $db->table('numerology_planets')->emptyTable();
        $db->table('numerology_planets')->insertBatch($planets);

        // 3. Compound Numbers Data
        $compound_data = [
            [
                'number' => 23,
                'title' => "The Royal Star of the Lion",
                'description' => "This is the number of the fortunate man; it promises the assistance and association of those of high rank; it promises success for one's own efforts through the help of others.",
                'result' => 'Super'
            ],
            [
                'number' => 18,
                'title' => "Spiritual Conflict",
                'description' => "18 is a number of spiritual upheavals and challenges. It often warns of deception by others.",
                'result' => 'Not Good'
            ]
        ];
        $db->table('compound_numbers')->emptyTable();
        $db->table('compound_numbers')->insertBatch($compound_data);

        // 4. Default Admin User
        $db->table('users')->where('username', 'admin')->delete();
        $admin_data = [
            'username' => 'admin',
            'password' => password_hash('admin123', PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];
        $db->table('users')->insert($admin_data);
    }
}

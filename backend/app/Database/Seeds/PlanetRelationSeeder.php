<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PlanetRelationSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'planet_number' => 1,
                'planet_name' => 'Sun',
                'friend_numbers' => '2,3,7,9',
                'enemy_numbers' => '6,8',
                'neutral_numbers' => '4,5',
            ],
            [
                'planet_number' => 2,
                'planet_name' => 'Moon',
                'friend_numbers' => '1,3,7',
                'enemy_numbers' => '4,8,9',
                'neutral_numbers' => '5,6',
            ],
            [
                'planet_number' => 3,
                'planet_name' => 'Jupiter',
                'friend_numbers' => '1,2,7,9',
                'enemy_numbers' => '6',
                'neutral_numbers' => '4,5,8',
            ],
            [
                'planet_number' => 4,
                'planet_name' => 'Rahu',
                'friend_numbers' => '1,5,6,7,8',
                'enemy_numbers' => '2,9',
                'neutral_numbers' => '3',
            ],
            [
                'planet_number' => 5,
                'planet_name' => 'Mercury',
                'friend_numbers' => '4,6,7,8',
                'enemy_numbers' => '1,2,3,9',
                'neutral_numbers' => null, // Use null explicit if needed or just omission
            ],
            [
                'planet_number' => 6,
                'planet_name' => 'Venus',
                'friend_numbers' => '4,5,7,8',
                'enemy_numbers' => '1,2,3',
                'neutral_numbers' => '9',
            ],
            [
                'planet_number' => 7,
                'planet_name' => 'Ketu',
                'friend_numbers' => '1,2,3,4,5,6',
                'enemy_numbers' => '9',
                'neutral_numbers' => '8',
            ],
            [
                'planet_number' => 8,
                'planet_name' => 'Saturn',
                'friend_numbers' => '4,5,6,7',
                'enemy_numbers' => '1,2,9',
                'neutral_numbers' => '3',
            ],
            [
                'planet_number' => 9,
                'planet_name' => 'Mars',
                'friend_numbers' => '1,3',
                'enemy_numbers' => '2,4,7,8',
                'neutral_numbers' => '5,6',
            ],
        ];

        // Using Query Builder
        $this->db->table('numerology_planet_relations')->ignore(true)->insertBatch($data);
    }
}

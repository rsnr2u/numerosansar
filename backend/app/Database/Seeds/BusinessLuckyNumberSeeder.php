<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class BusinessLuckyNumberSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'sector_name' => 'Real Estate & Construction',
                'sector_name_telugu' => 'రియల్ ఎస్టేట్ & కన్స్ట్రక్షన్',
                'lucky_numbers' => '15, 24, 33, 42',
            ],
            [
                'sector_name' => 'Technology & Software',
                'sector_name_telugu' => 'టెక్నాలజీ & సాఫ్ట్వేర్',
                'lucky_numbers' => '19, 23, 37, 41',
            ],
            [
                'sector_name' => 'Hotel & Restaurant',
                'sector_name_telugu' => 'హోటల్ & రెస్టారెంట్',
                'lucky_numbers' => '15, 24, 33, 51',
            ],
            [
                'sector_name' => 'Education & Consultancy',
                'sector_name_telugu' => 'విద్య & కన్సల్టెన్సీ',
                'lucky_numbers' => '21, 27, 30, 45',
            ],
            [
                'sector_name' => 'Finance & Banking',
                'sector_name_telugu' => 'ఫైనాన్స్ & బ్యాంకింగ్',
                'lucky_numbers' => '19, 23, 37, 46',
            ],
        ];

        // Simple query
        $this->db->table('business_lucky_numbers')->insertBatch($data);
    }
}

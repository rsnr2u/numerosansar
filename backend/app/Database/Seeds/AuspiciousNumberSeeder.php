<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AuspiciousNumberSeeder extends Seeder
{
    public function run()
    {
        $rawMap = [
            1 => [10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100],
            2 => [7, 16, 25, 34, 43, 52, 70, 88],
            3 => [12, 21, 30, 39, 48, 57, 66, 75, 84, 93],
            4 => [10, 19, 31, 37, 46, 55, 64, 82, 91],
            5 => [14, 23, 32, 41, 50, 59, 77, 95],
            6 => [6, 15, 24, 33, 42, 51, 60, 69, 87, 96],
            7 => [16, 25, 34, 43, 52, 70, 88],
            8 => [17, 26, 35, 44, 53, 62, 80, 98],
            9 => [9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99]
        ];

        $data = [];
        foreach ($rawMap as $root => $numbers) {
            foreach ($numbers as $num) {
                $data[] = [
                    'root_number' => $root,
                    'number' => $num
                ];
            }
        }

        $this->db->table('auspicious_numbers')->emptyTable();
        $this->db->table('auspicious_numbers')->insertBatch($data);
    }
}

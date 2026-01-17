<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateClientMobileChecksSchema extends Migration
{
    public function up()
    {
        // 1. Drop old columns
        $this->forge->dropColumn('client_mobile_checks', [
            'chaldean_compound',
            'pythagorean_compound',
            'chaldean_root',
            'pythagorean_root',
            'result'
        ]);

        // 2. Add new columns
        $fields = [
            'Compound_number' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'total_number' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            't_result' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'last_4_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => '50', // Storing the digits (string) e.g. "8899"
                'null' => true,
            ],
            'l_result' => [
                'type' => 'TEXT',
                'null' => true,
            ],
        ];

        $this->forge->addColumn('client_mobile_checks', $fields);
    }

    public function down()
    {
        // Drop new columns
        $this->forge->dropColumn('client_mobile_checks', [
            'Compound_number',
            'total_number',
            't_result',
            'last_4_numbers',
            'l_result'
        ]);

        // Restore old columns (simplified, losing data is expected on down)
        $fields = [
            'chaldean_compound' => ['type' => 'INT', 'null' => true],
            'pythagorean_compound' => ['type' => 'INT', 'null' => true],
            'chaldean_root' => ['type' => 'INT', 'null' => true],
            'pythagorean_root' => ['type' => 'INT', 'null' => true],
            'result' => ['type' => 'TEXT', 'null' => true],
        ];
        $this->forge->addColumn('client_mobile_checks', $fields);
    }
}

<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateAuspiciousNumbersTableSchema extends Migration
{
    public function up()
    {
        $this->forge->dropColumn('auspicious_numbers', ['number', 'notes']);

        $this->forge->addColumn('auspicious_numbers', [
            'planet_name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'after' => 'root_number'
            ],
            'friend_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'planet_name'
            ],
            'enemy_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'friend_numbers'
            ],
            'neutral_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'enemy_numbers'
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('auspicious_numbers', ['planet_name', 'friend_numbers', 'enemy_numbers', 'neutral_numbers']);
        $this->forge->addColumn('auspicious_numbers', [
            'number' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
        ]);
    }
}

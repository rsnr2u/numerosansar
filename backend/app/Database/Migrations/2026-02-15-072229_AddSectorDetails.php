<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSectorDetails extends Migration
{
    public function up()
    {
        $this->forge->addColumn('business_lucky_numbers', [
            'primary_planet' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
                'after' => 'sector_name_telugu'
            ],
            'chaldean_targets' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
                'after' => 'primary_planet'
            ],
            'pythagorean_targets' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
                'after' => 'chaldean_targets'
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('business_lucky_numbers', ['primary_planet', 'chaldean_targets', 'pythagorean_targets']);
    }
}
